/// <reference types="node" />
/// <reference types="node" />
import type { AppDataDeclaration, AppHeadlessDeclaration } from './headless.js';
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
/** What causes a server function to run. */
export type AppFunctionTriggerType = 'http' | 'event' | 'cron';
export interface AppFunctionTrigger {
    type: AppFunctionTriggerType;
    /** `event`: event types this function subscribes to, e.g. `['interaction.submitted:comp-entry']`. */
    eventTypes?: string[];
    /**
     * `cron`: standard 5-field crontab expression (`"0,30 * * * *"`, `"0 9 * * MON-FRI"`, or `@hourly` /
     * `@daily` / `@weekly` / `@monthly`), evaluated in UTC unless `timezone` is set. At most every 5 minutes.
     */
    schedule?: string;
    /** `cron`: IANA time zone the schedule is read in, e.g. `"Europe/London"` (follows summer time). Default UTC. */
    timezone?: string;
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
    /**
     * Default scope for `ctx.sl.appData.*` — `'collection'` (this collection; the default) or
     * `'global'` (the app's app-wide bucket, shared by every collection that installed it). A function
     * whose data is global-by-intent declares `'global'` and then just uses `appData.get()/set()`.
     * Per-call `{ scope }` and the `appData.global` / `appData.collection` handles override this.
     */
    dataScope?: 'collection' | 'global';
    /**
     * Data the platform fetches BEFORE the run and hands over as `ctx.inputs` — no round trip from your
     * code (for isolated functions, no network hop). Same authority and capabilities as the equivalent
     * `ctx.sl` read; a missing, denied or oversized (> 256 KB) input arrives as `null`, never an error.
     * Event-trigger functions get `entity` (the record the event is about) by default; `entity: false`
     * opts out. See server-functions.md → "Inputs".
     */
    inputs?: AppFunctionInputs;
    /** SDK/manifest API version this function targets (pinned for runtime compatibility). */
    apiVersion?: string;
    /** Exported handler name in the functions bundle. Defaults to `name`. */
    handler?: string;
    /**
     * Expose this function to the AI agent as a callable tool (an MCP-shaped facade over the function).
     * Only `http`-trigger functions can be exposed. The agent becomes just another caller surface, so
     * the function's visibility/authority/capabilities apply UNCHANGED — nothing new is granted. The
     * agent-supplied arguments arrive as the function's http request `body`. See agent-tools.md.
     */
    agent?: AppFunctionAgentExposure;
}
/** Opt-in that turns a server function into an agent-callable tool. See agent-tools.md. */
export interface AppFunctionAgentExposure {
    /** When true, offer this `http` function to the agent as a tool. */
    tool: boolean;
    /** Short human label for the tool (tool pickers / approval prompts). */
    title?: string;
    /** Model-facing description — when to use the tool (falls back to the function's `description`). */
    description?: string;
    /**
     * JSON Schema (`{ type: 'object', properties: … }`) for the arguments the agent supplies. They
     * arrive as the function's http request body. Strongly recommended — without it the agent is told
     * the tool takes a free-form object.
     */
    input?: Record<string, any>;
    /**
     * `'auto'` (default) = the agent may call it without confirmation. `'require'` = a human must
     * confirm before each call. Until the human-approval UX ships, `'require'` tools are NOT offered to
     * the autonomous server-side loop (they'd otherwise run unconfirmed).
     */
    approval?: 'auto' | 'require';
}
/** The `functions` block in `app.manifest.json`. Presence means the app ships server functions. */
export interface AppManifestFunctions {
    files: AppManifestFiles;
    definitions: AppFunctionDef[];
}
/** Scope + selector options for `ctx.sl.appData.*`. */
export interface AppDataOpts {
    /** `'collection'` (this collection) or `'global'` (the app's app-wide bucket). Defaults to the function's `dataScope`. */
    scope?: 'collection' | 'global';
    productId?: string;
    variantId?: string;
    batchId?: string;
    /** For `getData`/`setData`/`delete`: the keyed data item id. */
    dataId?: string;
    queries?: Record<string, any>;
}
/** Read/write handle for an app's own durable data. `set` deep-merges the singleton config blob. */
export interface AppDataHandle {
    get(opts?: AppDataOpts): Promise<any>;
    set(data: any, opts?: AppDataOpts): Promise<any>;
    getData(opts?: AppDataOpts): Promise<any>;
    setData(data: any, opts?: AppDataOpts): Promise<any>;
    delete(opts?: AppDataOpts): Promise<any>;
}
/**
 * The capability-gated SmartLinks surface handed to a server function. Two access modes:
 *  - by APP identity — `appData` / `appRecords` are THIS app's OWN data (any scope), gated by the
 *    declared capability only (the caller's role is irrelevant — it's the app's own namespace).
 *  - by CALLER identity — everything else (products, attestations, and `app(id)` cross-app reads)
 *    is bounded by what the invoking user could do through the permissioned API.
 */
