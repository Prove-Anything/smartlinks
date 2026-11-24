import type { StandardQuery, QueryResult, QueryDescription } from "../types/query"
import { del, post, put, request } from "../http"
import {
  JsonValue,
  ProductClaimCreateRequestBody,
  ProductCreateRequest,
  ProductQueryMeta,
  ProductQueryRequest,
  ProductResponse,
  ProductUpdateRequest,
} from "../types/product"
import type { AssetResponse } from "../types/asset"
import type { ListResult } from "../types/list"

export namespace products {
  export async function get(
    collectionId: string,
    productId: string,
    admin?: boolean
  ): Promise<ProductResponse> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}`
    return request<ProductResponse>(path)
  }

  /**
   * Every product in a collection, in one list (no pages). For filtering, sorting and paging use
   * `products.query`.
   *
   * @param collectionId - Identifier of the parent collection
   * @param admin - When `true`, targets the `/admin` endpoint; otherwise the `/public` one
   *
   * @example
   * ```typescript
   * const { items } = await products.list(collectionId)
   * ```
   */
  export async function list(
    collectionId: string,
    admin?: boolean
  ): Promise<ListResult<ProductResponse>> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/products`
    return request<ListResult<ProductResponse>>(path)
  }

  export async function create(
    collectionId: string,
    data: ProductCreateRequest
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products`
    return post<ProductResponse>(path, data)
  }

  export async function update(
    collectionId: string,
    productId: string,
    data: ProductUpdateRequest
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}`
    return put<ProductResponse>(path, data)
  }

  export async function remove(
    collectionId: string,
    productId: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}`
    return del<void>(path)
  }

  /**
   * Query products in a collection with filtering, sorting, and paging.
   *
   * @param collectionId - Identifier of the parent collection
   * @param body - Filters and sorting, plus `limit` (default 50) and `cursor` for paging
   * @param admin - When `true`, targets the `/admin` endpoint (requires an
   *   authenticated admin context). Defaults to `false`, which targets the
   *   `/public` endpoint — consistent with `get`, `list`, and `listAssets`.
   * @returns Promise resolving to `{ items, nextCursor, count?, meta? }`: the matching products, the cursor
   *   for the next page (null on the last), how many match in all where the server counted, and `meta`
   *   (how the query was run)
   *
   * @example
   * ```typescript
   * // Public query (default)
   * const { items, nextCursor, count } = await products.query(collectionId, { query: { search: 'cabernet' }, limit: 20 })
   *
   * // The next page: the same query with the cursor
   * if (nextCursor) {
   *   await products.query(collectionId, { query: { search: 'cabernet' }, limit: 20, cursor: nextCursor })
   * }
   *
   * // Admin query (authenticated)
   * await products.query(collectionId, { query: { search: 'cabernet' } }, true)
   * ```
   */
  export async function query(
    collectionId: string,
    body: ProductQueryRequest,
    admin?: boolean
  ): Promise<ListResult<ProductResponse> & { meta?: ProductQueryMeta }> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/products/query`
    return post<ListResult<ProductResponse> & { meta?: ProductQueryMeta }>(path, body)
  }

  /**
   * The standard query on products (admin only): the one query shape every resource is moving to, with
   * counts, totals and filtering by facet. It sits beside `products.query`, whose own body is unchanged.
   * POST /admin/collection/:collectionId/products/standard/query
   *
   * Fields: id, name, description, sku, gtin, schemaType, status, sortOrder, createdAt, updatedAt,
   * facets. Facets are filtered by key: the facet by its key or name, the value by its key or name.
   *
   * ```typescript
   * await products.standardQuery(collectionId, {
   *   where: { facets: { brand: 'Breville', category: { in: ['Toasters', 'Kettles'] } }, status: 'active' },
   *   select: ['id', 'name', 'sku'], count: true,
   * })
   * ```
   */
  export async function standardQuery(
    collectionId: string,
    body: StandardQuery = {}
  ): Promise<QueryResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/standard/query`
    return post<QueryResult>(path, body)
  }

  /**
   * What a products standard query can use: its fields and what each can filter, sort, group or total.
   * GET /admin/collection/:collectionId/products/standard/query
   */
  export async function standardQueryFields(collectionId: string): Promise<QueryDescription> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/standard/query`
    return request<QueryDescription>(path)
  }

  export async function clone(
    collectionId: string,
    productId: string,
    body: Record<string, JsonValue> = {}
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/clone`
    return post<ProductResponse>(path, body)
  }

  /**
   * A product's assets (images, documents), in one list (no pages).
   *
   * @param admin - When `true`, targets the `/admin` endpoint; otherwise the `/public` one
   *
   * @example
   * ```typescript
   * const { items } = await products.listAssets(collectionId, productId)
   * ```
   */
  export async function listAssets(
    collectionId: string,
    productId: string,
    admin?: boolean
  ): Promise<ListResult<AssetResponse>> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/asset`
    return request<ListResult<AssetResponse>>(path)
  }

  export async function createClaimWindow(
    collectionId: string,
    productId: string,
    body: Record<string, JsonValue>
  ): Promise<unknown> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/claimWindow`
    return post<unknown>(path, body)
  }

  export async function updateClaimWindow(
    collectionId: string,
    productId: string,
    claimId: string,
    body: Record<string, JsonValue>
  ): Promise<unknown> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/claimWindow/${encodeURIComponent(claimId)}`
    return put<unknown>(path, body)
  }

  export async function refresh(
    collectionId: string,
    productId: string
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/refresh`
    return request<ProductResponse>(path)
  }

  export async function getSN(
    collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10
  ): Promise<unknown> {
    const queryParams = new URLSearchParams({
      startIndex: startIndex.toString(),
      count: count.toString(),
    })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/getSN?${queryParams}`
    return request<unknown>(path)
  }

  export async function lookupSN(
    collectionId: string,
    productId: string,
    codeId: string
  ): Promise<unknown> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/lookupSN/${encodeURIComponent(codeId)}`
    return request<unknown>(path)
  }

  export async function publicLookupClaim(
    collectionId: string,
    productId: string,
    claimId: string
  ): Promise<unknown> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/lookupClaim/${encodeURIComponent(claimId)}`
    return request<unknown>(path)
  }

  export async function publicCreateClaim(
    collectionId: string,
    productId: string,
    body: ProductClaimCreateRequestBody
  ): Promise<unknown> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/createClaim`
    return post<unknown>(path, body)
  }
}