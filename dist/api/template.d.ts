import type { Template, TemplateInput, TemplateUpdate, TemplatePublic, TemplateRenderRequest, TemplateRenderResponse, TemplateRenderSourceRequest, TemplateRenderSourceResponse } from "../types";
export declare namespace template {
    function getAll(collectionId: string): Promise<Template[]>;
    function get(collectionId: string, templateId: string): Promise<Template>;
    function create(collectionId: string, data: TemplateInput): Promise<Template>;
    function update(collectionId: string, templateId: string, data: TemplateUpdate): Promise<Template>;
    function del(collectionId: string, templateId: string): Promise<Template>;
    function uploadAsset(collectionId: string, templateId: string, file: File | Blob): Promise<{
        url: string;
    }>;
    function getAllowed(collectionId: string): Promise<TemplatePublic[]>;
    function getPublic(collectionId: string, templateId: string): Promise<TemplatePublic>;
    function getGlobal(templateId: string): Promise<TemplatePublic>;
    function getAllowedGlobal(collectionId: string): Promise<TemplatePublic[]>;
    function render(collectionId: string, templateId: string, body: TemplateRenderRequest): Promise<TemplateRenderResponse>;
    function renderSource(collectionId: string, body: TemplateRenderSourceRequest): Promise<TemplateRenderSourceResponse>;
}
