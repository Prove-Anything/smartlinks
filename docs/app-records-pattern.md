# SmartLinks App Records Pattern

> Canonical guide for microapps that store **per-product**, **per-facet**, **per-variant**, **per-batch**, or **rule-targeted** data.
>
> Audience: microapp developers (ingredients, nutrition, allergy, FAQs, recipes, warranty, provenance, …).
>
> Status: **standard**. New apps MUST follow this contract; existing apps SHOULD migrate.
>
> SDK: `@proveanything/smartlinks` ≥ **1.11**.
> Admin shell (React only): `@proveanything/smartlinks-utils-ui` ≥ **0.7.6** — required for the admin side if using the React shell; not needed in public widgets.

---

## 0. TL;DR — pick your shape, then copy the snippet

Every records-based app fits into a 2×2:

|                          | **Singleton** (one record per scope)                 | **Collection** (many records per scope)                       |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------- |
| **Best-match (one wins)**| Ingredients, nutrition, washing instructions         | _(rare — usually you want all)_                               |
| **All matches (aggregate)** | _(rare — usually you want best)_                  | FAQs, recipes, SOPs, care tips, story cards                   |

That choice drives **three** things and nothing else:

1. **Manifest:** `cardinality: 'singleton' | 'collection'` and `allowFacetRules: boolean`.
2. **Admin:** use `<RecordsAdminShell>` (React) or call the admin SDK functions directly. Pass `cardinality` + include `'rule'` in `scopes` if `allowFacetRules`.
3. **Public widget:** call `app.records.match()` (best match / singleton) or `app.records.resolveAll()` (all matches / collection). These are plain SDK calls with no framework dependency.

If you only remember one rule: **never write your own resolution loop**. The server already walks the chain correctly — calling `match()` or `resolveAll()` is the entire public-side implementation.

---

## 1. The data model in one paragraph

A microapp owns a typed **records table** keyed by `(appId, recordType, id)`. Each `AppRecord` carries a `data` payload plus **either** a structured `scope` (anchored to a node in the chain) **or** a `facetRule` (matches products dynamically by their facets). The server resolves which record(s) apply to a given product context. There is no "global"; the top of the chain is **collection** — anything not explicitly scoped further applies to the whole collection.

```ts
import * as SL from '@proveanything/smartlinks';

await SL.app.records.upsert(collectionId, appId, {
  recordType: 'ingredients',
  scope: { productId: 'prod_abc', variantId: 'var_500ml' }, // server derives the ref
  data: { /* domain payload */ },
}, /* admin */ true);
```

Or, for a rule-targeted record:

```ts
await SL.app.records.upsert(collectionId, appId, {
  recordType: 'ingredients',
  facetRule: {
    all: [
      { facetKey: 'brand',    anyOf: ['acme'] },
      { facetKey: 'category', anyOf: ['bread', 'pastry'] },
    ],
  },
  data: { /* domain payload */ },
}, true);
```

`scope` and `facetRule` are **mutually exclusive on save**.

---

## 2. Resolution order (one canonical chain)

The server walks **most-specific → least-specific** and stops at the first match (for best-match) or collects every match (for aggregate):

```
proof  →  batch  →  variant  →  product  →  rule(*)  →  facet(*)  →  collection
```

- `rule(*)` — facet-rule records are scored by **specificity** (number of clauses + number of constrained values). The most specific rule wins.
- `facet(*)` — legacy single-facet anchors, walked deterministically (alphabetical).
- `collection` — the top of the chain. **There is no "global" tier above collection.** A collection-level record is the catch-all for that collection.

The resolved value comes back tagged with `matchedAt: 'product' | 'rule' | 'facet' | …` so the UI can say things like _"Matched by rule: brand=Acme AND category=bread"_.

> ⚠️ Legacy `scope.facets[]` (colon-delimited single-facet refs) is deprecated and removed in SDK 1.12. Use `facetRule` for everything that isn't a one-off facet pin.

---

## 3. Manifest declaration

Declare each record type once in `app.admin.json`. The shell and the platform read this to render the right scope tabs and disable the wrong affordances.

