// src/http.ts
// This module replaces the ApiClient constructor. It keeps baseURL, apiKey, bearerToken
// in module-scope variables, and provides a shared `request<T>(path)` helper that will
// be used by all namespaced files (collection.ts, product.ts, etc.).
let baseURL = null;
let apiKey = undefined;
let bearerToken = undefined;
/**
 * Call this once (e.g. at app startup) to configure baseURL/auth.
 *
 * @param options.baseURL - The root URL of the Smartlinks API (e.g. "https://smartlinks.app/api/v1")
 * @param options.apiKey - (Optional) API key for X-API-Key header
 * @param options.bearerToken - (Optional) Bearer token for AUTHORIZATION header
 */
export function initializeApi(options) {
    baseURL = options.baseURL.replace(/\/+\$/, ""); // trim trailing slash
    apiKey = options.apiKey;
    bearerToken = options.bearerToken;
}
/**
 * Internal helper that performs a GET request to \`\${baseURL}\${path}\`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function request(path) {
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
