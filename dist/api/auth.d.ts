import type { UserAccountRegistrationRequest, AccountInfoResponse, AuthLocation, AuthLocationCacheOptions } from "../types/auth";
export type { AccountInfoResponse, AuthLocation, AuthLocationCacheOptions } from "../types/auth";
export type LoginResponse = {
    id: string;
    name: string;
    email: string;
    bearerToken: string;
    account: Record<string, any>;
};
export type VerifyTokenResponse = {
    valid: boolean;
    id?: string;
    name?: string;
    email?: string;
    account?: Record<string, any>;
};
export declare namespace auth {
    /**
     * Login with email and password.
     * Sets the bearerToken for subsequent API calls.
     */
    function login(email: string, password: string): Promise<LoginResponse>;
    /**
     * Logout (clears bearerToken for future API calls).
     */
    function logout(): void;
    /**
     * Verifies the current bearerToken (or a provided token).
     * Returns user/account info if valid.
     */
    function verifyToken(token?: string): Promise<VerifyTokenResponse>;
    /**
     * Requests an admin JWT for the current user and a specific collection
     * Returns JWT if valid.
     */
    function requestAdminJWT(collectionId: string): Promise<string>;
    /**
     * Requests a JWT for the current user and a specific collection/product/proof
     * Validates if the user has access to the resource, and returns a JWT
     */
    function requestPublicJWT(collectionId: string, productId: string, proofId: string): Promise<string>;
    /**
     * Tries to register a new user account. Can return a bearer token, or a Firebase token
     */
    function registerUser(user: UserAccountRegistrationRequest): Promise<LoginResponse>;
    /**
     * Admin: Get a user bearer token (impersonation/automation).
     * POST /admin/auth/userToken
     * All fields are optional; at least one identifier should be provided.
     */
    function getUserToken(opts?: {
        email?: string;
        collectionId?: string;
        userId?: string;
        expiry?: string;
    }): Promise<{
        bearerToken: string;
    }>;
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
    function getLocation(options?: AuthLocationCacheOptions): Promise<AuthLocation>;
    /**
     * Clears the cached anonymous auth location, if present.
     */
    function clearCachedLocation(storageKey?: string): void;
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
    function getAccount(): Promise<AccountInfoResponse>;
}
