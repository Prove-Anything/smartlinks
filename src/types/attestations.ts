/**
 * Attestations API Types — Postgres-backed (v2)
 *
 * These types support the new append-only, tamper-evident attestation system
 * which is polymorphic over subject types (container, proof, product, tag, etc.),
 * exposes three data-visibility zones, and maintains a SHA-256 hash chain for
 * cryptographic integrity verification.
 *
 * @see docs/attestations.md
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

/** Types of entities that can be the subject of an attestation. */
export type AttestationSubjectType =
  | 'container'
  | 'proof'
  | 'product'
  | 'tag'
  | 'serial'
  | 'order_item'
  | string

/**
 * Per-record visibility.  Set once at write time; never changed.
 * - `'public'`  — visible to any caller
 * - `'owner'`   — visible when the caller is the subject owner (Firebase ID token required)
 * - `'admin'`   — visible to admin callers only
 */
export type AttestationVisibility = 'public' | 'owner' | 'admin'

/**
 * Resolved audience tier returned by public endpoints.
 * Tells the client which data zones are populated in the response.
 */
export type AttestationAudience = 'public' | 'owner' | 'admin'

/** Granularity used by the time-series summary endpoints. */
export type AttestationGroupBy = 'hour' | 'day' | 'week' | 'month'

// ─── Core entity ──────────────────────────────────────────────────────────────

/**
 * A single Postgres-backed attestation record.
 *
 * Records are **append-only** — they must never be updated or deleted.
 * The `contentHash` / `prevHash` pair forms a tamper-evident chain keyed on
 * `(subjectType, subjectId, attestationType)`.  Use `/verify` to confirm
 * integrity of an entire chain.
 */
export interface Attestation {
  /** UUID primary key */
  id: string
  orgId: string
  collectionId: string
  /** Kind of entity this attestation describes */
  subjectType: AttestationSubjectType
  /** UUID or identifier of the subject */
  subjectId: string
  /** Domain-specific label, e.g. `'temperature'`, `'abv'`, `'angel_share'` */
  attestationType: string
  /** ISO 8601 — the real-world time when the recorded fact was true */
  recordedAt: string
  /** Per-record visibility; governs which audience tiers can read this record */
  visibility: AttestationVisibility
  /** Public data zone — visible at all audience tiers */
  value?: Record<string, any>
  /** Owner-tier data zone — stripped unless `audience >= 'owner'` */
  ownerData?: Record<string, any>
  /** Admin-tier data zone — stripped unless `audience === 'admin'` */
  adminData?: Record<string, any>
  /** Measurement unit, e.g. `'°C'`, `'%rh'`, `'L'`, `'ABV%'` */
  unit?: string
  /** Source system or sensor identifier */
  source?: string
  /** User ID or service account that recorded the fact */
  authorId?: string
  /** Arbitrary extra metadata */
  metadata?: Record<string, any>
  /** SHA-256 digest of this record (includes `prevHash`) */
  contentHash: string
  /** `contentHash` of the preceding record in this chain, if any */
  prevHash?: string
  /** ISO 8601 — database insertion timestamp */
  createdAt: string
}

// ─── Derived / computed shapes ────────────────────────────────────────────────

/**
 * Returned by `/latest` — one entry per `attestationType`, containing the
 * single most-recent record for that type.
 */
export interface LatestAttestation {
  attestationType: string
  latest: Attestation
}

/**
 * One time-bucket returned by `/summary`.
 * `period` format depends on `groupBy`:
 * - `'hour'`  → `"2025-04-15T14:00:00Z"`
 * - `'day'`   → `"2025-04-15"`
 * - `'week'`  → `"2025-W16"`
 * - `'month'` → `"2025-04"`
 */
export interface AttestationSummaryBucket {
  period: string
  count: number
  /** Aggregated value fields for this bucket (present when `valueField` is requested) */
  values?: Record<string, any>
}

/**
 * Returned by `/verify` — result of re-computing and validating the full
 * hash chain for a `(subjectType, subjectId, attestationType)` tuple.
 */
