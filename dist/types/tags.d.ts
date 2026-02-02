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
    id: string;
    orgId: string;
    tagId: string;
    collectionId: string;
    productId: string;
    variantId?: string | null;
    batchId?: string | null;
    proofId: string;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
/**
 * Request to create a single tag mapping.
 * If proofId is not provided, automatically generates a serial number.
 */
export interface CreateTagRequest {
    tagId: string;
    productId: string;
    variantId?: string;
    batchId?: string;
    proofId?: string;
    useSerialNumber?: boolean;
    metadata?: Record<string, any>;
    force?: boolean;
}
/**
 * Response from creating a single tag.
 */
export interface CreateTagResponse extends Tag {
    wasUpdated?: boolean;
}
/**
 * Request to create multiple tag mappings efficiently.
 * By default, auto-generates serial numbers for all tags without explicit proofId.
 */
export interface CreateTagsBatchRequest {
    tags: Array<{
        tagId: string;
        productId: string;
        variantId?: string;
        batchId?: string;
        proofId?: string;
        metadata?: Record<string, any>;
    }>;
    force?: boolean;
}
/**
 * Response from batch creating tags.
 */
export interface CreateTagsBatchResponse {
    summary: {
        total: number;
        created: number;
        updated: number;
        failed: number;
        conflicts: number;
    };
    results: {
        created: Tag[];
        updated: Tag[];
        failed: Array<{
            tagId: string;
            reason: string;
            message: string;
            existingTag?: Tag;
        }>;
        conflicts: Array<{
            tagId: string;
            reason: string;
            message: string;
            existingTag: Tag;
        }>;
    };
}
/**
 * Request to update an existing tag mapping.
 */
export interface UpdateTagRequest {
    productId?: string;
    variantId?: string | null;
    batchId?: string | null;
    proofId?: string;
    metadata?: Record<string, any>;
}
/**
 * Response from updating a tag.
 */
export interface UpdateTagResponse extends Tag {
}
/**
 * Response from deleting a tag.
 */
export interface DeleteTagResponse {
    success: boolean;
}
/**
 * Response from getting a single tag.
 */
export interface GetTagResponse extends Tag {
}
/**
 * Request parameters for listing tags.
 */
export interface ListTagsRequest {
    limit?: number;
    offset?: number;
    productId?: string;
    variantId?: string;
    batchId?: string;
}
/**
 * Response from listing tags.
 */
export interface ListTagsResponse {
    tags: Tag[];
    limit: number;
    offset: number;
}
/**
 * Request parameters for public tag lookup.
 */
export interface PublicGetTagRequest {
    embed?: string;
}
/**
 * Response from public tag lookup with optional embedded data.
 */
export interface PublicGetTagResponse {
    tag: Tag;
    collection?: any;
    product?: any;
    proof?: any;
}
/**
 * Request to lookup multiple tags in a single request.
 */
export interface PublicBatchLookupRequest {
    tagIds: string[];
    embed?: string;
}
/**
 * Response from batch lookup with deduplicated related data.
 */
export interface PublicBatchLookupResponse {
    tags: Record<string, Tag>;
    collections?: Record<string, any>;
    products?: Record<string, any>;
    proofs?: Record<string, any>;
}
/**
 * Query parameters for public batch lookup (GET).
 */
export interface PublicBatchLookupQueryRequest {
    tagIds: string;
    embed?: string;
}
/**
 * Response from public batch lookup (GET).
 */
export interface PublicBatchLookupQueryResponse extends PublicBatchLookupResponse {
}
