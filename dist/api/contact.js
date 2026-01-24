import { request, post, del, patch } from "../http";
export var contact;
(function (contact) {
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts`;
        return post(path, data);
    }
    contact.create = create;
    async function list(collectionId, params) {
        const query = new URLSearchParams();
        if ((params === null || params === void 0 ? void 0 : params.limit) !== undefined)
            query.set("limit", String(params.limit));
        if ((params === null || params === void 0 ? void 0 : params.offset) !== undefined)
            query.set("offset", String(params.offset));
        if ((params === null || params === void 0 ? void 0 : params.includeDeleted) !== undefined)
            query.set("includeDeleted", String(params.includeDeleted));
        const qs = query.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts${qs ? `?${qs}` : ""}`;
        return request(path);
    }
    contact.list = list;
    async function get(collectionId, contactId, params) {
        const query = new URLSearchParams();
        if ((params === null || params === void 0 ? void 0 : params.includeDeleted) !== undefined)
            query.set("includeDeleted", String(params.includeDeleted));
        const qs = query.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}${qs ? `?${qs}` : ""}`;
        return request(path);
    }
    contact.get = get;
    async function update(collectionId, contactId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}`;
        return patch(path, data);
    }
    contact.update = update;
    async function remove(collectionId, contactId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}`;
        return del(path);
    }
    contact.remove = remove;
    async function lookup(collectionId, params) {
        const query = new URLSearchParams();
        if (params.email)
            query.set("email", params.email);
        if (params.phone)
            query.set("phone", params.phone);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/lookup?${query.toString()}`;
        return request(path);
    }
    contact.lookup = lookup;
    async function upsert(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/upsert`;
        return post(path, data);
    }
    contact.upsert = upsert;
    // Public contact upsert (privacy-safe): returns only ok + contactId
    async function publicUpsert(collectionId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/contact`;
        return post(path, data);
    }
    contact.publicUpsert = publicUpsert;
    // Public: Get "my" contact (requires auth bearer token)
    async function publicGetMine(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/contact/me`;
        return request(path);
    }
    contact.publicGetMine = publicGetMine;
    // Public: Update "my" contact (requires auth bearer token)
    async function publicUpdateMine(collectionId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/contact/me`;
        return patch(path, data);
    }
    contact.publicUpdateMine = publicUpdateMine;
    // Public: Get contact update schema for a collection
    async function publicGetSchema(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/contacts/schema`;
        return request(path);
    }
    contact.publicGetSchema = publicGetSchema;
    async function erase(collectionId, contactId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}/erase`;
        return post(path, body || {});
    }
    contact.erase = erase;
    // get user
    async function getUser(collectionId, userId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/owner/${encodeURIComponent(userId)}`;
        return request(path);
    }
    contact.getUser = getUser;
})(contact || (contact = {}));
