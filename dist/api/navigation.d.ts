import type { LinkTarget, ResolveLinkContext, ResolvedLink } from '../types/navigation';
export declare namespace navigation {
    /**
     * Resolve a stored `LinkTarget` into an executable navigation action.
     *
     * The resolver handles the embedded/standalone distinction automatically:
     *
     * | Kind              | Embedded (container/widget/iframe)                            | Standalone        |
     * |-------------------|---------------------------------------------------------------|-------------------|
     * | `external _blank` | `window.open(url, '_blank', 'noopener,noreferrer')`           | same              |
     * | `external _self`  | `window.location.assign(url)`                                 | same              |
     * | `app` / `deep`    | `postMessage` to parent shell; shell appends context params   | hash-route assign |
     *
     * Context params (`collectionId`, `productId`, `proofId`, etc.) are **not**
     * included in the message payload — the parent SmartLinks shell owns them and
     * appends them before broadcasting the navigation event.
     *
     * @example
     *   const r = SL.navigation.resolveLink(config.ctaLink);
     *   r.navigate();                // perform navigation
     *   button.ariaLabel = r.describe();  // human-readable label
     */
    function resolveLink(link: LinkTarget, ctx?: ResolveLinkContext): ResolvedLink;
}
