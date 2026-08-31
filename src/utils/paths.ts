// src/utils/paths.ts
import type { Product } from '../types/product'
import type { Collection } from '../types/collection'
import type { BatchResponse } from '../types/batch'
import type { Proof } from '../types/proof'

/**
 * Parameters for building a portal path.
 * Pass in objects where available - the function will extract the needed properties.
 */
export interface PortalPathParams {
  /** Collection object (required) - provides shortId and optional portalUrl */
  collection: Collection | { shortId: string; portalUrl?: string }
  /** Full product object (extracts id, gtin, and ownGtin from the product) */
  product?: Product
  /** Just a product ID (if you don't have the full product) */
  productId?: string
  /** Batch object (extracts id and expiryDate) */
  batch?: BatchResponse
  /** Just a batch ID string (if you don't have the full batch object) */
  batchId?: string
  /** Variant object OR just a variant ID string */
  variant?: { id: string } | string
  /** Proof object OR just a proof ID string */
  proof?: Proof | string
  /** Additional query parameters */
  queryParams?: Record<string, string>
  /** Return only the path without domain (default: false, returns full URL) */
  pathOnly?: boolean
  /**
   * Override custom-domain detection. When the collection is served from its own
   * custom domain, a GS1 link resolves `/01/{gtin}` directly (the host identifies
   * the collection), so the `/gc/{shortId}` prefix is dropped. Left undefined, this
   * is auto-detected from `collection.redirectUrl` or a non-platform `portalUrl` host.
   */
  customDomain?: boolean
}

// Hosts served by the platform itself (not a collection's own custom domain). A base
// URL on any of these is NOT a custom domain, so non-master GTINs still need the
// `/gc/{shortId}` collection prefix. `portalUrl` is only ever set to the platform
// default or a collection's custom domain, so exact-host matching is sufficient here.
const PLATFORM_HOSTS = ['smartlinks.app', 'mysmartlinks.app', 'zt.smartlinks.io']

/** True when `baseUrl`'s host is a collection's own custom domain (not a platform host). */
function baseIsCustomDomain(baseUrl?: string): boolean {
  if (!baseUrl) return false
  let host: string
  try {
    host = new URL(baseUrl).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return false
  }
  return host.length > 0 && !PLATFORM_HOSTS.includes(host)
}

/**
 * Builds a portal path/URL based on the provided parameters.
 * 
 * Returns a full URL by default using collection.portalUrl or the default smartlinks domain.
 * Set pathOnly: true to return just the path without the domain.
 * 
 * Pass in objects where available (collection, product, batch, etc.) and the function
 * will extract the needed properties. You can also pass just IDs if you don't have the full objects.
 * 
 * Supports multiple path formats:
 * - Basic product: `/c/{shortId}/{productId}`
 * - With proof: `/c/{shortId}/{productId}/{proofId}`
 * - GTIN (own, or on a custom domain): `/01/{gtin}` — `ownGtin` is read from the product;
 *   a custom domain (see `customDomain` / `collection.redirectUrl`) also uses this bare form
 * - GTIN (not own, on the shared platform domain): `/gc/{shortId}/01/{gtin}`
 * - With batch: adds `/10/{batchId}` and optionally `?17={expiryDate}`
 * - With variant: adds `/22/{variantId}`
 * 
 * @param params - Path parameters
 * @returns The built portal URL (default) or path (if pathOnly: true)
 * 
 * @example
 * ```typescript
 * // Returns full URL by default
 * buildPortalPath({
 *   collection: myCollection,  // uses collection.portalUrl
 *   product: myProduct
 * })
 * // Returns: https://portal.smartlinks.io/c/abc123/prod1
 * 
 * // Return just the path
 * buildPortalPath({
 *   collection: myCollection,
 *   product: myProduct,
 *   pathOnly: true
 * })
 * // Returns: /c/abc123/prod1
 * 
 * // GTIN path (ownGtin read from product)
 * buildPortalPath({
 *   collection: myCollection,
 *   product: myProduct  // if product.ownGtin is true, uses /01/ path
 * })
 * // Returns: https://portal.smartlinks.io/01/1234567890123
 * 
 * // With batch object (includes expiry date)
 * buildPortalPath({
 *   collection: myCollection,
 *   product: myProduct,
 *   batch: myBatch  // extracts id and expiryDate
 * })
 * // Returns: https://portal.smartlinks.io/01/1234567890123/10/batch1?17=260630
 * 
 * // Or just pass IDs
 * buildPortalPath({
 *   collection: { shortId: 'abc123' },
 *   productId: 'prod1',
 *   batchId: 'batch1'  // just the ID, no expiry
 * })
 * // Returns: https://smartlinks.app/c/abc123/prod1
 * ```
 */
