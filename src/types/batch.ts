// src/types/batch.ts
/**
 * Firebase Timestamp object.
 */
export interface FirebaseTimestamp {
  seconds: number                 // Unix timestamp in seconds
  nanoseconds?: number            // Nanoseconds component
}

/**
 * Represents a Batch object.
 */
export interface BatchResponse {
  id: string                      // Batch ID
  name?: string                   // Batch name
  expiryDate?: FirebaseTimestamp | string  // Firebase timestamp or ISO 8601 date
  productId?: string              // Product ID (for collection-level searches)
  collectionId?: string           // Collection ID
  [key: string]: any              // Additional batch fields
}

/**
 * Request payload for creating a new batch.
 */
export interface BatchCreateRequest {
  id: string                      // Batch ID
  name?: string                   // Batch name
  expiryDate?: FirebaseTimestamp | string  // Firebase timestamp or ISO 8601 date
  [key: string]: any              // Additional batch fields
}

/**
 * Request payload for updating an existing batch.
 */
export interface BatchUpdateRequest {
  name?: string                   // Batch name
  expiryDate?: FirebaseTimestamp | string  // Firebase timestamp or ISO 8601 date
  [key: string]: any              // Additional batch fields
}

/**
 * Query parameters for searching batches in a collection.
 */
export interface SearchBatchesRequest {
  search?: string                 // Search term (batch ID or name)
  productId?: string              // Filter by specific product
  limit?: number                  // Max results (default: 100)
}

/**
 * Tag/code assigned to a batch.
 */
export interface BatchTag {
  code: string                    // Code/tag ID
  claimSetId: string              // Claim set ID
  collectionId?: string           // Collection ID
  productId?: string              // Associated product ID
  batchId?: string                // Batch ID
  tagId?: string                  // Tag identifier
  index?: number                  // Position in claim set
}
