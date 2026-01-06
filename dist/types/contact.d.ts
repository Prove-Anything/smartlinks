export type ContactCustomFields = Record<string, any>;
export interface Contact {
    contactId: string;
    orgId: string;
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
    company: string | null;
    email: string | null;
    phone: string | null;
    emails?: string[];
    phones?: string[];
    tags?: string[];
    source?: string | null;
    notes?: string | null;
    avatarUrl?: string | null;
    locale?: string | null;
    timezone?: string | null;
    externalIds?: Record<string, any>;
    customFields: ContactCustomFields;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    erasedAt: string | null;
}
export type ContactResponse = Contact;
export type ContactCreateRequest = Omit<Contact, "contactId" | "orgId" | "createdAt" | "updatedAt" | "deletedAt" | "erasedAt">;
export type ContactUpdateRequest = Partial<ContactCreateRequest>;
export interface ContactListResponse {
    items: Contact[];
    limit: number;
    offset: number;
}
export type PublicContactUpsertRequest = Partial<Pick<Contact, "email" | "phone" | "userId" | "firstName" | "lastName" | "displayName" | "company" | "tags" | "source" | "notes" | "avatarUrl" | "locale" | "timezone" | "externalIds">> & {
    customFields?: ContactCustomFields;
};
export interface PublicContactUpsertResponse {
    ok: boolean;
    contactId: string;
}
export interface UserSearchResponse {
    user: {
        uid: string;
        displayName: string | null;
        email: string | null;
        phoneNumber: string | null;
        photoURL: string | null;
    };
    contact: ContactResponse | null;
    existsAsContact: boolean;
}
