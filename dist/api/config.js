// src/api/config.ts
import { request } from "../http.js";
export var config;
(function (config) {
    /**
     * Returns the full platform field catalog.
     * Fields are used as building blocks for proof type templates — they define
     * the input widgets shown when creating or editing products and proof items.
     * All of them come back in one answer: `nextCursor` is always null.
     *
     * **Endpoint:** `GET /api/v1/public/config/fields`
     *
     * @example
     * ```typescript
     * const { items: fields } = await config.getFields()
     * ```
     */
    async function getFields() {
        return request("/public/config/fields");
    }
    config.getFields = getFields;
    /**
     * Returns all proof type definitions.
     * Proof types are templates that specify which fields to show, which apps are
     * pre-installed, and how the portal behaves for a given product category.
     * All of them come back in one answer: `nextCursor` is always null.
     *
     * **Endpoint:** `GET /api/v1/public/config/proofTypes`
     *
     * @example
     * ```typescript
     * const { items: proofTypes } = await config.getProofTypes()
     * ```
     */
    async function getProofTypes() {
        return request("/public/config/proofTypes");
    }
    config.getProofTypes = getProofTypes;
})(config || (config = {}));
