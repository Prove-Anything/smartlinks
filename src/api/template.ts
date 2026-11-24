import { request, post, put, del as httpDel } from "../http"
import type {
  Template,
  TemplateInput,
  TemplateUpdate,
  TemplatePublic,
  TemplateRenderRequest,
  TemplateRenderResponse,
  TemplateRenderSourceRequest,
  TemplateRenderSourceResponse,
} from "../types"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

export namespace template {
  // Admin APIs
  /**
   * The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000).
   * Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one.
   *
   * @example
   * ```typescript
   * let page = await template.getAll('coll_123', { limit: 100 })
   * page.items // Template[]
   * while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor })
   * ```
   */
  export async function getAll(collectionId: string, options: ListOptions = {}): Promise<ListResult<Template>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template${listQuery({ limit: options.limit, cursor: options.cursor })}`
    return request<ListResult<Template>>(path)
  }

  export async function get(collectionId: string, templateId: string): Promise<Template> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`
    return request<Template>(path)
  }

  export async function create(collectionId: string, data: TemplateInput): Promise<Template> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template`
    return post<Template>(path, data)
  }

  export async function update(
    collectionId: string,
    templateId: string,
    data: TemplateUpdate
  ): Promise<Template> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`
    return put<Template>(path, data)
  }

  // Delete returns the (soft-deleted) Template per spec
  export async function del(collectionId: string, templateId: string): Promise<Template> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`
    return httpDel<Template>(path)
  }

  export async function uploadAsset(
    collectionId: string,
    templateId: string,
    file: File | Blob
  ): Promise<{ url: string }> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}/addFile`
    const form = new FormData()
    form.append("file", file)
    return post<{ url: string }>(path, form)
  }

  // Public APIs
  /**
   * The collection's templates that may be used publicly, 50 at a time unless you give a `limit`
   * (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the
   * last one.
   *
   * @example
   * ```typescript
   * const { items, nextCursor } = await template.getAllowed('coll_123', { limit: 100 })
   * items // TemplatePublic[]
   * ```
   */
  export async function getAllowed(collectionId: string, options: ListOptions = {}): Promise<ListResult<TemplatePublic>> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/template/getAllowed${listQuery({ limit: options.limit, cursor: options.cursor })}`
    return request<ListResult<TemplatePublic>>(path)
  }

  export async function getPublic(collectionId: string, templateId: string): Promise<TemplatePublic> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}`
    return request<TemplatePublic>(path)
  }

  export async function getGlobal(templateId: string): Promise<TemplatePublic> {
    const path = `/public/template/${encodeURIComponent(templateId)}`
    return request<TemplatePublic>(path)
  }

  /**
   * The global templates this collection may use, 50 at a time unless you give a `limit` (at most
   * 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one.
   *
   * @example
   * ```typescript
   * const { items, nextCursor } = await template.getAllowedGlobal('coll_123', { limit: 100 })
   * items // TemplatePublic[]
   * ```
   */
  export async function getAllowedGlobal(collectionId: string, options: ListOptions = {}): Promise<ListResult<TemplatePublic>> {
    const path = `/public/template/getAllowed/${encodeURIComponent(collectionId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`
    return request<ListResult<TemplatePublic>>(path)
  }

  // Render a template by ID (admin)
  export async function render(
    collectionId: string,
    templateId: string,
    body: TemplateRenderRequest
  ): Promise<TemplateRenderResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/${encodeURIComponent(templateId)}/render`
    return post<TemplateRenderResponse>(path, body)
  }

  // Render from source (admin)
  export async function renderSource(
    collectionId: string,
    body: TemplateRenderSourceRequest
  ): Promise<TemplateRenderSourceResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template/render/source`
    return post<TemplateRenderSourceResponse>(path, body)
  }
}
