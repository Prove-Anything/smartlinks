// src/types/auth.ts
// Auth-related request/response type shapes used by the SDK.

export type UserAccountRegistrationRequest = {
  name: string
  email?: string
  phone?: string
  password?: string
  sendAccountConfirmation?: boolean
  collectionId?: string,
  tokenType?: 'bearer' | 'firebase'
}
