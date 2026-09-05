// src/types/batch.ts
/**
 * @deprecated Batches moved to Postgres — dates now come back as ISO 8601 strings, never
 * Firestore Timestamp objects. Kept only so request bodies can still pass a legacy value.
 */
export interface FirebaseTimestamp {
  seconds: number                 // Unix timestamp in seconds
  nanoseconds?: number            // Nanoseconds component
}

/**
 * Represents a Batch object. Dates are **ISO 8601 strings**.
 */
export interface BatchResponse {
  id: string                      // Batch ID
  name?: string | null            // Batch name
  /** ISO 8601 date-time (was a Firebase Timestamp; now normalised to a string). */
  expiryDate?: string | null
  productId?: string              // Product ID
  collectionId?: string           // Collection ID
  createdAt?: string              // ISO 8601
  updatedAt?: string              // ISO 8601
  /** Present only on soft-deleted batches. */
  deleted?: boolean
  deletedAt?: string              // ISO 8601
  /** Admin-only zone (e.g. `lastSerialId`). Returned on admin reads only — never on public reads. */
  admin?: Record<string, any>
  [key: string]: any              // Additional (schemaless) batch fields
}

/**
 * Request payload for creating a new batch.
 */
export interface BatchCreateRequest {
  /** @deprecated Ignored — the server generates the batch id. */
  id?: string
  name?: string
  /** A `Date`, ISO 8601 string, or legacy Firebase Timestamp — all accepted. */
  expiryDate?: FirebaseTimestamp | string | Date
  [key: string]: any              // Additional batch fields
}

/**
 * Request payload for updating an existing batch.
 */
export interface BatchUpdateRequest {
  name?: string
  expiryDate?: FirebaseTimestamp | string | Date
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
