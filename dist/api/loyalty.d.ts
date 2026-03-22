import type { LoyaltyScheme, LoyaltyMember, LoyaltyTransaction, LoyaltyEarningRule, LoyaltySchemeWithMembership, LoyaltyTransactionResult, LoyaltyPaginationParams, LoyaltyPaginatedResult, CreateLoyaltySchemeBody, UpdateLoyaltySchemeBody, CreateLoyaltyEarningRuleBody, UpdateLoyaltyEarningRuleBody, RecordLoyaltyTransactionBody } from "../types/loyalty";
export declare namespace loyalty {
    function list(collectionId: string, params?: {
        includeDeleted?: boolean;
    }): Promise<LoyaltyScheme[]>;
    function get(collectionId: string, schemeId: string): Promise<LoyaltyScheme>;
    function create(collectionId: string, body: CreateLoyaltySchemeBody): Promise<LoyaltyScheme>;
    function update(collectionId: string, schemeId: string, body: UpdateLoyaltySchemeBody): Promise<LoyaltyScheme>;
    function remove(collectionId: string, schemeId: string): Promise<LoyaltyScheme>;
    function listEarningRules(collectionId: string, schemeId: string): Promise<LoyaltyEarningRule[]>;
    function getEarningRule(collectionId: string, schemeId: string, ruleId: string): Promise<LoyaltyEarningRule>;
    function createEarningRule(collectionId: string, schemeId: string, body: CreateLoyaltyEarningRuleBody): Promise<LoyaltyEarningRule>;
    function updateEarningRule(collectionId: string, schemeId: string, ruleId: string, body: UpdateLoyaltyEarningRuleBody): Promise<LoyaltyEarningRule>;
    function removeEarningRule(collectionId: string, schemeId: string, ruleId: string): Promise<LoyaltyEarningRule>;
    function listMembers(collectionId: string, schemeId: string, params?: LoyaltyPaginationParams): Promise<LoyaltyPaginatedResult<LoyaltyMember>>;
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
    function getMemberHistory(collectionId: string, schemeId: string, contactId: string, params?: LoyaltyPaginationParams): Promise<LoyaltyPaginatedResult<LoyaltyTransaction>>;
    /**
     * List active schemes for a collection. No authentication required.
     */
    function publicList(collectionId: string): Promise<LoyaltyScheme[]>;
    /**
     * Get a single active scheme. No authentication required.
     */
    function publicGet(collectionId: string, schemeId: string): Promise<LoyaltyScheme>;
    /**
     * List active earning rules for a scheme — useful for showing "how to earn"
     * in a loyalty UI. No authentication required.
     */
    function publicListEarningRules(collectionId: string, schemeId: string): Promise<LoyaltyEarningRule[]>;
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
    function publicGetMe(collectionId: string): Promise<LoyaltySchemeWithMembership[]>;
    /**
     * Get the authenticated caller's membership (balance + lifetimePoints)
     * on a specific scheme. Requires authentication.
     */
    function publicGetMine(collectionId: string, schemeId: string): Promise<LoyaltyMember>;
    /**
     * Get the authenticated caller's transaction history on a specific scheme.
     * Ordered newest first. Requires authentication.
     */
    function publicGetMineHistory(collectionId: string, schemeId: string, params?: LoyaltyPaginationParams): Promise<LoyaltyPaginatedResult<LoyaltyTransaction>>;
}
