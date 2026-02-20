/**
 * A bundle (widget or container) as returned by the collection widgets endpoint.
 *
 * The server currently returns URLs only. In future it may also inline the file
 * contents when bundles are small or frequently accessed. Clients should check
 * for inline content first and fall back to loading the URL.
 *
 *   if (bundle.source) {
 *     // inline JS — create a Blob URL or inject directly
 *   } else if (bundle.js) {
 *     // load from URL
 *   }
 */
export interface AppBundle {
    /** URL to the JavaScript file — load if `source` is absent */
    js: string | null;
    /** URL to the CSS file — load if `styles` is absent */
    css: string | null;
    /** Inlined JavaScript source (present when server bundles it inline) */
    source?: string;
    /** Inlined CSS styles (present when server bundles it inline) */
    styles?: string;
}
/**
 * A single widget defined in the manifest.
 * Presence of the `widgets` array means a widget bundle exists for this app.
 */
export interface AppWidgetDefinition {
    name: string;
    description?: string;
    sizes?: Array<'compact' | 'standard' | 'large' | string>;
    props?: {
        required?: string[];
        optional?: string[];
    };
}
/**
 * A single container defined in the manifest.
 * Presence of the `containers` array means a container bundle exists for this app.
 * Containers are full-page / embedded components (larger than widgets, no iframe needed).
 */
export interface AppContainerDefinition {
    name: string;
    description?: string;
    props?: {
        required?: string[];
        optional?: string[];
    };
}
/**
 * SmartLinks App Manifest — the app.manifest.json structure.
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
    /** Presence means a widget bundle (widgets.umd.js / widgets.css) exists */
    widgets?: AppWidgetDefinition[];
    /** Presence means a container bundle (containers.umd.js / containers.css) exists */
    containers?: AppContainerDefinition[];
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
    [key: string]: any;
}
/**
 * One app entry in the collection widgets response.
 */
export interface CollectionAppWidget {
    appId: string;
    manifest: AppManifest;
    /** Widget bundle — always present (apps without widgets are excluded from the response) */
    widget: AppBundle;
    /** Container bundle — null when the app has no containers */
    container: AppBundle | null;
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
