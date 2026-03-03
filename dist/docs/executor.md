# SmartLinks Executor Model

> **SDK minimum:** `@proveanything/smartlinks@1.4.1`

---

## What Is an Executor?

An executor is a **standalone JavaScript library** (`executor.umd.js` / `executor.es.js`) that a SmartLinks app ships alongside its widget and container bundles. It exposes programmatic functions that external systems — AI orchestrators, the Hub server, setup wizards — can call **without rendering the app's UI**.

Every app can optionally ship an executor. The executor pattern solves three problems that iframe-based apps can't address on their own:

| Problem | Executor Solution |
|---------|-------------------|
| AI orchestrators need to configure apps programmatically | Executor exposes typed mutation functions |
| Search engines can't execute JavaScript in iframes | `getSEO()` returns metadata the server injects into `<head>` |
| AI crawlers need readable content, not interactive widgets | `getLLMContent()` returns structured markdown sections |

### What an Executor Is Not

- **Not a REST API** — it's a JS bundle loaded and called in-process (Node.js or browser)
- **Not required** — apps work fine without one; the executor adds programmatic capabilities
- **Not the app itself** — it shares types and logic with the app but produces a separate bundle

---

## Manifest Declaration

Every executor is declared in `app.manifest.json` so the platform can discover and load it:

```json
{
  "meta": {
    "name": "My App",
    "appId": "my-app",
    "version": "1.0.0",
    "seo": { "priority": 10 }
  },
  "executor": {
    "files": {
      "js": { "umd": "dist/executor.umd.js", "esm": "dist/executor.es.js" }
    },
    "factory": "createMyAppExecutor",
    "exports": ["createMyAppExecutor", "getSEO", "getLLMContent"],
    "description": "Programmatic configuration and SEO API for My App."
  }
}
```

| Field | Purpose |
|-------|---------|
| `files.js.umd` | UMD bundle path (loaded via `<script>` tag — available as `window.MyAppExecutor`) |
| `files.js.esm` | ESM bundle path (for `import()` in modern environments) |
| `factory` | Name of the factory function that creates an executor instance |
| `exports` | All named exports — tells consumers what's available without loading the bundle |
| `description` | Human-readable summary for AI orchestrators and admin UIs |

---

## Loading an Executor

```typescript
// ESM (modern bundlers, Deno, Node 18+)
const { createMyAppExecutor } = await import('https://my-app.smartlinks.app/dist/executor.es.js');

// UMD (script tag, legacy environments)
// After loading executor.umd.js:
const { createMyAppExecutor } = window.MyAppExecutor;
```

### Initialising

Every executor factory receives a standard `ExecutorContext`:

```typescript
import * as SL from '@proveanything/smartlinks';

const executor = createMyAppExecutor({
  collectionId: 'col_abc123',
  appId: 'my-app',
  SL,  // Pre-initialised SmartLinks SDK
});
```

