// src/types/realtime.ts

/**
 * Request parameters for obtaining a realtime token.
 */
export interface RealtimeTokenRequest {
  /** Required - the collection scope */
  collectionId: string
  /** Optional - scope to specific app */
  appId?: string
}

/**
 * Ably token request response for real-time communications.
 * This token can be used to initialize an Ably client with appropriate permissions.
 */
export interface AblyTokenRequest {
  /** Ably key name */
  keyName: string
  /** Token time-to-live in milliseconds */
  ttl: number
  /** Request timestamp */
  timestamp: number
  /** JSON string of channel permissions */
  capability: string
  /** Random nonce */
  nonce: string
  /** Message authentication code */
  mac: string
  /** Client identifier: "collectionId:userId:appId?" */
  clientId: string
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
export type RealtimeChannelPattern = string

// ---------------------------------------------------------------------------------------------------
// SmartLinks Realtime (realtime.channel / onChange / onMine) — docs/realtime.md
// ---------------------------------------------------------------------------------------------------

/** Where a realtime listener lives: the collection, and (for app channels) the app. */
export interface RealtimeScope {
  collectionId: string
  appId?: string
}

/** A message on a channel. `channel` is the logical name ("draw", "feed:admin"). */
export interface RealtimeMessage {
  channel: string
  event: string
  data: unknown
  /** When it was sent (ms since epoch), when known. */
  at?: number
}

/** "This changed" — ids only; refetch through the normal API. */
export interface RealtimeChangeEvent {
  /** 'product' | 'proof' | 'asset' | 'record' | 'collection' | 'collection.apps' | 'settings' | … */
  type: string
  id?: string
  appId?: string
  recordType?: string
  productId?: string
  proofId?: string
  /** 'created' | 'updated' | 'deleted' (records) or 'create' | 'update' | 'delete' (products, proofs…) */
  status?: string
  at: number
}

/** Which changes to hear about — every field given must match. */
export interface RealtimeChangeFilter {
  type?: string
  id?: string
  appId?: string
  recordType?: string
  productId?: string
  proofId?: string
}

/** A channel an app declares in its manifest (`realtime.channels`). */
export interface RealtimeChannelDeclaration {
  /** Lowercase letters, numbers, - and _; up to 40 characters. */
  name: string
  /** Who may listen. Default 'admin'. */
  subscribe?: "public" | "signedIn" | "admin"
  /** Who may send: those levels, or 'server' (only the app's server functions). Default 'server'. */
  publish?: "public" | "signedIn" | "admin" | "server"
}
