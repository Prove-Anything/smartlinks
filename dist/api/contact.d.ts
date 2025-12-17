import { ContactResponse, ContactCreateRequest, ContactUpdateRequest, ContactListResponse } from "../types";
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
    function erase(collectionId: string, contactId: string, body?: any): Promise<ContactResponse>;
}
