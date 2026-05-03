# SmartLinks App Records Pattern

> Canonical guide for microapps that store **per-product**, **per-facet**, **per-variant**, **per-batch**, or **rule-targeted** data.
>
> Audience: microapp developers (ingredients, nutrition, allergy, FAQs, recipes, warranty, provenance, …).
>
> Status: **standard**. New apps MUST follow this contract; existing apps SHOULD migrate.
>
> SDK: `@proveanything/smartlinks` ≥ **1.11**, `@proveanything/smartlinks-utils-ui` ≥ **0.7.6**.

---

## 0. TL;DR — pick your shape, then copy the snippet

Every records-based app fits into a 2×2:

|                          | **Singleton** (one record per scope)                 | **Collection** (many records per scope)                       |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------- |
| **Best-match (one wins)**| Ingredients, nutrition, washing instructions         | _(rare — usually you want all)_                               |
| **All matches (aggregate)** | _(rare — usually you want best)_                  | FAQs, recipes, SOPs, care tips, story cards                   |

That choice drives **three** things and nothing else:

1. **Manifest:** `cardinality: 'singleton' | 'collection'` and `allowFacetRules: boolean`.
2. **Admin (`<RecordsAdminShell>`):** pass `cardinality` + include `'rule'` in `scopes` if `allowFacetRules`.
3. **Public hook:** `useResolvedRecord` (best match) **or** `useCollectedRecords` / `useResolveAllRecords` (all matches).

If you only remember one rule: **never write your own resolver**. The shell, the hooks, and the SDK already agree on resolution order. Reimplementing it is how apps drift.

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

## 4. Admin side — `<RecordsAdminShell>` (the only thing you should be writing)

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

## 5. Public side — pick the right hook (this is where apps go wrong)

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
>
> The `admin` parameter on `match()` and `resolveAll()` defaults to `false`, so public widgets that omit it are fine. **Never hardcode `true` in a public widget.** The hooks below always use the public path and are the recommended approach — prefer them over raw SDK calls in widget code.

There is exactly **one decision** to make on the public side, and it follows from the manifest's `cardinality`:

### 5a. Singleton → `useResolvedRecord` (best match wins)

Use this when the app shows **one** answer for the current product (ingredients, nutrition, washing instructions, warranty terms).

```tsx
import * as SL from '@proveanything/smartlinks';
import { useResolvedRecord } from '@proveanything/smartlinks-utils-ui/records-admin';

const { data, source, sourceRef, matchedAt, matchedRule, isLoading } =
  useResolvedRecord<IngredientsConfig>({
    SL,
    appId,
    collectionId,
    recordType: 'ingredients',
    productId,
    variantId,   // optional
    batchId,     // optional
    proofId,     // optional
  });
```

The resolver walks `proof → batch → variant → product → rule → facet → collection` and returns the **first match**, plus `matchedAt` so you can render _"From the product record"_ vs _"Matched by rule"_ badges if useful.

> Wrap this once in your app (e.g. `useResolvedIngredientSet`) so the rest of the codebase reads `{ data, isLoading }` and never sees the resolver.

### 5b. Collection → `useCollectedRecords` (every match, ordered)

Use this when the app shows **many** answers aggregated across the chain (FAQs, recipes, SOPs, care tips). Most-specific first by default; pass `sort` to override.

```tsx
import { useCollectedRecords } from '@proveanything/smartlinks-utils-ui/records-admin';

const { items, isLoading } = useCollectedRecords<FaqEntry>({
  SL,
  appId,
  collectionId,
  recordType: 'faq',
  productId,
  // sort: { kind: 'field', field: 'order', direction: 'asc' },
});

// items: CollectedRecord<FaqEntry>[] — each has { data, scope, ref, depth }
```

### 5c. Multi-type aggregate → `useResolveAllRecords`

When you need every record of every type that applies to a context (rare; mostly executors and SEO surfaces).

```tsx
import { useResolveAllRecords } from '@proveanything/smartlinks-utils-ui/records-admin';

const { entries, isLoading } = useResolveAllRecords({
  SL, collectionId, appId,
  context: { productId, facets: { brand: 'acme', category: ['bread'] } },
});
```

### Common mistakes (do not do these)

| ❌ Anti-pattern                                            | ✅ Do this instead                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Calling `SL.app.records.list()` and filtering client-side  | `useResolvedRecord` (singleton) or `useCollectedRecords` (collection). The server already knows the chain. |
| Calling `SL.app.records.list(…, true)` from a public widget | Omit the `admin` flag (defaults to `false`). `list()` has a public path — just don't pass `true`. |
| Calling `SL.app.records.match(…, true)` from a public widget | Omit the `admin` flag (defaults to `false`) or use `useResolvedRecord` / `useCollectedRecords`. |
| Calling `SL.app.records.resolveAll(…, true)` from a public widget | Omit the `admin` flag (defaults to `false`) or use `useResolveAllRecords`. |
| Calling `upsert`, `bulkUpsert`, `bulkDelete`, or `previewRule` from widget code | Those are admin-only. Widget code reads data — it never writes records directly. |
| Walking the chain by hand with multiple `getConfig` calls  | One hook call. The resolver is tested, cached, and includes rules. |
| Treating `facet:key:value` refs as the rule mechanism      | Use `facetRule` (`{ all: [{ facetKey, anyOf: [...] }] }`). Multi-condition, scored by specificity. |
| Reading `matchedAt === 'global'`                           | There is no `'global'`. The top of the chain is `'collection'`.  |
| Building your own `<FacetRuleEditor>`                      | Use the one from `@proveanything/smartlinks-utils-ui/facet-rule-editor`. |

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
5. **Replace any handwritten chain walking** with `useResolvedRecord` (singleton) or `useCollectedRecords` (collection).
6. **Delete any code that constructs `facet:key:value` refs** for matching. Use `facetRule` via the shell or `<FacetRuleEditor>`.
7. **Search for the word "global"** in your code/docs and rename to "collection" — this is the most common source of confusion.

---

## 8. Where the canonical exports live

| Need                          | Import from                                                            |
| ----------------------------- | ---------------------------------------------------------------------- |
| Admin shell                   | `@proveanything/smartlinks-utils-ui/records-admin` → `RecordsAdminShell` |
| Standalone rule editor        | `@proveanything/smartlinks-utils-ui/facet-rule-editor` → `FacetRuleEditor` |
| Conditions editor (non-facet) | `@proveanything/smartlinks-utils-ui/conditions-editor` → `ConditionsEditor` |
| Best-match resolver hook      | `@proveanything/smartlinks-utils-ui/records-admin` → `useResolvedRecord` |
| All-matches hook              | `@proveanything/smartlinks-utils-ui/records-admin` → `useCollectedRecords` |
| Multi-type aggregate hook     | `@proveanything/smartlinks-utils-ui/records-admin` → `useResolveAllRecords` |
| Rule preview ("matches N")    | `@proveanything/smartlinks-utils-ui/records-admin` → `useRulePreview`  |
| Server-side record CRUD       | `@proveanything/smartlinks` → `SL.app.records.{upsert, list, remove, match, resolveAll}` |

---

_End of doc. If anything below the SDK contradicts this file, this file wins — open a PR against the SDK to bring the two back into sync._
