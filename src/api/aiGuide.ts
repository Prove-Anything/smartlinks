// The customer guide, and "what's on my screen" for AI (browser side of prove docs/design/customer-assistant.md).
//
//   ai.guide.get(collectionId, surface)       is the guide on here, its name, modes and opening questions
//   ai.guide.start(collectionId, options)     a live conversation with it, by voice or by text
//   ai.content.provide(handler)               an app says what its screen shows, in words
//   ai.content.request(options)               a host asks the app on screen what it shows
//
// The guide runs as the visitor (anonymous, or signed in with Auth Kit). Everything that shapes it — its
// instructions, voice and tools — is fixed by SmartLinks when the conversation starts; the page only says
// where the visitor is and what is on their screen.

import { post, request } from '../http'
import { startLive, type LiveHandle, type LiveOptions, type LiveState, type LiveToolHandler, type LiveMintReply, type LiveEvent } from '../live'

export type GuideSurface = 'portal' | 'hub'

/** What a page may know about a business's guide before starting one. */
export interface GuideInfo {
  enabled: boolean
  name?: string
  modes?: { voice: boolean; text: boolean; start: 'voice' | 'text' }
  suggestions?: string[]
  handoff?: { kind: 'email' | 'phone' | 'url'; value: string } | null
}

/** What is on the visitor's screen, in words. */
export interface ScreenContent {
  appId?: string | null
  title?: string | null
  content?: string | null
}

/** Where the visitor is: the app on screen and the page in it (as the host's deep link). */
export interface GuideWhere {
  appId?: string | null
  path?: string | null
  params?: Record<string, string>
}

/** A page the guide opened (the host moves the app there). */
export interface GuideNavigate {
  appId: string
  path: string
  params?: Record<string, string>
}

/** Products the guide found, for the screen: each row can take the visitor there. */
export interface GuideCard {
  title: string
  rows: Array<{ title: string; detail?: string | null; goTo?: string }>
  more?: number
}

export interface GuideStartOptions {
  surface: GuideSurface
  mode?: 'voice' | 'text'
  productId?: string | null
  proofId?: string | null
  /** The apps on the visitor's page: the guide reads their pages and may open them. A core app says so. */
  apps?: Array<{ id: string; title: string; kind?: 'core' | 'app'; channel?: string }>
  /** Where the visitor is when the conversation starts. Later, tell it with handle.note(). */
  where?: GuideWhere
  /** The visitor's language (e.g. 'fr'); default: theirs as the browser says. */
  language?: string
  /** What's on screen when the conversation starts. Later, the guide asks with read_screen. */
  screen?: ScreenContent
  /** Read the screen now (the guide's read_screen tool). Default: ask the app on screen (ai.content.request). */
  readScreen?: () => Promise<ScreenContent | null> | ScreenContent | null
  /** Open one of the business's apps at its start (the guide's show_app tool). */
  showApp?: (appId: string) => Promise<void> | void
  /** Open a page of an app (the guide's open_page tool: SmartLinks resolves the page's address). */
  openPage?: (to: GuideNavigate) => Promise<void> | void
  /** Go to another product's page (the guide's go_to tool). */
  goTo?: (productId: string) => Promise<void> | void
  /** Products the guide found, to show (each row can call goTo). */
  onShow?: (card: GuideCard) => void
  /** Show how to reach a person (the guide's offer_person tool). */
  offerPerson?: (handoff: GuideInfo['handoff']) => Promise<void> | void
  onState?: (s: LiveState) => void
  onCaption?: (text: string) => void
  onReply?: (text: string) => void
  onError?: (message: string) => void
}

const base = (collectionId: string) => `/public/collection/${encodeURIComponent(collectionId)}/ai/guide`

export namespace guide {
  /** Is the guide on for this surface, and how does it present itself? */
  export async function get(collectionId: string, surface?: GuideSurface): Promise<GuideInfo> {
    return request<GuideInfo>(`${base(collectionId)}${surface ? `?surface=${surface}` : ''}`)
  }

