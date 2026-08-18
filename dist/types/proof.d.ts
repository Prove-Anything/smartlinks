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
/** What a grant authorises the bearer to do on the proof. */
export type GrantScope = 'read' | 'comment' | 'admin' | 'verify_owner';
/** Who may redeem a grant. */
export interface GrantAudience {
    kind: 'public_link' | 'named';
    email?: string;
    userId?: string;
}
/** A share grant issued on a proof. */
export interface ProofGrant {
    grantId: string;
    proofId: string;
    productId?: string | null;
    scope: GrantScope[];
    audience: GrantAudience;
    createdBy: string;
    expiresAt?: string | null;
    revokedAt?: string | null;
    redeemedBy?: {
        userId?: string;
        guestName?: string;
        redeemedAt: string;
    };
    redeemCount: number;
    createdAt: string;
    updatedAt: string;
    /** The opaque bearer token — present ONLY on the `createGrant` response, never on `listGrants`. */
    token?: string;
}
export interface CreateGrantOptions {
    /** At least one scope is required. */
    scope: GrantScope[];
    /** Defaults to `{ kind: 'public_link' }`. */
    audience?: GrantAudience;
    /** Optional expiry — a `Date` or ISO string. */
    expiresAt?: Date | string;
}
export interface RedeemGrantOptions {
    /** Display name to stamp on guest activity when the redeemer is not signed in. */
    guestName?: string;
}
/**
 * Result of redeeming a grant. For read/comment/admin grants this is the granted
 * scope; for a `verify_owner` grant it is an ownership assertion (never the account).
 */
export type RedeemGrantResult = {
    scope: GrantScope[];
    redeemedAt: string;
} | {
    proofId: string;
    assertsOwnership: true;
    ownerDisplayName?: string;
    issuedAt?: string;
    expiresAt?: string;
};
