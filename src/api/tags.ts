// src/api/tags.ts
import { request, post, put, del } from "../http"
import {
  Tag,
  CreateTagRequest,
  CreateTagResponse,
  CreateTagsBatchRequest,
  CreateTagsBatchResponse,
  UpdateTagRequest,
  UpdateTagResponse,
  DeleteTagResponse,
  GetTagResponse,
  ListTagsRequest,
  ListTagsResponse,
  PublicGetTagRequest,
  PublicGetTagResponse,
  PublicBatchLookupRequest,
  PublicBatchLookupResponse,
  PublicBatchLookupQueryRequest,
  PublicBatchLookupQueryResponse
} from "../types/tags"

/**
 * Tag Management API
 * 
 * Create mappings between physical tags (NFC tags, QR codes, etc.) and digital proofs.
 * Supports automatic serial number generation, batch operations, and public lookups.
 */
export namespace tags {
  
  // ============================================================================
  // Admin Endpoints
  // ============================================================================

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
  export async function create(
    collectionId: string,
    data: CreateTagRequest
  ): Promise<CreateTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags`
    return post<CreateTagResponse>(path, data)
  }

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
  export async function createBatch(
    collectionId: string,
    data: CreateTagsBatchRequest
  ): Promise<CreateTagsBatchResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/batch`
    return post<CreateTagsBatchResponse>(path, data)
  }

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
  export async function update(
    collectionId: string,
    tagId: string,
    data: UpdateTagRequest
  ): Promise<UpdateTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`
    return put<UpdateTagResponse>(path, data)
  }

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
  export async function remove(
    collectionId: string,
    tagId: string
  ): Promise<DeleteTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`
    return del<DeleteTagResponse>(path)
  }

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
  export async function get(
    collectionId: string,
    tagId: string
  ): Promise<GetTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`
    return request<GetTagResponse>(path)
  }

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
  export async function list(
    collectionId: string,
    params?: ListTagsRequest
  ): Promise<ListTagsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.productId) queryParams.append('productId', params.productId)
    if (params?.variantId) queryParams.append('variantId', params.variantId)
    if (params?.batchId) queryParams.append('batchId', params.batchId)
    
    const query = queryParams.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags${query ? `?${query}` : ''}`
    return request<ListTagsResponse>(path)
  }

  // ============================================================================
  // Public Endpoints
  // ============================================================================

  /**
   * Public lookup of a single tag by tagId within a specific collection.
   * Optionally embed related collection, product, or proof data.
   * No authentication required.
   * 
   * @param collectionId - Identifier of the collection to search within
   * @param tagId - Unique tag identifier
   * @param params - Optional parameters (embed)
   * @returns Promise resolving to a PublicGetTagResponse with optional embedded data
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * // Simple lookup
   * const result = await tags.publicGet('coll_123', 'TAG001')
   * 
   * // With embedded data
   * const withData = await tags.publicGet('coll_123', 'TAG001', {
   *   embed: 'collection,product,proof'
   * })
   * console.log(withData.tag, withData.collection, withData.product, withData.proof)
   * ```
   */
  export async function publicGet(
    collectionId: string,
    tagId: string,
    params?: PublicGetTagRequest
  ): Promise<PublicGetTagResponse> {
    const queryParams = new URLSearchParams()
    if (params?.embed) queryParams.append('embed', params.embed)
    
    const query = queryParams.toString()
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}${query ? `?${query}` : ''}`
    return request<PublicGetTagResponse>(path)
  }

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
  export async function publicBatchLookup(
    collectionId: string,
    data: PublicBatchLookupRequest
  ): Promise<PublicBatchLookupResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/lookup`
    return post<PublicBatchLookupResponse>(path, data)
  }

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
  export async function publicBatchLookupQuery(
    collectionId: string,
    params: PublicBatchLookupQueryRequest
  ): Promise<PublicBatchLookupQueryResponse> {
    const queryParams = new URLSearchParams()
    queryParams.append('tagIds', params.tagIds)
    if (params.embed) queryParams.append('embed', params.embed)
    
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/lookup?${queryParams.toString()}`
    return request<PublicBatchLookupQueryResponse>(path)
  }
}
