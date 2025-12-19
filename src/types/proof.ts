// src/types/proof.ts
/**
 * Represents a Proof object.
 */
export interface Proof {
  /** Unique identifier for the collection */
  collectionId: string
  /** Creation timestamp */
  createdAt: string
  /** Unique identifier for the proof */
  id: string
  /** Unique identifier for the product */
  productId: string
  /** Unique identifier for the token */
  tokenId: string
  /** Unique identifier for the user */
  userId: string
  /** Is this proof available to be claimed */
  claimable?: boolean
  /** Is this proof transient */
  transient?: boolean
  /** Arbitrary key-value pairs for proof values */
  values: Record<string, any>
}

// Backwards compatibility alias
export type ProofResponse = Proof

// Request bodies
// Create uses values and optional flags; path carries collection/product
export interface ProofCreateRequest {
  values: Record<string, any>
  claimable?: boolean
  transient?: boolean
}

// Update may partially change values or flags
export type ProofUpdateRequest = Partial<ProofCreateRequest>

// Claim may accept arbitrary payload depending on server-side rules
export type ProofClaimRequest = Record<string, any>
