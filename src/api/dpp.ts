// src/api/dpp.ts
//
// EU Digital Product Passports (ESPR) hosted by SmartLinks, and registering them in the EU registry for the brand
// (docs/dpp.md).
//
// The EU registry only lets an organisation register its own passports, so each brand enrols itself (with its own
// qualified e-seal, on the EU's site) and adds a Service Account holding SmartLinks' public key. From then on
// SmartLinks registers for it:
//
// To try it all before the brand is verified with the EU: dpp.registry.enrolPractice(collectionId), then use 'practice'
// wherever 'acc' appears below (the SmartLinks practice registry — never the EU).
//
//   1. dpp.registry.makeKey(collectionId, 'acc')            → show registry.publicPem to upload to the Service Account
//   2. dpp.registry.set(collectionId, 'acc', { clientId, kid, orgIdentifier })
//   3. dpp.registry.check(collectionId, 'acc')              → signs in and reads the registry's product groups
//   4. dpp.passports.upsert(...) / upsertMany(...)          → passports at their addresses (passport.url)
//   5. dpp.register(collectionId, 'acc', passportIds)       → the registry reads each one and registers it
//
// 'acc' is the EU test registry, 'prod' the live one. Each passport is served at its address: the public view to
// anyone, and the restricted views only to the EU registry for that brand.
//
// Endpoints: /admin/collection/:collectionId/dpp/…  and  /public/dpp/:collectionId/:passportId

import { request, post, put } from "../http"
import type {
  DppEnvironment,
  DppRegistry,
  SetDppRegistryInput,
  DppRegistryCheckResult,
  DppGroup,
  DppPassport,
  DppPassportInput,
  DppPassportUpsertInput,
  DppPassportSaveResult,
  DppPassportUpsertResult,
  DppPassportBulkResult,
  DppPassportVersion,
  DppPassportListQuery,
  DppRegisterResult,
  DppTask,
  DppTaskRefreshResult,
  DppDocument,
} from "../types/dpp"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

function enc(v: string) { return encodeURIComponent(v) }
const base = (collectionId: string) => `/admin/collection/${enc(collectionId)}/dpp`

function query(q: Record<string, unknown>): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== null && v !== "") p.set(k, String(v))
  const s = p.toString()
  return s ? `?${s}` : ""
}

export namespace dpp {
  /**
   * What passports can be made: product groups, their kinds, and each view's fields and required fields.
   * A fixed set: always all of them in one answer (`nextCursor` is always null), so it takes no `limit`
   * or `cursor`. GET /dpp/groups
   *
   * @example
   * ```typescript
   * const { items } = await dpp.groups(collectionId)
   * items.map(g => g.productGroup) // ["BATTERIES", …]
   * ```
   */
  export async function groups(collectionId: string): Promise<ListResult<DppGroup>> {
    return request<ListResult<DppGroup>>(`${base(collectionId)}/groups`)
  }

  /**
   * Read a passport as the public sees it, at its address (the EU JSON document), or an earlier version of it.
   * No sign-in needed. GET /public/dpp/:collectionId/:passportId
   */
  export async function read(collectionId: string, passportId: string, opts: { version?: number } = {}): Promise<DppDocument> {
    return request<DppDocument>(`/public/dpp/${enc(collectionId)}/${enc(passportId)}${query({ version: opts.version })}`)
  }

  /**
   * Send passports to the EU registry. They're grouped by product group and sent up to 100 at a time; the registry
   * reads each one at its address. Passports still missing required fields, withdrawn or already registered come
   * back in `skipped`. With `wait: true` the call waits (up to ~45 s) and returns each passport's outcome; otherwise
   * follow up with `dpp.tasks.refresh`. POST /dpp/registry/:env/register
   */
  export async function register(collectionId: string, env: DppEnvironment, passportIds: string[], opts: { wait?: boolean } = {}): Promise<DppRegisterResult> {
    return post<DppRegisterResult>(`${base(collectionId)}/registry/${enc(env)}/register`, { passportIds, wait: !!opts.wait })
  }

