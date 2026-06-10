import { JsonValue, ProductClaimCreateRequestBody, ProductCreateRequest, ProductQueryRequest, ProductQueryResponse, ProductResponse, ProductUpdateRequest } from "../types/product";
export declare namespace products {
    function get(collectionId: string, productId: string, admin?: boolean): Promise<ProductResponse>;
    function list(collectionId: string, admin?: boolean): Promise<ProductResponse[]>;
    function create(collectionId: string, data: ProductCreateRequest): Promise<ProductResponse>;
    function update(collectionId: string, productId: string, data: ProductUpdateRequest): Promise<ProductResponse>;
    function remove(collectionId: string, productId: string): Promise<void>;
    /**
     * Query products in a collection with filtering, sorting, and pagination.
     *
     * @param collectionId - Identifier of the parent collection
     * @param body - Query parameters with filters, sorting, and pagination
     * @param admin - When `true`, targets the `/admin` endpoint (requires an
     *   authenticated admin context). Defaults to `false`, which targets the
     *   `/public` endpoint — consistent with `get`, `list`, and `listAssets`.
     * @returns Promise resolving to a ProductQueryResponse
     *
     * @example
     * ```typescript
     * // Public query (default)
     * await products.query(collectionId, { query: { search: 'cabernet' } })
     *
     * // Admin query (authenticated)
     * await products.query(collectionId, { query: { search: 'cabernet' } }, true)
     * ```
     */
    function query(collectionId: string, body: ProductQueryRequest, admin?: boolean): Promise<ProductQueryResponse>;
    function clone(collectionId: string, productId: string, body?: Record<string, JsonValue>): Promise<ProductResponse>;
    function listAssets(collectionId: string, productId: string, admin?: boolean): Promise<unknown>;
    function createClaimWindow(collectionId: string, productId: string, body: Record<string, JsonValue>): Promise<unknown>;
    function updateClaimWindow(collectionId: string, productId: string, claimId: string, body: Record<string, JsonValue>): Promise<unknown>;
    function refresh(collectionId: string, productId: string): Promise<ProductResponse>;
    function getSN(collectionId: string, productId: string, startIndex?: number, count?: number): Promise<unknown>;
    function lookupSN(collectionId: string, productId: string, codeId: string): Promise<unknown>;
    function publicLookupClaim(collectionId: string, productId: string, claimId: string): Promise<unknown>;
    function publicCreateClaim(collectionId: string, productId: string, body: ProductClaimCreateRequestBody): Promise<unknown>;
}
