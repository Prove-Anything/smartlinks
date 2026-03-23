import type { JsonValue, ProductQueryRequest } from "./product"

export interface FacetDefinition {
  id?: string
  orgId?: string
  collectionId?: string | null
  key: string
  name: string
  description?: string | null
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

export interface FacetListResponse {
  items: FacetDefinition[]
}

export interface FacetValueListResponse {
  facet: FacetDefinition
  items: FacetValue[]
}

export interface FacetValueResponse {
  facet: FacetDefinition
  item: FacetValue
}

export interface FacetQueryRequest {
  facetKeys?: string[]
  includeEmpty?: boolean
  includeDeleted?: boolean
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

export interface FacetQueryResponse {
  items: Array<{
    facet: FacetDefinition
    values: FacetValue[]
  }>
  buckets: FacetBucket[]
  meta?: {
    source?: "postgres"
    matchedProducts?: number
  }
}

export interface FacetListParams {
  includeValues?: boolean
  includeDeleted?: boolean
  kind?: "system" | "custom"
  reserved?: boolean
}

export interface PublicFacetListParams {
  includeValues?: boolean
}

export interface FacetGetParams {
  includeValues?: boolean
  includeDeleted?: boolean
}

export interface FacetValueListParams {
  includeDeleted?: boolean
}

export interface FacetValueGetParams {
  includeDeleted?: boolean
}

export type FacetValueDefinition = FacetValue
