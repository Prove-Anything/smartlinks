import { request, post, getApiHeaders } from "../http"
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
    productId: string,
    proofId: string,
    assetId: string
  ): Promise<AssetResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset/${encodeURIComponent(assetId)}`
    return request<AssetResponse>(path)
  }

  export async function getAllForProof(
    collectionId: string,
    productId: string,
    proofId: string,
    appId?: string
  ): Promise<AssetResponse[]> {
    let path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset`
    if (appId) {
      path += `?appId=${encodeURIComponent(appId)}`
    }
    return request<AssetResponse[]>(path)
  }

  /**
   * Uploads an asset file to a proof, with optional extraData as JSON.
   * Supports progress reporting via onProgress callback (browser only).
   * @param collectionId - The collection ID
   * @param productId - The product ID
   * @param proofId - The proof ID
   * @param file - The file to upload
   * @param extraData - Arbitrary extra data to include (will be stringified as JSON)
   * @param onProgress - Optional callback for upload progress (0-100)
   * @returns Promise resolving to an AssetResponse object
   */
  export async function uploadAsset(
    collectionId: string,
    productId: string,
    proofId: string,
    file: File,
    extraData?: Record<string, any>,
    onProgress?: (percent: number) => void
  ): Promise<AssetResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset`
    const url = (typeof window !== "undefined" && (window as any).SMARTLINKS_API_BASEURL)
      ? (window as any).SMARTLINKS_API_BASEURL + path
      : path // fallback for SSR or Node

    const formData = new FormData()
    formData.append("file", file)
    if (extraData) {
      formData.append("extraData", JSON.stringify(extraData))
    }

    // Use getApiHeaders from http module
    const headers = getApiHeaders ? getApiHeaders() : {}

    return new Promise<AssetResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", url)

      // Set headers for API key and bearer token if available
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value)
      }

      xhr.upload.onprogress = (event) => {
        if (onProgress && event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText) as AssetResponse)
          } catch (e) {
            reject(new Error("Failed to parse server response"))
          }
        } else {
          try {
            const errBody = JSON.parse(xhr.responseText)
            reject(new Error(`Error ${errBody.code}: ${errBody.message}`))
          } catch {
            reject(new Error(`Asset upload failed with status ${xhr.status}`))
          }
        }
      }

      xhr.onerror = () => reject(new Error("Network error during asset upload"))
      xhr.send(formData)
    })
  }
}
