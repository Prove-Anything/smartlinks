import { Asset, AssetResponse, UploadAssetOptions, UploadFromUrlOptions, ListAssetsOptions, GetAssetOptions, RemoveAssetOptions, AdminListAssetsOptions, AdminListAssetsResponse, UpdateAssetOptions, ReplaceAssetFileOptions, DeleteAssetOptions, BulkDeleteAssetsOptions, RequestUploadTokenOptions, UploadTokenResponse, PublicTokenUploadOptions } from "../types/asset";
export declare namespace asset {
    /**
     * Error type for asset uploads
     */
    class AssetUploadError extends Error {
        readonly code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'NETWORK_ERROR' | 'UNAUTHORIZED' | 'QUOTA_EXCEEDED' | 'UNKNOWN';
        readonly details?: Record<string, any> | undefined;
        constructor(message: string, code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'NETWORK_ERROR' | 'UNAUTHORIZED' | 'QUOTA_EXCEEDED' | 'UNKNOWN', details?: Record<string, any> | undefined);
    }
    /**
     * Upload an asset file
     * @returns The uploaded asset with its public URL
     * @throws AssetUploadError if upload fails
     */
    function upload(options: UploadAssetOptions): Promise<Asset>;
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
    function uploadFromUrl(options: UploadFromUrlOptions): Promise<Asset>;
    function getForCollection(collectionId: string, assetId: string): Promise<AssetResponse>;
    function listForCollection(collectionId: string): Promise<AssetResponse[]>;
    function getForProduct(collectionId: string, productId: string, assetId: string): Promise<AssetResponse>;
    function listForProduct(collectionId: string, productId: string): Promise<AssetResponse[]>;
    function getForProof(collectionId: string, productId: string, proofId: string, assetId: string): Promise<AssetResponse>;
    function listForProof(collectionId: string, productId: string, proofId: string, appId?: string): Promise<AssetResponse[]>;
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
    function uploadAsset(collectionId: string, productId: string, proofId: string, file: File, extraData?: Record<string, any>, onProgress?: (percent: number) => void): Promise<AssetResponse>;
    /**
     * List assets for a given scope
     */
    function list(options: ListAssetsOptions): Promise<Asset[]>;
    /**
     * Get an asset by id within a scope (public)
     */
    function get(options: GetAssetOptions): Promise<Asset>;
    /**
     * Remove an asset by id within a scope (admin)
     */
    function remove(options: RemoveAssetOptions): Promise<void>;
    /**
     * List assets for a collection with full filtering options.
     */
    function listAdmin(options: AdminListAssetsOptions): Promise<AdminListAssetsResponse>;
    /**
     * Get a single asset by ID (admin).
     */
    function getAdmin(collectionId: string, assetId: string): Promise<Asset>;
    /**
     * Update asset metadata (admin). Use `replaceFile` to swap the file.
     */
    function updateAdmin(options: UpdateAssetOptions): Promise<Asset>;
    /**
     * Replace the file of an existing asset. The previous file URL is snapshotted
     * into `versions[]` on the asset.
     */
    function replaceFile(options: ReplaceAssetFileOptions): Promise<Asset>;
    /**
     * Soft-delete an asset. Schedules CDN purge after `graceDays` (default 30).
     * Recoverable via `restoreAdmin` until purge runs.
     */
    function deleteAdmin(options: DeleteAssetOptions): Promise<{
        deleted: true;
    }>;
    /**
     * Restore a soft-deleted asset (clears `deletedAt`).
     */
    function restoreAdmin(collectionId: string, assetId: string): Promise<Asset>;
    /**
     * Soft-delete multiple assets in one request.
     */
    function bulkDelete(options: BulkDeleteAssetsOptions): Promise<{
        deleted: number;
    }>;
    /**
     * Request a single-use upload token for a public (unauthenticated) upload.
     * The token encodes the upload policy (allowed types, max size, review requirement).
      *
      * Policy source: collection-scoped app config at
      * `sites/{collectionId}/apps/{appId}` (`uploadPolicy` key).
      * Global `apps/{appId}` config is not used for this endpoint.
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
    function requestUploadToken(options: RequestUploadTokenOptions): Promise<UploadTokenResponse>;
    /**
     * Upload a file using a single-use upload token (no admin auth required).
     * Assets are created with `status: 'pending_review'` when the token policy
     * has `reviewRequired: true`.
     */
    function publicUploadWithToken(options: PublicTokenUploadOptions): Promise<Asset>;
}
