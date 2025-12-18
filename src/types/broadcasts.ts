// src/types/broadcasts.ts

import type { IdField } from './common'

// Broadcast events (analytics logging)
export interface BroadcastEvent {
  orgId: string
  broadcastId: string
  userId?: string
  contactId?: string
  channel?: string
  timestamp: string
  [k: string]: any
}

export interface BroadcastQueryByUser {
  userId?: string
  contactId?: string
  from?: string
  to?: string
  limit?: number
}

export interface RecipientIdsQuery {
  broadcastId: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}

export interface RecipientsWithoutActionQuery {
  broadcastId: string
  actionId?: string
  appId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}

export interface RecipientsWithActionQuery {
  broadcastId: string
  actionId?: string
  appId?: string
  outcome?: string
  idField?: IdField
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
}

export type RecipientId = string
export interface RecipientWithOutcome { id: string; outcome: string }

export interface AppendBroadcastBody {
  broadcastId: string
  userId?: string
  contactId?: string
  channel?: string
  timestamp?: string
  [k: string]: any
}

export interface AppendBroadcastBulkBody {
  params: { broadcastId: string; [k: string]: any }
  ids: string[]
  idField?: IdField
}

export interface AppendResult { success: true }
export interface AppendBulkResult { success: true; count: number }

// Broadcast CRUD (Postgres)
export interface CreateBroadcastBody {
  appId: string
  data?: Record<string, any>
}

export interface UpdateBroadcastBody {
  appId?: string
  data?: Record<string, any>
}

export interface ListBroadcastsQuery {
  limit?: number
  offset?: number
  appId?: string
}

export interface BroadcastRecord {
  id: string
  collectionId: string
  appId: string
  templateId?: string
  segmentId?: string
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | string
  scheduledAt?: string
  sentAt?: string
  data?: {
    display?: {
      title?: string
      description?: string
      icon?: string
      color?: string
    }
    broadcastType?: string
    [key: string]: unknown
  }
  createdAt: string
}

export interface BroadcastList {
  items: BroadcastRecord[]
  limit: number
  offset: number
}
