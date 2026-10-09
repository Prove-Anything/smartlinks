// src/testing/index.ts
//
// Local test harness for SmartLinks server functions — importable as
// `@proveanything/smartlinks/testing`. It builds a `ctx` that matches the runtime
// contract AND enforces the declared capability envelope, so a function fails locally
// the same way it would after deploy — no "deploy and pray".
//
// Fidelity (documented in docs/server-functions.md "Testing & preview"):
//  - Capabilities are enforced EXACTLY as declared in the manifest `def` — pass the def
//    itself so "tested" can't drift from "declared".
//  - `ctx.sl` delegates to an impl you inject: your live SDK for real reads/writes, or
//    omit it for pure unit tests (methods return a stub result instead of hitting the
//    network — control flow + capability enforcement still run).
//  - `ctx.secrets` are FIXTURES you provide; real sealed secrets are server-only and
//    never resolvable locally.
//  - `ctx.fetch` is gated by the `network` capability just like production.
//  - Without an injected impl, appRecords / counters / contacts / interactions run against an
//    in-memory store with the platform's uniqueness rules (claim: singletonPer + customId; contacts by
//    email/phone, fill-empty only), so idempotency and "never two of the same number" are testable.
//    Inspect it via `ctx.memory`.

import type { AppFunctionDef, ServerFunctionContext, ServerFunctionInputs } from '../types/appManifest'

export class CapabilityError extends Error {
  capability: string
  code = 'CAPABILITY_DENIED'
  constructor(capability: string, message?: string) {
    super(message || `capability not granted: ${capability}`)
    this.name = 'CapabilityError'
    this.capability = capability
  }
}

interface ParsedCaps { sl: Set<string>; secrets: Set<string>; networkAll: boolean; networkHosts: Set<string> }

// The SAME grammar the server enforces (prove server/services/functions/validate.js).
function parseCapabilities(list: string[] = []): ParsedCaps {
  const sl = new Set<string>()
  const secrets = new Set<string>()
  const networkHosts = new Set<string>()
  let networkAll = false
  for (const raw of list || []) {
    const cap = String(raw || '').trim()
    if (!cap) continue
    if (cap === 'network') { networkAll = true; continue }
    if (cap.startsWith('network:')) { networkHosts.add(cap.slice(8).toLowerCase()); continue }
    if (cap.startsWith('secrets:')) { secrets.add(cap.slice(8)); continue }
    if (cap.startsWith('sl:')) { sl.add(cap.slice(3)); continue }
  }
  return { sl, secrets, networkAll, networkHosts }
}

function allowsSl(p: ParsedCaps, resource: string, op: 'read' | 'write'): boolean {
  if (p.sl.has(`${resource}:${op}`)) return true
  if (op === 'read' && p.sl.has(`${resource}:write`)) return true // write implies read
  return false
}

/** The surface `ctx.sl` exposes — mirrors the server facade. Provide the methods your test needs. */
export interface TestSlImpl {
  appRecords?: {
    create?(fields: any): any; claim?(fields: any): any; update?(id: string, fields: any): any; upsert?(fields: any): any
    delete?(id: string): any; get?(id: string): any; query?(params: any): any; listTypes?(): any
  }
  counters?: { next?(name: string, opts?: any): any; get?(name: string): any }
  /** Tag lookup. Default: any `<claimSetId>-<code>` resolves (pass `knownTags` to restrict). */
  tags?: { resolve?(id: string): any }
  contacts?: { upsert?(details: any): any; forCaller?(): any }
  interactions?: { record?(event: any): any }
  products?: {
    get?(id: string, opts?: any): any; query?(body?: any, opts?: any): any
    create?(data: any, opts?: any): any; update?(id: string, data: any, opts?: any): any
  }
  attestations?: { create?(fields: any): any }
  /**
   * THIS app's own data. Provide impls to assert calls, or omit to use a built-in in-memory store
   * (so a counter test actually persists across calls within the test). `.global`/`.collection` and
   * per-call `{ scope }` share the same store in the harness.
   */
  appData?: {
    get?(opts?: any): any; set?(data: any, opts?: any): any
    getData?(opts?: any): any; setData?(data: any, opts?: any): any; delete?(opts?: any): any
  }
  /** Cross-app reads: return another app's data as the caller would see it. Keyed by appId. */
  app?: (appId: string) => { data?: { get?(opts?: any): any; getData?(opts?: any): any } }
}

