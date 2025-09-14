// src/api/product.ts
import { request, post, put, del } from "../http"
import { ProductResponse, ProductCreateRequest, ProductUpdateRequest } from "../types/product"

export namespace product {
  /**
   * Retrieves a single Product Item by Collection ID and Product ID.
   * @param collectionId – Identifier of the parent collection
   * @param productId    – Identifier of the product item
   * @param admin        – If true, use admin endpoint; otherwise, use public
   * @returns Promise resolving to a ProductResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(
    collectionId: string,
    productId: string,
    admin?: boolean
  ): Promise<ProductResponse> {
    const base = admin ? '/admin' : '/public';
    const path = `${base}/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(productId)}`
    return request<ProductResponse>(path)
  }

  /**
   * List all Product Items for a Collection.
   * @param collectionId – Identifier of the parent collection
   * @param admin        – If true, use admin endpoint; otherwise, use public
   * @returns Promise resolving to an array of ProductResponse objects
   * @throws ErrorResponse if the request fails
   */
  export async function list(
    collectionId: string,
    admin?: boolean
  ): Promise<ProductResponse[]> {
    const base = admin ? '/admin' : '/public';
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/product`
    return request<ProductResponse[]>(path)
  }

  /**
   * Create a new product for a collection (admin only).
   * The `data` payload follows the same shape as ProductResponse minus `id` and `collectionId`.
   * @param collectionId – Identifier of the parent collection
   * @param data – Product creation data (see ProductCreateRequest)
   * @returns Promise resolving to a ProductResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function create(
    collectionId: string,
    data: ProductCreateRequest
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product`
    return post<ProductResponse>(path, data)
  }

  /**
   * Update a product for a collection (admin only).
   * The `data` payload is a partial of ProductResponse minus `id` and `collectionId`.
   * @param collectionId – Identifier of the parent collection
   * @param productId – Identifier of the product
   * @param data – Product update data (see ProductUpdateRequest)
   * @returns Promise resolving to a ProductResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function update(
    collectionId: string,
    productId: string,
    data: ProductUpdateRequest
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`
    return put<ProductResponse>(path, data)
  }

  /**
   * Delete a product for a collection (admin only).
   * @param collectionId – Identifier of the parent collection
   * @param productId – Identifier of the product
   * @returns Promise resolving to void
   * @throws ErrorResponse if the request fails
   */
  export async function remove(
    collectionId: string,
    productId: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`
    return del<void>(path)
  }

  /**
   * Get serial numbers for a product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the product
   * @param startIndex - Starting index for pagination (default: 0)
   * @param count - Number of serial numbers to retrieve (default: 10)
   * @returns Promise resolving to serial number data
   * @throws ErrorResponse if the request fails
   */
  export async function getSN(
    collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10
  ): Promise<any> {
    const queryParams = new URLSearchParams({
      startIndex: startIndex.toString(),
      count: count.toString()
    })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/getSN?${queryParams}`
    return request<any>(path)
  }

  /**
   * Look up a serial number by code for a product (admin only).
   * @param collectionId - Identifier of the parent collection
   * @param productId - Identifier of the product
   * @param codeId - The serial number code to look up
   * @returns Promise resolving to serial number lookup data
   * @throws ErrorResponse if the request fails
   */
  export async function lookupSN(
    collectionId: string,
    productId: string,
    codeId: string
  ): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/lookupSN/${encodeURIComponent(codeId)}`
    return request<any>(path)
  }
}
