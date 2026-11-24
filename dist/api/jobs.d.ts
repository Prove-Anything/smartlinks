import type { ListJobsQuery, Job, EnqueueAsyncJobRequest, EnqueueAsyncJobResponse } from "../types/jobs.js";
import type { ListResult } from "../types/list.js";
export declare namespace jobs {
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
    function list(collectionId: string, query?: ListJobsQuery): Promise<ListResult<Job>>;
    /**
     * Get a single job
     * GET /admin/collection/:collectionId/jobs/:jobId
     */
    function get(collectionId: string, jobId: number): Promise<Job>;
    /**
     * Start a background job for a collection.
     * POST /admin/collection/:collectionId/async/jobs (202)
     */
    function enqueue(collectionId: string, params: EnqueueAsyncJobRequest): Promise<EnqueueAsyncJobResponse>;
    /**
     * How a job you started is getting on (may answer 404 once it has finished and been cleared away).
     * GET /admin/collection/:collectionId/async/jobs/:jobId
     */
    function status(collectionId: string, jobId: number): Promise<Job>;
}
