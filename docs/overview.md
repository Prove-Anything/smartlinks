# SmartLinks Microapp Development Guide

> **Platform revision:** R4.6 · **SDK minimum:** `@proveanything/smartlinks@1.4.1`  
> **Last updated:** 2026-03-03

---

## What Is a SmartLinks Microapp?

SmartLinks microapps are **modular, embeddable React applications** that extend the SmartLinks digital twin platform. They provide specialised functionality — product information displays, warranty registration, competitions, pamphlet generators, and more — while inheriting context, authentication, and theming from the parent platform.

### The Digital Twin Ecosystem

SmartLinks is a **digital twin platform** that connects physical products to digital experiences. Each physical item (a wine bottle, a luxury handbag, a piece of equipment) has a corresponding digital identity — a "proof" — that can be scanned, claimed, and enriched with data over time.

Microapps are the **extensibility layer** of this ecosystem. Rather than building monolithic features into the core platform, functionality is distributed across purpose-built apps that:

- **Embed seamlessly** via iframes in the SmartLinks Portal (public) and Admin Console (management)
- **Share context** through URL parameters (collection, product, or proof being viewed)
- **Inherit identity** from the parent platform's authentication system
- **Adapt visually** to the brand's theme configuration
- **Communicate bidirectionally** with the parent via postMessage for deep linking and navigation

### Deployment Modes

Each microapp can be consumed in one or more of the following ways:

| Mode | Description |
|------|-------------|
| **Container** | Full app in parent React tree. ~150 KB+ lazy-loaded. The primary consumer surface. |
| **Iframe App** | Full React app inside an iframe. Fallback when sandboxing is required; still the standard for setup admin screens. |
| **Widget** | Lightweight React component in parent tree. ~10 KB, loaded immediately alongside the page. |
| **Mobile Admin Container** | Separate bundle for in-the-field operator/admin workflows on mobile. Built independently; may use Capacitor, Preact, or any other runtime. |
| **Executor** | JS library, no UI. Programmatic config, SEO metadata, LLM content for AI/server. |

Widgets and containers run in the parent's React tree (not iframes). Mobile Admin Containers are a separate bundle loaded by a dedicated mobile shell (Capacitor or PWA). Executors have no UI — they expose functions that AI orchestrators and the server call directly.

> **Admin vs consumer:** Admin experiences always ship as a **separate bundle** (`mobileAdmin` or iframe). The `containers` bundle is for consumer-facing surfaces only.

---

## SDK Documentation Reference

The SmartLinks SDK (`@proveanything/smartlinks`) includes comprehensive documentation in `node_modules/@proveanything/smartlinks/docs/`. **Always read these files for detailed implementation guidance.**

> Product endpoints: use `products` (plural) for new integrations. The older `product` (singular) namespace remains for backward compatibility and is deprecated.

> **Minimum SDK version: `1.4.1`** — Ensure `@proveanything/smartlinks` is at least this version. If not, update with `npm install @proveanything/smartlinks@latest`.

