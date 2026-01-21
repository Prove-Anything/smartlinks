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
    /** First-party communications state (preferred). If absent, may exist under customFields.comms */
    comms?: CommsState;
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
export interface ContactPublic {
    contactId: string;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    company?: string | null;
    avatarUrl?: string | null;
    locale?: string | null;
    timezone?: string | null;
    email?: string | null;
    phone?: string | null;
    externalIds?: Record<string, any>;
    customFields?: ContactCustomFields;
}
export type ContactPatch = Partial<Pick<Contact, "firstName" | "lastName" | "displayName" | "company" | "avatarUrl" | "locale" | "timezone" | "email" | "phone" | "externalIds">> & {
    customFields?: ContactCustomFields;
};
export interface PublicGetMyContactResponse {
    ok: boolean;
    contact: ContactPublic | null;
}
export interface PublicUpdateMyContactResponse {
    ok: boolean;
    contact: ContactPublic;
}
export type ChannelName = import('./broadcasts').BroadcastChannel;
export type SubjectType = 'product' | 'proof' | 'batch';
/** Registered delivery method for a contact */
export interface CommMethodMeta {
    pushEndpoint?: string;
    p256dh?: string;
    auth?: string;
    phone?: string;
    email?: string;
    walletObjectId?: string;
    subjectType?: SubjectType;
    subjectId?: string;
    productId?: string;
}
export interface CommMethod {
    id?: string;
    type: ChannelName;
    meta?: CommMethodMeta;
    verified?: boolean;
    suppressed?: boolean;
    createdAt?: string;
}
/** Subject-level opt-in linking contact to a subject (audience targeting) */
export interface Subscription {
    id: string;
    subjectType: SubjectType;
    subjectId: string;
    productId?: string | null;
    contactId: string;
    source?: string;
    createdAt?: string;
    deletedAt?: string | null;
}
/** Per-subject consent (or `_default` when no subject) */
export interface PreferenceEntry {
    subjectType?: SubjectType | null;
    subjectId?: string | null;
    /** Channel-level toggles for delivery */
    channels?: Partial<Record<ChannelName, boolean>>;
    /** Topic-level toggles (apply across channels) */
    topics?: Record<string, boolean>;
    /** Optional per-channel topic preferences */
    topicsByChannel?: Partial<Record<ChannelName, Record<string, boolean>>>;
    updatedAt?: string;
}
/** Communications state embedded in contact customFields or first-party column */
export interface CommsState {
    methods?: CommMethod[];
    subscriptions?: Subscription[];
    /** Keyed by `_default` or `${type}_${id}` */
    preferences?: Record<string, PreferenceEntry>;
}
