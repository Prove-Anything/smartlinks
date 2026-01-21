// src/api/comms.ts
// Communications and notifications API for Smartlinks
import { post, request, patch } from "../http";
/**
 * Communications namespace for sending notifications and managing user communications
 */
export var comms;
(function (comms) {
    /**
     * Public: Get VAPID public key used for Web Push subscriptions.
     * GET /public/collection/:collectionId/comm/push/vapidPublicKey
     * Note: Key may be global; path is collection-scoped for consistency.
     */
    async function getPushVapidPublicKey(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/push/vapidPublicKey`;
        return request(path);
    }
    comms.getPushVapidPublicKey = getPushVapidPublicKey;
    /**
     * Public: Register a Web Push subscription under unified comms.
     * POST /public/collection/:collectionId/comm/push/register
     */
    async function registerPush(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/push/register`;
        return post(path, body);
    }
    comms.registerPush = registerPush;
    // Admin Comms Settings
    /**
     * Admin: Get current comms settings for a collection.
     * GET /admin/collection/:collectionId/comm.settings
     * Optional query: includeSecret=true to include unsub.secret in response.
     */
    async function getSettings(collectionId, opts = {}) {
        const params = new URLSearchParams();
        if (opts.includeSecret)
            params.set('includeSecret', 'true');
        const qs = params.toString() ? `?${params.toString()}` : '';
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm.settings${qs}`;
        return request(path);
    }
    comms.getSettings = getSettings;
    /**
     * Admin: Patch comms settings for a collection.
     * PATCH /admin/collection/:collectionId/comm.settings
     */
    async function patchSettings(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm.settings`;
        return patch(path, body);
    }
    comms.patchSettings = patchSettings;
    /**
     * Public: Fetch configured topics for a collection.
     * GET /public/collection/:collectionId/comm/topics
     */
    async function getPublicTopics(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/topics`;
        return request(path);
    }
    comms.getPublicTopics = getPublicTopics;
    /**
     * Public: Unsubscribe a contact from a category or channel.
     * GET /public/collection/:collectionId/comm/unsubscribe
     */
    async function unsubscribe(collectionId, query) {
        const params = new URLSearchParams();
        params.set('contactId', query.contactId);
        if (query.topic)
            params.set('topic', query.topic);
        if (query.channel)
            params.set('channel', query.channel);
        if (query.token)
            params.set('token', query.token);
        const qs = `?${params.toString()}`;
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/unsubscribe${qs}`;
        return request(path);
    }
    comms.unsubscribe = unsubscribe;
    /**
     * Public: Upsert default consent for a contact.
     * POST /public/collection/:collectionId/comm/consent
     */
    async function upsertConsent(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/consent`;
        return post(path, body);
    }
    comms.upsertConsent = upsertConsent;
    /**
     * Public: Upsert preferences for a specific subject (or default if subject omitted).
     * POST /public/collection/:collectionId/comm/preferences
     */
    async function upsertPreferences(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/preferences`;
        return post(path, body);
    }
    comms.upsertPreferences = upsertPreferences;
    /**
     * Public: Subscribe/unsubscribe contact to a subject.
     * POST /public/collection/:collectionId/comm/subscribe
     */
    async function subscribe(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/subscribe`;
        return post(path, body);
    }
    comms.subscribe = subscribe;
    /**
     * Public: Check subscription status for a subject.
     * GET /public/collection/:collectionId/comm/subscription/check
     */
    async function checkSubscription(collectionId, query) {
        const params = new URLSearchParams();
        params.set('contactId', query.contactId);
        params.set('subjectType', query.subjectType);
        params.set('subjectId', query.subjectId);
        if (query.productId)
            params.set('productId', String(query.productId));
        const qs = `?${params.toString()}`;
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/subscription/check${qs}`;
        return request(path);
    }
    comms.checkSubscription = checkSubscription;
    /**
     * Public: List registered contact methods.
     * GET /public/collection/:collectionId/comm/methods
     */
    async function listMethods(collectionId, query) {
        const params = new URLSearchParams();
        params.set('contactId', query.contactId);
        if (query.type)
            params.set('type', query.type);
        const qs = `?${params.toString()}`;
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/methods${qs}`;
        return request(path);
    }
    comms.listMethods = listMethods;
    /**
     * Public: Register email method for a contact.
     * POST /public/collection/:collectionId/comm/email/register
     */
    async function registerEmail(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/email/register`;
        return post(path, body);
    }
    comms.registerEmail = registerEmail;
    /**
     * Public: Register SMS method for a contact.
     * POST /public/collection/:collectionId/comm/sms/register
     */
    async function registerSms(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/sms/register`;
        return post(path, body);
    }
    comms.registerSms = registerSms;
    /**
     * Public: Resolve contacts for a subject with identity hints.
     * POST /public/collection/:collectionId/comm/subscriptions/resolve
     */
    async function resolveSubscriptions(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/subscriptions/resolve`;
        return post(path, body);
    }
    comms.resolveSubscriptions = resolveSubscriptions;
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
