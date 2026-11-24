// src/api/loyalty.ts
import { request, post, patch, del } from "../http.js";
import { listQuery } from "../list.js";
export var loyalty;
(function (loyalty) {
    // ── Admin — Schemes ───────────────────────────────────────────────────────────
    /**
     * The collection's loyalty schemes (admin), a page at a time. Page with `limit` (50 unless you
     * say) and `cursor`. Pass `includeDeleted: true` to include deleted schemes.
     *
     * @example
     * ```typescript
     * let page = await loyalty.list('coll_123', { limit: 50 })
     * while (page.nextCursor) page = await loyalty.list('coll_123', { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, params = {}) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme${listQuery(params)}`);
    }
    loyalty.list = list;
    async function get(collectionId, schemeId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`);
    }
    loyalty.get = get;
    async function create(collectionId, body) {
        return post(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme`, body);
    }
    loyalty.create = create;
    async function update(collectionId, schemeId, body) {
        return patch(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`, body);
    }
    loyalty.update = update;
    async function remove(collectionId, schemeId) {
        return del(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`);
    }
    loyalty.remove = remove;
    // ── Admin — Earning Rules ─────────────────────────────────────────────────────
    /**
     * A scheme's earning rules (admin), a page at a time. Page with `limit` (50 unless you say) and
     * `cursor`.
     *
     * @example
     * ```typescript
     * let page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50 })
     * while (page.nextCursor) page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function listEarningRules(collectionId, schemeId, options = {}) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule${listQuery(options)}`);
    }
    loyalty.listEarningRules = listEarningRules;
    async function getEarningRule(collectionId, schemeId, ruleId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule/${encodeURIComponent(ruleId)}`);
    }
    loyalty.getEarningRule = getEarningRule;
    async function createEarningRule(collectionId, schemeId, body) {
        return post(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule`, body);
    }
    loyalty.createEarningRule = createEarningRule;
    async function updateEarningRule(collectionId, schemeId, ruleId, body) {
        return patch(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule/${encodeURIComponent(ruleId)}`, body);
    }
    loyalty.updateEarningRule = updateEarningRule;
    async function removeEarningRule(collectionId, schemeId, ruleId) {
        return del(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule/${encodeURIComponent(ruleId)}`);
    }
    loyalty.removeEarningRule = removeEarningRule;
    // ── Admin — Members ───────────────────────────────────────────────────────────
    /**
     * A scheme's members (admin), a page at a time (default 50, at most 200).
     *
     * @example
     * ```typescript
     * let page = await loyalty.listMembers('coll_123', schemeId, { limit: 100 })
     * while (page.nextCursor) page = await loyalty.listMembers('coll_123', schemeId, { limit: 100, cursor: page.nextCursor })
     * ```
     */
    async function listMembers(collectionId, schemeId, params = {}) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member${listQuery(params)}`);
    }
    loyalty.listMembers = listMembers;
    async function getMember(collectionId, schemeId, contactId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/${encodeURIComponent(contactId)}`);
    }
    loyalty.getMember = getMember;
    // ── Admin — Transactions ──────────────────────────────────────────────────────
    /**
     * Manually award or deduct points for a contact.
     *
     * - `points` must be a non-zero integer
     * - Positive = award, negative = deduct
     * - Deducting below zero returns HTTP 422 `INSUFFICIENT_BALANCE`
     * - Supply `idempotencyKey` to safely retry without double-crediting
     *
     * Points earned via interaction events are awarded automatically by the
     * server — this endpoint is for manual adjustments and admin overrides.
     */
    async function recordTransaction(collectionId, schemeId, contactId, body) {
        return post(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/${encodeURIComponent(contactId)}/transaction`, body);
    }
    loyalty.recordTransaction = recordTransaction;
    /**
     * One member's points transactions (admin), newest first, a page at a time.
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await loyalty.getMemberHistory('coll_123', schemeId, contactId, { limit: 50 })
     * ```
     */
    async function getMemberHistory(collectionId, schemeId, contactId, params = {}) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/${encodeURIComponent(contactId)}/history${listQuery(params)}`);
    }
    loyalty.getMemberHistory = getMemberHistory;
    // ── Public ────────────────────────────────────────────────────────────────────
    /**
     * List active schemes for a collection, a page at a time. No authentication required. Page with
     * `limit` (50 unless you say) and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await loyalty.publicList('coll_123', { limit: 50 })
     * while (page.nextCursor) page = await loyalty.publicList('coll_123', { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function publicList(collectionId, options = {}) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme${listQuery(options)}`);
    }
    loyalty.publicList = publicList;
    /**
     * Get a single active scheme. No authentication required.
     */
    async function publicGet(collectionId, schemeId) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`);
    }
    loyalty.publicGet = publicGet;
    /**
     * List active earning rules for a scheme — useful for showing "how to earn"
     * in a loyalty UI. No authentication required. A page at a time: page with `limit` (50 unless you
     * say) and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await loyalty.publicListEarningRules('coll_123', schemeId, { limit: 50 })
     * while (page.nextCursor) page = await loyalty.publicListEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function publicListEarningRules(collectionId, schemeId, options = {}) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule${listQuery(options)}`);
    }
    loyalty.publicListEarningRules = publicListEarningRules;
    /**
     * Get all active schemes with the caller's membership embedded in each.
     *
     * This is the primary entry point for a loyalty widget — one call gives
     * you everything needed to render a user's loyalty status across all
     * programs in a collection.
     *
     * - Authenticated: `member` is populated with balance + lifetimePoints
     *   (or null if not yet enrolled in that scheme)
     * - Unauthenticated: `member` is null on all schemes
     *
     * A page at a time: page with `limit` (50 unless you say) and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await loyalty.publicGetMe('coll_123')
     * for (const scheme of page.items) console.log(scheme.name, scheme.member?.balance ?? 0)
     * while (page.nextCursor) page = await loyalty.publicGetMe('coll_123', { cursor: page.nextCursor })
     * ```
     */
    async function publicGetMe(collectionId, options = {}) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/me${listQuery(options)}`);
    }
    loyalty.publicGetMe = publicGetMe;
    /**
     * Get the authenticated caller's membership (balance + lifetimePoints)
     * on a specific scheme. Requires authentication.
     */
    async function publicGetMine(collectionId, schemeId) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/me`);
    }
    loyalty.publicGetMine = publicGetMine;
    /**
     * Get the authenticated caller's transaction history on a specific scheme.
     * Ordered newest first, a page at a time. Requires authentication.
     *
     * @example
     * ```typescript
     * let page = await loyalty.publicGetMineHistory('coll_123', schemeId, { limit: 20 })
     * while (page.nextCursor) page = await loyalty.publicGetMineHistory('coll_123', schemeId, { limit: 20, cursor: page.nextCursor })
     * ```
     */
    async function publicGetMineHistory(collectionId, schemeId, params = {}) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/me/history${listQuery(params)}`);
    }
    loyalty.publicGetMineHistory = publicGetMineHistory;
})(loyalty || (loyalty = {}));
