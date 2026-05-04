// src/types/auth.ts
// Auth-related request/response type shapes used by the SDK.

export interface UserAccountRegistrationRequest {
  /** User's display name */
  name: string
  /** Optional user email */
  email?: string
  /** Optional user phone number */
  phone?: string
  /** Optional password for email login */
  password?: string
  /** Send confirmation email after registration */
  sendAccountConfirmation?: boolean
  /** Optional collection context for registration */
  collectionId?: string,
  /** Desired token type returned */
  tokenType?: 'bearer' | 'firebase'
}

export interface AuthLocation {
  latitude?: number
  longitude?: number
  area?: number
  country?: string
  [key: string]: any
}

export interface AuthLocationCacheOptions {
  cache?: 'session' | false
  ttlMs?: number
  storageKey?: string
  forceRefresh?: boolean
}

export interface AccountFirebaseInfo {
  identities?: Record<string, string[]>
  sign_in_provider?: string
  [key: string]: any
}

export interface AccountClientInfo {
  createdAt?: string
  createdVia?: string
  [key: string]: any
}

export interface AccountFeatureFlags {
  actionLogger?: boolean
  apiKeys?: boolean
  analytics?: boolean
  webhooks?: boolean
  creating?: boolean
  helpDocs?: boolean
  certificateTemplates?: boolean
  contentLibrary?: boolean
  devScanner?: boolean
  appScanner?: boolean
  [key: string]: boolean | undefined
}

export interface AccountInfoResponse {
  id: string
  uid: string
  userId: string
  user_id?: string
  sub: string
  name: string
  email: string
  email_verified: boolean
  picture?: string | null
  iss: string
  aud?: string
  auth_time: number
  iat: number
  exp?: number
  firebase?: AccountFirebaseInfo
  accessType?: string
  clientType?: string
  analyticsCode?: string
  analyticsId?: string
  baseCollectionId?: string
  collectionGroup?: string
  contactId?: string
  features: AccountFeatureFlags
  adminCollections?: string[]
  clients?: Record<string, AccountClientInfo>
  sites?: Record<string, boolean>
  whitelabel?: Record<string, any>
  location?: AuthLocation | null
  prefs?: Record<string, any>
  [key: string]: any
}
