// Client-side invocation of app SERVER FUNCTIONS.
//
// The function itself is authored server-side (one contract: `async (ctx, event) => result`,
// see docs/server-functions.md). THIS is how a page/UI actually calls one — the missing
// client half. The PUBLIC route runs a function inline on the caller's own authority (owner if
// signed in via authKit, else public); the ADMIN route runs on the admin surface (needs an admin
// session). The returned value is the function's own result (`event.body` is what you pass here).
import { post, request } from "../http"

/** A server function's returned value — shape is app-defined, so untyped by default. */
export type FunctionCallResult = any
export interface FunctionListEntry { name: string; visibility?: string; trigger?: string }
export interface FunctionListResponse { functions: FunctionListEntry[] }

export namespace functions {
  /**
   * Call a PUBLIC app server function inline.
   * `POST /public/collection/:collectionId/functions/:name` — surface `'public'`.
   *
   * @example
   * const { value } = await SL.functions.call<{ value: number }>(collectionId, 'increment')
   */
  export async function call<T = FunctionCallResult>(
    collectionId: string,
    name: string,
    body: Record<string, any> = {}
  ): Promise<T> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/functions/${encodeURIComponent(name)}`
    return post<T>(path, body)
  }

  /**
   * Call an ADMIN app server function (surface `'admin'`; requires an admin session).
   * `POST /admin/collection/:collectionId/functions/:name`.
   */
  export async function callAdmin<T = FunctionCallResult>(
    collectionId: string,
    name: string,
    body: Record<string, any> = {}
  ): Promise<T> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/functions/${encodeURIComponent(name)}`
    return post<T>(path, body)
  }

  /** List the public functions available for a collection (discovery). `GET /public/collection/:c/functions`. */
  export async function list(collectionId: string): Promise<FunctionListResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/functions`
    return request<FunctionListResponse>(path)
  }
}
