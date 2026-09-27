export { IframeResponder, isAdminFromRoles, buildIframeSrc, } from './iframeResponder.js';
export type { IframeResponderOptions, CachedData, CollectionApp, RouteChangeMessage, SmartlinksIframeMessage, ProxyRequest, CustomProxyRequest, UploadStartMessage, UploadChunkMessage, UploadEndMessage, } from './types/iframeResponder.js';
export declare namespace iframe {
    interface IframeResizeOptions {
        /** Minimum ms between height postMessages (default 100). */
        intervalMs?: number;
        /** Post even if height unchanged (default false). */
        alwaysSend?: boolean;
        /** Additional payload properties to include with each resize message. */
        extra?: Record<string, any>;
        /** Custom message type name (default 'smartlinks:resize'). */
        messageType?: string;
    }
    /** Redirect parent window to a URL (if in iframe). */
    export function redirectParent(url: string): void;
    /** Request parent to adjust iframe height to current content height. */
    export function sendHeight(height?: number, extra?: Record<string, any>): void;
    /** Enable automatic height reporting to parent iframe. */
    export function enableAutoIframeResize(options?: IframeResizeOptions): void;
    /** Disable automatic height reporting. */
    export function disableAutoIframeResize(): void;
    /** Send a custom message to parent (browser-only). */
    export function sendParentCustom(type: string, payload: Record<string, any>): void;
    /**
     * Ask the embedding host (parent window) to hand this app a bearer token, for DIRECT (non-proxied)
     * mode. Posts `{ type: 'smartlinks:request-auth' }` and resolves with the token from the host's
     * `{ type: 'smartlinks:auth', bearerToken }` reply, or `null` on timeout / when not embedded.
     *
     * Use in a first-party/dev embed where the host owns the session and hands it down (the console dev
     * preview), then feed it to the SDK:
     *   SL.initializeApi({ baseURL, proxyMode: false, awaitAuth: true })
     *   SL.iframe.requestParentAuth().then(t => t && SL.setBearerToken(t))
     * Untrusted third-party embeds should use proxyMode instead (never hold the user's token).
     */
    export function requestParentAuth(opts?: {
        timeoutMs?: number;
    }): Promise<string | null>;
    /** Returns true if running inside an iframe (browser). */
    export function isIframe(): boolean;
    /** Returns true if ResizeObserver is supported in current environment. */
    export function supportsResizeObserver(): boolean;
    export {};
}
