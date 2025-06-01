/**
 * Represents a Collection object.
 */
export interface CollectionResponse {
    /** Unique identifier for the collection */
    id: string;
    /** Machine‐readable name of the collection */
    name: string;
    /** Human‐readable title of the collection */
    title: string;
    /** URL to the collection’s logo image */
    logoImage: string;
}
/**
 * Represents a Product Item object.
 */
export interface ProductResponse {
    /** Unique identifier for the product */
    id: string;
    /** Name of the product */
    name: string;
    /** Detailed description of the product */
    description: string;
    /** URL to the product’s hero image */
    heroImage: string;
}
/**
 * Represents an App Configuration object.
 */
export interface AppConfigurationResponse {
    /** Unique identifier for the app configuration */
    id: string;
    /** Name of the app configuration */
    name: string;
    /** Key‐value pairs representing configuration settings */
    settings?: Record<string, any>;
}
/**
 * Represents a standardized error response.
 */
export interface ErrorResponse {
    /** Numeric error code */
    code: number;
    /** Human‐readable error message */
    message: string;
}
/**
 * ApiClient for the Smartlinks API.
 * Supports both browser (native fetch) and Node (using cross-fetch).
 */
export declare class ApiClient {
    private baseURL;
    private apiKey?;
    private bearerToken?;
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
    constructor(baseURL: string, apiKey?: string, bearerToken?: string);
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId - Identifier of the collection
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    getCollection(collectionId: string): Promise<CollectionResponse>;
    /**
     * Retrieves a single Product Item by Collection ID and Product ID.
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product item
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    getProductItem(collectionId: string, productId: string): Promise<ProductResponse>;
    /**
     * Retrieves a single App Configuration by Collection ID and App ID.
     * @param collectionId - Identifier of the parent collection
     * @param appId - Identifier of the app configuration
     * @returns Promise resolving to an AppConfigurationResponse object
     * @throws ErrorResponse if the request fails
     */
    getAppConfiguration(collectionId: string, appId: string): Promise<AppConfigurationResponse>;
    /**
     * Internal helper to perform a GET request and parse JSON.
     * @param path - The path (relative to baseURL) to request
     * @returns Promise resolving to the parsed JSON of type T
     * @throws Error if network error or a non-2xx response is returned
     */
    private request;
}