The SDK reference is passed in rather than imported because executors run in contexts where the SDK may already be loaded (the Hub server, an AI orchestrator's runtime, a parent app). This avoids duplicate SDK instances and ensures the caller controls authentication.

---

## Core Pattern: The Mutate Pipeline

The recommended internal architecture for executor mutations is a `mutate()` helper:

```typescript
async function mutate(fn: (config: MyConfig) => MyConfig): Promise<MyConfig> {
  const current = await getConfig();    // Read current state + merge with defaults
  const updated = fn(current);          // Pure transformation (no side effects)
  await saveConfig(updated);            // Validate + write via SL API
  return updated;
}
```

This gives you:
- **Read-before-write** — always operates on the latest config
- **Pure transformations** — mutation functions are testable without API calls
- **Validation gate** — invalid configs are rejected before saving
- **`admin: true` encapsulated** — callers don't need to remember the flag

All transformation functions should be pure: `(Config) → Config`. Side effects (SL API calls) are isolated in the factory's `getConfig`/`saveConfig` wrappers.

---

## SEO Contract

The SEO contract allows the Hub server (or any SSR layer) to generate metadata for search engines and social previews **without rendering the app's UI**.

### Why This Exists

SmartLinks apps run in iframes — search engines and social crawlers can't see their content. The server needs a way to ask each app: "What title, description, and structured data should this page have?"

Rather than HTTP endpoints (which add latency and infrastructure), the server loads the app's executor bundle in Node.js and calls `getSEO()` directly. This is fast (~1ms), requires no network round-trips, and uses pre-fetched entity data.

### How It Works

```text
1.  Server receives a page request
2.  Loads executor.umd.js for each app on the page (Node.js)
3.  Calls getSEO() with pre-fetched collection / product / proof data
4.  Merges results from all apps using priority-based resolution
5.  Injects into <head>: <title>, OG tags, JSON-LD, canonical URL
6.  Falls back to defaults if any app doesn't respond within 200ms
```

### Input

```typescript
interface SEOInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  /** Pre-authenticated SmartLinks SDK for any extra lookups */
  SL: typeof import('@proveanything/smartlinks');
  /** Pre-fetched objects — use these directly, avoid additional SL calls */
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
}
```

**Key principle:** The server pre-fetches collection, product, and proof data and passes them in. Your `getSEO()` should use these directly — **avoid making additional SL API calls** unless you need app-specific data (e.g., your app's config). This keeps execution well within the 200ms budget.

### Output

```typescript
interface SEOResult {
  /** Page title — singular field, highest-priority app wins */
  title?: string;
  /** Meta description — singular */
  description?: string;
  /** Open Graph image URL — singular */
  ogImage?: string;
  /** JSON-LD structured data — additive, merged from all apps */
  jsonLd?: Record<string, any> | Record<string, any>[];
  /** Plain text summary for AI crawlers — additive, concatenated */
  contentSummary?: string;
  /** Topic tags — additive, merged and deduplicated */
  topics?: string[];
}
```

### Multi-App Priority Merging

When multiple apps appear on the same page, the server merges their SEO output:

| Field | Strategy | Rule |
|-------|----------|------|
| `title` | **Singular** | Highest `meta.seo.priority` wins. Equal priority: first app in page order. |
| `description` | **Singular** | Same as title |
| `ogImage` | **Singular** | Same as title |
| `jsonLd` | **Additive** | All apps' JSON-LD arrays are concatenated |
| `contentSummary` | **Additive** | Concatenated from all apps |
| `topics` | **Additive** | Merged and deduplicated from all apps |

Set your app's priority in `app.manifest.json` (default is `0`, higher wins):

```json
"meta": {
  "seo": { "priority": 10 }
}
```

### Implementation Example

```typescript
// src/executor/seo.ts — Warranty app example
export function getSEO(input: SEOInput): SEOResult {
  const { product, collection } = input;
  const brandName = collection?.name ?? 'Product';

  return {
    title: product
      ? `Warranty — ${product.name}`
      : 'Warranty Registration',
    description: `Register your ${product?.name ?? 'product'} warranty with ${brandName}.`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Warranty — ${product?.name ?? brandName}`,
      description: `Warranty registration for ${product?.name ?? 'products'}.`,
    },
    topics: ['Warranty', 'Product Registration'],
  };
}
```

### Declaring SEO in the Manifest

```json
"meta": {
  "seo": {
    "strategy": "executor",
    "priority": 10,
    "contract": {
      "function": "getSEO",
      "input": ["collectionId", "appId", "productId", "proofId", "collection", "product", "proof", "SL"],
      "timeout": 200,
      "responseShape": {
        "title": "string",
        "description": "string",
        "ogImage": "string (URL)",
        "jsonLd": "object | object[]",
        "contentSummary": "string",
        "topics": "string[]"
      }
    }
  }
}
```

---

## LLM Content Contract

The `getLLMContent()` function generates structured markdown sections for AI crawler consumption. Unlike `getSEO()` (which produces HTML meta tags), this produces **readable content** — rich text that an LLM can ingest to understand what the page is about.

### Why This Exists

AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) want to understand page content, not just metadata. Since microapp content lives inside iframes that crawlers can't execute, each app provides a way to say: "Here's my content as readable markdown."

### Tiered AI Crawler Strategy

| Tier | Mechanism | Purpose |
|------|-----------|---------|
| **Discovery** | `/llms.txt` at site root | Table of contents — lists pages, products, links |
| **Per-route rendering** | Bot User-Agent detection | Rich semantic HTML injected before React root |
| **App-level sections** | `getLLMContent()` on each app's executor | Structured markdown sections merged by server |

AI crawlers naturally follow links from `/llms.txt` to individual pages. When they hit a page, the server detects the bot User-Agent, calls each embedded app's `getLLMContent()`, and injects the combined content as HTML that the crawler can read.

**Detected bots:**
```
GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-Web,
Google-Extended, CCBot, Amazonbot, anthropic-ai, Bytespider, cohere-ai
```

### Input

```typescript
interface LLMContentInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  SL: typeof import('@proveanything/smartlinks');
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
  /** Which page slug is being rendered */
  pageSlug?: string;
}
```

### Output

```typescript
interface LLMContentResult {
  sections: LLMContentSection[];
}

