// src/api/proof.ts
import { request, post, put, del } from "../http"
import { ProofResponse, ProofCreateRequest, ProofUpdateRequest, ProofClaimRequest } from "../types/proof"

export namespace proof {
  /**
   * Retrieves a single Proof by Collection ID, Product ID, and Proof ID.
   * Both public and admin endpoints now include productId in the path.
   */
  export async function get(
    collectionId: string,
    productId: string,
    proofId: string,
    admin?: boolean,
    include?: string[]
  ): Promise<ProofResponse> {
    const base = admin ? '/admin' : '/public'
    const qp = include && include.length ? `?include=${encodeURIComponent(include.join(','))}` : ''
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}${qp}`
    return request<ProofResponse>(path)
  }

  /**
   * List all Proofs for a Collection.
   */
  export async function list(
    collectionId: string,
    include?: string[]
  ): Promise<ProofResponse[]> {
    const qp = include && include.length ? `?include=${encodeURIComponent(include.join(','))}` : ''
    const path = `/public/collection/${encodeURIComponent(collectionId)}/proof${qp}`
    return request<ProofResponse[]>(path)
  }

  // -------------------- Admin functions (legacy parity) --------------------

  /**
   * Create a proof for a product (admin only).
   * POST /admin/collection/:collectionId/product/:productId/proof
   */
  export async function create(
    collectionId: string,
    productId: string,
    values: ProofCreateRequest
  ): Promise<ProofResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof`
    return post<ProofResponse>(path, values)
  }

  /**
   * Update a proof for a product (admin only).
   * PUT /admin/collection/:collectionId/product/:productId/proof/:proofId
   */
  export async function update(
    collectionId: string,
    productId: string,
    proofId: string,
    values: ProofUpdateRequest
  ): Promise<ProofResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}`
    return put<ProofResponse>(path, values)
  }


  /**
   * Claim a proof for a product using a proof ID (serial number, NFC tag, etc.).
   * PUT /public/collection/:collectionId/product/:productId/proof/:proofId/claim
   */
  export async function claim(
    collectionId: string,
    productId: string,
    proofId: string,
    values: ProofClaimRequest
  ): Promise<ProofResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/claim`
    return put<ProofResponse>(path, values)
  }

  /**
   * Claim a product without providing a proof ID.
   * System auto-generates a unique serial number on-demand.
   * Requires allowAutoGenerateClaims to be enabled on the collection or product.
   * PUT /public/collection/:collectionId/product/:productId/proof/claim
   * 
   * @example
   * ```typescript
   * const proof = await proof.claimProduct(
   *   'beauty-brand',
   *   'moisturizer-pro',
   *   { purchaseDate: '2026-02-17', store: 'Target' }
   * );
   * console.log('Auto-generated ID:', proof.id);
   * ```
   */
  export async function claimProduct(
    collectionId: string,
    productId: string,
    values?: ProofClaimRequest
  ): Promise<ProofResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/claim`
    return put<ProofResponse>(path, values || {})
  }  

  /**
   * Delete a proof for a product (admin only).
   * DELETE /admin/collection/:collectionId/product/:productId/proof/:proofId
   */
  export async function remove(
    collectionId: string,
    productId: string,
    proofId: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}`
    return del<void>(path)
  }

  /**
   * Get proofs for a user in a collection (admin only).
   * GET /admin/collection/:collectionId/proof/findByUser/:userId
   */
  export async function getByUser(
    collectionId: string,
    userId: string
  ): Promise<ProofResponse[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/proof/findByUser/${encodeURIComponent(userId)}`
    return request<ProofResponse[]>(path)
  }

  /**
   * Get proofs for a product (admin only).
   * GET /admin/collection/:collectionId/product/:productId/proof
   */
  export async function getByProduct(
    collectionId: string,
    productId: string
  ): Promise<ProofResponse[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof`
    return request<ProofResponse[]>(path)
  }

  /**
   * Find proofs for a product (admin only).
   * POST /admin/collection/:collectionId/product/:productId/proof/find
   */
  export async function findByProduct(
    collectionId: string,
    productId: string,
    query: any
  ): Promise<ProofResponse[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/find`
    return post<ProofResponse[]>(path, query)
  }

  /**
   * Get proofs for a batch (admin only).
   * GET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof
   */
  export async function getByBatch(
    collectionId: string,
    productId: string,
    batchId: string
  ): Promise<ProofResponse[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}/proof`
    return request<ProofResponse[]>(path)
  }
}
