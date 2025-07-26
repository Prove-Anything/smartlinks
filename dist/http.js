// src/http.ts
// This module replaces the ApiClient constructor. It keeps baseURL, apiKey, bearerToken
// in module-scope variables, and provides a shared `request<T>(path)` helper that will
// be used by all namespaced files (collection.ts, product.ts, etc.).
let baseURL = null;
let apiKey = undefined;
let bearerToken = undefined;
let proxyMode = false;
/**
 * Call this once (e.g. at app startup) to configure baseURL/auth.
 *
 * @param options - Configuration options
 * @property {string} options.baseURL - The root URL of the Smartlinks API (e.g. "https://smartlinks.app/api/v1")
 * @property {string} [options.apiKey] - (Optional) API key for X-API-Key header
 * @property {string} [options.bearerToken] - (Optional) Bearer token for AUTHORIZATION header
 * @property {boolean} [options.proxyMode] - (Optional) Tells the API that it is running in an iframe via parent proxy
 */
export function initializeApi(options) {
    baseURL = options.baseURL.replace(/\/+\$/, ""); // trim trailing slash
    apiKey = options.apiKey;
    bearerToken = options.bearerToken;
    proxyMode = !!options.proxyMode;
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
async function proxyRequest(method, path, body, headers, options) {
    ensureProxyListener();
    const id = generateProxyId();
    const msg = {
        _smartlinksProxyRequest: true,
        id,
        method,
        path,
        body,
        headers,
        options,
    };
    return new Promise((resolve, reject) => {
        proxyPending[id] = { resolve, reject };
        window.parent.postMessage(msg, "*");
        // Optionally: add a timeout here to reject if no response
    });
}
/**
 * Internal helper that performs a GET request to \`\${baseURL}\${path}\`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function request(path) {
    if (proxyMode) {
        return proxyRequest("GET", path);
    }
    if (!baseURL) {
        throw new Error("HTTP client is not initialized. Call initializeApi(...) first.");
    }
    const url = `${baseURL}${path}`;
    const headers = {
        "Content-Type": "application/json",
    };
    if (apiKey) {
        headers["X-API-Key"] = apiKey;
    }
    if (bearerToken) {
        headers["AUTHORIZATION"] = `Bearer ${bearerToken}`;
    }
    const response = await fetch(url, {
        method: "GET",
        headers,
    });
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
    // Only set Content-Type for non-FormData bodies
    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
    });
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
    // Only set Content-Type for non-FormData bodies
    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
    });
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
    const headers = Object.assign(Object.assign(Object.assign({ "Content-Type": "application/json" }, (apiKey ? { "X-API-Key": apiKey } : {})), (bearerToken ? { "AUTHORIZATION": `Bearer ${bearerToken}` } : {})), extraHeaders);
    const response = await fetch(url, Object.assign(Object.assign({}, options), { headers }));
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
    const response = await fetch(url, {
        method: "DELETE",
        headers,
    });
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
    return new Promise((resolve, reject) => {
        proxyPending[id] = { resolve, reject };
        window.parent.postMessage(msg, "*");
        // Optionally: add a timeout here to reject if no response
    });
}
