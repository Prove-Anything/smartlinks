import { request, getApiHeaders } from "../http";
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
    async function getForProof(collectionId, productId, proofId, assetId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getForProof = getForProof;
    async function getAllForProof(collectionId, productId, proofId, appId) {
        let path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset`;
        if (appId) {
            path += `?appId=${encodeURIComponent(appId)}`;
        }
        return request(path);
    }
    asset.getAllForProof = getAllForProof;
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
    async function uploadAsset(collectionId, productId, proofId, file, extraData, onProgress) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset`;
        const url = (typeof window !== "undefined" && window.SMARTLINKS_API_BASEURL)
            ? window.SMARTLINKS_API_BASEURL + path
            : path; // fallback for SSR or Node
        const formData = new FormData();
        formData.append("file", file);
        if (extraData) {
            formData.append("extraData", JSON.stringify(extraData));
        }
        // Use getApiHeaders from http module
        const headers = getApiHeaders ? getApiHeaders() : {};
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            // Set headers for API key and bearer token if available
            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }
            xhr.upload.onprogress = (event) => {
                if (onProgress && event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    }
                    catch (e) {
                        reject(new Error("Failed to parse server response"));
                    }
                }
                else {
                    try {
                        const errBody = JSON.parse(xhr.responseText);
                        reject(new Error(`Error ${errBody.code}: ${errBody.message}`));
                    }
                    catch (_a) {
                        reject(new Error(`Asset upload failed with status ${xhr.status}`));
                    }
                }
            };
            xhr.onerror = () => reject(new Error("Network error during asset upload"));
            xhr.send(formData);
        });
    }
    asset.uploadAsset = uploadAsset;
})(asset || (asset = {}));
