import type { Template, TemplateInput, TemplateUpdate, TemplatePublic, TemplateRenderRequest, TemplateRenderResponse, TemplateRenderSourceRequest, TemplateRenderSourceResponse } from "../types/index.js";
import type { ListResult } from "../types/list.js";
export declare namespace template {
    /**
     * Every template in the collection (admin), in one answer: `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await template.getAll('coll_123')
     * items // Template[]
     * ```
     */
    function getAll(collectionId: string): Promise<ListResult<Template>>;
    function get(collectionId: string, templateId: string): Promise<Template>;
    function create(collectionId: string, data: TemplateInput): Promise<Template>;
    function update(collectionId: string, templateId: string, data: TemplateUpdate): Promise<Template>;
    function del(collectionId: string, templateId: string): Promise<Template>;
    function uploadAsset(collectionId: string, templateId: string, file: File | Blob): Promise<{
        url: string;
    }>;
    /**
     * The collection's templates that may be used publicly, in one answer: `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await template.getAllowed('coll_123')
     * items // TemplatePublic[]
     * ```
     */
    function getAllowed(collectionId: string): Promise<ListResult<TemplatePublic>>;
    function getPublic(collectionId: string, templateId: string): Promise<TemplatePublic>;
    function getGlobal(templateId: string): Promise<TemplatePublic>;
    /**
     * The global templates this collection may use, in one answer: `nextCursor` is always null.
     *
     * @example
     * ```typescript
     * const { items } = await template.getAllowedGlobal('coll_123')
     * items // TemplatePublic[]
     * ```
     */
    function getAllowedGlobal(collectionId: string): Promise<ListResult<TemplatePublic>>;
    function render(collectionId: string, templateId: string, body: TemplateRenderRequest): Promise<TemplateRenderResponse>;
    function renderSource(collectionId: string, body: TemplateRenderSourceRequest): Promise<TemplateRenderSourceResponse>;
}
