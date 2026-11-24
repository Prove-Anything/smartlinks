// src/types/batch.ts
import type { ListOptions } from './list'

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
  name?: string
  /** A `Date` or an ISO 8601 string. */
  expiryDate?: string | Date
  [key: string]: any              // Additional batch fields
}

/**
 * Request payload for updating an existing batch.
 */
export interface BatchUpdateRequest {
  name?: string
  /** A `Date` or an ISO 8601 string. */
  expiryDate?: string | Date
  [key: string]: any              // Additional batch fields
}

/**
 * Options for `batch.searchInCollection`. `limit` is how many it returns (100 unless you say); when
 * there are more, pass the answer's `nextCursor` back as `cursor`.
 */
export interface SearchBatchesRequest extends ListOptions {
  q?: string                      // Search term (batch ID or name)
  productId?: string              // Filter by specific product
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
