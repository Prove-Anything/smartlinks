// src/api/async.ts
import { request, post } from "../http";
function enc(v) { return encodeURIComponent(v); }
export var async;
(function (async) {
    /**
     * Enqueue a background job for a collection
     * POST /admin/collection/:collectionId/async/jobs (202)
     */
    async function enqueueAsyncJob(collectionId, params) {
        const path = `/admin/collection/${enc(collectionId)}/async/jobs`;
        return post(path, params);
    }
    async.enqueueAsyncJob = enqueueAsyncJob;
    /**
     * Get job status by ID (may return 404 if completed/removed)
     * GET /admin/collection/:collectionId/async/jobs/:jobId
     */
    async function getAsyncJobStatus(collectionId, jobId) {
        const path = `/admin/collection/${enc(collectionId)}/async/jobs/${jobId}`;
        return request(path);
    }
    async.getAsyncJobStatus = getAsyncJobStatus;
})(async || (async = {}));
