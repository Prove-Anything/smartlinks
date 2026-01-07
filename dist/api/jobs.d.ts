import type { JobsPage, ListJobsQuery, Job } from "../types/jobs";
export declare namespace jobs {
    /**
     * List visible jobs for a collection
     * GET /admin/collection/:collectionId/jobs
     */
    function listJobs(collectionId: string, query?: ListJobsQuery): Promise<JobsPage>;
    /**
     * Get a single job
     * GET /admin/collection/:collectionId/jobs/:jobId
     */
    function getJob(collectionId: string, jobId: number): Promise<Job>;
}
