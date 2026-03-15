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
