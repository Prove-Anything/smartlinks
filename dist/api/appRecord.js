// src/api/appRecord.ts
import { request, post, put, del } from "../http";
export var appRecord;
(function (appRecord) {
    // Get app record (admin only)
    async function get(collectionId, appId) {
        const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`;
        return request(path);
    }
    appRecord.get = get;
    // Create app record (admin only)
    async function create(collectionId, appId, data) {
        const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`;
        return post(path, data);
    }
    appRecord.create = create;
    // Update app record (admin only)
    async function update(collectionId, appId, data) {
        const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`;
        return put(path, data);
    }
    appRecord.update = update;
    // Delete app record (admin only)
    async function remove(collectionId, appId) {
        const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`;
        return del(path);
    }
    appRecord.remove = remove;
})(appRecord || (appRecord = {}));