  /** The brand's EU registry connection (one per environment). Managed by the collection's admins. */
  export namespace registry {
    /**
     * Both environments, each with `nextStep` (what's left to connect). A fixed set: always all of them
     * in one answer (`nextCursor` is always null), so it takes no `limit` or `cursor`. GET /dpp/registry
     *
     * @example
     * ```typescript
     * const { items } = await dpp.registry.list(collectionId)
     * const acc = items.find(r => r.environment === 'acc')
     * ```
     */
    export async function list(collectionId: string): Promise<ListResult<DppRegistry>> {
      return request<ListResult<DppRegistry>>(`${base(collectionId)}/registry`)
    }

    /** One environment. GET /dpp/registry/:env */
    export async function get(collectionId: string, env: DppEnvironment): Promise<DppRegistry> {
      const out = await request<{ registry: DppRegistry }>(`${base(collectionId)}/registry/${enc(env)}`)
      return out.registry
    }

    /**
     * Make (or replace) the key the brand's Service Account trusts. The private key stays on SmartLinks' servers;
     * show `publicPem` (or `publicJwk`) for the brand to add to its Service Account in the registry. Replacing the
     * key clears `kid` — the registry gives the new key its own. POST /dpp/registry/:env/key
     */
    export async function makeKey(collectionId: string, env: DppEnvironment, opts: { alg?: "ES256" | "ES384" | "ES512" } = {}): Promise<DppRegistry> {
      const out = await post<{ registry: DppRegistry }>(`${base(collectionId)}/registry/${enc(env)}/key`, opts)
      return out.registry
    }

    /** Save the Service Account's Client ID and key ID, and the brand's Organisation ID, from the registry. PUT /dpp/registry/:env */
    export async function set(collectionId: string, env: DppEnvironment, input: SetDppRegistryInput): Promise<DppRegistry> {
      const out = await put<{ registry: DppRegistry }>(`${base(collectionId)}/registry/${enc(env)}`, input)
      return out.registry
    }

    /**
     * Connect the brand to the SmartLinks PRACTICE registry in one step — key, enrolment, Service Account and check —
     * to try publishing and registering before the brand is verified with the EU. Never the EU: label it as practice
     * wherever it's shown. POST /dpp/registry/practice/enrol
     */
    export async function enrolPractice(collectionId: string): Promise<DppRegistryCheckResult> {
      return post<DppRegistryCheckResult>(`${base(collectionId)}/registry/practice/enrol`, {})
    }

    /** Sign in to the registry and read its product groups — proves the connection works. POST /dpp/registry/:env/check */
    export async function check(collectionId: string, env: DppEnvironment): Promise<DppRegistryCheckResult> {
      return post<DppRegistryCheckResult>(`${base(collectionId)}/registry/${enc(env)}/check`, {})
    }
  }

  /** The collection's passports. */
  export namespace passports {
    /**
     * The collection's passports, a page at a time: all of them, or those of one product, batch or item,
     * or with one status. GET /dpp/passports
     *
     * @example
     * ```typescript
     * let page = await dpp.passports.list(collectionId, { productId, status: 'active', limit: 100 })
     * page.items // DppPassport[]
     * while (page.nextCursor) {
     *   page = await dpp.passports.list(collectionId, { productId, status: 'active', limit: 100, cursor: page.nextCursor })
     * }
     * ```
     */
    export async function list(collectionId: string, q: DppPassportListQuery = {}): Promise<ListResult<DppPassport>> {
      return request<ListResult<DppPassport>>(`${base(collectionId)}/passports${listQuery(q)}`)
    }

    /** One passport, with `check` (what it's still missing) and its `url`. GET /dpp/passports/:id */
    export async function get(collectionId: string, passportId: string): Promise<DppPassport> {
      const out = await request<{ passport: DppPassport }>(`${base(collectionId)}/passports/${enc(passportId)}`)
      return out.passport
    }

    /** Make a passport. POST /dpp/passports */
    export async function create(collectionId: string, input: DppPassportInput & { productGroup: string }): Promise<DppPassport> {
      const out = await post<{ passport: DppPassport }>(`${base(collectionId)}/passports`, input)
      return out.passport
    }

    /**
     * Change a passport. `public` / `restricted` are merged into what's there unless `replace` is true. A change to
     * what it says makes a new version. PUT /dpp/passports/:id
     */
    export async function update(collectionId: string, passportId: string, input: DppPassportInput, opts: { replace?: boolean } = {}): Promise<DppPassportSaveResult> {
      return put<DppPassportSaveResult>(`${base(collectionId)}/passports/${enc(passportId)}${query({ replace: opts.replace ? "true" : undefined })}`, input)
    }

