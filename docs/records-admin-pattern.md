# SmartLinks Records-Based Admin Pattern

> Canonical guide for building admin UIs in microapps that store **per-product**, **per-facet**, **per-variant** or **per-batch** data.
>
> Audience: microapp developers (nutrition, allergy, ingredients, cooking-guide, warranty, provenance, …).
>
> Status: **standard** — new admin apps in this category MUST follow this contract. Existing apps SHOULD migrate.

---

## 1. Why a shared pattern?

Many SmartLinks microapps store **structured data that varies along one or more product axes**:

| App              | Varies by                                      |
|------------------|------------------------------------------------|
| Nutrition        | product, facet (bread type, region), batch     |
| Allergy          | product, facet (recipe family)                 |
| Ingredients      | product, variant (size), batch (production run)|
| Cooking guide    | product, facet (cut of meat)                   |
| Warranty         | product, variant, batch                        |
| Provenance       | batch                                          |

Without a shared pattern, every app reinvents:

- the left-rail "browse + select" list
- the per-axis precedence rules
- the inheritance/override UI
- the "no data yet" empty state
- CSV import/export
- bulk operations

The result is drift: each app feels different and admins have to re-learn the model. This guide locks the model down at the SDK level so the matching UI primitives in `@proveanything/smartlinks-utils-ui` (see the [companion guide](ui-utils.md)) can stay simple.

---

## 2. Storage model: `app.records`

**Do not** stuff per-axis data into `appConfiguration.products[productId]`. Use `app.records` (recordType-keyed) so that data is queryable, paginatable and survives schema changes.

```ts
import { app } from '@proveanything/smartlinks';

await app.records.create(collectionId, appId, {
  recordType: 'nutrition',          // app-defined, stable
  ref: 'product:prod_abc',           // see §3
  data: { /* domain payload */ },
}, /* admin= */ true);
```

Each record has:

| Field        | Purpose                                                     |
|--------------|-------------------------------------------------------------|
| `recordType` | Namespaces records inside the app. One app may have several (`nutrition`, `cooking_steps`). |
| `ref`        | Encodes the **scope** of the record. See §3.                |
| `data`       | The domain payload. Free-form per app.                      |
| `meta`       | Reserved for system fields (timestamps, author).            |

> **Rule:** `(appId, recordType, ref)` is unique. Treat it as the natural key.

---

## 3. The `ref` convention (REQUIRED)

`ref` is a colon-delimited string that encodes which scope a record applies to. Standardising it is what makes the shared admin shell possible.

```
product:<productId>
variant:<productId>:<variantId>
batch:<productId>:<batchId>
proof:<proofId>
facet:<facetKey>:<valueKey>
''                             (universal / collection-wide fallback)
```

Notes:

- Variants and batches are **always nested under a product** in the SDK, so their refs include `productId`.
- `facet:` refs are **collection-wide** — facets cross products by design.
- `''` (empty ref) is the **universal** record — one per `(app, recordType)` with no scope restrictions; the collection-wide fallback.
- Refs are opaque to the SDK. Apps parse them. A helper module (`@proveanything/smartlinks-utils-ui/records-admin`) exports `parseRef`/`buildRef` so all apps agree on syntax. See Appendix A for the full implementation.

### Adding scopes later

If a new axis appears (e.g. `region:eu`), pick a new prefix and document it. Never reuse a prefix with different semantics.

### Writing records

When creating or upserting a record, send a structured **`RecordScope`** — the server derives `ref` from it:

```ts
await app.records.upsert(collectionId, appId, {
  recordType: 'nutrition',
  scope: { productId: 'prod_abc', variantId: 'var_500ml' }, // server → ref: 'product:prod_abc/variant:var_500ml'
  data: { calories: 260 },
});
```

- `ref` is for **display, URL routing, and resolution output only** — never construct one to use as an upsert key.
- `customId` / `sourceSystem` are for external references (filterable via `list()`) but are **not unique** — the same external ID can exist across `recordType` values. Do not upsert on `customId` either.

---

## 4. Resolution order (REQUIRED)

When the **public** side of an app needs "the data that applies to this proof / product / context", it walks the chain from most-specific to least-specific and returns the first match:

```
proof → batch → variant → product → facet(*) → universal
```

`facet(*)` means: walk every facet attached to the product in a deterministic order (alphabetical by `facetKey`, then `valueKey`) and use the first matching facet record.

