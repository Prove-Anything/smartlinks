# SmartLinks UI Utils (`@proveanything/smartlinks-utils-ui`)

> Companion React component library for the SmartLinks SDK. Ships the heavy, opinionated admin UI pieces that almost every SmartLinks microapp ends up needing — built once, theme-able, tree-shakeable, and wired straight into the SmartLinks SDK.
>
> Package: `@proveanything/smartlinks-utils-ui`  
> Tracks: `@proveanything/smartlinks ≥ 1.9`

---

## What is this module for?

`@proveanything/smartlinks-utils-ui` sits on top of `@proveanything/smartlinks`. The core SDK handles data — records, configurations, interactions. This module handles **UI** — the shared React components, hooks, and admin shells that translate SDK data into consistent admin interfaces.

**When do you need it?**

- You are building an admin UI for a records-based microapp (see [records-admin-pattern.md](records-admin-pattern.md))
- You need a media asset picker, icon picker, or font picker in an admin panel
- You need a recursive rule/conditions editor for targeting or audience logic
- You want the standard inheritance/override editor for scoped records
- You need the `useResolvedRecord` hook on the public widget side

You do **not** need it for apps that only use `appConfiguration`, basic widgets without scoped data, or executor bundles.

> **Admin-only**: all components call the SDK with `admin: true`. Do not render them in public-facing views.

---

## Install

```bash
npm install @proveanything/smartlinks-utils-ui
```

Peer dependencies (you already have these in a SmartLinks app):

```bash
npm install react react-dom @proveanything/smartlinks
# Recommended — enables caching and pagination in Records Admin Shell:
npm install @tanstack/react-query
```

Import the compiled styles **once** in your app entry (e.g. `main.tsx`):

```tsx
import '@proveanything/smartlinks-utils-ui/styles.css';
```

Components inherit your shadcn-compatible CSS variables (`--primary`, `--background`, `--border`, …) so they pick up your theme automatically.

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

The primary export. A complete admin UI for managing `app.records` — typed JSON blobs attached to facets, products, variants, and batches — with scope inheritance built in. You provide the form for one record; the shell handles everything else.

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
  csvSchema={{ columns: [/* ... */] }}  // optional — omit to disable CSV import/export
  renderEditor={(ctx) => <NutritionForm ctx={ctx} />}
  renderPreview={({ resolved }) => <pre>{JSON.stringify(resolved, null, 2)}</pre>}
/>
```

**What it handles:**

- **Browser pane** with scope tabs (Facet / Product / Variant / Batch), search, and status filter pills (All / Configured / Partial / Empty)
- **Editor pane** with sticky save / discard / delete footer
- **Per-field `<InheritanceMarker>`** showing whether a value is the record's own or inherited from a parent scope, with one-click revert-to-inherited
- **Inheritance resolver** walks `batch → variant → product → facet` and returns both the resolved and parent values
- **Collection-aware tabs**: calls `collection.get` and hides Variants / Batches tabs unless `collection.variants` / `collection.batches` are true — no flicker
- **Server-side pagination** via `useInfiniteQuery` — handles thousands of products with a "Load more" button
- **Context-aware**: pass `contextScope` from your iframe URL (`productId` / `variantId` / `batchId`) and the browser is constrained to that subtree with the right tab auto-selected
- **CSV import / export** (optional — provide `csvSchema` to enable); failed rows come back as an annotated CSV
- **Bulk actions menu** (apply-to-many, copy-from, clear) via `bulkUpsert` / `bulkDelete`
- **Telemetry hook** (`onTelemetry`) emits typed events for save, delete, scope change, CSV import/export, bulk apply
- **i18n strings** fully overridable

> Requires a `<QueryClientProvider>` from `@tanstack/react-query` somewhere up the tree.

### Lower-level pieces (advanced use)

```tsx
import {
  // Hooks
  useRecordList, useRecordEditor, useResolvedRecord, useScopeProbe,
  // Data helpers
  parseRef, buildRef, resolutionChain,
  listRecords, getRecordByRef, upsertRecord, deleteRecord,
  bulkUpsert, bulkDelete,
  exportCsv, importCsv, downloadBlob,
  // UI pieces
  RecordBrowser, RecordEditor, ScopeBreadcrumb,
  InheritanceMarker, ResolvedPreview, BulkActionsMenu,
} from '@proveanything/smartlinks-utils-ui/records-admin';
```

### `useResolvedRecord` hook

Use on the **public widget side** when the app shows one answer for the current product (singleton cardinality). Walks `proof → batch → variant → product → rule → facet → collection` server-side and returns the first match.

```ts
import { useResolvedRecord } from '@proveanything/smartlinks-utils-ui/records-admin';

