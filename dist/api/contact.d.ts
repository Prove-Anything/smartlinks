import { ContactResponse, ContactCreateRequest, ContactUpdateRequest, ContactListResponse, PublicContactUpsertRequest, PublicContactUpsertResponse, UserSearchResponse, ContactPatch, PublicGetMyContactResponse, PublicUpdateMyContactResponse, ContactSchema } from "../types";
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
     * Public: Get contact update schema for a collection
     *
     * Fetches the public contact schema including core fields, custom fields with
     * conditional visibility rules, and visibility/editability settings.
     *
     * Custom fields may include a `condition` property that specifies when the field
     * should be displayed. Apps rendering these forms should:
     * 1. Evaluate each field's `condition` against current form values
     * 2. Hide fields whose conditions are not met
     * 3. Skip validation for hidden fields (they shouldn't be required when not visible)
     */
    function publicGetSchema(collectionId: string): Promise<ContactSchema>;
    function erase(collectionId: string, contactId: string, body?: any): Promise<ContactResponse>;
    function getUser(collectionId: string, userId: string): Promise<UserSearchResponse>;
}
