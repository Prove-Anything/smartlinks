// src/api/nfc.ts
import { post, request } from "../http";
export const nfc = {
    /**
     * Claim an NFC tag (public).
     * POST /api/va/public/nfc/claimTag
     */
    async claimTag(data) {
        return post("/public/nfc/claimTag", data);
    },
    /**
     * Validate an NFC tag payload (public).
     * POST /public/nfc/validate
     */
    async validate(data) {
        return post("/public/nfc/validate", data);
    },
    /**
     * Lookup a tag by its ID (public).
     * GET /public/nfc/findByTag/:tagId
     */
    async lookupTag(tagId) {
        return request(`/public/nfc/findByTag/${encodeURIComponent(tagId)}`);
    },
};
