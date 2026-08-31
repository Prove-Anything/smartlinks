// src/types/segments.ts

// Filter rule types based on actual segment code
export interface InteractionFilterValue {
  interactionId: string
  scope?: string  // ← NEW: Scope filtering
  outcome?: string
  from?: string  // ISO date string
  to?: string    // ISO date string
}


// Operators for a custom_field rule. Numeric (gt/gte/lt/lte) compare the field as
// a number; date operators compare it as a timestamp — within_days/older_than_days
// are relative to now (their value is a day count), before/after take an ISO date.
export type CustomFieldOperator =
  | 'equals'
  | 'exists'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'before'
  | 'after'
  | 'within_days'
  | 'older_than_days'

// Operators for an ownership attribute predicate — a comparison against a value
// inside the owned proof's JSON. Numeric ops (gt/gte/lt/lte) compare as a number.
export type OwnershipAttributeOperator = 'equals' | 'exists' | 'gt' | 'gte' | 'lt' | 'lte'

// A predicate on the owned proof itself. `path` is dotted; its first segment is
// the proof JSON column (values | data | meta | roles | extra) and the rest is the
// key path — e.g. 'values.customData.condition'. Correlated to the SAME owned proof
// as the rest of its ownership rule.
export interface OwnershipAttributePredicate {
  path: string
  operator: OwnershipAttributeOperator
  /** Operand: a number for gt/gte/lt/lte, a string for equals; omitted for exists. */
  value?: string | number
}

// Select owned products by a facet value, e.g. { key: 'category', value: 'washing-machine' }.
export interface OwnershipFacetSelector {
  key: string
  value: string
}

export type SegmentFilterRule =
  | { field: 'interaction'; op: 'had' | 'exists'; value: InteractionFilterValue }
  | { field: 'tags'; op: 'hasSome'; value: string[] }
  | { field: 'locale'; op: 'equals'; value: string }
  | { field: 'source'; op: 'equals'; value: string }
  | { field: 'createdAt'; op: 'between'; value: { from?: string; to?: string } }
  // Target a contact custom field. `field` is the custom-field key; `value` is
  // the comparison operand (a number for numeric ops, a day count for
  // within_days/older_than_days, an ISO date for before/after; omitted for exists).
  | { type: 'custom_field'; field: string; operator: CustomFieldOperator; value?: string | number }
  // Target contacts by what they OWN, via the proofs ledger. Optionally scope to a
  // productId and/or a product facet value, with predicates correlated to the SAME
  // owned proof: a JSON attribute, and the proof's age (olderThanDays / withinDays).
  // e.g. owns a washing machine (facet) that is itself >6yr old and grade C.
  | {
      type: 'ownership'
      productId?: string
      facet?: OwnershipFacetSelector
      attribute?: OwnershipAttributePredicate
      olderThanDays?: number
      withinDays?: number
      includeDeleted?: boolean
    }
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
