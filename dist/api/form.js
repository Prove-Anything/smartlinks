import { request, post, put, del } from "../http";
export var form;
(function (form) {
    /**
     * Get a single form by ID for a collection.
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     */
    async function get(collectionId, formId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/form/${encodeURIComponent(formId)}`;
        return request(path);
    }
    form.get = get;
    /**
     * List all forms for a collection.
     * @param collectionId – The collection identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     */
    async function list(collectionId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/form`;
        return request(path);
    }
    form.list = list;
    /**
     * Create a new form for a collection (admin only).
     * @param collectionId – The collection identifier
     * @param data – The form data
     */
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/form`;
        return post(path, data);
    }
    form.create = create;
    /**
     * Update a form for a collection (admin only).
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     * @param data – The form data
     */
    async function update(collectionId, formId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/form/${encodeURIComponent(formId)}`;
        return put(path, data);
    }
    form.update = update;
    /**
     * Delete a form for a collection (admin only).
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     */
    async function remove(collectionId, formId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/form/${encodeURIComponent(formId)}`;
        return del(path);
    }
    form.remove = remove;
})(form || (form = {}));
