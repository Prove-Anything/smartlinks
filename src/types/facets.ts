import type { JsonValue, ProductQueryRequest } from "./product"
import type { ListResult, ListOptions, DateRange } from "./list"

export interface FacetDefinition {
  id?: string
  orgId?: string
  collectionId?: string | null
  key: string
  name: string
  description?: string | null
  namespace?: string | null
  cardinality?: "single" | "multi"
  kind?: "system" | "custom"
  hierarchical?: boolean
  reserved?: boolean
  enabled?: boolean
  sortOrder?: number | null
  config?: Record<string, JsonValue>
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  values?: FacetValue[]
}

export interface FacetValue {
  id?: string
  orgId?: string
  collectionId?: string | null
  facetDefinitionId?: string
  facetKey: string
  key: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata?: Record<string, JsonValue>
  sortOrder?: number | null
  parentValueId?: string | null
  parentValueKey?: string | null
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  count?: number
}

export interface FacetDefinitionWriteInput {
  key?: string
  name: string
  description?: string | null
  namespace?: string | null
  cardinality?: "single" | "multi"
  kind?: "system" | "custom"
  hierarchical?: boolean
  reserved?: boolean
  enabled?: boolean
  sortOrder?: number | null
  config?: Record<string, JsonValue>
}

export interface FacetValueWriteInput {
  key?: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata?: Record<string, JsonValue>
  sortOrder?: number | null
  parentValueKey?: string | null
  enabled?: boolean
}

/** What `facets.list` / `facets.publicList` return: every facet in `items` (`nextCursor` is always null). */
export type FacetListResponse = ListResult<FacetDefinition>

/** What `facets.listValues` / `facets.publicListValues` return: the facet, and all its values in `items`. */
export interface FacetValueListResponse extends ListResult<FacetValue> {
  facet: FacetDefinition
}

export interface FacetValueResponse {
  facet: FacetDefinition
  item: FacetValue
}

/**
 * Body for `facets.query` / `facets.publicQuery`: which facets to count, and which products to count
 * them over (`q`, `createdAt`, `updatedAt` and the filters in `query`, as in `products.query`). The answer
 * is always complete, so there is no `limit` or `cursor`.
 */
export interface FacetQueryRequest {
  facetKeys?: string[]
  includeEmpty?: boolean
  includeDeleted?: boolean
  namespace?: string | null
  /** Search text: count only products that match it. */
  q?: string
  /** Count only products created in this range. */
  createdAt?: DateRange
  /** Count only products last updated in this range. */
  updatedAt?: DateRange
  query?: ProductQueryRequest["query"] & {
    facetEquals?: Record<string, JsonValue | JsonValue[]>
  }
}

export interface FacetBucket {
  facetKey: string
  valueKey: string
  name?: string
  count: number
}

/**
 * What `facets.query` / `facets.publicQuery` return: each facet with its values in `items`
 * (`nextCursor` is always null), and the counts in `buckets`.
 */
export interface FacetQueryResponse extends ListResult<{
  facet: FacetDefinition
  values: FacetValue[]
}> {
  buckets: FacetBucket[]
  meta?: {
    source?: "postgres"
    matchedProducts?: number
  }
}

export interface FacetListParams {
  includeDeleted?: boolean
  kind?: "system" | "custom"
  reserved?: boolean
  namespace?: string
}

export interface PublicFacetListParams {
  namespace?: string
}

/** What `facets.namespaces` / `facets.publicNamespaces` return: the namespace names in `items` (`nextCursor` is always null). */
export type FacetNamespaceListResponse = ListResult<string>

export interface FacetGetParams {
  includeValues?: boolean
  includeDeleted?: boolean
}

/** `facets.listValues` options: `includeDeleted`, plus `limit` (default 50) and `cursor`. */
export interface FacetValueListParams extends ListOptions {
  includeDeleted?: boolean
}

export interface FacetValueGetParams {
  includeDeleted?: boolean
}

export type FacetValueDefinition = FacetValue
