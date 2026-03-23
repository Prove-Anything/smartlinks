// src/http.ts
// This module replaces the ApiClient constructor. It keeps baseURL, apiKey, bearerToken
// in module-scope variables, and provides a shared `request<T>(path)` helper that will
// be used by all namespaced files (collection.ts, product.ts, etc.).
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { SmartlinksApiError, SmartlinksOfflineError } from "./types/error";
import { idbGet, idbSet, idbClear } from './persistentCache';
let baseURL = null;
let apiKey = undefined;
let bearerToken = undefined;
let proxyMode = false;
let ngrokSkipBrowserWarning = false;
let extraHeadersGlobal = {};
/** Whether initializeApi has been successfully called at least once. */
let initialized = false;
/** Safely returns the current browser hostname, or an empty string in non-browser / Node environments. */
function getSourceDomain() {
    var _a;
    try {
        return (typeof window !== 'undefined' && ((_a = window.location) === null || _a === void 0 ? void 0 : _a.hostname)) || '';
    }
    catch (_b) {
        return '';
    }
}
const httpCache = new Map();
let cacheEnabled = true;
/** Default TTL used when no per-resource rule matches (milliseconds). */
let cacheDefaultTtlMs = 60000; // 60 seconds
/** Maximum number of entries before the oldest (LRU) entry is evicted. */
let cacheMaxEntries = 200;
/** Persistence backend for the L2 cache. 'none' (default) disables IndexedDB persistence. */
let cachePersistence = 'none';
/** When true (default), clear in-memory and sessionStorage caches on page load/refresh. */
let cacheClearOnPageLoad = true;
/**
 * How long L2 (IndexedDB) entries are considered valid as an offline stale fallback,
 * measured from the original network fetch time (default: 7 days).
 * This is independent of the in-memory TTL — it only governs whether a stale
 * L2 entry is served when the network is unavailable.
 */
let cachePersistenceTtlMs = 7 * 24 * 60 * 60000;
/** When true (default), serve stale L2 data via SmartlinksOfflineError on network failure. */
let cacheServeStaleOnOffline = true;
/**
 * Per-resource TTL overrides — checked in order, first match wins.
 *
 * Rules are intentionally specific: they match the collection/product/variant
 * *resource itself* (list or detail) but NOT sub-resources nested beneath them
 * (assets, forms, jobs, app-data, etc.).  The regex requires that nothing except
 * an optional query-string follows the matched segment, e.g.:
 *   ✅  /public/collection/abc123
 *   ✅  /public/collection          (list)
 *   ❌  /public/collection/abc123/asset/xyz   → falls to default TTL
 *   ❌  /public/collection/abc123/form/xyz    → falls to default TTL
 *
 * More-specific / shorter TTLs are listed first so they cannot be shadowed.
 */
