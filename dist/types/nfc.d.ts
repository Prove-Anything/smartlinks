export interface NfcTagInfo {
    id: string;
    tagId: string;
    claimSetId: string;
    collectionId?: string;
    productId?: string;
    batchId?: string;
    variantId?: string;
    proofId?: string;
    index?: number;
    data?: Record<string, any>;
}
export interface NfcValidateRequest {
    claimSetId: string;
    codeId: string;
    mirror?: string;
    userId?: string;
}
export interface NfcValidateResponse {
    claimSetId: string;
    codeId: string;
    tagId: string;
    index?: number;
    isAdmin: boolean;
    path?: string;
    collectionId?: string;
    collection?: Record<string, any>;
    count: number;
    previousCount: number;
    data?: Record<string, any>;
    productId?: string;
    product?: Record<string, any>;
    batchId?: string;
    variantId?: string;
    proofId?: string;
}
export interface NfcClaimTagRequest {
    claimSetId: string;
    codeId: string;
    data: Record<string, any>;
}
/**
 * Outcome of validating the NFC/QR tag that brought the visitor to a
 * SmartLinks app.
 *
 * - `valid` — fresh, genuine tap. SUN counter advanced (or a non-consuming
 *   lookup succeeded).
 * - `rescan` — genuine tag, but this exact tap was already seen (refresh,
 *   back button, or a non-advancing SUN counter).
 * - `invalid` — validation rejected the payload outright (bad crypto,
 *   unknown tag, tampered URL) — i.e. a fake/counterfeit tag or serial.
 * - `error` — network/transport failure; authenticity could not be
 *   confirmed either way.
 */
export type TagStatus = 'valid' | 'rescan' | 'invalid' | 'error';
/**
 * Result of resolving the tag identifiers on the entry URL, handed to
 * sub-apps so they can render status-appropriate UX instead of a generic
 * error. See docs/tag-context.md for the full contract.
 */
export interface TagContext {
    /** Always present when a `TagContext` is delivered at all. */
    status: TagStatus;
    /** Identifiers, when known. */
    tagId?: string;
    claimSetId?: string;
    codeId?: string;
    /** SUN counter values, present when validation returned them. */
    count?: number;
    previousCount?: number;
    /** Arbitrary tag-level payload returned by validation/lookup. */
    data?: Record<string, unknown>;
    /** How the identifiers were resolved. */
    source: 'nfc-validate' | 'nfc-lookup' | 'tag-index' | 'none';
    /** Epoch ms at resolution time. */
    validatedAt: number;
    /** Human-readable message for `invalid` / `error`. */
    errorMessage?: string;
}
