declare global {
    var __SL_READY__: boolean | undefined;
}
/**
 * Tell the platform this page has finished rendering its content (data loaded, head tags set). The
 * platform's page renderer takes its snapshot for search engines and AI crawlers at this point;
 * without it, it waits for the network to go idle (capped). Call once per page, after your data
 * renders. Harmless anywhere else.
 */
export declare function ready(): void;
