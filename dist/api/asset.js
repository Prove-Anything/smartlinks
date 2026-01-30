import { request, post, del, getApiHeaders, isProxyEnabled, proxyUploadFormData } from "../http";
export var asset;
(function (asset) {
    /**
     * Error type for asset uploads
     */
    class AssetUploadError extends Error {
        constructor(message, code, details) {
            super(message);
            this.code = code;
            this.details = details;
            this.name = 'AssetUploadError';
        }
    }
    asset.AssetUploadError = AssetUploadError;
    function buildScopeBase(scope, isAdmin = false) {
        const prefix = isAdmin ? '/admin' : '/public';
        if (scope.type === 'collection') {
            return `${prefix}/collection/${encodeURIComponent(scope.collectionId)}`;
        }
        if (scope.type === 'product') {
            return `${prefix}/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}`;
        }
        // proof
        return `${prefix}/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}/proof/${encodeURIComponent(scope.proofId)}`;
    }
    /**
     * Upload an asset file
     * @returns The uploaded asset with its public URL
     * @throws AssetUploadError if upload fails
     */
    async function upload(options) {
        const base = buildScopeBase(options.scope, !!options.admin);
        let path = `${base}/asset`;
        if (options.appId) {
            const qp = new URLSearchParams({ appId: options.appId });
            path += `?${qp.toString()}`;
        }
        const formData = new FormData();
        formData.append("file", options.file);
        if (options.name)
            formData.append("name", options.name);
        if (options.metadata)
            formData.append("metadata", JSON.stringify(options.metadata));
        // If progress callback provided and NOT in proxy mode, use XHR for progress events (browser-only)
        if (options.onProgress && typeof window !== "undefined" && !isProxyEnabled()) {
            const url = (typeof window !== "undefined" && window.SMARTLINKS_API_BASEURL)
                ? window.SMARTLINKS_API_BASEURL + path
                : path;
            const headers = getApiHeaders ? getApiHeaders() : {};
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                for (const [key, value] of Object.entries(headers))
                    xhr.setRequestHeader(key, value);
                xhr.upload.onprogress = (event) => {
                    if (options.onProgress && event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        options.onProgress(percent);
                    }
                };
                xhr.onload = () => {
                    const status = xhr.status;
                    const text = xhr.responseText;
                    if (status >= 200 && status < 300) {
                        try {
                            resolve(JSON.parse(text));
                        }
                        catch (e) {
                            reject(new AssetUploadError("Failed to parse server response", 'UNKNOWN'));
                        }
                    }
                    else {
                        try {
                            const errBody = JSON.parse(text);
                            const code = mapStatusToUploadErrorCode(status, errBody === null || errBody === void 0 ? void 0 : errBody.code);
                            reject(new AssetUploadError((errBody === null || errBody === void 0 ? void 0 : errBody.message) || `Upload failed (${status})`, code, errBody));
                        }
                        catch (_a) {
                            const code = mapStatusToUploadErrorCode(status);
                            reject(new AssetUploadError(`Asset upload failed with status ${status}`, code));
                        }
                    }
                };
                xhr.onerror = () => reject(new AssetUploadError("Network error during asset upload", 'NETWORK_ERROR'));
                xhr.send(formData);
            });
        }
        // If in proxy mode and progress requested, use enhanced proxy upload to support progress
        if (options.onProgress && isProxyEnabled()) {
            try {
                return await proxyUploadFormData(path, formData, options.onProgress);
            }
            catch (e) {
                const msg = (e === null || e === void 0 ? void 0 : e.message) || 'Upload failed';
                throw new AssetUploadError(msg, 'UNKNOWN');
            }
        }
        // Otherwise use fetch helper (in proxy mode this becomes a postMessage with serialized FormData)
        try {
            return await post(path, formData);
        }
        catch (e) {
            // Map generic Error to AssetUploadError
            const msg = (e === null || e === void 0 ? void 0 : e.message) || 'Upload failed';
            throw new AssetUploadError(msg, 'UNKNOWN');
        }
    }
    asset.upload = upload;
    function mapStatusToUploadErrorCode(status, serverCode) {
        if (status === 401 || status === 403)
            return 'UNAUTHORIZED';
        if (status === 413)
            return 'FILE_TOO_LARGE';
        if (status === 415)
            return 'INVALID_TYPE';
        if (status === 429)
            return 'QUOTA_EXCEEDED';
        if (status === 0)
            return 'NETWORK_ERROR';
        return 'UNKNOWN';
    }
    // Collection-level
    async function getForCollection(collectionId, assetId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getForCollection = getForCollection;
    async function listForCollection(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/asset`;
        return request(path);
    }
    asset.listForCollection = listForCollection;
    // Product-level
    async function getForProduct(collectionId, productId, assetId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getForProduct = getForProduct;
    async function listForProduct(collectionId, productId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset`;
        return request(path);
    }
    asset.listForProduct = listForProduct;
    // Proof-level
    async function getForProof(collectionId, productId, proofId, assetId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getForProof = getForProof;
    async function listForProof(collectionId, productId, proofId, appId) {
        let path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/asset`;
        if (appId) {
            path += `?appId=${encodeURIComponent(appId)}`;
        }
        return request(path);
    }
    asset.listForProof = listForProof;
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
    async function uploadAsset(collectionId, productId, proofId, file, extraData, onProgress) {
        // Route through new upload API for backward compatibility
        const res = await upload({
            file,
            name: file === null || file === void 0 ? void 0 : file.name,
            metadata: extraData,
            onProgress,
            scope: { type: 'proof', collectionId, productId, proofId },
        });
        return res;
    }
    asset.uploadAsset = uploadAsset;
    /**
     * List assets for a given scope
     */
    async function list(options) {
        const base = buildScopeBase(options.scope);
        const params = new URLSearchParams();
        if (options.appId)
            params.set('appId', options.appId);
        if (options.mimeTypePrefix)
            params.set('mimeTypePrefix', options.mimeTypePrefix);
        if (typeof options.limit === 'number')
            params.set('limit', String(options.limit));
        if (typeof options.offset === 'number')
            params.set('offset', String(options.offset));
        const path = `${base}/asset${params.toString() ? `?${params}` : ''}`;
        return request(path);
    }
    asset.list = list;
    /**
     * Get an asset by id within a scope (public)
     */
    async function get(options) {
        const base = buildScopeBase(options.scope);
        const path = `${base}/asset/${encodeURIComponent(options.assetId)}`;
        return request(path);
    }
    asset.get = get;
    /**
     * Remove an asset by id within a scope (admin)
     */
    async function remove(options) {
        const scope = options.scope;
        let path;
        if (scope.type === 'collection') {
            path = `/admin/collection/${encodeURIComponent(scope.collectionId)}/asset/${encodeURIComponent(options.assetId)}`;
        }
        else if (scope.type === 'product') {
            path = `/admin/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}/asset/${encodeURIComponent(options.assetId)}`;
        }
        else {
            path = `/admin/collection/${encodeURIComponent(scope.collectionId)}/product/${encodeURIComponent(scope.productId)}/proof/${encodeURIComponent(scope.proofId)}/asset/${encodeURIComponent(options.assetId)}`;
        }
        return del(path);
    }
    asset.remove = remove;
})(asset || (asset = {}));
