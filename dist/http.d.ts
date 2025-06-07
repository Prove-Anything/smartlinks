/**
 * Call this once (e.g. at app startup) to configure baseURL/auth.
 *
 * @param options.baseURL - The root URL of the Smartlinks API (e.g. "https://smartlinks.app/api/v1")
 * @param options.apiKey - (Optional) API key for X-API-Key header
 * @param options.bearerToken - (Optional) Bearer token for AUTHORIZATION header
 */
export declare function initializeApi(options: {
    baseURL: string;
    apiKey?: string;
    bearerToken?: string;
}): void;
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
 * Returns the common headers used for API requests, including apiKey and bearerToken if set.
 */
export declare function getApiHeaders(): Record<string, string>;
