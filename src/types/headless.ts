// =============================================================================
// Headless providers — an app's declared public data model, and its promise that other sites and
// apps can install it and use its content (FAQ, media, content pages, articles…).
//
// Two manifest blocks:
//   data      the app's data types: how each is stored, its fields (JSON types, zone, public or not),
//             examples, and how to read it. Useful on its own (typed reads, generated editors).
//   headless  the opt-in: purpose, categories, which types a site renders, where the owner edits the
//             content, rendering + SEO guidance. Requires a complete `data` block.
//
// Validate with `smartlinks-headless` (scripts/headless-check.mjs) or validateHeadless() (SDK).
// Docs: docs/headless-providers.md.
// =============================================================================

/** Field value types. Keep this set small: generated editors, typed reads and sites rely on it. */
export type AppDataFieldType =
  | 'string'
  | 'text'        // multi-line plain text
  | 'richtext'    // HTML
  | 'markdown'
  | 'number'
  | 'boolean'
  | 'date'        // ISO date (YYYY-MM-DD)
  | 'datetime'    // ISO date-time
  | 'enum'        // one of `options` (fixed by the app), or of a value list the admin edits (`list`)
  | 'url'
  | 'image'       // { url, alt? } or an asset ref
  | 'file'        // { url, name? } or an asset ref
  | 'ref'         // id of another declared type (`to`) — or a platform entity ('product', 'contact', 'proof')
  | 'string[]'
  | 'ref[]'
  | 'json';       // anything else (avoid where a typed field fits)

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
  /**
   * For `enum`: the allowed values, fixed by the app (changed by a release). Use this when the app's
   * code branches on the values (job stages, statuses).
   */
  options?: string[];
  /**
   * For `enum`: the id of a value list in `data.lists` whose values the admin edits (hold reasons,
   * teams). Instead of `options`. The record stores the value's code. docs/admin-lists-and-pickers.md
   */
  list?: string;
}

/** One value of a value list. The code never changes and is never removed (only switched off). */
export interface AppValueListValue {
  /** Stored on records. Letters, digits, dots, dashes; unique in the list. */
  code: string;
  /** What people see; free to change. Defaults to the code. */
  label?: string;
  /** Switched off: hidden from new choices, still shown on records that carry it. Default true. */
  active?: boolean;
}

/**
 * A value list the app declares: values only (a code, a label, on or off), edited by the admin in
 * Studio. The manifest's `values` are the starting values, used until the admin first saves the list.
 */
export interface AppValueList {
  label: string;
  description?: string;
  values: AppValueListValue[];
  /** The admin may add, rename, reorder and switch off values. Default true. */
  editable?: boolean;
  /** Anyone may read it (`SL.app.options` on the public API). Default false: admins and server code. */
  public?: boolean;
}

/** How a type's items are stored. */
export type AppDataStorage =
  /** App records (`SL.app.records`), filtered by recordType. The usual home for content. */
  | { kind: 'record'; recordType: string }
  /** App cases (`SL.app.cases`) — requests that get resolved. */
  | { kind: 'case'; category?: string }
  /** App threads (`SL.app.threads`) — discussions, Q&A, reviews. */
  | { kind: 'thread'; slug?: string }
  /** App configuration (`SL.appConfiguration.getConfig` / data items) — settings, small lists. */
  | { kind: 'config'; key?: string };

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
  listing?: { sort?: string[]; filters?: string[] };
  /** Real-shaped sample items (the `data` zone's JSON). At least one for a headless type. */
  examples?: Array<Record<string, unknown>>;
  /** SDK recipes a site uses. If omitted, the checker prints the standard ones for the storage. */
  read?: { list?: string; get?: string; notes?: string };
  /** The app version that introduced this type. */
  since?: string;

  // ── For pickers and set-up lists (docs/admin-lists-and-pickers.md) ──
  /** The field a picker shows. Default: `label` (then `name`, then `title`). */
  label?: string;
  /** A field shown as a picker entry's second line (e.g. a machine's stage). */
  sublabel?: string;
  /** A boolean field that switches an entry off (false = off). Default: the record's status. */
  activeField?: string;
  /** A number field pickers sort by. Default: `sortOrder` (then `order`), then the label. */
  orderField?: string;
  /** A short list (dozens to hundreds): `ctx.sl.appRecords.all` reads it from cache. */
  small?: boolean;
  /** A set-up list the admin keeps: Studio shows a generated list and form for it. Implies `checked`. */
  setup?: boolean;
  /** Records of this type are checked against these fields when saved (400 INVALID_RECORD). */
  checked?: boolean;
}

export interface AppDataDeclaration {
  /** Semver of the data contract itself (not the app's version). Major = breaking. */
  schemaVersion: string;
  types: Record<string, AppDataType>;
  /** Value lists the admin edits, by id (lowercase, dashes): picked by `enum` fields with `list`. */
  lists?: Record<string, AppValueList>;
}

/** What kind of content a provider supplies — how site builders find it. */
export type HeadlessCategory =
  | 'faq'
  | 'media'        // images, video, galleries
  | 'pages'        // configurable content pages
  | 'articles'     // blog, news, guides
  | 'catalog'      // product-like listings
  | 'events'
  | 'locations'
  | 'people'       // team, staff, authors
  | 'reviews'      // testimonials, ratings
  | 'documents'    // manuals, downloads
  | 'forms'
  | 'other';

export const HEADLESS_CATEGORIES: readonly HeadlessCategory[] = [
  'faq', 'media', 'pages', 'articles', 'catalog', 'events', 'locations', 'people', 'reviews', 'documents', 'forms', 'other',
];

/** SEO structured-data helpers a site should use with this content (`SL.seo.schema.*`). */
export type HeadlessSeoHelper = 'faqPage' | 'product' | 'article' | 'breadcrumbs' | 'organization' | 'localBusiness';

export interface AppHeadlessDeclaration {
  /** What content this app holds, and when a site should use it rather than build its own. */
  purpose: string;
  categories: HeadlessCategory[];
  /** The `data` types a site renders (the rest are supporting types, e.g. categories). */
  primaryTypes: string[];
  /** Where the business edits the content — the app's admin inside SmartLinks. Sites never build an editor for it. */
  editedIn: { label: string; adminPath?: string; notes?: string };
  /** How a site should present it. */
  render?: { guidance?: string; seo?: HeadlessSeoHelper[] };
}
