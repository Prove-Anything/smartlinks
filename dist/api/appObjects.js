import { request, post, patch, del, put } from '../http.js';
import { listQuery } from '../list.js';
// ==================== APP NAMESPACE ====================
export var app;
(function (app) {
    // ==================== OPTIONS (pickers) ====================
    /**
     * Pickers: the small, cached list behind "pick a machine" or "pick a hold reason".
     * docs/admin-lists-and-pickers.md
     */
    let options;
    (function (options) {
        /**
         * `source` = `type:<record type or declared type id>` | `list:<list id>`. Admins (`admin: true`)
         * see every entry; the public API lists public records and lists the app declares public. Hold on
         * to `version` and pass it back to get `{ unchanged: true }` when nothing changed.
         *
         * Returns `{ items, nextCursor, count?, version, mode }`: the entries are in `items`, already sorted,
         * 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the
         * next page; `null` means that was the last one. `q` searches the entries.
         *
         * @example
         * ```typescript
         * const res = await app.options.get(collectionId, appId, 'type:machine', { admin: true, limit: 200 })
         * if (!res.unchanged) { options = res.items; version = res.version }
         *
         * // A type too large to send whole: search it
         * const found = await app.options.get(collectionId, appId, 'type:machine', { q: 'mix', limit: 20 })
         * ```
         */
        async function get(collectionId, appId, source, opts = {}) {
            const zone = opts.admin ? 'admin' : 'public';
            const query = listQuery({ q: opts.q, version: opts.version, limit: opts.limit, cursor: opts.cursor });
            return request(`/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/options/${encodeURIComponent(source)}${query}`);
        }
        options.get = get;
        /**
         * Save a value list's values, in order (admins). Codes never change and are never lost: a value left
         * out stays, switched off, at the end. → the list as saved.
         */
        async function saveList(collectionId, appId, listId, values) {
            return put(`/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/options/${encodeURIComponent(`list:${listId}`)}`, { values });
        }
        options.saveList = saveList;
    })(options = app.options || (app.options = {}));
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
         *
         * Returns `{ items, nextCursor, count }`: the cases are in `items`, `count` is how many match in
         * all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`.
         * Sort with `orderBy`. A date field (`createdAt`, `updatedAt`, `closedAt`) takes a range: `{ gte, lte }`.
         * `includeDeleted`, `contactId` and `assignedTo` are for admin calls (`admin = true`) only: the
         * public list refuses a parameter it does not read.
         *
         * @example
         * ```typescript
         * let page = await app.cases.list(collectionId, appId, { status: 'open', limit: 50 })
         * console.log(page.items, page.count)
         * while (page.nextCursor) {
         *   page = await app.cases.list(collectionId, appId, { status: 'open', limit: 50, cursor: page.nextCursor })
         * }
         *
         * // This month's cases, most urgent first
         * await app.cases.list(collectionId, appId, {
         *   createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' },
         *   orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
         * })
         * ```
         */
        async function list(collectionId, appId, params, admin = false) {
            const path = basePath(collectionId, appId, admin);
            return request(`${path}${appListQuery(params)}`);
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
         *
         * Returns `{ items, nextCursor, count }`: the threads are in `items`, `count` is how many match in
         * all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`.
         * Sort with `orderBy`. A date field (`createdAt`, `updatedAt`) takes a range: `{ gte, lte }`.
         * `includeDeleted` and `contactId` are for admin calls (`admin = true`) only: the public list
         * refuses a parameter it does not read.
         *
         * @example
         * ```typescript
         * let page = await app.threads.list(collectionId, appId, { parentType: 'case', parentId: caseId, limit: 50 })
         * console.log(page.items, page.count)
         * while (page.nextCursor) {
         *   page = await app.threads.list(collectionId, appId, { parentType: 'case', parentId: caseId, limit: 50, cursor: page.nextCursor })
         * }
         *
         * // The threads with the newest replies, started this month
         * await app.threads.list(collectionId, appId, {
         *   createdAt: { gte: '2026-11-01T00:00:00Z' },
         *   orderBy: [{ lastReplyAt: 'desc' }],
         * })
         * ```
         */
        async function list(collectionId, appId, params, admin = false) {
            const path = basePath(collectionId, appId, admin);
            return request(`${path}${appListQuery(params)}`);
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
         * Delete a single reply from a thread by its reply id (moderation).
         * DELETE /threads/:threadId/reply/:replyId
         * Authorised for the reply's author, the proof owner, or a collection admin.
         */
        async function deleteReply(collectionId, appId, threadId, replyId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}/reply/${encodeURIComponent(replyId)}`;
            return del(path);
        }
        threads.deleteReply = deleteReply;
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
         * The standard query on an app's records (admin only): filter, sort, page, count and total in one
         * call, reaching into a record's own fields by path, and following a record to its `product` and
         * its `contact`.
         * POST /admin/collection/:collectionId/app/:appId/records/query
         *
         * Fields: id, recordType, ref, status, visibility, customId, productId, variantId, batchId, proofId,
         * contactId, authorId, parentType, parentId, createdAt, updatedAt, startsAt, expiresAt, and the
         * documents data, owner and admin, reached by path: `"data.status"`, `"data.line.name"`.
         *
         * ```typescript
         * // How many work orders by status, and how many units on each
         * await app.records.query(collectionId, appId, {
         *   where: { recordType: 'work_order' },
         *   groupBy: ['data.status'],
         *   aggregates: { orders: { count: true }, units: { sum: 'data.qty' } },
         * })
         * ```
         */
        async function query(collectionId, appId, body = {}) {
            return post(`${basePath(collectionId, appId, true)}/query`, body);
        }
        records_1.query = query;
        /**
         * What a records query can use: its fields, what each can filter, sort, group or total, and its links.
         * GET /admin/collection/:collectionId/app/:appId/records/query
         */
        async function queryFields(collectionId, appId) {
            return request(`${basePath(collectionId, appId, true)}/query`);
        }
        records_1.queryFields = queryFields;
        /**
         * List records with optional query parameters
         * GET /records
         *
         * Returns `{ items, nextCursor, count }`: the records are in `items`, `count` is how many match in
         * all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`.
         * Search with `q`, sort with `orderBy`. A date field (`createdAt`, `updatedAt`, `startsAt`,
         * `expiresAt`) takes a range: `{ gte, lte }`.
         *
         * Public/owner callers only receive records with `status: "active"`.
         * Admin callers can query all statuses (for example `draft`/`archived`).
         * `qFields`, `dataFilter`, `contactId` and `includeDeleted` are for admin calls (`admin = true`)
         * only: the public list refuses a parameter it does not read.
         *
         * @example
         * ```typescript
         * let page = await app.records.list(collectionId, appId, { recordType: 'tip', limit: 100 })
         * console.log(page.items, page.count)
         * while (page.nextCursor) {
         *   page = await app.records.list(collectionId, appId, { recordType: 'tip', limit: 100, cursor: page.nextCursor })
         * }
         *
         * // Tips about watering, changed this month, newest change first
         * await app.records.list(collectionId, appId, {
         *   recordType: 'tip',
         *   q: 'watering',
         *   updatedAt: { gte: '2026-11-01T00:00:00Z' },
         *   orderBy: [{ updatedAt: 'desc' }],
         * })
         * ```
         */
        async function list(collectionId, appId, params, admin = false) {
            const path = basePath(collectionId, appId, admin);
            return request(`${path}${appListQuery(params)}`);
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
         * Returns `{ items, nextCursor, count, strategy }`: `items` are the records whose scope is satisfied
         * by the target, most specific first, and `count` is how many matched. Without a `limit` it answers
         * up to 100. Give a `limit` (in `input`) to page: when there are more, pass `nextCursor` back as
         * `cursor`.
         * POST /records/match
         *
         * @param admin - false for public endpoint (visibility-filtered, active-only), true for admin
         *
         * @example
         * ```ts
         * const { items } = await app.records.match(collectionId, appId, {
         *   target: { productId: 'prod_abc', facets: { tier: ['gold'] } },
         *   strategy: 'best',
         *   recordType: 'nutrition',
         * }, true);
         * const best = items[0] // the single highest-specificity nutrition record
         *
         * // 50 at a time
         * const target = { productId: 'prod_abc' }
         * let page = await app.records.match(collectionId, appId, { target, limit: 50 })
         * while (page.nextCursor) {
         *   page = await app.records.match(collectionId, appId, { target, limit: 50, cursor: page.nextCursor })
         * }
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
        /**
         * Resolve every applicable record for a product context in one call.
         * Returns `{ items, nextCursor, count, context, truncated }`: `items` are the records across all
         * tiers (proof, batch, variant, product, rule, facet, collection), deduplicated and sorted by
         * specificity descending, each as `{ record, matchedAt, specificity }`. Without a `limit` it answers
         * up to 500. Give a `limit` (in `input`) to page: when there are more, pass `nextCursor` back as
         * `cursor`.
         * POST /records/resolve-all
         *
         * @param admin - false for public (visibility-filtered, active-only), true for admin (all statuses)
         *
         * @example
         * ```ts
         * const { items } = await app.records.resolveAll(collectionId, appId, {
         *   context: { productId: 'prod_abc' },
         *   recordType: 'nutrition',
         * })
         * for (const { record, matchedAt } of items) console.log(matchedAt, record.data)
         *
         * // 100 at a time
         * const context = { productId: 'prod_abc' }
         * let page = await app.records.resolveAll(collectionId, appId, { context, limit: 100 })
         * while (page.nextCursor) {
         *   page = await app.records.resolveAll(collectionId, appId, { context, limit: 100, cursor: page.nextCursor })
         * }
         * ```
         */
        async function resolveAll(collectionId, appId, input, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/resolve-all`;
            return post(path, input);
        }
        records_1.resolveAll = resolveAll;
        /**
         * Preview which products in the collection match a given facetRule.
         * Admin only. Use for live "matches N products" feedback while authoring a rule.
         * POST /records/preview-rule
         */
        async function previewRule(collectionId, appId, input) {
            const path = `${basePath(collectionId, appId, true)}/preview-rule`;
            return post(path, input);
        }
        records_1.previewRule = previewRule;
    })(records = app.records || (app.records = {}));
})(app || (app = {})); // end namespace app
// ==================== HELPERS ====================
/**
 * The query string of a cases / threads / records list, in the order the options were given. Paging and
 * the standard words (`q`, `orderBy`, a date range) go through `listQuery`. Two filters keep their own
 * spelling: `parentIds` is sent comma-joined, and `dataFilter` as `dataFilter[key]=value` (repeated for
 * an array of values).
 */
function appListQuery(params) {
    if (!params)
        return '';
    const parts = [];
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null)
            continue;
        if (key === 'dataFilter' && typeof value === 'object' && !Array.isArray(value)) {
            for (const [sub, subValue] of Object.entries(value)) {
                for (const v of Array.isArray(subValue) ? subValue : [subValue]) {
                    if (v === undefined || v === null)
                        continue;
                    parts.push(`${encodeURIComponent(`${key}[${sub}]`)}=${encodeURIComponent(String(v))}`);
                }
            }
            continue;
        }
        const one = listQuery({ [key]: key === 'parentIds' && Array.isArray(value) ? value.join(',') : value });
        if (one)
            parts.push(one.slice(1));
    }
    return parts.length ? `?${parts.join('&')}` : '';
}
