import { Lot, LotCreateInput, LotUpdateInput, ListLotsParams, ResolveLotResponse, ListLotProductsResponse } from "../types/lots";
/**
 * Lots — collection-scoped production groupings that span one or more products.
 * Writes and admin reads hit `/admin/collection/:cid/lots`; the `public*` reads hit
 * `/public/collection/:cid/lots` for cross-app consumers. Admin vs public is the path
 * prefix (auth is the ambient bearer token); there is no `admin` flag in this SDK.
 */
export declare namespace lots {
    /** Create a lot (resolves its selector into members). */
    function create(collectionId: string, lot: LotCreateInput): Promise<Lot>;
    /** List lots (summary rows; `payload`/`productIds` omitted). Filter by status, search, or containing productId. */
    function list(collectionId: string, params?: ListLotsParams): Promise<Lot[]>;
    /** Get the full lot record. */
    function get(collectionId: string, lotId: string): Promise<Lot>;
    /** Look up a lot by its number (case-insensitive) — used by scan/resolver flows. */
    function getByNumber(collectionId: string, lotNumber: string): Promise<Lot>;
    /** Update a lot. Re-resolves members if the selector changed (response then carries `diff`). */
    function update(collectionId: string, lotId: string, lot: LotUpdateInput): Promise<Lot>;
    /** Soft-archive a lot (never deletes members). */
    function archive(collectionId: string, lotId: string): Promise<{
        success: boolean;
    }>;
    /** Re-resolve members from the current selector; returns the lot + a member diff. */
    function resolve(collectionId: string, lotId: string): Promise<ResolveLotResponse>;
    /** Paginated member product summaries. */
    function listProducts(collectionId: string, lotId: string, opts?: {
        page?: number;
        limit?: number;
    }): Promise<ListLotProductsResponse>;
    function publicList(collectionId: string, params?: ListLotsParams): Promise<Lot[]>;
    function publicGet(collectionId: string, lotId: string): Promise<Lot>;
    function publicGetByNumber(collectionId: string, lotNumber: string): Promise<Lot>;
    function publicListProducts(collectionId: string, lotId: string, opts?: {
        page?: number;
        limit?: number;
    }): Promise<ListLotProductsResponse>;
}