```json
{
  "records": {
    "ingredients": {
      "label": "Ingredients",
      "cardinality": "singleton",
      "allowFacetRules": true,
      "scopes": ["collection", "facet", "rule", "product", "variant", "batch"],
      "defaultScope": "product"
    },
    "faq": {
      "label": "FAQs",
      "cardinality": "collection",
      "allowFacetRules": true,
      "scopes": ["collection", "rule", "product"],
      "defaultScope": "collection"
    }
  }
}
```

| Field             | Meaning                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `cardinality`     | `'singleton'` (one per scope, e.g. ingredients) or `'collection'` (many per scope, e.g. FAQs). Default `'singleton'`.                |
| `allowFacetRules` | `true` to enable the `rule` scope tab + `<FacetRuleEditor>` in the shell. Default `false`.                                           |
| `scopes`          | Allowed scope kinds in **resolution order**. `'rule'` is a synthetic scope that holds rule-targeted records.                         |
| `defaultScope`    | Where the "Create new" button lands.                                                                                                 |
| `label`           | Human-readable label used in headings and toasts.                                                                                    |

---

## 4. Admin side

> The admin shell and rule editor are part of `@proveanything/smartlinks-utils-ui`, which is a **React-only library**. It is only needed in admin dashboards — never import it in a public widget.

### `<RecordsAdminShell>` (React)

The shell owns: scope tabs, browser pane, rule editor, save/discard, dirty navigation, inheritance markers, deletion, CSV, bulk apply, deep linking. **You only supply the editor for one record's `data`.**

```tsx
import * as SL from '@proveanything/smartlinks';
import { RecordsAdminShell } from '@proveanything/smartlinks-utils-ui/records-admin';

<RecordsAdminShell<IngredientsConfig>
  SL={SL}
  collectionId={collectionId}
  appId={appId}
  recordType="ingredients"
  label="Ingredients"
  cardinality="singleton"                              // ← from manifest
  scopes={['collection', 'facet', 'rule', 'product', 'variant', 'batch']}
  defaultScope="product"
  defaultData={() => emptyConfig()}
  renderEditor={(ctx) => (
    <IngredientsEditor
      value={ctx.value}
      onChange={ctx.onChange}
      // For rule-targeted records, the shell hands you the live rule + setter:
      facetRule={ctx.facetRule}
      onFacetRuleChange={ctx.onFacetRuleChange}
    />
  )}
/>
```

### What the shell gives you for free

- **Scope tabs** including a **`Rule`** tab when `'rule'` is in `scopes`. Selecting it opens `<FacetRuleEditor>` above your editor — no extra wiring.
- **`EditorContext.facetRule` / `onFacetRuleChange`** for rule-scoped records, plus `canSave: false` until at least one clause has values (avoids server 500s).
- **Inheritance markers** — when editing a variant, the product baseline is shown; per-field "↩ Inherited" / "● Override" is rendered by the inheritance helpers.
- **Collection cardinality flow** — set `cardinality="collection"` and the shell turns the right pane into a list of items (table / cards / gallery) with `+ New` and per-item nav.
- **Telemetry** — `record.save`, `record.delete`, `scope.change`, `csv.import`, `bulk.apply`, `item.create`, etc. via `onTelemetry`.

### Standalone rule editor

If you need a rule editor outside the shell (e.g. on a settings page):

```tsx
import { FacetRuleEditor } from '@proveanything/smartlinks-utils-ui/facet-rule-editor';

<FacetRuleEditor
  value={rule}
  onChange={setRule}
  collectionId={collectionId}     // lazy-fetches facets via SL.facets.publicList
  preview={rulePreview}            // optional — wire from useRulePreview
/>
```

---

## 5. Public side

> **Do not import `@proveanything/smartlinks-utils-ui` in a public widget.** It is a React admin library. Public widgets only need `@proveanything/smartlinks`.

The SDK is framework-agnostic. Public widgets call two endpoints depending on cardinality:

