// src/api/qr.ts
// QR / Short code lookup API

import { request } from "../http"
import type { QrShortCodeLookupResponse } from "../types/qr"

/**
 * QR namespace for public short code lookups.
 */
export namespace qr {
  /**
   * Resolve a short code to related resource identifiers.
   *
   * @param shortId - The short code identifier namespace
   * @param code - The actual code to look up
   * @returns Mapping with optional `collectionId`, `productId`, `proofId` and the `code`
   */
  export async function lookupShortCode(shortId: string, code: string): Promise<QrShortCodeLookupResponse> {
    const path = `/public/qr/lookupShortCode/${encodeURIComponent(shortId)}/${encodeURIComponent(code)}`
    return request<QrShortCodeLookupResponse>(path)
  }
}
