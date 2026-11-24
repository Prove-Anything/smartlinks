import { BatchResponse, BatchCreateRequest, BatchUpdateRequest, SearchBatchesRequest, BatchTag } from "../types/batch.js";
import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace batch {
    /**
     * Get a single batch by ID for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, productId: string, batchId: string): Promise<BatchResponse>;
    /**
     * List the batches for a collection and product (admin only), 50 at a time unless you give a
     * `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that
     * was the last one.
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param options - Paging: `limit` and `cursor`
     * @returns Promise resolving to `{ items, nextCursor, count }`, where `items` are BatchResponse objects
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * let page = await batch.list('coll_123', 'prod_abc', { limit: 100 })
     * console.log(`${page.count} batches`)
     * while (page.nextCursor) page = await batch.list('coll_123', 'prod_abc', { limit: 100, cursor: page.nextCursor })
     * ```
     */
    function list(collectionId: string, productId: string, options?: ListOptions): Promise<ListResult<BatchResponse>>;
    /**
     * Create a new batch for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param data - Batch creation data
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    function create(collectionId: string, productId: string, data: BatchCreateRequest): Promise<BatchResponse>;
    /**
     * Update a batch for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @param data - Batch update data
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    function update(collectionId: string, productId: string, batchId: string, data: BatchUpdateRequest): Promise<BatchResponse>;
    /**
     * Delete a batch for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    function remove(collectionId: string, productId: string, batchId: string): Promise<void>;
    /**
     * Get a single batch by ID for a collection and product (public endpoint).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    function getPublic(collectionId: string, productId: string, batchId: string): Promise<BatchResponse>;
    /**
     * Get serial numbers for a batch (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    function getSN(collectionId: string, productId: string, batchId: string, startIndex?: number, count?: number): Promise<any>;
    /**
     * Look up a serial number by code for a batch (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    function lookupSN(collectionId: string, productId: string, batchId: string, codeId: string): Promise<any>;
    /**
     * Search for batches across all products in a collection.
     * Allows searching by batch ID or name (`q`), with optional product filtering.
     * `limit` is how many it returns (100 unless you say). When there are more, pass `nextCursor` back
     * as `cursor` for the next ones; `null` means there are no more.
     *
     * @param collectionId - Identifier of the collection
     * @param params - Optional search parameters (`q`, `productId`) and paging (`limit`, `cursor`)
     * @returns Promise resolving to `{ items, nextCursor }`, where `items` are the matching BatchResponse objects
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Search for batches containing "2024", 50 at a time
     * let page = await batch.searchInCollection('coll_123', { q: 'BATCH-2024', limit: 50 })
     * const batches = [...page.items]
     * while (page.nextCursor) {
     *   page = await batch.searchInCollection('coll_123', { q: 'BATCH-2024', limit: 50, cursor: page.nextCursor })
     *   batches.push(...page.items)
     * }
     *
     * // Filter batches for a specific product
     * const productBatches = await batch.searchInCollection('coll_123', {
     *   productId: 'prod_abc',
     *   limit: 100
     * })
     *
     * // The first batches in the collection
     * const firstBatches = await batch.searchInCollection('coll_123')
     *
     * // Check for expired batches (expiryDate is an ISO 8601 string)
     * batches.forEach(batch => {
     *   if (batch.expiryDate && new Date(batch.expiryDate) < new Date()) {
     *     console.log(`Batch ${batch.id} is expired`)
     *   }
     * })
     * ```
     */
    function searchInCollection(collectionId: string, params?: SearchBatchesRequest): Promise<ListResult<BatchResponse>>;
    /**
     * Find a specific batch by ID across all products in a collection.
     * Returns the batch along with the productId it belongs to.
     *
     * @param collectionId - Identifier of the collection
     * @param batchId - Batch ID to find
     * @returns Promise resolving to a BatchResponse with productId
     * @throws ErrorResponse if the request fails (404 if not found)
     *
     * @example
     * ```typescript
     * // Find which product contains a specific batch
     * const batch = await batch.findInCollection('coll_123', 'BATCH-2024-001')
     * console.log(`Batch found in product: ${batch.productId}`)
     * console.log(`Expires: ${batch.expiryDate}`)
     * ```
     */
    function findInCollection(collectionId: string, batchId: string): Promise<BatchResponse>;
    /**
     * Get all tags/codes assigned to a specific batch.
     * Shows which claim set codes have been assigned to this batch, 50 at a time unless you give a
     * `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that
     * was the last one. `count` is how many there are in all.
     *
     * @param collectionId - Identifier of the collection
     * @param batchId - Batch ID
     * @param claimSetId - Optional claim set ID to filter results
     * @param options - Paging: `limit` and `cursor`
     * @returns Promise resolving to `{ items, nextCursor, count }`, where `items` are BatchTag objects
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // The tags assigned to a batch, 200 at a time
     * let page = await batch.getBatchTags('coll_123', 'BATCH-2024-001', undefined, { limit: 200 })
     * console.log(`Batch has ${page.count} tags assigned`)
     * page.items.forEach(tag => {
     *   console.log(`Code: ${tag.code}, ClaimSet: ${tag.claimSetId}, TagID: ${tag.tagId}`)
     * })
     * while (page.nextCursor) {
     *   page = await batch.getBatchTags('coll_123', 'BATCH-2024-001', undefined, { limit: 200, cursor: page.nextCursor })
     * }
     *
     * // Get tags from a specific claim set
     * const claimSetTags = await batch.getBatchTags('coll_123', 'BATCH-2024-001', '000001')
     * ```
     */
    function getBatchTags(collectionId: string, batchId: string, claimSetId?: string, options?: ListOptions): Promise<ListResult<BatchTag>>;
}
