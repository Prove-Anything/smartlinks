/**
 * Firebase Timestamp object.
 */
export interface FirebaseTimestamp {
    seconds: number;
    nanoseconds?: number;
}
/**
 * Represents a Batch object.
 */
export interface BatchResponse {
    id: string;
    name?: string;
    expiryDate?: FirebaseTimestamp | string;
    productId?: string;
    collectionId?: string;
    [key: string]: any;
}
/**
 * Request payload for creating a new batch.
 */
export interface BatchCreateRequest {
    id: string;
    name?: string;
    expiryDate?: FirebaseTimestamp | string;
    [key: string]: any;
}
/**
 * Request payload for updating an existing batch.
 */
export interface BatchUpdateRequest {
    name?: string;
    expiryDate?: FirebaseTimestamp | string;
    [key: string]: any;
}
/**
 * Query parameters for searching batches in a collection.
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
