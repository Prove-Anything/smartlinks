// src/types/loyalty.ts

export type DataBlock = Record<string, unknown>

// ── Core objects ──────────────────────────────────────────────────────────────

export interface LoyaltyScheme {
  id: string
  orgId: string
  collectionId: string
  name: string
  /** Open string — e.g. "points" | "stamps" */
  type: string
  active: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
  deletedAt: string | null // ISO
  data: DataBlock
  /** Admin responses only */
  owner?: DataBlock
  /** Admin responses only */
  admin?: DataBlock
}

export interface LoyaltyMember {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  contactId: string
  userId: string | null
  /** Current redeemable balance */
  balance: number
  /** Total ever earned — never decremented, used for tier calculations */
  lifetimePoints: number
  createdAt: string // ISO
  updatedAt: string // ISO
  data: DataBlock
  /** Admin responses only */
  owner?: DataBlock
  /** Admin responses only */
  admin?: DataBlock
}

export interface LoyaltyTransaction {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  memberId: string
  /** Signed: positive = earn, negative = spend/deduct */
  points: number
  reason: string | null
  /** Caller-supplied key — prevents double-credit on retries */
  idempotencyKey: string | null
  metadata: DataBlock
  createdAt: string // ISO
}

export interface LoyaltyEarningRule {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  /** ID of the Interaction definition that triggers this rule */
  interactionId: string
  /** Points awarded when this rule matches — always server-controlled */
  points: number
  /**
   * Key-value conditions matched against the interaction event before awarding.
   * Supports top-level event fields (outcome, scope, status, eventType, etc.)
   * and dot-path into metadata (e.g. `"metadata.tier": "gold"`).
   * Empty object = always fires for any event on this interaction.
   */
  conditions: Record<string, string>
  /** Maximum lifetime triggers per contact. null = unlimited */
  maxPerContact: number | null
  /** Minimum hours between triggers for the same contact. null = no cooldown */
  cooldownHours: number | null
  active: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
  data: DataBlock
}

// ── Composite ─────────────────────────────────────────────────────────────────

/**
 * Returned by loyalty.getMe() — each active scheme with the caller's
 * membership embedded. member is null if the caller has never earned
 * points in that scheme.
 */
export interface LoyaltySchemeWithMembership extends Omit<LoyaltyScheme, 'owner' | 'admin'> {
  member: Omit<LoyaltyMember, 'owner' | 'admin'> | null
}

/** Returned by loyalty.admin.recordTransaction() */
export interface LoyaltyTransactionResult {
  member: LoyaltyMember
  transaction: LoyaltyTransaction
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface LoyaltyPaginationParams {
  limit?: number  // default 50, max 200
  offset?: number
}

export interface LoyaltyPaginatedResult<T> {
  items: T[]
  limit: number
  offset: number
}

// ── Request payloads ──────────────────────────────────────────────────────────

export interface CreateLoyaltySchemeBody {
  name: string
  type: string
  active?: boolean
  data?: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}

export interface UpdateLoyaltySchemeBody {
  name?: string
  type?: string
  active?: boolean
  data?: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}

export interface CreateLoyaltyEarningRuleBody {
  interactionId: string
  points: number
  conditions?: Record<string, string>
  maxPerContact?: number | null
  cooldownHours?: number | null
  active?: boolean
  data?: DataBlock
}

export interface UpdateLoyaltyEarningRuleBody {
  points?: number
  conditions?: Record<string, string>
  maxPerContact?: number | null
  cooldownHours?: number | null
  active?: boolean
  data?: DataBlock
}

export interface RecordLoyaltyTransactionBody {
  /** Non-zero signed integer. Positive = earn, negative = spend/deduct */
  points: number
  reason?: string
  /**
   * Optional caller-supplied key scoped to the scheme.
   * If a transaction with this key already exists the server returns 409.
   * Use to safely retry without double-crediting points.
   */
  idempotencyKey?: string
  metadata?: DataBlock
  /** Links the auto-created member to a Firebase UID if not yet associated */
  userId?: string
}
