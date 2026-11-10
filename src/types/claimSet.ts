// src/types/claimSet.ts
/**
 * Reference to a specific claim attached to a code/tag.
 */
export interface ClaimCodeRef {
  /** Identifier of the code (e.g., tag or QR code) */
  codeId: string
  /** Identifier of the claim within the claim set */
  claimId: string
}

/**
 * Request body for updating claim data on a claim set.
 * Contains arbitrary key/value pairs and a list of code+claim references to update.
 */
export interface UpdateClaimDataRequest {
  /** Arbitrary key/value pairs for the claim data update */
  data: Record<string, any>
  /** Array of code+claim references affected by this update */
  codes: ClaimCodeRef[]
}

/**
 * Request body for assigning claims to codes or ranges within a collection.
 */
export interface AssignClaimsRequest {
  /** The claim set ID (required) */
  id: string
  /** The collection ID (required) */
  collectionId: string
  /** The product ID (required) */
  productId: string
  /** Optional batch identifier */
  batchId?: string
  /** Optional start index for bulk assignment */
  start?: number
  /** Optional end index for bulk assignment */
  end?: number
  /** Optional single code identifier for single assignment */
  codeId?: string
  /** Optional key/value pairs to set on the claim */
  data?: Record<string, any>
}

/**
 * Request body for creating a single tag/code inside an existing claim set.
 */
export interface CreateClaimSetTagRequest {
  /** Optional explicit ID; a random 12-char hex ID is generated server-side if omitted */
  id?: string
  /** Matching tag/NFC identifier */
  tagId?: string
  /** Product to associate with this code */
  productId?: string
  /** Collection scope */
  collectionId?: string
  /** Batch identifier */
  batchId?: string
  /** Optional password/secret for secure claim */
  password?: string
  /** Arbitrary extra fields */
  data?: Record<string, unknown>
}

/**
 * Request body for creating a new claim set.
 */
export interface CreateClaimSetRequest {
  /** Display name for the claim set */
  name: string
  /** How tags are claimed (e.g. "nfc", "qr") */
  claimMode: string
  /** How tags are allocated (e.g. "specific", "random") */
  allocationMode: string
}

/**
 * A single tag entry within an importTags request.
 */
export interface ImportClaimSetTagItem {
  /** Tag identifier (required) */
  id: string
  /** Optional matching tag/NFC identifier */
  tagId?: string
  /** Optional position index */
  index?: number
}

/**
 * Request body for bulk-importing tags into a claim set.
 */
export interface ImportClaimSetTagsRequest {
  /** Array of tag objects to import */
  tags: ImportClaimSetTagItem[]
  /**
   * Import mode:
   * - "upsert" (default) merges with existing tags
   * - "replace" wipes all existing tags first then writes the new set
   */
  mode?: 'upsert' | 'replace'
}

/**
 * Response returned by the importTags endpoint.
 */
export interface ImportClaimSetTagsResponse {
  /** Number of tags written */
  written: number
}

/**
 * Response body returned after a tag/code is created inside a claim set.
 */
export interface CreateClaimSetTagResponse {
  /** ID of the newly created tag */
  id: string
  /** The claim set this tag belongs to */
  claimSetId: string
  /** ISO 8601 creation timestamp */
  createdAt: string
  /** Matching tag/NFC identifier */
  tagId?: string
  /** Associated product ID */
  productId?: string
  /** Collection scope */
  collectionId?: string
  /** Batch identifier */
  batchId?: string
  /** Password/secret for secure claim */
  password?: string
  /** Arbitrary extra fields */
  data?: Record<string, unknown>
}

// ─── Ranges and partners (NFC tag tooling) ───────────────────────────────────────────────────────
// A range is a named, contiguous block of code indexes in one claim set, minted together and managed
// together: mint → send to print → receive (chip UIDs back) → assign. A partner (FanConnect, Zenith
// Coins, …) owns claim sets and assigns their tags into collections its people administer.

/** Who a range call acts as: a collection on its own sets, or a partner on the partner's sets. */
export type ClaimSetScope = { collectionId: string } | { partnerId: string }

export type ClaimSetTagType = 'ntag424' | 'ntag21x' | 'qr'
/**
 * range: a contiguous block of indexes minted up front. open: grows one index per tag programmed on a phone
 * (count unknown in advance), closed into a range later. group: existing tags added by tapping, assigned by
 * hand and moved together; no indexes.
 */
export type ClaimSetRangeKind = 'range' | 'open' | 'group'
export type ClaimSetRangeStatus = 'minting' | 'minted' | 'sent' | 'received' | 'assigned' | 'open' | 'group'

