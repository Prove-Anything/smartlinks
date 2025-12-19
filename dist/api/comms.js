// src/api/comms.ts
// Communications and notifications API for Smartlinks
import { post } from "../http";
/**
 * Communications namespace for sending notifications and managing user communications
 */
export var comms;
(function (comms) {
    /**
     * Send a notification to specified targets within a collection.
     *
     * Supports multiple delivery methods including push notifications, email, and wallet pass updates.
     * The notification will be delivered based on user preferences and the specified delivery mode.
     *
     * @param collectionId - ID of the collection containing the notification targets
     * @param request - Notification configuration including targets, severity, and content templates
    * @returns Promise resolving to the notification enqueue/queue status and totals
     * @throws ErrorResponse if the request fails or targets are invalid
     *
     * @example
     * ```typescript
     * const result = await comms.sendNotification('my-collection', {
     *   subjectTargets: [{ type: 'product', id: 'prod_123' }],
     *   severity: 'important',
     *   mode: 'preferred',
     *   template: {
     *     push: {
     *       title: 'Update available',
     *       body: 'We\'ve shipped an important update.',
     *       icon: 'https://cdn.example.com/brand/logo-128.png'
     *     },
     *     email: {
     *       subject: 'Important update for your product',
     *       body: 'There\'s an important update. Open your pass or profile to learn more.'
     *     },
     *     walletUpdate: {
     *       textModulesData: [
     *         { id: 'notice', header: 'Update', body: 'Open your wallet pass for details.' }
     *       ]
     *     }
     *   }
     * })
     * if (result.ok) {
     *   console.log('Notification queued:', result.notificationId)
     *   console.log('Totals:', result.status.totals)
     * }
     * ```
     */
    async function sendNotification(collectionId, request) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/notify`;
        return post(path, request);
    }
    comms.sendNotification = sendNotification;
    /**
     * Analytics: Query communication events by user or contact.
     * POST /admin/collection/:collectionId/comm/query/by-user
     */
    async function queryByUser(collectionId, body = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/by-user`;
        return post(path, body);
    }
    comms.queryByUser = queryByUser;
    /**
     * Analytics: Recipient IDs for a communication source.
     * POST /admin/collection/:collectionId/comm/query/recipient-ids
     */
    async function queryRecipientIds(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/recipient-ids`;
        return post(path, body);
    }
    comms.queryRecipientIds = queryRecipientIds;
    /**
     * Analytics: Recipients who did not perform an action.
     * POST /admin/collection/:collectionId/comm/query/recipients/without-action
     */
    async function queryRecipientsWithoutAction(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/recipients/without-action`;
        return post(path, body);
    }
    comms.queryRecipientsWithoutAction = queryRecipientsWithoutAction;
    /**
     * Analytics: Recipients who performed an action, optionally with outcome.
     * POST /admin/collection/:collectionId/comm/query/recipients/with-action
     */
    async function queryRecipientsWithAction(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/recipients/with-action`;
        return post(path, body);
    }
    comms.queryRecipientsWithAction = queryRecipientsWithAction;
    /**
     * Logging: Append a single communication event.
     * POST /admin/collection/:collectionId/comm/log
     */
    async function logCommunicationEvent(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/log`;
        return post(path, body);
    }
    comms.logCommunicationEvent = logCommunicationEvent;
    /**
     * Logging: Append many communication events for a list of IDs.
     * POST /admin/collection/:collectionId/comm/log/bulk
     */
    async function logBulkCommunicationEvents(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/log/bulk`;
        return post(path, body);
    }
    comms.logBulkCommunicationEvents = logBulkCommunicationEvents;
})(comms || (comms = {}));
