// src/types/journeysAnalytics.ts

import type { IdField } from './common'
import type { ListOptions } from './list'

// Stats
export interface JourneyStatsRequest {
  idField?: IdField // 'userId' | 'contactId'
  from?: string
  to?: string
  finalStepId?: string
  stepMappings?: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}

export interface JourneyStatsResponse {
  journeyId: string
  totalEntered: number
  currentlyActive?: number
  completed?: number
  exitedViaGoal?: number
  lastUpdated: string
  stepStats: Array<{ stepId: string; entered: number; completed: number; pending: number }>
}

// Recipients
/** `journeysAnalytics.recipients` options: the filters, the time window (`from` / `to`), plus `limit` and `cursor`. */
export interface JourneyStepRecipientsRequest extends ListOptions {
  status?: 'entered' | 'completed' | 'pending'
  idField?: IdField
  interactionId?: string
  outcome?: string
  from?: string
  to?: string
}

// Funnel Report
export interface JourneyFunnelReportRequest {
  idField?: IdField
  periodStart?: string
  periodEnd?: string
  stepMappings: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}

export interface JourneyFunnelReportResponse {
  journeyId: string
  periodStart: string | null
  periodEnd: string | null
  steps: Array<{
    stepId: string
    enteredCount: number
    completedCount: number
    conversionRate: number
    avgTimeToComplete: number | null
  }>
}
