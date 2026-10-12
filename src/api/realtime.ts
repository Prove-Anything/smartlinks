// src/api/realtime.ts
import { request, post } from "../http"
import type {
  AblyTokenRequest,
  RealtimeTokenRequest,
  RealtimeChangeEvent,
  RealtimeChangeFilter,
  RealtimeMessage,
  RealtimeScope,
} from "../types/realtime"

/**
 * SmartLinks Realtime — live updates for apps (docs/realtime.md).
 *
 * Two kinds:
 * - **Change events** — "this changed, here's its id": products, proofs, app records, app installs…
 *   IDs only; refetch through the normal API (which applies the normal permissions).
 *   `realtime.onChange({ collectionId }, { type: 'record', recordType: 'entry' }, () => refetch())`
 * - **App channels** — messages your app sends, on channels it DECLARES in its manifest
 *   (`realtime.channels`, with who may subscribe and who may publish):
 *   `realtime.channel({ collectionId, appId }, 'draw').subscribe('status', (m) => …)`
 *
 * One connection per page and collection, shared by everything that listens; it opens on the first
 * listener and closes after the last. No provider library, keys or channel strings in your app —
 * SmartLinks hands out a subscribe-only stream for exactly what the viewer may see (anonymous viewers:
 * public channels), and `publish` goes through SmartLinks, which checks the channel's rule.
 */

type Listener = (msg: RealtimeMessage) => void

interface Granted { name: string; channel: string }
interface ConnectReply { transport: "sse" | "none"; url?: string; expiresAt?: number; channels: Granted[] }

/** One live stream per (collection, app): every listener on this page shares it. */
class Stream {
  private listeners = new Map<string, Set<Listener>>() // logical name ("draw", "feed:admin") → listeners
  private physical = new Map<string, string>() // physical channel → logical name
  private granted = new Set<string>()
  private source: EventSource | null = null
  private lastEvent: string | null = null
  private refreshTimer: ReturnType<typeof setTimeout> | null = null
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private pending: ReturnType<typeof setTimeout> | null = null
  private retries = 0
  private closed = false

  constructor(private collectionId: string, private appId: string | null, private onEmpty: () => void) {}

  add(name: string, listener: Listener): () => void {
    let set = this.listeners.get(name)
    const isNew = !set
    if (!set) this.listeners.set(name, (set = new Set()))
    set.add(listener)
    if (isNew || !this.source) this.schedule()
    return () => {
      const s = this.listeners.get(name)
      if (!s) return
      s.delete(listener)
      if (!s.size) this.listeners.delete(name)
      if (!this.listeners.size) this.close()
    }
  }

  /** What was granted (empty until connected). */
  has(name: string): boolean {
    return this.granted.has(name)
  }

  private schedule(delay = 30) {
    if (this.pending) clearTimeout(this.pending)
    this.pending = setTimeout(() => {
      this.pending = null
      void this.open()
    }, delay)
  }

  private async open() {
    if (this.closed || typeof EventSource === "undefined") return
    const names = [...this.listeners.keys()]
    const feeds = names.filter((n) => n.startsWith("feed:")).map((n) => n.slice(5))
    const channels = names.filter((n) => !n.startsWith("feed:"))
    let reply: ConnectReply
    try {
      reply = await post<ConnectReply>("/public/realtime/connect", {
        collectionId: this.collectionId,
        ...(this.appId ? { appId: this.appId } : {}),
        feeds,
        channels,
      })
    } catch (err) {
      return this.retryLater(err)
    }
    if (this.closed) return
    this.source?.close()
    this.source = null
    this.physical.clear()
    this.granted = new Set(reply.channels.map((c) => c.name))
    for (const c of reply.channels) this.physical.set(c.channel, c.name)
    if (reply.transport !== "sse" || !reply.url) return // nothing this viewer may see

    const url = this.lastEvent ? `${reply.url}&lastEvent=${encodeURIComponent(this.lastEvent)}` : reply.url
    const source = new EventSource(url)
    this.source = source
    source.addEventListener("message", (e) => this.deliver(e as MessageEvent))
    source.addEventListener("error", (e) => {
      const data = (e as MessageEvent).data
      // A stream error with a body (e.g. the token expired): get a fresh token and resume.
      if (data || source.readyState === EventSource.CLOSED) this.retryLater(data)
    })
    source.addEventListener("open", () => {
      this.retries = 0
    })
    // Renew a minute before the token expires (the stream can't renew its own token).
    if (this.refreshTimer) clearTimeout(this.refreshTimer)
    if (reply.expiresAt) {
      const ms = Math.max(10_000, reply.expiresAt - Date.now() - 60_000)
      this.refreshTimer = setTimeout(() => this.schedule(0), ms)
    }
  }

  private retryLater(_why: unknown) {
    if (this.closed) return
    this.source?.close()
    this.source = null
    if (this.retryTimer) clearTimeout(this.retryTimer)
    const ms = Math.min(30_000, 1000 * 2 ** this.retries++)
    this.retryTimer = setTimeout(() => this.schedule(0), ms)
  }

