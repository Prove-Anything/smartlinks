// Types for the AuthKit API


export interface AuthKitUser {
  uid: string
  email?: string
  displayName?: string | null
  photoURL?: string | null
  phoneNumber?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}

// User profile mirrors AuthKitUser (kept separate for future divergence)
export interface UserProfile {
  uid: string
  email?: string
  displayName?: string | null
  phoneNumber?: string | null
  photoURL?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}

export interface ProfileUpdateData {
  displayName?: string
  photoURL?: string
  accountData?: Record<string, any>
}

export interface UpdateProfileResponse extends UserProfile {
  token: string
}

export interface SuccessResponse {
  success: boolean
  message?: string
  token?: string // some flows may return a refreshed token
}

export interface AuthLoginResponse {
  token?: string
  user: AuthKitUser
  accountData?: Record<string, any>
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
  requiresEmailVerification?: boolean  // True if email verification is required but not yet completed
  emailVerificationDeadline?: number   // Unix timestamp - for 'immediate' mode grace period deadline
  accountLocked?: boolean              // True if account is locked due to expired verification deadline
}

export interface MagicLinkSendResponse {
  success: boolean
  message: string
}

export interface MagicLinkVerifyResponse extends AuthLoginResponse {}

export interface PhoneSendCodeResponse {
  verificationId: string
  message: string
}

export interface PhoneVerifyResponse {
  token: string
  user: AuthKitUser
}

export interface PasswordResetRequestResponse {
  success: boolean
  message: string
}

export interface VerifyResetTokenResponse {
  valid: boolean
  email?: string
  expiresAt?: number
  message?: string
}

export interface PasswordResetCompleteResponse {
  success: boolean
  message: string
}

export interface EmailVerificationActionResponse {
  success: boolean
  message: string
}

export interface EmailVerifyTokenResponse {
  success: boolean
  message: string
  token?: string
  user?: AuthKitUser
  accountData?: Record<string, any>           
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'  
}

export type VerifyStatus = 'pending' | 'verified' | 'failed' | 'expired' | 'unknown'

export interface WhatsAppReplyCta {
  body: string
  buttonLabel: string
  buttonUrl: string
  mediaUrl?: string  // optional image (JPEG/PNG, public https) — selects image card template
}

export interface WhatsAppReplyOptions {
  /** Option A: explicit Twilio Content SID */
  contentSid?: string
  contentVariables?: Record<string, unknown>

  /** Option B: CTA shorthand (uses shared generic CTA content SID) */
  cta?: WhatsAppReplyCta

  /** Option C: plain-text fallback */
  text?: string
}

export interface WhatsAppContactData {
  name?: string
  firstName?: string
  lastName?: string
  displayName?: string
  email?: string
  source?: string
  customFields?: Record<string, unknown>
  externalIds?: Record<string, unknown>
}

export interface SendWhatsAppRequest {
  redirectUrl?: string
  prefillMessage?: string
  reply?: WhatsAppReplyOptions
  contactData?: WhatsAppContactData
}

export interface SendWhatsAppResponse {
  waLink: string
  code: string
  token: string
  sessionKey?: string
  expiresAt: string
}

export interface ExchangeWhatsAppSessionResponse {
  success: boolean
  token: string
  user: AuthKitUser
  accountData?: Record<string, any>
}

export interface VerifyWhatsAppResponse {
  success: boolean
  verified: boolean
  redirectUrl?: string | null
}

export interface WhatsAppStatusResponse {
  ok: boolean
  status: VerifyStatus
  verified: boolean
  redirectUrl?: string | null
  phoneNumber?: string | null
  updatedAt?: unknown
}

export interface SendSmsVerifyRequest {
  phoneNumber: string
  redirectUrl: string
  ctaText?: string
}

export interface SendSmsVerifyResponse {
  success: boolean
  expiresAt: string
}

export interface VerifySmsResponse {
  verified: boolean
  redirectUrl?: string | null
  phoneNumber?: string | null
}

export interface UpsertContactRequest {
  collectionId?: string
  phone?: string
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  displayName?: string
  source?: string
  customFields?: Record<string, unknown>
  externalIds?: Record<string, unknown>
}

export interface UpsertContactResponse {
  ok: boolean
  collectionId: string
  contactId: string
  userId: string | null
  created: boolean
}

export interface AuthKitBrandingConfig {
  logoUrl?: string
  title?: string
  subtitle?: string
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  buttonStyle?: string
  fontFamily?: string
}

export interface AuthKitConfig {
  id: string
  branding?: AuthKitBrandingConfig
  enabledProviders?: string[]
  customCss?: string
  termsUrl?: string
  privacyUrl?: string
  supportEmail?: string
  redirectUrl?: string
  updatedAt?: string
}