| Topic | File | When to Use |
|-------|------|-------------|
| **API Reference** | `docs/API_SUMMARY.md` | Complete SDK function reference, types, error handling |
| **Assets** | `docs/assets.md` | Asset object, AssetRef, upload, replace, soft-delete, restore, bulk-delete, public token-based uploads |
| **Building React Components** | `docs/building-react-components.md` | **READ THIS FIRST** — Dual-mode rendering, router rules, useAppContext pattern |
| **Multi-Page Architecture** | `docs/mpa.md` | Build pipeline, entry points, multi-page setup, content hashing |
| **AI & Chat** | `docs/ai.md` | Chat completions, RAG, streaming, tool calling, voice, podcasts, TTS |
| **Analytics** | `docs/analytics.md` | Fire-and-forget page/click/tag analytics plus admin dashboard queries |
| **Translations** | `docs/translations.md` | Runtime translation lookup, local-first IndexedDB caching, and translation admin APIs |
| **Theming** | `docs/theme.system.md` | Implementing dynamic themes via URL params or postMessage |
| **Theme Defaults** | `docs/theme-defaults.md` | Default colour values for light/dark modes |
| **Internationalization** | `docs/i18n.md` | Adding multi-language support, translation patterns |
| **Widgets** | `docs/widgets.md` | Building widgets, shared deps contract, settings schema |
| **Containers** | `docs/containers.md` | Building full-app embeddable containers (lazy-loaded) |
| **Mobile Admin Container** | `docs/mobile-admin-container.md` | Building a separate Capacitor-aware mobile admin bundle for field operators |
| **Executors** | `docs/executor.md` | Building executor bundles for SEO, LLM content, programmatic config |
| **Deep Linking** | `docs/deep-link-discovery.md` | URL state management, navigable states, portal menus, AI nav |
| **Portal Back Button** | `docs/portal-back-button.md` | Hierarchy-aware "up" navigation inside embedded apps |
| **Portal Request Action** | `docs/portal-request-action.md` | Triggering portal built-in actions (__qrScanner, __share, __logout, etc.) from sub-apps |
| **Interactions** | `docs/interactions.md` | Business events, outcomes, voting, competitions, and journey triggers |
| **AI-Native Manifests** | `docs/manifests.md` | `app.manifest.json`, `app.admin.json`, `ai-guide.md` structure |
| **App Config Files** | `docs/app-manifest.md` | Full field-by-field reference for both JSON config files |
| **Real-time Messaging** | `docs/realtime.md` | Adding Ably real-time features (chat, live updates) |
| **Liquid Templates** | `docs/liquid-templates.md` | Dynamic content rendering with LiquidJS |
| **Iframe Responder** | `docs/iframe-responder.md` | Iframe communication and proxy mode internals |
| **AI Guide Template** | `docs/ai-guide-template.md` | Template for creating `public/ai-guide.md` — customise per app |
| **Forms** | `docs/forms.md` | Form definitions, schema-driven rendering, submission patterns |
| **Auth Kit** | `docs/auth-kit.md` | End-user sign-in: email/password, magic links, phone OTP, Google OAuth |
| **Portal Request Login** | `docs/portal-request-login.md` | How sub-apps ask the portal to authenticate the user; hook and iframe postMessage contracts |
| **Portal Auth Broadcast** | `docs/portal-auth-broadcast.md` | Publishing custom auth flows to the portal; syncing sessions across containers and iframes |
| **Contact Search** | `docs/contact-search.md` | Admin contact search: free-text, typeahead, identity/tag/JSONB filters, and pagination |
| **App Records Pattern** | `docs/app-records-pattern.md` | Standard pattern for per-product/facet/variant/batch admin + public widget UIs |
| **UI Utils** | `docs/ui-utils.md` | `@proveanything/smartlinks-utils-ui` — React shells, hooks, and primitives for records-based apps |
| **Product/Proof Data Scoping** | `docs/proof-product-data-scoping.md` | Canonical spec for `product.data`/`.admin` and `proof.data`/`.admin`/`.values` (owner/personal) — who can read and write each bucket |
| **appConfig / Feature Flags** | `docs/appConfig.md` | `appConfig` settings contract — installed apps, `system.features`/`entitledAppGroups`/`meters`, `isFeatureEnabled()` helper |

---

## Technical Overview

- **Iframe-based** — Apps run inside iframes in both the public Portal and Admin Console
- **Hash routing** — Uses `/#/` routes for iframe compatibility (e.g., `/#/`, `/#/admin`)
- **Context via URL params** — All contextual data is passed through URL parameters
- **SmartLinks NPM module** — All data access and platform interaction goes through `@proveanything/smartlinks`
- **No standalone auth** — Authentication is handled by the parent SmartLinks platform
- **Multi-page build** — Separate bundles for public and admin — see `docs/mpa.md`
- **Embedded back navigation** — Use `docs/portal-back-button.md` when a sub-app has a real content hierarchy

---

## Data Model Hierarchy

```
Collection (Business/Brand)
  └── Product (Product Type/Definition)
        └── Proof (Specific Instance with Owner)
              └── Attestation (User/Admin Data on Proof)
```

