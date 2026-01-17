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
    /** Arbitrary key-value pairs for proof values */
    values: Record<string, any>;
}
export type ProofResponse = Proof;
export interface ProofCreateRequest {
    values: Record<string, any>;
    claimable?: boolean;
    virtual?: boolean;
}
export type ProofUpdateRequest = Partial<ProofCreateRequest>;
export type ProofClaimRequest = Record<string, any>;
