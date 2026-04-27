import type { AppCase, CreateCaseInput, UpdateCaseInput, AppendHistoryInput, CaseSummaryRequest, CaseSummaryResponse, CaseListQueryParams, AppThread, CreateThreadInput, UpdateThreadInput, ReplyInput, ThreadListQueryParams, AppRecord, CreateRecordInput, CreateRecordResponse, UpdateRecordInput, UpsertRecordInput, UpsertRecordResponse, MatchRecordsInput, MatchResult, BulkUpsertItem, BulkUpsertResult, BulkDeleteResult, BulkDeleteInput, RecordListQueryParams, ResolveAllParams, ResolveAllResult, PreviewRuleParams, PreviewRuleResult, PaginatedResponse, AggregateRequest, AggregateResponse, RelatedResponse } from '../types/appObjects';
export declare namespace app {
    namespace cases {
        /**
         * Create a new case
         * POST /cases
         */
        function create(collectionId: string, appId: string, input: CreateCaseInput, admin?: boolean): Promise<AppCase>;
        /**
         * List cases with optional query parameters
         * GET /cases
         */
        function list(collectionId: string, appId: string, params?: CaseListQueryParams, admin?: boolean): Promise<PaginatedResponse<AppCase>>;
        /**
         * Get a single case by ID
         * GET /cases/:caseId
         */
        function get(collectionId: string, appId: string, caseId: string, admin?: boolean): Promise<AppCase>;
        /**
         * Update a case
         * PATCH /cases/:caseId
         * Admin can update any field, public (owner) can only update data and owner zones
         */
        function update(collectionId: string, appId: string, caseId: string, input: UpdateCaseInput, admin?: boolean): Promise<AppCase>;
        /**
         * Soft delete a case
         * DELETE /cases/:caseId
         */
        function remove(collectionId: string, appId: string, caseId: string, admin?: boolean): Promise<{
            success: boolean;
        }>;
        /**
         * Get aggregate statistics for cases
         * POST /cases/aggregate
         */
        function aggregate(collectionId: string, appId: string, request: AggregateRequest, admin?: boolean): Promise<AggregateResponse>;
        /**
         * Get case summary (admin only)
         * POST /cases/summary
         */
        function summary(collectionId: string, appId: string, request?: CaseSummaryRequest): Promise<CaseSummaryResponse>;
        /**
         * Append an entry to case history (admin only)
         * POST /cases/:caseId/history
         */
        function appendHistory(collectionId: string, appId: string, caseId: string, input: AppendHistoryInput): Promise<AppCase>;
        /**
         * Get related threads and records for a case (admin only)
         * GET /cases/:caseId/related
         */
        function related(collectionId: string, appId: string, caseId: string): Promise<RelatedResponse>;
    }
    namespace threads {
        /**
         * Create a new thread
         * POST /threads
         */
        function create(collectionId: string, appId: string, input: CreateThreadInput, admin?: boolean): Promise<AppThread>;
        /**
         * List threads with optional query parameters
         * GET /threads
         */
        function list(collectionId: string, appId: string, params?: ThreadListQueryParams, admin?: boolean): Promise<PaginatedResponse<AppThread>>;
        /**
         * Get a single thread by ID
         * GET /threads/:threadId
         */
        function get(collectionId: string, appId: string, threadId: string, admin?: boolean): Promise<AppThread>;
        /**
         * Update a thread
         * PATCH /threads/:threadId
         * Admin can update any field, public (owner) can only update body, tags, data, owner
         */
        function update(collectionId: string, appId: string, threadId: string, input: UpdateThreadInput, admin?: boolean): Promise<AppThread>;
        /**
         * Soft delete a thread
         * DELETE /threads/:threadId
         */
        function remove(collectionId: string, appId: string, threadId: string, admin?: boolean): Promise<{
            success: boolean;
        }>;
        /**
         * Add a reply to a thread
         * POST /threads/:threadId/reply
         * Atomically appends to replies array, increments replyCount, updates lastReplyAt
         */
        function reply(collectionId: string, appId: string, threadId: string, input: ReplyInput, admin?: boolean): Promise<AppThread>;
        /**
         * Get aggregate statistics for threads
         * POST /threads/aggregate
         */
        function aggregate(collectionId: string, appId: string, request: AggregateRequest, admin?: boolean): Promise<AggregateResponse>;
    }
    namespace records {
        /**
         * Create a new record
         * POST /records
         *
         * When called on the public endpoint (admin = false) with an anonymous
         * caller, and the app's `publicCreate.records.anonymous.edit.editToken`
         * policy is enabled, the response includes a one-time `editToken` string.
         * Store it immediately — it is never returned again.
         *
         * @see {@link updateWithToken} — use the edit token for a follow-up amendment
         */
        function create(collectionId: string, appId: string, input: CreateRecordInput, admin?: boolean): Promise<CreateRecordResponse>;
        /**
         * List records with optional query parameters
         * GET /records
         */
        function list(collectionId: string, appId: string, params?: RecordListQueryParams, admin?: boolean): Promise<PaginatedResponse<AppRecord>>;
        /**
         * Get a single record by ID
         * GET /records/:recordId
         */
        function get(collectionId: string, appId: string, recordId: string, admin?: boolean): Promise<AppRecord>;
        /**
         * Update a record
         * PATCH /records/:recordId
         * Admin can update any field, public (owner) can only update data and owner
         */
        function update(collectionId: string, appId: string, recordId: string, input: UpdateRecordInput, admin?: boolean): Promise<AppRecord>;
        /**
         * Amend the `data` zone of a record using an anonymous edit token.
         * PATCH /records/:recordId  (public endpoint, no auth)
         *
         * This is the follow-up call after an anonymous `create()` that returned an
         * `editToken`.  Present the token via `X-Edit-Token` — the server validates
         * it with a constant-time comparison and, if `windowMinutes` is configured
         * in the policy, checks that the token has not expired.
         *
         * **Scope:** only the `data` zone may be modified via this path.
         * `owner`, `admin`, `status`, `visibility`, and indexed fields are
         * immutable to anonymous token holders.
         *
         * @param collectionId - Collection the record belongs to
         * @param appId        - App the record belongs to
         * @param recordId     - ID of the record to amend
         * @param data         - New (full replacement) value for the `data` zone
         * @param editToken    - Token received from the original `create()` response
         *
         * @example
         * ```ts
         * const record = await app.records.create(collectionId, appId, {
         *   recordType: 'payment',
         *   visibility: 'public',
         *   data: { amount: 9900, currency: 'USD' },
         * })
         * const { editToken } = record  // store this immediately!
         *
         * // Later, once the payment gateway confirms:
         * const updated = await app.records.updateWithToken(
         *   collectionId,
         *   appId,
         *   record.id,
         *   { amount: 9900, currency: 'USD', transactionId: 'txn_abc123' },
         *   editToken,
         * )
         * ```
         *
         * ### Error codes
         * | HTTP | `errorCode`           | Meaning                                           |
         * |------|-----------------------|---------------------------------------------------|
         * | 401  | `UNAUTHORIZED`        | No auth token and no `X-Edit-Token` header        |
         * | 403  | `FORBIDDEN`           | Policy not enabled, or token does not match       |
         * | 403  | `EDIT_WINDOW_EXPIRED` | `windowMinutes` elapsed since record creation     |
         * | 404  | `NOT_FOUND`           | Record does not exist                             |
         */
        function updateWithToken(collectionId: string, appId: string, recordId: string, data: Record<string, unknown>, editToken: string): Promise<AppRecord>;
        /**
         * Soft delete a record
         * DELETE /records/:recordId
         */
        function remove(collectionId: string, appId: string, recordId: string, admin?: boolean): Promise<{
            success: boolean;
        }>;
        /**
         * Get aggregate statistics for records
         * POST /records/aggregate
         */
        function aggregate(collectionId: string, appId: string, request: AggregateRequest, admin?: boolean): Promise<AggregateResponse>;
        /**
         * Restore a soft-deleted record.
         * POST /records/:recordId/restore (admin only)
         */
        function restore(collectionId: string, appId: string, recordId: string): Promise<AppRecord>;
        /**
         * Upsert a record by ref — creates if no record with that ref exists,
         * otherwise updates. Scope, specificity, and ref are canonicalized on write.
         * POST /records/upsert (admin only)
         */
        function upsert(collectionId: string, appId: string, input: UpsertRecordInput): Promise<UpsertRecordResponse>;
        /**
         * Match records against a runtime target scope.
         * Returns records whose scope is satisfied by the target,
         * ordered by specificity descending (most specific first).
         * POST /records/match
         *
         * @param admin - false for public endpoint (visibility-filtered), true for admin
         *
         * @example
         * ```ts
         * const { records, best } = await app.records.match(collectionId, appId, {
         *   target: { productId: 'prod_abc', facets: { tier: ['gold'] } },
         *   strategy: 'best',
         *   recordType: 'nutrition',
         * }, true);
         * // best.nutrition → the single highest-specificity nutrition record
         * ```
         */
        function match(collectionId: string, appId: string, input: MatchRecordsInput, admin?: boolean): Promise<MatchResult>;
        /**
         * Upsert up to 500 records in a single transaction.
         * Each row is individually error-isolated — a failure on one row does not
         * abort the others.
         * POST /records/bulk-upsert (admin only)
         */
        function bulkUpsert(collectionId: string, appId: string, records: BulkUpsertItem[]): Promise<BulkUpsertResult>;
        /**
         * Soft-delete records in bulk.
         * Supports two modes:
         * - **refs mode**: explicit list of refs (max 1000)
         * - **scope mode**: delete by scope anchor (productId / variantId / etc.)
         *
         * POST /records/bulk-delete (admin only)
         *
         * @example
         * ```ts
         * // Refs mode
         * await app.records.bulkDelete(collectionId, appId, {
         *   refs: ['product:prod_abc', 'product:prod_xyz'],
         *   recordType: 'nutrition',
         * });
         *
         * // Scope mode
         * await app.records.bulkDelete(collectionId, appId, {
         *   scope: { productId: 'prod_abc' },
         * });
         * ```
         */
        function bulkDelete(collectionId: string, appId: string, input: BulkDeleteInput): Promise<BulkDeleteResult>;
        /**
         * Resolve every applicable record for a product context in one call.
         * Returns records across all tiers (proof, batch, variant, product, rule, facet, collection)
         * deduplicated and sorted by specificity descending.
         * POST /records/resolve-all
         *
         * @param admin - false for public (visibility-filtered), true for admin (all records)
         */
        function resolveAll(collectionId: string, appId: string, input: ResolveAllParams, admin?: boolean): Promise<ResolveAllResult>;
        /**
         * Preview which products in the collection match a given facetRule.
         * Admin only. Use for live "matches N products" feedback while authoring a rule.
         * POST /records/preview-rule
         */
        function previewRule(collectionId: string, appId: string, input: PreviewRuleParams): Promise<PreviewRuleResult>;
    }
}
