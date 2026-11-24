/**
 * Tag Management Types
 *
 * Types for the two-tier tag system:
 *  - Per-org shard (`tags` table) — full tag data, all collection-scoped queries
 *  - Shared shard (`tag_index` table) — tagId → collectionId routing only
 */
import type { ListResult, ListOptions } from './list'

// ─── Core entity ──────────────────────────────────────────────────────────────

/**
 * Full tag record, stored on the per-org shard.
 * Returned by all collection-scoped endpoints.
 */
export interface Tag {
  id:           string                // Internal UUID
  orgId:        string                // Organisation ID
  tagId:        string                // Physical tag identifier (NFC UID, QR code, etc.)
  collectionId: string                // Owning collection
  productId:    string | null         // Linked product
  variantId:    string | null         // Product variant
  batchId:      string | null         // Production batch
  proofId:      string | null         // Proof / serial number
  /**
   * Polymorphic ref type: `'app_record'`, `'app_case'`, `'app_thread'`, etc.
   * Always paired with `refId`. The label on a container is `containerId`, not a ref.
   */
  refType:      string | null
  /** UUID of the referenced object.  Always paired with `refType`. */
  refId:        string | null
  /** The container this tag is the label on (a box, a cask): never where the tag is. Not with `proofId`. */
  containerId?: string | null
  /** The item's global id when the tag is on an item */
  itemUid?:     string | null
  metadata:     Record<string, any>
  createdAt:    string                // ISO 8601
  updatedAt:    string                // ISO 8601
}

/**
 * Lightweight index entry returned by the global resolve endpoint only
 * (`GET /public/tags/:tagId`).
 *
 * Use this when the collection is not yet known — it contains routing info
 * only.  Once `collectionId` is resolved, use the collection-scoped endpoints
 * for full tag data.
 */
export interface TagIndexEntry {
  tagId:        string
  collectionId: string
}

// ─── Embedded objects ─────────────────────────────────────────────────────────

/**
 * Deduplicated embedded objects attached to collection-scoped tag lookup
 * responses.  Which fields are populated depends on the `embed` parameter.
 *
 * Supported `embed` values: `'product'`, `'proof'`, `'container'`, `'ref'`
 * (`embed=collection` is not supported on collection-scoped endpoints).
 */
export interface TagEmbedded {
  /** `productId → Firestore product record` (when `embed` includes `'product'`) */
  products?:   Record<string, any>
  /**
   * `proofId → proof record or virtual serial-number proof`
   * (when `embed` includes `'proof'`)
   */
  proofs?:     Record<string, any>
  /**
   * `containerId → Container row`
   * (for tags where `refType === 'container'`, when `embed` includes `'container'`)
   */
  containers?: Record<string, any>
  /**
   * `refId → app_record | app_case | app_thread | container`
   * (when `embed` includes `'ref'`)
   */
  refs?:       Record<string, any>
}

// ─── Admin request bodies ─────────────────────────────────────────────────────

/** Request body to create a single tag mapping. */
export interface CreateTagRequest {
  tagId:            string           // Required
  productId?:       string
  variantId?:       string
  batchId?:         string
  proofId?:         string           // Required if productId set, unless useSerialNumber=true
  useSerialNumber?: boolean          // Auto-generate a serial number as proofId
  refType?:         string           // Must be paired with refId
  refId?:           string           // Must be paired with refType
  containerId?:     string           // The label on this container (not with proofId)
  metadata?:        Record<string, any>
  force?:           boolean          // Overwrite if tag already exists in this collection
}

/** Request body to batch-create tags. `force` applies to all entries in the batch. */
export interface BatchCreateTagRequest {
  tags:  Omit<CreateTagRequest, 'force'>[]
  force?: boolean
}

/** Partial update request — `metadata` is deep-merged with existing values. */
export interface UpdateTagRequest {
  productId?:  string
  variantId?:  string
  batchId?:    string
  proofId?:    string
  /** Pass `null` to clear the polymorphic ref.  Must be paired with `refId`. */
  refType?:    string | null
  /** Pass `null` to clear the polymorphic ref.  Must be paired with `refType`. */
  refId?:      string | null
  /** The label on this container; `null` to clear. Putting the tag on an item clears it. */
  containerId?: string | null
  metadata?:   Record<string, any>   // Merged with existing metadata
}

// ─── Admin response types ─────────────────────────────────────────────────────

/** Returned when creating a single tag (`wasUpdated: true` when force triggered an update). */
export interface CreateTagResponse extends Tag {
  wasUpdated?: boolean
}

/** Result of a batch tag creation. Partial success is possible. */
export interface BatchCreateResult {
  summary: {
    total:     number
    created:   number
    updated:   number
    failed:    number
    conflicts: number
  }
  results: {
    created:   Tag[]
    updated:   Tag[]
    failed:    Array<{ tagId: string; reason: string; message: string }>
    conflicts: Array<{ tagId: string; reason: string; message: string; existingTag: Tag }>
  }
}

export interface UpdateTagResponse extends Tag {}
export interface DeleteTagResponse { success: boolean }
export interface GetTagResponse extends Tag {}

// ─── List / filter ────────────────────────────────────────────────────────────

/** `tags.list` options: the filters, plus `limit` and `cursor`. */
export interface ListTagsRequest extends ListOptions {
  productId?: string
  variantId?: string
  batchId?:   string
  /** Filter by polymorphic ref type (e.g. `'container'`, `'app_record'`) */
  refType?:   string
  /** Filter by polymorphic ref UUID */
  refId?:     string
}

// ─── Public request bodies ────────────────────────────────────────────────────

/**
 * Request body / params for the collection-scoped batch lookup.
 *
 * `embed` — comma-separated: `'product'`, `'proof'`, `'container'`, `'ref'`
 */
export interface LookupTagsRequest {
  tagIds: string[]
  embed?: string
}

/**
 * Query-string variant of {@link LookupTagsRequest} for GET requests.
 * `tagIds` is a comma-separated string.
 */
export interface LookupTagsQueryRequest {
  tagIds: string
  embed?: string
}

/**
 * POST body for the collection-scoped public by-ref lookup.
 * `embed` — comma-separated: `'product'`, `'proof'`, `'container'`, `'ref'`
 */
export interface ByRefRequest {
  refType: string
  refId:   string
  embed?:  string
}

/**
 * Query parameters for admin and public GET by-ref requests.
 */
export interface ReverseTagLookupParams {
  /** Required — polymorphic ref type */
  refType: string
  /** Required — UUID of the referenced object */
  refId:   string
  /** Optional embed string (public endpoint only) */
  embed?:  string
}

// ─── Public response types ────────────────────────────────────────────────────

/**
 * Response from the collection-scoped single-tag public endpoint.
 * `GET /public/collection/:collectionId/tags/:tagId?embed=product,proof,ref`
 */
export interface PublicGetTagResponse {
  tag:      Tag
  embedded: TagEmbedded
}

/**
 * Response from the collection-scoped batch lookup endpoints.
 * `POST /public/collection/:collectionId/tags/lookup`
 * `GET  /public/collection/:collectionId/tags/lookup?tagIds=...`
 */
export interface TagLookupResponse extends ListResult<Tag> {
  /** How many tags were found. */
  count:    number
  embedded: TagEmbedded
}

/**
 * Response from the public by-ref endpoints (supports `embed`).
 * `GET  /public/collection/:collectionId/tags/by-ref?refType=&refId=&embed=`
 * `POST /public/collection/:collectionId/tags/by-ref`
 */
export interface ByRefResponse extends ListResult<Tag> {
  embedded: TagEmbedded
}
