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
  /**
   * True when this login created a brand-new account. Currently only populated by
   * the Apple login endpoint; left undefined by the other AuthKit login endpoints.
   */
  isNewUser?: boolean
  /**
   * Session token expiry, in **milliseconds since epoch** (not seconds, not a duration),
   * or null when the server could not decode it. Currently only populated by the Apple
   * login endpoint.
   */
  expiresAt?: number | null
  /**
   * Opaque, single-use refresh token. **Native clients only** — present only when the
   * request opted in via `initializeApi({ platform: 'native' })` (or the
   * `X-Client-Platform: native` header). For native logins, `token` above is the
   * short-lived access token; pair it with this refresh token. Undefined for web.
   */
  refreshToken?: string
  /**
   * Absolute expiry of the refresh-token family, in **milliseconds since epoch**.
   * Fixed at login — it does **not** move when the token is rotated. Native only.
   */
  refreshTokenExpiresAt?: number
}

/**
 * Response from {@link authKit.refreshToken}. The `refreshToken` is **rotated** on every
 * call — persist the new value and discard the old one before refreshing again.
 */
export interface RefreshResponse {
  /** New short-lived access token (a `SL.` bearer JWT). */
  token: string
  /** Rotated refresh token — replace the stored value with this. */
  refreshToken: string
  /** Absolute family expiry (ms epoch). Unchanged across rotations. */
  refreshTokenExpiresAt: number
  /** New access-token expiry (ms epoch). */
  expiresAt: number
  user: AuthKitUser
  accountData?: Record<string, any>
}

/** Response from {@link authKit.logout}. Idempotent — always `{ success: true }`. */
export interface LogoutResponse {
  success: true
}

/**
 * Server-defined error codes for the refresh/logout flow, surfaced via
 * `SmartlinksApiError.errorCode`.
 *
 * - `MISSING_REFRESH_TOKEN` (400) — programming error; no token sent.
 * - `INVALID_REFRESH_TOKEN` (401) — unknown / expired / revoked / wrong client → `logout()` + route to login.
 * - `REFRESH_TOKEN_REUSE_DETECTED` (401) — a consumed token was replayed; the **entire session
 *   family was revoked server-side**. Hard logout: clear storage, force re-login.
 */
export type RefreshErrorCode =
  | 'MISSING_REFRESH_TOKEN'
  | 'INVALID_REFRESH_TOKEN'
  | 'REFRESH_TOKEN_REUSE_DETECTED'

/**
 * Options for {@link authKit.appleLogin}. All fields are optional — only the
 * `identityToken` (passed as a positional argument) is required by the server.
 */
export interface AppleLoginOptions {
  /** Apple authorization code. Accepted but ignored by the server for now (reserved for future server-side token exchange). */
  authorizationCode?: string
  /**
   * The **raw** nonce the client generated, if nonce binding was used. The server
   * accepts either `token.nonce === nonce` (native) or `token.nonce === sha256hex(nonce)` (web).
   */
  nonce?: string
  /**
   * Name/email from Apple's **first** authorization callback only — Apple never returns
   * these again, and never inside the token. Forwarded so the server can persist the
   * display name on first account creation. Treated as untrusted (never used for identity).
   */
  userInfo?: { email?: string; name?: string }
  /**
   * A previously-issued trusted-device token (from a prior MFA `challenge/verify`
   * or `challenge/recovery-code` response). If still valid, the server skips any
   * step-up challenge for this login. See `SDK_AUTHKIT_MFA_UPDATE.md` §3.
   */
  trustedDeviceToken?: string
}

/**
 * Server-defined error codes returned by AuthKit federated-login endpoints
 * (Apple + Google). Surfaced via `SmartlinksApiError.errorCode`. The
 * `ACCOUNT_EXISTS_UNVERIFIED` case also carries `requiresEmailVerification: true`
 * in `SmartlinksApiError.details`.
 */
export type AuthKitErrorCode =
  | 'MISSING_APPLE_TOKEN'         // 400 — identityToken absent from the body
  | 'APPLE_AUTH_NOT_CONFIGURED'   // 400 — client has no appleClientIds configured
  | 'INVALID_APPLE_TOKEN'         // 401 — signature / issuer / audience / expiry / nonce check failed
  | 'ACCOUNT_EXISTS_UNVERIFIED'   // 409 — an unverified account already owns this email (Apple OR Google)
  | 'APPLE_AUTH_FAILED'           // 500 — unexpected server error

/* ===================================
 * Step-up MFA (Phase 1: email OTP, SMS OTP, recovery codes)
 *
 * The gate applies to every login method that issues a session: login, googleLogin,
 * appleLogin, verifyPhoneCode, verifyMagicLink, and exchangeWhatsAppSession. It does NOT
 * apply to register() (a brand-new user has no enrolled factors to challenge against) or
 * verifyWhatsApp() (that endpoint only confirms a code — it never issues a session, so
 * there's nothing to gate). WhatsApp OTP, TOTP, and passkeys as *factors* are deferred to
 * a later phase.
 * =================================== */

/**
 * Details carried on the `MFA_REQUIRED` error thrown by any session-issuing login method
 * (see the gate list above) when the client's MFA policy requires a step-up. Surfaced as
 * `err.details` (or `err.errorResponse.details`) on the `SmartlinksApiError` — the login
 * method never resolves in this case, it throws a 403 instead.
 */
