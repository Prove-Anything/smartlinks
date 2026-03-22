// src/api/loyalty.ts
import { request, post, patch, del } from "../http"
import type {
  LoyaltyScheme,
  LoyaltyMember,
  LoyaltyTransaction,
  LoyaltyEarningRule,
  LoyaltySchemeWithMembership,
  LoyaltyTransactionResult,
  LoyaltyPaginationParams,
  LoyaltyPaginatedResult,
  CreateLoyaltySchemeBody,
  UpdateLoyaltySchemeBody,
  CreateLoyaltyEarningRuleBody,
  UpdateLoyaltyEarningRuleBody,
  RecordLoyaltyTransactionBody,
} from "../types/loyalty"

function encodeQuery(params: Record<string, any>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ""
}

export namespace loyalty {

  // ── Admin — Schemes ───────────────────────────────────────────────────────────

  export async function list(
    collectionId: string,
    params: { includeDeleted?: boolean } = {}
  ): Promise<LoyaltyScheme[]> {
    return request<LoyaltyScheme[]>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme${encodeQuery(params)}`
    )
  }

  export async function get(
    collectionId: string,
    schemeId: string
  ): Promise<LoyaltyScheme> {
    return request<LoyaltyScheme>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`
    )
  }

  export async function create(
    collectionId: string,
    body: CreateLoyaltySchemeBody
  ): Promise<LoyaltyScheme> {
    return post<LoyaltyScheme>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme`,
      body
    )
  }

  export async function update(
    collectionId: string,
    schemeId: string,
    body: UpdateLoyaltySchemeBody
  ): Promise<LoyaltyScheme> {
    return patch<LoyaltyScheme>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`,
      body
    )
  }

  export async function remove(
    collectionId: string,
    schemeId: string
  ): Promise<LoyaltyScheme> {
    return del<LoyaltyScheme>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`
    )
  }

  // ── Admin — Earning Rules ─────────────────────────────────────────────────────

  export async function listEarningRules(
    collectionId: string,
    schemeId: string
  ): Promise<LoyaltyEarningRule[]> {
    return request<LoyaltyEarningRule[]>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule`
    )
  }

  export async function getEarningRule(
    collectionId: string,
    schemeId: string,
    ruleId: string
  ): Promise<LoyaltyEarningRule> {
    return request<LoyaltyEarningRule>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule/${encodeURIComponent(ruleId)}`
    )
  }

  export async function createEarningRule(
    collectionId: string,
    schemeId: string,
    body: CreateLoyaltyEarningRuleBody
  ): Promise<LoyaltyEarningRule> {
    return post<LoyaltyEarningRule>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule`,
      body
    )
  }

  export async function updateEarningRule(
    collectionId: string,
    schemeId: string,
    ruleId: string,
    body: UpdateLoyaltyEarningRuleBody
  ): Promise<LoyaltyEarningRule> {
    return patch<LoyaltyEarningRule>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule/${encodeURIComponent(ruleId)}`,
      body
    )
  }

  export async function removeEarningRule(
    collectionId: string,
    schemeId: string,
    ruleId: string
  ): Promise<LoyaltyEarningRule> {
    return del<LoyaltyEarningRule>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule/${encodeURIComponent(ruleId)}`
    )
  }

  // ── Admin — Members ───────────────────────────────────────────────────────────

  export async function listMembers(
    collectionId: string,
    schemeId: string,
    params: LoyaltyPaginationParams = {}
  ): Promise<LoyaltyPaginatedResult<LoyaltyMember>> {
    return request<LoyaltyPaginatedResult<LoyaltyMember>>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member${encodeQuery(params)}`
    )
  }

  export async function getMember(
    collectionId: string,
    schemeId: string,
    contactId: string
  ): Promise<LoyaltyMember> {
    return request<LoyaltyMember>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/${encodeURIComponent(contactId)}`
    )
  }

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
  export async function recordTransaction(
    collectionId: string,
    schemeId: string,
    contactId: string,
    body: RecordLoyaltyTransactionBody
  ): Promise<LoyaltyTransactionResult> {
    return post<LoyaltyTransactionResult>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/${encodeURIComponent(contactId)}/transaction`,
      body
    )
  }

  export async function getMemberHistory(
    collectionId: string,
    schemeId: string,
    contactId: string,
    params: LoyaltyPaginationParams = {}
  ): Promise<LoyaltyPaginatedResult<LoyaltyTransaction>> {
    return request<LoyaltyPaginatedResult<LoyaltyTransaction>>(
      `/admin/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/${encodeURIComponent(contactId)}/history${encodeQuery(params)}`
    )
  }

  // ── Public ────────────────────────────────────────────────────────────────────

  /**
   * List active schemes for a collection. No authentication required.
   */
  export async function publicList(collectionId: string): Promise<LoyaltyScheme[]> {
    return request<LoyaltyScheme[]>(
      `/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme`
    )
  }

  /**
   * Get a single active scheme. No authentication required.
   */
  export async function publicGet(
    collectionId: string,
    schemeId: string
  ): Promise<LoyaltyScheme> {
    return request<LoyaltyScheme>(
      `/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}`
    )
  }

  /**
   * List active earning rules for a scheme — useful for showing "how to earn"
   * in a loyalty UI. No authentication required.
   */
  export async function publicListEarningRules(
    collectionId: string,
    schemeId: string
  ): Promise<LoyaltyEarningRule[]> {
    return request<LoyaltyEarningRule[]>(
      `/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/earningRule`
    )
  }

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
  export async function publicGetMe(
    collectionId: string
  ): Promise<LoyaltySchemeWithMembership[]> {
    return request<LoyaltySchemeWithMembership[]>(
      `/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/me`
    )
  }

  /**
   * Get the authenticated caller's membership (balance + lifetimePoints)
   * on a specific scheme. Requires authentication.
   */
  export async function publicGetMine(
    collectionId: string,
    schemeId: string
  ): Promise<LoyaltyMember> {
    return request<LoyaltyMember>(
      `/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/me`
    )
  }

  /**
   * Get the authenticated caller's transaction history on a specific scheme.
   * Ordered newest first. Requires authentication.
   */
  export async function publicGetMineHistory(
    collectionId: string,
    schemeId: string,
    params: LoyaltyPaginationParams = {}
  ): Promise<LoyaltyPaginatedResult<LoyaltyTransaction>> {
    return request<LoyaltyPaginatedResult<LoyaltyTransaction>>(
      `/public/collection/${encodeURIComponent(collectionId)}/loyaltyScheme/${encodeURIComponent(schemeId)}/member/me/history${encodeQuery(params)}`
    )
  }
}
