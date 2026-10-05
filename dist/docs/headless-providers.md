# Headless providers: declaring an app's content for other sites

A **headless provider** is an app whose content other sites and apps may use: an FAQ app, a media gallery, content pages, a blog. The site renders the content its own way. The business keeps editing it in the provider's own admin, inside SmartLinks. A site never builds an editor for provider content.

To become a provider, an app declares two blocks in `app.manifest.json`:
- **`data`**: its data types, meaning how each is stored, its fields, examples and read recipes;
- **`headless`**: the opt-in, meaning its purpose, categories, which types a site renders, where the owner edits it, and rendering guidance.

Site builders (the Forge agent included) read these declarations to decide "install the FAQ app and use its content" instead of inventing their own.

## The `data` block

```jsonc
"data": {
  "schemaVersion": "1.0.0",                 // semver of THIS contract; a major = a breaking change
  "types": {
    "<app>.<thing>": {                      // lowercase, dot-separated, e.g. "faq.item"
      "description": "What one item is, in a sentence.",
      "storage": { "kind": "record", "recordType": "<the recordType the app writes>" },
      "visibility": "public",               // the visibility items normally have: public | owner | admin
      "anchors": ["product"],               // optional: what items can be attached to
      "fields": {
        "<key>": {
          "type": "string",                 // see field types
          "label": "Question",
          "required": true,
          "localized": true,                // translated per language (text types only)
          "public": true,                   // readable by anonymous visitors
          "zone": "data"                    // data (default) | owner | admin
        }
      },
      "listing": { "sort": ["order"], "filters": ["category"] },
      "examples": [ { "<key>": "realistic value" } ],
      "read": {                             // optional: defaults to the standard calls for the storage
        "list": "SL.app.records.list(collectionId, appId, { recordType: '...', limit: 50 })",
        "get":  "SL.app.records.get(collectionId, appId, recordId)",
        "notes": "anything a site must know, e.g. 'sort by order, then title'"
      }
    }
  }
}
```

**Storage kinds:**

| `storage.kind` | The app keeps items in | Read with |
|---|---|---|
| `record` (+ `recordType`) | App records: the usual home for content | `SL.app.records.list / get`, filtered by `recordType` |
| `case` | App cases: requests that get resolved | `SL.app.cases.list / get` |
| `thread` | App threads: discussions, Q&A, reviews | `SL.app.threads.list / get` |
| `config` (+ optional `key`) | App configuration: settings, small fixed lists | `SL.appConfiguration.getConfig({ collectionId, appId })` |

**What the read calls return.** This is fixed by the storage kind, so a provider never needs to describe it, and site builders get it from the checker and `forge-cms describe`:

- **`record`, `case`, `thread`:** `list` returns `{ data: Item[], pagination: { total, limit, offset, hasMore } }`.
  - The items are in **`response.data`**, never `response.items` or `response.records`.
  - Each item's declared fields are in **`item.data`** (e.g. `record.data.question`). `id`, `status`, `productId` and the dates are top-level.
  - Page with `offset` / `limit` while `pagination.hasMore`. `get` returns one item.
- **`config`:** the configuration object. Items are in `config.<key>` when the type names a `key`.

Products, contacts and proofs are platform data. Reference them with `ref` fields (`"to": "product"`); never redeclare them.

**Field types:** `string`, `text`, `richtext` (HTML), `markdown`, `number`, `boolean`, `date` (YYYY-MM-DD), `datetime`, `enum` (+ `options`), `url`, `image` and `file` (a URL or `{ url, ... }`), `ref` and `ref[]` (+ `to`: a declared type id, or `product` / `contact` / `proof`), `string[]`, `json` (avoid where a typed field fits).

**Zones and what's public.** App records, cases and threads have three JSONB zones: `data`, `owner` and `admin`. Only `data` can be public, and only when the item's visibility is `public`. Mark each field a visitor may read with `"public": true`. Internal fields (notes, moderation flags) are `zone: "admin"` and never public.

**Examples** are the item's `data` JSON exactly as the app writes it, with realistic content, not lorem ipsum.

## The `headless` block

```jsonc
"headless": {
  "purpose": "What content this holds and when a site should use it instead of building its own.",
  "categories": ["faq"],                    // faq | media | pages | articles | catalog | events | locations
                                            // | people | reviews | documents | forms | other
  "primaryTypes": ["faq.item"],             // the types a site renders; others are supporting (e.g. categories)
  "editedIn": { "label": "FAQ → Questions", "adminPath": "#/questions" },
  "render": {
    "guidance": "Group by category; questions expand to show answers.",
    "seo": ["faqPage"]                      // SL.seo.schema helpers a site should use
  }
}
```

A primary type must be readable by visitors: public visibility, at least one public field, and at least one example.

## Checking a declaration

- **In Forge:** `forge-headless check` validates it against the app's real public data on its test collection. `forge-headless register` validates it and records it in Forge, which makes the app a provider that site builds can find.
- **Anywhere else:**
  - `npx smartlinks-headless [appDir] [--collection <id> --app <appId>]`;
  - or `SL.headless.validate(manifest, { samples })` in code.

Errors block. Warnings are worth fixing, and the most useful one is *real data has "x" but it isn't declared*.

## Adding a headless mode to an existing app (procedure)

1. **Find what the app stores.** Search the source for its writes and reads:
   - `SL.app.records.create / upsert / bulkUpsert` (note each `recordType`);
   - `SL.app.cases`, `SL.app.threads`;
   - `appConfiguration.setConfig` / data items.

   Each distinct `recordType` (or config key) the business edits is a candidate type.
2. **Find the fields.** Read the admin forms and the TypeScript types for what each item holds. Note which zone each field is written to.
3. **Decide what's public.** Content a visitor sees is public. Notes, flags and anything personal are not, and move to `zone: "admin"` if the app keeps them in `data`.
4. **Write the `data` block:** a type per content thing, its storage, fields, listing, and one or two realistic examples taken from the app's real data.
5. **Write the `headless` block:** purpose, categories, primary types, where it's edited (the admin screen's name and route), and render and SEO guidance.
6. **Check against real data** (`forge-headless check`). Declare any real fields you missed, or confirm they're internal.
7. **Register** (`forge-headless register`) once it's valid.
8. **Keep the data contract stable.** Adding fields or types is a minor bump of `schemaVersion`; renaming or removing them is a major one.

Don't change how the app stores data just to declare it. The declaration describes what already exists. If something must change (say, an internal field sitting in the public `data` zone), make that a separate, deliberate change.
