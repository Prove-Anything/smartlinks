# SmartLinks UI Utils (`@proveanything/smartlinks-utils-ui`)

> Companion React component library for the SmartLinks SDK. Ships the heavy,
> opinionated admin UI pieces that almost every SmartLinks microapp ends up
> needing — built once, theme-able, tree-shakeable, and wired straight into
> the SmartLinks SDK.
>
> Package: `@proveanything/smartlinks-utils-ui`
> Tracks: `@proveanything/smartlinks ≥ 1.9` (some hooks require ≥ 1.10)

---

## What is this module for?

`@proveanything/smartlinks-utils-ui` sits on top of `@proveanything/smartlinks`.
The core SDK handles data — records, configurations, interactions. This module
handles **UI** — the shared React components, hooks, and admin shells that
translate SDK data into consistent admin interfaces.

**When do you need it?**

- You are building an admin UI for a records-based microapp (see [app-records-pattern.md](app-records-pattern.md))
- You need a media asset picker, icon picker, or font picker in an admin panel
- You need a recursive rule/conditions editor for targeting or audience logic
- You want the standard inheritance/override editor for scoped records
- You need the `useResolvedRecord` / `useCollectedRecords` hooks on the public widget side

You do **not** need it for apps that only use `appConfiguration`, basic widgets
without scoped data, or executor bundles.

> **Admin components are admin-only**: `RecordsAdminShell`, `AssetPicker` upload,
> `FacetRuleEditor`, etc. call the SDK with `admin: true`. Do not render them in
> public-facing views. The public-side hooks (`useResolvedRecord`,
> `useCollectedRecords`) are safe in widgets.

---

## Install

```bash
npm install @proveanything/smartlinks-utils-ui
```

Peer dependencies (you already have these in a SmartLinks app):

```bash
npm install react react-dom @proveanything/smartlinks @tanstack/react-query
```

`@tanstack/react-query` is required by every hook and by `RecordsAdminShell`
(caching, pagination, optimistic save). Wrap your app in a
`<QueryClientProvider>` somewhere up the tree.

Import the compiled styles **once** in your app entry (e.g. `main.tsx`):

```tsx
import '@proveanything/smartlinks-utils-ui/styles.css';
```

Components inherit your shadcn-compatible CSS variables (`--primary`,
`--background`, `--border`, …) so they pick up your theme automatically.

---

## What's in the box

