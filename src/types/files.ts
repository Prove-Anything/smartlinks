import type { Asset } from "./asset"

/**
 * A file: an asset that's temporary, fetched from an address, extracted from another file, or made by something.
 * Files are private until kept, and stay out of asset lists (pickers, the Hub, the portal) unless kept.
 */
export type FileRecord = Asset

/** How long a file lives: `1h` to `30d` (default `1d`). Kept files are permanent (see `files.keep`). */
export type FileTtl = `${number}h` | `${number}d` | number

export type FileExtractVariant = "text" | "markdown" | "ocr" | "json"

export interface PutFileRequest {
  name: string
  /** One of text, base64 or json. */
  text?: string
  base64?: string
  json?: unknown
  contentType?: string
  ttl?: FileTtl
  appId?: string
}

export interface FetchFileRequest {
  /** A public web address (http/https). Private and internal addresses are refused. */
  url: string
  ttl?: FileTtl
  /** How old a cached copy can be before the source is asked again (default: the ttl). */
  maxAge?: FileTtl
  /** Ask the source again now (an unchanged page keeps the same file). */
  force?: boolean
  appId?: string
}

export interface FetchedFile extends FileRecord {
  /** True when this address was already here and fresh enough, or the source said it hasn't changed. */
  cached: boolean
  /** True when the source answered "not changed" (the same file is returned). */
  unchanged?: boolean
}

export interface ListFilesQuery {
  origin?: "upload" | "fetched" | "derived" | "generated"
  retention?: "temporary" | "permanent"
  appId?: string
  /** The results extracted from one file. */
  derivedFromId?: string
  limit?: number
}

export interface ExtractFileRequest {
  variant: FileExtractVariant
  /** For `json`: a JSON schema of the fields to pull out. */
  schema?: Record<string, any>
  /** For `json`: what to look for, in words. */
  prompt?: string
  /** Read the file again even if it was already read this way. */
  force?: boolean
}

export interface ExtractFileResponse {
  ok: true
  /** The derived file holding the result (hidden from lists; lives as long as its source). */
  file: FileRecord
  /** text / markdown / ocr */
  text?: string
  /** json */
  data?: any
  /** True when this file had already been read this way. */
  cached: boolean
}

export interface ReadFileResponse {
  ok: true
  text?: string
  base64?: string
  contentType: string | null
  size: number
}

export interface FileLinkResponse {
  ok: true
  url: string
  /** When the signed link stops working (private files). */
  expiresAt?: string
  /** True for a kept file: `url` is its permanent address. */
  permanent?: boolean
}
