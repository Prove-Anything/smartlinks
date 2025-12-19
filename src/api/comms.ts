// src/api/comms.ts
// Communications and notifications API for Smartlinks

import { post } from "../http"
import type { 
  SendNotificationRequest, 
  SendNotificationResponse,
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
  export async function sendNotification(
    collectionId: string,
    request: SendNotificationRequest
  ): Promise<SendNotificationResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/comm/notify`
    return post<SendNotificationResponse>(path, request)
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