export interface ServerFunctionSl {
    /** THIS app's records (own namespace). */
    appRecords: any;
    /** Products, scoped by caller authority + declared capability. */
    products: any;
    /** Attestations, scoped by caller authority + declared capability. */
    attestations: any;
    /**
     * THIS app's durable data/config. Default scope follows the function's declared `dataScope`
     * (else `collection`). `appData.global` / `appData.collection` force a scope regardless.
     * Own-data access is gated by `sl:data:read` / `sl:data:write` only.
     */
    appData: AppDataHandle & {
        global: AppDataHandle;
        collection: AppDataHandle;
    };
    /**
     * Read ANOTHER app's data in this collection, by CALLER identity — only what the invoking user
     * could read (admin sees all; otherwise public-filtered, private fields stripped). Read-only;
     * never another app's private/global store, never another collection. Gated by `sl:data:read`.
     */
    app(appId: string): {
        data: Pick<AppDataHandle, 'get' | 'getData'>;
    };
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
    sl: ServerFunctionSl;
    /**
     * Capability-gated secret access (both require the `secrets:<ref>` capability).
     * `get(ref)` resolves the collection's OWN secret first (a client's credential), then falls back
     * to the app-level secret (the developer's shared singleton, installed once per instance).
     * `app(ref)` reads the app-level secret only, skipping the collection store.
     */
    secrets: {
        get(ref: string): Promise<string | null>;
        app(ref: string): Promise<string | null>;
    };
    /** Who invoked this function. */
    caller: ServerFunctionCaller;
    /** Outbound HTTP — present only when the `network` capability is declared (host-scoped if `network:<host>`). */
    fetch: typeof fetch;
    /** Structured logging captured into run telemetry. */
    log: (message: string, data?: Record<string, any>) => void;
    /** Data prefetched for this run, per the definition's `inputs` (read-only; `{}` when none). */
    inputs: Readonly<ServerFunctionInputs>;
}
/** What a function asks to have prefetched (`AppFunctionDef.inputs`). */
export interface AppFunctionInputs {
    /** Event triggers: the record the event is about — product (needs `sl:products:read`), app record of
     *  this app (`sl:records:read`), or the interaction event itself. On by default; `false` opts out. */
    entity?: boolean;
    /** The collection's public record. */
    collection?: boolean;
    /** This app's config for the collection — e.g. its `interactionIds`. Needs `sl:data:read`. */
    appConfig?: boolean;
    /** Http triggers: a product named by the request. Needs `sl:products:read`. */
    product?: {
        from: `body.${string}` | `query.${string}` | 'path';
    };
}
/** `ctx.inputs` — what was prefetched for this run (keys you declared; `null` when unavailable). */
export interface ServerFunctionInputs {
    entity?: Record<string, any> | null;
    collection?: Record<string, any> | null;
    appConfig?: Record<string, any> | null;
    product?: Record<string, any> | null;
}
/** The HTTP request handed to an `http`-trigger function as `event`. */
export interface ServerFunctionHttpEvent<TBody = any> {
    method: string;
    /** Parsed JSON body (when the request was JSON). */
    body: TBody;
    query: Record<string, any>;
    /** Raw request headers (lower-cased keys). */
    headers: Record<string, any>;
    /** Raw request body bytes, when captured — for non-JSON inputs (XML, form, …). */
    rawBody?: string | Buffer | null;
    /** The request `content-type`, if any. */
    contentType?: string | null;
}
/**
 * The signature every SmartLinks server function implements.
 *
 * RETURN CONTRACT (http trigger): whatever you return **is** the HTTP response.
 *  - a plain value → JSON body, HTTP 200 (no `{ ok, result }` envelope);
 *  - a web-standard `Response` → passed through verbatim (your status, headers, content-type, body —
 *    XML, CSV, binary, redirect, custom status);
 *  - throwing → HTTP 500 `{ error, message, code }`. For expected errors, return a `Response` with
 *    your own 4xx/5xx.
 */