| Cardinality | Call | What it does |
|---|---|---|
| **Singleton** (one answer) | `app.records.match()` | Server walks the chain, returns the best-matching record |
| **Collection** (all answers) | `app.records.resolveAll()` | Server walks the chain, returns every matching record |

Neither call requires React or any other framework — wrap them in whatever async pattern your widget uses.

> **Admin vs public — the rule is simple:**
>
> | Function | Public widget | Admin dashboard |
> |---|---|---|
> | `app.records.create(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.list(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.get(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.update(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.remove(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.aggregate(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.match(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.resolveAll(…, false)` | ✅ default — omit the flag | ✅ pass `true` |
> | `app.records.upsert()` | ❌ admin only — no public path | ✅ |
> | `app.records.bulkUpsert()` | ❌ admin only — no public path | ✅ |
> | `app.records.bulkDelete()` | ❌ admin only — no public path | ✅ |
> | `app.records.restore()` | ❌ admin only — no public path | ✅ |
> | `app.records.previewRule()` | ❌ admin only — no public path | ✅ |

### 5a. Singleton — `app.records.match()` (best match wins)

Use when the widget shows **one** answer for the current product (ingredients, nutrition, warranty terms, washing instructions).

```ts
import * as SL from '@proveanything/smartlinks';

const result = await SL.app.records.match(collectionId, appId, {
  target: { productId, variantId, batchId },  // pass whatever context you have
  strategy: 'best',
  recordType: 'ingredients',
});

// result.data[0] → the single highest-specificity MatchEntry (when strategy: 'best')
// result.data[0].matchedAt → 'product' | 'rule' | 'facet' | 'collection' | …
// result.data[0].data → your record payload
```

The server walks `proof → batch → variant → product → rule → facet → collection` and returns the first match. `result.data` will have at most one entry when `strategy: 'best'`.

### 5b. Collection — `app.records.resolveAll()` (every match, ordered)

Use when the widget shows **many** answers across the chain (FAQs, recipes, care tips, SOPs).

```ts
const result = await SL.app.records.resolveAll(collectionId, appId, {
  context: { productId },   // note: resolveAll uses 'context', not 'target'
  recordType: 'faq',        // singular — omit to return all record types
});

// result.records → ResolveAllEntry[] sorted most-specific first
// each entry: { record: AppRecord, matchedAt, specificity, matchedRule? }
```

### 5c. Multi-type — `app.records.resolveAll()` without a recordType filter

When you need records of all types for a context in one call (rare; executors, SEO surfaces), omit `recordType`:

```ts
const result = await SL.app.records.resolveAll(collectionId, appId, {
  context: {
    productId,
    facets: { brand: ['acme'] },  // include facets to match rule records
  },
  // no recordType → returns all declared types
});

// result.records → one ResolveAllEntry per matched record, all types interleaved
// filter client-side by entry.record.recordType if you need to separate them
```

### Common mistakes (do not do these)

| ❌ Anti-pattern                                            | ✅ Do this instead                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Importing anything from `@proveanything/smartlinks-utils-ui` in a public widget | That package is React-only and admin-only. Public widgets only use `@proveanything/smartlinks`. |
| Calling `SL.app.records.list()` and filtering client-side  | `app.records.match()` (singleton) or `app.records.resolveAll()` (collection). The server walks the chain. |
| Calling `SL.app.records.list(…, true)` from a public widget | Omit the `admin` flag — it defaults to `false`. |
| Calling `SL.app.records.match(…, true)` from a public widget | Omit the `admin` flag — it defaults to `false`. |
| Calling `SL.app.records.resolveAll(…, true)` from a public widget | Omit the `admin` flag — it defaults to `false`. |
| Calling `upsert`, `bulkUpsert`, `bulkDelete`, or `previewRule` from widget code | Those are admin-only. Widget code reads data; it never writes records. |
| Walking the chain by hand with multiple `get` / `list` calls | One `match()` or `resolveAll()` call. The server handles the resolution order including rules. |
| Treating `facet:key:value` refs as the rule mechanism      | Use `facetRule` (`{ all: [{ facetKey, anyOf: [...] }] }`). Multi-condition, scored by specificity. |
| Reading `matchedAt === 'global'`                           | There is no `'global'`. The top of the chain is `'collection'`.  |

