// src/types/lots.ts
//
// A Lot is a collection-scoped production grouping that spans one or more products
// (SKUs). Unlike a batch (a single production run of a single product), a lot is a
// first-class entity with a selector (how members are matched), a materialised
// product list, and a shared payload. Lots are never fanned out into batches.

export type LotStatus = 'open' | 'closed' | 'recalled' | 'archived'

/** How a lot's member products are resolved. */
export type LotSelector =
  | { mode: 'facets'; rules: Array<{ key: string; values: string[] }> }  // AND across rules, OR within a rule
  | { mode: 'products'; productIds: string[] }                            // explicit list

/** Shared lot data (single source of truth — not copied to batches). */
export interface LotPayload {
  manufacturedAt?: string | null
  expiresAt?: string | null
  location?: string | null
  custom?: Record<string, any>
  [key: string]: any
}

export interface Lot {
  id: string
  collectionId: string
  /** Human / GS1 AI(10) identifier, ≤20 chars, unique per collection (case-insensitive). */
  lotNumber: string
  name?: string | null
  description?: string | null
  status: LotStatus
  selector: LotSelector
  /** Omitted on list summaries. */
  payload?: LotPayload
  /** Optional lot-level redirect/destination; wins over the product's destination on a lot hit. */
  destination?: Record<string, any> | null
  productCount: number
  /** Materialised member product ids. Omitted on list summaries. */
  productIds?: string[]
  resolvedAt?: string | null
  createdBy?: string | null
  updatedBy?: string | null
  createdAt: string
  updatedAt: string
  /** Soft-delete timestamp (recoverable). `null` for live lots. Distinct from `status:'archived'`. */
  deletedAt?: string | null
}

export interface LotCreateInput {
  lotNumber: string
  name?: string
  description?: string
  selector?: LotSelector
  payload?: LotPayload
  destination?: Record<string, any> | null
  status?: LotStatus
  /** Optional client-supplied id; the server generates one otherwise. */
  id?: string
}

export type LotUpdateInput = Partial<LotCreateInput>

export interface ListLotsParams {
  status?: LotStatus
  search?: string
  /** Reverse lookup — lots containing this product id. */
  productId?: string
  /** Admin only: include soft-deleted lots (default false). */
  includeDeleted?: boolean
}

export interface ListLotsResponse { lots: Lot[] }

/** Member changes returned by resolve/update-with-selector-change. */
export interface LotMemberDiff { added: string[]; removed: string[] }
export interface ResolveLotResponse { lot: Lot; diff: LotMemberDiff }

export interface LotProductSummary { id: string; name?: string; gtin?: string | null }
export interface ListLotProductsResponse {
  products: LotProductSummary[]
  total: number
  page: number
  limit: number
}

/**
 * Typed result of GS1 AI(10) resolution. The server decides batch-vs-lot based on
 * the collection's flags (batch first — unique to one product — then lot).
 */
export interface LotResolutionResult {
  match: 'batch' | 'lot' | 'product' | 'none'
  productId: string
  batchId: string | null
  lotId: string | null
  ai10: string | null
  destination?: any
}
