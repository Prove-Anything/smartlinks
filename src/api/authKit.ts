import { request, post, put, del, requestWithOptions, setBearerToken, invalidateCache } from "../http"
import type {
  AuthLoginResponse,
  AppleLoginOptions,
  RefreshResponse,
  LogoutResponse,
  PhoneSendCodeResponse,
  PhoneVerifyResponse,
  PasswordResetRequestResponse,
  VerifyResetTokenResponse,
  PasswordResetCompleteResponse,
  EmailVerificationActionResponse,
  EmailVerifyTokenResponse,
  AuthKitConfig,
  AuthKitConfigInput,
  MagicLinkSendResponse,
  MagicLinkVerifyResponse,
  UserProfile,
  UpdateProfileResponse,
  ProfileUpdateData,
  SuccessResponse,
  SendWhatsAppRequest,
  SendWhatsAppResponse,
  ExchangeWhatsAppSessionResponse,
  VerifyWhatsAppResponse,
  WhatsAppStatusResponse,
  SendSmsVerifyRequest,
  SendSmsVerifyResponse,
  VerifySmsResponse,
  UpsertContactRequest,
  UpsertContactResponse,
  MfaChallengeSendResponse,
  MfaFinalizeResponse,
  MfaEnrollSendResponse,
  MfaEnrolledResponse,
  MfaFactorsResponse,
  TrustedDevice,
} from "../types/authKit"

/**
 * Namespace containing helper functions for the new AuthKit API.
 * Legacy collection-based authKit helpers retained (marked as *Legacy*).
 */
export namespace authKit {
 

  /* ===================================
   * Authentication (Per client)
   * =================================== */

