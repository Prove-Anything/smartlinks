// src/types/appManifest.ts

/**
 * A bundle (widget or container) as returned by the collection widgets endpoint.
 *
 * The server currently returns URLs only. In future it may also inline the file
 * contents when bundles are small or frequently accessed. Clients should check
 * for inline content first and fall back to loading the URL.
 *
 *   if (bundle.source) {
 *     // inline JS -- create a Blob URL or inject directly
 *   } else if (bundle.js) {
 *     // load from URL
 *   }
 */
export interface AppBundle {
  /** URL to the JavaScript file -- load if `source` is absent */
  js: string | null;
  /** URL to the CSS file -- load if `styles` is absent */
  css: string | null;
  /** Inlined JavaScript source (present when server bundles it inline) */
  source?: string;
  /** Inlined CSS styles (present when server bundles it inline) */
  styles?: string;
}

/**
 * The files section inside a widgets or containers block.
 */
export interface AppManifestFiles {
  js: {
    /** UMD bundle -- used for script-tag / dynamic loading */
    umd: string;
    /** ESM bundle -- used for native ES module loading */
    esm?: string;
  };
  /**
   * CSS file path — set to `null` (or omit) when the bundle ships no CSS.
   * Most widgets and containers use Tailwind/shadcn classes from the parent and produce no CSS file.
   * Only set to a non-null string if an actual CSS file exists in dist/;
   * a non-null value pointing to a missing file will cause a 404 in the parent portal.
   */
  css?: string | null;
}

/** A single widget component defined in the manifest */
export interface AppWidgetComponent {
  name: string;
  description?: string;
  sizes?: Array<'compact' | 'standard' | 'large' | string>;
  props?: {
    required?: string[];
    optional?: string[];
  };
  /** JSON-Schema-style settings the widget accepts */
  settings?: Record<string, any>;
}

/** Widget bundle declaration in `app.manifest.json`. */
export interface AppManifestWidgets {
  files: AppManifestFiles;
  components: AppWidgetComponent[];
  /** Whether this app supports resolving configured widget instances by ID. */
  instanceResolution?: boolean;
  /** Query/hash parameter name used for instance resolution. Defaults to `widgetId`. */
  instanceParam?: string;
}

/** A single container component defined in the manifest */
export interface AppContainerComponent {
  name: string;
  description?: string;
  props?: {
    required?: string[];
    optional?: string[];
  };
}

/**
 * A single navigable state exposed by a SmartLinks app.
 * Used in both `app.manifest.json` (static routes) and `appConfig.linkable` (dynamic content entries).
 *
 * @example
 *   // In app.manifest.json — static routes, declared at build time
 *   { "title": "Gallery", "path": "/gallery" }
 *   { "title": "Advanced Settings", "path": "/settings", "params": { "tab": "advanced" } }
 *
 *   // In appConfig.linkable — dynamic content, synced at runtime
 *   { "title": "About Us", "params": { "pageId": "about-us" } }
 */
export interface DeepLinkEntry {
  /** Human-readable label shown in menus and offered to AI agents */
  title: string;
  /**
   * Hash route path within the app (optional).
   * Defaults to "/" if omitted.
   * @example "/gallery"
   */
  path?: string;
  /**
   * App-specific query params appended to the hash route URL.
   * Do NOT include platform context params (collectionId, appId, productId, etc.) —
   * those are injected by the platform automatically.
   */
  params?: Record<string, string>;
  /**
   * When `true`, this entry is also available as a dynamic data context for widgets
   * (in addition to being a navigable page / container route).
   *
   * Entries with `widget: true` appear in the widget config picker so an admin can
   * select this dataset to drive how the widget renders. The widget receives `params`
   * and decides its own presentation — no separate rendering contract is required.
   *
   * Omit (or `false`) for entries that are only meaningful as full-page navigation
   * (e.g. multi-step forms, settings pages, checkout flows).
   */
  widget?: true;
}

/**
 * Context object passed to every executor factory function.
 */
export interface ExecutorContext {
  collectionId: string;
  appId: string;
  /** Pre-initialised SmartLinks SDK — passed in to avoid duplicate instances */
  SL: any;
}

/**
 * Input passed to an executor's `getSEO()` function.
 * The server pre-fetches collection/product/proof and passes them in;
 * avoid making extra SL calls inside getSEO() to stay within the 200ms budget.
 */
