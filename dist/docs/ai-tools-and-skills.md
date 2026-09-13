# AI Tools & Skills

The platform's AI can research the web, extract structured data, screenshot pages, and
generate images — through a **capability registry**. This page is the catalog: what the
AI can do, and how an app reaches for it. You should not need to call an API to find
this out — it's documented here so that when you build an app (or an AI assistant helps
you), you *know* these capabilities exist and can shape your app to use them.

## Two layers: tools vs skills

- **Skills** are the app-facing verbs — named, composed capabilities with the
  orchestration and prompt **baked in**. You invoke a skill by name with structured
  input and get structured output back. **You never write a prompt.** Example:
  `research.brand`.
- **Tools** are the atomic building blocks (fetch a page, generate an image). The AI
  reaches for these *itself* during a skill or agent run — you rarely call them directly.

Rule of thumb: **if a skill exists for what you want, call the skill.** Drop to the
agent loop (below) only for open-ended tasks with no matching skill.

## Using a skill

```ts
import { ai } from '@proveanything/smartlinks'

// Research a client's brand from their website — no prompt, just input.
const { profile, sources } = await ai.skills.run(collectionId, 'research.brand', {
  url: 'https://acme.com',
})
// profile → { name, description, tagline, palette:[{hex}], logoUrl, tone, keyProducts, socials }
// sources → which signals were available (markdown, branding, schema.org)

// Discover skills at runtime too (this catalog, live):
const { skills } = await ai.skills.list(collectionId)
```

## Deterministic extraction (no AI)

For structured pages, skip the LLM entirely — `research.fetch` returns schema.org
JSON-LD deterministically:

```ts
const res = await ai./* research */ // see the `research` namespace
// or the tool directly inside an agent run: web.extractSchema
```
(See the **Integrations / research** doc for `research.fetch`, used e.g. by the Recipes
app to pull a recipe's schema.org data without any AI.)

## Open-ended tasks: the agent loop

When no skill fits, run the agent — it's given the tool catalog and reaches for tools
as your prompt warrants:

```ts
const result = await ai.agent.run(collectionId, {
  prompt: 'Research acme.com and draft a one-paragraph brand summary with 3 hero image ideas.',
  allowCapabilities: ['web:read', 'ai:image'], // cap blast radius to these capabilities
})
// result.finalText + result.toolResults (the trace of tools the AI called)

const { tools } = await ai.agent.listTools(collectionId) // what the AI could reach for
```

`allowCapabilities` gates which tools a run may use (e.g. omit `ai:image` to forbid
image generation). Capability tags are listed against each tool below.

## How the AI discovers tools

Within a skill or `ai.agent.run`, the tool definitions (names, descriptions, JSON
schemas) are passed to the model, so it discovers and calls them automatically. Outside
a run — e.g. the plain chat endpoints — tools are **not** auto-injected; use a skill or
the agent loop to give the AI tool access.

---

<!-- The section below is GENERATED from the server registry (single source of truth),
     also served live at GET /admin/collection/:collectionId/ai/catalog.
     Regenerate with `node scripts/gen-ai-catalog.js` in prove/server. -->

## Skills

Named, composed capabilities an app invokes **by name** with structured input — no prompt-shaping. Call `SL.ai.skills.run(collectionId, name, input)`.

### `research.brand`

Research a brand or company from its website URL into a structured brand profile (name, description, palette, logo, tone, key products, socials). Gathers page content + schema.org + branding deterministically, then synthesises with AI.

_Capabilities: web:read, ai:text_

**Input**
- `url` _(required)_ — string: The brand's website URL (https).
- `instructions` — string: Optional extra guidance for the researcher.

## Tools

Atomic building blocks the AI reaches for **during** an agent/skill run — you rarely call these directly. Enumerable via `SL.ai.agent.listTools(collectionId)`; capability tags cap what a run may use.

### `web.fetchPage`

Fetch a web page by URL and return clean markdown, page metadata, and any structured schema.org/JSON-LD data. Use to research a brand or product website.

_Capabilities: web:read_

**Parameters**
- `url` _(required)_ — string: Absolute URL to fetch (https).
- `type` — string: Optional schema.org @type filter for the returned JSON-LD, e.g. "Product" or "Recipe".
- `forceRefresh` — boolean: Bypass the cache and re-fetch.

### `web.extractSchema`

Fetch a URL and return only its schema.org structured data (JSON-LD) of the given @type, e.g. "Recipe" or "Product". Deterministic — no AI.

_Capabilities: web:read_

**Parameters**
- `url` _(required)_ — string: Absolute URL to fetch (https).
- `schemaType` — string: schema.org @type to extract, e.g. "Recipe" or "Product".
- `forceRefresh` — boolean

### `web.screenshot`

Capture a screenshot of a web page. Returns the screenshot (URL or base64).

_Capabilities: web:read_

**Parameters**
- `url` _(required)_ — string: Absolute URL to screenshot (https).

### `brand.assets`

Extract a website's brand elements — logo, colours, design — plus page metadata. Use to research a brand's visual identity.

_Capabilities: web:read_

**Parameters**
- `url` _(required)_ — string: The brand's website URL (https).

### `image.generate`

Generate a new image from a text prompt. Returns the generated image (url or base64).

_Capabilities: ai:image_

**Parameters**
- `prompt` _(required)_ — string: Description of the image to generate.
- `size` — string: e.g. "1024x1024".
- `provider` — `openai` | `gemini`: Image model provider.

### `image.searchStock`

Search stock photography (Unsplash) for real photos matching a query. Returns candidate image URLs.

_Capabilities: web:read_

**Parameters**
- `query` _(required)_ — string: What to search for.
- `per_page` — number: How many results (default 10).
- `orientation` — `landscape` | `portrait` | `squarish`
