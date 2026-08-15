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
import { request, post, put, del, getApiHeaders, getBaseURL, isProxyEnabled, proxyUploadFormData } from "../http";
import { SmartlinksApiError } from "../types/error";
export var asset;
(function (asset) {
    function resolveApiUrl(path) {
        const configuredBase = getBaseURL();
        if (configuredBase) {
            return `${configuredBase}${path}`;
        }
        // Backward compatibility for legacy browser integrations that set a global base URL.
        if (typeof window !== 'undefined' && window.SMARTLINKS_API_BASEURL) {
            return `${window.SMARTLINKS_API_BASEURL}${path}`;
        }
        throw new Error('HTTP client is not initialized. Call initializeApi(...) first.');
    }
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
            const url = resolveApiUrl(path);
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
                if (options.signal) {
                    if (options.signal.aborted) {
                        xhr.abort();
                        return reject(new AssetUploadError("Upload aborted", 'NETWORK_ERROR'));
                    }
                    options.signal.addEventListener('abort', () => xhr.abort(), { once: true });
                    xhr.onabort = () => reject(new AssetUploadError("Upload aborted", 'NETWORK_ERROR'));
                }
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
            const details = e instanceof SmartlinksApiError ? e.errorResponse : undefined;
            throw new AssetUploadError(msg, 'UNKNOWN', details);
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
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset${qs ? `?${qs}` : ''}`;
        return request(path);
    }
    asset.listAdmin = listAdmin;
    /**
     * Get a single asset by ID (admin).
     */
    async function getAdmin(collectionId, assetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}`;
        return request(path);
    }
    asset.getAdmin = getAdmin;
    /**
     * Update asset metadata (admin). Use `replaceFile` to swap the file.
     */
    async function updateAdmin(options) {
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/${encodeURIComponent(options.assetId)}`;
        const { collectionId: _c, assetId: _a } = options, body = __rest(options, ["collectionId", "assetId"]);
        return put(path, body);
    }
    asset.updateAdmin = updateAdmin;
    /**
     * Replace the file of an existing asset. The previous file URL is snapshotted
     * into `versions[]` on the asset.
     */
    async function replaceFile(options) {
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/${encodeURIComponent(options.assetId)}/replace`;
        const formData = new FormData();
        formData.append('file', options.file);
        if (options.onProgress && typeof window !== 'undefined' && !isProxyEnabled()) {
            const url = resolveApiUrl(path);
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
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/${encodeURIComponent(options.assetId)}${qs ? `?${qs}` : ''}`;
        return del(path);
    }
    asset.deleteAdmin = deleteAdmin;
    /**
     * Restore a soft-deleted asset (clears `deletedAt`).
     */
    async function restoreAdmin(collectionId, assetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/asset/${encodeURIComponent(assetId)}/restore`;
        return post(path, {});
    }
    asset.restoreAdmin = restoreAdmin;
    /**
     * Soft-delete multiple assets in one request.
     */
    async function bulkDelete(options) {
        const path = `/admin/collection/${encodeURIComponent(options.collectionId)}/asset/bulk-delete`;
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
            const baseUrl = resolveApiUrl(path);
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
        const baseUrl = resolveApiUrl(path);
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
    // ---------------------------------------------------------------------------
    // Resumable uploads (large files, e.g. video) — GCS-backed, chunked, resumable
    // ---------------------------------------------------------------------------
    const RESUMABLE_CHUNK_SIZE = 8 * 1024 * 1024; // 8 MiB — must be a multiple of 256 KiB (GCS rule)
    const RESUMABLE_MAX_RETRIES = 5;
    /** Thrown by a resumable `start()`/`resume()` when the caller pauses mid-transfer. */
    class UploadPausedError extends Error {
        constructor() { super('Upload paused'); this.name = 'UploadPausedError'; }
    }
    asset.UploadPausedError = UploadPausedError;
    function backoff(attempt) {
        const ms = Math.min(30000, 1000 * Math.pow(2, attempt - 1));
        return new Promise(r => setTimeout(r, ms));
    }
    class ResumableUpload {
        constructor(uploadId, // signed JWT — capability for finalize
        sessionUrl, // GCS resumable session URI
        file, finalizePath, finalizeBody) {
            this.uploadId = uploadId;
            this.sessionUrl = sessionUrl;
            this.file = file;
            this.finalizePath = finalizePath;
            this.finalizeBody = finalizeBody;
            this._paused = false;
            this._offset = 0;
        }
        get id() {
            const st = { u: this.uploadId, s: this.sessionUrl, n: this.file.name, z: this.file.size, f: this.finalizePath };
            return JSON.stringify(st);
        }
        get size() { return this.file.size; }
        pause() { this._paused = true; }
        resume(options) {
            this._paused = false;
            return this.start(options);
        }
        async start(options) {
            this._paused = false;
            const onProgress = options === null || options === void 0 ? void 0 : options.onProgress;
            const signal = options === null || options === void 0 ? void 0 : options.signal;
            // Probe the storage offset first — this is what makes resume work after a reload.
            this._offset = await this.probeOffset(signal);
            while (this._offset < this.file.size) {
                if (signal === null || signal === void 0 ? void 0 : signal.aborted)
                    throw new AssetUploadError('Upload aborted', 'NETWORK_ERROR');
                if (this._paused)
                    throw new UploadPausedError();
                const end = Math.min(this._offset + RESUMABLE_CHUNK_SIZE, this.file.size);
                const complete = await this.putChunk(this._offset, end, signal);
                this._offset = end;
                if (onProgress)
                    onProgress(Math.round((this._offset / this.file.size) * 100));
                if (complete)
                    break;
            }
            return post(this.finalizePath, this.finalizeBody);
        }
        // PUT with `bytes * /total` returns the current stored offset (or completion).
        async probeOffset(signal) {
            const res = await this.putWithRetry({ 'Content-Range': `bytes */${this.file.size}` }, undefined, signal);
            if (res.status === 200 || res.status === 201)
                return this.file.size;
            if (res.status === 308) {
                const range = res.headers.get('Range');
                const m = range && /bytes=0-(\d+)/.exec(range);
                return m ? parseInt(m[1], 10) + 1 : 0;
            }
            if (res.status === 404 || res.status === 410)
                throw new AssetUploadError('Upload session expired', 'UNKNOWN');
            throw new AssetUploadError(`Unexpected resume-probe status ${res.status}`, 'UNKNOWN');
        }
        // Returns true when the final chunk completed the upload (2xx from GCS).
        async putChunk(start, end, signal) {
            const blob = this.file.slice(start, end);
            const res = await this.putWithRetry({ 'Content-Range': `bytes ${start}-${end - 1}/${this.file.size}` }, blob, signal);
            if (res.status === 200 || res.status === 201)
                return true;
            if (res.status === 308)
                return false;
            throw new AssetUploadError(`Chunk upload failed (${res.status})`, res.status === 413 ? 'FILE_TOO_LARGE' : 'UNKNOWN');
        }
        async putWithRetry(headers, body, signal) {
            let attempt = 0;
            while (true) {
                if (signal === null || signal === void 0 ? void 0 : signal.aborted)
                    throw new AssetUploadError('Upload aborted', 'NETWORK_ERROR');
                try {
                    const res = await fetch(this.sessionUrl, { method: 'PUT', headers, body, signal });
                    if (res.status >= 500 && attempt < RESUMABLE_MAX_RETRIES) {
                        attempt++;
                        await backoff(attempt);
                        continue;
                    }
                    return res;
                }
                catch (err) {
                    if (signal === null || signal === void 0 ? void 0 : signal.aborted)
                        throw new AssetUploadError('Upload aborted', 'NETWORK_ERROR');
                    if (attempt < RESUMABLE_MAX_RETRIES) {
                        attempt++;
                        await backoff(attempt);
                        continue;
                    }
                    throw new AssetUploadError('Network error during resumable upload', 'NETWORK_ERROR');
                }
            }
        }
    }
    function resumableBasePath(opts) {
        const prefix = (opts.admin && !opts.token) ? '/admin' : '/public';
        return `${prefix}/collection/${encodeURIComponent(opts.collectionId)}/asset/resumable`;
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
    async function createResumableUpload(options) {
        const { file, scope, name, appId, token, admin } = options;
        const base = resumableBasePath({ admin, token, collectionId: scope.collectionId });
        const startBody = {
            filename: name || file.name,
            mime: file.type || 'application/octet-stream',
            appId,
        };
        if (scope.type !== 'collection')
            startBody.productId = scope.productId;
        if (scope.type === 'proof')
            startBody.proofId = scope.proofId;
        const started = await post(base, startBody, token ? { 'X-Upload-Token': token } : undefined);
        const finalizePath = `${base}/${encodeURIComponent(started.uploadId)}/complete`;
        const finalizeBody = {};
        if (name)
            finalizeBody.name = name;
        if (options.metadata)
            finalizeBody.metadata = options.metadata;
        return new ResumableUpload(started.uploadId, started.sessionUrl, file, finalizePath, finalizeBody);
    }
    asset.createResumableUpload = createResumableUpload;
    /**
     * Resume a previously-created resumable upload after a reload/app restart.
     * Pass the persisted `handle.id` and the same `File`; the transfer continues
     * from the offset storage already holds rather than restarting.
     */
    async function resumeUpload(handleId, file) {
        let st;
        try {
            st = JSON.parse(handleId);
        }
        catch (_b) {
            throw new AssetUploadError('Invalid resumable upload handle', 'UNKNOWN');
        }
        if (!st.u || !st.s || !st.f)
            throw new AssetUploadError('Invalid resumable upload handle', 'UNKNOWN');
        if (typeof st.z === 'number' && file.size !== st.z) {
            throw new AssetUploadError('Resumed file does not match the original upload', 'UNKNOWN');
        }
        const finalizeBody = {};
        if (st.n)
            finalizeBody.name = st.n;
        return new ResumableUpload(st.u, st.s, file, st.f, finalizeBody);
    }
    asset.resumeUpload = resumeUpload;
})(asset || (asset = {}));
