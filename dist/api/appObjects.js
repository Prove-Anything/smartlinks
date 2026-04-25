// src/api/appObjects.ts
import { request, post, patch, del } from '../http';
// ==================== APP NAMESPACE ====================
export var app;
(function (app) {
    // ==================== CASES ====================
    let cases;
    (function (cases) {
        /**
         * Build the base path for cases endpoints
         */
        function basePath(collectionId, appId, admin = false) {
            const zone = admin ? 'admin' : 'public';
            return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/cases`;
        }
        /**
         * Create a new case
         * POST /cases
         */
        async function create(collectionId, appId, input, admin = false) {
            const path = basePath(collectionId, appId, admin);
            return post(path, input);
        }
        cases.create = create;
        /**
         * List cases with optional query parameters
         * GET /cases
         */
        async function list(collectionId, appId, params, admin = false) {
            const path = basePath(collectionId, appId, admin);
            const queryParams = params ? buildQueryString(params) : '';
            return request(`${path}${queryParams}`);
        }
        cases.list = list;
        /**
         * Get a single case by ID
         * GET /cases/:caseId
         */
        async function get(collectionId, appId, caseId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(caseId)}`;
            return request(path);
        }
        cases.get = get;
        /**
         * Update a case
         * PATCH /cases/:caseId
         * Admin can update any field, public (owner) can only update data and owner zones
         */
        async function update(collectionId, appId, caseId, input, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(caseId)}`;
            return patch(path, input);
        }
        cases.update = update;
        /**
         * Soft delete a case
         * DELETE /cases/:caseId
         */
        async function remove(collectionId, appId, caseId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(caseId)}`;
            return del(path);
        }
        cases.remove = remove;
        /**
         * Get aggregate statistics for cases
         * POST /cases/aggregate
         */
        async function aggregate(collectionId, appId, request, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/aggregate`;
            return post(path, request);
        }
        cases.aggregate = aggregate;
        /**
         * Get case summary (admin only)
         * POST /cases/summary
         */
        async function summary(collectionId, appId, request) {
            const path = `${basePath(collectionId, appId, true)}/summary`;
            return post(path, request || {});
        }
        cases.summary = summary;
        /**
         * Append an entry to case history (admin only)
         * POST /cases/:caseId/history
         */
        async function appendHistory(collectionId, appId, caseId, input) {
            const path = `${basePath(collectionId, appId, true)}/${encodeURIComponent(caseId)}/history`;
            return post(path, input);
        }
        cases.appendHistory = appendHistory;
        /**
         * Get related threads and records for a case (admin only)
         * GET /cases/:caseId/related
         */
        async function related(collectionId, appId, caseId) {
            const path = `${basePath(collectionId, appId, true)}/${encodeURIComponent(caseId)}/related`;
            return request(path);
        }
        cases.related = related;
    })(cases = app.cases || (app.cases = {}));
    // ==================== THREADS ====================
    let threads;
    (function (threads) {
        /**
         * Build the base path for threads endpoints
         */
        function basePath(collectionId, appId, admin = false) {
            const zone = admin ? 'admin' : 'public';
            return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/threads`;
        }
        /**
         * Create a new thread
         * POST /threads
         */
        async function create(collectionId, appId, input, admin = false) {
            const path = basePath(collectionId, appId, admin);
            return post(path, input);
        }
        threads.create = create;
        /**
         * List threads with optional query parameters
         * GET /threads
         */
        async function list(collectionId, appId, params, admin = false) {
            const path = basePath(collectionId, appId, admin);
            const queryParams = params ? buildQueryString(params) : '';
            return request(`${path}${queryParams}`);
        }
        threads.list = list;
        /**
         * Get a single thread by ID
         * GET /threads/:threadId
         */
        async function get(collectionId, appId, threadId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}`;
            return request(path);
        }
        threads.get = get;
        /**
         * Update a thread
         * PATCH /threads/:threadId
         * Admin can update any field, public (owner) can only update body, tags, data, owner
         */
        async function update(collectionId, appId, threadId, input, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}`;
            return patch(path, input);
        }
        threads.update = update;
        /**
         * Soft delete a thread
         * DELETE /threads/:threadId
         */
        async function remove(collectionId, appId, threadId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}`;
            return del(path);
        }
        threads.remove = remove;
        /**
         * Add a reply to a thread
         * POST /threads/:threadId/reply
         * Atomically appends to replies array, increments replyCount, updates lastReplyAt
         */
        async function reply(collectionId, appId, threadId, input, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}/reply`;
            return post(path, input);
        }
        threads.reply = reply;
        /**
         * Get aggregate statistics for threads
         * POST /threads/aggregate
         */
        async function aggregate(collectionId, appId, request, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/aggregate`;
            return post(path, request);
        }
        threads.aggregate = aggregate;
    })(threads = app.threads || (app.threads = {}));
    // ==================== RECORDS ====================
    let records;
    (function (records_1) {
        /**
         * Build the base path for records endpoints
         */
        function basePath(collectionId, appId, admin = false) {
            const zone = admin ? 'admin' : 'public';
            return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/records`;
        }
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
        async function create(collectionId, appId, input, admin = false) {
            const path = basePath(collectionId, appId, admin);
            return post(path, input);
        }
        records_1.create = create;
        /**
         * List records with optional query parameters
         * GET /records
         */
        async function list(collectionId, appId, params, admin = false) {
            const path = basePath(collectionId, appId, admin);
            const queryParams = params ? buildQueryString(params) : '';
            return request(`${path}${queryParams}`);
        }
        records_1.list = list;
        /**
         * Get a single record by ID
         * GET /records/:recordId
         */
        async function get(collectionId, appId, recordId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`;
            return request(path);
        }
        records_1.get = get;
        /**
         * Update a record
         * PATCH /records/:recordId
         * Admin can update any field, public (owner) can only update data and owner
         */
        async function update(collectionId, appId, recordId, input, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`;
            return patch(path, input);
        }
        records_1.update = update;
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
        async function updateWithToken(collectionId, appId, recordId, data, editToken) {
            const path = `${basePath(collectionId, appId, false)}/${encodeURIComponent(recordId)}`;
            return patch(path, { data }, { 'X-Edit-Token': editToken });
        }
        records_1.updateWithToken = updateWithToken;
        /**
         * Soft delete a record
         * DELETE /records/:recordId
         */
        async function remove(collectionId, appId, recordId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`;
            return del(path);
        }
        records_1.remove = remove;
        /**
         * Get aggregate statistics for records
         * POST /records/aggregate
         */
        async function aggregate(collectionId, appId, request, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/aggregate`;
            return post(path, request);
        }
        records_1.aggregate = aggregate;
        /**
         * Restore a soft-deleted record.
         * POST /records/:recordId/restore (admin only)
         */
        async function restore(collectionId, appId, recordId) {
            const path = `${basePath(collectionId, appId, true)}/${encodeURIComponent(recordId)}/restore`;
            return post(path, {});
        }
        records_1.restore = restore;
        /**
         * Upsert a record by ref — creates if no record with that ref exists,
         * otherwise updates. Scope, specificity, and ref are canonicalized on write.
         * POST /records/upsert (admin only)
         */
        async function upsert(collectionId, appId, input) {
            const path = `${basePath(collectionId, appId, true)}/upsert`;
            return post(path, input);
        }
        records_1.upsert = upsert;
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
        async function match(collectionId, appId, input, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/match`;
            return post(path, input);
        }
        records_1.match = match;
        /**
         * Upsert up to 500 records in a single transaction.
         * Each row is individually error-isolated — a failure on one row does not
         * abort the others.
         * POST /records/bulk-upsert (admin only)
         */
        async function bulkUpsert(collectionId, appId, records) {
            const path = `${basePath(collectionId, appId, true)}/bulk-upsert`;
            return post(path, { records });
        }
        records_1.bulkUpsert = bulkUpsert;
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
        async function bulkDelete(collectionId, appId, input) {
            const path = `${basePath(collectionId, appId, true)}/bulk-delete`;
            return post(path, input);
        }
        records_1.bulkDelete = bulkDelete;
    })(records = app.records || (app.records = {}));
})(app || (app = {})); // end namespace app
// ==================== HELPERS ====================
/**
 * Build a query string from an object of parameters
 */
function buildQueryString(params) {
    const entries = Object.entries(params).filter(([_, value]) => value !== undefined && value !== null);
    if (entries.length === 0)
        return '';
    const queryString = entries
        .map(([key, value]) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(String(value));
        return `${encodedKey}=${encodedValue}`;
    })
        .join('&');
    return `?${queryString}`;
}
