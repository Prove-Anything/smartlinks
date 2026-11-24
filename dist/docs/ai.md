# SmartLinks AI

Build AI-powered SmartLinks experiences with a practical SDK guide for responses, chat, product assistants, streaming, voice, and real-world integration patterns.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Responses API](#responses-api)
- [Chat Completions](#chat-completions)
- [Knowledge: answers from your own content](#knowledge-answers-from-your-own-content)
- [Voice Integration](#voice-integration)
- [Podcast Generation](#podcast-generation)
- [Types & API reference](#types--api-reference)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)
- [Providing Content to the AI Assistant](#providing-content-to-the-ai-assistant)

---

## Overview

This guide is written for SDK users building real products, not backend operators. It focuses on the public SDK surface, recommended starting points, and examples you can adapt directly.

### Start with the path that matches your job

| If you want to... | Start here |
|---|---|
| Build a new AI workflow | Use [Responses API](#responses-api) |
| Add compatibility with existing chat clients | Use [Chat Completions](#chat-completions) |
| Answer questions from manuals, help articles or product pages | Use [Knowledge: answers from your own content](#knowledge-answers-from-your-own-content) |
| Add spoken input/output | Use [Voice Integration](#voice-integration) |
| Add progressive rendering | Use [Streaming Responses](#streaming-responses) or [Streaming Chat](#streaming-chat) |

> **Which API for which job:**
> - **`ai.chat.responses`**: the default for new work. Structured input, tool use, multi-agent, streaming. You keep any conversation history yourself and send it with each call.
> - **`ai.chat.completions`**: OpenAI-compatible (`messages[]`). Use it only to drop into existing OpenAI-style code.
> - **`knowledge.publicSearch`**: finds the passages in your own content (manuals, help articles) that answer a question. Works from a website, Portal or Hub without an API key.
> - **`ai.agent.run`**: an admin-side agent loop that can call built-in tools such as `knowledge.search` and write an answer from what it finds.
>
> Responses and Completions are generation APIs; both take history, neither stores it for you.

### Recommended starting points

- New AI features: start with `ai.chat.responses.create(...)`
- Product/manual Q&A: start with `knowledge.publicSearch(...)`; for an AI-written answer, run `ai.agent.run(...)` with the `knowledge.search` tool on your own server
- Existing OpenAI-style clients: use `ai.chat.completions.create(...)`
- Real-time voice: use `ai.live.start(...)` or your provider's live client

SmartLinks AI provides five main capabilities:

1. **Responses API** - Preferred API for agentic workflows, multimodal inputs, and tool-driven responses
2. **Chat Completions** - OpenAI-compatible text generation with streaming and tool calling
3. **Knowledge search** - Find the right passage in your manuals and help content, for people and for AI agents
4. **Voice Integration** - Voice-to-text and text-to-voice for hands-free interaction
5. **Podcast Generation** - NotebookLM-style multi-voice conversational podcasts from documents

### Key Features

- ✅ Full TypeScript support with type safety
- ✅ Streaming responses with async iterators
- ✅ Automatic rate limit handling
- ✅ Voice input/output helpers
- ✅ Tool/function calling support
- ✅ OpenAI-style Responses API support
- ✅ Knowledge search over your own content (meaning and keywords together)

---

## Quick Start

If you're only reading one section, start here. The three snippets below cover the most common public SDK use cases.

### 1. Generate a response

```typescript
import { initializeApi, ai } from '@proveanything/smartlinks';

// Initialize the SDK
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: process.env.SMARTLINKS_API_KEY // Required for admin endpoints
});

// Preferred: create a response
const response = await ai.chat.responses.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  input: 'Summarize the key safety steps for descaling a coffee maker.'
});

console.log(response.output_text);
```

### 2. Answer a product question from your manuals

```typescript
import { initializeApi, knowledge } from '@proveanything/smartlinks';

initializeApi({ baseURL: 'https://smartlinks.app/api/v1' });

const { items: results } = await knowledge.publicSearch('my-collection', {
  q: 'How do I descale this machine?',
  filters: { productId: 'coffee-maker-deluxe' },
  limit: 3
});

for (const r of results) {
  console.log(r.title, r.heading, r.url);
  console.log(r.snippet);
}
```

This needs a knowledge set with content in it; see [Knowledge: answers from your own content](#knowledge-answers-from-your-own-content).

### 3. Stream output into your UI

```typescript
const stream = await ai.chat.responses.create('my-collection', {
  input: 'Write a launch checklist for a new product page.',
  stream: true
});

for await (const event of stream) {
  if (event.type === 'response.output_text.delta') {
    updateUi(event.delta);
  }
}
```

---

## Authentication

### Admin Endpoints

Admin endpoints require an API key passed during initialization:

```typescript
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: process.env.SMARTLINKS_API_KEY
});
```

The SDK automatically includes the API key in the `Authorization: Bearer <token>` header.

### Public Endpoints

Public endpoints don't require an API key. Anonymous callers see public content only; a signed-in person (Portal or Hub sign-in) also sees content meant for customers:

```typescript
// No API key needed
const { items: results } = await knowledge.publicSearch('my-collection', {
  q: 'How do I clean this?'
});
```

Public AI calls such as `ai.public.agentRun` are rate-limited per user (see [Rate Limiting](#rate-limiting)).

---

## Responses API

The Responses API is the recommended starting point for new integrations. Use it when you want a single endpoint for structured input, tool use, and streaming output.

### Basic Response

```typescript
const response = await ai.chat.responses.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  input: 'Write a friendly two-sentence welcome for a product assistant.'
});

console.log(response.output_text);
```

### Multimessage Input

```typescript
const response = await ai.chat.responses.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  input: [
    {
      role: 'system',
      content: [
        { type: 'input_text', text: 'You are a concise support assistant.' }
      ]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: 'Give me three troubleshooting steps for a grinder that will not start.' }
      ]
    }
  ]
});

console.log(response.output_text);
```

### Streaming Responses

When you pass `stream: true`, the SDK returns an `AsyncIterable` of SSE events instead of a final JSON object. You do not need to parse raw SSE frames yourself — just iterate with `for await...of`.

```typescript
const result = await ai.chat.responses.create('my-collection', {
  input: 'Summarize the manual',
  stream: true
});

for await (const event of result) {
  if (event.type === 'response.output_text.delta') {
    process.stdout.write(event.delta);
  }
}
```

If you omit `stream: true`, the same method returns the final `ResponsesResult` object instead.

```typescript
const stream = await ai.chat.responses.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  input: 'Explain how to descale an espresso machine step by step.',
  stream: true
});

for await (const event of stream) {
  if (event.type === 'response.output_text.delta') {
    process.stdout.write(event.delta);
  }
}
```

### Tool Calling

```typescript
const response = await ai.chat.responses.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  input: 'What is the weather in Paris?',
  tools: [
    {
      type: 'function',
      name: 'get_weather',
      description: 'Get the current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string' }
        },
        required: ['location']
      }
    }
  ]
});

console.log(response.output);
```

### Server-side tools (built-in agent loop)

The example above is **client-relayed** tool calling: you define the tools, the model returns
`tool_call` requests, and *your app* executes them and sends results back. For the common tools —
reading and searching the web, vision, reading documents, generating images — the platform ships a
curated, tested **built-in toolset it runs itself**. Opt in with `server_tools` and the server
executes each tool and feeds the result back automatically, looping until the model has its answer.
You get one final response; no relay code.

```typescript
// Enable the whole built-in toolset:
const res = await ai.chat.responses.create('my-collection', {
  model: 'balanced',
  input: 'Research acme.com and summarise what they sell, with their brand colours.',
  server_tools: true
});
console.log(res.output_text);
console.log(res._agent.toolResults); // trace: which tools ran, with what result
```

Scope it to specific tools (recommended — smaller blast radius, faster), by name or capability:

```typescript
import { AI_TOOL_NAMES } from '@proveanything/smartlinks';

const res = await ai.chat.responses.create('my-collection', {
  input: 'Find the current price of this product and return it as JSON.',
  server_tools: [AI_TOOL_NAMES.WEB_SEARCH, AI_TOOL_NAMES.DATA_EXTRACT],
  // or: allowCapabilities: ['web:read'],   exclude: ['image.generate'],
  maxSteps: 6 // cap model round-trips (1–12, default 8)
});
```

**Streaming** surfaces tool progress as it happens — ideal for a "thinking…" UI. You get
`agent.tool_call` / `agent.tool_result` events, then a final `response.completed`:

```typescript
const stream = await ai.chat.responses.create('my-collection', {
  input: 'Research acme.com', server_tools: true, stream: true
});
for await (const ev of stream) {
  if (ev.type === 'agent.tool_call')   showStep(`Running ${ev.name}…`);
  if (ev.type === 'agent.tool_result') showStep(`${ev.name} done`);
  if (ev.type === 'response.completed') render(ev.response.output_text);
}
```

`server_tools` can't be combined with `previous_response_id`/`conversation` yet — pass prior turns
in `input`.

#### Built-in tools

| Tool | Does |
|------|------|
| `web.search` | Live web search → candidate results (url/title/description). |
| `web.fetchPage` | Fetch a page → clean markdown + metadata + schema.org JSON-LD. |
| `web.extractSchema` | Return only a page's schema.org data of a given `@type` (deterministic). |
| `document.read` | Read a document at a URL — **PDF, deck, doc**, or article — into markdown. |
| `data.extract` | Page + JSON-schema/prompt → **typed JSON** (turn a page into UI data). |
| `brand.assets` | Extract a site's logo, colours, and design. |
| `web.screenshot` | Screenshot a page → hosted image URL (feed to `image.describe`). |
| `image.describe` | Vision: describe an image / read its text. |
| `image.generate` | Generate an image from a prompt → hosted URL. |
| `image.fromReference` | Image-to-image: generate guided by reference image(s). |
| `image.searchStock` | Search real stock photos (Unsplash). |
| `image.transform` | Resize / crop / rotate / grayscale / format-convert / compress → hosted URL. |
| `pdf.create` | Render HTML (or one fragment per page) → PDF, 1:1: exact `width`/`height`/`unit` for labels, `pages[]` for many pages in one render, no scripts, only SmartLinks/Google Fonts/data: resources. `return`: `url` (public), `signedUrl` (expiring), `base64`. Cached by input. |
| `pdf.fill` | Fill an AcroForm PDF's fields (`{ field: value }`) → hosted URL. |
| `pdf.merge` | Merge several PDFs into one, in order → hosted URL. |
| `pdf.inspect` | Cheap, no-AI introspection: page count/sizes, which pages have a real text layer, raster present, and a routing hint (`text` vs `vision`). |
| `pdf.render` | Rasterize one page — or just a region (`clip: { x0, y0, x1, y1 }`, 0–1 from top-left) — to a PNG at a chosen DPI → hosted image URL (permanent). Max 40 MP per call; larger requests return `code: "too_large"` + `suggestedDpi`. |
| `image.ocr` | **Deterministic OCR** (Google Vision, no generative model): exact characters with per-word `confidence` (0–1) and pixel `bbox`, plus lines with spacing as printed. Input: `imageUrl`, or a PDF `url` + `page` + `dpi` + optional `clip`. Optional `languages` hints. Use for small print and text outlined to curves. |
| `pdf.extract` | PDF → typed JSON in one call (schema and/or prompt). Auto-routes text vs vision. Optional per-field `confidence`/`source` (`includeConfidence`) and `bbox` (`includeBoxes`) in `fieldsMeta`. |
| `pdf.decodeBarcodes` | Deterministically decode barcodes/QR on a page (WASM, no AI) → value + symbology + page + bbox + confidence. Use this for barcode digits, never vision. |
| `pdf.inspectGraphics` | Prepress inspection: per-page path/image/outlined-text counts + colour spaces, plus named SPOT colours (e.g. "PANTONE 871 C"). No AI. |
| `pdf.edit` | Edit an existing PDF: replace **live** text (glyph-exact removal, neighbours never move; original font when it has the glyphs, else an embedded fallback; CMYK/spot colour kept; matches may span lines), add text / images in boxes (`colorSpace: "cmyk"` converts images for print). Per-item `results` with `verified`. |
| `pdf.preflight` | Prepress preflight, no changes: fonts, RGB/Lab, TrimBox/BleedBox + bleed, effective image dpi, transparency, white overprint, annotations, hidden layers, output intent. No AI. |
| `pdf.printReady` | Text outlined to curves, RGB→CMYK with a press profile (spot colours kept), comments removed, layers merged as chosen, mark PDF/X-1a or PDF/X-4 with the output intent embedded, then preflight the result → `{ url, report }`. Options for grey, spot conversion, downsampling, pages, crop marks and more (below). |
| `http.request` | SSRF-guarded outbound HTTP(S) to a public URL (call a REST API). |
| `translate` | Translate text into one or more languages (generic, model-based). |

**Working with PDFs.** The PDF tools split into *read/analyse* and *produce*:

- **Read a whole PDF as text** → `document.read` (Firecrawl; good for prose/decks).
- **Turn a PDF into structured fields** → `pdf.extract` (give it a JSON schema and/or a prompt; it
  returns typed JSON). It routes itself, but you can drive the route yourself: call `pdf.inspect`
  first (deterministic, no AI) to see whether each page has a real text layer, then `pdf.extract`
  (cheap text path) or `pdf.render` → `image.describe`/vision for curve-only or raster artwork.
- **Read small print exactly** (INCI/allergen lists, net weight, text outlined to curves) → `image.ocr`
  with a PDF `url`, `page`, `dpi: 300–400` and a `clip` around the panel. It returns the characters it
  sees with a per-word confidence — it never "corrects" a misspelling the way a vision model can, so
  flag words below ~0.9 for human review rather than re-reading them with a model.
- **Zoom in visually** (layout, artwork) → `pdf.render` with `clip` to rasterise just a region at a high
  DPI, instead of the whole sheet. Renders over 40 MP return `code: "too_large"` with `suggestedDpi`
  — retry at that dpi or with a smaller clip, don't blind-retry.
- **Barcodes / QR** → `pdf.decodeBarcodes` (deterministic WASM decode) — never trust vision for barcode
  digits; it hallucinates them.
- **Prepress / print QA** (spot colours, colour spaces, vector vs raster) → `pdf.inspectGraphics`.
- **Change the artwork itself** → `pdf.edit`. `replaceText` edits only LIVE text: the matched glyphs are
  cut out with an exact-width gap (nothing else moves) and the new text is drawn at the same spot, in the
  same colour, in the original font if its embedded glyphs cover the new text (otherwise an embedded
  fallback, reported as `usedFallbackFont`). A replacement longer than the original is flagged in `note`
  — it may run into neighbouring text. Text outlined to curves can't be edited: the item fails with
  "not found as live text" — put it on the designer change list. `verified: true` means the new text
  reads back from the output.
- **Is it print-ready?** → `pdf.preflight` (report only; `stats.layers` lists the file's layers).
  **Make it print-ready** → `pdf.printReady`. By default it outlines all text to curves, converts
  RGB/Lab to CMYK for the `outputIntent` (e.g. `FOGRA39`), keeps spot colours, removes comments and
  links, merges layers as the file shows them (hidden layers left out) and marks the file PDF/X-4.
  `report.changes` says what was done, measured on the output; `report.compliant` comes from
  preflighting the OUTPUT, so remaining issues (low-res images, missing bleed, white overprint) are
  reported rather than hidden. Options:

  | Option | Values |
  |---|---|
  | `profile` | `pdfx-4` (default), `pdfx-1a` (CMYK + spot only), `none` (convert, no PDF/X marking) |
  | `outputIntent` | `FOGRA39` (default), `FOGRA51`, `FOGRA52`, `FOGRA29`, `GRACoL2006`, `SWOP2006`, `JapanColor2011` |
  | `colour` | `cmyk` (default), `gray`, `keep` |
  | `spotColours` | `keep` (default) or `convert` to process colour |
  | `outlineFonts` | `true` (default) text → curves; `false` keeps live text (fonts embedded with `embedFonts`, default true) |
  | `layers` | `{ hide: ['Dieline'], show: [...] }` by name — e.g. print without the dieline |
  | `annotations` | `remove` (default), `flatten` (draw into the artwork), `keep` |
  | `pages` | `"1-3,5"` (default all) |
  | `downsample` | `{ dpi: 300 }` — resample images placed above 1.5× that; off by default |
  | `bleed` | `{ mm: 3 }` — required bleed, checked and reported, never added |
  | `bleedIncluded` | `{ mm: 3 }` — the artwork already includes its bleed: sets TrimBox/BleedBox |
  | `cropMarks` | `{}` or `{ offsetMm, lengthMm, weightPt }` — crop marks outside the bleed |
  | `flattenTransparency` | PDF/X-1a only: affected pages become images. Default false |

  Outlined text can't be edited or searched afterwards: keep the source PDF for changes and regenerate.

```ts
const edited = await SL.ai.tools.run(collectionId, 'pdf.edit', {
  url: artworkUrl,
  replaceText: [{ id: 'f1', page: 1, find: 'Best before: see lid', replace: 'Best before: see base' }],
})
const ready = await SL.ai.tools.run(collectionId, 'pdf.printReady', {
  url: edited.result.url, profile: 'pdfx-4', outputIntent: 'FOGRA39', bleed: { mm: 3 },
  layers: { hide: ['Dieline'] }, cropMarks: {},
})
if (!ready.result.report.compliant) showFindings(ready.result.report.findings)
```
- **A review UI that flags guessed fields** → `pdf.extract` with `includeConfidence` (per-field
  confidence + source) and `includeBoxes` (per-field bbox on text-native pages) in `fieldsMeta`.
- **Produce a PDF** → `pdf.create` (HTML → PDF), `pdf.fill` (populate an AcroForm's fields),
  `pdf.merge` (combine several). `pdf.create` takes an exact page size (`width`, `height`, `unit`) or a
  `format`, `html` or `pages: [html, …]` (one per page, sharing `head`), and returns `url` (public),
  a `signedUrl` that expires, or `base64` (`return`). JavaScript doesn't run, and images, fonts and
  stylesheets load only from SmartLinks hosts, Google Fonts or `data:` URIs. From a server function:
  `ctx.sl.tools.run('pdf.create', …)` with the `tools:pdf.create` capability (server-functions.md).

Every tool is also directly callable without the model loop via `ai.tools.run(collectionId, name,
args)` — e.g. render a page or extract fields straight from a UI, no agent round-trip:

```ts
// Read the ingredients panel of a sleeve exactly (deterministic OCR of a clipped region)
const { result } = await SL.ai.tools.run(collectionId, 'image.ocr', {
  url: sleevePdfUrl, page: 1, dpi: 400,
  clip: { x0: 0.40, y0: 0.20, x1: 0.60, y1: 0.40 },
  languages: ['en', 'fr'],
})
// result.lines → [{ text: 'INGREDIENTS: Aqua, Glycerin, …', confidence: 0.97, bbox: {…} }]
const toReview = result.words.filter((w) => w.confidence < 0.9)
```

Discover tools two ways:
- **Design time (typed):** import `BUILTIN_AI_TOOLS`, `AI_TOOL_NAMES`, and the per-tool arg types
  (`WebSearchArgs`, `DataExtractArgs`, `PdfExtractArgs`, …) from the SDK. This is the core set —
  stable, versioned, documented here.
- **Runtime (live):** `await ai.catalog(collectionId)` returns the registry as the server sees it,
  including any future app-contributed tools. The built-in set above is always present.

### Recommended Models

Pass either a full model id (`openai/gpt-6.1-sol`) or a tier alias (`'cheap'`, `'balanced'`,
`'premium'`) as `model` — both resolve through the same server-side model registry. The tiers are the
GPT-6 family (prices per 1M tokens, input / output, OpenAI list price):

| Tier | Model | Alias | Price | Use for |
|------|-------|-------|-------|---------|
| Cheapest (default) | `openai/gpt-6-luna` | `'cheap'` / omit `model` | $0.10 / $0.50 | Everyday chat, high-volume/simple turns |
| Balanced | `openai/gpt-6.1-sol` | `'balanced'` | $2 / $10 | Admin agent / tool-heavy workflows (the `v1/responses` default) |
| Most capable | `openai/gpt-6-astra` | `'premium'` | $10 / $50 | The hardest reasoning, coding and long multi-step tool use |

The previous generation stays available by id — `openai/gpt-5.6-luna` ($0.20 / $1.20),
`openai/gpt-5.6-terra` ($2 / $12) and `openai/gpt-5.6-sol` ($4 / $20) — and `ai.models.list(collectionId)` returns
the full current set. GPT-6.1 Sol is the same input price as GPT-5.6 Terra with cheaper output, so prefer
the tiers. If OpenAI refuses a GPT-6 request for a model/option reason, SmartLinks retries it once on the
GPT-5.6 equivalent, so a call never fails just because a GPT-6 model doesn't accept something yet.

Every tier supports function/tool calling, Programmatic Tool Calling, and Multi-agent (see below), and all
three accept `service_tier: 'flex'` (≈50% cheaper, Batch-API rates, slower) or `'priority'` (premium, guaranteed
throughput) alongside the default `'standard'` tier. Pass it straight through in the request body:

```typescript
const response = await ai.chat.responses.create('my-collection', {
  model: 'balanced',
  input: 'Summarize this week\'s ingested documents.',
  service_tier: 'flex' // non-interactive/background work: cheaper, but can take minutes
});
```

Flex requests run noticeably slower — reserve `flex` for non-production/background work (batch enrichment,
evaluations, async jobs), not user-facing chat turns. The server already raises its own timeout to 15
minutes for any request with `service_tier: 'flex'`, matching OpenAI's guidance — nothing to configure on
the client. On a `429` ("resource unavailable") the request wasn't charged; retry with backoff or drop
`service_tier` (or set it to `'auto'`) to fall back to standard processing.

### Programmatic Tool Calling

Lets the model write a short in-memory program that orchestrates several tool calls (filtering,
looping, aggregating) before handing back one result, instead of a full message round-trip per
call. Add the hosted `programmatic_tool_calling` tool, and mark each function tool the program is
allowed to invoke with `allowed_callers: ['programmatic']`:

```typescript
const response = await ai.chat.responses.create('my-collection', {
  model: 'balanced',
  input: 'Compare inventory with demand for every SKU in this collection.',
  tools: [
    {
      type: 'function',
      name: 'get_inventory',
      description: 'Return available_units for a sku',
      parameters: { type: 'object', properties: { sku: { type: 'string' } }, required: ['sku'] },
      output_schema: { type: 'object', properties: { sku: { type: 'string' }, available_units: { type: 'number' } } },
      allowed_callers: ['programmatic']
    },
    {
      type: 'function',
      name: 'get_demand',
      description: 'Return requested_units for a sku',
      parameters: { type: 'object', properties: { sku: { type: 'string' } }, required: ['sku'] },
      output_schema: { type: 'object', properties: { sku: { type: 'string' }, requested_units: { type: 'number' } } },
      allowed_callers: ['programmatic']
    },
    { type: 'programmatic_tool_calling' }
  ]
});
```

The response's `output` array can include a `program` item (the generated code), one
`function_call` item per program-issued call (tagged with `caller: { type: 'program', caller_id }`),
and a `program_output` item with the program's final `result`/`status`. Execute the `function_call`
items as normal and send results back keyed by their `call_id` on the next turn.

### Multi-agent (subagents)

Lets the root agent spawn a tree of subagents that run in parallel and get synthesized back into
one response — useful for tasks that split cleanly into independent workstreams (e.g. research +
draft + review). Enable it by setting `multi_agent.enabled: true` — that's the entire contract on
your end; nothing else to configure or pass.

This is upstream beta functionality (OpenAI may still be limiting it to certain accounts/rollout),
so treat behavior and availability as subject to change until it's GA.

```typescript
const response = await ai.chat.responses.create('my-collection', {
  model: 'premium', // Sol recommended for the root agent when spawning subagents
  input: 'Research three competitor loyalty programs, then draft a comparison summary.',
  multi_agent: { enabled: true, max_concurrent_subagents: 3 }
});
```

Subagent output arrives as additional items in `output`, each tagged `agent: { agent_name: '/root/<name>' }`
(root agent output uses `/root`). Notes/limits carried over from OpenAI's beta:

- `max_concurrent_subagents` defaults to `3`
- `reasoning.summary` and `max_tool_calls` are not supported while multi-agent is enabled
- Streaming is not supported while multi-agent is enabled — the SDK throws if you pass both
  `stream: true` and `multi_agent.enabled: true`

---

## Chat Completions

OpenAI-compatible chat completions with streaming and tool calling support. Use this for compatibility with existing Chat Completions integrations; prefer the Responses API for new agentic features.

### Basic Chat

```typescript
const response = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ]
});

console.log(response.choices[0].message.content);
// Output: "The capital of France is Paris."
```

### Streaming Chat

Stream responses in real-time for better UX:

- Set `stream: true`
- The SDK returns an `AsyncIterable<ChatCompletionChunk>`
- Iterate over chunks with `for await...of`
- Read incremental text from `chunk.choices[0]?.delta?.content`
- If `stream` is omitted or `false`, the method returns the normal `ChatCompletionResponse`

```typescript
const stream = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [
    { role: 'user', content: 'Write a short poem about coding' }
  ],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

### Tool/Function Calling

Define tools (functions) that the AI can call:

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name'
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit']
          }
        },
        required: ['location']
      }
    }
  }
];

const response = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [
    { role: 'user', content: 'What\'s the weather in Paris?' }
  ],
  tools
});

const toolCall = response.choices[0].message.tool_calls?.[0];
if (toolCall) {
  console.log('Function:', toolCall.function.name);
  console.log('Arguments:', JSON.parse(toolCall.function.arguments));
  // { location: "Paris", unit: "celsius" }
}
```

### Available Models

```typescript
// List all available models
const models = await ai.models.list('my-collection');

// Or filter by provider / capability
const openAiModels = await ai.models.list('my-collection', {
  provider: 'openai'
});

const visionModels = await ai.models.list('my-collection', {
  capability: 'vision'
});

models.data.forEach(model => {
  console.log(`${model.name}`);
  console.log(`  Provider: ${model.provider}`);
  console.log(`  Context: ${model.contextWindow} tokens`);
  console.log(`  Pricing: $${model.pricing.input}/1M input tokens`);
});

// Get specific model info
const model = await ai.models.get('my-collection', 'google/gemini-2.5-flash');
console.log(model.capabilities); // ['text', 'vision', 'audio', 'code']
```

Use `ai.models.list(collectionId)` as the source of truth for what your collection can use at runtime. The public docs provide recommendations, but actual availability depends on the SmartLinks model catalog exposed to that collection.

**Recommended Models:**

| Model | Use Case | Speed | Cost |
|-------|----------|-------|------|
| `openai/gpt-5.4` | Default for new agentic and structured-output workflows | Balanced | Medium |
| `openai/gpt-5-mini` | Lower-cost general purpose and JSON tasks | Fast | Low |
| `google/gemini-2.5-flash` | Fast multimodal and cost-sensitive general use | Fast | Low |
| `google/gemini-2.5-pro` | Complex reasoning and heavier multimodal tasks | Slower | Higher |

If you want a safe default for most new work, start with `openai/gpt-5.4`. If you want a lower-cost fallback, use `openai/gpt-5-mini` or `google/gemini-2.5-flash` depending on your latency and pricing goals.

---

## Knowledge: answers from your own content

Knowledge search makes a collection's own content (product manuals, help articles, web pages) searchable by meaning and keywords together, so a question like "how do I descale it" finds the right section, and exact terms such as model numbers and error codes are found too. People can search it from a website, Portal or Hub, and AI agents can search it with the `knowledge.search` tool.

### How it fits together

- A collection has **knowledge sets**, such as "Product manuals" or "Help articles". Each set has a visibility:
  - `public`: anyone can search it.
  - `customer`: signed-in people can search it.
  - `staff`: only the business's own admins and admin-side agents (the default).
- A set has **sources**:
  - `markdown_feed`: a Markdown bundle at an https address (documents separated by `---`, each with a `Source: <url>` line).
  - `url`: one web page or document at an address.
  - `documents`: documents your app pushes itself with `knowledge.upsertDocuments`.
- The platform splits each document into passages along its headings and keeps them up to date: feeds and pages are re-read every 24 hours by default, and pushing a document with the same `ref` replaces its earlier version.

### Set up a set and its sources (admin)

```typescript
import { knowledge } from '@proveanything/smartlinks';

// Create the set (or update the one with this key)
await knowledge.saveSet('my-collection', {
  key: 'manuals',
  name: 'Product manuals',
  visibility: 'public'
});

// A web page or Markdown feed, read in the background
await knowledge.addSource('my-collection', 'manuals', {
  kind: 'url',
  config: { url: 'https://example.com/manuals/coffee-maker' }
});

// Or documents your app pushes itself (up to 500 at a time)
const source = await knowledge.addSource('my-collection', 'manuals', { kind: 'documents' });

await knowledge.upsertDocuments('my-collection', source.id, [
  {
    ref: 'coffee-maker-deluxe',
    title: 'Coffee Maker Deluxe manual',
    body: '## Descaling\n\nDescale once a month. Fill the tank with descaler...',
    url: 'https://example.com/manuals/coffee-maker-deluxe',
    meta: { productId: 'coffee-maker-deluxe' }
  }
]);

// Check progress: status is 'pending' | 'indexing' | 'ready' | 'failed'
const { items: sources } = await knowledge.listSources('my-collection', 'manuals');
```

### Search from a website, Portal or Hub

`knowledge.publicSearch` needs no API key. Anyone sees `public` sets; a signed-in person sees `customer` sets too. `staff` sets are never searchable here.

```typescript
const { items: results, mode } = await knowledge.publicSearch('my-collection', {
  q: 'How do I descale my coffee maker?',
  sets: ['manuals'],                              // optional: ids or keys
  filters: { productId: 'coffee-maker-deluxe' },  // optional: exact matches on a document's meta
  limit: 5                                            // optional: default 8, at most 25 at a time
});

for (const r of results) {
  // title: the document; heading: its section ("Cleaning › Descaling"); url: a link to it
  console.log(r.title, r.heading, r.url);
  console.log(r.snippet);   // a short piece around the match, for a results list
  // r.text is the whole passage, for reading out or passing to an AI
}
```

`mode` says how the search ran: `hybrid` (meaning and keywords), `keywords`, or `none` (there were no sets to search). Admins can search every set, staff ones included, with `knowledge.search(collectionId, { q })`. Both searches return their matches as `items`, with `query` (what was searched for) and `mode` beside them.

### AI-written answers (admin agent with `knowledge.search`)

When you want the AI to write an answer from the passages, run an admin-side agent with the `knowledge.search` built-in tool. This needs admin credentials, so for a public website call it from your own server, behind your own endpoint:

```typescript
// On your server (initialised with an admin API key)
const result = await ai.agent.run('my-collection', {
  input: 'How do I descale the Coffee Maker Deluxe?',
  instructions: 'Answer from the knowledge base only. Cite the page for each step. If nothing is found, say so.',
  toolbelt: { builtins: ['knowledge.search'] }
});

console.log(result.finalText);
```

The same `toolbelt` works with `ai.chat.responses.create`.

> **Not available yet on the public surface.** Built-in tools are off for `ai.public.agentRun`, so a public agent can't call `knowledge.search` yet. A cited-answer call for websites is planned. Until then, show passages from `knowledge.publicSearch`, or call an admin agent from your own server as above.

### Conversations

Knowledge search answers one question at a time; it doesn't keep a conversation. If you need follow-up questions ("how often should I do that?"), keep the history yourself and send it with each `ai.chat.responses.create` call (see [Multimessage Input](#multimessage-input)), searching the knowledge base on your server for each new question.

---

## Voice Integration

Enable voice input and output for hands-free interaction.

### Voice Patterns

The SDK supports three practical voice patterns:

| Pattern | Best For | SDK Building Blocks |
|---------|----------|---------------------|
| Voice → Text → Answer → Text | Manual helper Q&A, troubleshooting steps | `ai.voice.listen()` + `knowledge.publicSearch()` |
| Voice → Text → Answer → Voice | Hands-free assistants, accessibility | `ai.voice.listen()` + `knowledge.publicSearch()` + `ai.voice.speak()` or `ai.tts.generate()` |
| Real-time Voice | Low-latency spoken conversation | `ai.live.start()` with your own endpoints |

### Current SDK Support

- `ai.voice.listen()` and `ai.voice.speak()` are browser helpers built on the Web Speech APIs.
- `ai.live.start()` runs a live voice (or text) conversation in the browser; you supply the endpoints that start the session and run server tools.
- `ai.tts.generate()` supports server-side text-to-speech generation.
- The SDK does not currently expose a first-class transcription endpoint like Whisper; if you need that flow, implement it as your own backend endpoint and feed the transcribed text into `knowledge.publicSearch()` or your own backend.

### Recommended Approach

For product help and manuals, start with Voice → Text → Answer → Text/Voice. The text step is either `knowledge.publicSearch` (read out the best passage) or your own backend calling an admin agent with the `knowledge.search` tool (see [AI-written answers](#ai-written-answers-admin-agent-with-knowledgesearch)). Use a live session when low-latency spoken conversation matters more than answers grounded in your documents.

### Browser Voice Helpers

These helpers are browser-only and rely on native speech recognition / speech synthesis support.

```typescript
// Check if voice is supported
if (ai.voice.isSupported()) {
  // Listen for voice input
  const question = await ai.voice.listen('en-US');
  console.log('User said:', question);
  
  // Find the best passage in the manuals
  const { items: results } = await knowledge.publicSearch('my-collection', {
    q: question,
    filters: { productId: 'coffee-maker-deluxe' },
    limit: 1
  });

  // Speak it
  const answer = results[0]?.text ?? "Sorry, I couldn't find that in the manual.";
  await ai.voice.speak(answer, { rate: 1.0 });
}
```

### Voice Assistant Class

Create a complete voice assistant:

```typescript
class ProductVoiceAssistant {
  constructor(private collectionId: string, private productId: string) {}

  async ask(): Promise<string> {
    // Listen for the question
    const question = await ai.voice.listen();

    // Find the best passage
    const { items: results } = await knowledge.publicSearch(this.collectionId, {
      q: question,
      filters: { productId: this.productId },
      limit: 1
    });
    const answer = results[0]?.text ?? "Sorry, I couldn't find that in the manual.";

    // Speak it
    await ai.voice.speak(answer);
    return answer;
  }
}

// Usage
const assistant = new ProductVoiceAssistant('my-collection', 'coffee-maker-deluxe');
await assistant.ask(); // Voice question → spoken passage
```

For an AI-written answer instead of a passage, replace the search with a call to your own endpoint that runs `ai.agent.run` with `toolbelt: { builtins: ['knowledge.search'] }`.

### Live Voice Sessions

`ai.live.start()` runs a live conversation in the browser. SmartLinks mints a short-lived key with the assistant's instructions and tools fixed on it, and the browser connects straight to the provider, so audio never passes through SmartLinks. You supply the endpoints: `mint` (start the session) and `tool` (run a server tool).

```typescript
const live = await ai.live.start({
  endpoints: {
    mint: () => fetch('/api/assistant/session', { method: 'POST' }).then(r => r.json()),
    tool: (name, args, sessionId) =>
      fetch('/api/assistant/tool', { method: 'POST', body: JSON.stringify({ name, args, sessionId }) }).then(r => r.json())
  },
  onCaption: (text) => showCaption(text)
});

// Later
live.stop();
```

### Voice + Knowledge Guidance

For answers grounded in your documents, prefer this pattern:

1. Capture voice with `ai.voice.listen()` or your own transcription flow.
2. Search with `knowledge.publicSearch()`, or send the text to your own backend, which runs an admin agent with `knowledge.search`.
3. Render the text response for readability.
4. Optionally speak the answer with `ai.voice.speak()` or `ai.tts.generate()`.

This is usually a better fit for manuals and procedural guidance than trying to use a live voice session as the primary search layer.

---

## Podcast Generation

Generate NotebookLM-style multi-voice conversational podcasts from product documentation.

### Generate a Podcast

```typescript
const podcast = await ai.podcast.generate('my-collection', {
  productId: 'coffee-maker-deluxe',
  duration: 5,              // Target 5 minutes
  style: 'casual',          // 'casual' | 'professional' | 'educational' | 'entertaining'
  voices: {
    host1: 'nova',          // Female voice
    host2: 'onyx'           // Male voice
  },
  includeAudio: true        // Generate audio files
});

console.log('Podcast Title:', podcast.script.title);
console.log('Duration:', podcast.metadata.duration, 'seconds');
console.log('Download:', podcast.audio?.mixedUrl);
```

### Available Voices

| Voice | Gender | Personality | Best For |
|-------|--------|-------------|----------|
| `alloy` | Neutral | Balanced, neutral | Professional podcasts |
| `echo` | Male | Clear, authoritative | Expert/teacher role |
| `fable` | Neutral | Warm, storytelling | Narrative content |
| `onyx` | Male | Deep, engaging | Main host, discussions |
| `nova` | Female | Friendly, enthusiastic | Co-host, questions |
| `shimmer` | Female | Bright, energetic | Entertaining content |

**Recommended Combinations:**
- **Casual**: Nova + Onyx - Friendly and engaging
- **Professional**: Alloy + Echo - Authoritative and clear
- **Educational**: Fable + Echo - Teaching style
- **Entertaining**: Shimmer + Onyx - High energy

### Access the Script

```typescript
// View the generated script
podcast.script.segments.forEach((segment, i) => {
  const speaker = segment.speaker === 'host1' ? 'Host 1' : 'Host 2';
  console.log(`${speaker}: ${segment.text}`);
});
```

### Check Generation Status

For long-running podcast generation, poll for status:

```typescript
// Start generation
const podcast = await ai.podcast.generate('my-collection', {
  productId: 'coffee-maker-deluxe',
  duration: 10,
  includeAudio: true
});

// Poll for status
const checkStatus = async () => {
  const status = await ai.podcast.getStatus('my-collection', podcast.podcastId);
  
  console.log(`Status: ${status.status} (${status.progress}%)`);
  
  if (status.status === 'completed' && status.result) {
    console.log('Podcast ready!');
    console.log('Listen:', status.result.audio?.mixedUrl);
    return true;
  } else if (status.status === 'failed') {
    console.error('Generation failed:', status.error);
    return true;
  }
  
  return false;
};

// Check every 5 seconds
const interval = setInterval(async () => {
  const done = await checkStatus();
  if (done) clearInterval(interval);
}, 5000);
```

### Text-to-Speech (TTS)

Generate custom audio from text:

```typescript
const audioBlob = await ai.tts.generate('my-collection', {
  text: 'Welcome to our podcast about coffee makers!',
  voice: 'nova',
  speed: 1.0,
  format: 'mp3'
});

// Create audio URL for playback
const audioUrl = URL.createObjectURL(audioBlob);
```

---


## Types & API reference

Full TypeScript types and the per-endpoint HTTP reference for every `SL.ai.*` method live in the
**generated** references — they're not duplicated here so they can't drift:

- **[`API_SUMMARY.md`](API_SUMMARY.md)** — every function signature + type (search `ai.`).
- **[`openapi.yaml`](../openapi.yaml)** — the raw HTTP endpoints.

For inline types, use LSP hover / go-to-definition on `SL.ai.*`.

## Usage Examples

### Example 1: Product FAQ

```typescript
import { knowledge } from '@proveanything/smartlinks';

// Admin, once: a public set with the manual pushed into it
async function setUpManual(collectionId: string) {
  await knowledge.saveSet(collectionId, { key: 'manuals', name: 'Product manuals', visibility: 'public' });
  const source = await knowledge.addSource(collectionId, 'manuals', { kind: 'documents' });
  await knowledge.upsertDocuments(collectionId, source.id, [{
    ref: 'coffee-maker-deluxe',
    title: 'Coffee Maker Deluxe manual',
    body: '## Making espresso

Fill the basket, tamp firmly, press the espresso button...',
    meta: { productId: 'coffee-maker-deluxe' }
  }]);
}

// Website, any time: show the matching sections
async function answerQuestion(collectionId: string, question: string) {
  const { items: results } = await knowledge.publicSearch(collectionId, {
    q: question,
    filters: { productId: 'coffee-maker-deluxe' },
    limit: 3
  });
  return results.map(r => ({ title: r.heading ?? r.title, snippet: r.snippet, url: r.url }));
}
```

### Example 2: Streaming Chatbot UI

```typescript
async function streamingChatbot(userMessage: string) {
  const stream = await ai.chat.completions.create('my-collection', {
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage }
    ],
    stream: true
  });

  let fullResponse = '';
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    
    // Update UI in real-time
    updateChatUI(content);
  }

  return fullResponse;
}
```

### Example 3: Multi-Turn Conversation

With the Responses API you keep the history yourself and send it with each call:

```typescript
async function chatConversation() {
  const collectionId = 'my-collection';
  const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  async function say(text: string) {
    history.push({ role: 'user', content: text });
    const response = await ai.chat.responses.create(collectionId, { input: history });
    history.push({ role: 'assistant', content: response.output_text });
    return response.output_text;
  }

  console.log('A1:', await say('How do I clean the machine?'));
  console.log('A2:', await say('How often should I do that?')); // sees the first answer
}
```

### Example 4: React Hook for Product Help

```typescript
import { useState, useCallback } from 'react';
import { knowledge } from '@proveanything/smartlinks';
import type { KnowledgeSearchResult } from '@proveanything/smartlinks';

export function useProductHelp(collectionId: string, productId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<KnowledgeSearchResult[]>([]);

  const ask = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await knowledge.publicSearch(collectionId, { q: query, filters: { productId }, limit: 3 });
      setResults(res.items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collectionId, productId]);

  return { ask, loading, error, results };
}

// Usage in component
function ProductHelp() {
  const { ask, loading, results } = useProductHelp('my-collection', 'coffee-maker');

  return (
    <div>
      <button onClick={() => ask('How do I clean this?')} disabled={loading}>
        {loading ? 'Searching...' : 'Ask Question'}
      </button>
      {results.map(r => (
        <p key={r.id}>
          <strong>{r.heading ?? r.title}</strong> {r.snippet} {r.url && <a href={r.url}>Read more</a>}
        </p>
      ))}
    </div>
  );
}
```


---

## Error Handling

### Error Codes

| Code | Type | HTTP Status | Description |
|------|------|-------------|-------------|
| `rate_limit_exceeded` | `rate_limit_error` | 429 | User exceeded rate limit |
| `invalid_request` | `invalid_request_error` | 400 | Invalid parameters |
| `authentication_error` | `authentication_error` | 401 | Invalid/missing API key |
| `permission_denied` | `permission_error` | 403 | Insufficient permissions |
| `not_found` | `not_found_error` | 404 | Resource not found |
| `server_error` | `server_error` | 500 | Internal server error |
| `service_unavailable` | `server_error` | 503 | Service temporarily unavailable |

### Error Handling Pattern

```typescript
import { SmartLinksAIError } from '@proveanything/smartlinks';

async function robustChat() {
  try {
    const response = await ai.chat.responses.create('my-collection', {
      input: 'Help!'
    });
    return response.output_text;
  } catch (error) {
    if (error instanceof SmartLinksAIError) {
      switch (error.code) {
        case 'rate_limit_exceeded':
          console.error('Rate limit exceeded');
          console.log('Try again at:', new Date(error.resetAt!));
          break;
        case 'authentication_error':
          console.error('Invalid API key');
          break;
        case 'invalid_request':
          console.error('Invalid request:', error.message);
          break;
        default:
          console.error('API error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

### Rate Limit Retry

```typescript
async function chatWithRetry(
  request: ResponsesRequest,
  maxRetries = 3
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await ai.chat.responses.create('my-collection', request);
    } catch (error) {
      if (error instanceof SmartLinksAIError && error.isRateLimitError()) {
        if (retries === maxRetries - 1) throw error;

        const resetTime = new Date(error.resetAt!).getTime();
        const waitTime = resetTime - Date.now();

        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        retries++;
      } else {
        throw error;
      }
    }
  }
}
```

---

## Rate Limiting

### Rate Limit Overview

Public AI calls (such as `ai.public.agentRun`) are rate-limited per user: the signed-in person, or the `userId` you pass for an anonymous caller. Admin endpoints use API key authentication and are not rate-limited per user by default.

### Rate Limit Headers

All API responses include rate limit information:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1707300000000
```

### Checking Rate Limit

```typescript
// Check rate limit status before making requests
const status = await ai.public.getRateLimit('my-collection', 'user-123');

console.log('Used:', status.used);
console.log('Remaining:', status.remaining);
console.log('Resets at:', new Date(status.resetAt));

if (status.remaining > 0) {
  // Safe to make request
  await ai.public.agentRun('my-collection', { input: question, userId: 'user-123' });
} else {
  // Show user when they can ask again
  console.log('Rate limit reached. Try again at:', status.resetAt);
}
```

### Resetting Rate Limits (Admin)

```typescript
// Reset rate limit for a specific user
await ai.rateLimit.reset('my-collection', 'user-123');
console.log('Rate limit reset for user-123');
```

---

## Best Practices

### 1. Choose the Right Model

```typescript
// For most new workflows (recommended default)
await ai.chat.responses.create('my-collection', {
  model: 'openai/gpt-5.4',
  input: 'Create a concise onboarding checklist.'
});

// For lower-cost structured or JSON-oriented work
await ai.chat.responses.create('my-collection', {
  model: 'openai/gpt-5-mini',
  input: 'Return a color palette as JSON.'
});

// For fast multimodal or cost-sensitive general use
await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [...]
});

// When you need the actual available catalog for this collection
const available = await ai.models.list('my-collection');
console.log(available.data.map(model => model.id));
```

### 2. Use Streaming for Long Responses

Improve perceived performance with streaming:

```typescript
// Non-streaming: User waits for full response
const response = await ai.chat.completions.create('my-collection', {
  messages: [...]
});

// Streaming: User sees progress immediately
const stream = await ai.chat.completions.create('my-collection', {
  stream: true,
  messages: [...]
});

for await (const chunk of stream) {
  updateUI(chunk.choices[0]?.delta?.content);
}
```

### 3. Keep Conversation History Yourself

The Responses API doesn't store a conversation for you. Keep the turns and send them with each call:

```typescript
const history: ResponseInputItem[] = [];

history.push({ role: 'user', content: 'First question' });
const first = await ai.chat.responses.create('my-collection', { input: history });
history.push({ role: 'assistant', content: first.output_text });

history.push({ role: 'user', content: 'Follow-up question' });
const second = await ai.chat.responses.create('my-collection', { input: history });
```

### 4. Handle Rate Limits Gracefully

Show clear feedback to users:

```typescript
try {
  await ai.public.agentRun('my-collection', { input: question, userId });
} catch (error) {
  if (error instanceof SmartLinksAIError && error.isRateLimitError()) {
    const resetTime = new Date(error.resetAt!);
    showNotification(
      `You've reached your question limit. ` +
      `Try again at ${resetTime.toLocaleTimeString()}`
    );
  }
}
```

### 5. Optimize Voice UX

Provide clear status updates:

```typescript
async function voiceAssistant() {
  try {
    showStatus('Listening...');
    const question = await ai.voice.listen();

    showStatus('Searching...');
    const { items: results } = await knowledge.publicSearch('my-collection', { q: question, limit: 1 });
    const answer = results[0]?.text ?? "Sorry, I couldn't find that.";

    showStatus('Speaking...');
    await ai.voice.speak(answer);

    showStatus('Ready');
  } catch (error) {
    showStatus('Error', error.message);
  }
}
```

### 6. Give Documents Clear Headings

Knowledge search splits each document into passages along its headings, and each result carries its section (`heading`, such as "Cleaning › Descaling"). Clear, specific headings give tighter passages and better results:

```markdown
## Descaling

Descale once a month...

## Cleaning the milk frother

Rinse after every use...
```

Put details you want to filter on (such as `productId`) in a pushed document's `meta`, then pass them as `filters` when searching.

### 7. Use System Prompts Effectively

Provide clear instructions:

```typescript
await ai.chat.completions.create('my-collection', {
  messages: [
    {
      role: 'system',
      content: `You are a coffee maker expert assistant.
- Be concise and clear
- Use numbered lists for steps
- Always mention safety precautions
- If unsure, ask for clarification`
    },
    { role: 'user', content: 'How do I descale?' }
  ]
});
```

### 8. Monitor Usage and Costs

Track usage for cost management:

```typescript
const response = await ai.chat.completions.create('my-collection', {
  messages: [...]
});

// Log token usage
console.log('Usage:', response.usage);
console.log('Prompt tokens:', response.usage.prompt_tokens);
console.log('Completion tokens:', response.usage.completion_tokens);
console.log('Total tokens:', response.usage.total_tokens);

// Calculate estimated cost
const model = await ai.models.get('my-collection', response.model);
const cost = 
  (response.usage.prompt_tokens * model.pricing.input / 1_000_000) +
  (response.usage.completion_tokens * model.pricing.output / 1_000_000);
console.log('Estimated cost: $', cost.toFixed(4));
```

---

## Providing Content to the AI Assistant

The portal's built-in AI assistant can discuss the content currently visible to the user. To make this work, your app must supply contextual content when the assistant requests it. There are three extraction methods, tried in priority order:

| Priority | Method | When Used |
|----------|--------|-----------|
| 1 | **Direct prop callback** | Container/widget rendered in the parent React context |
| 2 | **PostMessage protocol** | App rendered in an iframe |
| 3 | **DOM text fallback** | Neither of the above responded |

This section covers **methods 1 and 2** — the ones you implement in your app.

### Method 1: Direct Prop (`onRequestAIContent`)

When your app is rendered as a **container** (a direct component in the parent's React tree), the framework passes an `onRequestAIContent` prop to your exported component. You do **not** call this prop yourself — the framework calls it when the AI assistant needs context.

Structure your component to make current state accessible when the callback fires:

```tsx
import { useEffect, useRef } from 'react';

export function PublicContainer(props) {
  const { onRequestAIContent, appId, ...rest } = props;

  // Keep a ref to the latest content so the callback always returns fresh data
  const currentContentRef = useRef(null);

  useEffect(() => {
    currentContentRef.current = buildCurrentContent();
  }, [relevantState]);

  return <div data-app-container={appId}>{/* your UI */}</div>;
}
```

The framework registers the content provider internally via `useAIContentExtraction.registerContentProvider()`. Your component just needs to respond when the callback is invoked.

### Method 2: PostMessage Protocol (Iframes)

For iframe-embedded apps the framework sends a `postMessage` request and expects a response within **500 ms**. If your app doesn't reply in time the framework falls back to DOM text extraction.

**Request sent by the framework to your iframe:**

```typescript
{
  type: 'smartlinks:request-ai-content',
  requestId: 'ai-content-1709834567890-abc123'  // unique per request
}
```

**Response your app must send back:**

```typescript
{
  type: 'smartlinks:ai-content-response',
  requestId: 'ai-content-1709834567890-abc123',  // echo back the requestId
  content: AIContentResponse
}
```

**Minimal implementation:**

```typescript
window.addEventListener('message', async (event) => {
  if (event.data?.type === 'smartlinks:request-ai-content') {
    const content = await gatherAIContent();

    window.parent.postMessage({
      type: 'smartlinks:ai-content-response',
      requestId: event.data.requestId,
      content,
    }, '*');
  }
});

async function gatherAIContent(): Promise<AIContentResponse> {
  return {
    text: 'The user is viewing the warranty registration form...',
    contentLabel: 'Warranty Registration',
  };
}
```

### The `AIContentResponse` Interface

```typescript
interface AIContentResponse {
  /**
   * Plain text or markdown for the AI to use as context.
   * Injected into the system prompt. Max recommended: ~4000 characters.
   */
  text: string;

  /**
   * Optional structured metadata (key-value pairs).
   * Not used directly in prompts but available for custom providers.
   */
  metadata?: Record<string, unknown>;

  /**
   * Which documents to ground answers in. When provided, the assistant can search
   * the collection's knowledge sets (SL.knowledge.publicSearch) for this product.
   */
  ragHint?: {
    /** The product whose documents to search (matched against a document's meta.productId) */
    productId: string;
    /** Optional conversation ID */
    sessionId?: string;
    /** Optional hint to help scope the search */
    context?: string;
  };

  /**
   * Human-readable label shown in context-update messages
   * (e.g. "Product Manual", "FAQ").
   */
  contentLabel?: string;

  /**
   * How the assistant should use this content:
   * - 'context' (default): inject text into the system prompt
   * - 'rag': use ragHint to search the collection's knowledge sets
   * - 'hybrid': inject text as context AND search the knowledge sets
   */
  strategy?: 'context' | 'rag' | 'hybrid';
}
```

### Response Strategies

#### `context` (Default)

Return readable text. The assistant injects it into the system prompt as background knowledge. Good for descriptions, summaries, structured data, and FAQs.

```typescript
return {
  text: `
## Wine Details
- **Name**: 2023 Château Margaux
- **Region**: Bordeaux, France
- **Tasting Notes**: Dark fruit, cedar, tobacco
- **Food Pairing**: Lamb, aged cheese
  `,
  contentLabel: 'Wine Information',
  strategy: 'context',
};
```

#### `rag`

Tell the assistant to answer from the collection's knowledge sets. The `text` field is minimal: the real knowledge comes from the documents in those sets (see [Knowledge: answers from your own content](#knowledge-answers-from-your-own-content)). Good for product manuals, large document sets, and technical specs.

```typescript
return {
  text: 'The user is viewing the espresso machine product page.',
  contentLabel: 'Product Assistant',
  strategy: 'rag',
  ragHint: {
    productId: 'espresso-machine-pro',
    context: 'User is on the troubleshooting section',
  },
};
```

For the `rag` strategy to find anything, the product's documents must be in a knowledge set the visitor can read (`public`, or `customer` for signed-in people), with `productId` in each document's `meta`. A search scoped by the hint looks like this:

```typescript
const { items: results } = await SL.knowledge.publicSearch(collectionId, {
  q: userQuestion,
  filters: { productId: ragHint.productId },
});
```

#### `hybrid`

Combines both: the `text` is injected as additional context **and** the user's questions are also answered from the knowledge sets. Good for museum exhibits, guided experiences, or any scenario with rich metadata alongside large document sets.

```typescript
return {
  text: `
## Exhibit: The Starry Night
- **Artist**: Vincent van Gogh
- **Year**: 1889
- **Current Location**: Gallery 3, East Wing
- **Audio Guide**: Available in 12 languages
  `,
  contentLabel: 'Museum Exhibit',
  strategy: 'hybrid',
  ragHint: {
    productId: 'starry-night-exhibit',
    context: 'Art history and technique questions',
  },
};
```

### Content Extraction Examples

#### Museum Guide App

```typescript
async function gatherAIContent(): Promise<AIContentResponse> {
  const exhibit = getCurrentExhibit();

  return {
    text: `
Exhibit: "${exhibit.title}" by ${exhibit.artist}
Period: ${exhibit.period}
Medium: ${exhibit.medium}
Description: ${exhibit.curatorNotes}
Related works in this gallery: ${exhibit.relatedWorks.join(', ')}
    `.trim(),
    contentLabel: `Exhibit: ${exhibit.title}`,
    strategy: 'hybrid',
    ragHint: {
      productId: exhibit.smartlinksProductId,
      context: `Art history, technique, and visitor information for ${exhibit.title}`,
    },
    metadata: {
      exhibitId: exhibit.id,
      gallery: exhibit.gallery,
      audioGuideAvailable: exhibit.hasAudioGuide,
    },
  };
}
```

#### Wine Product App

```typescript
async function gatherAIContent(): Promise<AIContentResponse> {
  const wine = getCurrentWine();
  const reviews = await fetchRecentReviews(wine.id, 5);

  return {
    text: `
Wine: ${wine.name} (${wine.vintage})
Winery: ${wine.winery}
Region: ${wine.region}, ${wine.country}
Grape: ${wine.grape}
ABV: ${wine.abv}%
Price: ${wine.price}
Tasting Notes: ${wine.tastingNotes}

Recent Reviews:
${reviews.map(r => `- "${r.text}" (${r.rating}/5)`).join('\n')}
    `.trim(),
    contentLabel: 'Wine Details',
    strategy: 'context',
  };
}
```

#### Equipment Manual App (knowledge only)

```typescript
async function gatherAIContent(): Promise<AIContentResponse> {
  const equipment = getCurrentEquipment();

  return {
    text: `User is viewing: ${equipment.name} (Model: ${equipment.modelNumber})`,
    contentLabel: `${equipment.name} Assistant`,
    strategy: 'rag',
    ragHint: {
      productId: equipment.smartlinksProductId,
      sessionId: `manual-${equipment.id}-${Date.now()}`,
      context: 'Technical manual, troubleshooting, and maintenance',
    },
  };
}
```

### Timing & Lifecycle

- **On navigation**: When the user navigates to a new product/proof/app, the assistant automatically requests fresh content and injects a context-update system message.
- **On first message**: If no content has been gathered yet, the assistant requests it before the first AI call.
- **On manual refresh**: The assistant can re-request content at any time (e.g. if the user's view within the app has changed).

Content is requested **lazily** — your handler is only called when the AI assistant is active and needs context. If the user never opens the assistant, your handler is never called.

### Method 3: DOM Fallback (Automatic)

If your app doesn't implement either of the above, the framework extracts `innerText` from the DOM element with `data-app-container="{appId}"`, truncated to ~4000 characters. This is a **last resort** — content quality is much lower than a structured response. Implementing Method 1 or 2 is strongly recommended.

---

## Related Documentation

- [API Summary](./API_SUMMARY.md) - Complete API reference
- [Knowledge search](./knowledge.md) - Knowledge sets, sources and search
- [Widgets](./widgets.md) - Embedding SmartLinks components
- [Realtime](./realtime.md) - Realtime data updates
- [iframe Responder](./iframe-responder.md) - iframe integration

---

## Support

For questions or issues:

- **Documentation:** https://smartlinks.app/docs
- **GitHub:** https://github.com/Prove-Anything/smartlinks
- **Email:** support@smartlinks.app