  private deliver(e: MessageEvent) {
    if (e.lastEventId) this.lastEvent = e.lastEventId
    let env: { channel?: string; name?: string; data?: unknown; encoding?: string; timestamp?: number }
    try {
      env = JSON.parse(String(e.data))
    } catch {
      return
    }
    const name = env.channel ? this.physical.get(env.channel) : undefined
    if (!name) return
    let data = env.data
    if (typeof data === "string" && env.encoding && /json/.test(env.encoding)) {
      try {
        data = JSON.parse(data)
      } catch {
        /* leave as the string */
      }
    }
    const msg: RealtimeMessage = { channel: name, event: env.name ?? "", data, at: env.timestamp }
    for (const l of [...(this.listeners.get(name) ?? [])]) {
      try {
        l(msg)
      } catch (err) {
        console.error("[SmartLinks realtime] a listener threw", err)
      }
    }
  }

  close() {
    this.closed = true
    for (const t of [this.pending, this.refreshTimer, this.retryTimer]) if (t) clearTimeout(t)
    this.source?.close()
    this.source = null
    this.onEmpty()
  }
}

const streams = new Map<string, Stream>()
function streamFor(scope: RealtimeScope): Stream {
  if (!scope?.collectionId) throw new Error("realtime: collectionId is required")
  const key = `${scope.collectionId}|${scope.appId ?? ""}`
  let s = streams.get(key)
  if (!s) {
    s = new Stream(scope.collectionId, scope.appId ?? null, () => streams.delete(key))
    streams.set(key, s)
  }
  return s
}

/**
 * One of your app's declared channels (manifest `realtime.channels`).
 *
 * ```ts
 * const draw = realtime.channel({ collectionId, appId }, "draw")
 * const off = draw.subscribe("status", (m) => setStatus(m.data))
 * await draw.publish("status", { phase: "spinning" }) // if the channel lets this viewer publish
 * ```
 */
export function channel(scope: RealtimeScope & { appId: string }, name: string) {
  return {
    /** Listen for an event (or "*" for every event). Returns a function that stops listening. */
    subscribe(event: string, onMessage: (msg: RealtimeMessage) => void): () => void {
      return streamFor(scope).add(name, (m) => {
        if (event === "*" || m.event === event) onMessage(m)
      })
    },
    /** Send a message. Refused (403) unless the channel's `publish` rule allows this viewer. */
    publish(event: string, data?: unknown): Promise<{ ok: true }> {
      return post<{ ok: true }>("/public/realtime/publish", {
        collectionId: scope.collectionId,
        appId: scope.appId,
        channel: name,
        event,
        data: data === undefined ? null : data,
      })
    },
  }
}

function matches(change: RealtimeChangeEvent, filter: RealtimeChangeFilter): boolean {
  for (const k of ["type", "id", "appId", "recordType", "productId", "proofId"] as const) {
    if (filter[k] !== undefined && change[k] !== filter[k]) return false
  }
  return true
}

/**
 * Something changed: refetch it. IDs only — never data.
 *
 * Admins of the collection see every change; everyone else sees changes to public things (public app
 * records, products). Filter by `type` ('product' | 'proof' | 'asset' | 'record' | 'collection' |
 * 'collection.apps' | 'settings'), `id`, `appId`, `recordType`, `productId`, `proofId`.
 *
 * ```ts
 * const off = realtime.onChange({ collectionId }, { type: "record", appId, recordType: "entry" }, () => refetch())
 * ```
 */
export function onChange(scope: RealtimeScope, filter: RealtimeChangeFilter, onChangeFn: (change: RealtimeChangeEvent) => void): () => void {
  const s = streamFor({ collectionId: scope.collectionId })
  // Ask for both feeds; an admin is granted both (public changes reach the admin feed too), so the
  // public feed is ignored once the admin feed is granted — no change arrives twice.
  const handle = (fromAdminFeed: boolean) => (m: RealtimeMessage) => {
    if (m.event !== "change" || !m.data || typeof m.data !== "object") return
    if (!fromAdminFeed && s.has("feed:admin")) return
    const change = m.data as RealtimeChangeEvent
    if (matches(change, filter)) onChangeFn(change)
  }
  const offAdmin = s.add("feed:admin", handle(true))
  const offPublic = s.add("feed:public", handle(false))
  return () => {
    offAdmin()
    offPublic()
  }
}

/**
 * Messages for the signed-in person only (e.g. "scan" — a tag they just scanned on another device).
 */
export function onMine(scope: RealtimeScope, onMessage: (msg: RealtimeMessage) => void): () => void {
  return streamFor({ collectionId: scope.collectionId }).add("feed:me", onMessage)
}

// ---------------------------------------------------------------------------------------------------
// Legacy (raw Ably tokens). New code uses channel / onChange above — no provider in your app.
// ---------------------------------------------------------------------------------------------------

/**
 * @deprecated Use `realtime.channel()` / `realtime.onChange()`. Returns a raw Ably TokenRequest for
 * `collection:{collectionId}:*` (subscribe; publish only for the collection's admins).
 */
export async function getPublicToken(params: RealtimeTokenRequest): Promise<AblyTokenRequest> {
  const queryParams = new URLSearchParams()
  queryParams.append("collectionId", params.collectionId)
  if (params.appId) queryParams.append("appId", params.appId)
  return request<AblyTokenRequest>(`/public/push/token?${queryParams.toString()}`)
}

/**
 * @deprecated Use `realtime.onMine()`. Returns a raw Ably TokenRequest for `interaction:{userId}`
 * (subscribe only).
 */
export async function getAdminToken(): Promise<AblyTokenRequest> {
  return request<AblyTokenRequest>("/admin/auth/push")
}
