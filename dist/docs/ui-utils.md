# UI Utils — `@proveanything/smartlinks-utils-ui`

> **This page is a pointer.** Detailed, up-to-date docs for every component
> live in the UI Utils package itself. This SDK doc only summarises *what's
> in the box* and *when to reach for it* — so we don't have to update the
> SDK every time a UI Utils prop changes.

- **NPM:** [`@proveanything/smartlinks-utils-ui`](https://www.npmjs.com/package/@proveanything/smartlinks-utils-ui)
- **Source & docs:** [`smartlinks-ui` repo](https://github.com/proveanything/smartlinks-ui)
- **Per-component reference:** [`packages/smartlinks-ui/docs/`](https://github.com/proveanything/smartlinks-ui/tree/main/packages/smartlinks-ui/docs)
- **Tracks:** `@proveanything/smartlinks ≥ 1.13` (peer dep)

## Install

```bash
npm install @proveanything/smartlinks-utils-ui
# Peer deps you probably already have:
npm install react react-dom @proveanything/smartlinks @tanstack/react-query
```

Import the styles **once** in your app entry (typically `src/admin-main.tsx`):

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
| **RecordsAdminShell** | `/records-admin` | Full admin UI for the `app.records` pattern. Top-level scopes: **Global** (`'collection'`), **Rule** (`'rule'`, AND-of-OR over facets), and **Product** — with automatic variant & batch drill-down where the collection enables them. Browser pane, editor pane with sticky save/discard/delete, optimistic save, deep-linking, lifecycle hooks, conflict handling. Decide [cardinality](https://github.com/proveanything/smartlinks-ui/blob/main/packages/smartlinks-ui/docs/records-admin-shell.md#-choosing-cardinality-read-this-first) up front: `'singleton'` (one winning record per scope — warranty, nutrition) vs `'list'` (many records per scope — auction items, FAQs, gallery). |
| **Records hooks** | `/records-admin` | `useResolvedRecord`, `useMergedRecord`, `useCollectedRecords`, `useResolveAllRecords`, `useRulePreview`, … for the **public widget** side. |
| **AdminPageHeader** | (root) | Standardised title / subtitle / icon / help / actions header. **Required** for any admin app that doesn't mount `RecordsAdminShell` (which embeds it). No bespoke admin chrome. |
| **AssetPicker** | `/asset-picker` | Pick / upload / paste / URL-import / AI-generate / stock-search / crop media assets. MIME filtering, scope-aware, tag editor. |
| **IconPicker** | `/icon-picker` | Searchable Font Awesome 7 Pro picker (requires the FA kit script on the host page). |
| **FontPicker** | `/font-picker` | Google Fonts catalogue + custom uploaded font families with live previews. |
| **ConditionsEditor** | `/conditions-editor` | Recursive AND/OR rule builder (12 condition types, facet-aware). |
| **FacetRuleEditor** | `/facet-rule-editor` | Author server-side facet rules (AND-of-OR) for record targeting. |
| **LinkPicker** | `/link-picker` | Universal navigation picker: external URL, an installed app, or a deep link inside an app. Stores a `LinkTarget` discriminated union — never a resolved URL. Ships with `resolveLink` and `useLinkTargets`. |
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
lifecycle hooks, conflict handling, design tokens) → **read the package docs**.

## Prerequisites

All components assume `SL.initializeApi()` has already run.

## Where to go next

- Component reference: <https://github.com/proveanything/smartlinks-ui/tree/main/packages/smartlinks-ui/docs>
- Records pattern (concepts, scope inheritance, resolution order): [`records-admin-pattern.md`](./records-admin-pattern.md)
- Public consumption (how widgets/executors fetch the right records at runtime): the package's [`public-consumption.md`](https://github.com/proveanything/smartlinks-ui/blob/main/packages/smartlinks-ui/docs/public-consumption.md)
