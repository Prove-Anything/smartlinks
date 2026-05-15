import type { AuthLoginResponse, PhoneSendCodeResponse, PhoneVerifyResponse, PasswordResetRequestResponse, VerifyResetTokenResponse, PasswordResetCompleteResponse, EmailVerificationActionResponse, EmailVerifyTokenResponse, AuthKitConfig, MagicLinkSendResponse, MagicLinkVerifyResponse, UserProfile, UpdateProfileResponse, ProfileUpdateData, SuccessResponse, SendWhatsAppRequest, SendWhatsAppResponse, ExchangeWhatsAppSessionResponse, VerifyWhatsAppResponse, WhatsAppStatusResponse, SendSmsVerifyRequest, SendSmsVerifyResponse, VerifySmsResponse, UpsertContactRequest, UpsertContactResponse } from "../types/authKit";
/**
 * Namespace containing helper functions for the new AuthKit API.
 * Legacy collection-based authKit helpers retained (marked as *Legacy*).
 */
export declare namespace authKit {
    /** Login with email + password (public). */
    function login(clientId: string, email: string, password: string): Promise<AuthLoginResponse>;
    /** Register a new user (public). */
    function register(clientId: string, data: {
        email: string;
        password: string;
        displayName?: string;
        accountData?: Record<string, any>;
    }): Promise<AuthLoginResponse>;
    /** Google OAuth login (public). */
    function googleLogin(clientId: string, idToken: string): Promise<AuthLoginResponse>;
    /** Send a magic link email to the user (public). */
    function sendMagicLink(clientId: string, data: {
        email: string;
        redirectUrl: string;
        accountData?: Record<string, any>;
    }): Promise<MagicLinkSendResponse>;
    /** Verify a magic link token and authenticate/create the user (public). */
    function verifyMagicLink(clientId: string, token: string): Promise<MagicLinkVerifyResponse>;
    /** Send phone verification code (public). */
    function sendPhoneCode(clientId: string, phoneNumber: string): Promise<PhoneSendCodeResponse>;
    /** Verify phone verification code (public). */
    function verifyPhoneCode(clientId: string, phoneNumber: string, code: string): Promise<PhoneVerifyResponse>;
    /** Send a WhatsApp verification deep-link (public). */
    function sendWhatsApp(clientId: string, body?: SendWhatsAppRequest): Promise<SendWhatsAppResponse>;
    /** Manually verify WhatsApp token if inbound webhook path is unavailable (legacy/public fallback). */
    function verifyWhatsApp(clientId: string, token: string, phoneNumber: string): Promise<VerifyWhatsAppResponse>;
    /** Poll WhatsApp verification status for a token (public). */
    function getWhatsAppStatus(clientId: string, token: string): Promise<WhatsAppStatusResponse>;
    /** Exchange a verified WhatsApp token for an Auth Kit session (public). */
    function exchangeWhatsAppSession(clientId: string, token: string, sessionKey: string): Promise<ExchangeWhatsAppSessionResponse>;
    /** Send an SMS click-to-verify link (public). */
    function sendSmsVerify(clientId: string, body: SendSmsVerifyRequest): Promise<SendSmsVerifyResponse>;
    /** Verify an SMS click-to-verify token via API (public). */
    function verifySms(clientId: string, token: string, phoneNumber?: string): Promise<VerifySmsResponse>;
    /** Upsert contact identity after lightweight verification (public). */
    function upsertContact(clientId: string, body: UpsertContactRequest): Promise<UpsertContactResponse>;
    function requestPasswordReset(clientId: string, data: {
        email: string;
        redirectUrl?: string;
        clientName?: string;
    }): Promise<PasswordResetRequestResponse>;
    function verifyResetToken(clientId: string, token: string): Promise<VerifyResetTokenResponse>;
    function completePasswordReset(clientId: string, token: string, newPassword: string): Promise<PasswordResetCompleteResponse>;
    function sendEmailVerification(clientId: string, data: {
        userId: string;
        email: string;
        redirectUrl?: string;
        clientName?: string;
    }): Promise<EmailVerificationActionResponse>;
    function verifyEmail(clientId: string, token: string): Promise<EmailVerifyTokenResponse>;
    function resendEmailVerification(clientId: string, data: {
        userId: string;
        email: string;
        redirectUrl?: string;
        clientName?: string;
    }): Promise<EmailVerificationActionResponse>;
    function getProfile(clientId: string): Promise<UserProfile>;
    /** Update the authenticated user's profile and replace the bearer token when refreshed claims are returned. */
    function updateProfile(clientId: string, data: ProfileUpdateData): Promise<UpdateProfileResponse>;
    function changePassword(clientId: string, currentPassword: string, newPassword: string): Promise<SuccessResponse>;
    function changeEmail(clientId: string, newEmail: string, password: string, redirectUrl: string): Promise<SuccessResponse>;
    function verifyEmailChange(clientId: string, token: string): Promise<SuccessResponse>;
    function updatePhone(clientId: string, phoneNumber: string, verificationCode: string): Promise<SuccessResponse>;
    function deleteAccount(clientId: string, password: string, confirmText: string): Promise<SuccessResponse>;
    function load(authKitId: string): Promise<AuthKitConfig>;
    function get(collectionId: string, authKitId: string): Promise<AuthKitConfig>;
    function list(collectionId: string, admin?: boolean): Promise<AuthKitConfig[]>;
    function create(collectionId: string, data: any): Promise<AuthKitConfig>;
    function update(collectionId: string, authKitId: string, data: any): Promise<AuthKitConfig>;
    function remove(collectionId: string, authKitId: string): Promise<void>;
}