export type ServerFunctionHandler<TEvent = any, TResult = any> = (ctx: ServerFunctionContext, event: TEvent) => Promise<TResult> | TResult;
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
            options?: Array<{
                value: string;
                label: string;
            }>;
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
        interactions?: Array<{
            id: string;
            description?: string;
        }>;
        kpis?: Array<{
            name: string;
            compute?: string;
        }>;
    };
}
/**
 * SmartLinks App Manifest -- the app.manifest.json structure.
 *
 * Setup, import, tunable, and metrics configuration lives in a separate
 * `app.admin.json` file. Use the `admin` field to locate and fetch it.
 */
/** The caller-supplied params a public view expects. */
export interface PublicViewParams {
    /** Params the view REQUIRES to render (e.g. `['collectionId','pageId']`). */
    required?: string[];
    /** Params the view can use if present (e.g. `['orientation','theme']`). */
    optional?: string[];
}
/**
 * A declared PUBLIC VIEW of the app — a STANDALONE, freeform screen served over the app's single
 * public bundle (`index.html` → HashRouter), enumerable/targetable by the platform + Dev Hub instead
 * of guessing at undeclared hash routes. A view is `route` + fixed params (`set`) + caller `params`.
 *
 * PUBLIC VIEWS ARE NOT PORTAL. They are completely external, independent pages — display boards,
 * projector/kiosk screens, dashboards, public share pages. Their ONLY input is URL parameters (often a
 * `collectionId`, as a plain param). They expect NO portal wrapper, NO host-managed auth/session, and
 * NO physical-twin context (no QR/NFC/tag scan). They open at a URL and stand alone.
 *
 * This is distinct from the two PORTAL-side surfaces, which are declared elsewhere and are context-fed
 * by the physical twin the portal resolves:
 *  - WHERE the app renders inside portal (collection/product/batch/variant/proof) → the module
 *    registry `components.*` (see prove docs/design/module-registry-fields.md).
 *  - The different entry points portal MENUS/TABS/SIDE-MENUS link to (e.g. one app with a list view
 *    and a calendar view) → `linkable`/DeepLinkEntry below.
 * See docs/design/public-views.md.
 */
