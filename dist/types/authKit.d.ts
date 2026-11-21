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
export interface UpdateProfileResponse extends UserProfile {
    token: string;
}
export interface SuccessResponse {
    success: boolean;
    message?: string;
    token?: string;
}
export interface AuthLoginResponse {
    token?: string;
    user: AuthKitUser;
    accountData?: Record<string, any>;
    emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login';
    requiresEmailVerification?: boolean;
    emailVerificationDeadline?: number;
    accountLocked?: boolean;
    /**
     * True when this login created a brand-new account. Currently only populated by
     * the Apple login endpoint; left undefined by the other AuthKit login endpoints.
     */
    isNewUser?: boolean;
    /**
     * Session token expiry, in **milliseconds since epoch** (not seconds, not a duration),
     * or null when the server could not decode it. Currently only populated by the Apple
     * login endpoint.
     */
    expiresAt?: number | null;
    /**
     * Opaque, single-use refresh token. **Native clients only** — present only when the
     * request opted in via `initializeApi({ platform: 'native' })` (or the
     * `X-Client-Platform: native` header). For native logins, `token` above is the
     * short-lived access token; pair it with this refresh token. Undefined for web.
     */
    refreshToken?: string;
    /**
     * Absolute expiry of the refresh-token family, in **milliseconds since epoch**.
     * Fixed at login — it does **not** move when the token is rotated. Native only.
     */
    refreshTokenExpiresAt?: number;
}
/**
 * Response from {@link authKit.refreshToken}. The `refreshToken` is **rotated** on every
 * call — persist the new value and discard the old one before refreshing again.
 */
export interface RefreshResponse {
    /** New short-lived access token (a `SL.` bearer JWT). */
    token: string;
    /** Rotated refresh token — replace the stored value with this. */
    refreshToken: string;
    /** Absolute family expiry (ms epoch). Unchanged across rotations. */
    refreshTokenExpiresAt: number;
    /** New access-token expiry (ms epoch). */
    expiresAt: number;
    user: AuthKitUser;
    accountData?: Record<string, any>;
}
/** Response from {@link authKit.logout}. Idempotent — always `{ success: true }`. */
export interface LogoutResponse {
    success: true;
}
/**
 * Server-defined error codes for the refresh/logout flow, surfaced via
 * `SmartlinksApiError.errorCode`.
 *
 * - `MISSING_REFRESH_TOKEN` (400) — programming error; no token sent.
 * - `INVALID_REFRESH_TOKEN` (401) — unknown / expired / revoked / wrong client → `logout()` + route to login.
 * - `REFRESH_TOKEN_REUSE_DETECTED` (401) — a consumed token was replayed; the **entire session
 *   family was revoked server-side**. Hard logout: clear storage, force re-login.
 * - `SESSION_EXPIRED` (401) — the session hit the collection's absolute session timeout
 *   (`security.session.absoluteTimeoutHours`). Clear storage and route to login. Distinct from
 *   `INVALID_REFRESH_TOKEN` so the UI can message "your session expired" rather than an error.
 */
export type RefreshErrorCode = 'MISSING_REFRESH_TOKEN' | 'INVALID_REFRESH_TOKEN' | 'REFRESH_TOKEN_REUSE_DETECTED' | 'SESSION_EXPIRED';
/**
 * Options for {@link authKit.appleLogin}. All fields are optional — only the
 * `identityToken` (passed as a positional argument) is required by the server.
 */