export interface TestCaller {
  userId?: string | null
  anonymous?: boolean
  origin?: string | null
  ip?: string | null
}

export interface CreateFunctionTestContextOptions {
  /** The manifest declaration under test — its `capabilities` are the enforced envelope. */
  def: Pick<AppFunctionDef, 'capabilities' | 'trigger' | 'visibility' | 'authority'>
  collectionId?: string
  appId?: string
  caller?: TestCaller
  /** Fixture secrets, keyed by ref. Real sealed secrets are server-only and never available locally. */
  secrets?: Record<string, string>
  /** Backing impl for ctx.sl. Omit for pure unit tests (methods return a stub echo). */
  sl?: TestSlImpl
  /** Backing fetch (defaults to global fetch). Still gated by the `network` capability. */
  fetch?: typeof fetch
  /** What the platform would have prefetched as `ctx.inputs` (e.g. `{ entity: product }`). Default `{}`. */
  inputs?: ServerFunctionInputs
  /** Tags that exist, as `<claimSetId>-<code>` ids — `ctx.sl.tags.resolve` returns null for any other. */
  knownTags?: string[]
  /** Interaction type ids that exist for this app — `interactions.record` refuses others. Default: any. */
  knownInteractionTypes?: string[]
  /** Share one in-memory store between several contexts (e.g. concurrent callers in one test). */
  memory?: FunctionTestMemory
}

/** The harness's in-memory platform state (when no impl is injected). */
export interface FunctionTestMemory {
  records: any[]
  counters: Record<string, number>
  contacts: Array<{ contactId: string; email?: string; phone?: string; [k: string]: any }>
  interactions: any[]
}

/** A fresh in-memory store — pass the same one to several test contexts to simulate concurrent callers. */
export function createFunctionTestMemory(): FunctionTestMemory {
  return { records: [], counters: {}, contacts: [], interactions: [] }
}

export interface FunctionTestContext extends ServerFunctionContext {
  /** Captured log lines (also written via ctx.log). */
  logs: Array<{ at: string; message: string; data?: Record<string, any> }>
  /** The in-memory platform state this context reads and writes. */
  memory: FunctionTestMemory
}

const stub = (method: string, args: any[]) => ({ __stub: true, method, args })

/**
 * Build a capability-enforcing test ctx for a server function. Run your handler with it:
 *
 *   const ctx = createFunctionTestContext({ def, caller: { userId: 'me' }, secrets: { k: 'v' } })
 *   const result = await myHandler(ctx, { method: 'POST', body: { … } })
 *
 * A ctx.sl / ctx.secrets / ctx.fetch call not covered by `def.capabilities` throws
 * CapabilityError — exactly as it would in production.
 */
