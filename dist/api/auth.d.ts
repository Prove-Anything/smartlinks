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
export type AccountInfoResponse = {
    user: Record<string, any>;
    owner: Record<string, any>;
    account: Record<string, any>;
    location: Record<string, any>;
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
     * Gets current account information for the logged in user.
     * Returns user, owner, account, and location objects.
     */
    function getAccount(): Promise<AccountInfoResponse>;
}
