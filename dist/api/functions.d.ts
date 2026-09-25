/** A server function's returned value — shape is app-defined, so untyped by default. */
export type FunctionCallResult = any;
export interface FunctionListEntry {
    name: string;
    visibility?: string;
    trigger?: string;
}
export interface FunctionListResponse {
    functions: FunctionListEntry[];
}
/**
 * Options for a function call.
 * - `appId` scopes resolution to one app (recommended; falls back to the SDK app context).
 * - `channel` selects which release to run when addressing an app that is NOT enabled on the
 *   collection (enablement isn't required — the app is resolved directly by id). Defaults to
 *   `stable` server-side, so pass `channel: 'dev'` to test a dev build before installing it.
 */
export interface FunctionCallOptions {
    appId?: string;
    channel?: string;
}
export declare namespace functions {
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
    function call<T = FunctionCallResult>(collectionId: string, name: string, body?: Record<string, any>, opts?: FunctionCallOptions): Promise<T>;
    /**
     * Call an ADMIN app server function (surface `'admin'`; requires an admin session).
     * App-scoped: `POST /admin/collection/:c/app/:appId/functions/:name`.
     */
    function callAdmin<T = FunctionCallResult>(collectionId: string, name: string, body?: Record<string, any>, opts?: FunctionCallOptions): Promise<T>;
    /**
     * List the public functions available for a collection (discovery). Scoped to one app when an
     * appId is given (or set as the SDK app context): `GET /public/collection/:c[/app/:appId]/functions`.
     */
    function list(collectionId: string, opts?: FunctionCallOptions): Promise<FunctionListResponse>;
}
