// src/http.ts
// This module replaces the ApiClient constructor. It keeps baseURL, apiKey, bearerToken
// in module-scope variables, and provides a shared `request<T>(path)` helper that will
// be used by all namespaced files (collection.ts, product.ts, etc.).

let baseURL: string | null = null
let apiKey: string | undefined = undefined
let bearerToken: string | undefined = undefined
let proxyMode: boolean = false
let ngrokSkipBrowserWarning: boolean = false
let extraHeadersGlobal: Record<string, string> = {}
type Logger = {
  debug?: (...args: any[]) => void
  info?: (...args: any[]) => void
  warn?: (...args: any[]) => void
  error?: (...args: any[]) => void
  log?: (...args: any[]) => void
} | ((...args: any[]) => void)
let logger: Logger | undefined

function logDebug(...args: any[]) {
  if (!logger) return
  if (typeof logger === 'function') return logger(...args)
  if (logger.debug) return logger.debug(...args)
  if (logger.log) return logger.log(...args)
}

function maskSensitive(value?: string) {
  if (!value) return value
  if (value.length <= 8) return '*'.repeat(Math.max(4, value.length))
  return value.slice(0, 2) + '***' + value.slice(-4)
}

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { ...headers }
  for (const key of Object.keys(h)) {
    const k = key.toLowerCase()
    if (k === 'authorization' || k === 'x-api-key' || k === 'auth' || k === 'proxy-authorization') {
      h[key] = maskSensitive(h[key]) as string
    }
  }
  return h
}

function safeBodyPreview(body: any): any {
  if (body == null) return undefined
  if (typeof FormData !== 'undefined' && body instanceof FormData) return '[FormData]'
  if (typeof body === 'string') return body.slice(0, 1000)
  if (typeof body === 'object') {
    const copy: any = Array.isArray(body) ? [...body] : { ...body }
    const redactKeys = ['password','token','authorization','apiKey','bearerToken']
    for (const k of Object.keys(copy)) {
      if (redactKeys.includes(k)) copy[k] = '[redacted]'
    }
    try { return JSON.parse(JSON.stringify(copy)) } catch { return '[Object]' }
  }
  return body
}

/**
 * Call this once (e.g. at app startup) to configure baseURL/auth.
 *
 * @param options - Configuration options
 * @property {string} options.baseURL - The root URL of the Smartlinks API (e.g. "https://smartlinks.app/api/v1")
 * @property {string} [options.apiKey] - (Optional) API key for X-API-Key header
 * @property {string} [options.bearerToken] - (Optional) Bearer token for AUTHORIZATION header
 * @property {boolean} [options.proxyMode] - (Optional) Tells the API that it is running in an iframe via parent proxy
 */
import { enableAutoIframeResize, isIframe } from './iframe'

export function initializeApi(options: {
  baseURL: string
  apiKey?: string
  bearerToken?: string
  proxyMode?: boolean
  ngrokSkipBrowserWarning?: boolean
  extraHeaders?: Record<string, string>
  iframeAutoResize?: boolean // default true when in iframe
  logger?: Logger // optional console-like or function to enable verbose logging
}): void {
  // Normalize baseURL by removing trailing slashes.
  baseURL = options.baseURL.replace(/\/+$/g, "")
  apiKey = options.apiKey
  bearerToken = options.bearerToken
  proxyMode = !!options.proxyMode
  // Auto-enable ngrok skip header if domain contains .ngrok.io and user did not explicitly set the flag.
  // Infer ngrok usage from common domains (.ngrok.io or .ngrok-free.dev)
  const inferredNgrok = /(\.ngrok\.io|\.ngrok-free\.dev)(\b|\/)/i.test(baseURL)
  ngrokSkipBrowserWarning = options.ngrokSkipBrowserWarning !== undefined
    ? !!options.ngrokSkipBrowserWarning
    : inferredNgrok
  extraHeadersGlobal = options.extraHeaders ? { ...options.extraHeaders } : {}
  // Auto-enable iframe resize unless explicitly disabled
  if (isIframe() && options.iframeAutoResize !== false) {
    enableAutoIframeResize()
  }
  logger = options.logger
  logDebug('[smartlinks] initializeApi', {
    baseURL,
    proxyMode,
    inferredNgrok,
    ngrokSkipBrowserWarning,
    extraHeaders: Object.keys(extraHeadersGlobal),
    iframeAutoResizeEnabled: isIframe() && options.iframeAutoResize !== false,
  })
}

