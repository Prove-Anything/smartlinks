import type { Product } from '../types/product';
import type { Collection } from '../types/collection';
import type { BatchResponse } from '../types/batch';
import type { Proof } from '../types/proof';
/**
 * Parameters for building a portal path.
 * Pass in objects where available - the function will extract the needed properties.
 */
export interface PortalPathParams {
    /** Collection object (required) - provides shortId and optional portalUrl */
    collection: Collection | {
        shortId: string;
        portalUrl?: string;
    };
    /** Full product object (extracts id, gtin, and ownGtin from the product) */
    product?: Product;
    /** Just a product ID (if you don't have the full product) */
    productId?: string;
    /** Batch object (extracts id and expiryDate) */
    batch?: BatchResponse;
    /** Just a batch ID string (if you don't have the full batch object) */
    batchId?: string;
    /** Variant object OR just a variant ID string */
    variant?: {
        id: string;
    } | string;
    /** Proof object OR just a proof ID string */
    proof?: Proof | string;
    /** Additional query parameters */
    queryParams?: Record<string, string>;
    /** Return only the path without domain (default: false, returns full URL) */
    pathOnly?: boolean;
    /**
     * Override custom-domain detection. When the collection is served from its own
     * custom domain, a GS1 link resolves `/01/{gtin}` directly (the host identifies
     * the collection), so the `/gc/{shortId}` prefix is dropped. Left undefined, this
     * is auto-detected from `collection.redirectUrl` or a non-platform `portalUrl` host.
     */
    customDomain?: boolean;
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
export declare function buildPortalPath(params: PortalPathParams): string;
export interface Gs1DigitalLinkParams {
    /** Collection — provides the base domain (`portalUrl`), `shortId` (for `/gc` scoping) and custom-domain detection. */
    collection?: Collection | {
        shortId?: string;
        portalUrl?: string;
        redirectUrl?: string;
    };
    /** Explicit base domain (e.g. `"https://acme.com"`), overriding `collection.portalUrl`. */
    domain?: string;
    /** GTIN — the product's AI 01 identifier. Required (or provide `product`). */
    gtin?: string;
    /** Product object — extracts `gtin` and `ownGtin` when not given explicitly. */
    product?: Product;
    /** Override the global-owner flag; otherwise read from `product.ownGtin`. */
    ownGtin?: boolean;
    /**
     * A real GS1 **Consumer Product Variant** code (AI 22). Use this when the brand has a
     * genuine CPV. Takes precedence over `variant` when both are given.
     */
    cpv?: string | {
        id: string;
    };
    /**
     * Internal variant id, emitted as AI 22 (the SmartLinks resolver reads path segment 22
     * as the variant). Prefer `cpv` when you have a real GS1 CPV code — a non-CPV variant id
     * in AI 22 is only meaningful to the SmartLinks resolver, not to third-party GS1 resolvers.
     */
    variant?: string | {
        id: string;
    };
    /** Batch / lot (AI 10). A string or an object with `id`. */
    lot?: string | {
        id: string;
    };
    /** Alias of `lot` (AI 10). A `BatchResponse` also contributes its expiry date (AI 17) unless `expiry` is set. */
    batch?: BatchResponse | string;
    /** Serial (AI 21) — the specific item / proof. A string (serial / NFC / virtual id) or an object (`serialNumber` ?? `id`, e.g. a proof). */
    serial?: string | {
        id?: string;
        serialNumber?: string;
    };
    /** Expiry date (AI 17). A `Date`, ISO string, or `YYMMDD` string. */
    expiry?: string | Date;
    /**
     * Any other GS1 Application Identifiers as `{ [ai]: value }` — e.g.
     * `{ '11': prodDate, '3103': '000500' }`. Date AIs (11/12/13/15/16/17) accept a
     * `Date` and are formatted `YYMMDD`; path-qualifier AIs (22/10/21) are placed in
     * the path in canonical order; everything else becomes a query-string data attribute.
     */
    ais?: Record<string, string | number | Date>;
    /** GS1 `linkType` (added as a `?linkType=` query param). */
    linkType?: string;
    /** Additional non-GS1 query params. */
    queryParams?: Record<string, string>;
    /** Override custom-domain detection (see {@link buildPortalPath}). */
    customDomain?: boolean;
    /** Return only the path, without a domain. */
    pathOnly?: boolean;
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
export declare function buildGs1DigitalLink(params: Gs1DigitalLinkParams): string;
