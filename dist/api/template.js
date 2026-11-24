import { request, post, put, del as httpDel } from "../http.js";
import { listQuery } from "../list.js";
export var template;
(function (template) {
    // Admin APIs
    /**
     * The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000).
     * Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one.
     *
     * @example
     * ```typescript
     * let page = await template.getAll('coll_123', { limit: 100 })
     * page.items // Template[]
     * while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor })
     * ```
     */
    async function getAll(collectionId, options = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    template.getAll = getAll;
    async function get(collectionId, templateId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`;
        return request(path);
    }
    template.get = get;
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template`;
        return post(path, data);
    }
    template.create = create;
    async function update(collectionId, templateId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`;
        return put(path, data);
    }
    template.update = update;
    // Delete returns the (soft-deleted) Template per spec
    async function del(collectionId, templateId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`;
        return httpDel(path);
    }
    template.del = del;
    async function uploadAsset(collectionId, templateId, file) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}/addFile`;
        const form = new FormData();
        form.append("file", file);
        return post(path, form);
    }
    template.uploadAsset = uploadAsset;
    // Public APIs
    /**
     * The collection's templates that may be used publicly, 50 at a time unless you give a `limit`
     * (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the
     * last one.
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await template.getAllowed('coll_123', { limit: 100 })
     * items // TemplatePublic[]
     * ```
     */
    async function getAllowed(collectionId, options = {}) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/template/getAllowed${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    template.getAllowed = getAllowed;
    async function getPublic(collectionId, templateId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`;
        return request(path);
    }
    template.getPublic = getPublic;
    async function getGlobal(templateId) {
        const path = `/public/template/${encodeURIComponent(templateId)}`;
        return request(path);
    }
    template.getGlobal = getGlobal;
    /**
     * The global templates this collection may use, 50 at a time unless you give a `limit` (at most
     * 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one.
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await template.getAllowedGlobal('coll_123', { limit: 100 })
     * items // TemplatePublic[]
     * ```
     */
    async function getAllowedGlobal(collectionId, options = {}) {
        const path = `/public/template/getAllowed/${encodeURIComponent(collectionId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    template.getAllowedGlobal = getAllowedGlobal;
    // Render a template by ID (admin)
    async function render(collectionId, templateId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}/render`;
        return post(path, body);
    }
    template.render = render;
    // Render from source (admin)
    async function renderSource(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/render/source`;
        return post(path, body);
    }
    template.renderSource = renderSource;
})(template || (template = {}));
