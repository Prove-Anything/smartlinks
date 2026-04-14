import type { FieldDefinition, ProofTypeDefinition } from "../types/config";
export declare namespace config {
    /**
     * Returns the full platform field catalog.
     * Fields are used as building blocks for proof type templates — they define
     * the input widgets shown when creating or editing products and proof items.
     *
     * **Endpoint:** `GET /api/v1/public/config/fields`
     */
    function getFields(): Promise<FieldDefinition[]>;
    /**
     * Returns all proof type definitions.
     * Proof types are templates that specify which fields to show, which apps are
     * pre-installed, and how the portal behaves for a given product category.
     *
     * **Endpoint:** `GET /api/v1/public/config/proofTypes`
     */
    function getProofTypes(): Promise<ProofTypeDefinition[]>;
}
