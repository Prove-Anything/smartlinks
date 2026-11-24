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
import type { ListResult } from "../types/list"

export namespace template {
  // Admin APIs
  /**
   * Every template in the collection (admin), in one answer: `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await template.getAll('coll_123')
   * items // Template[]
   * ```
   */
  export async function getAll(collectionId: string): Promise<ListResult<Template>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/template`
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
   * The collection's templates that may be used publicly, in one answer: `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await template.getAllowed('coll_123')
   * items // TemplatePublic[]
   * ```
   */
  export async function getAllowed(collectionId: string): Promise<ListResult<TemplatePublic>> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/template/getAllowed`
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
   * The global templates this collection may use, in one answer: `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await template.getAllowedGlobal('coll_123')
   * items // TemplatePublic[]
   * ```
   */
  export async function getAllowedGlobal(collectionId: string): Promise<ListResult<TemplatePublic>> {
    const path = `/public/template/getAllowed/${encodeURIComponent(collectionId)}`
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
