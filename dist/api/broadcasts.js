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
    // Recipients listing for a broadcast
    async function recipients(collectionId, id, query = {}) {
        const qs = encodeQuery(query);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/recipients${qs}`;
        return request(path);
    }
    broadcasts.recipients = recipients;
    // Preview a broadcast template/email
    async function preview(collectionId, id, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/preview`;
        return post(path, body);
    }
    broadcasts.preview = preview;
    // Enqueue send for a broadcast (202 Accepted)
    async function send(collectionId, id, body = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/send`;
        return post(path, body);
    }
    broadcasts.send = send;
    // Alias for clarity with docs naming
    broadcasts.sendBroadcast = send;
    // Send a single test email
    async function sendTest(collectionId, id, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/send/test`;
        return post(path, body);
    }
    broadcasts.sendTest = sendTest;
    // Manually send a page of emails
    async function sendManual(collectionId, id, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/send/manual`;
        return post(path, body);
    }
    broadcasts.sendManual = sendManual;
    // Append a single broadcast event
    async function append(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append`;
        return post(path, body);
    }
    broadcasts.append = append;
    // Append many broadcast events
    async function appendBulk(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append/bulk`;
        return post(path, body);
    }
    broadcasts.appendBulk = appendBulk;
})(broadcasts || (broadcasts = {}));
