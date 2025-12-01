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
    ngrokSkipBrowserWarning?: boolean;
    extraHeaders?: Record<string, string>;
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
 * Sends a custom proxy message to the parent Smartlinks application when running in an iframe.
 * This function is used to communicate with the parent window when the SDK is embedded in an iframe
 * and proxyMode is enabled. It sends a message to the parent and waits for a response.
 * @param request - The request type string to identify the message type
 * @param params - The parameters object containing data to send to the parent
 * @returns The data from the proxy response
 */
export declare function sendCustomProxyMessage<T = any>(request: string, params: any): Promise<T>;
