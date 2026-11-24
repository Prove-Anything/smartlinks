import type { FacetDefinition, FacetDefinitionWriteInput, FacetGetParams, FacetListParams, FacetListResponse, FacetNamespaceListResponse, FacetQueryRequest, FacetQueryResponse, FacetValueGetParams, FacetValueListParams, FacetValueListResponse, FacetValueResponse, FacetValueWriteInput, PublicFacetListParams } from "../types/facets.js";
/**
 * Facet management and aggregation endpoints.
 *
 * Facets are collection-scoped resources mounted directly under `/facets`.
 * Use this namespace to manage facet definitions and values, and to fetch
 * aggregation buckets for browse and filter UIs.
 */
export declare namespace facets {
    /**
     * The collection's facets (admin). All of them come back in one answer: `nextCursor` is always null.
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
     * One facet and all its values (admin). The values are in `items`; `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { facet, items } = await facets.listValues('coll_123', 'brand')
     * items.map(v => v.name)
     * ```
     */
    function listValues(collectionId: string, facetKey: string, params?: FacetValueListParams): Promise<FacetValueListResponse>;
    function createValue(collectionId: string, facetKey: string, data: FacetValueWriteInput): Promise<FacetValueResponse>;
    function getValue(collectionId: string, facetKey: string, valueKey: string, params?: FacetValueGetParams): Promise<FacetValueResponse>;
    function updateValue(collectionId: string, facetKey: string, valueKey: string, data: FacetValueWriteInput): Promise<FacetValueResponse>;
    function removeValue(collectionId: string, facetKey: string, valueKey: string): Promise<void>;
    /**
     * Facet counts for a set of products (admin): each facet with its values in `items`, and the
     * count for each value in `buckets`. Everything comes back in one answer: `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items, buckets, meta } = await facets.query('coll_123', {
     *   facetKeys: ['brand', 'material'],
     *   query: { facetEquals: { brand: 'acme' } },
     * })
     * ```
     */
    function query(collectionId: string, body: FacetQueryRequest): Promise<FacetQueryResponse>;
    /**
     * The facet namespaces in use (admin). The names are in `items`; `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.namespaces('coll_123') // items: string[]
     * ```
     */
    function namespaces(collectionId: string): Promise<FacetNamespaceListResponse>;
    /**
     * The collection's facets (public). All of them come back in one answer: `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.publicList('coll_123', { namespace: 'catalog' })
     * ```
     */
    function publicList(collectionId: string, params?: PublicFacetListParams): Promise<FacetListResponse>;
    function publicGet(collectionId: string, facetKey: string, params?: PublicFacetListParams): Promise<FacetDefinition>;
    /**
     * One facet and all its values (public). The values are in `items`; `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { facet, items } = await facets.publicListValues('coll_123', 'brand')
     * ```
     */
    function publicListValues(collectionId: string, facetKey: string): Promise<FacetValueListResponse>;
    function publicGetValue(collectionId: string, facetKey: string, valueKey: string): Promise<FacetValueResponse>;
    /**
     * Facet counts for a set of products (public): each facet with its values in `items`, and the
     * count for each value in `buckets`. Everything comes back in one answer: `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items, buckets } = await facets.publicQuery('coll_123', { facetKeys: ['brand'] })
     * ```
     */
    function publicQuery(collectionId: string, body: FacetQueryRequest): Promise<FacetQueryResponse>;
    /**
     * The facet namespaces in use (public). The names are in `items`; `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.publicNamespaces('coll_123') // items: string[]
     * ```
     */
    function publicNamespaces(collectionId: string): Promise<FacetNamespaceListResponse>;
}
