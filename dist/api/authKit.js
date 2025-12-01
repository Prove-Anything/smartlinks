import { request, post, put, del, setBearerToken } from "../http";
/**
 * Namespace containing helper functions for the new AuthKit API.
 * Legacy collection-based authKit helpers retained (marked as *Legacy*).
 */
export var authKit;
(function (authKit) {
    /* ===================================
     * Authentication (Per client)
     * =================================== */
    /** Login with email + password (public). */
    async function login(clientId, email, password) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/login`, { email, password });
    }
    authKit.login = login;
    /** Register a new user (public). */
    async function register(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/register`, data);
    }
    authKit.register = register;
    /** Google OAuth login (public). */
    async function googleLogin(clientId, idToken) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/google`, { idToken });
    }
    authKit.googleLogin = googleLogin;
    /** Send a magic link email to the user (public). */
    async function sendMagicLink(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/magic-link/send`, data);
    }
    authKit.sendMagicLink = sendMagicLink;
    /** Verify a magic link token and authenticate/create the user (public). */
    async function verifyMagicLink(clientId, token) {
        const res = await post(`/authkit/${encodeURIComponent(clientId)}/magic-link/verify`, { token });
        if (res.token)
            setBearerToken(res.token);
        return res;
    }
    authKit.verifyMagicLink = verifyMagicLink;
    /** Send phone verification code (public). */
    async function sendPhoneCode(clientId, phoneNumber) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/phone/send-code`, { phoneNumber });
    }
    authKit.sendPhoneCode = sendPhoneCode;
    /** Verify phone verification code (public). */
    async function verifyPhoneCode(clientId, phoneNumber, code) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/phone/verify`, { phoneNumber, code });
    }
    authKit.verifyPhoneCode = verifyPhoneCode;
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
    async function completePasswordReset(clientId, token, newPassword) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/complete-reset`, { token, newPassword });
    }
    authKit.completePasswordReset = completePasswordReset;
    /* ===================================
     * Email Verification
     * =================================== */
    async function sendEmailVerification(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/send-verification`, data);
    }
    authKit.sendEmailVerification = sendEmailVerification;
    async function verifyEmail(clientId, token) {
        return post(`/authkit/${encodeURIComponent(clientId)}/auth/verify-email`, { token });
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
    async function updateProfile(clientId, data) {
        return post(`/authkit/${encodeURIComponent(clientId)}/account/update-profile`, data);
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
        if (res.token)
            setBearerToken(res.token);
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
     * Collection-based AuthKit
     * =================================== */
    async function load(authKitId) {
        const path = `/authKit/${encodeURIComponent(authKitId)}/config`;
        return request(path);
    }
    authKit.load = load;
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
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/authKit`;
        return post(path, data);
    }
    authKit.create = create;
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
