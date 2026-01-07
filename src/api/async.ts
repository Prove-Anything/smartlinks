// src/api/async.ts
import { request, post } from "../http"
import type {
  EnqueueAsyncJobRequest,
  EnqueueAsyncJobResponse,
  Job,
} from "../types/jobs"

function enc(v: string) { return encodeURIComponent(v) }

export namespace async {
  /**
   * Enqueue a background job for a collection
   * POST /admin/collection/:collectionId/async/jobs (202)
   */
  export async function enqueueAsyncJob(
    collectionId: string,
    params: EnqueueAsyncJobRequest
  ): Promise<EnqueueAsyncJobResponse> {
    const path = `/admin/collection/${enc(collectionId)}/async/jobs`
    return post<EnqueueAsyncJobResponse>(path, params)
  }

  /**
   * Get job status by ID (may return 404 if completed/removed)
   * GET /admin/collection/:collectionId/async/jobs/:jobId
   */
  export async function getAsyncJobStatus(
    collectionId: string,
    jobId: number
  ): Promise<Job> {
    const path = `/admin/collection/${enc(collectionId)}/async/jobs/${jobId}`
    return request<Job>(path)
  }
}
