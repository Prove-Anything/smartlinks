// src/api/nfc.ts
import { post, request } from "../http";
export var nfc;
(function (nfc) {
    /**
     * Claim an NFC tag (public).
     * POST /public/nfc/claimTag
     */
    async function claimTag(data) {
        return post("/public/nfc/claimTag", data);
    }
    nfc.claimTag = claimTag;
    /**
     * Validate an NFC tag payload (public).
     * POST /public/nfc/validate
     */
    async function validate(data) {
        return post("/public/nfc/validate", data);
    }
    nfc.validate = validate;
    /**
     * Lookup a tag by its ID (public).
     * GET /public/nfc/findByTag/:tagId
     */
    async function lookupTag(tagId) {
        return request(`/public/nfc/findByTag/${encodeURIComponent(tagId)}`);
    }
    nfc.lookupTag = lookupTag;
})(nfc || (nfc = {}));