| Module | What it is | When to reach for it |
|--------|------------|----------------------|
| [Records Admin Shell](#records-admin-shell) | Full admin UI for `app.records` with scope inheritance, cardinality, and rule editing | Per-product / per-variant / per-batch / per-facet config tools |
| [FacetRuleEditor](#facet-rule-editor) | Standalone facet-rule builder with live preview | When you need rule editing outside the admin shell |
| [Asset Picker](#asset-picker) | Browse / upload / paste / URL-import images and files | Any time the admin needs to pick or upload media |
| [Icon Picker](#icon-picker) | Searchable Font Awesome 7 Pro picker | Configurable buttons, badges, menus, tiles |
| [Font Picker](#font-picker) | Google Fonts + custom uploaded fonts | Theme editors, brand customisation panels |
| [Conditions Editor](#conditions-editor) | Recursive AND/OR rule builder for 12 condition types | Targeting, gating, audience rules, segmentation |

---

## Records Admin Shell

The primary export. A complete admin UI for managing `app.records` — typed
JSON blobs attached to facets, products, variants, batches, the collection
root, or matched via facet rules — with scope inheritance built in. You
provide the form for one record; the shell handles everything else.

```tsx
import {
  RecordsAdminShell,
  InheritanceMarker,
  type EditorContext,
} from '@proveanything/smartlinks-utils-ui/records-admin';
import * as SL from '@proveanything/smartlinks';

<RecordsAdminShell<NutritionData>
  SL={SL}
  collectionId={collectionId}
  appId={appId}
  recordType="nutrition"
  label="Nutrition info"
  scopes={['facet', 'product', 'variant', 'batch']}
  contextScope={{ productId, variantId, batchId }}   // from iframe URL — optional
  defaultData={() => ({})}
  csvSchema={{ columns: [/* ... */] }}              // optional — omit to disable CSV
  renderEditor={(ctx) => <NutritionForm ctx={ctx} />}
  renderPreview={({ resolved }) => (
    <pre>{JSON.stringify(resolved, null, 2)}</pre>
  )}
/>
```

### Valid `ScopeKind` values

```ts
type ScopeKind = 'collection' | 'product' | 'facet' | 'variant' | 'batch' | 'rule';
```

- `'collection'` — terminal default (one record for the whole brand)
- `'facet'` — anchored to a facet value (e.g. `bagel-type=white`)
- `'product'` / `'variant'` / `'batch'` — anchored to that node
- `'rule'` — synthetic UI scope: records targeted via a `facetRule`
  (AND-of-OR over facets) rather than pinned to a node. Their refs start
  with `rule:`, and the shell renders the `<FacetRuleEditor>` inline when the
  user opens one of these records.

### What it handles

- **Browser pane** with scope tabs (Facet / Product / Variant / Batch / Rule), search, and status filter pills
- **Editor pane** with sticky save / discard / delete footer, optimistic save, and an unsaved-drafts tray
- **Per-field `<InheritanceMarker>`** showing whether a value is the record's own or inherited from a parent scope, with one-click revert-to-inherited
- **Inheritance resolver** walks `proof → batch → variant → product → rule → facet → collection` server-side via SDK 1.10 `match()`
- **Collection-aware tabs**: calls `collection.get` and hides Variants / Batches tabs unless `collection.variants` / `collection.batches` are true — no flicker
- **Server-side pagination** via `useInfiniteQuery` — handles thousands of products with a "Load more" button
- **Context-aware**: pass `contextScope` from your iframe URL (`productId` / `variantId` / `batchId`) and the browser is constrained to that subtree with the right tab auto-selected
- **Cardinality**: `cardinality="singleton"` (one record per scope) or `"collection"` (many — FAQs, recipes, SOPs). Collection mode adds an item-list view (`itemViews: ['table' | 'cards' | 'gallery']`) and Back / prev / next nav
- **Multiple presentations** for the rail (`presentations: ['list' | 'compact']`) and right pane
- **CSV import / export** (optional — provide `csvSchema` to enable); failed rows come back as an annotated CSV
- **Bulk actions menu** (apply-to-many, copy-from, clear) via `bulkUpsert` / `bulkDelete`
- **Clipboard** — copy a record's value, paste onto another scope
- **Telemetry hook** (`onTelemetry`) emits typed events for save, delete, scope change, CSV import/export, bulk apply
- **i18n strings** fully overridable via the `i18n` prop

> Requires a `<QueryClientProvider>` from `@tanstack/react-query` somewhere up the tree.

### Lower-level pieces (advanced use)

```tsx
import {
  // Hooks
  useRecordList, useRecordEditor, useResolvedRecord, useCollectedRecords,
  useResolveAllRecords, useRulePreview, useScopeProbe,
  // Data helpers
  parseRef, buildRef, resolutionChain,
  listRecords, getRecordById, createRecord, upsertRecord,
  removeRecord, restoreRecord, matchRecords,
  bulkUpsert, bulkDelete,
  exportCsv, importCsv, downloadBlob,
  // UI pieces
  RecordBrowser, RecordEditor, ScopeBreadcrumb,
  InheritanceMarker, ResolvedPreview, BulkActionsMenu,
  // Drafts / unsaved state
  DirtyDraftProvider, useDirtyDrafts, useUnsavedGuard,
} from '@proveanything/smartlinks-utils-ui/records-admin';
```

Note the names: it's `getRecordById` (not `getRecordByRef`) and `removeRecord`
(not `deleteRecord`). Records are addressed by UUID `id` internally; refs
(`product:abc123`) are only used for display / breadcrumb / URL purposes.

### `useResolvedRecord` hook

Use on the **public widget side** when the app shows one answer for the
current product (singleton cardinality). Walks the inheritance chain
server-side and returns the first match.

```ts
import { useResolvedRecord } from '@proveanything/smartlinks-utils-ui/records-admin';

const { data, source, sourceRef, recordId, facetRule, isLoading, error } =
  useResolvedRecord<NutritionData>({
    SL,
    appId,
    recordType: 'nutrition',
    collectionId,
    productId,
    variantId,   // optional
    batchId,     // optional
    proofId,     // optional
    // recordId,  // optional — direct UUID lookup, bypasses inheritance
  });
// source: 'self' | 'proof' | 'batch' | 'variant' | 'product' | 'facet' | 'universal' | 'empty'
```

- `source` — which scope the winning record came from. `'self'` is returned
  when you passed an explicit `recordId`; `'empty'` when nothing matched.
- `sourceRef` — the ref of the matched record (e.g. `product:abc123`).
- `recordId` — the UUID of the matched record.
- `facetRule` — present when the match came from a rule-targeted record.

Pass `recordId` directly when you already know the UUID (deep links, rule
records) — the hook will skip the inheritance walk entirely.

### `useCollectedRecords` hook

Use on the **public widget side** when the app shows many answers
(collection cardinality — FAQs, recipes, care tips). Returns every matching
record across the chain, most-specific first.

```ts
import { useCollectedRecords } from '@proveanything/smartlinks-utils-ui/records-admin';

const { items, isLoading, error } = useCollectedRecords<FaqEntry>({
  SL, appId, collectionId,
  recordType: 'faq',
  productId,
  // sort: { kind: 'field', field: 'order', direction: 'asc' },
});
// items: CollectedRecord<FaqEntry>[] — each has { data, scope, ref, depth }
```

`depth: 0` is the most-specific match. Default sort is by specificity
descending; pass `{ kind: 'field', field, direction }` to sort by a payload
field instead (with specificity as a stable tiebreak).

### `useResolveAllRecords` hook

When you need every record of every declared type that applies to a context —
rare, mostly used in executors and SEO surfaces.

```ts
import { useResolveAllRecords } from '@proveanything/smartlinks-utils-ui/records-admin';

const { entries, isLoading } = useResolveAllRecords({
  SL, collectionId, appId,
  context: { productId, facets: { brand: 'acme' } },
});
```

### `useRulePreview` hook

Wire into `<FacetRuleEditor>` (or any custom rule UI) to show a live
"matches N products" count as the rule is edited. Debounced — safe to call
on every keystroke.

```ts
import { useRulePreview } from '@proveanything/smartlinks-utils-ui/records-admin';

const preview = useRulePreview({
  SL, collectionId, appId,
  rule,            // FacetRule | null
  // limit: 20,
  // debounceMs: 350,
});
// preview: {
//   totalMatches: number | null;
//   sampleProductIds: string[];
//   isLoading: boolean;
//   isStale: boolean;
//   error: Error | null;
// }
```

Pass `preview` straight into `<FacetRuleEditor preview={preview} />`.

### `useScopeProbe` hook

Reports whether a collection has variants/batches enabled, so the shell
(or your own UI) can hide the corresponding tabs without flicker.

```ts
import { useScopeProbe } from '@proveanything/smartlinks-utils-ui/records-admin';

const { hasVariants, hasBatches, isLoading } = useScopeProbe({
  SL, collectionId,
});
```

It's a thin wrapper around `SL.collection.get(collectionId).variants /.batches`
(SDK ≥ 1.9). It does **not** report per-scope record status — that's handled
internally by the shell's status pills.

### `parseRef` / `buildRef` utilities

```ts
import { parseRef, buildRef } from '@proveanything/smartlinks-utils-ui/records-admin';

const parsed = parseRef('variant:prod_abc:var_500ml');
// → { kind: 'variant', productId: 'prod_abc', variantId: 'var_500ml', raw: '...' }

const ref = buildRef({ kind: 'product', productId: 'prod_abc', raw: '' });
// → 'product:prod_abc'
```

Refs are for display, breadcrumbs, and URLs. Records are addressed by UUID
`id` everywhere internally.

---

## Facet Rule Editor

A standalone facet-rule builder. The `<RecordsAdminShell>` embeds this
automatically when `'rule'` is in `scopes` and the user opens a rule-targeted
record — reach for it directly only when you need rule editing elsewhere
(e.g. a settings page, a conditions sidebar).

```tsx
import { FacetRuleEditor } from '@proveanything/smartlinks-utils-ui/facet-rule-editor';
import { useRulePreview } from '@proveanything/smartlinks-utils-ui/records-admin';

const preview = useRulePreview({ SL, collectionId, appId, rule });

<FacetRuleEditor
  value={rule}
  onChange={setRule}
  collectionId={collectionId}   // lazy-fetches facet definitions via SL.facets.publicList
  preview={preview}              // optional — wire from useRulePreview
  onClear={() => setRule(null)}  // optional — renders a "Remove rule" affordance
/>
```

Props:

- `value: FacetRule | null` / `onChange: (next: FacetRule | null) => void` — controlled
- `facets?: FacetOption[]` — supply directly, **or** pass `collectionId` and the editor lazy-fetches via `SL.facets.publicList`
- `getFacets?: (collectionId: string) => Promise<FacetOption[]>` — override the lazy-fetcher
- `preview?` — `{ totalMatches, sampleProductIds?, isLoading?, isStale?, error? }` (matches the `useRulePreview` return shape)
- `readOnly?`, `onClear?`, `title?`, `description?`, `className?`

Free-text facet entry is **not** supported — admins must pick from defined facets.

See [app-records-pattern.md §4](app-records-pattern.md#4-admin-side----recordsadminshell-the-only-thing-you-should-be-writing) for the standalone usage example.

---

## Asset Picker

```tsx
import { AssetPicker } from '@proveanything/smartlinks-utils-ui/asset-picker';

<AssetPicker
  scope={{ type: 'collection', collectionId: 'abc123' }}
  mode="dialog"               // or "inline"
  allowUpload
  accept={['image/*']}        // MIME filtering
  onSelect={(asset) => setHeroUrl(asset.url)}
  trigger={<Button>Choose image</Button>}
/>
```

Scope shape:

```ts
type AssetScope =
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string };
```

**What it does:**

- Browses assets at **collection**, **product**, or **proof** scope
- Optional `productScope` prop adds a second tab so users can pick from product-level assets while editing at collection scope (or vice versa)
- Optional `appId` prop stamps every upload with the owning app and adds "This app" / "All in collection" pill tabs with provenance badges on assets owned by other apps
- Four ingest paths: file upload, URL import, clipboard paste (with rename preview), and selection from existing assets
- Inline mode for embedding in a panel; dialog mode for modal pickers
- Double-click a tile to confirm instantly

---

## Icon Picker

```tsx
import { IconPicker } from '@proveanything/smartlinks-utils-ui/icon-picker';

<IconPicker
  mode="dialog"
  value="fa-solid fa-heart"
  onSelect={(icon) => setIcon(icon.name)}
  trigger={<Button>Pick icon</Button>}
/>
```

`onSelect` receives:

```ts
interface IconSelection {
  name: string;                                  // full CSS class, e.g. 'fa-solid fa-heart'
  family: 'classic' | 'duotone' | 'brands';
  style: 'solid' | 'regular' | 'light' | null;   // null for brands
  label?: string;
}
```

**What it does:**

- Searches **Font Awesome 7 Pro** (uses the shared kit)
- Family hierarchy: Classic (Solid / Regular / Light), Duotone, and Brands
- Search-first with a background catalogue crawler — first results appear instantly, the full index fills in behind
- Auto-switches families intelligently (e.g. brand searches surface brand icons even when "Classic" is selected)

> Requires the FA kit script to be present on the host page.

---

## Font Picker

```tsx
import { FontPicker } from '@proveanything/smartlinks-utils-ui/font-picker';

<FontPicker
  mode="dialog"
  value="Inter"
  showPreview
  onSelect={(font) => {
    console.log(font.family);        // "Inter"
    console.log(font.cssFontFamily); // "'Inter', ui-sans-serif, system-ui, sans-serif"
    console.log(font.loadSnippet);   // <link href="..." rel="stylesheet">
  }}
/>

{/* With custom fonts uploaded into the collection */}
<FontPicker
  mode="dialog"
  showCustomFonts
  scope={{ collectionId: 'abc123' }}
  onSelect={(font) => /* ... */}
/>
```

**What it does:**

- Full **Google Fonts** catalogue plus any **custom fonts** uploaded for the brand (stored via `appConfiguration` under `customFonts`)
- Upload zone auto-detects weight/style from the filename (e.g. `MyFont-BoldItalic.woff2`)
- Returns a `FontSelection` with `family`, `cssFontFamily`, and a ready-to-inject `loadSnippet` (`<link>` for Google fonts, `@font-face` CSS for custom uploads)
- Lazy-loads previews via `IntersectionObserver`; includes a management UI for editing custom font definitions

---

## Conditions Editor

```tsx
import { ConditionsEditor } from '@proveanything/smartlinks-utils-ui/conditions-editor';

<ConditionsEditor
  value={rules}
  onChange={setRules}
  collectionId={collectionId}     // auto-loads facet definitions
  versions={[{ title: 'Default', value: '' }]}
  tags={['featured', 'new']}
/>
```

**What it does:**

- Recursive AND / OR group builder — nest conditions to any depth
- **12 condition types:** Version, Country, Value, User, Date, Device, Tag, Facet, Geofence, Product, Item Status, Condition Reference
- **Facet condition** auto-fetches definitions from `facets.publicList(collectionId, { includeValues: true })` when only `collectionId` is passed (SDK ≥ 1.9.20)
- **Country picker** is a searchable multi-select with removable ISO 3166-1 chips and a "Use regions" toggle
- Renders correctly inside iframe contexts — avoids `overflow-hidden` so dropdowns escape their cards

> `ConditionsEditor` and `FacetRuleEditor` solve different problems.
> `FacetRuleEditor` is a focused AND-of-OR rule over facets only, used to
> target which records apply to which products. `ConditionsEditor` is the
> full recursive logical builder over 12 condition types, used for runtime
> gating, audience segmentation, and version targeting.

---

## Tree shaking

Each component has its own subpath export:

```tsx
// Bundles only the Asset Picker
import { AssetPicker } from '@proveanything/smartlinks-utils-ui/asset-picker';

// Barrel import — bundler tree-shakes the rest
import { AssetPicker } from '@proveanything/smartlinks-utils-ui';
```

If you use subpath imports, import `styles.css` separately — subpaths do not
pull it in automatically.

Available subpaths:

- `/records-admin`
- `/facet-rule-editor`
- `/asset-picker`
- `/icon-picker`
- `/font-picker`
- `/conditions-editor`
- `/styles.css`

---

## Relationship to the core SDK

```text
@proveanything/smartlinks            ← data layer (records, config, interactions, …)
        ↑
@proveanything/smartlinks-utils-ui   ← UI layer (components, hooks, admin shells)
        ↑
your microapp                        ← domain logic and custom forms
```

---

## Further reading

- [app-records-pattern.md](app-records-pattern.md) — the data contract that `RecordsAdminShell` implements
- [building-react-components.md](building-react-components.md) — dual-mode rendering rules that apply to all components
- [app-manifest.md](app-manifest.md) — the `records` manifest block that drives tab generation