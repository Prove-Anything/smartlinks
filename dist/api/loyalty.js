// src/api/loyalty.ts
import { request, post, patch, del } from "../http";
function encodeQuery(params) {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined)
            q.set(k, String(v));
    }
    const s = q.toString();
    return s ? `?${s}` : "";
}
export var loyalty;
(function (loyalty) {
    // ── Admin — Schemes ───────────────────────────────────────────────────────────
    async function list(collectionId, params = {}) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme${encodeQuery(params)}`);
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
    async function listEarningRules(collectionId, schemeId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule`);
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
    async function listMembers(collectionId, schemeId, params = {}) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member${encodeQuery(params)}`);
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
    async function getMemberHistory(collectionId, schemeId, contactId, params = {}) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/${encodeURIComponent(contactId)}/history${encodeQuery(params)}`);
    }
    loyalty.getMemberHistory = getMemberHistory;
    // ── Public ────────────────────────────────────────────────────────────────────
    /**
     * List active schemes for a collection. No authentication required.
     */
    async function publicList(collectionId) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme`);
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
     * in a loyalty UI. No authentication required.
     */
    async function publicListEarningRules(collectionId, schemeId) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule`);
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
     */
    async function publicGetMe(collectionId) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/me`);
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
     * Ordered newest first. Requires authentication.
     */
    async function publicGetMineHistory(collectionId, schemeId, params = {}) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/me/history${encodeQuery(params)}`);
    }
    loyalty.publicGetMineHistory = publicGetMineHistory;
})(loyalty || (loyalty = {}));