/** Enable/disable automatic "ngrok-skip-browser-warning" header. */
export function setNgrokSkipBrowserWarning(flag: boolean) {
  ngrokSkipBrowserWarning = flag
}

/** Replace or augment globally applied custom headers. */
export function setExtraHeaders(headers: Record<string, string>) {
  extraHeadersGlobal = { ...headers }
}

/**
 * Allows setting the bearerToken at runtime (e.g. after login/logout).
 */
export function setBearerToken(token: string | undefined) {
  bearerToken = token
}

// Map of pending proxy requests: id -> {resolve, reject}
const proxyPending: Record<string, { resolve: (data: any) => void, reject: (err: any) => void }> = {}

function generateProxyId(): string {
  return "proxy_" + Math.random().toString(36).slice(2) + Date.now()
}

// Shared listener for proxy responses
function ensureProxyListener() {
  if ((window as any)._smartlinksProxyListener) return
  window.addEventListener("message", (event) => {
    const msg = event.data
    if (!msg || !msg._smartlinksProxyResponse || !msg.id) return
    logDebug('[smartlinks] proxy:response', { id: msg.id, ok: !msg.error, keys: Object.keys(msg) })
    const pending = proxyPending[msg.id]
    if (pending) {
      if (msg.error) {
        pending.reject(new Error(msg.error))
      } else {
        pending.resolve(msg.data)
      }
      delete proxyPending[msg.id]
    }
  })
  ;(window as any)._smartlinksProxyListener = true
}

// Proxy request implementation
async function proxyRequest<T>(
  method: string,
  path: string,
  body?: any,
  headers?: Record<string, string>,
  options?: RequestInit
): Promise<T> {
  ensureProxyListener()
  const id = generateProxyId()
  const msg = {
    _smartlinksProxyRequest: true,
    id,
    method,
    path,
    body,
    headers,
    options,
  }
  logDebug('[smartlinks] proxy:postMessage', { id, method, path, headers: headers ? redactHeaders(headers) : undefined, hasBody: !!body })
  return new Promise<T>((resolve, reject) => {
    proxyPending[id] = { resolve, reject }
    window.parent.postMessage(msg, "*")
    // Optionally: add a timeout here to reject if no response
  })
}

/**
 * Internal helper that performs a GET request to \`\${baseURL}\${path}\`, 
 * injecting headers for apiKey or bearerToken if present. 
 * Returns the parsed JSON as T, or throws an Error.
 */
