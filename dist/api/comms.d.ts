import type { CommunicationEvent, CommsQueryByUser, CommsRecipientIdsQuery, CommsRecipientsWithoutActionQuery, CommsRecipientsWithActionQuery, RecipientId, RecipientWithOutcome, LogCommunicationEventBody, LogBulkCommunicationEventsBody, AppendResult, AppendBulkResult, TransactionalSendRequest, TransactionalSendResult } from "../types/comms.js";
/**
 * Communications namespace for sending notifications and managing user communications
 */
export declare namespace comms {
    /**
     * Public: Get VAPID public key used for Web Push subscriptions.
     * GET /public/collection/:collectionId/comm/push/vapidPublicKey
     * Note: Key may be global; path is collection-scoped for consistency.
     */
    function getPushVapidPublicKey(collectionId: string): Promise<import("../types/comms.js").PushVapidResponse>;
    /**
     * Public: Register a Web Push subscription under unified comms.
     * POST /public/collection/:collectionId/comm/push/register
     */
    function registerPush(collectionId: string, body: import("../types/comms.js").RegisterPushMethodRequest): Promise<import("../types/comms.js").PushSubscribeResponse>;
    /**
     * Admin: Get current comms settings for a collection.
     * GET /admin/collection/:collectionId/comm.settings
     * Optional query: includeSecret=true to include unsub.secret in response.
     */
    function getSettings(collectionId: string, opts?: {
        includeSecret?: boolean;
    }): Promise<import("../types/comms.js").CommsSettingsGetResponse>;
    /**
     * Admin: Patch comms settings for a collection.
     * PATCH /admin/collection/:collectionId/comm.settings
     */
    function patchSettings(collectionId: string, body: import("../types/comms.js").CommsSettingsPatchBody): Promise<import("../types/comms.js").CommsSettingsGetResponse>;
    /**
     * Public: Fetch configured topics for a collection.
     * GET /public/collection/:collectionId/comm/topics
     */
    function getPublicTopics(collectionId: string): Promise<import("../types/comms.js").CommsPublicTopicsResponse>;
    /**
     * Public: Unsubscribe a contact from a category or channel.
     * GET /public/collection/:collectionId/comm/unsubscribe
     */
    function unsubscribe(collectionId: string, query: import("../types/comms.js").UnsubscribeQuery): Promise<import("../types/comms.js").UnsubscribeResponse>;
    /**
     * Public: Upsert default consent for a contact.
     * POST /public/collection/:collectionId/comm/consent
     */
    function upsertConsent(collectionId: string, body: import("../types/comms.js").CommsConsentUpsertRequest): Promise<{
        ok: true;
    }>;
    /**
     * Public: Upsert preferences for a specific subject (or default if subject omitted).
     * POST /public/collection/:collectionId/comm/preferences
     */
    function upsertPreferences(collectionId: string, body: import("../types/comms.js").CommsPreferencesUpsertRequest): Promise<{
        ok: true;
    }>;
    /**
     * Public: Subscribe/unsubscribe contact to a subject.
     * POST /public/collection/:collectionId/comm/subscribe
     */
    function subscribe(collectionId: string, body: import("../types/comms.js").CommsSubscribeRequest): Promise<import("../types/comms.js").CommsSubscribeResponse>;
    /**
     * Public: Check subscription status for a subject.
     * GET /public/collection/:collectionId/comm/subscription/check
     */
    function checkSubscription(collectionId: string, query: import("../types/comms.js").CommsSubscriptionCheckQuery): Promise<import("../types/comms.js").CommsSubscriptionCheckResponse>;
    /**
     * Public: List registered contact methods.
     * GET /public/collection/:collectionId/comm/methods
     */
    function listMethods(collectionId: string, query: import("../types/comms.js").CommsListMethodsQuery): Promise<import("../types/comms.js").CommsListMethodsResponse>;
    /**
     * Public: Register email method for a contact.
     * POST /public/collection/:collectionId/comm/email/register
     */
    function registerEmail(collectionId: string, body: import("../types/comms.js").RegisterEmailMethodRequest): Promise<import("../types/comms.js").RegisterMethodResponse>;
    /**
     * Public: Register SMS method for a contact.
     * POST /public/collection/:collectionId/comm/sms/register
     */
    function registerSms(collectionId: string, body: import("../types/comms.js").RegisterSmsMethodRequest): Promise<import("../types/comms.js").RegisterMethodResponse>;
    /**
     * Public: Resolve contacts for a subject with identity hints.
     * POST /public/collection/:collectionId/comm/subscriptions/resolve
     */
    function resolveSubscriptions(collectionId: string, body: import("../types/comms.js").SubscriptionsResolveRequest): Promise<import("../types/comms.js").SubscriptionsResolveResponse>;
    /**
     * Analytics: Query communication events by user or contact.
     * POST /admin/collection/:collectionId/comm/query/by-user
     */
    function queryByUser(collectionId: string, body?: CommsQueryByUser): Promise<CommunicationEvent[]>;
    /**
     * Analytics: Recipient IDs for a communication source.
     * POST /admin/collection/:collectionId/comm/query/recipient-ids
     */
    function queryRecipientIds(collectionId: string, body: CommsRecipientIdsQuery): Promise<RecipientId[]>;
    /**
     * Analytics: Recipients who did not perform an action.
     * POST /admin/collection/:collectionId/comm/query/recipients/without-action
     */
    function queryRecipientsWithoutAction(collectionId: string, body: CommsRecipientsWithoutActionQuery): Promise<RecipientId[]>;
    /**
     * Analytics: Recipients who performed an action, optionally with outcome.
     * POST /admin/collection/:collectionId/comm/query/recipients/with-action
     */
    function queryRecipientsWithAction(collectionId: string, body: CommsRecipientsWithActionQuery): Promise<RecipientId[] | RecipientWithOutcome[]>;
    /**
     * Send a single transactional message to one contact using a template.
     * No broadcast record is created. The send is logged to the contact's
     * communication history with sourceType: 'transactional'.
     *
      * POST /admin/collection/:collectionId/comm/send
     *
     * @example
     * ```typescript
     * const result = await comms.sendTransactional(collectionId, {
     *   contactId:  'e4f2a1b0-...',
     *   templateId: 'warranty-update',
     *   channel:    'preferred',
     *   props:      { claimRef: 'CLM-0042', decision: 'approved' },
     *   include:    { productId: 'prod-abc123', appCase: 'c9d1e2f3-...' },
     *   ref:        'warranty-decision-notification',
     *   appId:      'warrantyApp',
     * })
     * if (result.ok) {
     *   console.log(`Sent via ${result.channel}`, result.messageId)
     * } else {
     *   console.error('Send failed:', result.error)
     * }
     * ```
     */
    function sendTransactional(collectionId: string, body: TransactionalSendRequest): Promise<TransactionalSendResult>;
    /**
     * Logging: Append a single communication event.
     * POST /admin/collection/:collectionId/comm/log
     */
    function logCommunicationEvent(collectionId: string, body: LogCommunicationEventBody): Promise<AppendResult>;
    /**
     * Logging: Append many communication events for a list of IDs.
     * POST /admin/collection/:collectionId/comm/log/bulk
     */
    function logBulkCommunicationEvents(collectionId: string, body: LogBulkCommunicationEventsBody | ({
        sourceId: string;
        ids: string[];
        idField?: 'userId' | 'contactId';
        [k: string]: any;
    })): Promise<AppendBulkResult>;
}
