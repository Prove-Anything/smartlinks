import { Asset, AssetResponse, UploadAssetOptions, ListAssetsOptions, GetAssetOptions, RemoveAssetOptions } from "../types/asset";
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
}
