// src/types/proof.ts
import { JsonValue, ScopedFieldDef } from './product'

/**
 * `proof.values` — the owner + business-writable bag.
 * Public keys sit at the root (business + current owner can write, everyone
 * can read); `owner` and `personal` are reserved sub-keys with their own
 * read/write rules. See docs/proof-product-data-scoping.md.
 */
export interface ProofValues {
  [key: string]: JsonValue | Record<string, JsonValue> | Record<string, Record<string, JsonValue>> | undefined
  /**
   * Owner-scoped: read/write by business + current owner; transfers with ownership.
   * Read exception: while the proof is `claimable`, this bag is also readable by everyone
   * (so a prospective claimer sees pre-set owner data); it reverts to owner-only once claimed.
   */
  owner?: Record<string, JsonValue>
  /** Per-user: read/write only by the matching userId; not visible to the next owner, not even business admins. */
  personal?: Record<string, Record<string, JsonValue>>
}

/**
 * Represents a Proof object.
 */
export interface Proof {
  /** Unique identifier for the collection */
  collectionId: string
  /** Creation timestamp */
  createdAt: string
  /** Unique identifier for the proof */
  id: string
  /** Unique identifier for the product */
  productId: string
  /** Unique identifier for the token */
  tokenId: string
  /** Unique identifier for the user */
  userId: string
  /** Batch (single production run of this product) this item belongs to, if any. */
  batchId?: string | null
  /** Variant (product definition) this item belongs to, if any. */
  variantId?: string | null
  /** Lot (cross-product production grouping) this item belongs to, if any. Separate from `batchId`. */
  lotId?: string | null
  /** Is this proof available to be claimed */
  claimable?: boolean
  /** Is this proof virtual */
  virtual?: boolean
  /** Public, business-writable spec data — readable by everyone. */
  data?: Record<string, JsonValue>
  /** Business-only spec data — stripped from public/non-admin reads. */
  admin?: Record<string, JsonValue>
  /** Owner + business-writable consumer data. See ProofValues. */
  values: ProofValues
}

// Backwards compatibility alias
export type ProofResponse = Proof

/**
 * The proof's writable content, addressed by zone. Its keys mirror the proof
 * document, so what you pass is what the proof looks like. Each zone has its own
 * read/write visibility:
 *
 * | Zone     | Stored at      | Readable by            | Writable by   |
 * |----------|----------------|------------------------|---------------|
 * | `values` | `proof.values` | public + owner + admin | owner + admin |
 * | `data`   | `proof.data`   | public + owner + admin | admin only    |
 * | `admin`  | `proof.admin`  | admin only             | admin only    |
 * | `owner`  | `proof.owner`  | admin only             | admin only    |
 *
 * Use `data` for business fields everyone should *see* but only the business
 * should *set* (e.g. a serial number). Use `admin` for fields only the business
 * should see at all. On update, object zones deep-merge.
 */
export interface ProofWrite {
  /**
   * Choose the proof's ID (serial, NFC id, etc.). Honoured **on create only** —
   * the ledger doc becomes `{productId}-{id}`. Omit to auto-generate. Ignored on
   * update (a proof's ID is immutable).
   */
  id?: string
  /** Owner + business-writable consumer data. Public + owner readable. → `proof.values` */
  values?: ProofValues
  /** Business spec data (e.g. serialNo). Public + owner readable, admin-only writable. → `proof.data` */
  data?: Record<string, JsonValue>
  /** Business-only spec data — admin-only read & write (stripped from public + owner). → `proof.admin` */
  admin?: Record<string, JsonValue>
  /** Business-only root data — admin-only. → `proof.owner` */
  owner?: Record<string, JsonValue>
  /** Is this proof available to be claimed. */
  claimable?: boolean
  /** Any other named root field. */
  [key: string]: JsonValue | Record<string, JsonValue> | ProofValues | undefined
}

// Request bodies — path carries collection/product.
export interface ProofCreateRequest {
  /**
   * The proof to create, by zone (mirrors the proof document). This is the clear,
   * recommended shape — `create(collectionId, productId, { proof: {...} })`.
   */
  proof?: ProofWrite
  /** Owner + business-writable consumer data (→ `proof.values`). Same as `proof.values`. */
  values?: ProofValues
  /** Canonical root `claimable` flag (also accepted as `proof.claimable`). */
  claimable?: boolean
  virtual?: boolean
  /** @deprecated Legacy alias for `proof`. Use `proof`. */
  core?: ProofWrite
  /**
   * @deprecated On the request body this is folded into the **values bag**
   * (public + owner-writable) — NOT `proof.data`. Use `proof.data`.
   */
  data?: Record<string, JsonValue>
  /** @deprecated Not routed to `proof.admin` on create — use `proof.admin`. */
  admin?: Record<string, JsonValue>
}

/**
 * Update passes the proof's fields **at the root** — `update(c, p, id, { data: {...} })`
 * sets `proof.data`, `{ values: {...} }` sets `proof.values`, etc. (A `proof` block is
 * also accepted and routed the same way.) Object zones deep-merge.
 */
export type ProofUpdateRequest = Partial<ProofWrite> & { proof?: ProofWrite }

