import { post, request, setBearerToken, getApiHeaders } from "../http";
/*
  user: Record<string, any>
  owner: Record<string, any>
  account: Record<string, any>
  location: Record<string, any>
}
*/
export var auth;
(function (auth) {
    /**
     * Login with email and password.
     * Sets the bearerToken for subsequent API calls.
     */
    async function login(email, password) {
        const res = await post("/public/auth/login", { email, password });
        setBearerToken(res.bearerToken);
        return res;
    }
    auth.login = login;
    /**
     * Logout (clears bearerToken for future API calls).
     */
    function logout() {
        setBearerToken(undefined);
    }
    auth.logout = logout;
    /**
     * Verifies the current bearerToken (or a provided token).
     * Returns user/account info if valid.
     */
    async function verifyToken(token) {
        // Use the provided token, or the one from getApiHeaders
        const headers = Object.assign({}, getApiHeaders());
        if (token) {
            headers["AUTHORIZATION"] = `Bearer ${token}`;
        }
        const result = await post("/public/auth/verify", {}, headers);
        if (token && result.valid) {
            setBearerToken(token);
        }
        return result;
    }
    auth.verifyToken = verifyToken;
    /**
     * Requests an admin JWT for the current user and a specific collection
     * Returns JWT if valid.
     */
    async function requestAdminJWT(collectionId) {
        // Use the provided token, or the one from getApiHeaders
        return post("/admin/auth/requestJWT", { collectionId });
    }
    auth.requestAdminJWT = requestAdminJWT;
    /**
     * Requests a JWT for the current user and a specific collection/product/proof
     * Validates if the user has access to the resource, and returns a JWT
     */
    async function requestPublicJWT(collectionId, productId, proofId) {
        // Use the provided token, or the one from getApiHeaders
        return post("/public/auth/requestJWT", { collectionId, productId, proofId });
    }
    auth.requestPublicJWT = requestPublicJWT;
    /**
     * Admin: Get a user bearer token (impersonation/automation).
     * POST /admin/auth/userToken
     * All fields are optional; at least one identifier should be provided.
     */
    async function getUserToken(opts) {
        const body = opts !== null && opts !== void 0 ? opts : {};
        return post("/admin/auth/getUserToken", body);
    }
    auth.getUserToken = getUserToken;
    /**
     * Gets current account information for the logged in user.
     * Returns user, owner, account, and location objects.
     */
    async function getAccount() {
        return request("/public/auth/account");
    }
    auth.getAccount = getAccount;
})(auth || (auth = {}));
