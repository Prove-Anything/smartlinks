import type { EnqueueAsyncJobRequest, EnqueueAsyncJobResponse, Job } from "../types/jobs";
export declare namespace async {
    /**
     * Enqueue a background job for a collection
     * POST /admin/collection/:collectionId/async/jobs (202)
     */
    function enqueueAsyncJob(collectionId: string, params: EnqueueAsyncJobRequest): Promise<EnqueueAsyncJobResponse>;
    /**
     * Get job status by ID (may return 404 if completed/removed)
     * GET /admin/collection/:collectionId/async/jobs/:jobId
     */
    function getAsyncJobStatus(collectionId: string, jobId: number): Promise<Job>;
}
