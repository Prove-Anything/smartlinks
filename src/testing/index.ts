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

import type { AppFunctionDef, ServerFunctionContext } from '../types/appManifest'

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
    create?(fields: any): any; update?(id: string, fields: any): any; upsert?(fields: any): any
    delete?(id: string): any; get?(id: string): any; query?(params: any): any; listTypes?(): any
  }
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
}

export interface FunctionTestContext extends ServerFunctionContext {
  /** Captured log lines (also written via ctx.log). */
  logs: Array<{ at: string; message: string; data?: Record<string, any> }>
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

  const ar = impl.appRecords || {}
  const pr = impl.products || {}
  const at = impl.attestations || {}
  const sl: any = {
    appRecords: {
      create: gated('records', 'write', ar.create && ar.create.bind(ar), 'create'),
      update: gated('records', 'write', ar.update && ar.update.bind(ar), 'update'),
      upsert: gated('records', 'write', ar.upsert && ar.upsert.bind(ar), 'upsert'),
      delete: gated('records', 'write', ar.delete && ar.delete.bind(ar), 'delete'),
      get: gated('records', 'read', ar.get && ar.get.bind(ar), 'get'),
      query: gated('records', 'read', ar.query && ar.query.bind(ar), 'query'),
      listTypes: gated('records', 'read', ar.listTypes && ar.listTypes.bind(ar), 'listTypes'),
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
    logs,
  }
}
