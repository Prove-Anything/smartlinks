# App Configuration Files: `app.manifest.json` & `app.admin.json`

Every SmartLinks app ships with two JSON configuration files that the platform reads to understand what the app is and how to configure it. They have clearly separated responsibilities:

| File | Role | Loaded by |
|------|------|-----------|
| `app.manifest.json` | **Definitional** — what the app *is*: its bundles, components, static routes | Platform on every page load; portals; AI orchestrators |
| `app.admin.json` | **Operational** — how to *set up and tune* the app: setup questions, import schemas, tunable fields, metrics | Admin UI, AI-assisted setup flows |

The manifest always references the admin config via its `admin` field. Consumers that only need to *render* the app work entirely from the manifest. Only admin/setup flows need to fetch `app.admin.json`.

```text
┌─────────────────────────────────────────────────────────────────┐
│ Platform boot sequence                                          │
│                                                                 │
│  1. GET /collection/:id/widgets                                 │
│       └─→ CollectionWidgetsResponse { apps: [...] }            │
│              each app has: manifest, widget bundle, container   │
│                                                                 │
│  2. manifest.admin  ──→  "app.admin.json"  (pointer only)      │
│                                                                 │
│  3. Admin UI fetches app.admin.json when setup/config needed    │
└─────────────────────────────────────────────────────────────────┘
```

---

## `app.manifest.json`

The manifest is loaded automatically by the platform for every collection page. Keep it lean — it is fetched on every widget render.

### Full Schema

```json
{
  "$schema": "https://smartlinks.app/schemas/app-manifest-v1.json",

  "meta": {
    "appId": "my-app",
    "name": "My App",
    "description": "A short human-readable description of what this app does.",
    "version": "1.2.0",
    "platformRevision": "2026-01-01"
  },

  "admin": "app.admin.json",

  "widgets": {
    "instanceResolution": true,
    "instanceParam": "widgetId",
    "files": {
      "js": {
        "umd": "dist/widgets.umd.js",
        "esm": "dist/widgets.es.js"
      },
      "css": "dist/widgets.css"
    },
    "components": [
      {
        "name": "SummaryWidget",
        "description": "Compact summary card for use on product pages.",
        "sizes": ["compact", "standard"],
        "props": {
          "required": ["collectionId", "appId"],
          "optional": ["productId", "proofId"]
        },
        "settings": {
          "showImage": { "type": "boolean", "default": true }
        }
      }
    ]
  },

  "containers": {
    "files": {
      "js": {
        "umd": "dist/containers.umd.js",
        "esm": "dist/containers.es.js"
      },
      "css": "dist/containers.css"
    },
    "components": [
      {
        "name": "FullApp",
        "description": "Full public app experience with internal routing.",
        "props": {
          "required": ["collectionId", "appId"],
          "optional": ["productId", "proofId", "className"]
        }
      }
    ]
  },

  "linkable": [
    { "title": "Home",     "path": "/" },
    { "title": "Gallery",  "path": "/gallery" },
    { "title": "Settings", "path": "/settings", "params": { "tab": "advanced" } }
  ]
}
```

### Field Reference

#### `meta`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `appId` | string | ✅ | Unique identifier for the app (slug-style, e.g. `"warranty-tracker"`) |
| `name` | string | ✅ | Human-readable display name |
| `description` | string | ❌ | Short description shown in app directories and AI context |
| `version` | string | ✅ | SemVer string, e.g. `"1.2.0"` |
| `platformRevision` | string | ❌ | ISO date string marking the platform API revision this build targets |
| `seo.priority` | number | ❌ | Controls which app's `title`/`description`/`ogImage` wins when multiple apps are on the same page. Default `0`; higher wins. See the [Executor guide](executor.md). |

#### `admin`

