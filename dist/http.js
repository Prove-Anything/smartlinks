// src/http.ts
// This module replaces the ApiClient constructor. It keeps baseURL, apiKey, bearerToken
// in module-scope variables, and provides a shared `request<T>(path)` helper that will
// be used by all namespaced files (collection.ts, product.ts, etc.).
let baseURL = null;
let apiKey = undefined;
let bearerToken = undefined;
let proxyMode = false;
let ngrokSkipBrowserWarning = false;
let extraHeadersGlobal = {};
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
    baseURL = options.baseURL.replace(/\/+$/g, "");
    apiKey = options.apiKey;
    bearerToken = options.bearerToken;
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
    logger = options.logger;
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
// Map of pending proxy requests: id -> {resolve, reject}
const proxyPending = {};
function generateProxyId() {
    return "proxy_" + Math.random().toString(36).slice(2) + Date.now();
}
// Shared listener for proxy responses
function ensureProxyListener() {
    if (window._smartlinksProxyListener)
        return;
    window.addEventListener("message", (event) => {
        const msg = event.data;
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
// Proxy request implementation
function serializeFormDataForProxy(fd) {
    const entries = [];
    // FormData#forEach iterates values which can be string | Blob (File extends Blob)
    fd.forEach((value, key) => {
        entries.push([key, value]);
    });
    return { _isFormData: true, entries };
}
async function proxyRequest(method, path, body, headers, options) {
    ensureProxyListener();
    const payloadBody = (typeof FormData !== 'undefined' && body instanceof FormData)
        ? serializeFormDataForProxy(body)
        : body;
    const id = generateProxyId();
    const msg = {
        _smartlinksProxyRequest: true,
        id,
        method,
        path,
        body: payloadBody,
        headers,
        options,
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
 * Internal helper that performs a GET request to \`\${baseURL}\${path}\`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function request(path) {
    if (proxyMode) {
        logDebug('[smartlinks] GET via proxy', { path });
        return proxyRequest("GET", path);
    }
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
    for (const [k, v] of Object.entries(extraHeadersGlobal))
        headers[k] = v;
    logDebug('[smartlinks] GET fetch', { url, headers: redactHeaders(headers) });
    const response = await fetch(url, {
        method: "GET",
        headers,
    });
    logDebug('[smartlinks] GET response', { url, status: response.status, ok: response.ok });
    if (!response.ok) {
        // Try to parse ErrorResponse; if that fails, throw generic
        try {
            const errBody = (await response.json());
            throw new Error(`Error ${errBody.code}: ${errBody.message}`);
        }
        catch (_a) {
            throw new Error(`Request to ${url} failed with status ${response.status}`);
        }
    }
    return (await response.json());
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
        return proxyRequest("POST", path, body, extraHeaders);
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
        try {
            const errBody = (await response.json());
            throw new Error(`Error ${errBody.code}: ${errBody.message}`);
        }
        catch (_a) {
            throw new Error(`Request to ${url} failed with status ${response.status}`);
        }
    }
    return (await response.json());
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
        return proxyRequest("PUT", path, body, extraHeaders);
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
        try {
            const errBody = (await response.json());
            throw new Error(`Error ${errBody.code}: ${errBody.message}`);
        }
        catch (_a) {
            throw new Error(`Request to ${url} failed with status ${response.status}`);
        }
    }
    return (await response.json());
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
        return proxyRequest("PATCH", path, body, extraHeaders);
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
        try {
            const errBody = (await response.json());
            throw new Error(`Error ${errBody.code}: ${errBody.message}`);
        }
        catch (_a) {
            throw new Error(`Request to ${url} failed with status ${response.status}`);
        }
    }
    return (await response.json());
}
/**
 * Internal helper that performs a request to `${baseURL}${path}` with custom options,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function requestWithOptions(path, options) {
    if (proxyMode) {
        logDebug('[smartlinks] requestWithOptions via proxy', { path, method: options.method || 'GET' });
        return proxyRequest(options.method || "GET", path, options.body, options.headers, options);
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
    const headers = Object.assign(Object.assign(Object.assign(Object.assign({ "Content-Type": "application/json" }, (apiKey ? { "X-API-Key": apiKey } : {})), (bearerToken ? { "AUTHORIZATION": `Bearer ${bearerToken}` } : {})), (ngrokSkipBrowserWarning ? { "ngrok-skip-browser-warning": "true" } : {})), extraHeaders);
    // Merge global custom headers (do not override existing keys from options.headers)
    for (const [k, v] of Object.entries(extraHeadersGlobal))
        if (!(k in headers))
            headers[k] = v;
    logDebug('[smartlinks] requestWithOptions fetch', { url, method: options.method || 'GET', headers: redactHeaders(headers), body: safeBodyPreview(options.body) });
    const response = await fetch(url, Object.assign(Object.assign({}, options), { headers }));
    logDebug('[smartlinks] requestWithOptions response', { url, status: response.status, ok: response.ok });
    if (!response.ok) {
        try {
            const errBody = (await response.json());
            throw new Error(`Error ${errBody.code}: ${errBody.message}`);
        }
        catch (_a) {
            throw new Error(`Request to ${url} failed with status ${response.status}`);
        }
    }
    return (await response.json());
}
/**
 * Internal helper that performs a DELETE request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function del(path, extraHeaders) {
    if (proxyMode) {
        logDebug('[smartlinks] DELETE via proxy', { path });
        return proxyRequest("DELETE", path, undefined, extraHeaders);
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
        try {
            const errBody = (await response.json());
            throw new Error(`Error ${errBody.code}: ${errBody.message}`);
        }
        catch (_a) {
            throw new Error(`Request to ${url} failed with status ${response.status}`);
        }
    }
    // If the response is empty, just return undefined
    if (response.status === 204)
        return undefined;
    return (await response.json());
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
        params,
    };
    logDebug('[smartlinks] proxy:custom postMessage', { id, request, params: safeBodyPreview(params) });
    return new Promise((resolve, reject) => {
        proxyPending[id] = { resolve, reject };
        window.parent.postMessage(msg, "*");
        // Optionally: add a timeout here to reject if no response
    });
}
