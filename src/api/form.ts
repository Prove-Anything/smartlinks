import { request, post, put, del } from "../http";
import type { ListResult } from "../types/list";

export namespace form {
  /**
   * Get a single form by ID for a collection.
   * @param collectionId – The collection identifier
   * @param formId – The form identifier
   * @param admin – If true, use admin endpoint; otherwise, use public
   */
  export async function get(collectionId: string, formId: string, admin?: boolean): Promise<any> {
    const base = admin ? '/admin' : '/public';
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/form/${encodeURIComponent(formId)}`;
    return request<any>(path);
  }

  /**
   * List all forms for a collection. All of them come back in one answer: `nextCursor` is always null.
   * @param collectionId – The collection identifier
   * @param admin – If true, use admin endpoint; otherwise, use public
   * @returns Promise resolving to `{ items, nextCursor }`, where `items` are the forms
   *
   * @example
   * ```typescript
   * const { items: forms } = await form.list(collectionId, true)
   * ```
   */
  export async function list(collectionId: string, admin?: boolean): Promise<ListResult<any>> {
    const base = admin ? '/admin' : '/public';
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/form`;
    return request<ListResult<any>>(path);
  }

  /**
   * Create a new form for a collection (admin only).
   * @param collectionId – The collection identifier
   * @param data – The form data
   */
  export async function create(collectionId: string, data: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/form`;
    return post<any>(path, data);
  }

  /**
   * Update a form for a collection (admin only).
   * @param collectionId – The collection identifier
   * @param formId – The form identifier
   * @param data – The form data
   */
  export async function update(collectionId: string, formId: string, data: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/form/${encodeURIComponent(formId)}`;
    return put<any>(path, data);
  }

  /**
   * Delete a form for a collection (admin only).
   * @param collectionId – The collection identifier
   * @param formId – The form identifier
   */
  export async function remove(collectionId: string, formId: string): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/form/${encodeURIComponent(formId)}`;
    return del<void>(path);
  }
}
