// src/types/qr.ts

/**
 * Response for public short code lookup.
 * Resolves the short code to related resource identifiers.
 */
export interface QrShortCodeLookupResponse {
  /** The collection ID, if applicable */
  collectionId?: string
  /** The product ID, if applicable */
  productId?: string
  /** The proof ID, if applicable */
  proofId?: string
  /** The resolved code string */
  code: string
}
