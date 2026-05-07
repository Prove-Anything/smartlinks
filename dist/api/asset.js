var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { request, post, put, del, getApiHeaders, isProxyEnabled, proxyUploadFormData } from "../http";
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
                        catch (_b) {
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
    async function uploadFromUrl(options) {
        const base = buildScopeBase(options.scope, !!options.admin);
        let path = `${base}/asset`;
        if (options.appId) {
            const qp = new URLSearchParams({ appId: options.appId });
            path += `?${qp.toString()}`;
        }
        const body = {
            url: options.url
        };
        if (options.folder) {
            body.folder = options.folder;
        }
        if (options.metadata) {
            body.extraData = options.metadata;
        }
        try {
            return await post(path, body);
        }
        catch (e) {
            const msg = (e === null || e === void 0 ? void 0 : e.message) || 'URL upload failed';
            throw new AssetUploadError(msg, 'UNKNOWN');
        }
    }
    asset.uploadFromUrl = uploadFromUrl;
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
    // ---------------------------------------------------------------------------
    // Admin asset management — flat collection-scoped endpoints
    // Base: /api/admin/collection/:collectionId/assets
    // ---------------------------------------------------------------------------
    /**
     * List assets for a collection with full filtering options.
     */
    async function listAdmin(options) {
        const params = new URLSearchParams();
        if (options.productId)
            params.set('productId', options.productId);
        if (options.proofId)
            params.set('proofId', options.proofId);
        if (options.appId)
            params.set('appId', options.appId);
        if (options.assetType)
            params.set('assetType', options.assetType);
        if (options.labels)
            params.set('labels', options.labels);
        if (options.sort)
            params.set('sort', options.sort);
        if (options.order)
            params.set('order', options.order);
        if (typeof options.limit === 'number')
            params.set('limit', String(options.limit));
        if (typeof options.offset === 'number')
            params.set('offset', String(options.offset));
        const qs = params.toString();
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/assets${qs ? `?${qs}` : ''}`;
        return request(path);
    }
    asset.listAdmin = listAdmin;
    /**
     * Get a single asset by ID (admin).
     */
    async function getAdmin(collectionId, assetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/assets/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getAdmin = getAdmin;
    /**
     * Update asset metadata (admin). Use `replaceFile` to swap the file.
     */
    async function updateAdmin(options) {
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/assets/${encodeURIComponent(options.assetId)}`;
        const { collectionId: _c, assetId: _a } = options, body = __rest(options, ["collectionId", "assetId"]);
        return put(path, body);
    }
    asset.updateAdmin = updateAdmin;
    /**
     * Replace the file of an existing asset. The previous file URL is snapshotted
     * into `versions[]` on the asset.
     */
    async function replaceFile(options) {
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/assets/${encodeURIComponent(options.assetId)}/replace`;
        const formData = new FormData();
        formData.append('file', options.file);
        if (options.onProgress && typeof window !== 'undefined' && !isProxyEnabled()) {
            const url = (typeof window !== 'undefined' && window.SMARTLINKS_API_BASEURL)
                ? window.SMARTLINKS_API_BASEURL + path
                : path;
            const headers = getApiHeaders ? getApiHeaders() : {};
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                for (const [key, value] of Object.entries(headers))
                    xhr.setRequestHeader(key, value);
                xhr.upload.onprogress = (event) => {
                    if (options.onProgress && event.lengthComputable) {
                        options.onProgress(Math.round((event.loaded / event.total) * 100));
                    }
                };
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        }
                        catch (_b) {
                            reject(new AssetUploadError('Failed to parse server response', 'UNKNOWN'));
                        }
                    }
                    else {
                        try {
                            const e = JSON.parse(xhr.responseText);
                            reject(new AssetUploadError((e === null || e === void 0 ? void 0 : e.message) || `Replace failed (${xhr.status})`, mapStatusToUploadErrorCode(xhr.status, e === null || e === void 0 ? void 0 : e.code), e));
                        }
                        catch (_d) {
                            reject(new AssetUploadError(`Replace failed with status ${xhr.status}`, mapStatusToUploadErrorCode(xhr.status)));
                        }
                    }
                };
                xhr.onerror = () => reject(new AssetUploadError('Network error during file replace', 'NETWORK_ERROR'));
                xhr.send(formData);
            });
        }
        return post(path, formData);
    }
    asset.replaceFile = replaceFile;
    /**
     * Soft-delete an asset. Schedules CDN purge after `graceDays` (default 30).
     * Recoverable via `restoreAdmin` until purge runs.
     */
    async function deleteAdmin(options) {
        const params = new URLSearchParams();
        if (typeof options.graceDays === 'number')
            params.set('graceDays', String(options.graceDays));
        const qs = params.toString();
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/assets/${encodeURIComponent(options.assetId)}${qs ? `?${qs}` : ''}`;
        return del(path);
    }
    asset.deleteAdmin = deleteAdmin;
    /**
     * Restore a soft-deleted asset (clears `deletedAt`).
     */
    async function restoreAdmin(collectionId, assetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/assets/${encodeURIComponent(assetId)}/restore`;
        return post(path, {});
    }
    asset.restoreAdmin = restoreAdmin;
    /**
     * Soft-delete multiple assets in one request.
     */
    async function bulkDelete(options) {
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/assets/bulk-delete`;
        const body = { assetIds: options.assetIds };
        if (typeof options.graceDays === 'number')
            body.graceDays = options.graceDays;
        return post(path, body);
    }
    asset.bulkDelete = bulkDelete;
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
    async function requestUploadToken(options) {
        const path = `/public/collection/${encodeURIComponent(options.collectionId)}/asset/token`;
        const body = { appId: options.appId };
        if (options.contactId)
            body.contactId = options.contactId;
        if (options.productId)
            body.productId = options.productId;
        if (options.proofId)
            body.proofId = options.proofId;
        return post(path, body);
    }
    asset.requestUploadToken = requestUploadToken;
    /**
     * Upload a file using a single-use upload token (no admin auth required).
     * Assets are created with `status: 'pending_review'` when the token policy
     * has `reviewRequired: true`.
     */
    async function publicUploadWithToken(options) {
        const path = `/public/collection/${encodeURIComponent(options.collectionId)}/asset`;
        const formData = new FormData();
        formData.append('file', options.file);
        if (options.name)
            formData.append('name', options.name);
        if (options.metadata)
            formData.append('metadata', JSON.stringify(options.metadata));
        if (options.onProgress && typeof window !== 'undefined' && !isProxyEnabled()) {
            const baseUrl = (typeof window !== 'undefined' && window.SMARTLINKS_API_BASEURL)
                ? window.SMARTLINKS_API_BASEURL + path
                : path;
            const headers = Object.assign(Object.assign({}, getApiHeaders()), { 'X-Upload-Token': options.tokenId });
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', baseUrl);
                for (const [key, value] of Object.entries(headers))
                    xhr.setRequestHeader(key, value);
                xhr.upload.onprogress = (event) => {
                    if (options.onProgress && event.lengthComputable) {
                        options.onProgress(Math.round((event.loaded / event.total) * 100));
                    }
                };
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        }
                        catch (_b) {
                            reject(new AssetUploadError('Failed to parse server response', 'UNKNOWN'));
                        }
                    }
                    else {
                        try {
                            const e = JSON.parse(xhr.responseText);
                            reject(new AssetUploadError((e === null || e === void 0 ? void 0 : e.message) || `Upload failed (${xhr.status})`, mapStatusToUploadErrorCode(xhr.status, e === null || e === void 0 ? void 0 : e.code), e));
                        }
                        catch (_d) {
                            reject(new AssetUploadError(`Upload failed with status ${xhr.status}`, mapStatusToUploadErrorCode(xhr.status)));
                        }
                    }
                };
                xhr.onerror = () => reject(new AssetUploadError('Network error during public upload', 'NETWORK_ERROR'));
                xhr.send(formData);
            });
        }
        // Pass the token as a header via a custom fetch; post() doesn't accept extra headers,
        // so we build the request manually using the same base URL resolution.
        const baseUrl = (typeof window !== 'undefined' && window.SMARTLINKS_API_BASEURL)
            ? window.SMARTLINKS_API_BASEURL + path
            : path;
        const headers = Object.assign(Object.assign({}, getApiHeaders()), { 'X-Upload-Token': options.tokenId });
        const response = await fetch(baseUrl, { method: 'POST', headers, body: formData });
        if (!response.ok) {
            let errBody;
            try {
                errBody = await response.json();
            }
            catch ( /* ignore */_b) { /* ignore */ }
            throw new AssetUploadError((errBody === null || errBody === void 0 ? void 0 : errBody.message) || `Public upload failed (${response.status})`, mapStatusToUploadErrorCode(response.status, errBody === null || errBody === void 0 ? void 0 : errBody.code), errBody);
        }
        return response.json();
    }
    asset.publicUploadWithToken = publicUploadWithToken;
})(asset || (asset = {}));