  /**
   * Login with email + password (public).
   *
   * When the client's MFA policy requires a step-up, the server returns **403
   * `MFA_REQUIRED`** instead of a session — `login()` throws a `SmartlinksApiError` with
   * `err.errorResponse?.errorCode === 'MFA_REQUIRED'` and the challenge details in
   * `err.details` (see {@link MfaRequiredDetails}). Route the caller to
   * {@link mfaChallengeSend} on that error; this method's return type is unchanged.
   *
   * @param trustedDeviceToken - Optional. If a previous MFA challenge on this device
   *   returned one (via {@link mfaChallengeVerify}/{@link mfaRecoveryCode} with
   *   `trustDevice: true`), pass it here to skip the challenge entirely as long as it's
   *   still valid. If it's revoked/expired, the server silently falls back to requiring a
   *   fresh challenge — `login()` just returns `MFA_REQUIRED` again, no special handling.
   *
   * Security errors (thrown as `SmartlinksApiError`, see {@link LoginSecurityErrorCode}):
   * - `ACCOUNT_TEMPORARILY_LOCKED` (429) — `err.details.retryAfterSeconds` says how long to wait.
   * - `PASSWORD_EXPIRED` (403) — `err.details.resetToken` is short-lived; route into
   *   {@link completePasswordReset} to change the password in place.
   */
  export async function login(clientId: string, email: string, password: string, trustedDeviceToken?: string): Promise<AuthLoginResponse> {
    const body: { email: string; password: string; trustedDeviceToken?: string } = { email, password }
    if (trustedDeviceToken) body.trustedDeviceToken = trustedDeviceToken
    const res = await post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/login`, body)
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /**
   * Register a new user (public).
   *
   * Not gated by step-up MFA — a brand-new user has no enrolled factors yet, so there's
   * nothing to challenge against.
   *
   * The new password is validated against the collection's `passwordPolicy` — may throw
   * a {@link PasswordPolicyErrorCode} (400). The same validation applies to
   * {@link completePasswordReset} and {@link changePassword}. Read the policy for a live
   * checklist from `authKit.load(clientId)` → `config.security.passwordPolicy`.
   */
  export async function register(clientId: string, data: { email: string; password: string; displayName?: string; accountData?: Record<string, any> }): Promise<AuthLoginResponse> {
    return post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/register`, data)
  }

  /**
   * Google OAuth login via ID token (public).
   *
   * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
   *
   * @param trustedDeviceToken - Optional. Pass a token previously returned by
   *   {@link mfaChallengeVerify}/{@link mfaRecoveryCode} (with `trustDevice: true`) to skip
   *   the challenge on this device, same as {@link login}.
   */
  export async function googleLogin(clientId: string, idToken: string, trustedDeviceToken?: string): Promise<AuthLoginResponse> {
    const res = await post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/google`, { idToken, trustedDeviceToken })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /** Google OAuth login via server-side authorization code (public). */
  export async function googleCodeLogin(clientId: string, code: string, redirectUri: string): Promise<AuthLoginResponse> {
    const res = await post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/google-code`, { code, redirectUri })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /**
   * Sign in with Apple via an Apple identity token (public).
   *
   * Mirrors {@link googleLogin}. On success the returned bearer token is stored
   * automatically and the cache is invalidated.
   *
   * Notable error codes (thrown as `SmartlinksApiError`, read via `err.errorCode`):
   * - `MISSING_APPLE_TOKEN` (400), `APPLE_AUTH_NOT_CONFIGURED` (400),
   *   `INVALID_APPLE_TOKEN` (401), `APPLE_AUTH_FAILED` (500)
   * - `ACCOUNT_EXISTS_UNVERIFIED` (409) — an unverified account already owns this
   *   email; the server refuses to silently link. `err.details.requiresEmailVerification`
   *   is `true`. Recoverable: the user should sign in with their password (or reset it),
   *   then link Apple from settings. **The same 409 can now come back from
   *   {@link googleLogin}** under the shared verified-to-verified linking policy.
   *
   * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape. Pass
   * `opts.trustedDeviceToken` to skip the challenge on a recognized device.
   *
   * @see AppleLoginOptions
   */
  export async function appleLogin(clientId: string, identityToken: string, opts?: AppleLoginOptions): Promise<AuthLoginResponse> {
    const body: { identityToken: string } & AppleLoginOptions = { identityToken, ...opts }
    const res = await post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/apple`, body)
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /* ===================================
   * Native session refresh (public)
   * =================================== */

  /**
   * Exchange a refresh token for a fresh access token (public — the refresh token IS
   * the credential). **Native sessions only**; refresh tokens are issued only when the
   * host opted in via `initializeApi({ platform: 'native' })`.
   *
   * On success the new access token is stored automatically (`setBearerToken`). The
   * returned `refreshToken` is **rotated** — the caller must persist it and discard the
   * old one before refreshing again.
   *
   * ⚠️ **Single-use, no retry, serialize calls.** This method issues exactly one request
   * and never retries: replaying a consumed refresh token triggers
   * `REFRESH_TOKEN_REUSE_DETECTED` (the whole session family is revoked). The caller is
   * responsible for ensuring only one refresh is in flight at a time (e.g. across tabs or
   * resume events).
   *
   * Errors (thrown as `SmartlinksApiError`, read via `err.errorCode`):
   * `MISSING_REFRESH_TOKEN` (400), `INVALID_REFRESH_TOKEN` (401),
   * `REFRESH_TOKEN_REUSE_DETECTED` (401) — the last two mean a hard logout.
   *
   * @see RefreshErrorCode
   */
  export async function refreshToken(clientId: string, refreshToken: string): Promise<RefreshResponse> {
    const res = await post<RefreshResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/refresh`, { refreshToken })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /**
   * Revoke a refresh token's entire family server-side (that device's whole rotation
   * chain) and clear the in-memory bearer token. Idempotent — always resolves to
   * `{ success: true }`, never revealing whether the token existed. Call on explicit
   * sign-out. Persisted tokens in the host's own storage must be cleared separately.
   */
  export async function logout(clientId: string, refreshToken: string): Promise<LogoutResponse> {
    const res = await post<LogoutResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/logout`, { refreshToken })
    setBearerToken(undefined)
    invalidateCache()
    return res
  }

  /** Send a magic link email to the user (public). */
  export async function sendMagicLink(clientId: string, data: { email: string; redirectUrl: string; accountData?: Record<string, any> }): Promise<MagicLinkSendResponse> {
    return post<MagicLinkSendResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/magic-link/send`, data)
  }

  /**
   * Verify a magic link token and authenticate/create the user (public).
   *
   * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
   *
   * @param trustedDeviceToken - Optional. See {@link login}.
   */
  export async function verifyMagicLink(clientId: string, token: string, trustedDeviceToken?: string): Promise<MagicLinkVerifyResponse> {
    const res = await post<MagicLinkVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/magic-link/verify`, { token, trustedDeviceToken })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /** Send phone verification code (public). */
  export async function sendPhoneCode(clientId: string, phoneNumber: string): Promise<PhoneSendCodeResponse> {
    return post<PhoneSendCodeResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/send-code`, { phoneNumber })
  }

  /**
   * Verify phone verification code (public).
   *
   * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
   *
   * @param trustedDeviceToken - Optional. See {@link login}.
   */
  export async function verifyPhoneCode(clientId: string, phoneNumber: string, code: string, trustedDeviceToken?: string): Promise<PhoneVerifyResponse> {
    const res = await post<PhoneVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/verify`, { phoneNumber, code, trustedDeviceToken })
    setBearerToken(res.token)
    invalidateCache()
    return res
  }

  /** Send a WhatsApp verification deep-link (public). */
  export async function sendWhatsApp(clientId: string, body: SendWhatsAppRequest = {}): Promise<SendWhatsAppResponse> {
    return post<SendWhatsAppResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/send`, body)
  }

  /**
   * Manually verify WhatsApp token if inbound webhook path is unavailable (legacy/public fallback).
   *
   * Not gated by step-up MFA — this endpoint only confirms the code, it never issues a
   * session/bearer token, so there is nothing to challenge. {@link exchangeWhatsAppSession}
   * is the WhatsApp method that's gated.
   */
  export async function verifyWhatsApp(clientId: string, token: string, phoneNumber: string): Promise<VerifyWhatsAppResponse> {
    return post<VerifyWhatsAppResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/verify`, { token, phoneNumber })
  }

  /** Poll WhatsApp verification status for a token (public). */
  export async function getWhatsAppStatus(clientId: string, token: string): Promise<WhatsAppStatusResponse> {
    const encodedToken = encodeURIComponent(token)
    return request<WhatsAppStatusResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/status?token=${encodedToken}`)
  }

  /**
   * Exchange a verified WhatsApp token for an Auth Kit session (public).
   *
   * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape. This is
   * the WhatsApp method that needs `trustedDeviceToken`, not {@link verifyWhatsApp} (which
   * never issues a session).
   *
   * @param trustedDeviceToken - Optional. See {@link login}.
   */
  export async function exchangeWhatsAppSession(clientId: string, token: string, sessionKey: string, trustedDeviceToken?: string): Promise<ExchangeWhatsAppSessionResponse> {
    const res = await post<ExchangeWhatsAppSessionResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/exchange-session`, { token, sessionKey, trustedDeviceToken })
    setBearerToken(res.token)
    invalidateCache()
    return res
  }

  /** Send an SMS click-to-verify link (public). */
  export async function sendSmsVerify(clientId: string, body: SendSmsVerifyRequest): Promise<SendSmsVerifyResponse> {
    return post<SendSmsVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/sms/send`, body)
  }

  /** Verify an SMS click-to-verify token via API (public). */
  export async function verifySms(clientId: string, token: string, phoneNumber?: string): Promise<VerifySmsResponse> {
    const payload: { token: string; phoneNumber?: string } = { token }
    if (phoneNumber) payload.phoneNumber = phoneNumber
    return post<VerifySmsResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/sms/verify`, payload)
  }

  /** Upsert contact identity after lightweight verification (public). */
  export async function upsertContact(clientId: string, body: UpsertContactRequest): Promise<UpsertContactResponse> {
    return post<UpsertContactResponse>(`/authkit/${encodeURIComponent(clientId)}/contact/upsert`, body)
  }

  /* ===================================
   * Password Reset (Public flows)
   * =================================== */
  export async function requestPasswordReset(clientId: string, data: { email: string; redirectUrl?: string; clientName?: string }): Promise<PasswordResetRequestResponse> {
    return post<PasswordResetRequestResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/reset-password`, data)
  }

  export async function verifyResetToken(clientId: string, token: string): Promise<VerifyResetTokenResponse> {
    return post<VerifyResetTokenResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/verify-reset-token`, { token })
  }

  /**
   * Complete a password reset / invite acceptance. On invite acceptance under
   * `verify-auto-login` the server returns a session — adopt it so the caller is logged
   * straight in (plain resets return no token and leave the bearer untouched).
   */
  export async function completePasswordReset(clientId: string, token: string, newPassword: string): Promise<PasswordResetCompleteResponse> {
    const res = await post<PasswordResetCompleteResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/complete-reset`, { token, newPassword })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /* ===================================
   * Email Verification
   * =================================== */
  export async function sendEmailVerification(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }): Promise<EmailVerificationActionResponse> {
    return post<EmailVerificationActionResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/send-verification`, data)
  }

  /** Verify an email token; under `verify-auto-login` the server returns a session — adopt it. */
  export async function verifyEmail(clientId: string, token: string): Promise<EmailVerifyTokenResponse> {
    const res = await post<EmailVerifyTokenResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/verify-email`, { token })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  export async function resendEmailVerification(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }): Promise<EmailVerificationActionResponse> {
    return post<EmailVerificationActionResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/resend-verification`, data)
  }

  /* ===================================
   * Account Management (Authenticated)
   * =================================== */
  export async function getProfile(clientId: string): Promise<UserProfile> {
    return request<UserProfile>(`/authkit/${encodeURIComponent(clientId)}/account/profile`)
  }

  /** Update the authenticated user's profile and replace the bearer token when refreshed claims are returned. */
  export async function updateProfile(clientId: string, data: ProfileUpdateData): Promise<UpdateProfileResponse> {
    const res = await post<UpdateProfileResponse>(`/authkit/${encodeURIComponent(clientId)}/account/update-profile`, data)
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  export async function changePassword(clientId: string, currentPassword: string, newPassword: string): Promise<SuccessResponse> {
    return post<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/account/change-password`, { currentPassword, newPassword })
  }

  export async function changeEmail(clientId: string, newEmail: string, password: string, redirectUrl: string): Promise<SuccessResponse> {
    return post<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/account/change-email`, { newEmail, password, redirectUrl })
  }

  export async function verifyEmailChange(clientId: string, token: string): Promise<SuccessResponse> {
    const res = await post<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/account/verify-email-change`, { token })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  export async function updatePhone(clientId: string, phoneNumber: string, verificationCode: string): Promise<SuccessResponse> {
    return post<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/account/update-phone`, { phoneNumber, verificationCode })
  }

  export async function deleteAccount(clientId: string, password: string, confirmText: string): Promise<SuccessResponse> {
    // DELETE with body using requestWithOptions since del() doesn't send body
    const path = `/authkit/${encodeURIComponent(clientId)}/account/delete`
    const res = await post<SuccessResponse>(path, { password, confirmText }) // If backend truly requires DELETE, switch to requestWithOptions
    return res
  }

  /* ===================================
   * Step-up MFA — completing a challenged login (public)
   *
   * Called after login() throws MFA_REQUIRED. mfaSessionToken is short-lived (10 min) and
   * single-use — burned on 5 failed attempts (MFA_TOO_MANY_ATTEMPTS) or on success.
   * challenge/send can be called again on the same token (while unexpired/unburned) to
   * switch factors or resend.
   * =================================== */

  /** Send (or resend) an MFA challenge code to the given factor (public). */
  export async function mfaChallengeSend(clientId: string, mfaSessionToken: string, factor: 'email' | 'sms'): Promise<MfaChallengeSendResponse> {
    return post<MfaChallengeSendResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/challenge/send`, { mfaSessionToken, factor })
  }

  /**
   * Verify an MFA challenge code and finalize the login (public). On success this behaves
   * like {@link login} — the bearer token is adopted and the cache invalidated.
   *
   * @param trustDevice - When `true`, the response includes `trustedDeviceToken` — persist
   *   it and pass it to future {@link login} calls to skip the challenge on this device.
   */
  export async function mfaChallengeVerify(clientId: string, mfaSessionToken: string, code: string, trustDevice?: boolean, deviceLabel?: string): Promise<MfaFinalizeResponse> {
    const res = await post<MfaFinalizeResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/challenge/verify`, { mfaSessionToken, code, trustDevice, deviceLabel })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /**
   * Finalize a challenged login using a single-use recovery code instead of a sent code
   * (public). Same finalize-session behaviour as {@link mfaChallengeVerify}.
   */
  export async function mfaRecoveryCode(clientId: string, mfaSessionToken: string, code: string, trustDevice?: boolean, deviceLabel?: string): Promise<MfaFinalizeResponse> {
    const res = await post<MfaFinalizeResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/challenge/recovery-code`, { mfaSessionToken, code, trustDevice, deviceLabel })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /* ===================================
   * Step-up MFA — factor management (Authenticated)
   * =================================== */

  /** List enrolled factors and recovery-code count for the current user (authenticated). */
  export async function getMfaFactors(clientId: string): Promise<MfaFactorsResponse> {
    return request<MfaFactorsResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/factors`)
  }

  /** Begin email-factor enrollment; sends a code to the account's existing email (authenticated). */
  export async function enrollEmailMfa(clientId: string): Promise<MfaEnrollSendResponse> {
    return post<MfaEnrollSendResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/email/enroll`, {})
  }

  /** Confirm email-factor enrollment with the code sent by {@link enrollEmailMfa} (authenticated). */
  export async function confirmEmailMfa(clientId: string, mfaSessionToken: string, code: string): Promise<MfaEnrolledResponse> {
    return post<MfaEnrolledResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/email/confirm`, { mfaSessionToken, code })
  }

  /** Begin SMS-factor enrollment; sends a code to the given phone number (authenticated). */
  export async function enrollSmsMfa(clientId: string, phoneNumber: string): Promise<MfaEnrollSendResponse> {
    return post<MfaEnrollSendResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/sms/enroll`, { phoneNumber })
  }

  /** Confirm SMS-factor enrollment with the code sent by {@link enrollSmsMfa} (authenticated). */
  export async function confirmSmsMfa(clientId: string, mfaSessionToken: string, code: string): Promise<MfaEnrolledResponse> {
    return post<MfaEnrolledResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/sms/confirm`, { mfaSessionToken, code })
  }

  /**
   * Generate a fresh set of recovery codes, invalidating any previous set (authenticated).
   * Returned **in plaintext, exactly once** — nothing else in the API ever returns them
   * again, so the caller must display/export them immediately.
   */
  export async function generateMfaRecoveryCodes(clientId: string, password: string): Promise<{ recoveryCodes: string[] }> {
    return post<{ recoveryCodes: string[] }>(`/authkit/${encodeURIComponent(clientId)}/mfa/recovery-codes/generate`, { password })
  }

  /** Remove an enrolled MFA factor (authenticated). Server route is DELETE with a body. */
  export async function removeMfaFactor(clientId: string, factor: 'email' | 'sms', password: string): Promise<SuccessResponse> {
    const path = `/authkit/${encodeURIComponent(clientId)}/mfa/factors/${factor}`
    return requestWithOptions<SuccessResponse>(path, { method: 'DELETE', body: JSON.stringify({ password }) })
  }

  /** List devices trusted to skip MFA challenges for the current user (authenticated). */
  export async function listTrustedDevices(clientId: string): Promise<{ devices: TrustedDevice[] }> {
    return request<{ devices: TrustedDevice[] }>(`/authkit/${encodeURIComponent(clientId)}/mfa/trusted-devices`)
  }

  /** Revoke a single trusted device by id (authenticated). */
  export async function revokeTrustedDevice(clientId: string, id: string): Promise<SuccessResponse> {
    return del<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/mfa/trusted-devices/${encodeURIComponent(id)}`)
  }



  /* ===================================
   * Collection-based AuthKit
   * =================================== */

  /**
   * Load the **public** AuthKit config for a client (no auth). Returns branding +
   * the public security subset (`security.passwordPolicy` + `security.session`);
   * `security.lockout` is admin-only and never included here. Use this in the login
   * UI to render password checklists and drive idle sign-out.
   */
  export async function load(authKitId: string): Promise<AuthKitConfig> {
    const path = `/authKit/${encodeURIComponent(authKitId)}/config`
    return request<AuthKitConfig>(path)
  }

  /** Get the full AuthKit config, including admin-only fields like `security.lockout` (admin auth). */
  export async function get(collectionId: string, authKitId: string): Promise<AuthKitConfig> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`
    return request<AuthKitConfig>(path)
  }

  export async function list(collectionId: string, admin?: boolean): Promise<AuthKitConfig[]> {
    const base = admin ? "/admin" : "/public"
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/authKit`
    return request<AuthKitConfig[]>(path)
  }

  /** Create an AuthKit client config (admin). Accepts the account `security` policy — see {@link AuthKitConfigInput}. */
  export async function create(collectionId: string, data: AuthKitConfigInput): Promise<AuthKitConfig> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit`
    return post<AuthKitConfig>(path, data)
  }

  /**
   * Update an AuthKit client config (admin). This is how the account **security
   * policy** is written — pass a `security` block ({@link AuthKitSecurityConfig}).
   * The server validates it and enforces it; the login UI reads the public subset
   * back via {@link load}.
   */
  export async function update(collectionId: string, authKitId: string, data: AuthKitConfigInput): Promise<AuthKitConfig> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`
    return put<AuthKitConfig>(path, data)
  }

  export async function remove(collectionId: string, authKitId: string): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`
    return del<void>(path)
  }
}




  