A relative path (from the app's public root) to the `app.admin.json` file. Omit entirely if the app has no admin UI.

```json
"admin": "app.admin.json"
```

#### `widgets`

Declares the widget bundle. Omit if the app has no widget component.

| Field | Description |
|-------|-------------|
| `files.js.umd` | UMD bundle path — used for dynamic `<script>` loading |
| `files.js.esm` | ESM bundle path — used for `import()` / native ES modules (optional but recommended) |
| `files.css` | CSS bundle path — omit if the widget ships no styles |
| `instanceResolution` | Optional boolean. When `true`, this app supports resolving configured widget instances by ID from app config |
| `instanceParam` | Optional string. Query/hash param used for instance lookup. Defaults to `"widgetId"` |
| `components[]` | One entry per exported widget component (see below) |

**Widget instance resolution**

Apps such as widget toolkits often store reusable widget instances in collection-scoped app config, for example under `config.widgets.launch-countdown`. When your widget bundle can self-configure from one of those stored instances, declare that capability in the manifest:

```json
"widgets": {
  "instanceResolution": true,
  "instanceParam": "widgetId",
  "files": {
    "js": {
      "umd": "dist/widgets.umd.js",
      "esm": "dist/widgets.es.js"
    },
    "css": null
  },
  "components": [
    {
      "name": "WidgetToolkitResolver",
      "description": "Resolves and renders a configured widget instance by ID."
    }
  ]
}
```

This tells the platform and other apps that they can deep-link into a stored widget instance using a URL or embed context such as `?appId=widget-toolkit&widgetId=launch-countdown`.

**Component fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Exported component name (must match the bundle export) |
| `description` | string | Human-readable description for portals and AI |
| `sizes` | string[] | Supported size hints: `"compact"`, `"standard"`, `"large"` |
| `props.required` | string[] | Props that must be provided for the component to render |
| `props.optional` | string[] | Props the component can use if provided |
| `settings` | object | JSON-Schema-style settings the widget accepts from its host |

#### `containers`

Same structure as `widgets` but declares the full-app container bundle. Lazy-loaded on demand.

See the [Containers guide](containers.md) for details on the container component model.

#### `linkable`

Static deep-linkable states built into the app — fixed routes that exist regardless of per-collection content. Declared once at build time.

See the [Deep Link Discovery guide](deep-link-discovery.md) for the full dual-source pattern (static manifest routes + dynamic `appConfig.linkable`).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Human-readable label shown in menus and offered to AI agents |
| `path` | string | ❌ | Hash route within the app (defaults to `"/"` if omitted) |
| `params` | object | ❌ | App-specific query params appended to the URL — do **not** include platform params (`collectionId`, `productId`, etc.) |

#### `executor`

Declares the executor bundle — a standalone JS library for programmatic configuration, server-side SEO, and LLM content generation. Omit if the app has no executor.

See the **[Executor Model guide](executor.md)** for the full build setup, SEO contract, LLM content contract, and implementation patterns.

| Field | Type | Description |
|-------|------|-------------|
| `files.js.umd` | string | UMD bundle path |
| `files.js.esm` | string | ESM bundle path |
| `factory` | string | Name of the factory function that creates an executor instance |
| `exports` | string[] | All named exports — tells consumers what's available without loading the bundle |
| `description` | string | Human-readable summary for AI orchestrators |
| `llmContent.function` | string | Name of the `getLLMContent` export |
| `llmContent.timeout` | number | Timeout in ms (default 500) |

---

## `app.admin.json`

Fetched only by the admin UI and AI-assisted setup flows — never loaded on the public-facing page. Keep setup logic and configuration schemas here, not in the manifest.

### Full Schema

```json
{
  "$schema": "https://smartlinks.app/schemas/app-admin-v1.json",

  "aiGuide": "ai-guide.md",

  "setup": {
    "description": "Configure the app for this collection.",
    "questions": [
      {
        "id": "brandName",
        "prompt": "What is your brand name?",
        "type": "text",
        "required": true
      },
      {
        "id": "primaryColor",
        "prompt": "Choose a primary theme colour.",
        "type": "select",
        "options": [
          { "value": "blue",  "label": "Blue" },
          { "value": "green", "label": "Green" },
          { "value": "red",   "label": "Red" }
        ]
      },
      {
        "id": "welcomeEnabled",
        "prompt": "Show a welcome message to first-time visitors?",
        "type": "boolean",
        "default": true
      }
    ],
    "configSchema": {
      "brandName":      { "type": "string" },
      "primaryColor":   { "type": "string" },
      "welcomeEnabled": { "type": "boolean" }
    },
    "saveWith": {
      "method": "appConfiguration.setConfig",
      "scope": "collection",
      "admin": true,
      "note": "Saved under the collection scope; readable by all app users."
    },
    "contentHints": {
      "welcomeMessage": {
        "aiGenerate": true,
        "prompt": "Write a short, friendly welcome message for a brand called {{brandName}}."
      }
    }
  },

  "import": {
    "description": "Bulk-import items via CSV.",
    "scope": "collection",
    "fields": [
      { "name": "title",       "type": "string",  "required": true  },
      { "name": "description", "type": "string"                     },
      { "name": "imageUrl",    "type": "string"                     },
      { "name": "price",       "type": "number",  "default": 0      }
    ],
    "csvExample": "title,description,imageUrl,price\nWidget A,Our first widget,https://example.com/img.jpg,9.99",
    "saveWith": {
      "method": "appObjects.createRecord",
      "scope": "collection",
      "admin": true
    }
  },

  "tunable": {
    "description": "Adjust display options after initial setup.",
    "fields": [
      {
        "name": "displayMode",
        "description": "How items are laid out on the page.",
        "type": "select",
        "options": ["grid", "list", "carousel"]
      },
      {
        "name": "itemsPerPage",
        "description": "Number of items shown per page.",
        "type": "number"
      }
    ]
  },

  "metrics": {
    "interactions": [
      { "id": "view",     "description": "User viewed an item." },
      { "id": "click",    "description": "User clicked a link or CTA." },
      { "id": "purchase", "description": "User completed a purchase." }
    ],
    "kpis": [
      { "name": "Click-through Rate", "compute": "click / view" },
      { "name": "Conversion Rate",    "compute": "purchase / view" }
    ]
  }
}
```

> `dynamic-select` widget pickers are a reasonable future extension for admin schemas, but they are not a built-in question type in the SDK today. For now, treat widget-instance selection as an app-level UI convention powered by `appConfiguration.listWidgetInstances()`.

### Field Reference

#### `aiGuide`

Path (relative to the app's public root) to a Markdown file providing natural-language context for AI-assisted configuration. See the [AI Guide Template](ai-guide-template.md).

```json
"aiGuide": "ai-guide.md"
```

---

#### `setup`

Drives the initial configuration wizard shown to admins when they first install the app for a collection.

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Intro text shown at the top of the setup wizard |
| `questions` | array | Ordered list of questions to ask the admin (see below) |
| `configSchema` | object | JSON-Schema-style shape of the resulting config object |
| `saveWith` | object | Which SDK method and scope to use when persisting answers |
| `contentHints` | object | Keys that AI should auto-generate based on question answers |

**`questions[]` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Key used in the saved config and in `contentHints` references |
| `prompt` | string | ✅ | Question text displayed to the admin |
| `type` | string | ✅ | Input type: `"text"`, `"number"`, `"boolean"`, `"select"`, `"multiselect"`, `"textarea"` |
| `required` | boolean | ❌ | Whether an answer is mandatory (default `false`) |
| `default` | any | ❌ | Pre-filled default value |
| `options` | array | ❌ | For `select`/`multiselect`: `[{ "value": "...", "label": "..." }]` |

**`saveWith` fields:**

| Field | Type | Description |
|-------|------|-------------|
| `method` | string | SDK method to call, e.g. `"appConfiguration.setConfig"` |
| `scope` | string | Data scope: `"collection"`, `"product"`, or `"proof"` |
| `admin` | boolean | Whether the save call requires admin credentials |
| `note` | string | Human-readable note explaining the save behaviour |

**`contentHints`:**

A map from content key to AI generation instructions. The AI setup flow uses this to pre-fill content fields after the admin answers setup questions.

```json
"contentHints": {
  "welcomeMessage": {
    "aiGenerate": true,
    "prompt": "Write a short welcome message for a brand called {{brandName}}."
  }
}
```

---

#### `import`

Defines a CSV bulk-import flow available in the admin UI.

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Explains what will be imported and how |
| `scope` | string | Data scope for the imported records |
| `fields` | array | Column definitions — `name`, `type`, `required`, `default`, `description` |
| `csvExample` | string | A sample CSV string (shown as a download template) |
| `saveWith` | object | SDK method used to persist each imported row (same shape as `setup.saveWith`) |

---

#### `tunable`

Post-setup display options that admins can tweak without re-running the full setup wizard.

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Explains what these settings control |
| `fields` | array | Tunable parameters — `name`, `description`, `type`, `options[]` |

---

#### `metrics`

Declares what interactions and KPIs the app reports. Used by the platform's analytics dashboard.

| Field | Type | Description |
|-------|------|-------------|
| `interactions` | array | Interaction event types: `{ id, description }` |
| `kpis` | array | Derived metrics: `{ name, compute }` — `compute` is a simple expression over interaction IDs |

---

## Reading the Files at Runtime

### Manifest — available from the widgets endpoint

```typescript
import { appObjects } from '@proveanything/smartlinks';
import type { AppManifest, AppAdminConfig } from '@proveanything/smartlinks';

// The manifest arrives inline in the widgets response
const { apps } = await SL.collection.getWidgets(collectionId);
const { manifest, widget, container, admin: adminUrl } = apps[0];

// manifest.meta.name, manifest.linkable, manifest.widgets.components, …
```

### Admin config — fetch separately, only when needed

```typescript
// adminUrl is the fully-resolved URL from CollectionAppWidget.admin
if (adminUrl) {
  const adminConfig: AppAdminConfig = await fetch(adminUrl).then(r => r.json());
  // adminConfig.setup.questions, adminConfig.tunable.fields, …
}
```

---

## TypeScript Types

```typescript
import type {
  AppManifest,           // app.manifest.json
  AppAdminConfig,        // app.admin.json
  DeepLinkEntry,         // one entry in manifest.linkable or appConfig.linkable
  AppWidgetComponent,    // one entry in manifest.widgets.components
  AppContainerComponent,
  AppManifestExecutor,   // executor block in app.manifest.json
  AppBundle,             // { js, css, source?, styles? }
  AppManifestFiles,      // { js: { umd, esm? }, css? }
  CollectionAppWidget,   // one app in the /widgets response
  CollectionWidgetsResponse,
  // Executor types
  ExecutorContext,       // { collectionId, appId, SL }
  SEOInput,
  SEOResult,
  LLMContentInput,
  LLMContentResult,
  LLMContentSection,
} from '@proveanything/smartlinks';
```

All types live in `src/types/appManifest.ts`.
