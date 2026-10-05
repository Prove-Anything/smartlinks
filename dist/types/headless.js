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
export const HEADLESS_CATEGORIES = [
    'faq', 'media', 'pages', 'articles', 'catalog', 'events', 'locations', 'people', 'reviews', 'documents', 'forms', 'other',
];
