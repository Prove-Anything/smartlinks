// src/api/qr.ts
// QR / Short code lookup API
import { request } from "../http";
/**
 * QR namespace for public short code lookups.
 */
export var qr;
(function (qr) {
    /**
     * Resolve a short code to related resource identifiers.
     *
     * @param shortId - The short code identifier namespace
     * @param code - The actual code to look up
     * @returns Mapping with optional `collectionId`, `productId`, `proofId` and the `code`
     */
    async function lookupShortCode(shortId, code) {
        const path = `/public/qr/lookupShortCode/${encodeURIComponent(shortId)}/${encodeURIComponent(code)}`;
        return request(path);
    }
    qr.lookupShortCode = lookupShortCode;
})(qr || (qr = {}));