> **Rule:** Resolution is **first-match-wins, not merge**. If you need field-level merging, build it on top with explicit `inheritsFrom` markers in the payload — but the default for shared infra is whole-record replacement, because it is far easier to reason about.

The canonical resolver lives in `@proveanything/smartlinks-utils-ui/records-admin` so every app behaves identically:

```ts
import { resolveRecord } from '@proveanything/smartlinks-utils-ui/records-admin';

const resolved = await resolveRecord({
  appId,
  recordType: 'nutrition',
  scope: { collectionId, productId, variantId, batchId, proofId },
});
// → { record, source: 'variant' | 'product' | 'facet' | … } | null
```

Apps that only support a subset of scopes pass `supportedScopes: ['product', 'facet']` and the resolver skips the rest.

---

## 5. Scope capabilities (declared per app)

An app declares which scopes it accepts records for in `app.manifest.json`. This drives the admin UI and avoids dead tabs:

```json
// app.manifest.json (extension)
{
  "records": {
    "nutrition": {
      "scopes": ["product", "facet", "batch"],
      "defaultScope": "facet",
      "label": "Nutrition info"
    }
  }
}
```

| Field          | Meaning                                                        |
|----------------|----------------------------------------------------------------|
| `scopes`       | Allowed scope kinds, in **resolution order**.                  |
| `defaultScope` | Where the "Create new" button lands in the admin shell.        |
| `label`        | Human-readable label for the record type (used in headings).   |

The shared admin shell reads this manifest entry and renders only the relevant tabs. Apps don't hard-code tab lists.

See [app-manifest.md](app-manifest.md) for the full schema reference.

---

## 6. Discovering whether variants / batches are in use

The `Collection` object exposes top-level `variants: boolean` and `batches: boolean` flags that indicate whether the collection has these features enabled. Read them directly rather than probing by listing:

```ts
import { appConfiguration } from '@proveanything/smartlinks';

const collection = await appConfiguration.getCollection(collectionId);

const showVariantTab = collection.variants && scopeConfig?.scopes.includes('variant') === true;
const showBatchTab   = collection.batches  && scopeConfig?.scopes.includes('batch') === true;
```

`scopeConfig` is the parsed manifest `records` entry for this `recordType` — e.g. `manifest.records?.nutrition`.

Rules:

1. If the collection has the feature **and** the app **declares** support for the scope, show the tab and offer "Add variant" / "Add batch" affordances.
2. If the app does **not** declare support, hide the tab entirely even if `collection.variants` is true (another app created them).
3. If the collection does not have the feature enabled, hide the tab even if the app declares support.

---

## 7. Inheritance & overrides

Because resolution is first-match-wins, the admin UI must make inheritance **visible**:

- When editing a **variant** record, show the **product** record as the inherited baseline.
- Each field in the editor displays a small **↩ "Inherited"** marker when its value matches the parent and **● "Override"** when it differs.
- A row-level "Reset to inherited" action removes the override (deletes the record at the current scope if all overrides are reset).

Apps don't have to implement this themselves — the `<RecordEditor>` primitive in `@proveanything/smartlinks-utils-ui` does it given the resolved parent payload.

---

## 8. Bulk operations

Standard verbs every shell should expose:

| Verb              | Behaviour                                                            |
|-------------------|----------------------------------------------------------------------|
| **Apply to many** | Take the current record's payload, write it to N selected products / variants. |
| **Copy from**     | Pick a source scope, copy its payload to the current scope.          |
| **Clear**         | Delete records at the current scope (children unaffected).           |

Use the `bulkUpsert` / `bulkDelete` helpers from `@proveanything/smartlinks-utils-ui/records-admin`, which handle batching and error collection for you:

```ts
import { bulkUpsert, bulkDelete } from '@proveanything/smartlinks-utils-ui/records-admin';

// Apply current payload to many refs
await bulkUpsert({ SL, collectionId, appId, recordType, refs: targetRefs, data: payload });

// Clear records at selected refs
await bulkDelete({ SL, collectionId, appId, recordType, refs: targetRefs });
```

If you are using `<RecordsAdminShell>`, the bulk actions menu is included and wired automatically via the `onTelemetry` hook — you don't call these directly unless you're building a custom shell.

---

## 9. CSV import / export

If your app exposes CSV import/export, use this column shape so files round-trip across apps:

```
scope,scopeRef,<field1>,<field2>,...
product,prod_abc,250,12.5,...
variant,prod_abc/var_500ml,260,12.5,...
batch,prod_abc/B-2024-03,255,12.5,...
facet,bread_type/sourdough,240,11.0,...
```

