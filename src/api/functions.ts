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
import { post, request, getAppContext } from "../http"

/** A server function's returned value — shape is app-defined, so untyped by default. */
export type FunctionCallResult = any
export interface FunctionListEntry { name: string; visibility?: string; trigger?: string }
export interface FunctionListResponse { functions: FunctionListEntry[] }
/**
 * Options for a function call.
 * - `appId` scopes resolution to one app (recommended; falls back to the SDK app context).
 * - `channel` selects which release to run when addressing an app that is NOT enabled on the
 *   collection (enablement isn't required — the app is resolved directly by id). Defaults to
 *   `stable` server-side, so pass `channel: 'dev'` to test a dev build before installing it.
 */
export interface FunctionCallOptions { appId?: string; channel?: string }

function fnPath(surface: 'public' | 'admin', collectionId: string, name: string, opts: FunctionCallOptions = {}): string {
  const c = encodeURIComponent(collectionId)
  const n = encodeURIComponent(name)
  const app = opts.appId ?? getAppContext()
  const q = opts.channel ? `?channel=${encodeURIComponent(opts.channel)}` : ''
  return app
    ? `/${surface}/collection/${c}/app/${encodeURIComponent(app)}/functions/${n}${q}`
    : `/${surface}/collection/${c}/functions/${n}${q}` // deprecated flat alias
}

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
    const c = encodeURIComponent(collectionId)
    const app = opts.appId ?? getAppContext()
    const q = opts.channel ? `?channel=${encodeURIComponent(opts.channel)}` : ''
    const path = app
      ? `/public/collection/${c}/app/${encodeURIComponent(app)}/functions${q}`
      : `/public/collection/${c}/functions${q}`
    return request<FunctionListResponse>(path)
  }
}
