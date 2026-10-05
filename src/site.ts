// =============================================================================
// site — for apps served as websites.
// =============================================================================

declare global {
  // eslint-disable-next-line no-var
  var __SL_READY__: boolean | undefined
}

/**
 * Tell the platform this page has finished rendering its content (data loaded, head tags set). The
 * platform's page renderer takes its snapshot for search engines and AI crawlers at this point;
 * without it, it waits for the network to go idle (capped). Call once per page, after your data
 * renders. Harmless anywhere else.
 */
export function ready(): void {
  if (typeof globalThis === 'undefined') return
  globalThis.__SL_READY__ = true
  const w: any = typeof window !== 'undefined' ? window : null
  if (w && typeof w.dispatchEvent === 'function' && typeof w.CustomEvent === 'function') {
    w.dispatchEvent(new w.CustomEvent('smartlinks:ready'))
  }
}