| Entity | Description | Example |
|--------|-------------|---------|
| **Collection** | Top-level container representing a business or brand | "Acme Wine Co." |
| **Product** | A type of product (not a specific item) | "2023 Cabernet Sauvignon" |
| **Proof** | A specific instance of a product, often with an owner | Bottle #12345 claimed by user@email.com |
| **Attestation** | Data attached to a proof by users or admins | Warranty registration, tasting notes |

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `collectionId` | string | The collection being viewed/managed |
| `productId` | string | The specific product (within collection) |
| `proofId` | string | The specific proof instance |
| `appId` | string | This app's unique identifier (for data scoping) |
| `dark` | `1` or `0` | Whether to use dark mode |
| `theme` | base64 | Full theme configuration (see `docs/theme.system.md`) |

---

## Authentication & Permissions

SmartLinks apps do **not** implement their own authentication. The parent platform handles all auth:

- Use `SL.auth.getAccount()` to check if a user is logged in
- The response includes whether the user is an `admin` or regular user
- Many SmartLinks API functions behave differently based on admin status

| Capability | Admin | Regular User |
|------------|-------|-------------|
| Read collection/product data | ✅ | ✅ |
| Write app configuration | ✅ | ❌ |
| Write attestations | ✅ | ✅ (own proofs only) |
| Access admin-only API fields | ✅ | ❌ |

---

## Data Storage Patterns

### ⚠️ Critical: Admin Mode Flag

**When building admin interfaces, you MUST pass `admin: true` in API options.**

Without this flag, API calls use the public endpoint and will fail to write data:

```typescript
// ❌ WRONG — will fail in admin interface
await SL.appConfiguration.setConfig({ collectionId, appId, config: myConfig });

// ✅ CORRECT — include admin: true
await SL.appConfiguration.setConfig({ collectionId, appId, config: myConfig, admin: true });
```

This applies to all write operations: `setConfig`, `setDataItem`, `updateDataItem`, etc.

### Endpoint Auth vs Data Visibility

`admin: true` is an endpoint selector, not a privacy marker.

- It tells the SDK to call the admin endpoint.
- It allows writes and admin reads.
- It does **not** mean every root-level field you save becomes admin-only.

For `appConfiguration` config blobs and `collection.getSettings()` groups, root-level fields are typically the public-facing settings. If you need private values such as tokens or secrets, store them inside a top-level `admin` object:

```typescript
await SL.appConfiguration.setConfig({
  collectionId,
  appId,
  admin: true,
  config: {
    publicLabel: 'Warranty Portal',
    color: '#B68C2A',
    admin: {
      accessToken: 'secret-token'
    }
  }
})
```

Public reads omit the `admin` block. Admin reads include it.

### Config vs Data

| Storage Type | Function | Use Case |
|-------------|---------|---------|
| **Config** (`getConfig`/`setConfig`) | Single JSON document | App settings, feature flags, global options |
| **Data** (`getData`/`setDataItem`) | Array of documents with IDs | Lists of items, records, entries |
| **App Objects** (`app.records` / `app.cases` / `app.threads`) | Queryable domain objects | Real app entities, workflows, conversations, richer access control |

Both can be scoped to **collection level** or **product level** by including `productId`.

For config/settings visibility, remember: root fields are the normal shared payload, while a reserved top-level `admin` object is the place for admin-only values.

Prefer `app.records` over `setDataItem` when the data is becoming a real entity that needs lifecycle, ownership, visibility, relationships, or filtering. Keep `setDataItem` for simple keyed scoped documents and config-adjacent content.

### Feature Flags & Entitlements (`appConfig`)

The platform-owned `appConfig` settings group (`system.features`, `system.meters`, `system.entitledAppGroups`, installed `apps[]`) tells a microapp what's installed and entitled for a collection. Use `SL.appConfiguration.isFeatureEnabled(collectionId, flag)` to gate a feature — it's the standard, cache-backed way to do this rather than hand-rolling a `getConfig` call:

```ts
if (await SL.appConfiguration.isFeatureEnabled(collectionId, 'custom_domain')) {
  enableCustomDomainUI();
}
```

