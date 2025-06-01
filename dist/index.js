import fetch from 'cross-fetch';
///////////////////////////
// ApiClient Class
///////////////////////////
/**
 * ApiClient for the Smartlinks API.
 * Supports both browser (native fetch) and Node (using cross-fetch).
 */
export class ApiClient {
    /**
     * Creates an instance of ApiClient.
     * @param baseURL - The base URL of the Smartlinks API (e.g., https://smartlinks.app/api/v1)
     * @param apiKey - (Optional) API key for X-API-Key header
     * @param bearerToken - (Optional) Bearer token for AUTHORIZATION header
     *
     * @example
     * // With both API key and bearer token
     * const client = new ApiClient(
     *   'https://smartlinks.app/api/v1',
     *   'your-api-key',
     *   'your-bearer-token'
     * );
     *
     * // With only API key
     * const client = new ApiClient(
     *   'https://smartlinks.app/api/v1',
     *   'your-api-key'
     * );
     *
     * // With only bearer token
     * const client = new ApiClient(
     *   'https://smartlinks.app/api/v1',
     *   undefined,
     *   'your-bearer-token'
     * );
     */
    constructor(baseURL, apiKey, bearerToken) {
        this.baseURL = baseURL.replace(/\/+$/, ''); // Trim trailing slash
        this.apiKey = apiKey;
        this.bearerToken = bearerToken;
    }
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId - Identifier of the collection
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    async getCollection(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}`;
        return this.request(path);
    }
    /**
     * Retrieves a single Product Item by Collection ID and Product ID.
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product item
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    async getProductItem(collectionId, productId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`;
        return this.request(path);
    }
    /**
     * Retrieves a single App Configuration by Collection ID and App ID.
     * @param collectionId - Identifier of the parent collection
     * @param appId - Identifier of the app configuration
     * @returns Promise resolving to an AppConfigurationResponse object
     * @throws ErrorResponse if the request fails
     */
    async getAppConfiguration(collectionId, appId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`;
        return this.request(path);
    }
    /**
     * Internal helper to perform a GET request and parse JSON.
     * @param path - The path (relative to baseURL) to request
     * @returns Promise resolving to the parsed JSON of type T
     * @throws Error if network error or a non-2xx response is returned
     */
    async request(path) {
        const url = `${this.baseURL}${path}`;
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.apiKey) {
            headers['X-API-Key'] = this.apiKey;
        }
        if (this.bearerToken) {
            headers['AUTHORIZATION'] = `Bearer ${this.bearerToken}`;
        }
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            // Attempt to parse error body; if it fails, throw generic
            let errorBody;
            try {
                errorBody = (await response.json());
            }
            catch (_a) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            throw new Error(`Error ${errorBody.code}: ${errorBody.message}`);
        }
        return (await response.json());
    }
}
