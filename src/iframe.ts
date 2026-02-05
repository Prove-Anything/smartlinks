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

/** Returns true if running inside an iframe (browser). */
export function isIframe(): boolean {
  return inIframe()
}

/** Returns true if ResizeObserver is supported in current environment. */
export function supportsResizeObserver(): boolean {
  return typeof ResizeObserver !== 'undefined'
}
}
