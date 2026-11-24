import { del, post, put, request } from "../http"
import type {
  FacetDefinition,
  FacetDefinitionWriteInput,
  FacetGetParams,
  FacetListParams,
  FacetListResponse,
  FacetNamespaceListResponse,
  FacetQueryRequest,
  FacetQueryResponse,
  FacetValueGetParams,
  FacetValueListParams,
  FacetValueListResponse,
  FacetValueResponse,
  FacetValueWriteInput,
  PublicFacetListParams,
} from "../types/facets"
import type { ListOptions } from "../types/list"
import { listQuery } from "../list"

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
  /**
   * The collection's facets (admin). A small fixed set: all of them come back in one answer, so there is
   * no `limit` or `cursor` and `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await facets.list('coll_123', { kind: 'custom' })
   * items.map(f => f.key) // ["brand", "material", …]
   * ```
   */
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

  /**
   * One facet and its values (admin), a page at a time. The values are in `items`; pass `nextCursor` back
   * as `cursor` for the next page (null means that was the last one).
   *
   * @param params - `includeDeleted`, plus `limit` (default 50) and `cursor`
   *
   * @example
   * ```typescript
   * let page = await facets.listValues('coll_123', 'brand', { limit: 50 })
   * const names = page.items.map(v => v.name)
   * while (page.nextCursor) {
   *   page = await facets.listValues('coll_123', 'brand', { limit: 50, cursor: page.nextCursor })
   *   names.push(...page.items.map(v => v.name))
   * }
   * ```
   */
  export async function listValues(
    collectionId: string,
    facetKey: string,
    params?: FacetValueListParams
  ): Promise<FacetValueListResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values${listQuery(params)}`
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

  /**
   * Facet counts for a set of products (admin): each facet with its values in `items`, and the
   * count for each value in `buckets`. Everything comes back in one answer, so there is no `limit` or
   * `cursor` and `nextCursor` is always null.
   *
   * Which products are counted: `q` (search text), `createdAt` / `updatedAt` (date ranges) and the
   * filters in `query`, the same as `products.query`.
   *
   * @example
   * ```typescript
   * const { items, buckets, meta } = await facets.query('coll_123', {
   *   facetKeys: ['brand', 'material'],
   *   q: 'oak',
   *   createdAt: { gte: '2026-11-01T00:00:00Z' },
   *   query: { facetEquals: { brand: 'acme' } },
   * })
   * ```
   */
  export async function query(
    collectionId: string,
    body: FacetQueryRequest
  ): Promise<FacetQueryResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/query`
    return post<FacetQueryResponse>(path, body)
  }

  /**
   * The facet namespaces in use (admin). A small fixed set: all the names are in `items`, there is no
   * `limit` or `cursor`, and `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await facets.namespaces('coll_123') // items: string[]
   * ```
   */
  export async function namespaces(
    collectionId: string
  ): Promise<FacetNamespaceListResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/facets/namespaces`
    return request<FacetNamespaceListResponse>(path)
  }

  /**
   * The collection's facets (public). A small fixed set: all of them come back in one answer, so there is
   * no `limit` or `cursor` and `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await facets.publicList('coll_123', { namespace: 'catalog' })
   * ```
   */
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

  /**
   * One facet and its values (public), a page at a time. The values are in `items`; pass `nextCursor`
   * back as `cursor` for the next page (null means that was the last one).
   *
   * @param options - `limit` (default 50) and `cursor`
   *
   * @example
   * ```typescript
   * const { facet, items, nextCursor } = await facets.publicListValues('coll_123', 'brand', { limit: 50 })
   * ```
   */
  export async function publicListValues(
    collectionId: string,
    facetKey: string,
    options: ListOptions = {}
  ): Promise<FacetValueListResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/${encodeURIComponent(facetKey)}/values${listQuery({ limit: options.limit, cursor: options.cursor })}`
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

  /**
   * Facet counts for a set of products (public): each facet with its values in `items`, and the
   * count for each value in `buckets`. Everything comes back in one answer, so there is no `limit` or
   * `cursor` and `nextCursor` is always null.
   *
   * Which products are counted: `q` (search text), `createdAt` / `updatedAt` (date ranges) and the
   * filters in `query`, the same as `products.query`.
   *
   * @example
   * ```typescript
   * const { items, buckets } = await facets.publicQuery('coll_123', { facetKeys: ['brand'], q: 'oak' })
   * ```
   */
  export async function publicQuery(
    collectionId: string,
    body: FacetQueryRequest
  ): Promise<FacetQueryResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/query`
    return post<FacetQueryResponse>(path, body)
  }

  /**
   * The facet namespaces in use (public). A small fixed set: all the names are in `items`, there is no
   * `limit` or `cursor`, and `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await facets.publicNamespaces('coll_123') // items: string[]
   * ```
   */
  export async function publicNamespaces(
    collectionId: string
  ): Promise<FacetNamespaceListResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/facets/namespaces`
    return request<FacetNamespaceListResponse>(path)
  }
}
