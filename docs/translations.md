# SmartLinks Translations

Runtime translation API for collection-scoped UI strings and content blocks, with optional browser-side IndexedDB caching.

This guide covers the new `translations` namespace in the SDK.

## When To Use This

Use `translations` when you need to translate dynamic runtime content such as:

- product descriptions fetched from APIs
- customer-configurable portal copy
- CMS-driven long-form content blocks
- repeated UI strings that should be cached per collection and language

This is different from the static app-local i18n flow in [i18n.md](i18n.md), which is still the right choice for build-time translation keys such as button labels and route titles.

## Two Levels Of API

The SDK exposes two ways to work with translations:

### 1. `translations.lookup(...)`

This is the direct backend API wrapper.

- calls `POST /public/collection/:collectionId/translations/lookup`
- sends one string or many strings
- returns the server response as-is
- does not check local IndexedDB first

### 2. `translations.resolve(...)`

This is the enriched client helper for front-end use.

- hashes each source string locally
- checks the browser-local translation cache first
- sends only cache misses to the backend
- stores successful results back into IndexedDB
- preserves the original input order, including duplicates

For browser apps, `resolve(...)` is the recommended default.

## Quick Start

```ts
import { initializeApi, translations } from '@proveanything/smartlinks'

initializeApi({ baseURL: 'https://smartlinks.app/api/v1' })

const response = await translations.resolve('collection-123', {
  targetLanguage: 'fr',
  sourceLanguage: 'en',
  context: {
    surface: 'portal-product-page',
    field: 'description',
  },
  texts: [
    'Welcome to the product page',
    'Scan to verify authenticity',
  ],
})

console.log(response.items.map((item) => item.translatedText))
```

## Raw Backend Lookup

Use `lookup(...)` if you want the SDK to stay close to the backend contract.

```ts
const response = await translations.lookup('collection-123', {
  targetLanguage: 'de',
  text: 'Claim your item',
})

console.log(response.items[0].translatedText)
```

### Batch Lookup

```ts
const response = await translations.lookup('collection-123', {
  targetLanguage: 'es',
  sourceLanguage: 'en',
  mode: 'cache-fill',
  contentType: 'text/plain',
  texts: [
    'Welcome to the product page',
    'Scan to verify authenticity',
  ],
  returnMeta: true,
})
```

## Content Types

`contentType` is part of the translation cache identity. Use it to tell the backend what kind of content is being translated so it can preserve structure correctly.

### `text/plain`

Use this for normal strings, paragraphs, labels, and other plain text content with no markup.

```ts
await translations.resolve('collection-123', {
  targetLanguage: 'fr',
  sourceLanguage: 'en',
  contentType: 'text/plain',
  texts: [
    'Welcome to the product page',
    'Scan to verify authenticity',
  ],
})
```

### `text/html`

Use this when the source contains HTML tags that must survive translation unchanged. This is important for rich text descriptions, CMS content, and formatted snippets.

```ts
await translations.resolve('collection-123', {
  targetLanguage: 'de',
  sourceLanguage: 'en',
  contentType: 'text/html',
  context: {
    surface: 'portal-product-page',
    field: 'rich-description',
  },
  texts: [
    '<p>Welcome to the <strong>product page</strong>.</p>',
    '<p>Scan the tag to <a href="/verify">verify authenticity</a>.</p>',
  ],
})
```

Use `text/html` when you want the translation system to preserve tags such as:

- `<p>`, `<strong>`, `<em>`
- `<ul>`, `<li>`
- `<a>`
- inline markup embedded in CMS-rendered HTML

### `text/x-liquid`

Use this when the content includes Liquid syntax that must be preserved exactly, including output tags, control-flow blocks, and filters.

```ts
await translations.resolve('collection-123', {
  targetLanguage: 'es',
  sourceLanguage: 'en',
  contentType: 'text/x-liquid',
  context: {
    surface: 'portal-email-template',
    field: 'body',
  },
  texts: [
    'Hello {{ customer.first_name }}, your item {{ product.title }} is ready.',
    '{% if claimable %}Claim your item{% else %}View item details{% endif %}',
  ],
})
```

