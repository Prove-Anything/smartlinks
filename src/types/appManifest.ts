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
  /** CSS file -- absent if the bundle ships no styles */
  css?: string;
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
  };

  /**
   * Relative path to the admin configuration file (e.g. `"app.admin.json"`).
   * When present, fetch this file to get the full {@link AppAdminConfig}
   * (setup questions, import schema, tunable fields, metrics definitions).
   * Absent when the app has no admin UI.
   */
  admin?: string;

  /** Widget bundle definition. Presence means a widget bundle exists for this app. */
  widgets?: {
    files: AppManifestFiles;
    components: AppWidgetComponent[];
  };

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