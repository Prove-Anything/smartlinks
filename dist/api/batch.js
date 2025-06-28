// src/api/batch.ts
import { request, post, put, del } from "../http";
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
     * List all batches for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @returns Promise resolving to an array of BatchResponse objects
     * @throws ErrorResponse if the request fails
     */
    async function list(collectionId, productId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch`;
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
})(batch || (batch = {}));
