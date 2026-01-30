/**
 * Request parameters for obtaining a realtime token.
 */
export interface RealtimeTokenRequest {
    /** Required - the collection scope */
    collectionId: string;
    /** Optional - scope to specific app */
    appId?: string;
}
/**
 * Ably token request response for real-time communications.
 * This token can be used to initialize an Ably client with appropriate permissions.
 */
export interface AblyTokenRequest {
    /** Ably key name */
    keyName: string;
    /** Token time-to-live in milliseconds */
    ttl: number;
    /** Request timestamp */
    timestamp: number;
    /** JSON string of channel permissions */
    capability: string;
    /** Random nonce */
    nonce: string;
    /** Message authentication code */
    mac: string;
    /** Client identifier: "collectionId:userId:appId?" */
    clientId: string;
}
/**
 * Channel patterns for real-time communications:
 *
 * With appId: collection:{collectionId}:app:{appId}:*
 * Examples:
 *   - collection:abc:app:xyz:chat:room-1
 *   - collection:abc:app:xyz:notifications:alerts
 *   - collection:abc:app:xyz:users:online
 *
 * Without appId: collection:{collectionId}:*
 * Examples:
 *   - collection:abc:events:updates
 *   - collection:abc:users:active
 */
export type RealtimeChannelPattern = string;
