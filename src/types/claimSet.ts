// src/types/claimSet.ts
/**
 * Reference to a specific claim attached to a code/tag.
 */
export interface ClaimCodeRef {
  /** Identifier of the code (e.g., tag or QR code) */
  codeId: string
  /** Identifier of the claim within the claim set */
  claimId: string
}

/**
 * Request body for updating claim data on a claim set.
 * Contains arbitrary key/value pairs and a list of code+claim references to update.
 */
export interface UpdateClaimDataRequest {
  /** Arbitrary key/value pairs for the claim data update */
  data: Record<string, any>
  /** Array of code+claim references affected by this update */
  codes: ClaimCodeRef[]
}

/**
 * Request body for assigning claims to codes or ranges within a collection.
 */
export interface AssignClaimsRequest {
  /** The claim set ID (required) */
  id: string
  /** The collection ID (required) */
  collectionId: string
  /** The product ID (required) */
  productId: string
  /** Optional batch identifier */
  batchId?: string
  /** Optional start index for bulk assignment */
  start?: number
  /** Optional end index for bulk assignment */
  end?: number
  /** Optional single code identifier for single assignment */
  codeId?: string
  /** Optional key/value pairs to set on the claim */
  data?: Record<string, any>
}