export interface SEOInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  SL: any;
  /** Pre-fetched collection object */
  collection?: Record<string, any>;
  /** Pre-fetched product object */
  product?: Record<string, any>;
  /** Pre-fetched proof object */
  proof?: Record<string, any>;
}

/**
 * Return value from an executor's `getSEO()` function.
 * Singular fields (title, description, ogImage) use highest-priority-wins merging across apps.
 * Additive fields (jsonLd, contentSummary, topics) are merged from all apps on the page.
 */
export interface SEOResult {
  /** Page title — singular, highest `meta.seo.priority` wins */
  title?: string;
  /** Meta description — singular */
  description?: string;
  /** Open Graph image URL — singular */
  ogImage?: string;
  /** JSON-LD structured data — additive, concatenated from all apps */
  jsonLd?: Record<string, any> | Record<string, any>[];
  /** Plain text summary for AI crawlers — additive, concatenated */
  contentSummary?: string;
  /** Topic tags — additive, merged and deduplicated */
  topics?: string[];
}

/** A single section returned by an executor's `getLLMContent()` function */
export interface LLMContentSection {
  /** Section heading displayed in the rendered HTML and read by AI crawlers */
  heading: string;
  /** Markdown content */
  content: string;
  /** Sort order — lower numbers appear first (default: 100) */
  order?: number;
}

/**
 * Input passed to an executor's `getLLMContent()` function.
 * Similar to SEOInput but includes `pageSlug` for page-aware content.
 * Timeout is 500ms (longer than SEO — LLM content may fetch app config).
 */
export interface LLMContentInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  SL: any;
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
  /** Which page slug is being rendered */
  pageSlug?: string;
}

/** Return value from an executor's `getLLMContent()` function */
export interface LLMContentResult {
  sections: LLMContentSection[];
}

/**
 * The `executor` block in `app.manifest.json`.
 * Declares the executor bundle and its exported capabilities.
 */
export interface AppManifestExecutor {
  files: AppManifestFiles;
  /** Name of the factory function that creates a configured executor instance */
  factory?: string;
  /** All named exports from the bundle */
  exports?: string[];
  /** Human-readable description for AI orchestrators and admin UIs */
  description?: string;
  /** LLM content contract — declares the getLLMContent function and its timeout */
  llmContent?: {
    function: string;
    timeout?: number;
    responseShape?: Record<string, any>;
  };
}

// ---------------------------------------------------------------------------
// Server functions ("edge functions") — app-authored server-side code.
//
// A server function is arbitrary server-side JavaScript an app deploys into
// SmartLinks. It runs on one contract — `async (ctx, event) => result` — where
// `ctx` is a SmartLinks SDK the platform has PRE-SCOPED to the function's
// declared authority, plus capability-gated secrets, the caller's identity, and
// (when declared) outbound fetch. The function never holds a raw key or a
// superuser client: authority is injected by the platform as a narrowed handle,
// never ambient. See docs/server-functions.md.
// ---------------------------------------------------------------------------

/** What causes a server function to run. */
export type AppFunctionTriggerType = 'http' | 'event' | 'cron';

export interface AppFunctionTrigger {
  type: AppFunctionTriggerType;
  /** `event`: event types this function subscribes to, e.g. `['interaction.submitted:comp-entry']`. */
  eventTypes?: string[];
  /** `cron`: standard 5-field crontab expression, evaluated in UTC. */
  schedule?: string;
  /** `http`: URL path segment the function is exposed at (defaults to the function `name`). */
  route?: string;
  /** `http`: accepted HTTP methods (defaults to `['POST']`). */
  methods?: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>;
}

/** Who is allowed to invoke an `http`-triggered function. */
export type AppFunctionVisibility = 'admin' | 'public';

/**
 * Whose authority the function runs with — i.e. what `ctx.sl` can do.
 * - `caller`     — runs as the invoking user (their session/JWT). The secure default.
 * - `collection` — runs with collection-admin authority over THIS collection only
 *                  (never a global superuser). Required for `public` functions that
 *                  must perform a privileged server-side action; the author is then
 *                  responsible for validating input and preventing abuse.
 */
export type AppFunctionAuthority = 'caller' | 'collection';

