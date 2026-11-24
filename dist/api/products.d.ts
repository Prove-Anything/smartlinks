import type { StandardQuery, QueryResult, QueryDescription } from "../types/query.js";
import { JsonValue, ProductClaimCreateRequestBody, ProductCreateRequest, ProductQueryMeta, ProductQueryRequest, ProductResponse, ProductUpdateRequest } from "../types/product.js";
import type { AssetResponse } from "../types/asset.js";
import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace products {
    function get(collectionId: string, productId: string, admin?: boolean): Promise<ProductResponse>;
    /**
     * The products in a collection, a page at a time. For searching, filtering and sorting use
     * `products.query`.
     *
     * @param collectionId - Identifier of the parent collection
     * @param admin - When `true`, targets the `/admin` endpoint; otherwise the `/public` one
     * @param options - `limit` (default 50) and `cursor`; `expand: ['facets']` gives each product's facets
     *   as full values instead of their keys
     *
     * @example
     * ```typescript
     * let page = await products.list(collectionId, false, { limit: 50 })
     * while (page.nextCursor) {
     *   page = await products.list(collectionId, false, { limit: 50, cursor: page.nextCursor })
     * }
     *
     * // Admin, with full facet values
     * const { items } = await products.list(collectionId, true, { expand: ['facets'] })
     * ```
     */
    function list(collectionId: string, admin?: boolean, options?: ListOptions & {
        expand?: Array<'facets'>;
    }): Promise<ListResult<ProductResponse>>;
    function create(collectionId: string, data: ProductCreateRequest): Promise<ProductResponse>;
    function update(collectionId: string, productId: string, data: ProductUpdateRequest): Promise<ProductResponse>;
    function remove(collectionId: string, productId: string): Promise<void>;
    /**
     * Query products in a collection with search, filtering, sorting, and paging.
     *
     * @param collectionId - Identifier of the parent collection
     * @param body - `q` (search text), `orderBy`, `createdAt` / `updatedAt` (date ranges), `expand: ['facets']`
     *   and the other filters in `query`, plus `limit` (default 50) and `cursor` for paging
     * @param admin - When `true`, targets the `/admin` endpoint (requires an
     *   authenticated admin context). Defaults to `false`, which targets the
     *   `/public` endpoint — consistent with `get`, `list`, and `listAssets`.
     * @returns Promise resolving to `{ items, nextCursor, count?, meta? }`: the matching products, the cursor
     *   for the next page (null on the last), how many match in all where the server counted, and `meta`
     *   (how the query was run)
     *
     * @example
     * ```typescript
     * // Public query (default)
     * const { items, nextCursor, count } = await products.query(collectionId, { q: 'cabernet', limit: 20 })
     *
     * // The next page: the same query with the cursor
     * if (nextCursor) {
     *   await products.query(collectionId, { q: 'cabernet', limit: 20, cursor: nextCursor })
     * }
     *
     * // Newest first, created this month, active only, with full facet values
     * await products.query(collectionId, {
     *   orderBy: [{ createdAt: 'desc' }],
     *   createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' },
     *   query: { status: ['active'] },
     *   expand: ['facets'],
     * })
     *
     * // Admin query (authenticated)
     * await products.query(collectionId, { q: 'cabernet' }, true)
     * ```
     */
    function query(collectionId: string, body: ProductQueryRequest, admin?: boolean): Promise<ListResult<ProductResponse> & {
        meta?: ProductQueryMeta;
    }>;
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
    /**
     * A product's assets (images, documents), a page at a time.
     *
     * @param admin - When `true`, targets the `/admin` endpoint; otherwise the `/public` one
     * @param options - `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * let page = await products.listAssets(collectionId, productId, false, { limit: 50 })
     * while (page.nextCursor) {
     *   page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    function listAssets(collectionId: string, productId: string, admin?: boolean, options?: ListOptions): Promise<ListResult<AssetResponse>>;
    function createClaimWindow(collectionId: string, productId: string, body: Record<string, JsonValue>): Promise<unknown>;
    function updateClaimWindow(collectionId: string, productId: string, claimId: string, body: Record<string, JsonValue>): Promise<unknown>;
    function refresh(collectionId: string, productId: string): Promise<ProductResponse>;
    function getSN(collectionId: string, productId: string, startIndex?: number, count?: number): Promise<unknown>;
    function lookupSN(collectionId: string, productId: string, codeId: string): Promise<unknown>;
    function publicLookupClaim(collectionId: string, productId: string, claimId: string): Promise<unknown>;
    function publicCreateClaim(collectionId: string, productId: string, body: ProductClaimCreateRequestBody): Promise<unknown>;
}