It's async (the first check for a collection has nothing cached yet); `SL.appConfiguration.isFeatureEnabledSync()` gives a synchronous, cache-only read (`boolean | undefined`) for callers that warmed the cache earlier and can't await. See `docs/appConfig.md` for the full contract, including `systemPrivate` (admin-only overrides, always stripped for non-admin reads).

### Attestations (Proof-level data)

For data attached to specific proof instances, use `SL.attestation.create()` and `SL.attestation.list()`.

### Custom Data Scoping (Product & Proof)

`product.data`/`product.admin` and `proof.data`/`proof.admin`/`proof.values` are the canonical buckets for custom fields on products and proofs — `data` is public and business-writable, `admin` is business-only, and `proof.values` additionally supports owner-scoped (`values.owner`) and per-user (`values.personal[userId]`) sub-keys. This is a different mechanism from the app-scoped storage in `docs/app-data-storage.md` (which is for app-owned config/records, not the product/proof documents themselves).

See `docs/proof-product-data-scoping.md` for the full read/write authority matrix, worked examples, and the `productFields`/`proofFields` collection-settings schemas that drive field-config editors.

---

## Error Handling

The SmartLinks SDK returns structured `SmartlinksApiError` objects. Use `instanceof SmartlinksApiError` to access `.statusCode`, `.message`, and helper methods:

- `.isAuthError()` — 401/403 responses
- `.isNotFound()` — 404 responses
- `.isRateLimited()` — 429 responses
- `.isServerError()` — 5xx responses

See `docs/API_SUMMARY.md` for complete error handling documentation.

---

## AI Integration

SmartLinks provides comprehensive AI capabilities through the `SL.ai` namespace. **Always use SmartLinks AI for microapps** — do not integrate external AI services (OpenAI, Anthropic, Lovable Cloud AI, etc.) directly.

Key capabilities: chat completions (streaming + tool calling), RAG document Q&A, voice input/output, podcast generation, text-to-speech, model listing.

See `docs/ai.md` for complete documentation.

---

## Interactions & Event Tracking

The `SL.interactions` namespace tracks user engagement — competition entries, votes, form submissions, warranty registrations. Events can trigger automated journeys and communications.

Important: create interaction type definitions first, then submit events using those existing IDs. Do not invent `interactionId` values in client code.

Key functions: `submitPublicEvent()`, `appendEvent()` (admin), `countsByOutcome()`, `query()`.

See `docs/interactions.md` for complete documentation.

---

## Liquid Templating

Use the `<LiquidContent>` component, `useLiquidTemplate` hook, and `renderLiquid` utility for admin-configured dynamic content using Liquid syntax.

See `docs/liquid-templates.md` for full context variables, filters, and examples.

---

## Design Principles

### Public Interface (Portal)

- **Mobile-first** — Assume users are on phones
- **Non-technical** — Never show raw IDs or technical data
- **Accessible** — Follow WCAG guidelines

### Admin Interface

- **Feature-rich** — Power users expect advanced controls
- **Efficient** — Minimise clicks for common tasks
- **Desktop-optimised** — Admins typically use desktop browsers

### Theming

Apps receive theme configuration from the parent platform via URL parameter (`?theme=base64…`) and PostMessage updates. See `docs/theme.system.md`.

---

## Common Hooks

```typescript
// Fetch collection/product/proof data
useCollectionData(collectionId)
useProductData(collectionId, productId)
useProofData(collectionId, productId, proofId)

// Fetch app configuration
useCollectionAppConfig(collectionId, appId)
useProductAppConfig(collectionId, productId, appId)

// Fetch app data (array of items)
useCollectionAppData(collectionId, appId)
useProductAppData(collectionId, productId, appId)

// Fetch attestations
useAttestationsData(collectionId, productId, proofId)

// URL parameter management
usePersistentQueryParams()

// Theme management
useSmartLinksTheme()

// Liquid templating
useLiquidTemplate(templateString, contextData)
```

---

## API Namespaces

The SmartLinks SDK is organised into namespaces. See `docs/API_SUMMARY.md` for the complete reference. Key namespaces:

