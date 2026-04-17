// src/api/http.ts
// Escape-hatch namespace for calling arbitrary API endpoints that are not yet
// covered by a dedicated SDK namespace.
//
// Paths are relative to the base URL configured via initializeApi() — which
// already includes "/api/v1".  You only need to supply the path segment that
// comes *after* that prefix:
//
//   ✅  http.post('/public/app/eticket/uploadTickets', { ... })
//   ✅  http.get('/admin/collection/abc123/customReport')
//   ❌  http.post('/api/v1/public/...')  — do NOT repeat the prefix
//
// All methods use the same auth headers (API key / bearer token), proxy mode,
// and caching behaviour as every other SDK namespace.  Errors are thrown as
// SmartlinksApiError — catch them the same way you would for any SDK call.
//
// Example — calling a custom app endpoint:
//
//   import { http } from '@smartlinks/sdk'
//
//   const result = await http.post<{ uploaded: number }>(
//     '/public/app/eticket/uploadTickets',
//     { collectionId, productId, appId, data }
//   )
import { request as _get, post as _post, put as _put, patch as _patch, del as _del, } from '../http';
/** Ensure the path always starts with `/` so it concatenates correctly with baseURL. */
function normalizePath(path) {
    return path.startsWith('/') ? path : `/${path}`;
}
export var http;
(function (http) {
    /**
     * Perform a GET request to any API endpoint.
     *
     * @param path - Path after the base URL, e.g. `'/public/config/fields'`
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     *
     * @example
     * const fields = await http.get<FieldDefinition[]>('/public/config/fields')
     */
    async function get(path) {
        return _get(normalizePath(path));
    }
    http.get = get;
    /**
     * Perform a POST request to any API endpoint.
     *
     * @param path  - Path after the base URL, e.g. `'/public/app/eticket/uploadTickets'`
     * @param body  - Request body (serialized to JSON, or sent as-is for FormData)
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     *
     * @example
     * const result = await http.post('/public/app/eticket/uploadTickets', {
     *   collectionId,
     *   productId,
     *   appId,
     *   data,
     * })
     */
    async function post(path, body) {
        return _post(normalizePath(path), body);
    }
    http.post = post;
    /**
     * Perform a PUT request to any API endpoint.
     *
     * @param path - Path after the base URL
     * @param body - Request body (serialized to JSON, or sent as-is for FormData)
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     */
    async function put(path, body) {
        return _put(normalizePath(path), body);
    }
    http.put = put;
    /**
     * Perform a PATCH request to any API endpoint.
     *
     * @param path - Path after the base URL
     * @param body - Partial request body (serialized to JSON)
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     */
    async function patch(path, body) {
        return _patch(normalizePath(path), body);
    }
    http.patch = patch;
    /**
     * Perform a DELETE request to any API endpoint.
     *
     * @param path - Path after the base URL
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     */
    async function del(path) {
        return _del(normalizePath(path));
    }
    http.del = del;
})(http || (http = {}));
