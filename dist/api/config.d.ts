import type { FieldDefinition, ProofTypeDefinition } from "../types/config.js";
import type { ListResult } from "../types/list.js";
export declare namespace config {
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
    function getFields(): Promise<ListResult<FieldDefinition>>;
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
    function getProofTypes(): Promise<ListResult<ProofTypeDefinition>>;
}
