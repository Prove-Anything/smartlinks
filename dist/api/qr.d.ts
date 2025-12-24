import type { QrShortCodeLookupResponse } from "../types/qr";
/**
 * QR namespace for public short code lookups.
 */
export declare namespace qr {
    /**
     * Resolve a short code to related resource identifiers.
     *
     * @param shortId - The short code identifier namespace
     * @param code - The actual code to look up
     * @returns Mapping with optional `collectionId`, `productId`, `proofId` and the `code`
     */
    function lookupShortCode(shortId: string, code: string): Promise<QrShortCodeLookupResponse>;
}
