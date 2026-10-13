// =============================================================================
// site — for apps served as websites (server-rendered on the SmartLinks site runtime).
// =============================================================================
function headerOf(source, name) {
    var _a, _b;
    const headers = typeof Headers !== 'undefined' && source instanceof Headers ? source : source.headers;
    if (!headers)
        return null;
    if (typeof headers.get === 'function')
        return headers.get(name);
    const v = (_a = headers[name]) !== null && _a !== void 0 ? _a : headers[name.toLowerCase()];
    return Array.isArray(v) ? (_b = v[0]) !== null && _b !== void 0 ? _b : null : v !== null && v !== void 0 ? v : null;
}
function parse(raw) {
    try {
        const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!v || typeof v !== 'object' || typeof v.collectionId !== 'string')
            return null;
        const s = v;
        return {
            host: String(s.host || ''),
            collectionId: String(s.collectionId),
            appId: String(s.appId || ''),
            channel: String(s.channel || 'stable'),
            canonicalHost: String(s.canonicalHost || s.host || ''),
        };
    }
    catch (_a) {
        return null;
    }
}
/**
 * On the server: the site this request is rendering. The SmartLinks site router sets it on every
 * request it hands to your site's server (and drops any value a visitor sends). Null outside the
 * site runtime, e.g. in local development without the router: fall back to your dev collection.
 *
 * @example
 *   // TanStack Start server function / loader
 *   const site = SL.site.fromRequest(getRequest())
 *   const products = await SL.product.list(site!.collectionId)
 */
export function fromRequest(request) {
    return parse(headerOf(request, 'x-sl-site'));
}
/** In the browser: the site the page is served as (the router puts it in the page). Null elsewhere. */
export function current() {
    return parse(globalThis.__SMARTLINKS_SITE__);
}
/**
 * @deprecated Sites are server-rendered: crawlers get the finished page from the server, so nothing
 * waits for this signal any more. Kept as a harmless no-op signal for older pages.
 */
export function ready() {
    if (typeof globalThis === 'undefined')
        return;
    globalThis.__SL_READY__ = true;
    const w = typeof window !== 'undefined' ? window : null;
    if (w && typeof w.dispatchEvent === 'function' && typeof w.CustomEvent === 'function') {
        w.dispatchEvent(new w.CustomEvent('smartlinks:ready'));
    }
}
