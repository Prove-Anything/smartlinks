import type { Template, TemplateInput, TemplateUpdate, TemplatePublic, TemplateRenderRequest, TemplateRenderResponse, TemplateRenderSourceRequest, TemplateRenderSourceResponse } from "../types/index.js";
import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace template {
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
    function getAll(collectionId: string, options?: ListOptions): Promise<ListResult<Template>>;
    function get(collectionId: string, templateId: string): Promise<Template>;
    function create(collectionId: string, data: TemplateInput): Promise<Template>;
    function update(collectionId: string, templateId: string, data: TemplateUpdate): Promise<Template>;
    function del(collectionId: string, templateId: string): Promise<Template>;
    function uploadAsset(collectionId: string, templateId: string, file: File | Blob): Promise<{
        url: string;
    }>;
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
    function getAllowed(collectionId: string, options?: ListOptions): Promise<ListResult<TemplatePublic>>;
    function getPublic(collectionId: string, templateId: string): Promise<TemplatePublic>;
    function getGlobal(templateId: string): Promise<TemplatePublic>;
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
    function getAllowedGlobal(collectionId: string, options?: ListOptions): Promise<ListResult<TemplatePublic>>;
    function render(collectionId: string, templateId: string, body: TemplateRenderRequest): Promise<TemplateRenderResponse>;
    function renderSource(collectionId: string, body: TemplateRenderSourceRequest): Promise<TemplateRenderSourceResponse>;
}
