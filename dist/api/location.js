// src/api/location.ts
import { request, post } from "../http";
function buildQueryString(q = {}) {
    var _a, _b;
    const params = new URLSearchParams();
    if (q.q)
        params.set('q', q.q);
    if (q.category)
        params.set('category', q.category);
    if (q.countryCode)
        params.set('countryCode', q.countryCode);
    if (q.countryName)
        params.set('countryName', q.countryName);
    const limit = Math.min(Math.max((_a = q.limit) !== null && _a !== void 0 ? _a : 20, 1), 100);
    params.set('limit', String(limit));
    const sort = ((_b = q.sort) !== null && _b !== void 0 ? _b : 'name');
    params.set('sort', sort);
    const s = params.toString();
    return s ? `?${s}` : '';
}
export var location;
(function (location) {
    /**
     * Platform: Create a global location (super admin; requires features.adminApps)
     * POST /platform/location
     */
    async function createGlobal(params) {
        const path = `/platform/location`;
        return post(path, params);
    }
    location.createGlobal = createGlobal;
    /**
     * Admin: Create a collection-scoped location
     * POST /admin/collection/:collectionId/location
     */
    async function create(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/location`;
        return post(path, params);
    }
    location.create = create;
    /**
     * Admin: Search locations to pick during setup (combines collection + global)
     * GET /admin/collection/:collectionId/location/search
     */
    async function search(collectionId, query = {}) {
        const qs = buildQueryString(query);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/location/search${qs}`;
        return request(path);
    }
    location.search = search;
    /**
     * Public: Fetch a global location by ID
     * GET /public/location/:locationId
     */
    async function getPublic(locationId) {
        const path = `/public/location/${encodeURIComponent(locationId)}`;
        return request(path);
    }
    location.getPublic = getPublic;
    /**
     * Public: Fetch a location for a collection; returns either a collection-owned or global fallback
     * GET /public/collection/:collectionId/location/:locationId
     */
    async function getPublicForCollection(collectionId, locationId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/location/${encodeURIComponent(locationId)}`;
        return request(path);
    }
    location.getPublicForCollection = getPublicForCollection;
})(location || (location = {}));
