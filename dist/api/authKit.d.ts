import type { AuthLoginResponse, AppleLoginOptions, RefreshResponse, LogoutResponse, PhoneSendCodeResponse, PhoneVerifyResponse, PasswordResetRequestResponse, VerifyResetTokenResponse, PasswordResetCompleteResponse, EmailVerificationActionResponse, EmailVerifyTokenResponse, AuthKitConfig, AuthKitConfigInput, AuthKitSetIdentityResponse, AuthKitInviteRequest, AuthKitInviteResponse, MagicLinkSendResponse, MagicLinkVerifyResponse, UserProfile, UpdateProfileResponse, ProfileUpdateData, SuccessResponse, SendWhatsAppRequest, SendWhatsAppResponse, ExchangeWhatsAppSessionResponse, VerifyWhatsAppResponse, WhatsAppStatusResponse, SendSmsVerifyRequest, SendSmsVerifyResponse, VerifySmsResponse, UpsertContactRequest, UpsertContactResponse, MfaChallengeSendResponse, MfaFinalizeResponse, MfaEnrollSendResponse, MfaTotpEnrollResponse, MfaEnrolledResponse, MfaFactor, MfaFactorsResponse, TrustedDevice } from "../types/authKit.js";
/**
 * Namespace containing helper functions for the new AuthKit API.
 * Legacy collection-based authKit helpers retained (marked as *Legacy*).
 */
