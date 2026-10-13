declare global {
    var __SL_READY__: boolean | undefined;
    var __SMARTLINKS_SITE__: SiteContext | undefined;
}
/** The site a page is being served as. */
export interface SiteContext {
    /** The hostname this request arrived on (an automatic address, a chosen name or a custom domain). */
    host: string;
    /** The collection the site belongs to: pass it to every SDK call. */
    collectionId: string;
    appId: string;
    /** The release channel being served ('stable' on a live address; 'dev' etc. on a test address). */
    channel: string;
    /** Where search engines consolidate the site (custom domain > chosen name > automatic address). */
    canonicalHost: string;
}
type HeaderSource = {
    headers: Headers | Record<string, string | string[] | undefined>;
} | Headers;
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
export declare function fromRequest(request: HeaderSource): SiteContext | null;
/** In the browser: the site the page is served as (the router puts it in the page). Null elsewhere. */
export declare function current(): SiteContext | null;
/**
 * @deprecated Sites are server-rendered: crawlers get the finished page from the server, so nothing
 * waits for this signal any more. Kept as a harmless no-op signal for older pages.
 */
export declare function ready(): void;
export {};
