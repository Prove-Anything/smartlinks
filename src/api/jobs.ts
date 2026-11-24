// src/api/jobs.ts
// Background jobs: start one, follow it, and list a collection's jobs. One namespace (SDK 2 had two,
// `jobs` and `async`).
import { request, post } from "../http"
import { listQuery } from "../list"
import type { ListJobsQuery, Job, EnqueueAsyncJobRequest, EnqueueAsyncJobResponse } from "../types/jobs"
import type { ListResult } from "../types/list"

function enc(v: string) { return encodeURIComponent(v) }

export namespace jobs {
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
  export async function list(
    collectionId: string,
    query: ListJobsQuery = {}
  ): Promise<ListResult<Job>> {
    const path = `/admin/collection/${enc(collectionId)}/jobs${listQuery(query)}`
    return request<ListResult<Job>>(path)
  }

  /**
   * Get a single job
   * GET /admin/collection/:collectionId/jobs/:jobId
   */
  export async function get(
    collectionId: string,
    jobId: number
  ): Promise<Job> {
    const path = `/admin/collection/${enc(collectionId)}/jobs/${jobId}`
    return request<Job>(path)
  }

  /**
   * Start a background job for a collection.
   * POST /admin/collection/:collectionId/async/jobs (202)
   */
  export async function enqueue(
    collectionId: string,
    params: EnqueueAsyncJobRequest
  ): Promise<EnqueueAsyncJobResponse> {
    const path = `/admin/collection/${enc(collectionId)}/async/jobs`
    return post<EnqueueAsyncJobResponse>(path, params)
  }

  /**
   * How a job you started is getting on (may answer 404 once it has finished and been cleared away).
   * GET /admin/collection/:collectionId/async/jobs/:jobId
   */
  export async function status(
    collectionId: string,
    jobId: number
  ): Promise<Job> {
    const path = `/admin/collection/${enc(collectionId)}/async/jobs/${jobId}`
    return request<Job>(path)
  }
}
