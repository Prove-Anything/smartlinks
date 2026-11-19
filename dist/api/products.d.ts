import type { StandardQuery, QueryResult, QueryDescription } from "../types/query.js";
import { JsonValue, ProductClaimCreateRequestBody, ProductCreateRequest, ProductQueryRequest, ProductQueryResponse, ProductResponse, ProductUpdateRequest } from "../types/product.js";
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
    /**
     * The standard query on products (admin only): the one query shape every resource is moving to, with
     * counts, totals and filtering by facet. It sits beside `products.query`, whose own body is unchanged.
     * POST /admin/collection/:collectionId/products/standard/query
     *
     * Fields: id, name, description, sku, gtin, schemaType, status, sortOrder, createdAt, updatedAt,
     * facets. Facets are filtered by key: the facet by its key or name, the value by its key or name.
     *
     * ```typescript
     * await products.standardQuery(collectionId, {
     *   where: { facets: { brand: 'Breville', category: { in: ['Toasters', 'Kettles'] } }, status: 'active' },
     *   select: ['id', 'name', 'sku'], count: true,
     * })
     * ```
     */
    function standardQuery(collectionId: string, body?: StandardQuery): Promise<QueryResult>;
    /**
     * What a products standard query can use: its fields and what each can filter, sort, group or total.
     * GET /admin/collection/:collectionId/products/standard/query
     */
    function standardQueryFields(collectionId: string): Promise<QueryDescription>;
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
