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
export interface PublicContactUpsertRequest {
    email?: string;
    phone?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    company?: string;
    tags?: string[];
    source?: string;
    notes?: string;
    avatarUrl?: string;
    locale?: string;
    timezone?: string;
    externalIds?: Record<string, any>;
    customFields?: ContactCustomFields;
}
export interface PublicContactUpsertResponse {
    ok: boolean;
    contactId: string;
}
