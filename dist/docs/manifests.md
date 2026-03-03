# AI-Native App Manifests

SmartLinks apps are designed to be **AI-discoverable, AI-configurable, and AI-importable**. Every app ships with a structured manifest and a prose guide that allow AI systems to set up, configure, and populate apps without custom integration code.

---

## The Split Manifest

The manifest is split into two files so the public portal never loads admin-only configuration data.

```text
app.manifest.json   ←  lean, always loaded (widget render, SEO, executor discovery)
app.admin.json      ←  loaded on-demand (setup wizards, import, AI config flows)
```

### `app.manifest.json` — always loaded

| Section | Purpose | AI Consumer |
|---------|---------|-------------|
| `meta` | App identity, version, appId, SEO priority | All workflows |
| `admin` | Pointer to `app.admin.json` | Admin orchestrators |
| `widgets` | Bundle files + component definitions + settings schemas | Widget Builder |
| `containers` | Bundle files + component definitions | Container Loader |
| `executor` | Bundle files, factory name, exports list | Server / AI |
| `linkable` | Static deep-link routes | Portal menus / AI nav |

```json
{
  "meta": { "name": "My App", "appId": "my-app", "version": "1.0.0" },
  "admin": "app.admin.json",
  "widgets": {
    "files": {
      "js": { "umd": "dist/widgets.umd.js", "esm": "dist/widgets.es.js" },
      "css": null
    },
    "components": [
      {
        "name": "MyWidget",
        "description": "Compact summary card.",
        "sizes": ["compact", "standard", "large"],
        "settings": { ... }
      }
    ]
  },
  "containers": {
    "files": {
      "js": { "umd": "dist/containers.umd.js", "esm": "dist/containers.es.js" },
      "css": null
    },
    "components": [{ "name": "PublicContainer", "description": "Full app view." }]
  },
  "executor": {
    "files": { "js": { "umd": "dist/executor.umd.js", "esm": "dist/executor.es.js" } },
    "factory": "createMyAppExecutor",
    "exports": ["createMyAppExecutor", "getSEO", "getLLMContent"],
    "description": "Programmatic configuration and SEO API for My App."
  },
  "linkable": [
    { "title": "Home", "path": "/" },
    { "title": "Gallery", "path": "/gallery" }
  ]
}
```

> ⚠️ **`css` is `null` by default.** Most widgets and containers use Tailwind/shadcn classes inherited from the parent and produce **no CSS output file**. Set `"css": null` in the manifest. Only set it to a filename if your widget/container ships a custom CSS file that actually exists in `dist/`. The parent portal checks this value before injecting a `<link>` tag — a non-null value pointing to a missing file will cause a 404.

---

### `app.admin.json` — loaded on-demand

| Section | Purpose | AI Consumer |
|---------|---------|-------------|
| `aiGuide` | Pointer to `ai-guide.md` prose instructions | All AI workflows |
| `setup` | Setup wizard: questions, config schema, save instructions | Setup Wizard |
| `import` | Bulk data import: field definitions, CSV shape, API calls | Data Importer |
| `tunable` | Runtime-adjustable settings | AI Optimizer |
| `metrics` | Tracked interactions and KPIs | Analytics Advisor |

The admin orchestrator fetches the manifest, reads the `admin` pointer, and fetches `app.admin.json` only when needed — never on public page loads.

See the [App Configuration Files reference](app-manifest.md) for the full field-by-field schema for both files.

---

## Widget Settings Schema

Each widget component in `app.manifest.json` should include a `settings` object using **JSON Schema** to describe its configurable props. This enables schema-form libraries and AI orchestrators to auto-generate configuration UIs without per-widget code.

```json
"components": [
  {
    "name": "MyWidget",
    "description": "What this widget does",
    "sizes": ["compact", "standard", "large"],
    "settings": {
      "type": "object",
      "properties": {
        "displayMode": {
          "type": "string",
          "title": "Display Mode",
          "description": "How the widget renders",
          "enum": ["compact", "standard", "large"],
          "enumLabels": {
            "compact": "Icons only",
            "standard": "With names",
            "large": "Full cards"
          },
          "default": "standard",
          "order": 1
        },
        "showImage": {
          "type": "boolean",
          "title": "Show Product Image",
          "default": true,
          "order": 2
        }
      }
    }
  }
]
```

| Field | Purpose |
|-------|---------|
| `type`, `enum` | Standard JSON Schema for validation |
| `title` | Human-readable label for form rendering |
| `description` | Help text shown alongside the field |
| `enumLabels` | Friendly display names for enum values (`{ value → label }`) |
| `default` | Pre-selected value when no configuration exists |
| `order` | Field display order in rendered forms (lower number = higher position) |

The `settings` schema serves dual purposes: AI orchestrators use it to understand what a widget accepts and generate configuration conversationally; schema-form renderers (e.g., in admin consoles) use it to auto-generate settings UIs.

---

## The AI Guide (`ai-guide.md`)

A companion Markdown file deployed alongside the manifest provides **natural-language instructions** for AI orchestrators. The admin config references it via `"aiGuide": "ai-guide.md"` — orchestrators resolve and fetch it relative to the manifest URL.

While the manifest is structured data, the AI guide provides prose context, nuance, and step-by-step instructions that help an LLM drive setup wizards, imports, and troubleshooting flows conversationally.

Use the [AI Guide Template](ai-guide-template.md) as your starting point.

---

## Three AI Workflows

### 1. Widget Builder

An AI fetches `app.manifest.json`, reads `widgets.components[]` including the `settings` JSON Schema for each widget, and can:
- Generate React code to embed the widget with correct props
- Auto-render a configuration UI from the settings schema
- Understand valid size hints and required vs optional props

### 2. Setup Wizard

An AI reads `setup` from `app.admin.json` to drive a conversational configuration flow:

1. Walk the user through each `setup.questions[]` entry
2. Validate answers against `setup.configSchema` (JSON Schema)
3. Optionally use `setup.contentHints` to auto-generate content via `SL.ai.chat.completions`
4. Save using the `setup.saveWith` instructions (method, scope, admin flag)

The AI guide (`ai-guide.md`) provides prose instructions on how to handle each question, what sensible defaults look like, and what to do if the user is unsure.

### 3. Data Importer

An AI reads `import` from `app.admin.json` to:

1. Generate a CSV template from `import.fields[]` (with types, required flags, and examples)
2. Normalise user-provided data against field types
3. Call `import.saveWith.method` for each row

For multi-app imports, fields from multiple manifests can be merged into a single CSV template.

---

## Maintaining the Manifest

When you change your app's configuration shape, update all three files together:

| File | What to update |
|------|---------------|
| `app.manifest.json` | `widgets.components[].settings`, `containers`, `executor.exports`, `linkable` |
| `app.admin.json` | `setup.questions`, `setup.configSchema`, `import.fields`, `tunable.fields` |
| `ai-guide.md` | Prose instructions, validation rules, examples, and any new question guidance |

Keeping all three in sync ensures AI orchestrators, setup wizards, and data importers all work from consistent, accurate information.

---

## Related Guides

| Guide | What it covers |
|-------|---------------|
| [App Configuration Files](app-manifest.md) | Full field-by-field reference for both JSON files |
| [Executor Model](executor.md) | Building `executor.umd.js` — SEO, LLM content, config mutations |
| [Deep Link Discovery](deep-link-discovery.md) | `linkable` — static and dynamic navigable states |
| [AI Guide Template](ai-guide-template.md) | Starter template for `ai-guide.md` |
| [AI & Chat Completions](ai.md) | `SL.ai` — used in `contentHints` auto-generation |