  /** Start a live conversation with the guide. Resolves once connected; the handle pauses, stops, sends text. */
  export async function start(collectionId: string, options: GuideStartOptions): Promise<LiveHandle> {
    let handoff: GuideInfo['handoff'] = null
    const language = options.language || (typeof navigator !== 'undefined' ? (navigator.language || '').split('-')[0] : '') || undefined
    const screenTools: Record<string, LiveToolHandler> = {
      read_screen: async () => {
        const s = options.readScreen ? await options.readScreen() : await content.request({ timeoutMs: 1500 })
        return s && s.content ? { title: s.title ?? null, content: String(s.content).slice(0, 12000) } : { error: 'Nothing to read on the screen right now.' }
      },
      show_app: async (args) => {
        if (!options.showApp) return { error: "That can't be opened from here." }
        await options.showApp(String(args['appId'] ?? ''))
        return { opened: String(args['appId'] ?? '') }
      },
      go_to: async (args) => {
        const id = String(args['productId'] ?? '')
        if (!id) return { error: 'Which product?' }
        if (!options.goTo) return { error: "That can't be opened from here." }
        await options.goTo(id)
        return { opened: id }
      },
      offer_person: async () => {
        if (!handoff) return { error: 'There is no way to reach a person set up.' }
        await options.offerPerson?.(handoff)
        return { shown: handoff.kind }
      },
    }
    const opts: LiveOptions = {
      mode: options.mode,
      build: 'sdk-guide-1',
      screenTools,
      endpoints: {
        mint: async () => {
          const reply = await post<LiveMintReply & { handoff?: GuideInfo['handoff'] }>(`${base(collectionId)}/session`, {
            surface: options.surface,
            mode: options.mode,
            productId: options.productId ?? undefined,
            proofId: options.proofId ?? undefined,
            apps: options.apps,
            where: options.where,
            language,
            screen: options.screen,
          })
          handoff = reply.handoff ?? null
          return reply
        },
        tool: (name, args, sessionId) => post(`${base(collectionId)}/tool`, { name, args, sessionId }),
        event: (event: LiveEvent) => { void post(`${base(collectionId)}/event`, event).catch(() => undefined) },
      },
      onToolReply: async (_name, reply) => {
        if (reply['show']) options.onShow?.(reply['show'] as GuideCard)
        if (reply['navigate']) await options.openPage?.(reply['navigate'] as GuideNavigate)
      },
      onState: options.onState,
      onCaption: options.onCaption,
      onReply: options.onReply,
      onError: options.onError,
    }
    return startLive(opts)
  }
}

// ---- what's on the screen ---------------------------------------------------------------------------

type ContentHandler = (ctx: { reason?: string }) => Promise<ScreenContent | null> | ScreenContent | null

const REQUEST = 'smartlinks:ai-content-request'
const REPLY = 'smartlinks:ai-content'
const local = new Set<ContentHandler>()

export namespace content {
  /**
   * An app says what its screen shows, in words (an exhibit's text, a recipe, a form's purpose). Called
   * whenever an assistant needs it. Works in an iframe (the host asks by message) and in the same page
   * (a direct component). Returns a function that stops providing.
   */
  export function provide(handler: ContentHandler): () => void {
    local.add(handler)
    let onMessage: ((e: MessageEvent) => void) | null = null
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      onMessage = (e: MessageEvent) => {
        const d = e.data as { type?: string; id?: string; reason?: string } | null
        if (e.source !== window.parent || !d || d.type !== REQUEST || !d.id) return
        void Promise.resolve(handler({ reason: d.reason }))
          .catch(() => null)
          .then((c) => window.parent.postMessage({ type: REPLY, id: d.id, content: c ?? null }, '*'))
      }
      window.addEventListener('message', onMessage)
    }
    return () => {
      local.delete(handler)
      if (onMessage) window.removeEventListener('message', onMessage)
    }
  }

  /**
   * A host asks what the app on screen shows: an app in an iframe (pass its window as `frame`), or apps in
   * this page that called `provide`. Resolves null if nothing answers within the time.
   */
  export async function request(options: { frame?: Window | null; reason?: string; timeoutMs?: number } = {}): Promise<ScreenContent | null> {
    const timeoutMs = options.timeoutMs ?? 1000
    if (options.frame) {
      const frame = options.frame
      const id = Math.random().toString(36).slice(2)
      return new Promise((resolve) => {
        const done = (c: ScreenContent | null) => { clearTimeout(timer); window.removeEventListener('message', onMessage); resolve(c) }
        const onMessage = (e: MessageEvent) => {
          const d = e.data as { type?: string; id?: string; content?: ScreenContent | null } | null
          if (e.source === frame && d && d.type === REPLY && d.id === id) done(d.content ?? null)
        }
        const timer = setTimeout(() => done(null), timeoutMs)
        window.addEventListener('message', onMessage)
        frame.postMessage({ type: REQUEST, id, reason: options.reason }, '*')
      })
    }
    for (const handler of [...local].reverse()) {
      const c = await Promise.race([
        Promise.resolve(handler({ reason: options.reason })).catch(() => null),
        new Promise<null>((r) => setTimeout(() => r(null), timeoutMs)),
      ])
      if (c && c.content) return c
    }
    return null
  }
}

export { startLive }
export type { LiveHandle, LiveState, LiveOptions, LiveToolHandler, LiveMintReply, LiveEvent }
