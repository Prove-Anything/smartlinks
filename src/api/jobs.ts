// src/api/jobs.ts
import { request } from "../http"
import type { JobsPage, ListJobsQuery, Job } from "../types/jobs"

function enc(v: string) { return encodeURIComponent(v) }
function encodeQuery(params: Record<string, any> = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export namespace jobs {
  /**
   * List visible jobs for a collection
   * GET /admin/collection/:collectionId/jobs
   */
  export async function listJobs(
    collectionId: string,
    query: ListJobsQuery = {}
  ): Promise<JobsPage> {
    const qs = encodeQuery(query as any)
    const path = `/admin/collection/${enc(collectionId)}/jobs${qs}`
    return request<JobsPage>(path)
  }

  /**
   * Get a single job
   * GET /admin/collection/:collectionId/jobs/:jobId
   */
  export async function getJob(
    collectionId: string,
    jobId: number
  ): Promise<Job> {
    const path = `/admin/collection/${enc(collectionId)}/jobs/${jobId}`
    return request<Job>(path)
  }
}
