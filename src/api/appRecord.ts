// src/api/appRecord.ts
import { request, post, put, del } from "../http"

export namespace appRecord {
  // Get app record (admin only)
  export async function get(collectionId: string, appId: string): Promise<any> {
    const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`
    return request<any>(path)
  }

  // Create app record (admin only)
  export async function create(collectionId: string, appId: string, data: any): Promise<any> {
    const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`
    return post<any>(path, data)
  }

  // Update app record (admin only)
  export async function update(collectionId: string, appId: string, data: any): Promise<any> {
    const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`
    return put<any>(path, data)
  }

  // Delete app record (admin only)
  export async function remove(collectionId: string, appId: string): Promise<void> {
    const path = `/api/v1/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`
    return del<void>(path)
  }
}