/**
 * Body for the owner self-service values write (`proof.updateValues`), the
 * public counterpart to the admin `update`. The caller must be the current
 * owner (or a collection admin). Only owner-writable zones are honoured:
 *
 * - flat keys        → `proof.values.<key>` (public data)
 * - `owner`          → merged into `proof.values.owner` (owner-scoped)
 * - `personal`       → merged into `proof.values.personal[callerUid]` — the
 *                      caller's OWN private slot only, never another user's
 *                      (owner-only, non-transferring; not even admins can
 *                      write someone else's slot)
 *
 * `private` / `proof` sub-keys are business-only and are ignored here.
 */
export interface ProofValuesUpdateRequest {
  [key: string]: JsonValue | Record<string, JsonValue> | undefined
  /** Owner-scoped data, merged into `proof.values.owner`. */
  owner?: Record<string, JsonValue>
  /** The caller's own private slot, merged into `proof.values.personal[callerUid]`. */
  personal?: Record<string, JsonValue>
}

// Claim may accept arbitrary payload depending on server-side rules
export type ProofClaimRequest = Record<string, any>

// ─── Collection settings: `proofFields` field-config ──────────────────────────

/**
 * `'public'` (default, omitted) reads/writes `proof.values[key]`.
 * `'owner'` reads/writes `proof.values.owner[key]`.
 * `'personal'` reads/writes `proof.values.personal[userId][key]`.
 * `'admin'` reads/writes `proof.admin[key]` (admin only).
 */
export type ProofFieldScope = 'public' | 'owner' | 'personal' | 'admin'

export type ProofFieldDef = ScopedFieldDef & { scope?: ProofFieldScope }

/** Shape of the `proofFields` collection settings group. */
export interface ProofFieldsConfig {
  fields: ProofFieldDef[]
}

// ---------------------------------------------------------------------------
// Share grants — delegated, scoped, revocable bearer access to a proof
// ---------------------------------------------------------------------------

/** What a grant authorises the bearer to do on the proof. */
export type GrantScope = 'read' | 'comment' | 'admin' | 'verify_owner'

/** Who may redeem a grant. */
export interface GrantAudience {
  kind: 'public_link' | 'named'
  email?: string
  userId?: string
}

/** A share grant issued on a proof. */
export interface ProofGrant {
  grantId: string
  proofId: string
  productId?: string | null
  scope: GrantScope[]
  audience: GrantAudience
  createdBy: string
  expiresAt?: string | null
  revokedAt?: string | null
  redeemedBy?: { userId?: string; guestName?: string; redeemedAt: string }
  redeemCount: number
  createdAt: string
  updatedAt: string
  /** The opaque bearer token — present ONLY on the `createGrant` response, never on `listGrants`. */
  token?: string
}

export interface CreateGrantOptions {
  /** At least one scope is required. */
  scope: GrantScope[]
  /** Defaults to `{ kind: 'public_link' }`. */
  audience?: GrantAudience
  /** Optional expiry — a `Date` or ISO string. */
  expiresAt?: Date | string
}

export interface RedeemGrantOptions {
  /** Display name to stamp on guest activity when the redeemer is not signed in. */
  guestName?: string
}

/**
 * Result of redeeming a grant. For read/comment/admin grants this is the granted
 * scope; for a `verify_owner` grant it is an ownership assertion (never the account).
 */
export type RedeemGrantResult =
  | { scope: GrantScope[]; redeemedAt: string }
  | { proofId: string; assertsOwnership: true; ownerDisplayName?: string; issuedAt?: string; expiresAt?: string }

// ---------------------------------------------------------------------------
// Ownership transfer — moving a proof's single owner (proof.userId) from A to B
// ---------------------------------------------------------------------------

/**
 * How a transfer was initiated.
 * - `directed`     — the owner pushed it to a named recipient, who must accept.
 * - `open_release` — the owner released it; the proof is `claimable` by anyone.
 * - `contested`    — a holder claimed ownership the owner did not release (Phase 2).
 */
export type ProofTransferType = 'directed' | 'open_release' | 'contested'

/**
 * Where a transfer is in its lifecycle. `pending` is in-flight; `completed`
 * means ownership moved. `disputed`/`escalated` are Phase 2 (contested claims).
 */
export type ProofTransferState =
  | 'pending' | 'completed' | 'cancelled' | 'expired'
  | 'disputed' | 'escalated' | 'rejected'

/** An ownership-transfer record on a proof. */
export interface ProofTransfer {
  id: string
  proofId: string
  productId?: string | null
  type: ProofTransferType
  state: ProofTransferState
  /** Owner at the time the transfer was initiated. */
  fromUserId?: string | null
  /** Intended recipient (directed) / claimant (contested). */
  toUserId?: string | null
  toEmail?: string | null
  initiatedByUserId?: string | null
  initiatedByRole?: 'owner' | 'claimant' | 'admin' | null
  disputeReason?: string | null
  disputeDeadline?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Start a push transfer. Provide **one** of:
 * - `toEmail` / `toUserId` — a directed transfer to a named recipient (they accept).
 * - `release: true`        — an open release (the proof becomes claimable by anyone).
 */
export interface TransferProofOptions {
  /** Directed: recipient email (created/looked up if needed). */
  toEmail?: string
  /** Directed: recipient user id, if already known. */
  toUserId?: string
  /** Directed: display name for a newly-created recipient. */
  toName?: string
  /** Open release: mark the proof claimable instead of directing it. */
  release?: boolean
  /** Optional note included in the recipient email. */
  message?: string
  /** Set `false` to skip the recipient notification email (directed only). */
  notify?: boolean
}

/** Result of initiating a push transfer. */
export interface TransferProofResult {
  ok: boolean
  mode: 'directed' | 'open_release'
  transfer: ProofTransfer
}
