// src/api/segments.ts
import { request, post, patch, del } from "../http";
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
    // List
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
    // Stub: recipients
    async function recipients(collectionId, id, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}/recipients${encodeQuery(query)}`;
        return request(path);
    }
    segments.recipients = recipients;
})(segments || (segments = {}));
