# Deep Link Discovery

Complete guide to registering and discovering navigable states in SmartLinks apps, enabling portal menus, AI orchestrators, and other apps to deep-link directly into specific views.

---

## Table of Contents

- [Overview](#overview)
- [Two Sources of Truth](#two-sources-of-truth)
  - [Static Links — App Manifest](#static-links--app-manifest)
  - [Dynamic Links — App Config](#dynamic-links--app-config)
- [Schema: DeepLinkEntry](#schema-deeplinkentry)
- [Quick Start](#quick-start)
- [URL Resolution](#url-resolution)
- [Syncing Dynamic Links](#syncing-dynamic-links)
- [Consumer Patterns](#consumer-patterns)
  - [Merging Both Sources](#merging-both-sources)
  - [Portal Navigation Menu](#portal-navigation-menu)
  - [AI Orchestration](#ai-orchestration)
  - [Cross-App Navigation](#cross-app-navigation)
- [TypeScript Types](#typescript-types)
- [Rules & Best Practices](#rules--best-practices)

---

## Overview

SmartLinks apps expose **deep-linkable states** — specific views, pages, or configurations that the portal, AI orchestrators, or other apps can navigate to directly without loading the app first.

Deep-linkable states come from **two sources** depending on their nature:

| Source | What goes here | When it changes |
|--------|---------------|-----------------|
| **App manifest** (`app.manifest.json`) | Fixed routes built into the app | Only when the app itself is updated |
| **App config** (`appConfig.linkable`) | Content-driven entries that vary by collection | When admins create, remove, or rename content |

Consumers merge both sources to get the full set of navigable states for an app.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ App Definition (build time)                                              │
│  app.manifest.json → "linkable": [                                       │
│    { "title": "Gallery",  "path": "/gallery" },                          │
│    { "title": "Settings", "path": "/settings" }                          │
│  ]                                                                       │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │  static (always present)
                                       ▼
                          ┌────────────────────────┐
                          │   merged linkable[]    │◄──── dynamic (per collection)
                          └────────────────────────┘
                                       ▲
┌──────────────────────────────────────┴──────────────────────────────────┐
│ App Config (runtime, per collection)                                     │
│  appConfig.linkable = [                                                  │
│    { "title": "About Us",   "params": { "pageId": "about-us" } },        │
│    { "title": "FAQ",        "params": { "pageId": "faq" } }              │
│  ]                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Benefits

- ✅ **Discoverable** — consumers don't need to know the app's internal routing
- ✅ **No first-run initialisation** — static routes are available from the moment the app is installed
- ✅ **Dynamic** — content-driven entries update automatically when data changes
- ✅ **AI-friendly** — machine-readable titles make states naturally addressable by LLMs
- ✅ **No extra endpoints** — built on top of the existing `appConfiguration` API and the app manifest

---

## Two Sources of Truth

### Static Links — App Manifest

Static links are routes that are **built into the app itself** — they exist regardless of what content admins have created. They belong in `app.manifest.json` as a top-level `linkable` array, as a peer to `widgets` and `containers`:

```json
{
  "linkable": [
    { "title": "Gallery",           "path": "/gallery" },
    { "title": "Settings",          "path": "/settings" },
    { "title": "Advanced Settings", "path": "/settings", "params": { "tab": "advanced" } }
  ],
  "setup": { }
}
```

**Use this for:**
- Named sections or tabs that are always present in the app
- Admin-accessible pages that exist at fixed routes
- Any navigable state whose existence doesn't depend on content

**Why manifest, not config?**
These routes are part of the app's *definition*, not its *runtime state*. Putting them in the manifest means they're immediately available the moment the app is installed — no first-run initialisation, no sync step, no risk of them being missing if the app has never been launched.

---

### Dynamic Links — App Config

Dynamic links are entries **generated from content** — CMS pages, product guides, FAQ items, or anything else that admins create and manage. These are stored at `appConfig.linkable` and updated whenever the content changes:

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

await appConfiguration.setConfig({
  collectionId,
  appId,
  config: {
    // ... other app config ...
    linkable: [
      { title: 'About Us',   params: { pageId: 'about-us' } },
      { title: 'Care Guide', params: { pageId: 'care-guide' } },
      { title: 'FAQ',        params: { pageId: 'faq' } },
    ]
  },
  admin: true
});
```

**Use this for:**
- Pages or content entries created by admins that should be directly navigable
- Any set of linkable states that varies between collections or changes over time

The `linkable` key is **reserved** at the top level of `appConfig` for this purpose.

> **`appConfig.linkable` is for dynamic content only.** Static routes belong in the manifest. Don't write fixed routes to `appConfig` on first install just to make them discoverable — that's the problem this split is designed to avoid.

---

## Schema: DeepLinkEntry

Both sources use the same entry shape:

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

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ✅ | Displayed in menus and offered to AI agents. Should be concise and human-readable. |
| `path` | ❌ | Hash route within the app. Defaults to `/` if omitted. |
| `params` | ❌ | App-specific query params only. Platform params are injected automatically. |

> **Tip:** Different entries can share the same `path` if they differ by `params` — for example, two entries pointing at `/settings` with different `tab` params.

---

## Quick Start

**An app with both static routes and dynamic content pages:**

`app.manifest.json` — declare static routes once, at build time:
```json
{
  "linkable": [
    { "title": "Gallery",  "path": "/gallery" },
    { "title": "Settings", "path": "/settings" }
  ]
}
```

App code — sync dynamic content entries whenever pages change:
```typescript
import { appConfiguration } from '@proveanything/smartlinks';

async function syncDynamicLinks(collectionId: string, appId: string): Promise<void> {
  // Always fetch fresh data — never rely on cache
  const pages = await myApi.getPublishedPages({ forceRefresh: true });
  const entries = pages
    .filter(p => p.deepLinkable)
    .map(p => ({ title: p.title, params: { pageId: p.slug } }));

  const config = await appConfiguration.getConfig({ collectionId, appId, admin: true }) ?? {};
  await appConfiguration.setConfig({
    collectionId, appId,
    config: { ...config, linkable: entries },
    admin: true,
  });
}
```

Consumer — merge both sources:
```typescript
// staticLinks come from the app's manifest (loaded by the platform when the app was registered)
const staticLinks: DeepLinkEntry[] = appManifest?.linkable ?? [];

// dynamicLinks come from appConfig (per-collection, fetched at runtime)
const config = await appConfiguration.getConfig({ collectionId, appId });
const dynamicLinks: DeepLinkEntry[] = config?.linkable ?? [];

// Full set — static (structural) first, then dynamic (content)
const allLinks = [...staticLinks, ...dynamicLinks];
```

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

## Syncing Dynamic Links

This section only applies to **dynamic links stored in `appConfig.linkable`**. Static links declared in the manifest require no syncing.

### When to Sync

Apps **MUST** update `appConfig.linkable` whenever the set of dynamic navigable states changes:

- A page is created, deleted, published, or unpublished
- A page's `deepLinkable` flag is toggled
- A page title changes

### How to Sync

The sync pattern is a **full replace** — read current config, overwrite `linkable`, save back. This avoids orphaned entries and keeps the logic simple.

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

async function syncLinkable(collectionId: string, appId: string): Promise<void> {
  // 1. Fetch the current set of dynamic entries from your data source.
  //    Always fetch fresh — never rely on a local cache.
  const entries = await fetchDynamicLinkEntries(); // app-specific

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

  // 3. Overwrite only the linkable key and save
  await appConfiguration.setConfig({
    collectionId,
    appId,
    config: { ...config, linkable: entries },
    admin: true,
  });
}
```

### Idempotency

The sync is always a full replace of the `linkable` array. Running it multiple times with the same data produces the same result — no duplicates, no orphans.

### Clearing Dynamic Links

To remove all dynamic entries (e.g., all content was unpublished):

```typescript
await appConfiguration.setConfig({
  collectionId,
  appId,
  config: { ...config, linkable: [] },
  admin: true,
});
```

Note that clearing `appConfig.linkable` only removes dynamic entries. Static links declared in the manifest are unaffected.

---

## Consumer Patterns

### Merging Both Sources

Consumers must always merge static (manifest) and dynamic (appConfig) entries. The platform provides the manifest when the app is registered; the consumer fetches the config at runtime:

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

interface ResolvedLink extends DeepLinkEntry {
  appId: string;
  source: 'manifest' | 'config';
}

async function getAppLinks(
  collectionId: string,
  appId: string,
  appManifest: { linkable?: DeepLinkEntry[] }
): Promise<ResolvedLink[]> {
  // Static entries from the manifest — always present, no network call needed
  const staticLinks = (appManifest.linkable ?? []).map(e => ({
    ...e, appId, source: 'manifest' as const
  }));

  // Dynamic entries from appConfig — vary per collection
  const config = await appConfiguration.getConfig({ collectionId, appId });
  const dynamicLinks = (config?.linkable ?? []).map(e => ({
    ...e, appId, source: 'config' as const
  }));

  // Static first (fixed structure), then dynamic (content entries)
  return [...staticLinks, ...dynamicLinks];
}
```

### Portal Navigation Menu

A portal shell aggregates links from all installed apps to build a unified navigation menu:

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

interface NavLink {
  appId: string;
  title: string;
  path?: string;
  params?: Record<string, string>;
}

async function buildNavMenu(
  collectionId: string,
  apps: Array<{ appId: string; manifest: { linkable?: DeepLinkEntry[] } }>
): Promise<NavLink[]> {
  const links: NavLink[] = [];

  for (const { appId, manifest } of apps) {
    // Static links from manifest
    const staticLinks = manifest.linkable ?? [];

    // Dynamic links from appConfig
    const config = await appConfiguration.getConfig({ collectionId, appId });
    const dynamicLinks: DeepLinkEntry[] = config?.linkable ?? [];

    links.push(
      ...[...staticLinks, ...dynamicLinks].map(entry => ({ ...entry, appId }))
    );
  }

  return links;
}
```

### AI Orchestration

An AI agent discovers all navigable states and offers them to the user:

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

async function getNavigationOptions(
  collectionId: string,
  appId: string,
  appManifest: { linkable?: DeepLinkEntry[] }
): Promise<string[]> {
  const staticLinks = appManifest.linkable ?? [];
  const config = await appConfiguration.getConfig({ collectionId, appId });
  const dynamicLinks: DeepLinkEntry[] = config?.linkable ?? [];

  // "I can navigate you to: Gallery, Settings, About Us, or FAQ."
  return [...staticLinks, ...dynamicLinks].map(entry => entry.title);
}
```

The `title` field is intentionally human-readable so it can be injected directly into LLM prompts without additional transformation.

### Cross-App Navigation

An app constructs a `NavigationRequest` using the target app's merged links:

```typescript
// Search static links first, then dynamic
const staticEntry = targetManifest?.linkable?.find(e => e.title === 'Gallery');
const config = await appConfiguration.getConfig({ collectionId, appId: 'target-app-id' });
const dynamicEntry = config?.linkable?.find(e => e.title === 'About Us');

const entry = staticEntry ?? dynamicEntry;

if (entry) {
  onNavigate({
    appId: 'target-app-id',
    deepLink: entry.path,
    params: entry.params,
  });
}
```

---

## TypeScript Types

```typescript
/**
 * A single navigable state exposed by a SmartLinks app.
 * Used in both app.manifest.json `linkable` (static) and appConfig `linkable` (dynamic).
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

/** Convenience alias for an array of DeepLinkEntry */
export type DeepLinkRegistry = DeepLinkEntry[];
```

---

## Rules & Best Practices

### Rules

1. **Static routes belong in the manifest** — if a route exists regardless of content, declare it in `app.manifest.json`. Do not write it to `appConfig` on first run.
2. **`appConfig.linkable` is for dynamic content only** — it should contain entries generated from, and varying with, the app's data.
3. **`linkable` is reserved** — do not use this key for other purposes in either the manifest or `appConfig`.
4. **No platform context params in entries** — `collectionId`, `appId`, `productId`, `proofId`, `lang`, `theme` are injected by the platform automatically.
5. **`title` is required** — every entry must have a human-readable label.
6. **Consumers must merge both sources** — never assume all links come from `appConfig` alone.
7. **Sync from server** — when updating `appConfig.linkable`, always fetch the latest content state; never rely on a local cache.
8. **Full replace** — always overwrite the entire `appConfig.linkable` array; never diff or patch individual entries.

### Best Practices

- **Keep titles short and scannable** — they appear in navigation menus and AI prompts. Prefer "About Us" over "Our Company Story & Mission".
- **Static first, dynamic second** — when rendering merged links, show static (structural) entries before dynamic (content) entries. This provides a consistent layout even while content is loading.
- **Sync dynamic links eagerly** — trigger a sync immediately after any content change rather than on a schedule. The operation is cheap and idempotent.
- **Handle missing entries gracefully** — older apps won't have manifest `linkable` entries or `appConfig.linkable`. Always use `?? []` on both sources.
- **Don't duplicate the default route** — if your app has only one view, neither source needs a `linkable` entry for it. The app can always be opened to its default state without a deep link.
- **Test URL resolution** — confirm that your entries produce the correct URLs. Check that params are correctly appended and that platform context params are not doubled up.
