import type { ListResult, ListOptions } from "../types/list.js";
import { Asset, AssetResponse, UploadAssetOptions, UploadFromUrlOptions, ListAssetsOptions, GetAssetOptions, RemoveAssetOptions, AdminListAssetsOptions, UpdateAssetOptions, ReplaceAssetFileOptions, DeleteAssetOptions, BulkDeleteAssetsOptions, RequestUploadTokenOptions, UploadTokenResponse, PublicTokenUploadOptions, CreateResumableUploadOptions, ResumableUploadHandle } from "../types/asset.js";
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
    /**
     * The collection's own assets (public). Returns `{ items, nextCursor, count }`: the assets are in
     * `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor`
     * for the next page; `null` means that was the last one.
     *
     * @example
     * ```typescript
     * let page = await asset.listForCollection('my-collection', { limit: 100 })
     * while (page.nextCursor) page = await asset.listForCollection('my-collection', { limit: 100, cursor: page.nextCursor })
     * ```
     */
    function listForCollection(collectionId: string, options?: ListOptions): Promise<ListResult<AssetResponse>>;
    function getForProduct(collectionId: string, productId: string, assetId: string): Promise<AssetResponse>;
    /**
     * A product's assets (public). Returns `{ items, nextCursor, count }`: the assets are in `items`,
     * 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the
     * next page; `null` means that was the last one.
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await asset.listForProduct('my-collection', 'wine-bottle', { limit: 100 })
     * ```
     */
    function listForProduct(collectionId: string, productId: string, options?: ListOptions): Promise<ListResult<AssetResponse>>;
    function getForProof(collectionId: string, productId: string, proofId: string, assetId: string): Promise<AssetResponse>;
    /**
     * A proof's assets (public), optionally only one app's. Returns `{ items, nextCursor, count }`: the
     * assets are in `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor`
     * back as `cursor` for the next page; `null` means that was the last one.
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await asset.listForProof('my-collection', 'wine-bottle', proofId, 'gallery', { limit: 100 })
     * ```
     */
    function listForProof(collectionId: string, productId: string, proofId: string, appId?: string, options?: ListOptions): Promise<ListResult<AssetResponse>>;
    /**
     * List assets for a given scope (a collection, a product or a proof). Returns
     * `{ items, nextCursor, count }`: the assets are in `items`, 50 at a time unless you give a `limit`
     * (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the
     * last one.
     *
     * @example
     * ```typescript
     * const scope = { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' } as const
     * let page = await asset.list({ scope, appId: 'gallery', limit: 100 })
     * while (page.nextCursor) page = await asset.list({ scope, appId: 'gallery', limit: 100, cursor: page.nextCursor })
     * ```
     */
    function list(options: ListAssetsOptions): Promise<ListResult<Asset>>;
    /**
     * Get an asset by id within a scope (public)
     */
    function get(options: GetAssetOptions): Promise<Asset>;
    /**
     * Remove an asset by id within a scope (admin)
     */
    function remove(options: RemoveAssetOptions): Promise<void>;
    /**
     * List assets for a collection with full filtering options (admin). Returns `{ items, nextCursor }`:
     * the assets are in `items`, 50 at a time unless you give a `limit` (at most 200). Pass `nextCursor`
     * back as `cursor` for the next page; `null` means that was the last one. `count` (how many match in
     * all) is there when you gave a `limit` or a `cursor`. Sort with `orderBy` (`createdAt`, `name`,
     * `size` or `assetType`).
     *
     * @example
     * ```typescript
     * let page = await asset.listAdmin({ collectionId: 'my-collection', assetType: 'Image', orderBy: [{ name: 'asc' }], limit: 20 })
     * console.log(`${page.count} images`)
     * while (page.nextCursor) {
     *   page = await asset.listAdmin({ collectionId: 'my-collection', assetType: 'Image', orderBy: [{ name: 'asc' }], limit: 20, cursor: page.nextCursor })
     * }
     * ```
     */
    function listAdmin(options: AdminListAssetsOptions): Promise<ListResult<Asset>>;
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
     * Give an existing asset its own address (`assetUrl`). New and replaced assets get one automatically;
     * this is for assets made before asset addresses existed. Safe to call again. → the asset, with `assetUrl`.
     */
    function ensureAssetUrl(collectionId: string, assetId: string): Promise<Asset>;
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
    /** Thrown by a resumable `start()`/`resume()` when the caller pauses mid-transfer. */
    class UploadPausedError extends Error {
        constructor();
    }
    /**
     * Open a resumable upload for a large file (e.g. video). The bytes are chunked
     * directly to storage and can be paused/resumed — including after a page reload
     * or app restart, by persisting `handle.id` and calling {@link resumeUpload}.
     *
     * @example
     * ```ts
     * const handle = await asset.createResumableUpload({ file, scope, appId })
     * localStorage.setItem('pendingUpload', handle.id)   // survives reload
     * const uploaded = await handle.start({ onProgress: p => setPct(p) })
     * ```
     */
    function createResumableUpload(options: CreateResumableUploadOptions): Promise<ResumableUploadHandle>;
    /**
     * Resume a previously-created resumable upload after a reload/app restart.
     * Pass the persisted `handle.id` and the same `File`; the transfer continues
     * from the offset storage already holds rather than restarting.
     */
    function resumeUpload(handleId: string, file: File): Promise<ResumableUploadHandle>;
}