Use `text/x-liquid` when the source includes constructs such as:

- `{{ customer.first_name }}`
- `{{ product.title | upcase }}`
- `{% if claimable %}...{% endif %}`
- loop or conditional blocks used in templates

### Choosing The Right Value

- use `text/plain` for normal strings with no markup
- use `text/html` when HTML tags are part of the source and must be preserved
- use `text/x-liquid` when Liquid template syntax is part of the source and must be preserved

Do not mix plain text, HTML, and Liquid under the same `contentType` if you want stable cache keys and predictable translation behavior.

## Local-First Resolution

`resolve(...)` is intended for browser rendering paths where repeated translations should not keep hitting the network.

```ts
const response = await translations.resolve('collection-123', {
  targetLanguage: 'fr',
  sourceLanguage: 'en',
  texts: [
    'Welcome to the product page',
    'Welcome to the product page',
    'Scan to verify authenticity',
  ],
})

for (const item of response.items) {
  console.log(item.index, item.cacheSource, item.translatedText)
}
```

### Default Client Cache Behavior

- cache backend hits in IndexedDB when available
- fall back to in-memory cache when IndexedDB is unavailable
- expire entries lazily on read
- keep entries for 90 days by default

IndexedDB does not provide native time-based expiry, so the SDK stores `expiresAt` and evicts stale records when reading them.

### Configure Local Cache TTL

```ts
await translations.resolve('collection-123', {
  targetLanguage: 'fr',
  texts: ['Limited edition'],
}, {
  localCacheTtlMs: 180 * 24 * 60 * 60_000,
})
```

### Force A Fresh Remote Lookup

```ts
await translations.resolve('collection-123', {
  targetLanguage: 'fr',
  texts: ['Welcome back'],
}, {
  refreshLocalCache: true,
})
```

### Disable The Local Cache

```ts
await translations.resolve('collection-123', {
  targetLanguage: 'fr',
  texts: ['Welcome back'],
}, {
  useLocalCache: false,
})
```

## Context Matters

The same source string can require different translations depending on where it appears. Pass stable context whenever the meaning can change.

```ts
await translations.resolve('collection-123', {
  targetLanguage: 'fr',
  texts: ['Claim'],
  context: {
    surface: 'portal-product-page',
    field: 'cta-button',
  },
})
```

The SDK derives a deterministic local cache key from `context` so browser-local entries do not collide across different UI surfaces.

## Hashing Helpers

The SDK also exposes the normalization and hashing helpers used by the local cache flow.

```ts
const hash = await translations.hashText('Welcome to the product page')

const hashes = await translations.hashTexts([
  'Welcome to the product page',
  'Scan to verify authenticity',
])

const normalized = translations.normalizeText('  Hello\r\nWorld  ')
```

By default the hash path:

- normalizes CRLF to LF
- trims surrounding whitespace
- applies Unicode NFC normalization
- preserves interior whitespace unless `collapseWhitespace: true` is set

## Clearing Local Cache

Clear all locally cached translations:

```ts
await translations.clearLocalCache()
```

Clear only one collection's local entries:

```ts
await translations.clearLocalCache('collection-123')
```

## Admin APIs

The namespace also exposes basic admin translation management.

### List

```ts
const page = await translations.list('collection-123', {
  targetLanguage: 'fr',
  q: 'authenticity',
  limit: 20,
  offset: 0,
})
```

### Get One

```ts
const record = await translations.get('collection-123', 'translation-id')
```

### Update One

```ts
const updated = await translations.update('collection-123', 'translation-id', {
  translatedText: 'Bienvenue sur la page produit',
  isOverride: true,
  quality: 'human',
})
```

## Recommended Usage Pattern

For front-end rendering:

1. Use static app-local i18n for fixed UI keys.
2. Use `translations.resolve(...)` for dynamic runtime content.
3. Always pass `context` for ambiguous strings.
4. Prefer batched requests for multiple strings on the same screen.

For back-office or tooling flows:

1. Use `translations.lookup(...)` for direct backend access.
2. Use `translations.list/get/update` for translation review and correction workflows.