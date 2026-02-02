/**
 * Tag Management Types
 * 
 * Types for creating mappings between physical tags (NFC tags, QR codes, etc.) 
 * and digital proofs.
 */

/**
 * Represents a tag mapping in the system.
 */
export interface Tag {
  id: string                        // UUID
  orgId: string                     // Organization ID
  tagId: string                     // Unique tag identifier (globally unique)
  collectionId: string              // Collection ID
  productId: string                 // Product ID
  variantId?: string | null         // Optional: Variant ID
  batchId?: string | null           // Optional: Batch ID
  proofId: string                   // Proof ID (serial number or explicit)
  metadata: Record<string, any>     // Additional metadata (e.g., serialIndex)
  createdAt: string                 // ISO 8601 timestamp
  updatedAt: string                 // ISO 8601 timestamp
}

/**
 * Request to create a single tag mapping.
 * If proofId is not provided, automatically generates a serial number.
 */
export interface CreateTagRequest {
  tagId: string                     // Required: Unique tag identifier
  productId: string                 // Required: Product ID
  variantId?: string                // Optional: Variant ID
  batchId?: string                  // Optional: Batch ID
  proofId?: string                  // Optional: Explicit proof ID (if omitted, auto-generates serial)
  useSerialNumber?: boolean         // Optional: Explicitly request serial number generation
  metadata?: Record<string, any>    // Optional: Additional metadata
  force?: boolean                   // Optional: Overwrite if tag exists in same collection (default: false)
}

/**
 * Response from creating a single tag.
 */
export interface CreateTagResponse extends Tag {
  wasUpdated?: boolean              // True if force=true caused an update instead of create
}

/**
 * Request to create multiple tag mappings efficiently.
 * By default, auto-generates serial numbers for all tags without explicit proofId.
 */
export interface CreateTagsBatchRequest {
  tags: Array<{
    tagId: string                   // Required: Unique tag identifier
    productId: string               // Required: Product ID
    variantId?: string              // Optional: Variant ID
    batchId?: string                // Optional: Batch ID
    proofId?: string                // Optional: If omitted, auto-generates serial number
    metadata?: Record<string, any>  // Optional: Additional metadata
  }>
  force?: boolean                   // Optional: Overwrite existing tags in same collection (default: false)
}

/**
 * Response from batch creating tags.
 */
export interface CreateTagsBatchResponse {
  summary: {
    total: number                   // Total tags in request
    created: number                 // Successfully created
    updated: number                 // Successfully updated (with force=true)
    failed: number                  // Failed to create/update
    conflicts: number               // Already exist (without force=true)
  }
  results: {
    created: Tag[]                  // Array of successfully created tags
    updated: Tag[]                  // Array of successfully updated tags
    failed: Array<{
      tagId: string
      reason: string                // Error code (e.g., "TAG_ASSIGNED_ELSEWHERE", "CREATE_FAILED")
      message: string               // Human-readable error message
      existingTag?: Tag             // Existing tag if applicable
    }>
    conflicts: Array<{
      tagId: string
      reason: string                // "TAG_ALREADY_ASSIGNED"
      message: string
      existingTag: Tag              // The existing tag
    }>
  }
}

/**
 * Request to update an existing tag mapping.
 */
export interface UpdateTagRequest {
  productId?: string                // Optional: Update product ID
  variantId?: string | null         // Optional: Update variant ID (null to clear)
  batchId?: string | null           // Optional: Update batch ID (null to clear)
  proofId?: string                  // Optional: Update proof ID
  metadata?: Record<string, any>    // Optional: Merge with existing metadata
}

/**
 * Response from updating a tag.
 */
export interface UpdateTagResponse extends Tag {}

/**
 * Response from deleting a tag.
 */
export interface DeleteTagResponse {
  success: boolean
}

/**
 * Response from getting a single tag.
 */
export interface GetTagResponse extends Tag {}

/**
 * Request parameters for listing tags.
 */
export interface ListTagsRequest {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  productId?: string                // Optional: Filter by product ID
  variantId?: string                // Optional: Filter by variant ID
  batchId?: string                  // Optional: Filter by batch ID
}

/**
 * Response from listing tags.
 */
export interface ListTagsResponse {
  tags: Tag[]
  limit: number
  offset: number
}

/**
 * Request parameters for public tag lookup.
 */
export interface PublicGetTagRequest {
  embed?: string                    // Optional: Comma-separated values: "collection", "product", "proof"
}

/**
 * Response from public tag lookup with optional embedded data.
 */
export interface PublicGetTagResponse {
  tag: Tag
  collection?: any                  // Included if embed contains "collection"
  product?: any                     // Included if embed contains "product"
  proof?: any                       // Included if embed contains "proof"
}

/**
 * Request to lookup multiple tags in a single request.
 */
export interface PublicBatchLookupRequest {
  tagIds: string[]                  // Array of tag IDs to lookup
  embed?: string                    // Optional: Comma-separated: "collection", "product", "proof"
}

/**
 * Response from batch lookup with deduplicated related data.
 */
export interface PublicBatchLookupResponse {
  tags: Record<string, Tag>         // Map: tagId → Tag object
  collections?: Record<string, any> // Map: collectionId → Collection (if embed=collection)
  products?: Record<string, any>    // Map: productId → Product (if embed=product)
  proofs?: Record<string, any>      // Map: proofId → Proof (if embed=proof)
}

/**
 * Query parameters for public batch lookup (GET).
 */
export interface PublicBatchLookupQueryRequest {
  tagIds: string                    // Comma-separated tag IDs
  embed?: string                    // Optional: Comma-separated: "collection", "product", "proof"
}

/**
 * Response from public batch lookup (GET).
 */
export interface PublicBatchLookupQueryResponse extends PublicBatchLookupResponse {}
