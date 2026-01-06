// src/types/broadcasts.ts

// Broadcast analytics and logging have moved to the comms namespace.

// Broadcast CRUD (Postgres)
// Prefer using derived types inline in API signatures instead of separate bodies
// create body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>
// update body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>

export interface ListBroadcastsQuery {
  limit?: number
  offset?: number
  appId?: string
}

export interface BroadcastRecord {
  id: string
  collectionId: string
  appId: string
  templateId?: string | null
  segmentId?: string | null
  status?: string | null
  scheduledAt?: string | null
  sentAt?: string | null
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

// New broadcast helpers for recipients and sending flows
export interface BroadcastRecipientsResponse {
  items: import('./comms').Recipient[]
  total: number
  limit: number
  offset: number
  note?: string
}

export interface BroadcastPreviewRequest {
  contactId?: string
  email?: string
  props?: Record<string, any>
}
export interface BroadcastPreviewResponse { ok: boolean; html: string }

export interface BroadcastSendTestRequest {
  to: string
  subject?: string
  props?: Record<string, any>
}
export interface BroadcastSendTestResponse { ok: boolean; id?: string }

export interface BroadcastSendManualRequest {
  limit?: number
  offset?: number
  dryRun?: boolean
  sharedContext?: Record<string, any>
}
export interface BroadcastSendManualResponse {
  ok: boolean
  counts: { sent: number; failed: number; skipped: number }
  page: { limit: number; offset: number; total: number }
  results: Array<{
    contactId: string
    status: 'sent' | 'failed' | 'skipped' | 'dry_run'
    id?: string
    error?: string
    message?: string
  }>
}

export interface BroadcastAppendEventBody {
  broadcastId: string
  contactId?: string
  channel?: 'email'
  templateId?: string
  eventType: string
  outcome?: 'success' | 'failed'
  failureReason?: string
  metadata?: Record<string, any>
}

export interface BroadcastAppendBulkBody {
  ids: string[]
  idField?: string
  params: Record<string, any> // merged with collectionId server-side
}
