import { request, post, put, del } from "../http"

export namespace crate {
  /**
   * Get a single crate by ID for a collection (admin only).
   */
  export async function get(collectionId: string, crateId: string): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`
    return request<any>(path)
  }

  /**
   * List all crates for a collection (admin only).
   */
  export async function list(collectionId: string): Promise<any[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate`
    return request<any[]>(path)
  }

  /**
   * Create a new crate for a collection (admin only).
   */
  export async function create(collectionId: string, data: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate`
    return post<any>(path, data)
  }

  /**
   * Update a crate for a collection (admin only).
   */
  export async function update(collectionId: string, crateId: string, data: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`
    return put<any>(path, data)
  }

  /**
   * Delete a crate for a collection (admin only).
   */
  export async function remove(collectionId: string, crateId: string): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/crate/${encodeURIComponent(crateId)}`
    return del<void>(path)
  }
}