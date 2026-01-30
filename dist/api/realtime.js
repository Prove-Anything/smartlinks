// src/api/realtime.ts
import { request } from "../http";
/**
 * Real-Time Communications API
 *
 * Provides access to real-time communication channels using Ably.
 * Supports both public (user-scoped) and admin tokens for different permission levels.
 *
 * Channel Patterns:
 * - With appId: collection:{collectionId}:app:{appId}:*
 * - Without appId: collection:{collectionId}:*
 *
 * @example
 * ```ts
 * import { realtime } from '@proveanything/smartlinks'
 *
 * // Get token for public user
 * const tokenRequest = await realtime.getPublicToken({
 *   collectionId: 'abc123',
 *   appId: 'xyz789'
 * })
 *
 * // Initialize Ably client
 * const ably = new Ably.Realtime.Promise({
 *   authCallback: async (data, callback) => {
 *     callback(null, tokenRequest)
 *   }
 * })
 *
 * // Subscribe to a channel
 * const channel = ably.channels.get('collection:abc123:app:xyz789:chat:room-1')
 * await channel.subscribe((message) => {
 *   console.log('Received:', message.data)
 * })
 *
 * // Publish a message
 * await channel.publish('message', { text: 'Hello!', userId: '123' })
 * ```
 */
/**
 * Get an Ably token for public (user-scoped) real-time communication.
 *
 * This endpoint returns an Ably TokenRequest that can be used to initialize an Ably client
 * with appropriate permissions for the specified collection and optional app.
 *
 * Requires user authentication (Bearer token).
 *
 * @param params - Token request parameters
 * @param params.collectionId - The collection scope (required)
 * @param params.appId - Optional app scope for more specific permissions
 * @returns Ably TokenRequest that can be used with Ably.Realtime client
 *
 * @example
 * ```ts
 * const tokenRequest = await realtime.getPublicToken({
 *   collectionId: 'my-collection-id',
 *   appId: 'my-app-id'
 * })
 *
 * // Use with Ably
 * const ably = new Ably.Realtime.Promise({
 *   authCallback: async (data, callback) => {
 *     callback(null, tokenRequest)
 *   }
 * })
 *
 * // Subscribe to channels matching the pattern
 * const channel = ably.channels.get('collection:my-collection-id:app:my-app-id:chat:general')
 * await channel.subscribe('message', (msg) => console.log(msg.data))
 * ```
 */
export async function getPublicToken(params) {
    const queryParams = new URLSearchParams();
    queryParams.append('collectionId', params.collectionId);
    if (params.appId) {
        queryParams.append('appId', params.appId);
    }
    return request(`/api/public/push/token?${queryParams.toString()}`);
}
/**
 * Get an Ably token for admin real-time communication.
 *
 * This endpoint returns an Ably TokenRequest that can be used to initialize an Ably client
 * with admin permissions to receive system notifications and alerts.
 *
 * Admin users get subscribe-only (read-only) access to the interaction:{userId} channel pattern.
 *
 * Requires admin authentication (Bearer token).
 *
 * @returns Ably TokenRequest that can be used with Ably.Realtime client
 *
 * @example
 * ```ts
 * const tokenRequest = await realtime.getAdminToken()
 *
 * // Use with Ably
 * const ably = new Ably.Realtime.Promise({
 *   authCallback: async (data, callback) => {
 *     callback(null, tokenRequest)
 *   }
 * })
 *
 * // Subscribe to admin interaction channel
 * const userId = 'my-user-id'
 * const channel = ably.channels.get(`interaction:${userId}`)
 * await channel.subscribe((message) => {
 *   console.log('Admin notification:', message.data)
 * })
 * ```
 */
export async function getAdminToken() {
    return request('/api/admin/auth/push');
}
