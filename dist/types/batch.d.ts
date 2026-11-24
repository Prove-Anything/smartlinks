/**
 * Represents a Batch object. Dates are **ISO 8601 strings**.
 */
export interface BatchResponse {
    id: string;
    name?: string | null;
    /** ISO 8601 date-time (was a Firebase Timestamp; now normalised to a string). */
    expiryDate?: string | null;
    productId?: string;
    collectionId?: string;
    createdAt?: string;
    updatedAt?: string;
    /** Present only on soft-deleted batches. */
    deleted?: boolean;
    deletedAt?: string;
    /** Admin-only zone (e.g. `lastSerialId`). Returned on admin reads only — never on public reads. */
    admin?: Record<string, any>;
    [key: string]: any;
}
/**
 * Request payload for creating a new batch.
 */
export interface BatchCreateRequest {
    name?: string;
    /** A `Date` or an ISO 8601 string. */
    expiryDate?: string | Date;
    [key: string]: any;
}
/**
 * Request payload for updating an existing batch.
 */
export interface BatchUpdateRequest {
    name?: string;
    /** A `Date` or an ISO 8601 string. */
    expiryDate?: string | Date;
    [key: string]: any;
}
/**
 * Options for `batch.searchInCollection`. The search answers in one page (it has no cursor):
 * `limit` is the most it returns.
 */
export interface SearchBatchesRequest {
    search?: string;
    productId?: string;
    limit?: number;
}
/**
 * Tag/code assigned to a batch.
 */
export interface BatchTag {
    code: string;
    claimSetId: string;
    collectionId?: string;
    productId?: string;
    batchId?: string;
    tagId?: string;
    index?: number;
}
