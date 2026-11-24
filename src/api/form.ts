import { request, post, put, del } from "../http";
import type { ListResult, ListOptions } from "../types/list";
import { listQuery } from "../list";

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
   * List the forms for a collection, 50 at a time unless you give a `limit` (at most 1000). Pass
   * `nextCursor` back as `cursor` for the next page; `null` means that was the last one.
   * @param collectionId – The collection identifier
   * @param admin – If true, use admin endpoint; otherwise, use public
   * @param options – Paging: `limit` and `cursor`
   * @returns Promise resolving to `{ items, nextCursor, count }`, where `items` are the forms
   *
   * @example
   * ```typescript
   * let page = await form.list(collectionId, true, { limit: 100 })
   * while (page.nextCursor) page = await form.list(collectionId, true, { limit: 100, cursor: page.nextCursor })
   * ```
   */
  export async function list(collectionId: string, admin?: boolean, options: ListOptions = {}): Promise<ListResult<any>> {
    const base = admin ? '/admin' : '/public';
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/form${listQuery({ limit: options.limit, cursor: options.cursor })}`;
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