const { data, source, matchedAt, matchedRule, isLoading } = useResolvedRecord<NutritionData>({
  SL,
  appId,
  recordType: 'nutrition',
  collectionId,
  productId,
  variantId,   // optional
  batchId,     // optional
  proofId,     // optional
});
// matchedAt: 'proof' | 'batch' | 'variant' | 'product' | 'rule' | 'facet' | 'collection' | null
```

### `useCollectedRecords` hook

Use on the **public widget side** when the app shows many answers (collection cardinality — FAQs, recipes, care tips). Returns every matching record across the chain, most-specific first.

```ts
import { useCollectedRecords } from '@proveanything/smartlinks-utils-ui/records-admin';

const { items, isLoading } = useCollectedRecords<FaqEntry>({
  SL, appId, collectionId,
  recordType: 'faq',
  productId,
  // sort: { kind: 'field', field: 'order', direction: 'asc' },
});
// items: CollectedRecord<FaqEntry>[] — each has { data, scope, ref, depth }
```

### `useResolveAllRecords` hook

When you need every record of every declared type that applies to a context — rare, mostly used in executors and SEO surfaces.

```ts
import { useResolveAllRecords } from '@proveanything/smartlinks-utils-ui/records-admin';

const { entries, isLoading } = useResolveAllRecords({
  SL, collectionId, appId,
  context: { productId, facets: { brand: 'acme' } },
});
```

### `useRulePreview` hook

Wire into `<FacetRuleEditor>` (or any custom rule UI) to show a live "matches N products" count as the rule is edited. Debounced — safe to call on every keystroke.

```ts
import { useRulePreview } from '@proveanything/smartlinks-utils-ui/records-admin';

const preview = useRulePreview({ SL, collectionId, rule });
// preview: { count: number; isLoading: boolean } | null
```

### `useScopeProbe` hook

Checks what data exists at a given scope before loading the full editor — used by the shell's browser pane to power the `Configured / Partial / Empty` status pills.

```ts
import { useScopeProbe } from '@proveanything/smartlinks-utils-ui/records-admin';

const { status } = useScopeProbe({
  SL, appId, collectionId,
  recordType: 'nutrition',
  scope: { productId },
});
// status: 'configured' | 'partial' | 'empty'
```

### `parseRef` / `buildRef` utilities

```ts
import { parseRef, buildRef } from '@proveanything/smartlinks-utils-ui/records-admin';

const parsed = parseRef('variant:prod_abc:var_500ml');
// → { kind: 'variant', productId: 'prod_abc', variantId: 'var_500ml' }

const ref = buildRef({ kind: 'product', productId: 'prod_abc' });
// → 'product:prod_abc'
```

---

## Facet Rule Editor

A standalone facet-rule builder. The `<RecordsAdminShell>` embeds this automatically when `'rule'` is in `scopes` — reach for it directly only when you need rule editing elsewhere (e.g. a settings page, a conditions sidebar).

```tsx
import { FacetRuleEditor } from '@proveanything/smartlinks-utils-ui/facet-rule-editor';

<FacetRuleEditor
  value={rule}
  onChange={setRule}
  collectionId={collectionId}   // lazy-fetches facet definitions via SL.facets.publicList
  preview={rulePreview}          // optional — wire from useRulePreview
/>
```

See [records-admin-pattern.md §4](records-admin-pattern.md#4-admin-side----recordsadminshell-the-only-thing-you-should-be-writing) for the standalone usage example including `useRulePreview`.

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

**What it does:**
- Browses assets at **collection** or **product** scope (dual-scope tabs)
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

**What it does:**
- Searches **Font Awesome 7 Pro** (uses the shared kit `75493b59b3`)
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

---

## Tree shaking

Each component has its own subpath export:

```tsx
// Bundles only the Asset Picker
import { AssetPicker } from '@proveanything/smartlinks-utils-ui/asset-picker';

// Barrel import — bundler tree-shakes the rest
import { AssetPicker } from '@proveanything/smartlinks-utils-ui';
```

If you use subpath imports, import `styles.css` separately — subpaths do not pull it in automatically.

---

## Relationship to the core SDK

```
@proveanything/smartlinks            ← data layer (records, config, interactions, …)
        ↑
@proveanything/smartlinks-utils-ui   ← UI layer (components, hooks, admin shells)
        ↑
your microapp                        ← domain logic and custom forms
```

---

## Further reading

- [records-admin-pattern.md](records-admin-pattern.md) — the data contract that `RecordsAdminShell` implements
- [building-react-components.md](building-react-components.md) — dual-mode rendering rules that apply to all components
- [app-manifest.md](app-manifest.md) — the `records` manifest block that drives tab generation
