// src/api/journeysAnalytics.ts
import { post } from "../http";
export var journeysAnalytics;
(function (journeysAnalytics) {
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/stats
     * Computes journey stats over a time window; outcome defaults to 'success'.
     * If `finalStepId` is provided, includes `currentlyActive` and `completed` fields.
     */
    async function stats(collectionId, journeyId, body = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys.analytics/${encodeURIComponent(journeyId)}/stats`;
        return post(path, body);
    }
    journeysAnalytics.stats = stats;
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/steps/:stepId/recipients
     * Returns recipient IDs for a given journey step.
     * For completed/pending, `interactionId` is required; outcome defaults to 'success'.
     */
    async function recipients(collectionId, journeyId, stepId, body = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys.analytics/${encodeURIComponent(journeyId)}/steps/${encodeURIComponent(stepId)}/recipients`;
        return post(path, body);
    }
    journeysAnalytics.recipients = recipients;
    /**
     * POST /admin/collection/:collectionId/journeys.analytics/:journeyId/funnel-report
     * Computes conversion, counts, and avg time across mapped steps in a period.
     */
    async function funnelReport(collectionId, journeyId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys.analytics/${encodeURIComponent(journeyId)}/funnel-report`;
        return post(path, body);
    }
    journeysAnalytics.funnelReport = funnelReport;
})(journeysAnalytics || (journeysAnalytics = {}));
