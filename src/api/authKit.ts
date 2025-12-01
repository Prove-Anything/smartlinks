import { request, post, put, del, setBearerToken } from "../http"
import type {
  AuthLoginResponse,
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
  ProfileUpdateData,
  SuccessResponse,
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
    return post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/login`, { email, password })
  }

  /** Register a new user (public). */
  export async function register(clientId: string, data: { email: string; password: string; displayName?: string; accountData?: Record<string, any> }): Promise<AuthLoginResponse> {
    return post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/register`, data)
  }

  /** Google OAuth login (public). */
  export async function googleLogin(clientId: string, idToken: string): Promise<AuthLoginResponse> {
    return post<AuthLoginResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/google`, { idToken })
  }

  /** Send a magic link email to the user (public). */
  export async function sendMagicLink(clientId: string, data: { email: string; redirectUrl: string; accountData?: Record<string, any> }): Promise<MagicLinkSendResponse> {
    return post<MagicLinkSendResponse>(`/authkit/${encodeURIComponent(clientId)}/magic-link/send`, data)
  }

  /** Verify a magic link token and authenticate/create the user (public). */
  export async function verifyMagicLink(clientId: string, token: string): Promise<MagicLinkVerifyResponse> {
    const res = await post<MagicLinkVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/magic-link/verify`, { token })
    if (res.token) setBearerToken(res.token)
    return res
  }

  /** Send phone verification code (public). */
  export async function sendPhoneCode(clientId: string, phoneNumber: string): Promise<PhoneSendCodeResponse> {
    return post<PhoneSendCodeResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/send-code`, { phoneNumber })
  }

  /** Verify phone verification code (public). */
  export async function verifyPhoneCode(clientId: string, phoneNumber: string, code: string): Promise<PhoneVerifyResponse> {
    return post<PhoneVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/verify`, { phoneNumber, code })
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

  export async function updateProfile(clientId: string, data: ProfileUpdateData): Promise<UserProfile> {
    return post<UserProfile>(`/authkit/${encodeURIComponent(clientId)}/account/update-profile`, data)
  }

  export async function changePassword(clientId: string, currentPassword: string, newPassword: string): Promise<SuccessResponse> {
    return post<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/account/change-password`, { currentPassword, newPassword })
  }

  export async function changeEmail(clientId: string, newEmail: string, password: string, redirectUrl: string): Promise<SuccessResponse> {
    return post<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/account/change-email`, { newEmail, password, redirectUrl })
  }

  export async function verifyEmailChange(clientId: string, token: string): Promise<SuccessResponse> {
    const res = await post<SuccessResponse>(`/authkit/${encodeURIComponent(clientId)}/account/verify-email-change`, { token })
    if (res.token) setBearerToken(res.token)
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




  