- `scope` is the kind; `scopeRef` is the human-readable reference (the shell maps it to the canonical `ref`).
- Validation errors return a downloadable annotated CSV with an `error` column appended.

#### If you ship CSV

- Round-tripping (export → reimport unchanged) must be a no-op.

---

## 10. Public-side hook contract

To keep widgets consistent across apps, expose one hook per record type (from `@proveanything/smartlinks-utils-ui`):

```ts
import { useResolvedRecord } from '@proveanything/smartlinks-utils-ui/records-admin';

const { data, source, isLoading } = useResolvedRecord({
  SL,
  appId,
  recordType: 'nutrition',
  // any combination of these — the hook walks the chain:
  collectionId, productId, variantId, batchId, proofId,
});
```

`source` is one of `'proof' | 'batch' | 'variant' | 'product' | 'facet' | 'universal' | null`. UI can show a badge ("Showing batch-specific values") when useful.

---

## 11. Telemetry

All admin shells emit these events. The `<RecordsAdminShell>` from `@proveanything/smartlinks-utils-ui` wires them automatically using `interactions.appendEvent` from the SDK — apps don't call this themselves.

| Event                  | Props                                                |
|------------------------|------------------------------------------------------|
| `record.opened`        | `appId, recordType, ref, source`                     |
| `record.saved`         | `appId, recordType, ref, fieldsChanged`              |
| `record.deleted`       | `appId, recordType, ref`                             |
| `record.bulkApplied`   | `appId, recordType, sourceRef, targetCount`          |
| `record.imported`      | `appId, recordType, rows, errors`                    |

---

## 12. Required reading for app authors

1. This document.
2. The companion **[UI utils guide](ui-utils.md)** — explains the React primitives (`<RecordsAdminShell>`, `useResolvedRecord`, etc.) that implement this pattern.
3. [PRODUCT_FACETS_SDK.md](PRODUCT_FACETS_SDK.md) — facet model.
4. [app-data-storage.md](app-data-storage.md) — `app.records` surface.

## 13. Migration checklist for existing apps

- [ ] Stop writing per-product data into `appConfiguration`.
- [ ] Move to `app.records` with `recordType` + `ref`.
- [ ] Adopt the `ref` syntax in §3.
- [ ] Add a `records` block to `app.manifest.json`.
- [ ] Replace bespoke admin browser with `<RecordsAdminShell>` from `@proveanything/smartlinks-utils-ui`.
- [ ] Replace bespoke public hook with `useResolvedRecord`.
- [ ] Remove any "is variants enabled?" config — use `collection.variants` / `collection.batches` flags instead (§6).

---

## Appendix A — `ref` parser reference

This is the canonical implementation. Copy it into your app or import from `@proveanything/smartlinks-utils-ui/records-admin`.

```ts
type ParsedRef =
  | { kind: 'universal' }
  | { kind: 'product'; productId: string }
  | { kind: 'variant'; productId: string; variantId: string }
  | { kind: 'batch';   productId: string; batchId: string }
  | { kind: 'proof';   proofId: string }
  | { kind: 'facet';   facetKey: string; valueKey: string };

export const buildRef = (p: ParsedRef): string => {
  switch (p.kind) {
    case 'universal': return '';
    case 'product': return `product:${p.productId}`;
    case 'variant': return `variant:${p.productId}:${p.variantId}`;
    case 'batch':   return `batch:${p.productId}:${p.batchId}`;
    case 'proof':   return `proof:${p.proofId}`;
    case 'facet':   return `facet:${p.facetKey}:${p.valueKey}`;
  }
};

export const parseRef = (ref: string): ParsedRef | null => {
  if (!ref) return { kind: 'universal' };
  const [head, ...rest] = ref.split(':');
  switch (head) {
    case 'product': return rest.length === 1 ? { kind: 'product', productId: rest[0] } : null;
    case 'variant': return rest.length === 2 ? { kind: 'variant', productId: rest[0], variantId: rest[1] } : null;
    case 'batch':   return rest.length === 2 ? { kind: 'batch',   productId: rest[0], batchId:   rest[1] } : null;
    case 'proof':   return rest.length === 1 ? { kind: 'proof',   proofId:   rest[0] } : null;
    case 'facet':   return rest.length >= 2  ? { kind: 'facet',   facetKey:  rest[0], valueKey:  rest.slice(1).join(':') } : null;
    default: return null;
  }
};
```
