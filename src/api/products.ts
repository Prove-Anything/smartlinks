import { del, post, put, request } from "../http"
import {
  JsonValue,
  ProductClaimCreateRequestBody,
  ProductCreateRequest,
  ProductQueryRequest,
  ProductQueryResponse,
  ProductResponse,
  ProductUpdateRequest,
} from "../types/product"

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

  export async function list(
    collectionId: string,
    admin?: boolean
  ): Promise<ProductResponse[]> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/products`
    return request<ProductResponse[]>(path)
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

  export async function query(
    collectionId: string,
    body: ProductQueryRequest
  ): Promise<ProductQueryResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/query`
    return post<ProductQueryResponse>(path, body)
  }

  export async function clone(
    collectionId: string,
    productId: string,
    body: Record<string, JsonValue> = {}
  ): Promise<ProductResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/clone`
    return post<ProductResponse>(path, body)
  }

  export async function listAssets(
    collectionId: string,
    productId: string,
    admin?: boolean
  ): Promise<unknown> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/asset`
    return request<unknown>(path)
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