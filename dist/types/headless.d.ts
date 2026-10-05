/** Field value types. Keep this set small: generated editors, typed reads and sites rely on it. */
export type AppDataFieldType = 'string' | 'text' | 'richtext' | 'markdown' | 'number' | 'boolean' | 'date' | 'datetime' | 'enum' | 'url' | 'image' | 'file' | 'ref' | 'string[]' | 'ref[]' | 'json';
export interface AppDataField {
    type: AppDataFieldType;
    label?: string;
    description?: string;
    required?: boolean;
    /** Translated per language (string / text / richtext / markdown only). */
    localized?: boolean;
    /**
     * The JSONB zone it lives in (app objects): `data` (default), `owner`, or `admin`. Only `data`
     * can be public; `admin` is never readable on public endpoints.
     */
    zone?: 'data' | 'owner' | 'admin';
    /** Readable by anonymous visitors (when the item's visibility is public). */
    public?: boolean;
    /** For `ref` / `ref[]`: the declared type id, or 'product' | 'contact' | 'proof'. */
    to?: string;
    /** For `enum`: the allowed values. */
    options?: string[];
}
/** How a type's items are stored. */
export type AppDataStorage = 
/** App records (`SL.app.records`), filtered by recordType. The usual home for content. */
{
    kind: 'record';
    recordType: string;
}
/** App cases (`SL.app.cases`) — requests that get resolved. */
 | {
    kind: 'case';
    category?: string;
}
/** App threads (`SL.app.threads`) — discussions, Q&A, reviews. */
 | {
    kind: 'thread';
    slug?: string;
}
/** App configuration (`SL.appConfiguration.getConfig` / data items) — settings, small lists. */
 | {
    kind: 'config';
    key?: string;
};
export interface AppDataType {
    /** What one item is, in a sentence. */
    description: string;
    storage: AppDataStorage;
    /** The visibility items normally have (app objects): public, owner or admin. Default public. */
    visibility?: 'public' | 'owner' | 'admin';
    /** What an item can be attached to (app objects' anchor columns). */
    anchors?: Array<'product' | 'variant' | 'batch' | 'proof' | 'contact'>;
    fields: Record<string, AppDataField>;
    /** How a site normally lists them. */
    listing?: {
        sort?: string[];
        filters?: string[];
    };
    /** Real-shaped sample items (the `data` zone's JSON). At least one for a headless type. */
    examples?: Array<Record<string, unknown>>;
    /** SDK recipes a site uses. If omitted, the checker prints the standard ones for the storage. */
    read?: {
        list?: string;
        get?: string;
        notes?: string;
    };
    /** The app version that introduced this type. */
    since?: string;
}
export interface AppDataDeclaration {
    /** Semver of the data contract itself (not the app's version). Major = breaking. */
    schemaVersion: string;
    types: Record<string, AppDataType>;
}
/** What kind of content a provider supplies — how site builders find it. */
export type HeadlessCategory = 'faq' | 'media' | 'pages' | 'articles' | 'catalog' | 'events' | 'locations' | 'people' | 'reviews' | 'documents' | 'forms' | 'other';
export declare const HEADLESS_CATEGORIES: readonly HeadlessCategory[];
/** SEO structured-data helpers a site should use with this content (`SL.seo.schema.*`). */
export type HeadlessSeoHelper = 'faqPage' | 'product' | 'article' | 'breadcrumbs' | 'organization' | 'localBusiness';
export interface AppHeadlessDeclaration {
    /** What content this app holds, and when a site should use it rather than build its own. */
    purpose: string;
    categories: HeadlessCategory[];
    /** The `data` types a site renders (the rest are supporting types, e.g. categories). */
    primaryTypes: string[];
    /** Where the business edits the content — the app's admin inside SmartLinks. Sites never build an editor for it. */
    editedIn: {
        label: string;
        adminPath?: string;
        notes?: string;
    };
    /** How a site should present it. */
    render?: {
        guidance?: string;
        seo?: HeadlessSeoHelper[];
    };
}
