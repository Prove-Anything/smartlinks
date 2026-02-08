import { request, post, put, del } from "../http"
import {
  Crate,
  GetCrateResponse,
  CreateCrateRequest,
  CreateCrateResponse,
  UpdateCrateRequest,
  UpdateCrateResponse,
  DeleteCrateResponse,
  ListCratesRequest,
  ListCratesResponse
} from "../types/crate"

/**
 * Crate Management API
 * 
 * Manage crates (containers for tags/products) within collections.
 */
export namespace crate {
  /**
   * List crates for a collection with pagination support.
   * Returns crates in pages, with support for soft-deleted crates.
   * 
   * @param collectionId - Identifier of the parent collection
   * @param params - Optional query parameters for pagination and filtering
   * @returns Promise resolving to a ListCratesResponse object
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * // Get first page
   * const page1 = await crate.list('coll_123', { limit: 100 })
   * console.log(`Found ${page1.items.length} crates`)
   * 
   * // Get next page
   * if (page1.hasMore) {
   *   const page2 = await crate.list('coll_123', {
   *     limit: 100,
   *     startAfter: page1.lastId
   *   })
   * }
   * 
   * // Include soft-deleted crates
   * const withDeleted = await crate.list('coll_123', {
   *   includeDeleted: true
   * })
   * ```
   */
  export async function list(
    collectionId: string,
    params?: ListCratesRequest
  ): Promise<ListCratesResponse> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.startAfter) queryParams.append('startAfter', params.startAfter)
    if (params?.includeDeleted) queryParams.append('includeDeleted', 'true')
    
    const query = queryParams.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate${query ? `?${query}` : ''}`
    return request<ListCratesResponse>(path)
  }

  /**
   * Get a single crate by ID for a collection (admin only).
   * 
   * @param collectionId - Identifier of the parent collection
   * @param crateId - Crate ID
   * @returns Promise resolving to a GetCrateResponse object
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * const crate = await crate.get('coll_123', 'crate_abc123')
   * console.log(`Crate has ${crate.items?.length ?? 0} items`)
   * ```
   */
  export async function get(
    collectionId: string,
    crateId: string
  ): Promise<GetCrateResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`
    return request<GetCrateResponse>(path)
  }

  /**
   * Create a new crate for a collection (admin only).
   * 
   * @param collectionId - Identifier of the parent collection
   * @param data - Crate creation data
   * @returns Promise resolving to a CreateCrateResponse object
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * const newCrate = await crate.create('coll_123', {
   *   items: [
   *     {
   *       id: 'tag_001',
   *       codeId: 'ABC123',
   *       productId: 'prod_1',
   *       productName: 'Product Name'
   *     }
   *   ]
   * })
   * console.log(`Created crate ${newCrate.id}`)
   * ```
   */
  export async function create(
    collectionId: string,
    data: CreateCrateRequest
  ): Promise<CreateCrateResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate`
    return post<CreateCrateResponse>(path, data)
  }

  /**
   * Update a crate for a collection (admin only).
   * 
   * @param collectionId - Identifier of the parent collection
   * @param crateId - Crate ID
   * @param data - Update data
   * @returns Promise resolving to an UpdateCrateResponse object
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * const updated = await crate.update('coll_123', 'crate_abc123', {
   *   items: [
   *     { id: 'tag_002', codeId: 'XYZ789', productId: 'prod_2' }
   *   ]
   * })
   * ```
   */
  export async function update(
    collectionId: string,
    crateId: string,
    data: UpdateCrateRequest
  ): Promise<UpdateCrateResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`
    return put<UpdateCrateResponse>(path, data)
  }

  /**
   * Delete a crate for a collection (admin only).
   * This performs a soft delete.
   * 
   * @param collectionId - Identifier of the parent collection
   * @param crateId - Crate ID
   * @returns Promise resolving to a DeleteCrateResponse object
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * await crate.remove('coll_123', 'crate_abc123')
   * ```
   */
  export async function remove(
    collectionId: string,
    crateId: string
  ): Promise<DeleteCrateResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`
    return del<DeleteCrateResponse>(path)
  }
}