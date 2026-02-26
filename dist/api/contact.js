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
