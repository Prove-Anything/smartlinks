// src/api/product.ts
import { request } from "../http"
import { ProductResponse } from "../types/product"

export namespace product {
  /**
   * Retrieves a single Product Item by Collection ID and Product ID.
   * @param collectionId – Identifier of the parent collection
   * @param productId    – Identifier of the product item
   * @returns Promise resolving to a ProductResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(
    collectionId: string,
    productId: string
  ): Promise<ProductResponse> {
    const path = `/public/collection/${encodeURIComponent(
      collectionId
    )}/product/${encodeURIComponent(productId)}`
    return request<ProductResponse>(path)
  }

  /**
   * List all Product Items for a Collection.
   * @param collectionId – Identifier of the parent collection
   * @returns Promise resolving to an array of ProductResponse objects
   * @throws ErrorResponse if the request fails
   */
  export async function list(
    collectionId: string
  ): Promise<ProductResponse[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product`
    return request<ProductResponse[]>(path)
  }
}
