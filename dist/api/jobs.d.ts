import type { ListJobsQuery, Job } from "../types/jobs.js";
import type { ListResult } from "../types/list.js";
export declare namespace jobs {
    /**
     * List visible jobs for a collection
     * GET /admin/collection/:collectionId/jobs
     *
     * @example
     * ```typescript
     * let page = await jobs.listJobs('coll_123', { state: 'errored', limit: 50 })
     * while (page.nextCursor) page = await jobs.listJobs('coll_123', { state: 'errored', limit: 50, cursor: page.nextCursor })
     * ```
     */
    function listJobs(collectionId: string, query?: ListJobsQuery): Promise<ListResult<Job>>;
    /**
     * Get a single job
     * GET /admin/collection/:collectionId/jobs/:jobId
     */
    function getJob(collectionId: string, jobId: number): Promise<Job>;
}
