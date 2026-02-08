/**
 * Crate Management Types
 *
 * Types for managing crates (containers for tags/products).
 */
/**
 * Item within a crate.
 */
export interface CrateItem {
    id: string;
    codeId: string;
    batchId?: string;
    productId?: string;
    claimId?: string;
    productName?: string;
    productGtin?: string;
    productImage?: string;
    data?: Record<string, any>;
}
/**
 * Represents a crate containing items.
 */
export interface Crate {
    id: string;
    items?: CrateItem[];
    deleted?: boolean;
    deletedAt?: string | null;
}
/**
 * Query parameters for listing crates.
 */
export interface ListCratesRequest {
    limit?: number;
    startAfter?: string;
    includeDeleted?: boolean;
}
/**
 * Response from listing crates.
 */
export interface ListCratesResponse {
    items: Crate[];
    hasMore: boolean;
    lastId: string | null;
}
/**
 * Response from getting a single crate.
 */
export interface GetCrateResponse extends Crate {
}
/**
 * Request to create a crate.
 */
export interface CreateCrateRequest {
    items?: CrateItem[];
    [key: string]: any;
}
/**
 * Response from creating a crate.
 */
export interface CreateCrateResponse extends Crate {
}
/**
 * Request to update a crate.
 */
export interface UpdateCrateRequest {
    items?: CrateItem[];
    [key: string]: any;
}
/**
 * Response from updating a crate.
 */
export interface UpdateCrateResponse extends Crate {
}
/**
 * Response from deleting a crate.
 */
export interface DeleteCrateResponse {
    success: boolean;
}
