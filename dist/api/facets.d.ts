import type { FacetDefinition, FacetDefinitionWriteInput, FacetGetParams, FacetListParams, FacetListResponse, FacetNamespaceListResponse, FacetQueryRequest, FacetQueryResponse, FacetValueGetParams, FacetValueListParams, FacetValueListResponse, FacetValueResponse, FacetValueWriteInput, PublicFacetListParams } from "../types/facets.js";
import type { ListOptions } from "../types/list.js";
/**
 * Facet management and aggregation endpoints.
 *
 * Facets are collection-scoped resources mounted directly under `/facets`.
 * Use this namespace to manage facet definitions and values, and to fetch
 * aggregation buckets for browse and filter UIs.
 */
export declare namespace facets {
    /**
     * The collection's facets (admin). A small fixed set: all of them come back in one answer, so there is
     * no `limit` or `cursor` and `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.list('coll_123', { kind: 'custom' })
     * items.map(f => f.key) // ["brand", "material", …]
     * ```
     */
    function list(collectionId: string, params?: FacetListParams): Promise<FacetListResponse>;
    function create(collectionId: string, data: FacetDefinitionWriteInput): Promise<FacetDefinition>;
    function get(collectionId: string, facetKey: string, params?: FacetGetParams): Promise<FacetDefinition>;
    function update(collectionId: string, facetKey: string, data: FacetDefinitionWriteInput): Promise<FacetDefinition>;
    function remove(collectionId: string, facetKey: string): Promise<void>;
    /**
     * One facet and its values (admin), a page at a time. The values are in `items`; pass `nextCursor` back
     * as `cursor` for the next page (null means that was the last one).
     *
     * @param params - `includeDeleted`, plus `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * let page = await facets.listValues('coll_123', 'brand', { limit: 50 })
     * const names = page.items.map(v => v.name)
     * while (page.nextCursor) {
     *   page = await facets.listValues('coll_123', 'brand', { limit: 50, cursor: page.nextCursor })
     *   names.push(...page.items.map(v => v.name))
     * }
     * ```
     */
    function listValues(collectionId: string, facetKey: string, params?: FacetValueListParams): Promise<FacetValueListResponse>;
    function createValue(collectionId: string, facetKey: string, data: FacetValueWriteInput): Promise<FacetValueResponse>;
    function getValue(collectionId: string, facetKey: string, valueKey: string, params?: FacetValueGetParams): Promise<FacetValueResponse>;
    function updateValue(collectionId: string, facetKey: string, valueKey: string, data: FacetValueWriteInput): Promise<FacetValueResponse>;
    function removeValue(collectionId: string, facetKey: string, valueKey: string): Promise<void>;
    /**
     * Facet counts for a set of products (admin): each facet with its values in `items`, and the
     * count for each value in `buckets`. Everything comes back in one answer, so there is no `limit` or
     * `cursor` and `nextCursor` is always null.
     *
     * Which products are counted: `q` (search text), `createdAt` / `updatedAt` (date ranges) and the
     * filters in `query`, the same as `products.query`.
     *
     * @example
     * ```typescript
     * const { items, buckets, meta } = await facets.query('coll_123', {
     *   facetKeys: ['brand', 'material'],
     *   q: 'oak',
     *   createdAt: { gte: '2026-11-01T00:00:00Z' },
     *   query: { facetEquals: { brand: 'acme' } },
     * })
     * ```
     */
    function query(collectionId: string, body: FacetQueryRequest): Promise<FacetQueryResponse>;
    /**
     * The facet namespaces in use (admin). A small fixed set: all the names are in `items`, there is no
     * `limit` or `cursor`, and `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.namespaces('coll_123') // items: string[]
     * ```
     */
    function namespaces(collectionId: string): Promise<FacetNamespaceListResponse>;
    /**
     * The collection's facets (public). A small fixed set: all of them come back in one answer, so there is
     * no `limit` or `cursor` and `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.publicList('coll_123', { namespace: 'catalog' })
     * ```
     */
    function publicList(collectionId: string, params?: PublicFacetListParams): Promise<FacetListResponse>;
    function publicGet(collectionId: string, facetKey: string, params?: PublicFacetListParams): Promise<FacetDefinition>;
    /**
     * One facet and its values (public), a page at a time. The values are in `items`; pass `nextCursor`
     * back as `cursor` for the next page (null means that was the last one).
     *
     * @param options - `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * const { facet, items, nextCursor } = await facets.publicListValues('coll_123', 'brand', { limit: 50 })
     * ```
     */
    function publicListValues(collectionId: string, facetKey: string, options?: ListOptions): Promise<FacetValueListResponse>;
    function publicGetValue(collectionId: string, facetKey: string, valueKey: string): Promise<FacetValueResponse>;
    /**
     * Facet counts for a set of products (public): each facet with its values in `items`, and the
     * count for each value in `buckets`. Everything comes back in one answer, so there is no `limit` or
     * `cursor` and `nextCursor` is always null.
     *
     * Which products are counted: `q` (search text), `createdAt` / `updatedAt` (date ranges) and the
     * filters in `query`, the same as `products.query`.
     *
     * @example
     * ```typescript
     * const { items, buckets } = await facets.publicQuery('coll_123', { facetKeys: ['brand'], q: 'oak' })
     * ```
     */
    function publicQuery(collectionId: string, body: FacetQueryRequest): Promise<FacetQueryResponse>;
    /**
     * The facet namespaces in use (public). A small fixed set: all the names are in `items`, there is no
     * `limit` or `cursor`, and `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.publicNamespaces('coll_123') // items: string[]
     * ```
     */
    function publicNamespaces(collectionId: string): Promise<FacetNamespaceListResponse>;
}