interface LLMContentSection {
  /** Section heading (e.g., "FAQ", "Warranty", "Product Manual") */
  heading: string;
  /** Markdown content */
  content: string;
  /** Sort order — lower numbers appear first (default: 100) */
  order?: number;
}
```

### Implementation Example

```typescript
// src/executor/llm-content.ts — FAQ app example
export async function getLLMContent(input: LLMContentInput): Promise<LLMContentResult> {
  const { collectionId, appId, product, SL } = input;

  const config = await SL.appConfiguration.getConfig({ collectionId, appId });
  const faqs = config?.faqs ?? [];

  if (faqs.length === 0) return { sections: [] };

  const content = faqs
    .map((faq: any) => `### ${faq.question}\n\n${faq.answer}`)
    .join('\n\n');

  return {
    sections: [
      {
        heading: product
          ? `${product.name} — Frequently Asked Questions`
          : 'Frequently Asked Questions',
        content,
        order: 50,
      },
    ],
  };
}
```

### Declaring LLM Content in the Manifest

```json
"executor": {
  "exports": ["createExecutor", "getSEO", "getLLMContent"],
  "llmContent": {
    "function": "getLLMContent",
    "timeout": 500,
    "responseShape": {
      "sections": "Array<{ heading: string, content: string, order?: number }>"
    }
  }
}
```

Note the longer timeout (500ms vs 200ms for SEO) — LLM content can involve fetching app-specific data and is only served to bots, so slightly higher latency is acceptable.

---

## Building an Executor

### File Structure

```
src/executor/
├── index.ts          # Factory function + re-exports
├── types.ts          # Public TypeScript types
├── seo.ts            # getSEO implementation
├── llm-content.ts    # getLLMContent implementation
└── ...               # App-specific mutation modules
```

### Vite Config

Create `vite.config.executor.ts`:

```typescript
import { defineConfig } from 'vite';
import path from 'path';

const ENABLE = process.env.VITE_ENABLE_EXECUTOR !== 'false';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,  // Append to existing dist/ — run after main builds
    lib: {
      entry: ENABLE
        ? path.resolve(__dirname, 'src/executor/index.ts')
        : path.resolve(__dirname, 'src/executor-stub.ts'),
      name: 'MyAppExecutor',        // window.MyAppExecutor for UMD
      formats: ['umd', 'es'],
      fileName: (format) => `executor.${format}.js`,
    },
    rollupOptions: {
      external: ['@proveanything/smartlinks'],
      output: {
        globals: { '@proveanything/smartlinks': 'SL' },
      },
    },
  },
});
```

**Key points:**
- `emptyOutDir: false` — the executor build appends to `dist/` after the main app builds
- Only `@proveanything/smartlinks` is externalised — all other dependencies are bundled
- `VITE_ENABLE_EXECUTOR=false` produces a stub, allowing CI to skip executor builds when not yet implemented

### Build Script

```json
{
  "scripts": {
    "build": "vite build && vite build --config vite.config.widget.ts && vite build --config vite.config.container.ts && vite build --config vite.config.executor.ts && node scripts/hash-bundles.mjs",
    "build:executor": "vite build --config vite.config.executor.ts"
  }
}
```

### Stub File

When the executor build is disabled, export an empty object:

```typescript
// src/executor-stub.ts
export {};
```

---

## Minimal Executor (SEO + LLM only)

Not every app needs full programmatic configuration. If you just want SEO and LLM support, the executor can be very small:

```typescript
// src/executor/index.ts
import type { SEOInput, SEOResult, LLMContentInput, LLMContentResult } from './types';

export function getSEO(input: SEOInput): SEOResult {
  const { product } = input;
  return {
    title: product ? `My Feature — ${product.name}` : 'My Feature',
    description: 'A useful feature for your products.',
    topics: ['My Feature'],
  };
}