/** Options for {@link authKit.microsoftLogin}. */
export interface MicrosoftLoginOptions {
    /**
     * The site the session will be handed to, when signing in through a popup page on another address
     * (the SmartLinks Microsoft sign-in page does this). The server refuses unless it's one of the login
     * setup's own sites (`MICROSOFT_ORIGIN_NOT_ALLOWED`). Leave it out when signing in on the site itself.
     */
    returnOrigin?: string;
    /** Skip the step-up MFA challenge on a recognised device. */
    trustedDeviceToken?: string;
}
/**
 * Who can sign in through a login setup, whatever the method (password, magic link, phone, WhatsApp,
 * Google, Apple, LinkedIn, Microsoft):
 * - `anyone` (also: no `access`) — anyone, as before;
 * - `organisation` — people from the listed organisations: a VERIFIED email at one of `domains`, one of
 *   the listed `emails`, or signing in with Microsoft from the domain's own Microsoft organisation. A
 *   Microsoft email alone doesn't count (an organisation can give its users any address), so on save
 *   the server looks up each domain's Microsoft organisation itself — nobody types a tenant id.
 *
 * Checked every time a session is issued (tightening it shuts people out from their next sign-in);
 * refused with `NOT_IN_ORGANISATION` (403). Registration refuses outside addresses up front and never
 * signs an unverified address straight in. Accounts with no email (phone / WhatsApp only) can't show
 * they're from an organisation. The public config returns only `{ mode, domains }`.
 */
export interface AuthKitAccess {
    mode: 'anyone' | 'organisation';
    /** e.g. `['acme.com']` (no `@`; exact domains — list subsidiaries' domains too). Up to 50. */
    domains?: string[];
    /** Particular people allowed besides the organisations, e.g. a contractor. Up to 50. Never public. */
    emails?: string[];
    /** Server-filled on save: `{ 'acme.com': '<Microsoft tenant id>' }` for domains with a Microsoft organisation. Read-only. */
    microsoftTenants?: Record<string, string>;
}
export interface AppleLoginOptions {
    /** Apple authorization code. Accepted but ignored by the server for now (reserved for future server-side token exchange). */
    authorizationCode?: string;
    /**
     * The **raw** nonce the client generated, if nonce binding was used. The server
     * accepts either `token.nonce === nonce` (native) or `token.nonce === sha256hex(nonce)` (web).
     */
    nonce?: string;
    /**
     * Name/email from Apple's **first** authorization callback only — Apple never returns
     * these again, and never inside the token. Forwarded so the server can persist the
     * display name on first account creation. Treated as untrusted (never used for identity).
     */
    userInfo?: {
        email?: string;
        name?: string;
    };
    /**
     * A previously-issued trusted-device token (from a prior MFA `challenge/verify`
     * or `challenge/recovery-code` response). If still valid, the server skips any
     * step-up challenge for this login. See `SDK_AUTHKIT_MFA_UPDATE.md` §3.
     */
    trustedDeviceToken?: string;
}
/**
 * Server-defined error codes returned by AuthKit federated-login endpoints
 * (Apple + Google). Surfaced via `SmartlinksApiError.errorCode`. The
 * `ACCOUNT_EXISTS_UNVERIFIED` case also carries `requiresEmailVerification: true`
 * in `SmartlinksApiError.details`.
 */
export type AuthKitErrorCode = 'MISSING_APPLE_TOKEN' | 'APPLE_AUTH_NOT_CONFIGURED' | 'INVALID_APPLE_TOKEN' | 'ACCOUNT_EXISTS_UNVERIFIED' | 'APPLE_AUTH_FAILED' | 'SIGN_UP_CLOSED' | 'NOT_IN_ORGANISATION' | 'MISSING_MICROSOFT_TOKEN' | 'MICROSOFT_AUTH_NOT_CONFIGURED' | 'INVALID_MICROSOFT_TOKEN' | 'MICROSOFT_ORIGIN_NOT_ALLOWED' | 'MICROSOFT_AUTH_FAILED';
/** A second-step method: a code by email or text message, or from an authenticator app. */
export type MfaFactor = 'email' | 'sms' | 'totp';
/**
 * Details carried on the `MFA_REQUIRED` error thrown by any session-issuing login method
 * (see the gate list above) when the client's MFA policy requires a step-up. Surfaced as
 * `err.details` (or `err.errorResponse.details`) on the `SmartlinksApiError` — the login
 * method never resolves in this case, it throws a 403 instead.
 */