    /**
     * Publish the passport for a product, batch or item (`productId` / `batchId` / `proofId`) at a granularity:
     * updates the one already there or makes it. The fields replace what's there (pass `merge: true` to merge).
     * Saving the same content again changes nothing. PUT /dpp/passports/by-anchor
     *
     * @example
     * ```typescript
     * const { passport } = await dpp.passports.upsert(collectionId, {
     *   productId, productGroup: 'BATTERIES', productSubGroup: 'EV', granularity: 'model',
     *   public: { batteryChemistry: [...], manufacturerIdentification: {...} },
     *   restricted: { dismantlingInformation: [...] },
     * })
     * if (!passport.check.ready) console.log('Still missing', passport.check.missing)
     * ```
     */
    export async function upsert(collectionId: string, input: DppPassportUpsertInput, opts: { merge?: boolean } = {}): Promise<DppPassportUpsertResult> {
      return put<DppPassportUpsertResult>(`${base(collectionId)}/passports/by-anchor${query({ replace: opts.merge ? "false" : undefined })}`, input)
    }

    /** `upsert` for up to 500 passports at once (e.g. one per battery); each answers on its own. POST /dpp/passports/bulk */
    export async function upsertMany(collectionId: string, items: DppPassportUpsertInput[], opts: { merge?: boolean } = {}): Promise<DppPassportBulkResult> {
      return post<DppPassportBulkResult>(`${base(collectionId)}/passports/bulk${query({ replace: opts.merge ? "false" : undefined })}`, { passports: items })
    }

    /**
     * Its versions, newest first, a page at a time (`limit` and `cursor`; 50 unless you say otherwise).
     * Read one with `dpp.read(collectionId, id, { version })`. GET /dpp/passports/:id/versions
     *
     * @example
     * ```typescript
     * let page = await dpp.passports.versions(collectionId, passportId, { limit: 20 })
     * const latest = page.items[0].version
     * while (page.nextCursor) {
     *   page = await dpp.passports.versions(collectionId, passportId, { limit: 20, cursor: page.nextCursor })
     * }
     * ```
     */
    export async function versions(collectionId: string, passportId: string, options: ListOptions = {}): Promise<ListResult<DppPassportVersion>> {
      return request<ListResult<DppPassportVersion>>(`${base(collectionId)}/passports/${enc(passportId)}/versions${listQuery(options)}`)
    }

    /** No longer valid: stays at its address, marked invalid (the registry keeps its record). POST /dpp/passports/:id/withdraw */
    export async function withdraw(collectionId: string, passportId: string): Promise<DppPassport> {
      const out = await post<{ passport: DppPassport }>(`${base(collectionId)}/passports/${enc(passportId)}/withdraw`, {})
      return out.passport
    }

    /** Valid again. POST /dpp/passports/:id/restore */
    export async function restore(collectionId: string, passportId: string): Promise<DppPassport> {
      const out = await post<{ passport: DppPassport }>(`${base(collectionId)}/passports/${enc(passportId)}/restore`, {})
      return out.passport
    }
  }

  /** Registry requests and their outcomes. */
  export namespace tasks {
    /**
     * Requests sent to one environment, newest first, a page at a time (`limit` and `cursor`; 50 unless
     * you say otherwise). GET /dpp/registry/:env/tasks
     *
     * @example
     * ```typescript
     * let page = await dpp.tasks.list(collectionId, 'acc', { limit: 20 })
     * while (page.nextCursor) {
     *   page = await dpp.tasks.list(collectionId, 'acc', { limit: 20, cursor: page.nextCursor })
     * }
     * ```
     */
    export async function list(collectionId: string, env: DppEnvironment, options: ListOptions = {}): Promise<ListResult<DppTask>> {
      return request<ListResult<DppTask>>(`${base(collectionId)}/registry/${enc(env)}/tasks${listQuery(options)}`)
    }

    /** Ask the registry how a request went and record it on its passports. POST /dpp/registry/:env/tasks/:taskId/refresh */
    export async function refresh(collectionId: string, env: DppEnvironment, taskId: string): Promise<DppTaskRefreshResult> {
      const out = await post<{ task: DppTaskRefreshResult }>(`${base(collectionId)}/registry/${enc(env)}/tasks/${enc(taskId)}/refresh`, {})
      return out.task
    }
  }
}
