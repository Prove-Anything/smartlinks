// =============================================================================
// site — for apps served as websites (server-rendered on the SmartLinks site runtime).
// =============================================================================

declare global {
  // eslint-disable-next-line no-var
  var __SL_READY__: boolean | undefined
  // eslint-disable-next-line no-var
  var __SMARTLINKS_SITE__: SiteContext | undefined
}

/** The site a page is being served as. */
export interface SiteContext {
  /** The hostname this request arrived on (an automatic address, a chosen name or a custom domain). */
  host: string
  /** The collection the site belongs to: pass it to every SDK call. */
  collectionId: string
  appId: string
  /** The release channel being served ('stable' on a live address; 'dev' etc. on a test address). */
  channel: string
  /** Where search engines consolidate the site (custom domain > chosen name > automatic address). */
  canonicalHost: string
}

type HeaderSource = { headers: Headers | Record<string, string | string[] | undefined> } | Headers

function headerOf(source: HeaderSource, name: string): string | null {
  const headers: any = typeof Headers !== 'undefined' && source instanceof Headers ? source : (source as any).headers
  if (!headers) return null
  if (typeof headers.get === 'function') return headers.get(name)
  const v = headers[name] ?? headers[name.toLowerCase()]
  return Array.isArray(v) ? v[0] ?? null : v ?? null
}

function parse(raw: unknown): SiteContext | null {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!v || typeof v !== 'object' || typeof (v as any).collectionId !== 'string') return null
    const s = v as Record<string, unknown>
    return {
      host: String(s.host || ''),
      collectionId: String(s.collectionId),
      appId: String(s.appId || ''),
      channel: String(s.channel || 'stable'),
      canonicalHost: String(s.canonicalHost || s.host || ''),
    }
  } catch {
    return null
  }
}

/**
 * On the server: the site this request is rendering. The SmartLinks site router sets it on every
 * request it hands to your site's server (and drops any value a visitor sends). Null outside the
 * site runtime, e.g. in local development without the router: fall back to your dev collection.
 *
 * @example
 *   // TanStack Start server function / loader
 *   const site = SL.site.fromRequest(getRequest())
 *   const products = await SL.product.list(site!.collectionId)
 */
export function fromRequest(request: HeaderSource): SiteContext | null {
  return parse(headerOf(request, 'x-sl-site'))
}

/** In the browser: the site the page is served as (the router puts it in the page). Null elsewhere. */
export function current(): SiteContext | null {
  return parse((globalThis as any).__SMARTLINKS_SITE__)
}

/**
 * @deprecated Sites are server-rendered: crawlers get the finished page from the server, so nothing
 * waits for this signal any more. Kept as a harmless no-op signal for older pages.
 */
export function ready(): void {
  if (typeof globalThis === 'undefined') return
  globalThis.__SL_READY__ = true
  const w: any = typeof window !== 'undefined' ? window : null
  if (w && typeof w.dispatchEvent === 'function' && typeof w.CustomEvent === 'function') {
    w.dispatchEvent(new w.CustomEvent('smartlinks:ready'))
  }
}
