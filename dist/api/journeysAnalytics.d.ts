import type { JourneyStatsRequest, JourneyStatsResponse, JourneyStepRecipientsRequest, JourneyFunnelReportRequest, JourneyFunnelReportResponse } from "../types/journeysAnalytics.js";
import type { ListResult } from "../types/list.js";
export declare namespace journeysAnalytics {
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/stats
     * Computes journey stats over a time window; outcome defaults to 'success'.
     * If `finalStepId` is provided, includes `currentlyActive` and `completed` fields.
     */
    function stats(collectionId: string, journeyId: string, body?: JourneyStatsRequest): Promise<JourneyStatsResponse>;
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/steps/:stepId/recipients
     * Returns recipient IDs for a given journey step, a page at a time (`limit` and `cursor` in the
     * body). The time window is `from` / `to`.
     * For completed/pending, `interactionId` is required; outcome defaults to 'success'.
     *
     * @example
     * ```typescript
     * const query = { status: 'completed' as const, interactionId, idField: 'contactId' as const, limit: 1000 }
     * let page = await journeysAnalytics.recipients('coll_123', journeyId, stepId, query)
     * page.items // contact ids
     * while (page.nextCursor) {
     *   page = await journeysAnalytics.recipients('coll_123', journeyId, stepId, { ...query, cursor: page.nextCursor })
     * }
     * ```
     */
    function recipients(collectionId: string, journeyId: string, stepId: string, body?: JourneyStepRecipientsRequest): Promise<ListResult<string>>;
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/funnel-report
     * Computes conversion, counts, and avg time across mapped steps in a period.
     */
    function funnelReport(collectionId: string, journeyId: string, body: JourneyFunnelReportRequest): Promise<JourneyFunnelReportResponse>;
}