export async function request<T>(path: string): Promise<T> {
  if (proxyMode) {
    logDebug('[smartlinks] GET via proxy', { path })
    return proxyRequest<T>("GET", path)
  }

  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`
  if (ngrokSkipBrowserWarning) headers["ngrok-skip-browser-warning"] = "true"
  for (const [k, v] of Object.entries(extraHeadersGlobal)) headers[k] = v

  logDebug('[smartlinks] GET fetch', { url, headers: redactHeaders(headers) })
  const response = await fetch(url, {
    method: "GET",
    headers,
  })
  logDebug('[smartlinks] GET response', { url, status: response.status, ok: response.ok })

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
  if (proxyMode) {
    logDebug('[smartlinks] POST via proxy', { path, body: safeBodyPreview(body) })
    return proxyRequest<T>("POST", path, body, extraHeaders)
  }

  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = extraHeaders ? { ...extraHeaders } : {}
  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`
  if (ngrokSkipBrowserWarning) headers["ngrok-skip-browser-warning"] = "true"
  for (const [k, v] of Object.entries(extraHeadersGlobal)) if (!(k in headers)) headers[k] = v

  // Only set Content-Type for non-FormData bodies
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  logDebug('[smartlinks] POST fetch', { url, headers: redactHeaders(headers), body: safeBodyPreview(body) })
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
  logDebug('[smartlinks] POST response', { url, status: response.status, ok: response.ok })

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
  if (proxyMode) {
    logDebug('[smartlinks] PUT via proxy', { path, body: safeBodyPreview(body) })
    return proxyRequest<T>("PUT", path, body, extraHeaders)
  }

  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = extraHeaders ? { ...extraHeaders } : {}
  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`
  if (ngrokSkipBrowserWarning) headers["ngrok-skip-browser-warning"] = "true"
  for (const [k, v] of Object.entries(extraHeadersGlobal)) if (!(k in headers)) headers[k] = v

  // Only set Content-Type for non-FormData bodies
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  logDebug('[smartlinks] PUT fetch', { url, headers: redactHeaders(headers), body: safeBodyPreview(body) })
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
  logDebug('[smartlinks] PUT response', { url, status: response.status, ok: response.ok })

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
  if (proxyMode) {
    logDebug('[smartlinks] requestWithOptions via proxy', { path, method: options.method || 'GET' })
    return proxyRequest<T>(options.method || "GET", path, options.body, options.headers as Record<string, string>, options)
  }

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
    ...(ngrokSkipBrowserWarning ? { "ngrok-skip-browser-warning": "true" } : {}),
    ...extraHeaders,
  }
  // Merge global custom headers (do not override existing keys from options.headers)
  for (const [k, v] of Object.entries(extraHeadersGlobal)) if (!(k in headers)) headers[k] = v

  logDebug('[smartlinks] requestWithOptions fetch', { url, method: options.method || 'GET', headers: redactHeaders(headers), body: safeBodyPreview(options.body) })
  const response = await fetch(url, {
    ...options,
    headers,
  })
  logDebug('[smartlinks] requestWithOptions response', { url, status: response.status, ok: response.ok })

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
  if (proxyMode) {
    logDebug('[smartlinks] DELETE via proxy', { path })
    return proxyRequest<T>("DELETE", path, undefined, extraHeaders)
  }

  if (!baseURL) {
    throw new Error("HTTP client is not initialized. Call initializeApi(...) first.")
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = extraHeaders ? { ...extraHeaders } : {}
  if (apiKey) headers["X-API-Key"] = apiKey
  if (bearerToken) headers["AUTHORIZATION"] = `Bearer ${bearerToken}`
  if (ngrokSkipBrowserWarning) headers["ngrok-skip-browser-warning"] = "true"
  for (const [k, v] of Object.entries(extraHeadersGlobal)) if (!(k in headers)) headers[k] = v

  logDebug('[smartlinks] DELETE fetch', { url, headers: redactHeaders(headers) })
  const response = await fetch(url, {
    method: "DELETE",
    headers,
  })
  logDebug('[smartlinks] DELETE response', { url, status: response.status, ok: response.ok })

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
  if (ngrokSkipBrowserWarning) headers["ngrok-skip-browser-warning"] = "true"
  for (const [k, v] of Object.entries(extraHeadersGlobal)) if (!(k in headers)) headers[k] = v
  return headers
}

/**
 * Sends a custom proxy message to the parent Smartlinks application when running in an iframe.
 * This function is used to communicate with the parent window when the SDK is embedded in an iframe
 * and proxyMode is enabled. It sends a message to the parent and waits for a response.
 * @param request - The request type string to identify the message type
 * @param params - The parameters object containing data to send to the parent
 * @returns The data from the proxy response
 */
export async function sendCustomProxyMessage<T = any>(request: string, params: any): Promise<T> {
  if (!proxyMode) {
    throw new Error("sendCustomProxyMessage can only be used in proxyMode");
  }
  ensureProxyListener();
  const id = generateProxyId();
  const msg = {
    _smartlinksCustomProxyRequest: true,
    id,
    request,
    params,
  };
  logDebug('[smartlinks] proxy:custom postMessage', { id, request, params: safeBodyPreview(params) })
  return new Promise<T>((resolve, reject) => {
    proxyPending[id] = { resolve, reject };
    window.parent.postMessage(msg, "*");
    // Optionally: add a timeout here to reject if no response
  });
}
