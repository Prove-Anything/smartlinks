// src/api/jobs.ts
// Background jobs: start one, follow it, and list a collection's jobs. One namespace (SDK 2 had two,
// `jobs` and `async`).
import { request, post } from "../http.js";
import { listQuery } from "../list.js";
function enc(v) { return encodeURIComponent(v); }
export var jobs;
(function (jobs) {
    /**
     * List visible jobs for a collection, newest first.
     * GET /admin/collection/:collectionId/jobs
     *
     * @example
     * ```typescript
     * let page = await jobs.list('coll_123', { state: 'errored', limit: 50 })
     * while (page.nextCursor) page = await jobs.list('coll_123', { state: 'errored', limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, query = {}) {
        const path = `/admin/collection/${enc(collectionId)}/jobs${listQuery(query)}`;
        return request(path);
    }
    jobs.list = list;
    /**
     * Get a single job
     * GET /admin/collection/:collectionId/jobs/:jobId
     */
    async function get(collectionId, jobId) {
        const path = `/admin/collection/${enc(collectionId)}/jobs/${jobId}`;
        return request(path);
    }
    jobs.get = get;
    /**
     * Start a background job for a collection.
     * POST /admin/collection/:collectionId/async/jobs (202)
     */
    async function enqueue(collectionId, params) {
        const path = `/admin/collection/${enc(collectionId)}/async/jobs`;
        return post(path, params);
    }
    jobs.enqueue = enqueue;
    /**
     * How a job you started is getting on (may answer 404 once it has finished and been cleared away).
     * GET /admin/collection/:collectionId/async/jobs/:jobId
     */
    async function status(collectionId, jobId) {
        const path = `/admin/collection/${enc(collectionId)}/async/jobs/${jobId}`;
        return request(path);
    }
    jobs.status = status;
})(jobs || (jobs = {}));