const CACHE_TTL_RULES = [
    // Sub-resources that change frequently — short TTLs, listed first
    { pattern: /\/proof\/[^/]*(\?.*)?$/i, ttlMs: 30000 },
    { pattern: /\/attestation\/[^/]*(\?.*)?$/i, ttlMs: 2 * 60000 },
    // Slow-changing top-level resources — long TTLs, matched only when path ends at the ID
    { pattern: /\/products?\/[^/]*(\?.*)?$/i, ttlMs: 60 * 60000 },
    { pattern: /\/variant\/[^/]*(\?.*)?$/i, ttlMs: 60 * 60000 },
    { pattern: /\/collection\/[^/]*(\?.*)?$/i, ttlMs: 60 * 60000 }, // 1 hour
];
function getTtlForPath(path) {
    for (const rule of CACHE_TTL_RULES) {
        if (rule.pattern.test(path))
            return rule.ttlMs;
    }
    return cacheDefaultTtlMs;
}
/** Returns true when this path must always bypass the cache. */
function shouldSkipCache(path) {
    if (!cacheEnabled)
        return true;
    // Never cache auth endpoints — they deal with tokens and session state.
    if (/\/auth\//i.test(path))
        return true;
    return false;
}
/** Evict the oldest (LRU) entry when the cache is at capacity. */
function evictLruIfNeeded() {
    while (httpCache.size >= cacheMaxEntries) {
        const firstKey = httpCache.keys().next().value;
        if (firstKey !== undefined)
            httpCache.delete(firstKey);
        else
            break;
    }
}
/**
 * Clear session-scoped caches (in-memory + sessionStorage) on page load.
 * This ensures that a page refresh always fetches fresh data, while
 * IndexedDB persists for true offline support.
 *
 * Automatically called once when this module loads in a browser environment.
 */
function clearSessionCachesOnPageLoad() {
    if (typeof window === 'undefined')
        return; // Node.js environment
    httpCache.clear();
    try {
        if (typeof sessionStorage !== 'undefined') {
            const sessionKeys = Object.keys(sessionStorage).filter(k => k.startsWith('smartlinks:cache:'));
            sessionKeys.forEach(k => sessionStorage.removeItem(k));
        }
    }
    catch (_a) {
        // Storage may not be available (private browsing, etc.)
    }
}
// Auto-clear session caches on page load (browser only)
if (typeof window !== 'undefined' && cacheClearOnPageLoad) {
    clearSessionCachesOnPageLoad();
}
/**
 * Return cached data for a key if it exists and is within TTL.
 * Promotes the hit to MRU position. Returns null when missing, expired, or in-flight.
 */
function getHttpCacheHit(cacheKey, ttlMs) {
    const entry = httpCache.get(cacheKey);
    if (!entry || entry.promise)
        return null;
    if (Date.now() - entry.timestamp > ttlMs) {
        httpCache.delete(cacheKey);
        return null;
    }
    // Promote to MRU (delete + re-insert at tail of Map)
    httpCache.delete(cacheKey);
    httpCache.set(cacheKey, entry);
    return entry.data;
}
/** Store a resolved response in the cache at MRU position. */
function setHttpCacheEntry(cacheKey, data) {
    httpCache.delete(cacheKey); // ensure insertion at MRU tail
    evictLruIfNeeded();
    httpCache.set(cacheKey, { data, timestamp: Date.now() });
}
/**
 * Auto-invalidate all cached GET entries whose key contains `path`.
 * Called automatically after any mutating request (POST / PUT / PATCH / DELETE).
 * Also sweeps the L2 (IndexedDB) cache when persistence is enabled.
 */
function invalidateCacheForPath(path) {
    for (const key of httpCache.keys()) {
        if (key.includes(path))
            httpCache.delete(key);
    }
    if (cachePersistence !== 'none')
        idbClear(path).catch(() => { });
}
/** Build the lookup key for a given request path. */
function buildCacheKey(path) {
    return proxyMode ? `proxy:${path}` : `${baseURL}${path}`;
}
/**
 * Returns true when an error indicates a network-level failure (no connectivity,
 * DNS failure, etc.) rather than an HTTP-level error response.
 * Also returns true when navigator.onLine is explicitly false.
 * Node-safe: navigator is guarded before access.
 */
function isNetworkError(err) {
    // navigator is not available in Node.js — guard before access
    if (typeof navigator !== 'undefined' && navigator.onLine === false)
        return true;
    // fetch() throws TypeError on network failure; SmartlinksApiError is not a TypeError
    return err instanceof TypeError;
}
let logger;
function logDebug(...args) {
    if (!logger)
        return;
    if (typeof logger === 'function')
        return logger(...args);
    if (logger.debug)
        return logger.debug(...args);
    if (logger.log)
        return logger.log(...args);
}
/** Return whether proxy mode is currently enabled. */
export function isProxyEnabled() {
    return proxyMode;
}
function maskSensitive(value) {
    if (!value)
        return value;
    if (value.length <= 8)
        return '*'.repeat(Math.max(4, value.length));
    return value.slice(0, 2) + '***' + value.slice(-4);
}
function redactHeaders(headers) {
    const h = Object.assign({}, headers);
    for (const key of Object.keys(h)) {
        const k = key.toLowerCase();
        if (k === 'authorization' || k === 'x-api-key' || k === 'auth' || k === 'proxy-authorization') {
            h[key] = maskSensitive(h[key]);
        }
    }
    return h;
}
function safeBodyPreview(body) {
    if (body == null)
        return undefined;
    if (typeof FormData !== 'undefined' && body instanceof FormData)
        return '[FormData]';
    if (typeof body === 'string')
        return body.slice(0, 1000);
    if (typeof body === 'object') {
        const copy = Array.isArray(body) ? [...body] : Object.assign({}, body);
        const redactKeys = ['password', 'token', 'authorization', 'apiKey', 'bearerToken'];
        for (const k of Object.keys(copy)) {
            if (redactKeys.includes(k))
                copy[k] = '[redacted]';
        }
        try {
            return JSON.parse(JSON.stringify(copy));
        }
        catch (_a) {
            return '[Object]';
        }
    }
    return body;
}
/**
 * Normalizes various server error response formats into a consistent ErrorResponse shape.
 * Handles multiple formats:
 * - { code: number, message: string } (standard)
 * - { errorCode: string, errorText: string }
 * - { error: string, message: string }
 * - { error: string } (just error field)
 * - { ok: false, error: string }
 * - Plain string
 *
 * @param responseBody - The parsed JSON response body from the server
 * @param statusCode - HTTP status code
 * @returns Normalized ErrorResponse object
 */
function normalizeErrorResponse(responseBody, statusCode) {
    if (!responseBody || typeof responseBody !== 'object') {
        // Plain string or non-object response
        const message = typeof responseBody === 'string' ? responseBody : 'Request failed';
        return {
            code: statusCode,
            message,
        };
    }
    // Extract all possible fields from the response
    const { code, errorCode, error, message, errorText, ok } = responseBody, rest = __rest(responseBody
    // Determine the error code (prefer numeric code, fall back to errorCode or error string)
    , ["code", "errorCode", "error", "message", "errorText", "ok"]);
    // Determine the error code (prefer numeric code, fall back to errorCode or error string)
    let normalizedCode = statusCode;
    if (typeof code === 'number') {
        normalizedCode = code;
    }
    else if (typeof errorCode === 'string' || typeof error === 'string') {
        // Keep statusCode as numeric code, but preserve the string code in details
    }
    // Determine the error message
    let normalizedMessage;
    if (message) {
        normalizedMessage = String(message);
    }
    else if (errorText) {
        normalizedMessage = String(errorText);
    }
    else if (error) {
        normalizedMessage = String(error);
    }
    else if (ok === false) {
        normalizedMessage = 'Request failed';
    }
    else {
        normalizedMessage = `Request failed with status ${statusCode}`;
    }
    // Extract the server-specific error code string (distinct from HTTP status code)
    let normalizedErrorCode;
    if (errorCode && typeof errorCode === 'string') {
        normalizedErrorCode = errorCode;
    }
    else if (error && typeof error === 'string') {
        normalizedErrorCode = error;
    }
    // Collect any additional details
    const details = Object.assign({}, rest);
    // Preserve error fields in details for backward compatibility
    if (errorCode && typeof errorCode === 'string') {
        details.errorCode = errorCode;
    }
    if (error && typeof error === 'string') {
        details.error = error;
    }
    if (errorText && errorText !== normalizedMessage) {
        details.errorText = errorText;
    }
    if (ok === false) {
        details.ok = ok;
    }
    return {
        code: normalizedCode,
        errorCode: normalizedErrorCode,
        message: normalizedMessage,
        details: Object.keys(details).length > 0 ? details : undefined,
    };
}
/**
 * Call this once (e.g. at app startup) to configure baseURL/auth.
 *
 * @param options - Configuration options
 * @property {string} options.baseURL - The root URL of the Smartlinks API (e.g. "https://smartlinks.app/api/v1")
 * @property {string} [options.apiKey] - (Optional) API key for X-API-Key header
 * @property {string} [options.bearerToken] - (Optional) Bearer token for AUTHORIZATION header
 * @property {boolean} [options.proxyMode] - (Optional) Tells the API that it is running in an iframe via parent proxy
 */
import { iframe } from './iframe';
export function initializeApi(options) {
    // Normalize baseURL by removing trailing slashes.
    const normalizedBaseURL = options.baseURL.replace(/\/+$/g, "");
    // ------------------------------------------------------------------
    // Firebase-style idempotency guard
    // If we have already been initialized with the same baseURL and the
    // caller is not forcing a reset, return immediately.  This prevents
    // any module – widget, component, or re-rendered page – from
    // accidentally wiping runtime state such as a bearerToken that was
    // set by auth.login() after the first initialization.
    // ------------------------------------------------------------------
    if (initialized && !options.force && baseURL === normalizedBaseURL) {
        logDebug('[smartlinks] initializeApi: already initialized with this baseURL – skipping.', { baseURL });
        return;
    }
    baseURL = normalizedBaseURL;
    apiKey = options.apiKey;
    // Only overwrite bearerToken when the caller explicitly supplies one,
    // OR when this is the very first initialization (start with a clean slate).
    // Re-initialization calls that omit bearerToken must NOT clear a token that
    // was acquired at runtime (e.g. from a successful auth.login()).
    if (options.bearerToken !== undefined) {
        bearerToken = options.bearerToken;
    }
    else if (!initialized) {
        bearerToken = undefined;
    }
    // else: preserve the existing runtime bearerToken.
    proxyMode = !!options.proxyMode;
    // Auto-enable ngrok skip header if domain contains .ngrok.io and user did not explicitly set the flag.
    // Infer ngrok usage from common domains (.ngrok.io or .ngrok-free.dev)
    const inferredNgrok = /(\.ngrok\.io|\.ngrok-free\.dev)(\b|\/)/i.test(baseURL);
    ngrokSkipBrowserWarning = options.ngrokSkipBrowserWarning !== undefined
        ? !!options.ngrokSkipBrowserWarning
        : inferredNgrok;
    extraHeadersGlobal = options.extraHeaders ? Object.assign({}, options.extraHeaders) : {};
    // Auto-enable iframe resize unless explicitly disabled
    if (iframe.isIframe() && options.iframeAutoResize !== false) {
        iframe.enableAutoIframeResize();
    }
    // Clear both cache tiers on forced re-initialization so stale data
    // from the previous configuration cannot bleed through.
    if (options.force) {
        httpCache.clear();
        idbClear().catch(() => { });
    }
    logger = options.logger;
    initialized = true;
    logDebug('[smartlinks] initializeApi', {
        baseURL,
        proxyMode,
        inferredNgrok,
        ngrokSkipBrowserWarning,
        extraHeaders: Object.keys(extraHeadersGlobal),
        iframeAutoResizeEnabled: iframe.isIframe() && options.iframeAutoResize !== false,
    });
}
/** Enable/disable automatic "ngrok-skip-browser-warning" header. */
export function setNgrokSkipBrowserWarning(flag) {
    ngrokSkipBrowserWarning = flag;
}
/** Replace or augment globally applied custom headers. */
export function setExtraHeaders(headers) {
    extraHeadersGlobal = Object.assign({}, headers);
}
/**
 * Allows setting the bearerToken at runtime (e.g. after login/logout).
 */
export function setBearerToken(token) {
    bearerToken = token;
}
/**
 * Get the currently configured API base URL.
 * Returns null if initializeApi() has not been called yet.
 */
export function getBaseURL() {
    return baseURL;
}
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
export function isInitialized() {
    return initialized;
}
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
export function hasAuthCredentials() {
    return !!(bearerToken || apiKey);
}
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
 * @param options.clearOnPageLoad     - When `true` (default), clear in-memory and sessionStorage
 *                                      caches on page load/refresh. IndexedDB persists for offline.
 *
 * @example
 * ```ts
 * // Enable IndexedDB persistence for offline support
 * configureSdkCache({ persistence: 'indexeddb' })
 *
 * // Disable cache entirely in test environments
 * configureSdkCache({ enabled: false })
 *
 * // Keep caches across page refreshes (not recommended for production)
 * configureSdkCache({ clearOnPageLoad: false })
 * ```
 */
export function configureSdkCache(options) {
    if (options.enabled !== undefined)
        cacheEnabled = options.enabled;
    if (options.ttlMs !== undefined)
        cacheDefaultTtlMs = options.ttlMs;
    if (options.maxEntries !== undefined)
        cacheMaxEntries = options.maxEntries;
    if (options.persistence !== undefined)
        cachePersistence = options.persistence;
    if (options.persistenceTtlMs !== undefined)
        cachePersistenceTtlMs = options.persistenceTtlMs;
    if (options.serveStaleOnOffline !== undefined)
        cacheServeStaleOnOffline = options.serveStaleOnOffline;
    if (options.clearOnPageLoad !== undefined)
        cacheClearOnPageLoad = options.clearOnPageLoad;
}
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
 * invalidateCache('/product/')          // all legacy singular product responses
 * invalidateCache('/products/')         // all canonical plural product responses
 * ```
 */
export function invalidateCache(urlPattern) {
    if (!urlPattern) {
        httpCache.clear();
        if (cachePersistence !== 'none')
            idbClear().catch(() => { });
        return;
    }
    for (const key of httpCache.keys()) {
        if (key.includes(urlPattern))
            httpCache.delete(key);
    }
    if (cachePersistence !== 'none')
        idbClear(urlPattern).catch(() => { });
}
// Map of pending proxy requests: id -> {resolve, reject}
const proxyPending = {};
const proxyStreamPending = new Map();
function generateProxyId() {
    return "proxy_" + Math.random().toString(36).slice(2) + Date.now();
}
async function createFetchError(response, url) {
    let responseBody;
    try {
        responseBody = await response.json();
    }
    catch (_a) {
        responseBody = null;
    }
    const errBody = normalizeErrorResponse(responseBody, response.status);
    return new SmartlinksApiError(`Error ${errBody.code}: ${errBody.message}`, response.status, errBody, url);
}
function createProxyStreamIterable(id) {
    const queue = [];
    const waiters = [];
    let done = false;
    let failure = null;
    const flushDone = () => {
        while (waiters.length) {
            const waiter = waiters.shift();
            waiter === null || waiter === void 0 ? void 0 : waiter.resolve({ value: undefined, done: true });
        }
    };
    const flushError = (error) => {
        while (waiters.length) {
            const waiter = waiters.shift();
            waiter === null || waiter === void 0 ? void 0 : waiter.reject(error);
        }
    };
    const iterator = {
        next() {
            if (queue.length) {
                return Promise.resolve({ value: queue.shift(), done: false });
            }
            if (failure) {
                return Promise.reject(failure);
            }
            if (done) {
                return Promise.resolve({ value: undefined, done: true });
            }
            return new Promise((resolve, reject) => {
                waiters.push({ resolve, reject });
            });
        },
        async return() {
            if (!done && !failure) {
                done = true;
                proxyStreamPending.delete(id);
                try {
                    window.parent.postMessage({ _smartlinksProxyStreamAbort: true, id }, '*');
                }
                catch (_a) { }
            }
            flushDone();
            return { value: undefined, done: true };
        },
        async throw(error) {
            failure = error || new Error('Proxy stream failed');
            done = true;
            proxyStreamPending.delete(id);
            flushError(failure);
            throw failure;
        },
    };
    return {
        push(value) {
            if (done || failure)
                return;
            const waiter = waiters.shift();
            if (waiter) {
                waiter.resolve({ value, done: false });
                return;
            }
            queue.push(value);
        },
        finish() {
            if (done || failure)
                return;
            done = true;
            proxyStreamPending.delete(id);
            flushDone();
        },
        fail(error) {
            if (done || failure)
                return;
            failure = error;
            done = true;
            proxyStreamPending.delete(id);
            flushError(error);
        },
        iterable: {
            [Symbol.asyncIterator]() {
                return iterator;
            },
        },
    };
}
function parseSsePayload(payload) {
    if (!payload || payload === '[DONE]')
        return undefined;
    try {
        return JSON.parse(payload);
    }
    catch (_a) {
        return undefined;
    }
}
function parseSseStream(stream) {
    return __asyncGenerator(this, arguments, function* parseSseStream_1() {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let dataLines = [];
        while (true) {
            const { done, value } = yield __await(reader.read());
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || '';
            for (const rawLine of lines) {
                const line = rawLine.trimEnd();
                if (!line) {
                    if (!dataLines.length)
                        continue;
                    const parsed = parseSsePayload(dataLines.join('\n'));
                    dataLines = [];
                    if (parsed !== undefined) {
                        yield yield __await(parsed);
                    }
                    continue;
                }
                if (line.startsWith('data:')) {
                    dataLines.push(line.slice(5).trimStart());
                }
            }
        }
        if (dataLines.length) {
            const parsed = parseSsePayload(dataLines.join('\n'));
            if (parsed !== undefined) {
                yield yield __await(parsed);
            }
        }
    });
}
// Shared listener for proxy responses
function ensureProxyListener() {
    if (window._smartlinksProxyListener)
        return;
    window.addEventListener("message", (event) => {
        const msg = event.data;
        if ((msg === null || msg === void 0 ? void 0 : msg._smartlinksProxyStream) && msg.id) {
            const pendingStream = proxyStreamPending.get(msg.id);
            if (!pendingStream)
                return;
            if (msg.phase === 'event') {
                pendingStream.push(msg.data);
                return;
            }
            if (msg.phase === 'end') {
                pendingStream.finish();
                return;
            }
            if (msg.phase === 'error') {
                pendingStream.fail(new Error(msg.error || 'Proxy stream failed'));
                return;
            }
            return;
        }
        if (!msg || !msg._smartlinksProxyResponse || !msg.id)
            return;
        logDebug('[smartlinks] proxy:response', { id: msg.id, ok: !msg.error, keys: Object.keys(msg) });
        const pending = proxyPending[msg.id];
        if (pending) {
            if (msg.error) {
                pending.reject(new Error(msg.error));
            }
            else {
                pending.resolve(msg.data);
            }
            delete proxyPending[msg.id];
        }
    });
    window._smartlinksProxyListener = true;
}
async function proxyStreamRequest(method, path, body, headers) {
    ensureProxyListener();
    const payloadBody = (typeof FormData !== 'undefined' && body instanceof FormData)
        ? serializeFormDataForProxy(body)
        : sanitizeForPostMessage(body);
    const id = generateProxyId();
    const streamController = createProxyStreamIterable(id);
    proxyStreamPending.set(id, streamController);
    const msg = {
        _smartlinksProxyStreamRequest: true,
        id,
        method,
        path,
        body: payloadBody,
        headers,
    };
    logDebug('[smartlinks] proxy:stream postMessage', {
        id,
        method,
        path,
        headers: headers ? redactHeaders(headers) : undefined,
        hasBody: !!body,
    });
    window.parent.postMessage(msg, '*');
    return streamController.iterable;
}
// Proxy request implementation
function serializeFormDataForProxy(fd) {
    const entries = [];
    // FormData#forEach iterates values which can be string | Blob (File extends Blob)
    fd.forEach((value, key) => {
        entries.push([key, value]);
    });
    return { _isFormData: true, entries };
}
function isAbortSignalLike(value) {
    return !!value
        && typeof value === 'object'
        && 'aborted' in value
        && 'addEventListener' in value
        && 'removeEventListener' in value;
}
function sanitizeForPostMessage(value, seen = new WeakSet()) {
    if (value == null)
        return value;
    const valueType = typeof value;
    if (valueType === 'function' || valueType === 'symbol') {
        return undefined;
    }
    if (valueType !== 'object') {
        return value;
    }
    if (typeof Blob !== 'undefined' && value instanceof Blob) {
        return value;
    }
    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return value;
    }
    if (ArrayBuffer.isView(value)) {
        return value;
    }
    if (isAbortSignalLike(value)) {
        return undefined;
    }
    if (seen.has(value)) {
        return undefined;
    }
    seen.add(value);
    if (Array.isArray(value)) {
        return value
            .map(item => sanitizeForPostMessage(item, seen))
            .filter(item => item !== undefined);
    }
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
        return value;
    }
    const sanitizedEntries = Object.entries(value)
        .map(([key, entryValue]) => [key, sanitizeForPostMessage(entryValue, seen)])
        .filter(([, entryValue]) => entryValue !== undefined);
    return Object.fromEntries(sanitizedEntries);
}
function sanitizeProxyRequestOptions(options) {
    if (!options)
        return undefined;
    const _a = options, { signal, body, headers, method, window, duplex } = _a, rest = __rest(_a, ["signal", "body", "headers", "method", "window", "duplex"]);
    void signal;
    void body;
    void headers;
    void method;
    void window;
    void duplex;
    const sanitized = Object.fromEntries(Object.entries(rest).filter(([, value]) => value !== undefined));
    return Object.keys(sanitized).length ? sanitized : undefined;
}
async function proxyRequest(method, path, body, headers, options) {
    ensureProxyListener();
    const payloadBody = (typeof FormData !== 'undefined' && body instanceof FormData)
        ? serializeFormDataForProxy(body)
        : sanitizeForPostMessage(body);
    const id = generateProxyId();
    const msg = {
        _smartlinksProxyRequest: true,
        id,
        method,
        path,
        body: payloadBody,
        headers,
        options: sanitizeProxyRequestOptions(options),
    };
    logDebug('[smartlinks] proxy:postMessage', { id, method, path, headers: headers ? redactHeaders(headers) : undefined, hasBody: !!body });
    return new Promise((resolve, reject) => {
        proxyPending[id] = { resolve, reject };
        window.parent.postMessage(msg, "*");
        // Optionally: add a timeout here to reject if no response
    });
}
/**
 * Upload a FormData payload via proxy with progress events using chunked postMessage.
 * Parent is expected to implement the counterpart protocol.
 */
export async function proxyUploadFormData(path, formData, onProgress) {
    var _a;
    if (!proxyMode) {
        throw new Error('proxyUploadFormData called when proxyMode is disabled');
    }
    ensureProxyListener();
    // Extract file and plain fields
    let fileKey = null;
    let file = null;
    const fields = [];
    formData.forEach((value, key) => {
        const isFile = typeof value !== 'string';
        if (!file && isFile) {
            fileKey = key;
            file = value; // File | Blob in browser
        }
        else {
            fields.push([key, String(value)]);
        }
    });
    if (!file || !fileKey) {
        throw new Error('proxyUploadFormData requires a File/Blob in FormData');
    }
    const id = generateProxyId();
    const headers = getApiHeaders();
    let resolveDone;
    let rejectDone;
    const done = new Promise((resolve, reject) => { resolveDone = resolve; rejectDone = reject; });
    function handleMessage(event) {
        const msg = event.data;
        if (!msg || msg.id !== id)
            return;
        // Unified envelope support
        if (msg._smartlinksProxyUpload === true) {
            if (msg.phase === 'progress' && typeof msg.percent === 'number') {
                try {
                    onProgress && onProgress(Math.max(0, Math.min(100, Math.round(msg.percent))));
                }
                catch (_a) { }
                return;
            }
            if (msg.phase === 'done') {
                window.removeEventListener('message', handleMessage);
                if (msg.ok) {
                    resolveDone(msg.data);
                }
                else {
                    rejectDone(new Error(msg.error || 'Upload failed'));
                }
                return;
            }
            return;
        }
        // Backward-compat flags (older docs)
        if (msg._smartlinksProxyUploadProgress === true && typeof msg.percent === 'number') {
            try {
                onProgress && onProgress(Math.max(0, Math.min(100, Math.round(msg.percent))));
            }
            catch (_b) { }
            return;
        }
        if (msg._smartlinksProxyUploadDone === true) {
            window.removeEventListener('message', handleMessage);
            if (msg.ok) {
                resolveDone(msg.data);
            }
            else {
                rejectDone(new Error(msg.error || 'Upload failed'));
            }
            return;
        }
    }
    window.addEventListener('message', handleMessage);
    // Start
    const startMsg = {
        _smartlinksProxyUpload: true,
        phase: 'start',
        id,
        path,
        method: 'POST',
        headers,
        fields,
        fileInfo: { name: file.name || fileKey, size: file.size || undefined, type: file.type || undefined, key: fileKey },
    };
    window.parent.postMessage(startMsg, '*');
    // Send chunks with simple ack pacing
    const CHUNK_SIZE = 256 * 1024; // 256KB
    const totalSize = (_a = file.size) !== null && _a !== void 0 ? _a : 0;
    let offset = 0;
    let seq = 0;
    while (totalSize && offset < totalSize) {
        const end = Math.min(offset + CHUNK_SIZE, totalSize);
        const blob = file.slice(offset, end);
        // eslint-disable-next-line no-await-in-loop
        const buf = await blob.arrayBuffer();
        const chunkMsg = {
            _smartlinksProxyUpload: true,
            phase: 'chunk',
            id,
            seq,
            chunk: buf,
        };
        window.parent.postMessage(chunkMsg, '*', [buf]);
        // Wait for ack for this seq
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => {
            function onAck(ev) {
                const m = ev.data;
                // Unified envelope ack
                if (m && m._smartlinksProxyUpload === true && m.id === id && m.phase === 'ack' && m.seq === seq) {
                    window.removeEventListener('message', onAck);
                    res();
                    return;
                }
                // Backward-compat ack
                if (m && m._smartlinksProxyUploadAck === true && m.id === id && m.seq === seq) {
                    window.removeEventListener('message', onAck);
                    res();
                }
            }
            window.addEventListener('message', onAck);
        });
        offset = end;
        seq += 1;
    }
    // End
    const endMsg = { _smartlinksProxyUpload: true, phase: 'end', id };
    window.parent.postMessage(endMsg, '*');
    return done;
}
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
export async function request(path) {
    const skipCache = shouldSkipCache(path);
    const cacheKey = buildCacheKey(path);
    const ttl = skipCache ? 0 : getTtlForPath(path);
    if (!skipCache) {
        // 1. L1 hit — return from memory immediately
        const l1 = getHttpCacheHit(cacheKey, ttl);
        if (l1 !== null) {
            logDebug('[smartlinks] GET cache hit (L1)', { path });
            return l1;
        }
        // 2. In-flight deduplication — share an already-pending promise
        const inflight = httpCache.get(cacheKey);
        if (inflight === null || inflight === void 0 ? void 0 : inflight.promise) {
            logDebug('[smartlinks] GET in-flight dedup', { path });
            return inflight.promise;
        }
    }
    // 3. Build the fetch promise.
    //    The IIFE starts synchronously until its first `await`, then the outer
    //    code registers it as the in-flight entry before the await resolves.
    const fetchPromise = (async () => {
        // 3a. L2 (IndexedDB) check — warms L1 from persistent storage without a
        //     network round-trip.  First await → in-flight registration runs before this resolves.
        if (!skipCache && cachePersistence !== 'none') {
            const l2 = await idbGet(cacheKey);
            if (l2 && Date.now() - l2.timestamp <= ttl) {
                logDebug('[smartlinks] GET cache hit (L2)', { path });
                setHttpCacheEntry(cacheKey, l2.data);
                return l2.data;
            }
        }
        // 3b. Network fetch
        try {
            let data;
            if (proxyMode) {
                logDebug('[smartlinks] GET via proxy', { path });
                data = await proxyRequest("GET", path);
            }
            else {
                if (!baseURL) {
                    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
                }
                const url = `${baseURL}${path}`;
                const headers = { "Content-Type": "application/json" };
                if (apiKey)
                    headers["X-API-Key"] = apiKey;
                if (bearerToken)
                    headers["AUTHORIZATION"] = `Bearer ${bearerToken}`;
                if (ngrokSkipBrowserWarning)
                    headers["ngrok-skip-browser-warning"] = "true";
                const _getDomain = getSourceDomain();
                if (_getDomain)
                    headers["X-Source-Domain"] = _getDomain;
                for (const [k, v] of Object.entries(extraHeadersGlobal))
                    headers[k] = v;
                logDebug('[smartlinks] GET fetch', { url, headers: redactHeaders(headers) });
                const response = await fetch(url, { method: "GET", headers });
                logDebug('[smartlinks] GET response', { url, status: response.status, ok: response.ok });
                if (!response.ok) {
                    let responseBody;
                    try {
                        responseBody = await response.json();
                    }
                    catch (_a) {
                        responseBody = null;
                    }
                    const errBody = normalizeErrorResponse(responseBody, response.status);
                    throw new SmartlinksApiError(`Error ${errBody.code}: ${errBody.message}`, response.status, errBody, url);
                }
                data = (await response.json());
            }
            // Persist to L2 on success (fire-and-forget — never blocks the caller)
            if (!skipCache && cachePersistence !== 'none') {
                idbSet(cacheKey, { data, timestamp: Date.now(), persistedAt: Date.now() }).catch(() => { });
            }
            return data;
        }
        catch (fetchErr) {
            // 3c. Offline fallback: when the network fails, serve stale L2 data if
            //     it's still within the persistence TTL window.
            if (!skipCache && cachePersistence !== 'none' && cacheServeStaleOnOffline && isNetworkError(fetchErr)) {
                const l2 = await idbGet(cacheKey);
                if (l2 && Date.now() - l2.timestamp <= cachePersistenceTtlMs) {
                    logDebug('[smartlinks] GET offline fallback (L2)', { path, cachedAt: l2.timestamp });
                    throw new SmartlinksOfflineError('Network unavailable — serving cached data from persistent storage.', l2.data, l2.timestamp);
                }
            }
            throw fetchErr;
        }
    })();
    // Register the in-flight promise so concurrent identical GETs share it.
    // On resolve → promote to L1; on reject → remove so the next call retries.
    if (!skipCache) {
        evictLruIfNeeded();
        httpCache.set(cacheKey, { data: null, timestamp: Date.now(), promise: fetchPromise });
        fetchPromise.then((data) => setHttpCacheEntry(cacheKey, data), () => httpCache.delete(cacheKey));
    }
    return fetchPromise;
}
/**
 * Internal helper that performs a POST request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function post(path, body, extraHeaders) {
    if (proxyMode) {
        logDebug('[smartlinks] POST via proxy', { path, body: safeBodyPreview(body) });
        const result = await proxyRequest("POST", path, body, extraHeaders);
        invalidateCacheForPath(path);
        return result;
    }
    if (!baseURL) {
        throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
    }
    const url = `${baseURL}${path}`;
    const headers = extraHeaders ? Object.assign({}, extraHeaders) : {};
    if (apiKey)
        headers["X-API-Key"] = apiKey;
    if (bearerToken)
        headers["AUTHORIZATION"] = `Bearer ${bearerToken}`;
    if (ngrokSkipBrowserWarning)
        headers["ngrok-skip-browser-warning"] = "true";
    const _postDomain = getSourceDomain();
    if (_postDomain)
        headers["X-Source-Domain"] = _postDomain;
    for (const [k, v] of Object.entries(extraHeadersGlobal))
        if (!(k in headers))
            headers[k] = v;
    // Only set Content-Type for non-FormData bodies
    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    logDebug('[smartlinks] POST fetch', { url, headers: redactHeaders(headers), body: safeBodyPreview(body) });
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
    });
    logDebug('[smartlinks] POST response', { url, status: response.status, ok: response.ok });
    if (!response.ok) {
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch (_a) {
            responseBody = null;
        }
        const errBody = normalizeErrorResponse(responseBody, response.status);
        const message = `Error ${errBody.code}: ${errBody.message}`;
        throw new SmartlinksApiError(message, response.status, errBody, url);
    }
    const postResult = (await response.json());
    invalidateCacheForPath(path);
    return postResult;
}
/**
 * Internal helper that performs a PUT request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function put(path, body, extraHeaders) {
    if (proxyMode) {
        logDebug('[smartlinks] PUT via proxy', { path, body: safeBodyPreview(body) });
        const result = await proxyRequest("PUT", path, body, extraHeaders);
        invalidateCacheForPath(path);
        return result;
    }
    if (!baseURL) {
        throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
    }
    const url = `${baseURL}${path}`;
    const headers = extraHeaders ? Object.assign({}, extraHeaders) : {};
    if (apiKey)
        headers["X-API-Key"] = apiKey;
    if (bearerToken)
        headers["AUTHORIZATION"] = `Bearer ${bearerToken}`;
    if (ngrokSkipBrowserWarning)
        headers["ngrok-skip-browser-warning"] = "true";
    const _putDomain = getSourceDomain();
    if (_putDomain)
        headers["X-Source-Domain"] = _putDomain;
    for (const [k, v] of Object.entries(extraHeadersGlobal))
        if (!(k in headers))
            headers[k] = v;
    // Only set Content-Type for non-FormData bodies
    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    logDebug('[smartlinks] PUT fetch', { url, headers: redactHeaders(headers), body: safeBodyPreview(body) });
    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
    });
    logDebug('[smartlinks] PUT response', { url, status: response.status, ok: response.ok });
    if (!response.ok) {
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch (_a) {
            responseBody = null;
        }
        const errBody = normalizeErrorResponse(responseBody, response.status);
        const message = `Error ${errBody.code}: ${errBody.message}`;
        throw new SmartlinksApiError(message, response.status, errBody, url);
    }
    const putResult = (await response.json());
    invalidateCacheForPath(path);
    return putResult;
}
/**
 * Internal helper that performs a PATCH request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function patch(path, body, extraHeaders) {
    if (proxyMode) {
        logDebug('[smartlinks] PATCH via proxy', { path, body: safeBodyPreview(body) });
        const result = await proxyRequest("PATCH", path, body, extraHeaders);
        invalidateCacheForPath(path);
        return result;
    }
    if (!baseURL) {
        throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
    }
    const url = `${baseURL}${path}`;
    const headers = extraHeaders ? Object.assign({}, extraHeaders) : {};
    if (apiKey)
        headers["X-API-Key"] = apiKey;
    if (bearerToken)
        headers["AUTHORIZATION"] = `Bearer ${bearerToken}`;
    if (ngrokSkipBrowserWarning)
        headers["ngrok-skip-browser-warning"] = "true";
    const _patchDomain = getSourceDomain();
    if (_patchDomain)
        headers["X-Source-Domain"] = _patchDomain;
    for (const [k, v] of Object.entries(extraHeadersGlobal))
        if (!(k in headers))
            headers[k] = v;
    // Only set Content-Type for non-FormData bodies
    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    logDebug('[smartlinks] PATCH fetch', { url, headers: redactHeaders(headers), body: safeBodyPreview(body) });
    const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
    });
    logDebug('[smartlinks] PATCH response', { url, status: response.status, ok: response.ok });
    if (!response.ok) {
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch (_a) {
            responseBody = null;
        }
        const errBody = normalizeErrorResponse(responseBody, response.status);
        const message = `Error ${errBody.code}: ${errBody.message}`;
        throw new SmartlinksApiError(message, response.status, errBody, url);
    }
    const patchResult = (await response.json());
    invalidateCacheForPath(path);
    return patchResult;
}
/**
 * Internal helper that performs a request to `${baseURL}${path}` with custom options,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function requestWithOptions(path, options) {
    const method = (options.method || 'GET').toUpperCase();
    const isGet = method === 'GET';
    const skipCache = isGet ? shouldSkipCache(path) : true;
    const cacheKey = buildCacheKey(path);
    const ttl = !skipCache ? getTtlForPath(path) : 0;
    if (!skipCache) {
        // L1 hit
        const cached = getHttpCacheHit(cacheKey, ttl);
        if (cached !== null) {
            logDebug('[smartlinks] GET cache hit (requestWithOptions/L1)', { path });
            return cached;
        }
        // In-flight dedup
        const inflight = httpCache.get(cacheKey);
        if (inflight === null || inflight === void 0 ? void 0 : inflight.promise) {
            logDebug('[smartlinks] GET in-flight dedup (requestWithOptions)', { path });
            return inflight.promise;
        }
    }
    const fetchPromise = (async () => {
        // L2 (IndexedDB) check for GETs — first await, so in-flight registration runs before it resolves
        if (!skipCache && cachePersistence !== 'none') {
            const l2 = await idbGet(cacheKey);
            if (l2 && Date.now() - l2.timestamp <= ttl) {
                logDebug('[smartlinks] GET cache hit (requestWithOptions/L2)', { path });
                setHttpCacheEntry(cacheKey, l2.data);
                return l2.data;
            }
        }
        try {
            if (proxyMode) {
                logDebug('[smartlinks] requestWithOptions via proxy', { path, method: options.method || 'GET' });
                const result = await proxyRequest(options.method || "GET", path, options.body, options.headers, options);
                if (!isGet) {
                    invalidateCacheForPath(path);
                }
                else if (!skipCache && cachePersistence !== 'none') {
                    idbSet(cacheKey, { data: result, timestamp: Date.now(), persistedAt: Date.now() }).catch(() => { });
                }
                return result;
            }
            if (!baseURL) {
                throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
            }
            const url = `${baseURL}${path}`;
            // Safely merge headers, converting Headers/init to Record<string, string>
            let extraHeaders = {};
            if (options.headers) {
                if (options.headers instanceof Headers) {
                    options.headers.forEach((value, key) => {
                        extraHeaders[key] = value;
                    });
                }
                else if (Array.isArray(options.headers)) {
                    for (const [key, value] of options.headers) {
                        extraHeaders[key] = value;
                    }
                }
                else {
                    extraHeaders = Object.assign({}, options.headers);
                }
            }
            const _rwoDomain = getSourceDomain();
            const headers = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ "Content-Type": "application/json" }, (apiKey ? { "X-API-Key": apiKey } : {})), (bearerToken ? { "AUTHORIZATION": `Bearer ${bearerToken}` } : {})), (ngrokSkipBrowserWarning ? { "ngrok-skip-browser-warning": "true" } : {})), (_rwoDomain ? { "X-Source-Domain": _rwoDomain } : {})), extraHeaders);
            // Merge global custom headers (do not override existing keys from options.headers)
            for (const [k, v] of Object.entries(extraHeadersGlobal))
                if (!(k in headers))
                    headers[k] = v;
            logDebug('[smartlinks] requestWithOptions fetch', { url, method: options.method || 'GET', headers: redactHeaders(headers), body: safeBodyPreview(options.body) });
            const response = await fetch(url, Object.assign(Object.assign({}, options), { headers }));
            logDebug('[smartlinks] requestWithOptions response', { url, status: response.status, ok: response.ok });
            if (!response.ok) {
                let responseBody;
                try {
                    responseBody = await response.json();
                }
                catch (_a) {
                    responseBody = null;
                }
                const errBody = normalizeErrorResponse(responseBody, response.status);
                throw new SmartlinksApiError(`Error ${errBody.code}: ${errBody.message}`, response.status, errBody, url);
            }
            const rwoResult = (await response.json());
            if (!isGet) {
                invalidateCacheForPath(path);
            }
            else if (!skipCache && cachePersistence !== 'none') {
                idbSet(cacheKey, { data: rwoResult, timestamp: Date.now(), persistedAt: Date.now() }).catch(() => { });
            }
            return rwoResult;
        }
        catch (fetchErr) {
            // Offline fallback for GETs
            if (isGet && !skipCache && cachePersistence !== 'none' && cacheServeStaleOnOffline && isNetworkError(fetchErr)) {
                const l2 = await idbGet(cacheKey);
                if (l2 && Date.now() - l2.timestamp <= cachePersistenceTtlMs) {
                    logDebug('[smartlinks] GET offline fallback (requestWithOptions/L2)', { path, cachedAt: l2.timestamp });
                    throw new SmartlinksOfflineError('Network unavailable — serving cached data from persistent storage.', l2.data, l2.timestamp);
                }
            }
            throw fetchErr;
        }
    })();
    // Register in-flight for GET requests
    if (!skipCache) {
        evictLruIfNeeded();
        httpCache.set(cacheKey, { data: null, timestamp: Date.now(), promise: fetchPromise });
        fetchPromise.then((data) => setHttpCacheEntry(cacheKey, data), () => httpCache.delete(cacheKey));
    }
    return fetchPromise;
}
/**
 * Internal helper that performs a streaming request using the shared auth and proxy transport.
 * The response is expected to be `text/event-stream` with JSON payloads in `data:` frames.
 */
export async function requestStream(path, options) {
    const method = (options === null || options === void 0 ? void 0 : options.method) || 'POST';
    const body = options === null || options === void 0 ? void 0 : options.body;
    const extraHeaders = (options === null || options === void 0 ? void 0 : options.headers) || {};
    const headers = Object.assign(Object.assign(Object.assign({}, extraHeaders), getApiHeaders()), { Accept: 'text/event-stream' });
    if (!(typeof FormData !== 'undefined' && body instanceof FormData) && body !== undefined && !Object.keys(headers).some(k => k.toLowerCase() === 'content-type')) {
        headers['Content-Type'] = 'application/json';
    }
    if (proxyMode) {
        logDebug('[smartlinks] stream via proxy', { path, method });
        return proxyStreamRequest(method, path, body, headers);
    }
    if (!baseURL) {
        throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
    }
    const url = `${baseURL}${path}`;
    logDebug('[smartlinks] stream fetch', { url, method, headers: redactHeaders(headers), body: safeBodyPreview(body) });
    const response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : (body instanceof FormData ? body : JSON.stringify(body)),
    });
    logDebug('[smartlinks] stream response', { url, status: response.status, ok: response.ok });
    if (!response.ok) {
        throw await createFetchError(response, url);
    }
    if (!response.body) {
        throw new Error('Streaming response body is unavailable in this environment');
    }
    return parseSseStream(response.body);
}
/**
 * Internal helper that performs a DELETE request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function del(path, extraHeaders) {
    if (proxyMode) {
        logDebug('[smartlinks] DELETE via proxy', { path });
        const result = await proxyRequest("DELETE", path, undefined, extraHeaders);
        invalidateCacheForPath(path);
        return result;
    }
    if (!baseURL) {
        throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
    }
    const url = `${baseURL}${path}`;
    const headers = extraHeaders ? Object.assign({}, extraHeaders) : {};
    if (apiKey)
        headers["X-API-Key"] = apiKey;
    if (bearerToken)
        headers["AUTHORIZATION"] = `Bearer ${bearerToken}`;
    if (ngrokSkipBrowserWarning)
        headers["ngrok-skip-browser-warning"] = "true";
    const _delDomain = getSourceDomain();
    if (_delDomain)
        headers["X-Source-Domain"] = _delDomain;
    for (const [k, v] of Object.entries(extraHeadersGlobal))
        if (!(k in headers))
            headers[k] = v;
    logDebug('[smartlinks] DELETE fetch', { url, headers: redactHeaders(headers) });
    const response = await fetch(url, {
        method: "DELETE",
        headers,
    });
    logDebug('[smartlinks] DELETE response', { url, status: response.status, ok: response.ok });
    if (!response.ok) {
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch (_a) {
            responseBody = null;
        }
        const errBody = normalizeErrorResponse(responseBody, response.status);
        const message = `Error ${errBody.code}: ${errBody.message}`;
        throw new SmartlinksApiError(message, response.status, errBody, url);
    }
    // If the response is empty, just return undefined
    const delResult = response.status === 204 ? undefined : (await response.json());
    invalidateCacheForPath(path);
    return delResult;
}
/**
 * Returns the common headers used for API requests, including apiKey and bearerToken if set.
 */
export function getApiHeaders() {
    const headers = {};
    if (apiKey)
        headers["X-API-Key"] = apiKey;
    if (bearerToken)
        headers["AUTHORIZATION"] = `Bearer ${bearerToken}`;
    if (ngrokSkipBrowserWarning)
        headers["ngrok-skip-browser-warning"] = "true";
    const sourceDomain = getSourceDomain();
    if (sourceDomain)
        headers["X-Source-Domain"] = sourceDomain;
    for (const [k, v] of Object.entries(extraHeadersGlobal))
        if (!(k in headers))
            headers[k] = v;
    return headers;
}
/**
 * Sends a custom proxy message to the parent Smartlinks application when running in an iframe.
 * This function is used to communicate with the parent window when the SDK is embedded in an iframe
 * and proxyMode is enabled. It sends a message to the parent and waits for a response.
 * @param request - The request type string to identify the message type
 * @param params - The parameters object containing data to send to the parent
 * @returns The data from the proxy response
 */
export async function sendCustomProxyMessage(request, params) {
    if (!proxyMode) {
        throw new Error("sendCustomProxyMessage can only be used in proxyMode");
    }
    ensureProxyListener();
    const id = generateProxyId();
    const msg = {
        _smartlinksCustomProxyRequest: true,
        id,
        request,
        params: sanitizeForPostMessage(params),
    };
    logDebug('[smartlinks] proxy:custom postMessage', { id, request, params: safeBodyPreview(params) });
    return new Promise((resolve, reject) => {
        proxyPending[id] = { resolve, reject };
        window.parent.postMessage(msg, "*");
        // Optionally: add a timeout here to reject if no response
    });
}
