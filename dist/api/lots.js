// src/api/lots.ts
import { request, post, put, del } from "../http";
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
    function listQuery(params = {}) {
        const qs = new URLSearchParams();
        if (params.status)
            qs.append('status', params.status);
        if (params.search)
            qs.append('search', params.search);
        if (params.productId)
            qs.append('productId', params.productId);
        const s = qs.toString();
        return s ? `?${s}` : '';
    }
    function pageQuery(opts = {}) {
        const qs = new URLSearchParams();
        if (opts.page)
            qs.append('page', String(opts.page));
        if (opts.limit)
            qs.append('limit', String(opts.limit));
        const s = qs.toString();
        return s ? `?${s}` : '';
    }
    // ── Admin (writes + admin reads) ──
    /** Create a lot (resolves its selector into members). */
    async function create(collectionId, lot) {
        return post(adminBase(collectionId), lot);
    }
    lots.create = create;
    /** List lots (summary rows; `payload`/`productIds` omitted). Filter by status, search, or containing productId. */
    async function list(collectionId, params = {}) {
        const res = await request(`${adminBase(collectionId)}${listQuery(params)}`);
        return res.lots;
    }
    lots.list = list;
    /** Get the full lot record. */
    async function get(collectionId, lotId) {
        return request(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}`);
    }
    lots.get = get;
    /** Look up a lot by its number (case-insensitive) — used by scan/resolver flows. */
    async function getByNumber(collectionId, lotNumber) {
        return request(`${adminBase(collectionId)}/by-number/${encodeURIComponent(lotNumber)}`);
    }
    lots.getByNumber = getByNumber;
    /** Update a lot. Re-resolves members if the selector changed (response then carries `diff`). */
    async function update(collectionId, lotId, lot) {
        return put(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}`, lot);
    }
    lots.update = update;
    /** Soft-archive a lot (never deletes members). */
    async function archive(collectionId, lotId) {
        return del(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}`);
    }
    lots.archive = archive;
    /** Re-resolve members from the current selector; returns the lot + a member diff. */
    async function resolve(collectionId, lotId) {
        return post(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/resolve`, {});
    }
    lots.resolve = resolve;
    /** Paginated member product summaries. */
    async function listProducts(collectionId, lotId, opts = {}) {
        return request(`${adminBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`);
    }
    lots.listProducts = listProducts;
    // ── Public (cross-app reads) ──
    async function publicList(collectionId, params = {}) {
        const res = await request(`${publicBase(collectionId)}${listQuery(params)}`);
        return res.lots;
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
    async function publicListProducts(collectionId, lotId, opts = {}) {
        return request(`${publicBase(collectionId)}/${encodeURIComponent(lotId)}/products${pageQuery(opts)}`);
    }
    lots.publicListProducts = publicListProducts;
})(lots || (lots = {}));
