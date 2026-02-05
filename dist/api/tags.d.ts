import { CreateTagRequest, CreateTagResponse, CreateTagsBatchRequest, CreateTagsBatchResponse, UpdateTagRequest, UpdateTagResponse, DeleteTagResponse, GetTagResponse, ListTagsRequest, ListTagsResponse, PublicGetTagRequest, PublicGetTagResponse, PublicBatchLookupRequest, PublicBatchLookupResponse, PublicBatchLookupQueryRequest, PublicBatchLookupQueryResponse } from "../types/tags";
/**
 * Tag Management API
 *
 * Create mappings between physical tags (NFC tags, QR codes, etc.) and digital proofs.
 * Supports automatic serial number generation, batch operations, and public lookups.
 */
export declare namespace tags {
    /**
     * Create a single tag mapping.
     * If proofId is not provided, automatically generates a serial number.
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - Tag creation data
     * @returns Promise resolving to a CreateTagResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Auto-generate serial number
     * const tag = await tags.create('coll_123', {
     *   tagId: 'TAG001',
     *   productId: 'prod_456',
     *   variantId: 'var_789'
     * })
     *
     * // Use explicit proof ID
     * const tag2 = await tags.create('coll_123', {
     *   tagId: 'TAG002',
     *   productId: 'prod_456',
     *   proofId: 'proof_explicit_123'
     * })
     * ```
     */
    function create(collectionId: string, data: CreateTagRequest): Promise<CreateTagResponse>;
    /**
     * Create multiple tag mappings efficiently in a batch operation.
     * By default, auto-generates serial numbers for all tags without explicit proofId.
     * Tags are grouped by product/variant/batch and serial numbers are generated in
     * a single transaction per group for optimal performance.
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - Batch creation data
     * @returns Promise resolving to a CreateTagsBatchResponse with summary and results
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const result = await tags.createBatch('coll_123', {
     *   tags: [
     *     { tagId: 'TAG001', productId: 'prod_456', variantId: 'var_789' },
     *     { tagId: 'TAG002', productId: 'prod_456', variantId: 'var_789' },
     *     { tagId: 'TAG003', productId: 'prod_456', batchId: 'batch_100' }
     *   ]
     * })
     *
     * console.log(`Created: ${result.summary.created}, Failed: ${result.summary.failed}`)
     * ```
     */
    function createBatch(collectionId: string, data: CreateTagsBatchRequest): Promise<CreateTagsBatchResponse>;
    /**
     * Update an existing tag mapping.
     *
     * @param collectionId - Identifier of the parent collection
     * @param tagId - Unique tag identifier
     * @param data - Update data (only include fields to update)
     * @returns Promise resolving to an UpdateTagResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const updated = await tags.update('coll_123', 'TAG001', {
     *   variantId: 'var_999',
     *   metadata: { notes: 'Updated variant' }
     * })
     * ```
     */
    function update(collectionId: string, tagId: string, data: UpdateTagRequest): Promise<UpdateTagResponse>;
    /**
     * Delete a tag mapping.
     *
     * @param collectionId - Identifier of the parent collection
     * @param tagId - Unique tag identifier
     * @returns Promise resolving to a DeleteTagResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * await tags.remove('coll_123', 'TAG001')
     * ```
     */
    function remove(collectionId: string, tagId: string): Promise<DeleteTagResponse>;
    /**
     * Get a single tag mapping by tagId.
     *
     * @param collectionId - Identifier of the parent collection
     * @param tagId - Unique tag identifier
     * @returns Promise resolving to a GetTagResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const tag = await tags.get('coll_123', 'TAG001')
     * ```
     */
    function get(collectionId: string, tagId: string): Promise<GetTagResponse>;
    /**
     * List all tags for a collection with optional filters and pagination.
     *
     * @param collectionId - Identifier of the parent collection
     * @param params - Optional query parameters for filtering and pagination
     * @returns Promise resolving to a ListTagsResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // List all tags
     * const all = await tags.list('coll_123')
     *
     * // List with filters
     * const filtered = await tags.list('coll_123', {
     *   productId: 'prod_456',
     *   variantId: 'var_789',
     *   limit: 50,
     *   offset: 0
     * })
     * ```
     */
    function list(collectionId: string, params?: ListTagsRequest): Promise<ListTagsResponse>;
    /**
     * Public lookup of a single tag by tagId (global).
     * Optionally embed related collection, product, or proof data.
     * No authentication required.
     *
     * @param tagId - Unique tag identifier (globally unique)
     * @param params - Optional parameters (embed)
     * @returns Promise resolving to a PublicGetTagResponse with optional embedded data
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Simple lookup
     * const result = await tags.getTag('TAG001')
     *
     * // With embedded data
     * const withData = await tags.getTag('TAG001', {
     *   embed: 'collection,product,proof'
     * })
     * console.log(withData.tag, withData.collection, withData.product, withData.proof)
     * ```
     */
    function getTag(tagId: string, params?: PublicGetTagRequest): Promise<PublicGetTagResponse>;
    /**
     * Backward-compat: Public lookup with collectionId parameter (ignored).
     * Calls global route under /public/tags/:tagId.
     */
    function publicGet(_collectionId: string, tagId: string, params?: PublicGetTagRequest): Promise<PublicGetTagResponse>;
    /**
     * Public batch lookup of multiple tags in a single request (POST).
     * Only returns tags from the specified collection.
     * Optionally embed related data. Related data is deduplicated and batch-fetched.
     * No authentication required.
     *
     * @param collectionId - Identifier of the collection to search within
     * @param data - Request containing array of tagIds and optional embed parameter
     * @returns Promise resolving to PublicBatchLookupResponse with deduplicated related data
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const result = await tags.publicBatchLookup('coll_123', {
     *   tagIds: ['TAG001', 'TAG002', 'TAG003'],
     *   embed: 'collection,product'
     * })
     *
     * // Access tags and deduplicated collections/products
     * console.log(result.tags['TAG001'])
     * console.log(result.collections)
     * console.log(result.products)
     * ```
     */
    function lookupTags(data: PublicBatchLookupRequest): Promise<PublicBatchLookupResponse>;
    /**
     * Backward-compat: Public batch lookup with collectionId parameter (ignored).
     * Calls global route under /public/tags/lookup.
     */
    function publicBatchLookup(_collectionId: string, data: PublicBatchLookupRequest): Promise<PublicBatchLookupResponse>;
    /**
     * Public batch lookup of multiple tags using query parameters (GET).
     * Only returns tags from the specified collection.
     * Alternative to publicBatchLookup for simple GET requests.
     * No authentication required.
     *
     * @param collectionId - Identifier of the collection to search within
     * @param params - Query parameters with comma-separated tagIds and optional embed
     * @returns Promise resolving to PublicBatchLookupQueryResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const result = await tags.publicBatchLookupQuery('coll_123', {
     *   tagIds: 'TAG001,TAG002,TAG003',
     *   embed: 'collection'
     * })
     * ```
     */
    function lookupTagsQuery(params: PublicBatchLookupQueryRequest): Promise<PublicBatchLookupQueryResponse>;
    /**
     * Backward-compat: Public batch lookup (GET) with collectionId parameter (ignored).
     * Calls global route under /public/tags/lookup.
     */
    function publicBatchLookupQuery(_collectionId: string, params: PublicBatchLookupQueryRequest): Promise<PublicBatchLookupQueryResponse>;
}
