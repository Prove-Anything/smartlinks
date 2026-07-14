import { JsonValue, ScopedFieldDef } from './product';
/**
 * `proof.values` — the owner + business-writable bag.
 * Public keys sit at the root (business + current owner can write, everyone
 * can read); `owner` and `personal` are reserved sub-keys with their own
 * read/write rules. See docs/proof-product-data-scoping.md.
 */
export interface ProofValues {
    [key: string]: JsonValue | Record<string, JsonValue> | Record<string, Record<string, JsonValue>> | undefined;
    /** Owner-scoped: read/write by business + current owner; transfers with ownership. */
    owner?: Record<string, JsonValue>;
    /** Per-user: read/write only by the matching userId; not visible to the next owner, not even business admins. */
    personal?: Record<string, Record<string, JsonValue>>;
}
/**
 * Represents a Proof object.
 */
export interface Proof {
    /** Unique identifier for the collection */
    collectionId: string;
    /** Creation timestamp */
    createdAt: string;
    /** Unique identifier for the proof */
    id: string;
    /** Unique identifier for the product */
    productId: string;
    /** Unique identifier for the token */
    tokenId: string;
    /** Unique identifier for the user */
    userId: string;
    /** Is this proof available to be claimed */
    claimable?: boolean;
    /** Is this proof virtual */
    virtual?: boolean;
    /** Public, business-writable spec data — readable by everyone. */
    data?: Record<string, JsonValue>;
    /** Business-only spec data — stripped from public/non-admin reads. */
    admin?: Record<string, JsonValue>;
    /** Owner + business-writable consumer data. See ProofValues. */
    values: ProofValues;
}
export type ProofResponse = Proof;
export interface ProofCreateRequest {
    values: ProofValues;
    /** Business-writable public spec data. */
    data?: Record<string, JsonValue>;
    /** Business-only spec data. */
    admin?: Record<string, JsonValue>;
    claimable?: boolean;
    virtual?: boolean;
}
export type ProofUpdateRequest = Partial<ProofCreateRequest>;
export type ProofClaimRequest = Record<string, any>;
/**
 * `'public'` (default, omitted) reads/writes `proof.values[key]`.
 * `'owner'` reads/writes `proof.values.owner[key]`.
 * `'personal'` reads/writes `proof.values.personal[userId][key]`.
 * `'admin'` reads/writes `proof.admin[key]` (admin only).
 */
export type ProofFieldScope = 'public' | 'owner' | 'personal' | 'admin';
export type ProofFieldDef = ScopedFieldDef & {
    scope?: ProofFieldScope;
};
/** Shape of the `proofFields` collection settings group. */
export interface ProofFieldsConfig {
    fields: ProofFieldDef[];
}
