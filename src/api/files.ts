import { request, post, del } from "../http"
import type {
  FileRecord, PutFileRequest, FetchFileRequest, FetchedFile, ListFilesQuery,
  ExtractFileRequest, ExtractFileResponse, ReadFileResponse, FileLinkResponse,
} from "../types/files"

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
export namespace files {
  const adm = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/files`
  const one = (collectionId: string, fileId: string) => `${adm(collectionId)}/${encodeURIComponent(fileId)}`

  /** Files on this site that aren't ordinary uploads: temporary, fetched, derived or generated (admin). */
  export async function list(collectionId: string, query: ListFilesQuery = {}): Promise<{ ok: true; files: FileRecord[] }> {
    const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString()
    return request(`${adm(collectionId)}${qs ? `?${qs}` : ""}`)
  }

  /** A new file from text, base64 or JSON. Temporary (default 1 day) and private. */
  export async function put(collectionId: string, body: PutFileRequest): Promise<{ ok: true; file: FileRecord }> {
    return post(adm(collectionId), body)
  }

  /**
   * A web address's contents as a file, cached by address.
   * @throws `BAD_URL`, `PRIVATE_ADDRESS`, `FETCH_FAILED`, `TOO_LARGE` (over 50 MB)
   */
  export async function fetch(collectionId: string, body: FetchFileRequest): Promise<{ ok: true; file: FetchedFile }> {
    return post(`${adm(collectionId)}/fetch`, body)
  }

  /** One file. @throws `NOT_FOUND`, `EXPIRED` */
  export async function get(collectionId: string, fileId: string): Promise<{ ok: true; file: FileRecord }> {
    return request(one(collectionId, fileId))
  }

  /** A file's contents, as text (default) or base64 (up to 25 MB). */
  export async function read(collectionId: string, fileId: string, as: "text" | "base64" = "text"): Promise<ReadFileResponse> {
    return request(`${one(collectionId, fileId)}/read?as=${as}`)
  }

  /** A signed link to a private file (default 15 minutes), or a kept file's permanent address. */
  export async function link(collectionId: string, fileId: string, minutes?: number): Promise<FileLinkResponse> {
    return request(`${one(collectionId, fileId)}/link${minutes ? `?minutes=${minutes}` : ""}`)
  }

  /**
   * What's in a file: `text`, `markdown`, `ocr` (images) or `json` (typed fields: give a `schema` and/or a
   * `prompt`). Each file is read each way once; asking again returns the same result (`cached: true`).
   * @throws `BAD_VARIANT`, `SCHEMA_REQUIRED`, `USE_OCR` (text from an image), `NOT_AN_IMAGE`, `NOTHING_FOUND`
   */
  export async function extract(collectionId: string, fileId: string, body: ExtractFileRequest): Promise<ExtractFileResponse> {
    return post(`${one(collectionId, fileId)}/extract`, body)
  }

  /** Keep a file: permanent and public, with an `assetUrl`. It then shows in asset lists like any upload. */
  export async function keep(collectionId: string, fileId: string): Promise<{ ok: true; file: FileRecord }> {
    return post(`${one(collectionId, fileId)}/keep`, {})
  }

  /** Remove a file (a kept file is deleted like any asset, and can be restored). */
  export async function remove(collectionId: string, fileId: string): Promise<{ ok: true; removed: boolean; softDeleted?: boolean }> {
    return del(one(collectionId, fileId))
  }
}
