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
export declare function redirectParent(url: string): void;
/** Request parent to adjust iframe height to current content height. */
export declare function sendHeight(height?: number, extra?: Record<string, any>): void;
/** Enable automatic height reporting to parent iframe. */
export declare function enableAutoIframeResize(options?: IframeResizeOptions): void;
/** Disable automatic height reporting. */
export declare function disableAutoIframeResize(): void;
/** Send a custom message to parent (browser-only). */
export declare function sendParentCustom(type: string, payload: Record<string, any>): void;
/** Returns true if running inside an iframe (browser). */
export declare function isIframe(): boolean;
/** Returns true if ResizeObserver is supported in current environment. */
export declare function supportsResizeObserver(): boolean;
export {};
