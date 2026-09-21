// src/ai-tools.ts
//
// The core built-in AI tools, as a typed, design-time catalog. Apps learn the core
// tools from HERE (autocomplete + docs), not by probing an endpoint — so they know
// what exists and how to call it at build time. The server-side registry
// (GET /ai/catalog) remains the runtime source of truth and is where future
// app-contributed tools appear; this list is the curated, tested core set that ships
// with the SDK. Adding a core tool is a deliberate change here plus a version bump.
/** Stable name constants — reference tools without stringly-typed literals. */
export const AI_TOOL_NAMES = {
    WEB_FETCH_PAGE: 'web.fetchPage',
    WEB_EXTRACT_SCHEMA: 'web.extractSchema',
    WEB_SCREENSHOT: 'web.screenshot',
    WEB_SEARCH: 'web.search',
    BRAND_ASSETS: 'brand.assets',
    DOCUMENT_READ: 'document.read',
    DATA_EXTRACT: 'data.extract',
    IMAGE_DESCRIBE: 'image.describe',
    IMAGE_GENERATE: 'image.generate',
    IMAGE_FROM_REFERENCE: 'image.fromReference',
    IMAGE_SEARCH_STOCK: 'image.searchStock',
    IMAGE_TRANSFORM: 'image.transform',
    PDF_CREATE: 'pdf.create',
    PDF_FILL: 'pdf.fill',
    PDF_MERGE: 'pdf.merge',
    HTTP_REQUEST: 'http.request',
    TRANSLATE: 'translate',
};
/** The curated core toolset shipped with the SDK. */
export const BUILTIN_AI_TOOLS = [
    { name: 'web.search', group: 'web', capabilities: ['web:read'],
        description: 'Search the live web; returns candidate results (url/title/description) to then read.' },
    { name: 'web.fetchPage', group: 'web', capabilities: ['web:read'],
        description: 'Fetch a web page and return clean markdown, metadata, and any schema.org JSON-LD.' },
    { name: 'web.extractSchema', group: 'web', capabilities: ['web:read'],
        description: 'Fetch a URL and return only its schema.org structured data of a given @type (deterministic).' },
    { name: 'document.read', group: 'web', capabilities: ['web:read'],
        description: 'Read a document at a URL — PDF, deck, doc, or article — into clean markdown text.' },
    { name: 'data.extract', group: 'web', capabilities: ['web:read'],
        description: 'Extract typed JSON from a page given a schema and/or prompt — turn a page into UI data.' },
    { name: 'brand.assets', group: 'web', capabilities: ['web:read'],
        description: "Extract a site's brand elements — logo, colours, design — plus page metadata." },
    { name: 'web.screenshot', group: 'web', capabilities: ['web:read'],
        description: 'Capture a page screenshot; returns a hosted image URL you can read with image.describe.' },
    { name: 'image.describe', group: 'vision', capabilities: ['ai:vision'],
        description: 'Describe an image or read its text (vision / image-to-text).' },
    { name: 'image.generate', group: 'image', capabilities: ['ai:image'],
        description: 'Generate a new image from a text prompt; returns a hosted image URL.' },
    { name: 'image.fromReference', group: 'image', capabilities: ['ai:image'],
        description: 'Generate an image guided by reference image(s) plus a prompt (image-to-image).' },
    { name: 'image.searchStock', group: 'image', capabilities: ['ai:image'],
        description: 'Search stock photography (Unsplash) for real photos matching a query.' },
    { name: 'image.transform', group: 'media', capabilities: ['media:image'],
        description: 'Transform an image: resize/crop/rotate/flip/grayscale/tint/format-convert/compress → hosted URL.' },
    { name: 'pdf.create', group: 'media', capabilities: ['media:pdf'],
        description: 'Render HTML to a PDF and return a hosted URL.' },
    { name: 'pdf.fill', group: 'media', capabilities: ['media:pdf'],
        description: 'Fill an AcroForm PDF\'s fields from a { field: value } map → hosted URL.' },
    { name: 'pdf.merge', group: 'media', capabilities: ['media:pdf'],
        description: 'Merge several PDFs (by URL) into one → hosted URL.' },
    { name: 'http.request', group: 'net', capabilities: ['net:http'],
        description: 'SSRF-guarded outbound HTTP(S) request to a public URL; returns status/headers/body.' },
    { name: 'translate', group: 'text', capabilities: ['ai:text'],
        description: 'Translate text into one or more target languages (generic, model-based).' },
];
/** Look up a core tool descriptor by name. */
export function getBuiltinAiTool(name) {
    return BUILTIN_AI_TOOLS.find((t) => t.name === name);
}
