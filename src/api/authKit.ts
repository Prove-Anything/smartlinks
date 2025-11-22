import { request, post, put, del } from "../http"
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

  /** Send phone verification code (public). */
  export async function sendPhoneCode(clientId: string, phoneNumber: string): Promise<PhoneSendCodeResponse> {
    return post<PhoneSendCodeResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/send-code`, { phoneNumber })
  }

  /** Verify phone verification code (public). */
  export async function verifyPhoneCode(clientId: string, verificationId: string, code: string): Promise<PhoneVerifyResponse> {
    return post<PhoneVerifyResponse>(`/authkit/${encodeURIComponent(clientId)}/auth/phone/verify`, { verificationId, code })
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
   * Collection-based AuthKit
   * =================================== */
  export async function load(authKitId: string): Promise<AuthKitConfig> {
    const path = `authKit/${encodeURIComponent(authKitId)}`
    return request<AuthKitConfig>(path)
  }

  export async function get(collectionId: string, authKitId: string): Promise<AuthKitConfig> {
    const path = `admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`
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




  
