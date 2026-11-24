// src/api/lots.ts
import { request, post, put, del } from "../http"
import {
  Lot, LotCreateInput, LotUpdateInput,
  ListLotsParams,
  ResolveLotResponse, LotProductSummary,
} from "../types/lots"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

/**
 * Lots — collection-scoped production groupings that span one or more products.
 * Writes and admin reads hit `/admin/collection/:cid/lots`; the `public*` reads hit
 * `/public/collection/:cid/lots` for cross-app consumers. Admin vs public is the path
 * prefix (auth is the ambient bearer token); there is no `admin` flag in this SDK.
 */
export namespace lots {
  function adminBase(collectionId: string): string {
    return `/admin/collection/${encodeURIComponent(collectionId)}/lots`
  }
  function publicBase(collectionId: string): string {
    return `/public/collection/${encodeURIComponent(collectionId)}/lots`
  }
  function lotsQuery(params: ListLotsParams = {}): string {
    return listQuery({
      status: params.status,
      q: params.q,
      productId: params.productId,
      includeDeleted: params.includeDeleted ? 'true' : undefined,
      limit: params.limit,
      cursor: params.cursor,
    })
  }
  function pageQuery(opts: ListOptions = {}): string {
    return listQuery({ limit: opts.limit || undefined, cursor: opts.cursor })
  }

  // ── Admin (writes + admin reads) ──

  /** Create a lot (resolves its selector into members). */
  export async function create(collectionId: string, lot: LotCreateInput): Promise<Lot> {
    return post<Lot>(adminBase(collectionId), lot)
  }

  /**
   * List lots (summary rows; `payload`/`productIds` omitted), a page at a time. Filter by `status`, search
   * text (`q`), or containing `productId`; page with `limit` (default 50) and `cursor`.
   *
   * @example
   * ```typescript
   * let page = await lots.list('coll_123', { status: 'open', q: 'spring', limit: 50 })
   * while (page.nextCursor) {
   *   page = await lots.list('coll_123', { status: 'open', q: 'spring', limit: 50, cursor: page.nextCursor })
   * }
   * ```
   */
  export async function list(collectionId: string, params: ListLotsParams = {}): Promise<ListResult<Lot>> {
    return request<ListResult<Lot>>(`${adminBase(collectionId)}${lotsQuery(params)}`)
  }

  /** Get the full lot record. Pass `{ includeDeleted: true }` to fetch a soft-deleted one. */
  export async function get(collectionId: string, lotId: string, opts: { includeDeleted?: boolean } = {}): Promise<Lot> {
    const qs = opts.includeDeleted ? '?includeDeleted=true' : ''
    return request<Lot>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}${qs}`)
  }

  /** Look up a lot by its number (case-insensitive) — used by scan/resolver flows. */
  export async function getByNumber(collectionId: string, lotNumber: string, opts: { includeDeleted?: boolean } = {}): Promise<Lot> {
    const qs = opts.includeDeleted ? '?includeDeleted=true' : ''
    return request<Lot>(`${adminBase(collectionId)}/by-number/${encodeURIComponent(lotNumber)}${qs}`)
  }

  /** Update a lot. Re-resolves members if the selector changed (response then carries `diff`). */
  export async function update(collectionId: string, lotId: string, lot: LotUpdateInput): Promise<Lot> {
    return put<Lot>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}`, lot)
  }

  /**
   * Soft-delete a lot — recoverable, and frees its `lotNumber` for reuse. Distinct from
   * {@link archive}. Hidden from reads unless `{ includeDeleted: true }`; undo with {@link restore}.
   */
  export async function remove(collectionId: string, lotId: string): Promise<{ success: boolean }> {
    return del<{ success: boolean }>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}`)
  }

  /** Archive a lot — a live lifecycle state (stays visible, keeps its number). Not a delete. */
  export async function archive(collectionId: string, lotId: string): Promise<{ success: boolean }> {
    return post<{ success: boolean }>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/archive`, {})
  }

  /** Restore a soft-deleted lot. Rejects (409) if a live lot now uses the same number. */
  export async function restore(collectionId: string, lotId: string): Promise<Lot> {
    return post<Lot>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/restore`, {})
  }

  /** Re-resolve members from the current selector; returns the lot + a member diff. */
  export async function resolve(collectionId: string, lotId: string): Promise<ResolveLotResponse> {
    return post<ResolveLotResponse>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/resolve`, {})
  }

  /**
   * A lot's member products (summaries), a page at a time. `count` is how many members there are in all.
   *
   * @example
   * ```typescript
   * let page = await lots.listProducts('coll_123', lotId, { limit: 50 })
   * while (page.nextCursor) page = await lots.listProducts('coll_123', lotId, { limit: 50, cursor: page.nextCursor })
   * ```
   */
  export async function listProducts(collectionId: string, lotId: string, opts: ListOptions = {}): Promise<ListResult<LotProductSummary>> {
    return request<ListResult<LotProductSummary>>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`)
  }

  // ── Public (cross-app reads) ──

  /**
   * List lots from a public context (summary rows), a page at a time. Filter by `status`, search text
   * (`q`), or containing `productId`; page with `limit` (default 50) and `cursor`.
   *
   * @example
   * ```typescript
   * const { items, nextCursor } = await lots.publicList('coll_123', { productId: 'prod_789', limit: 50 })
   * ```
   */
  export async function publicList(collectionId: string, params: Omit<ListLotsParams, 'includeDeleted'> = {}): Promise<ListResult<Lot>> {
    return request<ListResult<Lot>>(`${publicBase(collectionId)}${lotsQuery(params)}`)
  }
  export async function publicGet(collectionId: string, lotId: string): Promise<Lot> {
    return request<Lot>(`${publicBase(collectionId)}/${encodeURIComponent(lotId)}`)
  }
  export async function publicGetByNumber(collectionId: string, lotNumber: string): Promise<Lot> {
    return request<Lot>(`${publicBase(collectionId)}/by-number/${encodeURIComponent(lotNumber)}`)
  }
  /**
   * A lot's member products (summaries) from a public context, a page at a time.
   *
   * @example
   * ```typescript
   * const { items, nextCursor, count } = await lots.publicListProducts('coll_123', lotId, { limit: 50 })
   * ```
   */
  export async function publicListProducts(collectionId: string, lotId: string, opts: ListOptions = {}): Promise<ListResult<LotProductSummary>> {
    return request<ListResult<LotProductSummary>>(`${publicBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`)
  }
}
