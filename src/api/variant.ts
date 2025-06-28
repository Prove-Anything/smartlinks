// src/api/variant.ts
import { request, post, put, del } from "../http"
import { VariantResponse, VariantCreateRequest, VariantUpdateRequest } from "../types/variant"

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
   * List all variants for a collection and product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the parent product
   * @returns Promise resolving to an array of VariantResponse objects
   * @throws ErrorResponse if the request fails
   */
  export async function list(
    collectionId: string,
    productId: string
  ): Promise<VariantResponse[]> {
    const path = `/admin/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(productId)}/variant`
    return request<VariantResponse[]>(path)
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
}
