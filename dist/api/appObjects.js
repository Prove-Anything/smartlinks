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
    (function (records) {
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
         */
        async function create(collectionId, appId, input, admin = false) {
            const path = basePath(collectionId, appId, admin);
            return post(path, input);
        }
        records.create = create;
        /**
         * List records with optional query parameters
         * GET /records
         */
        async function list(collectionId, appId, params, admin = false) {
            const path = basePath(collectionId, appId, admin);
            const queryParams = params ? buildQueryString(params) : '';
            return request(`${path}${queryParams}`);
        }
        records.list = list;
        /**
         * Get a single record by ID
         * GET /records/:recordId
         */
        async function get(collectionId, appId, recordId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`;
            return request(path);
        }
        records.get = get;
        /**
         * Update a record
         * PATCH /records/:recordId
         * Admin can update any field, public (owner) can only update data and owner
         */
        async function update(collectionId, appId, recordId, input, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`;
            return patch(path, input);
        }
        records.update = update;
        /**
         * Soft delete a record
         * DELETE /records/:recordId
         */
        async function remove(collectionId, appId, recordId, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`;
            return del(path);
        }
        records.remove = remove;
        /**
         * Get aggregate statistics for records
         * POST /records/aggregate
         */
        async function aggregate(collectionId, appId, request, admin = false) {
            const path = `${basePath(collectionId, appId, admin)}/aggregate`;
            return post(path, request);
        }
        records.aggregate = aggregate;
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
