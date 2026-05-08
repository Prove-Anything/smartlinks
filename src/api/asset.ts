import { request, post, put, del, getApiHeaders, isProxyEnabled, proxyUploadFormData } from "../http"
import {
  Asset,
  AssetResponse,
  UploadAssetOptions,
  UploadFromUrlOptions,
  ListAssetsOptions,
  GetAssetOptions,
  RemoveAssetOptions,
  AdminListAssetsOptions,
  AdminListAssetsResponse,
  UpdateAssetOptions,
  ReplaceAssetFileOptions,
  DeleteAssetOptions,
  BulkDeleteAssetsOptions,
  RequestUploadTokenOptions,
  UploadTokenResponse,
  PublicTokenUploadOptions,
} from "../types/asset"

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

  function buildScopeBase(
    scope: UploadAssetOptions['scope'] | ListAssetsOptions['scope'],
    isAdmin: boolean = false
  ): string {
    const prefix = isAdmin ? '/admin' : '/public'
    if (scope.type === 'collection') {
      return `${prefix}/collection/${encodeURIComponent(scope.collectionId)}`
    }
    if (scope.type === 'product') {
      return `${prefix}/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}`
    }
    // proof
    return `${prefix}/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}/proof/${encodeURIComponent(scope.proofId)}`
  }

  /**
   * Upload an asset file
   * @returns The uploaded asset with its public URL
   * @throws AssetUploadError if upload fails
   */
  export async function upload(options: UploadAssetOptions): Promise<Asset> {
    const base = buildScopeBase(options.scope, !!options.admin)
    let path = `${base}/asset`
    if (options.appId) {
      const qp = new URLSearchParams({ appId: options.appId })
      path += `?${qp.toString()}`
    }

    const formData = new FormData()
    formData.append("file", options.file)
    if (options.name) formData.append("name", options.name)
    if (options.metadata) formData.append("metadata", JSON.stringify(options.metadata))

    // If progress callback provided and NOT in proxy mode, use XHR for progress events (browser-only)
    if (options.onProgress && typeof window !== "undefined" && !isProxyEnabled()) {
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

    // If in proxy mode and progress requested, use enhanced proxy upload to support progress
    if (options.onProgress && isProxyEnabled()) {
      try {
        return await proxyUploadFormData<Asset>(path, formData, options.onProgress)
      } catch (e: any) {
        const msg = e?.message || 'Upload failed'
        throw new AssetUploadError(msg, 'UNKNOWN')
      }
    }

    // Otherwise use fetch helper (in proxy mode this becomes a postMessage with serialized FormData)
    try {
      return await post<Asset>(path, formData)
    } catch (e: any) {
      // Map generic Error to AssetUploadError
      const msg = e?.message || 'Upload failed'
      throw new AssetUploadError(msg, 'UNKNOWN')
    }
  }

  /**
   * Upload an asset from a URL
   * The server will fetch the file from the provided URL and store it permanently in your CDN.
   * This solves CORS issues and ensures files are permanently stored.
   * 
   * @param options - Upload options including URL and scope
   * @returns The uploaded asset with its CDN URL
   * @throws AssetUploadError if upload fails
   * 
   * @example
   * ```typescript
   * // Upload AI-generated image
   * const asset = await asset.uploadFromUrl({
   *   url: 'https://oaidalleapiprodscus.blob.core.windows.net/...',
   *   scope: { type: 'collection', collectionId: 'my-collection' },
   *   metadata: { name: 'AI Generated Image', app: 'gallery' }
   * });
   * 
   * // Upload stock photo
   * const asset = await asset.uploadFromUrl({
   *   url: 'https://images.unsplash.com/photo-...',
   *   scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' },
   *   folder: 'images',
   *   metadata: { name: 'Product Photo' }
   * });
   * ```
   */
  export async function uploadFromUrl(options: UploadFromUrlOptions): Promise<Asset> {
    const base = buildScopeBase(options.scope, !!options.admin)
    let path = `${base}/asset`
    if (options.appId) {
      const qp = new URLSearchParams({ appId: options.appId })
      path += `?${qp.toString()}`
    }

    const body: Record<string, any> = {
      url: options.url
    }
    
    if (options.folder) {
      body.folder = options.folder
    }
    
    if (options.metadata) {
      body.extraData = options.metadata
    }

    try {
      return await post<Asset>(path, body)
    } catch (e: any) {
      const msg = e?.message || 'URL upload failed'
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

  // ---------------------------------------------------------------------------
  // Admin asset management — flat collection-scoped endpoints
  // Base: /api/admin/collection/:collectionId/assets
  // ---------------------------------------------------------------------------

  /**
   * List assets for a collection with full filtering options.
   */
  export async function listAdmin(options: AdminListAssetsOptions): Promise<AdminListAssetsResponse> {
    const params = new URLSearchParams()
    if (options.productId) params.set('productId', options.productId)
    if (options.proofId) params.set('proofId', options.proofId)
    if (options.appId) params.set('appId', options.appId)
    if (options.assetType) params.set('assetType', options.assetType)
    if (options.labels) params.set('labels', options.labels)
    if (options.sort) params.set('sort', options.sort)
    if (options.order) params.set('order', options.order)
    if (typeof options.limit === 'number') params.set('limit', String(options.limit))
    if (typeof options.offset === 'number') params.set('offset', String(options.offset))
    const qs = params.toString()
    const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset${qs ? `?${qs}` : ''}`
    return request<AdminListAssetsResponse>(path)
  }

  /**
   * Get a single asset by ID (admin).
   */
  export async function getAdmin(collectionId: string, assetId: string): Promise<Asset> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}`
    return request<Asset>(path)
  }

  /**
   * Update asset metadata (admin). Use `replaceFile` to swap the file.
   */
  export async function updateAdmin(options: UpdateAssetOptions): Promise<Asset> {
    const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/${encodeURIComponent(options.assetId)}`
    const { collectionId: _c, assetId: _a, ...body } = options
    return put<Asset>(path, body)
  }

  /**
   * Replace the file of an existing asset. The previous file URL is snapshotted
   * into `versions[]` on the asset.
   */
  export async function replaceFile(options: ReplaceAssetFileOptions): Promise<Asset> {
    const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/${encodeURIComponent(options.assetId)}/replace`
    const formData = new FormData()
    formData.append('file', options.file)

    if (options.onProgress && typeof window !== 'undefined' && !isProxyEnabled()) {
      const url = (typeof window !== 'undefined' && (window as any).SMARTLINKS_API_BASEURL)
        ? (window as any).SMARTLINKS_API_BASEURL + path
        : path
      const headers = getApiHeaders ? getApiHeaders() : {}
      return new Promise<Asset>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)
        for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value)
        xhr.upload.onprogress = (event) => {
          if (options.onProgress && event.lengthComputable) {
            options.onProgress(Math.round((event.loaded / event.total) * 100))
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try { resolve(JSON.parse(xhr.responseText) as Asset) } catch { reject(new AssetUploadError('Failed to parse server response', 'UNKNOWN')) }
          } else {
            try { const e = JSON.parse(xhr.responseText); reject(new AssetUploadError(e?.message || `Replace failed (${xhr.status})`, mapStatusToUploadErrorCode(xhr.status, e?.code), e)) }
            catch { reject(new AssetUploadError(`Replace failed with status ${xhr.status}`, mapStatusToUploadErrorCode(xhr.status))) }
          }
        }
        xhr.onerror = () => reject(new AssetUploadError('Network error during file replace', 'NETWORK_ERROR'))
        xhr.send(formData)
      })
    }

    return post<Asset>(path, formData)
  }

  /**
   * Soft-delete an asset. Schedules CDN purge after `graceDays` (default 30).
   * Recoverable via `restoreAdmin` until purge runs.
   */
  export async function deleteAdmin(options: DeleteAssetOptions): Promise<{ deleted: true }> {
    const params = new URLSearchParams()
    if (typeof options.graceDays === 'number') params.set('graceDays', String(options.graceDays))
    const qs = params.toString()
    const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/${encodeURIComponent(options.assetId)}${qs ? `?${qs}` : ''}`
    return del<{ deleted: true }>(path)
  }

  /**
   * Restore a soft-deleted asset (clears `deletedAt`).
   */
  export async function restoreAdmin(collectionId: string, assetId: string): Promise<Asset> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}/restore`
    return post<Asset>(path, {})
  }

  /**
   * Soft-delete multiple assets in one request.
   */
  export async function bulkDelete(options: BulkDeleteAssetsOptions): Promise<{ deleted: number }> {
    const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/bulk-delete`
    const body: Record<string, any> = { assetIds: options.assetIds }
    if (typeof options.graceDays === 'number') body.graceDays = options.graceDays
    return post<{ deleted: number }>(path, body)
  }

  // ---------------------------------------------------------------------------
  // Public (token-based) uploads
  // ---------------------------------------------------------------------------

  /**
   * Request a single-use upload token for a public (unauthenticated) upload.
   * The token encodes the upload policy (allowed types, max size, review requirement).
   *
   * @example
   * ```typescript
   * const { tokenId, policy } = await asset.requestUploadToken({
   *   collectionId: 'my-collection',
   *   appId: 'user-gallery',
   *   contactId: contact.id,
   * })
   * const uploaded = await asset.publicUploadWithToken({
   *   collectionId: 'my-collection',
   *   tokenId,
   *   file: selectedFile,
   * })
   * ```
   */
  export async function requestUploadToken(options: RequestUploadTokenOptions): Promise<UploadTokenResponse> {
    const path = `/public/collection/${encodeURIComponent(options.collectionId)}/asset/token`
    const body: Record<string, any> = { appId: options.appId }
    if (options.contactId) body.contactId = options.contactId
    if (options.productId) body.productId = options.productId
    if (options.proofId) body.proofId = options.proofId
    return post<UploadTokenResponse>(path, body)
  }

  /**
   * Upload a file using a single-use upload token (no admin auth required).
   * Assets are created with `status: 'pending_review'` when the token policy
   * has `reviewRequired: true`.
   */
  export async function publicUploadWithToken(options: PublicTokenUploadOptions): Promise<Asset> {
    const path = `/public/collection/${encodeURIComponent(options.collectionId)}/asset`
    const formData = new FormData()
    formData.append('file', options.file)
    if (options.name) formData.append('name', options.name)
    if (options.metadata) formData.append('metadata', JSON.stringify(options.metadata))

    if (options.onProgress && typeof window !== 'undefined' && !isProxyEnabled()) {
      const baseUrl = (typeof window !== 'undefined' && (window as any).SMARTLINKS_API_BASEURL)
        ? (window as any).SMARTLINKS_API_BASEURL + path
        : path
      const headers = { ...getApiHeaders(), 'X-Upload-Token': options.tokenId }
      return new Promise<Asset>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', baseUrl)
        for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value)
        xhr.upload.onprogress = (event) => {
          if (options.onProgress && event.lengthComputable) {
            options.onProgress(Math.round((event.loaded / event.total) * 100))
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try { resolve(JSON.parse(xhr.responseText) as Asset) } catch { reject(new AssetUploadError('Failed to parse server response', 'UNKNOWN')) }
          } else {
            try { const e = JSON.parse(xhr.responseText); reject(new AssetUploadError(e?.message || `Upload failed (${xhr.status})`, mapStatusToUploadErrorCode(xhr.status, e?.code), e)) }
            catch { reject(new AssetUploadError(`Upload failed with status ${xhr.status}`, mapStatusToUploadErrorCode(xhr.status))) }
          }
        }
        xhr.onerror = () => reject(new AssetUploadError('Network error during public upload', 'NETWORK_ERROR'))
        xhr.send(formData)
      })
    }

    // Pass the token as a header via a custom fetch; post() doesn't accept extra headers,
    // so we build the request manually using the same base URL resolution.
    const baseUrl = (typeof window !== 'undefined' && (window as any).SMARTLINKS_API_BASEURL)
      ? (window as any).SMARTLINKS_API_BASEURL + path
      : path
    const headers = { ...getApiHeaders(), 'X-Upload-Token': options.tokenId }
    const response = await fetch(baseUrl, { method: 'POST', headers, body: formData })
    if (!response.ok) {
      let errBody: any
      try { errBody = await response.json() } catch { /* ignore */ }
      throw new AssetUploadError(
        errBody?.message || `Public upload failed (${response.status})`,
        mapStatusToUploadErrorCode(response.status, errBody?.code),
        errBody
      )
    }
    return response.json() as Promise<Asset>
  }
}
