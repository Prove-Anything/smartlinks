// src/api/broadcasts.ts
import { request, post, patch, del } from "../http";
function encodeQuery(params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "")
            continue;
        if (typeof value === "boolean") {
            search.set(key, value ? "true" : "false");
        }
        else {
            search.set(key, String(value));
        }
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}
export var broadcasts;
(function (broadcasts) {
    /**
     * POST /admin/collection/:collectionId/broadcasts/by-user
     * Returns broadcast events array, newest first.
     */
    async function byUser(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/by-user`;
        return post(path, query);
    }
    broadcasts.byUser = byUser;
    /**
     * POST /admin/collection/:collectionId/broadcasts/recipient-ids
     * Returns recipient IDs for a broadcast.
     */
    async function recipientIds(collectionId, query) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/recipient-ids`;
        return post(path, query);
    }
    broadcasts.recipientIds = recipientIds;
    /**
     * POST /admin/collection/:collectionId/broadcasts/recipients/without-action
     * Returns IDs who received the broadcast but did not perform an action.
     */
    async function recipientsWithoutAction(collectionId, query) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/recipients/without-action`;
        return post(path, query);
    }
    broadcasts.recipientsWithoutAction = recipientsWithoutAction;
    /**
     * POST /admin/collection/:collectionId/broadcasts/recipients/with-action
     * Returns IDs who received the broadcast and performed an action; optionally includes outcome.
     */
    async function recipientsWithAction(collectionId, query) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/recipients/with-action`;
        return post(path, query);
    }
    broadcasts.recipientsWithAction = recipientsWithAction;
    /**
     * POST /admin/collection/:collectionId/broadcasts/append
     * Appends one broadcast event.
     */
    async function append(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append`;
        return post(path, body);
    }
    broadcasts.append = append;
    /**
     * POST /admin/collection/:collectionId/broadcasts/append/bulk
     * Appends many broadcast recipients.
     * Accepts preferred body shape with params + ids, and legacy flat shape.
     */
    async function appendBulk(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append/bulk`;
        return post(path, body);
    }
    broadcasts.appendBulk = appendBulk;
    // CRUD: Create broadcast
    async function create(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/`;
        return post(path, body);
    }
    broadcasts.create = create;
    // CRUD: List broadcasts (GET with query)
    async function list(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeQuery(query)}`;
        return request(path);
    }
    broadcasts.list = list;
    // CRUD: Get a single broadcast
    async function get(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}`;
        return request(path);
    }
    broadcasts.get = get;
    // CRUD: Update a broadcast
    async function update(collectionId, id, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}`;
        return patch(path, body);
    }
    broadcasts.update = update;
    // CRUD: Delete a broadcast
    async function remove(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}`;
        return del(path);
    }
    broadcasts.remove = remove;
})(broadcasts || (broadcasts = {}));
