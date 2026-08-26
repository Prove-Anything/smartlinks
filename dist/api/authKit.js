import { request, post, put, del, requestWithOptions, setBearerToken, invalidateCache } from "../http";
/**
 * Namespace containing helper functions for the new AuthKit API.
 * Legacy collection-based authKit helpers retained (marked as *Legacy*).
 */
export var authKit;
(function (authKit) {
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
    async function login(clientId, email, password, trustedDeviceToken) {
        const body = { email, password };
        if (trustedDeviceToken)
            body.trustedDeviceToken = trustedDeviceToken;
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/login`, body);
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.login = login;
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
    async function register(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/register`, data);
    }
    authKit.register = register;
    /**
     * Google OAuth login via ID token (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
     *
     * @param trustedDeviceToken - Optional. Pass a token previously returned by
     *   {@link mfaChallengeVerify}/{@link mfaRecoveryCode} (with `trustDevice: true`) to skip
     *   the challenge on this device, same as {@link login}.
     */
    async function googleLogin(clientId, idToken, trustedDeviceToken) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/google`, { idToken, trustedDeviceToken });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.googleLogin = googleLogin;
    /** Google OAuth login via server-side authorization code (public). */
    async function googleCodeLogin(clientId, code, redirectUri) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/google-code`, { code, redirectUri });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.googleCodeLogin = googleCodeLogin;
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
    async function appleLogin(clientId, identityToken, opts) {
        const body = Object.assign({ identityToken }, opts);
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/apple`, body);
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.appleLogin = appleLogin;
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
    async function refreshToken(clientId, refreshToken) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/refresh`, { refreshToken });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.refreshToken = refreshToken;
    /**
     * Revoke a refresh token's entire family server-side (that device's whole rotation
     * chain) and clear the in-memory bearer token. Idempotent — always resolves to
     * `{ success: true }`, never revealing whether the token existed. Call on explicit
     * sign-out. Persisted tokens in the host's own storage must be cleared separately.
     */
    async function logout(clientId, refreshToken) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/logout`, { refreshToken });
        setBearerToken(undefined);
        invalidateCache();
        return res;
    }
    authKit.logout = logout;
    /** Send a magic link email to the user (public). */
    async function sendMagicLink(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/magic-link/send`, data);
    }
    authKit.sendMagicLink = sendMagicLink;
    /**
     * Verify a magic link token and authenticate/create the user (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
     *
     * @param trustedDeviceToken - Optional. See {@link login}.
     */
    async function verifyMagicLink(clientId, token, trustedDeviceToken) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/magic-link/verify`, { token, trustedDeviceToken });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.verifyMagicLink = verifyMagicLink;
    /** Send phone verification code (public). */
    async function sendPhoneCode(clientId, phoneNumber) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/phone/send-code`, { phoneNumber });
    }
    authKit.sendPhoneCode = sendPhoneCode;
    /**
     * Verify phone verification code (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.
     *
     * @param trustedDeviceToken - Optional. See {@link login}.
     */
    async function verifyPhoneCode(clientId, phoneNumber, code, trustedDeviceToken) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/phone/verify`, { phoneNumber, code, trustedDeviceToken });
        setBearerToken(res.token);
        invalidateCache();
        return res;
    }
    authKit.verifyPhoneCode = verifyPhoneCode;
    /** Send a WhatsApp verification deep-link (public). */
    async function sendWhatsApp(clientId, body = {}) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/send`, body);
    }
    authKit.sendWhatsApp = sendWhatsApp;
    /**
     * Manually verify WhatsApp token if inbound webhook path is unavailable (legacy/public fallback).
     *
     * Not gated by step-up MFA — this endpoint only confirms the code, it never issues a
     * session/bearer token, so there is nothing to challenge. {@link exchangeWhatsAppSession}
     * is the WhatsApp method that's gated.
     */
    async function verifyWhatsApp(clientId, token, phoneNumber) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/verify`, { token, phoneNumber });
    }
    authKit.verifyWhatsApp = verifyWhatsApp;
    /** Poll WhatsApp verification status for a token (public). */
    async function getWhatsAppStatus(clientId, token) {
        const encodedToken = encodeURIComponent(token);
        return request(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/status?token=${encodedToken}`);
    }
    authKit.getWhatsAppStatus = getWhatsAppStatus;
    /**
     * Exchange a verified WhatsApp token for an Auth Kit session (public).
     *
     * Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape. This is
     * the WhatsApp method that needs `trustedDeviceToken`, not {@link verifyWhatsApp} (which
     * never issues a session).
     *
     * @param trustedDeviceToken - Optional. See {@link login}.
     */
    async function exchangeWhatsAppSession(clientId, token, sessionKey, trustedDeviceToken) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/whatsapp/exchange-session`, { token, sessionKey, trustedDeviceToken });
        setBearerToken(res.token);
        invalidateCache();
        return res;
    }
    authKit.exchangeWhatsAppSession = exchangeWhatsAppSession;
    /** Send an SMS click-to-verify link (public). */
    async function sendSmsVerify(clientId, body) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/sms/send`, body);
    }
    authKit.sendSmsVerify = sendSmsVerify;
    /** Verify an SMS click-to-verify token via API (public). */
    async function verifySms(clientId, token, phoneNumber) {
        const payload = { token };
        if (phoneNumber)
            payload.phoneNumber = phoneNumber;
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/sms/verify`, payload);
    }
    authKit.verifySms = verifySms;
    /** Upsert contact identity after lightweight verification (public). */
    async function upsertContact(clientId, body) {
        return post(`/authkit/${encodeURIComponent(clientId)}/contact/upsert`, body);
    }
    authKit.upsertContact = upsertContact;
    /* ===================================
     * Password Reset (Public flows)
     * =================================== */
    async function requestPasswordReset(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/reset-password`, data);
    }
    authKit.requestPasswordReset = requestPasswordReset;
    async function verifyResetToken(clientId, token) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/verify-reset-token`, { token });
    }
    authKit.verifyResetToken = verifyResetToken;
    /**
     * Complete a password reset / invite acceptance. On invite acceptance under
     * `verify-auto-login` the server returns a session — adopt it so the caller is logged
     * straight in (plain resets return no token and leave the bearer untouched).
     */
    async function completePasswordReset(clientId, token, newPassword) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/complete-reset`, { token, newPassword });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.completePasswordReset = completePasswordReset;
    /* ===================================
     * Email Verification
     * =================================== */
    async function sendEmailVerification(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/send-verification`, data);
    }
    authKit.sendEmailVerification = sendEmailVerification;
    /** Verify an email token; under `verify-auto-login` the server returns a session — adopt it. */
    async function verifyEmail(clientId, token) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/auth/verify-email`, { token });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.verifyEmail = verifyEmail;
    async function resendEmailVerification(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/resend-verification`, data);
    }
    authKit.resendEmailVerification = resendEmailVerification;
    /* ===================================
     * Account Management (Authenticated)
     * =================================== */
    async function getProfile(clientId) {
        return request(`/authkit/${encodeURIComponent(clientId)}/account/profile`);
    }
    authKit.getProfile = getProfile;
    /** Update the authenticated user's profile and replace the bearer token when refreshed claims are returned. */
    async function updateProfile(clientId, data) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/account/update-profile`, data);
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.updateProfile = updateProfile;
    async function changePassword(clientId, currentPassword, newPassword) {
        return post(`/authkit/${encodeURIComponent(clientId)}/account/change-password`, { currentPassword, newPassword });
    }
    authKit.changePassword = changePassword;
    async function changeEmail(clientId, newEmail, password, redirectUrl) {
        return post(`/authkit/${encodeURIComponent(clientId)}/account/change-email`, { newEmail, password, redirectUrl });
    }
    authKit.changeEmail = changeEmail;
    async function verifyEmailChange(clientId, token) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/account/verify-email-change`, { token });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.verifyEmailChange = verifyEmailChange;
    async function updatePhone(clientId, phoneNumber, verificationCode) {
        return post(`/authkit/${encodeURIComponent(clientId)}/account/update-phone`, { phoneNumber, verificationCode });
    }
    authKit.updatePhone = updatePhone;
    async function deleteAccount(clientId, password, confirmText) {
        // DELETE with body using requestWithOptions since del() doesn't send body
        const path = `/authkit/${encodeURIComponent(clientId)}/account/delete`;
        const res = await post(path, { password, confirmText }); // If backend truly requires DELETE, switch to requestWithOptions
        return res;
    }
    authKit.deleteAccount = deleteAccount;
    /* ===================================
     * Step-up MFA — completing a challenged login (public)
     *
     * Called after login() throws MFA_REQUIRED. mfaSessionToken is short-lived (10 min) and
     * single-use — burned on 5 failed attempts (MFA_TOO_MANY_ATTEMPTS) or on success.
     * challenge/send can be called again on the same token (while unexpired/unburned) to
     * switch factors or resend.
     * =================================== */
    /** Send (or resend) an MFA challenge code to the given factor (public). */
    async function mfaChallengeSend(clientId, mfaSessionToken, factor) {
        return post(`/authkit/${encodeURIComponent(clientId)}/mfa/challenge/send`, { mfaSessionToken, factor });
    }
    authKit.mfaChallengeSend = mfaChallengeSend;
    /**
     * Verify an MFA challenge code and finalize the login (public). On success this behaves
     * like {@link login} — the bearer token is adopted and the cache invalidated.
     *
     * @param trustDevice - When `true`, the response includes `trustedDeviceToken` — persist
     *   it and pass it to future {@link login} calls to skip the challenge on this device.
     */
    async function mfaChallengeVerify(clientId, mfaSessionToken, code, trustDevice, deviceLabel) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/mfa/challenge/verify`, { mfaSessionToken, code, trustDevice, deviceLabel });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.mfaChallengeVerify = mfaChallengeVerify;
    /**
     * Finalize a challenged login using a single-use recovery code instead of a sent code
     * (public). Same finalize-session behaviour as {@link mfaChallengeVerify}.
     */
    async function mfaRecoveryCode(clientId, mfaSessionToken, code, trustDevice, deviceLabel) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/mfa/challenge/recovery-code`, { mfaSessionToken, code, trustDevice, deviceLabel });
        if (res.token) {
            setBearerToken(res.token);
            invalidateCache();
        }
        return res;
    }
    authKit.mfaRecoveryCode = mfaRecoveryCode;
    /* ===================================
     * Step-up MFA — factor management (Authenticated)
     * =================================== */
    /** List enrolled factors and recovery-code count for the current user (authenticated). */
    async function getMfaFactors(clientId) {
        return request(`/authkit/${encodeURIComponent(clientId)}/mfa/factors`);
    }
    authKit.getMfaFactors = getMfaFactors;
    /** Begin email-factor enrollment; sends a code to the account's existing email (authenticated). */
    async function enrollEmailMfa(clientId) {
        return post(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/email/enroll`, {});
    }
    authKit.enrollEmailMfa = enrollEmailMfa;
    /** Confirm email-factor enrollment with the code sent by {@link enrollEmailMfa} (authenticated). */
    async function confirmEmailMfa(clientId, mfaSessionToken, code) {
        return post(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/email/confirm`, { mfaSessionToken, code });
    }
    authKit.confirmEmailMfa = confirmEmailMfa;
    /** Begin SMS-factor enrollment; sends a code to the given phone number (authenticated). */
    async function enrollSmsMfa(clientId, phoneNumber) {
        return post(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/sms/enroll`, { phoneNumber });
    }
    authKit.enrollSmsMfa = enrollSmsMfa;
    /** Confirm SMS-factor enrollment with the code sent by {@link enrollSmsMfa} (authenticated). */
    async function confirmSmsMfa(clientId, mfaSessionToken, code) {
        return post(`/authkit/${encodeURIComponent(clientId)}/mfa/factors/sms/confirm`, { mfaSessionToken, code });
    }
    authKit.confirmSmsMfa = confirmSmsMfa;
    /**
     * Generate a fresh set of recovery codes, invalidating any previous set (authenticated).
     * Returned **in plaintext, exactly once** — nothing else in the API ever returns them
     * again, so the caller must display/export them immediately.
     */
    async function generateMfaRecoveryCodes(clientId, password) {
        return post(`/authkit/${encodeURIComponent(clientId)}/mfa/recovery-codes/generate`, { password });
    }
    authKit.generateMfaRecoveryCodes = generateMfaRecoveryCodes;
    /** Remove an enrolled MFA factor (authenticated). Server route is DELETE with a body. */
    async function removeMfaFactor(clientId, factor, password) {
        const path = `/authkit/${encodeURIComponent(clientId)}/mfa/factors/${factor}`;
        return requestWithOptions(path, { method: 'DELETE', body: JSON.stringify({ password }) });
    }
    authKit.removeMfaFactor = removeMfaFactor;
    /** List devices trusted to skip MFA challenges for the current user (authenticated). */
    async function listTrustedDevices(clientId) {
        return request(`/authkit/${encodeURIComponent(clientId)}/mfa/trusted-devices`);
    }
    authKit.listTrustedDevices = listTrustedDevices;
    /** Revoke a single trusted device by id (authenticated). */
    async function revokeTrustedDevice(clientId, id) {
        return del(`/authkit/${encodeURIComponent(clientId)}/mfa/trusted-devices/${encodeURIComponent(id)}`);
    }
    authKit.revokeTrustedDevice = revokeTrustedDevice;
    /* ===================================
     * Collection-based AuthKit
     * =================================== */
    /**
     * Load the **public** AuthKit config for a client (no auth). Returns branding +
     * the public security subset (`security.passwordPolicy` + `security.session`);
     * `security.lockout` is admin-only and never included here. Use this in the login
     * UI to render password checklists and drive idle sign-out.
     */
    async function load(authKitId) {
        const path = `/authKit/${encodeURIComponent(authKitId)}/config`;
        return request(path);
    }
    authKit.load = load;
    /** Get the full AuthKit config, including admin-only fields like `security.lockout` (admin auth). */
    async function get(collectionId, authKitId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`;
        return request(path);
    }
    authKit.get = get;
    async function list(collectionId, admin) {
        const base = admin ? "/admin" : "/public";
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/authKit`;
        return request(path);
    }
    authKit.list = list;
    /** Create an AuthKit client config (admin). Accepts the account `security` policy — see {@link AuthKitConfigInput}. */
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit`;
        return post(path, data);
    }
    authKit.create = create;
    /**
     * Update an AuthKit client config (admin). This is how the account **security
     * policy** is written — pass a `security` block ({@link AuthKitSecurityConfig}).
     * The server validates it and enforces it; the login UI reads the public subset
     * back via {@link load}.
     */
    async function update(collectionId, authKitId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`;
        return put(path, data);
    }
    authKit.update = update;
    async function remove(collectionId, authKitId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit/${encodeURIComponent(authKitId)}`;
        return del(path);
    }
    authKit.remove = remove;
})(authKit || (authKit = {}));
