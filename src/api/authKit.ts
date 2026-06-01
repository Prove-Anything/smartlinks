import { request, post, put, del, setBearerToken, invalidateCache } from "../http"
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
} from "../types/authKit"

/**
 * Namespace containing helper functions for the new AuthKit API.
 * Legacy collection-based authKit helpers retained (marked as *Legacy*).
 */
export namespace authKit {
 

  /* ===================================
   * Authentication (Per client)
   * =================================== */

  /** Login with email + password (public). */
  export async function login(clientId: string, email: string, password: string): Promise<AuthLoginResponse> {
    const res = await post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/login`, { email, password })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /** Register a new user (public). */
  export async function register(clientId: string, data: { email: string; password: string; displayName?: string; accountData?: Record<string, any> }): Promise<AuthLoginResponse> {
    return post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/register`, data)
  }

  /** Google OAuth login via ID token (public). */
  export async function googleLogin(clientId: string, idToken: string): Promise<AuthLoginResponse> {
    const res = await post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/google`, { idToken })
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

  /** Verify a magic link token and authenticate/create the user (public). */
  export async function verifyMagicLink(clientId: string, token: string): Promise<MagicLinkVerifyResponse> {
    const res = await post<MagicLinkVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/magic-link/verify`, { token })
    if (res.token) { setBearerToken(res.token); invalidateCache() }
    return res
  }

  /** Send phone verification code (public). */
  export async function sendPhoneCode(clientId: string, phoneNumber: string): Promise<PhoneSendCodeResponse> {
    return post<PhoneSendCodeResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/send-code`, { phoneNumber })
  }

  /** Verify phone verification code (public). */
  export async function verifyPhoneCode(clientId: string, phoneNumber: string, code: string): Promise<PhoneVerifyResponse> {
    const res = await post<PhoneVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/verify`, { phoneNumber, code })
    setBearerToken(res.token)
    invalidateCache()
    return res
  }

  /** Send a WhatsApp verification deep-link (public). */
  export async function sendWhatsApp(clientId: string, body: SendWhatsAppRequest = {}): Promise<SendWhatsAppResponse> {
    return post<SendWhatsAppResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/send`, body)
  }

  /** Manually verify WhatsApp token if inbound webhook path is unavailable (legacy/public fallback). */
  export async function verifyWhatsApp(clientId: string, token: string, phoneNumber: string): Promise<VerifyWhatsAppResponse> {
    return post<VerifyWhatsAppResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/verify`, { token, phoneNumber })
  }

  /** Poll WhatsApp verification status for a token (public). */
  export async function getWhatsAppStatus(clientId: string, token: string): Promise<WhatsAppStatusResponse> {
    const encodedToken = encodeURIComponent(token)
    return request<WhatsAppStatusResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/status?token=${encodedToken}`)
  }

  /** Exchange a verified WhatsApp token for an Auth Kit session (public). */
  export async function exchangeWhatsAppSession(clientId: string, token: string, sessionKey: string): Promise<ExchangeWhatsAppSessionResponse> {
    const res = await post<ExchangeWhatsAppSessionResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/exchange-session`, { token, sessionKey })
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

  export async function completePasswordReset(clientId: string, token: string, newPassword: string): Promise<PasswordResetCompleteResponse> {
    return post<PasswordResetCompleteResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/complete-reset`, { token, newPassword })
  }

  /* ===================================
   * Email Verification
   * =================================== */
  export async function sendEmailVerification(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }): Promise<EmailVerificationActionResponse> {
    return post<EmailVerificationActionResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/send-verification`, data)
  }

  export async function verifyEmail(clientId: string, token: string): Promise<EmailVerifyTokenResponse> {
    return post<EmailVerifyTokenResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/verify-email`, { token })
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
   * Collection-based AuthKit
   * =================================== */
  export async function load(authKitId: string): Promise<AuthKitConfig> {
    const path = `/authKit/${encodeURIComponent(authKitId)}/config`
    return request<AuthKitConfig>(path)
  }

  export async function get(collectionId: string, authKitId: string): Promise<AuthKitConfig> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`
    return request<AuthKitConfig>(path)
  }

  export async function list(collectionId: string, admin?: boolean): Promise<AuthKitConfig[]> {
    const base = admin ? "/admin" : "/public"
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/authKit`
    return request<AuthKitConfig[]>(path)
  }

  export async function create(collectionId: string, data: any): Promise<AuthKitConfig> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit`
    return post<AuthKitConfig>(path, data)
  }

  export async function update(collectionId: string, authKitId: string, data: any): Promise<AuthKitConfig> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`
    return put<AuthKitConfig>(path, data)
  }

  export async function remove(collectionId: string, authKitId: string): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`
    return del<void>(path)
  }
}




  
