import type { IframeResponderOptions, CachedData } from './types/iframeResponder';
/**
 * Parent-side iframe responder for SmartLinks microapp embedding.
 *
 * Handles all bidirectional communication with embedded iframes:
 * - API proxy requests (with caching)
 * - Authentication state synchronization
 * - Deep linking / route changes
 * - Resize management
 * - Chunked file upload proxying
 *
 * @example
 * ```typescript
 * const responder = new IframeResponder({
 *   collectionId: 'my-collection',
 *   appId: 'warranty',
 *   onAuthLogin: async (token, user) => {
 *     smartlinks.setBearerToken(token);
 *   },
 * });
 *
 * const src = await responder.attach(iframeElement);
 * iframeElement.src = src;
 *
 * // Cleanup
 * responder.destroy();
 * ```
 */
export declare class IframeResponder {
    private iframe;
    private options;
    private cache;
    private uploads;
    private isInitialLoad;
    private messageHandler;
    private resizeHandler;
    private appUrl;
    private ready;
    private resolveReady;
    constructor(options: IframeResponderOptions);
    /**
     * Attach to an iframe element.
     * Returns the src URL to set on the iframe.
     */
    attach(iframe: HTMLIFrameElement): Promise<string>;
    /**
     * Update cached data (e.g., after user logs in).
     */
    updateCache(data: Partial<CachedData>): void;
    /**
     * Cleanup - remove event listeners and clear state.
     */
    destroy(): void;
    private resolveAppUrl;
    private getVersionUrl;
    private buildIframeSrc;
    private calculateViewportHeight;
    private handleMessage;
    private handleRouteChange;
    private handleStandardMessage;
    private handleProxyRequest;
    private getCachedResponse;
    private handleUpload;
    private sendResponse;
}
/**
 * Determine admin status from collection/proof roles.
 */
export declare function isAdminFromRoles(user: {
    uid: string;
} | null | undefined, collection?: {
    roles?: Record<string, any>;
}, proof?: {
    roles?: Record<string, any>;
}): boolean;
/**
 * Build iframe src URL with all context params.
 * Standalone helper for cases where you don't need the full IframeResponder.
 */
export declare function buildIframeSrc(options: {
    appUrl: string;
    collectionId: string;
    appId: string;
    productId?: string;
    proofId?: string;
    isAdmin?: boolean;
    dark?: boolean;
    theme?: {
        primary?: string;
        secondary?: string;
    };
    initialPath?: string;
}): string;
