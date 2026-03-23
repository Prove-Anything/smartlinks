// src/api/product.ts
import { request, post, put, del } from "../http"
import { JsonValue, ProductClaimCreateRequestBody, ProductCreateRequest, ProductQueryRequest, ProductQueryResponse, ProductResponse, ProductUpdateRequest } from "../types/product"

type ProductPublicFindParams = Record<
  string,
  string | number | boolean | null | undefined | Array<string | number | boolean>
>

export namespace product {
  /**
  * @deprecated Use `products.get(...)`.
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
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`
    return request<ProductResponse>(path)
  }

  /**
   * @deprecated Use `products.list(...)`.
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
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/product`
    return request<ProductResponse[]>(path)
  }

  /**
   * @deprecated Use `products.create(...)`.
   * Create a new product for a collection (admin only).
   * The `data` payload follows the same shape as ProductResponse minus `id` and `collectionId`.
   * 
   * **Hero Image Auto-Fetch:**
   * You can pass `heroImage` as either:
   * - A full asset object: `{ url: '...', thumbnails: {...} }`
   * - A string URL: The system automatically fetches and stores the image
   * 
   * @example
   * ```typescript
   * // Using a URL - auto-fetched and stored
   * const product = await product.create(collectionId, {
   *   name: 'Wine Bottle',
   *   description: 'Premium red wine',
   *   heroImage: 'https://example.com/wine.jpg', // Auto-fetched!
   *   data: {}
   * });
   * ```
   * 
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
   * @deprecated Use `products.update(...)`.
   * Update a product for a collection (admin only).
   * The `data` payload is a partial of ProductResponse minus `id` and `collectionId`.
   * 
   * **Hero Image Auto-Fetch:**
   * You can pass `heroImage` as either:
   * - A full asset object: `{ url: '...', thumbnails: {...} }`
   * - A string URL: The system automatically fetches and stores the image
   * 
   * @example
   * ```typescript
   * // Update with new URL - auto-fetched and stored
   * const product = await product.update(collectionId, productId, {
   *   heroImage: 'https://example.com/new-wine.jpg' // Auto-fetched!
   * });
   * ```
   * 
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
   * @deprecated Use `products.remove(...)`.
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
   * @deprecated Legacy compatibility endpoint only. Use `products.query(...)` for new integrations.
   */
  export async function find(
    collectionId: string,
    body: ProductQueryRequest
  ): Promise<ProductQueryResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/find`
    return post<ProductQueryResponse>(path, body)
  }

  /**
   * @deprecated Legacy compatibility endpoint only. Use `products.get(...)` when the product id is known.
   */
  export async function publicFind(
    collectionId: string,
    params?: ProductPublicFindParams
  ): Promise<ProductResponse[]> {
    const searchParams = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue
        if (Array.isArray(value)) {
          for (const item of value) searchParams.append(key, String(item))
        } else {
          searchParams.set(key, String(value))
        }
      }
    }
    const query = searchParams.toString()
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/find${query ? `?${query}` : ''}`
    return request<ProductResponse[]>(path)
  }

  /**
   * @deprecated Use `products.clone(...)`.
   */
  export async function clone(
    collectionId: string,
    productId: string,
    body: Record<string, JsonValue> = {}
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/clone`
    return post<ProductResponse>(path, body)
  }

  /**
   * @deprecated Use `products.listAssets(...)`.
   */
  export async function listAssets(
    collectionId: string,
    productId: string,
    admin?: boolean
  ): Promise<unknown> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset`
    return request<unknown>(path)
  }

  /**
   * @deprecated Use `products.createClaimWindow(...)`.
   */
  export async function createClaimWindow(
    collectionId: string,
    productId: string,
    body: Record<string, JsonValue>
  ): Promise<unknown> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/claimWindow`
    return post<unknown>(path, body)
  }

  /**
   * @deprecated Use `products.updateClaimWindow(...)`.
   */
  export async function updateClaimWindow(
    collectionId: string,
    productId: string,
    claimId: string,
    body: Record<string, JsonValue>
  ): Promise<unknown> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/claimWindow/${encodeURIComponent(claimId)}`
    return put<unknown>(path, body)
  }

  /**
   * @deprecated Use `products.refresh(...)`.
   */
  export async function refresh(
    collectionId: string,
    productId: string
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/refresh`
    return request<ProductResponse>(path)
  }

  /**
   * @deprecated Use `products.getSN(...)`.
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
  ): Promise<unknown> {
    const queryParams = new URLSearchParams({
      startIndex: startIndex.toString(),
      count: count.toString()
    })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/getSN?${queryParams}`
    return request<unknown>(path)
  }

  /**
   * @deprecated Use `products.lookupSN(...)`.
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
  ): Promise<unknown> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/lookupSN/${encodeURIComponent(codeId)}`
    return request<unknown>(path)
  }

  /**
   * @deprecated Use `products.publicLookupClaim(...)`.
   */
  export async function publicLookupClaim(
    collectionId: string,
    productId: string,
    claimId: string
  ): Promise<unknown> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/lookupClaim/${encodeURIComponent(claimId)}`
    return request<unknown>(path)
  }

  /**
   * @deprecated Use `products.publicCreateClaim(...)`.
   */
  export async function publicCreateClaim(
    collectionId: string,
    productId: string,
    body: ProductClaimCreateRequestBody
  ): Promise<unknown> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/createClaim`
    return post<unknown>(path, body)
  }
}
