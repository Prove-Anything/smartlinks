// src/types/jobs.ts

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

export interface ListJobsQuery {
  state?: JobStatus
  task?: string
  limit?: number
  offset?: number
  from?: string
  to?: string
}

export interface JobsPage {
  items: Job[]
  limit: number
  offset: number
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
