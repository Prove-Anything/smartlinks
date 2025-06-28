import { request, post, put, del } from "../http";
export var crate;
(function (crate) {
    /**
     * Get a single crate by ID for a collection (admin only).
     */
    async function get(collectionId, crateId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`;
        return request(path);
    }
    crate.get = get;
    /**
     * List all crates for a collection (admin only).
     */
    async function list(collectionId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate`;
        return request(path);
    }
    crate.list = list;
    /**
     * Create a new crate for a collection (admin only).
     */
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate`;
        return post(path, data);
    }
    crate.create = create;
    /**
     * Update a crate for a collection (admin only).
     */
    async function update(collectionId, crateId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`;
        return put(path, data);
    }
    crate.update = update;
    /**
     * Delete a crate for a collection (admin only).
     */
    async function remove(collectionId, crateId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`;
        return del(path);
    }
    crate.remove = remove;
})(crate || (crate = {}));
