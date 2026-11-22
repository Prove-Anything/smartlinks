// src/i18n.ts
//
// An app's own words, in the person's language: buttons, labels, messages. (Translating CONTENT —
// product names, page text — is `translations.resolve`; this is the app's fixed strings.)
//
// How it fits together (prove docs/design/multi-language.md 8a):
//   - The app keeps its English as keys in `public/i18n/en.json`, so the build ships it at
//     `<bundle>/i18n/en.json`. That is the app's only translation job.
//   - When the app is published, the platform translates the English into the admin languages it
//     supports and adds `<bundle>/i18n/<lang>.json` (e.g. zh-Hans.json). An app may ship its own
//     `<lang>.json` too: its keys win, the platform fills the gaps.
//   - At run time the host says which language: `?lang=` (Studio passes the person's Studio
//     language), later changes arrive live as `smartlinks:root-state` messages. A key missing in
//     that language shows its English. Nothing ever shows a raw key unless English lacks it too.
//
// Framework-free. In React, re-render on a language change with useSyncExternalStore:
//
//   import { i18n } from '@proveanything/smartlinks'
//   await i18n.init()                                   // once, before first render
//   export function useT() {
//     useSyncExternalStore(i18n.subscribe, i18n.snapshot)
//     return i18n.t
//   }
//   const t = useT();  t('contacts.add')  t('contacts.count', { count: 3 })
//
// Catalog format (the same shape i18next uses, so files move between tools):
//   { "contacts": { "add": "Add contact", "count_one": "{{count}} contact", "count_other": "{{count}} contacts" } }
//   Nested keys are read with dots. `{{name}}` is replaced from the values. With `count`, the plural
//   form for the language is picked (`_one`, `_other`, …; Chinese has only `_other`).
import { readContext } from './context.js';
let source = 'en';
let current = 'en';
let base = null;
const loaded = new Map();
const supplied = new Map();
const listeners = new Set();
let version = 0;
let listening = false;
function emit() {
    version++;
    listeners.forEach((fn) => {
        try {
            fn();
        }
        catch ( /* a listener's own problem */_a) { /* a listener's own problem */ }
    });
}
function bundleBase() {
    if (base)
        return base;
    try {
        // The page's own folder: an app served at .../apps/<id>/<channel>/admin.html#/... finds i18n/ beside it.
        return new URL('i18n/', document.baseURI).toString();
    }
    catch (_a) {
        return 'i18n/';
    }
}
/** Languages written right to left (Arabic, Hebrew, Persian, Urdu, Pashto, Yiddish, Dhivehi, Kurdish (Sorani), Sindhi, Uyghur). */
const RTL = /^(ar|he|iw|fa|ur|ps|yi|dv|ckb|sd|ug)(-|$)/i;
/**
 * The text direction for a language: 'rtl' for Arabic, Hebrew, Persian, Urdu and the like, else 'ltr'.
 * Set it on the page (`document.documentElement.dir`) so the layout mirrors; Tailwind's start/end
 * classes (ms-, pe-, text-start, ...) then follow by themselves.
 */
export function textDirection(code) {
    return code && RTL.test(String(code).trim()) ? 'rtl' : 'ltr';
}
/** The language the host asked for, in a normal form ('zh-hans' -> 'zh-Hans', 'FR' -> 'fr'). */
export function normalizeLanguage(code) {
    if (!code || typeof code !== 'string')
        return null;
    const m = /^([a-z]{2,3})(?:[-_]([a-z]{4}))?(?:[-_]([a-z]{2}|\d{3}))?$/i.exec(code.trim());
    if (!m)
        return null;
    const [, lang, script, region] = m;
    return [lang.toLowerCase(), script && script[0].toUpperCase() + script.slice(1).toLowerCase(), region && region.toUpperCase()]
        .filter(Boolean)
        .join('-');
}
/**
 * The file a language is served as. Chinese is kept by script: zh-CN / zh-SG / bare zh read
 * zh-Hans, zh-TW / zh-HK / zh-MO read zh-Hant. A region otherwise falls back to its language
 * (fr-CA -> fr) when there is no file for the region.
 */
function candidates(lang) {
    const out = [lang];
    const [l, second] = lang.split('-');
    if (l === 'zh') {
        const traditional = /^(Hant|TW|HK|MO)$/i.test(second || '');
        out.push(traditional ? 'zh-Hant' : 'zh-Hans');
    }
    if (second && l !== 'zh')
        out.push(l);
    return Array.from(new Set(out));
}
/** Which language to start in: what the host passed, else the page's, else the browser's, else the source. */
export function detectLanguage() {
    try {
        const fromHost = normalizeLanguage(readContext().lang);
        if (fromHost)
            return fromHost;
        const root = typeof document !== 'undefined' ? document.documentElement : undefined;
        if (root && typeof root.getAttribute === 'function') {
            const fromPage = normalizeLanguage(root.getAttribute('lang'));
            if (fromPage)
                return fromPage;
        }
        if (typeof navigator !== 'undefined') {
            const fromBrowser = normalizeLanguage(navigator.language);
            if (fromBrowser)
                return fromBrowser;
        }
    }
    catch ( /* not in a browser */_a) { /* not in a browser */ }
    return source;
}
/** Mark the page with the language in use (screen readers, fonts), where there is a page. */
function setPageLanguage(lang) {
    try {
        const root = typeof document !== 'undefined' ? document.documentElement : undefined;
        if (root && typeof root.setAttribute === 'function')
            root.setAttribute('lang', lang);
    }
    catch ( /* not a browser page */_a) { /* not a browser page */ }
}
async function fetchCatalog(lang) {
    if (supplied.has(lang))
        return supplied.get(lang);
    if (loaded.has(lang))
        return loaded.get(lang);
    for (const name of candidates(lang)) {
        if (supplied.has(name))
            return supplied.get(name);
        try {
            const res = await fetch(`${bundleBase()}${name}.json`, { cache: 'default' });
            if (!res.ok)
                continue;
            const type = res.headers.get('content-type') || '';
            // A host that answers every path with its index page isn't a catalog.
            if (type && !type.includes('json'))
                continue;
            const data = (await res.json());
            if (data && typeof data === 'object') {
                loaded.set(lang, data);
                return data;
            }
        }
        catch ( /* not there, or offline: fall back */_a) { /* not there, or offline: fall back */ }
    }
    return null;
}
function listen() {
    if (listening || typeof window === 'undefined')
        return;
    listening = true;
    // The host says the language changed (Studio, the portal): same message theme-boot.js reads.
    window.addEventListener('message', (e) => {
        const d = e && e.data;
        if (!d || typeof d !== 'object')
            return;
        if ((d.type === 'smartlinks:root-state' || d.type === 'smartlinks:language') && typeof d.lang === 'string') {
            void setLanguage(d.lang);
        }
    });
}
/**
 * Load the source catalog and the current language's. Call once before the first render; safe to
 * call again. Never throws: with nothing found, `t` returns the keys' English or the keys.
 */
