import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
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
     * List the forms for a collection, 50 at a time unless you give a `limit` (at most 1000). Pass
     * `nextCursor` back as `cursor` for the next page; `null` means that was the last one.
     * @param collectionId – The collection identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     * @param options – Paging: `limit` and `cursor`
     * @returns Promise resolving to `{ items, nextCursor, count }`, where `items` are the forms
     *
     * @example
     * ```typescript
     * let page = await form.list(collectionId, true, { limit: 100 })
     * while (page.nextCursor) page = await form.list(collectionId, true, { limit: 100, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, admin, options = {}) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/form${listQuery({ limit: options.limit, cursor: options.cursor })}`;
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
