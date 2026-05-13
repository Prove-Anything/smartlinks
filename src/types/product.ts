// src/types/product.ts
import { AssetRef } from "./asset"

export type JsonPrimitive = string | number | boolean | null

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue }

export type ISODateString = string

export interface ProductKey {
  collectionId: string
  id: string
}

export interface ProductImageUrlInput {
  url: string
}

export interface AdditionalGtin {
  gtin: string
  owner?: boolean | null
}

/**
 * Full facet value definition — returned by the Facets API.
 * Not embedded in product responses; use ProductFacetMap for product-level assignments.
 */
export interface ProductFacetValue {
  id?: string
  key: string
  slug?: string
  name: string
  shortName?: string
  description?: string
  color?: string
  icon?: string
}

/**
 * Slim facet assignments on a product: maps each facet key to an array of assigned
 * value slugs/keys. Full value metadata lives in the Facets API.
 *
 * @example
 * { type: ['website'], certifications: ['organic', 'recycled'] }
 */
export type ProductFacetMap = Record<string, string[]>

export interface ProductQueryRequest {
  query?: {
    search?: string
    status?: string[]
    productIds?: string[]
    sku?: string
    gtin?: string
    updatedAfter?: ISODateString
    updatedBefore?: ISODateString
    createdAfter?: ISODateString
    createdBefore?: ISODateString
    facetEquals?: Record<string, JsonValue>
  }
  sort?: Array<{
    field: string
    direction: 'asc' | 'desc'
  }>
  page?: {
    limit?: number
    offset?: number
    cursor?: string | null
  }
  includeDeleted?: boolean
}

export interface Product extends ProductKey {
  orgId?: string | null
  name: string
  description?: string | null
  gtin?: string | null
  ownGtin?: string | null
  additionalGtins?: AdditionalGtin[] | null
  sku?: string | null
  /** Canonical type key, e.g. 'ownable-product' */
  schemaType?: string | null
  /** Alias for schemaType (compat) */
  type?: string | null
  /** First segment of schemaType, e.g. 'ownable' */
  category?: string | null
  label?: string | null
  status?: 'active' | 'deleted' | null
  sortOrder?: number | null
  /** Slim image reference — use `id` to fetch the full Asset record */
  heroImage?: AssetRef | null
  /** Ordered array of additional image references */
  additionalImages?: AssetRef[]
  facets?: ProductFacetMap
  /** Tag keys where value is true */
  tags?: Record<string, boolean>
  data?: Record<string, JsonValue>
  admin?: Record<string, JsonValue>
  extra?: Record<string, JsonValue>
  validCollections?: string[] | null
  group?: boolean | null
  groupKey?: string | null
  createdAt?: ISODateString | null
  updatedAt?: ISODateString | null
  deletedAt?: ISODateString | null
}

export interface PublicProduct extends Omit<Product, 'admin'> {
  admin?: never
}

export interface ProductWriteInput {
  id?: string
  name: string
  description?: string | null
  gtin?: string | null
  ownGtin?: string | null
  additionalGtins?: AdditionalGtin[]
  sku?: string | null
  schemaType?: string | null
  label?: string | null
  status?: string | null
  sortOrder?: number | null
  /**
   * Pass the existing `AssetRef` unchanged to keep the current image,
   * or a URL string / `{ url }` object to import a new file.
   */
  heroImage?: AssetRef | ProductImageUrlInput | string | null
  /**
   * Pass existing `AssetRef` entries unchanged; replace entries with a URL string
   * or `{ url }` object to import new files.
   */
  additionalImages?: Array<AssetRef | ProductImageUrlInput | string>
  facets?: ProductFacetMap
  tags?: Record<string, boolean>
  data?: Record<string, JsonValue>
  admin?: Record<string, JsonValue>
  extra?: Record<string, JsonValue>
  validCollections?: string[]
}

export interface ProductQueryResponse {
  items: Product[]
  page?: {
    limit?: number
    offset?: number
    returned?: number
    total?: number
    hasMore?: boolean
    nextCursor?: string | null
  }
  meta?: {
    apiVersion?: 'v1'
    mode?: 'canonical-products' | 'legacy-product-compatibility'
    source?: 'postgres' | 'firestore' | 'compatibility-layer'
    queryMode?: 'canonical' | 'compatibility'
    unsupportedFilters?: string[]
    supportedSortFields?: string[]
  }
}

export interface ProductClaimLookupInput extends ProductKey {
  claimId: string
}

export interface ProductClaimCreateInput extends ProductKey {
  claimId: string
  email?: string
  name?: string
  emailConfirmation?: boolean
  data?: Record<string, JsonValue>
  options?: Record<string, JsonValue>
}

export type ProductClaimCreateRequestBody = Omit<ProductClaimCreateInput, 'collectionId' | 'id'>

export type ProductResponse = Product
export type ProductCreateRequest = ProductWriteInput
export type ProductUpdateRequest = Partial<Omit<ProductWriteInput, 'id'>>
