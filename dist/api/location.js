// src/api/location.ts
import { request, post } from "../http.js";
import { listQuery } from "../list.js";
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
     * Admin: Search locations to pick during setup (combines collection + global). `q` is the search
     * text. `limit` says how many (default 20, at most 100) and `cursor` is the previous page's
     * `nextCursor`. `orderBy` sorts by one field: `name` (the default), `countryCode` or `countryName`.
     * GET /admin/collection/:collectionId/location/search
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await location.search('coll_123', {
     *   q: 'distillery', countryCode: 'GB', limit: 10, orderBy: [{ countryName: 'asc' }],
     * })
     * ```
     */
    async function search(collectionId, query = {}) {
        const qs = listQuery(query);
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
