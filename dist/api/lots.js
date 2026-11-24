// src/api/lots.ts
import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
/**
 * Lots — collection-scoped production groupings that span one or more products.
 * Writes and admin reads hit `/admin/collection/:cid/lots`; the `public*` reads hit
 * `/public/collection/:cid/lots` for cross-app consumers. Admin vs public is the path
 * prefix (auth is the ambient bearer token); there is no `admin` flag in this SDK.
 */
export var lots;
(function (lots) {
    function adminBase(collectionId) {
        return `/admin/collection/${encodeURIComponent(collectionId)}/lots`;
    }
    function publicBase(collectionId) {
        return `/public/collection/${encodeURIComponent(collectionId)}/lots`;
    }
    function lotsQuery(params = {}) {
        return listQuery({
            status: params.status,
            q: params.q,
            productId: params.productId,
            includeDeleted: params.includeDeleted ? 'true' : undefined,
            limit: params.limit,
            cursor: params.cursor,
        });
    }
    function pageQuery(opts = {}) {
        return listQuery({ limit: opts.limit || undefined, cursor: opts.cursor });
    }
    // ── Admin (writes + admin reads) ──
    /** Create a lot (resolves its selector into members). */
    async function create(collectionId, lot) {
        return post(adminBase(collectionId), lot);
    }
    lots.create = create;
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
    async function list(collectionId, params = {}) {
        return request(`${adminBase(collectionId)}${lotsQuery(params)}`);
    }
    lots.list = list;
    /** Get the full lot record. Pass `{ includeDeleted: true }` to fetch a soft-deleted one. */
    async function get(collectionId, lotId, opts = {}) {
        const qs = opts.includeDeleted ? '?includeDeleted=true' : '';
        return request(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}${qs}`);
    }
    lots.get = get;
    /** Look up a lot by its number (case-insensitive) — used by scan/resolver flows. */
    async function getByNumber(collectionId, lotNumber, opts = {}) {
        const qs = opts.includeDeleted ? '?includeDeleted=true' : '';
        return request(`${adminBase(collectionId)}/by-number/${encodeURIComponent(lotNumber)}${qs}`);
    }
    lots.getByNumber = getByNumber;
    /** Update a lot. Re-resolves members if the selector changed (response then carries `diff`). */
    async function update(collectionId, lotId, lot) {
        return put(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}`, lot);
    }
    lots.update = update;
    /**
     * Soft-delete a lot — recoverable, and frees its `lotNumber` for reuse. Distinct from
     * {@link archive}. Hidden from reads unless `{ includeDeleted: true }`; undo with {@link restore}.
     */
    async function remove(collectionId, lotId) {
        return del(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}`);
    }
    lots.remove = remove;
    /** Archive a lot — a live lifecycle state (stays visible, keeps its number). Not a delete. */
    async function archive(collectionId, lotId) {
        return post(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/archive`, {});
    }
    lots.archive = archive;
    /** Restore a soft-deleted lot. Rejects (409) if a live lot now uses the same number. */
    async function restore(collectionId, lotId) {
        return post(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/restore`, {});
    }
    lots.restore = restore;
    /** Re-resolve members from the current selector; returns the lot + a member diff. */
    async function resolve(collectionId, lotId) {
        return post(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/resolve`, {});
    }
    lots.resolve = resolve;
    /**
     * A lot's member products (summaries), a page at a time. `count` is how many members there are in all.
     *
     * @example
     * ```typescript
     * let page = await lots.listProducts('coll_123', lotId, { limit: 50 })
     * while (page.nextCursor) page = await lots.listProducts('coll_123', lotId, { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function listProducts(collectionId, lotId, opts = {}) {
        return request(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`);
    }
    lots.listProducts = listProducts;
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
    async function publicList(collectionId, params = {}) {
        return request(`${publicBase(collectionId)}${lotsQuery(params)}`);
    }
    lots.publicList = publicList;
    async function publicGet(collectionId, lotId) {
        return request(`${publicBase(collectionId)}/${encodeURIComponent(lotId)}`);
    }
    lots.publicGet = publicGet;
    async function publicGetByNumber(collectionId, lotNumber) {
        return request(`${publicBase(collectionId)}/by-number/${encodeURIComponent(lotNumber)}`);
    }
    lots.publicGetByNumber = publicGetByNumber;
    /**
     * A lot's member products (summaries) from a public context, a page at a time.
     *
     * @example
     * ```typescript
     * const { items, nextCursor, count } = await lots.publicListProducts('coll_123', lotId, { limit: 50 })
     * ```
     */
    async function publicListProducts(collectionId, lotId, opts = {}) {
        return request(`${publicBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`);
    }
    lots.publicListProducts = publicListProducts;
})(lots || (lots = {}));
