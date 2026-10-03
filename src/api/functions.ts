// Client-side invocation of app SERVER FUNCTIONS.
//
// The function itself is authored server-side (one contract: `async (ctx, event) => result`,
// see docs/server-functions.md). THIS is how a page/UI actually calls one — the missing
// client half. The PUBLIC route runs a function inline on the caller's own authority (owner if
// signed in via authKit, else public); the ADMIN route runs on the admin surface (needs an admin
// session). The returned value is the function's own result (`event.body` is what you pass here).
//
// ADDRESSING. A function always belongs to an app, so the canonical route is app-scoped:
//   /collection/:c/app/:appId/functions/:name
// The appId comes from `opts.appId`, else the SDK's app context (initializeApi({ appId })) — so an
// app calling its OWN function just writes `SL.functions.call(collectionId, name)`. With no appId
// available, the call falls back to the DEPRECATED flat path `/collection/:c/functions/:name`,
// which the server resolves by bare name and REJECTS with 409 AMBIGUOUS_FUNCTION when more than one
// installed app defines that name. Always prefer an appId.
//
// RELEASE CHANNEL. The channel is part of the URL — /collection/:c/app/:appId/<channel>/functions/:name
// — never a query param (the function owns its query string, and a configured URL such as a webhook
// can only ever hit the channel it names). With NO channel the server runs the release the collection
// has installed, which is what production wants. A channel comes from, in order: `opts.channel`, the
// app's channel (initializeApi({ appChannel }) / setAppChannel), or the host's `appChannel` context
// param (Forge's preview of a Test build passes appChannel=dev). Pass `channel: null` to force the
// installed release regardless.
import { post, request, getAppContext, getAppChannel } from "../http"
import { readContext } from "../context"

/** A server function's returned value — shape is app-defined, so untyped by default. */
export type FunctionCallResult = any
export interface FunctionListEntry { name: string; visibility?: string; trigger?: string }
export interface FunctionListResponse { functions: FunctionListEntry[] }
/**
 * Options for a function call.
 * - `appId` scopes resolution to one app (recommended; falls back to the SDK app context).
 * - `channel` runs a specific release ('dev' | 'alpha' | 'beta' | 'stable') instead of the one the
 *   collection has installed — normally left unset (see RELEASE CHANNEL above); `null` forces the
 *   installed release even when the app/host set a channel. The app must be installed on the
 *   collection, restricted to it (e.g. the developer's sandbox), or a platform-approved public app.
 */
export interface FunctionCallOptions { appId?: string; channel?: string | null }

const CHANNELS = ['dev', 'alpha', 'beta', 'stable']

/**
 * The release channel a call targets, or undefined for "the collection's installed release".
 * A host context `appChannel` can be scoped to ONE app with `appChannelApp` — needed where several
 * apps share a page (Forge's portal preview of a dev component), so only the app under development
 * calls its dev build.
 */
export function resolveFunctionChannel(opts: FunctionCallOptions = {}, appId?: string): string | undefined {
  if (opts.channel === null) return undefined
  let raw = opts.channel ?? getAppChannel()
  if (raw == null) {
    const ctx = readContext()
    const scopedTo = ctx.appChannelApp
    if (ctx.appChannel && (!scopedTo || scopedTo === (appId ?? opts.appId ?? getAppContext()))) raw = ctx.appChannel
  }
  if (!raw) return undefined
  const ch = String(raw).trim().toLowerCase()
  if (!CHANNELS.includes(ch)) throw new Error(`Unknown release channel "${raw}" (expected ${CHANNELS.join(' | ')})`)
  return ch
}

function appBase(surface: 'public' | 'admin', collectionId: string, opts: FunctionCallOptions): string {
  const c = encodeURIComponent(collectionId)
  const app = opts.appId ?? getAppContext()
  if (!app) return `/${surface}/collection/${c}` // deprecated flat alias — resolves installed apps only
  const ch = resolveFunctionChannel(opts, app)
  return `/${surface}/collection/${c}/app/${encodeURIComponent(app)}${ch ? `/${ch}` : ''}`
}

/** The API path a function call goes to (exported for hosts/tests that need the exact URL). */
export function functionPath(surface: 'public' | 'admin', collectionId: string, name: string, opts: FunctionCallOptions = {}): string {
  return `${appBase(surface, collectionId, opts)}/functions/${encodeURIComponent(name)}`
}
const fnPath = functionPath

export namespace functions {
  /**
   * Call a PUBLIC app server function inline (surface `'public'`).
   * App-scoped: `POST /public/collection/:c/app/:appId/functions/:name`.
   *
   * @example
   * // App calling its own function (appId from initializeApi({ appId })):
   * const { value } = await SL.functions.call<{ value: number }>(collectionId, 'pressCounter')
   * // Or address another app explicitly:
   * await SL.functions.call(collectionId, 'pressCounter', {}, { appId: 'my-counter-app' })
   */
  export async function call<T = FunctionCallResult>(
    collectionId: string,
    name: string,
    body: Record<string, any> = {},
    opts: FunctionCallOptions = {}
  ): Promise<T> {
    return post<T>(fnPath('public', collectionId, name, opts), body)
  }

  /**
   * Call an ADMIN app server function (surface `'admin'`; requires an admin session).
   * App-scoped: `POST /admin/collection/:c/app/:appId/functions/:name`.
   */
  export async function callAdmin<T = FunctionCallResult>(
    collectionId: string,
    name: string,
    body: Record<string, any> = {},
    opts: FunctionCallOptions = {}
  ): Promise<T> {
    return post<T>(fnPath('admin', collectionId, name, opts), body)
  }

  /**
   * List the public functions available for a collection (discovery). Scoped to one app when an
   * appId is given (or set as the SDK app context): `GET /public/collection/:c[/app/:appId]/functions`.
   */
  export async function list(collectionId: string, opts: FunctionCallOptions = {}): Promise<FunctionListResponse> {
    return request<FunctionListResponse>(`${appBase('public', collectionId, opts)}/functions`)
  }
}
