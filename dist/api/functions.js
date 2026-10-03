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
import { post, request, getAppContext, getAppChannel } from "../http.js";
import { readContext } from "../context.js";
const CHANNELS = ['dev', 'alpha', 'beta', 'stable'];
/**
 * The release channel a call targets, or undefined for "the collection's installed release".
 * A host context `appChannel` can be scoped to ONE app with `appChannelApp` — needed where several
 * apps share a page (Forge's portal preview of a dev component), so only the app under development
 * calls its dev build.
 */
export function resolveFunctionChannel(opts = {}, appId) {
    var _a, _b;
    if (opts.channel === null)
        return undefined;
    let raw = (_a = opts.channel) !== null && _a !== void 0 ? _a : getAppChannel();
    if (raw == null) {
        const ctx = readContext();
        const scopedTo = ctx.appChannelApp;
        if (ctx.appChannel && (!scopedTo || scopedTo === ((_b = appId !== null && appId !== void 0 ? appId : opts.appId) !== null && _b !== void 0 ? _b : getAppContext())))
            raw = ctx.appChannel;
    }
    if (!raw)
        return undefined;
    const ch = String(raw).trim().toLowerCase();
    if (!CHANNELS.includes(ch))
        throw new Error(`Unknown release channel "${raw}" (expected ${CHANNELS.join(' | ')})`);
    return ch;
}
function appBase(surface, collectionId, opts) {
    var _a;
    const c = encodeURIComponent(collectionId);
    const app = (_a = opts.appId) !== null && _a !== void 0 ? _a : getAppContext();
    if (!app)
        return `/${surface}/collection/${c}`; // deprecated flat alias — resolves installed apps only
    const ch = resolveFunctionChannel(opts, app);
    return `/${surface}/collection/${c}/app/${encodeURIComponent(app)}${ch ? `/${ch}` : ''}`;
}
/** The API path a function call goes to (exported for hosts/tests that need the exact URL). */
export function functionPath(surface, collectionId, name, opts = {}) {
    return `${appBase(surface, collectionId, opts)}/functions/${encodeURIComponent(name)}`;
}
const fnPath = functionPath;
export var functions;
(function (functions) {
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
    function siteUrl(collection, name, opts = {}) {
        var _a, _b;
        const host = opts.host || (typeof collection === 'string' ? collection : collection && collection.siteHost);
        if (!host)
            throw new Error('functions.siteUrl: the collection has no siteHost (fetch it with SL.collection.get)');
        const app = (_a = opts.appId) !== null && _a !== void 0 ? _a : getAppContext();
        if (!app)
            throw new Error('functions.siteUrl: appId required (pass it, or initializeApi({ appId }))');
        const ch = resolveFunctionChannel({ channel: (_b = opts.channel) !== null && _b !== void 0 ? _b : null }, app);
        const sub = opts.path ? '/' + String(opts.path).replace(/^\/+/, '') : '';
        const qs = opts.query && Object.keys(opts.query).length ? '?' + new URLSearchParams(opts.query).toString() : '';
        return `https://${String(host).replace(/^https?:\/\//, '').replace(/\/+$/, '')}/_fn/${encodeURIComponent(app)}${ch ? `/${ch}` : ''}/${encodeURIComponent(name)}${sub}${qs}`;
    }
    functions.siteUrl = siteUrl;
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
    async function call(collectionId, name, body = {}, opts = {}) {
        return post(fnPath('public', collectionId, name, opts), body);
    }
    functions.call = call;
    /**
     * Call an ADMIN app server function (surface `'admin'`; requires an admin session).
     * App-scoped: `POST /admin/collection/:c/app/:appId/functions/:name`.
     */
    async function callAdmin(collectionId, name, body = {}, opts = {}) {
        return post(fnPath('admin', collectionId, name, opts), body);
    }
    functions.callAdmin = callAdmin;
    /**
     * List the public functions available for a collection (discovery). Scoped to one app when an
     * appId is given (or set as the SDK app context): `GET /public/collection/:c[/app/:appId]/functions`.
     */
    async function list(collectionId, opts = {}) {
        return request(`${appBase('public', collectionId, opts)}/functions`);
    }
    functions.list = list;
})(functions || (functions = {}));