export async function getLLMContent(input: LLMContentInput): Promise<LLMContentResult> {
  return { sections: [] };
}

export type { SEOInput, SEOResult, LLMContentInput, LLMContentResult };
```

The manifest declares what's exported, and the server only calls what's available.

---

## Full Executor (With Configuration API)

For apps that want AI-driven setup and programmatic configuration, add a factory function with mutation methods:

```typescript
// src/executor/index.ts
import type { ExecutorContext, SEOInput, SEOResult, LLMContentInput, LLMContentResult } from './types';

export function createMyAppExecutor(ctx: ExecutorContext) {
  const { collectionId, appId, SL } = ctx;

  async function getConfig() {
    try {
      return await SL.appConfiguration.getConfig({ collectionId, appId, admin: true });
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  async function saveConfig(config: MyConfig) {
    // Validate with Zod or similar, then save
    await SL.appConfiguration.setConfig({ collectionId, appId, config, admin: true });
  }

  return {
    getConfig,
    saveConfig,

    /** Update the welcome message shown to first-time visitors */
    async setWelcomeMessage(message: string) {
      const config = await getConfig();
      config.welcomeMessage = message;
      await saveConfig(config);
      return config;
    },

    async getSEO(input: SEOInput): Promise<SEOResult> { /* ... */ },
    async getLLMContent(input: LLMContentInput): Promise<LLMContentResult> { /* ... */ },

    /**
     * Returns a human-readable summary of current config.
     * Recommended for any app with configuration — enables conversational AI setup flows.
     */
    async describeCurrentConfig(): Promise<string> {
      const config = await getConfig();
      return `Welcome message: "${config.welcomeMessage}"`;
    },
  };
}
```

The `describeCurrentConfig()` method is strongly recommended — it gives AI orchestrators situational awareness of the app's current state, enabling natural-language setup flows ("What is the app currently configured to show?").

---

## TypeScript Types

```typescript
import type {
  ExecutorContext,       // { collectionId, appId, SL }
  SEOInput,             // getSEO() argument
  SEOResult,            // getSEO() return value
  LLMContentInput,      // getLLMContent() argument
  LLMContentResult,     // getLLMContent() return value
  LLMContentSection,    // { heading, content, order? }
  AppManifestExecutor,  // executor block in app.manifest.json
} from '@proveanything/smartlinks';
```

All types live in `src/types/appManifest.ts`.

---

## Design Principles

| Principle | Detail |
|-----------|--------|
| **Pure transformations** | Mutation functions are `(Config) → Config` with no side effects |
| **Pre-fetched entities** | `getSEO()` and `getLLMContent()` receive data — they don't fetch it themselves |
| **200ms SEO budget** | The server enforces a hard timeout. Keep `getSEO()` synchronous if possible |
| **500ms LLM budget** | `getLLMContent()` may fetch app config, but should remain fast |
| **`admin: true` encapsulated** | Write operations always include the flag — callers never need to remember |
| **Validate before save** | Use Zod or similar to reject invalid configs before writing |
| **Idempotent mutations** | Repeated calls with the same input produce the same result |
| **Externalise only the SDK** | Bundle everything else — keep the dependency contract minimal |

---

## Reference: Hub Executor

The Product Hub app provides the most comprehensive executor implementation as a reference. Its executor includes:

- **Theme & branding** — `applyBranding()`, `setFonts()`, `setColors()` with hex→HSL conversion
- **Pages & content** — `addPage()` (idempotent by slug), `removePage()`, `addBlockToPage()`, `generateHomepage()`
- **Navigation** — `addNavItem()`, `setNavItems()`, `syncNavToPages()`
- **Header & footer** — `setHeader()`, `setFooter()`, `setFooterFromCrawl()`
- **Compliance** — `setCompliance()` (cookie consent, analytics, legal)
- **SEO** — `getSEO()` with layered metadata (brand → page → product)
- **LLM content** — `getLLMContent()` producing overview, pages, product, and contact sections
- **Bulk setup** — `setupFromWebsite()` orchestrating all of the above from crawled data
- **Describe** — `describeCurrentConfig()` for AI situational awareness

See `public/ai-guide.md` in the Hub app for complete API documentation.
