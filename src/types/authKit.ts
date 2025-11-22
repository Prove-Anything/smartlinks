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

export interface AuthLoginResponse {
  token: string
  user: AuthKitUser
  accountData?: Record<string, any>
}

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

