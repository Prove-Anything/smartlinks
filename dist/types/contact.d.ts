export type ContactCustomFields = Record<string, any>;
export interface ContactResponse {
    contactId: string;
    orgId: string;
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
    company: string | null;
    email: string | null;
    phone: string | null;
    emails?: string[];
    phones?: string[];
    customFields: ContactCustomFields;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    erasedAt: string | null;
}
export interface ContactCreateRequest {
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    customFields?: ContactCustomFields;
}
export interface ContactUpdateRequest {
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    customFields?: ContactCustomFields;
}
export interface ContactListResponse {
    items: ContactResponse[];
    limit: number;
    offset: number;
}
