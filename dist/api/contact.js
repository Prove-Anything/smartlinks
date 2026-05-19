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
    async function search({ collectionId, q, typeahead, email, phone, id, userId, tags, tagsAll, source, locale, createdFrom, createdTo, externalIdKey, externalIdValue, customFieldKey, customFieldValue, limit, offset, }) {
        const query = new URLSearchParams();
        if (q !== undefined)
            query.set("q", q);
        if (typeahead !== undefined)
            query.set("typeahead", String(typeahead));
        if (email !== undefined)
            query.set("email", email);
        if (phone !== undefined)
            query.set("phone", phone);
        if (id !== undefined)
            query.set("id", id);
        if (userId !== undefined)
            query.set("userId", userId);
        if (tags !== undefined) {
            const arr = Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim());
            arr.forEach(t => query.append("tags", t));
        }
        if (tagsAll !== undefined) {
            const arr = Array.isArray(tagsAll) ? tagsAll : tagsAll.split(",").map(t => t.trim());
            arr.forEach(t => query.append("tagsAll", t));
        }
        if (source !== undefined)
            query.set("source", source);
        if (locale !== undefined)
            query.set("locale", locale);
        if (createdFrom !== undefined)
            query.set("createdFrom", createdFrom);
        if (createdTo !== undefined)
            query.set("createdTo", createdTo);
        if (externalIdKey !== undefined)
            query.set("externalIdKey", externalIdKey);
        if (externalIdValue !== undefined)
            query.set("externalIdValue", externalIdValue);
        if (customFieldKey !== undefined)
            query.set("customFieldKey", customFieldKey);
        if (customFieldValue !== undefined)
            query.set("customFieldValue", customFieldValue);
        if (limit !== undefined)
            query.set("limit", String(limit));
        if (offset !== undefined)
            query.set("offset", String(offset));
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/search?${query.toString()}`;
        return request(path);
    }
    contact.search = search;
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
    /**
     * Public: Get the contact schema for a collection.
     * GET /public/collection/:collectionId/contact/schema
     *
     * Returns a ContactSchemaResponse describing all publicly visible contact fields.
     * Core fields and collection-defined custom fields are merged into a single flat schema.
     *
     * Fields not in `publicVisibleFields` are stripped entirely from the response.
     * Fields visible but not in `publicEditableFields` have `ui:disabled: true` in `uiSchema`.
     *
     * Use `fieldOrder` to render fields in the correct sequence, and `evaluateConditions`
     * from the types package to handle conditional field visibility.
     *
     * @example
     * ```typescript
     * import { contact, evaluateConditions } from '@proveanything/smartlinks'
     *
     * const schema = await contact.publicGetSchema(collectionId)
     *
     * for (const fieldId of schema.fieldOrder) {
     *   const property = schema.schema.properties[fieldId]
     *   const ui       = schema.uiSchema[fieldId] || {}
     *   const visible  = evaluateConditions(property.conditions, property.showWhen, formValues)
     *   const disabled = ui['ui:disabled'] === true
     *   if (visible) renderField({ fieldId, property, ui, disabled })
     * }
     * ```
     */
    async function publicGetSchema(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/contact/schema`;
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