export interface PublicView {
    /** Stable id, unique within the app. */
    id: string;
    /** Human label (Dev Hub dropdown, platform pickers). */
    title: string;
    /** Hash route within the public bundle. Defaults to `/`. */
    route?: string;
    /** Query params this view PINS (e.g. `{ tvMode: 'true' }`), merged under the caller's params. */
    set?: Record<string, string>;
    /** The params the caller supplies via the URL. */
    params?: PublicViewParams;
}
export interface AppManifest {
    $schema?: string;
    meta?: {
        name: string;
        description?: string;
        version: string;
        platformRevision?: string;
        appId: string;
        /**
         * How this app's bundles are packaged, so the host knows how to load them:
         * - `"umd"` (default when absent) — host loads the UMD bundle (`files.js.umd`)
         *   via the CommonJS `require` shim, resolving shared deps from window globals.
         *   Every existing app keeps working with no change.
         * - `"dual"` — host prefers the ESM bundle (`files.js.esm`) when it has an import
         *   map for the declared `sharedDependencies` contract; falls back to UMD otherwise.
         * - `"esm"` — host loads ESM natively; if it has no matching import map it fails
         *   with an actionable error rather than a bare-specifier resolution crash.
         */
        moduleFormat?: 'umd' | 'esm' | 'dual';
        /**
         * Shared-dependency contract version this bundle was built against, e.g. `"v7"`
         * (see `SHARED_DEPENDENCY_CONTRACT_VERSION`). The host uses it to select a
         * compatible import map for the ESM load path.
         */
        sharedDependencies?: string;
        /**
         * The SmartLinks CSS baseline this bundle relies on, e.g. `"v1"`. A small, frozen,
         * `sl-`-namespaced set of structural helpers the SDK ships and the host guarantees
         * present. Container apps declare it and ship nothing; iframe apps import
         * `@proveanything/smartlinks/baseline.css`. Opt-in and additive. See docs/css-baseline.md.
         */
        cssBaseline?: string;
        /**
         * True if this app reads the host theme tokens (`--sl-color-*`, `--sl-radius-*`,
         * `--sl-font-*`) rather than hardcoding a palette — i.e. it follows the host's brand.
         * Lets a host's app browser show "follows your brand" vs "brings its own look", and turns
         * on the doctor's hardcoded-colour warning. Opt-in. See docs/theme-tokens.md.
         */
        respectsHostTheme?: boolean;
        /**
         * Theme-token contract version this app targets, e.g. `"v1"`. Pairs with
         * `@proveanything/smartlinks/theme.css`. See docs/theme-tokens.md.
         */
        themeTokens?: string;
        /**
         * Per-app namespaced UMD globals (R4.7+), e.g. `{ widgets: "MyAppWidgets" }`.
         * UMD-only: ESM bundles expose their exports through the module namespace and
         * don't need this. Absent → legacy bundle (colliding `window.SmartLinks{Surface}`).
         */
        globals?: Record<string, string>;
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
     * PORTAL deep-linkable states built into this app — the entry points the portal's menu system
     * (bottom menu, side menus, tabs) can link to. Use these when one app has several ways to enter/load
     * its portal component (e.g. a list view and a calendar view, or a viewer and an editor) that
     * different parts of portal should link to independently. These live INSIDE portal.
     * Fixed routes are declared here at build time; dynamic content entries (e.g. CMS pages) are stored
     * separately in `appConfig.linkable` — merge both for the full navigable set.
     * @see DeepLinkEntry
     */
    linkable?: DeepLinkEntry[];
    /**
     * The app's PUBLIC VIEWS — STANDALONE, external screens (display boards, kiosks/TVs, dashboards,
     * public pages) served over the single public bundle, so the platform + Dev Hub can enumerate,
     * preview, and target them. Declares `route` + fixed `set` params + caller `params` per view.
     * NOT portal: no portal wrapper, no host auth/session, no physical-twin context — URL params only.
     * For portal surfaces use `components.*` (where it renders) and `linkable` (portal menu entries).
     * See PublicView + docs/design/public-views.md.
     */
    publicViews?: PublicView[];
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
    /**
     * The app's public data model: its data types, how each is stored, fields, examples and read
     * recipes. Required for `headless`. @see AppDataDeclaration · docs/headless-providers.md
     */
    data?: AppDataDeclaration;
    /**
     * Opt-in: other sites and apps may install this app and use its content (a headless content
     * provider). Validated by `smartlinks-headless`. @see AppHeadlessDeclaration
     */
    headless?: AppHeadlessDeclaration;
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
