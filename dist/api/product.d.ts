import { JsonValue, ProductClaimCreateRequestBody, ProductCreateRequest, ProductQueryRequest, ProductQueryResponse, ProductResponse, ProductUpdateRequest } from "../types/product";
type ProductPublicFindParams = Record<string, string | number | boolean | null | undefined | Array<string | number | boolean>>;
export declare namespace product {
    /**
    * @deprecated Use `products.get(...)`.
     * Retrieves a single Product Item by Collection ID and Product ID.
     * @param collectionId – Identifier of the parent collection
     * @param productId    – Identifier of the product item
     * @param admin        – If true, use admin endpoint; otherwise, use public
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, productId: string, admin?: boolean): Promise<ProductResponse>;
    /**
     * @deprecated Use `products.list(...)`.
     * List all Product Items for a Collection.
     * @param collectionId – Identifier of the parent collection
     * @param admin        – If true, use admin endpoint; otherwise, use public
     * @returns Promise resolving to an array of ProductResponse objects
     * @throws ErrorResponse if the request fails
     */
    function list(collectionId: string, admin?: boolean): Promise<ProductResponse[]>;
    /**
     * @deprecated Use `products.create(...)`.
     * Create a new product for a collection (admin only).
     * The `data` payload follows the same shape as ProductResponse minus `id` and `collectionId`.
     *
     * **Hero Image Auto-Fetch:**
     * You can pass `heroImage` as either:
     * - A full asset object: `{ url: '...', thumbnails: {...} }`
     * - A string URL: The system automatically fetches and stores the image
     *
     * @example
     * ```typescript
     * // Using a URL - auto-fetched and stored
     * const product = await product.create(collectionId, {
     *   name: 'Wine Bottle',
     *   description: 'Premium red wine',
     *   heroImage: 'https://example.com/wine.jpg', // Auto-fetched!
     *   data: {}
     * });
     * ```
     *
     * @param collectionId – Identifier of the parent collection
     * @param data – Product creation data (see ProductCreateRequest)
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    function create(collectionId: string, data: ProductCreateRequest): Promise<ProductResponse>;
    /**
     * @deprecated Use `products.update(...)`.
     * Update a product for a collection (admin only).
     * The `data` payload is a partial of ProductResponse minus `id` and `collectionId`.
     *
     * **Hero Image Auto-Fetch:**
     * You can pass `heroImage` as either:
     * - A full asset object: `{ url: '...', thumbnails: {...} }`
     * - A string URL: The system automatically fetches and stores the image
     *
     * @example
     * ```typescript
     * // Update with new URL - auto-fetched and stored
     * const product = await product.update(collectionId, productId, {
     *   heroImage: 'https://example.com/new-wine.jpg' // Auto-fetched!
     * });
     * ```
     *
     * @param collectionId – Identifier of the parent collection
     * @param productId – Identifier of the product
     * @param data – Product update data (see ProductUpdateRequest)
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    function update(collectionId: string, productId: string, data: ProductUpdateRequest): Promise<ProductResponse>;
    /**
     * @deprecated Use `products.remove(...)`.
     * Delete a product for a collection (admin only).
     * @param collectionId – Identifier of the parent collection
     * @param productId – Identifier of the product
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    function remove(collectionId: string, productId: string): Promise<void>;
    /**
     * @deprecated Legacy compatibility endpoint only. Use `products.query(...)` for new integrations.
     */
    function find(collectionId: string, body: ProductQueryRequest): Promise<ProductQueryResponse>;
    /**
     * @deprecated Legacy compatibility endpoint only. Use `products.get(...)` when the product id is known.
     */
    function publicFind(collectionId: string, params?: ProductPublicFindParams): Promise<ProductResponse[]>;
    /**
     * @deprecated Use `products.clone(...)`.
     */
    function clone(collectionId: string, productId: string, body?: Record<string, JsonValue>): Promise<ProductResponse>;
    /**
     * @deprecated Use `products.listAssets(...)`.
     */
    function listAssets(collectionId: string, productId: string, admin?: boolean): Promise<unknown>;
    /**
     * @deprecated Use `products.createClaimWindow(...)`.
     */
    function createClaimWindow(collectionId: string, productId: string, body: Record<string, JsonValue>): Promise<unknown>;
    /**
     * @deprecated Use `products.updateClaimWindow(...)`.
     */
    function updateClaimWindow(collectionId: string, productId: string, claimId: string, body: Record<string, JsonValue>): Promise<unknown>;
    /**
     * @deprecated Use `products.refresh(...)`.
     */
    function refresh(collectionId: string, productId: string): Promise<ProductResponse>;
    /**
     * @deprecated Use `products.getSN(...)`.
     * Get serial numbers for a product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    function getSN(collectionId: string, productId: string, startIndex?: number, count?: number): Promise<unknown>;
    /**
     * @deprecated Use `products.lookupSN(...)`.
     * Look up a serial number by code for a product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    function lookupSN(collectionId: string, productId: string, codeId: string): Promise<unknown>;
    /**
     * @deprecated Use `products.publicLookupClaim(...)`.
     */
    function publicLookupClaim(collectionId: string, productId: string, claimId: string): Promise<unknown>;
    /**
     * @deprecated Use `products.publicCreateClaim(...)`.
     */
    function publicCreateClaim(collectionId: string, productId: string, body: ProductClaimCreateRequestBody): Promise<unknown>;
}
export {};
