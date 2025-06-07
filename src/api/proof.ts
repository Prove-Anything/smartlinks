// src/api/proof.ts
import { request } from "../http"
import { ProofResponse } from "../types/proof"

export namespace proof {
  /**
   * Retrieves a single Proof by Collection ID and Proof ID.
   * @param collectionId – Identifier of the parent collection
   * @param proofId      – Identifier of the proof
   * @returns Promise resolving to a ProofResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(
    collectionId: string,
    proofId: string
  ): Promise<ProofResponse> {
    const path = `/public/collection/${encodeURIComponent(
      collectionId
    )}/proof/${encodeURIComponent(proofId)}`
    return request<ProofResponse>(path)
  }

  /**
   * List all Proofs for a Collection.
   */
  export async function list(
    collectionId: string
  ): Promise<ProofResponse[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/proof`
    return request<ProofResponse[]>(path)
  }
}
