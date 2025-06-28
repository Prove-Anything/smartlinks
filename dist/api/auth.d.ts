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
    accessType: string;
    analyticsCode: string;
    analyticsId: string;
    auth_time: number;
    baseCollectionId: string;
    clientType: string;
    email: string;
    email_verified: boolean;
    features: {
        actionLogger: boolean;
        adminCollections: boolean;
        adminApps: boolean;
        apiKeys: boolean;
        adminUsers: boolean;
        [key: string]: boolean;
    };
    iat: number;
    id: string;
    iss: string;
    location: string | null;
    name: string;
    picture: string;
    sites: {
        [siteName: string]: boolean;
    };
    sub: string;
    uid: string;
    user_id: string;
    whitelabel: {
        [key: string]: any;
    };
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
