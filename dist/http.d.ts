type Logger = {
    debug?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    error?: (...args: any[]) => void;
    log?: (...args: any[]) => void;
} | ((...args: any[]) => void);
/** Return whether proxy mode is currently enabled. */
export declare function isProxyEnabled(): boolean;
export declare function initializeApi(options: {
    baseURL: string;
    apiKey?: string;
    bearerToken?: string;
    proxyMode?: boolean;
    ngrokSkipBrowserWarning?: boolean;
    extraHeaders?: Record<string, string>;
    iframeAutoResize?: boolean;
    logger?: Logger;
    /**
     * When true, bypasses the idempotency guard and forces a full re-initialization.
     * Use only when you intentionally need to reset all SDK state (e.g. in tests or
     * when switching accounts). In normal application code, prefer letting the guard
     * protect runtime state such as login tokens.
     */
    force?: boolean;
}): void;
/** Enable/disable automatic "ngrok-skip-browser-warning" header. */
export declare function setNgrokSkipBrowserWarning(flag: boolean): void;
/** Replace or augment globally applied custom headers. */
export declare function setExtraHeaders(headers: Record<string, string>): void;
/**
 * Allows setting the bearerToken at runtime (e.g. after login/logout).
 */
export declare function setBearerToken(token: string | undefined): void;
/**
 * Get the currently configured API base URL.
 * Returns null if initializeApi() has not been called yet.
 */
export declare function getBaseURL(): string | null;
/**
 * Returns true if initializeApi() has been called at least once.
 * Useful for guards in widgets or shared modules that want to skip
 * initialization when another module has already done it.
 *
 * @example
 * ```ts
 * if (!isInitialized()) {
 *   initializeApi({ baseURL: 'https://smartlinks.app/api/v1' })
 * }
 * ```
 */
export declare function isInitialized(): boolean;
/**
 * Returns true if the SDK currently has any auth credential set (bearer token
 * or API key). Use this as a cheap pre-flight check before calling endpoints
 * that require authentication, to avoid issuing a network request that you
 * already know will return a 401.
 *
 * @example
 * ```ts
 * if (hasAuthCredentials()) {
 *   const account = await auth.getAccount()
 * }
 * ```
 */
export declare function hasAuthCredentials(): boolean;
/**
 * Configure the SDK's built-in in-memory GET cache.
 *
 * The cache is transparent — it sits inside the HTTP layer and requires no
 * changes to your existing API calls. All GET requests benefit automatically.
 *
 * @param options.enabled             - Turn caching on/off entirely (default: `true`)
 * @param options.ttlMs               - Default time-to-live in milliseconds (default: `60_000`).
 *                                      Per-resource rules (collections/products → 1 h,
 *                                      proofs → 30 s, etc.) override this value.
 * @param options.maxEntries          - L1 LRU eviction threshold (default: `200`)
 * @param options.persistence         - Enable IndexedDB L2 cache (`'indexeddb'`) or keep
 *                                      in-memory only (`'none'`, default). Ignored in Node.js.
 * @param options.persistenceTtlMs    - How long L2 entries are eligible as an offline stale
 *                                      fallback, from the original fetch time (default: 7 days).
 * @param options.serveStaleOnOffline - When `true` (default) and persistence is on, throw
 *                                      `SmartlinksOfflineError` with stale data instead of
 *                                      propagating the network error.
 *
 * @example
 * ```ts
 * // Enable IndexedDB persistence for offline support
 * configureSdkCache({ persistence: 'indexeddb' })
 *
 * // Disable cache entirely in test environments
 * configureSdkCache({ enabled: false })
 * ```
 */
export declare function configureSdkCache(options: {
    enabled?: boolean;
    ttlMs?: number;
    maxEntries?: number;
    persistence?: 'none' | 'indexeddb';
    persistenceTtlMs?: number;
    serveStaleOnOffline?: boolean;
}): void;
/**
 * Manually invalidate entries in the SDK's GET cache.
 *
 * @param urlPattern - Optional substring match. Every cache entry whose key
 *   *contains* this string is removed. Omit (or pass `undefined`) to wipe the
 *   entire cache.
 *
 * @example
 * ```ts
 * invalidateCache()                     // clear everything
 * invalidateCache('/collection/abc123') // one specific collection
 * invalidateCache('/product/')          // all product responses
 * ```
 */
export declare function invalidateCache(urlPattern?: string): void;
/**
 * Upload a FormData payload via proxy with progress events using chunked postMessage.
 * Parent is expected to implement the counterpart protocol.
 */
export declare function proxyUploadFormData<T>(path: string, formData: FormData, onProgress?: (percent: number) => void): Promise<T>;
/**
 * Internal helper that performs a GET request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 *
 * Cache pipeline (when caching is not skipped):
 *   L1 hit  → return from memory (no I/O)
 *   L2 hit  → return from IndexedDB, promote to L1 (no network)
 *   Miss    → fetch from network, store in L1 + L2
 *   Offline → serve stale L2 entry via SmartlinksOfflineError (if persistence enabled)
 *
 * Concurrent identical GETs share one in-flight promise (deduplication).
 * Node-safe: IndexedDB calls are no-ops when IDB is unavailable.
 */
export declare function request<T>(path: string): Promise<T>;
/**
 * Internal helper that performs a POST request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export declare function post<T>(path: string, body: any, extraHeaders?: Record<string, string>): Promise<T>;
/**
 * Internal helper that performs a PUT request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export declare function put<T>(path: string, body: any, extraHeaders?: Record<string, string>): Promise<T>;
/**
 * Internal helper that performs a PATCH request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export declare function patch<T>(path: string, body: any, extraHeaders?: Record<string, string>): Promise<T>;
/**
 * Internal helper that performs a request to `${baseURL}${path}` with custom options,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export declare function requestWithOptions<T>(path: string, options: RequestInit): Promise<T>;
/**
 * Internal helper that performs a DELETE request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export declare function del<T>(path: string, extraHeaders?: Record<string, string>): Promise<T>;
/**
 * Returns the common headers used for API requests, including apiKey and bearerToken if set.
 */
export declare function getApiHeaders(): Record<string, string>;
/**
 * Sends a custom proxy message to the parent Smartlinks application when running in an iframe.
 * This function is used to communicate with the parent window when the SDK is embedded in an iframe
 * and proxyMode is enabled. It sends a message to the parent and waits for a response.
 * @param request - The request type string to identify the message type
 * @param params - The parameters object containing data to send to the parent
 * @returns The data from the proxy response
 */
export declare function sendCustomProxyMessage<T = any>(request: string, params: any): Promise<T>;
export {};
