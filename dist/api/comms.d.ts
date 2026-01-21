import type { CommunicationEvent, CommsQueryByUser, CommsRecipientIdsQuery, CommsRecipientsWithoutActionQuery, CommsRecipientsWithActionQuery, RecipientId, RecipientWithOutcome, LogCommunicationEventBody, LogBulkCommunicationEventsBody, AppendResult, AppendBulkResult } from "../types/comms";
/**
 * Communications namespace for sending notifications and managing user communications
 */
export declare namespace comms {
    /**
     * Public: Get VAPID public key used for Web Push subscriptions.
     * GET /public/collection/:collectionId/comm/push/vapidPublicKey
     * Note: Key may be global; path is collection-scoped for consistency.
     */
    function getPushVapidPublicKey(collectionId: string): Promise<import("../types/comms").PushVapidResponse>;
    /**
     * Public: Register a Web Push subscription under unified comms.
     * POST /public/collection/:collectionId/comm/push/register
     */
    function registerPush(collectionId: string, body: import("../types/comms").RegisterPushMethodRequest): Promise<import("../types/comms").PushSubscribeResponse>;
    /**
     * Admin: Get current comms settings for a collection.
     * GET /admin/collection/:collectionId/comm.settings
     * Optional query: includeSecret=true to include unsub.secret in response.
     */
    function getSettings(collectionId: string, opts?: {
        includeSecret?: boolean;
    }): Promise<import("../types/comms").CommsSettingsGetResponse>;
    /**
     * Admin: Patch comms settings for a collection.
     * PATCH /admin/collection/:collectionId/comm.settings
     */
    function patchSettings(collectionId: string, body: import("../types/comms").CommsSettingsPatchBody): Promise<import("../types/comms").CommsSettingsGetResponse>;
    /**
     * Public: Fetch configured topics for a collection.
     * GET /public/collection/:collectionId/comm/topics
     */
    function getPublicTopics(collectionId: string): Promise<import("../types/comms").CommsPublicTopicsResponse>;
    /**
     * Public: Unsubscribe a contact from a category or channel.
     * GET /public/collection/:collectionId/comm/unsubscribe
     */
    function unsubscribe(collectionId: string, query: import("../types/comms").UnsubscribeQuery): Promise<import("../types/comms").UnsubscribeResponse>;
    /**
     * Public: Upsert default consent for a contact.
     * POST /public/collection/:collectionId/comm/consent
     */
    function upsertConsent(collectionId: string, body: import("../types/comms").CommsConsentUpsertRequest): Promise<{
        ok: true;
    }>;
    /**
     * Public: Upsert preferences for a specific subject (or default if subject omitted).
     * POST /public/collection/:collectionId/comm/preferences
     */
    function upsertPreferences(collectionId: string, body: import("../types/comms").CommsPreferencesUpsertRequest): Promise<{
        ok: true;
    }>;
    /**
     * Public: Subscribe/unsubscribe contact to a subject.
     * POST /public/collection/:collectionId/comm/subscribe
     */
    function subscribe(collectionId: string, body: import("../types/comms").CommsSubscribeRequest): Promise<import("../types/comms").CommsSubscribeResponse>;
    /**
     * Public: Check subscription status for a subject.
     * GET /public/collection/:collectionId/comm/subscription/check
     */
    function checkSubscription(collectionId: string, query: import("../types/comms").CommsSubscriptionCheckQuery): Promise<import("../types/comms").CommsSubscriptionCheckResponse>;
    /**
     * Public: List registered contact methods.
     * GET /public/collection/:collectionId/comm/methods
     */
    function listMethods(collectionId: string, query: import("../types/comms").CommsListMethodsQuery): Promise<import("../types/comms").CommsListMethodsResponse>;
    /**
     * Public: Register email method for a contact.
     * POST /public/collection/:collectionId/comm/email/register
     */
    function registerEmail(collectionId: string, body: import("../types/comms").RegisterEmailMethodRequest): Promise<import("../types/comms").RegisterMethodResponse>;
    /**
     * Public: Register SMS method for a contact.
     * POST /public/collection/:collectionId/comm/sms/register
     */
    function registerSms(collectionId: string, body: import("../types/comms").RegisterSmsMethodRequest): Promise<import("../types/comms").RegisterMethodResponse>;
    /**
     * Public: Resolve contacts for a subject with identity hints.
     * POST /public/collection/:collectionId/comm/subscriptions/resolve
     */
    function resolveSubscriptions(collectionId: string, body: import("../types/comms").SubscriptionsResolveRequest): Promise<import("../types/comms").SubscriptionsResolveResponse>;
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
