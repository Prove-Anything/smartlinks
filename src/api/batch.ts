// src/api/batch.ts
import { request, post, put, del } from "../http"
import { 
  BatchResponse, 
  BatchCreateRequest, 
  BatchUpdateRequest,
  SearchBatchesRequest,
  BatchTag
} from "../types/batch"

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
  export async function getSN(
    collectionId: string,
    productId: string,
    batchId: string,
    startIndex: number = 0,
    count: number = 10
  ): Promise<any> {
    const queryParams = new URLSearchParams({
      startIndex: startIndex.toString(),
      count: count.toString()
    })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}/getSN?${queryParams}`
    return request<any>(path)
  }

  /**
   * Look up a serial number by code for a batch (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param batchId - Identifier of the batch
   * @param codeId - The serial number code to look up
   * @returns Promise resolving to serial number lookup data
   * @throws ErrorResponse if the request fails
   */
  export async function lookupSN(
    collectionId: string,
    productId: string,
    batchId: string,
    codeId: string
  ): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}/lookupSN/${encodeURIComponent(codeId)}`
    return request<any>(path)
  }

  /**
   * Search for batches across all products in a collection.
   * Allows searching by batch ID or name, with optional product filtering.
   * 
   * @param collectionId - Identifier of the collection
   * @param params - Optional search parameters (search term, productId filter, limit)
   * @returns Promise resolving to an array of matching BatchResponse objects
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * // Search for batches containing "2024"
   * const batches = await batch.searchInCollection('coll_123', {
   *   search: 'BATCH-2024',
   *   limit: 50
   * })
   * 
   * // Filter batches for a specific product
   * const productBatches = await batch.searchInCollection('coll_123', {
   *   productId: 'prod_abc',
   *   limit: 100
   * })
   * 
   * // Get all batches in collection
   * const allBatches = await batch.searchInCollection('coll_123')
   * 
   * // Check for expired batches
   * batches.forEach(batch => {
   *   if (batch.expiryDate?.seconds) {
   *     const expiryDate = new Date(batch.expiryDate.seconds * 1000)
   *     if (expiryDate < new Date()) {
   *       console.log(`Batch ${batch.id} is expired`)
   *     }
   *   }
   * })
   * ```
   */
  export async function searchInCollection(
    collectionId: string,
    params?: SearchBatchesRequest
  ): Promise<BatchResponse[]> {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.productId) queryParams.append('productId', params.productId)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const query = queryParams.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/batch${query ? `?${query}` : ''}`
    return request<BatchResponse[]>(path)
  }

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
  export async function findInCollection(
    collectionId: string,
    batchId: string
  ): Promise<BatchResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/batch/${encodeURIComponent(batchId)}`
    return request<BatchResponse>(path)
  }

  /**
   * Get all tags/codes assigned to a specific batch.
   * Shows which claim set codes have been assigned to this batch.
   * 
   * @param collectionId - Identifier of the collection
   * @param batchId - Batch ID
   * @param claimSetId - Optional claim set ID to filter results
   * @returns Promise resolving to an array of BatchTag objects
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * // Get all tags assigned to a batch
   * const tags = await batch.getBatchTags('coll_123', 'BATCH-2024-001')
   * console.log(`Batch has ${tags.length} tags assigned`)
   * tags.forEach(tag => {
   *   console.log(`Code: ${tag.code}, ClaimSet: ${tag.claimSetId}, TagID: ${tag.tagId}`)
   * })
   * 
   * // Get tags from a specific claim set
   * const claimSetTags = await batch.getBatchTags('coll_123', 'BATCH-2024-001', '000001')
   * ```
   */
  export async function getBatchTags(
    collectionId: string,
    batchId: string,
    claimSetId?: string
  ): Promise<BatchTag[]> {
    const queryParams = new URLSearchParams()
    if (claimSetId) queryParams.append('claimSetId', claimSetId)
    
    const query = queryParams.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/batch/${encodeURIComponent(batchId)}/tags${query ? `?${query}` : ''}`
    return request<BatchTag[]>(path)
  }
}
