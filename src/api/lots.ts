// src/api/lots.ts
import { request, post, put, del } from "../http"
import {
  Lot, LotCreateInput, LotUpdateInput,
  ListLotsParams, ListLotsResponse,
  ResolveLotResponse, ListLotProductsResponse,
} from "../types/lots"

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
  function listQuery(params: ListLotsParams = {}): string {
    const qs = new URLSearchParams()
    if (params.status) qs.append('status', params.status)
    if (params.search) qs.append('search', params.search)
    if (params.productId) qs.append('productId', params.productId)
    if (params.includeDeleted) qs.append('includeDeleted', 'true')
    const s = qs.toString()
    return s ? `?${s}` : ''
  }
  function pageQuery(opts: { page?: number; limit?: number } = {}): string {
    const qs = new URLSearchParams()
    if (opts.page) qs.append('page', String(opts.page))
    if (opts.limit) qs.append('limit', String(opts.limit))
    const s = qs.toString()
    return s ? `?${s}` : ''
  }

  // ── Admin (writes + admin reads) ──

  /** Create a lot (resolves its selector into members). */
  export async function create(collectionId: string, lot: LotCreateInput): Promise<Lot> {
    return post<Lot>(adminBase(collectionId), lot)
  }

  /** List lots (summary rows; `payload`/`productIds` omitted). Filter by status, search, or containing productId. */
  export async function list(collectionId: string, params: ListLotsParams = {}): Promise<Lot[]> {
    const res = await request<ListLotsResponse>(`${adminBase(collectionId)}${listQuery(params)}`)
    return res.lots
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

  /** Paginated member product summaries. */
  export async function listProducts(collectionId: string, lotId: string, opts: { page?: number; limit?: number } = {}): Promise<ListLotProductsResponse> {
    return request<ListLotProductsResponse>(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`)
  }

  // ── Public (cross-app reads) ──

  export async function publicList(collectionId: string, params: ListLotsParams = {}): Promise<Lot[]> {
    const res = await request<ListLotsResponse>(`${publicBase(collectionId)}${listQuery(params)}`)
    return res.lots
  }
  export async function publicGet(collectionId: string, lotId: string): Promise<Lot> {
    return request<Lot>(`${publicBase(collectionId)}/${encodeURIComponent(lotId)}`)
  }
  export async function publicGetByNumber(collectionId: string, lotNumber: string): Promise<Lot> {
    return request<Lot>(`${publicBase(collectionId)}/by-number/${encodeURIComponent(lotNumber)}`)
  }
  export async function publicListProducts(collectionId: string, lotId: string, opts: { page?: number; limit?: number } = {}): Promise<ListLotProductsResponse> {
    return request<ListLotProductsResponse>(`${publicBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`)
  }
}