export function buildPortalPath(params: PortalPathParams): string {
  const { collection, product, productId, batch, batchId, variant, proof, queryParams = {}, pathOnly = false } = params

  // Extract values from collection
  const shortId = collection.shortId
  const baseUrl = 'portalUrl' in collection ? collection.portalUrl : undefined

  // A collection on its own custom domain resolves `/01/{gtin}` directly (the host
  // maps to the collection server-side), so the `/gc/{shortId}` prefix is dropped.
  // Explicit override wins; otherwise detect from `redirectUrl` (the server's own
  // custom-domain signal) or a non-platform `portalUrl` host.
  const redirectUrl = 'redirectUrl' in collection ? (collection as { redirectUrl?: string }).redirectUrl : undefined
  const customDomain = params.customDomain ?? (!!redirectUrl || baseIsCustomDomain(baseUrl))

  // Extract product values
  let gtin: string | undefined
  let ownGtin: boolean | undefined
  let extractedProductId: string | undefined

  if (product) {
    extractedProductId = product.id
    gtin = product.gtin ?? undefined
    // ownGtin is a critical product setting - only read from product, never override
    ownGtin = 'ownGtin' in product ? (product as any).ownGtin ?? undefined : undefined
  } else if (productId) {
    extractedProductId = productId
  }

  // Extract batch values
  let extractedBatchId: string | undefined
  let expiryDate: string | Date | undefined

  if (batch) {
    // Batch object - extract id and expiryDate
    extractedBatchId = batch.id
    if (batch.expiryDate) {
      // Handle Firebase timestamp or Date
      if (typeof batch.expiryDate === 'object' && 'seconds' in batch.expiryDate) {
        expiryDate = new Date(batch.expiryDate.seconds * 1000)
      } else {
        expiryDate = batch.expiryDate as string | Date
      }
    }
  } else if (batchId) {
    // Just batch ID string - no expiry date
    extractedBatchId = batchId
  }

  // Extract variant ID
  const variantId = variant
    ? typeof variant === 'string'
      ? variant
      : variant.id
    : undefined

  // Extract proof ID
  const proofId = proof
    ? typeof proof === 'string'
      ? proof
      : proof.id
    : undefined

  // GTIN → delegate to the GS1 Digital Link generator (canonical AI ordering:
  // /01/{gtin}/22/{cpv}/10/{lot}/21/{serial}, data attributes as query params).
  if (gtin) {
    return buildGs1DigitalLink({
      domain: baseUrl,
      collection,
      gtin,
      ownGtin,
      customDomain,
      variant: variantId,
      lot: extractedBatchId,
      expiry: expiryDate,
      queryParams,
      pathOnly,
    })
  }

  let pathname = ''
  const searchParams = new URLSearchParams()

  if (extractedProductId) {
    // Regular product path
    pathname = `/c/${shortId}/${extractedProductId}`

    // Add proof to path
    if (proofId) {
      pathname += `/${proofId}`
    }
  }

  // Add any additional query params
  for (const [key, value] of Object.entries(queryParams)) {
    searchParams.append(key, value)
  }

  // Build final URL
  const queryString = searchParams.toString()
  const fullPath = pathname + (queryString ? `?${queryString}` : '')

  // Return path only if requested
  if (pathOnly) {
    return fullPath
  }

  // Return full URL using collection.portalUrl or default domain
  const domain = baseUrl || 'https://smartlinks.app'
  const cleanDomain = domain.replace(/\/$/, '')
  return cleanDomain + fullPath
}

/**
 * Formats an expiry date to YYMMDD format.
 * @internal
 */