export declare namespace authKit {
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
    function login(clientId: string, email: string, password: string, trustedDeviceToken?: string): Promise<AuthLoginResponse>;
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
    function register(clientId: string, data: {
        email: string;
        password: string;
        displayName?: string;
        accountData?: Record<string, any>;
    }): Promise<AuthLoginResponse>;
    /**
     * Google OAuth login via ID token (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
     *
     * @param trustedDeviceToken - Optional. Pass a token previously returned by
     *   {@link mfaChallengeVerify}/{@link mfaRecoveryCode} (with `trustDevice: true`) to skip
     *   the challenge on this device, same as {@link login}.
     */
    function googleLogin(clientId: string, idToken: string, trustedDeviceToken?: string): Promise<AuthLoginResponse>;
    /** Google OAuth login via server-side authorization code (public). */
    function googleCodeLogin(clientId: string, code: string, redirectUri: string): Promise<AuthLoginResponse>;
    /**
     * Sign in with LinkedIn (OpenID Connect) via a server-side authorization code (public).
     *
     * LinkedIn has no client-side ID-token SDK, so this is always the authorization-code flow:
     * redirect the browser to LinkedIn's authorize endpoint, then pass the returned one-time
     * `code` (and the exact `redirectUri` used) here — the server exchanges it (with the app's
     * client secret) and verifies the id_token. Mirrors {@link googleCodeLogin}: on success the
     * bearer token is stored and the cache invalidated.
     *
     * Notable error codes (thrown as `SmartlinksApiError`, read via `err.errorCode`):
     * - `MISSING_LINKEDIN_CODE` (400), `LINKEDIN_AUTH_NOT_CONFIGURED` (400),
     *   `INVALID_LINKEDIN_TOKEN` (400), `LINKEDIN_AUTH_FAILED` (500)
     * - `ACCOUNT_EXISTS_UNVERIFIED` (409) — same shared verified-to-verified linking policy as
     *   {@link googleLogin}/{@link appleLogin}.
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
     */
    function linkedInLogin(clientId: string, code: string, redirectUri: string, trustedDeviceToken?: string): Promise<AuthLoginResponse>;
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
    function appleLogin(clientId: string, identityToken: string, opts?: AppleLoginOptions): Promise<AuthLoginResponse>;
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
    function refreshToken(clientId: string, refreshToken: string): Promise<RefreshResponse>;
    /**
     * Revoke a refresh token's entire family server-side (that device's whole rotation
     * chain) and clear the in-memory bearer token. Idempotent — always resolves to
     * `{ success: true }`, never revealing whether the token existed. Call on explicit
     * sign-out. Persisted tokens in the host's own storage must be cleared separately.
     */
    function logout(clientId: string, refreshToken: string): Promise<LogoutResponse>;
    /** Send a magic link email to the user (public). */
    function sendMagicLink(clientId: string, data: {
        email: string;
        redirectUrl: string;
        accountData?: Record<string, any>;
    }): Promise<MagicLinkSendResponse>;
    /**
     * Verify a magic link token and authenticate/create the user (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
     *
     * @param trustedDeviceToken - Optional. See {@link login}.
     */
    function verifyMagicLink(clientId: string, token: string, trustedDeviceToken?: string): Promise<MagicLinkVerifyResponse>;
    /** Send phone verification code (public). */
    function sendPhoneCode(clientId: string, phoneNumber: string): Promise<PhoneSendCodeResponse>;
    /**
     * Verify phone verification code (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
     *
     * @param trustedDeviceToken - Optional. See {@link login}.
     */
    function verifyPhoneCode(clientId: string, phoneNumber: string, code: string, trustedDeviceToken?: string): Promise<PhoneVerifyResponse>;
    /** Send a WhatsApp verification deep-link (public). */
    function sendWhatsApp(clientId: string, body?: SendWhatsAppRequest): Promise<SendWhatsAppResponse>;
    /**
     * Manually verify WhatsApp token if inbound webhook path is unavailable (legacy/public fallback).
     *
     * Not gated by step-up MFA — this endpoint only confirms the code, it never issues a
     * session/bearer token, so there is nothing to challenge. {@link exchangeWhatsAppSession}
     * is the WhatsApp method that's gated.
     */
    function verifyWhatsApp(clientId: string, token: string, phoneNumber: string): Promise<VerifyWhatsAppResponse>;
    /** Poll WhatsApp verification status for a token (public). */
    function getWhatsAppStatus(clientId: string, token: string): Promise<WhatsAppStatusResponse>;
    /**
     * Exchange a verified WhatsApp token for an Auth Kit session (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape. This is
     * the WhatsApp method that needs `trustedDeviceToken`, not {@link verifyWhatsApp} (which
     * never issues a session).
     *
     * @param trustedDeviceToken - Optional. See {@link login}.
     */
    function exchangeWhatsAppSession(clientId: string, token: string, sessionKey: string, trustedDeviceToken?: string): Promise<ExchangeWhatsAppSessionResponse>;
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
    /**
     * Complete a password reset / invite acceptance. On invite acceptance under
     * `verify-auto-login` the server returns a session — adopt it so the caller is logged
     * straight in (plain resets return no token and leave the bearer untouched).
     */
    function completePasswordReset(clientId: string, token: string, newPassword: string): Promise<PasswordResetCompleteResponse>;
    function sendEmailVerification(clientId: string, data: {
        userId: string;
        email: string;
        redirectUrl?: string;
        clientName?: string;
    }): Promise<EmailVerificationActionResponse>;
    /** Verify an email token; under `verify-auto-login` the server returns a session — adopt it. */
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
    /**
     * Send (or resend) an MFA challenge code to the given factor (public). For `totp` nothing is sent —
     * it tells the server the code will come from their authenticator app; then {@link mfaChallengeVerify}.
     */
    function mfaChallengeSend(clientId: string, mfaSessionToken: string, factor: MfaFactor): Promise<MfaChallengeSendResponse>;
    /**
     * Verify an MFA challenge code and finalize the login (public). On success this behaves
     * like {@link login} — the bearer token is adopted and the cache invalidated.
     *
     * @param trustDevice - When `true`, the response includes `trustedDeviceToken` — persist
     *   it and pass it to future {@link login} calls to skip the challenge on this device.
     */
    function mfaChallengeVerify(clientId: string, mfaSessionToken: string, code: string, trustDevice?: boolean, deviceLabel?: string): Promise<MfaFinalizeResponse>;
    /**
     * Finalize a challenged login using a single-use recovery code instead of a sent code
     * (public). Same finalize-session behaviour as {@link mfaChallengeVerify}.
     */
    function mfaRecoveryCode(clientId: string, mfaSessionToken: string, code: string, trustDevice?: boolean, deviceLabel?: string): Promise<MfaFinalizeResponse>;
    /** List enrolled factors and recovery-code count for the current user (authenticated). */
    function getMfaFactors(clientId: string): Promise<MfaFactorsResponse>;
    /** Begin email-factor enrollment; sends a code to the account's existing email (authenticated). */
    function enrollEmailMfa(clientId: string): Promise<MfaEnrollSendResponse>;
    /** Confirm email-factor enrollment with the code sent by {@link enrollEmailMfa} (authenticated). */
    function confirmEmailMfa(clientId: string, mfaSessionToken: string, code: string): Promise<MfaEnrolledResponse>;
    /** Begin SMS-factor enrollment; sends a code to the given phone number (authenticated). */
    function enrollSmsMfa(clientId: string, phoneNumber: string): Promise<MfaEnrollSendResponse>;
    /** Confirm SMS-factor enrollment with the code sent by {@link enrollSmsMfa} (authenticated). */
    function confirmSmsMfa(clientId: string, mfaSessionToken: string, code: string): Promise<MfaEnrolledResponse>;
    /**
     * Begin authenticator-app enrollment (authenticated): a new secret for Google Authenticator,
     * Microsoft Authenticator, 1Password and the like. Show `otpauthUri` as a QR code (and `secret` for
     * typing in), then {@link confirmTotpMfa} with the code the app shows. Nothing is kept until then;
     * setting up again replaces the previous app once confirmed.
     */
    function enrollTotpMfa(clientId: string): Promise<MfaTotpEnrollResponse>;
    /** Confirm authenticator-app enrollment with the 6-digit code the app shows (authenticated). */
    function confirmTotpMfa(clientId: string, mfaSessionToken: string, code: string): Promise<MfaEnrolledResponse>;
    /**
     * Generate a fresh set of recovery codes, invalidating any previous set (authenticated).
     * Returned **in plaintext, exactly once** — nothing else in the API ever returns them
     * again, so the caller must display/export them immediately.
     */
    function generateMfaRecoveryCodes(clientId: string, password: string): Promise<{
        recoveryCodes: string[];
    }>;
    /** Remove an enrolled MFA factor (authenticated). Server route is DELETE with a body. */
    function removeMfaFactor(clientId: string, factor: MfaFactor, password: string): Promise<SuccessResponse>;
    /** List devices trusted to skip MFA challenges for the current user (authenticated). */
    function listTrustedDevices(clientId: string): Promise<{
        devices: TrustedDevice[];
    }>;
    /** Revoke a single trusted device by id (authenticated). */
    function revokeTrustedDevice(clientId: string, id: string): Promise<SuccessResponse>;
    /**
     * Load the **public** AuthKit config for a client (no auth). Returns branding +
     * the public security subset (`security.passwordPolicy` + `security.session`);
     * `security.lockout` is admin-only and never included here. Use this in the login
     * UI to render password checklists and drive idle sign-out.
     */
    function load(authKitId: string): Promise<AuthKitConfig>;
    /** Get the full AuthKit config, including admin-only fields like `security.lockout` (admin auth). */
    function get(collectionId: string, authKitId: string): Promise<AuthKitConfig>;
    function list(collectionId: string, admin?: boolean): Promise<AuthKitConfig[]>;
    /** Create an AuthKit client config (admin). Accepts the account `security` policy — see {@link AuthKitConfigInput}. */
    function create(collectionId: string, data: AuthKitConfigInput): Promise<AuthKitConfig>;
    /**
     * Update an AuthKit client config (admin). This is how the account **security
     * policy** is written — pass a `security` block ({@link AuthKitSecurityConfig}).
     * The server validates it and enforces it; the login UI reads the public subset
     * back via {@link load}.
     */
    function update(collectionId: string, authKitId: string, data: AuthKitConfigInput): Promise<AuthKitConfig>;
    /**
     * Give this AuthKit its **own logins** (admin): its members become accounts of this site only —
     * the same email can be a separate account, with its own password, on another site — rather than
     * SmartLinks accounts shared across sites. One way: a site with its own members can't go back to the
     * shared pool. Members who signed up before keep their SmartLinks account until moved across.
     *
     * Errors: `MEMBER_POOL_CONFLICT` (409) when another AuthKit already gives one of its collections its
     * own logins (one per collection); `PERMISSION_DENIED` (403) unless you administer every collection
     * it serves.
     */
    function setIdentity(collectionId: string, authKitId: string, body: {
        mode: 'own';
    }): Promise<AuthKitSetIdentityResponse>;
    /**
     * Invite someone to be a member of a site with its own logins (admin). Makes their account if they have
     * none (the only way in when the site is invitation only — `signUp: 'invite'`), finds or creates their
     * contact in this collection with the `customFields` you pass (their level), links the two, and emails
     * them a sign-in link to the site (`redirectUrl`, default the kit's) that works once for 7 days. The page
     * it opens handles it like any magic link: `mode=magicLink&token=…` → {@link verifyMagicLink}.
     * Inviting someone again sends a fresh link.
     *
     * Errors: `OWN_LOGINS_REQUIRED` (409), `INVALID_EMAIL` (400), `INVALID_REDIRECT_URL` (400, not one of
     * this site's addresses), `TOO_MANY_INVITES` (429, 5 an hour per address).
     */
    function invite(collectionId: string, authKitId: string, body: AuthKitInviteRequest): Promise<AuthKitInviteResponse>;
    function remove(collectionId: string, authKitId: string): Promise<void>;
}
