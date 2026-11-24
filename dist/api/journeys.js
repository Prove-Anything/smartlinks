// src/api/journeys.ts
import { request, post, patch, del } from "../http.js";
function encodeQuery(params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "")
            continue;
        if (typeof value === "boolean")
            search.set(key, value ? "true" : "false");
        else
            search.set(key, String(value));
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}
export var journeys;
(function (journeys) {
    // Create
    async function create(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/`;
        return post(path, body);
    }
    journeys.create = create;
    /**
     * List the collection's journeys (admin).
     * GET /admin/collection/:collectionId/journeys
     *
     * @example
     * ```typescript
     * let page = await journeys.list('coll_123', { active: true, limit: 50 })
     * while (page.nextCursor) page = await journeys.list('coll_123', { active: true, limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeQuery(query)}`;
        return request(path);
    }
    journeys.list = list;
    // Get
    async function get(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeURIComponent(id)}`;
        return request(path);
    }
    journeys.get = get;
    // Update
    async function update(collectionId, id, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeURIComponent(id)}`;
        return patch(path, body);
    }
    journeys.update = update;
    // Delete
    async function remove(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeURIComponent(id)}`;
        return del(path);
    }
    journeys.remove = remove;
})(journeys || (journeys = {}));
