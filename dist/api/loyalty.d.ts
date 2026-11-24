import type { LoyaltyScheme, LoyaltyMember, LoyaltyTransaction, LoyaltyEarningRule, LoyaltySchemeWithMembership, LoyaltyTransactionResult, CreateLoyaltySchemeBody, UpdateLoyaltySchemeBody, CreateLoyaltyEarningRuleBody, UpdateLoyaltyEarningRuleBody, RecordLoyaltyTransactionBody } from "../types/loyalty.js";
import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace loyalty {
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
    function list(collectionId: string, params?: ListOptions & {
        includeDeleted?: boolean;
    }): Promise<ListResult<LoyaltyScheme>>;
    function get(collectionId: string, schemeId: string): Promise<LoyaltyScheme>;
    function create(collectionId: string, body: CreateLoyaltySchemeBody): Promise<LoyaltyScheme>;
    function update(collectionId: string, schemeId: string, body: UpdateLoyaltySchemeBody): Promise<LoyaltyScheme>;
    function remove(collectionId: string, schemeId: string): Promise<LoyaltyScheme>;
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
    function listEarningRules(collectionId: string, schemeId: string, options?: ListOptions): Promise<ListResult<LoyaltyEarningRule>>;
    function getEarningRule(collectionId: string, schemeId: string, ruleId: string): Promise<LoyaltyEarningRule>;
    function createEarningRule(collectionId: string, schemeId: string, body: CreateLoyaltyEarningRuleBody): Promise<LoyaltyEarningRule>;
    function updateEarningRule(collectionId: string, schemeId: string, ruleId: string, body: UpdateLoyaltyEarningRuleBody): Promise<LoyaltyEarningRule>;
    function removeEarningRule(collectionId: string, schemeId: string, ruleId: string): Promise<LoyaltyEarningRule>;
    /**
     * A scheme's members (admin), a page at a time (default 50, at most 200).
     *
     * @example
     * ```typescript
     * let page = await loyalty.listMembers('coll_123', schemeId, { limit: 100 })
     * while (page.nextCursor) page = await loyalty.listMembers('coll_123', schemeId, { limit: 100, cursor: page.nextCursor })
     * ```
     */
    function listMembers(collectionId: string, schemeId: string, params?: ListOptions): Promise<ListResult<LoyaltyMember>>;
    function getMember(collectionId: string, schemeId: string, contactId: string): Promise<LoyaltyMember>;
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
    function recordTransaction(collectionId: string, schemeId: string, contactId: string, body: RecordLoyaltyTransactionBody): Promise<LoyaltyTransactionResult>;
    /**
     * One member's points transactions (admin), newest first, a page at a time.
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await loyalty.getMemberHistory('coll_123', schemeId, contactId, { limit: 50 })
     * ```
     */
    function getMemberHistory(collectionId: string, schemeId: string, contactId: string, params?: ListOptions): Promise<ListResult<LoyaltyTransaction>>;
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
    function publicList(collectionId: string, options?: ListOptions): Promise<ListResult<LoyaltyScheme>>;
    /**
     * Get a single active scheme. No authentication required.
     */
    function publicGet(collectionId: string, schemeId: string): Promise<LoyaltyScheme>;
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
    function publicListEarningRules(collectionId: string, schemeId: string, options?: ListOptions): Promise<ListResult<LoyaltyEarningRule>>;
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
    function publicGetMe(collectionId: string, options?: ListOptions): Promise<ListResult<LoyaltySchemeWithMembership>>;
    /**
     * Get the authenticated caller's membership (balance + lifetimePoints)
     * on a specific scheme. Requires authentication.
     */
    function publicGetMine(collectionId: string, schemeId: string): Promise<LoyaltyMember>;
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
    function publicGetMineHistory(collectionId: string, schemeId: string, params?: ListOptions): Promise<ListResult<LoyaltyTransaction>>;
}
