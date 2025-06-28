// src/api/batch.ts
import { request, post, put, del } from "../http"
import { BatchResponse, BatchCreateRequest, BatchUpdateRequest } from "../types/batch"

export namespace batch {
  // Admin CRUD operations
  /**
   * Get a single batch by ID for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param batchId - Identifier of the batch
   * @returns Promise resolving to a BatchResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(
    collectionId: string,
    productId: string,
    batchId: string
  ): Promise<BatchResponse> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/batch/${encodeURIComponent(batchId)}`
    return request<BatchResponse>(path)
  }

  /**
   * List all batches for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @returns Promise resolving to an array of BatchResponse objects
   * @throws ErrorResponse if the request fails
   */
  export async function list(
    collectionId: string,
    productId: string
  ): Promise<BatchResponse[]> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(productId)}/batch`
    return request<BatchResponse[]>(path)
  }

  /**
   * Create a new batch for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param data - Batch creation data
   * @returns Promise resolving to a BatchResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function create(
    collectionId: string,
    productId: string,
    data: BatchCreateRequest
  ): Promise<BatchResponse> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(productId)}/batch`
    return post<BatchResponse>(path, data)
  }

  /**
   * Update a batch for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param batchId - Identifier of the batch
   * @param data - Batch update data
   * @returns Promise resolving to a BatchResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function update(
    collectionId: string,
    productId: string,
    batchId: string,
    data: BatchUpdateRequest
  ): Promise<BatchResponse> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/batch/${encodeURIComponent(batchId)}`
    return put<BatchResponse>(path, data)
  }

  /**
   * Delete a batch for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param batchId - Identifier of the batch
   * @returns Promise resolving to void
   * @throws ErrorResponse if the request fails
   */
  export async function remove(
    collectionId: string,
    productId: string,
    batchId: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/batch/${encodeURIComponent(batchId)}`
    return del<void>(path)
  }

  // Public read-only operation
  /**
   * Get a single batch by ID for a collection and product (public endpoint).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param batchId - Identifier of the batch
   * @returns Promise resolving to a BatchResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function getPublic(
    collectionId: string,
    productId: string,
    batchId: string
  ): Promise<BatchResponse> {
    const path = `/public/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/batch/${encodeURIComponent(batchId)}`
    return request<BatchResponse>(path)
  }
}
