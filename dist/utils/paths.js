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
export function buildPortalPath(params) {
    var _a, _b;
    const { collection, product, productId, batch, batchId, variant, proof, queryParams = {}, pathOnly = false } = params;
    // Extract values from collection
    const shortId = collection.shortId;
    const baseUrl = 'portalUrl' in collection ? collection.portalUrl : undefined;
    // Extract product values
    let gtin;
    let ownGtin;
    let extractedProductId;
    if (product) {
        extractedProductId = product.id;
        gtin = (_a = product.gtin) !== null && _a !== void 0 ? _a : undefined;
        // ownGtin is a critical product setting - only read from product, never override
        ownGtin = 'ownGtin' in product ? (_b = product.ownGtin) !== null && _b !== void 0 ? _b : undefined : undefined;
    }
    else if (productId) {
        extractedProductId = productId;
    }
    // Extract batch values
    let extractedBatchId;
    let expiryDate;
    if (batch) {
        // Batch object - extract id and expiryDate
        extractedBatchId = batch.id;
        if (batch.expiryDate) {
            // Handle Firebase timestamp or Date
            if (typeof batch.expiryDate === 'object' && 'seconds' in batch.expiryDate) {
                expiryDate = new Date(batch.expiryDate.seconds * 1000);
            }
            else {
                expiryDate = batch.expiryDate;
            }
        }
    }
    else if (batchId) {
        // Just batch ID string - no expiry date
        extractedBatchId = batchId;
    }
    // Extract variant ID
    const variantId = variant
        ? typeof variant === 'string'
            ? variant
            : variant.id
        : undefined;
    // Extract proof ID
    const proofId = proof
        ? typeof proof === 'string'
            ? proof
            : proof.id
        : undefined;
    let pathname = '';
    const searchParams = new URLSearchParams();
    // Build pathname based on GTIN or product ID
    if (gtin) {
        // GS1 Digital Link format
        if (ownGtin) {
            pathname = `/01/${gtin}`;
        }
        else {
            pathname = `/gc/${shortId}/01/${gtin}`;
        }
        // Add batch (GS1 AI 10)
        if (extractedBatchId) {
            pathname += `/10/${extractedBatchId}`;
            // Add expiry date as query param (GS1 AI 17)
            if (expiryDate) {
                const dateStr = formatExpiryDate(expiryDate);
                searchParams.append('17', dateStr);
            }
        }
        // Add variant (GS1 AI 22)
        if (variantId) {
            pathname += `/22/${variantId}`;
        }
    }
    else if (extractedProductId) {
        // Regular product path
        pathname = `/c/${shortId}/${extractedProductId}`;
        // Add proof to path
        if (proofId) {
            pathname += `/${proofId}`;
        }
    }
    // Add any additional query params
    for (const [key, value] of Object.entries(queryParams)) {
        searchParams.append(key, value);
    }
    // Build final URL
    const queryString = searchParams.toString();
    const fullPath = pathname + (queryString ? `?${queryString}` : '');
    // Return path only if requested
    if (pathOnly) {
        return fullPath;
    }
    // Return full URL using collection.portalUrl or default domain
    const domain = baseUrl || 'https://smartlinks.app';
    const cleanDomain = domain.replace(/\/$/, '');
    return cleanDomain + fullPath;
}
/**
 * Formats an expiry date to YYMMDD format.
 * @internal
 */
function formatExpiryDate(date) {
    if (typeof date === 'string') {
        // Already in YYMMDD format
        if (/^\d{6}$/.test(date)) {
            return date;
        }
        // Try to parse as ISO date
        date = new Date(date);
    }
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}
