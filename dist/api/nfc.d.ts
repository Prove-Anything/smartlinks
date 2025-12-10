import type { NfcValidateRequest, NfcValidateResponse, NfcTagInfo, NfcClaimTagRequest } from "../types/nfc";
export declare const nfc: {
    /**
     * Claim an NFC tag (public).
     * POST /api/va/public/nfc/claimTag
     */
    claimTag(data: NfcClaimTagRequest): Promise<NfcTagInfo>;
    /**
     * Validate an NFC tag payload (public).
     * POST /public/nfc/validate
     */
    validate(data: NfcValidateRequest): Promise<NfcValidateResponse>;
    /**
     * Lookup a tag by its ID (public).
     * GET /public/nfc/findByTag/:tagId
     */
    lookupTag(tagId: string): Promise<NfcTagInfo[]>;
};
