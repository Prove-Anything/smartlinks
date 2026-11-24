import type { NfcValidateRequest, NfcValidateResponse, NfcTagInfo, NfcClaimTagRequest } from "../types/nfc.js";
import type { ListResult } from "../types/list.js";
export declare namespace nfc {
    /**
     * Claim an NFC tag (public).
     * POST /public/nfc/claimTag
     */
    function claimTag(data: NfcClaimTagRequest): Promise<NfcTagInfo>;
    /**
     * Validate an NFC tag payload (public).
     * POST /public/nfc/validate
     */
    function validate(data: NfcValidateRequest): Promise<NfcValidateResponse>;
    /**
     * Lookup a tag by its ID (public): every code that tag is known as, a page at a time.
     * GET /public/nfc/findByTag/:tagId
     *
     * @param tagId - The tag's ID
     *
     * @example
     * ```typescript
     * const { items } = await nfc.lookupTag('04A1B2C3D4E5F6')
     * ```
     */
    function lookupTag(tagId: string): Promise<ListResult<NfcTagInfo>>;
}
