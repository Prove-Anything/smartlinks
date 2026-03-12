import { post, request, setBearerToken, getApiHeaders, hasAuthCredentials, isProxyEnabled } from "../http"
import { SmartlinksApiError } from "../types/error"
import type { UserAccountRegistrationRequest, AccountInfoResponse, AuthLocation, AuthLocationCacheOptions } from "../types/auth"

export type { AccountInfoResponse, AuthLocation, AuthLocationCacheOptions } from "../types/auth"

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

const DEFAULT_AUTH_LOCATION_CACHE_KEY = 'smartlinks.auth.location'
const DEFAULT_AUTH_LOCATION_TTL_MS = 30 * 60 * 1000

type CachedAuthLocation = {
  value: AuthLocation
  expiresAt: number
}

let inMemoryAuthLocationCache: CachedAuthLocation | null = null

function getSessionStorage(): Storage | undefined {
  try {
    if (typeof sessionStorage !== 'undefined') return sessionStorage
  } catch {
  }

  return undefined
}

function readCachedLocation(storageKey: string): AuthLocation | null {
  const now = Date.now()

  if (inMemoryAuthLocationCache && inMemoryAuthLocationCache.expiresAt > now) {
    return inMemoryAuthLocationCache.value
  }

  const storage = getSessionStorage()
  if (!storage) return null

  try {
    const raw = storage.getItem(storageKey)
    if (!raw) return null

    const cached = JSON.parse(raw) as CachedAuthLocation
    if (!cached?.value || typeof cached.expiresAt !== 'number') {
      storage.removeItem(storageKey)
      return null
    }

    if (cached.expiresAt <= now) {
      storage.removeItem(storageKey)
      return null
    }

    inMemoryAuthLocationCache = cached
    return cached.value
  } catch {
    return null
  }
}

function writeCachedLocation(storageKey: string, value: AuthLocation, ttlMs: number): void {
  const cached: CachedAuthLocation = {
    value,
    expiresAt: Date.now() + ttlMs,
  }

  inMemoryAuthLocationCache = cached

  const storage = getSessionStorage()
  if (!storage) return

  try {
    storage.setItem(storageKey, JSON.stringify(cached))
  } catch {
  }
}

function clearCachedLocationInternal(storageKey: string): void {
  inMemoryAuthLocationCache = null
  const storage = getSessionStorage()
  try {
    storage?.removeItem(storageKey)
  } catch {
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
  export async function getLocation(options: AuthLocationCacheOptions = {}): Promise<AuthLocation> {
    const cache = options.cache ?? 'session'
    const ttlMs = options.ttlMs ?? DEFAULT_AUTH_LOCATION_TTL_MS
    const storageKey = options.storageKey ?? DEFAULT_AUTH_LOCATION_CACHE_KEY

    if (cache === 'session' && !options.forceRefresh) {
      const cached = readCachedLocation(storageKey)
      if (cached) return cached
    }

    const location = await request<AuthLocation>("/public/auth/location")

    if (cache === 'session') {
      writeCachedLocation(storageKey, location, ttlMs)
    }

    return location
  }

  /**
   * Clears the cached anonymous auth location, if present.
   */
  export function clearCachedLocation(storageKey: string = DEFAULT_AUTH_LOCATION_CACHE_KEY): void {
    clearCachedLocationInternal(storageKey)
  }

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
  export async function getAccount(): Promise<AccountInfoResponse> {
    if (!hasAuthCredentials() && !isProxyEnabled()) {
      throw new SmartlinksApiError(
        'Not authenticated: no bearer token or API key is set.',
        401,
        { code: 401, errorCode: 'NOT_AUTHENTICATED', message: 'Not authenticated: no bearer token or API key is set.', details: { local: true } },
      )
    }
    return request<AccountInfoResponse>("/public/auth/account")
  }
}
