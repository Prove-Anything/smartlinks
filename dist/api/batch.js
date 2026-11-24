// src/api/batch.ts
import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
export var batch;
(function (batch) {
    // Admin CRUD operations
    /**
     * Get a single batch by ID for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, productId, batchId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}`;
        return request(path);
    }
    batch.get = get;
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
    async function list(collectionId, productId, options = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    batch.list = list;
    /**
     * Create a new batch for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param data - Batch creation data
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    async function create(collectionId, productId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch`;
        return post(path, data);
    }
    batch.create = create;
    /**
     * Update a batch for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @param data - Batch update data
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    async function update(collectionId, productId, batchId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}`;
        return put(path, data);
    }
    batch.update = update;
    /**
     * Delete a batch for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    async function remove(collectionId, productId, batchId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}`;
        return del(path);
    }
    batch.remove = remove;
    // Public read-only operation
    /**
     * Get a single batch by ID for a collection and product (public endpoint).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @returns Promise resolving to a BatchResponse object
     * @throws ErrorResponse if the request fails
     */
    async function getPublic(collectionId, productId, batchId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}`;
        return request(path);
    }
    batch.getPublic = getPublic;
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
    async function getSN(collectionId, productId, batchId, startIndex = 0, count = 10) {
        const queryParams = new URLSearchParams({
            startIndex: startIndex.toString(),
            count: count.toString()
        });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}/getSN?${queryParams}`;
        return request(path);
    }
    batch.getSN = getSN;
    /**
     * Look up a serial number by code for a batch (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param batchId - Identifier of the batch
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    async function lookupSN(collectionId, productId, batchId, codeId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}/lookupSN/${encodeURIComponent(codeId)}`;
        return request(path);
    }
    batch.lookupSN = lookupSN;
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
    async function searchInCollection(collectionId, params) {
        const query = listQuery({
            q: params === null || params === void 0 ? void 0 : params.q,
            productId: params === null || params === void 0 ? void 0 : params.productId,
            limit: (params === null || params === void 0 ? void 0 : params.limit) || undefined,
            cursor: params === null || params === void 0 ? void 0 : params.cursor,
        });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/batch${query}`;
        return request(path);
    }
    batch.searchInCollection = searchInCollection;
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
    async function findInCollection(collectionId, batchId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/batch/${encodeURIComponent(batchId)}`;
        return request(path);
    }
    batch.findInCollection = findInCollection;
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
    async function getBatchTags(collectionId, batchId, claimSetId, options = {}) {
        const query = listQuery({ claimSetId, limit: options.limit, cursor: options.cursor });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/batch/${encodeURIComponent(batchId)}/tags${query}`;
        return request(path);
    }
    batch.getBatchTags = getBatchTags;
})(batch || (batch = {}));