export function createFunctionTestContext(opts: CreateFunctionTestContextOptions): FunctionTestContext {
  const def = opts.def || ({} as CreateFunctionTestContextOptions['def'])
  const parsed = parseCapabilities(def.capabilities || [])
  const impl: TestSlImpl = opts.sl || {}
  const logs: FunctionTestContext['logs'] = []

  const gated = (resource: string, op: 'read' | 'write', fn: ((...a: any[]) => any) | undefined, name: string) =>
    async (...args: any[]) => {
      if (!allowsSl(parsed, resource, op)) throw new CapabilityError(`sl:${resource}:${op}`)
      return fn ? fn(...args) : stub(`${resource}.${name}`, args)
    }

  const mem: FunctionTestMemory = opts.memory || createFunctionTestMemory()
  const ar = impl.appRecords || {}
  const pr = impl.products || {}
  const at = impl.attestations || {}

  // In-memory records with the platform's unique keys (used when no appRecords impl is injected).
  const singletonKey = (f: any) => {
    const t = f.recordType || 'default'
    switch (f.singletonPer) {
      case 'collection': return `${t}:collection`
      case 'product': return f.productId ? `${t}:product:${f.productId}` : null
      case 'variant': return f.productId && f.variantId ? `${t}:variant:${f.productId}:${f.variantId}` : null
      case 'batch': return f.productId && f.batchId ? `${t}:batch:${f.productId}:${f.batchId}` : null
      case 'proof': return f.proofId ? `${t}:proof:${f.proofId}` : null
      default: return null
    }
  }
  const customKey = (f: any) => {
    const c = f.customId == null ? '' : String(f.customId).trim().toLowerCase()
    return c ? [f.recordType || 'default', f.scopeType || '', f.scopeId || '', f.sourceSystem || '', c].join('|') : null
  }
  let nextRecordId = 1
  const memRecords = {
    create: async (fields: any) => {
      const rec = { id: `rec-${nextRecordId++}`, recordType: 'default', data: {}, admin: {}, status: 'active', createdAt: new Date().toISOString(), ...fields }
      mem.records.push(rec)
      return { ...rec }
    },
    claim: async (fields: any) => {
      const sk = singletonKey(fields)
      const ck = customKey(fields)
      if (fields.singletonPer && !sk) throw Object.assign(new Error(`claim: singletonPer "${fields.singletonPer}" needs its anchor id`), { code: 'INVALID_CLAIM' })
      if (!sk && !ck) throw Object.assign(new Error('claim: give the record a unique key — singletonPer (+ anchor) or customId'), { code: 'INVALID_CLAIM' })
      const bySingleton = sk ? mem.records.find((r) => !r.deletedAt && singletonKey(r) === sk) : null
      if (bySingleton) return { record: { ...bySingleton }, created: false, conflict: 'singleton' }
      const byCustom = ck ? mem.records.find((r) => customKey(r) === ck) : null // deleted records keep their customId
      if (byCustom) return { record: { ...byCustom }, created: false, conflict: 'customId' }
      return { record: await memRecords.create(fields), created: true }
    },
    get: async (id: string) => { const r = mem.records.find((x) => x.id === id); return r ? { ...r } : null },
    update: async (id: string, fields: any) => { const r = mem.records.find((x) => x.id === id); if (!r) return null; Object.assign(r, fields); return { ...r } },
    delete: async (id: string) => { const r = mem.records.find((x) => x.id === id); if (r) r.deletedAt = new Date().toISOString(); return {} },
    // Simple equality filter on top-level fields (recordType, proofId, customId, status, …).
    query: async (params: any = {}) => {
      const { limit, offset, sort, ...where } = params || {}
      const all = mem.records.filter((r) => !r.deletedAt && Object.entries(where).every(([k, v]) => r[k] === v))
      const from = offset || 0
      const size = limit || 200
      const data = all.slice(from, from + size).map((r) => ({ ...r }))
      // Same envelope as the platform: { data, pagination }.
      return { data, pagination: { total: all.length, limit: size, offset: from, hasMore: from + data.length < all.length } }
    },
  }
  const recordsFn = (name: keyof typeof memRecords | 'upsert' | 'listTypes') =>
    (ar as any)[name] ? (ar as any)[name].bind(ar) : (impl.appRecords ? undefined : (memRecords as any)[name])

  const sl: any = {
    appRecords: {
      create: gated('records', 'write', recordsFn('create'), 'create'),
      claim: gated('records', 'write', recordsFn('claim'), 'claim'),
      update: gated('records', 'write', recordsFn('update'), 'update'),
      upsert: gated('records', 'write', recordsFn('upsert'), 'upsert'),
      delete: gated('records', 'write', recordsFn('delete'), 'delete'),
      get: gated('records', 'read', recordsFn('get'), 'get'),
      query: gated('records', 'read', recordsFn('query'), 'query'),
      listTypes: gated('records', 'read', recordsFn('listTypes'), 'listTypes'),
    },
    products: {
      get: gated('products', 'read', pr.get && pr.get.bind(pr), 'get'),
      query: gated('products', 'read', pr.query && pr.query.bind(pr), 'query'),
      create: gated('products', 'write', pr.create && pr.create.bind(pr), 'create'),
      update: gated('products', 'write', pr.update && pr.update.bind(pr), 'update'),
    },
    attestations: {
      create: gated('attestations', 'write', at.create && at.create.bind(at), 'create'),
    },
  }

  // appData — own-data (capability-gated only, no role gate). Delegates to a provided impl, else a
  // built-in in-memory store so read-modify-write (e.g. a counter) works across calls in one test.
  const ad = impl.appData || {}
  const memConfig: Record<string, any> = {}
  const memData: Record<string, any> = {}
  const deepMerge = (t: any, s: any) => { for (const k of Object.keys(s || {})) t[k] = (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) ? deepMerge(t[k] || {}, s[k]) : s[k]; return t }
  const makeAppData = () => ({
    get: gated('data', 'read', ad.get ? ad.get.bind(ad) : (async () => ({ ...memConfig })), 'get'),
    set: gated('data', 'write', ad.set ? ad.set.bind(ad) : (async (data: any) => deepMerge(memConfig, data)), 'set'),
    getData: gated('data', 'read', ad.getData ? ad.getData.bind(ad) : (async (opts: any = {}) => (opts.dataId ? memData[opts.dataId] : Object.values(memData))), 'getData'),
    setData: gated('data', 'write', ad.setData ? ad.setData.bind(ad) : (async (data: any, opts: any = {}) => { if (opts.dataId) memData[opts.dataId] = data; return data }), 'setData'),
    delete: gated('data', 'write', ad.delete ? ad.delete.bind(ad) : (async (opts: any = {}) => { if (opts.dataId) delete memData[opts.dataId]; else for (const k of Object.keys(memConfig)) delete memConfig[k] }), 'delete'),
  })
  sl.appData = Object.assign(makeAppData(), { global: makeAppData(), collection: makeAppData() })

  const cn = impl.counters || {}
  sl.counters = {
    next: gated('data', 'write', cn.next ? cn.next.bind(cn) : (async (name: string, o: any = {}) => {
      const start = o.start ?? 1
      const by = o.by ?? 1
      mem.counters[name] = mem.counters[name] == null ? start : mem.counters[name] + by
      return mem.counters[name]
    }), 'counters.next'),
    get: gated('data', 'read', cn.get ? cn.get.bind(cn) : (async (name: string) => mem.counters[name] ?? null), 'counters.get'),
  }

  const tg = impl.tags || {}
  sl.tags = {
    resolve: gated('tags', 'read', tg.resolve ? tg.resolve.bind(tg) : (async (id: string) => {
      const s = String(id || '')
      const i = s.indexOf('-')
      if (i <= 0 || i >= s.length - 1) return null
      if (opts.knownTags && !opts.knownTags.includes(s)) return null
      return { id: s, claimSetId: s.slice(0, i), code: s.slice(i + 1) }
    }), 'tags.resolve'),
  }

  const ct = impl.contacts || {}
  const fillable = ['firstName', 'lastName', 'displayName', 'company', 'locale', 'timezone']
  sl.contacts = {
    upsert: gated('contacts', 'write', ct.upsert ? ct.upsert.bind(ct) : (async (d: any = {}) => {
      const email = d.email ? String(d.email).trim().toLowerCase() : undefined
      const phone = d.phone ? String(d.phone).replace(/[^\d+]/g, '') : undefined
      if (!email && !phone) throw Object.assign(new Error('contacts.upsert: an email or phone is required'), { code: 'CONTACT_IDENTITY_REQUIRED' })
      const found = mem.contacts.find((c) => (email && c.email === email) || (phone && c.phone === phone))
      if (found) {
        for (const k of fillable) if (d[k] && !found[k]) found[k] = d[k]
        found.customFields = { ...(d.customFields || {}), ...(found.customFields || {}) }
        return { contactId: found.contactId, created: false }
      }
      const contactId = `contact-${mem.contacts.length + 1}`
      mem.contacts.push({ ...d, email, phone, contactId })
      return { contactId, created: true }
    }), 'contacts.upsert'),
    forCaller: gated('contacts', 'write', ct.forCaller ? ct.forCaller.bind(ct) : (async () => (opts.caller && opts.caller.userId ? { contactId: `contact-of-${opts.caller.userId}` } : null)), 'contacts.forCaller'),
  }

  const it = impl.interactions || {}
  sl.interactions = {
    record: gated('interactions', 'write', it.record ? it.record.bind(it) : (async (event: any = {}) => {
      if (!event.interactionId || (opts.knownInteractionTypes && !opts.knownInteractionTypes.includes(event.interactionId))) {
        throw Object.assign(new Error(`"${event.interactionId}" is not an interaction type of this app`), { code: 'INTERACTION_TYPE_NOT_FOUND' })
      }
      const eventId = `event-${mem.interactions.length + 1}`
      mem.interactions.push({ ...event, eventId, userId: (opts.caller && opts.caller.userId) || null })
      return { eventId }
    }), 'interactions.record'),
  }
  sl.app = (appId: string) => {
    const other = (impl.app && impl.app(appId)) || {}
    const od = other.data || {}
    return {
      data: {
        get: gated('data', 'read', od.get ? od.get.bind(od) : (async () => null), 'app.get'),
        getData: gated('data', 'read', od.getData ? od.getData.bind(od) : (async () => []), 'app.getData'),
      },
    }
  }

  const secretsMap = opts.secrets || {}
  const baseFetch: any = opts.fetch || (typeof fetch !== 'undefined' ? fetch : undefined)
  const via: any = (def.trigger && def.trigger.type) || 'http'
  const caller = opts.caller || {}

  return {
    collectionId: opts.collectionId || 'test-collection',
    appId: opts.appId || 'test-app',
    sl,
    secrets: {
      async get(ref: string): Promise<string | null> {
        if (!parsed.secrets.has(ref)) throw new CapabilityError(`secrets:${ref}`)
        return Object.prototype.hasOwnProperty.call(secretsMap, ref) ? secretsMap[ref] : null
      },
      // App-scoped read — in tests it resolves from the same provided secrets map.
      async app(ref: string): Promise<string | null> {
        if (!parsed.secrets.has(ref)) throw new CapabilityError(`secrets:${ref}`)
        return Object.prototype.hasOwnProperty.call(secretsMap, ref) ? secretsMap[ref] : null
      },
    },
    caller: {
      userId: caller.userId ?? null,
      anonymous: caller.anonymous ?? !caller.userId,
      origin: caller.origin ?? null,
      ip: caller.ip ?? null,
      via,
    },
    fetch: (async (input: any, init?: any) => {
      let host = ''
      try { host = new URL(typeof input === 'string' ? input : input.url).host } catch { /* bad URL → denied */ }
      const allowed = parsed.networkAll || (!!host && parsed.networkHosts.has(host.toLowerCase()))
      if (!allowed) throw new CapabilityError(host ? `network:${host}` : 'network')
      if (!baseFetch) throw new Error('fetch is not available in this environment; pass opts.fetch')
      return baseFetch(input, init)
    }) as any,
    log: (message: string, data?: Record<string, any>) => {
      logs.push({ at: new Date().toISOString(), message: String(message), ...(data ? { data } : {}) })
    },
    inputs: Object.freeze({ ...(opts.inputs || {}) }),
    logs,
    memory: mem,
  }
}
