// src/api/jobs.ts
import { request } from "../http"
import type { ListJobsQuery, Job } from "../types/jobs"
import type { ListResult } from "../types/list"

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
   *
   * @example
   * ```typescript
   * let page = await jobs.listJobs('coll_123', { state: 'errored', limit: 50 })
   * while (page.nextCursor) page = await jobs.listJobs('coll_123', { state: 'errored', limit: 50, cursor: page.nextCursor })
   * ```
   */
  export async function listJobs(
    collectionId: string,
    query: ListJobsQuery = {}
  ): Promise<ListResult<Job>> {
    const qs = encodeQuery(query as any)
    const path = `/admin/collection/${enc(collectionId)}/jobs${qs}`
    return request<ListResult<Job>>(path)
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
