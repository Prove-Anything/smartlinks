import { request, post, put, del } from "../http"
import type { AttestationResponse, AttestationCreateRequest, AttestationUpdateRequest } from "../types/attestation"

export namespace attestation {
  /**
   * Get all attestations for a proof.
   */
  export async function getAll(
    collectionId: string,
    productId: string,
    proofId: string
  ): Promise<AttestationResponse[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`
    return request<AttestationResponse[]>(path)
  }

  /**
   * Get a single attestation by ID.
   */
  export async function get(
    collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string
  ): Promise<AttestationResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`
    return request<AttestationResponse>(path)
  }

  /**
   * Create a new attestation for a proof.
   */
  export async function create(
    collectionId: string,
    productId: string,
    proofId: string,
    data: AttestationCreateRequest
  ): Promise<AttestationResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`
    return post<AttestationResponse>(path, data)
  }

  /**
   * Update an attestation.
   */
  export async function update(
    collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string,
    data: AttestationUpdateRequest
  ): Promise<AttestationResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`
    return put<AttestationResponse>(path, data)
  }

  /**
   * Delete an attestation.
   */
  export async function remove(
    collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string
  ): Promise<void> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`
    return del<void>(path)
  }
}
