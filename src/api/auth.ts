import { post, setBearerToken } from "../http"

type LoginResponse = {
  id: string
  name: string
  email: string
  bearerToken: string
  account: Record<string, any>
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
}