export interface MfaRequiredDetails {
    /** Short-lived (10 min) and single-use. Pass it to every challenge/finalize call below. */
    mfaSessionToken: string;
    /** Only factors the user actually enrolled. */
    availableFactors: MfaFactor[];
    /** `totp`, then `sms`, then `email`: the first one the user enrolled. */
    preferredFactor: MfaFactor;
    /** `totp` is "your authenticator app" (nothing is sent for it). */
    maskedDestinations: {
        email?: string;
        sms?: string;
        totp?: string;
    };
}
/** Response from {@link authKit.mfaChallengeSend}. */
export interface MfaChallengeSendResponse {
    success: true;
    factor: MfaFactor;
    /** Masked, e.g. `"j***@x.com"` or `"+1******1234"`. */
    destination: string;
    /** ISO timestamp, 10 minutes from send. */
    expiresAt: string;
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
    trustedDeviceToken?: string;
    trustedDeviceExpiresAt?: string;
}
/** Response from {@link authKit.enrollEmailMfa} / {@link authKit.enrollSmsMfa}. */
export interface MfaEnrollSendResponse {
    mfaSessionToken: string;
    destination: string;
    expiresAt: string;
}
/** Response from {@link authKit.enrollTotpMfa}: show `otpauthUri` as a QR code, and `secret` for typing in. */
export interface MfaTotpEnrollResponse {
    mfaSessionToken: string;
    /** Base32, for people who type it into their app instead of scanning. Returned only here. */
    secret: string;
    /** `otpauth://totp/…` — render it as a QR code for the app to scan. */
    otpauthUri: string;
    /** What the app shows the entry as: the site, and the account. */
    issuer: string;
    account: string;
    expiresAt: string;
}
/** Response from {@link authKit.confirmEmailMfa} / {@link authKit.confirmSmsMfa} / {@link authKit.confirmTotpMfa}. */
export interface MfaEnrolledResponse {
    enrolled: true;
    factor: MfaFactor;
}
/** Response from {@link authKit.getMfaFactors}. */
export interface MfaFactorsResponse {
    enrolledFactors: {
        email?: {
            enrolledAt: string;
            destination: string;
        };
        sms?: {
            enrolledAt: string;
            destination: string;
        };
        /** `destination` is "Authenticator app". */
        totp?: {
            enrolledAt: string;
            destination: string;
        };
    };
    recoveryCodesRemaining: number;
    mfaEnabledForClient: boolean;
}
/** One entry from {@link authKit.listTrustedDevices}. */
export interface TrustedDevice {
    id: string;
    label: string | null;
    createdAtMs: number;
    lastUsedAtMs: number;
    expiresAtMs: number;
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
export type MfaErrorCode = 'MFA_REQUIRED' | 'INVALID_MFA_CODE' | 'MFA_TOO_MANY_ATTEMPTS' | 'MFA_FACTOR_NOT_ENROLLED' | 'MFA_SESSION_EXPIRED' | 'MFA_SESSION_INVALID' | 'RECOVERY_CODE_INVALID';
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
    success: boolean;
    message: string;
    /** Session token (a `SL.` bearer JWT). Present only on invite auto-login. Adopt it and skip the login screen. */
    token?: string;
    /** The authenticated user. Present only when a `token` is returned. `emailVerified` is `true` once completion verifies the invite. */
    user?: AuthKitUser;
    /** The `clients[clientId]` account-data slice, or `null`. Present only when a `token` is returned. */
    accountData?: Record<string, any> | null;
    /** Configured verification mode echoed back; auto-login only occurs for `verify-auto-login`. */
    emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login';
    /** Opaque, single-use refresh token. **Native clients only** — pairs with the short-lived `token`. */
    refreshToken?: string;
    /** Absolute expiry of the refresh-token family, in **ms since epoch**. Native only. */
    refreshTokenExpiresAt?: number;
    /** Access-token expiry, in **ms since epoch**. Native only. */
    expiresAt?: number;
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
export type VerifyStatus = 'pending' | 'verified' | 'failed' | 'expired' | 'unknown';
export interface WhatsAppReplyCta {
    body: string;
    buttonLabel: string;
    buttonUrl: string;
    mediaUrl?: string;
}
export interface WhatsAppReplyOptions {
    /** Option A: explicit Twilio Content SID */
    contentSid?: string;
    contentVariables?: Record<string, unknown>;
    /** Option B: CTA shorthand (uses shared generic CTA content SID) */
    cta?: WhatsAppReplyCta;
    /** Option C: plain-text fallback */
    text?: string;
}
export interface WhatsAppContactData {
    name?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    source?: string;
    customFields?: Record<string, unknown>;
    externalIds?: Record<string, unknown>;
}
export interface SendWhatsAppRequest {
    redirectUrl?: string;
    prefillMessage?: string;
    reply?: WhatsAppReplyOptions;
    contactData?: WhatsAppContactData;
}
export interface SendWhatsAppResponse {
    waLink: string;
    code: string;
    token: string;
    sessionKey?: string;
    expiresAt: string;
}
export interface ExchangeWhatsAppSessionResponse {
    success: boolean;
    token: string;
    user: AuthKitUser;
    accountData?: Record<string, any>;
}
export interface VerifyWhatsAppResponse {
    success: boolean;
    verified: boolean;
    redirectUrl?: string | null;
}
export interface WhatsAppStatusResponse {
    ok: boolean;
    status: VerifyStatus;
    verified: boolean;
    redirectUrl?: string | null;
    phoneNumber?: string | null;
    updatedAt?: unknown;
}
export interface SendSmsVerifyRequest {
    phoneNumber: string;
    redirectUrl: string;
    ctaText?: string;
}
export interface SendSmsVerifyResponse {
    success: boolean;
    expiresAt: string;
}
export interface VerifySmsResponse {
    verified: boolean;
    redirectUrl?: string | null;
    phoneNumber?: string | null;
}
export interface UpsertContactRequest {
    collectionId?: string;
    phone?: string;
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    source?: string;
    customFields?: Record<string, unknown>;
    externalIds?: Record<string, unknown>;
}
export interface UpsertContactResponse {
    ok: boolean;
    collectionId: string;
    contactId: string;
    userId: string | null;
    created: boolean;
}
/** The sign-in screens' look (read by `@proveanything/smartlinks-auth-ui`). */
export interface AuthKitBrandingConfig {
    /** Absent = the SmartLinks logo; `''` = no logo. An https address (or a small data:image URI). */
    logoUrl?: string | null;
    title?: string;
    subtitle?: string;
    registerTitle?: string;
    registerSubtitle?: string;
    /** CSS colours, e.g. `#1D4ED8`. Shown only with `inheritHostStyles: false` (else the host page's colours win). */
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    buttonStyle?: 'rounded' | 'square' | 'pill' | string;
    fontFamily?: string;
    /** Light or dark screens; `auto` follows the visitor's device. Default `light`. A host `theme` prop wins. */
    theme?: 'light' | 'dark' | 'auto';
    /** Use the host page's colours (default true). Turn off for your own colours to show. */
    inheritHostStyles?: boolean;
    minimal?: boolean;
    customCss?: string;
    termsUrl?: string;
    privacyUrl?: string;
    [key: string]: unknown;
}
/** A sign-in method id, as `enabledProviders` / `providerOrder` take them. */
export type AuthKitProvider = 'email' | 'magic-link' | 'phone' | 'whatsapp' | 'google' | 'apple' | 'microsoft' | 'linkedin';
/** One account email's wording. A field left out keeps the built-in words. Plain words (no scripts). */
export interface AuthKitEmailTemplate {
    subject?: string;
    header?: string;
    introText?: string;
    buttonText?: string;
    footerText?: string;
}
/** The account emails a sign-in sends, by kind. */
export type AuthKitEmailKind = 'passwordReset' | 'emailVerification' | 'magicLink' | 'memberInvite' | 'invite' | 'addedToCollection' | 'mfaCode' | 'providerLinked';
/** Wording on the sign-in screens a site may change (auth-ui reads `texts[key]`). */
export type AuthKitTextKey = 'signInTitle' | 'signInSubtitle' | 'registerTitle' | 'registerSubtitle' | 'emailLabel' | 'passwordLabel' | 'signInButton' | 'registerButton' | 'forgotPassword' | 'noAccount' | 'haveAccount' | 'continueWithEmail' | 'continueWithGoogle' | 'continueWithApple' | 'continueWithMicrosoft' | 'continueWithLinkedIn' | 'continueWithPhone' | 'continueWithWhatsApp' | 'continueWithMagicLink' | 'sendMagicLink' | 'magicLinkSent' | 'inviteOnlyNotice';
/** Second step at sign-in (TOTP authenticator app, email or text code, recovery codes). */
export interface AuthKitMfaConfig {
    /** off; optional (people may add one, never asked); risk-based / always (asked at sign-in once they have one). */
    mode?: 'off' | 'optional' | 'risk-based' | 'always';
    /** Switch a method off with `false`. */
    factorsEnabled?: {
        email?: boolean;
        sms?: boolean;
        totp?: boolean;
        recoveryCodes?: boolean;
    };
    minimumFactors?: number;
    trustedDeviceDurationDays?: number;
    enforceForAdmins?: boolean;
}
/**
 * A sign-in (AuthKit) config — the ONE shape every setting lives in. The server validates every write
 * (`INVALID_CONFIG`, 400, with `problems: [{ path, message }]`) and fills defaults; GET
 * {@link authKit.schema} lists every field with its default and what reads it, and
 * {@link authKit.settings} shows what sign-in does now. See `docs/auth-kit.md` → "Setting up sign-in".
 */
export interface AuthKitConfig {
    id: string;
    /** The name staff see. */
    name?: string;
    branding?: AuthKitBrandingConfig;
    /** Which ways to sign in the screens offer. Absent = the host page's choice. */
    enabledProviders?: AuthKitProvider[];
    /** The order they appear in. */
    providerOrder?: AuthKitProvider[];
    /** `form` (email + password form straight away, default) or `button` ("Continue with email" first). */
    emailDisplayMode?: 'form' | 'button';
    /** How much the screens push creating an account. `none` = no sign-up link. Default `minimal`. */
    signupProminence?: 'none' | 'minimal' | 'balanced' | 'emphasized';
    signupRedirectUrl?: string;
    /** Your own Google OAuth web client id (public; no secret needed). Absent = SmartLinks' Google app. */
    googleClientId?: string;
    googleOAuthFlow?: 'oneTap' | 'popup' | 'redirect';
    /** Site domains registered on your own Google client (open Google directly, not via the SmartLinks proxy). */
    whitelistedGoogleDomains?: string[];
    /** Sign in with Apple: your Services ID / bundle ids. Required for `apple`. */
    appleClientIds?: string[];
    /** Your own LinkedIn app's client id. Its secret goes through {@link authKit.secretEntryLink}, never here. */
    linkedInClientId?: string;
    whatsappPrefillMessage?: string;
    whatsappReply?: {
        enabled?: boolean;
        text?: string;
        cta?: {
            body?: string;
            buttonLabel?: string;
            buttonUrl?: string;
            mediaUrl?: string;
        };
    };
    /** Extra contact fields on the sign-up form. */
    registrationFields?: Array<{
        key: string;
        showDuringRegistration?: boolean;
        placement?: 'inline' | 'after';
        required?: boolean;
    }>;
    collectNameOnPasswordlessSignup?: boolean;
    /** Default `verify-auto-login`. */
    emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login';
    emailVerificationGracePeriod?: number;
    lockUnverifiedAfterGrace?: boolean;
    /** Offer "Forgot password?" and send reset emails (default true). false → the request answers `PASSWORD_RESET_DISABLED` (403). */
    allowPasswordReset?: boolean;
    /** Second step at sign-in. */
    mfa?: AuthKitMfaConfig;
    /** Where the site sends people after they sign in: your page reads it from {@link authKit.load} in `onAuthSuccess`. */
    afterSignInUrl?: string;
    /** Extra domains emailed links may return to (the collection's own domains are always allowed). */
    allowedRedirectDomains?: string[];
    /** Wording on the screens, in the language `textsLanguage` names (English when not set). */
    texts?: Partial<Record<AuthKitTextKey, string>>;
    /** The language `texts` is written in ("en", "de", ...): only visitors in that language see it. */
    textsLanguage?: string;
    /** The same wording per language, e.g. `{ fr: { signInTitle: 'Connexion' } }`; wins over `texts`. */
    textsByLanguage?: Record<string, Partial<Record<AuthKitTextKey, string>>>;
    /** Wording of the account emails, per email. Preview with {@link authKit.previewEmail}. */
    emailTemplates?: Partial<Record<AuthKitEmailKind, AuthKitEmailTemplate>>;
    /** The account emails' look. The sender is the collection's email settings (verified domain). */
    emailBranding?: {
        logoUrl?: string;
        buttonColor?: string;
        footerHtml?: string;
    };
    /** Where each secret is and a masked hint — never the value. Server-owned. */
    secrets?: Record<string, {
        ref: string;
        hint?: string | null;
        collectionId?: string;
        setAt?: string;
    }>;
    customCss?: string;
    termsUrl?: string;
    privacyUrl?: string;
    supportEmail?: string;
    redirectUrl?: string;
    updatedAt?: string;
    /**
     * Per-collection security policy. On the public config endpoint only
     * `passwordPolicy` + `session` are returned (the client renders password
     * checklists / idle sign-out from them); `lockout` is admin-only and enforced
     * server-side. See {@link AuthKitSecurityConfig}.
     */
    security?: AuthKitSecurityConfig;
    /** The collections this AuthKit serves. */
    collectionIds?: string[];
    /**
     * Which user pool this site's members sign in to. Absent or `shared` = the SmartLinks account (the
     * same account on every site that uses it). `own` = the site's own members (a separate account per
     * site, its own passwords). Switch with {@link authKit.setIdentity}; never via create/update.
     */
    identity?: AuthKitIdentity;
    /**
     * Who may join a site with its own logins. `open` (default): anyone can create an account.
     * `invite`: only people the site's admins invite ({@link authKit.invite}). Every way of signing up
     * (password, magic link, phone, Google, Apple, LinkedIn, WhatsApp) then refuses anyone else with
     * `SIGN_UP_CLOSED` (403), and "send me a link / a code" answers as if sent without sending anything,
     * so nobody can find out who is a member. Hide your "Create an account" option when it's `invite`.
     * Setting `invite` needs own logins first (`OWN_LOGINS_REQUIRED`, 409).
     */
    signUp?: 'open' | 'invite';
    /** Who can sign in — see {@link AuthKitAccess}. Absent = anyone. */
    access?: AuthKitAccess;
    /**
     * Sign in with Microsoft: add `'microsoft'` to `enabledProviders`. SmartLinks' own Microsoft app serves
     * every organisation and personal Microsoft accounts, so nothing else is needed. Set this only to show
     * your OWN name on Microsoft's sign-in screen: the Application (client) ID of your own multitenant app
     * registration (redirect URI: https://smartlinks.app/apps/account/stable/microsoft-proxy.html). On the
     * public config it's the effective id (yours, else SmartLinks').
     */
    microsoftClientId?: string;
}
/** Body of {@link authKit.invite}. */
export interface AuthKitInviteRequest {
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    /** Set on their contact in this collection, e.g. `{ level: 'member' }` (staff-only and visible fields alike). */
    customFields?: Record<string, unknown>;
    /** Where the emailed link opens: the site's sign-in page (one of its own addresses). Default: the kit's `redirectUrl`. */
    redirectUrl?: string;
}
/** Result of {@link authKit.invite}. The sign-in link itself only goes to their inbox. */
export interface AuthKitInviteResponse {
    ok: true;
    userId: string;
    contactId: string;
    /** true when their account was made by this invite; false when they had one (they got a new link). */
    created: boolean;
    /** When the emailed link stops working (it works once). */
    expiresAt: string;
}
/** An AuthKit's member pool. */
export interface AuthKitIdentity {
    mode: 'shared' | 'own';
    /** The site's own pool (set by the platform). */
    tenantId?: string;
    createdAt?: string;
}
/** Result of {@link authKit.setIdentity}. */
export interface AuthKitSetIdentityResponse {
    identity: AuthKitIdentity;
    message: string;
}
/**
 * Writable shape for `authKit.create` / `authKit.update` (admin). Known fields are
 * typed — importantly `security?: AuthKitSecurityConfig` for the account security
 * policy — while additional admin-console fields are still permitted. `id` and
 * `updatedAt` are server-owned and omitted.
 *
 * ```ts
 * await authKit.update(collectionId, authKitId, {
 *   security: {
 *     passwordPolicy: { minLength: 10, blockCommonPasswords: true },
 *     lockout:  { enabled: true, maxFailedAttempts: 5, lockoutMinutes: 15 },
 *     session:  { inactivityTimeoutMinutes: 30, absoluteTimeoutHours: 12 },
 *   },
 * })
 * ```
 */
export type AuthKitConfigInput = Partial<Omit<AuthKitConfig, 'id' | 'updatedAt' | 'identity' | 'secrets'>> & Record<string, any>;
/** {@link authKit.schema}: every setting, its default, what reads it, in plain words. */
export interface AuthKitSchema {
    providers: AuthKitProvider[];
    emailKinds: AuthKitEmailKind[];
    emailFields: Array<keyof AuthKitEmailTemplate>;
    textKeys: AuthKitTextKey[];
    /** Secret names (set through {@link authKit.secretEntryLink}). */
    secrets: string[];
    /** Fields never written through create/update. */
    serverOwned: string[];
    /** where: `screens` (the sign-in UI reads it), `server` (the API enforces it), `both`, `host` (your page reads it from {@link authKit.load}). */
    fields: Array<{
        path: string;
        group: string;
        where: 'screens' | 'server' | 'both' | 'host';
        default: unknown;
        description: string;
    }>;
}
/** One thing worth knowing about a sign-in's settings (from {@link authKit.settings}). */
export interface AuthKitCheck {
    /** `problem`: on but will fail; `warning`: works, probably not meant; `info`: worth knowing. */
    level: 'problem' | 'warning' | 'info';
    code: string;
    message: string;
    /** The setting to change. */
    setting?: string;
}
/** {@link authKit.settings}: what sign-in does now. */
export interface AuthKitSettingsResponse {
    authKitId: string;
    ownLogins: 'own' | 'shared';
    /** As stored (no secret values). */
    config: AuthKitConfig;
    /** Every default filled in. */
    effective: Required<Pick<AuthKitConfig, 'enabledProviders' | 'providerOrder' | 'signUp' | 'allowPasswordReset' | 'emailVerificationMode'>> & AuthKitConfig;
    secrets: Record<string, {
        set: boolean;
        hint?: string | null;
        setAt?: string | null;
        legacy?: boolean;
    }>;
    checks: AuthKitCheck[];
}
/** Body of {@link authKit.setup}. */
export interface AuthKitSetupRequest {
    /** For a new sign-in. */
    name?: string;
    /** Give it its own logins (members of this site only). ONE WAY. Needed for `signUp: 'invite'`. */
    ownLogins?: boolean;
    /** A first settings patch, checked like {@link authKit.update}. No secrets. */
    settings?: AuthKitConfigInput;
}
/** Result of {@link authKit.setup}. */
export interface AuthKitSetupResponse {
    authKit: AuthKitConfig;
    created: boolean;
    ownLogins: 'own' | 'shared';
    /** What this call changed, in plain words (empty when nothing). */
    changed: string[];
}
/** Result of {@link authKit.previewEmail}. */
export interface AuthKitEmailPreview {
    kind: AuthKitEmailKind;
    subject: string;
    html: string;
}
/** Result of {@link authKit.secretEntryLink}. */
export interface AuthKitSecretLink {
    /** A SmartLinks page where the person types the secret. Works once. */
    url: string;
    expiresAt: string;
}
/**
 * Per-collection account-security policy. The API **enforces** all of this; the
 * client uses `passwordPolicy` (live checklist) and `session` (idle sign-out) for UX.
 */
export interface AuthKitSecurityConfig {
    passwordPolicy?: AuthKitPasswordPolicy;
    session?: AuthKitSessionPolicy;
    /** Admin-only; never returned on the public config endpoint. */
    lockout?: AuthKitLockoutPolicy;
}
export interface AuthKitPasswordPolicy {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSymbol?: boolean;
    blockCommonPasswords?: boolean;
    /** 0 = never expires. */
    expiryDays?: number;
    /** 0 = reuse allowed. */
    historyCount?: number;
}
export interface AuthKitSessionPolicy {
    /** 0 = never (client-enforced idle sign-out). */
    inactivityTimeoutMinutes?: number;
    inactivityWarningSeconds?: number;
    /** 0 = use token lifetime. Enforced server-side on the native refresh path (→ `SESSION_EXPIRED`). */
    absoluteTimeoutHours?: number;
    rememberMe?: boolean;
}
/** Admin-only lockout policy (operational; not exposed publicly). */
export interface AuthKitLockoutPolicy {
    enabled?: boolean;
    maxFailedAttempts?: number;
    attemptWindowMinutes?: number;
    lockoutMinutes?: number;
    notifyUserOnLockout?: boolean;
}
/**
 * Password-policy validation errors (400) returned by `register`, `completePasswordReset`,
 * and `changePassword`. Surfaced via `SmartlinksApiError.errorCode`.
 * - `PASSWORD_TOO_SHORT` — below `passwordPolicy.minLength`.
 * - `PASSWORD_REQUIREMENTS_NOT_MET` — missing a required character class.
 * - `PASSWORD_TOO_COMMON` — matched the common/breached list.
 * - `PASSWORD_RECENTLY_USED` — matched one of the last `historyCount` passwords.
 */
export type PasswordPolicyErrorCode = 'PASSWORD_TOO_SHORT' | 'PASSWORD_REQUIREMENTS_NOT_MET' | 'PASSWORD_TOO_COMMON' | 'PASSWORD_RECENTLY_USED';
/**
 * Security errors returned by `login`. Surfaced via `SmartlinksApiError.errorCode`,
 * with extra fields in `SmartlinksApiError.details`:
 * - `ACCOUNT_TEMPORARILY_LOCKED` (429) — too many failed attempts; `details.retryAfterSeconds`
 *   says how long to wait. Show a "try again in N minutes" message.
 * - `PASSWORD_EXPIRED` (403) — password older than `passwordPolicy.expiryDays`; `details.resetToken`
 *   is a short-lived token — send the user straight into `completePasswordReset()` to change it in place.
 */
export type LoginSecurityErrorCode = 'ACCOUNT_TEMPORARILY_LOCKED' | 'PASSWORD_EXPIRED';
