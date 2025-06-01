import { request } from "../http";
export var asset;
(function (asset) {
    // Collection-level
    async function getForCollection(collectionId, assetId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getForCollection = getForCollection;
    async function getAllForCollection(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/asset`;
        return request(path);
    }
    asset.getAllForCollection = getAllForCollection;
    // Product-level
    async function getForProduct(collectionId, productId, assetId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getForProduct = getForProduct;
    async function getAllForProduct(collectionId, productId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset`;
        return request(path);
    }
    asset.getAllForProduct = getAllForProduct;
    // Proof-level
    async function getForProof(collectionId, proofId, assetId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/proof/${encodeURIComponent(proofId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getForProof = getForProof;
    async function getAllForProof(collectionId, proofId, appId) {
        let path = `/public/collection/${encodeURIComponent(collectionId)}/proof/${encodeURIComponent(proofId)}/asset`;
        if (appId) {
            path += `?appId=${encodeURIComponent(appId)}`;
        }
        return request(path);
    }
    asset.getAllForProof = getAllForProof;
})(asset || (asset = {}));
