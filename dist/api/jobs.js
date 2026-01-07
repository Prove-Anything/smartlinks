// src/api/jobs.ts
import { request } from "../http";
function enc(v) { return encodeURIComponent(v); }
function encodeQuery(params = {}) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '')
            continue;
        search.set(key, String(value));
    }
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}
export var jobs;
(function (jobs) {
    /**
     * List visible jobs for a collection
     * GET /admin/collection/:collectionId/jobs
     */
    async function listJobs(collectionId, query = {}) {
        const qs = encodeQuery(query);
        const path = `/admin/collection/${enc(collectionId)}/jobs${qs}`;
        return request(path);
    }
    jobs.listJobs = listJobs;
    /**
     * Get a single job
     * GET /admin/collection/:collectionId/jobs/:jobId
     */
    async function getJob(collectionId, jobId) {
        const path = `/admin/collection/${enc(collectionId)}/jobs/${jobId}`;
        return request(path);
    }
    jobs.getJob = getJob;
})(jobs || (jobs = {}));