export interface ClaimSetRange {
  id: string
  claimSetId: string
  namespace: string
  kind: ClaimSetRangeKind
  name: string
  notes: string | null
  /** null for a group */
  startIndex: number | null
  /** open: the highest index minted so far (null until the first); group: null */
  endIndex: number | null
  /** range: the block; open: minted so far; group: its members */
  quantity: number
  tagType: ClaimSetTagType
  /** open ranges and groups are always 'sidekick' */
  fulfilment: 'printer' | 'sidekick'
  /** The stored step: minting | minted | sent | received (always 'minted' for open ranges and groups) */
  stage: 'minting' | 'minted' | 'sent' | 'received'
  /** What to show: the stage, 'open', 'group', or 'assigned' once every tag is assigned */
  status: ClaimSetRangeStatus
  intendedCollectionId: string | null
  intendedProductId: string | null
  intendedBatchId: string | null
  manufacturer: string | null
  orderRef: string | null
  counts: { programmed: number; assigned: number; claimed: number }
  sentAt: string | null
  receivedAt: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateClaimSetRangeRequest {
  /** Default 'range'. Owners and admins make ranges and open ranges; assigners may make groups too. */
  kind?: ClaimSetRangeKind
  name: string
  /** 1 to 10,000 (a range); ignored for open ranges and groups */
  quantity?: number
  /** Pre-assign every tag at mint time (you must administer the collection) */
  intendedCollectionId?: string
  intendedProductId?: string
  intendedBatchId?: string
  fulfilment?: 'printer' | 'sidekick'
  notes?: string
  manufacturer?: string
  orderRef?: string
}

export interface UpdateClaimSetRangeRequest {
  name?: string
  notes?: string | null
  manufacturer?: string | null
  orderRef?: string | null
  fulfilment?: 'printer' | 'sidekick'
  stage?: 'minted' | 'sent' | 'received'
}

export interface ClaimSetRangeTag {
  code: string
  /** The printed code: 3-character set id + code */
  printed: string
  index: number
  uid: string | null
  /** Only for owners/admins, and only when asked for */
  key?: string
  collectionId: string | null
  productId: string | null
  batchId: string | null
  proofId: string | null
  /** The range it was minted into, if any */
  rangeId: string | null
  /** The group it was added to, if any */
  groupId: string | null
  programmedAt: string | null
  scans: number
}

export interface ClaimSetRangeTagsPage {
  tags: ClaimSetRangeTag[]
  /** The index to pass as `from` for the next page, or null */
  next: number | null
}

/** The next tag to program on a phone, with what to write. */
export interface ClaimSetRangeNextTag extends ClaimSetRangeTag {
  url: string
  piccOffset?: number
  mirrorOffset?: number
  /** Tags still without a chip; null for an open range (it grows as you go) */
  remaining: number | null
}

/** Add an existing tag of the set to a group, and (with a collection, or clear) assign it as you go. */
export interface AddClaimSetRangeMemberRequest {
  /** The tag's code, printed or bare… */
  code?: string
  /** …or its chip UID (14 hex) */
  uid?: string
  collectionId?: string
  productId?: string
  batchId?: string
  data?: Record<string, unknown>
  clear?: boolean
}

export interface AddClaimSetRangeMemberResponse {
  tag: ClaimSetRangeTag
  range: ClaimSetRange
  /** The assignment, with the same skips as assign (has_proof, assigned_elsewhere) */
  assigned: { changed: number; skipped: Array<{ code: string; index: number | null; reason: 'other_range' | 'has_proof' | 'assigned_elsewhere'; collectionId?: string }> }
  /** The group the tag was taken from, if it was in another one */
  movedFrom: string | null
}

/** Closing an open range: the range it became, or that it was removed because nothing was minted. */
export type CloseClaimSetRangeResponse = ClaimSetRange | { id: string; deleted: true }

export type ClaimSetImportResult =
  | 'ok' | 'unchanged' | 'unknown_code' | 'duplicate_row' | 'index_mismatch'
  | 'no_uid' | 'bad_uid' | 'duplicate_uid' | 'uid_in_use' | 'uid_conflict'

export interface ImportClaimSetRangeUidsRequest {
  /** The manufacturer's file as CSV text (the file we sent, with UID filled in) */
  csv?: string
  /** …or already-parsed rows: [{ Code, Index?, UID }] */
  rows?: Array<Record<string, string | number>>
  /** false (default) only checks; true writes the UIDs that matched */
  commit?: boolean
}

export interface ImportClaimSetRangeUidsResponse {
  summary: { rows: number; ok: number; unchanged: number; problems: number; notInFile: number; committed: boolean }
  rows: Array<{ line: number; code: string; index: number | null; uid: string; result: ClaimSetImportResult; message?: string }>
  range: ClaimSetRange
}

export interface AssignClaimSetRangeRequest {
  /** Required unless clear */
  collectionId?: string
  productId?: string
  batchId?: string
  /** Default: the whole range */
  start?: number
  end?: number
  /** Unassign instead (tags bound to a proof are never cleared) */
  clear?: boolean
  data?: Record<string, unknown>
}

export interface AssignClaimSetRangeResponse {
  changed: number
  skipped: Array<{ code: string; index: number; reason: 'other_range' | 'has_proof' | 'assigned_elsewhere'; collectionId?: string }>
  range: ClaimSetRange
}

export interface ClaimSetRangeFile {
  filename: string
  contentType: string
  /** export: the printer file */
  csv?: string
  /** instructions as PDF: the file, base64 */
  base64?: string
  /** instructions as Markdown */
  markdown?: string
}

export interface Partner {
  id: string
  name: string
  status: 'active' | 'suspended'
  tapDomains: string[]
  features: Record<string, boolean>
  /** Your role (from partner.list / partner.get) */
  role?: 'owner' | 'admin' | 'assigner'
  /** Owners only */
  members?: Array<{ userId: string; role: 'owner' | 'admin' | 'assigner'; grantedBy: string | null; grantedAt: string }>
  createdAt: string
  updatedAt: string
}

export interface PartnerClaimSet {
  id: string
  namespace: string
  name: string | null
  tagType: ClaimSetTagType
  tapDomain: string
  owner: { type: 'platform' | 'partner' | 'collection' | 'user'; id: string | null }
  codes: number
  deleted: boolean
  createdAt: string | null
}

/** One hit from partner.lookupTags */
export interface PartnerTagHit {
  namespace: string
  claimSetId: string
  set: PartnerClaimSet | null
  tag: ClaimSetRangeTag & { url: string | null }
  range: ClaimSetRange | null
}

export interface CreatePartnerClaimSetRequest {
  name: string
  tagType: ClaimSetTagType
  /** One of the partner's tap domains; default smartlinks.app */
  tapDomain?: string
}
