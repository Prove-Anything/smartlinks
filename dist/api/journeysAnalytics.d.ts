import type { JourneyStatsRequest, JourneyStatsResponse, JourneyStepRecipientsRequest, JourneyStepRecipientsResponse, JourneyFunnelReportRequest, JourneyFunnelReportResponse } from "../types/journeysAnalytics";
export declare namespace journeysAnalytics {
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/stats
     * Computes journey stats over a time window; outcome defaults to 'success'.
     * If `finalStepId` is provided, includes `currentlyActive` and `completed` fields.
     */
    function stats(collectionId: string, journeyId: string, body?: JourneyStatsRequest): Promise<JourneyStatsResponse>;
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/steps/:stepId/recipients
     * Returns recipient IDs for a given journey step.
     * For completed/pending, `interactionId` is required; outcome defaults to 'success'.
     */
    function recipients(collectionId: string, journeyId: string, stepId: string, body?: JourneyStepRecipientsRequest): Promise<JourneyStepRecipientsResponse>;
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/funnel-report
     * Computes conversion, counts, and avg time across mapped steps in a period.
     */
    function funnelReport(collectionId: string, journeyId: string, body: JourneyFunnelReportRequest): Promise<JourneyFunnelReportResponse>;
}
