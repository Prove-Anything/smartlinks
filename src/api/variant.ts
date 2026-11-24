// src/api/variant.ts
import { request, post, put, del } from "../http"
import { VariantResponse, VariantCreateRequest, VariantUpdateRequest } from "../types/variant"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

export namespace variant {
  // Admin CRUD operations
  /**
   * Get a single variant by ID for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param variantId - Identifier of the variant
   * @returns Promise resolving to a VariantResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(
    collectionId: string,
    productId: string,
    variantId: string
  ): Promise<VariantResponse> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/variant/${encodeURIComponent(variantId)}`
    return request<VariantResponse>(path)
  }

  /**
   * List the variants for a collection and product (admin only), 50 at a time unless you give a
   * `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that
   * was the last one.
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param options - Paging: `limit` and `cursor`
   * @returns Promise resolving to `{ items: VariantResponse[], nextCursor, count }`
   * @throws ErrorResponse if the request fails
   *
   * @example
   * ```typescript
   * let page = await variant.list('coll_123', 'prod_456', { limit: 100 })
   * page.items.map((v) => v.name)
   * while (page.nextCursor) page = await variant.list('coll_123', 'prod_456', { limit: 100, cursor: page.nextCursor })
   * ```
   */
  export async function list(
    collectionId: string,
    productId: string,
    options: ListOptions = {}
  ): Promise<ListResult<VariantResponse>> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(productId)}/variant${listQuery({ limit: options.limit, cursor: options.cursor })}`
    return request<ListResult<VariantResponse>>(path)
  }

  /**
   * Create a new variant for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param data - Variant creation data
   * @returns Promise resolving to a VariantResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function create(
    collectionId: string,
    productId: string,
    data: VariantCreateRequest
  ): Promise<VariantResponse> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(productId)}/variant`
    return post<VariantResponse>(path, data)
  }

  /**
   * Update a variant for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param variantId - Identifier of the variant
   * @param data - Variant update data
   * @returns Promise resolving to a VariantResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function update(
    collectionId: string,
    productId: string,
    variantId: string,
    data: VariantUpdateRequest
  ): Promise<VariantResponse> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/variant/${encodeURIComponent(variantId)}`
    return put<VariantResponse>(path, data)
  }

  /**
   * Delete a variant for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param variantId - Identifier of the variant
   * @returns Promise resolving to void
   * @throws ErrorResponse if the request fails
   */
  export async function remove(
    collectionId: string,
    productId: string,
    variantId: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/variant/${encodeURIComponent(variantId)}`
    return del<void>(path)
  }

  // Public read-only operation
  /**
   * Get a single variant by ID for a collection and product (public endpoint).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param variantId - Identifier of the variant
   * @returns Promise resolving to a VariantResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function getPublic(
    collectionId: string,
    productId: string,
    variantId: string
  ): Promise<VariantResponse> {
    const path = `/public/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(
      productId
    )}/variant/${encodeURIComponent(variantId)}`
    return request<VariantResponse>(path)
  }

  /**
   * Get serial numbers for a variant (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param variantId - Identifier of the variant
   * @param startIndex - Starting index for pagination (default: 0)
   * @param count - Number of serial numbers to retrieve (default: 10)
   * @returns Promise resolving to serial number data
   * @throws ErrorResponse if the request fails
   */
  export async function getSN(
    collectionId: string,
    productId: string,
    variantId: string,
    startIndex: number = 0,
    count: number = 10
  ): Promise<any> {
    const queryParams = new URLSearchParams({
      startIndex: startIndex.toString(),
      count: count.toString()
    })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}/getSN?${queryParams}`
    return request<any>(path)
  }

  /**
   * Look up a serial number by code for a variant (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @param variantId - Identifier of the variant
   * @param codeId - The serial number code to look up
   * @returns Promise resolving to serial number lookup data
   * @throws ErrorResponse if the request fails
   */
  export async function lookupSN(
    collectionId: string,
    productId: string,
    variantId: string,
    codeId: string
  ): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}/lookupSN/${encodeURIComponent(codeId)}`
    return request<any>(path)
  }
}