- `appConfiguration` — Config and data storage (most apps use this)
- `attestation` — Proof-level user/admin data
- `interactions` — Event tracking and analytics
- `ai` — AI content generation, chat, RAG (see `docs/ai.md`)
- `auth` / `authKit` — Admin and end-user authentication
- `contact` — Customer contact management
- `comms` / `broadcasts` — Notifications and campaigns
- `asset` — File/image uploads
- `realtime` — Ably real-time messaging (see `docs/realtime.md`)

---

## File Structure

```
├── index.html                  ← Public portal entry
├── admin.html                  ← Admin console entry
├── public/
│   ├── app.manifest.json       ← Public discovery manifest
│   ├── app.admin.json          ← Admin manifest (on-demand)
│   └── ai-guide.md             ← AI orchestrator prose guide
├── src/
│   ├── main.tsx                ← Public React entry
│   ├── admin-main.tsx          ← Admin React entry
│   ├── App.tsx                 ← Shared providers (QueryClient, Toaster, etc.)
│   ├── PublicApp.tsx           ← Public app shell (routes only public pages)
│   ├── AdminApp.tsx            ← Admin app shell (routes only admin pages)
│   ├── components/             ← Reusable UI components
│   ├── containers/             ← Embeddable full-app containers
│   ├── executor/               ← Executor bundle (SEO, LLM content, config API)
│   ├── hooks/                  ← React hooks (data fetching, state)
│   ├── pages/
│   │   ├── PublicPage.tsx      ← Portal content (/#/)
│   │   ├── AdminPage.tsx       ← Admin content (admin.html#/)
│   │   └── DevPage.tsx         ← Development helper (dev only)
│   ├── widgets/                ← Embeddable widget components
│   └── utils/
│       ├── smartlinks/         ← SmartLinks utilities
│       └── theme.ts            ← Theme utilities
├── vite.config.ts              ← Multi-page build config
├── vite.config.widget.ts       ← Widget library build config
├── vite.config.container.ts    ← Container library build config
└── vite.config.executor.ts     ← Executor library build config
```

---

## Anti-Patterns to Avoid

❌ **Don't implement custom auth** — Use SmartLinks auth via `SL.auth.getAccount()`

❌ **Don't use BrowserRouter** — Always use HashRouter for iframe compatibility

❌ **Don't hardcode URLs** — Use relative paths and let the platform provide context

❌ **Don't store secrets in code** — Use environment variables or platform configuration

❌ **Don't assume screen size** — Support both mobile (Portal) and desktop (Admin)

❌ **Don't expose technical IDs** — Show human-readable names to users

❌ **Don't import AdminPage in PublicApp** — Keep bundles separate for optimal size

❌ **Don't use external AI services** — Use SmartLinks AI via `SL.ai`, not OpenAI/Anthropic/Lovable Cloud AI directly

❌ **Don't forget `admin: true`** — All admin write operations require this flag

---

## Quick Reference

### Initialise the API

```typescript
import { initializeAPI } from '@/utils/smartlinks/initialization';
initializeAPI(); // Call once at app startup
```

### Get Context from URL

```typescript
const { persistentQueryParams } = usePersistentQueryParams();
const { collectionId, productId, appId } = persistentQueryParams;
```

### Check Admin Status

```typescript
const account = await SL.auth.getAccount();
const isAdmin = account?.admin === true;
```

### Save Configuration (Admin Only)

```typescript
await SL.appConfiguration.setConfig({
  collectionId, appId,
  config: { myKey: 'myValue' },
  admin: true  // Required!
});
```

### Handle Dark Mode + Theming

```typescript
// In App.tsx — already integrated in the template
useDarkMode();        // Handles ?dark=1 parameter
useSmartLinksTheme(); // Handles ?theme=base64 parameter
useDeepLinkSync();    // Syncs route changes to parent
```

### Deep Linking

```typescript
const { navigateWithState, getAppState } = usePersistentQueryParams();
const { tab = 'general' } = getAppState();
navigateWithState('/', { tab: 'advanced' });
```

See `docs/deep-link-discovery.md` for full implementation details.
