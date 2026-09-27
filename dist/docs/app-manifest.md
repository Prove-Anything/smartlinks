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
    "platformRevision": "R5",
    "moduleFormat": "dual",
    "sharedDependencies": "v7"
  },

  "admin": "app.admin.json",

  "widgets": {
    "instanceResolution": true,
    "instanceParam": "widgetId",
    "files": {
      "js": {
        "umd": "dist/widgets.umd.js",
        "esm": "dist/widgets.esm.js"
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
        "esm": "dist/containers.esm.js"
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

  "mobileAdmin": {
    "files": {
      "js": {
        "umd": "dist/mobile-admin.umd.js",
        "esm": "dist/mobile-admin.esm.js"
      },
      "css": null
    },
    "components": [
      {
        "name": "WarehousePickContainer",
        "description": "In-field operator admin surface.",
        "capabilities": ["nfc", "qr"],
        "offline": true
      }
    ]
  },

  "linkable": [
    { "title": "Home",     "path": "/" },
    { "title": "Gallery",  "path": "/gallery" },
    { "title": "Settings", "path": "/settings", "params": { "tab": "advanced" } }
  ],

  "records": {
    "nutrition": {
      "label": "Nutrition info",
      "cardinality": "singleton",
      "allowFacetRules": true,
      "scopes": ["collection", "rule", "product", "facet", "batch"],
      "defaultScope": "product"
    },
    "cooking_steps": {
      "label": "Cooking steps",
      "cardinality": "singleton",
      "allowFacetRules": false,
      "scopes": ["collection", "product"],
      "defaultScope": "product"
    }
  }
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
| `platformRevision` | string | ❌ | Platform revision tag this build targets, e.g. `"R5"` (see [host-dependency-contract.md](host-dependency-contract.md)) |
| `moduleFormat` | `"umd"` \| `"esm"` \| `"dual"` | ❌ | How the host loads this app's bundles. Absent = `"umd"`. See [Module format](#module-format-umd-vs-esm) below. |
| `sharedDependencies` | string | ❌ | Shared-dependency contract version the bundle was built against, e.g. `"v7"`. Used by the host to pick a compatible ESM import map. |
| `globals` | object | ❌ | Per-app namespaced UMD globals (R4.7+), e.g. `{ "widgets": "MyAppWidgets" }`. UMD-only; ESM bundles don't need it. |
| `seo.priority` | number | ❌ | Controls which app's `title`/`description`/`ogImage` wins when multiple apps are on the same page. Default `0`; higher wins. See the [Executor guide](executor.md). |

#### Module format (UMD vs ESM)

The host provides shared libraries (React, Radix, the SmartLinks SDK, LiquidJS…) as **singletons**
so apps never bundle their own. Two delivery mechanisms exist, and `meta.moduleFormat` tells the host
which to use:

| `moduleFormat` | Host behaviour |
|---|---|
| `"umd"` *(default)* | Loads `files.js.umd` via the CommonJS `require` shim; shared deps resolve from **window globals**. Every existing app works unchanged. |
| `"dual"` | Prefers `files.js.esm` when the host has an **import map** for the declared `sharedDependencies` version; **falls back to UMD** otherwise. The safe transition setting. |
| `"esm"` | Loads `files.js.esm` **natively**; if the host has no matching import map it fails with an actionable error rather than a bare-specifier crash. Use only once you know your hosts are on the contract. |

The ESM bundle is declared in the **same** `files.js` block as `esm` (there is no separate `jsEsm`
field):

```jsonc
"widgets": {
  "files": {
    "js": { "umd": "dist/widgets.umd.js", "esm": "dist/widgets.esm.js" },
    "css": "dist/widgets.css"
  }
}
```

An ESM bundle **must externalize exactly the shared-dependency contract** — read it from the SDK
(`SHARED_DEPENDENCY_SPECIFIERS`) rather than hard-coding it, and stamp the version you built against
into `meta.sharedDependencies`. See [host-dependency-contract.md](host-dependency-contract.md).

##### Validate before you ship: `smartlinks doctor`

Run the checker (shipped with the SDK) against your built app — it reads the same contract the host
serves, so the two can't drift:

```bash
npx smartlinks-doctor            # in the app dir, after building
```

It reads your manifest, and for every ESM surface confirms **every bare import in the bundle is a
contract entry**. A correctly-externalized ESM bundle inlines everything except the host singletons,
so anything else left as a bare import will either fail to resolve through the import map or silently
double-load (the duplicate-React class of bug). It also warns when a UMD app still declares stale
`*.es.js`/`*.esm.js` bundles the host will never load. Exit code is non-zero on violations, so it
drops straight into CI.

#### `build`

Optional build provenance. Recommended for the **Lovable dev publish** flow: stamp the content
hash your build already produces here so the platform can tell when a new version is live before it
registers (see [Deploying & registering](deploying-apps.md#a-from-lovable--hit-publish-no-key-anywhere-recommended-for-lovable-apps)).

| Field | Type | Description |
|-------|------|-------------|
| `build.hash` | string | Unique build/content hash — the platform waits for this to appear before registering, and uses it as the dev release version |
| `build.at` | string | ISO timestamp of the build (optional) |

```json
"build": { "hash": "a1b2c3d4", "at": "2026-09-20T10:00:00Z" }
```

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
      "esm": "dist/widgets.esm.js"
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
**Component fields** (same as widgets, plus):

| Field | Type | Description |
|-------|------|--------------|
| `name` | string | Exported component name |
| `description` | string | Human-readable description |
| `props.required` / `props.optional` | string[] | Required and optional prop names |
| `audience` | `"public"` \| `"admin"` \| `"both"` | Who can use/see this component. Defaults to `"public"`. |
| `scope` | `"collection"` \| `"product"` | Data scope hint. `"product"` means the component always renders in the context of a specific product. |
| `settings` | object | JSON Schema describing configurable settings |

#### `mobileAdmin`

Declares a **separate** mobile admin bundle — a sibling of `containers` with its own build output. Use this when the mobile admin surface needs a different runtime, native-only dependencies (Capacitor), or independent versioning. Omit if your app has no mobile admin surface.

See [mobile-admin-container.md](mobile-admin-container.md) for the `AdminMobileHostContext` prop contract, the capability matrix, event stream, error types, and build setup.

```json
"mobileAdmin": {
  "files": {
    "js": {
      "umd": "dist/mobile-admin.umd.js",
      "esm": "dist/mobile-admin.esm.js"
    },
    "css": null
  },
  "components": [
    {
      "name": "WarehousePickContainer",
      "description": "Pick orders by scanning NFC tags",
      "capabilities": ["nfc", "qr"],
      "offline": true
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `files.js.umd` | UMD bundle path — used for dynamic `<script>` loading |
| `files.js.esm` | ESM bundle path (optional but recommended) |
| `files.css` | CSS bundle path — set to `null` if no styles |
| `components[].name` | Exported component name (must match the UMD bundle export) |
| `components[].description` | Shown in the mobile launcher's app picker |
| `components[].capabilities` | Hardware capabilities this component needs or can use. See [capability list](mobile-admin-container.md#hardware-capabilities--the-capability-matrix). |
| `components[].offline` | Set to `true` if this component queues writes locally and needs offline sync support. |
#### `linkable`

Static deep-linkable states built into the app — fixed routes that exist regardless of per-collection content. Declared once at build time.

See the [Deep Link Discovery guide](deep-link-discovery.md) for the full dual-source pattern (static manifest routes + dynamic `appConfig.linkable`).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Human-readable label shown in menus and offered to AI agents |
| `path` | string | ❌ | Hash route within the app (defaults to `"/"` if omitted) |
| `params` | object | ❌ | App-specific query params appended to the URL — do **not** include platform params (`collectionId`, `productId`, etc.) |

#### `publicViews`

Declares the app's **public views** — the soft-routed entries over your single public bundle
(`index.html` → HashRouter): the contextual page, a display board, a kiosk/TV screen, etc. Without
this, those routes/modes are invisible to the platform and the Dev Hub. Each view is a `route` + fixed
`set` params + caller `params` + a `kind`; the `default` **contextual** view is the tag-tap target.
It's delivery-agnostic — the same view renders as a **page** (standalone, self-CSS, hash-routed, embed
in an iframe or open directly) or, for a contextual view, as a **component** (`PublicContainer`).
Not a separate build. (Distinct from `linkable`, which is deep-link discovery.)

```json
"publicViews": [
  { "id": "page",  "title": "Product page",  "kind": "contextual", "route": "/", "default": true,
    "params": { "required": ["collectionId"], "optional": ["productId", "proofId"] } },
  { "id": "board", "title": "Display board", "kind": "standalone", "route": "/preview",
    "params": { "required": ["collectionId", "appId", "pageId"], "optional": ["orientation"] } },
  { "id": "tv",    "title": "TV / big screen", "kind": "standalone", "route": "/",
    "set": { "tvMode": "true" }, "params": { "required": ["collectionId", "voteId"] } }
]
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Stable id, unique within the app |
| `title` | string | ✅ | Human label (Dev Hub dropdown, platform pickers) |
| `kind` | `"contextual"` \| `"standalone"` | ✅ | Context-aware (tag-tap) vs full-screen, non-contextual |
| `route` | string | ❌ | Hash route within the public bundle (defaults to `"/"`) |
| `set` | object | ❌ | Query params this view PINS (e.g. `{ "tvMode": "true" }`), merged under caller params |
| `params` | `{ required?: string[]; optional?: string[] }` | ❌ | The params the caller supplies |
| `default` | boolean | ❌ | The default contextual view — the tag-tap target (at most one) |

Read context the same way in every delivery with **`SL.readContext(props?)`** (merges props → hash →
search), instead of hand-rolling the `containerProps || hash || search` chain.

#### `records`

Declares which `app.records` record types the app stores, and which scopes each type supports. Required for any app that follows the [App Records Pattern](app-records-pattern.md). Omit if the app does not use scoped records.

The platform and the `<RecordsAdminShell>` from `@proveanything/smartlinks-utils-ui` read this block to render the right scope tabs, rule editor, and cardinality-appropriate right pane.

```json
"records": {
  "<recordType>": {
    "label": "Human-readable label",
    "cardinality": "singleton",
    "allowFacetRules": false,
    "scopes": ["collection", "product", "variant", "batch", "facet"],
    "defaultScope": "product"
  }
}
```

| Field             | Type     | Default | Description |
|-------------------|----------|---------|-------------|
| `label`           | string   | — | Human-readable label for the record type, used in headings and tabs. |
| `cardinality`     | string   | `'singleton'` | `'singleton'` — one record wins per scope (e.g. ingredients, nutrition). `'collection'` — every matching record is returned in resolution order (e.g. FAQs, recipes). Drives which hook to use on the public side (`useResolvedRecord` vs `useCollectedRecords`) and how the shell lays out the right pane. |
| `allowFacetRules` | boolean  | `false` | When `true`, the shell renders a **Rule** scope tab and embeds `<FacetRuleEditor>`. Add `'rule'` to `scopes` when setting this. |
| `scopes`          | string[] | — | Allowed scope kinds in resolution order. Valid values: `"collection"`, `"product"`, `"variant"`, `"batch"`, `"facet"`, `"proof"`, `"rule"`. `'rule'` is a synthetic scope holding `facetRule`-targeted records. `'collection'` replaces the legacy empty-ref catch-all — **there is no `'global'` scope**. |
| `defaultScope`    | string   | — | The scope the "Create new" button targets in the admin shell. Must be one of the declared `scopes`. |

An app may declare multiple record types under different keys (e.g. `"nutrition"` and `"cooking_steps"`). See [app-records-pattern.md](app-records-pattern.md) for the full admin + public pattern.

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

#### `functions`

Declares app-authored **server functions** — server-side handlers `(ctx, event) ⇒ result`
(http / event / cron), shipped in a self-contained UMD bundle. Omit if the app has no server
functions. The security model (`visibility`/`authority`/`capabilities`), the runtime surface, how
to build the bundle, and how to invoke are all in the **[Server Functions guide](server-functions.md)** —
this is just the manifest shape.

| Field | Type | Description |
|-------|------|-------------|
| `files.js.umd` | string | UMD bundle path (e.g. `dist/functions.umd.js`) — a self-contained bundle exporting each handler by name |
| `definitions[]` | object[] | One entry per function |
| `definitions[].name` | string | Function name; also the handler export name (override with `handler`) |
| `definitions[].trigger` | object | `{ type: "http"|"event"|"cron", … }` |
| `definitions[].visibility` | string | `admin` \| `public` (http only) — who may call it |
| `definitions[].authority` | string | `caller` \| `collection` — whose authority it runs as |
| `definitions[].capabilities` | string[] | Least-privilege grants (`sl:<res>:<read\|write>`, `network[:<host>]`, `secrets:<ref>`) |

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

## Widget settings schema (JSON Schema)

Each widget component's `settings` object uses **JSON Schema** to describe its configurable props, so schema-form renderers *and* AI orchestrators can auto-generate a config UI without per-widget code:

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
          "type": "string", "title": "Display Mode",
          "description": "How the widget renders",
          "enum": ["compact", "standard", "large"],
          "enumLabels": { "compact": "Icons only", "standard": "With names", "large": "Full cards" },
          "default": "standard", "order": 1
        },
        "showImage": { "type": "boolean", "title": "Show Product Image", "default": true, "order": 2 }
      }
    }
  }
]
```

| Field | Purpose |
|-------|---------|
| `type`, `enum` | Standard JSON Schema validation |
| `title` | Human-readable form label |
| `description` | Help text shown alongside the field |
| `enumLabels` | Friendly display names for enum values (`{ value → label }`) |
| `default` | Pre-selected value when no config exists |
| `order` | Field display order (lower number = higher) |

The schema serves both AI orchestrators (understand what a widget accepts, configure it conversationally) and schema-form renderers (auto-generate settings UIs).

## AI workflows the manifest enables

SmartLinks manifests are **AI-discoverable, -configurable, and -importable**: the structured manifest plus the prose `ai-guide.md` (start from [ai-guide-template.md](ai-guide-template.md)) let AI systems set up and populate apps without custom integration code. Three workflows read the manifest:

1. **Widget Builder** — reads `widgets.components[]` and each `settings` schema to embed a widget with correct props and auto-render its configuration UI.
2. **Setup Wizard** — reads `setup` from `app.admin.json`: walks `setup.questions[]`, validates against `setup.configSchema`, optionally auto-generates content via `SL.ai`, then saves per `setup.saveWith`.
3. **Data Importer** — reads `import` from `app.admin.json`: builds a CSV template from `import.fields[]`, normalises rows, and calls `import.saveWith.method` per row (multi-app imports merge fields into one CSV).

When you change your config shape, keep all three in sync: `app.manifest.json` (widget `settings`, containers, executor, linkable), `app.admin.json` (setup / import / tunable), and `ai-guide.md` (prose guidance).

This declarative model is canonical and works today. An app may **optionally** layer agent tools on top — a function that reads the declaration and returns a *context-adapted* result (e.g. "which setup questions for this collection?") — without changing the schema. That's additive and opt-in; see [agent-tools.md](agent-tools.md).

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
