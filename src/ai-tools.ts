// src/ai-tools.ts
//
// The core built-in AI tools, as a typed, design-time catalog. Apps learn the core
// tools from HERE (autocomplete + docs), not by probing an endpoint — so they know
// what exists and how to call it at build time. The server-side registry
// (GET /ai/catalog) remains the runtime source of truth and is where future
// app-contributed tools appear; this list is the curated, tested core set that ships
// with the SDK. Adding a core tool is a deliberate change here plus a version bump.

import type { AiToolName, AiToolCapability } from './types/ai'

export interface BuiltinAiToolDescriptor {
  /** Canonical tool name, e.g. 'web.search'. */
  name: AiToolName
  /** One-line summary of what the tool does (mirrors the server registry). */
  description: string
  /** Capability tags the tool requires. */
  capabilities: AiToolCapability[]
  /** Grouping for tool-picker UIs. */
  group: 'web' | 'vision' | 'image' | 'media' | 'net' | 'text'
}

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
  PDF_INSPECT: 'pdf.inspect',
  PDF_RENDER: 'pdf.render',
  PDF_EXTRACT: 'pdf.extract',
  PDF_DECODE_BARCODES: 'pdf.decodeBarcodes',
  PDF_INSPECT_GRAPHICS: 'pdf.inspectGraphics',
  HTTP_REQUEST: 'http.request',
  TRANSLATE: 'translate',
} as const satisfies Record<string, AiToolName>

/** The curated core toolset shipped with the SDK. */
export const BUILTIN_AI_TOOLS: BuiltinAiToolDescriptor[] = [
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
  { name: 'pdf.inspect', group: 'media', capabilities: ['web:read'],
    description: 'Cheaply introspect a PDF before any AI call: page count/sizes, whether each page has an extractable text layer, whether a raster image is present, and a routing recommendation (text-native → cheap text pass; curve-only/raster → vision/OCR). Deterministic, no AI.' },
  { name: 'pdf.render', group: 'media', capabilities: ['web:read'],
    description: 'Rasterize a single PDF page to a PNG at a controllable DPI (e.g. 300 for small print) and return a hosted image URL — feed to a vision call or screenshot a page.' },
  { name: 'pdf.extract', group: 'media', capabilities: ['web:read', 'ai:vision'],
    description: 'Extract typed JSON from a PDF in one call given a schema and/or prompt. Auto-routes: text-layer pages use cheap text extraction; curve-only/raster pages are rendered and read with vision. Optional per-field confidence/source (includeConfidence) and bounding boxes (includeBoxes).' },
  { name: 'pdf.decodeBarcodes', group: 'media', capabilities: ['web:read'],
    description: 'Deterministically decode 1D/2D barcodes (EAN/UPC/QR/Code128/DataMatrix/…) on a PDF page by rasterizing and running a WASM decoder — reliable barcode/QR values where vision hallucinates. Returns value, symbology, page, bbox, confidence. No AI.' },
  { name: 'pdf.inspectGraphics', group: 'media', capabilities: ['web:read'],
    description: 'Prepress structural inspection: per-page vector-path/image/outlined-text counts + colour spaces used, plus document-level named SPOT colours (e.g. "PANTONE 871 C"). Answers whether spot/foil plates survived. Deterministic, no AI.' },
  { name: 'http.request', group: 'net', capabilities: ['net:http'],
    description: 'SSRF-guarded outbound HTTP(S) request to a public URL; returns status/headers/body.' },
  { name: 'translate', group: 'text', capabilities: ['ai:text'],
    description: 'Translate text into one or more target languages (generic, model-based).' },
]

/** Look up a core tool descriptor by name. */
export function getBuiltinAiTool(name: AiToolName): BuiltinAiToolDescriptor | undefined {
  return BUILTIN_AI_TOOLS.find((t) => t.name === name)
}
