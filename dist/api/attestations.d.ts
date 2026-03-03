import type { Attestation, CreateAttestationInput, ListAttestationsParams, ListAttestationsResponse, AttestationSummaryParams, AttestationSummaryResponse, PublicAttestationSummaryResponse, AttestationLatestParams, AttestationLatestResponse, PublicAttestationLatestResponse, AttestationVerifyParams, ChainVerifyResult, AttestationTreeSummaryParams, AttestationTreeSummaryResponse, PublicAttestationTreeSummaryResponse, AttestationTreeLatestParams, AttestationTreeLatestResponse, PublicAttestationTreeLatestResponse, PublicListAttestationsResponse } from "../types/attestations";
/**
 * Postgres-backed Attestations API (v2).
 *
 * Attestations are an **append-only, tamper-evident fact log** that can be
 * attached to any subject type in the system (`container`, `proof`, `product`,
 * `tag`, etc.).  Each record carries a SHA-256 `contentHash` that chains to
 * the previous record for the same `(subjectType, subjectId, attestationType)`
 * tuple, enabling cryptographic integrity verification.
 *
 * ### Admin vs Public
 * - **Admin** endpoints (`/admin/collection/:id/attestations`) require a valid
 *   admin session or bearer token.  All three data zones are returned.
 * - **Public** endpoints (`/public/collection/:id/attestations`) are read-only.
 *   Owner elevation is available via `Authorization: Bearer <Firebase ID token>`.
 *
 * @see docs/attestations.md
 */
