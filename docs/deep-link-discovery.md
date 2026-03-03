# Deep Link Discovery

Complete guide to registering and discovering navigable states in SmartLinks apps, enabling portal menus, AI orchestrators, and other apps to deep-link directly into specific views.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [The `linkable` Registry](#the-linkable-registry)
- [Schema: DeepLinkEntry](#schema-deeplinkentry)
- [Entry Types](#entry-types)
  - [Data-Driven (Dynamic)](#1-data-driven-entries-dynamic)
  - [Route-Based (Static)](#2-route-based-entries-static)
  - [Mixed](#3-mixed)
- [URL Resolution](#url-resolution)
- [Syncing the Registry](#syncing-the-registry)
- [Consumer Patterns](#consumer-patterns)
  - [Portal Navigation Menu](#portal-navigation-menu)
  - [AI Orchestration](#ai-orchestration)
  - [Cross-App Navigation](#cross-app-navigation)
- [Manifest Declaration](#manifest-declaration)
- [TypeScript Types](#typescript-types)
- [Rules & Best Practices](#rules--best-practices)

---

## Overview

SmartLinks apps can expose **deep-linkable states** — specific views, pages, or configurations that other apps, the portal, or AI orchestrators can navigate to directly without loading the app first.

This is done by publishing a `linkable` array in the app's `appConfig`. Any consumer (portal shell, AI agent, another app) can read this array to discover what navigable states the app currently offers.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Your SmartLinks App                                                  │
│                                                                      │
│  ┌───────────────────────┐     writes     ┌────────────────────────┐│
│  │  Admin / Data Events  │ ─────────────► │   appConfig.linkable   ││
│  └───────────────────────┘                └────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                                       │
                                          reads linkable[]
                                                       │
                   ┌───────────────────────────────────┼───────────────────────┐
                   ▼                                   ▼                       ▼
        ┌─────────────────────┐           ┌────────────────────┐   ┌─────────────────────┐
        │  Portal Nav Menu    │           │   AI Orchestrator  │   │    Another App      │
        │  (sidebar / drawer) │           │  ("Go to About Us")│   │  (cross-app nav)    │
        └─────────────────────┘           └────────────────────┘   └─────────────────────┘
```

### Key Benefits

- ✅ **Discoverable** — consumers don't need to know the app's internal routing
- ✅ **Decoupled** — the app owns the registry; consumers just read it
- ✅ **Dynamic** — the registry updates automatically when content changes
- ✅ **AI-friendly** — machine-readable titles make states naturally addressable by LLMs
- ✅ **No extra endpoints** — built on top of the existing `appConfiguration` API

---

## Quick Start

**App side — publish linkable states:**

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

await appConfiguration.setConfig({
  collectionId,
  appId,
  config: {
    // ... other app config ...
    linkable: [
      { title: 'Gallery', path: '/gallery' },
      { title: 'About Us', params: { pageId: 'about-us' } },
      { title: 'FAQ', params: { pageId: 'faq' } },
    ]
  },
  admin: true
});
```

**Consumer side — read linkable states:**

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

const config = await appConfiguration.getConfig({ collectionId, appId });
const linkable = config?.linkable ?? [];

// linkable = [
//   { title: 'Gallery', path: '/gallery' },
//   { title: 'About Us', params: { pageId: 'about-us' } },
//   { title: 'FAQ', params: { pageId: 'faq' } },
// ]
```

---

## The `linkable` Registry

Each app **MAY** store a `linkable` array at the top level of its `appConfig`. This array describes all the deep-linkable states the app currently exposes.

### Storage Location

The `linkable` key is **reserved** at the top level of `appConfig` for this purpose. Do not use it for anything else.

```typescript
// Writing
await appConfiguration.setConfig({
  collectionId,
  appId,
  config: {
    // ... other app config ...
    linkable: [ /* DeepLinkEntry[] */ ]
  },
  admin: true
});

// Reading
const config = await appConfiguration.getConfig({ collectionId, appId });
const linkable: DeepLinkEntry[] = config?.linkable ?? [];
```

### Admin vs Public Access

- **Writing** always requires `admin: true` — only the app itself (running with admin credentials) should update its own registry.
- **Reading** can be done publicly — portals and consumers typically read the registry without admin credentials.

---

## Schema: DeepLinkEntry

Each entry in the `linkable` array describes one navigable state:

```typescript
interface DeepLinkEntry {
  /** Human-readable label for this state (required) */
  title: string;

  /**
   * Hash-route path within the app (optional).
   * Omit or set to "/" for the app's default route.
   *
   * Examples: "/gallery", "/settings", "/settings/advanced"
   */
  path?: string;

  /**
   * App-specific query parameters (optional).
   * Appended to the URL as search params inside the hash route.
   * Used to specify content (e.g. which page, tab, or filter to show).
   *
   * Platform context params (collectionId, appId, productId, etc.)
   * are injected automatically — do NOT include them here.
   */
  params?: Record<string, string>;
}
```

### Field Notes

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ✅ | Displayed in menus and offered to AI agents. Should be concise and human-readable. |
| `path` | ❌ | Hash route within the app. Defaults to `/` if omitted. |
| `params` | ❌ | App-specific query params only. Platform params are injected automatically. |

> **Tip:** An entry with only a `title` (no `path` or `params`) is valid — it navigates to the app's default view. This is rarely useful unless the app's home screen is itself a meaningful destination distinct from other entries.

---

## Entry Types

### 1. Data-Driven Entries (Dynamic)

Generated from app data — e.g., CMS pages, product guides, FAQ items. These are typically re-synced whenever the underlying data changes.

```json
[
  { "title": "About Us",   "params": { "pageId": "about-us" } },
  { "title": "Care Guide", "params": { "pageId": "care-guide" } },
  { "title": "FAQ",        "params": { "pageId": "faq" } }
]
```

**When to use:** The set of linkable states depends on admin-created content. The registry is rebuilt whenever pages are added, removed, published, or renamed.

### 2. Route-Based Entries (Static)

Fixed routes that are built into the app. Declared once and rarely change.

```json
[
  { "title": "Gallery",             "path": "/gallery" },
  { "title": "Settings",            "path": "/settings" },
  { "title": "Advanced Settings",   "path": "/settings", "params": { "tab": "advanced" } }
]
```

**When to use:** The app has multiple built-in views (tabs, sections) that should always be directly navigable, regardless of content.

> **Note:** Different entries can share the same `path` if they differ by `params` — as in the Settings example above.

### 3. Mixed

Apps can freely combine both patterns. Static routes can appear alongside dynamic content entries:

```json
[
  { "title": "Gallery",    "path": "/gallery" },
  { "title": "About Us",   "params": { "pageId": "about-us" } },
  { "title": "FAQ",        "params": { "pageId": "faq" } },
  { "title": "Settings",   "path": "/settings" }
]
```

**Ordering:** Entries are displayed in array order. Place the most commonly navigated states first.

---

## URL Resolution

The parent platform constructs the final navigation URL from an entry by combining:

1. The app's **base URL**
2. The **entry point** (`index.html` for public routes, `admin.html` for admin routes)
3. The **hash route path** (defaults to `/`)
4. Platform **context params** (`collectionId`, `appId`, `productId`, etc.)
5. The entry's `params`

### Examples

| Entry | Resolved URL |
|-------|--------------|
| `{ title: "About Us", params: { pageId: "about-us" } }` | `https://app.example.com/#/?collectionId=abc&appId=my-app&pageId=about-us` |
| `{ title: "Advanced Settings", path: "/settings", params: { tab: "advanced" } }` | `https://app.example.com/admin.html#/settings?collectionId=abc&appId=my-app&tab=advanced` |
| `{ title: "Gallery", path: "/gallery" }` | `https://app.example.com/#/gallery?collectionId=abc&appId=my-app` |
| `{ title: "Home" }` | `https://app.example.com/#/?collectionId=abc&appId=my-app` |

### Injected Context Params

The platform automatically injects the following — **never include these in `params`**:

| Param | Source |
|-------|--------|
| `collectionId` | Active collection |
| `appId` | The app being navigated to |
| `productId` | Active product (if set) |
| `proofId` | Active proof (if set) |
| `lang` | Current language preference |
| `theme` | Active theme name |

---

## Syncing the Registry

### When to Sync

Apps **MUST** update the `linkable` array whenever the set of navigable states changes:

- A page is created, deleted, published, or unpublished
- A page's `deepLinkable` flag is toggled
- A page title changes
- App routes are added or removed

### How to Sync

The sync pattern is a **full replace** — read current config, overwrite `linkable`, save back. This avoids orphaned entries and keeps the logic simple.

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

async function syncLinkable(collectionId: string, appId: string): Promise<void> {
  // 1. Fetch the current set of linkable states from your data source
  //    Always fetch fresh — never rely on a local cache
  const entries = await fetchLinkableEntries(); // your app-specific logic

  // 2. Read the existing appConfig to preserve other keys
  let config: Record<string, unknown> = {};
  try {
    config = await appConfiguration.getConfig({
      collectionId,
      appId,
      admin: true,
    }) ?? {};
  } catch {
    // Config may not exist yet on first run — that's fine
  }

  // 3. Merge and save
  await appConfiguration.setConfig({
    collectionId,
    appId,
    config: { ...config, linkable: entries },
    admin: true,
  });
}
```

### What `fetchLinkableEntries` looks like

This function is app-specific. A typical CMS app might look like:

```typescript
async function fetchLinkableEntries(): Promise<DeepLinkEntry[]> {
  // Fetch your pages/content from the server (not from cache)
  const pages = await myApi.getPublishedPages({ forceRefresh: true });

  return pages
    .filter(page => page.deepLinkable)
    .map(page => ({
      title: page.title,
      params: { pageId: page.slug },
    }));
}
```

A route-based app simply returns a static array:

```typescript
async function fetchLinkableEntries(): Promise<DeepLinkEntry[]> {
  return [
    { title: 'Gallery', path: '/gallery' },
    { title: 'Settings', path: '/settings' },
  ];
}
```

### Idempotency

The sync is always a full replace of the `linkable` array. Running it multiple times with the same data produces the same result — no duplicates, no orphans.

### Clearing the Registry

To remove all linkable states (e.g., when an app is deactivated):

```typescript
await appConfiguration.setConfig({
  collectionId,
  appId,
  config: { ...config, linkable: [] },
  admin: true,
});
```

---

## Consumer Patterns

### Portal Navigation Menu

A portal shell can aggregate linkable states from all apps in a collection to build a unified navigation menu:

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

interface NavLink {
  appId: string;
  title: string;
  path?: string;
  params?: Record<string, string>;
}

async function buildNavMenu(collectionId: string, appIds: string[]): Promise<NavLink[]> {
  const links: NavLink[] = [];

  for (const appId of appIds) {
    const config = await appConfiguration.getConfig({ collectionId, appId });
    const entries: DeepLinkEntry[] = config?.linkable ?? [];

    links.push(
      ...entries.map(entry => ({ ...entry, appId }))
    );
  }

  return links;
}
```

### AI Orchestration

An AI agent can discover what states an app exposes and offer navigation as part of a conversation:

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

async function getNavigationOptions(collectionId: string, appId: string) {
  const config = await appConfiguration.getConfig({ collectionId, appId });
  const linkable: DeepLinkEntry[] = config?.linkable ?? [];

  // The AI now knows what's available:
  // "I can navigate you to: Gallery, About Us, or FAQ.
  //  Which would you prefer?"
  return linkable.map(entry => entry.title);
}
```

The `title` field is intentionally human-readable so it can be injected directly into LLM prompts without additional transformation.

### Cross-App Navigation

An app can use another app's `linkable` registry to construct a `NavigationRequest` for the portal's `onNavigate` callback:

```typescript
// Inside a widget or container's onNavigate handler
const targetConfig = await appConfiguration.getConfig({
  collectionId,
  appId: 'target-app-id',
});

const entry = targetConfig?.linkable?.find(e => e.title === 'About Us');

if (entry) {
  onNavigate({
    appId: 'target-app-id',
    deepLink: entry.path,
    params: entry.params,
  });
}
```

---

## Manifest Declaration

Apps that support deep linking **SHOULD** declare the `linkable` key in their `app.admin.json` config schema. This signals to platform tooling that the key is auto-managed and prevents accidental manual edits:

```json
{
  "setup": {
    "configSchema": {
      "properties": {
        "linkable": {
          "type": "array",
          "description": "Auto-managed deep link registry. Do not edit manually.",
          "readOnly": true,
          "items": {
            "type": "object",
            "required": ["title"],
            "properties": {
              "title":  { "type": "string", "description": "Human-readable label" },
              "path":   { "type": "string", "description": "Hash route path, e.g. '/gallery'" },
              "params": {
                "type": "object",
                "description": "App-specific query params. Do not include platform context params.",
                "additionalProperties": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}
```

> **Note:** The `readOnly: true` flag is a hint to the admin UI to hide or disable this field in manual config editors.

---

## TypeScript Types

Copy these types into your app, or import them if they become part of the SDK's public API:

```typescript
/**
 * A single navigable state exposed by a SmartLinks app.
 * Stored as an array at `appConfig.linkable`.
 */
export interface DeepLinkEntry {
  /** Human-readable label shown in menus and offered to AI agents */
  title: string;
  /**
   * Hash route path within the app.
   * Defaults to "/" if omitted.
   * Examples: "/gallery", "/settings"
   */
  path?: string;
  /**
   * App-specific query params appended to the hash route URL.
   * Do NOT include platform context params (collectionId, appId, etc.).
   */
  params?: Record<string, string>;
}

/**
 * The shape of the `linkable` key in appConfig.
 * Alias for convenience.
 */
export type DeepLinkRegistry = DeepLinkEntry[];
```

---

## Rules & Best Practices

### Rules

1. **`linkable` is reserved** — do not use this key for other purposes in `appConfig`.
2. **No platform context params in entries** — `collectionId`, `appId`, `productId`, `proofId`, `lang`, `theme` are injected by the platform automatically.
3. **`title` is required** — every entry must have a human-readable label.
4. **Sync from server** — always fetch fresh data when syncing; never read from a local cache or previously fetched state.
5. **Full replace** — always overwrite the entire `linkable` array; never attempt to diff or patch individual entries.

### Best Practices

- **Keep titles short and scannable** — they appear in navigation menus and AI prompts. Prefer "About Us" over "Our Company Story & Mission".
- **Order entries by relevance** — the first few entries are most likely to be shown in compact menus; place the most important states first.
- **Sync eagerly** — trigger a sync immediately after any content change rather than on a schedule. The operation is cheap and idempotent.
- **Handle missing `linkable` gracefully** — older apps won't have a `linkable` key. Always use `config?.linkable ?? []` rather than `config.linkable`.
- **Don't duplicate the default route** — if your app has only one view, an empty `linkable` array (or omitting it) is better than a single entry that just opens the app.
- **Test URL resolution** — confirm that your entries produce the correct URLs in the platform before publishing. Check that params are correctly appended and context params are not doubled up.
