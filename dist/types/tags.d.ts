/**
 * Tag Management Types
 *
 * Types for the two-tier tag system:
 *  - Per-org shard (`tags` table) — full tag data, all collection-scoped queries
 *  - Shared shard (`tag_index` table) — tagId → collectionId routing only
 */
/**
 * Full tag record, stored on the per-org shard.
 * Returned by all collection-scoped endpoints.
 */
export interface Tag {
    id: string;
    orgId: string;
    tagId: string;
    collectionId: string;
    productId: string | null;
    variantId: string | null;
    batchId: string | null;
    proofId: string | null;
    /**
     * Polymorphic ref type: `'app_record'`, `'app_case'`, `'app_thread'`, `'container'`, etc.
     * Always paired with `refId`.
     */
    refType: string | null;
    /** UUID of the referenced object.  Always paired with `refType`. */
    refId: string | null;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
/**
 * Lightweight index entry returned by the global resolve endpoint only
 * (`GET /public/tags/:tagId`).
 *
 * Use this when the collection is not yet known — it contains routing info
 * only.  Once `collectionId` is resolved, use the collection-scoped endpoints
 * for full tag data.
 */
export interface TagIndexEntry {
    tagId: string;
    collectionId: string;
}
/**
 * Deduplicated embedded objects attached to collection-scoped tag lookup
 * responses.  Which fields are populated depends on the `embed` parameter.
 *
 * Supported `embed` values: `'product'`, `'proof'`, `'container'`, `'ref'`
 * (`embed=collection` is not supported on collection-scoped endpoints).
 */
export interface TagEmbedded {
    /** `productId → Firestore product record` (when `embed` includes `'product'`) */
    products?: Record<string, any>;
    /**
     * `proofId → proof record or virtual serial-number proof`
     * (when `embed` includes `'proof'`)
     */
    proofs?: Record<string, any>;
    /**
     * `containerId → Container row`
     * (for tags where `refType === 'container'`, when `embed` includes `'container'`)
     */
    containers?: Record<string, any>;
    /**
     * `refId → app_record | app_case | app_thread | container`
     * (when `embed` includes `'ref'`)
     */
    refs?: Record<string, any>;
}
/** Request body to create a single tag mapping. */
export interface CreateTagRequest {
    tagId: string;
    productId?: string;
    variantId?: string;
    batchId?: string;
    proofId?: string;
    useSerialNumber?: boolean;
    refType?: string;
    refId?: string;
    metadata?: Record<string, any>;
    force?: boolean;
}
/** Request body to batch-create tags. `force` applies to all entries in the batch. */
export interface BatchCreateTagRequest {
    tags: Omit<CreateTagRequest, 'force'>[];
    force?: boolean;
}
/** Partial update request — `metadata` is deep-merged with existing values. */
export interface UpdateTagRequest {
    productId?: string;
    variantId?: string;
    batchId?: string;
    proofId?: string;
    /** Pass `null` to clear the polymorphic ref.  Must be paired with `refId`. */
    refType?: string | null;
    /** Pass `null` to clear the polymorphic ref.  Must be paired with `refType`. */
    refId?: string | null;
    metadata?: Record<string, any>;
}
/** Returned when creating a single tag (`wasUpdated: true` when force triggered an update). */
export interface CreateTagResponse extends Tag {
    wasUpdated?: boolean;
}
/** Result of a batch tag creation. Partial success is possible. */
export interface BatchCreateResult {
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
        }>;
        conflicts: Array<{
            tagId: string;
            reason: string;
            message: string;
            existingTag: Tag;
        }>;
    };
}
export interface UpdateTagResponse extends Tag {
}
export interface DeleteTagResponse {
    success: boolean;
}
export interface GetTagResponse extends Tag {
}
export interface ListTagsRequest {
    limit?: number;
    offset?: number;
    productId?: string;
    variantId?: string;
    batchId?: string;
    /** Filter by polymorphic ref type (e.g. `'container'`, `'app_record'`) */
    refType?: string;
    /** Filter by polymorphic ref UUID */
    refId?: string;
}
export interface ListTagsResponse {
    tags: Tag[];
    limit: number;
    offset: number;
}
/**
 * Request body / params for the collection-scoped batch lookup.
 *
 * `embed` — comma-separated: `'product'`, `'proof'`, `'container'`, `'ref'`
 */
export interface LookupTagsRequest {
    tagIds: string[];
    embed?: string;
}
/**
 * Query-string variant of {@link LookupTagsRequest} for GET requests.
 * `tagIds` is a comma-separated string.
 */
export interface LookupTagsQueryRequest {
    tagIds: string;
    embed?: string;
}
/**
 * POST body for the collection-scoped public by-ref lookup.
 * `embed` — comma-separated: `'product'`, `'proof'`, `'container'`, `'ref'`
 */
export interface ByRefRequest {
    refType: string;
    refId: string;
    embed?: string;
}
/**
 * Query parameters for admin and public GET by-ref requests.
 */
export interface ReverseTagLookupParams {
    /** Required — polymorphic ref type */
    refType: string;
    /** Required — UUID of the referenced object */
    refId: string;
    /** Optional embed string (public endpoint only) */
    embed?: string;
}
/**
 * Response from the collection-scoped single-tag public endpoint.
 * `GET /public/collection/:collectionId/tags/:tagId?embed=product,proof,ref`
 */
export interface PublicGetTagResponse {
    tag: Tag;
    embedded: TagEmbedded;
}
/**
 * Response from the collection-scoped batch lookup endpoints.
 * `POST /public/collection/:collectionId/tags/lookup`
 * `GET  /public/collection/:collectionId/tags/lookup?tagIds=...`
 */
export interface TagLookupResponse {
    count: number;
    tags: Tag[];
    embedded: TagEmbedded;
}
/** Response from the admin by-ref endpoint (no embed support on admin side). */
export interface ReverseTagLookupResponse {
    tags: Tag[];
}
/**
 * Response from the public by-ref endpoints (supports `embed`).
 * `GET  /public/collection/:collectionId/tags/by-ref?refType=&refId=&embed=`
 * `POST /public/collection/:collectionId/tags/by-ref`
 */
export interface ByRefResponse {
    tags: Tag[];
    embedded: TagEmbedded;
}