export async function init(options = {}) {
    source = normalizeLanguage(options.sourceLanguage) || 'en';
    if (options.baseUrl)
        base = options.baseUrl.endsWith('/') ? options.baseUrl : `${options.baseUrl}/`;
    if (options.catalogs)
        for (const [lang, cat] of Object.entries(options.catalogs)) {
            const key = normalizeLanguage(lang) || lang;
            supplied.set(key, cat);
        }
    current = normalizeLanguage(options.language) || detectLanguage();
    listen();
    await Promise.all([fetchCatalog(source), current === source ? null : fetchCatalog(current)]);
    setPageLanguage(current);
    emit();
}
/** Switch language (loads its catalog first, so the switch happens in one step). */
export async function setLanguage(lang) {
    const next = normalizeLanguage(lang);
    if (!next || next === current)
        return;
    await fetchCatalog(next);
    current = next;
    setPageLanguage(current);
    emit();
}
/** The language in use. */
export function language() {
    return current;
}
function lookup(cat, key) {
    if (!cat)
        return undefined;
    if (typeof cat[key] === 'string')
        return cat[key]; // flat keys with dots also work
    let node = cat;
    for (const part of key.split('.')) {
        if (!node || typeof node !== 'object')
            return undefined;
        node = node[part];
    }
    return typeof node === 'string' ? node : undefined;
}
function pluralCategory(lang, count) {
    try {
        const PR = Intl.PluralRules;
        if (PR)
            return new PR(lang).select(count);
    }
    catch ( /* unknown locale */_a) { /* unknown locale */ }
    return count === 1 ? 'one' : 'other';
}
/** The catalog for a language: supplied or fetched, trying its fallbacks (zh-CN -> zh-Hans, fr-CA -> fr). */
function catalogFor(lang) {
    for (const name of candidates(lang)) {
        const cat = supplied.get(name) || loaded.get(name);
        if (cat)
            return cat;
    }
    return loaded.get(lang);
}
function find(lang, key, count) {
    var _a;
    const cat = catalogFor(lang);
    if (typeof count === 'number') {
        const form = (_a = lookup(cat, `${key}_${pluralCategory(lang, count)}`)) !== null && _a !== void 0 ? _a : lookup(cat, `${key}_other`);
        if (form !== undefined)
            return form;
    }
    return lookup(cat, key);
}
/**
 * Translate `key` into the current language, falling back to the source language, then to
 * `values.defaultValue`, then to the key itself. `{{name}}` is filled from `values`; `count`
 * picks the plural form.
 */
export function t(key, values) {
    var _a, _b, _c;
    const count = values && typeof values.count === 'number' ? values.count : undefined;
    const text = (_c = (_b = (_a = find(current, key, count)) !== null && _a !== void 0 ? _a : (current === source ? undefined : find(source, key, count))) !== null && _b !== void 0 ? _b : values === null || values === void 0 ? void 0 : values.defaultValue) !== null && _c !== void 0 ? _c : key;
    if (!values)
        return text;
    return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, name) => {
        const v = values[name];
        if (v === undefined || v === null)
            return m;
        return typeof v === 'number' ? v.toLocaleString(current) : String(v);
    });
}
/** Is there a translation for `key` in the current language (not just the English fallback)? */
export function has(key) {
    return find(current, key) !== undefined;
}
/** Subscribe to language/catalog changes. Returns an unsubscribe. (For React's useSyncExternalStore.) */
export function subscribe(fn) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
}
/** Changes on every language or catalog change. (The snapshot for useSyncExternalStore.) */
export function snapshot() {
    return version;
}
/** Dates and numbers in the current language. */
export const format = {
    number: (n, opts) => {
        try {
            return new Intl.NumberFormat(current, opts).format(n);
        }
        catch (_a) {
            return String(n);
        }
    },
    date: (d, opts) => {
        try {
            return new Intl.DateTimeFormat(current, opts !== null && opts !== void 0 ? opts : { dateStyle: 'medium' }).format(new Date(d));
        }
        catch (_a) {
            return String(d);
        }
    },
    dateTime: (d, opts) => {
        try {
            return new Intl.DateTimeFormat(current, opts !== null && opts !== void 0 ? opts : { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d));
        }
        catch (_a) {
            return String(d);
        }
    },
};
/** Forget loaded catalogs and listeners (tests). */
export function _reset() {
    source = 'en';
    current = 'en';
    base = null;
    loaded.clear();
    supplied.clear();
    listeners.clear();
    version = 0;
}
