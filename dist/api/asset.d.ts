import { AssetResponse } from "../types/asset";
export declare namespace asset {
    function getForCollection(collectionId: string, assetId: string): Promise<AssetResponse>;
    function getAllForCollection(collectionId: string): Promise<AssetResponse[]>;
    function getForProduct(collectionId: string, productId: string, assetId: string): Promise<AssetResponse>;
    function getAllForProduct(collectionId: string, productId: string): Promise<AssetResponse[]>;
    function getForProof(collectionId: string, productId: string, proofId: string, assetId: string): Promise<AssetResponse>;
    function getAllForProof(collectionId: string, productId: string, proofId: string, appId?: string): Promise<AssetResponse[]>;
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
    function uploadAsset(collectionId: string, productId: string, proofId: string, file: File, extraData?: Record<string, any>, onProgress?: (percent: number) => void): Promise<AssetResponse>;
}
