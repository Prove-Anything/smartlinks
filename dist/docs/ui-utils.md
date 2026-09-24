# UI Utils — `@proveanything/smartlinks-utils-ui`

The standardised, **admin-only** React toolkit for SmartLinks microapps. This page
is self-contained: the table and examples below are enough to build with. The
exhaustive per-component reference (props, slots, hooks, design tokens) ships
**inside the package** — read it from `node_modules/@proveanything/smartlinks-utils-ui/docs/`
after install. Nothing here depends on an external site.

- **NPM:** [`@proveanything/smartlinks-utils-ui`](https://www.npmjs.com/package/@proveanything/smartlinks-utils-ui)
- **Per-component reference:** `node_modules/@proveanything/smartlinks-utils-ui/docs/*.md`
  (`records-admin-shell.md`, `admin-page-header.md`, `asset-picker.md`, `conditions-editor.md`,
  `facet-rule-editor.md`, `link-picker.md`, `records-admin-hooks.md`, `public-consumption.md`, …)
- **Tracks:** `@proveanything/smartlinks ≥ 2.0` (peer dep)

## Admin is standardised; the consumer surface is bespoke

Two different design mandates, and the split is deliberate:

- **Admin surfaces** (the desktop `admin.html` a brand operator uses) are a
  **product family** — like Salesforce: consistent, predictable chrome across every
  app an operator opens. Do **not** hand-roll admin tables, editors or page headers.
  Mount `RecordsAdminShell` for anything record-shaped; otherwise wrap the page in
  `AdminPageHeader` and use the pickers. That consistency *is* the product.
- **Consumer / public surfaces** (the container, widgets, public pages the
  end-customer sees) are **bespoke and brand-led** — entirely your design. utils-ui
  belongs here only as read-side hooks (`useResolvedRecord`, `useResolveAllRecords`),
  never as UI.

## Install

```bash
npm install @proveanything/smartlinks-utils-ui
# Peer deps you probably already have:
npm install react react-dom @proveanything/smartlinks @tanstack/react-query
```

Import the styles **once** in your admin entry (typically `src/admin-main.tsx`):

```ts
import '@proveanything/smartlinks-utils-ui/styles.css';
```

Components inherit your shadcn-compatible CSS variables (`--primary`,
`--background`, `--border`, …) — no extra theming required.

> **Admin-only.** Every component in this package calls the SDK with
> `admin: true` somewhere (save, upload, etc.). Never import it from a
> public widget or from `MobileAdminContainer`.

## What's in the box

| Module | Subpath import | Use it for |
|---|---|---|
| **RecordsAdminShell** | `/records-admin` | Full admin UI for the `app.records` pattern. Top-level scopes: **Global** (`'collection'`), **Rule** (`'rule'`, AND-of-OR over facets), and **Product** — with automatic variant & batch drill-down where the collection enables them. Browser pane, editor pane with sticky save/discard/delete, optimistic save, deep-linking, lifecycle hooks, conflict handling. Decide **cardinality** up front: `'singleton'` (one winning record per scope — warranty, nutrition) vs `'list'` (many records per scope — auction items, FAQs, gallery). See `docs/records-admin-shell.md`. |
| **Records hooks** | `/records-admin` | `useResolvedRecord`, `useMergedRecord`, `useCollectedRecords`, `useResolveAllRecords`, `useRulePreview`, … for the **public widget** side. See `docs/records-admin-hooks.md`. |
| **AdminPageHeader** | (root) | Standardised title / subtitle / icon / help / actions header. **Required** for any admin app that doesn't mount `RecordsAdminShell` (which embeds it). No bespoke admin chrome. |
| **AssetPicker** | `/asset-picker` | Pick / upload / paste / URL-import / AI-generate / stock-search / crop media assets. MIME filtering, scope-aware, tag editor. |
| **IconPicker** | `/icon-picker` | Searchable Font Awesome 7 Pro picker (requires the FA kit script on the host page). |
| **FontPicker** | `/font-picker` | Google Fonts catalogue + custom uploaded font families with live previews. |
| **ConditionsEditor** | `/conditions-editor` | Recursive AND/OR rule builder (12 condition types, facet-aware). |
| **FacetRuleEditor** | `/facet-rule-editor` | Author server-side facet rules (AND-of-OR) for record targeting. |
| **LinkPicker** | `/link-picker` | Universal navigation picker: external URL, an installed app, or a deep link inside an app. Stores a `LinkTarget` discriminated union — never a resolved URL. Ships with `resolveLink` and `useLinkTargets`. |
| **Liquid editors** | `/liquid-editor` | Author Liquid templates with a code or rich (TipTap) editor, variable autocomplete. |
| **Hints** | (root) | `useHintsPreference`, `useIntroState`, `HintsPreferenceToggle` — global "show/hide intro hints" preference shared across admin apps. |

Each module has a per-subpath export so bundlers tree-shake the rest:

```ts
import { RecordsAdminShell } from '@proveanything/smartlinks-utils-ui/records-admin';
import { AssetPicker }       from '@proveanything/smartlinks-utils-ui/asset-picker';
```

## Minimal examples

### Records admin (most apps need this)

```tsx
import { RecordsAdminShell } from '@proveanything/smartlinks-utils-ui/records-admin';
import * as SL from '@proveanything/smartlinks';

<RecordsAdminShell
  SL={SL}
  collectionId={collectionId}
  appId={appId}
  recordType="nutrition"
  label="Nutrition info"
  scopes={['collection', 'rule', 'product']}   // canonical top-level tabs
  // items={{ cardinality: 'list' }}           // ← opt in for multi-item apps
  defaultData={() => ({})}
  renderEditor={(ctx) => <NutritionForm ctx={ctx} />}
/>
```

### Public widget — read the resolved value

```tsx
import { useResolvedRecord } from '@proveanything/smartlinks-utils-ui/records-admin';

const { data, source } = useResolvedRecord({
  SL, appId, recordType: 'nutrition',
  collectionId, productId, variantId, batchId,
});
// source: 'proof' | 'batch' | 'variant' | 'product' | 'rule' | 'collection' | null
```

For multi-item (`cardinality: 'list'`) apps, use `useResolveAllRecords` /
`app.records.resolveAll()` instead — it returns every applicable record, not
just the winner.

For everything else (props, slots, cardinality decisions, deep-link adapters,
lifecycle hooks, conflict handling, design tokens) → **read the matching file in
`node_modules/@proveanything/smartlinks-utils-ui/docs/`**.

## Prerequisites

All components assume `SL.initializeApi()` has already run.

## Where to go next

- Per-component reference (shipped with the package): `node_modules/@proveanything/smartlinks-utils-ui/docs/`
- Records pattern (concepts, scope inheritance, resolution order): [`app-records-pattern.md`](./app-records-pattern.md)
