import { del, post, put, request } from "../http";
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
    async function listValues(collectionId, facetKey, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values${buildQueryString(params)}`;
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
    async function query(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/query`;
        return post(path, body);
    }
    facets.query = query;
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
    async function publicListValues(collectionId, facetKey) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values`;
        return request(path);
    }
    facets.publicListValues = publicListValues;
    async function publicGetValue(collectionId, facetKey, valueKey) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}`;
        return request(path);
    }
    facets.publicGetValue = publicGetValue;
    async function publicQuery(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/query`;
        return post(path, body);
    }
    facets.publicQuery = publicQuery;
})(facets || (facets = {}));
