// src/types/auth.ts
// Auth-related request/response type shapes used by the SDK.

export type UserAccountRegistrationRequest = {
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