/** One server function declared in the manifest. */
export interface AppFunctionDef {
  /** Stable identifier, unique within the app, e.g. `'submitCompetitionEntry'`. */
  name: string;
  description?: string;
  trigger: AppFunctionTrigger;
  /**
   * `http` only. `admin` = authenticated admin surface; `public` = publicly callable.
   * Ignored for `event`/`cron` (no external caller). Defaults to `admin`.
   */
  visibility?: AppFunctionVisibility;
  /**
   * Whose authority `ctx.sl` carries. Defaults to `caller` (secure by default).
   * `event`/`cron` functions have no caller and always run as `collection`.
   */
  authority?: AppFunctionAuthority;
  /**
   * Required acknowledgment for the sharp edge: a `public` + `collection` function is
   * publicly callable AND runs with elevated collection authority. Set `elevated: true`
   * to confirm you intend that and accept responsibility for validating requests —
   * without it, install/validation fails. Ignored for any other visibility/authority combo.
   */
  elevated?: boolean;
  /**
   * Least-privilege capabilities this function needs, surfaced at install for
   * consent and capped at runtime — even for `collection`-authority functions.
   * e.g. `['sl:records:write', 'network:api.example.com', 'secrets:syndigo-key']`.
   * Grammar: `sl:<resource>:<read|write>`, `network` (or `network:<host>`), `secrets:<ref>`.
   */
  capabilities?: string[];
  /** SDK/manifest API version this function targets (pinned for runtime compatibility). */
  apiVersion?: string;
  /** Exported handler name in the functions bundle. Defaults to `name`. */
  handler?: string;
}

/** The `functions` block in `app.manifest.json`. Presence means the app ships server functions. */
export interface AppManifestFunctions {
  files: AppManifestFiles;
  definitions: AppFunctionDef[];
}

/** Identity of whoever invoked a server function. */
export interface ServerFunctionCaller {
  /** Authenticated user id, or `null` for anonymous/public/system invocations. */
  userId: string | null;
  /** True when no authenticated user is present (public/anonymous call, or event/cron). */
  anonymous: boolean;
  /** Request origin/referer, when available (`http` trigger). */
  origin?: string | null;
  /** Client IP, when available (`http` trigger). */
  ip?: string | null;
  /** How the function was triggered. */
  via: AppFunctionTriggerType;
}

/**
 * The context handed to every SmartLinks server function. The platform builds a
 * fresh one per invocation and pre-scopes each handle to the function's declared
 * authority + capabilities. The function receives only handles already narrowed
 * to what it declared — no raw keys, no ambient superuser client.
 */
export interface ServerFunctionContext {
  collectionId: string;
  appId: string;
  /**
   * SmartLinks SDK, pre-scoped to the function's declared `authority`:
   *  - `caller`     → scoped to the invoking user (their JWT).
   *  - `collection` → scoped to a collection-admin principal for THIS collection
   *                   only — never a global superuser.
   * Declared `capabilities` cap what these calls may do.
   */
  sl: any;
  /** Capability-gated secret access. `get(ref)` resolves only refs granted via `secrets:<ref>`. */
  secrets: { get(ref: string): Promise<string | null> };
  /** Who invoked this function. */
  caller: ServerFunctionCaller;
  /** Outbound HTTP — present only when the `network` capability is declared (host-scoped if `network:<host>`). */
  fetch: typeof fetch;
  /** Structured logging captured into run telemetry. */
  log: (message: string, data?: Record<string, any>) => void;
}

/** The signature every SmartLinks server function implements. */
export type ServerFunctionHandler<TEvent = any, TResult = any> = (
  ctx: ServerFunctionContext,
  event: TEvent,
) => Promise<TResult> | TResult;

/**
 * Shape of `app.admin.json` -- the separate admin configuration file pointed to
 * by `AppManifest.admin`. Fetch this file yourself when you need setup / import /
 * tunable / metrics details; it is not inlined in the manifest.
 *
 * @example
 *   const adminUrl = new URL(manifest.admin!, appBaseUrl);
 *   const adminConfig: AppAdminConfig = await fetch(adminUrl).then(r => r.json());
 */
export interface AppAdminConfig {
  $schema?: string;