function formatExpiryDate(date: string | Date): string {
  if (typeof date === 'string') {
    // Already in YYMMDD format
    if (/^\d{6}$/.test(date)) {
      return date
    }
    // Try to parse as ISO date
    date = new Date(date)
  }

  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}${month}${day}`
}

// ─── GS1 Digital Link generator ──────────────────────────────────────────────

/** GS1 path qualifiers for a GTIN (AI 01) key, in the canonical GS1 Digital Link order. */
const GTIN_PATH_QUALIFIERS = ['22', '10', '21'] as const

/** GS1 Application Identifiers whose value is a date — formatted `YYMMDD`. */
const DATE_AIS = new Set(['11', '12', '13', '15', '16', '17'])

/** Pull a code out of a string or an object (`serialNumber` preferred, then `id`). */
function extractCode(v: string | { id?: string; serialNumber?: string } | undefined): string | undefined {
  if (v == null) return undefined
  if (typeof v === 'string') return v
  return v.serialNumber ?? v.id
}

export interface Gs1DigitalLinkParams {
  /** Collection — provides the base domain (`portalUrl`), `shortId` (for `/gc` scoping) and custom-domain detection. */
  collection?: Collection | { shortId?: string; portalUrl?: string; redirectUrl?: string }
  /** Explicit base domain (e.g. `"https://acme.com"`), overriding `collection.portalUrl`. */
  domain?: string
  /** GTIN — the product's AI 01 identifier. Required (or provide `product`). */
  gtin?: string
  /** Product object — extracts `gtin` and `ownGtin` when not given explicitly. */
  product?: Product
  /** Override the global-owner flag; otherwise read from `product.ownGtin`. */
  ownGtin?: boolean
  /**
   * A real GS1 **Consumer Product Variant** code (AI 22). Use this when the brand has a
   * genuine CPV. Takes precedence over `variant` when both are given.
   */
  cpv?: string | { id: string }
  /**
   * Internal variant id, emitted as AI 22 (the SmartLinks resolver reads path segment 22
   * as the variant). Prefer `cpv` when you have a real GS1 CPV code — a non-CPV variant id
   * in AI 22 is only meaningful to the SmartLinks resolver, not to third-party GS1 resolvers.
   */
  variant?: string | { id: string }
  /** Batch / lot (AI 10). A string or an object with `id`. */
  lot?: string | { id: string }
  /** Alias of `lot` (AI 10). A `BatchResponse` also contributes its expiry date (AI 17) unless `expiry` is set. */
  batch?: BatchResponse | string
  /** Serial (AI 21) — the specific item / proof. A string (serial / NFC / virtual id) or an object (`serialNumber` ?? `id`, e.g. a proof). */
  serial?: string | { id?: string; serialNumber?: string }
  /** Expiry date (AI 17). A `Date`, ISO string, or `YYMMDD` string. */
  expiry?: string | Date
  /**
   * Any other GS1 Application Identifiers as `{ [ai]: value }` — e.g.
   * `{ '11': prodDate, '3103': '000500' }`. Date AIs (11/12/13/15/16/17) accept a
   * `Date` and are formatted `YYMMDD`; path-qualifier AIs (22/10/21) are placed in
   * the path in canonical order; everything else becomes a query-string data attribute.
   */
  ais?: Record<string, string | number | Date>
  /** GS1 `linkType` (added as a `?linkType=` query param). */
  linkType?: string
  /** Additional non-GS1 query params. */
  queryParams?: Record<string, string>
  /** Override custom-domain detection (see {@link buildPortalPath}). */
  customDomain?: boolean
  /** Return only the path, without a domain. */
  pathOnly?: boolean
}

/**
 * Builds a GS1 Digital Link for a product, with full support for the standard
 * Application Identifiers. Path qualifiers are emitted in the canonical GS1 order
 * (`/01/{gtin}/22/{cpv}/10/{lot}/21/{serial}`); data attributes (expiry, production
 * date, weights, …) become query params; `linkType` is appended for GS1 resolution.
 *
 * A bare `/01/{gtin}` is used when the product owns the GTIN globally (`ownGtin`) or
 * the collection is on its own custom domain; otherwise the GTIN is scoped to the
 * collection with the `/gc/{shortId}` prefix on the shared platform domain.
 *
 * @example
 * ```ts
 * // GTIN + variant + lot + serial + expiry, on a custom domain
 * buildGs1DigitalLink({
 *   collection,                 // portalUrl = https://acme.com
 *   gtin: '05012345678900',
 *   variant: 'red',
 *   lot: 'LOT42',
 *   serial: proof,              // AI 21 from proof.serialNumber ?? proof.id
 *   expiry: '2026-06-30',
 * })
 * // → https://acme.com/01/05012345678900/22/red/10/LOT42/21/{serial}?17=260630
 *
 * // Arbitrary AIs via the generic map
 * buildGs1DigitalLink({
 *   collection, gtin: '05012345678900',
 *   ais: { '11': new Date('2025-01-01'), '3103': '000500' }, // production date + net weight (kg)
 *   linkType: 'gs1:pip',
 * })
 * ```
 */
export function buildGs1DigitalLink(params: Gs1DigitalLinkParams): string {
  const { collection, product, expiry, linkType, ais = {}, queryParams = {}, pathOnly = false } = params

  const gtin = params.gtin ?? product?.gtin ?? undefined
  if (!gtin) {
    throw new Error('buildGs1DigitalLink requires a `gtin` (or a `product` that has one)')
  }

  const ownGtin = params.ownGtin ?? (product && 'ownGtin' in product ? !!(product as { ownGtin?: unknown }).ownGtin : false)

  // Base domain + custom-domain scoping (same rules as buildPortalPath).
  const shortId = collection?.shortId
  const baseUrl = params.domain ?? (collection && 'portalUrl' in collection ? collection.portalUrl : undefined)
  const redirectUrl = collection && 'redirectUrl' in collection ? (collection as { redirectUrl?: string }).redirectUrl : undefined
  const customDomain = params.customDomain ?? (!!redirectUrl || baseIsCustomDomain(baseUrl))

  // ── Path qualifiers (AI 22 → 10 → 21) ──
  const pathAIs: Record<string, string> = {}
  const cpv = extractCode(params.cpv ?? params.variant)
  if (cpv != null) pathAIs['22'] = cpv

  let batchExpiry: string | Date | undefined
  let lot = extractCode(params.lot)
  if (lot == null && params.batch != null) {
    if (typeof params.batch === 'string') {
      lot = params.batch
    } else {
      lot = params.batch.id
      const exp = params.batch.expiryDate
      if (exp) {
        batchExpiry = (typeof exp === 'object' && 'seconds' in exp)
          ? new Date((exp as { seconds: number }).seconds * 1000)
          : (exp as string | Date)
      }
    }
  }
  if (lot != null) pathAIs['10'] = lot

  const serial = extractCode(params.serial)
  if (serial != null) pathAIs['21'] = serial

  // ── Data attributes (query string) ──
  const attrs: Record<string, string> = {}
  const setAttr = (ai: string, value: string | number | Date) => {
    attrs[ai] = DATE_AIS.has(ai) && (value instanceof Date || typeof value === 'string')
      ? formatExpiryDate(value as string | Date)
      : String(value)
  }

  const effectiveExpiry = expiry ?? batchExpiry
  if (effectiveExpiry != null) setAttr('17', effectiveExpiry)

  // Generic AI map: classify each entry as a path qualifier or a data attribute.
  for (const [ai, value] of Object.entries(ais)) {
    if (value == null) continue
    if ((GTIN_PATH_QUALIFIERS as readonly string[]).includes(ai)) {
      pathAIs[ai] = String(value)
    } else {
      setAttr(ai, value)
    }
  }

  // ── Compose the path ──
  let pathname = (ownGtin || customDomain || !shortId) ? `/01/${gtin}` : `/gc/${shortId}/01/${gtin}`
  for (const ai of GTIN_PATH_QUALIFIERS) {
    if (pathAIs[ai] != null) pathname += `/${ai}/${pathAIs[ai]}`
  }

  // ── Query string ──
  const searchParams = new URLSearchParams()
  for (const [ai, value] of Object.entries(attrs)) searchParams.append(ai, value)
  if (linkType) searchParams.append('linkType', linkType)
  for (const [k, v] of Object.entries(queryParams)) searchParams.append(k, v)

  const queryString = searchParams.toString()
  const fullPath = pathname + (queryString ? `?${queryString}` : '')
  if (pathOnly) return fullPath

  const domain = baseUrl || 'https://smartlinks.app'
  return domain.replace(/\/$/, '') + fullPath
}
