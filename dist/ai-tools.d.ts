import type { AiToolName, AiToolCapability } from './types/ai.js';
export interface BuiltinAiToolDescriptor {
    /** Canonical tool name, e.g. 'web.search'. */
    name: AiToolName;
    /** One-line summary of what the tool does (mirrors the server registry). */
    description: string;
    /** Capability tags the tool requires. */
    capabilities: AiToolCapability[];
    /** Grouping for tool-picker UIs. */
    group: 'web' | 'vision' | 'image' | 'media' | 'net' | 'text';
}
/** Stable name constants — reference tools without stringly-typed literals. */
export declare const AI_TOOL_NAMES: {
    readonly WEB_FETCH_PAGE: "web.fetchPage";
    readonly WEB_EXTRACT_SCHEMA: "web.extractSchema";
    readonly WEB_SCREENSHOT: "web.screenshot";
    readonly WEB_SEARCH: "web.search";
    readonly BRAND_ASSETS: "brand.assets";
    readonly DOCUMENT_READ: "document.read";
    readonly DATA_EXTRACT: "data.extract";
    readonly IMAGE_DESCRIBE: "image.describe";
    readonly IMAGE_GENERATE: "image.generate";
    readonly IMAGE_FROM_REFERENCE: "image.fromReference";
    readonly IMAGE_SEARCH_STOCK: "image.searchStock";
    readonly IMAGE_TRANSFORM: "image.transform";
    readonly PDF_CREATE: "pdf.create";
    readonly PDF_FILL: "pdf.fill";
    readonly PDF_MERGE: "pdf.merge";
    readonly HTTP_REQUEST: "http.request";
    readonly TRANSLATE: "translate";
};
/** The curated core toolset shipped with the SDK. */
export declare const BUILTIN_AI_TOOLS: BuiltinAiToolDescriptor[];
/** Look up a core tool descriptor by name. */
export declare function getBuiltinAiTool(name: AiToolName): BuiltinAiToolDescriptor | undefined;
