// src/types/variant.ts
/**
 * Represents a Variant object. Dates are ISO 8601 strings (Postgres-backed).
 */
export interface VariantResponse {
  id: string
  name?: string | null
  productId?: string
  collectionId?: string
  createdAt?: string              // ISO 8601
  updatedAt?: string              // ISO 8601
  /** Present only on soft-deleted variants. */
  deleted?: boolean
  deletedAt?: string              // ISO 8601
  /** Admin-only zone (e.g. `lastSerialId`). Admin reads only — never on public reads. */
  admin?: Record<string, any>
  [key: string]: any              // Additional (schemaless) variant fields
}

/**
 * Request payload for creating a new variant.
 */
export interface VariantCreateRequest {
  /** @deprecated Ignored — the server generates the variant id. (Use PUT with an id to choose one.) */
  id?: string
  name?: string
  [key: string]: any
}

/**
 * Request payload for updating a variant. PUT with a new id creates it (upsert).
 */
export interface VariantUpdateRequest {
  name?: string
  [key: string]: any
}
