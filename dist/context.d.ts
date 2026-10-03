export interface SmartLinksContext {
    collectionId?: string;
    appId?: string;
    productId?: string;
    proofId?: string;
    /**
     * The release channel the host is running this build as (e.g. 'dev' in Forge's preview of a Test
     * build). SL.functions uses it to call that channel's server functions. Absent in production.
     */
    appChannel?: string;
    /** Limits `appChannel` to one app (where several apps share a page, e.g. a portal preview). */
    appChannelApp?: string;
    /** Any other declared view params (e.g. pageId, voteId, orientation, tvMode). */
    [key: string]: string | undefined;
}
/**
 * Merge the app's context from `overrides` (e.g. container props) → URL hash query → URL search,
 * with the FIRST source winning (props override the URL, hash overrides search). Safe in non-browser
 * environments (returns just the overrides). Empty-string values are kept (a param that was set to "").
 *
 * @example
 *   // Works identically whether embedded as a page (URL) or a container (props):
 *   const { collectionId, productId } = SL.readContext(containerProps)
 */
export declare function readContext(overrides?: Record<string, string | undefined>): SmartLinksContext;
