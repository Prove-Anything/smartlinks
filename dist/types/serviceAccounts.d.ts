/** The access a service account can have on its collection (never Owner). */
export type ServiceAccountAccess = "User" | "Reporter" | "Assigner" | "Admin";
/** One of a collection's service accounts. The key itself is never listed (only shown when made or replaced). */
export interface ServiceAccount {
    /** e.g. "sa-3f9c0a1b2d4e"; its user id on the collection is "svc:" + id. */
    id: string;
    /** What uses it, e.g. "Warehouse system". */
    name: string;
    /** Its access on the collection (null if it was removed from the collection's members another way). */
    access: ServiceAccountAccess | null;
    /** false once its key has been switched off. */
    active: boolean;
    createdAt: string;
    /** The user id of the person who made it. */
    createdBy: string | null;
    /** When its key was last used (to within a few minutes), or null if never. */
    lastUsedAt: string | null;
    /** When its current key was made. */
    keyCreatedAt: string;
    /** How its key starts ("slsvc_sa-….…"), to recognise it — never the secret. */
    keyHint: string;
}
export interface ServiceAccountList {
    serviceAccounts: ServiceAccount[];
    /** The access levels that can be given. */
    access: ServiceAccountAccess[];
}
export interface CreateServiceAccountInput {
    name: string;
    access: ServiceAccountAccess;
}
export interface UpdateServiceAccountInput {
    name?: string;
    access?: ServiceAccountAccess;
}
/** A new service account and its key. Show the key once: it can't be read again (make a new one instead). */
export interface CreateServiceAccountResult {
    serviceAccount: ServiceAccount;
    key: string;
}
/** A replacement key; the old one stops working (within a minute everywhere). */
export interface ServiceAccountKeyResult {
    key: string;
}