  /**
   * Path (relative to the app's public root) to an AI guide markdown file.
   * Provides natural-language context for AI-assisted configuration.
   * @example "ai-guide.md"
   */
  aiGuide?: string;

  setup?: {
    description?: string;
    questions?: Array<{
      id: string;
      prompt: string;
      type: string;
      default?: any;
      required?: boolean;
      options?: Array<{ value: string; label: string }>;
    }>;
    configSchema?: Record<string, any>;
    saveWith?: {
      method: string;
      scope: 'collection' | 'product' | string;
      admin?: boolean;
      note?: string;
    };
    contentHints?: Record<string, {
      aiGenerate?: boolean;
      prompt?: string;
    }>;
  };

  import?: {
    description?: string;
    scope?: string;
    fields?: Array<{
      name: string;
      type: string;
      required?: boolean;
      default?: any;
      description?: string;
    }>;
    csvExample?: string;
    saveWith?: {
      method: string;
      scope: string;
      admin?: boolean;
      note?: string;
    };
  };

  tunable?: {
    description?: string;
    fields?: Array<{
      name: string;
      description?: string;
      type: string;
      options?: string[];
    }>;
  };

  metrics?: {
    interactions?: Array<{ id: string; description?: string }>;
    kpis?: Array<{ name: string; compute?: string }>;
  };
}

/**
 * SmartLinks App Manifest -- the app.manifest.json structure.
 *
 * Setup, import, tunable, and metrics configuration lives in a separate
 * `app.admin.json` file. Use the `admin` field to locate and fetch it.
 */
export interface AppManifest {
  $schema?: string;

  meta?: {
    name: string;
    description?: string;
    version: string;
    platformRevision?: string;
    appId: string;
    /**
     * SEO configuration for this app.
     * `priority` controls which app's singular fields (title, description, ogImage) win
     * when multiple apps appear on the same page. Default is 0; higher wins.
     */
    seo?: {
      strategy?: 'executor' | string;
      priority?: number;
      contract?: {
        function: string;
        input?: string[];
        timeout?: number;
        responseShape?: Record<string, string>;
      };
    };
  };

  /**
   * Relative path to the admin configuration file (e.g. `"app.admin.json"`).
   * When present, fetch this file to get the full {@link AppAdminConfig}
   * (setup questions, import schema, tunable fields, metrics definitions).
   * Absent when the app has no admin UI.
   */
  admin?: string;

  /** Widget bundle definition. Presence means a widget bundle exists for this app. */
  widgets?: AppManifestWidgets;

  /** Container bundle definition. Presence means a container bundle exists. */
  containers?: {
    files: AppManifestFiles;
    components: AppContainerComponent[];
  };

  /**
   * Static deep-linkable states built into this app.
   * These are fixed routes that exist regardless of content — declared once at build time.
   * Dynamic content entries (e.g. CMS pages) are stored separately in `appConfig.linkable`.
   * Consumers should merge both sources to get the full set of navigable states.
   * @see DeepLinkEntry
   */
  linkable?: DeepLinkEntry[];

  /**
   * Executor bundle declaration. Present when the app ships a programmatic executor
   * for AI-driven configuration, server-side SEO, and LLM content generation.
   * @see AppManifestExecutor
   */
  executor?: AppManifestExecutor;

  /**
   * Server functions ("edge functions") this app deploys into SmartLinks —
   * arbitrary server-side code triggered by http, events, or cron, each running
   * with a declared authority + least-privilege capabilities.
   * @see AppManifestFunctions
   */
  functions?: AppManifestFunctions;

  [key: string]: any;
}

/**
 * One app entry in the collection widgets response.
 */
export interface CollectionAppWidget {
  appId: string;
  manifest: AppManifest;
  /** Widget bundle -- always present (apps without widgets are excluded from the response) */
  widget: AppBundle;
  /** Container bundle -- null when the app has no containers */
  container: AppBundle | null;
  /** URL to the admin configuration JSON -- null when the app has no admin config */
  admin: string | null;
}

/**
 * Response from GET /api/v1/public/collection/:collectionId/widgets
 */
export interface CollectionWidgetsResponse {
  apps: CollectionAppWidget[];
}

/**
 * Options for fetching collection widgets
 */
export interface GetCollectionWidgetsOptions {
  /** Bypass server cache and fetch fresh manifests */
  force?: boolean;
}