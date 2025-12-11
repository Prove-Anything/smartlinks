export interface AuthKitUser {
    uid: string;
    email?: string;
    displayName?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
    emailVerified?: boolean;
    accountData?: Record<string, any>;
}
export interface UserProfile {
    uid: string;
    email?: string;
    displayName?: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
    emailVerified?: boolean;
    accountData?: Record<string, any>;
}
export interface ProfileUpdateData {
    displayName?: string;
    photoURL?: string;
    accountData?: Record<string, any>;
}
export interface SuccessResponse {
    success: boolean;
    message?: string;
    /** some flows may return a refreshed token */
    token?: string;
}
export interface AuthLoginResponse {
    token?: string;
    user: AuthKitUser;
    accountData?: Record<string, any>;
    emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login';
    /** True if email verification is required but not yet completed */
    requiresEmailVerification?: boolean;
    /** Unix timestamp - for 'immediate' mode grace period deadline */
    emailVerificationDeadline?: number;
    /** True if account is locked due to expired verification deadline */
    accountLocked?: boolean;
}
export interface MagicLinkSendResponse {
    success: boolean;
    message: string;
}
export interface MagicLinkVerifyResponse extends AuthLoginResponse {
}
export interface PhoneSendCodeResponse {
    verificationId: string;
    message: string;
}
export interface PhoneVerifyResponse {
    token: string;
    user: AuthKitUser;
}
export interface PasswordResetRequestResponse {
    success: boolean;
    message: string;
}
export interface VerifyResetTokenResponse {
    valid: boolean;
    email?: string;
    expiresAt?: number;
    message?: string;
}
export interface PasswordResetCompleteResponse {
    success: boolean;
    message: string;
}
export interface EmailVerificationActionResponse {
    success: boolean;
    message: string;
}
export interface EmailVerifyTokenResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: AuthKitUser;
    accountData?: Record<string, any>;
    emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login';
}
export interface AuthKitBrandingConfig {
    logoUrl?: string;
    title?: string;
    subtitle?: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    buttonStyle?: string;
    fontFamily?: string;
}
export interface AuthKitConfig {
    id: string;
    branding?: AuthKitBrandingConfig;
    enabledProviders?: string[];
    customCss?: string;
    termsUrl?: string;
    privacyUrl?: string;
    supportEmail?: string;
    redirectUrl?: string;
    updatedAt?: string;
}
