import { request, post, del, getApiHeaders } from "../http"
import { Asset, AssetResponse, UploadAssetOptions, ListAssetsOptions, GetAssetOptions, RemoveAssetOptions } from "../types/asset"

export namespace asset {
  /**
   * Error type for asset uploads
   */
  export class AssetUploadError extends Error {
    constructor(
      message: string,
      public readonly code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'NETWORK_ERROR' | 'UNAUTHORIZED' | 'QUOTA_EXCEEDED' | 'UNKNOWN',
      public readonly details?: Record<string, any>
    ) {
      super(message)
      this.name = 'AssetUploadError'
    }
  }

  function buildScopeBase(scope: UploadAssetOptions['scope'] | ListAssetsOptions['scope']): string {
    if (scope.type === 'collection') {
      return `/public/collection/${encodeURIComponent(scope.collectionId)}`
    }
    if (scope.type === 'product') {
      return `/public/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}`
    }
    // proof
    return `/public/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}/proof/${encodeURIComponent(scope.proofId)}`
  }

  /**
   * Upload an asset file
   * @returns The uploaded asset with its public URL
   * @throws AssetUploadError if upload fails
   */
  export async function upload(options: UploadAssetOptions): Promise<Asset> {
    const base = buildScopeBase(options.scope)
    let path = `${base}/asset`
    if (options.appId) {
      const qp = new URLSearchParams({ appId: options.appId })
      path += `?${qp.toString()}`
    }

    const formData = new FormData()
    formData.append("file", options.file)
    if (options.name) formData.append("name", options.name)
    if (options.metadata) formData.append("metadata", JSON.stringify(options.metadata))

    // If progress callback provided, use XHR for progress events (browser-only)
    if (options.onProgress && typeof window !== "undefined") {
      const url = (typeof window !== "undefined" && (window as any).SMARTLINKS_API_BASEURL)
        ? (window as any).SMARTLINKS_API_BASEURL + path
        : path

      const headers = getApiHeaders ? getApiHeaders() : {}
      return new Promise<Asset>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", url)
        for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value)

        xhr.upload.onprogress = (event) => {
          if (options.onProgress && event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            options.onProgress(percent)
          }
        }

        xhr.onload = () => {
          const status = xhr.status
          const text = xhr.responseText
          if (status >= 200 && status < 300) {
            try {
              resolve(JSON.parse(text) as Asset)
            } catch (e) {
              reject(new AssetUploadError("Failed to parse server response", 'UNKNOWN'))
            }
          } else {
            try {
              const errBody = JSON.parse(text)
              const code = mapStatusToUploadErrorCode(status, errBody?.code)
              reject(new AssetUploadError(errBody?.message || `Upload failed (${status})`, code, errBody))
            } catch {
              const code = mapStatusToUploadErrorCode(status)
              reject(new AssetUploadError(`Asset upload failed with status ${status}`, code))
            }
          }
        }

        xhr.onerror = () => reject(new AssetUploadError("Network error during asset upload", 'NETWORK_ERROR'))
        xhr.send(formData)
      })
    }

    // Otherwise use fetch helper
    try {
      return await post<Asset>(path, formData)
    } catch (e: any) {
      // Map generic Error to AssetUploadError
      const msg = e?.message || 'Upload failed'
      throw new AssetUploadError(msg, 'UNKNOWN')
    }
  }

  function mapStatusToUploadErrorCode(status: number, serverCode?: string): AssetUploadError['code'] {
    if (status === 401 || status === 403) return 'UNAUTHORIZED'
    if (status === 413) return 'FILE_TOO_LARGE'
    if (status === 415) return 'INVALID_TYPE'
    if (status === 429) return 'QUOTA_EXCEEDED'
    if (status === 0) return 'NETWORK_ERROR'
    return 'UNKNOWN'
  }

  // Collection-level
  export async function getForCollection(
    collectionId: string,
    assetId: string
  ): Promise<AssetResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}`
    return request<AssetResponse>(path)
  }

  export async function listForCollection(
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

  export async function listForProduct(
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

  export async function listForProof(
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
   * @deprecated Use `asset.upload(options)` instead.
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
    // Route through new upload API for backward compatibility
    const res = await upload({
      file,
      name: file?.name,
      metadata: extraData,
      onProgress,
      scope: { type: 'proof', collectionId, productId, proofId },
    })
    return res
  }

  /**
   * List assets for a given scope
   */
  export async function list(options: ListAssetsOptions): Promise<Asset[]> {
    const base = buildScopeBase(options.scope)
    const params = new URLSearchParams()
    if (options.appId) params.set('appId', options.appId)
    if (options.mimeTypePrefix) params.set('mimeTypePrefix', options.mimeTypePrefix)
    if (typeof options.limit === 'number') params.set('limit', String(options.limit))
    if (typeof options.offset === 'number') params.set('offset', String(options.offset))
    const path = `${base}/asset${params.toString() ? `?${params}` : ''}`
    return request<Asset[]>(path)
  }

  /**
   * Get an asset by id within a scope (public)
   */
  export async function get(options: GetAssetOptions): Promise<Asset> {
    const base = buildScopeBase(options.scope)
    const path = `${base}/asset/${encodeURIComponent(options.assetId)}`
    return request<Asset>(path)
  }

  /**
   * Remove an asset by id within a scope (admin)
   */
  export async function remove(options: RemoveAssetOptions): Promise<void> {
    const scope = options.scope
    let path: string
    if (scope.type === 'collection') {
      path = `/admin/collection/${encodeURIComponent(scope.collectionId)}/asset/${encodeURIComponent(options.assetId)}`
    } else if (scope.type === 'product') {
      path = `/admin/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}/asset/${encodeURIComponent(options.assetId)}`
    } else {
      path = `/admin/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}/proof/${encodeURIComponent(scope.proofId)}/asset/${encodeURIComponent(options.assetId)}`
    }
    return del<void>(path)
  }
}
