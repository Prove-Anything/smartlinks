import { AssetResponse } from "../types/asset";
export declare namespace asset {
    function getForCollection(collectionId: string, assetId: string): Promise<AssetResponse>;
    function getAllForCollection(collectionId: string): Promise<AssetResponse[]>;
    function getForProduct(collectionId: string, productId: string, assetId: string): Promise<AssetResponse>;
    function getAllForProduct(collectionId: string, productId: string): Promise<AssetResponse[]>;
    function getForProof(collectionId: string, proofId: string, assetId: string): Promise<AssetResponse>;
    function getAllForProof(collectionId: string, proofId: string, appId?: string): Promise<AssetResponse[]>;
}
