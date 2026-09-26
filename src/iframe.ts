// iframe.ts
// Utilities to communicate with parent window when running inside an iframe.
// These helpers are optional and safe in non-browser / Node environments.
// They build on the existing proxyMode infrastructure but can also be used standalone.

// Re-export IframeResponder for parent-side iframe communication
export { 
  IframeResponder,
  isAdminFromRoles,
  buildIframeSrc,
} from './iframeResponder';

export type {
  IframeResponderOptions,
  CachedData,
  CollectionApp,
  RouteChangeMessage,
  SmartlinksIframeMessage,
  ProxyRequest,
  CustomProxyRequest,
  UploadStartMessage,
  UploadChunkMessage,
  UploadEndMessage,
} from './types/iframeResponder';

export namespace iframe {
interface IframeResizeOptions {
  /** Minimum ms between height postMessages (default 100). */
  intervalMs?: number
  /** Post even if height unchanged (default false). */
  alwaysSend?: boolean
  /** Additional payload properties to include with each resize message. */
  extra?: Record<string, any>
  /** Custom message type name (default 'smartlinks:resize'). */
  messageType?: string
}

let autoResizeTimer: number | undefined
let lastHeight = 0
let resizeOptions: IframeResizeOptions | undefined
let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function inIframe(): boolean {
  return isBrowser() && window.parent && window.parent !== window
}

function postParentMessage(type: string, payload: any) {
  if (!inIframe()) return
  try {
    window.parent.postMessage({ _smartlinksIframeMessage: true, type, payload }, '*')
  } catch {
    // swallow errors silently
  }
}

/** Redirect parent window to a URL (if in iframe). */
export function redirectParent(url: string) {
  postParentMessage('smartlinks:redirect', { url })
}

/** Request parent to adjust iframe height to current content height. */
export function sendHeight(height?: number, extra?: Record<string, any>) {
  if (!inIframe()) return
  const h = height ?? document.documentElement.scrollHeight
  postParentMessage(resizeOptions?.messageType || 'smartlinks:resize', { height: h, ...resizeOptions?.extra, ...extra })
}

function measureHeight(): number {
  if (!isBrowser()) return 0
  const doc = document.documentElement
  // Use max of several properties for robustness
  return Math.max(
    doc.scrollHeight,
    doc.offsetHeight,
    doc.clientHeight,
    document.body ? document.body.scrollHeight : 0,
    document.body ? document.body.offsetHeight : 0
  )
}

function scheduleManualPolling() {
  if (!isBrowser()) return
  clearInterval(autoResizeTimer)
  const interval = resizeOptions?.intervalMs ?? 100
  autoResizeTimer = window.setInterval(() => {
    const h = measureHeight()
    if (resizeOptions?.alwaysSend || h !== lastHeight) {
      lastHeight = h
      sendHeight(h)
    }
  }, interval)
}

function setupObservers() {
  if (!isBrowser()) return
  // Prefer ResizeObserver for layout changes
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      const h = measureHeight()
      if (resizeOptions?.alwaysSend || h !== lastHeight) {
        lastHeight = h
        sendHeight(h)
      }
    })
    resizeObserver.observe(document.body)
  } else {
    // Fallback: MutationObserver for DOM changes
    mutationObserver = new MutationObserver(() => {
      const h = measureHeight()
      if (resizeOptions?.alwaysSend || h !== lastHeight) {
        lastHeight = h
        sendHeight(h)
      }
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true })
    // Manual polling as additional safeguard
    scheduleManualPolling()
  }
}

/** Enable automatic height reporting to parent iframe. */
export function enableAutoIframeResize(options?: IframeResizeOptions) {
  if (!inIframe()) return
  resizeOptions = options || {}
  lastHeight = measureHeight()
  sendHeight(lastHeight)
  setupObservers()
  if (!resizeObserver) {
    // If no ResizeObserver, MutationObserver is active and we also poll
    scheduleManualPolling()
  }
}

/** Disable automatic height reporting. */
export function disableAutoIframeResize() {
  if (resizeObserver) resizeObserver.disconnect()
  if (mutationObserver) mutationObserver.disconnect()
  if (isBrowser()) clearInterval(autoResizeTimer)
  resizeObserver = undefined
  mutationObserver = undefined
  autoResizeTimer = undefined
  resizeOptions = undefined
}

/** Send a custom message to parent (browser-only). */
export function sendParentCustom(type: string, payload: Record<string, any>) {
  postParentMessage(type, payload)
}

/**
 * Ask the embedding host (parent window) to hand this app a bearer token, for DIRECT (non-proxied)
 * mode. Posts `{ type: 'smartlinks:request-auth' }` and resolves with the token from the host's
 * `{ type: 'smartlinks:auth', bearerToken }` reply, or `null` on timeout / when not embedded.
 *
 * Use in a first-party/dev embed where the host owns the session and hands it down (the console dev
 * preview), then feed it to the SDK:
 *   SL.initializeApi({ baseURL, proxyMode: false, awaitAuth: true })
 *   SL.iframe.requestParentAuth().then(t => t && SL.setBearerToken(t))
 * Untrusted third-party embeds should use proxyMode instead (never hold the user's token).
 */
export function requestParentAuth(opts?: { timeoutMs?: number }): Promise<string | null> {
  if (!inIframe()) return Promise.resolve(null)
  return new Promise((resolve) => {
    let done = false
    const finish = (v: string | null) => {
      if (done) return
      done = true
      clearTimeout(timer)
      try { window.removeEventListener('message', onMsg) } catch { /* ignore */ }
      resolve(v)
    }
    const onMsg = (e: MessageEvent) => {
      const d = e && e.data
      if (d && d.type === 'smartlinks:auth' && typeof d.bearerToken === 'string' && d.bearerToken) {
        finish(d.bearerToken)
      }
    }
    const timer = setTimeout(() => finish(null), opts?.timeoutMs ?? 8000)
    try { window.addEventListener('message', onMsg) } catch { /* ignore */ }
    postParentMessage('smartlinks:request-auth', {})
  })
}

/** Returns true if running inside an iframe (browser). */
export function isIframe(): boolean {
  return inIframe()
}

/** Returns true if ResizeObserver is supported in current environment. */
export function supportsResizeObserver(): boolean {
  return typeof ResizeObserver !== 'undefined'
}
}
