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
 * - `channel` runs a specific release ('dev' | 'alpha' | 'beta' | 'stable') instead of the one the
 *   collection has installed — normally left unset (see RELEASE CHANNEL above); `null` forces the
 *   installed release even when the app/host set a channel. The app must be installed on the
 *   collection, restricted to it (e.g. the developer's sandbox), or a platform-approved public app.
 */
export interface FunctionCallOptions {
    appId?: string;
    channel?: string | null;
}
/**
 * The release channel a call targets, or undefined for "the collection's installed release".
 * A host context `appChannel` can be scoped to ONE app with `appChannelApp` — needed where several
 * apps share a page (Forge's portal preview of a dev component), so only the app under development
 * calls its dev build.
 */
export declare function resolveFunctionChannel(opts?: FunctionCallOptions, appId?: string): string | undefined;
/** The API path a function call goes to (exported for hosts/tests that need the exact URL). */
export declare function functionPath(surface: 'public' | 'admin', collectionId: string, name: string, opts?: FunctionCallOptions): string;
/** Options for {@link functions.siteUrl}. */
export interface FunctionSiteUrlOptions {
    /** Release channel ('dev' | 'alpha' | 'beta' | 'stable'); omit for the collection's installed release. */
    channel?: string;
    /** Sub-path after the function name, e.g. "/orders/123" (the function must declare trigger.path). */
    path?: string;
    /** Query parameters to append. */
    query?: Record<string, string>;
    /** Use this host instead of the collection's siteHost (e.g. its connected custom domain). */
    host?: string;
}
export declare namespace functions {
    /**
     * The PUBLIC address of an app function on the collection's own site — what you give a third party
     * as a webhook URL, or call from the collection's public pages:
     * `https://<siteHost>/_fn/<appId>[/<channel>]/<name>[/<path>]`.
     * Every HTTP method the function declares works there, with the raw body for signature checks.
     * Pass the collection (or its siteHost). This address is for public/integration calls; signed-in
     * calls from your app keep using {@link call} / {@link callAdmin}, so the user's SmartLinks session
     * never goes to a tenant hostname.
     *
     * @example
     * const col = await SL.collection.get(collectionId)
     * const hookUrl = SL.functions.siteUrl(col, 'stripeWebhook', { appId: 'my-shop' })
     * // → https://acme.smartlinks.host/_fn/my-shop/stripeWebhook
     */
    function siteUrl(collection: {
        siteHost?: string | null;
    } | string, name: string, opts?: FunctionSiteUrlOptions & {
        appId?: string;
    }): string;
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