export interface MfaRequiredDetails {
  /** Short-lived (10 min) and single-use. Pass it to every challenge/finalize call below. */
  mfaSessionToken: string
  /** Only factors the user actually enrolled. */
  availableFactors: Array<'email' | 'sms'>
  /** `sms` is preferred over `email` when both are enrolled. */
  preferredFactor: 'email' | 'sms'
  maskedDestinations: { email?: string; sms?: string }
}

/** Response from {@link authKit.mfaChallengeSend}. */
export interface MfaChallengeSendResponse {
  success: true
  factor: 'email' | 'sms'
  /** Masked, e.g. `"j***@x.com"` or `"+1******1234"`. */
  destination: string
  /** ISO timestamp, 10 minutes from send. */
  expiresAt: string
}

/**
 * Response from {@link authKit.mfaChallengeVerify} / {@link authKit.mfaRecoveryCode}.
 * Same shape as a normal login response, plus trusted-device fields when the caller sent
 * `trustDevice: true`.
 */
export interface MfaFinalizeResponse extends AuthLoginResponse {
  /**
   * Present only when the challenge was completed with `trustDevice: true`. Persist it
   * alongside the refresh token (same secure storage) and send it as `trustedDeviceToken`
   * on future calls to any gated login method ({@link authKit.login},
   * {@link authKit.googleLogin}, {@link authKit.appleLogin}, {@link authKit.verifyPhoneCode},
   * {@link authKit.verifyMagicLink}, {@link authKit.exchangeWhatsAppSession}) to skip the
   * challenge on this device — it isn't tied to which method the user challenged through.
   */
  trustedDeviceToken?: string
  trustedDeviceExpiresAt?: string
}

/** Response from {@link authKit.enrollEmailMfa} / {@link authKit.enrollSmsMfa}. */
export interface MfaEnrollSendResponse {
  mfaSessionToken: string
  destination: string
  expiresAt: string
}

/** Response from {@link authKit.confirmEmailMfa} / {@link authKit.confirmSmsMfa}. */
export interface MfaEnrolledResponse {
  enrolled: true
  factor: 'email' | 'sms'
}

/** Response from {@link authKit.getMfaFactors}. */
export interface MfaFactorsResponse {
  enrolledFactors: {
    email?: { enrolledAt: string; destination: string }
    sms?: { enrolledAt: string; destination: string }
  }
  recoveryCodesRemaining: number
  mfaEnabledForClient: boolean
}

/** One entry from {@link authKit.listTrustedDevices}. */
export interface TrustedDevice {
  id: string
  label: string | null
  createdAtMs: number
  lastUsedAtMs: number
  expiresAtMs: number
}

/**
 * Server-defined error codes for the step-up MFA flow, surfaced via
 * `SmartlinksApiError.errorCode`.
 *
 * - `MFA_REQUIRED` (403) — from any session-issuing login method; see {@link MfaRequiredDetails}.
 * - `INVALID_MFA_CODE` (401) — wrong code; let the user retry (attempts are capped, see next).
 * - `MFA_TOO_MANY_ATTEMPTS` (429) — 5 wrong attempts; the challenge is burned, restart from `login()`.
 * - `MFA_FACTOR_NOT_ENROLLED` (400) — requested factor isn't enrolled (or disabled for the
 *   client) — a programming error if the UI only offers `availableFactors`.
 * - `MFA_SESSION_EXPIRED` (401) — `mfaSessionToken` past its 10-minute TTL; restart from `login()`.
 * - `MFA_SESSION_INVALID` (401) — unknown/wrong-client/already-consumed token, or (on enroll
 *   confirm) mismatched user; restart the enroll/challenge flow.
 * - `RECOVERY_CODE_INVALID` (401) — wrong or already-used recovery code.
 */
export type MfaErrorCode =
  | 'MFA_REQUIRED'
  | 'INVALID_MFA_CODE'
  | 'MFA_TOO_MANY_ATTEMPTS'
  | 'MFA_FACTOR_NOT_ENROLLED'
  | 'MFA_SESSION_EXPIRED'
  | 'MFA_SESSION_INVALID'
  | 'RECOVERY_CODE_INVALID'

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

/**
 * Response from {@link authKit.completePasswordReset}.
 *
 * For a **plain password reset**, or an invite accepted under `verify-manual-login`,
 * the server returns only `success` + `message` and the user is sent to the login screen.
 *
 * For **invite acceptance under `verify-auto-login`** (the default), the server also
 * completes email verification and returns a full session — `token`, `user`, and
 * `accountData` — so the user can be logged straight in, mirroring
 * {@link EmailVerifyTokenResponse}. The native-only fields are populated when the request
 * opted in via `initializeApi({ platform: 'native' })` (the `X-Client-Platform: native`
 * header). Every session field is therefore optional.
 */
export interface PasswordResetCompleteResponse {
  success: boolean
  message: string
  /** Session token (a `SL.` bearer JWT). Present only on invite auto-login. Adopt it and skip the login screen. */
  token?: string
  /** The authenticated user. Present only when a `token` is returned. `emailVerified` is `true` once completion verifies the invite. */
  user?: AuthKitUser
  /** The `clients[clientId]` account-data slice, or `null`. Present only when a `token` is returned. */
  accountData?: Record<string, any> | null
  /** Configured verification mode echoed back; auto-login only occurs for `verify-auto-login`. */
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
  /** Opaque, single-use refresh token. **Native clients only** — pairs with the short-lived `token`. */
  refreshToken?: string
  /** Absolute expiry of the refresh-token family, in **ms since epoch**. Native only. */
  refreshTokenExpiresAt?: number
  /** Access-token expiry, in **ms since epoch**. Native only. */
  expiresAt?: number
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

