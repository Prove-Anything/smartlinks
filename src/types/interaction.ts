// src/types/interaction.ts

import type { IdField } from './common'

// Admin analytics inputs (Interactions)
export interface AdminInteractionsQueryRequest {
  userId?: string
  contactId?: string
  appId?: string
  interactionId?: string
  interactionIds?: string[]
  broadcastId?: string
  outcome?: string | null
  from?: string
  to?: string
  limit?: number
  includeDeleted?: boolean
  latestPerEventId?: boolean
  order?: 'ASC' | 'DESC'
  include?: Array<'interaction'>

}

export interface AdminInteractionsCountsByOutcomeRequest {
  appId?: string
  interactionId?: string
  from?: string
  to?: string
  limit?: number
  dedupeLatest?: boolean
  idField?: IdField
}

// Deprecated: AdminActorIdsByInteractionRequest removed with flexible query endpoint

// Public analytics inputs (Interactions)
export interface PublicInteractionsCountsByOutcomeRequest {
  appId: string
  interactionId: string
  from?: string
  to?: string
  limit?: number
}

export interface PublicInteractionsByUserRequest {
  appId?: string
  interactionId?: string
  from?: string
  to?: string
  limit?: number
}

// BigQuery analytics rows (Interactions)
export interface InteractionEventRow {
  orgId: string
  collectionId: string
  timestamp: string
  appId?: string
  interactionId?: string
  broadcastId?: string
  userId?: string
  contactId?: string
  outcome?: string | null
  metadata?: Record<string, unknown>
  [k: string]: unknown
}

// Outcome summaries
export interface OutcomeCount { outcome: string | null; count: number }

// Append single interaction event (admin)
// Base for interaction event payloads to avoid duplication
export interface InteractionEventBase {
  collectionId: string,
  orgId?: string,
  userId?: string
  contactId?: string
  interactionId: string
  appId?: string
  broadcastId?: string
  journeyId?: string
  productId?: string
  proofId?: string
  variantId?: string
  batchId?: string
  source?: string,
  eventType?: string
  outcome?: string
  timestamp?: string
  metadata?: Record<string, unknown>
  [k: string]: any
}

export interface AppendInteractionBody extends InteractionEventBase {}

export interface UpdateInteractionBody extends InteractionEventBase {
  eventId: string
  status?: 'active' | 'deleted'
}

/**
 * InteractionPermissions: configuration for public + authenticated interaction behavior.
 *
 * Stored under the `permissions` JSON for an interaction definition (Postgres `interactions` table).
 * These keys control whether submissions are allowed, visibility of summaries, and guardrails.
 */
export interface InteractionPermissions {
  /** Enable/disable submissions globally for this interaction (default: enabled). */
  enabled?: boolean

  /** Require an authenticated user to submit. If true, anonymous/public submissions are blocked. */
  requireAuth?: boolean

  /** Allow public (non-auth) submissions in general. */
  allowPublicSubmit?: boolean

  /** Allow anonymous submissions even without a session (subset of public). */
  allowAnonymousSubmit?: boolean

  /** Restrict submissions to matching origins (e.g., site domains). Uses substring match. */
  allowedOrigins?: string[]

  /** ISO datetime: submissions allowed at or after this time. */
  startAt?: string

  /** ISO datetime: submissions allowed up to and including this time. */
  endAt?: string

  /**
   * Enforce uniqueness per user: prevent duplicate submissions for this interaction.
   * If true, optionally use `uniquePerUserWindowSeconds` to scope the window.
   */
  uniquePerUser?: boolean

  /** Time window in seconds for uniqueness checks (e.g., 86400 for one day). */
  uniquePerUserWindowSeconds?: number

  /** Optional outcome tag used when checking duplicates (e.g., "submitted"). */
  uniqueOutcome?: string

  /**
   * Public summary visibility (counts, aggregates) without auth.
   * If false, summaries require `allowAuthenticatedSummary` + user auth.
   */
  allowPublicSummary?: boolean

  /**
   * Authenticated summary visibility (counts, aggregates) when user is signed in.
   */
  allowAuthenticatedSummary?: boolean

  /** Allow an authenticated user to read their own interaction history via the public API. */
  allowOwnRead?: boolean
}


export interface InteractionTypeRecord {
  id?: string
  collectionId: string
  appId: string
  permissions?: InteractionPermissions
  data?: {
    display?: {
      title?: string
      description?: string
      icon?: string
      color?: string
    }
    interactionType?: string
    [key: string]: unknown
  }
  createdAt: string
}

export interface InteractionTypeList {
  items: InteractionTypeRecord[]
  limit: number
  offset: number
}

export interface CreateInteractionTypeBody {
  id: string
  appId: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}

export interface UpdateInteractionTypeBody {
  appId?: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}

export interface ListInteractionTypesQuery {
  appId?: string
  limit?: number
  offset?: number
}
