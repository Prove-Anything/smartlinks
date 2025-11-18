// src/api/comms.ts
// Communications and notifications API for Smartlinks

import { post } from "../http"
import type { 
  SendNotificationRequest, 
  SendNotificationResponse 
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
}