import type { FileRecord, PutFileRequest, FetchFileRequest, FetchedFile, ListFilesQuery, ExtractFileRequest, ExtractFileResponse, ReadFileResponse, FileLinkResponse } from "../types/files.js";
import type { ListResult } from "../types/list.js";
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
export declare namespace files {
    /**
     * Files on this site that aren't ordinary uploads: temporary, fetched, derived or generated (admin).
     * A page at a time: `limit` says how many, `cursor` is the previous page's `nextCursor`.
     *
     * @example
     * ```typescript
     * let page = await files.list('coll_123', { appId: 'my-app', origin: 'fetched', limit: 50 })
     * while (page.nextCursor) {
     *   page = await files.list('coll_123', { appId: 'my-app', origin: 'fetched', limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    function list(collectionId: string, query?: ListFilesQuery): Promise<ListResult<FileRecord>>;
    /** A new file from text, base64 or JSON. Temporary (default 1 day) and private. */
    function put(collectionId: string, body: PutFileRequest): Promise<{
        ok: true;
        file: FileRecord;
    }>;
    /**
     * A web address's contents as a file, cached by address.
     * @throws `BAD_URL`, `PRIVATE_ADDRESS`, `FETCH_FAILED`, `TOO_LARGE` (over 50 MB)
     */
    function fetch(collectionId: string, body: FetchFileRequest): Promise<{
        ok: true;
        file: FetchedFile;
    }>;
    /** One file. @throws `NOT_FOUND`, `EXPIRED` */
    function get(collectionId: string, fileId: string): Promise<{
        ok: true;
        file: FileRecord;
    }>;
    /** A file's contents, as text (default) or base64 (up to 25 MB). */
    function read(collectionId: string, fileId: string, as?: "text" | "base64"): Promise<ReadFileResponse>;
    /** A signed link to a private file (default 15 minutes), or a kept file's permanent address. */
    function link(collectionId: string, fileId: string, minutes?: number): Promise<FileLinkResponse>;
    /**
     * What's in a file: `text`, `markdown`, `ocr` (images) or `json` (typed fields: give a `schema` and/or a
     * `prompt`). Each file is read each way once; asking again returns the same result (`cached: true`).
     * @throws `BAD_VARIANT`, `SCHEMA_REQUIRED`, `USE_OCR` (text from an image), `NOT_AN_IMAGE`, `NOTHING_FOUND`
     */
    function extract(collectionId: string, fileId: string, body: ExtractFileRequest): Promise<ExtractFileResponse>;
    /** Keep a file: permanent and public, with an `assetUrl`. It then shows in asset lists like any upload. */
    function keep(collectionId: string, fileId: string): Promise<{
        ok: true;
        file: FileRecord;
    }>;
    /** Remove a file (a kept file is deleted like any asset, and can be restored). */
    function remove(collectionId: string, fileId: string): Promise<{
        ok: true;
        removed: boolean;
        softDeleted?: boolean;
    }>;
}