export interface ChainVerifyResult {
  valid: boolean
  checkedCount: number
  /** ID of the first broken link; present only when `valid` is `false` */
  failedAt?: string
  message: string
}

// ─── Request / input shapes ───────────────────────────────────────────────────

/**
 * Request body for creating a single attestation (admin endpoint).
 *
 * Required: `subjectType`, `subjectId`, `attestationType`.
 */
export interface CreateAttestationInput {
  /** Required — type of entity this attestation describes */
  subjectType: AttestationSubjectType
  /** Required — UUID or identifier of the subject */
  subjectId: string
  /** Required — domain label for this measurement/fact */
  attestationType: string
  /** ISO 8601; defaults to `now()` when omitted */
  recordedAt?: string
  /** Default `'public'` */
  visibility?: AttestationVisibility
  /** Public data zone */
  value?: Record<string, any>
  /** Owner-tier data zone */
  ownerData?: Record<string, any>
  /** Admin-tier data zone */
  adminData?: Record<string, any>
  unit?: string
  source?: string
  authorId?: string
  metadata?: Record<string, any>
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface ListAttestationsResponse {
  attestations: Attestation[]
}

export interface PublicListAttestationsResponse {
  attestations: Attestation[]
  /** Resolved audience tier; governs which data zones are populated */
  audience: AttestationAudience
}

export interface AttestationSummaryResponse {
  summary: AttestationSummaryBucket[]
}

export interface PublicAttestationSummaryResponse {
  summary: AttestationSummaryBucket[]
  audience: 'public'
}

export interface AttestationLatestResponse {
  latest: LatestAttestation[]
}

export interface PublicAttestationLatestResponse {
  latest: LatestAttestation[]
  audience: AttestationAudience
}

export interface AttestationTreeSummaryResponse {
  summary: AttestationSummaryBucket[]
  /** Number of distinct subjects aggregated in this response */
  subjectCount: number
}

export interface PublicAttestationTreeSummaryResponse {
  summary: AttestationSummaryBucket[]
  audience: 'public'
  subjectCount: number
}

export interface AttestationTreeLatestResponse {
  latest: LatestAttestation[]
  subjectCount: number
}

export interface PublicAttestationTreeLatestResponse {
  latest: LatestAttestation[]
  audience: 'public'
  subjectCount: number
}

// ─── Query-parameter shapes ───────────────────────────────────────────────────

export interface ListAttestationsParams {
  /** Required */
  subjectType: AttestationSubjectType
  /** Required */
  subjectId: string
  attestationType?: string
  /** ISO 8601 lower bound (inclusive) */
  recordedAfter?: string
  /** ISO 8601 upper bound (inclusive) */
  recordedBefore?: string
  /** Default 100 */
  limit?: number
  /** Default 0 */
  offset?: number
}

export interface AttestationSummaryParams {
  /** Required */
  subjectType: AttestationSubjectType
  /** Required */
  subjectId: string
  /** Required */
  attestationType: string
  /** Dot-path inside `value` to aggregate, e.g. `'celsius'` */
  valueField?: string
  /** Default `'day'` */
  groupBy?: AttestationGroupBy
  recordedAfter?: string
  recordedBefore?: string
  /** Max number of buckets; default 200 */
  limit?: number
}

export interface AttestationLatestParams {
  /** Required */
  subjectType: AttestationSubjectType
  /** Required */
  subjectId: string
}

export interface AttestationVerifyParams {
  /** Required */
  subjectType: AttestationSubjectType
  /** Required */
  subjectId: string
  /** Required */
  attestationType: string
}

export interface AttestationTreeSummaryParams {
  /** Required — root container UUID */
  subjectId: string
  /** Required */
  attestationType: string
  valueField?: string
  /** Default `'day'` */
  groupBy?: AttestationGroupBy
  recordedAfter?: string
  recordedBefore?: string
  /** Max number of buckets; default 200 */
  limit?: number
  /** Include container items in BFS traversal; default `true` */
  includeItems?: boolean
}

export interface AttestationTreeLatestParams {
  /** Required — root container UUID */
  subjectId: string
  /** Include container items in BFS traversal; default `true` */
  includeItems?: boolean
}
