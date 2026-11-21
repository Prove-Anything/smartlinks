import { request, post, del } from "../http.js";
/**
 * Files: temporary or kept files, web pages and documents fetched by address, and what's extracted from them
 * (text, Markdown, OCR, typed fields). Files are assets, but private until kept and left out of asset lists, so
 * pickers and the media library never fill up with them.
 *
 * - Fetch once, read many times: the same address returns the same file while it's fresh, and an unchanged page
 *   isn't downloaded again.
 * - Extract once: each file is read each way only once; the result is kept beside it.
 * - `keep` makes a file permanent and public (an `assetUrl`), and it then shows in asset lists like any upload.
 *
 * In a server function the same calls are `ctx.sl.files.*` (needs `sl:files:read` / `sl:files:write`).
 *
 * @example
 * ```typescript
 * const page = await files.fetch('coll_123', { url: 'https://supplier.example/spec.pdf', ttl: '7d' })
 * const { text } = await files.extract('coll_123', page.file.id, { variant: 'markdown' })
 * const { data } = await files.extract('coll_123', page.file.id, {
 *   variant: 'json',
 *   schema: { type: 'object', properties: { gtin: { type: 'string' }, weightKg: { type: 'number' } } },
 * })
 * ```
 */
export var files;
(function (files) {
    const adm = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/files`;
    const one = (collectionId, fileId) => `${adm(collectionId)}/${encodeURIComponent(fileId)}`;
    /** Files on this site that aren't ordinary uploads: temporary, fetched, derived or generated (admin). */
    async function list(collectionId, query = {}) {
        const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString();
        return request(`${adm(collectionId)}${qs ? `?${qs}` : ""}`);
    }
    files.list = list;
    /** A new file from text, base64 or JSON. Temporary (default 1 day) and private. */
    async function put(collectionId, body) {
        return post(adm(collectionId), body);
    }
    files.put = put;
    /**
     * A web address's contents as a file, cached by address.
     * @throws `BAD_URL`, `PRIVATE_ADDRESS`, `FETCH_FAILED`, `TOO_LARGE` (over 50 MB)
     */
    async function fetch(collectionId, body) {
        return post(`${adm(collectionId)}/fetch`, body);
    }
    files.fetch = fetch;
    /** One file. @throws `NOT_FOUND`, `EXPIRED` */
    async function get(collectionId, fileId) {
        return request(one(collectionId, fileId));
    }
    files.get = get;
    /** A file's contents, as text (default) or base64 (up to 25 MB). */
    async function read(collectionId, fileId, as = "text") {
        return request(`${one(collectionId, fileId)}/read?as=${as}`);
    }
    files.read = read;
    /** A signed link to a private file (default 15 minutes), or a kept file's permanent address. */
    async function link(collectionId, fileId, minutes) {
        return request(`${one(collectionId, fileId)}/link${minutes ? `?minutes=${minutes}` : ""}`);
    }
    files.link = link;
    /**
     * What's in a file: `text`, `markdown`, `ocr` (images) or `json` (typed fields: give a `schema` and/or a
     * `prompt`). Each file is read each way once; asking again returns the same result (`cached: true`).
     * @throws `BAD_VARIANT`, `SCHEMA_REQUIRED`, `USE_OCR` (text from an image), `NOT_AN_IMAGE`, `NOTHING_FOUND`
     */
    async function extract(collectionId, fileId, body) {
        return post(`${one(collectionId, fileId)}/extract`, body);
    }
    files.extract = extract;
    /** Keep a file: permanent and public, with an `assetUrl`. It then shows in asset lists like any upload. */
    async function keep(collectionId, fileId) {
        return post(`${one(collectionId, fileId)}/keep`, {});
    }
    files.keep = keep;
    /** Remove a file (a kept file is deleted like any asset, and can be restored). */
    async function remove(collectionId, fileId) {
        return del(one(collectionId, fileId));
    }
    files.remove = remove;
})(files || (files = {}));
