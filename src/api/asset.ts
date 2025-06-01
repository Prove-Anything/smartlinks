import { request } from "../http"
import { AssetResponse } from "../types/asset"

export namespace asset {
  // Collection-level
  export async function getForCollection(
    collectionId: string,
    assetId: string
  ): Promise<AssetResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}`
    return request<AssetResponse>(path)
  }

  export async function getAllForCollection(
    collectionId: string
  ): Promise<AssetResponse[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/asset`
    return request<AssetResponse[]>(path)
  }

  // Product-level
  export async function getForProduct(
    collectionId: string,
    productId: string,
    assetId: string
  ): Promise<AssetResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset/${encodeURIComponent(assetId)}`
    return request<AssetResponse>(path)
  }

  export async function getAllForProduct(
    collectionId: string,
    productId: string
  ): Promise<AssetResponse[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset`
    return request<AssetResponse[]>(path)
  }

  // Proof-level
  export async function getForProof(
    collectionId: string,
    proofId: string,
    assetId: string
  ): Promise<AssetResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/proof/${encodeURIComponent(proofId)}/asset/${encodeURIComponent(assetId)}`
    return request<AssetResponse>(path)
  }

  export async function getAllForProof(
    collectionId: string,
    proofId: string,
    appId?: string
  ): Promise<AssetResponse[]> {
    let path = `/public/collection/${encodeURIComponent(collectionId)}/proof/${encodeURIComponent(proofId)}/asset`
    if (appId) {
      path += `?appId=${encodeURIComponent(appId)}`
    }
    return request<AssetResponse[]>(path)
  }
}
