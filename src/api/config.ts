// src/api/config.ts
import { request } from "../http"
import type { FieldDefinition, ProofTypeDefinition } from "../types/config"

export namespace config {

  /**
   * Returns the full platform field catalog.
   * Fields are used as building blocks for proof type templates — they define
   * the input widgets shown when creating or editing products and proof items.
   *
   * **Endpoint:** `GET /api/v1/public/config/fields`
   */
  export async function getFields(): Promise<FieldDefinition[]> {
    return request<FieldDefinition[]>("/public/config/fields")
  }

  /**
   * Returns all proof type definitions.
   * Proof types are templates that specify which fields to show, which apps are
   * pre-installed, and how the portal behaves for a given product category.
   *
   * **Endpoint:** `GET /api/v1/public/config/proofTypes`
   */
  export async function getProofTypes(): Promise<ProofTypeDefinition[]> {
    return request<ProofTypeDefinition[]>("/public/config/proofTypes")
  }

}
