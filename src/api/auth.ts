import { post, request, setBearerToken, getApiHeaders } from "../http"

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
  user: Record<string, any>
  owner: Record<string, any>
  account: Record<string, any>
  location: Record<string, any>
}

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
   * Gets current account information for the logged in user.
   * Returns user, owner, account, and location objects.
   */
  export async function getAccount(): Promise<AccountInfoResponse> {
    return request<AccountInfoResponse>("/public/auth/account")
  }
}
