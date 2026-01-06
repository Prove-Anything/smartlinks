// src/api/journeysAnalytics.ts
import { post } from "../http"
import type {
  JourneyStatsRequest,
  JourneyStatsResponse,
  JourneyStepRecipientsRequest,
  JourneyStepRecipientsResponse,
  JourneyFunnelReportRequest,
  JourneyFunnelReportResponse,
} from "../types/journeysAnalytics"

export namespace journeysAnalytics {
  /**
   * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/stats
   * Computes journey stats over a time window; outcome defaults to 'success'.
   * If `finalStepId` is provided, includes `currentlyActive` and `completed` fields.
   */
  export async function stats(
    collectionId: string,
    journeyId: string,
    body: JourneyStatsRequest = {}
  ): Promise<JourneyStatsResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys.analytics/${encodeURIComponent(journeyId)}/stats`
    return post<JourneyStatsResponse>(path, body)
  }

  /**
   * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/steps/:stepId/recipients
   * Returns recipient IDs for a given journey step.
   * For completed/pending, `interactionId` is required; outcome defaults to 'success'.
   */
  export async function recipients(
    collectionId: string,
    journeyId: string,
    stepId: string,
    body: JourneyStepRecipientsRequest = {}
  ): Promise<JourneyStepRecipientsResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys.analytics/${encodeURIComponent(journeyId)}/steps/${encodeURIComponent(stepId)}/recipients`
    return post<JourneyStepRecipientsResponse>(path, body)
  }

  /**
   * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/funnel-report
   * Computes conversion, counts, and avg time across mapped steps in a period.
   */
  export async function funnelReport(
    collectionId: string,
    journeyId: string,
    body: JourneyFunnelReportRequest
  ): Promise<JourneyFunnelReportResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys.analytics/${encodeURIComponent(journeyId)}/funnel-report`
    return post<JourneyFunnelReportResponse>(path, body)
  }
}
