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

/**
 * Request body for creating a single tag/code inside an existing claim set.
 */
export interface CreateClaimSetTagRequest {
  /** Optional explicit ID; a random 12-char hex ID is generated server-side if omitted */
  id?: string
  /** Matching tag/NFC identifier */
  tagId?: string
  /** Product to associate with this code */
  productId?: string
  /** Collection scope */
  collectionId?: string
  /** Batch identifier */
  batchId?: string
  /** Optional password/secret for secure claim */
  password?: string
  /** Arbitrary extra fields */
  data?: Record<string, unknown>
}

/**
 * Request body for creating a new claim set.
 */
export interface CreateClaimSetRequest {
  /** Display name for the claim set */
  name: string
  /** How tags are claimed (e.g. "nfc", "qr") */
  claimMode: string
  /** How tags are allocated (e.g. "specific", "random") */
  allocationMode: string
}

/**
 * A single tag entry within an importTags request.
 */
export interface ImportClaimSetTagItem {
  /** Tag identifier (required) */
  id: string
  /** Optional matching tag/NFC identifier */
  tagId?: string
  /** Optional position index */
  index?: number
}

/**
 * Request body for bulk-importing tags into a claim set.
 */
export interface ImportClaimSetTagsRequest {
  /** Array of tag objects to import */
  tags: ImportClaimSetTagItem[]
  /**
   * Import mode:
   * - "upsert" (default) merges with existing tags
   * - "replace" wipes all existing tags first then writes the new set
   */
  mode?: 'upsert' | 'replace'
}

/**
 * Response returned by the importTags endpoint.
 */
export interface ImportClaimSetTagsResponse {
  /** Number of tags written */
  written: number
}

/**
 * Response body returned after a tag/code is created inside a claim set.
 */
export interface CreateClaimSetTagResponse {
  /** ID of the newly created tag */
  id: string
  /** The claim set this tag belongs to */
  claimSetId: string
  /** ISO 8601 creation timestamp */
  createdAt: string
  /** Matching tag/NFC identifier */
  tagId?: string
  /** Associated product ID */
  productId?: string
  /** Collection scope */
  collectionId?: string
  /** Batch identifier */
  batchId?: string
  /** Password/secret for secure claim */
  password?: string
  /** Arbitrary extra fields */
  data?: Record<string, unknown>
}
