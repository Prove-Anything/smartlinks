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
 * - GTIN (own): `/01/{gtin}` - ownGtin is read from the product object
 * - GTIN (not own): `/gc/{shortId}/01/{gtin}`
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
