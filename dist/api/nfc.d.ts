import type { NfcValidateRequest, NfcValidateResponse, NfcTagInfo, NfcClaimTagRequest } from "../types/nfc";
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
     * Lookup a tag by its ID (public).
     * GET /public/nfc/findByTag/:tagId
     */
    function lookupTag(tagId: string): Promise<NfcTagInfo[]>;
}
