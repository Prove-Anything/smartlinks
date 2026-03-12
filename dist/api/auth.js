import { post, request, setBearerToken, getApiHeaders, hasAuthCredentials, isProxyEnabled } from "../http";
import { SmartlinksApiError } from "../types/error";
const DEFAULT_AUTH_LOCATION_CACHE_KEY = 'smartlinks.auth.location';
const DEFAULT_AUTH_LOCATION_TTL_MS = 30 * 60 * 1000;
let inMemoryAuthLocationCache = null;
function getSessionStorage() {
    try {
        if (typeof sessionStorage !== 'undefined')
            return sessionStorage;
    }
    catch (_a) {
    }
    return undefined;
}
function readCachedLocation(storageKey) {
    const now = Date.now();
    if (inMemoryAuthLocationCache && inMemoryAuthLocationCache.expiresAt > now) {
        return inMemoryAuthLocationCache.value;
    }
    const storage = getSessionStorage();
    if (!storage)
        return null;
    try {
        const raw = storage.getItem(storageKey);
        if (!raw)
            return null;
        const cached = JSON.parse(raw);
        if (!(cached === null || cached === void 0 ? void 0 : cached.value) || typeof cached.expiresAt !== 'number') {
            storage.removeItem(storageKey);
            return null;
        }
        if (cached.expiresAt <= now) {
            storage.removeItem(storageKey);
            return null;
        }
        inMemoryAuthLocationCache = cached;
        return cached.value;
    }
    catch (_a) {
        return null;
    }
}
function writeCachedLocation(storageKey, value, ttlMs) {
    const cached = {
        value,
        expiresAt: Date.now() + ttlMs,
    };
    inMemoryAuthLocationCache = cached;
    const storage = getSessionStorage();
    if (!storage)
        return;
    try {
        storage.setItem(storageKey, JSON.stringify(cached));
    }
    catch (_a) {
    }
}
function clearCachedLocationInternal(storageKey) {
    inMemoryAuthLocationCache = null;
    const storage = getSessionStorage();
    try {
        storage === null || storage === void 0 ? void 0 : storage.removeItem(storageKey);
    }
    catch (_a) {
    }
}
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
     * Tries to register a new user account. Can return a bearer token, or a Firebase token
     */
    async function registerUser(user) {
        // Use the provided token, or the one from getApiHeaders
        const res = await post("/public/auth/register", user);
        if (res.bearerToken)
            setBearerToken(res.bearerToken);
        return res;
    }
    auth.registerUser = registerUser;
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
     * Gets a best-effort coarse location for the current anonymous caller.
     *
     * This endpoint is typically IP-derived and is useful when the user is not
     * logged in but you still want country/location context for content rules,
     * analytics enrichment, or regional defaults.
     *
     * Returns fields such as `country`, `latitude`, `longitude`, and `area`
     * when available.
     *
     * By default the result is cached in session storage for 30 minutes so apps
     * can reuse coarse location context without repeatedly hitting the endpoint.
     */
    async function getLocation(options = {}) {
        var _a, _b, _c;
        const cache = (_a = options.cache) !== null && _a !== void 0 ? _a : 'session';
        const ttlMs = (_b = options.ttlMs) !== null && _b !== void 0 ? _b : DEFAULT_AUTH_LOCATION_TTL_MS;
        const storageKey = (_c = options.storageKey) !== null && _c !== void 0 ? _c : DEFAULT_AUTH_LOCATION_CACHE_KEY;
        if (cache === 'session' && !options.forceRefresh) {
            const cached = readCachedLocation(storageKey);
            if (cached)
                return cached;
        }
        const location = await request("/public/auth/location");
        if (cache === 'session') {
            writeCachedLocation(storageKey, location, ttlMs);
        }
        return location;
    }
    auth.getLocation = getLocation;
    /**
     * Clears the cached anonymous auth location, if present.
     */
    function clearCachedLocation(storageKey = DEFAULT_AUTH_LOCATION_CACHE_KEY) {
        clearCachedLocationInternal(storageKey);
    }
    auth.clearCachedLocation = clearCachedLocation;
    /**
     * Gets current account information for the logged in user.
     * Returns user, owner, account, and location objects.
     *
     * When the caller is authenticated, prefer `account.location` from this
     * response. For anonymous callers, use `auth.getLocation()` instead.
     *
     * Short-circuits immediately (no network request) when the SDK has no
     * bearer token or API key set — the server would return 401 anyway.
     * Throws a `SmartlinksApiError` with `statusCode 401` and
     * `details.local = true` so callers can distinguish "never authenticated"
     * from an actual server-side token rejection.
     *
     * This short-circuit is skipped when proxy mode is enabled, because in that
     * case credentials are held by the parent frame and the local SDK may have
     * no token set yet — the request must be forwarded to the parent to determine
     * whether the user is authenticated.
     */
    async function getAccount() {
        if (!hasAuthCredentials() && !isProxyEnabled()) {
            throw new SmartlinksApiError('Not authenticated: no bearer token or API key is set.', 401, { code: 401, errorCode: 'NOT_AUTHENTICATED', message: 'Not authenticated: no bearer token or API key is set.', details: { local: true } });
        }
        return request("/public/auth/account");
    }
    auth.getAccount = getAccount;
})(auth || (auth = {}));
