import { del, post, put, request } from "../http"
import type {
  FacetDefinition,
  FacetDefinitionWriteInput,
  FacetGetParams,
  FacetListParams,
  FacetListResponse,
  FacetQueryRequest,
  FacetQueryResponse,
  FacetValueGetParams,
  FacetValueListParams,
  FacetValueListResponse,
  FacetValueResponse,
  FacetValueWriteInput,
  PublicFacetListParams,
} from "../types/facets"

function appendSearchParam(searchParams: URLSearchParams, key: string, value: unknown): void {
  if (value === undefined || value === null) return
  searchParams.set(key, String(value))
}

function buildQueryString(params?: object): string {
  if (!params) return ""

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    appendSearchParam(searchParams, key, value)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

/**
 * Facet management and aggregation endpoints.
 *
 * Facets are collection-scoped resources mounted directly under `/facets`.
 * Use this namespace to manage facet definitions and values, and to fetch
 * aggregation buckets for browse and filter UIs.
 */
export namespace facets {
  export async function list(
    collectionId: string,
    params?: FacetListParams
  ): Promise<FacetListResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets${buildQueryString(params)}`
    return request<FacetListResponse>(path)
  }

  export async function create(
    collectionId: string,
    data: FacetDefinitionWriteInput
  ): Promise<FacetDefinition> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets`
    return post<FacetDefinition>(path, data)
  }

  export async function get(
    collectionId: string,
    facetKey: string,
    params?: FacetGetParams
  ): Promise<FacetDefinition> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}${buildQueryString(params)}`
    return request<FacetDefinition>(path)
  }

  export async function update(
    collectionId: string,
    facetKey: string,
    data: FacetDefinitionWriteInput
  ): Promise<FacetDefinition> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}`
    return put<FacetDefinition>(path, data)
  }

  export async function remove(
    collectionId: string,
    facetKey: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}`
    return del<void>(path)
  }

  export async function listValues(
    collectionId: string,
    facetKey: string,
    params?: FacetValueListParams
  ): Promise<FacetValueListResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values${buildQueryString(params)}`
    return request<FacetValueListResponse>(path)
  }

  export async function createValue(
    collectionId: string,
    facetKey: string,
    data: FacetValueWriteInput
  ): Promise<FacetValueResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values`
    return post<FacetValueResponse>(path, data)
  }

  export async function getValue(
    collectionId: string,
    facetKey: string,
    valueKey: string,
    params?: FacetValueGetParams
  ): Promise<FacetValueResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}${buildQueryString(params)}`
    return request<FacetValueResponse>(path)
  }

  export async function updateValue(
    collectionId: string,
    facetKey: string,
    valueKey: string,
    data: FacetValueWriteInput
  ): Promise<FacetValueResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}`
    return put<FacetValueResponse>(path, data)
  }

  export async function removeValue(
    collectionId: string,
    facetKey: string,
    valueKey: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}`
    return del<void>(path)
  }

  export async function query(
    collectionId: string,
    body: FacetQueryRequest
  ): Promise<FacetQueryResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/query`
    return post<FacetQueryResponse>(path, body)
  }

  export async function publicList(
    collectionId: string,
    params?: PublicFacetListParams
  ): Promise<FacetListResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets${buildQueryString(params)}`
    return request<FacetListResponse>(path)
  }

  export async function publicGet(
    collectionId: string,
    facetKey: string,
    params?: PublicFacetListParams
  ): Promise<FacetDefinition> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}${buildQueryString(params)}`
    return request<FacetDefinition>(path)
  }

  export async function publicListValues(
    collectionId: string,
    facetKey: string
  ): Promise<FacetValueListResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values`
    return request<FacetValueListResponse>(path)
  }

  export async function publicGetValue(
    collectionId: string,
    facetKey: string,
    valueKey: string
  ): Promise<FacetValueResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values/${encodeURIComponent(valueKey)}`
    return request<FacetValueResponse>(path)
  }

  export async function publicQuery(
    collectionId: string,
    body: FacetQueryRequest
  ): Promise<FacetQueryResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/query`
    return post<FacetQueryResponse>(path, body)
  }
}
