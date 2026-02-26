import { ContactResponse, ContactCreateRequest, ContactUpdateRequest, ContactListResponse, PublicContactUpsertRequest, PublicContactUpsertResponse, UserSearchResponse, ContactPatch, PublicGetMyContactResponse, PublicUpdateMyContactResponse, ContactSchemaResponse } from "../types";
export declare namespace contact {
    function create(collectionId: string, data: ContactCreateRequest): Promise<ContactResponse>;
    function list(collectionId: string, params?: {
        limit?: number;
        offset?: number;
        includeDeleted?: boolean;
    }): Promise<ContactListResponse>;
    function get(collectionId: string, contactId: string, params?: {
        includeDeleted?: boolean;
    }): Promise<ContactResponse>;
    function update(collectionId: string, contactId: string, data: ContactUpdateRequest): Promise<ContactResponse>;
    function remove(collectionId: string, contactId: string): Promise<void>;
    function lookup(collectionId: string, params: {
        email?: string;
        phone?: string;
    }): Promise<ContactResponse>;
    function upsert(collectionId: string, data: ContactCreateRequest): Promise<ContactResponse>;
    function publicUpsert(collectionId: string, data: PublicContactUpsertRequest): Promise<PublicContactUpsertResponse>;
    function publicGetMine(collectionId: string): Promise<PublicGetMyContactResponse>;
    function publicUpdateMine(collectionId: string, data: ContactPatch): Promise<PublicUpdateMyContactResponse>;
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
    function publicGetSchema(collectionId: string): Promise<ContactSchemaResponse>;
    function erase(collectionId: string, contactId: string, body?: any): Promise<ContactResponse>;
    function getUser(collectionId: string, userId: string): Promise<UserSearchResponse>;
}
