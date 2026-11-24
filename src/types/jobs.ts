// src/types/jobs.ts
import type { ListOptions } from './list'

export type JobStatus = 'queued' | 'running' | 'errored'

export interface Job {
  id: number
  task: string
  payload: any
  priority: number
  runAt: string | null
  createdAt: string
  attempts: number
  lastError: string | null
  lockedAt: string | null
  key: string | null
  queueName: string | null
  status: JobStatus
}

/** Options for jobs.list(): `limit` and `cursor` page the list. */
export interface ListJobsQuery extends ListOptions {
  state?: JobStatus
  task?: string
  from?: string
  to?: string
}

export interface EnqueueAsyncJobRequest {
  task: string
  payload?: Record<string, any>
  runAt?: string | Date
  priority?: number
  key?: string
  queueName?: string
}

export interface EnqueueAsyncJobResponse {
  id: number
  task: string
  runAt?: string
  key?: string
}
