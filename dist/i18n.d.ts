export type Catalog = {
    [key: string]: string | Catalog;
};
export interface I18nInitOptions {
    /** Where the catalogs are. Default: `i18n/` next to the app's page (its bundle). */
    baseUrl?: string;
    /** The language to start in. Default: the host's `lang`, else `<html lang>`, else the browser's, else English. */
    language?: string;
    /** Catalogs supplied directly instead of fetched (tests, or an app that bundles its own). Keyed by language. */
    catalogs?: Record<string, Catalog>;
    /** The app's source language. Default 'en'. */
    sourceLanguage?: string;
}
/**
 * The text direction for a language: 'rtl' for Arabic, Hebrew, Persian, Urdu and the like, else 'ltr'.
 * Set it on the page (`document.documentElement.dir`) so the layout mirrors; Tailwind's start/end
 * classes (ms-, pe-, text-start, ...) then follow by themselves.
 */
export declare function textDirection(code: string | null | undefined): 'rtl' | 'ltr';
/** The language the host asked for, in a normal form ('zh-hans' -> 'zh-Hans', 'FR' -> 'fr'). */
export declare function normalizeLanguage(code: string | null | undefined): string | null;
/** Which language to start in: what the host passed, else the page's, else the browser's, else the source. */
export declare function detectLanguage(): string;
/**
 * Load the source catalog and the current language's. Call once before the first render; safe to
 * call again. Never throws: with nothing found, `t` returns the keys' English or the keys.
 */
export declare function init(options?: I18nInitOptions): Promise<void>;
/** Switch language (loads its catalog first, so the switch happens in one step). */
export declare function setLanguage(lang: string): Promise<void>;
/** The language in use. */
export declare function language(): string;
/**
 * Translate `key` into the current language, falling back to the source language, then to
 * `values.defaultValue`, then to the key itself. `{{name}}` is filled from `values`; `count`
 * picks the plural form.
 */
export declare function t(key: string, values?: Record<string, unknown> & {
    count?: number;
    defaultValue?: string;
}): string;
/** Is there a translation for `key` in the current language (not just the English fallback)? */
export declare function has(key: string): boolean;
/** Subscribe to language/catalog changes. Returns an unsubscribe. (For React's useSyncExternalStore.) */
export declare function subscribe(fn: () => void): () => void;
/** Changes on every language or catalog change. (The snapshot for useSyncExternalStore.) */
export declare function snapshot(): number;
/** Dates and numbers in the current language. */
export declare const format: {
    number: (n: number, opts?: Intl.NumberFormatOptions) => string;
    date: (d: Date | string | number, opts?: Intl.DateTimeFormatOptions) => string;
    dateTime: (d: Date | string | number, opts?: Intl.DateTimeFormatOptions) => string;
};
/** Forget loaded catalogs and listeners (tests). */
export declare function _reset(): void;
