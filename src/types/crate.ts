/**
 * Crate Management Types
 * 
 * Types for managing crates (containers for tags/products).
 */

/**
 * Item within a crate.
 */
export interface CrateItem {
  id: string                      // Item ID (tag ID)
  codeId: string                  // Code identifier
  batchId?: string                // Batch identifier
  productId?: string              // Product identifier
  claimId?: string                // Claim identifier
  productName?: string            // Product name
  productGtin?: string            // Product GTIN
  productImage?: string           // Product image URL
  data?: Record<string, any>      // Additional item data
}

/**
 * Represents a crate containing items.
 */
export interface Crate {
  id: string                      // Crate ID
  items?: CrateItem[]             // Array of items in the crate
  deleted?: boolean               // Whether the crate is soft-deleted
  deletedAt?: string | null       // ISO 8601 timestamp when deleted
}

/**
 * Query parameters for listing crates.
 */
export interface ListCratesRequest {
  limit?: number                  // Number of results per page (default: 100, max: 100)
  startAfter?: string             // Crate ID to start after for pagination
  includeDeleted?: boolean        // Include soft-deleted crates (default: false)
}

/**
 * Response from listing crates.
 */
export interface ListCratesResponse {
  items: Crate[]                  // Array of crates
  hasMore: boolean                // Whether more results are available
  lastId: string | null           // ID of last crate (use as startAfter for next page)
}

/**
 * Response from getting a single crate.
 */
export interface GetCrateResponse extends Crate {}

/**
 * Request to create a crate.
 */
export interface CreateCrateRequest {
  items?: CrateItem[]             // Initial items for the crate
  [key: string]: any              // Additional fields
}

/**
 * Response from creating a crate.
 */
export interface CreateCrateResponse extends Crate {}

/**
 * Request to update a crate.
 */
export interface UpdateCrateRequest {
  items?: CrateItem[]             // Updated items
  [key: string]: any              // Additional fields
}

/**
 * Response from updating a crate.
 */
export interface UpdateCrateResponse extends Crate {}

/**
 * Response from deleting a crate.
 */
export interface DeleteCrateResponse {
  success: boolean
}
