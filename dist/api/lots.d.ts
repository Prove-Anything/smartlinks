import { Lot, LotCreateInput, LotUpdateInput, ListLotsParams, ResolveLotResponse, LotProductSummary } from "../types/lots.js";
import type { ListResult, ListOptions } from "../types/list.js";
/**
 * Lots — collection-scoped production groupings that span one or more products.
 * Writes and admin reads hit `/admin/collection/:cid/lots`; the `public*` reads hit
 * `/public/collection/:cid/lots` for cross-app consumers. Admin vs public is the path
 * prefix (auth is the ambient bearer token); there is no `admin` flag in this SDK.
 */
export declare namespace lots {
    /** Create a lot (resolves its selector into members). */
    function create(collectionId: string, lot: LotCreateInput): Promise<Lot>;
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
    function list(collectionId: string, params?: ListLotsParams): Promise<ListResult<Lot>>;
    /** Get the full lot record. Pass `{ includeDeleted: true }` to fetch a soft-deleted one. */
    function get(collectionId: string, lotId: string, opts?: {
        includeDeleted?: boolean;
    }): Promise<Lot>;
    /** Look up a lot by its number (case-insensitive) — used by scan/resolver flows. */
    function getByNumber(collectionId: string, lotNumber: string, opts?: {
        includeDeleted?: boolean;
    }): Promise<Lot>;
    /** Update a lot. Re-resolves members if the selector changed (response then carries `diff`). */
    function update(collectionId: string, lotId: string, lot: LotUpdateInput): Promise<Lot>;
    /**
     * Soft-delete a lot — recoverable, and frees its `lotNumber` for reuse. Distinct from
     * {@link archive}. Hidden from reads unless `{ includeDeleted: true }`; undo with {@link restore}.
     */
    function remove(collectionId: string, lotId: string): Promise<{
        success: boolean;
    }>;
    /** Archive a lot — a live lifecycle state (stays visible, keeps its number). Not a delete. */
    function archive(collectionId: string, lotId: string): Promise<{
        success: boolean;
    }>;
    /** Restore a soft-deleted lot. Rejects (409) if a live lot now uses the same number. */
    function restore(collectionId: string, lotId: string): Promise<Lot>;
    /** Re-resolve members from the current selector; returns the lot + a member diff. */
    function resolve(collectionId: string, lotId: string): Promise<ResolveLotResponse>;
    /**
     * A lot's member products (summaries), a page at a time. `count` is how many members there are in all.
     *
     * @example
     * ```typescript
     * let page = await lots.listProducts('coll_123', lotId, { limit: 50 })
     * while (page.nextCursor) page = await lots.listProducts('coll_123', lotId, { limit: 50, cursor: page.nextCursor })
     * ```
     */
    function listProducts(collectionId: string, lotId: string, opts?: ListOptions): Promise<ListResult<LotProductSummary>>;
    /**
     * List lots from a public context (summary rows), a page at a time. Filter by `status`, search text
     * (`q`), or containing `productId`; page with `limit` (default 50) and `cursor`.
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await lots.publicList('coll_123', { productId: 'prod_789', limit: 50 })
     * ```
     */
    function publicList(collectionId: string, params?: Omit<ListLotsParams, 'includeDeleted'>): Promise<ListResult<Lot>>;
    function publicGet(collectionId: string, lotId: string): Promise<Lot>;
    function publicGetByNumber(collectionId: string, lotNumber: string): Promise<Lot>;
    /**
     * A lot's member products (summaries) from a public context, a page at a time.
     *
     * @example
     * ```typescript
     * const { items, nextCursor, count } = await lots.publicListProducts('coll_123', lotId, { limit: 50 })
     * ```
     */
    function publicListProducts(collectionId: string, lotId: string, opts?: ListOptions): Promise<ListResult<LotProductSummary>>;
}
