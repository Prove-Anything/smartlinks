// src/http.ts
// This module replaces the ApiClient constructor. It keeps baseURL, apiKey, bearerToken
// in module-scope variables, and provides a shared `request<T>(path)` helper that will
// be used by all namespaced files (collection.ts, product.ts, etc.).

let baseURL: string | null = null
let apiKey: string | undefined = undefined
let bearerToken: string | undefined = undefined

/**
 * Call this once (e.g. at app startup) to configure baseURL/auth. 
 * 
 * @param options.baseURL - The root URL of the Smartlinks API (e.g. "https://smartlinks.app/api/v1")
 * @param options.apiKey - (Optional) API key for X-API-Key header
 * @param options.bearerToken - (Optional) Bearer token for AUTHORIZATION header
 */
export function initializeApi(options: {
  baseURL: string
  apiKey?: string
  bearerToken?: string
}): void {
  baseURL = options.baseURL.replace(/\/+\$/, "") // trim trailing slash
  apiKey = options.apiKey
  bearerToken = options.bearerToken
}

/**
 * Internal helper that performs a GET request to \`\${baseURL}\${path}\`, 
 * injecting headers for apiKey or bearerToken if present. 
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function request<T>(path: string): Promise<T> {
  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (apiKey) {
    headers["X-API-Key"] = apiKey
  }
  if (bearerToken) {
    headers["AUTHORIZATION"] = `Bearer ${bearerToken}`
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  })

  if (!response.ok) {
    // Try to parse ErrorResponse; if that fails, throw generic
    try {
      const errBody = (await response.json()) as import("./types/error").ErrorResponse
      throw new Error(`Error ${errBody.code}: ${errBody.message}`)
    } catch {
      throw new Error(`Request to ${url} failed with status ${response.status}`)
    }
  }

  return (await response.json()) as T
}

/**
 * Internal helper that performs a POST request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function post<T>(
  path: string,
  body: any,
  extraHeaders?: Record<string, string>
): Promise<T> {
  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = extraHeaders ? { ...extraHeaders } : {}

  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`

  // Only set Content-Type for non-FormData bodies
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  })

  if (!response.ok) {
    try {
      const errBody = (await response.json()) as import("./types/error").ErrorResponse
      throw new Error(`Error ${errBody.code}: ${errBody.message}`)
    } catch {
      throw new Error(`Request to ${url} failed with status ${response.status}`)
    }
  }

  return (await response.json()) as T
}

/**
 * Internal helper that performs a PUT request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * If body is FormData, Content-Type is not set.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function put<T>(
  path: string,
  body: any,
  extraHeaders?: Record<string, string>
): Promise<T> {
  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = extraHeaders ? { ...extraHeaders } : {}

  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`

  // Only set Content-Type for non-FormData bodies
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  })

  if (!response.ok) {
    try {
      const errBody = (await response.json()) as import("./types/error").ErrorResponse
      throw new Error(`Error ${errBody.code}: ${errBody.message}`)
    } catch {
      throw new Error(`Request to ${url} failed with status ${response.status}`)
    }
  }

  return (await response.json()) as T
}

/**
 * Internal helper that performs a request to `${baseURL}${path}` with custom options,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function requestWithOptions<T>(
  path: string,
  options: RequestInit
): Promise<T> {
  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }
  const url = `${baseURL}${path}`

  // Safely merge headers, converting Headers/init to Record<string, string>
  let extraHeaders: Record<string, string> = {}
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        extraHeaders[key] = value
      })
    } else if (Array.isArray(options.headers)) {
      for (const [key, value] of options.headers) {
        extraHeaders[key] = value
      }
    } else {
      extraHeaders = { ...(options.headers as Record<string, string>) }
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
    ...(bearerToken ? { "AUTHORIZATION": `Bearer ${bearerToken}` } : {}),
    ...extraHeaders,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    try {
      const errBody = (await response.json()) as import("./types/error").ErrorResponse
      throw new Error(`Error ${errBody.code}: ${errBody.message}`)
    } catch {
      throw new Error(`Request to ${url} failed with status ${response.status}`)
    }
  }

  return (await response.json()) as T
}

/**
 * Internal helper that performs a DELETE request to `${baseURL}${path}`,
 * injecting headers for apiKey or bearerToken if present.
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function del<T>(
  path: string,
  extraHeaders?: Record<string, string>
): Promise<T> {
  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = extraHeaders ? { ...extraHeaders } : {}

  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`

  const response = await fetch(url, {
    method: "DELETE",
    headers,
  })

  if (!response.ok) {
    try {
      const errBody = (await response.json()) as import("./types/error").ErrorResponse
      throw new Error(`Error ${errBody.code}: ${errBody.message}`)
    } catch {
      throw new Error(`Request to ${url} failed with status ${response.status}`)
    }
  }

  // If the response is empty, just return undefined
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

/**
 * Returns the common headers used for API requests, including apiKey and bearerToken if set.
 */
export function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`
  return headers
}
