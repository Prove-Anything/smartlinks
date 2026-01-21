// src/api/comms.ts
// Communications and notifications API for Smartlinks

import { post, request, patch } from "../http"
import type { 
  CommunicationEvent,
  CommsQueryByUser,
  CommsRecipientIdsQuery,
  CommsRecipientsWithoutActionQuery,
  CommsRecipientsWithActionQuery,
  RecipientId,
  RecipientWithOutcome,
  LogCommunicationEventBody,
  LogBulkCommunicationEventsBody,
  AppendResult,
  AppendBulkResult,
} from "../types/comms"

/**
 * Communications namespace for sending notifications and managing user communications
 */
export namespace comms {
  
  /**
   * Public: Get VAPID public key used for Web Push subscriptions.
   * GET /public/collection/:collectionId/comm/push/vapidPublicKey
   * Note: Key may be global; path is collection-scoped for consistency.
   */
  export async function getPushVapidPublicKey(
    collectionId: string
  ): Promise<import("../types/comms").PushVapidResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/push/vapidPublicKey`
    return request<import("../types/comms").PushVapidResponse>(path)
  }

  /**
   * Public: Register a Web Push subscription under unified comms.
   * POST /public/collection/:collectionId/comm/push/register
   */
  export async function registerPush(
    collectionId: string,
    body: import("../types/comms").RegisterPushMethodRequest
  ): Promise<import("../types/comms").PushSubscribeResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/push/register`
    return post<import("../types/comms").PushSubscribeResponse>(path, body)
  }

  // Admin Comms Settings

  /**
   * Admin: Get current comms settings for a collection.
   * GET /admin/collection/:collectionId/comm.settings
   * Optional query: includeSecret=true to include unsub.secret in response.
   */
  export async function getSettings(
    collectionId: string,
    opts: { includeSecret?: boolean } = {}
  ): Promise<import("../types/comms").CommsSettingsGetResponse> {
    const params = new URLSearchParams()
    if (opts.includeSecret) params.set('includeSecret', 'true')
    const qs = params.toString() ? `?${params.toString()}` : ''
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm.settings${qs}`
    return request<import("../types/comms").CommsSettingsGetResponse>(path)
  }

  /**
   * Admin: Patch comms settings for a collection.
   * PATCH /admin/collection/:collectionId/comm.settings
   */
  export async function patchSettings(
    collectionId: string,
    body: import("../types/comms").CommsSettingsPatchBody
  ): Promise<import("../types/comms").CommsSettingsGetResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm.settings`
    return patch<import("../types/comms").CommsSettingsGetResponse>(path, body)
  }

  /**
   * Public: Fetch configured topics for a collection.
   * GET /public/collection/:collectionId/comm/topics
   */
  export async function getPublicTopics(
    collectionId: string
  ): Promise<import("../types/comms").CommsPublicTopicsResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/topics`
    return request<import("../types/comms").CommsPublicTopicsResponse>(path)
  }

  /**
   * Public: Unsubscribe a contact from a category or channel.
   * GET /public/collection/:collectionId/comm/unsubscribe
   */
  export async function unsubscribe(
    collectionId: string,
    query: import("../types/comms").UnsubscribeQuery
  ): Promise<import("../types/comms").UnsubscribeResponse> {
    const params = new URLSearchParams()
    params.set('contactId', query.contactId)
    if (query.topic) params.set('topic', query.topic)
    if (query.channel) params.set('channel', query.channel)
    if (query.token) params.set('token', query.token)
    const qs = `?${params.toString()}`
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/unsubscribe${qs}`
    return request<import("../types/comms").UnsubscribeResponse>(path)
  }

  /**
   * Public: Upsert default consent for a contact.
   * POST /public/collection/:collectionId/comm/consent
   */
  export async function upsertConsent(
    collectionId: string,
    body: import("../types/comms").CommsConsentUpsertRequest
  ): Promise<{ ok: true }> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/consent`
    return post<{ ok: true }>(path, body)
  }

  /**
   * Public: Upsert preferences for a specific subject (or default if subject omitted).
   * POST /public/collection/:collectionId/comm/preferences
   */
  export async function upsertPreferences(
    collectionId: string,
    body: import("../types/comms").CommsPreferencesUpsertRequest
  ): Promise<{ ok: true }> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/preferences`
    return post<{ ok: true }>(path, body)
  }

  /**
   * Public: Subscribe/unsubscribe contact to a subject.
   * POST /public/collection/:collectionId/comm/subscribe
   */
  export async function subscribe(
    collectionId: string,
    body: import("../types/comms").CommsSubscribeRequest
  ): Promise<import("../types/comms").CommsSubscribeResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/subscribe`
    return post<import("../types/comms").CommsSubscribeResponse>(path, body)
  }

  /**
   * Public: Check subscription status for a subject.
   * GET /public/collection/:collectionId/comm/subscription/check
   */
  export async function checkSubscription(
    collectionId: string,
    query: import("../types/comms").CommsSubscriptionCheckQuery
  ): Promise<import("../types/comms").CommsSubscriptionCheckResponse> {
    const params = new URLSearchParams()
    params.set('contactId', query.contactId)
    params.set('subjectType', query.subjectType)
    params.set('subjectId', query.subjectId)
    if (query.productId) params.set('productId', String(query.productId))
    const qs = `?${params.toString()}`
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/subscription/check${qs}`
    return request<import("../types/comms").CommsSubscriptionCheckResponse>(path)
  }

  /**
   * Public: List registered contact methods.
   * GET /public/collection/:collectionId/comm/methods
   */
  export async function listMethods(
    collectionId: string,
    query: import("../types/comms").CommsListMethodsQuery
  ): Promise<import("../types/comms").CommsListMethodsResponse> {
    const params = new URLSearchParams()
    params.set('contactId', query.contactId)
    if (query.type) params.set('type', query.type)
    const qs = `?${params.toString()}`
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/methods${qs}`
    return request<import("../types/comms").CommsListMethodsResponse>(path)
  }

  /**
   * Public: Register email method for a contact.
   * POST /public/collection/:collectionId/comm/email/register
   */
  export async function registerEmail(
    collectionId: string,
    body: import("../types/comms").RegisterEmailMethodRequest
  ): Promise<import("../types/comms").RegisterMethodResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/email/register`
    return post<import("../types/comms").RegisterMethodResponse>(path, body)
  }

  /**
   * Public: Register SMS method for a contact.
   * POST /public/collection/:collectionId/comm/sms/register
   */
  export async function registerSms(
    collectionId: string,
    body: import("../types/comms").RegisterSmsMethodRequest
  ): Promise<import("../types/comms").RegisterMethodResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/sms/register`
    return post<import("../types/comms").RegisterMethodResponse>(path, body)
  }

  /**
   * Public: Resolve contacts for a subject with identity hints.
   * POST /public/collection/:collectionId/comm/subscriptions/resolve
   */
  export async function resolveSubscriptions(
    collectionId: string,
    body: import("../types/comms").SubscriptionsResolveRequest
  ): Promise<import("../types/comms").SubscriptionsResolveResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/comm/subscriptions/resolve`
    return post<import("../types/comms").SubscriptionsResolveResponse>(path, body)
  }

  /**
   * Analytics: Query communication events by user or contact.
   * POST /admin/collection/:collectionId/comm/query/by-user
   */
  export async function queryByUser(
    collectionId: string,
    body: CommsQueryByUser = {}
  ): Promise<CommunicationEvent[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/by-user`
    return post<CommunicationEvent[]>(path, body)
  }

  /**
   * Analytics: Recipient IDs for a communication source.
   * POST /admin/collection/:collectionId/comm/query/recipient-ids
   */
  export async function queryRecipientIds(
    collectionId: string,
    body: CommsRecipientIdsQuery
  ): Promise<RecipientId[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/recipient-ids`
    return post<RecipientId[]>(path, body)
  }

  /**
   * Analytics: Recipients who did not perform an action.
   * POST /admin/collection/:collectionId/comm/query/recipients/without-action
   */
  export async function queryRecipientsWithoutAction(
    collectionId: string,
    body: CommsRecipientsWithoutActionQuery
  ): Promise<RecipientId[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/recipients/without-action`
    return post<RecipientId[]>(path, body)
  }

  /**
   * Analytics: Recipients who performed an action, optionally with outcome.
   * POST /admin/collection/:collectionId/comm/query/recipients/with-action
   */
  export async function queryRecipientsWithAction(
    collectionId: string,
    body: CommsRecipientsWithActionQuery
  ): Promise<RecipientId[] | RecipientWithOutcome[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/query/recipients/with-action`
    return post<RecipientId[] | RecipientWithOutcome[]>(path, body)
  }

  /**
   * Logging: Append a single communication event.
   * POST /admin/collection/:collectionId/comm/log
   */
  export async function logCommunicationEvent(
    collectionId: string,
    body: LogCommunicationEventBody
  ): Promise<AppendResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/log`
    return post<AppendResult>(path, body)
  }

  /**
   * Logging: Append many communication events for a list of IDs.
   * POST /admin/collection/:collectionId/comm/log/bulk
   */
  export async function logBulkCommunicationEvents(
    collectionId: string,
    body: LogBulkCommunicationEventsBody | ({ sourceId: string; ids: string[]; idField?: 'userId'|'contactId'; [k: string]: any })
  ): Promise<AppendBulkResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/log/bulk`
    return post<AppendBulkResult>(path, body)
  }
}