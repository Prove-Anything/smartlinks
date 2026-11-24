// src/api/journeysAnalytics.ts
import { post } from "../http"
import type {
  JourneyStatsRequest,
  JourneyStatsResponse,
  JourneyStepRecipientsRequest,
  JourneyFunnelReportRequest,
  JourneyFunnelReportResponse,
} from "../types/journeysAnalytics"
import type { ListResult } from "../types/list"

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
   * Returns recipient IDs for a given journey step, as a list of ids. One list, no pages: `limit` in
   * the body says how many.
   * For completed/pending, `interactionId` is required; outcome defaults to 'success'.
   *
   * @example
   * ```typescript
   * const { items: contactIds } = await journeysAnalytics.recipients('coll_123', journeyId, stepId, {
   *   status: 'completed', interactionId, idField: 'contactId', limit: 1000,
   * })
   * ```
   */
  export async function recipients(
    collectionId: string,
    journeyId: string,
    stepId: string,
    body: JourneyStepRecipientsRequest = {}
  ): Promise<ListResult<string>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys.analytics/${encodeURIComponent(journeyId)}/steps/${encodeURIComponent(stepId)}/recipients`
    return post<ListResult<string>>(path, body)
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