export declare namespace attestations {
    /**
     * Create a single attestation (admin).
     *
     * @param collectionId - Collection context
     * @param data - Attestation payload; `subjectType`, `subjectId`, and
     *   `attestationType` are required
     * @returns The newly created `Attestation` record
     *
     * @example
     * ```typescript
     * const a = await attestations.create('coll_123', {
     *   subjectType:     'container',
     *   subjectId:       'uuid-of-cask',
     *   attestationType: 'temperature',
     *   recordedAt:      '2025-04-15T14:30:00Z',
     *   value:           { celsius: 12.4 },
     *   ownerData:       { sensorId: 'TEMP-7' },
     *   unit:            '°C',
     *   visibility:      'public',
     * })
     * ```
     */
    function create(collectionId: string, data: CreateAttestationInput): Promise<Attestation>;
    /**
     * Batch-create attestations (admin).
     *
     * Sends an array of `CreateAttestationInput` objects in a single request.
     * The server processes them atomically and returns the created records.
     *
     * @param collectionId - Collection context
     * @param items - Array of attestation payloads (1–1000 items recommended)
     * @returns Array of created `Attestation` records, in the same order
     *
     * @example
     * ```typescript
     * const records = await attestations.createBatch('coll_123', [
     *   { subjectType: 'container', subjectId: 'uuid1', attestationType: 'temperature', value: { celsius: 12.4 } },
     *   { subjectType: 'container', subjectId: 'uuid1', attestationType: 'humidity',    value: { rh: 68 } },
     * ])
     * ```
     */
    function createBatch(collectionId: string, items: CreateAttestationInput[]): Promise<Attestation[]>;
    /**
     * List attestations for a subject (admin).
     *
     * Returns all three data zones. Supports filtering by type and date range.
     *
     * @param collectionId - Collection context
     * @param params - Query parameters; `subjectType` and `subjectId` are required
     * @returns `{ attestations: Attestation[] }`
     *
     * @example
     * ```typescript
     * const { attestations: records } = await attestations.list('coll_123', {
     *   subjectType: 'container',
     *   subjectId:   'uuid-of-cask',
     *   attestationType: 'temperature',
     *   recordedAfter:   '2025-01-01T00:00:00Z',
     *   limit: 50,
     * })
     * ```
     */
    function list(collectionId: string, params: ListAttestationsParams): Promise<ListAttestationsResponse>;
    /**
     * Time-series summary of attestations (admin).
     *
     * Aggregates attestation counts (and optionally a numeric `value` field) into
     * time buckets.  Useful for charting trends.
     *
     * @param collectionId - Collection context
     * @param params - Query parameters; `subjectType`, `subjectId`, and
     *   `attestationType` are required
     * @returns `{ summary: AttestationSummaryBucket[] }`
     *
     * @example
     * ```typescript
     * const { summary } = await attestations.summary('coll_123', {
     *   subjectType:     'container',
     *   subjectId:       'uuid-of-cask',
     *   attestationType: 'temperature',
     *   valueField:      'celsius',
     *   groupBy:         'day',
     *   recordedAfter:   '2025-01-01T00:00:00Z',
     * })
     * ```
     */
    function summary(collectionId: string, params: AttestationSummaryParams): Promise<AttestationSummaryResponse>;
    /**
     * Latest snapshot — one record per `attestationType` (admin).
     *
     * Returns the most-recent attestation for each type recorded against this
     * subject.  Ideal for dashboards that show the current state of a container.
     *
     * @param collectionId - Collection context
     * @param params - Query parameters; `subjectType` and `subjectId` are required
     * @returns `{ latest: LatestAttestation[] }`
     *
     * @example
     * ```typescript
     * const { latest } = await attestations.latest('coll_123', {
     *   subjectType: 'container',
     *   subjectId:   'uuid-of-fridge',
     * })
     * // latest[0].attestationType === 'temperature'
     * // latest[0].latest.value === { celsius: 4.1 }
     * ```
     */
    function latest(collectionId: string, params: AttestationLatestParams): Promise<AttestationLatestResponse>;
    /**
     * Verify the hash chain for a `(subjectType, subjectId, attestationType)` tuple (admin).
     *
     * Re-computes each `contentHash` and confirms it matches the stored value
     * and correctly references the previous record's hash.  A `valid: false`
     * result with `failedAt` indicates the first broken link.
     *
     * @param collectionId - Collection context
     * @param params - Query parameters; all three fields are required
     * @returns `ChainVerifyResult`
     *
     * @example
     * ```typescript
     * const result = await attestations.verify('coll_123', {
     *   subjectType:     'container',
     *   subjectId:       'uuid-of-cask',
     *   attestationType: 'temperature',
     * })
     * if (!result.valid) {
     *   console.warn('Chain broken at', result.failedAt)
     * }
     * ```
     */
    function verify(collectionId: string, params: AttestationVerifyParams): Promise<ChainVerifyResult>;
    /**
     * Tree time-series summary — aggregates across an entire container subtree (admin).
     *
     * Performs a BFS traversal of the container hierarchy rooted at `subjectId`,
     * collects all descendant container IDs (and optionally their items), then
     * aggregates attestations across all of them.
     *
     * @param collectionId - Collection context
     * @param params - `subjectId` and `attestationType` are required;
     *   `subjectType` is implicitly `'container'`
     * @returns `{ summary: AttestationSummaryBucket[], subjectCount: number }`
     *
     * @example
     * ```typescript
     * const { summary, subjectCount } = await attestations.treeSummary('coll_123', {
     *   subjectId:       'root-warehouse-uuid',
     *   attestationType: 'temperature',
     *   valueField:      'celsius',
     *   groupBy:         'hour',
     *   includeItems:    true,
     * })
     * console.log(`Aggregated over ${subjectCount} subjects`)
     * ```
     */
    function treeSummary(collectionId: string, params: AttestationTreeSummaryParams): Promise<AttestationTreeSummaryResponse>;
    /**
     * Tree latest snapshot — most-recent record per type across a container subtree (admin).
     *
     * Same BFS traversal as `treeSummary`, but returns the most-recent record
     * per `attestationType` aggregated across the entire subtree.
     *
     * @param collectionId - Collection context
     * @param params - `subjectId` is required; `subjectType` is implicitly `'container'`
     * @returns `{ latest: LatestAttestation[], subjectCount: number }`
     */
    function treeLatest(collectionId: string, params: AttestationTreeLatestParams): Promise<AttestationTreeLatestResponse>;
    /**
     * List attestations for a subject (public).
     *
     * Records with `visibility='admin'` are always excluded.
     * Records with `visibility='owner'` are included only when the caller
     * provides a valid Firebase ID token that resolves to the subject owner.
     *
     * The `audience` field in the response indicates the tier that was served.
     *
     * @param collectionId - Collection context
     * @param params - Query parameters; `subjectType` and `subjectId` are required
     * @returns `{ attestations: Attestation[], audience: AttestationAudience }`
     *
     * @example
     * ```typescript
     * const { attestations: records, audience } = await attestations.publicList('coll_123', {
     *   subjectType: 'proof',
     *   subjectId:   'proof-uuid',
     * })
     * ```
     */
    function publicList(collectionId: string, params: ListAttestationsParams): Promise<PublicListAttestationsResponse>;
    /**
     * Time-series summary (public).
     *
     * Always served at `audience='public'`.  Same parameters as the admin version.
     *
     * @param collectionId - Collection context
     * @param params - Query parameters; `subjectType`, `subjectId`, and
     *   `attestationType` are required
     * @returns `{ summary: AttestationSummaryBucket[], audience: 'public' }`
     */
    function publicSummary(collectionId: string, params: AttestationSummaryParams): Promise<PublicAttestationSummaryResponse>;
    /**
     * Latest snapshot per `attestationType` (public).
     *
     * Owner elevation applies — provide a Firebase ID token for owner-tier data.
     *
     * @param collectionId - Collection context
     * @param params - `subjectType` and `subjectId` are required
     * @returns `{ latest: LatestAttestation[], audience: AttestationAudience }`
     */
    function publicLatest(collectionId: string, params: AttestationLatestParams): Promise<PublicAttestationLatestResponse>;
    /**
     * Tree time-series summary (public).
     *
     * Always served at `audience='public'`.  Performs the same BFS traversal as
     * the admin version but only includes publicly visible attestations.
     *
     * @param collectionId - Collection context
     * @param params - `subjectId` and `attestationType` are required
     * @returns `{ summary: AttestationSummaryBucket[], audience: 'public', subjectCount: number }`
     */
    function publicTreeSummary(collectionId: string, params: AttestationTreeSummaryParams): Promise<PublicAttestationTreeSummaryResponse>;
    /**
     * Tree latest snapshot (public).
     *
     * @param collectionId - Collection context
     * @param params - `subjectId` is required
     * @returns `{ latest: LatestAttestation[], audience: 'public', subjectCount: number }`
     */
    function publicTreeLatest(collectionId: string, params: AttestationTreeLatestParams): Promise<PublicAttestationTreeLatestResponse>;
    /**
     * List attestations for a specific container (public shortcut).
     *
     * Equivalent to `publicList` with `subjectType='container'` and
     * `subjectId=containerId` pre-filled.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param params - Optional filters (attestationType, date range, pagination)
     */
    function publicContainerList(collectionId: string, containerId: string, params?: Omit<ListAttestationsParams, 'subjectType' | 'subjectId'>): Promise<PublicListAttestationsResponse>;
    /**
     * Time-series summary for a specific container (public shortcut).
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param params - `attestationType` is required
     */
    function publicContainerSummary(collectionId: string, containerId: string, params: Omit<AttestationSummaryParams, 'subjectType' | 'subjectId'>): Promise<PublicAttestationSummaryResponse>;
    /**
     * Latest snapshot for a specific container (public shortcut).
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     */
    function publicContainerLatest(collectionId: string, containerId: string): Promise<PublicAttestationLatestResponse>;
    /**
     * Tree time-series summary rooted at a specific container (public shortcut).
     *
     * @param collectionId - Collection context
     * @param containerId - Root container UUID
     * @param params - `attestationType` is required
     */
    function publicContainerTreeSummary(collectionId: string, containerId: string, params: Omit<AttestationTreeSummaryParams, 'subjectId'>): Promise<PublicAttestationTreeSummaryResponse>;
    /**
     * Tree latest snapshot rooted at a specific container (public shortcut).
     *
     * @param collectionId - Collection context
     * @param containerId - Root container UUID
     * @param params - Optional `includeItems` flag
     */
    function publicContainerTreeLatest(collectionId: string, containerId: string, params?: Pick<AttestationTreeLatestParams, 'includeItems'>): Promise<PublicAttestationTreeLatestResponse>;
}
