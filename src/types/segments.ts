// src/types/segments.ts

// Filter rule types based on actual segment code
export interface InteractionFilterValue {
  interactionId: string
  scope?: string  // ← NEW: Scope filtering
  outcome?: string
  from?: string  // ISO date string
  to?: string    // ISO date string
}


export type SegmentFilterRule = 
  | { field: 'interaction'; op: 'had' | 'exists'; value: InteractionFilterValue }
  | { field: 'tags'; op: 'hasSome'; value: string[] }
  | { field: 'locale'; op: 'equals'; value: string }
  | { field: 'source'; op: 'equals'; value: string }
  | { field: 'createdAt'; op: 'between'; value: { from?: string; to?: string } }
  | { type: 'interaction'; interactionId: string; scope?: string; outcome?: string; from?: string; to?: string }  // Legacy format

  
export interface SegmentRecord {
  id: string
  collectionId: string
  appId?: string
  name: string
  filterType: 'dynamic' | 'static'
  estimatedCount?: number
  lastCalculatedAt?: string
  createdAt: string
  data?: {
    filterRules: SegmentFilterRule[]
    description?: string
    staticContactIds?: string[]
    [key: string]: unknown
  }
}

// Prefer using derived types inline in API signatures instead of separate bodies
// create body: Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>
// update body: Partial<Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>>

export interface ListSegmentsQuery {
  appId?: string
  filterType?: 'dynamic' | 'static'
  limit?: number
  offset?: number
}

export interface SegmentList {
  items: SegmentRecord[]
  limit: number
  offset: number
}

export interface SegmentCalculateResult {
  scheduled: boolean
  lastCalculatedAt?: string
  estimatedCount?: number | null
  note?: string
}

export interface SegmentRecipientsResponse {
  items: import('./comms').Recipient[]
  limit: number
  offset: number
  total: number
  note?: string
}
