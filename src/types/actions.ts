// src/types/actions.ts

import type { IdField } from './common'

// Admin analytics inputs (Actions)
export interface AdminByUserRequest {
  userId?: string
  contactId?: string
  appId?: string
  actionId?: string
  broadcastId?: string
  outcome?: string | null
  from?: string
  to?: string
  limit?: number
}

export interface AdminCountsByOutcomeRequest {
  appId?: string
  actionId?: string
  from?: string
  to?: string
  limit?: number
  dedupeLatest?: boolean
  idField?: IdField
}

export interface AdminActorIdsByActionRequest {
  actionId: string
  idField?: IdField
  outcome?: string | null
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
}

// Public analytics inputs (Actions)
export interface PublicCountsByOutcomeRequest {
  appId: string
  actionId: string
  from?: string
  to?: string
  limit?: number
}

export interface PublicByUserRequest {
  appId: string
  actionId: string
  from?: string
  to?: string
  limit?: number
}

// BigQuery analytics rows (Actions)
export interface ActionEventRow {
  orgId: string
  collectionId: string
  timestamp: string
  appId?: string
  actionId?: string
  broadcastId?: string
  userId?: string
  contactId?: string
  outcome?: string | null
  metadata?: Record<string, unknown>
  [k: string]: unknown
}

// Outcome summaries and actor lists
export interface OutcomeCount { outcome: string | null; count: number }
export type ActorId = string
export interface ActorWithOutcome { id: string; outcome: string | null }

// Append single action event (admin)
export interface AppendActionBody {
  userId?: string
  contactId?: string
  actionId: string
  appId?: string
  broadcastId?: string
  outcome?: string
  timestamp?: string
  metadata?: Record<string, unknown>
  [k: string]: any
}


// Action CRUD (Postgres)
export interface ActionPermissions {
  allowOwnRead?: boolean
  allowPublicSummary?: boolean
  allowAuthenticatedSummary?: boolean
}

export interface ActionRecord {
  id: string
  collectionId: string
  appId: string
  permissions?: ActionPermissions
  data?: {
    display?: {
      title?: string
      description?: string
      icon?: string
      color?: string
    }
    actionType?: string
    [key: string]: unknown
  }
  createdAt: string
}

export interface ActionList {
  items: ActionRecord[]
  limit: number
  offset: number
}

export interface CreateActionBody {
  id: string
  appId: string
  permissions?: ActionPermissions
  data?: Record<string, unknown>
}

export interface UpdateActionBody {
  appId?: string
  permissions?: ActionPermissions
  data?: Record<string, unknown>
}

export interface ListActionsQuery {
  appId?: string
  limit?: number
  offset?: number
}

// Legacy compatibility (older admin analytics input names)
export type ActionQueryByUser = AdminByUserRequest
export type ActionCountsQuery = AdminCountsByOutcomeRequest
export type ActorIdsByActionQuery = AdminActorIdsByActionRequest
