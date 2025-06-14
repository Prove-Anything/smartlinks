import { post, setBearerToken, getApiHeaders } from "../http";
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
})(auth || (auth = {}));
