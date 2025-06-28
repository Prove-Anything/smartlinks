/**
 * Call this once (e.g. at app startup) to configure baseURL/auth.
 *
 * @param options - Configuration options
 * @property {string} options.baseURL - The root URL of the Smartlinks API (e.g. "https://smartlinks.app/api/v1")
 * @property {string} [options.apiKey] - (Optional) API key for X-API-Key header
 * @property {string} [options.bearerToken] - (Optional) Bearer token for AUTHORIZATION header
 * @property {boolean} [options.proxyMode] - (Optional) Tells the API that it is running in an iframe via parent proxy
 */
export declare function initializeApi(options: {
    baseURL: string;
    apiKey?: string;
    bearerToken?: string;
    proxyMode?: boolean;
}): void;
/**
 * Allows setting the bearerToken at runtime (e.g. after login/logout).
 */
export declare function setBearerToken(token: string | undefined): void;
/**
 * Internal helper that performs a GET request to \`\${baseURL}\${path}\`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
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
 * Sends a custom proxy message in proxyMode and waits for a matching reply.
 * @param request - The request type string
 * @param params - The parameters object
 * @returns The data from the proxy response
 */
export declare function sendCustomProxyMessage<T = any>(request: string, params: any): Promise<T>;
