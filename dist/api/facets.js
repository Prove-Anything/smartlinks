import { del, post, put, request } from "../http.js";
import { listQuery } from "../list.js";
function appendSearchParam(searchParams, key, value) {
    if (value === undefined || value === null)
        return;
    searchParams.set(key, String(value));
}
function buildQueryString(params) {
    if (!params)
        return "";
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        appendSearchParam(searchParams, key, value);
    }
    const query = searchParams.toString();
    return query ? `?${query}` : "";
}
/**
 * Facet management and aggregation endpoints.
 *
 * Facets are collection-scoped resources mounted directly under `/facets`.
 * Use this namespace to manage facet definitions and values, and to fetch
 * aggregation buckets for browse and filter UIs.
 */
export var facets;
(function (facets) {
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
    async function list(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets${buildQueryString(params)}`;
        return request(path);
    }
    facets.list = list;
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets`;
        return post(path, data);
    }
    facets.create = create;
    async function get(collectionId, facetKey, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}${buildQueryString(params)}`;
        return request(path);
    }
    facets.get = get;
    async function update(collectionId, facetKey, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}`;
        return put(path, data);
    }
    facets.update = update;
    async function remove(collectionId, facetKey) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}`;
        return del(path);
    }
    facets.remove = remove;
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
    async function listValues(collectionId, facetKey, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values${listQuery(params)}`;
        return request(path);
    }
    facets.listValues = listValues;
    async function createValue(collectionId, facetKey, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values`;
        return post(path, data);
    }
    facets.createValue = createValue;
    async function getValue(collectionId, facetKey, valueKey, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}${buildQueryString(params)}`;
        return request(path);
    }
    facets.getValue = getValue;
    async function updateValue(collectionId, facetKey, valueKey, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}`;
        return put(path, data);
    }
    facets.updateValue = updateValue;
    async function removeValue(collectionId, facetKey, valueKey) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}`;
        return del(path);
    }
    facets.removeValue = removeValue;
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
    async function query(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/query`;
        return post(path, body);
    }
    facets.query = query;
    /**
     * The facet namespaces in use (admin). A small fixed set: all the names are in `items`, there is no
     * `limit` or `cursor`, and `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.namespaces('coll_123') // items: string[]
     * ```
     */
    async function namespaces(collectionId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/namespaces`;
        return request(path);
    }
    facets.namespaces = namespaces;
    /**
     * The collection's facets (public). A small fixed set: all of them come back in one answer, so there is
     * no `limit` or `cursor` and `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.publicList('coll_123', { namespace: 'catalog' })
     * ```
     */
    async function publicList(collectionId, params) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets${buildQueryString(params)}`;
        return request(path);
    }
    facets.publicList = publicList;
    async function publicGet(collectionId, facetKey, params) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}${buildQueryString(params)}`;
        return request(path);
    }
    facets.publicGet = publicGet;
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
    async function publicListValues(collectionId, facetKey, options = {}) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    facets.publicListValues = publicListValues;
    async function publicGetValue(collectionId, facetKey, valueKey) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}`;
        return request(path);
    }
    facets.publicGetValue = publicGetValue;
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
    async function publicQuery(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/query`;
        return post(path, body);
    }
    facets.publicQuery = publicQuery;
    /**
     * The facet namespaces in use (public). A small fixed set: all the names are in `items`, there is no
     * `limit` or `cursor`, and `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await facets.publicNamespaces('coll_123') // items: string[]
     * ```
     */
    async function publicNamespaces(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/namespaces`;
        return request(path);
    }
    facets.publicNamespaces = publicNamespaces;
})(facets || (facets = {}));