---

## 6. Reference: the `EditorContext` your `renderEditor` receives

```ts
interface EditorContext<TData> {
  value: TData;
  onChange: (next: TData) => void;
  source: 'self' | 'inherited' | 'empty';
  recordId?: string;
  parentValue?: TData | null;
  scope: ParsedRef;                  // { kind: 'product' | 'rule' | …, productId?, … }

  // Save lifecycle
  isDirty: boolean;
  isSaving?: boolean;
  saveError?: unknown | null;
  canSave?: boolean;                 // shell flips to false on empty rules
  cannotSaveReason?: string;
  save: () => Promise<void>;
  reset: () => void;

  // Deletion
  remove: () => Promise<void>;
  canRemove: boolean;

  // Rule scope only
  facetRule?: FacetRule | null;
  onFacetRuleChange?: (next: FacetRule | null) => void;
}
```

---

## 7. Migration checklist (existing apps)

1. **Update SDKs:** `@proveanything/smartlinks@^1.11`, `@proveanything/smartlinks-utils-ui@^0.7.6`.
2. **Add `cardinality` and `allowFacetRules`** to every entry under `records` in `app.admin.json`.
3. **Add `'rule'` (and `'collection'` if missing) to `scopes`** wherever `allowFacetRules: true`.
4. **Pass `cardinality`** to `<RecordsAdminShell>`.
5. **Replace any handwritten chain walking** with `app.records.match()` (singleton) or `app.records.resolveAll()` (collection). If you are using React, the `useResolvedRecord` / `useCollectedRecords` hooks from `@proveanything/smartlinks-utils-ui` wrap these calls — but they are **admin-side React helpers**, not for public widgets.
6. **Delete any code that constructs `facet:key:value` refs** for matching. Use `facetRule` via the shell or `<FacetRuleEditor>` (React admin) or pass `facetRule` directly in `upsert()` calls.
7. **Search for the word "global"** in your code/docs and rename to "collection" — this is the most common source of confusion.

---

## 8. Where the canonical exports live

### Public widgets (any framework)

| Need | Import from |
| ---- | ----------- |
| Best-match resolution (singleton) | `@proveanything/smartlinks` → `SL.app.records.match()` |
| All-matches resolution (collection) | `@proveanything/smartlinks` → `SL.app.records.resolveAll()` |
| Record CRUD (public path) | `@proveanything/smartlinks` → `SL.app.records.{list, get, create, update, remove, aggregate}` |

### Admin dashboards (React)

> All of the following are from `@proveanything/smartlinks-utils-ui`, a **React-only** package. Do not use in public widgets.

| Need | Import from |
| ---- | ----------- |
| Admin shell | `@proveanything/smartlinks-utils-ui/records-admin` → `RecordsAdminShell` |
| Standalone rule editor | `@proveanything/smartlinks-utils-ui/facet-rule-editor` → `FacetRuleEditor` |
| Conditions editor (non-facet) | `@proveanything/smartlinks-utils-ui/conditions-editor` → `ConditionsEditor` |
| Best-match hook (React convenience wrapper) | `@proveanything/smartlinks-utils-ui/records-admin` → `useResolvedRecord` |
| All-matches hook (React convenience wrapper) | `@proveanything/smartlinks-utils-ui/records-admin` → `useCollectedRecords` |
| Multi-type hook (React convenience wrapper) | `@proveanything/smartlinks-utils-ui/records-admin` → `useResolveAllRecords` |
| Rule preview hook | `@proveanything/smartlinks-utils-ui/records-admin` → `useRulePreview` |
| Admin record CRUD (admin path) | `@proveanything/smartlinks` → `SL.app.records.{upsert, bulkUpsert, bulkDelete, restore, previewRule}` |

---

_End of doc. If anything below the SDK contradicts this file, this file wins — open a PR against the SDK to bring the two back into sync._
