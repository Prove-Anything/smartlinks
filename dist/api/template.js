import { request, post, put, del as httpDel } from "../http";
export var template;
(function (template) {
    // Admin APIs
    async function getAll(collectionId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/template`;
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
    async function getAllowed(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/template/getAllowed`;
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
    async function getAllowedGlobal(collectionId) {
        const path = `/public/template/getAllowed/${encodeURIComponent(collectionId)}`;
        return request(path);
    }
    template.getAllowedGlobal = getAllowedGlobal;
})(template || (template = {}));
