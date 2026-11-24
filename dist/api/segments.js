// src/api/segments.ts
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
export var segments;
(function (segments) {
    // Create
    async function create(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/`;
        return post(path, body);
    }
    segments.create = create;
    /**
     * The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by
     * `filterType`.
     *
     * @example
     * ```typescript
     * let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 })
     * page.items // SegmentRecord[]
     * while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeQuery(query)}`;
        return request(path);
    }
    segments.list = list;
    // Get
    async function get(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}`;
        return request(path);
    }
    segments.get = get;
    // Update
    async function update(collectionId, id, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}`;
        return patch(path, body);
    }
    segments.update = update;
    // Delete
    async function remove(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}`;
        return del(path);
    }
    segments.remove = remove;
    // Stub: calculate
    async function calculate(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}/calculate`;
        return post(path, {});
    }
    segments.calculate = calculate;
    /**
     * The contacts in a segment, a page at a time. `count` is how many there are in all.
     *
     * @example
     * ```typescript
     * const page = await segments.recipients('coll_123', 'seg_1', { limit: 100 })
     * page.items      // Recipient[]
     * page.count      // total in the segment
     * page.nextCursor // pass back as `cursor` for the next page; null on the last
     * ```
     */
    async function recipients(collectionId, id, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}/recipients${encodeQuery(query)}`;
        return request(path);
    }
    segments.recipients = recipients;
})(segments || (segments = {}));
