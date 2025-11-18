import { post, request, setBearerToken, getApiHeaders } from "../http"
import type { UserAccountRegistrationRequest } from "../types/auth"

export type LoginResponse = {
  id: string
  name: string
  email: string
  bearerToken: string
  account: Record<string, any>
}

export type VerifyTokenResponse = {
  valid: boolean
  id?: string
  name?: string
  email?: string
  account?: Record<string, any>
}

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
  }
}


/*
  user: Record<string, any>
  owner: Record<string, any>
  account: Record<string, any>
  location: Record<string, any>
}
*/
export namespace auth {
  /**
   * Login with email and password.
   * Sets the bearerToken for subsequent API calls.
   */
  export async function login(email: string, password: string): Promise<LoginResponse> {
    const res = await post<LoginResponse>("/public/auth/login", { email, password })
    setBearerToken(res.bearerToken)
    return res
  }

  /**
   * Logout (clears bearerToken for future API calls).
   */
  export function logout(): void {
    setBearerToken(undefined)
  }

  /**
   * Verifies the current bearerToken (or a provided token).
   * Returns user/account info if valid.
   */
  export async function verifyToken(token?: string): Promise<VerifyTokenResponse> {
    // Use the provided token, or the one from getApiHeaders
    const headers = { ...getApiHeaders() }
    if (token) {
      headers["AUTHORIZATION"] = `Bearer ${token}`
    }
    const result = await post<VerifyTokenResponse>("/public/auth/verify", {}, headers)
    if (token && result.valid) {
      setBearerToken(token)
    }
    return result
  }

  /**
   * Requests an admin JWT for the current user and a specific collection
   * Returns JWT if valid.
   */
  export async function requestAdminJWT(collectionId: string): Promise<string> {
    // Use the provided token, or the one from getApiHeaders
    return post<string>("/admin/auth/requestJWT", {collectionId})
  }


  /**
   * Requests a JWT for the current user and a specific collection/product/proof
   * Validates if the user has access to the resource, and returns a JWT
   */
  export async function requestPublicJWT(collectionId: string, productId: string, proofId: string): Promise<string> {
    // Use the provided token, or the one from getApiHeaders
    return post<string>("/public/auth/requestJWT", {collectionId, productId, proofId})
  }


  /**
   * Tries to register a new user account. Can return a bearer token, or a Firebase token
   */
  export async function registerUser(user: UserAccountRegistrationRequest): Promise<LoginResponse> {
    // Use the provided token, or the one from getApiHeaders
    const res = await post<LoginResponse>("/public/auth/register", user)
    if (res.bearerToken)
      setBearerToken(res.bearerToken)
    return res
  }


  /**
   * Admin: Get a user bearer token (impersonation/automation).
   * POST /admin/auth/userToken
   * All fields are optional; at least one identifier should be provided.
   */
  export async function getUserToken(opts?: {
    email?: string
    collectionId?: string
    userId?: string
    expiry?: string
  }): Promise<{ bearerToken: string }> {
    const body = opts ?? {}
    return post<{ bearerToken: string }>("/admin/auth/getUserToken", body)
  }

  /**
   * Gets current account information for the logged in user.
   * Returns user, owner, account, and location objects.
   */
  export async function getAccount(): Promise<AccountInfoResponse> {
    return request<AccountInfoResponse>("/public/auth/account")
  }
}
