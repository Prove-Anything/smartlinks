# Smartlinks API Summary

Version: 3.0.0-alpha.2  |  Generated: 2026-11-24T16:34:33.961Z

This is a concise summary of all available API functions and types.

## Documentation

For detailed guides on specific features:

- **[SmartLinks Microapp Overview](overview.md)** - Platform architecture, data model, auth patterns, storage, anti-patterns, and quick-reference for all SDK docs
- **[Lists](lists.md)** - Every list returns `{ items, nextCursor, count? }` and pages with `limit` and `cursor`; `each` and `all` walk the pages
- **[Upgrading to SDK 3](upgrading-to-3.md)** - What changed from SDK 2 and how to move each call (the same changes as data: `upgrade/3.json`)
- **[The Standard Query](standard-query.md)** - One request body to filter, sort, page, count, total and follow links, the same on proofs, contacts, products and app records: `proof.query`, `contact.query`, `products.standardQuery`, `app.records.query`
- **[Assets](assets.md)** - Asset object, AssetRef, upload, replace, soft-delete, restore, bulk-delete, and public token-based uploads
- **[AI & Chat Completions](ai.md)** - Chat completions, RAG (document-grounded Q&A), voice integration, streaming, tool calling, podcast generation
- **[Translations](translations.md)** - Runtime translation lookup, browser-side IndexedDB caching, and admin translation management
- **[Widgets](widgets.md)** - Embeddable React components for parent applications
- **[Building React Components](building-react-components.md)** - Foundational guide to building React widgets and containers for SmartLinks
- **[Containers](containers.md)** - Building full-app embeddable containers (lazy-loaded)
- **[Mobile Admin Container](mobile-admin-container.md)** - Building mobile-optimised operator/admin containers as a separate bundle
- **[Container Tracking](container-tracking.md)** - Hierarchical physical/logical container groupings with item membership
- **[Multi-Page App Architecture](mpa.md)** - Vite MPA build pipeline: public/admin entry points, widget/container/executor bundles, content-hashed CDN assets
- **[App Configuration Files](app-manifest.md)** - `app.manifest.json` and `app.admin.json` reference — bundles, components, setup questions, import schemas, tunable fields, and metrics
- **[Executor Model](executor.md)** - Programmatic JS bundles for AI-driven setup, server-side SEO metadata generation, and LLM content for AI crawlers
- **[Server Functions](server-functions.md)** - App-authored server-side "edge functions" (`async (ctx, event) => result`): http/event/cron triggers, the visibility/authority/capabilities security model, and the pre-scoped `ctx` (authority-scoped SDK, capability-gated secrets + fetch)
- **[Deploying & Registering an App](deploying-apps.md)** - Publish → build → register: the app CDN layout (smartlinks.app), dev/beta/prod channels, channel-scoped deploy keys, the `POST /apps/:appId/releases` registration endpoint + validation, and how to wire it into your build so a bad manifest fails the deploy
- **[Realtime](realtime.md)** - Real-time data updates and WebSocket connections
- **[iframe Responder](iframe-responder.md)** - iframe integration and cross-origin communication (incl. hand-rolled streaming protocol)
- **[Utilities](utils.md)** - Helper functions for building portal paths, URLs, and common tasks
- **[UI Utils](ui-utils.md)** - Reusable, themeable admin UI React component library for microapps
- **[Headless Providers](headless-providers.md)** - Declaring an app's content for other sites: the manifest `data` + `headless` blocks (types, storage, public fields, examples, read recipes, categories), `SL.headless.validate`, `smartlinks-headless`, and the procedure for adding a headless mode
- **[Websites: SEO + GEO](site-seo.md)** - For apps served as websites: platform-generated robots/sitemap/llms.txt, canonical addresses, `SL.seo.head` / `SL.seo.jsonLd` / `SL.seo.schema.*`, `SL.site.ready()`, routes in `sitemap-paths.txt`
- **[Agent Tools](agent-tools.md)** - Exposing app functions as AI agent tools
- **[Host Dependency Contract](host-dependency-contract.md)** - The shared dependencies (React, the SDK…) the host provides, and what an app must externalise
- **[Theme Tokens](theme-tokens.md)** - The `--sl-*` semantic token contract hosts set and apps bind to (`theme.css`)
- **[CSS Baseline](css-baseline.md)** - The frozen `sl-*` structural helper classes hosts guarantee
- **[Caching](caching.md)** - Multi-tier caching strategy (in-memory, SessionStorage, IndexedDB) used by the SDK
- **[Native Facade](native-facade.md)** - Contract layer for accessing device capabilities (share, NFC, haptics) across host shells
- **[i18n](i18n.md)** - Internationalization and localization
- **[Liquid Templates](liquid-templates.md)** - Dynamic templating for content generation
- **[Theme System](theme.system.md)** - Theme configuration and customization
- **[Theme Defaults](theme-defaults.md)** - Default theme values and presets
- **[Proof Claiming Methods](proof-claiming-methods.md)** - All methods for claiming/registering product ownership (NFC tags, serial numbers, auto-generated claims)
- **[Proof Share Grants](proof-share-grants.md)** - Delegated, scoped, revocable bearer access to a single proof (read/comment/verify-owner links)
- **[Proof Ownership Transfer](proof-ownership-transfer.md)** - Moving a proof to a new owner: directed transfer, open release, accept/cancel, and the state machine
- **[Comms Triggers](proof-comms-triggers.md)** - Sending transactional comms from proof actions (claim/transfer/accept/cancel): the role→template map, per-action roles, and the trust boundary
- **[Lots](lots.md)** - Collection-scoped production groupings spanning many SKUs; facet/product selectors, member resolution, and GS1 AI(10) batch-then-lot resolution
- **[Item Context](item-context.md)** - The `itemContext` container prop derived from a serial-proof URL or NFC tap (what item the URL points at)
- **[Product Facets SDK](PRODUCT_FACETS_SDK.md)** - Admin and public product facet endpoints and TypeScript interfaces
- **[Attestations](attestations.md)** - Append-only fact log with cryptographic chain integrity, time-series analytics, and public/owner/admin visibility
- **[Auth Kit](auth-kit.md)** - End-user authentication flows (email/password, magic link, OTP, OAuth) for microapps
- **[Portal Request Login](portal-request-login.md)** - Sub-apps delegate user authentication to the portal; `useSafeAuth().requestLogin` hook and iframe postMessage contract, redirect-bounce handling
- **[Portal Auth Broadcast](portal-auth-broadcast.md)** - Publishing a custom-flow session to the portal so the header, sibling apps, and SDK all stay in sync
- **[Portal Request Action](portal-request-action.md)** - Invoking portal built-in actions (`__qrScanner`, `__share`, `__logout`, etc.) from containers, widgets, and iframes
- **[Portal Back Button](portal-back-button.md)** - `parentPath` contract for hierarchy-aware "up" navigation; `useDeepLinkSync` integration
- **[Contact Search](contact-search.md)** - Admin contact search: free-text, typeahead, identity/tag/JSONB filters, and pagination
- **[App Data Storage](app-data-storage.md)** - User-specific and collection-scoped app data storage
- **[Product/Proof Data Scoping](proof-product-data-scoping.md)** - Canonical spec for `product.data`/`.admin` and `proof.data`/`.admin`/`.values` (owner/personal) buckets, read/write authority, and the `productFields`/`proofFields` collection-settings schemas
- **[appConfig / Feature Flags](appConfig.md)** - `appConfig` settings contract, entitlements (`system.features`/`entitledAppGroups`/`meters`), and the `isFeatureEnabled()` / `isFeatureEnabledSync()` SDK helpers
- **[Forms](forms.md)** - Platform-managed form definitions, submissions, and schema-driven React form UI
- **[App Objects: Cases, Threads & Records](app-objects.md)** - Generic app-scoped building blocks for support cases, discussions, bookings, registrations, and more
- **[App Records Pattern](app-records-pattern.md)** - Canonical pattern for storing per-product, per-facet, or rule-targeted app data
- **[Sequences & Claim-Order](sequences.md)** - Allocate a guaranteed-unique, monotonic number (raffle tickets, "Nth to claim", queue positions) and stamp it onto a record — atomic app-config counter + idempotent per-subject stamping, concurrency-safe at stadium scale
- **[Communications](comms.md)** - Transactional sends, multi-channel broadcasts, consent management, push registration, and analytics
- **[Interactions & Event Tracking](interactions.md)** - Log user events, count outcomes, query history, and define interaction types with permissions
- **[Analytics](analytics.md)** - Web analytics, link-click tracking, QR/tag scan telemetry, and event reporting
- **[Analytics Metadata Conventions](analytics-metadata-conventions.md)** - Standard recommended keys and conventions for analytics metadata fields
- **[Loyalty: Points, Members & Earning Rules](loyalty.md)** - Loyalty schemes, automatic point earning via interaction rules, member balances, transaction history, and manual adjustments
- **[Integrations](integrations.md)** - Inbound/outbound integration flows + the sealed-secret store; triggers (manual/event/schedule), event patterns, the event envelope (interaction/contact/event sources), identity policy, event mapping, signed deliveries, contact as a target, field mappings
- **[Connectors](connectors.md)** - Connector apps (adapters for one external provider): a manifest `connector` block + server functions (testConnection/describeTarget/sample/fetch/shape/serialize/send/describeEvents/lookup); loyalty and CRM connectors; actions (provider operations on demand); core does the mapping
- **[Entitlements](entitlements.md)** - "Is this person gold or above?" answered on demand from signed claims, a connector lookup (cached), or the contact — never a mirrored member base; gates on interaction types and in server functions
- **[AI Tools & Skills](ai-tools-and-skills.md)** - The AI capability catalog: skills apps invoke by name (e.g. research.brand), the tools the AI reaches for (web fetch/screenshot/brand assets/image gen), the agent loop, and how apps discover them
- **[Deep Link Discovery](deep-link-discovery.md)** - Registering and discovering navigable app states for portal menus and AI orchestration
- **[AI Guide Template](ai-guide-template.md)** - A sample for an app on how to build an AI setup guide

## Choosing App Storage

When you need flexible app-specific data, choose the storage model based on shape and lifecycle, not just on what can hold JSON.

- **`appConfiguration.getConfig` / `setConfig`** - One config blob per scope. Best for settings, feature flags, and app setup.
- **`appConfiguration.getData` / `getDataItem` / `setDataItem`** - Small keyed documents attached to a scope. Best for lookup tables, content fragments, menus, FAQs, or a handful of standalone items where you already know the ID.
- **`app.records`** - Default choice for richer app-owned entities that need status, visibility, ownership zones, querying, filtering, parent-child links, or lifecycle fields.
- **`app.cases`** - Use when the entity is a workflow item that moves toward resolution and may need assignment, priority, and history.
- **`app.threads`** - Use for conversations, comments, Q&A, or any object centered on replies.

Rule of thumb: if you are modelling a real domain object that users will browse, filter, secure, or evolve over time, start with app objects. If you just need a simple keyed payload hanging off a collection or product, scoped data items are still a good fit.

## Settings Visibility

For `appConfiguration` config blobs and `collection` settings groups, keep endpoint choice separate from visibility semantics.

- **`admin: true` means "use the admin endpoint"** for reads or writes.
- **It does not make every root field private.** Writing through an admin endpoint still saves the normal shared payload.
- **Root-level fields are the public/shared settings view.** Put public labels, colors, toggles, and general config there.
- **Use a top-level `admin` object for confidential values.** Public reads omit that block; admin reads include it.
- **Applies to both** `appConfiguration.getConfig` / `setConfig` **and** `collection.getSettings` / `updateSettings`.

## API Namespaces

The Smartlinks SDK is organized into the following namespaces:

— Core Data & Configuration —
- **collection** - Manage collections, settings, and identifiers for your workspace.
- **variant** - Manage product variants per product; includes serial number helpers.
- **asset** - Upload and manage media assets for collections, products, and proofs.
- **batch** - Group products into batches; manage serial number ranges and lookups.
- **crate** - Organize products in containers/crates for logistics and grouping.
- **form** - Build and manage dynamic forms used by apps and workflows.
- **appConfiguration** - Read/write app configuration and scoped data (collection/product/proof); hosts the deep-link registry. → [Guide](deep-link-discovery.md)
- **app** - Flexible app-scoped objects: use records for structured entities, cases for workflows, and threads for discussions. → [Guide](app-objects.md)

— Identity & Access —
- **auth** - Admin authentication and account ops: login/logout, tokens, account info.
- **authKit** - End‑user auth flows (email/password, OAuth, phone); profiles and verification.
- **contact** - Manage customer contacts; CRUD, lookup, upsert, erase, and admin search. → [Guide](contact-search.md)

— Messaging & Audience —
- **comms** - Send notifications (push, email, wallet); templating, severity, delivery status. → [Guide](comms.md)
- **broadcasts** - Define broadcast campaigns; append recipients/events; analytics and CRUD.
- **segments** - Define dynamic/static audience segments; estimate and list recipients; schedule calculations.

— Analytics & Events —
- **interactions** - Log and analyze interactions/outcomes; aggregates and actor lists; interaction definition CRUD. → [Guide](interactions.md)
- **loyalty** - Loyalty programmes: schemes, earning rules tied to interactions, member balances, transaction ledger, and manual adjustments. → [Guide](loyalty.md)

— Automation —
- **journeys** - Configure automated flows triggered by events or schedules; steps, rules; full CRUD.

— NFC, Proofs & Claims —
- **nfc** - Claim and validate NFC tags; perform tag lookups.
- **proof** - Create, update, claim, and list product proofs (digital certificates).
- **claimSet** - Manage claim sets and tag assignments; queries, reports, and updates.
- **qr** - Lookup short codes to resolve collection/product/proof context.

— AI & Utilities —
- **ai** - Chat completions, RAG (document Q&A), podcast generation, TTS, content/image generation, voice integration.

— Other —
- **address** - Functions for address operations
- **adminCards** - Functions for adminCards operations
- **aiGuide** - Functions for aiGuide operations
- **analytics** - Functions for analytics operations
- **attestation** - Functions for attestation operations
- **attestations** - Functions for attestations operations
- **bookings** - Functions for bookings operations
- **conditions** - Functions for conditions operations
- **config** - Functions for config operations
- **containers** - Functions for containers operations
- **dpp** - Functions for dpp operations
- **errors** - Functions for errors operations
- **facets** - Functions for facets operations
- **files** - Functions for files operations
- **functions** - Functions for functions operations
- **http** - Functions for http operations
- **integrations** - Functions for integrations operations
- **jobs** - Functions for jobs operations
- **journeysAnalytics** - Functions for journeysAnalytics operations
- **knowledge** - Functions for knowledge operations
- **location** - Functions for location operations
- **lots** - Functions for lots operations
- **navigation** - Functions for navigation operations
- **operations** - Functions for operations operations
- **order** - Functions for order operations
- **partner** - Functions for partner operations
- **places** - Functions for places operations
- **products** - Functions for products operations
- **realtime** - Functions for realtime operations
- **research** - Functions for research operations
- **secrets** - Functions for secrets operations
- **serviceAccounts** - Functions for serviceAccounts operations
- **shop** - Functions for shop operations
- **subscriptions** - Functions for subscriptions operations
- **tagCodes** - Functions for tagCodes operations
- **tags** - Functions for tags operations
- **template** - Functions for template operations
- **translations** - Functions for translations operations
- **userGroups** - Functions for userGroups operations
- **wallet** - Functions for wallet operations

## HTTP Utilities

Core HTTP functions for API configuration and communication:

**getClientHeaders**() → `Record<string, string>`
The identity headers for this client: API version, SDK release and (in an app) the app.

**getApiVersion**() → `string`
The API version this client asks for (the SDK's own, unless `initializeApi({ apiVersion })` set another).

**getHttpCacheDiagnostics**() → `void`
Snapshot of cache counters + current keys. Call from the console via `window.__slHttpDiag()`.

**resetHttpCacheDiagnostics**() → `void`
Reset the diagnostics counters (does not touch the cache itself).

**isProxyEnabled**() → `boolean`
Return whether proxy mode is currently enabled.

**getAppContext**() → `string | undefined`
The current app context (appId), if the SDK was initialized with one.

**setAppContext**(id: string | undefined) → `void`
Set (or clear) the current app context — the appId used to scope SL.functions calls.

**getAppChannel**() → `string | undefined`
The release channel explicitly set for this app build (initializeApi({ appChannel }) / setAppChannel).

**setAppChannel**(channel: string | undefined) → `void`
Set (or clear) the release channel SL.functions calls target.

**initializeApi**(options: {
  baseURL: string
  apiKey?: string
  bearerToken?: string
  proxyMode?: boolean
  ngrokSkipBrowserWarning?: boolean
  extraHeaders?: Record<string, string>
  /**
   * Declares the host platform. Set to `'native'` on native/Capacitor hosts to opt into
   * AuthKit refresh tokens — the SDK then sends `X-Client-Platform: native` on every
   * request, so login endpoints return `refreshToken`/`refreshTokenExpiresAt` and a
   * short-lived access token. Omit (or `'web'`) → `void`
Call this once (e.g. at app startup) to configure baseURL/auth.

**setNgrokSkipBrowserWarning**(flag: boolean) → `void`
Enable/disable automatic "ngrok-skip-browser-warning" header.

**setExtraHeaders**(headers: Record<string, string>) → `void`
Replace or augment globally applied custom headers.

**setBearerToken**(token: string | undefined) → `void`
Allows setting the bearerToken at runtime (e.g. after login/logout). Clears the HTTP cache whenever the token actually changes so that stale user-scoped responses (e.g. /account/profile) are not served after a login or logout event.

**setGrantToken**(token: string | undefined) → `void`
Set (or clear) the per-proof share-grant token. When set, it is attached as the `X-Grant-Token` header on every request, so a recipient who has opened a shared link can read/comment on the granted proof's data. Pass `undefined` to clear it. The server re-checks the grant against the database on every request, so calling `revokeGrant` invalidates an in-flight token immediately. Clears the GET cache on change so grant-tier responses are not served after the token changes. ```ts // On opening ?proofId=…&shareToken=abc setGrantToken(shareToken) const { attestations } = await proof.get(...)  // now sees owner-tier memories ```

**getGrantToken**() → `string | undefined`
Returns the currently-set share-grant token, or `undefined`.

**getBearerToken**() → `string | undefined`
Returns the bearer token currently held by the SDK, or `undefined` if none is set. In proxy mode, credentials are held by the parent frame, not the local SDK, so this returns `undefined` even when the caller is authenticated.

**getBaseURL**() → `string | null`
Get the currently configured API base URL. Returns null if initializeApi() has not been called yet.

**isInitialized**() → `boolean`
Returns true if initializeApi() has been called at least once. Useful for guards in widgets or shared modules that want to skip initialization when another module has already done it. ```ts if (!isInitialized()) { initializeApi({ baseURL: 'https://smartlinks.app/api/v1' }) } ```

**hasAuthCredentials**() → `boolean`
Returns true if the SDK currently has any auth credential set (bearer token or API key). Use this as a cheap pre-flight check before calling endpoints that require authentication, to avoid issuing a network request that you already know will return a 401. ```ts if (hasAuthCredentials()) { const account = await auth.getAccount() } ```

**configureSdkCache**(options: {
  enabled?: boolean
  ttlMs?: number
  maxEntries?: number
  persistence?: 'none' | 'indexeddb'
  persistenceTtlMs?: number
  serveStaleOnOffline?: boolean
  clearOnPageLoad?: boolean
}) → `void`
Configure the SDK's built-in in-memory GET cache. The cache is transparent — it sits inside the HTTP layer and requires no changes to your existing API calls. All GET requests benefit automatically. Per-resource rules (collections/products → 1 h, proofs → 30 s, etc.) override this value. in-memory only (`'none'`, default). Ignored in Node.js. fallback, from the original fetch time (default: 7 days). `SmartlinksOfflineError` with stale data instead of propagating the network error. caches on page load/refresh. IndexedDB persists for offline. ```ts // Enable IndexedDB persistence for offline support configureSdkCache({ persistence: 'indexeddb' }) // Disable cache entirely in test environments configureSdkCache({ enabled: false }) // Keep caches across page refreshes (not recommended for production) configureSdkCache({ clearOnPageLoad: false }) ```

**invalidateCache**(urlPattern?: string, options?: InvalidateCacheOptions) → `void`
Manually invalidate entries in the SDK's GET cache. Note: the GET cache is **in-memory, per page load** (with an optional L2 IndexedDB layer when persistence is enabled) — it does not persist across reloads unless you opt into persistence, so it rarely needs disabling "for correctness". *contains* this string is removed). With `{ exact: true }`, matches the path precisely. Omit to wipe the entire cache. ```ts invalidateCache()                                  // clear everything invalidateCache('/collection/abc123')              // that collection AND everything under it invalidateCache('/collection/abc123', { exact: true }) // ONLY that collection entry invalidateCache('/products/')                      // all canonical plural product responses ```

**proxyUploadFormData**(path: string,
  formData: FormData,
  onProgress?: (percent: number) → `void`
Upload a FormData payload via proxy with progress events using chunked postMessage. Parent is expected to implement the counterpart protocol.

**request**(path: string) → `Promise<T>`
Internal helper that performs a GET request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. Cache pipeline (when caching is not skipped): L1 hit  → return from memory (no I/O) L2 hit  → return from IndexedDB, promote to L1 (no network) Miss    → fetch from network, store in L1 + L2 Offline → serve stale L2 entry via SmartlinksOfflineError (if persistence enabled) Concurrent identical GETs share one in-flight promise (deduplication). Node-safe: IndexedDB calls are no-ops when IDB is unavailable.

**post**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a POST request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**put**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a PUT request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**patch**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a PATCH request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**requestWithOptions**(path: string,
  options: RequestInit) → `Promise<T>`
Internal helper that performs a request to `${baseURL}${path}` with custom options, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**requestStream**(path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
    headers?: Record<string, string>
  }) → `Promise<AsyncIterable<T>>`
Internal helper that performs a streaming request using the shared auth and proxy transport. The response is expected to be `text/event-stream` with JSON payloads in `data:` frames.

**del**(path: string,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a DELETE request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**getApiHeaders**() → `Record<string, string>`
Returns the common headers used for API requests, including apiKey and bearerToken if set.

**sendCustomProxyMessage**(request: string, params: any) → `Promise<T>`
Sends a custom proxy message to the parent Smartlinks application when running in an iframe. This function is used to communicate with the parent window when the SDK is embedded in an iframe and proxyMode is enabled. It sends a message to the parent and waits for a response.

## Error Handling

All API functions throw `SmartlinksApiError` when requests fail. This error class provides structured access to HTTP status codes, server error codes, and additional context.

### SmartlinksApiError

**Properties:**
- **message** `string` - Human-readable error message in English (e.g., "Error 400: Not Authorized")
- **statusCode** `number` - HTTP status code (400, 401, 404, 500, etc.)
- **code** `number` - Numeric error code (same as statusCode)
- **details** `Record<string, any> | undefined` - Additional server response data, including string error codes
- **url** `string | undefined` - The URL that was requested

**Helper Methods:**
- **isAuthError()** `boolean` - Returns true for 401 or 403 status codes
- **isNotFound()** `boolean` - Returns true for 404 status code
- **isRateLimited()** `boolean` - Returns true for 429 status code
- **isClientError()** `boolean` - Returns true for 4xx status codes
- **isServerError()** `boolean` - Returns true for 5xx status codes
- **toJSON()** `object` - Returns a serializable object for logging

### Error Format Normalization

The SDK automatically normalizes various server error response formats into a consistent structure. The server may return errors in different formats, but they are all accessible through the same properties.

**Server String Error Codes:**
Server-specific error identifiers are preserved in `error.details`:
- Access via: `error.details?.errorCode` or `error.details?.error`
- Format examples: `"NOT_AUTHORIZED"`, `"broadcasts.topic.invalid"`, `"sendgrid.provision.failed"`
- Use these for programmatic error handling (switch statements, conditional logic)

### Usage Examples

**Basic Error Handling:**
```typescript
import { SmartlinksApiError, products } from '@proveanything/smartlinks'

try {
  const item = await products.get('collectionId', 'productId')
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    console.error('Status:', error.statusCode)      // 404
    console.error('Message:', error.message)        // "Error 404: Not found"
    console.error('URL:', error.url)                // "/public/collection/..."
  }
}
```

**Using Helper Methods:**
```typescript
try {
  await products.create('collectionId', data)
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    if (error.isAuthError()) {
      // Handle 401/403 - redirect to login
      redirectToLogin()
    } else if (error.isNotFound()) {
      // Handle 404
      showNotFound()
    } else if (error.isRateLimited()) {
      // Handle 429 - implement retry with backoff
      await retryAfterDelay()
    } else if (error.isServerError()) {
      // Handle 5xx
      showMaintenanceMessage()
    }
  }
}
```

**Accessing Server Error Codes:**
```typescript
try {
  await broadcasts.send('collectionId', 'broadcastId', options)
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    // Extract server-defined string error code
    const serverCode = error.details?.errorCode || error.details?.error
    
    switch (serverCode) {
      case 'NOT_AUTHORIZED':
        redirectToLogin()
        break
      case 'broadcasts.topic.invalid':
        showTopicSelector()
        break
      case 'sendgrid.provision.failed':
        alertAdmin('Email service error')
        break
      default:
        showError(error.message)
    }
  }
}
```

**Error Logging for Monitoring:**
```typescript
try {
  await api.someMethod()
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    // Log structured error data
    logger.error('API Error', error.toJSON())
    
    // Send to monitoring service
    Sentry.captureException(error, {
      extra: error.toJSON(),
      tags: {
        statusCode: error.statusCode,
        serverErrorCode: error.details?.errorCode || error.details?.error,
      }
    })
  }
}
```

**Handling Validation Errors:**
```typescript
try {
  await products.create('collectionId', formData)
} catch (error) {
  if (error instanceof SmartlinksApiError && error.statusCode === 400) {
    // Access field-specific validation errors if available
    if (error.details?.fields) {
      Object.entries(error.details.fields).forEach(([field, message]) => {
        showFieldError(field, String(message))
      })
    } else {
      showError(error.message)
    }
  }
}
```

**Retry Logic for Transient Errors:**
```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof SmartlinksApiError) {
        // Only retry server errors and rate limiting
        const shouldRetry = error.isServerError() || error.isRateLimited()
        
        if (!shouldRetry || attempt === maxRetries - 1) {
          throw error
        }
        
        // Exponential backoff
        const delay = 1000 * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }
  throw new Error('Max retries exceeded')
}

// Usage
const collections = await withRetry(() => collection.list())
```

### Error Code Reference

**HTTP Status Codes (numeric):**
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `502` - Bad Gateway
- `503` - Service Unavailable

**Server Error Codes (strings in `details.errorCode` or `details.error`):**
Examples include:
- `"NOT_AUTHORIZED"` - Not authorized for this action
- `"broadcasts.topic.invalid"` - Invalid communication topic
- `"broadcasts.manual.segment.missing"` - Missing required segment
- `"sendgrid.provision.failed"` - Email service provisioning failed
- `"validation.failed"` - Request validation failed

*Note: Server error codes use either `UPPERCASE_UNDERSCORE` or `dotted.notation` format. Both are supported.*

## Types

### address

**AddressPage** (interface)
```typescript
interface AddressPage {
  appId: string
  title: string
  name: string
  defaultName: string
  listed: boolean
  live: boolean
  url: string
}
```

**AddressWebsite** (interface)
```typescript
interface AddressWebsite {
  appId: string
  title: string
  live: boolean
  channel: string | null
}
```

**AddressResponse** (interface)
```typescript
interface AddressResponse {
  name: string | null
  host: string
  defaultHost: string | null
  domain: { host: string; live: boolean } | null
  front: AddressFront
  websites: AddressWebsite[]
  pages: AddressPage[]
}
```

**AddressNameAvailability** (interface)
```typescript
interface AddressNameAvailability {
  available: boolean
  host: string
}
```

**AppPageLink** (interface)
```typescript
interface AppPageLink {
  url: string
  pageUrl: string
  name: string
  live: boolean
  isFront: boolean
  host: string
  channel: string | null
}
```

**AddressFront** = ``

### adminCards

**AdminCardRefresh** (interface)
```typescript
interface AdminCardRefresh {
  on?: AdminCardRefreshOn[]
  maxAge?: number | string
}
```

**AdminCardDeclaration** (interface)
```typescript
interface AdminCardDeclaration {
  id: string
  title: string
  description?: string
  kind?: 'data' | 'component'
  function?: string
  component?: string
  sizes?: AdminCardSize[]
  priority?: number
  levels?: Array<'collection'>
  refresh?: AdminCardRefresh
}
```

**AppManifestAdminCards** (interface)
```typescript
interface AppManifestAdminCards {
  cards: AdminCardDeclaration[]
  files?: {
  js: { umd: string; esm?: string }
  css?: string
  }
}
```

**AdminCardAction** (interface)
```typescript
interface AdminCardAction {
  label: string
  path?: string
  url?: string
}
```

**AdminCardPayload** (interface)
```typescript
interface AdminCardPayload {
  title?: string
  value?: number | string
  label?: string
  unit?: string
  trend?: { direction: 'up' | 'down' | 'flat'; label?: string; good?: boolean }
  status?: { tone: 'ok' | 'attention' | 'neutral' | 'error'; text: string }
  progress?: { done: number; total: number; label?: string }
  items?: Array<{ title: string; subtitle?: string; meta?: string; path?: string; image?: string }>
  todo?: Array<{ text: string; action?: AdminCardAction }>
  actions?: AdminCardAction[]
  empty?: { text: string; action?: AdminCardAction }
}
```

**AdminCard** (interface)
```typescript
interface AdminCard {
  key: string
  appId: string
  cardId: string
  title: string
  description?: string
  kind: 'data' | 'component'
  sizes: AdminCardSize[]
  size: AdminCardSize
  priority: number
  state: AdminCardState
  payload: AdminCardPayload | null
  computedAt: number | null
  error?: string
  component?: { name: string; files: NonNullable<AppManifestAdminCards['files']> }
}
```

**StudioHomeLayout** (interface)
```typescript
interface StudioHomeLayout {
  version: 1
  cards: Array<{ key: string; size?: AdminCardSize; hidden?: boolean }>
}
```

**AdminCardSize** = `'small' | 'medium' | 'wide' | 'full'`

**AdminCardRefreshOn** = ``

**AdminCardState** = ``

### ai

**ContentPart** (interface)
```typescript
interface ContentPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: {
  url: string
  detail?: 'auto' | 'low' | 'high'
  }
}
```

**FunctionCall** (interface)
```typescript
interface FunctionCall {
  name: string
  arguments: string
}
```

**ToolCall** (interface)
```typescript
interface ToolCall {
  id: string
  type: 'function'
  function: {
  name: string
  arguments: string
  }
}
```

**ChatMessage** (interface)
```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  content: string | ContentPart[]
  name?: string
  function_call?: FunctionCall
  tool_calls?: ToolCall[]
  tool_call_id?: string
}
```

**ToolDefinition** (interface)
```typescript
interface ToolDefinition {
  type: 'function'
  function: {
  name: string
  description: string
  parameters: {
  type: 'object'
  properties: Record<string, {
  type: string
  description?: string
  enum?: string[]
  }>
  required?: string[]
  }
  }
}
```

**ResponseTool** (interface)
```typescript
interface ResponseTool {
  type: string
  name?: string
  description?: string
  parameters?: Record<string, any>
  output_schema?: Record<string, any>
  allowed_callers?: Array<'assistant' | 'programmatic'>
  [key: string]: any
}
```

**ResponseInputItem** (interface)
```typescript
interface ResponseInputItem {
  role?: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  type?: string
  content?: string | ContentPart[]
  name?: string
  function_call?: FunctionCall
  tool_calls?: ToolCall[]
  tool_call_id?: string
  [key: string]: any
}
```

**ResponsesRequest** (interface)
```typescript
interface ResponsesRequest {
  model?: string
  input?: string | ResponseInputItem[]
  messages?: ResponseInputItem[]
  previous_response_id?: string
  conversation?: string | Record<string, any>
  tools?: Array<ToolDefinition | ResponseTool>
  tool_choice?:
  | 'none'
  | 'auto'
  | 'required'
  | { type: 'function'; function: { name: string } }
  | { type: 'function'; name: string }
  stream?: boolean
  temperature?: number
  max_output_tokens?: number
  store?: boolean
  instructions?: string
  include?: string[]
  reasoning?: Record<string, any>
  parallel_tool_calls?: boolean
  truncation?: 'auto' | 'disabled'
  text?: Record<string, any>
  metadata?: Record<string, string>
  prompt_cache_key?: string
  multi_agent?: {
  enabled: boolean
  max_concurrent_subagents?: number
  }
  service_tier?: 'auto' | 'standard' | 'flex' | 'priority'
  feature?: string
  session_id?: string
  server_tools?: boolean | AiToolName[]
  allowCapabilities?: AiToolCapability[]
  only?: AiToolName[]
  exclude?: AiToolName[]
  maxSteps?: number
  app_functions?: AgentAppFunctionsOption
  toolbelt?: AgentToolbelt
}
```

**ResponsesResult** (interface)
```typescript
interface ResponsesResult {
  id: string
  object: 'response'
  created: number
  model: string
  status?: 'completed' | 'failed' | 'in_progress' | 'queued' | 'cancelled' | 'incomplete'
  output: any[]
  output_text: string
  usage: {
  input_tokens: number
  output_tokens: number
  total_tokens: number
  }
  error?: any
  incomplete_details?: { reason?: 'max_output_tokens' | 'content_filter' } | null
  previous_response_id?: string | null
  conversation?: unknown
  provider: 'openai'
  responseTime: number
  _agent?: ResponsesAgentTrace
}
```

**ResponsesStreamEvent** (interface)
```typescript
interface ResponsesStreamEvent {
  type: string
  [key: string]: any
}
```

**ChatCompletionRequest** (interface)
```typescript
interface ChatCompletionRequest {
  messages: ChatMessage[]
  model?: string
  stream?: boolean
  tools?: ToolDefinition[]
  tool_choice?: 'none' | 'auto' | 'required' | { type: 'function'; function: { name: string } }
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  response_format?: { type: 'text' | 'json_object' }
  user?: string
}
```

**ChatCompletionChoice** (interface)
```typescript
interface ChatCompletionChoice {
  index: number
  message: ChatMessage
  finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter' | null
}
```

**ChatCompletionResponse** (interface)
```typescript
interface ChatCompletionResponse {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: ChatCompletionChoice[]
  usage: {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  }
}
```

**ChatCompletionChunk** (interface)
```typescript
interface ChatCompletionChunk {
  id: string
  object: 'chat.completion.chunk'
  created: number
  model: string
  choices: Array<{
  index: number
  delta: Partial<ChatMessage>
  finish_reason: string | null
  }>
}
```

**AIModel** (interface)
```typescript
interface AIModel {
  id: string
  provider: 'gemini' | 'openai'
  modelId: string
  name: string
  description: string
  capabilities: Array<'text' | 'vision' | 'audio' | 'code'>
  contextWindow: number
  pricing: {
  input: number
  output: number
  cached?: number
  }
  features: string[]
  recommended?: string
}
```

**AIModelListParams** (interface)
```typescript
interface AIModelListParams {
  provider?: 'gemini' | 'openai'
  capability?: 'text' | 'vision' | 'audio' | 'code'
}
```

**AIModelListResponse** (interface)
```typescript
interface AIModelListResponse {
  object: 'list'
  data: AIModel[]
}
```

**Session** (interface)
```typescript
interface Session {
  sessionId: string
  productId: string
  userId: string
  messageCount: number
  createdAt: string
  lastActivityAt: string
  messages: ChatMessage[]
}
```

**RateLimitStatus** (interface)
```typescript
interface RateLimitStatus {
  used: number
  remaining: number
  resetAt: string
}
```

**SessionStatistics** (interface)
```typescript
interface SessionStatistics {
  totalSessions: number
  activeSessions: number
  totalMessages: number
  rateLimitedUsers: number
}
```

**AiSession** (interface)
```typescript
interface AiSession {
  id: string
  collectionId: string
  appId?: string | null
  scope: AiSessionScope
  title?: string | null
  status: string
  ownerId?: string | null
  authorId?: string | null
  productId?: string | null
  proofId?: string | null
  feature?: string | null
  items: ResponseInputItem[]
  summary?: Record<string, any>
  usage?: Record<string, any>
  itemCount: number
  lastTurnAt?: string | null
  createdAt: string
  updatedAt: string
  expiresAt?: string | null
}
```

**AiSessionCreate** (interface)
```typescript
interface AiSessionCreate {
  appId?: string
  title?: string
  productId?: string
  proofId?: string
  feature?: string
  ttlMs?: number
  items?: ResponseInputItem[]
}
```

**AiUsageReport** (interface)
```typescript
interface AiUsageReport {
  groupBy: string[]
  from?: string | null
  to?: string | null
  totals: AiUsageTotals
  groups: Array<Record<string, any> & AiUsageTotals>
}
```

**AiUsageTotals** (interface)
```typescript
interface AiUsageTotals {
  promptTokens: number
  outputTokens: number
  cachedTokens: number
  totalTokens: number
  requests: number
  images: number
}
```

**VoiceSessionRequest** (interface)
```typescript
interface VoiceSessionRequest {
  productId: string
  userId: string
  collectionId: string
  settings?: {
  voice?: string
  language?: string
  model?: string
  }
}
```

**VoiceSessionResponse** (interface)
```typescript
interface VoiceSessionResponse {
  token: string
  systemInstruction: string
  expiresAt: string
  productName: string
}
```

**EphemeralTokenRequest** (interface)
```typescript
interface EphemeralTokenRequest {
  settings?: {
  ttl?: number
  voice?: string
  language?: string
  model?: string
  }
}
```

**EphemeralTokenResponse** (interface)
```typescript
interface EphemeralTokenResponse {
  token: string
  expiresAt: string
}
```

**TranscriptionResponse** (interface)
```typescript
interface TranscriptionResponse {
  text: string
}
```

**TTSRequest** (interface)
```typescript
interface TTSRequest {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed?: number
  format?: 'mp3' | 'opus' | 'aac' | 'flac'
}
```

**GeneratePodcastRequest** (interface)
```typescript
interface GeneratePodcastRequest {
  productId: string
  documentText?: string
  duration?: number
  style?: 'casual' | 'professional' | 'educational' | 'entertaining'
  voices?: {
  host1?: string
  host2?: string
  }
  includeAudio?: boolean
  language?: string
  customInstructions?: string
}
```

**PodcastScript** (interface)
```typescript
interface PodcastScript {
  title: string
  description: string
  segments: Array<{
  speaker: 'host1' | 'host2'
  text: string
  timestamp?: number
  duration?: number
  }>
}
```

**GeneratePodcastResponse** (interface)
```typescript
interface GeneratePodcastResponse {
  success: boolean
  podcastId: string
  script: PodcastScript
  audio?: {
  host1Url?: string
  host2Url?: string
  mixedUrl?: string
  }
  metadata: {
  duration: number
  wordCount: number
  generatedAt: string
  }
}
```

**PodcastStatus** (interface)
```typescript
interface PodcastStatus {
  podcastId: string
  status: 'generating_script' | 'generating_audio' | 'mixing' | 'completed' | 'failed'
  progress: number
  estimatedTimeRemaining?: number
  error?: string
  result?: GeneratePodcastResponse
}
```

**AIGenerateContentRequest** (interface)
```typescript
interface AIGenerateContentRequest {
  contents: string | any
  responseMimeType?: string
  systemInstruction?: string
  provider?: string
  model?: string
  [key: string]: any
}
```

**AIGenerateImageRequest** (interface)
```typescript
interface AIGenerateImageRequest {
  prompt: string
  provider?: string
  model?: string
  size?: string
  [key: string]: any
}
```

**AISearchPhotosRequest** (interface)
```typescript
interface AISearchPhotosRequest {
  query: string
  per_page?: number
  orientation?: 'landscape' | 'portrait' | 'squarish'
  [key: string]: any
}
```

**AISearchPhotosPhoto** (interface)
```typescript
interface AISearchPhotosPhoto {
  id?: string
  url: string
  thumb?: string
  alt?: string
  width?: number
  height?: number
  photographer?: string
  photographerUrl?: string
  [key: string]: any
}
```

**AISearchPhotosResponse** (interface)
```typescript
interface AISearchPhotosResponse {
  provider: string
  results: AISearchPhotosPhoto[]
  total?: number
  total_pages?: number
  [key: string]: any
}
```

**AIGeneratedImage** (interface)
```typescript
interface AIGeneratedImage {
  url: string | null
  b64_json: string | null
  revised_prompt?: string
  [key: string]: any
}
```

**AIGenerateImageResponse** (interface)
```typescript
interface AIGenerateImageResponse {
  provider: string
  model?: string
  images: AIGeneratedImage[]
  [key: string]: any
}
```

**AIGenerateContentCandidate** (interface)
```typescript
interface AIGenerateContentCandidate {
  content?: { parts?: Array<{ text?: string; [k: string]: any }>; role?: string; [k: string]: any }
  finishReason?: string
  [key: string]: any
}
```

**AIGenerateContentResponse** (interface)
```typescript
interface AIGenerateContentResponse {
  provider?: string
  model?: string
  candidates?: AIGenerateContentCandidate[]
  usageMetadata?: {
  promptTokenCount?: number
  candidatesTokenCount?: number
  totalTokenCount?: number
  [k: string]: any
  }
  responseTime?: number
  [key: string]: any
}
```

**AIUploadedFile** (interface)
```typescript
interface AIUploadedFile {
  name?: string
  uri?: string
  url?: string
  mimeType?: string
  sizeBytes?: number | string
  state?: string
  [key: string]: any
}
```

**AICacheRef** (interface)
```typescript
interface AICacheRef {
  name?: string
  model?: string
  expireTime?: string
  [key: string]: any
}
```

**AgentRunRequest** (interface)
```typescript
interface AgentRunRequest {
  input?: string
  prompt?: string
  instructions?: string
  model?: string
  maxSteps?: number
  allowCapabilities?: string[]
  only?: string[]
  exclude?: string[]
  appFunctions?: AgentAppFunctionsOption
  toolbelt?: AgentToolbelt
}
```

**AgentAppFunctionsOption** (interface)
```typescript
interface AgentAppFunctionsOption {
  appId: string
  channel?: string
  only?: string[]
}
```

**AgentToolbelt** (interface)
```typescript
interface AgentToolbelt {
  builtins?: boolean | AiToolName[]
  appFunctions?: AgentAppFunctionsOption | AgentAppFunctionsOption[]
  clientTools?: ClientToolDeclaration[]
}
```

**ClientToolDeclaration** (interface)
```typescript
interface ClientToolDeclaration {
  name: string
  description?: string
  input?: Record<string, any>
}
```

**ClientToolCall** (interface)
```typescript
interface ClientToolCall {
  callId: string
  name: string
  args: Record<string, any>
}
```

**RequiresActionResult** (interface)
```typescript
interface RequiresActionResult {
  status: 'requires_action'
  client_tool_calls: ClientToolCall[]
  items: any[]
  steps?: number
  toolResults?: AgentToolResult[]
  availableTools?: string[]
}
```

**ClientTool** (interface)
```typescript
interface ClientTool {
  declaration: ClientToolDeclaration
  handler: (args: Record<string, any>) => any | Promise<any>
}
```

**RunWithClientToolsOptions** (interface)
```typescript
interface RunWithClientToolsOptions {
  input: string
  tools: ClientTool[]
  surface?: 'admin' | 'public'
  instructions?: string
  model?: string
  maxSteps?: number
  toolbelt?: AgentToolbelt
  maxRounds?: number
}
```

**PublicAgentRunRequest** (interface)
```typescript
interface PublicAgentRunRequest {
  input?: string
  prompt?: string
  instructions?: string
  model?: string
  maxSteps?: number
  server_tools?: AiToolName[]
  only?: AiToolName[]
  exclude?: AiToolName[]
  allowCapabilities?: AiToolCapability[]
  appFunctions?: AgentAppFunctionsOption
  toolbelt?: AgentToolbelt
  userId?: string
}
```

**AgentToolResult** (interface)
```typescript
interface AgentToolResult {
  name: string
  isError: boolean
  result: any
}
```

**ToolRunResult<T = any>** (interface)
```typescript
interface ToolRunResult<T = any> {
  name: string
  isError: boolean
  result: T
}
```

**AgentRunResult** (interface)
```typescript
interface AgentRunResult {
  finalText: string | null
  steps: number
  maxStepsReached: boolean
  toolResults: AgentToolResult[]
  availableTools: string[]
}
```

**AgentToolDefinition** (interface)
```typescript
interface AgentToolDefinition {
  name: string
  description: string
  capabilities: string[]
  parameters: any
}
```

**AgentToolsQuery** (interface)
```typescript
interface AgentToolsQuery {
  allowCapabilities?: string
  only?: string
  exclude?: string
}
```

**SkillDescriptor** (interface)
```typescript
interface SkillDescriptor {
  name: string
  description: string
  inputSchema: any
  outputSchema: any
  capabilities: string[]
}
```

**CatalogResponse** (interface)
```typescript
interface CatalogResponse {
  tools: AgentToolDefinition[]
  skills: SkillDescriptor[]
}
```

**WebFetchPageArgs** (interface)
```typescript
interface WebFetchPageArgs {
  url: string; type?: string; forceRefresh?: boolean
}
```

**WebExtractSchemaArgs** (interface)
```typescript
interface WebExtractSchemaArgs {
  url: string; schemaType?: string; forceRefresh?: boolean
}
```

**WebScreenshotArgs** (interface)
```typescript
interface WebScreenshotArgs {
  url: string
}
```

**WebSearchArgs** (interface)
```typescript
interface WebSearchArgs {
  query: string; limit?: number; scrapeContent?: boolean
}
```

**BrandAssetsArgs** (interface)
```typescript
interface BrandAssetsArgs {
  url: string
}
```

**DocumentReadArgs** (interface)
```typescript
interface DocumentReadArgs {
  url: string; forceRefresh?: boolean
}
```

**DataExtractArgs** (interface)
```typescript
interface DataExtractArgs {
  url: string; schema?: Record<string, any>; prompt?: string
}
```

**ImageDescribeArgs** (interface)
```typescript
interface ImageDescribeArgs {
  imageUrl: string; prompt?: string
}
```

**ImageGenerateArgs** (interface)
```typescript
interface ImageGenerateArgs {
  prompt: string; size?: string; provider?: 'openai' | 'gemini'
}
```

**ImageFromReferenceArgs** (interface)
```typescript
interface ImageFromReferenceArgs {
  prompt: string; imageUrls: string[]; size?: string; model?: string
}
```

**ImageSearchStockArgs** (interface)
```typescript
interface ImageSearchStockArgs {
  query: string; per_page?: number; orientation?: 'landscape' | 'portrait' | 'squarish'
}
```

**ImageTransformArgs** (interface)
```typescript
interface ImageTransformArgs {
  imageUrl: string
  resize?: { width?: number; height?: number; fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'; allowUpscale?: boolean }
  crop?: { left: number; top: number; width: number; height: number }
  rotate?: number
  flip?: boolean
  flop?: boolean
  grayscale?: boolean
  tint?: string
  modulate?: { brightness?: number; saturation?: number; hue?: number; lightness?: number }
  format?: 'jpeg' | 'png' | 'webp' | 'avif'
  quality?: number
}
```

**ImageOcrArgs** (interface)
```typescript
interface ImageOcrArgs {
  imageUrl?: string
  url?: string
  page?: number
  dpi?: number
  clip?: PdfClip
  languages?: string[]
}
```

**PdfClip** (interface)
```typescript
interface PdfClip {
  x0: number; y0: number; x1: number; y1: number
}
```

**PdfCreateArgs** (interface)
```typescript
interface PdfCreateArgs {
  html?: string
  pages?: string[]
  head?: string
  width?: number
  height?: number
  unit?: 'mm' | 'cm' | 'in' | 'pt' | 'px'
  format?: string
  landscape?: boolean
  margin?: string
  return?: 'url' | 'signedUrl' | 'base64'
  expiresIn?: number
  filename?: string
  cache?: boolean
}
```

**PdfCreateResult** (interface)
```typescript
interface PdfCreateResult {
  url?: string
  hostedUrl?: string
  base64?: string
  expiresAt?: string
  contentType: 'application/pdf'
  size: number
  pageCount: number
  cached: boolean
  renderer?: string
  warnings?: string[]
}
```

**PdfFillArgs** (interface)
```typescript
interface PdfFillArgs {
  url: string; fields: Record<string, string | number | boolean>; flatten?: boolean
}
```

**PdfMergeArgs** (interface)
```typescript
interface PdfMergeArgs {
  urls: string[]
}
```

**PdfInspectArgs** (interface)
```typescript
interface PdfInspectArgs {
  url: string; maxPages?: number; minTextChars?: number
}
```

**PdfRenderArgs** (interface)
```typescript
interface PdfRenderArgs {
  url: string
  page?: number
  dpi?: number
  clip?: PdfClip
}
```

**PdfExtractArgs** (interface)
```typescript
interface PdfExtractArgs {
  url: string; schema?: Record<string, any>; prompt?: string; maxPages?: number; dpi?: number; includeConfidence?: boolean; includeBoxes?: boolean
}
```

**PdfDecodeBarcodesArgs** (interface)
```typescript
interface PdfDecodeBarcodesArgs {
  url: string; page?: number; dpi?: number
}
```

**PdfInspectGraphicsArgs** (interface)
```typescript
interface PdfInspectGraphicsArgs {
  url: string; page?: number
}
```

**PdfBox** (interface)
```typescript
interface PdfBox {
  x: number; y: number; w: number; h: number
}
```

**PdfEditArgs** (interface)
```typescript
interface PdfEditArgs {
  url: string
  replaceText?: { id?: string; page?: number; find: string; replace: string; bold?: boolean; align?: 'left' | 'center' | 'right' }[]
  addText?: { id?: string; page: number; box: PdfBox; text: string; size?: number; bold?: boolean; colour?: PdfColour; align?: 'left' | 'center' | 'right' }[]
  addImages?: { id?: string; page: number; box: PdfBox; imageUrl: string; colorSpace?: 'rgb' | 'cmyk' }[]
  preserveColour?: boolean
}
```

**PdfPreflightArgs** (interface)
```typescript
interface PdfPreflightArgs {
  url: string; profile?: PdfXProfile; bleed?: { mm: number }; minDpi?: number
}
```

**PdfPrintReadyArgs** (interface)
```typescript
interface PdfPrintReadyArgs {
  url: string
  profile?: PdfXProfile | 'none'
  outputIntent?: string
  colour?: 'cmyk' | 'gray' | 'keep'
  spotColours?: 'keep' | 'convert'
  outlineFonts?: boolean
  embedFonts?: boolean
  downsample?: { dpi: number }
  pages?: string
  annotations?: 'remove' | 'flatten' | 'keep'
  layers?: { hide?: string[]; show?: string[] }
  bleed?: { mm: number }
  bleedIncluded?: { mm: number; force?: boolean }
  cropMarks?: { offsetMm?: number; lengthMm?: number; weightPt?: number }
  flattenTransparency?: boolean
  minDpi?: number
  title?: string
}
```

**HttpRequestArgs** (interface)
```typescript
interface HttpRequestArgs {
  url: string; method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'; headers?: Record<string, string>; body?: any
}
```

**KnowledgeSearchArgs** (interface)
```typescript
interface KnowledgeSearchArgs {
  query: string; sets?: string[]; filters?: Record<string, any>; k?: number
}
```

**TranslateArgs** (interface)
```typescript
interface TranslateArgs {
  text: string; targetLanguages: string[]; sourceLanguage?: string
}
```

**AiToolArgsMap** (interface)
```typescript
interface AiToolArgsMap {
  'web.fetchPage': WebFetchPageArgs
  'web.extractSchema': WebExtractSchemaArgs
  'web.screenshot': WebScreenshotArgs
  'web.search': WebSearchArgs
  'brand.assets': BrandAssetsArgs
  'document.read': DocumentReadArgs
  'data.extract': DataExtractArgs
  'image.describe': ImageDescribeArgs
  'image.generate': ImageGenerateArgs
  'image.fromReference': ImageFromReferenceArgs
  'image.searchStock': ImageSearchStockArgs
  'image.transform': ImageTransformArgs
  'image.ocr': ImageOcrArgs
  'pdf.create': PdfCreateArgs
  'pdf.fill': PdfFillArgs
  'pdf.merge': PdfMergeArgs
  'pdf.inspect': PdfInspectArgs
  'pdf.render': PdfRenderArgs
  'pdf.extract': PdfExtractArgs
  'pdf.decodeBarcodes': PdfDecodeBarcodesArgs
  'pdf.inspectGraphics': PdfInspectGraphicsArgs
  'pdf.edit': PdfEditArgs
  'pdf.preflight': PdfPreflightArgs
  'pdf.printReady': PdfPrintReadyArgs
  'http.request': HttpRequestArgs
  'translate': TranslateArgs
  'knowledge.search': KnowledgeSearchArgs
}
```

**WebSearchResultItem** (interface)
```typescript
interface WebSearchResultItem {
  url: string | null; title: string | null; description: string | null; markdown?: string
}
```

**WebSearchResult** (interface)
```typescript
interface WebSearchResult {
  query: string; results: WebSearchResultItem[]
}
```

**DocumentReadResult** (interface)
```typescript
interface DocumentReadResult {
  url: string; text: string | null; metadata?: any; provider?: string; cached?: boolean
}
```

**DataExtractResult** (interface)
```typescript
interface DataExtractResult {
  url: string; data: Record<string, any>
}
```

**WebFetchPageResult** (interface)
```typescript
interface WebFetchPageResult {
  url: string; markdown?: string | null; html?: string | null; metadata?: any; schemas?: any[]; provider?: string; cached?: boolean; status?: number | null
}
```

**ImageDescribeResult** (interface)
```typescript
interface ImageDescribeResult {
  imageUrl: string; text: string | null
}
```

**HostedAssetResult** (interface)
```typescript
interface HostedAssetResult {

}
```

**HttpRequestResult** (interface)
```typescript
interface HttpRequestResult {
  status: number; headers: Record<string, any>; body: any; truncated: boolean; finalUrl: string
}
```

**TranslateResult** (interface)
```typescript
interface TranslateResult {
  translations: Record<string, string>; sourceLanguage: string
}
```

**PdfInspectPage** (interface)
```typescript
interface PdfInspectPage {
  page: number; width: number; height: number; textChars: number; hasText: boolean; imageCount: number; likelyType: 'text-native' | 'text+raster' | 'raster-only' | 'curve-only'
}
```

**PdfInspectResult** (interface)
```typescript
interface PdfInspectResult {
  url: string; pageCount: number; inspectedPages: number; totalTextChars: number; isTextNative: boolean; isCurveOnly: boolean; recommendedPath: 'text' | 'vision'; note: string; pages: PdfInspectPage[]
}
```

**PdfRenderResult** (interface)
```typescript
interface PdfRenderResult {
  url: string | null; page: number; pageCount: number; dpi: number; width: number; height: number; clip?: PdfClip
}
```

**PdfRenderTooLarge** (interface)
```typescript
interface PdfRenderTooLarge {
  error: string; code: 'too_large'; requestedPixels: number; maxPixels: number; suggestedDpi: number; width: number; height: number
}
```

**OcrBox** (interface)
```typescript
interface OcrBox {
  x: number; y: number; w: number; h: number
}
```

**OcrWord** (interface)
```typescript
interface OcrWord {
  text: string; confidence: number; bbox: OcrBox
}
```

**OcrLine** (interface)
```typescript
interface OcrLine {
  text: string; confidence: number; bbox: OcrBox
}
```

**ImageOcrResult** (interface)
```typescript
interface ImageOcrResult {
  words: OcrWord[]
  lines: OcrLine[]
  text: string
  width: number | null
  height: number | null
  languages: string[]
  page?: number
  dpi?: number
  clip?: PdfClip
  engine: string
}
```

**PdfFieldMeta** (interface)
```typescript
interface PdfFieldMeta {
  confidence?: number | null; source?: 'text' | 'vision' | 'inferred'; bbox?: { x: number; y: number; w: number; h: number; page: number }
}
```

**PdfExtractResult** (interface)
```typescript
interface PdfExtractResult {
  url: string; method: 'text' | 'vision'; pagesRead: number; fields: Record<string, any>; fieldsMeta?: Record<string, PdfFieldMeta>
}
```

**PdfBarcode** (interface)
```typescript
interface PdfBarcode {
  type: string; format: string; value: string; page: number; bbox?: { x: number; y: number; w: number; h: number }; confidence: number
}
```

**PdfDecodeBarcodesResult** (interface)
```typescript
interface PdfDecodeBarcodesResult {
  url: string; pagesScanned: number; codes: PdfBarcode[]
}
```

**PdfGraphicsPage** (interface)
```typescript
interface PdfGraphicsPage {
  page: number; paths: number; images: number; textRuns: number; colourSpaces: string[]
}
```

**PdfInspectGraphicsResult** (interface)
```typescript
interface PdfInspectGraphicsResult {
  url: string; pages: PdfGraphicsPage[]; spotColours: string[]; note: string
}
```

**PdfEditItemResult** (interface)
```typescript
interface PdfEditItemResult {
  id: string
  status: 'done' | 'failed'
  note?: string
  verified?: boolean
  usedFallbackFont?: boolean
}
```

**PdfEditResult** (interface)
```typescript
interface PdfEditResult {
  url: string; results: PdfEditItemResult[]; warnings: string[]
}
```

**PdfPreflightFinding** (interface)
```typescript
interface PdfPreflightFinding {
  severity: 'error' | 'warning'; code: string; page?: number; message: string
}
```

**PdfPreflightResult** (interface)
```typescript
interface PdfPreflightResult {
  url: string
  compliant: boolean
  profile: PdfXProfile | null
  version: string | null
  findings: PdfPreflightFinding[]
  stats: {
  pageCount: number
  fonts: { name: string; embedded: boolean; subset: boolean; type: string; pages: number[] }[]
  spotColours: string[]
  images: { page: number; dpi: number; width: number; height: number; space: string; placedMm: { w: number; h: number } }[]
  transparency: boolean
  outputIntent: { identifier: string | null; hasProfile: boolean } | null
  annotations: number
  layers: { name: string; visible: boolean }[]
  [key: string]: any
  }
}
```

**PdfPrintReadyResult** (interface)
```typescript
interface PdfPrintReadyResult {
  url: string
  report: {
  compliant: boolean
  profile: PdfXProfile | 'none'
  outputIntent: string
  findings: PdfPreflightFinding[]
  changes: { code: string; message: string }[]
  before: { compliant: boolean; errors: number; findings: PdfPreflightFinding[] }
  stats: Record<string, any>
  note: string
  }
}
```

**ResponsesAgentTrace** (interface)
```typescript
interface ResponsesAgentTrace {
  steps: number
  maxStepsReached: boolean
  toolResults: AgentToolResult[]
  availableTools: string[]
}
```

**AgentToolCallEvent** (interface)
```typescript
interface AgentToolCallEvent {
  type: 'agent.tool_call'; name: string; args: Record<string, any>
}
```

**AgentToolResultEvent** (interface)
```typescript
interface AgentToolResultEvent {
  type: 'agent.tool_result'; name: string; isError: boolean; result: any
}
```

**AgentResponseCompletedEvent** (interface)
```typescript
interface AgentResponseCompletedEvent {
  type: 'response.completed'; response: ResponsesResult; _agent: ResponsesAgentTrace
}
```

**AiSessionScope** = `'admin' | 'owner' | 'public'`

**AiToolCapability** = ``

**AiToolName** = ``

**PdfColour** = `string | [number, number, number, number]`

**PdfXProfile** = `'pdfx-1a' | 'pdfx-4'`

**AgentStreamEvent** = ``

### analytics

**AnalyticsLocation** (interface)
```typescript
interface AnalyticsLocation {
  country?: string
  latitude?: number
  longitude?: number
  area?: number
  [key: string]: any
}
```

**AnalyticsStandardEventFields** (interface)
```typescript
interface AnalyticsStandardEventFields {
  visitorId?: string
  referrer?: string
  referrerHost?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  entryType?: string
  group?: string
  tag?: string
  campaign?: string
  placement?: string
  linkGroup?: string
  linkPlacement?: string
  linkPosition?: string | number
  linkTitle?: string
  destinationDomain?: string
  pagePath?: string
  pageId?: string
  qrCodeId?: string
  scanMethod?: string
}
```

**AnalyticsTrackOptions** (interface)
```typescript
interface AnalyticsTrackOptions {
  preferBeacon?: boolean
}
```

**AnalyticsBrowserConfig** (interface)
```typescript
interface AnalyticsBrowserConfig {
  sessionStorageKey?: string
  sessionIdFactory?: () => AnalyticsSessionId
  visitorId?: string
  visitorStorage?: AnalyticsStorageMode
  visitorStorageKey?: string
  visitorIdFactory?: () => string
  autoCaptureCampaignParams?: boolean
  campaignParamMap?: Partial<Record<keyof AnalyticsStandardEventFields, string | string[]>>
  defaultCollectionEvent?: Partial<CollectionAnalyticsEvent>
  defaultTagEvent?: Partial<TagAnalyticsEvent>
  getCollectionDefaults?: () => Partial<CollectionAnalyticsEvent> | undefined
  getTagDefaults?: () => Partial<TagAnalyticsEvent> | undefined
  getLocation?: () => AnalyticsLocation | null | undefined
}
```

**AnalyticsVisitorIdOptions** (interface)
```typescript
interface AnalyticsVisitorIdOptions {
  persist?: boolean
  storage?: AnalyticsStorageMode
  storageKey?: string
}
```

**AnalyticsPageViewBindingOptions** (interface)
```typescript
interface AnalyticsPageViewBindingOptions {
  trackInitialPageView?: boolean
  includeHashChanges?: boolean
  event?: Partial<CollectionAnalyticsEvent>
  trackOptions?: AnalyticsTrackOptions
  getEvent?: (path: string) => Partial<CollectionAnalyticsEvent> | null | undefined
}
```

**AnalyticsLinkBindingOptions** (interface)
```typescript
interface AnalyticsLinkBindingOptions {
  root?: Document | HTMLElement
  selector?: string
  trackInternal?: boolean
  event?: Partial<CollectionAnalyticsEvent>
  trackOptions?: AnalyticsTrackOptions
  getEvent?: (anchor: HTMLAnchorElement, event: MouseEvent) => Partial<CollectionAnalyticsEvent> | null | undefined
}
```

**AnalyticsTrackResult** (interface)
```typescript
interface AnalyticsTrackResult {
  queued: boolean
  transport: 'beacon' | 'fetch' | 'unavailable'
}
```

**AnalyticsFilterRequest** (interface)
```typescript
interface AnalyticsFilterRequest {
  source?: AnalyticsSource
  from?: string
  to?: string
  eventType?: string
  eventTypes?: string[]
  productId?: string
  productIds?: string[]
  proofId?: string
  proofIds?: string[]
  batchId?: string
  batchIds?: string[]
  variantId?: string
  variantIds?: string[]
  sessionId?: AnalyticsSessionId
  sessionIds?: AnalyticsSessionId[]
  country?: string
  countries?: string[]
  metadata?: Record<string, any>
  appId?: string
  appIds?: string[]
  destinationAppId?: string
  destinationAppIds?: string[]
  linkId?: string
  linkIds?: string[]
  href?: string
  path?: string
  hrefContains?: string
  pathContains?: string
  isExternal?: boolean
  codeId?: string
  codeIds?: string[]
  claimId?: string
  claimIds?: string[]
  isAdmin?: boolean
  hasLocation?: boolean
  sources?: string[]
  redirectMode?: string
  redirectModes?: string[]
}
```

**AnalyticsSummaryData** (interface)
```typescript
interface AnalyticsSummaryData {
  totalEvents?: number
  uniqueSessions?: number
  uniqueVisitors?: number
  uniqueCountries?: number
  uniqueLinks?: number
  externalEvents?: number
  internalEvents?: number
  firstEventAt?: string | null
  lastEventAt?: string | null
  uniqueCodes?: number
  uniqueClaims?: number
  adminEvents?: number
  customerEvents?: number
  locationEvents?: number
  [key: string]: any
}
```

**AnalyticsSummaryResponse** (interface)
```typescript
interface AnalyticsSummaryResponse {
  source: AnalyticsSource
  summary: AnalyticsSummaryData
}
```

**AnalyticsTimeseriesRow** (interface)
```typescript
interface AnalyticsTimeseriesRow {
  period: string
  count: number
  uniqueSessions?: number
  uniqueVisitors?: number
  value: number
  [key: string]: any
}
```

**AnalyticsTimeseriesResponse** (interface)
```typescript
interface AnalyticsTimeseriesResponse {
  source: AnalyticsSource
  granularity: AnalyticsGranularity
  metric: AnalyticsMetric
  rows: AnalyticsTimeseriesRow[]
}
```

**AnalyticsBreakdownRow** (interface)
```typescript
interface AnalyticsBreakdownRow {
  dimensionValue: string | number | boolean | null
  count: number
  uniqueSessions?: number
  uniqueVisitors?: number
  value: number
  [key: string]: any
}
```

**AnalyticsBreakdownResponse** (interface)
```typescript
interface AnalyticsBreakdownResponse {
  source: AnalyticsSource
  dimension: string
  metric: AnalyticsMetric
  rows: AnalyticsBreakdownRow[]
}
```

**LegacyAnalyticsRequest** (interface)
```typescript
interface LegacyAnalyticsRequest {
  collection?: string
  collectionId?: string
  productId?: string
  appId?: string
  startDate?: string
  endDate?: string
  location?: string
  tagId?: string
  qrCodeUrl?: string
  [key: string]: any
}
```

**AnalyticsDashboardMetrics** (interface)
```typescript
interface AnalyticsDashboardMetrics {
  [key: string]: string | number | null
}
```

**AnalyticsDashboardCharts** (interface)
```typescript
interface AnalyticsDashboardCharts {
  [key: string]: any[]
}
```

**AnalyticsDashboardResponse** (interface)
```typescript
interface AnalyticsDashboardResponse {
  metrics: AnalyticsDashboardMetrics
  charts: AnalyticsDashboardCharts
  locationData: any[]
}
```

**AnalyticsProductsRow** (interface)
```typescript
interface AnalyticsProductsRow {
  productId: string
  totalEvents: number
}
```

**AnalyticsProductsResponse** (interface)
```typescript
interface AnalyticsProductsResponse {
  products: string[]
  rows: AnalyticsProductsRow[]
}
```

**AnalyticsQrCodeRow** (interface)
```typescript
interface AnalyticsQrCodeRow {
  href: string
  visits: number
  displayName: string
  code: string
}
```

**AnalyticsTagRow** (interface)
```typescript
interface AnalyticsTagRow {
  tagId: string
  claimId: string
  codeId: string
  displayName: string
  scans: number
  activeDays: number
}
```

**AnalyticsTagsResponse** (interface)
```typescript
interface AnalyticsTagsResponse {
  tags: AnalyticsTagRow[]
}
```

**AnalyticsSource** = `'events' | 'tag'`

**AnalyticsEventType** = `string`

**AnalyticsGranularity** = `'hour' | 'day' | 'week' | 'month'`

**AnalyticsMetric** = `'count' | 'uniqueSessions' | 'uniqueVisitors'`

**AnalyticsSortOrder** = `'asc' | 'desc'`

**AnalyticsDeviceType** = `'mobile' | 'tablet' | 'desktop' | 'unknown'`

**AnalyticsStorageMode** = `'local' | 'session' | false`

**AnalyticsSessionId** = `number`

**EventAnalyticsDimension** = ``

**TagAnalyticsDimension** = ``

**AnalyticsQrCodesResponse** = `AnalyticsQrCodeRow[]`

### appConfiguration

**AppConfigurationResponse** (interface)
```typescript
interface AppConfigurationResponse {
  id: string
  name: string
  settings?: Record<string, any>
}
```

**GetWidgetInstanceOptions** (interface)
```typescript
interface GetWidgetInstanceOptions {
  appId: string
  collectionId?: string
  productId?: string
  variantId?: string
  batchId?: string
  admin?: boolean
  widgetId: string
}
```

**WidgetInstance<TWidget = any>** (interface)
```typescript
interface WidgetInstance<TWidget = any> {
  id: string
  name?: string
  widget?: TWidget
  [key: string]: any
}
```

**WidgetInstanceSummary** (interface)
```typescript
interface WidgetInstanceSummary {
  id: string
  name: string
  type?: string
  [key: string]: any
}
```

**AppEntry** (interface)
```typescript
interface AppEntry {
  id: string
  uniqueName: string
  customName?: string
  active: boolean
  all?: boolean
  live?: boolean
  faIcon?: string
  versionChannel?: 'stable' | 'beta' | 'dev'
  reason?: 'not_entitled'
  [key: string]: unknown
}
```

**MeterEntry** (interface)
```typescript
interface MeterEntry {
  included: number
  stripePriceId?: string
  stripeMeterId?: string
}
```

**AppliedOverridesSummary** (interface)
```typescript
interface AppliedOverridesSummary {
  features?: string[]
  meters?: string[]
  entitledAppGroups?: string[]
  addOnKeys?: string[]
  apps?: string[]
  accountType?: boolean
  note?: string
}
```

**SystemBlock** (interface)
```typescript
interface SystemBlock {
  basePlanId?: string
  productMode?: ProductMode | (string & {})
  addOnKeys?: string[]
  apps?: string[]
  features?: Record<string, boolean>
  meters?: Record<string, MeterEntry>
  entitledAppGroups?: string[]
  accountType?: 'enterprise' | 'standard'
  syncedAt?: string
  syncedFromSubscriptionId?: string
  appliedOverrides?: AppliedOverridesSummary
}
```

**AppConfigSettings** (interface)
```typescript
interface AppConfigSettings {
  id: 'appConfig'
  apps: AppEntry[]
  addOns?: string[]
  requestedBasePlanId?: string
  itemRecordMode?: 'registered' | 'owned' | null
  enabled?: Record<string, boolean>
  system?: SystemBlock
}
```

**ProductMode** = `'simple_redirect' | 'rich_redirect' | 'inform' | 'engage'`

### appManifest

**AppBundle** (interface)
```typescript
interface AppBundle {
  js: string | null;
  css: string | null;
  source?: string;
  styles?: string;
}
```

**AppManifestFiles** (interface)
```typescript
interface AppManifestFiles {
  js: {
  umd: string;
  esm?: string;
  };
  css?: string | null;
}
```

**AppWidgetComponent** (interface)
```typescript
interface AppWidgetComponent {
  name: string;
  description?: string;
  sizes?: Array<'compact' | 'standard' | 'large' | string>;
  props?: {
  required?: string[];
  optional?: string[];
  };
  settings?: Record<string, any>;
  styleSupport?: WidgetStyleSupport;
}
```

**WidgetStyleSupport** (interface)
```typescript
interface WidgetStyleSupport {
  accent?: boolean;
  text?: boolean;
  textAlign?: boolean;
  background?: 'transparent' | 'own';
}
```

**AppManifestWidgets** (interface)
```typescript
interface AppManifestWidgets {
  files: AppManifestFiles;
  components: AppWidgetComponent[];
  instanceResolution?: boolean;
  instanceParam?: string;
}
```

**AppContainerComponent** (interface)
```typescript
interface AppContainerComponent {
  name: string;
  description?: string;
  props?: {
  required?: string[];
  optional?: string[];
  };
}
```

**DeepLinkEntry** (interface)
```typescript
interface DeepLinkEntry {
  id?: string;
  title: string;
  path?: string;
  params?: Record<string, string>;
  accepts?: PublicViewParams;
  widget?: true;
}
```

**ExecutorContext** (interface)
```typescript
interface ExecutorContext {
  collectionId: string;
  appId: string;
  SL: any;
}
```

**SEOInput** (interface)
```typescript
interface SEOInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  SL: any;
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
}
```

**SEOResult** (interface)
```typescript
interface SEOResult {
  title?: string;
  description?: string;
  ogImage?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  contentSummary?: string;
  topics?: string[];
}
```

**LLMContentSection** (interface)
```typescript
interface LLMContentSection {
  heading: string;
  content: string;
  order?: number;
}
```

**LLMContentInput** (interface)
```typescript
interface LLMContentInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  SL: any;
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
  pageSlug?: string;
}
```

**LLMContentResult** (interface)
```typescript
interface LLMContentResult {
  sections: LLMContentSection[];
}
```

**AppManifestExecutor** (interface)
```typescript
interface AppManifestExecutor {
  files: AppManifestFiles;
  factory?: string;
  exports?: string[];
  description?: string;
  llmContent?: {
  function: string;
  timeout?: number;
  responseShape?: Record<string, any>;
  };
}
```

**AppFunctionTrigger** (interface)
```typescript
interface AppFunctionTrigger {
  type: AppFunctionTriggerType;
  eventTypes?: string[];
  schedule?: string;
  timezone?: string;
  route?: string;
  methods?: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>;
}
```

**AppFunctionDef** (interface)
```typescript
interface AppFunctionDef {
  name: string;
  description?: string;
  trigger: AppFunctionTrigger;
  visibility?: AppFunctionVisibility;
  authority?: AppFunctionAuthority;
  elevated?: boolean;
  userGroups?: string[];
  capabilities?: string[];
  dataScope?: 'collection' | 'global';
  inputs?: AppFunctionInputs;
  apiVersion?: string;
  handler?: string;
  agent?: AppFunctionAgentExposure;
}
```

**AppFunctionAgentExposure** (interface)
```typescript
interface AppFunctionAgentExposure {
  tool: boolean;
  title?: string;
  description?: string;
  input?: Record<string, any>;
  approval?: 'auto' | 'require';
  audience?: Array<'app' | 'public' | 'assistant'>;
}
```

**AppManifestFunctions** (interface)
```typescript
interface AppManifestFunctions {
  files: AppManifestFiles;
  definitions: AppFunctionDef[];
}
```

**AppDataOpts** (interface)
```typescript
interface AppDataOpts {
  scope?: 'collection' | 'global';
  productId?: string;
  variantId?: string;
  batchId?: string;
  dataId?: string;
  queries?: Record<string, any>;
}
```

**AppDataHandle** (interface)
```typescript
interface AppDataHandle {
  get(opts?: AppDataOpts): Promise<any>;
  set(data: any, opts?: AppDataOpts): Promise<any>;
  getData(opts?: AppDataOpts): Promise<any>;
  setData(data: any, opts?: AppDataOpts): Promise<any>;
  delete(opts?: AppDataOpts): Promise<any>;
}
```

**AppRecordClaimResult<T = any>** (interface)
```typescript
interface AppRecordClaimResult<T = any> {
  record: T;
  created: boolean;
  conflict?: 'singleton' | 'customId';
}
```

**ServerFunctionCounters** (interface)
```typescript
interface ServerFunctionCounters {
  next(name: string, opts?: { start?: number; by?: number }): Promise<number>;
  get(name: string): Promise<number | null>;
}
```

**ResolvedTag** (interface)
```typescript
interface ResolvedTag {
  id: string;
  claimSetId: string;
  code: string;
}
```

**ContactUpsertDetails** (interface)
```typescript
interface ContactUpsertDetails {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  company?: string;
  locale?: string;
  timezone?: string;
  customFields?: Record<string, string | number | boolean>;
}
```

**ServerFunctionInteractionEvent** (interface)
```typescript
interface ServerFunctionInteractionEvent {
  interactionId: string;
  contactId?: string | null;
  outcome?: string;
  metadata?: Record<string, any>;
  productId?: string;
  proofId?: string;
  variantId?: string;
  batchId?: string;
  eventType?: string;
}
```

**ServerFunctionBookings** (interface)
```typescript
interface ServerFunctionBookings {
  create(input: CreateBookingInput): Promise<Booking & { replayed: boolean }>;
  get(bookingId: string): Promise<Booking | null>;
  query(params?: BookingListQueryParams): Promise<PaginatedResponse<Booking>>;
  mine(params?: BookingListQueryParams): Promise<PaginatedResponse<Booking>>;
  update(bookingId: string, fields: UpdateBookingInput): Promise<Booking>;
  confirm(bookingId: string): Promise<Booking>;
  cancel(bookingId: string, opts?: { reason?: string }): Promise<Booking>;
  move(bookingId: string, input: MoveBookingInput): Promise<Booking>;
  extendHold(bookingId: string, holdMinutes: number): Promise<Booking>;
  complete(bookingId: string): Promise<Booking>;
  noShow(bookingId: string): Promise<Booking>;
  freebusy(q: FreeBusyQuery): Promise<FreeBusyResponse>;
  message(input: MessageBookersInput): Promise<MessageBookersResult>;
  slots: {
  create(input: CreateSlotInput): Promise<BookingSlot>;
  createMany(inputs: CreateSlotInput[], opts?: { seriesId?: string }): Promise<BookingSlot[]>;
  get(slotId: string): Promise<BookingSlot | null>;
  query(params?: SlotListQueryParams): Promise<PaginatedResponse<BookingSlot>>;
  update(slotId: string, fields: UpdateSlotInput): Promise<BookingSlot>;
  delete(slotId: string): Promise<{ success: boolean }>;
  };
  blocks: {
  create(input: CreateBlockInput): Promise<BookingAllocation>;
  query(params?: BlockListQueryParams): Promise<PaginatedResponse<BookingAllocation>>;
  delete(blockId: string): Promise<{ success: boolean }>;
  };
}
```

**AppHistoryEvent** (interface)
```typescript
interface AppHistoryEvent {
  id: string;
  at: string;
  type: string;
  entityId: string | null;
  data: Record<string, any>;
  actorType: 'user' | 'contact' | null;
  actorId: string | null;
}
```

**AppHistoryQuery** (interface)
```typescript
interface AppHistoryQuery {
  types?: string | string[];
  entityId?: string;
  data?: Record<string, string | number | boolean | Array<string | number | boolean>>;
  from?: string;
  to?: string;
  limit?: number;
}
```

**ServerFunctionMessage** (interface)
```typescript
interface ServerFunctionMessage {
  contactId?: string;
  to?: 'caller';
  templateId?: string;
  message?: TypedMessage;
  channel?: 'preferred' | 'email' | 'sms' | 'whatsapp' | 'push' | 'wallet';
  props?: Record<string, unknown>;
  include?: Record<string, unknown>;
  about?: MessageAbout;
  ref?: string;
  attach?: EmailAttachmentSpec[];
}
```

**ServerFunctionSl** (interface)
```typescript
interface ServerFunctionSl {
  workOrders: WorkOrdersApi;
  stock: StockApi;
  boms: BomsApi;
  madeFrom: MadeFromApi;
  operations: OperationsApi;
  bookings: ServerFunctionBookings;
  appRecords: {
  claim(fields: Record<string, any>): Promise<AppRecordClaimResult>;
  adjust(recordId: string, by: Record<string, number>, opts?: { atLeast?: Record<string, number>; atMost?: Record<string, number> }): Promise<any>;
  aggregate(params?: import('./appObjects').AggregateRequest): Promise<import('./appObjects').AggregateResponse & Record<string, unknown>>;
  all(recordType: string): Promise<any[]>;
  [method: string]: any;
  };
  appOptions: {
  get(source: string, opts?: { q?: string; version?: string }): Promise<import('./appOptions').AppOptionsResponse>;
  };
  userGroups: {
  members(keys?: string[]): Promise<Array<{ userId: string; name: string | null; email: string | null; userGroups: string[] }>>;
  };
  transaction(ops: RecordTransactionOp[], opts?: { idempotencyKey?: string }): Promise<{ results: any[]; replayed: boolean }>;
  history: {
  log(type: string, data?: Record<string, any>, opts?: { entityId?: string }): Promise<{ id: string }>;
  query(params?: AppHistoryQuery): Promise<AppHistoryEvent[]>;
  };
  counters: ServerFunctionCounters;
  tags: { resolve(id: string): Promise<ResolvedTag | null> };
  contacts: {
  upsert(details: ContactUpsertDetails): Promise<{ contactId: string; created: boolean }>;
  forCaller(): Promise<CallerContact | null>;
  };
  interactions: { record(event: ServerFunctionInteractionEvent): Promise<{ eventId: string }> };
  messages: { send(input: ServerFunctionMessage): Promise<ServerFunctionMessageResult> };
  subscriptions: {
  plans(): Promise<Array<import('./subscriptions').Plan & { prices: import('./subscriptions').PlanPrice[] }>>;
  list(params?: import('./subscriptions').SubscriptionListParams): Promise<import('./subscriptions').SubscriptionPage<import('./subscriptions').Membership>>;
  get(subscriptionId: string): Promise<import('./subscriptions').Membership | null>;
  mine(): Promise<import('./subscriptions').Membership[]>;
  memberOf(who?: { contactId?: string; userId?: string }): Promise<import('./subscriptions').MembershipStatus>;
  grant(input: import('./subscriptions').SubscriptionGrantInput): Promise<import('./subscriptions').Membership>;
  end(subscriptionId: string, opts?: { reason?: string }): Promise<import('./subscriptions').Membership>;
  cancel(subscriptionId: string, opts?: { atPeriodEnd?: boolean }): Promise<import('./subscriptions').Membership>;
  reapply(who: { contactId?: string; userId?: string }): Promise<{ level?: string | null; groups: string[] }>;
  };
  tools: { run<T = any>(name: string, args?: Record<string, any>): Promise<T> };
  assets: ServerFunctionAssets;
  ai: ServerFunctionAi;
  products: any;
  attestations: any;
  appData: AppDataHandle & { global: AppDataHandle; collection: AppDataHandle };
  app(appId: string): { data: Pick<AppDataHandle, 'get' | 'getData'> };
}
```

**ServerFunctionAsset** (interface)
```typescript
interface ServerFunctionAsset {
  id: string;
  appId: string | null;
  productId: string | null;
  proofId: string | null;
  name: string;
  assetType: string;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  hash: string | null;
  url: string;
  assetUrl: string | null;
  thumbnail: string | null;
  labels: string[];
  metadata: Record<string, any>;
  versions: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
```

**ServerFunctionAssets** (interface)
```typescript
interface ServerFunctionAssets {
  get(assetId: string): Promise<ServerFunctionAsset | null>;
  list(params?: { productId?: string | null; proofId?: string | null; appId?: string | null; labels?: string | string[]; assetType?: string; limit?: number; offset?: number }): Promise<ServerFunctionAsset[]>;
  read(assetId: string, opts?: { as?: 'base64' }): Promise<{ id: string; name: string; contentType: string; size: number; base64: string }>;
  read(assetId: string, opts: { as: 'text' }): Promise<{ id: string; name: string; contentType: string; size: number; text: string }>;
  create(input: ServerFunctionFileInput & { name: string; productId?: string; proofId?: string; labels?: string[]; metadata?: Record<string, any> }): Promise<ServerFunctionAsset>;
  replace(assetId: string, input: ServerFunctionFileInput & { name?: string }): Promise<ServerFunctionAsset>;
  update(assetId: string, patch: { name?: string; labels?: string[]; metadata?: Record<string, any> }): Promise<ServerFunctionAsset>;
  remove(assetId: string): Promise<{ id: string; deleted: true }>;
  startUpload(input: { name: string; contentType: string; productId?: string; proofId?: string; replaceAssetId?: string }): Promise<{ uploadId: string; sessionUrl: string; expiresAt: string }>;
  finishUpload(uploadId: string, input?: { name?: string; metadata?: Record<string, any> }): Promise<ServerFunctionAsset>;
}
```

**ServerFunctionAiRequest** (interface)
```typescript
interface ServerFunctionAiRequest {
  prompt?: string;
  system?: string;
  files?: Array<{ assetId: string } | { base64: string; contentType: string } | { text: string; name?: string }>;
  schema?: Record<string, any>;
  quality?: 'fast' | 'best';
}
```

**ServerFunctionAi** (interface)
```typescript
interface ServerFunctionAi {
  generate<T = any>(request: ServerFunctionAiRequest): Promise<{ text: string; data?: T; model: string; usage: { inputTokens: number; outputTokens: number } }>;
}
```

**ServerFunctionCaller** (interface)
```typescript
interface ServerFunctionCaller {
  userId: string | null;
  anonymous: boolean;
  origin?: string | null;
  ip?: string | null;
  via: AppFunctionTriggerType;
  userGroups: readonly string[];
}
```

**CallerContact** (interface)
```typescript
interface CallerContact {
  contactId: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  tags: string[];
  customFields: Record<string, unknown>;
}
```

**ServerFunctionContext** (interface)
```typescript
interface ServerFunctionContext {
  collectionId: string;
  appId: string;
  sl: ServerFunctionSl;
  secrets: {
  get(ref: string): Promise<string | null>;
  app(ref: string): Promise<string | null>;
  };
  caller: ServerFunctionCaller;
  fetch: typeof fetch;
  log: (message: string, data?: Record<string, any>) => void;
  inputs: Readonly<ServerFunctionInputs>;
}
```

**AppFunctionInputs** (interface)
```typescript
interface AppFunctionInputs {
  entity?: boolean;
  collection?: boolean;
  appConfig?: boolean;
  product?: { from: `body.${string}` | `query.${string}` | 'path' };
}
```

**ServerFunctionInputs** (interface)
```typescript
interface ServerFunctionInputs {
  entity?: Record<string, any> | null;
  collection?: Record<string, any> | null;
  appConfig?: Record<string, any> | null;
  product?: Record<string, any> | null;
}
```

**ServerFunctionHttpEvent<TBody = any>** (interface)
```typescript
interface ServerFunctionHttpEvent<TBody = any> {
  method: string;
  body: TBody;
  query: Record<string, any>;
  headers: Record<string, any>;
  rawBody?: string | Buffer | null;
  contentType?: string | null;
}
```

**AppAdminConfig** (interface)
```typescript
interface AppAdminConfig {
  $schema?: string;
  aiGuide?: string;
  setup?: {
  description?: string;
  questions?: Array<{
  id: string;
  prompt: string;
  type: string;
  default?: any;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  }>;
  configSchema?: Record<string, any>;
  saveWith?: {
  method: string;
  scope: 'collection' | 'product' | string;
  admin?: boolean;
  note?: string;
  };
  contentHints?: Record<string, {
  aiGenerate?: boolean;
  prompt?: string;
  }>;
  };
  import?: {
  description?: string;
  scope?: string;
  fields?: Array<{
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  description?: string;
  }>;
  csvExample?: string;
  saveWith?: {
  method: string;
  scope: string;
  admin?: boolean;
  note?: string;
  };
  };
  tunable?: {
  description?: string;
  fields?: Array<{
  name: string;
  description?: string;
  type: string;
  options?: string[];
  }>;
  };
  metrics?: {
  interactions?: Array<{ id: string; description?: string }>;
  kpis?: Array<{ name: string; compute?: string }>;
  };
}
```

**PublicViewParams** (interface)
```typescript
interface PublicViewParams {
  required?: string[];
  optional?: string[];
}
```

**PublicView** (interface)
```typescript
interface PublicView {
  id: string;
  title: string;
  route?: string;
  set?: Record<string, string>;
  params?: PublicViewParams;
}
```

**AdminView** (interface)
```typescript
interface AdminView {
  id: string;
  title: string;
  path: string;
  group?: 'main' | 'settings' | 'record';
  within?: string;
  icon?: string;
  description?: string;
  params?: Record<string, string>;
}
```

**AppManifest** (interface)
```typescript
interface AppManifest {
  $schema?: string;
  meta?: {
  name: string;
  description?: string;
  version: string;
  platformRevision?: string;
  appId: string;
  moduleFormat?: 'umd' | 'esm' | 'dual';
  sharedDependencies?: string;
  cssBaseline?: string;
  respectsHostTheme?: boolean;
  themeTokens?: string;
  globals?: Record<string, string>;
  seo?: {
  strategy?: 'executor' | string;
  priority?: number;
  contract?: {
  function: string;
  input?: string[];
  timeout?: number;
  responseShape?: Record<string, string>;
  };
  };
  };
  admin?: string;
  adminPage?: string;
  widgets?: AppManifestWidgets;
  containers?: {
  files: AppManifestFiles;
  components: AppContainerComponent[];
  };
  linkable?: DeepLinkEntry[];
  publicViews?: PublicView[];
  adminViews?: AdminView[];
  requires?: AppRequirement[];
  executor?: AppManifestExecutor;
  functions?: AppManifestFunctions;
  realtime?: {
  channels?: RealtimeChannelDeclaration[];
  staff?: string[];
  };
  adminCards?: AppManifestAdminCards;
  data?: AppDataDeclaration;
  headless?: AppHeadlessDeclaration;
  connector?: AppConnectorDeclaration;
  assistant?: AppAssistantDeclaration;
  docs?: AppDocsDeclaration;
  [key: string]: any;
}
```

**AppDocsPage** (interface)
```typescript
interface AppDocsPage {
  file: string;
  title: string;
  description?: string;
  audience?: AppDocsAudience;
}
```

**AppDocsDeclaration** (interface)
```typescript
interface AppDocsDeclaration {
  pages: AppDocsPage[];
  listed?: boolean;
}
```

**AppAssistantFile** (interface)
```typescript
interface AppAssistantFile {
  name: string;
  description?: string;
  file: string;
}
```

**AppAssistantDeclaration** (interface)
```typescript
interface AppAssistantDeclaration {
  skills?: AppAssistantFile[];
  knowledge?: AppAssistantFile[];
  preview?: string;
  purpose?: string;
  objects?: AssistantObject[];
  words?: Record<string, string>;
  recipes?: AssistantRecipe[];
}
```

**AssistantObject** (interface)
```typescript
interface AssistantObject {
  object: string;
  where?: Record<string, string | number | boolean>;
  means: string;
  fields?: Record<string, string>;
  write?: 'direct' | 'actions' | 'none';
}
```

**AssistantRecipe** (interface)
```typescript
interface AssistantRecipe {
  question: string;
  answer: string;
}
```

**ConnectorConnectionField** (interface)
```typescript
interface ConnectorConnectionField {
  name: string
  label: string
  description?: string
  secret?: string
  required?: boolean
  type?: 'text' | 'url' | 'select' | 'number' | 'boolean'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}
```

**ConnectorPreset** (interface)
```typescript
interface ConnectorPreset {
  id: string
  title: string
  description?: string
  direction: 'inbound' | 'outbound'
  entity: string
  flow?: Record<string, unknown>
}
```

**ConnectorPanel** (interface)
```typescript
interface ConnectorPanel {
  id: string
  title: string
  component: string
}
```

**ConnectorAction** (interface)
```typescript
interface ConnectorAction {
  name: string
  title?: string
  description?: string
  function: string
  visibility?: 'admin' | 'member' | 'public'
  input?: Record<string, unknown>
  output?: Record<string, unknown>
}
```

**AppConnectorDeclaration** (interface)
```typescript
interface AppConnectorDeclaration {
  provider: string
  title?: string
  directions: Array<'inbound' | 'outbound'>
  entities: string[]
  connection?: { fields: ConnectorConnectionField[] }
  settings?: Record<string, unknown>
  presets?: ConnectorPreset[]
  functions: {
  testConnection?: string
  describeTarget?: string
  sample?: string
  shape?: string
  serialize?: string
  send?: string
  fetch?: string
  describeEvents?: string
  lookup?: string
  }
  panels?: ConnectorPanel[]
  actions?: ConnectorAction[]
  aiGuide?: string
  recordId?: string
  limits?: { requestsPerSecond?: number; maxEvents?: number; maxAttributes?: number }
}
```

**ConnectorInstallation** (interface)
```typescript
interface ConnectorInstallation {
  collectionId: string
  appId: string
  flowId?: string | null
  connection: Record<string, unknown>
  settings: Record<string, unknown>
}
```

**ConnectorTestResult** (interface)
```typescript
interface ConnectorTestResult {
  ok: boolean
  message: string
}
```

**ConnectorTargetField** (interface)
```typescript
interface ConnectorTargetField {
  path: string
  label?: string
  type?: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array'
  required?: boolean
  description?: string
  enum?: string[]
}
```

**ConnectorTargetSchema** (interface)
```typescript
interface ConnectorTargetSchema {
  fields: ConnectorTargetField[]
}
```

**ConnectorRecords** (interface)
```typescript
interface ConnectorRecords {
  records: Array<Record<string, unknown>>
  nextCursor?: string | null
}
```

**ConnectorShapeInput** (interface)
```typescript
interface ConnectorShapeInput {
  installation: ConnectorInstallation
  records: Array<Record<string, unknown>>
}
```

**ConnectorShapeResult** (interface)
```typescript
interface ConnectorShapeResult {
  documents: Array<Record<string, unknown> | null>
  skipped?: Array<{ index: number; reason: string }>
}
```

**ConnectorSerializeInput** (interface)
```typescript
interface ConnectorSerializeInput {
  installation: ConnectorInstallation
  documents: Array<Record<string, unknown>>
  entities?: Array<{ id: string | null; name?: string | null; deleted?: boolean }>
  targetOptions?: Record<string, Record<string, unknown>>
  eventType?: string
}
```

**ConnectorSerializeResult** (interface)
```typescript
interface ConnectorSerializeResult {
  payloads: Array<unknown | null>
  skipped?: Array<{ index: number; reason: string }>
}
```

**ConnectorSendInput** (interface)
```typescript
interface ConnectorSendInput {
  installation: ConnectorInstallation
  payloads: unknown[]
}
```

**ConnectorSendResult** (interface)
```typescript
interface ConnectorSendResult {
  results: Array<{
  index: number
  ok: boolean
  status?: number
  error?: string
  externalId?: string
  retryable?: boolean
  retryAfterSeconds?: number
  }>
}
```

**ConnectorFetchInput** (interface)
```typescript
interface ConnectorFetchInput {
  installation: ConnectorInstallation
  cursor?: string | null
  limit?: number
}
```

**CollectionAppWidget** (interface)
```typescript
interface CollectionAppWidget {
  appId: string;
  manifest: AppManifest;
  widget: AppBundle;
  container: AppBundle | null;
  admin: string | null;
}
```

**GetCollectionWidgetsOptions** (interface)
```typescript
interface GetCollectionWidgetsOptions {
  force?: boolean;
}
```

**AppFunctionTriggerType** = `'http' | 'event' | 'cron'`

**AppFunctionVisibility** = `'admin' | 'public'`

**AppFunctionAuthority** = `'caller' | 'collection'`

**RecordTransactionOp** = ``

**ServerFunctionMessageResult** = ``

**ServerFunctionFileInput** (type)
```typescript
type ServerFunctionFileInput = { base64: string; contentType: string }
```

**AppDocsAudience** = `'team' | 'admin' | 'customer' | 'developer'`

**CollectionWidgetsResponse** = `import('./list').ListResult<CollectionAppWidget>`

**AppNeed** = `'signIn' | 'crm' | 'products' | 'claimableItems'`

**AppRequirement** = `AppNeed | { need: AppNeed`

### appObjects

**PaginatedResponse<T>** (interface)
```typescript
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  }
}
```

**AggregateRequest** (interface)
```typescript
interface AggregateRequest {
  filters?: {
  status?: string
  category?: string // cases only
  record_type?: string // records only
  product_id?: string
  created_at?: { gte?: string; lte?: string }
  closed_at?: '__notnull__' | { gte?: string; lte?: string } // cases only
  expires_at?: { lte?: string } // records only
  updated_at?: { gte?: string; lte?: string } // records only
  data?: Record<string, string | number | boolean | Array<string | number | boolean>>
  dataRange?: Record<string, { gte?: number; gt?: number; lte?: number; lt?: number }>
  }
  groupBy?: string[]
  metrics?: string[]
  timeSeriesField?: string // e.g. 'created_at'
  timeSeriesInterval?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
}
```

**AggregateResponse** (interface)
```typescript
interface AggregateResponse {
  groups?: ({ count?: number } & Record<string, unknown>)[]
  timeSeries?: ({ bucket: string; count: number } & Record<string, unknown>)[]
  count?: number
  avg_close_time_seconds?: number
  p50_close_time_seconds?: number
  p95_close_time_seconds?: number
  total_replies?: number
  avg_replies?: number
}
```

**AppCase** (interface)
```typescript
interface AppCase {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  ref: string | null
  status: string // 'open' | 'resolved' | 'closed' | custom
  priority: number | null
  category: string | null
  assignedTo: string | null // admin zone / admin callers only
  productId: string | null
  proofId: string | null
  contactId: string | null
  createdAt: string // ISO 8601
  updatedAt: string
  closedAt: string | null
  deletedAt: string | null // admin callers only
  data: Record<string, unknown> // visible to all roles
  owner: Record<string, unknown> // visible to owner + admin
  admin: Record<string, unknown> // visible to admin only
}
```

**CreateCaseInput** (interface)
```typescript
interface CreateCaseInput {
  visibility?: Visibility // default 'owner'
  ref?: string
  status?: string // default 'open'
  priority?: number
  category?: string
  assignedTo?: string // admin only
  productId?: string
  proofId?: string
  contactId?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
}
```

**UpdateCaseInput** (interface)
```typescript
interface UpdateCaseInput {
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  status?: string
  priority?: number
  category?: string
  assignedTo?: string
  ref?: string
}
```

**AppendHistoryInput** (interface)
```typescript
interface AppendHistoryInput {
  entry?: Record<string, unknown> // free-form entry object; 'at' is auto-set
  historyTarget?: 'owner' | 'admin' // which zone receives the entry (default 'admin')
  status?: string // optionally update status atomically
  priority?: number
  assignedTo?: string
}
```

**CaseSummaryRequest** (interface)
```typescript
interface CaseSummaryRequest {
  period?: { from: string; to: string } // ISO 8601 date range
}
```

**CaseSummaryResponse** (interface)
```typescript
interface CaseSummaryResponse {
  total: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  trend: { week: string; count: number }[]
}
```

**ReplyEntry** (interface)
```typescript
interface ReplyEntry {
  at: string // ISO 8601, auto-set
  authorId?: string
  authorType?: string
  [key: string]: unknown
}
```

**AppThread** (interface)
```typescript
interface AppThread {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  slug: string | null
  title: string | null
  status: string // 'open' | 'closed' | custom
  authorId: string | null
  authorType: string // default 'user'
  productId: string | null
  proofId: string | null
  contactId: string | null
  parentType: string | null
  parentId: string | null
  replyCount: number
  lastReplyAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null // admin only
  body: Record<string, unknown>
  replies: ReplyEntry[]
  tags: string[]
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
}
```

**CreateThreadInput** (interface)
```typescript
interface CreateThreadInput {
  visibility?: Visibility // default 'owner'
  slug?: string
  title?: string
  status?: string // default 'open'
  authorId?: string
  authorType?: string
  productId?: string
  proofId?: string
  contactId?: string
  parentType?: string
  parentId?: string
  body?: Record<string, unknown>
  tags?: string[]
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
  firstReply?: ReplyInput
}
```

**UpdateThreadInput** (interface)
```typescript
interface UpdateThreadInput {
  body?: Record<string, unknown>
  tags?: string[]
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  title?: string
  slug?: string
  status?: string
  visibility?: Visibility
}
```

**ReplyInput** (interface)
```typescript
interface ReplyInput {
  authorId?: string
  authorType?: string
  [key: string]: unknown // any extra fields stored on the reply object
}
```

**FacetRuleClause** (interface)
```typescript
interface FacetRuleClause {
  facetKey: string
  anyOf: string[]
}
```

**FacetRule** (interface)
```typescript
interface FacetRule {
  all: FacetRuleClause[]
}
```

**RecordTarget** (interface)
```typescript
interface RecordTarget {
  productId?: string
  variantId?: string
  proofId?: string
  batchId?: string
  facets?: Record<string, string[]>
}
```

**BulkUpsertItem** (interface)
```typescript
interface BulkUpsertItem {
  ref: string
  recordType?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  facetRule?: FacetRule | null
}
```

**BulkUpsertResult** (interface)
```typescript
interface BulkUpsertResult {
  saved: number
  failed: number
  results: Array<
  | { index: number; status: 'created'; id: string; ref: string; created: true }
  | { index: number; status: 'updated'; id: string; ref: string; created: false }
  | { index: number; status: 'error'; error: string }
  >
}
```

**BulkDeleteResult** (interface)
```typescript
interface BulkDeleteResult {
  deleted: number
}
```

**UpsertRecordInput** (interface)
```typescript
interface UpsertRecordInput {
  ref: string
  recordType?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  facetRule?: FacetRule | null
}
```

**MatchRecordsInput** (interface)
```typescript
interface MatchRecordsInput {
  target: RecordTarget
  strategy?: 'all' | 'best'
  recordType?: string
  limit?: number
  cursor?: string
  includeScheduled?: boolean
  includeExpired?: boolean
  at?: string
}
```

**AppRecord** (interface)
```typescript
interface AppRecord {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  recordType: string | null
  ref: string | null
  scopeType: string | null
  scopeId: string | null
  customId: string | null
  customIdNormalized: string | null
  sourceSystem: string | null
  status: string | null
  productId: string | null
  variantId: string | null
  batchId: string | null
  proofId: string | null
  contactId: string | null
  authorId: string | null
  authorType: string
  parentType: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
  startsAt: string | null
  expiresAt: string | null
  deletedAt: string | null // admin only
  specificity: number
  facetRule: FacetRule | null
  singletonKey: string | null
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
  metadata: Record<string, unknown> | null
}
```

**CreateRecordInput** (interface)
```typescript
interface CreateRecordInput {
  recordType?: string
  visibility?: Visibility
  ref?: string
  status?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  contactId?: string
  authorId?: string
  authorType?: string
  parentType?: string
  parentId?: string
  startsAt?: string | null
  expiresAt?: string | null
  scopeType?: string | null
  scopeId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  singletonPer?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  metadata?: Record<string, unknown>
  facetRule?: FacetRule | null
}
```

**UpdateRecordInput** (interface)
```typescript
interface UpdateRecordInput {
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  status?: string
  visibility?: Visibility
  ref?: string
  recordType?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  scopeType?: string | null
  scopeId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  metadata?: Record<string, unknown>
  facetRule?: FacetRule | null
}
```

**ResolveAllParams** (interface)
```typescript
interface ResolveAllParams {
  context: {
  productId?: string
  variantId?: string
  batchId?: string
  proofId?: string
  facets?: Record<string, string | string[]>
  }
  recordType?: string
  tiers?: Array<'proof' | 'batch' | 'variant' | 'product' | 'rule' | 'facet' | 'collection'>
  limit?: number
  cursor?: string
  at?: string
  includeScheduled?: boolean
  includeExpired?: boolean
}
```

**ResolveAllEntry** (interface)
```typescript
interface ResolveAllEntry {
  record: AppRecord
  matchedAt: MatchedAt
  specificity: number
  matchedRule?: FacetRule
  matchedClauseCount?: number
}
```

**ResolveAllContext** (interface)
```typescript
interface ResolveAllContext {
  productId?: string
  variantId?: string
  batchId?: string
  proofId?: string
  facets?: Record<string, string[]>
}
```

**PreviewRuleParams** (interface)
```typescript
interface PreviewRuleParams {
  facetRule: FacetRule
  recordType?: string
  limit?: number
}
```

**PreviewRuleResult** (interface)
```typescript
interface PreviewRuleResult {
  matchingProducts: Array<{ productId: string; name?: string; facets: Record<string, string[]> }>
  total: number
  rule: FacetRule
}
```

**RelatedResponse** (interface)
```typescript
interface RelatedResponse {
  threads: AppThread[]
  records: AppRecord[]
}
```

**PublicCreatePolicy** (interface)
```typescript
interface PublicCreatePolicy {
  cases?:   PublicCreateObjectRule
  threads?: PublicCreateObjectRule
  records?: PublicCreateObjectRule
}
```

**PublicCreateObjectRule** (interface)
```typescript
interface PublicCreateObjectRule {
  anonymous?:     PublicCreateBranch
  authenticated?: PublicCreateBranch
}
```

**PublicCreateBranch** (interface)
```typescript
interface PublicCreateBranch {
  allow: boolean
  enforce?: {
  visibility?: 'public' | 'owner' | 'admin'
  status?:     string
  }
  edit?: {
  editToken: boolean
  windowMinutes?: number
  }
}
```

**Visibility** = `'public' | 'owner' | 'admin'`

**CallerRole** = `'admin' | 'owner' | 'public'`

**BulkDeleteInput** = ``

**MatchedAt** = ``

### appOptions

**AppOption** (interface)
```typescript
interface AppOption {
  id: string;
  label: string;
  sublabel?: string;
  active: boolean;
  order: number | null;
}
```

**AppOptionValueInput** (interface)
```typescript
interface AppOptionValueInput {
  code: string;
  label?: string;
  active?: boolean;
}
```

**AppOptionsResponse** = ``

**AppOptionsList** = ``

### asset

**AssetRef** (interface)
```typescript
interface AssetRef {
  id: string
  url: string
  thumbnail: string | null
}
```

**AssetVersion** (interface)
```typescript
interface AssetVersion {
  url: string
  mimeType: string | null
  fileType: string | null
  size: number | null
  hash: string | null
  thumbnail: string | null
  replacedAt: string
  replacedBy: string | null
}
```

**Asset** (interface)
```typescript
interface Asset {
  id: string
  collectionId: string
  site: string
  productId: string | null
  proofId: string | null
  appId: string | null
  url: string
  assetUrl: string | null
  thumbnail: string | null
  name: string
  cleanName: string | null
  assetType: 'Image' | 'Video' | 'Audio' | 'Document'
  fileType: string | null
  type: string | null
  mimeType: string | null
  contentType: string | null
  size: number | null
  width: number | null
  height: number | null
  hash: string | null
  labels: string[]
  metadata: Record<string, any>
  versions: AssetVersion[]
  uploadedBy: string | null
  uploaderContactId: string | null
  uploadTokenId: string | null
  uploaderIp: string | null
  retention?: 'permanent' | 'temporary'
  expiresAt?: string | null
  origin?: 'upload' | 'fetched' | 'derived' | 'generated'
  sourceKey?: string | null
  derivedFromId?: string | null
  variant?: string | null
  status: 'active' | 'pending_review' | 'deleted'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
```

**UploadAssetOptions** (interface)
```typescript
interface UploadAssetOptions {
  file: File
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  name?: string
  metadata?: Record<string, any>
  onProgress?: (percent: number) => void
  appId?: string
  admin?: boolean
  signal?: AbortSignal
}
```

**UploadFromUrlOptions** (interface)
```typescript
interface UploadFromUrlOptions {
  url: string
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  folder?: 'images' | 'videos' | 'documents'
  metadata?: Record<string, any>
  appId?: string
  admin?: boolean
}
```

**GetAssetOptions** (interface)
```typescript
interface GetAssetOptions {
  assetId: string
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
}
```

**RemoveAssetOptions** (interface)
```typescript
interface RemoveAssetOptions {
  assetId: string
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
}
```

**UpdateAssetOptions** (interface)
```typescript
interface UpdateAssetOptions {
  collectionId: string
  assetId: string
  name?: string
  appId?: string
  labels?: string[]
  metadata?: Record<string, any>
  thumbnail?: string
}
```

**ReplaceAssetFileOptions** (interface)
```typescript
interface ReplaceAssetFileOptions {
  collectionId: string
  assetId: string
  file: File
  onProgress?: (percent: number) => void
}
```

**DeleteAssetOptions** (interface)
```typescript
interface DeleteAssetOptions {
  collectionId: string
  assetId: string
  graceDays?: number
}
```

**BulkDeleteAssetsOptions** (interface)
```typescript
interface BulkDeleteAssetsOptions {
  collectionId: string
  assetIds: string[]
  graceDays?: number
}
```

**UploadPolicyConfig** (interface)
```typescript
interface UploadPolicyConfig {
  enabled: boolean
  requireLevel?: 'anonymous' | 'contact' | 'owner'
  allowedMimeTypes?: string[]
  maxFileSizeBytes?: number
  reviewRequired?: boolean
  tokenTtlSeconds?: number
  maxUsesPerToken?: number
}
```

**RequestUploadTokenOptions** (interface)
```typescript
interface RequestUploadTokenOptions {
  collectionId: string
  appId: string
  contactId?: string
  productId?: string
  proofId?: string
}
```

**UploadTokenPolicy** (interface)
```typescript
interface UploadTokenPolicy {
  requireLevel: 'anonymous' | 'contact' | 'owner'
  allowedMimeTypes: string[]
  maxFileSizeBytes: number
  reviewRequired: boolean
  productId: string | null
  proofId: string | null
}
```

**UploadTokenResponse** (interface)
```typescript
interface UploadTokenResponse {
  tokenId: string
  expiresAt: string
  policy: UploadTokenPolicy
}
```

**PublicTokenUploadOptions** (interface)
```typescript
interface PublicTokenUploadOptions {
  collectionId: string
  tokenId: string
  file: File
  name?: string
  metadata?: Record<string, any>
  onProgress?: (percent: number) => void
}
```

**CreateResumableUploadOptions** (interface)
```typescript
interface CreateResumableUploadOptions {
  file: File
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  name?: string
  metadata?: Record<string, any>
  appId?: string
  admin?: boolean
  token?: string
  replaceAssetId?: string
}
```

**ResumableStartOptions** (interface)
```typescript
interface ResumableStartOptions {
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}
```

**ResumableUploadHandle** (interface)
```typescript
interface ResumableUploadHandle {
  readonly id: string
  readonly size: number
  start(options?: ResumableStartOptions): Promise<Asset>
  pause(): void
  resume(options?: ResumableStartOptions): Promise<Asset>
}
```

**AssetResponse** = `Asset`

### attestation

**AttestationResponse** (interface)
```typescript
interface AttestationResponse {
  id: string
  createdAt: string
  updatedAt: string
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationCreateRequest** (interface)
```typescript
interface AttestationCreateRequest {
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationUpdateRequest** (interface)
```typescript
interface AttestationUpdateRequest {
  type?: string
  data?: Record<string, any>
}
```

### attestations

**Attestation** (interface)
```typescript
interface Attestation {
  id: string
  orgId: string
  collectionId: string
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
  recordedAt: string
  visibility: AttestationVisibility
  value?: Record<string, any>
  ownerData?: Record<string, any>
  adminData?: Record<string, any>
  unit?: string
  source?: string
  authorId?: string
  grantId?: string | null
  moderationStatus?: AttestationModerationStatus
  metadata?: Record<string, any>
  contentHash: string
  prevHash?: string
  createdAt: string
}
```

**LatestAttestation** (interface)
```typescript
interface LatestAttestation {
  attestationType: string
  latest: Attestation
}
```

**AttestationSummaryBucket** (interface)
```typescript
interface AttestationSummaryBucket {
  period: string
  count: number
  values?: Record<string, any>
}
```

**ChainVerifyResult** (interface)
```typescript
interface ChainVerifyResult {
  valid: boolean
  checkedCount: number
  failedAt?: string
  message: string
}
```

**CreateAttestationInput** (interface)
```typescript
interface CreateAttestationInput {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
  recordedAt?: string
  visibility?: AttestationVisibility
  value?: Record<string, any>
  ownerData?: Record<string, any>
  adminData?: Record<string, any>
  unit?: string
  source?: string
  authorId?: string
  metadata?: Record<string, any>
}
```

**OwnerAttestationInput** (interface)
```typescript
interface OwnerAttestationInput {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
  recordedAt?: string
  visibility?: 'public' | 'owner'
  value?: Record<string, any>
  ownerData?: Record<string, any>
  unit?: string
  source?: string
  metadata?: Record<string, any>
  guestName?: string
}
```

**ModerateAttestationInput** (interface)
```typescript
interface ModerateAttestationInput {
  decision: 'approve' | 'reject'
}
```

**ModerateAttestationResponse** (interface)
```typescript
interface ModerateAttestationResponse {
  attestation: Attestation
}
```

**CreateOwnerAttestationResponse** (interface)
```typescript
interface CreateOwnerAttestationResponse {
  attestation: Attestation
}
```

**AttestationSummaryResponse** (interface)
```typescript
interface AttestationSummaryResponse {
  summary: AttestationSummaryBucket[]
}
```

**PublicAttestationSummaryResponse** (interface)
```typescript
interface PublicAttestationSummaryResponse {
  summary: AttestationSummaryBucket[]
  audience: 'public'
}
```

**AttestationLatestResponse** (interface)
```typescript
interface AttestationLatestResponse {
  latest: LatestAttestation[]
}
```

**PublicAttestationLatestResponse** (interface)
```typescript
interface PublicAttestationLatestResponse {
  latest: LatestAttestation[]
  audience: AttestationAudience
}
```

**AttestationTreeSummaryResponse** (interface)
```typescript
interface AttestationTreeSummaryResponse {
  summary: AttestationSummaryBucket[]
  subjectCount: number
}
```

**PublicAttestationTreeSummaryResponse** (interface)
```typescript
interface PublicAttestationTreeSummaryResponse {
  summary: AttestationSummaryBucket[]
  audience: 'public'
  subjectCount: number
}
```

**AttestationTreeLatestResponse** (interface)
```typescript
interface AttestationTreeLatestResponse {
  latest: LatestAttestation[]
  subjectCount: number
}
```

**PublicAttestationTreeLatestResponse** (interface)
```typescript
interface PublicAttestationTreeLatestResponse {
  latest: LatestAttestation[]
  audience: 'public'
  subjectCount: number
}
```

**AttestationSummaryParams** (interface)
```typescript
interface AttestationSummaryParams {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
  valueField?: string
  groupBy?: AttestationGroupBy
  recordedAt?: DateRange
  limit?: number
}
```

**AttestationLatestParams** (interface)
```typescript
interface AttestationLatestParams {
  subjectType: AttestationSubjectType
  subjectId: string
}
```

**AttestationVerifyParams** (interface)
```typescript
interface AttestationVerifyParams {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
}
```

**AttestationTreeSummaryParams** (interface)
```typescript
interface AttestationTreeSummaryParams {
  subjectId: string
  attestationType: string
  valueField?: string
  groupBy?: AttestationGroupBy
  recordedAt?: DateRange
  limit?: number
  includeItems?: boolean
}
```

**AttestationTreeLatestParams** (interface)
```typescript
interface AttestationTreeLatestParams {
  subjectId: string
  includeItems?: boolean
}
```

**AttestationSubjectType** = ``

**AttestationVisibility** = `'public' | 'owner' | 'admin'`

**AttestationModerationStatus** = `'approved' | 'pending' | 'rejected'`

**AttestationAudience** = `'public' | 'owner' | 'admin'`

**AttestationGroupBy** = `'hour' | 'day' | 'week' | 'month'`

**ListAttestationsResponse** = `ListResult<Attestation>`

### auth

**UserAccountRegistrationRequest** (interface)
```typescript
interface UserAccountRegistrationRequest {
  name: string
  email?: string
  phone?: string
  password?: string
  sendAccountConfirmation?: boolean
  collectionId?: string,
  tokenType?: 'bearer' | 'firebase'
}
```

**AuthLocation** (interface)
```typescript
interface AuthLocation {
  latitude?: number
  longitude?: number
  area?: number
  country?: string
  [key: string]: any
}
```

**AuthLocationCacheOptions** (interface)
```typescript
interface AuthLocationCacheOptions {
  cache?: 'session' | false
  ttlMs?: number
  storageKey?: string
  forceRefresh?: boolean
}
```

**AccountFirebaseInfo** (interface)
```typescript
interface AccountFirebaseInfo {
  identities?: Record<string, string[]>
  sign_in_provider?: string
  [key: string]: any
}
```

**AccountClientInfo** (interface)
```typescript
interface AccountClientInfo {
  createdAt?: string
  createdVia?: string
  [key: string]: any
}
```

**AccountFeatureFlags** (interface)
```typescript
interface AccountFeatureFlags {
  actionLogger?: boolean
  apiKeys?: boolean
  analytics?: boolean
  webhooks?: boolean
  creating?: boolean
  helpDocs?: boolean
  certificateTemplates?: boolean
  contentLibrary?: boolean
  devScanner?: boolean
  appScanner?: boolean
  [key: string]: boolean | undefined
}
```

**AccountInfoResponse** (interface)
```typescript
interface AccountInfoResponse {
  id: string
  uid: string
  userId: string
  user_id?: string
  sub: string
  name: string
  email: string
  email_verified: boolean
  picture?: string | null
  iss: string
  aud?: string
  auth_time: number
  iat: number
  exp?: number
  firebase?: AccountFirebaseInfo
  accessType?: string
  clientType?: string
  analyticsCode?: string
  analyticsId?: string
  baseCollectionId?: string
  collectionGroup?: string
  contactId?: string
  features: AccountFeatureFlags
  adminCollections?: string[]
  clients?: Record<string, AccountClientInfo>
  sites?: Record<string, boolean>
  whitelabel?: Record<string, any>
  location?: AuthLocation | null
  prefs?: Record<string, any>
  [key: string]: any
}
```

### authKit

**AuthKitUser** (interface)
```typescript
interface AuthKitUser {
  uid: string
  email?: string
  displayName?: string | null
  photoURL?: string | null
  phoneNumber?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}
```

**UserProfile** (interface)
```typescript
interface UserProfile {
  uid: string
  email?: string
  displayName?: string | null
  phoneNumber?: string | null
  photoURL?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}
```

**ProfileUpdateData** (interface)
```typescript
interface ProfileUpdateData {
  displayName?: string
  photoURL?: string
  accountData?: Record<string, any>
}
```

**SuccessResponse** (interface)
```typescript
interface SuccessResponse {
  success: boolean
  message?: string
  token?: string // some flows may return a refreshed token
}
```

**AuthLoginResponse** (interface)
```typescript
interface AuthLoginResponse {
  token?: string
  user: AuthKitUser
  accountData?: Record<string, any>
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
  requiresEmailVerification?: boolean  // True if email verification is required but not yet completed
  emailVerificationDeadline?: number   // Unix timestamp - for 'immediate' mode grace period deadline
  accountLocked?: boolean              // True if account is locked due to expired verification deadline
  isNewUser?: boolean
  expiresAt?: number | null
  refreshToken?: string
  refreshTokenExpiresAt?: number
}
```

**RefreshResponse** (interface)
```typescript
interface RefreshResponse {
  token: string
  refreshToken: string
  refreshTokenExpiresAt: number
  expiresAt: number
  user: AuthKitUser
  accountData?: Record<string, any>
}
```

**LogoutResponse** (interface)
```typescript
interface LogoutResponse {
  success: true
}
```

**MicrosoftLoginOptions** (interface)
```typescript
interface MicrosoftLoginOptions {
  returnOrigin?: string
  trustedDeviceToken?: string
}
```

**AuthKitAccess** (interface)
```typescript
interface AuthKitAccess {
  mode: 'anyone' | 'organisation'
  domains?: string[]
  emails?: string[]
  microsoftTenants?: Record<string, string>
}
```

**AppleLoginOptions** (interface)
```typescript
interface AppleLoginOptions {
  authorizationCode?: string
  nonce?: string
  userInfo?: { email?: string; name?: string }
  trustedDeviceToken?: string
}
```

**MfaRequiredDetails** (interface)
```typescript
interface MfaRequiredDetails {
  mfaSessionToken: string
  availableFactors: MfaFactor[]
  preferredFactor: MfaFactor
  maskedDestinations: { email?: string; sms?: string; totp?: string }
}
```

**MfaChallengeSendResponse** (interface)
```typescript
interface MfaChallengeSendResponse {
  success: true
  factor: MfaFactor
  destination: string
  expiresAt: string
}
```

**MfaEnrollSendResponse** (interface)
```typescript
interface MfaEnrollSendResponse {
  mfaSessionToken: string
  destination: string
  expiresAt: string
}
```

**MfaTotpEnrollResponse** (interface)
```typescript
interface MfaTotpEnrollResponse {
  mfaSessionToken: string
  secret: string
  otpauthUri: string
  issuer: string
  account: string
  expiresAt: string
}
```

**MfaEnrolledResponse** (interface)
```typescript
interface MfaEnrolledResponse {
  enrolled: true
  factor: MfaFactor
}
```

**MfaFactorsResponse** (interface)
```typescript
interface MfaFactorsResponse {
  enrolledFactors: {
  email?: { enrolledAt: string; destination: string }
  sms?: { enrolledAt: string; destination: string }
  totp?: { enrolledAt: string; destination: string }
  }
  recoveryCodesRemaining: number
  mfaEnabledForClient: boolean
}
```

**TrustedDevice** (interface)
```typescript
interface TrustedDevice {
  id: string
  label: string | null
  createdAtMs: number
  lastUsedAtMs: number
  expiresAtMs: number
}
```

**MagicLinkSendResponse** (interface)
```typescript
interface MagicLinkSendResponse {
  success: boolean
  message: string
}
```

**PhoneSendCodeResponse** (interface)
```typescript
interface PhoneSendCodeResponse {
  verificationId: string
  message: string
}
```

**PhoneVerifyResponse** (interface)
```typescript
interface PhoneVerifyResponse {
  token: string
  user: AuthKitUser
}
```

**PasswordResetRequestResponse** (interface)
```typescript
interface PasswordResetRequestResponse {
  success: boolean
  message: string
}
```

**VerifyResetTokenResponse** (interface)
```typescript
interface VerifyResetTokenResponse {
  valid: boolean
  email?: string
  expiresAt?: number
  message?: string
}
```

**PasswordResetCompleteResponse** (interface)
```typescript
interface PasswordResetCompleteResponse {
  success: boolean
  message: string
  token?: string
  user?: AuthKitUser
  accountData?: Record<string, any> | null
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
  refreshToken?: string
  refreshTokenExpiresAt?: number
  expiresAt?: number
}
```

**EmailVerificationActionResponse** (interface)
```typescript
interface EmailVerificationActionResponse {
  success: boolean
  message: string
}
```

**EmailVerifyTokenResponse** (interface)
```typescript
interface EmailVerifyTokenResponse {
  success: boolean
  message: string
  token?: string
  user?: AuthKitUser
  accountData?: Record<string, any>
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
}
```

**WhatsAppReplyCta** (interface)
```typescript
interface WhatsAppReplyCta {
  body: string
  buttonLabel: string
  buttonUrl: string
  mediaUrl?: string  // optional image (JPEG/PNG, public https) — selects image card template
}
```

**WhatsAppReplyOptions** (interface)
```typescript
interface WhatsAppReplyOptions {
  contentSid?: string
  contentVariables?: Record<string, unknown>
  cta?: WhatsAppReplyCta
  text?: string
}
```

**WhatsAppContactData** (interface)
```typescript
interface WhatsAppContactData {
  name?: string
  firstName?: string
  lastName?: string
  displayName?: string
  email?: string
  source?: string
  customFields?: Record<string, unknown>
  externalIds?: Record<string, unknown>
}
```

**SendWhatsAppRequest** (interface)
```typescript
interface SendWhatsAppRequest {
  redirectUrl?: string
  prefillMessage?: string
  reply?: WhatsAppReplyOptions
  contactData?: WhatsAppContactData
}
```

**SendWhatsAppResponse** (interface)
```typescript
interface SendWhatsAppResponse {
  waLink: string
  code: string
  token: string
  sessionKey?: string
  expiresAt: string
}
```

**ExchangeWhatsAppSessionResponse** (interface)
```typescript
interface ExchangeWhatsAppSessionResponse {
  success: boolean
  token: string
  user: AuthKitUser
  accountData?: Record<string, any>
}
```

**VerifyWhatsAppResponse** (interface)
```typescript
interface VerifyWhatsAppResponse {
  success: boolean
  verified: boolean
  redirectUrl?: string | null
}
```

**WhatsAppStatusResponse** (interface)
```typescript
interface WhatsAppStatusResponse {
  ok: boolean
  status: VerifyStatus
  verified: boolean
  redirectUrl?: string | null
  phoneNumber?: string | null
  updatedAt?: unknown
}
```

**SendSmsVerifyRequest** (interface)
```typescript
interface SendSmsVerifyRequest {
  phoneNumber: string
  redirectUrl: string
  ctaText?: string
}
```

**SendSmsVerifyResponse** (interface)
```typescript
interface SendSmsVerifyResponse {
  success: boolean
  expiresAt: string
}
```

**VerifySmsResponse** (interface)
```typescript
interface VerifySmsResponse {
  verified: boolean
  redirectUrl?: string | null
  phoneNumber?: string | null
}
```

**UpsertContactRequest** (interface)
```typescript
interface UpsertContactRequest {
  collectionId?: string
  phone?: string
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  displayName?: string
  source?: string
  customFields?: Record<string, unknown>
  externalIds?: Record<string, unknown>
}
```

**UpsertContactResponse** (interface)
```typescript
interface UpsertContactResponse {
  ok: boolean
  collectionId: string
  contactId: string
  userId: string | null
  created: boolean
}
```

**AuthKitBrandingConfig** (interface)
```typescript
interface AuthKitBrandingConfig {
  logoUrl?: string | null
  title?: string
  subtitle?: string
  registerTitle?: string
  registerSubtitle?: string
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  buttonStyle?: 'rounded' | 'square' | 'pill' | string
  fontFamily?: string
  theme?: 'light' | 'dark' | 'auto'
  inheritHostStyles?: boolean
  minimal?: boolean
  customCss?: string
  termsUrl?: string
  privacyUrl?: string
  [key: string]: unknown
}
```

**AuthKitEmailTemplate** (interface)
```typescript
interface AuthKitEmailTemplate {
  subject?: string
  header?: string
  introText?: string
  buttonText?: string
  footerText?: string
}
```

**AuthKitMfaConfig** (interface)
```typescript
interface AuthKitMfaConfig {
  mode?: 'off' | 'optional' | 'risk-based' | 'always'
  factorsEnabled?: { email?: boolean; sms?: boolean; totp?: boolean; recoveryCodes?: boolean }
  minimumFactors?: number
  trustedDeviceDurationDays?: number
  enforceForAdmins?: boolean
}
```

**AuthKitConfig** (interface)
```typescript
interface AuthKitConfig {
  id: string
  name?: string
  branding?: AuthKitBrandingConfig
  enabledProviders?: AuthKitProvider[]
  providerOrder?: AuthKitProvider[]
  emailDisplayMode?: 'form' | 'button'
  signupProminence?: 'none' | 'minimal' | 'balanced' | 'emphasized'
  signupRedirectUrl?: string
  googleClientId?: string
  googleOAuthFlow?: 'oneTap' | 'popup' | 'redirect'
  whitelistedGoogleDomains?: string[]
  appleClientIds?: string[]
  linkedInClientId?: string
  whatsappPrefillMessage?: string
  whatsappReply?: { enabled?: boolean; text?: string; cta?: { body?: string; buttonLabel?: string; buttonUrl?: string; mediaUrl?: string } }
  registrationFields?: Array<{ key: string; showDuringRegistration?: boolean; placement?: 'inline' | 'after'; required?: boolean }>
  collectNameOnPasswordlessSignup?: boolean
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
  emailVerificationGracePeriod?: number
  lockUnverifiedAfterGrace?: boolean
  allowPasswordReset?: boolean
  mfa?: AuthKitMfaConfig
  afterSignInUrl?: string
  allowedRedirectDomains?: string[]
  texts?: Partial<Record<AuthKitTextKey, string>>
  textsLanguage?: string
  textsByLanguage?: Record<string, Partial<Record<AuthKitTextKey, string>>>
  emailTemplates?: Partial<Record<AuthKitEmailKind, AuthKitEmailTemplate>>
  emailBranding?: { logoUrl?: string; buttonColor?: string; footerHtml?: string }
  secrets?: Record<string, { ref: string; hint?: string | null; collectionId?: string; setAt?: string }>
  customCss?: string
  termsUrl?: string
  privacyUrl?: string
  supportEmail?: string
  redirectUrl?: string
  updatedAt?: string
  security?: AuthKitSecurityConfig
  collectionIds?: string[]
  identity?: AuthKitIdentity
  signUp?: 'open' | 'invite'
  access?: AuthKitAccess
  microsoftClientId?: string
}
```

**AuthKitInviteRequest** (interface)
```typescript
interface AuthKitInviteRequest {
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  customFields?: Record<string, unknown>
  redirectUrl?: string
}
```

**AuthKitInviteResponse** (interface)
```typescript
interface AuthKitInviteResponse {
  ok: true
  userId: string
  contactId: string
  created: boolean
  expiresAt: string
}
```

**AuthKitIdentity** (interface)
```typescript
interface AuthKitIdentity {
  mode: 'shared' | 'own'
  tenantId?: string
  createdAt?: string
}
```

**AuthKitSetIdentityResponse** (interface)
```typescript
interface AuthKitSetIdentityResponse {
  identity: AuthKitIdentity
  message: string
}
```

**AuthKitSchema** (interface)
```typescript
interface AuthKitSchema {
  providers: AuthKitProvider[]
  emailKinds: AuthKitEmailKind[]
  emailFields: Array<keyof AuthKitEmailTemplate>
  textKeys: AuthKitTextKey[]
  secrets: string[]
  serverOwned: string[]
  fields: Array<{ path: string; group: string; where: 'screens' | 'server' | 'both' | 'host'; default: unknown; description: string }>
}
```

**AuthKitCheck** (interface)
```typescript
interface AuthKitCheck {
  level: 'problem' | 'warning' | 'info'
  code: string
  message: string
  setting?: string
}
```

**AuthKitSettingsResponse** (interface)
```typescript
interface AuthKitSettingsResponse {
  authKitId: string
  ownLogins: 'own' | 'shared'
  config: AuthKitConfig
  effective: Required<Pick<AuthKitConfig, 'enabledProviders' | 'providerOrder' | 'signUp' | 'allowPasswordReset' | 'emailVerificationMode'>> & AuthKitConfig
  secrets: Record<string, { set: boolean; hint?: string | null; setAt?: string | null; legacy?: boolean }>
  checks: AuthKitCheck[]
}
```

**AuthKitRedirectDomain** (interface)
```typescript
interface AuthKitRedirectDomain {
  domain: string
  collectionId: string
  title: string
}
```

**AuthKitRedirectDomainsResponse** (interface)
```typescript
interface AuthKitRedirectDomainsResponse {
  automatic: AuthKitRedirectDomain[]
  allowed: string[]
  suggested: AuthKitRedirectDomain[]
  canSuggest: boolean
}
```

**AuthKitSetupRequest** (interface)
```typescript
interface AuthKitSetupRequest {
  name?: string
  ownLogins?: boolean
  settings?: AuthKitConfigInput
}
```

**AuthKitSetupResponse** (interface)
```typescript
interface AuthKitSetupResponse {
  authKit: AuthKitConfig
  created: boolean
  ownLogins: 'own' | 'shared'
  changed: string[]
}
```

**AuthKitEmailPreview** (interface)
```typescript
interface AuthKitEmailPreview {
  kind: AuthKitEmailKind
  subject: string
  html: string
}
```

**AuthKitSecretLink** (interface)
```typescript
interface AuthKitSecretLink {
  url: string
  expiresAt: string
}
```

**AuthKitSecurityConfig** (interface)
```typescript
interface AuthKitSecurityConfig {
  passwordPolicy?: AuthKitPasswordPolicy
  session?: AuthKitSessionPolicy
  lockout?: AuthKitLockoutPolicy
}
```

**AuthKitPasswordPolicy** (interface)
```typescript
interface AuthKitPasswordPolicy {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumber?: boolean
  requireSymbol?: boolean
  blockCommonPasswords?: boolean
  expiryDays?: number
  historyCount?: number
}
```

**AuthKitSessionPolicy** (interface)
```typescript
interface AuthKitSessionPolicy {
  inactivityTimeoutMinutes?: number
  inactivityWarningSeconds?: number
  absoluteTimeoutHours?: number
  rememberMe?: boolean
}
```

**AuthKitLockoutPolicy** (interface)
```typescript
interface AuthKitLockoutPolicy {
  enabled?: boolean
  maxFailedAttempts?: number
  attemptWindowMinutes?: number
  lockoutMinutes?: number
  notifyUserOnLockout?: boolean
}
```

**RefreshErrorCode** = ``

**AuthKitErrorCode** = ``

**MfaFactor** = `'email' | 'sms' | 'totp'`

**MfaErrorCode** = ``

**VerifyStatus** = `'pending' | 'verified' | 'failed' | 'expired' | 'unknown'`

**AuthKitProvider** = `'email' | 'magic-link' | 'phone' | 'whatsapp' | 'google' | 'apple' | 'microsoft' | 'linkedin'`

**AuthKitEmailKind** = `'passwordReset' | 'emailVerification' | 'magicLink' | 'memberInvite' | 'invite' | 'addedToCollection' | 'mfaCode' | 'providerLinked'`

**AuthKitTextKey** = ``

**AuthKitConfigInput** = ``

**PasswordPolicyErrorCode** = ``

**LoginSecurityErrorCode** = ``

### batch

**BatchResponse** (interface)
```typescript
interface BatchResponse {
  id: string                      // Batch ID
  name?: string | null            // Batch name
  expiryDate?: string | null
  productId?: string              // Product ID
  collectionId?: string           // Collection ID
  createdAt?: string              // ISO 8601
  updatedAt?: string              // ISO 8601
  deleted?: boolean
  deletedAt?: string              // ISO 8601
  admin?: Record<string, any>
  [key: string]: any              // Additional (schemaless) batch fields
}
```

**BatchCreateRequest** (interface)
```typescript
interface BatchCreateRequest {
  name?: string
  expiryDate?: string | Date
  [key: string]: any              // Additional batch fields
}
```

**BatchUpdateRequest** (interface)
```typescript
interface BatchUpdateRequest {
  name?: string
  expiryDate?: string | Date
  [key: string]: any              // Additional batch fields
}
```

**BatchTag** (interface)
```typescript
interface BatchTag {
  code: string                    // Code/tag ID
  claimSetId: string              // Claim set ID
  collectionId?: string           // Collection ID
  productId?: string              // Associated product ID
  batchId?: string                // Batch ID
  tagId?: string                  // Tag identifier
  index?: number                  // Position in claim set
}
```

### bookings

**BookingAllocation** (interface)
```typescript
interface BookingAllocation {
  id: string
  bookingId: string | null
  slotId: string | null
  resourceType: string
  resourceId: string
  startsAt: string
  endsAt: string
  quantity: number
  mode: 'exclusive' | 'capacity'
  active: boolean
  sourceSystem?: string | null
  data: Record<string, any>
}
```

**Booking** (interface)
```typescript
interface Booking {
  id: string
  collectionId: string
  appId: string
  visibility: BookingVisibility
  contactId?: string
  status: BookingStatus
  startsAt: string
  endsAt: string
  timezone?: string | null
  quantity: number
  holdExpiresAt?: string | null
  flags: string[]
  cancelReason?: string | null
  idempotencyKey?: string | null
  seriesId?: string | null
  ref?: string | null
  customId?: string | null
  sourceSystem?: string | null
  productId?: string | null
  proofId?: string
  parentType?: string | null
  parentId?: string | null
  createdAt: string
  updatedAt: string
  cancelledAt?: string | null
  data: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
  allocations: BookingAllocation[]
  editToken?: string
}
```

**BookingSlot** (interface)
```typescript
interface BookingSlot {
  id: string
  collectionId: string
  appId: string
  visibility: BookingVisibility
  resourceType?: string | null
  resourceId?: string | null
  startsAt: string
  endsAt: string
  timezone?: string | null
  capacity: number
  booked: number
  remaining: number
  perContactLimit?: number | null
  status: 'open' | 'closed' | 'cancelled'
  seriesId?: string | null
  ref?: string | null
  customId?: string | null
  sourceSystem?: string | null
  productId?: string | null
  createdAt: string
  updatedAt: string
  data: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
}
```

**CreateBookingInput** (interface)
```typescript
interface CreateBookingInput {
  slotId?: string
  quantity?: number
  resourceType?: string
  resourceId?: string
  resource?: { type: string; id: string }
  startsAt?: string | Date
  endsAt?: string | Date
  allocations?: BookingClaimInput[]
  status?: 'held' | 'pending' | 'confirmed' | 'waitlisted'
  holdMinutes?: number
  bufferBefore?: number
  bufferAfter?: number
  idempotencyKey?: string
  contactId?: string
  timezone?: string
  visibility?: BookingVisibility
  ref?: string
  customId?: string
  sourceSystem?: string
  productId?: string
  proofId?: string
  parentType?: string
  parentId?: string
  seriesId?: string
  data?: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
}
```

**UpdateBookingInput** (interface)
```typescript
interface UpdateBookingInput {
  data?: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
  visibility?: BookingVisibility
  ref?: string
  timezone?: string
  productId?: string
  proofId?: string
  contactId?: string
  sourceSystem?: string
  customId?: string
  flags?: string[]
}
```

**MoveBookingInput** (interface)
```typescript
interface MoveBookingInput {
  slotId?: string
  resourceType?: string
  resourceId?: string
  resource?: { type: string; id: string }
  startsAt?: string | Date
  endsAt?: string | Date
  allocations?: BookingClaimInput[]
  bufferBefore?: number
  bufferAfter?: number
}
```

**BookingListQueryParams** (interface)
```typescript
interface BookingListQueryParams {
  status?: string
  contactId?: string
  slotId?: string
  resourceType?: string
  resourceId?: string
  from?: string | Date
  to?: string | Date
  ref?: string
  customId?: string
  sourceSystem?: string
  productId?: string
  seriesId?: string
  sort?: string
  limit?: number
  offset?: number
}
```

**CreateSlotInput** (interface)
```typescript
interface CreateSlotInput {
  startsAt: string | Date
  endsAt: string | Date
  capacity: number
  perContactLimit?: number
  resourceType?: string
  resourceId?: string
  blockResource?: boolean
  status?: 'open' | 'closed' | 'cancelled'
  timezone?: string
  visibility?: BookingVisibility
  seriesId?: string
  ref?: string
  customId?: string
  sourceSystem?: string
  productId?: string
  data?: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
}
```

**SlotListQueryParams** (interface)
```typescript
interface SlotListQueryParams {
  status?: string
  available?: boolean
  from?: string | Date
  to?: string | Date
  resourceType?: string
  resourceId?: string
  productId?: string
  seriesId?: string
  ref?: string
  customId?: string
  sort?: string
  limit?: number
  offset?: number
}
```

**CreateBlockInput** (interface)
```typescript
interface CreateBlockInput {
  resourceType: string
  resourceId: string
  startsAt: string | Date
  endsAt: string | Date
  sourceSystem?: string
  data?: Record<string, any>
}
```

**BlockListQueryParams** (interface)
```typescript
interface BlockListQueryParams {
  resourceType?: string
  resourceId?: string
  from?: string | Date
  to?: string | Date
  limit?: number
  offset?: number
}
```

**FreeBusyQuery** (interface)
```typescript
interface FreeBusyQuery {
  resources: BookingResourceRef[]
  from: string | Date
  to: string | Date
}
```

**FreeBusyInterval** (interface)
```typescript
interface FreeBusyInterval {
  start: string
  end: string
}
```

**FreeBusyResponse** (interface)
```typescript
interface FreeBusyResponse {
  from: string
  to: string
  resources: Array<{ resourceType: string; resourceId: string; busy: FreeBusyInterval[] }>
}
```

**MessageBookersInput** (interface)
```typescript
interface MessageBookersInput {
  templateId: string
  channel?: 'email' | 'sms' | 'whatsapp' | 'push' | 'preferred'
  props?: Record<string, any>
  slotId?: string
  from?: string | Date
  to?: string | Date
  resourceType?: string
  resourceId?: string
  statuses?: BookingStatus[]
  ref?: string
  attach?: import('./comms').EmailAttachmentSpec[]
}
```

**MessageBookersResult** (interface)
```typescript
interface MessageBookersResult {
  matched: number
  sent: number
  skipped: { noContact: number; duplicate: number; failed: number }
  failures: Array<{ bookingId: string; error: string }>
}
```

**BookingAccessOptions** (interface)
```typescript
interface BookingAccessOptions {
  editToken?: string
}
```

**ScheduleHours** (interface)
```typescript
interface ScheduleHours {
  start: string
  end: string
}
```

**ScheduleOverride** (interface)
```typescript
interface ScheduleOverride {
  date?: string
  from?: string
  to?: string
  hours: ScheduleHours[]
}
```

**StandardSchedule** (interface)
```typescript
interface StandardSchedule {
  timezone: string
  weekly?: Partial<Record<ScheduleDay, ScheduleHours[]>>
  overrides?: ScheduleOverride[]
}
```

**BookingStatus** = ``

**BookingVisibility** = `'public' | 'owner' | 'admin'`

**BookingClaimInput** = ``

**UpdateSlotInput** = `Partial<Omit<CreateSlotInput, 'blockResource' | 'seriesId' | 'resourceType' | 'resourceId'>>`

**BookingResourceRef** (type)
```typescript
type BookingResourceRef = { type: string; id: string }
```

**BookingList** = `ListResult<Booking>`

**SlotList** = `ListResult<BookingSlot>`

**BlockList** = `ListResult<BookingAllocation>`

**BookingErrorCode** = ``

**ScheduleDay** = `'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'`

### broadcasts

**BroadcastRecord** (interface)
```typescript
interface BroadcastRecord {
  id: string
  collectionId: string
  appId: string
  templateId?: string | null
  segmentId?: string | null
  status?: string | null
  scheduledAt?: string | null
  sentAt?: string | null
  data?: {
  display?: {
  title?: string
  description?: string
  icon?: string
  color?: string
  }
  broadcastType?: string
  topic: string
  templateParams?: Record<string, unknown>;
  channelSettings?: {
  mode?: 'preferred' | 'channels' | 'all'
  channels?: Array<{
  channel: BroadcastChannel
  enabled?: boolean
  priority?: number
  }>
  }
  attach?: Array<{ asset: string }>
  [key: string]: unknown
  }
  createdAt: string
}
```

**BroadcastPreviewRequest** (interface)
```typescript
interface BroadcastPreviewRequest {
  contactId?: string
  email?: string
  phone?: string
  props?: Record<string, any>
  channelOverride?: BroadcastChannel
  hydrate?: boolean
  include?: { product?: boolean; proof?: boolean; user?: boolean; [k: string]: boolean | undefined }
}
```

**BroadcastSendTestRequest** (interface)
```typescript
interface BroadcastSendTestRequest {
  contactId?: string
  email?: string
  phone?: string
  props?: Record<string, any>
  channelOverride?: BroadcastChannel
  hydrate?: boolean
  include?: { product?: boolean; proof?: boolean; user?: boolean; [k: string]: boolean | undefined }
}
```

**BroadcastSendTestResponse** (interface)
```typescript
interface BroadcastSendTestResponse {
  ok: boolean; id?: string; channel?: BroadcastChannel
}
```

**BroadcastSendManualRequest** (interface)
```typescript
interface BroadcastSendManualRequest {
  limit?: number
  offset?: number
  dryRun?: boolean
  sharedContext?: Record<string, any>
}
```

**BroadcastSendManualResponse** (interface)
```typescript
interface BroadcastSendManualResponse {
  ok: boolean
  counts: { sent: number; failed: number; skipped: number }
  page: { limit: number; offset: number; total: number }
  results: Array<{
  contactId: string
  status: 'sent' | 'failed' | 'skipped' | 'dry_run'
  id?: string
  error?: string
  message?: string
  }>
}
```

**BroadcastSendRequest** (interface)
```typescript
interface BroadcastSendRequest {
  pageSize?: number
  maxPages?: number
  sharedContext?: Record<string, any>
  channel?: BroadcastChannel
  hydrate?: boolean
  include?: { product?: boolean; proof?: boolean; user?: boolean; [k: string]: boolean | undefined }
}
```

**BroadcastAppendEventBody** (interface)
```typescript
interface BroadcastAppendEventBody {
  broadcastId: string
  contactId?: string
  channel?: BroadcastChannel
  templateId?: string
  eventType: string
  outcome?: 'success' | 'failed'
  failureReason?: string
  metadata?: Record<string, any>
}
```

**BroadcastAppendBulkBody** (interface)
```typescript
interface BroadcastAppendBulkBody {
  ids: string[]
  idField?: string
  params: Record<string, any> // merged with collectionId server-side
}
```

**BroadcastChannel** = `'email' | 'push' | 'sms'`

**BroadcastPreviewResponse** = ``

### claimSet

**ClaimCodeRef** (interface)
```typescript
interface ClaimCodeRef {
  codeId: string
  claimId: string
}
```

**UpdateClaimDataRequest** (interface)
```typescript
interface UpdateClaimDataRequest {
  data: Record<string, any>
  codes: ClaimCodeRef[]
}
```

**AssignClaimsRequest** (interface)
```typescript
interface AssignClaimsRequest {
  id: string
  collectionId: string
  productId: string
  batchId?: string
  start?: number
  end?: number
  codeId?: string
  data?: Record<string, any>
}
```

**CreateClaimSetTagRequest** (interface)
```typescript
interface CreateClaimSetTagRequest {
  id?: string
  tagId?: string
  productId?: string
  collectionId?: string
  batchId?: string
  password?: string
  data?: Record<string, unknown>
}
```

**CreateClaimSetRequest** (interface)
```typescript
interface CreateClaimSetRequest {
  name: string
  claimMode: string
  allocationMode: string
}
```

**ImportClaimSetTagItem** (interface)
```typescript
interface ImportClaimSetTagItem {
  id: string
  tagId?: string
  index?: number
}
```

**ImportClaimSetTagsRequest** (interface)
```typescript
interface ImportClaimSetTagsRequest {
  tags: ImportClaimSetTagItem[]
  mode?: 'upsert' | 'replace'
}
```

**ImportClaimSetTagsResponse** (interface)
```typescript
interface ImportClaimSetTagsResponse {
  written: number
}
```

**CreateClaimSetTagResponse** (interface)
```typescript
interface CreateClaimSetTagResponse {
  id: string
  claimSetId: string
  createdAt: string
  tagId?: string
  productId?: string
  collectionId?: string
  batchId?: string
  password?: string
  data?: Record<string, unknown>
}
```

**ClaimSetRange** (interface)
```typescript
interface ClaimSetRange {
  id: string
  claimSetId: string
  namespace: string
  kind: ClaimSetRangeKind
  name: string
  notes: string | null
  startIndex: number | null
  endIndex: number | null
  quantity: number
  tagType: ClaimSetTagType
  fulfilment: 'printer' | 'sidekick'
  stage: 'minting' | 'minted' | 'sent' | 'received'
  status: ClaimSetRangeStatus
  intendedCollectionId: string | null
  intendedProductId: string | null
  intendedBatchId: string | null
  manufacturer: string | null
  orderRef: string | null
  counts: { programmed: number; assigned: number; claimed: number }
  sentAt: string | null
  receivedAt: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}
```

**CreateClaimSetRangeRequest** (interface)
```typescript
interface CreateClaimSetRangeRequest {
  kind?: ClaimSetRangeKind
  name: string
  quantity?: number
  intendedCollectionId?: string
  intendedProductId?: string
  intendedBatchId?: string
  fulfilment?: 'printer' | 'sidekick'
  notes?: string
  manufacturer?: string
  orderRef?: string
}
```

**UpdateClaimSetRangeRequest** (interface)
```typescript
interface UpdateClaimSetRangeRequest {
  name?: string
  notes?: string | null
  manufacturer?: string | null
  orderRef?: string | null
  fulfilment?: 'printer' | 'sidekick'
  stage?: 'minted' | 'sent' | 'received'
}
```

**ClaimSetRangeTag** (interface)
```typescript
interface ClaimSetRangeTag {
  code: string
  printed: string
  index: number
  uid: string | null
  key?: string
  collectionId: string | null
  productId: string | null
  batchId: string | null
  proofId: string | null
  rangeId: string | null
  groupId: string | null
  programmedAt: string | null
  scans: number
}
```

**AddClaimSetRangeMemberRequest** (interface)
```typescript
interface AddClaimSetRangeMemberRequest {
  code?: string
  uid?: string
  collectionId?: string
  productId?: string
  batchId?: string
  data?: Record<string, unknown>
  clear?: boolean
}
```

**AddClaimSetRangeMemberResponse** (interface)
```typescript
interface AddClaimSetRangeMemberResponse {
  tag: ClaimSetRangeTag
  range: ClaimSetRange
  assigned: { changed: number; skipped: Array<{ code: string; index: number | null; reason: 'other_range' | 'has_proof' | 'assigned_elsewhere'; collectionId?: string }> }
  movedFrom: string | null
}
```

**ImportClaimSetRangeUidsRequest** (interface)
```typescript
interface ImportClaimSetRangeUidsRequest {
  csv?: string
  rows?: Array<Record<string, string | number>>
  commit?: boolean
}
```

**ImportClaimSetRangeUidsResponse** (interface)
```typescript
interface ImportClaimSetRangeUidsResponse {
  summary: { rows: number; ok: number; unchanged: number; problems: number; notInFile: number; committed: boolean }
  rows: Array<{ line: number; code: string; index: number | null; uid: string; result: ClaimSetImportResult; message?: string }>
  range: ClaimSetRange
}
```

**AssignClaimSetRangeRequest** (interface)
```typescript
interface AssignClaimSetRangeRequest {
  collectionId?: string
  productId?: string
  batchId?: string
  start?: number
  end?: number
  clear?: boolean
  data?: Record<string, unknown>
}
```

**AssignClaimSetRangeResponse** (interface)
```typescript
interface AssignClaimSetRangeResponse {
  changed: number
  wholeRange?: boolean
  skipped: Array<{ code: string; index: number; reason: 'other_range' | 'has_proof' | 'assigned_elsewhere'; collectionId?: string }>
  range: ClaimSetRange
}
```

**ClaimSetRangeFile** (interface)
```typescript
interface ClaimSetRangeFile {
  filename: string
  contentType: string
  csv?: string
  base64?: string
  markdown?: string
}
```

**Partner** (interface)
```typescript
interface Partner {
  id: string
  name: string
  status: 'active' | 'suspended'
  tapDomains: string[]
  features: Record<string, boolean>
  role?: 'owner' | 'admin' | 'assigner'
  members?: Array<{ userId: string; role: 'owner' | 'admin' | 'assigner'; grantedBy: string | null; grantedAt: string }>
  createdAt: string
  updatedAt: string
}
```

**PartnerClaimSet** (interface)
```typescript
interface PartnerClaimSet {
  id: string
  namespace: string
  name: string | null
  tagType: ClaimSetTagType
  tapDomain: string
  owner: { type: 'platform' | 'partner' | 'collection' | 'user'; id: string | null }
  codes: number
  codeSource?: 'stored' | 'computed'
  sigBits?: number
  bareCodes?: boolean
  unassignedUrl?: string | null
  deleted: boolean
  createdAt: string | null
}
```

**PartnerTagHit** (interface)
```typescript
interface PartnerTagHit {
  namespace: string
  claimSetId: string
  set: PartnerClaimSet | null
  tag: ClaimSetRangeTag & { url: string | null }
  range: ClaimSetRange | null
  group: ClaimSetRange | null
}
```

**CreatePartnerClaimSetRequest** (interface)
```typescript
interface CreatePartnerClaimSetRequest {
  name: string
  tagType: ClaimSetTagType
  tapDomain?: string
  codeSource?: 'stored' | 'computed'
  sigBits?: number
  bareCodes?: boolean
  unassignedUrl?: string
}
```

**TagCodeRef** (interface)
```typescript
interface TagCodeRef {
  scan?: string
  url?: string
  claimSetId?: string
  code?: string
  tagId?: string
}
```

**TagCodeState** (interface)
```typescript
interface TagCodeState {
  kind: 'claim' | 'chip'
  claimSetId?: string
  code?: string
  url?: string
  computed?: boolean
  tagId?: string
  tagType: ClaimSetTagType | 'chip'
  status: 'free' | 'attached' | 'elsewhere'
  on?: TagCodeOn | null
  productId?: string | null
  proofId?: string | null
}
```

**PlaceMoveResult** (interface)
```typescript
interface PlaceMoveResult {
  moved: Array<{ item: PlaceMoveItem; from: string | null; to: string | null }>
  unchanged: PlaceMoveItem[]
  refused: Array<{ item: PlaceMoveItem; errorCode: string; errorText: string }>
}
```

**ClaimSetScope** (type)
```typescript
type ClaimSetScope = { collectionId: string }
```

**ClaimSetTagType** = `'ntag424' | 'ntag21x' | 'qr'`

**ClaimSetRangeKind** = `'range' | 'open' | 'group'`

**ClaimSetRangeStatus** = `'minting' | 'minted' | 'sent' | 'received' | 'assigned' | 'open' | 'group'`

**CloseClaimSetRangeResponse** = `ClaimSetRange | { id: string`

**ClaimSetImportResult** = ``

**TagCodeOn** = ``

**PlaceMoveItem** (type)
```typescript
type PlaceMoveItem = { productId: string; proofId: string }
```

### clientLog

**ClientErrorReport** (interface)
```typescript
interface ClientErrorReport {
  app?: string
  appVersion?: string
  collectionId?: string
  operation?: string
  severity?: 'debug' | 'info' | 'warning' | 'error' | 'critical'
  errorCode?: string
  errorType?: string
  message?: string
  stack?: string
  entityType?: string
  entityId?: string
  labels?: Record<string, unknown>
  context?: Record<string, unknown>
  refId?: string
  correlationId?: string
}
```

**ClientErrorEvent** (interface)
```typescript
interface ClientErrorEvent {
  id: string
  time: string
  event_category: string
  event_action: string | null
  log_level: string
  error_code: string | null
  error_message: string | null
  service_name: string | null
  service_version: string | null
  collection_id: string | null
  user_id: string | null
  labels: Record<string, unknown> | null
  context: Record<string, unknown> | null
}
```

### collection

**Collection** (interface)
```typescript
interface Collection {
  id: string
  title: string
  description: string
  headerImage?: AssetRef | null
  logoImage?: AssetRef | null
  loaderImage?: {
  overwriteName: string
  name: string
  type: string
  url: string
  }
  languages?: {
  code: string
  lang: string
  supported: boolean
  }[],
  roles: {
  [userId: string]: string
  } // User roles mapping with user IDs as keys and role names as values
  groupTags?: string[] // Array of group tag names
  redirectUrl?: string // Whether the collection has a custom domain
  hubName?: string
  hubCustomDomain?: string
  siteHost?: string | null
  shortId: string, // The shortId of this collection
  dark?: boolean // if dark mode is enabled for this collection
  primaryColor?: string
  secondaryColor?: string
  portalUrl?: string // URL for the collection's portal (if applicable)
  allowAutoGenerateClaims?: boolean
  defaultAuthKitId: string // default auth kit for this collection, used for auth
  admin?: {
  redirect?: CollectionRedirectConfig
  }
}
```

**CollectionRedirectConfig** (interface)
```typescript
interface CollectionRedirectConfig {
  mode: 'fixed' | 'dynamic' | 'deep'
  url?: string
  template?: string
}
```

**HubAvailabilityResponse** (interface)
```typescript
interface HubAvailabilityResponse {
  available: boolean
  domain: string
}
```

**AppConfig** (interface)
```typescript
interface AppConfig {
  id: string
  srcAppId: string
  name: string
  description?: string
  faIcon?: string
  category: "Authenticity" | "Documentation" | "Commerce" | "Engagement" | "AI" | "Digital Product Passports" | "Integration" | "Web3" | "Other";
  active?: boolean
  ownersOnly?: boolean
  hidden?: boolean
  publicIframeUrl?: string
  manifestUrl?: string
  supportsDeepLinks?: boolean;
  usage: {
  collection: boolean;  // use at the collecton level
  product: boolean; // use at the product level
  proof: boolean;  // use at the proof level
  widget: boolean; // has a widget component available
  }
  directComponent: boolean; // Whether the app provides a direct React component for embedding (instead of using an iframe)
  [key: string]: any
}
```

**CollectionUser** (interface)
```typescript
interface CollectionUser {
  uid: string
  access: CollectionAccessLevel | string
  name?: string
  email?: string
}
```

**InviteUserInput** (interface)
```typescript
interface InviteUserInput {
  email: string
  name?: string
  access: CollectionAccessLevel | string
  loginCollectionId?: string
  consoleOrigin?: string
}
```

**ReadinessItem** (interface)
```typescript
interface ReadinessItem {
  level: 'problem' | 'warning' | 'info'
  code: string
  message: string
  app?: string
  appName?: string
  fix?: { label: string; open: { appId: string; view?: string }; studioPath: string }
}
```

**CollectionReadiness** (interface)
```typescript
interface CollectionReadiness {
  ready: boolean
  items: ReadinessItem[]
}
```

**CollectionResponse** = `Collection`

**CollectionCreateRequest** = `Omit<Collection, 'id' | 'shortId'>`

**CollectionUpdateRequest** = `Partial<Omit<Collection, 'id' | 'shortId'>>`

**DomainTarget** = `"links" | "site"`

**CollectionAccessLevel** = `'Owner' | 'Admin' | 'Assigner' | 'Reporter' | 'User' | 'None'`

### common

**IdField** = `'userId' | 'contactId'`

### comms

**NotificationSubjectTarget** (interface)
```typescript
interface NotificationSubjectTarget {
  type: 'product' | 'collection' | 'user' | 'batch' | 'proof'
  id: string
}
```

**CommunicationEvent** (interface)
```typescript
interface CommunicationEvent {
  orgId: string
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  timestamp: string
  eventType: string
  outcome?: string | null
  templateId?: string | null
  [k: string]: any
}
```

**RecipientWithOutcome** (interface)
```typescript
interface RecipientWithOutcome {
  id: string; outcome: string
}
```

**CommsRecipientsWithoutInteractionQuery** (interface)
```typescript
interface CommsRecipientsWithoutInteractionQuery {
  broadcastId?: string
  journeyId?: string
  interactionId?: string
  appId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
  cursor?: string
}
```

**CommsRecipientsWithInteractionQuery** (interface)
```typescript
interface CommsRecipientsWithInteractionQuery {
  broadcastId?: string
  journeyId?: string
  interactionId?: string
  appId?: string
  outcome?: string
  idField?: IdField
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
  cursor?: string
}
```

**LogCommunicationEventBody** (interface)
```typescript
interface LogCommunicationEventBody {
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  eventType: string
  outcome?: string
  templateId?: string
  timestamp?: string
  [k: string]: any
}
```

**LogBulkCommunicationEventsBody** (interface)
```typescript
interface LogBulkCommunicationEventsBody {
  params: { broadcastId?: string; journeyId?: string; [k: string]: any }
  ids: string[]
  idField?: IdField
}
```

**AppendResult** (interface)
```typescript
interface AppendResult {
  success: true
}
```

**AppendBulkResult** (interface)
```typescript
interface AppendBulkResult {
  success: true; count: number
}
```

**RecipientsPage** (interface)
```typescript
interface RecipientsPage {
  items: Recipient[]
  total: number
  limit: number
  offset: number
  note?: string
}
```

**PushSubscriptionJSON** (interface)
```typescript
interface PushSubscriptionJSON {
  endpoint: string
  keys?: {
  p256dh?: string
  auth?: string
  }
}
```

**PushVapidResponse** (interface)
```typescript
interface PushVapidResponse {
  publicKey: string
}
```

**PushSubscribeResponse** (interface)
```typescript
interface PushSubscribeResponse {
  ok: true; id: string
}
```

**RegisterPushMethodRequest** (interface)
```typescript
interface RegisterPushMethodRequest {
  contactId?: string
  endpoint: string
  keys: { p256dh: string; auth: string }
  meta?: Record<string, any>
}
```

**CommsSettings** (interface)
```typescript
interface CommsSettings {
  unsub?: {
  requireToken?: boolean
  secret?: string
  hasSecret?: boolean
  }
  topics?: Record<string, TopicConfig>
  [k: string]: any
}
```

**TopicConfig** (interface)
```typescript
interface TopicConfig {
  label?: string
  description?: string
  labels?: string[]
  classification?: 'transactional' | 'marketing'
  defaults?: {
  channels?: Partial<Record<BroadcastChannel, boolean>>
  topics?: Record<string, boolean | undefined>
  policy?: 'opt-in' | 'opt-out'
  byChannel?: Partial<Record<BroadcastChannel, 'opt-in' | 'opt-out'>>
  }
  rules?: {
  allowChannels?: BroadcastChannel[]
  allowUnsubscribe?: boolean
  required?: boolean
  }
  [k: string]: any
}
```

**CommsSettingsGetResponse** (interface)
```typescript
interface CommsSettingsGetResponse {
  ok: true
  settings: CommsSettings
}
```

**CommsPublicTopicsResponse** (interface)
```typescript
interface CommsPublicTopicsResponse {
  ok: true; topics: Record<string, TopicConfig>
}
```

**UnsubscribeQuery** (interface)
```typescript
interface UnsubscribeQuery {
  contactId?: string
  topic?: string
  channel?: BroadcastChannel
  token?: string
}
```

**UnsubscribeResponse** (interface)
```typescript
interface UnsubscribeResponse {
  ok: true; applied?: { channels?: Record<string, boolean>; topics?: Record<string, boolean> }
}
```

**CommsSignupRequest** (interface)
```typescript
interface CommsSignupRequest {
  email: string
  templateId: string
  topics?: string[]
  firstName?: string
  fields?: { firstName?: string; lastName?: string; displayName?: string; company?: string; locale?: string; timezone?: string; customFields?: Record<string, string | number | boolean> }
  appId?: string
}
```

**CommsSignupResponse** (interface)
```typescript
interface CommsSignupResponse {
  ok: true; pending: true
}
```

**CommsConsentUpsertRequest** (interface)
```typescript
interface CommsConsentUpsertRequest {
  contactId?: string
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}
```

**CommsPreferencesUpsertRequest** (interface)
```typescript
interface CommsPreferencesUpsertRequest {
  contactId?: string
  subject?: { type: SubjectType; id: string; productId?: string }
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}
```

**CommsSubscribeRequest** (interface)
```typescript
interface CommsSubscribeRequest {
  contactId?: string
  subject: { type: SubjectType; id: string; productId?: string }
  subscribe: boolean
  source?: string
}
```

**CommsSubscribeResponse** (interface)
```typescript
interface CommsSubscribeResponse {
  ok: true; subscriptionId: string
}
```

**CommsSubscriptionCheckQuery** (interface)
```typescript
interface CommsSubscriptionCheckQuery {
  contactId?: string
  subjectType: SubjectType
  subjectId: string
  productId?: string
}
```

**CommsSubscriptionCheckResponse** (interface)
```typescript
interface CommsSubscriptionCheckResponse {
  ok: true; subscribed: boolean
}
```

**CommsListMethodsQuery** (interface)
```typescript
interface CommsListMethodsQuery {
  contactId?: string
  type?: BroadcastChannel
}
```

**RegisterEmailMethodRequest** (interface)
```typescript
interface RegisterEmailMethodRequest {
  contactId?: string; email?: string; userId?: string
}
```

**RegisterSmsMethodRequest** (interface)
```typescript
interface RegisterSmsMethodRequest {
  contactId?: string; phone?: string; userId?: string
}
```

**RegisterMethodResponse** (interface)
```typescript
interface RegisterMethodResponse {
  ok: true; contactId: string
}
```

**SubscriptionsResolveRequest** (interface)
```typescript
interface SubscriptionsResolveRequest {
  subject: { type: SubjectType; id: string; productId?: string }
  hints: { userId?: string; pushEndpoint?: string; email?: string }
}
```

**SubscriptionsResolveResponse** (interface)
```typescript
interface SubscriptionsResolveResponse {
  ok: true
  subject: { type: SubjectType; id: string; productId?: string }
  contacts: Array<{
  contactId: string
  subscribed: boolean
  channels?: Partial<Record<BroadcastChannel, boolean>>
  }>
  anySubscribed: boolean
  anyMethods: boolean
}
```

**TransactionalSendRequest** (interface)
```typescript
interface TransactionalSendRequest {
  contactId: string
  templateId?: string
  message?: TypedMessage
  channel?: 'email' | 'sms' | 'whatsapp' | 'push' | 'wallet' | 'preferred'
  props?: Record<string, unknown>
  include?: {
  collection?: boolean
  productId?: string
  proofId?: string
  user?: boolean
  appCase?: string
  appThread?: string
  appRecord?: string
  }
  ref?: string
  appId?: string
  about?: MessageAbout
  category?: 'service'
  attach?: EmailAttachmentSpec[]
}
```

**TransactionalSendResponse** (interface)
```typescript
interface TransactionalSendResponse {
  ok: true
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'wallet'
  messageId?: string
  attachmentsLeftOut?: string[]
}
```

**TypedMessage** (interface)
```typescript
interface TypedMessage {
  subject?: string
  body: string
  sms?: string
}
```

**MessageAbout** (interface)
```typescript
interface MessageAbout {
  appId?: string
  type: string
  id: string
  view?: string
  params?: Record<string, string>
  label?: string
}
```

**TransactionalSendError** (interface)
```typescript
interface TransactionalSendError {
  ok: false
  error: string
}
```

**RecipientId** = `string`

**Recipient** = `import('./contact').Contact`

**CommsSettingsPatchBody** = `Partial<CommsSettings>`

**ConsentChannels** = `Partial<Record<BroadcastChannel, boolean>>`

**CommsListMethodsResponse** = `ListResult<import('./contact').CommMethod>`

**EmailAttachmentSpec** = ``

**TransactionalSendResult** = `// src/types/comms.ts
// Communication and notification types for the Smartlinks API
import type { IdField } from './common'
import type { BroadcastChannel } from './broadcasts'
import type { ListResult, ListOptions } from './list'

/**
 * Target subject for notifications (product, collection, etc.)
 */
export interface NotificationSubjectTarget {
  /** Type of target entity */
  type: 'product' | 'collection' | 'user' | 'batch' | 'proof'
  /** ID of the target entity */
  id: string
}


// Analytics & logging (communication events)

export interface CommunicationEvent {
  orgId: string
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  timestamp: string
  eventType: string
  outcome?: string | null
  templateId?: string | null
  [k: string]: any
}

/** `comms.queryByUser` options: who, the time window (`from` / `to`), plus `limit` and `cursor`. */
export interface CommsQueryByUser extends ListOptions {
  userId?: string
  contactId?: string
  from?: string
  to?: string
}

export type RecipientId = string
export interface RecipientWithOutcome { id: string; outcome: string }

/** `comms.queryRecipientIds` options: the source, the time window (`from` / `to`), plus `limit` and `cursor`. */
export interface CommsRecipientIdsQuery extends ListOptions {
  broadcastId?: string
  journeyId?: string
  idField?: IdField
  from?: string
  to?: string
}

/** Who a broadcast or journey reached that did NOT then do an interaction. */
export interface CommsRecipientsWithoutInteractionQuery {
  broadcastId?: string
  journeyId?: string
  /** The interaction to look for (its id). */
  interactionId?: string
  appId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
  /** A `nextCursor` from the previous page. */
  cursor?: string
}

/** Who a broadcast or journey reached that then did an interaction. */
export interface CommsRecipientsWithInteractionQuery {
  broadcastId?: string
  journeyId?: string
  /** The interaction to look for (its id). */
  interactionId?: string
  appId?: string
  outcome?: string
  idField?: IdField
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
  /** A `nextCursor` from the previous page. */
  cursor?: string
}

export interface LogCommunicationEventBody {
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  eventType: string
  outcome?: string
  templateId?: string
  timestamp?: string
  [k: string]: any
}

export interface LogBulkCommunicationEventsBody {
  params: { broadcastId?: string; journeyId?: string; [k: string]: any }
  ids: string[]
  idField?: IdField
}

export interface AppendResult { success: true }
export interface AppendBulkResult { success: true; count: number }

// Common recipient type used by segments and broadcasts
export type Recipient = import('./contact').Contact

// Shared page response shape for recipient listings
export interface RecipientsPage {
  items: Recipient[]
  total: number
  limit: number
  offset: number
  note?: string
}

// Web Push (public client registration)

export interface PushSubscriptionJSON {
  endpoint: string
  keys?: {
    p256dh?: string
    auth?: string
  }
}

export interface PushVapidResponse { publicKey: string }
export interface PushSubscribeResponse { ok: true; id: string }

// Public: register a push contact method
export interface RegisterPushMethodRequest {
  /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
  contactId?: string
  endpoint: string
  keys: { p256dh: string; auth: string }
  meta?: Record<string, any>
}

// Admin Comms Settings

export interface CommsSettings {
  unsub?: {
    requireToken?: boolean
    /** Secret for token generation; omitted unless includeSecret=true */
    secret?: string
    /** Convenience flag indicating a secret is set (masked responses) */
    hasSecret?: boolean
  }
  /** Map of topic keys to topic config */
  topics?: Record<string, TopicConfig>
  [k: string]: any
}

export interface TopicConfig {
  label?: string
  description?: string
  /** Optional UI-only grouping labels */
  labels?: string[]
  /** Classification for UI and default policy guidance */
  classification?: 'transactional' | 'marketing'
  defaults?: {
    channels?: Partial<Record<BroadcastChannel, boolean>>
    topics?: Record<string, boolean | undefined>
    /** Default consent policy when explicit preferences are absent */
    policy?: 'opt-in' | 'opt-out'
    /** Per-channel default policy (overrides policy when present) */
    byChannel?: Partial<Record<BroadcastChannel, 'opt-in' | 'opt-out'>>
  }
  rules?: {
    allowChannels?: BroadcastChannel[]
    allowUnsubscribe?: boolean
    required?: boolean
  }
  [k: string]: any
}

export interface CommsSettingsGetResponse {
  ok: true
  settings: CommsSettings
}

export type CommsSettingsPatchBody = Partial<CommsSettings>

// Public types listing (array form for public API)
export interface CommsPublicTopicsResponse { ok: true; topics: Record<string, TopicConfig> }

export interface UnsubscribeQuery {
  /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
  contactId?: string
  topic?: string
  channel?: BroadcastChannel
  token?: string
}

export interface UnsubscribeResponse { ok: true; applied?: { channels?: Record<string, boolean>; topics?: Record<string, boolean> } }

// Public sign-up (double opt-in)
export interface CommsSignupRequest {
  email: string
  /**
   * Required: YOUR app's confirmation email — a template in this collection (SL.template) whose body
   * uses `{{ action_url }}` for the confirm link (`{{ topics }}` lists what they signed up for). The
   * platform sends no default sign-up email.
   */
  templateId: string
  /** Topic ids from the collection's comm settings (e.g. ["newsletter"]). */
  topics?: string[]
  firstName?: string
  /**
   * The form's other answers — firstName/lastName/displayName/company/locale/timezone and
   * `customFields`. Applied to the contact when the address is confirmed, and only where the contact
   * has no value yet (never overwritten). Small: ~2 KB.
   */
  fields?: { firstName?: string; lastName?: string; displayName?: string; company?: string; locale?: string; timezone?: string; customFields?: Record<string, string | number | boolean> }
  /** Your app id, recorded with the sent email. */
  appId?: string
}
export interface CommsSignupResponse { ok: true; pending: true }

// Public consent/preferences/subscribe
export type ConsentChannels = Partial<Record<BroadcastChannel, boolean>>
type SubjectType = import('./contact').SubjectType

export interface CommsConsentUpsertRequest {
  /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
  contactId?: string
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}

export interface CommsPreferencesUpsertRequest {
  /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
  contactId?: string
  subject?: { type: SubjectType; id: string; productId?: string }
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}

export interface CommsSubscribeRequest {
  /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
  contactId?: string
  subject: { type: SubjectType; id: string; productId?: string }
  subscribe: boolean
  source?: string
}
export interface CommsSubscribeResponse { ok: true; subscriptionId: string }

export interface CommsSubscriptionCheckQuery {
  /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
  contactId?: string
  subjectType: SubjectType
  subjectId: string
  productId?: string
}
export interface CommsSubscriptionCheckResponse { ok: true; subscribed: boolean }

export interface CommsListMethodsQuery {
  /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
  contactId?: string
  type?: BroadcastChannel
}
/** What `comms.listMethods` returns: the contact's registered methods in `items` (all of them; `nextCursor` is always null). */
export type CommsListMethodsResponse = ListResult<import('./contact').CommMethod>

export interface RegisterEmailMethodRequest { contactId?: string; email?: string; userId?: string }
export interface RegisterSmsMethodRequest { contactId?: string; phone?: string; userId?: string }
export interface RegisterMethodResponse { ok: true; contactId: string }

export interface SubscriptionsResolveRequest {
  subject: { type: SubjectType; id: string; productId?: string }
  hints: { userId?: string; pushEndpoint?: string; email?: string }
}
export interface SubscriptionsResolveResponse {
  ok: true
  subject: { type: SubjectType; id: string; productId?: string }
  contacts: Array<{
    contactId: string
    subscribed: boolean
    channels?: Partial<Record<BroadcastChannel, boolean>>
  }>
  anySubscribed: boolean
  anyMethods: boolean
}

// Transactional send (single-contact, single-message)

/**
 * Send a single message to one contact using a template.
 * No broadcast record is created; the send is logged directly to the
 * contact's communication history with sourceType: 'transactional'.
 *
 * POST /admin/collection/:collectionId/comm/send
 */
export interface TransactionalSendRequest {
  /** CRM contact UUID */
  contactId: string
  /** A saved template's id. Give this or `message`. */
  templateId?: string
  /**
   * A typed message instead of a template: plain text, Liquid allowed (`{{ contact.firstName }}`).
   * `sms` is the shorter text for SMS and WhatsApp (defaults to `body`).
   */
  message?: TypedMessage
  /**
   * Channel to send on. Defaults to 'preferred', which auto-selects the
   * contact's best available channel respecting consent, suppression, and
    * template availability.
   */
    channel?: 'email' | 'sms' | 'whatsapp' | 'push' | 'wallet' | 'preferred'
  /** Extra Liquid variables merged into the top-level render context */
  props?: Record<string, unknown>
  /** Context objects to hydrate into the Liquid template */
  include?: {
    /** Hydrate {{ collection }}. Default: true */
    collection?: boolean
    /** Hydrate {{ product }} from this product ID */
    productId?: string
    /** Hydrate {{ proof }} (requires productId) */
    proofId?: string
    /** Hydrate {{ user }} from contact.userId */
    user?: boolean
    /** Hydrate {{ appCase }} from this case UUID */
    appCase?: string
    /** Hydrate {{ appThread }} from this thread UUID */
    appThread?: string
    /** Hydrate {{ appRecord }} from this record UUID */
    appRecord?: string
  }
  /** Arbitrary label stored on the comms-events row (e.g. 'warranty-step-2') */
  ref?: string
  /** App context stored on the comms-events row */
  appId?: string
  /**
   * What the message is about: the record it was sent for and the admin screen that shows it, so it is a
   * link in Messages, on the contact's Activity, and on the conversation a reply opens. `appId` defaults
   * to the sending app.
   */
  about?: MessageAbout
  /**
   * `'service'` (a confirmation, a reminder, an update): an asked-for channel the person turned off, or a
   * suppressed email, is refused (`transactional.opted_out`). Marketing goes out as a campaign.
   */
  category?: 'service'
  /**
   * Files to attach (email only; at most 5, 10 MB in all). What can't be made is left out and listed in
   * `attachmentsLeftOut` — the email still goes.
   */
  attach?: EmailAttachmentSpec[]
}

/**
 * One file for an email:
 * - `'calendar'` — the booking's `.ics` calendar invite (needs `include.booking` and `appId`)
 * - `{ asset }` — a file uploaded to this collection's assets
 * - `{ function }` — the app's (`appId`) own server function makes it (see server-functions.md, "Making an email attachment")
 * - `{ filename, contentType, content }` — a file you made, base64 (PDF, Office documents, images, text, CSV, calendar)
 * - `{ filename, file }` — a private file you made (e.g. `pdf.create` with `return: 'signedUrl'`)
 */
export type EmailAttachmentSpec =
  | 'calendar'
  | { asset: string }
  | { function: string }
  | { filename: string; contentType: string; content: string }
  | { filename: string; contentType?: string; file: string }

export interface TransactionalSendResponse {
  ok: true
  /** The channel the message was actually sent on */
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'wallet'
  /** Provider message ID (email/SMS/WhatsApp); absent for push/wallet */
  messageId?: string
  /** Attachments that couldn't be made, and why (the email went without them) */
  attachmentsLeftOut?: string[]
}

/** A message written there and then rather than a saved template. */
export interface TypedMessage {
  subject?: string
  body: string
  /** The shorter text for SMS and WhatsApp (defaults to `body`). */
  sms?: string
}

/**
 * What a message is about (docs/comms.md, "What a message is about"). Ids only, never content.
 * `view` and `params` name one of the app's admin views (manifest `adminViews`, docs/admin-views.md).
 */
export interface MessageAbout {
  appId?: string
  /** What kind of record: `'booking'`, `'entry'`, `'case'`. */
  type: string
  id: string
  view?: string
  params?: Record<string, string>
  /** A short label to show without looking the record up: `'Sat 3pm, table for 4'`. */
  label?: string
}

export interface TransactionalSendError {
  ok: false
  /**
   * Error code. Known values:
   * - `transactional.contact_not_found`
   * - `transactional.template_not_found`
   * - `transactional.no_channel_available`
   * - `transactional.email_missing`
   * - `transactional.phone_missing`
   * - `transactional.whatsapp_missing`
   * - `transactional.no_push_methods`
   * - `transactional.no_wallet_passes` (`channel: 'wallet'`: the person has no wallet passes from this app)
   * - `transactional.opted_out` (category `'service'`: the person turned that channel off, or the email is suppressed)
   * - `transactional.template_or_message` / `transactional.message_invalid` / `transactional.about_invalid`
   */
  error: string
}

export type TransactionalSendResult =`

### config

**FieldOption** (interface)
```typescript
interface FieldOption {
  label: string
  value: string
}
```

**FieldDefinition** (interface)
```typescript
interface FieldDefinition {
  id: string
  label: string
  storageKey?: string
  type: FieldType
  options?: FieldOption[]
  required?: boolean
  col?: number
  placeholder?: string
  help?: string
  min?: number
  max?: number
  step?: number
  rows?: number
  autoGrow?: boolean
  accept?: string
  clearable?: boolean
  disabled?: boolean
  showIf?: { field: string; equals: unknown }
}
```

**ProofTypeDefinition** (interface)
```typescript
interface ProofTypeDefinition {
  id: string
  name: string
  description?: string
  category?: string
  active?: boolean
  group: boolean
  proofTypes?: ProofMechanism[]
  proofType?: ProofMechanism
  groupFields?: string[]
  proofFields?: string[]
  listFields?: Record<string, boolean>
  freeApps?: string[]
  apps?: string[]
  collection?: string
  action?: string
  bound?: 'soul'
  translations?: Record<string, string>
  hideProductTools?: boolean
}
```

**FieldType** = ``

**ProofMechanism** = ``

### contact

**Contact** (interface)
```typescript
interface Contact {
  contactId: string
  orgId: string
  userId: string | null
  firstName: string | null
  lastName: string | null
  displayName: string | null
  company: string | null
  email: string | null
  phone: string | null
  emails?: string[]
  phones?: string[]
  tags?: string[]
  source?: string | null
  notes?: string | null
  avatarUrl?: string | null
  locale?: string | null
  timezone?: string | null
  externalIds?: Record<string, any>
  comms?: CommsState
  customFields: ContactCustomFields
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  erasedAt: string | null
}
```

**ContactDuplicatePair** (interface)
```typescript
interface ContactDuplicatePair {
  keep: Contact
  merge: Contact
  matchedOn: "email" | "phone"
}
```

**ContactMergeResponse** (interface)
```typescript
interface ContactMergeResponse {
  contactId: string
  mergedFrom: string
  moved: {
  login: boolean
  identities: number
  records?: number
  cases?: number
  threads?: number
  bookings?: number
  loyaltyMembers?: number
  assets?: number
  uploadTokens?: number
  aiSessions?: number
  messages?: number
  conversations?: number
  }
  contact: Contact
}
```

**ContactLinkLoginResponse** (interface)
```typescript
interface ContactLinkLoginResponse {
  contactId: string
  linked: boolean
  contact: Contact
}
```

**PublicContactUpsertResponse** (interface)
```typescript
interface PublicContactUpsertResponse {
  ok: boolean
  contactId: string
}
```

**UserSearchResponse** (interface)
```typescript
interface UserSearchResponse {
  user: {
  uid: string,
  displayName: string | null,
  email: string | null,
  phoneNumber: string | null,
  photoURL: string | null
  },
  contact: ContactResponse | null
  existsAsContact: boolean
}
```

**ContactPublic** (interface)
```typescript
interface ContactPublic {
  contactId: string
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  company?: string | null
  avatarUrl?: string | null
  locale?: string | null
  timezone?: string | null
  email?: string | null
  phone?: string | null
  externalIds?: Record<string, any>
  customFields?: ContactCustomFields
}
```

**PublicGetMyContactResponse** (interface)
```typescript
interface PublicGetMyContactResponse {
  ok: boolean; contact: ContactPublic | null
}
```

**PublicUpdateMyContactResponse** (interface)
```typescript
interface PublicUpdateMyContactResponse {
  ok: boolean; contact: ContactPublic
}
```

**CommMethodMeta** (interface)
```typescript
interface CommMethodMeta {
  pushEndpoint?: string
  p256dh?: string
  auth?: string
  phone?: string
  email?: string
  subjectType?: SubjectType
  subjectId?: string
  productId?: string
}
```

**CommMethod** (interface)
```typescript
interface CommMethod {
  id?: string
  type: ChannelName
  meta?: CommMethodMeta
  verified?: boolean
  suppressed?: boolean
  createdAt?: string
}
```

**Subscription** (interface)
```typescript
interface Subscription {
  id: string // canonical key derived from subject (opaque to clients)
  subjectType: SubjectType
  subjectId: string
  productId?: string | null
  contactId: string
  source?: string // e.g., 'api'
  createdAt?: string
  deletedAt?: string | null
}
```

**PreferenceEntry** (interface)
```typescript
interface PreferenceEntry {
  subjectType?: SubjectType | null
  subjectId?: string | null
  channels?: Partial<Record<ChannelName, boolean>>
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<ChannelName, Record<string, boolean>>>
  updatedAt?: string
}
```

**CommsState** (interface)
```typescript
interface CommsState {
  methods?: CommMethod[]
  subscriptions?: Subscription[]
  preferences?: Record<string, PreferenceEntry>
}
```

**FieldCondition** (interface)
```typescript
interface FieldCondition {
  targetFieldId: string   // The field whose value is tested
  operator: ConditionOperator
  value?: unknown         // Required for equals / not_equals / contains / not_contains / greater_than / less_than
}
```

**ContactSchemaProperty** (interface)
```typescript
interface ContactSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array'
  title?: string
  description?: string
  format?: string
  enum?: string[]
  enumNames?: string[]
  default?: unknown
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
  conditions?: FieldCondition[]
  showWhen?: 'all' | 'any'
}
```

**ContactUiSchemaEntry** (interface)
```typescript
interface ContactUiSchemaEntry {
  'ui:disabled'?: true
  'ui:placeholder'?: string
  'ui:help'?: string
  'ui:widget'?: string
  'ui:options'?: {
  rows?: number        // textarea: number of visible rows
  accept?: string      // file: accepted MIME types
  label?: boolean      // checkbox: show inline label
  [key: string]: unknown
  }
  [key: string]: unknown
}
```

**ContactSchemaResponse** (interface)
```typescript
interface ContactSchemaResponse {
  schema: {
  type: 'object'
  required?: string[]
  properties: Record<string, ContactSchemaProperty>
  }
  uiSchema: Record<string, ContactUiSchemaEntry>
  fieldOrder: string[]
  settings: Record<string, unknown>
  styling: Record<string, unknown>
}
```

**ContactCustomFields** = `Record<string, any>`

**ContactResponse** = `Contact`

**ContactCreateRequest** = `Omit<`

**ContactUpdateRequest** = `Partial<ContactCreateRequest>`

**ContactMergeErrorCode** = ``

**PublicContactUpsertRequest** = `Partial<`

**ContactPatch** = `Partial<`

**ChannelName** = `import('./broadcasts').BroadcastChannel`

**SubjectType** = `'product' | 'proof' | 'batch'`

**ConditionOperator** = ``

### containers

**Container** (interface)
```typescript
interface Container {
  id: string
  orgId: string
  collectionId: string
  containerType: string
  ref?: string
  name?: string
  description?: string
  status: ContainerStatus
  metadata?: Record<string, any>
  parentContainerId?: string
  fixed?: boolean
  children?: Container[]
  items?: ContainerItem[]
  createdAt: string
  updatedAt: string
  deletedAt?: string
}
```

**ContainerItem** (interface)
```typescript
interface ContainerItem {
  id: string
  orgId: string
  containerId: string
  collectionId?: string
  itemType: ContainerItemType
  itemId: string
  productId?: string
  proofId?: string
  itemUid?: string | null
  addedAt: string
  removedAt?: string
  metadata?: Record<string, any>
}
```

**CreateContainerInput** (interface)
```typescript
interface CreateContainerInput {
  containerType: string
  ref?: string
  name?: string
  description?: string
  status?: ContainerStatus
  metadata?: Record<string, any>
  parentContainerId?: string
  fixed?: boolean
}
```

**UpdateContainerInput** (interface)
```typescript
interface UpdateContainerInput {
  containerType?: string
  ref?: string
  name?: string
  description?: string
  status?: ContainerStatus
  metadata?: Record<string, any>
  parentContainerId?: string | null
  fixed?: boolean
}
```

**AddContainerItemsInput** (interface)
```typescript
interface AddContainerItemsInput {
  items: Array<{
  itemType: ContainerItemType
  itemId: string
  productId?: string
  proofId?: string
  metadata?: Record<string, any>
  }>
}
```

**RemoveContainerItemsInput** (interface)
```typescript
interface RemoveContainerItemsInput {
  ids: string[]
}
```

**AddContainerItemsResponse** (interface)
```typescript
interface AddContainerItemsResponse {
  items: ContainerItem[]
}
```

**RemoveContainerItemsResponse** (interface)
```typescript
interface RemoveContainerItemsResponse {
  success: true
  removedCount: number
}
```

**GetContainerParams** (interface)
```typescript
interface GetContainerParams {
  tree?: boolean
  treeDepth?: number
  includeContents?: boolean
}
```

**ContainerStatus** = `'active' | 'archived' | string`

**ContainerItemType** = `'tag' | 'proof'`

**PublicListContainersParams** = `Omit<ListContainersParams, 'status' | 'ref'>`

### crate

**CrateItem** (interface)
```typescript
interface CrateItem {
  id: string                      // Item ID (tag ID)
  codeId: string                  // Code identifier
  batchId?: string                // Batch identifier
  productId?: string              // Product identifier
  claimId?: string                // Claim identifier
  productName?: string            // Product name
  productGtin?: string            // Product GTIN
  productImage?: string           // Product image URL
  data?: Record<string, any>      // Additional item data
}
```

**Crate** (interface)
```typescript
interface Crate {
  id: string                      // Crate ID
  items?: CrateItem[]             // Array of items in the crate
  deleted?: boolean               // Whether the crate is soft-deleted
  deletedAt?: string | null       // ISO 8601 timestamp when deleted
}
```

**CreateCrateRequest** (interface)
```typescript
interface CreateCrateRequest {
  items?: CrateItem[]             // Initial items for the crate
  [key: string]: any              // Additional fields
}
```

**UpdateCrateRequest** (interface)
```typescript
interface UpdateCrateRequest {
  items?: CrateItem[]             // Updated items
  [key: string]: any              // Additional fields
}
```

**DeleteCrateResponse** (interface)
```typescript
interface DeleteCrateResponse {
  success: boolean
}
```

### dpp

**DppRegistry** (interface)
```typescript
interface DppRegistry {
  environment: DppEnvironment
  label: string
  practice: boolean
  portal: string | null
  clientId: string | null
  kid: string | null
  alg: string | null
  orgIdentifier: string | null
  hasKey: boolean
  publicPem: string | null
  publicJwk: { kty: string; crv: string; x: string; y: string } | null
  thumbprint: string | null
  keyCreatedAt: string | null
  lastCheck: { ok: boolean; at: string; message: string; status?: number | null } | null
  ready: boolean
  nextStep: DppRegistryNextStep
}
```

**SetDppRegistryInput** (interface)
```typescript
interface SetDppRegistryInput {
  clientId?: string | null
  kid?: string | null
  orgIdentifier?: string | null
}
```

**DppRegistryProductGroup** (interface)
```typescript
interface DppRegistryProductGroup {
  code: string
  label: string
  productSubGroups: { code: string; label: string }[]
}
```

**DppRegistryCheckResult** (interface)
```typescript
interface DppRegistryCheckResult {
  registry: DppRegistry
  productGroups: DppRegistryProductGroup[]
}
```

**DppViewFields** (interface)
```typescript
interface DppViewFields {
  pub: string[]
  res1: string[]
  res2: string[]
  res3: string[]
}
```

**DppGroup** (interface)
```typescript
interface DppGroup {
  productGroup: string
  label: string
  subGroups: {
  productSubGroup: string
  label: string
  fields: DppViewFields
  required: DppViewFields
  }[]
}
```

**DppPassportCheck** (interface)
```typescript
interface DppPassportCheck {
  ready: boolean
  missing: Partial<DppViewFields>
  problem?: string
}
```

**DppRegistration** (interface)
```typescript
interface DppRegistration {
  status: "processing" | "registered" | "rejected" | "not-sent" | "error"
  taskId?: string
  submittedAt?: string
  correlationId?: string | null
  registryId?: string | null
  registeredAt?: string
  problems?: { code: string; message: string }[] | null
  checkedAt?: string
}
```

**DppPassport** (interface)
```typescript
interface DppPassport {
  id: string
  url: string
  status: "active" | "withdrawn"
  productGroup: string
  productSubGroup: string | null
  granularity: DppGranularity
  modelIdentifier: string | null
  batchIdentifier: string | null
  productId: string | null
  batchId: string | null
  proofId: string | null
  public: DppFields
  restricted: DppFields
  version: number
  contentUpdatedAt: string | null
  registration: Partial<Record<DppEnvironment, DppRegistration>>
  check: DppPassportCheck
  createdAt: string
  updatedAt: string
}
```

**DppPassportInput** (interface)
```typescript
interface DppPassportInput {
  productGroup?: string
  productSubGroup?: string | null
  granularity?: DppGranularity
  modelIdentifier?: string | null
  batchIdentifier?: string | null
  productId?: string | null
  batchId?: string | null
  proofId?: string | null
  public?: DppFields | null
  restricted?: DppFields | null
}
```

**DppPassportSaveResult** (interface)
```typescript
interface DppPassportSaveResult {
  passport: DppPassport
  changed: boolean
}
```

**DppPassportBulkResult** (interface)
```typescript
interface DppPassportBulkResult {
  results: (
  | { index: number; ok: true; id: string; url: string; created: boolean; changed: boolean; version: number; check: DppPassportCheck }
  | { index: number; ok: false; errorCode: string; errorText: string }
  )[]
  created: number
  changed: number
  unchanged: number
  failed: number
}
```

**DppPassportVersion** (interface)
```typescript
interface DppPassportVersion {
  version: number
  savedAt: string
  savedBy: string | null
}
```

**DppRegisterResult** (interface)
```typescript
interface DppRegisterResult {
  tasks: {
  taskId: string
  environment: DppEnvironment
  productGroup: string
  productSubGroup: string | null
  passportIds: string[]
  estimated: string | null
  status?: string
  outcome?: DppTaskOutcome | null
  passports?: ({ id: string } & Partial<DppRegistration>)[]
  }[]
  skipped: { id: string; reason: string; missing?: Partial<DppViewFields>; registryId?: string }[]
}
```

**DppTaskOutcome** (interface)
```typescript
interface DppTaskOutcome {
  outcomeResult: "SUCCEEDED" | "FAILED"
  outcomeMessage?: { code: string; message: string }
}
```

**DppTask** (interface)
```typescript
interface DppTask {
  taskId: string
  environment: DppEnvironment
  status: string | null
  outcome: DppTaskOutcome | null
  passportIds: string[]
  createdAt: string
  checkedAt: string | null
}
```

**DppTaskRefreshResult** (interface)
```typescript
interface DppTaskRefreshResult {
  taskId: string
  status: string | null
  outcome: DppTaskOutcome | null
  processingInfo: { submittedItems: number; compliantItems: number; nonCompliantItems: number } | null
  passports: ({ id: string } & Partial<DppRegistration>)[]
}
```

**DppDocument** (interface)
```typescript
interface DppDocument {
  digitalProductPassportId: string
  uniqueProductIdentifier: string
  granularity: string
  dppStatus: string
  lastUpdate: string
  contentSpecificationIds: string[]
  [field: string]: unknown
}
```

**DppEnvironment** = `"acc" | "prod" | "practice" | "local" | (string & {})`

**DppGranularity** = `"item" | "batch" | "model"`

**DppRegistryNextStep** = `"make-key" | "enter-service-account" | "enter-organisation-id" | "check" | "enrol-practice" | null`

**DppFields** = `Record<string, unknown>`

### error

**ErrorResponse** (interface)
```typescript
interface ErrorResponse {
  code: number
  errorCode?: string
  message: string
  details?: Record<string, any>
}
```

### facets

**FacetDefinition** (interface)
```typescript
interface FacetDefinition {
  id?: string
  orgId?: string
  collectionId?: string | null
  key: string
  name: string
  description?: string | null
  namespace?: string | null
  cardinality?: "single" | "multi"
  kind?: "system" | "custom"
  hierarchical?: boolean
  reserved?: boolean
  enabled?: boolean
  sortOrder?: number | null
  config?: Record<string, JsonValue>
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  values?: FacetValue[]
}
```

**FacetValue** (interface)
```typescript
interface FacetValue {
  id?: string
  orgId?: string
  collectionId?: string | null
  facetDefinitionId?: string
  facetKey: string
  key: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata?: Record<string, JsonValue>
  sortOrder?: number | null
  parentValueId?: string | null
  parentValueKey?: string | null
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  count?: number
}
```

**FacetDefinitionWriteInput** (interface)
```typescript
interface FacetDefinitionWriteInput {
  key?: string
  name: string
  description?: string | null
  namespace?: string | null
  cardinality?: "single" | "multi"
  kind?: "system" | "custom"
  hierarchical?: boolean
  reserved?: boolean
  enabled?: boolean
  sortOrder?: number | null
  config?: Record<string, JsonValue>
}
```

**FacetValueWriteInput** (interface)
```typescript
interface FacetValueWriteInput {
  key?: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata?: Record<string, JsonValue>
  sortOrder?: number | null
  parentValueKey?: string | null
  enabled?: boolean
}
```

**FacetValueResponse** (interface)
```typescript
interface FacetValueResponse {
  facet: FacetDefinition
  item: FacetValue
}
```

**FacetQueryRequest** (interface)
```typescript
interface FacetQueryRequest {
  facetKeys?: string[]
  includeEmpty?: boolean
  includeDeleted?: boolean
  namespace?: string | null
  q?: string
  createdAt?: DateRange
  updatedAt?: DateRange
  query?: ProductQueryRequest["query"] & {
  facetEquals?: Record<string, JsonValue | JsonValue[]>
  }
}
```

**FacetBucket** (interface)
```typescript
interface FacetBucket {
  facetKey: string
  valueKey: string
  name?: string
  count: number
}
```

**FacetListParams** (interface)
```typescript
interface FacetListParams {
  includeDeleted?: boolean
  kind?: "system" | "custom"
  reserved?: boolean
  namespace?: string
}
```

**PublicFacetListParams** (interface)
```typescript
interface PublicFacetListParams {
  namespace?: string
}
```

**FacetGetParams** (interface)
```typescript
interface FacetGetParams {
  includeValues?: boolean
  includeDeleted?: boolean
}
```

**FacetValueGetParams** (interface)
```typescript
interface FacetValueGetParams {
  includeDeleted?: boolean
}
```

**FacetListResponse** = `ListResult<FacetDefinition>`

**FacetNamespaceListResponse** = `ListResult<string>`

**FacetValueDefinition** = `FacetValue`

### files

**PutFileRequest** (interface)
```typescript
interface PutFileRequest {
  name: string
  text?: string
  base64?: string
  json?: unknown
  contentType?: string
  ttl?: FileTtl
  appId?: string
}
```

**FetchFileRequest** (interface)
```typescript
interface FetchFileRequest {
  url: string
  ttl?: FileTtl
  maxAge?: FileTtl
  force?: boolean
  appId?: string
}
```

**ExtractFileRequest** (interface)
```typescript
interface ExtractFileRequest {
  variant: FileExtractVariant
  schema?: Record<string, any>
  prompt?: string
  force?: boolean
}
```

**ExtractFileResponse** (interface)
```typescript
interface ExtractFileResponse {
  ok: true
  file: FileRecord
  text?: string
  data?: any
  cached: boolean
}
```

**ReadFileResponse** (interface)
```typescript
interface ReadFileResponse {
  ok: true
  text?: string
  base64?: string
  contentType: string | null
  size: number
}
```

**FileLinkResponse** (interface)
```typescript
interface FileLinkResponse {
  ok: true
  url: string
  expiresAt?: string
  permanent?: boolean
}
```

**FileRecord** = `Asset`

**FileTtl** = ``${number}h` | `${number}d` | number`

**FileExtractVariant** = `"text" | "markdown" | "ocr" | "json"`

### headless

**AppDataField** (interface)
```typescript
interface AppDataField {
  type: AppDataFieldType;
  label?: string;
  description?: string;
  required?: boolean;
  localized?: boolean;
  zone?: 'data' | 'owner' | 'admin';
  public?: boolean;
  to?: string;
  options?: string[];
  list?: string;
}
```

**AppValueListValue** (interface)
```typescript
interface AppValueListValue {
  code: string;
  label?: string;
  active?: boolean;
}
```

**AppValueList** (interface)
```typescript
interface AppValueList {
  label: string;
  description?: string;
  values: AppValueListValue[];
  editable?: boolean;
  public?: boolean;
}
```

**AppDataType** (interface)
```typescript
interface AppDataType {
  description: string;
  storage: AppDataStorage;
  visibility?: 'public' | 'owner' | 'admin';
  anchors?: Array<'product' | 'variant' | 'batch' | 'proof' | 'contact'>;
  fields: Record<string, AppDataField>;
  listing?: { sort?: string[]; filters?: string[] };
  examples?: Array<Record<string, unknown>>;
  read?: { list?: string; get?: string; notes?: string };
  since?: string;
  title?: string;
  label?: string;
  sublabel?: string;
  activeField?: string;
  orderField?: string;
  small?: boolean;
  setup?: boolean;
  checked?: boolean;
}
```

**AppDataDeclaration** (interface)
```typescript
interface AppDataDeclaration {
  schemaVersion: string;
  types: Record<string, AppDataType>;
  lists?: Record<string, AppValueList>;
}
```

**AppHeadlessDeclaration** (interface)
```typescript
interface AppHeadlessDeclaration {
  purpose: string;
  categories: HeadlessCategory[];
  primaryTypes: string[];
  editedIn: { label: string; adminPath?: string; notes?: string };
  render?: { guidance?: string; seo?: HeadlessSeoHelper[] };
}
```

**AppDataFieldType** = ``

**AppDataStorage** = ``

**HeadlessCategory** = ``

**HeadlessSeoHelper** = `'faqPage' | 'product' | 'article' | 'breadcrumbs' | 'organization' | 'localBusiness'`

### iframeResponder

**CachedData** (interface)
```typescript
interface CachedData {
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
  user?: {
  uid: string;
  email?: string;
  displayName?: string;
  accountData?: Record<string, any>;
  } | null;
  apps?: AppConfig[];
}
```

**IframeResponderOptions** (interface)
```typescript
interface IframeResponderOptions {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  version?: string;
  appUrl?: string;
  initialPath?: string;
  params?: Record<string, string>;
  isAdmin?: boolean;
  cache?: CachedData;
  onAuthLogin?: (
  token: string,
  user: any,
  accountData?: Record<string, any>
  ) => Promise<void>;
  onAuthLogout?: () => Promise<void>;
  onRouteChange?: (path: string, state: Record<string, string>) => void;
  onNavigable?: (info: { views: string[]; chrome: 'none' | 'full' }) => void;
  onNavigateResult?: (result: { ok: boolean; view: string | null; path: string | null; reason?: string }) => void;
  autoHeight?: boolean | { minHeight?: number };
  onResize?: (height: number) => void;
  onError?: (error: Error) => void;
  onReady?: () => void;
}
```

**RouteChangeMessage** (interface)
```typescript
interface RouteChangeMessage {
  type: 'smartlinks-route-change';
  path: string;
  context: Record<string, string>;
  state: Record<string, string> & {
  parentPath?: string;
  };
  appId?: string;
}
```

**SmartlinksIframeMessage** (interface)
```typescript
interface SmartlinksIframeMessage {
  _smartlinksIframeMessage: true;
  type:
  | 'smartlinks:resize'
  | 'smartlinks:redirect'
  | 'smartlinks:authkit:login'
  | 'smartlinks:authkit:logout'
  | 'smartlinks:authkit:redirect'
  | 'smartlinks:navigable'
  | 'smartlinks:navigate-result'
  | 'smartlinks:open-app';
  payload: Record<string, any>;
  messageId?: string;
}
```

**ProxyRequest** (interface)
```typescript
interface ProxyRequest {
  _smartlinksProxyRequest: true;
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
}
```

**CustomProxyRequest** (interface)
```typescript
interface CustomProxyRequest {
  _smartlinksProxyRequest: true;
  _smartlinksCustomProxyRequest: true;
  id: string;
  request: 'REDIRECT' | string;
  params: Record<string, any>;
}
```

**ProxyResponse** (interface)
```typescript
interface ProxyResponse {
  _smartlinksProxyResponse: true;
  id: string;
  data?: any;
  error?: string;
  statusCode?: number;
  errorBody?: any;
}
```

**ProxyStreamRequest** (interface)
```typescript
interface ProxyStreamRequest {
  _smartlinksProxyStreamRequest: true;
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
}
```

**ProxyStreamAbortMessage** (interface)
```typescript
interface ProxyStreamAbortMessage {
  _smartlinksProxyStreamAbort: true;
  id: string;
}
```

**ProxyStreamMessage** (interface)
```typescript
interface ProxyStreamMessage {
  _smartlinksProxyStream: true;
  id: string;
  phase: 'open' | 'event' | 'end' | 'error';
  data?: any;
  error?: string;
  status?: number;
}
```

**UploadStartMessage** (interface)
```typescript
interface UploadStartMessage {
  _smartlinksProxyUpload: true;
  phase: 'start';
  id: string;
  fields: [string, string][];
  fileInfo: { type?: string; name?: string; key?: string };
  path: string;
  headers?: Record<string, string>;
}
```

**UploadChunkMessage** (interface)
```typescript
interface UploadChunkMessage {
  _smartlinksProxyUpload: true;
  phase: 'chunk';
  id: string;
  seq: number;
  chunk: ArrayBuffer;
}
```

**UploadEndMessage** (interface)
```typescript
interface UploadEndMessage {
  _smartlinksProxyUpload: true;
  phase: 'end';
  id: string;
}
```

**UploadAckMessage** (interface)
```typescript
interface UploadAckMessage {
  _smartlinksProxyUpload: true;
  phase: 'ack';
  id: string;
  seq: number;
}
```

**UploadDoneMessage** (interface)
```typescript
interface UploadDoneMessage {
  _smartlinksProxyUpload: true;
  phase: 'done';
  id: string;
  ok: boolean;
  data?: any;
  error?: string;
}
```

**UploadMessage** = ``

### integrations

**FieldMapping** (interface)
```typescript
interface FieldMapping {
  targetPath: string
  sourcePath?: string
  transformType: TransformType
  transformExpression?: string
}
```

**FlowConnectionAuth** (interface)
```typescript
interface FlowConnectionAuth {
  method: FlowAuthMethod
  headerName?: string
  credentialRef?: string
}
```

**FlowConnection** (interface)
```typescript
interface FlowConnection {
  baseUrl?: string
  sendEndpoint?: string
  fetchEndpoint?: string
  defaultHeaders?: Record<string, string>
  auth?: FlowConnectionAuth
}
```

**FlowConnectorRef** (interface)
```typescript
interface FlowConnectorRef {
  appId: string
  preset?: string
  settings?: Record<string, unknown>
}
```

**EventMappingRule** (interface)
```typescript
interface EventMappingRule {
  id?: string
  match?: { types?: string[]; interactionIds?: string[]; outcomes?: string[]; appIds?: string[] }
  event: string
  attributes?: Record<string, string | number | boolean | { path: string; default?: unknown } | { value: unknown }>
}
```

**EventMapping** (interface)
```typescript
interface EventMapping {
  rules: EventMappingRule[]
  unmatched?: 'skip' | 'passthrough'
}
```

**IntegrationFlowConfig** (interface)
```typescript
interface IntegrationFlowConfig {
  signing?: { credentialRef: string; previousCredentialRef?: string }
  identity?: { policy?: IdentityPolicy; hashKeyCredentialRef?: string }
  eventMapping?: EventMapping
  envelopeFormat?: 'cloudevents'
  connection?: FlowConnection
  fieldMappings?: FieldMapping[]
  connector?: FlowConnectorRef
  [key: string]: any
}
```

**IntegrationFlow** (interface)
```typescript
interface IntegrationFlow {
  id: string
  orgId: string
  collectionId: string
  appId: string
  direction: FlowDirection
  name: string
  status: FlowStatus
  eventTypes: string[]
  schedule: string | null
  sourceEntity: FlowSourceEntity | string | null
  targetEntity: FlowTargetEntity | string | null
  config: IntegrationFlowConfig
  createdBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  lastRunAt?: string | null
  lastRunStatus?: string | null
  lastRunError?: string | null
  lastRunCount?: number | null
  lastPollAt?: string | null
  lastCursor?: string | null
  totalSynced?: number | null
  circuitOpenedAt?: string | null
  circuitProbeAt?: string | null
  circuitReason?: string | null
}
```

**FailedRecord** (interface)
```typescript
interface FailedRecord {
  id: string
  entityId?: string | null
  externalId?: string
  status: 'failed' | 'dead'
  attempts: number
  nextAttemptAt?: string | null
  lastError?: string | null
  updatedAt?: string
}
```

**FlowHealth** (interface)
```typescript
interface FlowHealth {
  flowId: string
  name: string
  direction: FlowDirection
  status: FlowStatus
  paused: { since: string; nextCheckAt: string | null; reason: string | null } | null
  running: { runId: string; startedAt: string; heartbeatAt: string | null; trigger: string; progress: Record<string, number | string> } | null
  lastRun: { at: string | null; status: string | null; error: string | null }
  last24h: {
  runs: number
  byStatus: Record<string, number>
  records: number
  delivered: number
  failed: number
  failureRate: number
  avgRunMs: number | null
  recordsPerSecond: number | null
  }
  backlog: {
  landed?: number
  waiting?: number
  oldestWaitingSince?: string | null
  delivered?: number
  retrying: number
  retriesDue: number
  gaveUp: number
  }
}
```

**IntegrationHealth** (interface)
```typescript
interface IntegrationHealth {
  flows: FlowHealth[]
  summary: { flows: number; active: number; paused: number; running: number; failedLast24h: number; gaveUp: number }
}
```

**ProductLineage** (interface)
```typescript
interface ProductLineage {
  productId: string
  sources: Array<{
  source: string
  externalId: string
  flow: { id: string; name: string }
  fetchedAt: string
  processedAt: string | null
  processedRunId: string | null
  status: string
  lastError: string | null
  currentMapping: boolean
  mapping: FieldMapping[]
  payload?: unknown
  }>
  deliveries: Array<{
  flow: { id: string; name: string }
  status: 'sent' | 'failed' | 'dead'
  lastSentAt: string | null
  attempts: number
  nextAttemptAt: string | null
  lastError: string | null
  lastRunId: string | null
  }>
  recentRuns: FlowRun[]
}
```

**CreateFlowInput** (interface)
```typescript
interface CreateFlowInput {
  appId: string
  direction: FlowDirection
  name: string
  status?: FlowStatus
  eventTypes?: string[]
  schedule?: string | null
  sourceEntity?: string | null
  targetEntity?: string | null
  config?: IntegrationFlowConfig
}
```

**RunFlowInput** (interface)
```typescript
interface RunFlowInput {
  entityId?: string
  trigger?: RunTrigger
}
```

**RunFlowSummary** (interface)
```typescript
interface RunFlowSummary {
  flowId: string
  direction: FlowDirection
  records: number
  sent?: number
  failed: number
  created?: number
  updated?: number
  skipped?: number
  held?: number
  status: RunStatus
  runId?: string
}
```

**InstalledConnector** (interface)
```typescript
interface InstalledConnector {
  appId: string
  name: string
  channel: string
  version: string | null
  connector: import('./appManifest').AppConnectorDeclaration
  installation: { connection: Record<string, unknown>; settings: Record<string, unknown> }
  secrets: Record<string, { set: boolean; hint?: string | null }>
}
```

**SaveConnectorInstallationInput** (interface)
```typescript
interface SaveConnectorInstallationInput {
  connection?: Record<string, unknown>
  settings?: Record<string, unknown>
}
```

**ConnectorEventsSchema** (interface)
```typescript
interface ConnectorEventsSchema {
  events: Array<{ name: string; title?: string; attributes?: Array<{ name: string; type?: string; required?: boolean }> }>
  limits?: { maxEvents?: number; maxAttributes?: number }
}
```

**ConnectorLookupInput** (interface)
```typescript
interface ConnectorLookupInput {
  installation: ConnectorInstallation
  identity: { externalId?: string | null; email?: string | null; phone?: string | null; emailHash?: string | null; phoneHash?: string | null; contactId?: string | null }
  want?: string[]
}
```

**ConnectorLookupResult** (interface)
```typescript
interface ConnectorLookupResult {
  found: boolean
  memberId?: string | null
  tier?: string | null
  points?: number | null
  status?: string | null
  attributes?: Record<string, unknown>
  asOf?: string | null
}
```

**EventEnvelope** (interface)
```typescript
interface EventEnvelope {
  specVersion: number
  id: string
  type: string
  entityType: string | null
  entityId: string | null
  occurredAt: string
  collectionId: string
  orgId: string
  appId: string | null
  identity: {
  contactId: string | null
  userId: string | null
  externalIds: Record<string, string>
  anonymousId: string | null
  sessionId: string | null
  emailHash?: string | null
  phoneHash?: string | null
  hashAlgorithm?: 'hmac-sha256' | null
  email?: string | null
  phone?: string | null
  }
  identityPolicy: IdentityPolicy
  product: { id: string; name?: string | null; sku?: string | null; gtin?: string | null; variantId?: string | null; batchId?: string | null } | null
  proof: { id: string } | null
  consent: { channels: Record<'email' | 'sms' | 'push' | 'whatsapp', 'opted_in' | 'opted_out' | 'suppressed' | 'unknown'>; topics: Record<string, boolean>; updatedAt: string | null } | null
  subject: Record<string, unknown>
  event?: { name: string; attributes: Record<string, unknown>; rule: string | null }
  attributes: Record<string, unknown>
}
```

**CapturedRequest** (interface)
```typescript
interface CapturedRequest {
  transport: string
  method: string
  url: string
  headers: Record<string, string>
  partitionKey?: string
  body: unknown
  bodyBytes: number
  truncated: boolean
}
```

**CapturedResponse** (interface)
```typescript
interface CapturedResponse {
  status: number | null
  ok: boolean | null
  headers: Record<string, string>
  body: unknown
  bodyBytes: number
  truncated: boolean
  error: string | null
}
```

**FlowRun** (interface)
```typescript
interface FlowRun {
  id: string
  flowId: string
  connectionId?: string | null
  trigger: RunTrigger
  triggerEvent?: string | null
  triggerEntityId?: string | null
  status: FlowRunStatus
  records: number
  sent: number
  failed: number
  error?: string | null
  correlationId?: string | null
  captureLevel: CaptureLevel
  bodiesPurged: boolean
  startedAt: string
  completedAt?: string | null
  durationMs?: number | null
}
```

**FlowRunItem** (interface)
```typescript
interface FlowRunItem {
  id: string
  runId: string
  entityType: string
  entityId?: string | null
  entityLabel?: string | null
  status: FlowRunItemStatus
  skipReason?: string | null
  request?: CapturedRequest | null
  response?: CapturedResponse | null
  attempt: number
  durationMs?: number | null
  createdAt: string
}
```

**LoggingWindow** (interface)
```typescript
interface LoggingWindow {
  id: string
  connectionId: string
  level: CaptureLevel
  enabledBy?: string | null
  enabledAt: string
  expiresAt?: string | null
  canceledAt?: string | null
}
```

**SetLoggingInput** (interface)
```typescript
interface SetLoggingInput {
  ttlMinutes?: number
  level?: 'full' | 'errors_only'
}
```

**RunFlowEnqueued** (interface)
```typescript
interface RunFlowEnqueued {
  enqueued: true
  flowId: string
  entityId: string | null
}
```

**SecretMeta** (interface)
```typescript
interface SecretMeta {
  ref: string
  name: string | null
  purpose: string
  hint: string
  keyVersion: number
  createdBy: string | null
  createdAt: string
  updatedAt: string
  rotatedAt?: string | null
}
```

**SetSecretInput** (interface)
```typescript
interface SetSecretInput {
  value: string
  name?: string
  purpose?: string
}
```

**SetSecretResult** (interface)
```typescript
interface SetSecretResult {
  ref: string
  hint: string
}
```

**ListSecretsQuery** (interface)
```typescript
interface ListSecretsQuery {
  purpose?: string
}
```

**RecordTypeInfo** (interface)
```typescript
interface RecordTypeInfo {
  appId: string
  recordType: string
  count: number
}
```

**FlowDirection** = `'inbound' | 'outbound'`

**FlowStatus** = `'draft' | 'active' | 'paused' | 'error'`

**RunStatus** = `'success' | 'partial' | 'error'`

**TransformType** = `'direct' | 'static' | 'template' | 'jsonata' | 'ai'`

**FlowAuthMethod** = `'api_key' | 'bearer' | 'basic' | 'webhook' | 'oauth2' | 'none'`

**IdentityPolicy** = `'externalIds' | 'hashed' | 'raw'`

**FlowSourceEntity** = `'product' | 'interaction' | 'contact' | 'event'`

**FlowTargetEntity** = `'product' | 'contact'`

**UpdateFlowInput** = `Partial<Omit<CreateFlowInput, 'direction'>> & {`

**ConnectorConsoleStep** = `'testConnection' | 'describeTarget' | 'sample' | 'shape' | 'serialize' | 'describeEvents' | 'lookup'`

**RunTrigger** = `'manual' | 'event' | 'schedule' | 'test'`

**FlowRunStatus** = `'running' | 'success' | 'partial' | 'failed' | 'skipped'`

**FlowRunItemStatus** = `'sent' | 'failed' | 'skipped'`

**CaptureLevel** = `'metadata' | 'errors_only' | 'full'`

**RunFlowResult** = `RunFlowSummary | RunFlowEnqueued`

### interaction

**AdminInteractionsCountsByOutcomeRequest** (interface)
```typescript
interface AdminInteractionsCountsByOutcomeRequest {
  appId?: string
  interactionId?: string
  scope?: string
  from?: string
  to?: string
  limit?: number
  dedupeLatest?: boolean
  idField?: IdField
}
```

**AdminInteractionsAggregateRequest** (interface)
```typescript
interface AdminInteractionsAggregateRequest {
  appId?: string
  interactionId?: string
  interactionIds?: string[]
  scope?: string
  outcome?: string | null
  from?: string
  to?: string
  limit?: number
  dedupeLatest?: boolean
  groupBy: string
  aggregate: {
  field: string
  ops: Array<'count' | 'sum' | 'avg' | 'min' | 'max'>
  }
}
```

**AdminInteractionsAggregateResponse** (interface)
```typescript
interface AdminInteractionsAggregateResponse {
  groupBy: string
  aggregate: {
  field: string
  ops: Array<'count' | 'sum' | 'avg' | 'min' | 'max'>
  dedupeLatest?: boolean
  }
  rows: AdminInteractionsAggregateRow[]
}
```

**AdminInteractionsAggregateRow** (interface)
```typescript
interface AdminInteractionsAggregateRow {
  groupValue: string | null
  eventCount: number
  count?: number
  sum?: number
  avg?: number
  min?: number
  max?: number
}
```

**PublicInteractionsCountsByOutcomeRequest** (interface)
```typescript
interface PublicInteractionsCountsByOutcomeRequest {
  appId: string
  interactionId: string
  scope?: string
  from?: string
  to?: string
  limit?: number
}
```

**InteractionEventRow** (interface)
```typescript
interface InteractionEventRow {
  orgId: string
  collectionId: string
  timestamp: string
  appId?: string
  interactionId?: string  // a link to a Interaction Object
  scope?: string       // a customizable string to segment interactions
  broadcastId?: string
  userId?: string
  contactId?: string
  outcome?: string | null
  metadata?: Record<string, unknown>
  [k: string]: unknown
}
```

**OutcomeCount** (interface)
```typescript
interface OutcomeCount {
  outcome: string | null; count: number
}
```

**InteractionEventBase** (interface)
```typescript
interface InteractionEventBase {
  collectionId: string,
  orgId?: string,
  userId?: string
  contactId?: string
  interactionId: string
  scope?: string
  appId?: string
  broadcastId?: string
  journeyId?: string
  productId?: string
  proofId?: string
  variantId?: string
  batchId?: string
  source?: string,
  eventType?: string
  outcome?: string
  timestamp?: string
  metadata?: Record<string, unknown>
  [k: string]: any
}
```

**InteractionPermissions** (interface)
```typescript
interface InteractionPermissions {
  enabled?: boolean
  requireAuth?: boolean
  allowPublicSubmit?: boolean
  allowAnonymousSubmit?: boolean
  allowedOrigins?: string[]
  startAt?: string
  endAt?: string
  uniquePerUser?: boolean
  uniquePerUserWindowSeconds?: number
  uniqueOutcome?: string
  allowPublicSummary?: boolean
  allowAuthenticatedSummary?: boolean
  allowOwnRead?: boolean
  uniquePerAnonId?: boolean
  uniquePerAnonIdWindowSeconds?: number
}
```

**InteractionDisplay** (interface)
```typescript
interface InteractionDisplay {
  title?: string
  description?: string
  icon?: string
  color?: string
}
```

**InteractionTypeRecord** (interface)
```typescript
interface InteractionTypeRecord {
  id?: string
  collectionId: string
  appId: string
  permissions?: InteractionPermissions
  data?: {
  display?: InteractionDisplay
  scopes?: Record<string, InteractionDisplay>
  interactionType?: string
  effects?: InteractionEffect[]
  [key: string]: unknown
  }
  createdAt: string
}
```

**CreateInteractionTypeBody** (interface)
```typescript
interface CreateInteractionTypeBody {
  id?: string
  appId: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}
```

**EnsureInteractionTypeInput** (interface)
```typescript
interface EnsureInteractionTypeInput {
  appId: string
  key: string
  permissions?: InteractionPermissions
  display?: InteractionDisplay
  data?: Record<string, unknown>
}
```

**UpdateInteractionTypeBody** (interface)
```typescript
interface UpdateInteractionTypeBody {
  appId?: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}
```

**SubmitInteractionResponse** (interface)
```typescript
interface SubmitInteractionResponse {
  success: true
  eventId: string
}
```

**SubmitInteractionError** (interface)
```typescript
interface SubmitInteractionError {
  error: 'FORBIDDEN'
  reason:
  | 'not_public'
  | 'auth_required'
  | 'duplicate'
  | 'duplicate_anon'
  | 'disabled'
  | 'before_start'
  | 'after_end'
  | 'origin_forbidden'
}
```

**InteractionEffect** (interface)
```typescript
interface InteractionEffect {
  type: EffectType
  config?: EffectConfig
}
```

**LoyaltyEffectConfig** (interface)
```typescript
interface LoyaltyEffectConfig {
  [key: string]: never
}
```

**TransactionalEffectConfig** (interface)
```typescript
interface TransactionalEffectConfig {
  templateId: string
  channel?: 'email' | 'sms' | 'push' | 'whatsapp' | 'wallet' | 'preferred'
  props?: Record<string, unknown>
  include?: {
  productId?: string
  proofId?:   string
  user?:      boolean
  appCase?:   string
  appThread?: string
  appRecord?: string
  }
  appId?: string
}
```

**WebhookEffectConfig** (interface)
```typescript
interface WebhookEffectConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: Record<string, unknown>
  timeout?: number
}
```

**TagEffectConfig** (interface)
```typescript
interface TagEffectConfig {
  tags: string[]
  action?: 'add' | 'remove'
}
```

**AppRecordEffectConfig** (interface)
```typescript
interface AppRecordEffectConfig {
  appId?: string
  recordType?: string
  singletonPer?: string
  data?: Record<string, unknown>
  anchors?: {
  productId?: string
  proofId?:   string
  variantId?: string
  batchId?:   string
  }
}
```

**SegmentEffectConfig** (interface)
```typescript
interface SegmentEffectConfig {
  segmentId: string
  action?: 'add' | 'remove'
}
```

**InteractionEventContext** (interface)
```typescript
interface InteractionEventContext {
  eventId:       string | null
  collectionId:  string
  appId:         string | null
  interactionId: string | null
  contactId:     string | null
  userId:        string | null
  productId:     string | null
  proofId:       string | null
  variantId:     string | null
  batchId:       string | null
  outcome:       string | null
  eventType:     string | null
  source:        string | null
  timestamp:     string | null
  metadata:      Record<string, unknown>
  broadcastId:   string | null
  journeyId:     string | null
}
```

**EffectType** = ``

**EffectConfig** = ``

### itemContext

**ItemContext** (interface)
```typescript
interface ItemContext {
  isAuthentic: boolean
  status: ItemContextStatus
  source: 'nfc' | 'serial'
  errorMessage?: string
  isRescan?: boolean
  tag?: TagContext
  checkedAt: number
}
```

**ItemContextStatus** = ``

### jobs

**Job** (interface)
```typescript
interface Job {
  id: number
  task: string
  payload: any
  priority: number
  runAt: string | null
  createdAt: string
  attempts: number
  lastError: string | null
  lockedAt: string | null
  key: string | null
  queueName: string | null
  status: JobStatus
}
```

**EnqueueAsyncJobRequest** (interface)
```typescript
interface EnqueueAsyncJobRequest {
  task: string
  payload?: Record<string, any>
  runAt?: string | Date
  priority?: number
  key?: string
  queueName?: string
}
```

**EnqueueAsyncJobResponse** (interface)
```typescript
interface EnqueueAsyncJobResponse {
  id: number
  task: string
  runAt?: string
  key?: string
}
```

**JobStatus** = `'queued' | 'running' | 'errored'`

### journeys

**JourneyRecord** (interface)
```typescript
interface JourneyRecord {
  id: string
  collectionId: string
  appId?: string
  name: string
  active: boolean
  journeyType: 'event_triggered' | 'scheduled'
  data?: {
  display?: {
  title?: string
  description?: string
  icon?: string
  color?: string
  }
  steps?: Array<{ id: string; type: string; config?: Record<string, unknown> }>
  triggers?: Array<{ type: string; config?: Record<string, unknown> }>
  entryRules?: any[]
  exitRules?: any[]
  metadata?: Record<string, unknown>
  [key: string]: unknown
  }
  createdAt: string
  updatedAt: string
}
```

**CreateJourneyBody** (interface)
```typescript
interface CreateJourneyBody {
  appId?: string
  name: string
  active?: boolean
  journeyType: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}
```

**UpdateJourneyBody** (interface)
```typescript
interface UpdateJourneyBody {
  appId?: string
  name?: string
  active?: boolean
  journeyType?: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}
```

### journeysAnalytics

**JourneyStatsRequest** (interface)
```typescript
interface JourneyStatsRequest {
  idField?: IdField // 'userId' | 'contactId'
  from?: string
  to?: string
  finalStepId?: string
  stepMappings?: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}
```

**JourneyStatsResponse** (interface)
```typescript
interface JourneyStatsResponse {
  journeyId: string
  totalEntered: number
  currentlyActive?: number
  completed?: number
  exitedViaGoal?: number
  lastUpdated: string
  stepStats: Array<{ stepId: string; entered: number; completed: number; pending: number }>
}
```

**JourneyFunnelReportRequest** (interface)
```typescript
interface JourneyFunnelReportRequest {
  idField?: IdField
  periodStart?: string
  periodEnd?: string
  stepMappings: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}
```

**JourneyFunnelReportResponse** (interface)
```typescript
interface JourneyFunnelReportResponse {
  journeyId: string
  periodStart: string | null
  periodEnd: string | null
  steps: Array<{
  stepId: string
  enteredCount: number
  completedCount: number
  conversionRate: number
  avgTimeToComplete: number | null
  }>
}
```

### knowledge

**KnowledgeSet** (interface)
```typescript
interface KnowledgeSet {
  id: string
  key: string
  name: string
  description: string | null
  visibility: KnowledgeVisibility
  ownerAppId: string | null
  embedModel: string | null
  createdAt: string
  updatedAt: string
  sourceCount?: number
  passageCount?: number
}
```

**SaveKnowledgeSetRequest** (interface)
```typescript
interface SaveKnowledgeSetRequest {
  key: string
  name: string
  description?: string | null
  visibility?: KnowledgeVisibility
}
```

**UpdateKnowledgeSetRequest** (interface)
```typescript
interface UpdateKnowledgeSetRequest {
  name?: string
  description?: string | null
  visibility?: KnowledgeVisibility
}
```

**KnowledgeSource** (interface)
```typescript
interface KnowledgeSource {
  id: string
  setId: string
  kind: KnowledgeSourceKind
  name: string | null
  config: Record<string, any>
  refreshHours: number | null
  status: 'pending' | 'indexing' | 'ready' | 'failed'
  error: string | null
  passageCount: number
  lastIndexedAt: string | null
  createdAt: string
  updatedAt: string
}
```

**AddKnowledgeSourceRequest** (interface)
```typescript
interface AddKnowledgeSourceRequest {
  kind: KnowledgeSourceKind
  config?: { url?: string; [key: string]: any }
  name?: string
  refreshHours?: number | null
}
```

**UpdateKnowledgeSourceRequest** (interface)
```typescript
interface UpdateKnowledgeSourceRequest {
  config?: { url?: string; [key: string]: any }
  name?: string
  refreshHours?: number | null
}
```

**KnowledgeDocument** (interface)
```typescript
interface KnowledgeDocument {
  ref: string
  title: string
  body: string
  url?: string
  meta?: Record<string, any>
}
```

**KnowledgeSearchResult** (interface)
```typescript
interface KnowledgeSearchResult {
  id: string
  title: string
  heading: string | null
  url: string | null
  snippet: string
  text: string
  score: number
  set: { id: string; key: string; name: string }
  sourceId: string
  meta: Record<string, any>
}
```

**KnowledgeSearchResponse** (interface)
```typescript
interface KnowledgeSearchResponse {
  query: string
  results: KnowledgeSearchResult[]
  mode: 'hybrid' | 'keywords' | 'none'
}
```

**KnowledgeVisibility** = `'public' | 'customer' | 'staff'`

**KnowledgeSourceKind** = ``

### list

**ListResult<T>** (interface)
```typescript
interface ListResult<T> {
  items: T[]
  nextCursor: string | null
  count?: number
}
```

**ListOptions** (interface)
```typescript
interface ListOptions {
  limit?: number
  cursor?: string
}
```

**DateRange** (interface)
```typescript
interface DateRange {
  gte?: string | Date
  lte?: string | Date
}
```

**SortDirection** = `'asc' | 'desc'`

### location

**Location** (interface)
```typescript
interface Location {
  locationId: string
  collectionId: string | null
  scope: 'global' | 'collection'
  name: string
  category?: string
  description?: string
  countryName?: string
  countryCode?: string
  websiteUrl?: string
  logoUrl?: string
  phone?: string
  email?: string
  geofence?: Geofence | {}
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}
```

**Geofence** = ``

**LocationPayload** = `Omit<`

### lots

**LotPayload** (interface)
```typescript
interface LotPayload {
  manufacturedAt?: string | null
  expiresAt?: string | null
  location?: string | null
  custom?: Record<string, any>
  [key: string]: any
}
```

**Lot** (interface)
```typescript
interface Lot {
  id: string
  collectionId: string
  lotNumber: string
  name?: string | null
  description?: string | null
  status: LotStatus
  selector: LotSelector
  payload?: LotPayload
  destination?: Record<string, any> | null
  productCount: number
  productIds?: string[]
  resolvedAt?: string | null
  createdBy?: string | null
  updatedBy?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}
```

**LotCreateInput** (interface)
```typescript
interface LotCreateInput {
  lotNumber: string
  name?: string
  description?: string
  selector?: LotSelector
  payload?: LotPayload
  destination?: Record<string, any> | null
  status?: LotStatus
  id?: string
}
```

**LotMemberDiff** (interface)
```typescript
interface LotMemberDiff {
  added: string[]; removed: string[]
}
```

**ResolveLotResponse** (interface)
```typescript
interface ResolveLotResponse {
  lot: Lot; diff: LotMemberDiff
}
```

**LotProductSummary** (interface)
```typescript
interface LotProductSummary {
  id: string; name?: string; gtin?: string | null
}
```

**LotResolutionResult** (interface)
```typescript
interface LotResolutionResult {
  match: 'batch' | 'lot' | 'product' | 'none'
  productId: string
  batchId: string | null
  lotId: string | null
  ai10: string | null
  destination?: any
}
```

**LotStatus** = `'open' | 'closed' | 'recalled' | 'archived'`

**LotSelector** = ``

**LotUpdateInput** = `Partial<LotCreateInput>`

### loyalty

**LoyaltyScheme** (interface)
```typescript
interface LoyaltyScheme {
  id: string
  orgId: string
  collectionId: string
  name: string
  type: string
  active: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
  deletedAt: string | null // ISO
  data: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**LoyaltyMember** (interface)
```typescript
interface LoyaltyMember {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  contactId: string
  userId: string | null
  balance: number
  lifetimePoints: number
  createdAt: string // ISO
  updatedAt: string // ISO
  data: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**LoyaltyTransaction** (interface)
```typescript
interface LoyaltyTransaction {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  memberId: string
  points: number
  reason: string | null
  idempotencyKey: string | null
  metadata: DataBlock
  createdAt: string // ISO
}
```

**LoyaltyEarningRule** (interface)
```typescript
interface LoyaltyEarningRule {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  interactionId: string
  points: number
  conditions: Record<string, string>
  maxPerContact: number | null
  cooldownHours: number | null
  active: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
  data: DataBlock
}
```

**LoyaltyTransactionResult** (interface)
```typescript
interface LoyaltyTransactionResult {
  member: LoyaltyMember
  transaction: LoyaltyTransaction
}
```

**CreateLoyaltySchemeBody** (interface)
```typescript
interface CreateLoyaltySchemeBody {
  name: string
  type: string
  active?: boolean
  data?: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**UpdateLoyaltySchemeBody** (interface)
```typescript
interface UpdateLoyaltySchemeBody {
  name?: string
  type?: string
  active?: boolean
  data?: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**CreateLoyaltyEarningRuleBody** (interface)
```typescript
interface CreateLoyaltyEarningRuleBody {
  interactionId: string
  points: number
  conditions?: Record<string, string>
  maxPerContact?: number | null
  cooldownHours?: number | null
  active?: boolean
  data?: DataBlock
}
```

**UpdateLoyaltyEarningRuleBody** (interface)
```typescript
interface UpdateLoyaltyEarningRuleBody {
  points?: number
  conditions?: Record<string, string>
  maxPerContact?: number | null
  cooldownHours?: number | null
  active?: boolean
  data?: DataBlock
}
```

**RecordLoyaltyTransactionBody** (interface)
```typescript
interface RecordLoyaltyTransactionBody {
  points: number
  reason?: string
  idempotencyKey?: string
  metadata?: DataBlock
  userId?: string
}
```

**DataBlock** = `Record<string, unknown>`

### navigation

**ResolveLinkContext** (interface)
```typescript
interface ResolveLinkContext {
  embedded?: boolean;
  postTarget?: Window | null;
  win?: Window;
  track?: LinkTrackingContext;
}
```

**ResolvedLink** (interface)
```typescript
interface ResolvedLink {
  navigate(): void;
  describe(): string;
}
```

**LinkOpenTarget** = `'_self' | '_blank'`

**LinkTarget** = ``

**LinkTrackingContext** (type)
```typescript
type LinkTrackingContext = { collectionId: string }
```

### nfc

**NfcTagInfo** (interface)
```typescript
interface NfcTagInfo {
  id: string
  tagId: string
  claimSetId: string
  collectionId?: string
  productId?: string
  batchId?: string
  variantId?: string
  proofId?: string
  index?: number
  data?: Record<string, any>
}
```

**NfcValidateRequest** (interface)
```typescript
interface NfcValidateRequest {
  claimSetId: string
  codeId: string
  mirror?: string
  d?: string
  c?: string
  userId?: string
}
```

**NfcValidateResponse** (interface)
```typescript
interface NfcValidateResponse {
  claimSetId: string
  codeId: string
  tagId: string
  index?: number
  isAdmin: boolean
  path?: string
  collectionId?:  string
  collection?:  Record<string, any>
  count: number,
  previousCount: number
  data?: Record<string, any>
  productId?:  string
  product?:  Record<string, any>
  batchId?:  string
  variantId?:  string
  proofId?:  string
}
```

**NfcClaimTagRequest** (interface)
```typescript
interface NfcClaimTagRequest {
  claimSetId: string
  codeId: string
  data: Record<string, any>
}
```

**TagContext** (interface)
```typescript
interface TagContext {
  status: TagStatus
  tagId?: string
  claimSetId?: string
  codeId?: string
  count?: number
  previousCount?: number
  data?: Record<string, unknown>
  source: 'nfc-validate' | 'nfc-lookup' | 'tag-index' | 'none'
  validatedAt: number
  errorMessage?: string
}
```

**TagStatus** = `'valid' | 'rescan' | 'invalid' | 'error'`

### operations

**WorkOrderStage** (interface)
```typescript
interface WorkOrderStage {
  key: string
  position: number
  status: WorkOrderStageStatus
  plannedStart: string | null
  plannedEnd: string | null
  startedAt: string | null
  doneAt: string | null
  quantityDone: number
  quantityScrapped: number
  data: Record<string, any>
}
```

**WorkOrder** (interface)
```typescript
interface WorkOrder {
  id: string
  collectionId: string
  appId: string
  ref: string
  kind: string | null
  productId: string | null
  variantId: string | null
  quantity: number
  unit: string
  dueAt: string | null
  priority: number
  status: WorkOrderStatus
  statusReason: string | null
  orderId: string | null
  orderItemId: string | null
  parentId: string | null
  outputBatchId: string | null
  stages: WorkOrderStage[]
  currentStage: string | null
  late: boolean
  data: Record<string, any>
  createdBy: string | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
}
```

**CreateWorkOrderInput** (interface)
```typescript
interface CreateWorkOrderInput {
  ref: string
  kind?: string
  productId?: string
  variantId?: string
  quantity?: number
  unit?: string
  dueAt?: string | null
  priority?: number
  orderId?: string
  orderItemId?: string
  parentId?: string
  outputBatchId?: string
  data?: Record<string, any>
  stages?: WorkOrderStageInput[]
}
```

**WorkOrderListParams** (interface)
```typescript
interface WorkOrderListParams {
  status?: WorkOrderStatus | WorkOrderStatus[]
  appId?: string
  productId?: string
  orderId?: string
  parentId?: string
  kind?: string
  late?: boolean
  dueFrom?: string
  dueTo?: string
  q?: string
  sort?: 'due' | 'priority' | 'created' | 'ref'
  limit?: number
  offset?: number
}
```

**WorkOrdersApi** (interface)
```typescript
interface WorkOrdersApi {
  get(idOrRef: string): Promise<WorkOrder | null>
  list(params?: WorkOrderListParams): Promise<{ items: WorkOrder[]; total: number; limit: number; offset: number }>
  create(input: CreateWorkOrderInput): Promise<WorkOrder>
  update(idOrRef: string, patch: UpdateWorkOrderInput, opts?: { reason?: string }): Promise<WorkOrder>
  setStatus(idOrRef: string, status: WorkOrderStatus, opts?: { reason?: string }): Promise<WorkOrder>
  remove(idOrRef: string): Promise<{ id: string; deleted: true }>
  startStage(idOrRef: string, stage: string): Promise<WorkOrder>
  progress(idOrRef: string, stage: string, by: { done?: number; scrapped?: number }, opts?: { reason?: string; note?: string }): Promise<WorkOrder>
  completeStage(idOrRef: string, stage: string, opts?: { closeWorkOrder?: boolean }): Promise<WorkOrder>
  skipStage(idOrRef: string, stage: string, opts: { reason: string }): Promise<WorkOrder>
  planStage(idOrRef: string, stage: string, plan: { plannedStart?: string | null; plannedEnd?: string | null; data?: Record<string, any> }): Promise<WorkOrder>
  setStages(idOrRef: string, stages: WorkOrderStageInput[]): Promise<WorkOrder>
}
```

**StockTarget** (interface)
```typescript
interface StockTarget {
  type: string; id: string
}
```

**StockLine** (interface)
```typescript
interface StockLine {
  id: string
  containerId: string
  productId: string
  variantId: string | null
  batchId: string | null
  state: StockState
  allocatedTo: StockTarget | null
  quantity: number
  unit: string
  updatedAt: string
}
```

**StockTotals** (interface)
```typescript
interface StockTotals {
  available: number; allocated: number; held: number; quarantine: number; total: number; unit: string | null
}
```

**StockItem** (interface)
```typescript
interface StockItem {
  productId: string; variantId?: string; batchId?: string; quantity: number; unit?: string
}
```

**StockMovementExtras** (interface)
```typescript
interface StockMovementExtras {
  workOrderId?: string; reason?: string; note?: string
}
```

**StockMovementOptions** (interface)
```typescript
interface StockMovementOptions {
  idempotencyKey?: string
}
```

**StockMovement** (interface)
```typescript
interface StockMovement {
  movementId: string
  kind: 'receive' | 'produce' | 'consume' | 'move' | 'allocate' | 'release' | 'hold' | 'unhold' | 'adjust'
  productId: string
  quantity: number
  unit: string
  from?: (StockLine & { emptied?: boolean }) | null
  to?: StockLine | null
  replayed: boolean
}
```

**StockPosition** (interface)
```typescript
interface StockPosition {
  product: { id: string; variantId: string | null; name: string | null; unit: string | null }
  onHand: StockTotals
  where: Array<{ containerId: string; container: StockWhereLine['container']; path: string; place: StockWhereLine['place']; quantity: number; batchId: string | null; state: StockState; allocatedTo: StockTarget | null }>
  onOrder: { total: number; lines: Array<{ orderId: string; orderRef: string | null; supplier: string | null; quantity: number; dueAt: string | null }> }
  beingMade: { total: number; lines: Array<{ workOrderId: string; ref: string; quantity: number; stage: string | null; status: WorkOrderStatus; dueAt: string | null }> }
  needed: { total: number; lines: Array<{ orderId?: string; orderRef?: string | null; workOrderId?: string; ref?: string; forProductId: string; quantity: number; neededBy: string | null; why: 'ordered' | 'work order' | 'order, not yet in production' }> }
  projected: Array<{ date: string; balance: number }>
  shortfall: { quantity: number; firstShortOn: string } | null
  horizonDays: number
  undatedLines?: number
  asOf: string
  sources: { stock: string; orders: string; workOrders: string }
}
```

**StockApi** (interface)
```typescript
interface StockApi {
  lines(params?: { containerId?: string; productId?: string; variantId?: string; batchId?: string; state?: StockState; allocatedTo?: StockTarget; limit?: number; offset?: number }): Promise<{ items: StockLine[]; total: number; limit: number; offset: number }>
  totals(params: { productId: string; variantId?: string; batchId?: string }): Promise<StockTotals>
  where(params: { productId: string; variantId?: string; batchId?: string; state?: StockState }): Promise<StockWhereLine[]>
  position(params: { productId: string; variantId?: string; horizonDays?: number; includeWhere?: boolean }): Promise<StockPosition>
  short(params?: { horizonDays?: number; limit?: number }): Promise<{ horizonDays: number; items: Array<{ product: StockPosition['product']; shortfall: NonNullable<StockPosition['shortfall']>; onHand: StockTotals; onOrder: number; beingMade: number; needed: number }>; checked: number; asOf: string }>
  receive(input: StockItem & StockMovementExtras & { containerId: string; state?: 'available' | 'held' | 'quarantine' }, opts?: StockMovementOptions): Promise<StockMovement>
  produce(input: StockItem & StockMovementExtras & { containerId: string; state?: 'available' | 'held' | 'quarantine' }, opts?: StockMovementOptions): Promise<StockMovement>
  consume(input: StockItem & StockMovementExtras & { containerId: string; allocatedTo?: StockTarget }, opts?: StockMovementOptions): Promise<StockMovement>
  move(input: StockItem & StockMovementExtras & { from: string; to: string; state?: StockState; allocatedTo?: StockTarget }, opts?: StockMovementOptions): Promise<StockMovement>
  allocate(input: StockItem & StockMovementExtras & { containerId: string; to: StockTarget }, opts?: StockMovementOptions): Promise<StockMovement>
  release(input: StockItem & StockMovementExtras & { containerId: string; from: StockTarget }, opts?: StockMovementOptions): Promise<StockMovement>
  hold(input: StockItem & StockMovementExtras & { containerId: string; state?: 'held' | 'quarantine'; reason: string }, opts?: StockMovementOptions): Promise<StockMovement>
  unhold(input: StockItem & StockMovementExtras & { containerId: string; state?: 'held' | 'quarantine'; reason: string }, opts?: StockMovementOptions): Promise<StockMovement>
  adjust(input: Omit<StockItem, 'quantity'> & StockMovementExtras & { containerId: string; by: number; state?: 'available' | 'held' | 'quarantine'; reason: string }, opts?: StockMovementOptions): Promise<StockMovement>
}
```

**BomLine** (interface)
```typescript
interface BomLine {
  componentProductId: string; componentVariantId?: string | null; quantity: number; unit?: string; optional?: boolean; note?: string | null
}
```

**Bom** (interface)
```typescript
interface Bom {
  id: string
  productId: string
  variantId: string | null
  version: number
  validFrom: string
  validTo: string | null
  yields: number
  note: string | null
  lines: Array<{ componentProductId: string; componentVariantId: string | null; quantity: number; unit: string; optional: boolean; note: string | null }>
  data: Record<string, any>
  createdBy: string | null
  createdAt: string
}
```

**BomTreeNode** (interface)
```typescript
interface BomTreeNode {
  productId: string; variantId: string | null; quantity: number; unit: string; optional: boolean; components: BomTreeNode[]
}
```

**BomExplosion** (interface)
```typescript
interface BomExplosion {
  productId: string
  variantId: string | null
  quantity: number
  hasBom: boolean
  tree: BomTreeNode[]
  materials: Array<{ productId: string; variantId: string | null; quantity: number; unit: string }>
}
```

**BomsApi** (interface)
```typescript
interface BomsApi {
  current(params: { productId: string; variantId?: string; at?: string }): Promise<Bom | null>
  versions(params: { productId: string; variantId?: string }): Promise<Bom[]>
  whereUsed(params: { componentProductId: string }): Promise<Array<{ productId: string; variantId: string | null; quantity: number; unit: string; yields: number; optional: boolean }>>
  explode(params: { productId: string; variantId?: string; quantity?: number; at?: string; includeOptional?: boolean }): Promise<BomExplosion>
  set(input: { productId: string; variantId?: string; lines: BomLine[]; yields?: number; note?: string; validFrom?: string; data?: Record<string, any> }): Promise<Bom>
  end(params: { productId: string; variantId?: string }): Promise<Bom | null>
}
```

**MadeFromSubject** (interface)
```typescript
interface MadeFromSubject {
  type: 'batch' | 'proof'; id: string
}
```

**MadeFromSource** (interface)
```typescript
interface MadeFromSource {
  type: 'batch' | 'proof' | 'product'; id: string
}
```

**MadeFromEntry** (interface)
```typescript
interface MadeFromEntry {
  id: string
  subject: MadeFromSubject
  source: MadeFromSource
  productId: string | null
  quantity: number | null
  unit: string | null
  workOrderId: string | null
  at: string
  by: string | null
  endedAt: string | null
  data: Record<string, any>
}
```

**MadeFromTraceNode** (interface)
```typescript
interface MadeFromTraceNode {
  source: MadeFromSource; productId: string | null; quantity: number | null; unit: string | null; at: string; workOrderId: string | null; madeFrom: MadeFromTraceNode[]
}
```

**MadeFromApi** (interface)
```typescript
interface MadeFromApi {
  of(subject: MadeFromSubject, opts?: { at?: string; includeEnded?: boolean }): Promise<MadeFromEntry[]>
  usedIn(source: MadeFromSource, opts?: { includeEnded?: boolean }): Promise<MadeFromEntry[]>
  trace(subject: MadeFromSubject, opts?: { depth?: number }): Promise<{ subject: MadeFromSubject; madeFrom: MadeFromTraceNode[] }>
  record(input: { subject: MadeFromSubject; sources: Array<MadeFromSource & { productId?: string; quantity?: number; unit?: string; data?: Record<string, any> }>; workOrderId?: string; at?: string }): Promise<MadeFromEntry[]>
  end(id: string, opts: { reason: string }): Promise<MadeFromEntry>
}
```

**OperationStep** (interface)
```typescript
interface OperationStep {
  op: string; args: any[]
}
```

**OperationsApi** (interface)
```typescript
interface OperationsApi {
  transaction(steps: OperationStep[]): Promise<{ results: any[] }>
}
```

**OperationsAdmin** (interface)
```typescript
interface OperationsAdmin {
  workOrders: WorkOrdersApi
  stock: StockApi
  boms: BomsApi
  madeFrom: MadeFromApi
  transaction: OperationsApi['transaction']
}
```

**WorkOrderStatus** = `'open' | 'on-hold' | 'blocked' | 'done' | 'cancelled'`

**WorkOrderStageStatus** = `'pending' | 'active' | 'done' | 'skipped'`

**WorkOrderStageInput** = `string | { key: string`

**UpdateWorkOrderInput** = `Partial<Omit<CreateWorkOrderInput, 'ref' | 'stages' | 'parentId'>>`

**StockState** = `'available' | 'allocated' | 'held' | 'quarantine'`

### order

**OrderItem** (interface)
```typescript
interface OrderItem {
  id: string                        // UUID
  orderId: string                   // Parent order ID
  itemType: 'tag' | 'proof' | 'serial' | 'product' // Type of item ('product' = a quantity line)
  itemId: string                    // The tag ID, proof ID, or serial number (the product ID on a quantity line)
  collectionId?: string             // Collection ID
  productId?: string                // Product ID
  variantId?: string | null         // Variant ID
  batchId?: string | null           // Batch ID
  quantity: number                  // How many (1 for an identified thing)
  unit?: string | null              // The unit the quantity is in
  quantityDone: number              // Shipped (sales) or received (purchase) so far
  dueAt?: string | null             // When this line is wanted or expected, if different from the order's
  metadata: Record<string, any>     // Item-specific metadata
  createdAt: string                 // ISO 8601 timestamp
  order?: OrderSummary              // Optional order summary (when includeOrder=true)
}
```

**OrderItemInput** (interface)
```typescript
interface OrderItemInput {
  itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
  itemId: string                        // Required: Item identifier
  metadata?: Record<string, any>        // Optional: Item-specific data
}
```

**OrderQuantityLineInput** (interface)
```typescript
interface OrderQuantityLineInput {
  itemType?: 'product'
  productId: string                     // Required: The product
  variantId?: string
  quantity: number                      // Required: How many
  unit?: string
  dueAt?: string                        // Optional: When this line is wanted or expected
  metadata?: Record<string, any>
}
```

**OrderSummary** (interface)
```typescript
interface OrderSummary {
  id: string                        // Order ID
  orderRef?: string                 // Order reference
  status: string                    // Order status
  customerId?: string               // Customer ID
  createdAt: string                 // ISO 8601 timestamp
}
```

**Order** (interface)
```typescript
interface Order {
  id: string                        // UUID
  orgId: string                     // Organization ID
  collectionId: string              // Collection ID
  orderRef?: string                 // Customer's own order reference/ID (e.g., "ORD-12345")
  customerId?: string               // Customer's own customer ID (can map to CRM/contacts)
  status: string                    // e.g., "pending", "processing", "shipped", "completed"
  direction: OrderDirection         // 'sales' (someone wants it from us) or 'purchase' (we want it from a supplier)
  partyId?: string | null           // The supplier, on a purchase order
  dueAt?: string | null             // When it is wanted or expected
  itemCount: number                 // Cached count of items (maintained automatically)
  metadata: {
  productSummary?: Record<string, number>  // productId -> count (auto-maintained)
  [key: string]: any              // Flexible additional data
  }
  items?: OrderItem[]               // Array of items (only when includeItems=true)
  createdAt: string                 // ISO 8601 timestamp
  updatedAt: string                 // ISO 8601 timestamp
}
```

**CreateOrderRequest** (interface)
```typescript
interface CreateOrderRequest {
  items: Array<OrderItemInput | OrderQuantityLineInput>
  direction?: OrderDirection              // Optional: 'sales' (default) or 'purchase'
  partyId?: string                        // Optional: The supplier, on a purchase order
  dueAt?: string                          // Optional: When it is wanted or expected
  orderRef?: string                       // Optional: Your own order reference/ID
  customerId?: string                     // Optional: Your customer ID
  status?: string                         // Optional: Order status (default: "pending")
  metadata?: Record<string, any>          // Optional: Order-level metadata
}
```

**GetOrderParams** (interface)
```typescript
interface GetOrderParams {
  includeItems?: boolean            // Optional: Include items array (default: false)
}
```

**UpdateOrderRequest** (interface)
```typescript
interface UpdateOrderRequest {
  direction?: OrderDirection        // Optional: 'sales' or 'purchase'
  partyId?: string | null           // Optional: The supplier
  dueAt?: string | null             // Optional: When it is wanted or expected
  orderRef?: string                 // Optional: Update order reference
  customerId?: string               // Optional: Update customer ID
  status?: string                   // Optional: Update status
  metadata?: Record<string, any>    // Optional: Merge with existing metadata
}
```

**DeleteOrderResponse** (interface)
```typescript
interface DeleteOrderResponse {
  success: boolean
}
```

**AddItemsRequest** (interface)
```typescript
interface AddItemsRequest {
  items: Array<{
  itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
  itemId: string                        // Required: Item identifier
  metadata?: Record<string, any>        // Optional: Item-specific data
  }>
}
```

**RemoveItemsRequest** (interface)
```typescript
interface RemoveItemsRequest {
  itemIds: string[]                 // Array of OrderItem IDs to remove
}
```

**ReportsParams** (interface)
```typescript
interface ReportsParams {
  groupByStatus?: boolean
  groupByCollection?: boolean
  groupByCustomer?: boolean
  groupByDate?: boolean
  groupByItemType?: boolean
  groupByProduct?: boolean
  includeItemStats?: boolean
  includeCount?: boolean            // default: true
  topN?: number                     // for customer/product grouping (default: 10)
  status?: string
  createdAfter?: string             // ISO 8601 date
  createdBefore?: string            // ISO 8601 date
}
```

**ReportsResponse** (interface)
```typescript
interface ReportsResponse {
  totalOrders?: number
  ordersByStatus?: Record<string, number>
  ordersByCollection?: Record<string, number>
  ordersByCustomer?: Record<string, number>
  ordersByDate?: Record<string, number>
  itemsByType?: Record<string, number>
  itemsByProduct?: Record<string, number>
  itemStats?: {
  totalItems: number
  avgItemsPerOrder: number
  maxItemsInOrder: number
  minItemsInOrder: number
  }
}
```

**TagScanSummary** (interface)
```typescript
interface TagScanSummary {
  tagId: string
  totalScans: number
  adminScans: number
  customerScans: number
  earliestScanAt: string | null
  earliestAdminScanAt: string | null
}
```

**OrderAnalyticsResponse** (interface)
```typescript
interface OrderAnalyticsResponse {
  orderRef: string
  orderId: string
  itemCount: number
  tagCount: number
  analytics: {
  totalScans: number
  adminScans: number
  customerScans: number
  earliestScanAt: string              // ISO 8601
  latestScanAt: string                // ISO 8601
  earliestAdminScanAt: string | null  // ISO 8601
  earliestCustomerScanAt: string | null // ISO 8601
  estimatedCreatedAt: string          // ISO 8601 - earliest admin scan or earliest scan
  uniqueLocations: number
  locations: string[]                 // Array of location strings
  uniqueDevices: number
  devices: string[]                   // Array of device types
  eventTypes: string[]                // e.g., ["scan_tag", "verify_tag"]
  tagSummaries: TagScanSummary[]
  } | null                              // null if no tags found
  message?: string                      // Only present if no tags found
}
```

**TagScanEvent** (interface)
```typescript
interface TagScanEvent {
  codeId: string
  claimId: string
  proofId: string | null
  productId: string | null
  variantId: string | null
  batchId: string | null
  collectionId: string
  timestamp: string                     // ISO 8601
  isAdmin: boolean
  eventType: string | null              // e.g., "scan_tag"
  location: string | null               // GPS coordinates or location string
  location_accuracy: number | null
  deviceType: string | null
  ip: string | null
  country: string | null
  sessionId: string | null
  metadata: Record<string, any> | null
}
```

**BulkAnalyticsRequest** (interface)
```typescript
interface BulkAnalyticsRequest {
  orderIds: string[]                    // Array of order IDs
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
}
```

**OrderAnalyticsSummary** (interface)
```typescript
interface OrderAnalyticsSummary {
  orderId: string
  orderRef: string
  analytics: {
  totalScans: number
  adminScans: number
  customerScans: number
  earliestScanAt: string | null
  earliestAdminScanAt: string | null
  estimatedCreatedAt: string | null
  tagCount: number
  tagSummaries: TagScanSummary[]
  } | null
}
```

**BulkAnalyticsResponse** (interface)
```typescript
interface BulkAnalyticsResponse {
  results: OrderAnalyticsSummary[]
}
```

**DailyScanCount** (interface)
```typescript
interface DailyScanCount {
  date: string                          // YYYY-MM-DD
  scanCount: number
}
```

**AdminActivityEvent** (interface)
```typescript
interface AdminActivityEvent {
  timestamp: string                     // ISO 8601
  eventType: string
  codeId: string
}
```

**SummaryRequest** (interface)
```typescript
interface SummaryRequest {
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
}
```

**CollectionSummaryResponse** (interface)
```typescript
interface CollectionSummaryResponse {
  adminActivity: {
  count: number
  recent: AdminActivityEvent[]        // Last 100 events
  }
  scansByDay: DailyScanCount[]
  adminScansByDay: DailyScanCount[]
  customerScansByDay: DailyScanCount[]
}
```

**OrderDirection** = `'sales' | 'purchase'`

### product

**ProductKey** (interface)
```typescript
interface ProductKey {
  collectionId: string
  id: string
}
```

**ProductImageUrlInput** (interface)
```typescript
interface ProductImageUrlInput {
  url: string
}
```

**AdditionalGtin** (interface)
```typescript
interface AdditionalGtin {
  gtin: string
  owner?: boolean | null
}
```

**ProductFacetValue** (interface)
```typescript
interface ProductFacetValue {
  id?: string
  key: string
  slug?: string
  name: string
  shortName?: string
  description?: string
  color?: string
  icon?: string
}
```

**ProductWriteInput** (interface)
```typescript
interface ProductWriteInput {
  id?: string
  name: string
  description?: string | null
  gtin?: string | null
  ownGtin?: string | null
  additionalGtins?: AdditionalGtin[]
  sku?: string | null
  schemaType?: string | null
  label?: string | null
  status?: string | null
  sortOrder?: number | null
  heroImage?: AssetRef | ProductImageUrlInput | string | null
  additionalImages?: Array<AssetRef | ProductImageUrlInput | string>
  facets?: ProductFacetMap
  tags?: Record<string, boolean>
  data?: Record<string, JsonValue>
  admin?: Record<string, JsonValue>
  extra?: Record<string, JsonValue>
  validCollections?: string[]
}
```

**ProductQueryMeta** (interface)
```typescript
interface ProductQueryMeta {
  apiVersion?: 'v1'
  mode?: 'canonical-products' | 'legacy-product-compatibility'
  source?: 'postgres' | 'firestore' | 'compatibility-layer'
  queryMode?: 'canonical' | 'compatibility'
  unsupportedFilters?: string[]
  supportedSortFields?: string[]
}
```

**ScopedFieldOption** (interface)
```typescript
interface ScopedFieldOption {
  value: string
  label: string
}
```

**ScopedFieldDef** (interface)
```typescript
interface ScopedFieldDef {
  key: string
  label: string
  type: ScopedFieldType
  required?: boolean
  placeholder?: string
  help?: string
  options?: ScopedFieldOption[]
  defaultValue?: JsonValue
  showInTable?: boolean
  showInDetail?: boolean
}
```

**ProductFieldsConfig** (interface)
```typescript
interface ProductFieldsConfig {
  fields: ProductFieldDef[]
}
```

**JsonPrimitive** = `string | number | boolean | null`

**JsonValue** = ``

**ISODateString** = `string`

**ProductFacetMap** = `Record<string, string[]>`

**ProductClaimCreateRequestBody** = `Omit<ProductClaimCreateInput, 'collectionId' | 'id'>`

**ProductResponse** = `Product`

**ProductCreateRequest** = `ProductWriteInput`

**ProductUpdateRequest** = `Partial<Omit<ProductWriteInput, 'id'>>`

**ScopedFieldType** = ``

**ProductFieldScope** = `'public' | 'admin'`

**ProductFieldDef** = `ScopedFieldDef & { scope?: ProductFieldScope }`

### proof

**ProofValues** (interface)
```typescript
interface ProofValues {
  [key: string]: JsonValue | Record<string, JsonValue> | Record<string, Record<string, JsonValue>> | undefined
  owner?: Record<string, JsonValue>
  personal?: Record<string, Record<string, JsonValue>>
}
```

**Proof** (interface)
```typescript
interface Proof {
  collectionId: string
  createdAt: string
  id: string
  uid?: string | null
  productId: string
  tokenId: string
  userId: string
  batchId?: string | null
  variantId?: string | null
  lotId?: string | null
  claimable?: boolean
  virtual?: boolean
  data?: Record<string, JsonValue>
  admin?: Record<string, JsonValue>
  values: ProofValues
}
```

**ProofWrite** (interface)
```typescript
interface ProofWrite {
  id?: string
  values?: ProofValues
  data?: Record<string, JsonValue>
  admin?: Record<string, JsonValue>
  owner?: Record<string, JsonValue>
  claimable?: boolean
  [key: string]: JsonValue | Record<string, JsonValue> | ProofValues | undefined
}
```

**ProofCreateRequest** (interface)
```typescript
interface ProofCreateRequest {
  proof?: ProofWrite
  values?: ProofValues
  claimable?: boolean
  virtual?: boolean
  core?: ProofWrite
  data?: Record<string, JsonValue>
  admin?: Record<string, JsonValue>
}
```

**ProofValuesUpdateRequest** (interface)
```typescript
interface ProofValuesUpdateRequest {
  [key: string]: JsonValue | Record<string, JsonValue> | undefined
  owner?: Record<string, JsonValue>
  personal?: Record<string, JsonValue>
}
```

**ProofClaimRequest** (interface)
```typescript
interface ProofClaimRequest {
  data?: Record<string, any>
  comms?: CommsTriggerMap
  [key: string]: any
}
```

**ProofFieldsConfig** (interface)
```typescript
interface ProofFieldsConfig {
  fields: ProofFieldDef[]
}
```

**GrantAudience** (interface)
```typescript
interface GrantAudience {
  kind: 'public_link' | 'named'
  email?: string
  userId?: string
}
```

**ProofGrant** (interface)
```typescript
interface ProofGrant {
  grantId: string
  proofId: string
  productId?: string | null
  scope: GrantScope[]
  moderate?: boolean
  audience: GrantAudience
  createdBy: string
  expiresAt?: string | null
  revokedAt?: string | null
  redeemedBy?: { userId?: string; guestName?: string; redeemedAt: string }
  redeemCount: number
  createdAt: string
  updatedAt: string
  token?: string
}
```

**CreateGrantOptions** (interface)
```typescript
interface CreateGrantOptions {
  scope: GrantScope[]
  audience?: GrantAudience
  expiresAt?: Date | string
  moderate?: boolean
}
```

**RedeemGrantOptions** (interface)
```typescript
interface RedeemGrantOptions {
  guestName?: string
}
```

**ProofTransfer** (interface)
```typescript
interface ProofTransfer {
  id: string
  proofId: string
  productId?: string | null
  type: ProofTransferType
  state: ProofTransferState
  fromUserId?: string | null
  toUserId?: string | null
  toEmail?: string | null
  initiatedByUserId?: string | null
  initiatedByRole?: 'owner' | 'claimant' | 'admin' | null
  disputeReason?: string | null
  disputeDeadline?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
}
```

**CommsTrigger** (interface)
```typescript
interface CommsTrigger {
  templateId: string
  channel?: 'preferred' | 'email' | 'sms' | 'push' | 'wallet' | 'whatsapp'
  props?: Record<string, any>
  notify?: boolean
  appId?: string
}
```

**TransferProofOptions** (interface)
```typescript
interface TransferProofOptions {
  comms?: CommsTriggerMap
  toEmail?: string
  toPhone?: string
  toUserId?: string
  toName?: string
  release?: boolean
  message?: string
  notify?: boolean
}
```

**TransferProofResult** (interface)
```typescript
interface TransferProofResult {
  ok: boolean
  mode: 'directed' | 'open_release'
  transfer: ProofTransfer
}
```

**AcceptTransferOptions** (interface)
```typescript
interface AcceptTransferOptions {
  comms?: CommsTriggerMap
  notify?: boolean
}
```

**CancelTransferOptions** (interface)
```typescript
interface CancelTransferOptions {
  comms?: CommsTriggerMap
  notify?: boolean
}
```

**ProofResponse** = `Proof`

**ProofUpdateRequest** = `Partial<ProofWrite> & { proof?: ProofWrite }`

**ProofFieldScope** = `'public' | 'owner' | 'personal' | 'admin'`

**ProofFieldDef** = `ScopedFieldDef & { scope?: ProofFieldScope }`

**GrantScope** = `'read' | 'comment' | 'contribute' | 'admin' | 'verify_owner'`

**RedeemGrantResult** = ``

**ProofTransferType** = `'directed' | 'open_release' | 'contested'`

**ProofTransferState** = ``

**CommsTriggerMap** = `Record<string, CommsTrigger>`

### qr

**QrShortCodeLookupResponse** (interface)
```typescript
interface QrShortCodeLookupResponse {
  collectionId?: string
  productId?: string
  proofId?: string
  code: string
}
```

### query

**QueryFieldTest** (interface)
```typescript
interface QueryFieldTest {
  eq?: QueryValue
  ne?: QueryValue
  gt?: QueryValue
  gte?: QueryValue
  lt?: QueryValue
  lte?: QueryValue
  in?: QueryValue[]
  nin?: QueryValue[]
  contains?: string
  startsWith?: string
  isNull?: boolean
  has?: string
  hasAny?: string[]
  hasAll?: string[]
}
```

**QueryWhere** (interface)
```typescript
interface QueryWhere {
  and?: QueryWhere[]
  or?: QueryWhere[]
  not?: QueryWhere
  [field: string]: QueryValue | QueryFieldTest | QueryKeyedTest | QueryWhere | QueryWhere[] | undefined
}
```

**StandardQuery** (interface)
```typescript
interface StandardQuery {
  where?: QueryWhere
  orderBy?: Array<Record<string, 'asc' | 'desc'>>
  limit?: number
  cursor?: string | null
  select?: string[]
  count?: boolean
  groupBy?: string[]
  aggregates?: Record<string, QueryAggregate>
  expand?: string[] | Record<string, string[] | true>
}
```

**QueryDescription** (interface)
```typescript
interface QueryDescription {
  name: string
  fields: Record<string, { type: 'string' | 'number' | 'boolean' | 'date' | 'list' | 'keyed' | 'json'; about?: string; can: string[] }>
  count: boolean
  aggregates: boolean
  links: Record<string, { to: string; by: string; about?: string }>
  limits: { limit: number; groups: number }
  shape: string
}
```

**QueryValue** = `string | number | boolean`

**QueryKeyedTest** = `Record<string, QueryValue | { eq?: QueryValue`

**QueryAggregate** = ``

### realtime

**RealtimeScope** (interface)
```typescript
interface RealtimeScope {
  collectionId: string
  appId?: string
}
```

**RealtimeMessage** (interface)
```typescript
interface RealtimeMessage {
  channel: string
  event: string
  data: unknown
  at?: number
}
```

**RealtimeChangeEvent** (interface)
```typescript
interface RealtimeChangeEvent {
  type: string
  id?: string
  appId?: string
  recordType?: string
  productId?: string
  proofId?: string
  status?: string
  kind?: string
  at: number
}
```

**RealtimeChangeFilter** (interface)
```typescript
interface RealtimeChangeFilter {
  type?: string
  id?: string
  appId?: string
  recordType?: string
  productId?: string
  proofId?: string
  kind?: string
}
```

**RealtimeChannelDeclaration** (interface)
```typescript
interface RealtimeChannelDeclaration {
  name: string
  subscribe?: "public" | "signedIn" | "admin"
  publish?: "public" | "signedIn" | "admin" | "server"
}
```

**RealtimeChannelPattern** = `string`

### research

**ResearchFetchRequest** (interface)
```typescript
interface ResearchFetchRequest {
  url: string
  type?: string
  schemaType?: string
  forceRefresh?: boolean
}
```

**ResearchFetchResult** (interface)
```typescript
interface ResearchFetchResult {
  provider: 'firecrawl' | 'web'
  status: number | null
  markdown?: string | null
  html?: string | null
  metadata?: Record<string, any> | null
  schemas: any[]
  url: string
  cached: boolean
  fetchedAt?: string
}
```

### segments

**InteractionFilterValue** (interface)
```typescript
interface InteractionFilterValue {
  interactionId: string
  scope?: string  // ← NEW: Scope filtering
  outcome?: string
  from?: string  // ISO date string
  to?: string    // ISO date string
}
```

**OwnershipAttributePredicate** (interface)
```typescript
interface OwnershipAttributePredicate {
  path: string
  operator: OwnershipAttributeOperator
  value?: string | number
}
```

**OwnershipFacetSelector** (interface)
```typescript
interface OwnershipFacetSelector {
  key: string
  value: string
}
```

**SegmentRecord** (interface)
```typescript
interface SegmentRecord {
  id: string
  collectionId: string
  appId?: string
  name: string
  filterType: 'dynamic' | 'static'
  estimatedCount?: number
  lastCalculatedAt?: string
  createdAt: string
  data?: {
  filterRules: SegmentFilterRule[]
  description?: string
  staticContactIds?: string[]
  [key: string]: unknown
  }
}
```

**SegmentCalculateResult** (interface)
```typescript
interface SegmentCalculateResult {
  scheduled: boolean
  lastCalculatedAt?: string
  estimatedCount?: number | null
  note?: string
}
```

**CustomFieldOperator** = ``

**OwnershipAttributeOperator** = `'equals' | 'exists' | 'gt' | 'gte' | 'lt' | 'lte'`

**SegmentFilterRule** = ``

### serviceAccounts

**ServiceAccount** (interface)
```typescript
interface ServiceAccount {
  id: string
  name: string
  access: ServiceAccountAccess | null
  active: boolean
  home: boolean
  alsoOn?: ServiceAccountCollection[]
  homeCollection?: { collectionId: string; title: string }
  createdAt: string
  createdBy: string | null
  lastUsedAt: string | null
  keyCreatedAt: string
  keyHint: string
}
```

**ServiceAccountCollection** (interface)
```typescript
interface ServiceAccountCollection {
  collectionId: string
  title: string
  access: ServiceAccountAccess | null
}
```

**AddServiceAccountToCollectionInput** (interface)
```typescript
interface AddServiceAccountToCollectionInput {
  collectionId: string
  access: ServiceAccountAccess
}
```

**CreateServiceAccountInput** (interface)
```typescript
interface CreateServiceAccountInput {
  name: string
  access: ServiceAccountAccess
}
```

**UpdateServiceAccountInput** (interface)
```typescript
interface UpdateServiceAccountInput {
  name?: string
  access?: ServiceAccountAccess
}
```

**CreateServiceAccountResult** (interface)
```typescript
interface CreateServiceAccountResult {
  serviceAccount: ServiceAccount
  key: string
}
```

**ServiceAccountKeyResult** (interface)
```typescript
interface ServiceAccountKeyResult {
  key: string
}
```

**ServiceAccountAccess** = `"User" | "Reporter" | "Assigner" | "Admin"`

### shop

**ShopPrice** (interface)
```typescript
interface ShopPrice {
  id: string
  collectionId: string
  productId: string
  variantId: string | null
  appId: string
  currency: string
  amount: number
  compareAtAmount: number | null
  delivery: ShopDelivery
  deliveryConfig: ShopDeliveryConfig | Record<string, never>
  trackStock: boolean
  active: boolean
  sort: number
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

**ShopPriceInput** (interface)
```typescript
interface ShopPriceInput {
  productId: string
  variantId?: string | null
  appId?: string
  currency?: string
  amount: number
  compareAtAmount?: number | null
  delivery?: ShopDelivery
  deliveryConfig?: ShopDeliveryConfig
  trackStock?: boolean
  active?: boolean
  sort?: number
  metadata?: Record<string, any>
}
```

**ShopShippingRate** (interface)
```typescript
interface ShopShippingRate {
  id: string
  label: string
  amount: number
  days?: string
}
```

**ShopSettings** (interface)
```typescript
interface ShopSettings {
  currency: string
  appId: string
  seller: { name?: string; address?: string; email?: string; phone?: string; vatNumber?: string }
  vat: { registered: boolean; rate: number }
  shipping: {
  rates: ShopShippingRate[]
  freeOver: number | null
  collection: { label: string } | null
  }
  policies: { returns?: string; terms?: string; privacy?: string }
  stripe: { accountId: string | null }
  stockContainerId: string | null
  checkout: {
  successUrl: string | null
  cancelUrl: string | null
  expiresMinutes: number
  allowedHosts: string[]
  }
  digital: { euBuyers: boolean }
  interaction: { interactionId: string | null }
}
```

**ShopReadiness** (interface)
```typescript
interface ShopReadiness {
  ready: boolean
  missing: { key: string; text: string }[]
}
```

**ShopConnectStatus** (interface)
```typescript
interface ShopConnectStatus {
  connected: boolean
  chargesEnabled?: boolean
  detailsSubmitted?: boolean
  payoutsEnabled?: boolean
  id?: string
}
```

**ShopPublicConfig** (interface)
```typescript
interface ShopPublicConfig {
  currency: string
  seller: { name: string | null; address: string | null; email: string | null; vatNumber?: string }
  vat: { registered: boolean; rate: number }
  shipping: ShopSettings['shipping']
  policies: ShopSettings['policies']
  digital: { euBuyers: boolean }
  ready: boolean
}
```

**ShopProduct** (interface)
```typescript
interface ShopProduct {
  priceId: string
  productId: string
  variantId: string | null
  name: string
  description: string | null
  heroImage: any
  amount: number
  compareAtAmount: number | null
  currency: string
  delivery: ShopDelivery
  deliveryKind: ShopDigitalKind | null
  needsSignIn: boolean
  available: number | null
  inStock: boolean
}
```

**ShopCheckoutLine** (interface)
```typescript
interface ShopCheckoutLine {
  productId: string
  variantId?: string | null
  quantity?: number
}
```

**ShopCheckoutInput** (interface)
```typescript
interface ShopCheckoutInput {
  lines: ShopCheckoutLine[]
  shippingRateId?: string
  email?: string
  successUrl?: string
  cancelUrl?: string
  acceptances?: { digitalImmediate?: boolean }
}
```

**ShopCheckoutResult** (interface)
```typescript
interface ShopCheckoutResult {
  orderId: string
  checkoutUrl: string
  expiresAt: string
  total: number
  currency: string
}
```

**ShopOrderLine** (interface)
```typescript
interface ShopOrderLine {
  id: string
  productId: string
  variantId: string | null
  name: string | null
  quantity: number
  unitAmount: number | null
  lineTotal: number | null
  delivery: ShopDelivery | null
  deliveryKind: ShopDigitalKind | null
  quantityDone: number
  quantityRefunded: number
  priceId: string | null
  appId: string
  files?: string[]
  fee?: { bps: number; amount: number }
}
```

**ShopShipment** (interface)
```typescript
interface ShopShipment {
  id: string
  at: string
  lines: { itemId: string; quantity: number }[]
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
}
```

**ShopOrder** (interface)
```typescript
interface ShopOrder {
  id: string
  collectionId: string
  orderRef: string | null
  status: ShopOrderStatus
  source: 'shop'
  contactId: string | null
  currency: string
  subtotal: number | null
  shipping: number | null
  tax: number | null
  total: number | null
  refunded: number
  paidAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  email: string | null
  shippingChoice: ShopShippingRate | null
  shippingAddress: Record<string, any> | null
  shipments: ShopShipment[]
  lines: ShopOrderLine[]
}
```

**ShopShipInput** (interface)
```typescript
interface ShopShipInput {
  lines?: { itemId: string; quantity?: number }[]
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
}
```

**ShopRefundInput** (interface)
```typescript
interface ShopRefundInput {
  lines?: { itemId: string; quantity?: number }[]
  shipping?: boolean
  amount?: number
  restock?: boolean
  reason?: string
}
```

**ShopDelivery** = `'physical' | 'digital'`

**ShopDigitalKind** = `'proof' | 'download' | 'access' | 'app'`

**ShopDeliveryConfig** = ``

**ShopPriceUpdate** = `Partial<Omit<ShopPriceInput, 'productId' | 'variantId' | 'currency'>>`

**ShopSettingsPatch** = `Partial<Omit<ShopSettings, 'stripe' | 'shipping' | 'checkout' | 'vat' | 'seller' | 'digital' | 'interaction'>> & {`

**ShopOrderStatus** = `'pending-payment' | 'paid' | 'fulfilled' | 'partly-refunded' | 'refunded' | 'expired'`

### subscriptions

**PlanLength** (interface)
```typescript
interface PlanLength {
  unit: 'month' | 'year'
  count: number
}
```

**PlanGrants** (interface)
```typescript
interface PlanGrants {
  level?: string
  groups?: string[]
  rank?: number
}
```

**PlanIncludes** (interface)
```typescript
interface PlanIncludes {
  items?: Array<{ productId: string; variantId?: string; quantity: number }>
}
```

**Plan** (interface)
```typescript
interface Plan {
  id: string
  collectionId: string
  name: string
  description: string | null
  image: string | null
  term: PlanTerm
  length: PlanLength | null
  grants: PlanGrants
  includes: PlanIncludes
  active: boolean
  sort: number
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

**PlanInput** (interface)
```typescript
interface PlanInput {
  name: string
  description?: string | null
  image?: string | null
  term?: PlanTerm
  length?: PlanLength
  grants?: PlanGrants
  includes?: PlanIncludes
  active?: boolean
  sort?: number
  metadata?: Record<string, any>
}
```

**PlanPrice** (interface)
```typescript
interface PlanPrice {
  id: string
  planId: string
  currency: string
  amount: number
  compareAtAmount: number | null
  interval: 'month' | 'year' | null
  intervalCount: number
  trialDays: number | null
  active: boolean
  sort: number
}
```

**PlanPriceInput** (interface)
```typescript
interface PlanPriceInput {
  currency?: string
  amount: number
  compareAtAmount?: number | null
  interval?: 'month' | 'year'
  intervalCount?: number
  trialDays?: number | null
  active?: boolean
  sort?: number
}
```

**PublicPlan** (interface)
```typescript
interface PublicPlan {
  id: string
  name: string
  description: string | null
  image: string | null
  term: PlanTerm
  length: PlanLength | null
  level: string | null
  prices: Array<Pick<PlanPrice, 'id' | 'currency' | 'amount' | 'compareAtAmount' | 'interval' | 'intervalCount' | 'trialDays'>>
}
```

**Membership** (interface)
```typescript
interface Membership {
  id: string
  collectionId: string
  contactId: string | null
  userId: string | null
  planId: string
  priceId: string | null
  source: SubscriptionSource
  status: SubscriptionStatus
  live: boolean
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  endsAt: string | null
  endedAt: string | null
  cancelReason: 'member' | 'staff' | 'payment_failed' | 'expired' | string | null
  cancelledBy: string | null
  pendingPriceId: string | null
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
  plan?: { id: string; name: string; grants: PlanGrants; term: PlanTerm }
}
```

**MySubscription** (interface)
```typescript
interface MySubscription {
  id: string
  planId: string
  priceId: string | null
  status: SubscriptionStatus
  live: boolean
  source: SubscriptionSource
  currentPeriodEnd: string | null
  endsAt: string | null
  pendingPriceId: string | null
  plan: { id: string; name: string; level: string | null } | null
}
```

**SubscriptionStartInput** (interface)
```typescript
interface SubscriptionStartInput {
  priceId: string
  successUrl?: string
  cancelUrl?: string
}
```

**SubscriptionStartResult** (interface)
```typescript
interface SubscriptionStartResult {
  checkoutUrl: string
  sessionId: string
}
```

**SubscriptionListParams** (interface)
```typescript
interface SubscriptionListParams {
  status?: SubscriptionStatus
  live?: boolean
  planId?: string
  contactId?: string
  userId?: string
  limit?: number
  offset?: number
}
```

**SubscriptionGrantInput** (interface)
```typescript
interface SubscriptionGrantInput {
  planId: string
  contactId?: string
  userId?: string
  endsAt?: string
  note?: string
}
```

**SubscriptionPage<T>** (interface)
```typescript
interface SubscriptionPage<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}
```

**MembershipStatus** (interface)
```typescript
interface MembershipStatus {
  member: boolean
  level: string | null
  subscriptions: Membership[]
}
```

**PlanTerm** = `'recurring' | 'fixed'`

**PlanUpdate** = `Partial<PlanInput>`

**SubscriptionStatus** = `'trialing' | 'active' | 'past_due' | 'cancelling' | 'ended'`

**SubscriptionSource** = `'stripe' | 'manual'`

### tags

**Tag** (interface)
```typescript
interface Tag {
  id:           string                // Internal UUID
  orgId:        string                // Organisation ID
  tagId:        string                // Physical tag identifier (NFC UID, QR code, etc.)
  collectionId: string                // Owning collection
  productId:    string | null         // Linked product
  variantId:    string | null         // Product variant
  batchId:      string | null         // Production batch
  proofId:      string | null         // Proof / serial number
  refType:      string | null
  refId:        string | null
  containerId?: string | null
  itemUid?:     string | null
  metadata:     Record<string, any>
  createdAt:    string                // ISO 8601
  updatedAt:    string                // ISO 8601
}
```

**TagIndexEntry** (interface)
```typescript
interface TagIndexEntry {
  tagId:        string
  collectionId: string
}
```

**TagEmbedded** (interface)
```typescript
interface TagEmbedded {
  products?:   Record<string, any>
  proofs?:     Record<string, any>
  containers?: Record<string, any>
  refs?:       Record<string, any>
}
```

**CreateTagRequest** (interface)
```typescript
interface CreateTagRequest {
  tagId:            string           // Required
  productId?:       string
  variantId?:       string
  batchId?:         string
  proofId?:         string           // Required if productId set, unless useSerialNumber=true
  useSerialNumber?: boolean          // Auto-generate a serial number as proofId
  refType?:         string           // Must be paired with refId
  refId?:           string           // Must be paired with refType
  containerId?:     string           // The label on this container (not with proofId)
  metadata?:        Record<string, any>
  force?:           boolean          // Overwrite if tag already exists in this collection
}
```

**BatchCreateTagRequest** (interface)
```typescript
interface BatchCreateTagRequest {
  tags:  Omit<CreateTagRequest, 'force'>[]
  force?: boolean
}
```

**UpdateTagRequest** (interface)
```typescript
interface UpdateTagRequest {
  productId?:  string
  variantId?:  string
  batchId?:    string
  proofId?:    string
  refType?:    string | null
  refId?:      string | null
  containerId?: string | null
  metadata?:   Record<string, any>   // Merged with existing metadata
}
```

**BatchCreateResult** (interface)
```typescript
interface BatchCreateResult {
  summary: {
  total:     number
  created:   number
  updated:   number
  failed:    number
  conflicts: number
  }
  results: {
  created:   Tag[]
  updated:   Tag[]
  failed:    Array<{ tagId: string; reason: string; message: string }>
  conflicts: Array<{ tagId: string; reason: string; message: string; existingTag: Tag }>
  }
}
```

**DeleteTagResponse** (interface)
```typescript
interface DeleteTagResponse {
  success: boolean
}
```

**LookupTagsRequest** (interface)
```typescript
interface LookupTagsRequest {
  tagIds: string[]
  embed?: string
}
```

**LookupTagsQueryRequest** (interface)
```typescript
interface LookupTagsQueryRequest {
  tagIds: string
  embed?: string
}
```

**PublicGetTagResponse** (interface)
```typescript
interface PublicGetTagResponse {
  tag:      Tag
  embedded: TagEmbedded
}
```

### template

**TemplateBase** (interface)
```typescript
interface TemplateBase {
  id: string
  collectionId: string
  name: string
  description?: string
  type: 'pdf' | 'email' | 'multichannel' | 'label'
  resizeMode?: string
  pdf?: {
  base: { url: string }
  orientation: 'portrait' | 'landscape'
  }
  channels?: {
  email?: {subject: string; body: string},
  sms?: { body: string },
  push: { title: string; body: string, url?: string, iconUrl?: string },
  wallet?: { header: string; body: string; imageUri?: string }
  }
  parameters: TemplateParameterSchema[]
  subject?: string
  body?: string
  css?: string
  public?: boolean
  engine?: string
  component?: string
  defaultProps?: Record<string, any>
  collections?: string[]
  [k: string]: any
}
```

**TemplateRenderRequest** (interface)
```typescript
interface TemplateRenderRequest {
  props: Record<string, any>
}
```

**TemplateRenderResponse** (interface)
```typescript
interface TemplateRenderResponse {
  ok: boolean; html: string
}
```

**TemplateRenderSourceRequest** (interface)
```typescript
interface TemplateRenderSourceRequest {
  engine: 'liquid'
  source: string
  props?: Record<string, any>
  component?: string
}
```

**TemplateRenderSourceResponse** (interface)
```typescript
interface TemplateRenderSourceResponse {
  ok: boolean; html: string
}
```

**TemplateInput** = `Omit<TemplateBase, 'id' | 'collectionId'>`

**TemplateUpdate** = `Partial<Omit<TemplateBase, 'id' | 'collectionId'>>`

**TemplatePublic** = `TemplateBase`

### translations

**TranslationContext** (interface)
```typescript
interface TranslationContext {
  surface?: string
  field?: string
  [key: string]: TranslationContextValue | undefined
}
```

**TranslationLookupRequestBase** (interface)
```typescript
interface TranslationLookupRequestBase {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  contentType?: TranslationContentType
  context?: TranslationContext
  returnMeta?: boolean
}
```

**TranslationLookupItem** (interface)
```typescript
interface TranslationLookupItem {
  index: number
  hash: string
  sourceText: string
  translatedText?: string
  status?: TranslationItemStatus
  provider?: string
  model?: string
  isOverride?: boolean
  quality?: TranslationQuality
  createdAt?: string
  updatedAt?: string
}
```

**TranslationLookupResponse** (interface)
```typescript
interface TranslationLookupResponse {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  items: TranslationLookupItem[]
}
```

**ResolvedTranslationResponse** (interface)
```typescript
interface ResolvedTranslationResponse {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  items: ResolvedTranslationItem[]
}
```

**TranslationHashOptions** (interface)
```typescript
interface TranslationHashOptions {
  trim?: boolean
  collapseWhitespace?: boolean
  unicodeNormalization?: 'NFC' | 'NFKC' | false
}
```

**TranslationResolveOptions** (interface)
```typescript
interface TranslationResolveOptions {
  useLocalCache?: boolean
  refreshLocalCache?: boolean
  localCacheTtlMs?: number
  hashOptions?: TranslationHashOptions
}
```

**TranslationRecord** (interface)
```typescript
interface TranslationRecord {
  id: string
  collectionId: string
  sourceHash: string
  sourceText: string
  sourceLanguage?: string
  targetLanguage: string
  contentType: string
  contextKey?: string | null
  translatedText: string
  provider?: string | null
  model?: string | null
  quality: TranslationQuality
  isOverride: boolean
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

**TranslationUpdateRequest** (interface)
```typescript
interface TranslationUpdateRequest {
  translatedText?: string
  isOverride?: boolean
  quality?: TranslationQuality
  metadata?: Record<string, any>
}
```

**TranslationTerm** (interface)
```typescript
interface TranslationTerm {
  source: string
  keep?: boolean
  translations?: Record<string, string>
  note?: string
}
```

**TranslationRules** (interface)
```typescript
interface TranslationRules {
  guidance: string
  languages: Record<string, { guidance: string }>
  terms: TranslationTerm[]
  version?: string | null
  updatedAt?: string | null
  limits?: { guidance: number; languageGuidance: number; terms: number; term: number; note: number }
}
```

**TranslationLookupMode** = `'cache-fill' | 'cache-only'`

**TranslationContentType** = `'text/plain' | 'text/html' | 'text/x-liquid' | (string & {})`

**TranslationQuality** = `'machine' | 'human' | 'passthrough' | (string & {})`

**TranslationItemStatus** = `'cached' | 'generated' | 'miss' | 'passthrough' | 'local-cache' | (string & {})`

**TranslationContextValue** = `string | number | boolean | null`

**TranslationLookupRequest** = `TranslationLookupSingleRequest | TranslationLookupBatchRequest`

### userGroups

**UserGroup** (interface)
```typescript
interface UserGroup {
  id: string
  collectionId?: string
  key?: string
  name: string
  description?: string
  members?: string[]
  createdAt?: string
  updatedAt?: string
  deleted?: boolean
  deletedAt?: string | null
  [extra: string]: any
}
```

**CreateUserGroupRequest** (interface)
```typescript
interface CreateUserGroupRequest {
  name: string
  key?: string
  description?: string
  members?: string[]
  [extra: string]: any
}
```

**UpdateUserGroupRequest** (interface)
```typescript
interface UpdateUserGroupRequest {
  name?: string
  description?: string
  members?: string[]
  [extra: string]: any
}
```

**UserGroupMember** (interface)
```typescript
interface UserGroupMember {
  uid: string
  name?: string | null
  email?: string | null
}
```

**UserGroupRef** (interface)
```typescript
interface UserGroupRef {
  id: string
  key: string | null
  name: string | null
}
```

**MyUserGroups** (interface)
```typescript
interface MyUserGroups {
  userGroups: string[]
  userGroupIds: string[]
}
```

**UserGroupChange** (interface)
```typescript
interface UserGroupChange {
  id: string
  at: string
  type: UserGroupChangeType
  entityId: string | null
  data: {
  userGroupId: string
  key: string | null
  name: string | null
  userId?: string
  previousName?: string | null
  members?: string[]
  }
  actorType: string | null
  actorId: string | null
}
```

**AddUserGroupMemberRequest** = ``

**UserGroupChangeType** = ``

### variant

**VariantResponse** (interface)
```typescript
interface VariantResponse {
  id: string
  name?: string | null
  productId?: string
  collectionId?: string
  createdAt?: string              // ISO 8601
  updatedAt?: string              // ISO 8601
  deleted?: boolean
  deletedAt?: string              // ISO 8601
  admin?: Record<string, any>
  [key: string]: any              // Additional (schemaless) variant fields
}
```

**VariantCreateRequest** (interface)
```typescript
interface VariantCreateRequest {
  name?: string
  [key: string]: any
}
```

**VariantUpdateRequest** (interface)
```typescript
interface VariantUpdateRequest {
  name?: string
  [key: string]: any
}
```

### wallet

**WalletPassRef** (interface)
```typescript
interface WalletPassRef {
  type: 'booking' | 'contact' | string
  id: string
}
```

**WalletPassContent** (interface)
```typescript
interface WalletPassContent {
  kind: WalletPassKind
  title: string
  subtitle?: string
  start?: string
  end?: string
  timezone?: string
  venue?: { name?: string; address?: string; lat?: number; lng?: number }
  holder?: string
  number?: string
  level?: string
  points?: number
  validUntil?: string
  fields?: Array<{ label: string; value: string }>
  back?: Array<{ label: string; value: string }>
  image?: string
  url?: string
  barcode?: string
}
```

**WalletInWallet** (interface)
```typescript
interface WalletInWallet {
  saved: boolean
  savedAt?: string | null
  removedAt?: string
}
```

**WalletPassLinks** (interface)
```typescript
interface WalletPassLinks {
  google?: string
  apple?: string
}
```

**WalletPassSummary** (interface)
```typescript
interface WalletPassSummary {
  id: string
  kind: WalletPassKind
  ref: WalletPassRef
  title?: string
  start?: string
  links: WalletPassLinks
}
```

**WalletPass** (interface)
```typescript
interface WalletPass {
  id: string
  collectionId: string
  kind: WalletPassKind
  ref: WalletPassRef
  contactId?: string | null
  status: 'active' | 'voided'
  issuedBy?: string | null
  model: WalletPassContent
  code: string
  version: number
  notice?: { header: string; body: string; at: string }
  inWallet?: { apple?: WalletInWallet; google?: WalletInWallet }
  voidReason?: string | null
  links?: WalletPassLinks
  createdAt?: string
  updatedAt?: string
}
```

**IssueWalletPassRequest** (interface)
```typescript
interface IssueWalletPassRequest {
  ref: WalletPassRef
  contactId?: string
  appId?: string
  pass: WalletPassContent
}
```

**WalletPassKind** = `'event' | 'booking' | 'membership' | 'loyalty'`

### widgets

**NavigationRequest** (interface)
```typescript
interface NavigationRequest {
  appId: string
  deepLink?: string
  params?: Record<string, string>
  productId?: string
  proofId?: string
}
```

**SmartLinksWidgetProps** (interface)
```typescript
interface SmartLinksWidgetProps {
  collectionId: string
  appId: string
  productId?: string
  proofId?: string
  user?: {
  id?: string
  email?: string
  name?: string
  admin?: boolean
  }
  SL: Record<string, unknown>
  onNavigate?: (request: NavigationRequest | string) => void
  publicPortalUrl?: string
  itemContext?: ItemContext
  tag?: TagContext
  size?: 'compact' | 'standard' | 'large'
  lang?: string
  translations?: Record<string, string>
  EmbeddedWidget?: EmbeddedWidgetComponent
}
```

**EmbeddedWidgetProps** (interface)
```typescript
interface EmbeddedWidgetProps {
  appId: string
  component?: string
  size?: 'compact' | 'standard' | 'large'
  widgetId?: string
  props?: Record<string, unknown>
  className?: string
  fallback?: unknown
  loading?: unknown
}
```

**EmbeddedWidgetComponent** = `(props: EmbeddedWidgetProps) => any`

### aiGuide (api)

**GuideInfo** (interface)
```typescript
interface GuideInfo {
  enabled: boolean
  name?: string
  modes?: { voice: boolean; text: boolean; start: 'voice' | 'text' }
  suggestions?: string[]
  handoff?: { kind: 'email' | 'phone' | 'url'; value: string } | null
}
```

**ScreenContent** (interface)
```typescript
interface ScreenContent {
  appId?: string | null
  title?: string | null
  content?: string | null
}
```

**GuideWhere** (interface)
```typescript
interface GuideWhere {
  appId?: string | null
  path?: string | null
  params?: Record<string, string>
}
```

**GuideNavigate** (interface)
```typescript
interface GuideNavigate {
  appId: string
  path: string
  params?: Record<string, string>
}
```

**GuideCard** (interface)
```typescript
interface GuideCard {
  title: string
  rows: Array<{ title: string; detail?: string | null; goTo?: string }>
  more?: number
}
```

**GuideStartOptions** (interface)
```typescript
interface GuideStartOptions {
  surface: GuideSurface
  mode?: 'voice' | 'text'
  productId?: string | null
  proofId?: string | null
  apps?: Array<{ id: string; title: string; kind?: 'core' | 'app'; channel?: string }>
  where?: GuideWhere
  language?: string
  screen?: ScreenContent
  readScreen?: () => Promise<ScreenContent | null> | ScreenContent | null
  showApp?: (appId: string) => Promise<void> | void
  openPage?: (to: GuideNavigate) => Promise<void> | void
  goTo?: (productId: string) => Promise<void> | void
  onShow?: (card: GuideCard) => void
  offerPerson?: (handoff: GuideInfo['handoff']) => Promise<void> | void
  onState?: (s: LiveState) => void
  onCaption?: (text: string) => void
  onReply?: (text: string) => void
  onError?: (message: string) => void
  onMuted?: (muted: boolean) => void
}
```

**GuideSurface** = `'portal' | 'hub'`

### appConfiguration (api)

**AppConfigOptions** (type)
```typescript
type AppConfigOptions = {
  /** The app ID */
  appId: string
  
  /** Collection ID (required for most operations) */
  collectionId?: string
  /** Product ID (optional - for product-scoped config) */
  productId?: string
  /** Variant ID (optional - for variant-scoped config) */
  variantId?: string
  /** Batch ID (optional - for batch-scoped config) */
  batchId?: string
  
  /** Item ID - required for getDataItem/deleteDataItem */
  itemId?: string
  
  /**
   * Use admin endpoints instead of public.
   * This selects which endpoint is called; it does not by itself make root-level config fields private.
   */
  admin?: boolean
  
  /**
   * Configuration object for setConfig.
   * For admin-only values in app config, store them under a top-level `admin` object.
   * Public reads return the root config but omit `config.admin`.
   */
  config?: any
  /** Data object for setDataItem. Best for small keyed scoped documents rather than richer app domain objects. */
  data?: any
}
```

### auth (api)

**LoginResponse** (type)
```typescript
type LoginResponse = {
  id: string
  name: string
  email: string
  bearerToken: string
  account: Record<string, any>
}
```

**VerifyTokenResponse** (type)
```typescript
type VerifyTokenResponse = {
  valid: boolean
  id?: string
  name?: string
  email?: string
  account?: Record<string, any>
}
```

### conditions (api)

**SaveConditionRequest** = `Omit<SavedCondition, "id" | "deleted">`

### functions (api)

**FunctionListEntry** (interface)
```typescript
interface FunctionListEntry {
  name: string; visibility?: string; trigger?: string
}
```

**FunctionListResponse** (interface)
```typescript
interface FunctionListResponse {
  functions: FunctionListEntry[]
}
```

**FunctionCallOptions** (interface)
```typescript
interface FunctionCallOptions {
  appId?: string; channel?: string | null
}
```

**FunctionSiteUrlOptions** (interface)
```typescript
interface FunctionSiteUrlOptions {
  channel?: string
  path?: string
  query?: Record<string, string>
  host?: string
}
```

**FunctionCallResult** = `any`

### secrets (api)

**AppSecretOptions** (interface)
```typescript
interface AppSecretOptions {
  appId?: string
}
```

### conditions (utils)

**BaseCondition** (interface)
```typescript
interface BaseCondition {
  type: string
  contains?: boolean
  passes?: boolean
}
```

**ConditionSet** (interface)
```typescript
interface ConditionSet {
  id?: string
  type?: 'and' | 'or'
  conditions?: Condition[]
}
```

**UserLocation** (interface)
```typescript
interface UserLocation {
  country?: string
  latitude?: number
  longitude?: number
}
```

**PlatformInfo** (interface)
```typescript
interface PlatformInfo {
  android?: boolean
  ios?: boolean
  win?: boolean
  mac?: boolean
}
```

**StatsInfo** (interface)
```typescript
interface StatsInfo {
  version?: string | null
  platform?: PlatformInfo
  mobile?: boolean
}
```

**UserInfo** (interface)
```typescript
interface UserInfo {
  valid: boolean
  uid?: string
  location?: UserLocation
  groups?: string[]
}
```

**ProductInfo** (interface)
```typescript
interface ProductInfo {
  id: string
  tags?: Record<string, any>
  facets?: Record<string, string[]>
}
```

**ProofInfo** (interface)
```typescript
interface ProofInfo {
  id?: string
  userId?: string
  claimable?: boolean
  virtual?: boolean
}
```

**CollectionInfo** (interface)
```typescript
interface CollectionInfo {
  id: string
  roles?: Record<string, any>
}
```

**ConditionParams** (interface)
```typescript
interface ConditionParams {
  condition?: ConditionSet
  conditionId?: string
  conditionStack?: string[]
  user?: UserInfo
  product?: ProductInfo
  proof?: ProofInfo
  collection?: CollectionInfo
  itemContext?: ItemContext
  stats?: StatsInfo
  fetchCondition?: (collectionId: string, conditionId: string) => Promise<ConditionSet | null>
  getLocation?: () => Promise<{ latitude: number; longitude: number }>
  debugConditions?: boolean | ConditionDebugOptions
  [key: string]: any
}
```

**ConditionDebugOptions** (interface)
```typescript
interface ConditionDebugOptions {
  enabled?: boolean
  logger?: ConditionDebugLogger
  label?: string
}
```

**RegionKey** = `keyof typeof REGION_COUNTRIES`

**Condition** = ``

**ConditionDebugLogger** = `(...args: any[]) => void`

### freeTimes (utils)

**TimeInterval** (interface)
```typescript
interface TimeInterval {
  start: number
  end: number
}
```

**FreeTimesOptions** (interface)
```typescript
interface FreeTimesOptions {
  hours: StandardSchedule | TimeInterval[]
  busy?: Array<FreeBusyInterval | TimeInterval>
  from: string | number | Date
  to: string | number | Date
  duration: number
  step?: number
  bufferBefore?: number
  bufferAfter?: number
  minNotice?: number
  now?: number
  buffersWithinHours?: boolean
}
```

**FreeTimeSlot** (interface)
```typescript
interface FreeTimeSlot {
  start: string
  end: string
}
```

### paths (utils)

**PortalPathParams** (interface)
```typescript
interface PortalPathParams {
  collection: Collection | { shortId: string; portalUrl?: string }
  product?: Product
  productId?: string
  batch?: BatchResponse
  batchId?: string
  variant?: { id: string } | string
  proof?: Proof | string
  queryParams?: Record<string, string>
  pathOnly?: boolean
  customDomain?: boolean
}
```

**Gs1DigitalLinkParams** (interface)
```typescript
interface Gs1DigitalLinkParams {
  collection?: Collection | { shortId?: string; portalUrl?: string; redirectUrl?: string }
  domain?: string
  gtin?: string
  product?: Product
  ownGtin?: boolean
  cpv?: string | { id: string }
  variant?: string | { id: string }
  lot?: string | { id: string }
  batch?: BatchResponse | string
  serial?: string | { id?: string; serialNumber?: string }
  expiry?: string | Date
  ais?: Record<string, string | number | Date>
  linkType?: string
  queryParams?: Record<string, string>
  customDomain?: boolean
  pathOnly?: boolean
}
```

## API Functions

### address

**page**(collectionId: string, appId: string) → `Promise<AppPageLink | null>`
Where an app's public page is, on the business's own address. Public: use it from the app's admin ("Open the game") and from share buttons, instead of building the CDN address by hand. Add the app's own route to it: `${link.url}#/play`. The page carries no collectionId or appId: the address says it. Resolves null when the app has no page on that collection (not installed, or a connector). const link = await SL.address.page(collectionId, appId) window.open(`${link?.url ?? fallback}#/play`, '_blank')

**get**(collectionId: string) → `Promise<AddressResponse>`
Everything about the business's address: name, own domain, front page, websites that can take it, app pages.

**checkName**(collectionId: string, name: string) → `Promise<AddressNameAvailability>`
Is this name free? (lower-case letters, numbers and hyphens)

**setName**(collectionId: string, name: string) → `Promise<`
Choose (or change) the business's name: `<name>.smartlinks.host`. The previous name is released.

**setFront**(collectionId: string, front: AddressFront) → `Promise<`
What the front page shows. Applies to the business's name, its automatic address and its own domain together. A website must be installed and live; a redirect must be https and not one of its own addresses.

**setPage**(collectionId: string, appId: string, change: { name?: string; listed?: boolean }) → `Promise<`
Rename an app's page (old names keep redirecting) and/or show it on the holding page.

### adminCards

**list**(collectionId: string) → `Promise<AdminCardsResponse>`
The collection's dashboard: every card, in display order, with its cached payload and how fresh it is (`state`). Never waits on slow cards — those come back `stale` / `pending` and arrive later as a realtime `cards` change. Returns `{ items, nextCursor, hidden, layout }`: the cards to show are in `items`; `hidden` are the cards the layout hides. The dashboard is not paged, so `nextCursor` is always `null`. ```typescript const { items: cards, hidden, layout } = await adminCards.list(collectionId) ```

**refresh**(collectionId: string, appId: string, cardId: string) → `Promise<AdminCard>`
Recompute one card now (the card's "refresh" button). Rate-limited per card.

**saveLayout**(collectionId: string, layout: StudioHomeLayout) → `Promise<StudioHomeLayout>`
Save the collection's dashboard layout (order, sizes, hidden cards) — every admin sees it.

### agent

**run**(collectionId: string, body: AgentRunRequest) → `Promise<AgentRunResult>`
Run the server-side AI agent loop once: assembles the tool set, runs the model, executes tool calls, and returns the final text + the tool trace. POST /admin/collection/:collectionId/ai/agent/run

**listTools**(collectionId: string, query: AgentToolsQuery = {}) → `Promise<ListResult<AgentToolDefinition>>`
List the tools the agent can use (optionally scoped by capability / name). Returns `{ items, nextCursor }`: the tools are in `items`. The list is not paged, so `nextCursor` is always `null`. GET /admin/collection/:collectionId/ai/agent/tools ```typescript const { items: tools } = await ai.agent.listTools('coll_123', { allowCapabilities: 'read' }) ```

### analytics.admin

**summary**(collectionId: string,
      body: AnalyticsSummaryRequest) → `Promise<AnalyticsSummaryResponse>`

**timeseries**(collectionId: string,
      body: AnalyticsTimeseriesRequest) → `Promise<AnalyticsTimeseriesResponse>`

**breakdown**(collectionId: string,
      body: AnalyticsBreakdownRequest) → `Promise<AnalyticsBreakdownResponse>`

**events**(collectionId: string,
      body: AnalyticsEventsRequest) → `Promise<AnalyticsEventsResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**web**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsDashboardResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**clicks**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsDashboardResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**tagScans**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsDashboardResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**products**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsProductsResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**qrCodes**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsQrCodesResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**tags**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsTagsResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**weekly**(collectionId: string,
      body: AnalyticsWeeklyRequest = {}) → `Promise<AnalyticsTimeseriesResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**country**(collectionId: string,
      body: AnalyticsCountryRequest = {}) → `Promise<AnalyticsBreakdownResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**topPages**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**topReferrers**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**topCampaigns**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**topSources**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

**topDestinations**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`
The raw events behind the reports, newest first unless `orderBy` says otherwise. Returns `{ items, nextCursor, source, sort }`: the event rows are in `items`; `nextCursor` is `null` on the last page. Page with `limit` and `cursor`; the time window is `from` / `to`. ```typescript const query = { source: 'events' as const, eventType: 'page_view', from: '2026-11-01T00:00:00Z', limit: 100 } let page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }] }) while (page.nextCursor) { page = await analytics.admin.events(collectionId, { ...query, orderBy: [{ timestamp: 'asc' }], cursor: page.nextCursor }) } ```

### analytics.browser

**configure**(config: AnalyticsBrowserConfig) → `void`

**getSessionId**() → `AnalyticsSessionId | undefined`

**getVisitorId**() → `string | undefined`

**setVisitorId**(visitorId: string,
      options?: AnalyticsVisitorIdOptions) → `string`

**clearVisitorId**(options?: Pick<AnalyticsVisitorIdOptions, 'storage' | 'storageKey'>) → `void`

**captureCampaignParams**(search?: string) → `Partial<CollectionAnalyticsEvent>`

**setLocation**(location: TagAnalyticsEvent['location'] | null) → `void`

**clearLocation**() → `void`

**getLocation**() → `TagAnalyticsEvent['location'] | undefined`

**detectDevice**() → `CollectionAnalyticsEvent['deviceType']`

**captureLocation**(options: AnalyticsGeolocationCaptureOptions = {}) → `Promise<TagAnalyticsEvent['location'] | null>`

**trackCollection**(event: Partial<CollectionAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackTag**(event: Partial<TagAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackPageView**(event: Partial<CollectionAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackLinkClick**(event: AnalyticsLinkClickInput,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackTagScan**(event: Partial<TagAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**bindPageViews**(binding: AnalyticsPageViewBindingOptions = {}) → `() => void`

**bindLinkTracking**(binding: AnalyticsLinkBindingOptions = {}) → `() => void`

### analytics.collection

**track**(event: CollectionAnalyticsEvent,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`
Fire-and-forget collection analytics event. Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.

### analytics.tag

**track**(event: TagAnalyticsEvent,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`
Fire-and-forget tag analytics event. Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.

### app.cases

Workflow-oriented app objects for issues, requests, claims, and tasks that move through statuses and often need assignment or history.

**create**(collectionId: string,
    appId: string,
    input: CreateCaseInput,
    admin: boolean = false) → `Promise<AppCase>`
Create a new case POST /cases

**list**(collectionId: string,
    appId: string,
    params?: CaseListQueryParams,
    admin: boolean = false) → `Promise<ListResult<AppCase>>`
List cases with optional query parameters GET /cases Returns `{ items, nextCursor, count }`: the cases are in `items`, `count` is how many match in all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`. Sort with `orderBy`. A date field (`createdAt`, `updatedAt`, `closedAt`) takes a range: `{ gte, lte }`. `includeDeleted`, `contactId` and `assignedTo` are for admin calls (`admin = true`) only: the public list refuses a parameter it does not read. ```typescript let page = await app.cases.list(collectionId, appId, { status: 'open', limit: 50 }) console.log(page.items, page.count) while (page.nextCursor) { page = await app.cases.list(collectionId, appId, { status: 'open', limit: 50, cursor: page.nextCursor }) } // This month's cases, most urgent first await app.cases.list(collectionId, appId, { createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' }, orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }], }) ```

**get**(collectionId: string,
    appId: string,
    caseId: string,
    admin: boolean = false) → `Promise<AppCase>`
Get a single case by ID GET /cases/:caseId

**update**(collectionId: string,
    appId: string,
    caseId: string,
    input: UpdateCaseInput,
    admin: boolean = false) → `Promise<AppCase>`
Update a case PATCH /cases/:caseId Admin can update any field, public (owner) can only update data and owner zones

**remove**(collectionId: string,
    appId: string,
    caseId: string,
    admin: boolean = false) → `Promise<`
Soft delete a case DELETE /cases/:caseId

**aggregate**(collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false) → `Promise<AggregateResponse>`
Get aggregate statistics for cases POST /cases/aggregate

**summary**(collectionId: string,
    appId: string,
    request?: CaseSummaryRequest) → `Promise<CaseSummaryResponse>`
Get case summary (admin only) POST /cases/summary

**appendHistory**(collectionId: string,
    appId: string,
    caseId: string,
    input: AppendHistoryInput) → `Promise<AppCase>`
Append an entry to case history (admin only) POST /cases/:caseId/history

**related**(collectionId: string,
    appId: string,
    caseId: string) → `Promise<RelatedResponse>`
Get related threads and records for a case (admin only) GET /cases/:caseId/related

### app.options

**get**(collectionId: string,
    appId: string,
    source: string,
    opts: ListOptions & { q?: string; version?: string; admin?: boolean } = {},) → `Promise<import('../types/appOptions').AppOptionsList>`
`source` = `type:<record type or declared type id>` | `list:<list id>`. Admins (`admin: true`) see every entry; the public API lists public records and lists the app declares public. Hold on to `version` and pass it back to get `{ unchanged: true }` when nothing changed. Returns `{ items, nextCursor, count?, version, mode }`: the entries are in `items`, already sorted, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. `q` searches the entries. ```typescript const res = await app.options.get(collectionId, appId, 'type:machine', { admin: true, limit: 200 }) if (!res.unchanged) { options = res.items; version = res.version } // A type too large to send whole: search it const found = await app.options.get(collectionId, appId, 'type:machine', { q: 'mix', limit: 20 }) ```

**saveList**(collectionId: string,
    appId: string,
    listId: string,
    values: import('../types/appOptions') → `void`
Save a value list's values, in order (admins). Codes never change and are never lost: a value left out stays, switched off, at the end. → the list as saved.

### app.records

General-purpose structured app objects. Use these when a simple scoped data item grows into something queryable, lifecycle-aware, or access-controlled.

**create**(collectionId: string,
    appId: string,
    input: CreateRecordInput,
    admin: boolean = false) → `Promise<CreateRecordResponse>`
Create a new record POST /records When called on the public endpoint (admin = false) with an anonymous caller, and the app's `publicCreate.records.anonymous.edit.editToken` policy is enabled, the response includes a one-time `editToken` string. Store it immediately — it is never returned again.

**query**(collectionId: string,
    appId: string,
    body: StandardQuery = {}) → `Promise<QueryResult>`
The standard query on an app's records (admin only): filter, sort, page, count and total in one call, reaching into a record's own fields by path, and following a record to its `product` and its `contact`. POST /admin/collection/:collectionId/app/:appId/records/query Fields: id, recordType, ref, status, visibility, customId, productId, variantId, batchId, proofId, contactId, authorId, parentType, parentId, createdAt, updatedAt, startsAt, expiresAt, and the documents data, owner and admin, reached by path: `"data.status"`, `"data.line.name"`. ```typescript // How many work orders by status, and how many units on each await app.records.query(collectionId, appId, { where: { recordType: 'work_order' }, groupBy: ['data.status'], aggregates: { orders: { count: true }, units: { sum: 'data.qty' } }, }) ```

**queryFields**(collectionId: string, appId: string) → `Promise<QueryDescription>`
What a records query can use: its fields, what each can filter, sort, group or total, and its links. GET /admin/collection/:collectionId/app/:appId/records/query

**list**(collectionId: string,
    appId: string,
    params?: RecordListQueryParams,
    admin: boolean = false) → `Promise<ListResult<AppRecord>>`
List records with optional query parameters GET /records Returns `{ items, nextCursor, count }`: the records are in `items`, `count` is how many match in all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`. Search with `q`, sort with `orderBy`. A date field (`createdAt`, `updatedAt`, `startsAt`, `expiresAt`) takes a range: `{ gte, lte }`. Public/owner callers only receive records with `status: "active"`. Admin callers can query all statuses (for example `draft`/`archived`). `qFields`, `dataFilter`, `contactId` and `includeDeleted` are for admin calls (`admin = true`) only: the public list refuses a parameter it does not read. ```typescript let page = await app.records.list(collectionId, appId, { recordType: 'tip', limit: 100 }) console.log(page.items, page.count) while (page.nextCursor) { page = await app.records.list(collectionId, appId, { recordType: 'tip', limit: 100, cursor: page.nextCursor }) } // Tips about watering, changed this month, newest change first await app.records.list(collectionId, appId, { recordType: 'tip', q: 'watering', updatedAt: { gte: '2026-11-01T00:00:00Z' }, orderBy: [{ updatedAt: 'desc' }], }) ```

**get**(collectionId: string,
    appId: string,
    recordId: string,
    admin: boolean = false) → `Promise<AppRecord>`
Get a single record by ID GET /records/:recordId

**update**(collectionId: string,
    appId: string,
    recordId: string,
    input: UpdateRecordInput,
    admin: boolean = false) → `Promise<AppRecord>`
Update a record PATCH /records/:recordId Admin can update any field, public (owner) can only update data and owner

**updateWithToken**(collectionId: string,
    appId: string,
    recordId: string,
    data: Record<string, unknown>,
    editToken: string) → `Promise<AppRecord>`
Amend the `data` zone of a record using an anonymous edit token. PATCH /records/:recordId  (public endpoint, no auth) This is the follow-up call after an anonymous `create()` that returned an `editToken`.  Present the token via `X-Edit-Token` — the server validates it with a constant-time comparison and, if `windowMinutes` is configured in the policy, checks that the token has not expired. **Scope:** only the `data` zone may be modified via this path. `owner`, `admin`, `status`, `visibility`, and indexed fields are immutable to anonymous token holders. ```ts const record = await app.records.create(collectionId, appId, { recordType: 'payment', visibility: 'public', data: { amount: 9900, currency: 'USD' }, }) const { editToken } = record  // store this immediately! // Later, once the payment gateway confirms: const updated = await app.records.updateWithToken( collectionId, appId, record.id, { amount: 9900, currency: 'USD', transactionId: 'txn_abc123' }, editToken, ) ``` ### Error codes | HTTP | `errorCode`           | Meaning                                           | |------|-----------------------|---------------------------------------------------| | 401  | `UNAUTHORIZED`        | No auth token and no `X-Edit-Token` header        | | 403  | `FORBIDDEN`           | Policy not enabled, or token does not match       | | 403  | `EDIT_WINDOW_EXPIRED` | `windowMinutes` elapsed since record creation     | | 404  | `NOT_FOUND`           | Record does not exist                             |

**remove**(collectionId: string,
    appId: string,
    recordId: string,
    admin: boolean = false) → `Promise<`
Soft delete a record DELETE /records/:recordId

**aggregate**(collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false) → `Promise<AggregateResponse>`
Get aggregate statistics for records POST /records/aggregate

**restore**(collectionId: string,
    appId: string,
    recordId: string) → `Promise<AppRecord>`
Restore a soft-deleted record. POST /records/:recordId/restore (admin only)

**upsert**(collectionId: string,
    appId: string,
    input: UpsertRecordInput) → `Promise<UpsertRecordResponse>`
Upsert a record by ref — creates if no record with that ref exists, otherwise updates. Scope, specificity, and ref are canonicalized on write. POST /records/upsert (admin only)

**match**(collectionId: string,
    appId: string,
    input: MatchRecordsInput,
    admin: boolean = false) → `Promise<MatchResult>`
Match records against a runtime target scope. Returns `{ items, nextCursor, count, strategy }`: `items` are the records whose scope is satisfied by the target, most specific first, and `count` is how many matched. Without a `limit` it answers up to 100. Give a `limit` (in `input`) to page: when there are more, pass `nextCursor` back as `cursor`. POST /records/match ```ts const { items } = await app.records.match(collectionId, appId, { target: { productId: 'prod_abc', facets: { tier: ['gold'] } }, strategy: 'best', recordType: 'nutrition', }, true); const best = items[0] // the single highest-specificity nutrition record // 50 at a time const target = { productId: 'prod_abc' } let page = await app.records.match(collectionId, appId, { target, limit: 50 }) while (page.nextCursor) { page = await app.records.match(collectionId, appId, { target, limit: 50, cursor: page.nextCursor }) } ```

**bulkUpsert**(collectionId: string,
    appId: string,
    records: BulkUpsertItem[]) → `Promise<BulkUpsertResult>`
Upsert up to 500 records in a single transaction. Each row is individually error-isolated — a failure on one row does not abort the others. POST /records/bulk-upsert (admin only)

**bulkDelete**(collectionId: string,
    appId: string,
    input: BulkDeleteInput) → `Promise<BulkDeleteResult>`
Soft-delete records in bulk. Supports two modes: - **refs mode**: explicit list of refs (max 1000) - **scope mode**: delete by scope anchor (productId / variantId / etc.) POST /records/bulk-delete (admin only) ```ts // Refs mode await app.records.bulkDelete(collectionId, appId, { refs: ['product:prod_abc', 'product:prod_xyz'], recordType: 'nutrition', }); // Scope mode await app.records.bulkDelete(collectionId, appId, { scope: { productId: 'prod_abc' }, }); ```

**resolveAll**(collectionId: string,
    appId: string,
    input: ResolveAllParams,
    admin: boolean = false) → `Promise<ResolveAllResult>`
Resolve every applicable record for a product context in one call. Returns `{ items, nextCursor, count, context, truncated }`: `items` are the records across all tiers (proof, batch, variant, product, rule, facet, collection), deduplicated and sorted by specificity descending, each as `{ record, matchedAt, specificity }`. Without a `limit` it answers up to 500. Give a `limit` (in `input`) to page: when there are more, pass `nextCursor` back as `cursor`. POST /records/resolve-all ```ts const { items } = await app.records.resolveAll(collectionId, appId, { context: { productId: 'prod_abc' }, recordType: 'nutrition', }) for (const { record, matchedAt } of items) console.log(matchedAt, record.data) // 100 at a time const context = { productId: 'prod_abc' } let page = await app.records.resolveAll(collectionId, appId, { context, limit: 100 }) while (page.nextCursor) { page = await app.records.resolveAll(collectionId, appId, { context, limit: 100, cursor: page.nextCursor }) } ```

**previewRule**(collectionId: string,
    appId: string,
    input: PreviewRuleParams) → `Promise<PreviewRuleResult>`
Preview which products in the collection match a given facetRule. Admin only. Use for live "matches N products" feedback while authoring a rule. POST /records/preview-rule

### app.threads

Conversation-oriented app objects for comments, discussions, Q&A, and reply-driven experiences.

**create**(collectionId: string,
    appId: string,
    input: CreateThreadInput,
    admin: boolean = false) → `Promise<AppThread>`
Create a new thread POST /threads

**list**(collectionId: string,
    appId: string,
    params?: ThreadListQueryParams,
    admin: boolean = false) → `Promise<ListResult<AppThread>>`
List threads with optional query parameters GET /threads Returns `{ items, nextCursor, count }`: the threads are in `items`, `count` is how many match in all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`. Sort with `orderBy`. A date field (`createdAt`, `updatedAt`) takes a range: `{ gte, lte }`. `includeDeleted` and `contactId` are for admin calls (`admin = true`) only: the public list refuses a parameter it does not read. ```typescript let page = await app.threads.list(collectionId, appId, { parentType: 'case', parentId: caseId, limit: 50 }) console.log(page.items, page.count) while (page.nextCursor) { page = await app.threads.list(collectionId, appId, { parentType: 'case', parentId: caseId, limit: 50, cursor: page.nextCursor }) } // The threads with the newest replies, started this month await app.threads.list(collectionId, appId, { createdAt: { gte: '2026-11-01T00:00:00Z' }, orderBy: [{ lastReplyAt: 'desc' }], }) ```

**get**(collectionId: string,
    appId: string,
    threadId: string,
    admin: boolean = false) → `Promise<AppThread>`
Get a single thread by ID GET /threads/:threadId

**update**(collectionId: string,
    appId: string,
    threadId: string,
    input: UpdateThreadInput,
    admin: boolean = false) → `Promise<AppThread>`
Update a thread PATCH /threads/:threadId Admin can update any field, public (owner) can only update body, tags, data, owner

**remove**(collectionId: string,
    appId: string,
    threadId: string,
    admin: boolean = false) → `Promise<`
Soft delete a thread DELETE /threads/:threadId

**reply**(collectionId: string,
    appId: string,
    threadId: string,
    input: ReplyInput,
    admin: boolean = false) → `Promise<AppThread>`
Add a reply to a thread POST /threads/:threadId/reply Atomically appends to replies array, increments replyCount, updates lastReplyAt

**deleteReply**(collectionId: string,
    appId: string,
    threadId: string,
    replyId: string,
    admin: boolean = false) → `Promise<AppThread>`
Delete a single reply from a thread by its reply id (moderation). DELETE /threads/:threadId/reply/:replyId Authorised for the reply's author, the proof owner, or a collection admin.

**aggregate**(collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false) → `Promise<AggregateResponse>`
Get aggregate statistics for threads POST /threads/aggregate

### appConfiguration

Scoped config and keyed data items for collections, products, variants, or batches. Best for settings and small standalone documents, not as the default answer for every app-owned entity.

**getConfig**(opts: AppConfigOptions) → `Promise<any>`
Get app configuration for a collection/product scope. Public reads return the public view of the config. If the stored config contains a top-level `admin` object, that block is omitted from public responses and included when `opts.admin === true`. ```typescript const config = await appConfiguration.getConfig({ appId: 'warranty-portal', collectionId: 'my-collection' }); ```

**getWidgetInstance**(opts: GetWidgetInstanceOptions) → `Promise<WidgetInstance<TWidget>>`
Resolve a configured widget instance by ID from an app's stored config. This is a thin convenience wrapper over `getConfig()` that reads `config.widgets[widgetId]`. ```typescript const widget = await appConfiguration.getWidgetInstance({ collectionId: 'my-collection', appId: 'widget-toolkit', widgetId: 'launch-countdown' }) ```

**listWidgetInstances**(opts: Omit<GetWidgetInstanceOptions, 'widgetId'>) → `Promise<WidgetInstanceSummary[]>`
List configured widget instances for an app. Useful for picker UIs, setup schemas, and widget-to-widget references. ```typescript const widgets = await appConfiguration.listWidgetInstances({ collectionId: 'my-collection', appId: 'widget-toolkit' }) ```

**setConfig**(opts: AppConfigOptions) → `Promise<any>`
Set app configuration for a collection/product scope. Requires admin authentication. Writing through the admin endpoint does not make every root-level field private. Use `config.admin` for confidential values that should only be returned on admin reads. ```typescript await appConfiguration.setConfig({ appId: 'warranty-portal', collectionId: 'my-collection', admin: true, config: { warrantyPeriod: 24, supportEmail: 'support@example.com' } }); ```

**deleteConfig**(opts: AppConfigOptions) → `Promise<void>`
Delete app configuration for a collection/product scope. Requires admin authentication. ```typescript await appConfiguration.deleteConfig({ appId: 'warranty-portal', collectionId: 'my-collection', admin: true }); ```

**getData**(opts: AppConfigOptions & ListOptions) → `Promise<ListResult<any>>`
Get all keyed data items for an app within a scope. Best for a small set of standalone documents such as FAQs, menus, lookup tables, or content fragments where the caller typically knows the item IDs. If you are modelling richer app entities that need filtering, lifecycle fields, visibility, ownership, or relationships, prefer `app.records`, `app.cases`, or `app.threads` instead. `limit` and `cursor` give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const scope = { appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123' } let page = await appConfiguration.getData({ ...scope, limit: 100 }); while (page.nextCursor) { page = await appConfiguration.getData({ ...scope, limit: 100, cursor: page.nextCursor }); } ```

**getDataItem**(opts: AppConfigOptions) → `Promise<any>`
Get a single keyed data item by ID within a scope. This is ideal when you already know the exact ID of a simple scoped document. For richer domain objects that users browse or query, prefer `app.records`, `app.cases`, or `app.threads`. ```typescript const item = await appConfiguration.getDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', itemId: 'manual-1' }); ```

**setDataItem**(opts: AppConfigOptions) → `Promise<any>`
Set/create a keyed data item within a scope. Requires admin authentication. Use this for simple scoped documents attached to a collection/product/variant/batch, especially when you want a small number of items with stable IDs. Do not treat this as the default write path for every app-owned entity. If the data starts behaving like a real object with lifecycle, filtering, visibility, ownership, history, or relationships, prefer `app.records`, `app.cases`, or `app.threads`. ```typescript await appConfiguration.setDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', admin: true, data: { id: 'manual-1', title: 'User Manual', url: 'https://...' } }); ```

**deleteDataItem**(opts: AppConfigOptions) → `Promise<void>`
Delete a keyed data item by ID within a scope. Requires admin authentication. ```typescript await appConfiguration.deleteDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', admin: true, itemId: 'manual-1' }); ```

**getWidgets**(collectionId: string,
    options?: GetCollectionWidgetsOptions) → `Promise<CollectionWidgetsResponse>`
Fetches ALL widget data (manifests + bundle files) for a collection in one call. Returns everything needed to render widgets with zero additional requests. This solves N+1 query problems by fetching manifests, JavaScript bundles, and CSS files in parallel on the server. and bundle files. It always comes back whole: there is no `limit` or `cursor`, and `nextCursor` is always `null`. ```typescript // Fetch all widget data for a collection const { items: apps } = await Api.AppConfiguration.getWidgets(collectionId); // apps: [{ appId, manifest, widget, container, admin }, ...] //   widget / container: { js: { umd?, esm? }, css?, source?, styles? } //     source / styles - the bundle inlined (when small enough); js / css - URLs otherwise. //   admin - URL of the app's app.admin.json (setup / tunable options), or null. // Bundles don't ship React: they resolve shared libraries from the HOST's globals // (host-dependency-contract.md), so loading one is a host's job. // // Inside a host (Portal / Hub), an app showing ANOTHER app's widget should not load // bundles itself - use the host-provided EmbeddedWidget prop: //   <EmbeddedWidget appId="raffle" size="standard" />   (docs/widgets.md) // Force refresh all widgets const { items: fresh } = await Api.AppConfiguration.getWidgets(collectionId, { force: true }); ```

**resolveFeature**(system: SystemBlock | undefined, flag: string) → `boolean`
Resolve whether a feature flag is on, applying the `accountType` default: `enterprise` accounts default every flag to **on** unless `features[flag]` is explicitly `false`; `standard` accounts (or missing `accountType`) default every flag to **off** unless `features[flag]` is explicitly `true`. An explicit value always wins over the default either way. This is the same logic `isFeatureEnabled()` / `isFeatureEnabledSync()` use internally — call those instead in normal code. `system.features` and `accountType` are public data (no admin-only feature-check path exists), so there's no reason to fetch differently for an admin surface. This is exposed separately only for the rare case where you already have a `system` block in hand from somewhere other than `getAppConfig()` (e.g. server-rendered props) and want to resolve a flag from it directly. ```typescript const enabled = appConfiguration.resolveFeature(someSystemBlock, 'custom_domain'); ```

**getAppConfig**(collectionId: string,
    options?: { force?: boolean }) → `Promise<AppsConfigResponse>`
Fetch the collection's app catalog + `appConfig` entitlements data in one call — installed modules (`apps`), resolved entitlements (`system.features`, `system.meters`, etc.), and item-handling settings. This is `/public/collection/:id/app/config` (`collection.getAppsConfig()`), which now carries both; there's no need to separately call `appConfiguration.getConfig({ appId: 'appConfig' })` for public reads. Cached in-memory (and sessionStorage) for `ttl` so repeated calls across a page/session are cheap; pass `force` to bypass the cache after a mutation (e.g. after `entitlements-reconcile`). For admin-only data (`systemPrivate`), use `appConfiguration.getConfig({ collectionId, appId: 'appConfig', admin: true })` directly — this endpoint is public-only and never returns it. See docs/appConfig.md for the full contract. ```typescript const cfg = await appConfiguration.getAppConfig(collectionId); console.log(cfg.system?.features); ```

**isFeatureEnabled**(collectionId: string,
    flag: string,
    options?: { force?: boolean }) → `Promise<boolean>`
Check whether a feature flag is enabled for a collection, per `appConfig.system.features` — applying the `accountType` default (see `resolveFeature()`): enterprise accounts default every flag to on unless explicitly set to `false`. This is the standard way for subapps to gate features — it reads through the same cache as `getAppConfig`, so calling it repeatedly (e.g. once per component) does not re-fetch on every call. This is always async because the very first call for a collection has nothing to read yet. If you need a synchronous check (e.g. inside a render function), call this once during app init to warm the cache, then use `isFeatureEnabledSync()` afterwards. ```typescript if (await appConfiguration.isFeatureEnabled(collectionId, 'custom_domain')) { enableCustomDomainUI(); } ```

**isFeatureEnabledSync**(collectionId: string, flag: string) → `boolean | undefined`
Synchronous, cache-only check for a feature flag. Returns `undefined` if `getAppConfig()` / `isFeatureEnabled()` hasn't been called yet for this collection this page load (i.e. nothing to read without an await) — treat `undefined` as "not yet known", not as "disabled". ```typescript // Warm the cache once, e.g. in a top-level effect: useEffect(() => { appConfiguration.isFeatureEnabled(collectionId, 'custom_domain') }, [collectionId]); // Elsewhere, read synchronously without an await: const enabled = appConfiguration.isFeatureEnabledSync(collectionId, 'custom_domain'); if (enabled === undefined) { // not warmed yet — fall back to a loading state or the async version } ```

**resolveEnabled**(cfg: { enabled?: Record<string, boolean> } | null | undefined, key: string) → `boolean`
Has the collection SWITCHED ON this part of the platform (`appConfig.enabled[key]`)? A missing key is on — only an explicit `false` is off. This is "does this business use it", not "does the plan allow it": for something a plan gates, check `resolveFeature()` as well. docs/appConfig.md §8a.

**isEnabled**(collectionId: string, key: string, options?: { force?: boolean }) → `Promise<boolean>`
Has the collection switched on `key` (`products`, `crm`, `analytics`, `hub`, `portal`, `printStudio`, or an app's own key)? Hide what's off: a website-only business switches off products and the CRM, so menus, cards and setup steps for them shouldn't appear. ```typescript if (await appConfiguration.isEnabled(collectionId, 'products')) showProductsMenu(); ```

**isEnabledSync**(collectionId: string, key: string) → `boolean | undefined`
Cache-only `isEnabled` — `undefined` until `getAppConfig()` has been read this page load.

### asset

**upload**(options: UploadAssetOptions) → `Promise<Asset>`
Upload an asset file

**uploadFromUrl**(options: UploadFromUrlOptions) → `Promise<Asset>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**getForCollection**(collectionId: string,
    assetId: string) → `Promise<AssetResponse>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**listForCollection**(collectionId: string,
    options: ListOptions = {}) → `Promise<ListResult<AssetResponse>>`
The collection's own assets (public). Returns `{ items, nextCursor, count }`: the assets are in `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await asset.listForCollection('my-collection', { limit: 100 }) while (page.nextCursor) page = await asset.listForCollection('my-collection', { limit: 100, cursor: page.nextCursor }) ```

**getForProduct**(collectionId: string,
    productId: string,
    assetId: string) → `Promise<AssetResponse>`
The collection's own assets (public). Returns `{ items, nextCursor, count }`: the assets are in `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await asset.listForCollection('my-collection', { limit: 100 }) while (page.nextCursor) page = await asset.listForCollection('my-collection', { limit: 100, cursor: page.nextCursor }) ```

**listForProduct**(collectionId: string,
    productId: string,
    options: ListOptions = {}) → `Promise<ListResult<AssetResponse>>`
A product's assets (public). Returns `{ items, nextCursor, count }`: the assets are in `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await asset.listForProduct('my-collection', 'wine-bottle', { limit: 100 }) ```

**getForProof**(collectionId: string,
    productId: string,
    proofId: string,
    assetId: string) → `Promise<AssetResponse>`
A product's assets (public). Returns `{ items, nextCursor, count }`: the assets are in `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await asset.listForProduct('my-collection', 'wine-bottle', { limit: 100 }) ```

**listForProof**(collectionId: string,
    productId: string,
    proofId: string,
    appId?: string,
    options: ListOptions = {}) → `Promise<ListResult<AssetResponse>>`
A proof's assets (public), optionally only one app's. Returns `{ items, nextCursor, count }`: the assets are in `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await asset.listForProof('my-collection', 'wine-bottle', proofId, 'gallery', { limit: 100 }) ```

**list**(options: ListAssetsOptions) → `Promise<ListResult<Asset>>`
List assets for a given scope (a collection, a product or a proof). Returns `{ items, nextCursor, count }`: the assets are in `items`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const scope = { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' } as const let page = await asset.list({ scope, appId: 'gallery', limit: 100 }) while (page.nextCursor) page = await asset.list({ scope, appId: 'gallery', limit: 100, cursor: page.nextCursor }) ```

**get**(options: GetAssetOptions) → `Promise<Asset>`
Get an asset by id within a scope (public)

**remove**(options: RemoveAssetOptions) → `Promise<void>`
Remove an asset by id within a scope (admin)

**listAdmin**(options: AdminListAssetsOptions) → `Promise<ListResult<Asset>>`
List assets for a collection with full filtering options (admin). Returns `{ items, nextCursor }`: the assets are in `items`, 50 at a time unless you give a `limit` (at most 200). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. `count` (how many match in all) is there when you gave a `limit` or a `cursor`. Sort with `orderBy` (`createdAt`, `name`, `size` or `assetType`). ```typescript let page = await asset.listAdmin({ collectionId: 'my-collection', assetType: 'Image', orderBy: [{ name: 'asc' }], limit: 20 }) console.log(`${page.count} images`) while (page.nextCursor) { page = await asset.listAdmin({ collectionId: 'my-collection', assetType: 'Image', orderBy: [{ name: 'asc' }], limit: 20, cursor: page.nextCursor }) } ```

**getAdmin**(collectionId: string, assetId: string) → `Promise<Asset>`
Get a single asset by ID (admin).

**updateAdmin**(options: UpdateAssetOptions) → `Promise<Asset>`
Update asset metadata (admin). Use `replaceFile` to swap the file.

**replaceFile**(options: ReplaceAssetFileOptions) → `Promise<Asset>`
Replace the file of an existing asset. The previous file URL is snapshotted into `versions[]` on the asset.

**deleteAdmin**(options: DeleteAssetOptions) → `Promise<`
Soft-delete an asset. Schedules CDN purge after `graceDays` (default 30). Recoverable via `restoreAdmin` until purge runs.

**restoreAdmin**(collectionId: string, assetId: string) → `Promise<Asset>`
Restore a soft-deleted asset (clears `deletedAt`).

**ensureAssetUrl**(collectionId: string, assetId: string) → `Promise<Asset>`
Give an existing asset its own address (`assetUrl`). New and replaced assets get one automatically; this is for assets made before asset addresses existed. Safe to call again. → the asset, with `assetUrl`.

**bulkDelete**(options: BulkDeleteAssetsOptions) → `Promise<`
Soft-delete multiple assets in one request.

**requestUploadToken**(options: RequestUploadTokenOptions) → `Promise<UploadTokenResponse>`
Request a single-use upload token for a public (unauthenticated) upload. The token encodes the upload policy (allowed types, max size, review requirement). Policy source: collection-scoped app config at `sites/{collectionId}/apps/{appId}` (`uploadPolicy` key). Global `apps/{appId}` config is not used for this endpoint. ```typescript const { tokenId, policy } = await asset.requestUploadToken({ collectionId: 'my-collection', appId: 'user-gallery', contactId: contact.id, }) const uploaded = await asset.publicUploadWithToken({ collectionId: 'my-collection', tokenId, file: selectedFile, }) ```

**publicUploadWithToken**(options: PublicTokenUploadOptions) → `Promise<Asset>`
Upload a file using a single-use upload token (no admin auth required). Assets are created with `status: 'pending_review'` when the token policy has `reviewRequired: true`.

**createResumableUpload**(options: CreateResumableUploadOptions) → `Promise<ResumableUploadHandle>`
Open a resumable upload for a large file (e.g. video). The bytes are chunked directly to storage and can be paused/resumed — including after a page reload or app restart, by persisting `handle.id` and calling {@link resumeUpload}. ```ts const handle = await asset.createResumableUpload({ file, scope, appId }) localStorage.setItem('pendingUpload', handle.id)   // survives reload const uploaded = await handle.start({ onProgress: p => setPct(p) }) ```

**resumeUpload**(handleId: string, file: File) → `Promise<ResumableUploadHandle>`
Resume a previously-created resumable upload after a reload/app restart. Pass the persisted `handle.id` and the same `File`; the transfer continues from the offset storage already holds rather than restarting.

### attestation

**list**(collectionId: string,
    productId: string,
    proofId: string,
    options: ListOptions = {}) → `Promise<ListResult<AttestationResponse>>`
List the attestations for a proof: `{ items, nextCursor, count }`, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await attestation.list('coll_123', 'prod_abc', 'proof_1', { limit: 100 }) while (page.nextCursor) page = await attestation.list('coll_123', 'prod_abc', 'proof_1', { limit: 100, cursor: page.nextCursor }) ```

**get**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<AttestationResponse>`
Get a single attestation by ID.

**create**(collectionId: string,
    productId: string,
    proofId: string,
    data: AttestationCreateRequest) → `Promise<AttestationResponse>`
Create a new attestation for a proof.

**update**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string,
    data: AttestationUpdateRequest) → `Promise<AttestationResponse>`
Update an attestation. via `attestations.create()` with a note in `metadata` instead.

**remove**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<void>`
Delete an attestation. Use `attestations.create()` to append a corrective/superseding record instead.

### attestations

**create**(collectionId: string,
    data: CreateAttestationInput) → `Promise<Attestation>`
Create a single attestation (admin). `attestationType` are required ```typescript const a = await attestations.create('coll_123', { subjectType:     'container', subjectId:       'uuid-of-cask', attestationType: 'temperature', recordedAt:      '2025-04-15T14:30:00Z', value:           { celsius: 12.4 }, ownerData:       { sensorId: 'TEMP-7' }, unit:            '°C', visibility:      'public', }) ```

**createBatch**(collectionId: string,
    items: CreateAttestationInput[]) → `Promise<Attestation[]>`
Batch-create attestations (admin). Sends an array of `CreateAttestationInput` objects in a single request. The server processes them atomically and returns the created records. ```typescript const records = await attestations.createBatch('coll_123', [ { subjectType: 'container', subjectId: 'uuid1', attestationType: 'temperature', value: { celsius: 12.4 } }, { subjectType: 'container', subjectId: 'uuid1', attestationType: 'humidity',    value: { rh: 68 } }, ]) ```

**list**(collectionId: string,
    params: ListAttestationsParams) → `Promise<ListAttestationsResponse>`
List attestations for a subject (admin). Returns all three data zones. Supports filtering by type and by when it was recorded (`recordedAt: { gte, lte }`). `limit` and `cursor` ```typescript const filters = { subjectType: 'container', subjectId:   'uuid-of-cask', attestationType: 'temperature', recordedAt:  { gte: '2025-01-01T00:00:00Z' }, } as const let page = await attestations.list('coll_123', { ...filters, limit: 50 }) const records = page.items // next page: pass the cursor back with the same filters if (page.nextCursor) page = await attestations.list('coll_123', { ...filters, limit: 50, cursor: page.nextCursor }) ```

**summary**(collectionId: string,
    params: AttestationSummaryParams) → `Promise<AttestationSummaryResponse>`
Time-series summary of attestations (admin). Aggregates attestation counts (and optionally a numeric `value` field) into time buckets.  Useful for charting trends. `attestationType` are required ```typescript const { summary } = await attestations.summary('coll_123', { subjectType:     'container', subjectId:       'uuid-of-cask', attestationType: 'temperature', valueField:      'celsius', groupBy:         'day', recordedAt:      { gte: '2025-01-01T00:00:00Z' }, }) ```

**latest**(collectionId: string,
    params: AttestationLatestParams) → `Promise<AttestationLatestResponse>`
Latest snapshot — one record per `attestationType` (admin). Returns the most-recent attestation for each type recorded against this subject.  Ideal for dashboards that show the current state of a container. ```typescript const { latest } = await attestations.latest('coll_123', { subjectType: 'container', subjectId:   'uuid-of-fridge', }) // latest[0].attestationType === 'temperature' // latest[0].latest.value === { celsius: 4.1 } ```

**verify**(collectionId: string,
    params: AttestationVerifyParams) → `Promise<ChainVerifyResult>`
Verify the hash chain for a `(subjectType, subjectId, attestationType)` tuple (admin). Re-computes each `contentHash` and confirms it matches the stored value and correctly references the previous record's hash.  A `valid: false` result with `failedAt` indicates the first broken link. ```typescript const result = await attestations.verify('coll_123', { subjectType:     'container', subjectId:       'uuid-of-cask', attestationType: 'temperature', }) if (!result.valid) { console.warn('Chain broken at', result.failedAt) } ```

**treeSummary**(collectionId: string,
    params: AttestationTreeSummaryParams) → `Promise<AttestationTreeSummaryResponse>`
Tree time-series summary — aggregates across an entire container subtree (admin). Performs a BFS traversal of the container hierarchy rooted at `subjectId`, collects all descendant container IDs (and optionally their items), then aggregates attestations across all of them. `subjectType` is implicitly `'container'` ```typescript const { summary, subjectCount } = await attestations.treeSummary('coll_123', { subjectId:       'root-warehouse-uuid', attestationType: 'temperature', valueField:      'celsius', groupBy:         'hour', includeItems:    true, }) console.log(`Aggregated over ${subjectCount} subjects`) ```

**treeLatest**(collectionId: string,
    params: AttestationTreeLatestParams) → `Promise<AttestationTreeLatestResponse>`
Tree latest snapshot — most-recent record per type across a container subtree (admin). Same BFS traversal as `treeSummary`, but returns the most-recent record per `attestationType` aggregated across the entire subtree.

**publicList**(collectionId: string,
    params: ListAttestationsParams) → `Promise<PublicListAttestationsResponse>`
List attestations for a subject (public). Records with `visibility='admin'` are always excluded. Records with `visibility='owner'` are included only when the caller provides a valid Firebase ID token that resolves to the subject owner. The `audience` field in the response indicates the tier that was served. `limit` and `cursor`; filter by when it was recorded with `recordedAt: { gte, lte }` `null` on the last page ```typescript const { items: records, nextCursor, audience } = await attestations.publicList('coll_123', { subjectType: 'proof', subjectId:   'proof-uuid', recordedAt:  { gte: '2025-01-01T00:00:00Z', lte: '2025-12-31T23:59:59Z' }, limit: 50, }) ```

**publicCreate**(collectionId: string,
    data: OwnerAttestationInput) → `Promise<CreateOwnerAttestationResponse>`
Create a public attestation — the counterpart to the admin {@link create}. Authorised two ways, same call (the server decides from the request): 1. the proof OWNER (identity, via `Authorization: Bearer <Firebase ID token>`) adds an attestation to their own item; or 2. a holder of a `contribute`-scope grant adds one — call {@link setGrantToken} with the grant token first; for a public-link (anonymous) grant, pass `guestName` for attribution. Guardrails (server-enforced): `value` + `ownerData` only (`adminData` dropped), `visibility` clamped to `'public' | 'owner'`, `authorId`/`grantId` server-stamped. If the contribute grant was issued with `moderate: true`, the returned record has `moderationStatus: 'pending'` — held to the owner until {@link moderate}. The record joins the same tamper-evident hash chain. POST /public/collection/:collectionId/attestations ```ts // Owner: await attestations.publicCreate('coll_123', { subjectType: 'proof', subjectId: 'proof_1', attestationType: 'condition-report', value: { grade: 'excellent' }, visibility: 'public', }) // Contributor on a shared link: setGrantToken(shareToken) await attestations.publicCreate('coll_123', { subjectType: 'proof', subjectId: 'proof_1', attestationType: 'photo', value: { url }, visibility: 'public', guestName: 'Sam', }) ```

**moderate**(collectionId: string,
    attestationId: string,
    input: ModerateAttestationInput) → `Promise<ModerateAttestationResponse>`
Moderate a contributed attestation (proof OWNER by identity, or collection admin). `'approve'` releases it to its declared visibility; `'reject'` keeps it author + admin only. Only the `moderationStatus` changes — the hashed fact and its chain are untouched. Find pending items with {@link publicList} + `moderationStatus: 'pending'`. POST /public/collection/:collectionId/attestations/:attestationId/moderate ```ts await attestations.moderate('coll_123', 'att_uuid', { decision: 'approve' }) ```

**publicSummary**(collectionId: string,
    params: AttestationSummaryParams) → `Promise<PublicAttestationSummaryResponse>`
Time-series summary (public). Always served at `audience='public'`.  Same parameters as the admin version. `attestationType` are required

**publicLatest**(collectionId: string,
    params: AttestationLatestParams) → `Promise<PublicAttestationLatestResponse>`
Latest snapshot per `attestationType` (public). Owner elevation applies — provide a Firebase ID token for owner-tier data.

**publicTreeSummary**(collectionId: string,
    params: AttestationTreeSummaryParams) → `Promise<PublicAttestationTreeSummaryResponse>`
Tree time-series summary (public). Always served at `audience='public'`.  Performs the same BFS traversal as the admin version but only includes publicly visible attestations.

**publicTreeLatest**(collectionId: string,
    params: AttestationTreeLatestParams) → `Promise<PublicAttestationTreeLatestResponse>`
Tree latest snapshot (public).

**publicContainerList**(collectionId: string,
    containerId: string,
    params?: Omit<ListAttestationsParams, 'subjectType' | 'subjectId'>) → `Promise<PublicListAttestationsResponse>`
List attestations for a specific container (public shortcut). Equivalent to `publicList` with `subjectType='container'` and `subjectId=containerId` pre-filled. ```typescript const { items: records, nextCursor } = await attestations.publicContainerList('coll_123', containerId, { attestationType: 'temperature', recordedAt: { gte: '2025-01-01T00:00:00Z' }, limit: 50, }) ```

**publicContainerSummary**(collectionId: string,
    containerId: string,
    params: Omit<AttestationSummaryParams, 'subjectType' | 'subjectId'>) → `Promise<PublicAttestationSummaryResponse>`
Time-series summary for a specific container (public shortcut).

**publicContainerLatest**(collectionId: string,
    containerId: string) → `Promise<PublicAttestationLatestResponse>`
Latest snapshot for a specific container (public shortcut).

**publicContainerTreeSummary**(collectionId: string,
    containerId: string,
    params: Omit<AttestationTreeSummaryParams, 'subjectId'>) → `Promise<PublicAttestationTreeSummaryResponse>`
Tree time-series summary rooted at a specific container (public shortcut).

**publicContainerTreeLatest**(collectionId: string,
    containerId: string,
    params?: Pick<AttestationTreeLatestParams, 'includeItems'>) → `Promise<PublicAttestationTreeLatestResponse>`
Tree latest snapshot rooted at a specific container (public shortcut).

### auth

**login**(email: string, password: string) → `Promise<LoginResponse>`
Login with email and password. Sets the bearerToken for subsequent API calls.

**logout**() → `void`
Logout (clears bearerToken for future API calls).

**verifyToken**(token?: string) → `Promise<VerifyTokenResponse>`
Verifies the current bearerToken (or a provided token). Returns user/account info if valid.

**requestAdminJWT**(collectionId: string) → `Promise<string>`
Requests an admin JWT for the current user and a specific collection Returns JWT if valid.

**requestPublicJWT**(collectionId: string, productId: string, proofId: string) → `Promise<string>`
Requests a JWT for the current user and a specific collection/product/proof Validates if the user has access to the resource, and returns a JWT

**registerUser**(user: UserAccountRegistrationRequest) → `Promise<LoginResponse>`
Tries to register a new user account. Can return a bearer token, or a Firebase token

**getUserToken**(opts?: {
    email?: string
    collectionId?: string
    userId?: string
    expiry?: string
  }) → `Promise<`
Admin: Get a user bearer token (impersonation/automation). POST /admin/auth/userToken All fields are optional; at least one identifier should be provided.

**getLocation**(options: AuthLocationCacheOptions = {}) → `Promise<AuthLocation>`
Gets a best-effort coarse location for the current anonymous caller. This endpoint is typically IP-derived and is useful when the user is not logged in but you still want country/location context for content rules, analytics enrichment, or regional defaults. Returns fields such as `country`, `latitude`, `longitude`, and `area` when available. By default the result is cached in session storage for 30 minutes so apps can reuse coarse location context without repeatedly hitting the endpoint.

**clearCachedLocation**(storageKey: string = DEFAULT_AUTH_LOCATION_CACHE_KEY) → `void`
Clears the cached anonymous auth location, if present.

**getAccount**() → `Promise<AccountInfoResponse>`
Gets current account information for the logged in user. Returns user, owner, account, and location objects. When the caller is authenticated, prefer `account.location` from this response. For anonymous callers, use `auth.getLocation()` instead. Short-circuits immediately (no network request) when the SDK has no bearer token or API key set — the server would return 401 anyway. Throws a `SmartlinksApiError` with `statusCode 401` and `details.local = true` so callers can distinguish "never authenticated" from an actual server-side token rejection. This short-circuit is skipped when proxy mode is enabled, because in that case credentials are held by the parent frame and the local SDK may have no token set yet — the request must be forwarded to the parent to determine whether the user is authenticated.

### authKit

**login**(clientId: string, email: string, password: string, trustedDeviceToken?: string) → `Promise<AuthLoginResponse>`
Login with email + password (public). When the client's MFA policy requires a step-up, the server returns **403 `MFA_REQUIRED`** instead of a session — `login()` throws a `SmartlinksApiError` with `err.errorResponse?.errorCode === 'MFA_REQUIRED'` and the challenge details in `err.details` (see {@link MfaRequiredDetails}). Route the caller to {@link mfaChallengeSend} on that error; this method's return type is unchanged. returned one (via {@link mfaChallengeVerify}/{@link mfaRecoveryCode} with `trustDevice: true`), pass it here to skip the challenge entirely as long as it's still valid. If it's revoked/expired, the server silently falls back to requiring a fresh challenge — `login()` just returns `MFA_REQUIRED` again, no special handling. Security errors (thrown as `SmartlinksApiError`, see {@link LoginSecurityErrorCode}): - `ACCOUNT_TEMPORARILY_LOCKED` (429) — `err.details.retryAfterSeconds` says how long to wait. - `PASSWORD_EXPIRED` (403) — `err.details.resetToken` is short-lived; route into {@link completePasswordReset} to change the password in place.

**register**(clientId: string, data: { email: string; password: string; displayName?: string; accountData?: Record<string, any> }) → `Promise<AuthLoginResponse>`
Register a new user (public). Not gated by step-up MFA — a brand-new user has no enrolled factors yet, so there's nothing to challenge against. The new password is validated against the collection's `passwordPolicy` — may throw a {@link PasswordPolicyErrorCode} (400). The same validation applies to {@link completePasswordReset} and {@link changePassword}. Read the policy for a live checklist from `authKit.load(clientId)` → `config.security.passwordPolicy`.

**googleLogin**(clientId: string, idToken: string, trustedDeviceToken?: string) → `Promise<AuthLoginResponse>`
Google OAuth login via ID token (public). Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape. {@link mfaChallengeVerify}/{@link mfaRecoveryCode} (with `trustDevice: true`) to skip the challenge on this device, same as {@link login}.

**googleCodeLogin**(clientId: string, code: string, redirectUri: string) → `Promise<AuthLoginResponse>`
Google OAuth login via server-side authorization code (public).

**linkedInLogin**(clientId: string, code: string, redirectUri: string, trustedDeviceToken?: string) → `Promise<AuthLoginResponse>`
Sign in with LinkedIn (OpenID Connect) via a server-side authorization code (public). LinkedIn has no client-side ID-token SDK, so this is always the authorization-code flow: redirect the browser to LinkedIn's authorize endpoint, then pass the returned one-time `code` (and the exact `redirectUri` used) here — the server exchanges it (with the app's client secret) and verifies the id_token. Mirrors {@link googleCodeLogin}: on success the bearer token is stored and the cache invalidated. Notable error codes (thrown as `SmartlinksApiError`, read via `err.errorCode`): - `MISSING_LINKEDIN_CODE` (400), `LINKEDIN_AUTH_NOT_CONFIGURED` (400), `INVALID_LINKEDIN_TOKEN` (400), `LINKEDIN_AUTH_FAILED` (500) - `ACCOUNT_EXISTS_UNVERIFIED` (409) — same shared verified-to-verified linking policy as {@link googleLogin}/{@link appleLogin}. Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.

**appleLogin**(clientId: string, identityToken: string, opts?: AppleLoginOptions) → `Promise<AuthLoginResponse>`
Sign in with Apple via an Apple identity token (public). Mirrors {@link googleLogin}. On success the returned bearer token is stored automatically and the cache is invalidated. Notable error codes (thrown as `SmartlinksApiError`, read via `err.errorCode`): - `MISSING_APPLE_TOKEN` (400), `APPLE_AUTH_NOT_CONFIGURED` (400), `INVALID_APPLE_TOKEN` (401), `APPLE_AUTH_FAILED` (500) - `ACCOUNT_EXISTS_UNVERIFIED` (409) — an unverified account already owns this email; the server refuses to silently link. `err.details.requiresEmailVerification` is `true`. Recoverable: the user should sign in with their password (or reset it), then link Apple from settings. **The same 409 can now come back from {@link googleLogin}** under the shared verified-to-verified linking policy. Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape. Pass `opts.trustedDeviceToken` to skip the challenge on a recognized device.

**microsoftLogin**(clientId: string, idToken: string, opts?: MicrosoftLoginOptions) → `Promise<AuthLoginResponse>`
Sign in with Microsoft — work or school accounts from any organisation, and personal Microsoft accounts — via a Microsoft ID token (public). Mirrors {@link appleLogin}: on success the bearer token is stored and the cache invalidated. Get the ID token from Microsoft's sign-in (response_type `id_token`, scope `openid profile email`) against the app in the public config's `microsoftClientId`. A site on its own domain can't be a registered address of that app, so the SmartLinks sign-in UI opens SmartLinks' Microsoft sign-in page in a popup, which calls this with `opts.returnOrigin` and hands the result back. Notable error codes: `MISSING_MICROSOFT_TOKEN` (400), `MICROSOFT_AUTH_NOT_CONFIGURED` (400), `INVALID_MICROSOFT_TOKEN` (401), `MICROSOFT_ORIGIN_NOT_ALLOWED` (403), `NOT_IN_ORGANISATION` (403 — the login setup's {@link AuthKitAccess} rule), `ACCOUNT_EXISTS_UNVERIFIED` (409), `MICROSOFT_AUTH_FAILED` (500). Gated by step-up MFA like every sign-in.

**refreshToken**(clientId: string, refreshToken: string) → `Promise<RefreshResponse>`
Exchange a refresh token for a fresh access token (public — the refresh token IS the credential). **Native sessions only**; refresh tokens are issued only when the host opted in via `initializeApi({ platform: 'native' })`. On success the new access token is stored automatically (`setBearerToken`). The returned `refreshToken` is **rotated** — the caller must persist it and discard the old one before refreshing again. ⚠️ **Single-use, no retry, serialize calls.** This method issues exactly one request and never retries: replaying a consumed refresh token triggers `REFRESH_TOKEN_REUSE_DETECTED` (the whole session family is revoked). The caller is responsible for ensuring only one refresh is in flight at a time (e.g. across tabs or resume events). Errors (thrown as `SmartlinksApiError`, read via `err.errorCode`): `MISSING_REFRESH_TOKEN` (400), `INVALID_REFRESH_TOKEN` (401), `REFRESH_TOKEN_REUSE_DETECTED` (401) — the last two mean a hard logout.

**logout**(clientId: string, refreshToken: string) → `Promise<LogoutResponse>`
Revoke a refresh token's entire family server-side (that device's whole rotation chain) and clear the in-memory bearer token. Idempotent — always resolves to `{ success: true }`, never revealing whether the token existed. Call on explicit sign-out. Persisted tokens in the host's own storage must be cleared separately.

**sendMagicLink**(clientId: string, data: { email: string; redirectUrl: string; accountData?: Record<string, any> }) → `Promise<MagicLinkSendResponse>`
Send a magic link email to the user (public).

**verifyMagicLink**(clientId: string, token: string, trustedDeviceToken?: string) → `Promise<MagicLinkVerifyResponse>`
Verify a magic link token and authenticate/create the user (public). Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.

**sendPhoneCode**(clientId: string, phoneNumber: string) → `Promise<PhoneSendCodeResponse>`
Send phone verification code (public).

**verifyPhoneCode**(clientId: string, phoneNumber: string, code: string, trustedDeviceToken?: string) → `Promise<PhoneVerifyResponse>`
Verify phone verification code (public). Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape.

**sendWhatsApp**(clientId: string, body: SendWhatsAppRequest = {}) → `Promise<SendWhatsAppResponse>`
Send a WhatsApp verification deep-link (public).

**verifyWhatsApp**(clientId: string, token: string, phoneNumber: string) → `Promise<VerifyWhatsAppResponse>`
Manually verify WhatsApp token if inbound webhook path is unavailable (legacy/public fallback). Not gated by step-up MFA — this endpoint only confirms the code, it never issues a session/bearer token, so there is nothing to challenge. {@link exchangeWhatsAppSession} is the WhatsApp method that's gated.

**getWhatsAppStatus**(clientId: string, token: string) → `Promise<WhatsAppStatusResponse>`
Poll WhatsApp verification status for a token (public).

**exchangeWhatsAppSession**(clientId: string, token: string, sessionKey: string, trustedDeviceToken?: string) → `Promise<ExchangeWhatsAppSessionResponse>`
Exchange a verified WhatsApp token for an Auth Kit session (public). Gated by step-up MFA — see {@link login} for the `MFA_REQUIRED` error shape. This is the WhatsApp method that needs `trustedDeviceToken`, not {@link verifyWhatsApp} (which never issues a session).

**sendSmsVerify**(clientId: string, body: SendSmsVerifyRequest) → `Promise<SendSmsVerifyResponse>`
Send an SMS click-to-verify link (public).

**verifySms**(clientId: string, token: string, phoneNumber?: string) → `Promise<VerifySmsResponse>`
Verify an SMS click-to-verify token via API (public).

**upsertContact**(clientId: string, body: UpsertContactRequest) → `Promise<UpsertContactResponse>`
Upsert contact identity after lightweight verification (public).

**requestPasswordReset**(clientId: string, data: { email: string; redirectUrl?: string; clientName?: string }) → `Promise<PasswordResetRequestResponse>`
Upsert contact identity after lightweight verification (public).

**verifyResetToken**(clientId: string, token: string) → `Promise<VerifyResetTokenResponse>`
Upsert contact identity after lightweight verification (public).

**completePasswordReset**(clientId: string, token: string, newPassword: string) → `Promise<PasswordResetCompleteResponse>`
Complete a password reset / invite acceptance. On invite acceptance under `verify-auto-login` the server returns a session — adopt it so the caller is logged straight in (plain resets return no token and leave the bearer untouched).

**sendEmailVerification**(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }) → `Promise<EmailVerificationActionResponse>`
Complete a password reset / invite acceptance. On invite acceptance under `verify-auto-login` the server returns a session — adopt it so the caller is logged straight in (plain resets return no token and leave the bearer untouched).

**verifyEmail**(clientId: string, token: string) → `Promise<EmailVerifyTokenResponse>`
Verify an email token; under `verify-auto-login` the server returns a session — adopt it.

**resendEmailVerification**(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }) → `Promise<EmailVerificationActionResponse>`
Verify an email token; under `verify-auto-login` the server returns a session — adopt it.

**getProfile**(clientId: string) → `Promise<UserProfile>`
Verify an email token; under `verify-auto-login` the server returns a session — adopt it.

**updateProfile**(clientId: string, data: ProfileUpdateData) → `Promise<UpdateProfileResponse>`
Update the authenticated user's profile and replace the bearer token when refreshed claims are returned.

**changePassword**(clientId: string, currentPassword: string, newPassword: string) → `Promise<SuccessResponse>`
Update the authenticated user's profile and replace the bearer token when refreshed claims are returned.

**changeEmail**(clientId: string, newEmail: string, password: string, redirectUrl: string) → `Promise<SuccessResponse>`
Update the authenticated user's profile and replace the bearer token when refreshed claims are returned.

**verifyEmailChange**(clientId: string, token: string) → `Promise<SuccessResponse>`
Update the authenticated user's profile and replace the bearer token when refreshed claims are returned.

**updatePhone**(clientId: string, phoneNumber: string, verificationCode: string) → `Promise<SuccessResponse>`
Update the authenticated user's profile and replace the bearer token when refreshed claims are returned.

**deleteAccount**(clientId: string, password: string, confirmText: string) → `Promise<SuccessResponse>`
Update the authenticated user's profile and replace the bearer token when refreshed claims are returned.

**mfaChallengeSend**(clientId: string, mfaSessionToken: string, factor: MfaFactor) → `Promise<MfaChallengeSendResponse>`
Send (or resend) an MFA challenge code to the given factor (public). For `totp` nothing is sent — it tells the server the code will come from their authenticator app; then {@link mfaChallengeVerify}.

**mfaChallengeVerify**(clientId: string, mfaSessionToken: string, code: string, trustDevice?: boolean, deviceLabel?: string) → `Promise<MfaFinalizeResponse>`
Verify an MFA challenge code and finalize the login (public). On success this behaves like {@link login} — the bearer token is adopted and the cache invalidated. it and pass it to future {@link login} calls to skip the challenge on this device.

**mfaRecoveryCode**(clientId: string, mfaSessionToken: string, code: string, trustDevice?: boolean, deviceLabel?: string) → `Promise<MfaFinalizeResponse>`
Finalize a challenged login using a single-use recovery code instead of a sent code (public). Same finalize-session behaviour as {@link mfaChallengeVerify}.

**getMfaFactors**(clientId: string) → `Promise<MfaFactorsResponse>`
List enrolled factors and recovery-code count for the current user (authenticated).

**enrollEmailMfa**(clientId: string) → `Promise<MfaEnrollSendResponse>`
Begin email-factor enrollment; sends a code to the account's existing email (authenticated).

**confirmEmailMfa**(clientId: string, mfaSessionToken: string, code: string) → `Promise<MfaEnrolledResponse>`
Confirm email-factor enrollment with the code sent by {@link enrollEmailMfa} (authenticated).

**enrollSmsMfa**(clientId: string, phoneNumber: string) → `Promise<MfaEnrollSendResponse>`
Begin SMS-factor enrollment; sends a code to the given phone number (authenticated).

**confirmSmsMfa**(clientId: string, mfaSessionToken: string, code: string) → `Promise<MfaEnrolledResponse>`
Confirm SMS-factor enrollment with the code sent by {@link enrollSmsMfa} (authenticated).

**enrollTotpMfa**(clientId: string) → `Promise<MfaTotpEnrollResponse>`
Begin authenticator-app enrollment (authenticated): a new secret for Google Authenticator, Microsoft Authenticator, 1Password and the like. Show `otpauthUri` as a QR code (and `secret` for typing in), then {@link confirmTotpMfa} with the code the app shows. Nothing is kept until then; setting up again replaces the previous app once confirmed.

**confirmTotpMfa**(clientId: string, mfaSessionToken: string, code: string) → `Promise<MfaEnrolledResponse>`
Confirm authenticator-app enrollment with the 6-digit code the app shows (authenticated).

**generateMfaRecoveryCodes**(clientId: string, password: string) → `Promise<`
Generate a fresh set of recovery codes, invalidating any previous set (authenticated). Returned **in plaintext, exactly once** — nothing else in the API ever returns them again, so the caller must display/export them immediately.

**removeMfaFactor**(clientId: string, factor: MfaFactor, password: string) → `Promise<SuccessResponse>`
Remove an enrolled MFA factor (authenticated). Server route is DELETE with a body.

**listTrustedDevices**(clientId: string, options: ListOptions = {}) → `Promise<ListResult<TrustedDevice>>`
List devices trusted to skip MFA challenges for the current user (authenticated), a page at a time. Returns `{ items, nextCursor }`: the devices are in `items`. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await authKit.listTrustedDevices(clientId, { limit: 50 }) page.items // TrustedDevice[] while (page.nextCursor) page = await authKit.listTrustedDevices(clientId, { limit: 50, cursor: page.nextCursor }) ```

**revokeTrustedDevice**(clientId: string, id: string) → `Promise<SuccessResponse>`
Revoke a single trusted device by id (authenticated).

**load**(authKitId: string) → `Promise<AuthKitConfig>`
Load the **public** AuthKit config for a client (no auth). Returns branding + the public security subset (`security.passwordPolicy` + `security.session`); `security.lockout` is admin-only and never included here. Use this in the login UI to render password checklists and drive idle sign-out.

**get**(collectionId: string, authKitId: string) → `Promise<AuthKitConfig>`
Get the full AuthKit config, including admin-only fields like `security.lockout` (admin auth).

**list**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<AuthKitConfig>>`
List a collection's AuthKit configs (admin), a page at a time. Returns `{ items, nextCursor }`: the configs are in `items`. Page with `limit` (50 unless you say) and `cursor`. There is no public list. ```typescript let page = await authKit.list('coll_123', { limit: 50 }) page.items // AuthKitConfig[] while (page.nextCursor) page = await authKit.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**create**(collectionId: string, data: AuthKitConfigInput) → `Promise<AuthKitConfig>`
Create an AuthKit client config (admin). Accepts the account `security` policy — see {@link AuthKitConfigInput}.

**update**(collectionId: string, authKitId: string, data: AuthKitConfigInput) → `Promise<AuthKitConfig>`
Update an AuthKit client config (admin). This is how the account **security policy** is written — pass a `security` block ({@link AuthKitSecurityConfig}). The server validates it and enforces it; the login UI reads the public subset back via {@link load}.

**setIdentity**(collectionId: string, authKitId: string, body: { mode: 'own' }) → `Promise<AuthKitSetIdentityResponse>`
Give this AuthKit its **own logins** (admin): its members become accounts of this site only — the same email can be a separate account, with its own password, on another site — rather than SmartLinks accounts shared across sites. One way: a site with its own members can't go back to the shared pool. Members who signed up before keep their SmartLinks account until moved across. Errors: `MEMBER_POOL_CONFLICT` (409) when another AuthKit already gives one of its collections its own logins (one per collection); `PERMISSION_DENIED` (403) unless you administer every collection it serves.

**invite**(collectionId: string, authKitId: string, body: AuthKitInviteRequest) → `Promise<AuthKitInviteResponse>`
Invite someone to be a member of a site with its own logins (admin). Makes their account if they have none (the only way in when the site is invitation only — `signUp: 'invite'`), finds or creates their contact in this collection with the `customFields` you pass (their level), links the two, and emails them a sign-in link to the site (`redirectUrl`, default the kit's) that works once for 7 days. The page it opens handles it like any magic link: `mode=magicLink&token=…` → {@link verifyMagicLink}. Inviting someone again sends a fresh link. Errors: `OWN_LOGINS_REQUIRED` (409), `INVALID_EMAIL` (400), `INVALID_REDIRECT_URL` (400, not one of this site's addresses), `TOO_MANY_INVITES` (429, 5 an hour per address).

**schema**(collectionId: string) → `Promise<AuthKitSchema>`
Every sign-in setting: its path, default, what reads it (`screens` / `server` / `both`), in plain words.

**setup**(collectionId: string, body: AuthKitSetupRequest = {}) → `Promise<AuthKitSetupResponse>`
Set up the collection's sign-in in one call, safe to repeat: finds its sign-in (or makes one, with email + Google and confirm-then-signed-in, and makes it the collection's default), optionally gives it its own logins (ONE WAY — members of this site only; needed for invite-only) and saves a first settings patch. Errors: `INVALID_CONFIG` (400, `problems`), `OWN_LOGINS_REQUIRED` (409), `MEMBER_POOL_CONFLICT` (409), `SECRET_IN_SETTINGS` (400).

**settings**(collectionId: string, authKitId: string) → `Promise<AuthKitSettingsResponse>`
What sign-in does now: the stored config, every default filled in, which secrets are set (masked), and checks.

**redirectDomains**(collectionId: string, authKitId: string) → `Promise<AuthKitRedirectDomainsResponse>`
Where this sign-in may send emailed links (password reset, magic link, verification): the domains that are automatic (connected to its own collections), the extra ones in its settings, and the connected domains of the caller's other collections it could also allow (offered only to an Owner of both). A page on a domain that isn't allowed still gets its link, via the same page on smartlinks.app.

**secretEntryLink**(collectionId: string, authKitId: string, name: string, opts: { label?: string } = {}) → `Promise<AuthKitSecretLink>`
A one-time SmartLinks page where the PERSON types a secret (e.g. `linkedInClientSecret`) — so it never passes through a chat or your code. Give them the `url`; it works once, for 30 minutes. Asking again replaces the link. Check it landed with {@link settings} (`secrets.<name>.set`).

**setSecret**(collectionId: string, authKitId: string, name: string, value: string) → `Promise<`
Store a secret you already hold (server-side code only — never ask a person to paste one to you). Returns the masked hint.

**removeSecret**(collectionId: string, authKitId: string, name: string) → `Promise<`
Remove a secret (that provider then uses SmartLinks' own app).

**previewEmail**(collectionId: string, authKitId: string, kind: AuthKitEmailKind, draft: Pick<AuthKitConfigInput, 'emailTemplates' | 'emailBranding' | 'branding'> = {}) → `Promise<AuthKitEmailPreview>`
An account email as it would be sent now — or with draft settings (`emailTemplates`, `emailBranding`, `branding`; checked like a save, nothing stored). Sample values stand in for the person and the link.

**remove**(collectionId: string, authKitId: string) → `Promise<void>`
An account email as it would be sent now — or with draft settings (`emailTemplates`, `emailBranding`, `branding`; checked like a save, nothing stored). Sample values stand in for the person and the link.

### batch

**get**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string,
    options: ListOptions = {}) → `Promise<ListResult<BatchResponse>>`
List the batches for a collection and product (admin only), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await batch.list('coll_123', 'prod_abc', { limit: 100 }) console.log(`${page.count} batches`) while (page.nextCursor) page = await batch.list('coll_123', 'prod_abc', { limit: 100, cursor: page.nextCursor }) ```

**create**(collectionId: string,
    productId: string,
    data: BatchCreateRequest) → `Promise<BatchResponse>`
Create a new batch for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    batchId: string,
    data: BatchUpdateRequest) → `Promise<BatchResponse>`
Update a batch for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<void>`
Delete a batch for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    batchId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a batch (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    batchId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a batch (admin only).

**searchInCollection**(collectionId: string,
    params?: SearchBatchesRequest) → `Promise<ListResult<BatchResponse>>`
Search for batches across all products in a collection. Allows searching by batch ID or name (`q`), with optional product filtering. `limit` is how many it returns (100 unless you say). When there are more, pass `nextCursor` back as `cursor` for the next ones; `null` means there are no more. ```typescript // Search for batches containing "2024", 50 at a time let page = await batch.searchInCollection('coll_123', { q: 'BATCH-2024', limit: 50 }) const batches = [...page.items] while (page.nextCursor) { page = await batch.searchInCollection('coll_123', { q: 'BATCH-2024', limit: 50, cursor: page.nextCursor }) batches.push(...page.items) } // Filter batches for a specific product const productBatches = await batch.searchInCollection('coll_123', { productId: 'prod_abc', limit: 100 }) // The first batches in the collection const firstBatches = await batch.searchInCollection('coll_123') // Check for expired batches (expiryDate is an ISO 8601 string) batches.forEach(batch => { if (batch.expiryDate && new Date(batch.expiryDate) < new Date()) { console.log(`Batch ${batch.id} is expired`) } }) ```

**findInCollection**(collectionId: string,
    batchId: string) → `Promise<BatchResponse>`
Find a specific batch by ID across all products in a collection. Returns the batch along with the productId it belongs to. ```typescript // Find which product contains a specific batch const batch = await batch.findInCollection('coll_123', 'BATCH-2024-001') console.log(`Batch found in product: ${batch.productId}`) console.log(`Expires: ${batch.expiryDate}`) ```

**getBatchTags**(collectionId: string,
    batchId: string,
    claimSetId?: string,
    options: ListOptions = {}) → `Promise<ListResult<BatchTag>>`
Get all tags/codes assigned to a specific batch. Shows which claim set codes have been assigned to this batch, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. `count` is how many there are in all. ```typescript // The tags assigned to a batch, 200 at a time let page = await batch.getBatchTags('coll_123', 'BATCH-2024-001', undefined, { limit: 200 }) console.log(`Batch has ${page.count} tags assigned`) page.items.forEach(tag => { console.log(`Code: ${tag.code}, ClaimSet: ${tag.claimSetId}, TagID: ${tag.tagId}`) }) while (page.nextCursor) { page = await batch.getBatchTags('coll_123', 'BATCH-2024-001', undefined, { limit: 200, cursor: page.nextCursor }) } // Get tags from a specific claim set const claimSetTags = await batch.getBatchTags('coll_123', 'BATCH-2024-001', '000001') ```

### bookings

**create**(collectionId: string, appId: string, input: CreateBookingInput, admin: boolean = false) → `Promise<Booking>`
Book. All claims succeed together or nothing is written; a clash fails with 409 (`SLOT_FULL`, `RESOURCE_TAKEN`, `PER_CONTACT_LIMIT`, …). Pass `idempotencyKey` so a retry never books twice. Public (admin = false): the app's `publicCreate.bookings` rules decide the status and limits; an anonymous guest may get `editToken` back (once) to manage the booking later. POST /bookings

**list**(collectionId: string, appId: string, params?: BookingListOptions, admin: boolean = true) → `Promise<ListResult<Booking>>`
List bookings (admin), a page at a time. `count` is how many match in all. `from` / `to` pick the bookings overlapping that time; `orderBy` sorts (earliest start first unless you say). There is no public list: a signed-in booker uses {@link mine}. GET /bookings ```typescript const from = new Date() let page = await bookings.list(collectionId, appId, { status: 'confirmed', from, orderBy: [{ startsAt: 'desc' }], limit: 50 }) page.items      // Booking[] page.count      // how many match in all while (page.nextCursor) { page = await bookings.list(collectionId, appId, { status: 'confirmed', from, orderBy: [{ startsAt: 'desc' }], limit: 50, cursor: page.nextCursor }) } ```

**mine**(collectionId: string, appId: string, params?: Omit<BookingListOptions, 'contactId'>) → `Promise<ListResult<Booking>>`
The signed-in caller's own bookings (public), a page at a time. Takes the same options as {@link list}, except `contactId`. GET /bookings/mine ```typescript const { items, nextCursor, count } = await bookings.mine(collectionId, appId, { from: new Date(), orderBy: [{ startsAt: 'asc' }], limit: 20 }) ```

**get**(collectionId: string, appId: string, bookingId: string, admin: boolean = false, opts?: BookingAccessOptions) → `Promise<Booking>`
Get one booking. Public: the signed-in booker, or a guest passing `{ editToken }`. GET /bookings/:bookingId

**update**(collectionId: string, appId: string, bookingId: string, input: UpdateBookingInput, admin: boolean = true) → `Promise<Booking>`
Update zones and descriptive fields (admin). PATCH /bookings/:bookingId

**confirm**(collectionId: string, appId: string, bookingId: string, admin: boolean = false, opts?: BookingAccessOptions) → `Promise<Booking>`
held / pending / waitlisted → confirmed (idempotent). A held booking whose hold has run out fails with HOLD_EXPIRED. Public: only the booker's own hold, when `ownerActions.bookings.confirm` allows. POST /bookings/:bookingId/confirm

**cancel**(collectionId: string, appId: string, bookingId: string, admin: boolean = false, opts?: BookingAccessOptions & { reason?: string }) → `Promise<Booking>`
Cancel and give the places back (idempotent). Public: per `ownerActions.bookings.cancel` and its cutoff. `reason` is admin-only (public cancels record 'owner'). POST /bookings/:bookingId/cancel

**move**(collectionId: string, appId: string, bookingId: string, input: MoveBookingInput, admin: boolean = false, opts?: BookingAccessOptions) → `Promise<Booking>`
Move to a new slot / time, all-or-nothing (a failed move leaves the booking as it was). Public: per `ownerActions.bookings.move`; the create rules are re-checked for the new time. POST /bookings/:bookingId/move

**extendHold**(collectionId: string, appId: string, bookingId: string, holdMinutes: number) → `Promise<Booking>`
Extend a hold by `holdMinutes` from now (admin; capped at 24h after the booking was made).

**complete**(collectionId: string, appId: string, bookingId: string) → `Promise<Booking>`
confirmed → completed (admin).

**noShow**(collectionId: string, appId: string, bookingId: string) → `Promise<Booking>`
confirmed → no_show (admin).

**freebusy**(collectionId: string, appId: string, q: FreeBusyQuery, admin: boolean = false) → `Promise<FreeBusyResponse>`
Busy intervals per resource (bookings, blocks, slots' own blocks) — never booking details. Public only when the app sets `publicRead.bookings.freebusy: true`. GET /bookings/freebusy

**message**(collectionId: string, appId: string, input: MessageBookersInput) → `Promise<MessageBookersResult>`
Message the people booked (admin): a template to everyone on a slot, or everyone booked in a date range (optionally with one person / room), each send hydrated with their booking ({{ booking }}). No segment to make. POST /bookings/message

### bookings.blocks

**create**(collectionId: string, appId: string, input: CreateBlockInput) → `Promise<BookingAllocation>`

**list**(collectionId: string, appId: string, params?: BlockListOptions) → `Promise<ListResult<BookingAllocation>>`
The blocks on a resource and/or in a date range (`from` / `to`), a page at a time (`limit`, `cursor`). GET /bookings/blocks ```typescript const { items, nextCursor } = await bookings.blocks.list(collectionId, appId, { resourceType: 'record', resourceId: 'staff-1', from: '2026-12-01T00:00:00Z', to: '2027-01-01T00:00:00Z', limit: 50, }) ```

**remove**(collectionId: string, appId: string, blockId: string) → `Promise<`
The blocks on a resource and/or in a date range (`from` / `to`), a page at a time (`limit`, `cursor`). GET /bookings/blocks ```typescript const { items, nextCursor } = await bookings.blocks.list(collectionId, appId, { resourceType: 'record', resourceId: 'staff-1', from: '2026-12-01T00:00:00Z', to: '2027-01-01T00:00:00Z', limit: 50, }) ```

### bookings.slots

**create**(collectionId: string, appId: string, input: CreateSlotInput) → `Promise<BookingSlot>`
Create a slot (admin). POST /bookings/slots

**createMany**(collectionId: string, appId: string, slots: CreateSlotInput[], opts?: { seriesId?: string }) → `Promise<`
Create many slots at once — a series — all-or-nothing (admin, max 500). POST /bookings/slots/batch

**list**(collectionId: string, appId: string, params?: SlotListOptions, admin: boolean = false) → `Promise<ListResult<BookingSlot>>`
List slots, a page at a time. Public: open, public slots only, each with `remaining`. `from` / `to` pick the slots in that time; `orderBy` sorts them. GET /bookings/slots ```typescript const { items, nextCursor, count } = await bookings.slots.list(collectionId, appId, { from, to, available: true, orderBy: [{ startsAt: 'asc' }], limit: 50, }) ```

**get**(collectionId: string, appId: string, slotId: string, admin: boolean = false) → `Promise<BookingSlot>`
GET /bookings/slots/:slotId

**update**(collectionId: string, appId: string, slotId: string, input: UpdateSlotInput) → `Promise<BookingSlot>`
Update a slot (admin). Capacity can't drop below what's booked (SLOT_OVERBOOKED); times can't change once anything is booked (SLOT_HAS_BOOKINGS).

**remove**(collectionId: string, appId: string, slotId: string) → `Promise<`
Delete a slot (admin; refused while places are booked).

### broadcasts

**create**(collectionId: string,
    body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>) → `Promise<BroadcastRecord>`

**list**(collectionId: string,
    query: ListBroadcastsQuery = {}) → `Promise<ListResult<BroadcastRecord>>`
The collection's broadcasts, a page at a time. Filter by the app that owns them (`appId`). ```typescript let page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50 }) page.items // BroadcastRecord[] while (page.nextCursor) page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string,
    id: string) → `Promise<BroadcastRecord>`
The collection's broadcasts, a page at a time. Filter by the app that owns them (`appId`). ```typescript let page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50 }) page.items // BroadcastRecord[] while (page.nextCursor) page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50, cursor: page.nextCursor }) ```

**update**(collectionId: string,
    id: string,
    body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>) → `Promise<BroadcastRecord>`
The collection's broadcasts, a page at a time. Filter by the app that owns them (`appId`). ```typescript let page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50 }) page.items // BroadcastRecord[] while (page.nextCursor) page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50, cursor: page.nextCursor }) ```

**remove**(collectionId: string,
    id: string) → `Promise<void>`
The collection's broadcasts, a page at a time. Filter by the app that owns them (`appId`). ```typescript let page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50 }) page.items // BroadcastRecord[] while (page.nextCursor) page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50, cursor: page.nextCursor }) ```

**recipients**(collectionId: string,
    id: string,
    query: ListOptions = {}) → `Promise<BroadcastRecipientsResponse>`
The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in all. A broadcast with no segment answers an empty page with a `note`. ```typescript const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 }) page.items      // Recipient[] page.count      // how many in all page.nextCursor // pass back as `cursor` for the next page; null on the last ```

**preview**(collectionId: string,
    id: string,
    body: BroadcastPreviewRequest) → `Promise<BroadcastPreviewResponse>`
The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in all. A broadcast with no segment answers an empty page with a `note`. ```typescript const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 }) page.items      // Recipient[] page.count      // how many in all page.nextCursor // pass back as `cursor` for the next page; null on the last ```

**send**(collectionId: string,
    id: string,
    body: BroadcastSendRequest = {}) → `Promise<`
The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in all. A broadcast with no segment answers an empty page with a `note`. ```typescript const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 }) page.items      // Recipient[] page.count      // how many in all page.nextCursor // pass back as `cursor` for the next page; null on the last ```

**sendTest**(collectionId: string,
    id: string,
    body: BroadcastSendTestRequest) → `Promise<BroadcastSendTestResponse>`
The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in all. A broadcast with no segment answers an empty page with a `note`. ```typescript const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 }) page.items      // Recipient[] page.count      // how many in all page.nextCursor // pass back as `cursor` for the next page; null on the last ```

**sendManual**(collectionId: string,
    id: string,
    body: BroadcastSendManualRequest) → `Promise<BroadcastSendManualResponse>`
The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in all. A broadcast with no segment answers an empty page with a `note`. ```typescript const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 }) page.items      // Recipient[] page.count      // how many in all page.nextCursor // pass back as `cursor` for the next page; null on the last ```

**append**(collectionId: string,
    body: BroadcastAppendEventBody) → `Promise<AppendResult>`
The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in all. A broadcast with no segment answers an empty page with a `note`. ```typescript const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 }) page.items      // Recipient[] page.count      // how many in all page.nextCursor // pass back as `cursor` for the next page; null on the last ```

**appendBulk**(collectionId: string,
    body: BroadcastAppendBulkBody) → `Promise<AppendBulkResult>`
The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in all. A broadcast with no segment answers an empty page with a `note`. ```typescript const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 }) page.items      // Recipient[] page.count      // how many in all page.nextCursor // pass back as `cursor` for the next page; null on the last ```

### chat.completions

**create**(collectionId: string,
        request: ChatCompletionRequest) → `Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>>`
Create a chat completion (streaming or non-streaming)

### chat.responses

**create**(collectionId: string,
        request: ResponsesRequest) → `Promise<ResponsesResult | AsyncIterable<ResponsesStreamEvent>>`
Create a Responses API request (streaming or non-streaming)

### claimSet

**getAll**(collectionId?: string, options: ListOptions = {}) → `Promise<ListResult<any>>`
Get all claim sets, a page at a time. Returns `{ items, nextCursor }`: the claim sets are in `items`; pass `nextCursor` back as `cursor` for the next page (`null` means that was the last one). When collectionId is provided, returns claim sets for that collection. When omitted, returns all claim sets owned by the authenticated user. ```typescript let page = await claimSet.getAll('coll_123', { limit: 50 }) while (page.nextCursor) page = await claimSet.getAll('coll_123', { limit: 50, cursor: page.nextCursor }) // Your own claim sets (no collection) const { items } = await claimSet.getAll(undefined, { limit: 50 }) ```

**get**(claimSetId: string, collectionId?: string) → `Promise<any>`
Get a specific claim set by ID.

**create**(params: CreateClaimSetRequest, collectionId?: string) → `Promise<any>`
Create a new claim set. When collectionId is provided, creates it scoped to that collection. When omitted, creates a global user-owned claim set.

**update**(claimSetId: string, params: any, collectionId?: string) → `Promise<any>`
Update a claim set.

**remove**(claimSetId: string, collectionId?: string) → `Promise<any>`
Delete (soft-delete) a claim set.

**getAllTags**(claimSetId: string, collectionId?: string) → `Promise<any>`
Get all tags for a claim set (including data). This is not one of the SDK 3 lists: the answer is the claim set itself with its tags inside. Without a collectionId (your own claim set) they are in `tags`; with one they are in `codes` (the tag ids), or in `codeMap` (id → key) for a secure set.

**getAssignedTags**(claimSetId: string, collectionId?: string, options: ListOptions = {}) → `Promise<ListResult<any> & Record<string, any>>`
Get assigned tags for a claim set — tags soft-assigned to a collection or product. Returns `{ items, nextCursor }` with the claim set's own fields (`id`, `name`, …) beside them: the tags are in `items`, a page at a time. Pass `nextCursor` back as `cursor` for the next page (`null` means that was the last one). ```typescript let page = await claimSet.getAssignedTags('12', 'coll_123', { limit: 50 }) console.log(`Assigned tags of ${page.name}:`, page.items) while (page.nextCursor) { page = await claimSet.getAssignedTags('12', 'coll_123', { limit: 50, cursor: page.nextCursor }) } ```

**createTag**(claimSetId: string,
    data: CreateClaimSetTagRequest,
    collectionId?: string) → `Promise<CreateClaimSetTagResponse>`
Create a single tag inside a claim set.

**importTags**(claimSetId: string,
    data: ImportClaimSetTagsRequest,
    collectionId?: string) → `Promise<ImportClaimSetTagsResponse>`
Bulk import tags into a claim set.

**getReport**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a report for a claim set (collection-scoped).

**getTagSummary**(collectionId: string) → `Promise<any>`
Get tag summary for a collection.

**tagQuery**(collectionId: string, data: any) → `Promise<any>`
Perform a tag query for a collection.

**makeClaim**(collectionId: string, params: any) → `Promise<any>`
Make a claim against a claim set (collection-scoped).

**assignClaims**(collectionId: string, data: AssignClaimsRequest) → `Promise<any>`
Assign claims to codes or ranges within a collection.

**updateClaimData**(collectionId: string, data: UpdateClaimDataRequest) → `Promise<any>`
Update claim data for a claim set (collection-scoped).

### claimSet.ranges

**list**(scope: ClaimSetScope, claimSetId: string, options: ListOptions = {}) → `Promise<ListResult<ClaimSetRange>>`
The ranges in a set, lowest index first, a page at a time (50 unless you give a `limit`). Returns `{ items, nextCursor }`: the ranges are in `items`; pass `nextCursor` back as `cursor` for the next page (`null` means that was the last one). ```typescript let page = await claimSet.ranges.list({ collectionId: 'coll_123' }, '12', { limit: 50 }) while (page.nextCursor) { page = await claimSet.ranges.list({ collectionId: 'coll_123' }, '12', { limit: 50, cursor: page.nextCursor }) } ```

**create**(scope: ClaimSetScope, claimSetId: string, params: CreateClaimSetRangeRequest) → `Promise<ClaimSetRange>`
Reserve the set's next indexes and mint a code (and, for NTAG 424, a key) for each.

**get**(scope: ClaimSetScope, claimSetId: string, rangeId: string) → `Promise<ClaimSetRange>`
One range, with its counts refreshed.

**update**(scope: ClaimSetScope, claimSetId: string, rangeId: string, params: UpdateClaimSetRangeRequest) → `Promise<ClaimSetRange>`
Name, notes, order details, or a stage move (sent to the printer, received).

**resume**(scope: ClaimSetScope, claimSetId: string, rangeId: string) → `Promise<ClaimSetRange>`
Finish minting a range that was interrupted.

**close**(scope: ClaimSetScope, claimSetId: string, rangeId: string) → `Promise<CloseClaimSetRangeResponse>`
Close an open range: it becomes a range with the quantity it reached (removed if nothing was minted).

**addMember**(scope: ClaimSetScope, claimSetId: string, groupId: string, params: AddClaimSetRangeMemberRequest) → `Promise<AddClaimSetRangeMemberResponse>`
Put an existing tag of the set into a group (by code or chip UID), assigning it if a collection is given.

**removeMember**(scope: ClaimSetScope, claimSetId: string, groupId: string, code: string) → `Promise<`
Take a tag out of a group. Its assignment is left as it is.

**tags**(scope: ClaimSetScope, claimSetId: string, rangeId: string,
      options: ListOptions & { keys?: boolean } = {}) → `Promise<ListResult<ClaimSetRangeTag>>`
The range's tags in index order, a page at a time (200 unless you give a `limit`, at most 1000). Returns `{ items, nextCursor }`: pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. `keys: true` includes each tag's key (owners and admins only). ```typescript let page = await claimSet.ranges.tags(scope, '12', rangeId, { limit: 500 }) while (page.nextCursor) { page = await claimSet.ranges.tags(scope, '12', rangeId, { limit: 500, cursor: page.nextCursor }) } ```

**next**(scope: ClaimSetScope, claimSetId: string, rangeId: string) → `Promise<ClaimSetRangeNextTag>`
The next tag to program on a phone (lowest index without a chip), with its URL and key.

**recordTag**(scope: ClaimSetScope, claimSetId: string, rangeId: string, code: string,
      params: { uid: string; data?: Record<string, unknown>; /** A plain (NTAG 21x) → `void`
Record the chip a phone just programmed with this code.

### collection

**readiness**(collectionId: string) → `Promise<CollectionReadiness>`
What the collection's installed apps need and whether it's there (sign-in, customers, products, something to claim), in plain words, each with the screen that fixes it. Admin. Never fails on a part it can't read: that part is left out.

**get**(collectionId: string, admin?: boolean) → `Promise<CollectionResponse>`
Retrieves a single Collection by its ID.

**list**(options: ListOptions = {}) → `Promise<ListResult<CollectionResponse>>`
The collections the signed-in user can work on (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. There is no public list of collections: read one with `collection.get`. ```typescript let page = await collection.list({ limit: 50 }) page.items.forEach(c => console.log(c.id, c.title)) while (page.nextCursor) page = await collection.list({ limit: 50, cursor: page.nextCursor }) ```

**getShortId**(shortId: string) → `Promise<CollectionResponse>`
Retrieve a collection by its shortId (public endpoint).

**getByHub**() → `Promise<CollectionResponse>`
Resolve the collection for the current Hub domain (public endpoint). The server derives the requesting domain from the request headers (`X-Source-Domain` / `X-Forwarded-Host` / `Host`), so no identifier is passed — this is the call a Hub frontend makes on load to find out which collection it is serving, whether it's reached via `{brand}.smartlinks.host` or a bring-your-own custom domain (e.g. `hub.acme.com`).

**getByDomain**(domain: string) → `Promise<CollectionResponse>`
Resolve the collection for an explicit Hub domain (public endpoint). Unlike {@link getByHub}, the domain is passed explicitly rather than derived from request headers — use this for raw/cross-origin calls where the Hub frontend knows its own hostname (e.g. "erbauer.smartlinks.host").

**checkHubAvailability**(collectionId: string, name: string) → `Promise<HubAvailabilityResponse>`
Check whether a Hub subdomain name is available to claim (admin only).

**claimHub**(collectionId: string, hubName: string) → `Promise<CollectionResponse>`
Claim or rename the Hub subdomain for a collection (admin only). Maps `{hubName}.smartlinks.host` to the collection. If the collection already had a different hub name, the previous subdomain is released automatically.

**registerDomain**(collectionId: string, domain: string, target: DomainTarget = "links") → `Promise<any>`
Connect one of the collection's own domains and start its certificate (admin only). or `"site"` for the collection's Hub domain.

**getDomainStatus**(collectionId: string, target: DomainTarget = "links") → `Promise<any>`
Get the certificate status of the collection's own domain (admin only). or `"site"` (its Hub domain, `hubCustomDomain`)

**releaseDomain**(collectionId: string, domain: string) → `Promise<`
Remove the collection's links domain (admin only). It stops working straight away: QR codes, GS1 Digital Links and short links printed with it no longer open. Its certificate goes and `redirectUrl` is cleared. (Site domains are removed from the site's settings.)

**getSettings**(collectionId: string, settingGroup: string, admin?: boolean) → `Promise<any>`
Retrieve a specific settings group for a collection. Public reads return the public view of the settings group. If the stored payload contains a top-level `admin` object, that block is omitted from public responses and included when `admin === true`.

**getAppsConfig**(collectionId: string) → `Promise<AppsConfigResponse>`
Retrieve all configured app module definitions for a collection (public endpoint), plus the collection's `appConfig` entitlements data (`system.features`, `system.meters`, `entitledAppGroups`, `itemRecordMode`, etc.) in the same response. See docs/appConfig.md. Prefer `appConfiguration.getAppConfig()` / `isFeatureEnabled()` for entitlement reads — they call this endpoint under the hood and cache the result.

**updateSettings**(collectionId: string, settingGroup: string, settings: any) → `Promise<any>`
Update a specific settings group for a collection (admin endpoint). This writes through the admin endpoint, but root-level fields are still part of the public settings payload. Put confidential values under `settings.admin` if they should only be returned on admin reads.

**create**(data: CollectionCreateRequest) → `Promise<CollectionResponse>`
Create a new collection (admin only).

**update**(collectionId: string, data: CollectionUpdateRequest) → `Promise<CollectionResponse>`
Update a collection (admin only).

**remove**(collectionId: string) → `Promise<void>`
Delete a collection (admin only).

**getSN**(collectionId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a collection (admin only).

**lookupSN**(collectionId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a collection (admin only).

**assignSN**(collectionId: string,
    codeId: string,
    value: any) → `Promise<any>`
Assign a value to a serial number for a collection (admin only).

**getUsers**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<CollectionUser>>`
List the users with access to a collection, each with their access level (admin only). Access is stored in the collection's `roles` map (userId → level); this resolves each to name/email. A page at a time: page with `limit` (50 unless you say) and `cursor`. GET /admin/collection/:collectionId/getUsers ```typescript let page = await collection.getUsers('coll_123', { limit: 50 }) page.items.forEach(u => console.log(u.email, u.access)) while (page.nextCursor) page = await collection.getUsers('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**setUserAccess**(collectionId: string,
    userId: string,
    access: CollectionAccessLevel | null) → `Promise<void>`
Grant, change, or remove a user's access level on a collection (admin only). Pass `null` or `'None'` to remove access. The server enforces privilege-escalation rules — you cannot grant an access level above your own, nor change a user whose level is above yours. POST /admin/collection/:collectionId/updateUserAccess

**inviteUser**(collectionId: string,
    input: InviteUserInput) → `Promise<`
Invite a user to a collection by email (admin only). Creates or links their account in the login / auth-kit collection (`loginCollectionId`, default `'global'`) and emails them an invite (new account) or an added-to-collection notice (existing account); returns their `uid`. This does NOT grant access on its own — follow with {@link setUserAccess} to set their level (this mirrors the console flow). POST /user/inviteUser

### comms

**getPushVapidPublicKey**(collectionId: string) → `Promise<import("../types/comms").PushVapidResponse>`
Public: Get VAPID public key used for Web Push subscriptions. GET /public/collection/:collectionId/comm/push/vapidPublicKey Note: Key may be global; path is collection-scoped for consistency.

**registerPush**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Register a Web Push subscription under unified comms. POST /public/collection/:collectionId/comm/push/register

**getSettings**(collectionId: string,
    opts: { includeSecret?: boolean } = {}) → `Promise<import("../types/comms").CommsSettingsGetResponse>`
Admin: Get current comms settings for a collection. GET /admin/collection/:collectionId/comm.settings Optional query: includeSecret=true to include unsub.secret in response.

**patchSettings**(collectionId: string,
    body: import("../types/comms") → `void`
Admin: Patch comms settings for a collection. PATCH /admin/collection/:collectionId/comm.settings

**getPublicTopics**(collectionId: string) → `Promise<import("../types/comms").CommsPublicTopicsResponse>`
Public: Fetch configured topics for a collection. GET /public/collection/:collectionId/comm/topics

**unsubscribe**(collectionId: string,
    query: import("../types/comms") → `void`
Public: Unsubscribe a contact from a category or channel. GET /public/collection/:collectionId/comm/unsubscribe

**signup**(collectionId: string,
    body: import("../types/comms") → `void`
Public: sign an email address up for topics (a newsletter, updates) — works signed out. Double opt-in: nothing is consented until the address's owner clicks the confirmation link SmartLinks emails them. Always answers `{ ok: true, pending: true }` (it never reveals whether the address is already known). Topics must be ones configured in the collection's comm settings. Set comm settings `signup.confirmedUrl` to send people to your own page after confirming. POST /public/collection/:collectionId/comm/signup

**upsertConsent**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Upsert default consent for a contact. POST /public/collection/:collectionId/comm/consent

**upsertPreferences**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Upsert preferences for a specific subject (or default if subject omitted). POST /public/collection/:collectionId/comm/preferences

**subscribe**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Subscribe/unsubscribe contact to a subject. POST /public/collection/:collectionId/comm/subscribe

**checkSubscription**(collectionId: string,
    query: import("../types/comms") → `void`
Public: Check subscription status for a subject. GET /public/collection/:collectionId/comm/subscription/check

**listMethods**(collectionId: string,
    query: import("../types/comms") → `void`
Public: List registered contact methods. All of them come back in one answer: `nextCursor` is always null. GET /public/collection/:collectionId/comm/methods ```typescript const { items: methods } = await comms.listMethods(collectionId, { type: 'email' }) ```

**registerEmail**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Register email method for a contact. POST /public/collection/:collectionId/comm/email/register

**registerSms**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Register SMS method for a contact. POST /public/collection/:collectionId/comm/sms/register

**resolveSubscriptions**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Resolve contacts for a subject with identity hints. POST /public/collection/:collectionId/comm/subscriptions/resolve

**queryByUser**(collectionId: string,
    body: CommsQueryByUser = {}) → `Promise<ListResult<CommunicationEvent>>`
Analytics: Query communication events by user or contact, a page at a time (`limit` and `cursor` in the body). The time window is `from` / `to`. POST /admin/collection/:collectionId/comm/query/by-user ```typescript const query = { contactId, from: '2026-01-01T00:00:00Z', limit: 200 } let page = await comms.queryByUser(collectionId, query) page.items // CommunicationEvent[] while (page.nextCursor) page = await comms.queryByUser(collectionId, { ...query, cursor: page.nextCursor }) ```

**queryRecipientIds**(collectionId: string,
    body: CommsRecipientIdsQuery) → `Promise<ListResult<RecipientId>>`
Analytics: Recipient IDs for a communication source, a page at a time (`limit` and `cursor` in the body). The time window is `from` / `to`. POST /admin/collection/:collectionId/comm/query/recipient-ids ```typescript const query = { broadcastId, idField: 'contactId' as const, limit: 500 } let page = await comms.queryRecipientIds(collectionId, query) page.items // the ids while (page.nextCursor) page = await comms.queryRecipientIds(collectionId, { ...query, cursor: page.nextCursor }) ```

**queryRecipientsWithoutInteraction**(collectionId: string,
    body: CommsRecipientsWithoutInteractionQuery) → `Promise<ListResult<RecipientId>>`
Analytics: the recipients of a broadcast or journey who did NOT then do an interaction. The ids come back in one answer (`nextCursor` is always null); `limit` is the most it returns. POST /admin/collection/:collectionId/comm/query/recipients/without-interaction ```typescript const { items: ids } = await comms.queryRecipientsWithoutInteraction(collectionId, { broadcastId, interactionId: 'survey-done' }) ```

**queryRecipientsWithInteraction**(collectionId: string,
    body: CommsRecipientsWithInteractionQuery) → `Promise<ListResult<RecipientId | RecipientWithOutcome>>`
Analytics: the recipients of a broadcast or journey who then did an interaction. With `includeOutcome: true` each item is `{ id, outcome }` instead of an id. One answer, no pages. POST /admin/collection/:collectionId/comm/query/recipients/with-interaction ```typescript const { items } = await comms.queryRecipientsWithInteraction(collectionId, { broadcastId, interactionId: 'survey-done', includeOutcome: true }) ```

**sendTransactional**(collectionId: string,
    body: TransactionalSendRequest) → `Promise<TransactionalSendResult>`
Send a single transactional message to one contact using a template. No broadcast record is created. The send is logged to the contact's communication history with sourceType: 'transactional'. POST /admin/collection/:collectionId/comm/send ```typescript const result = await comms.sendTransactional(collectionId, { contactId:  'e4f2a1b0-...', templateId: 'warranty-update', channel:    'preferred', props:      { claimRef: 'CLM-0042', decision: 'approved' }, include:    { productId: 'prod-abc123', appCase: 'c9d1e2f3-...' }, ref:        'warranty-decision-notification', appId:      'warrantyApp', }) if (result.ok) { console.log(`Sent via ${result.channel}`, result.messageId) } else { console.error('Send failed:', result.error) } ```

**logCommunicationEvent**(collectionId: string,
    body: LogCommunicationEventBody) → `Promise<AppendResult>`
Logging: Append a single communication event. POST /admin/collection/:collectionId/comm/log

**logBulkCommunicationEvents**(collectionId: string,
    body: LogBulkCommunicationEventsBody | ({ sourceId: string; ids: string[]; idField?: 'userId'|'contactId'; [k: string]: any }) → `void`
Logging: Append many communication events for a list of IDs. POST /admin/collection/:collectionId/comm/log/bulk

### conditions

**list**(collectionId: string, admin = false, options: ListOptions = {}) → `Promise<ListResult<SavedCondition>>`
The collection's saved conditions (removed ones left out), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await conditions.list('coll_123') page.items.map(c => c.title) // ["UK only", "In the stadium"] while (page.nextCursor) page = await conditions.list('coll_123', false, { cursor: page.nextCursor }) ```

**get**(collectionId: string, conditionId: string, admin = false) → `Promise<SavedCondition>`
One saved condition. Public reads 404 for a removed one; an admin read returns it with `deleted: true`. ```typescript const ukOnly = await conditions.get('coll_123', 'nfCmuWDY') ```

**create**(collectionId: string, data: SaveConditionRequest) → `Promise<SavedCondition>`
Save a new condition (admin). ```typescript const c = await conditions.create('coll_123', { title: 'UK only', type: 'and', conditions: [{ type: 'country', countries: ['GB'], contains: true }], }) ```

**update**(collectionId: string, conditionId: string, data: Partial<SaveConditionRequest>) → `Promise<SavedCondition>`
Change a saved condition (admin). Send the fields to change; `conditions` is replaced whole.

**remove**(collectionId: string, conditionId: string) → `Promise<SavedCondition>`
Remove a saved condition (admin). It's kept, marked deleted, and passes for everyone from then on.

### config

**getFields**() → `Promise<ListResult<FieldDefinition>>`
Returns the full platform field catalog. Fields are used as building blocks for proof type templates — they define the input widgets shown when creating or editing products and proof items. All of them come back in one answer: `nextCursor` is always null. **Endpoint:** `GET /api/v1/public/config/fields` ```typescript const { items: fields } = await config.getFields() ```

**getProofTypes**() → `Promise<ListResult<ProofTypeDefinition>>`
Returns all proof type definitions. Proof types are templates that specify which fields to show, which apps are pre-installed, and how the portal behaves for a given product category. All of them come back in one answer: `nextCursor` is always null. **Endpoint:** `GET /api/v1/public/config/proofTypes` ```typescript const { items: proofTypes } = await config.getProofTypes() ```

### contact

**query**(collectionId: string,
    body: StandardQuery = {}) → `Promise<QueryResult>`
The standard query on contacts (admin only): filter, sort, page, count and total in one call. POST /admin/collection/:collectionId/contacts/query Fields: contactId, userId, firstName, lastName, displayName, company, email, phone, tags, source, locale, createdAt, updatedAt. Email and phone are the contact's main one. Deleted and erased contacts are never returned. ```typescript await contact.query(collectionId, { where: { tags: { hasAny: ['vip', 'trade'] }, createdAt: { gte: '2026-01-01' } }, select: ['contactId', 'firstName', 'email'], count: true, }) await contact.query(collectionId, { groupBy: ['company'], aggregates: { people: { count: true } } }) ```

**queryFields**(collectionId: string) → `Promise<QueryDescription>`
What a contacts query can use: its fields and what each can filter, sort, group or total. GET /admin/collection/:collectionId/contacts/query

**create**(collectionId: string, data: ContactCreateRequest) → `Promise<ContactResponse>`
What a contacts query can use: its fields and what each can filter, sort, group or total. GET /admin/collection/:collectionId/contacts/query

**list**(collectionId: string,
    params?: ListOptions & { includeDeleted?: boolean }) → `Promise<ListResult<ContactResponse>>`
The collection's contacts, a page at a time (admin only). Pass `includeDeleted: true` to include deleted contacts. For filters, sorting and totals use `contact.query` or `contact.search`. GET /admin/collection/:collectionId/contacts ```typescript let page = await contact.list('coll_123', { limit: 50 }) page.items // Contact[] while (page.nextCursor) page = await contact.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**search**({
    collectionId,
    tags,
    tagsAll,
    ...rest
  }: ContactSearchParams) → `Promise<ListResult<ContactResponse>>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**get**(collectionId: string,
    contactId: string,
    params?: { includeDeleted?: boolean }) → `Promise<ContactResponse>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**update**(collectionId: string,
    contactId: string,
    data: ContactUpdateRequest) → `Promise<ContactResponse>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**remove**(collectionId: string, contactId: string) → `Promise<void>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**lookup**(collectionId: string,
    params: { email?: string; phone?: string }) → `Promise<ContactResponse>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**upsert**(collectionId: string,
    data: ContactCreateRequest) → `Promise<ContactResponse>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**publicUpsert**(collectionId: string,
    data: PublicContactUpsertRequest) → `Promise<PublicContactUpsertResponse>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**publicGetMine**(collectionId: string) → `Promise<PublicGetMyContactResponse>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**publicUpdateMine**(collectionId: string,
    data: ContactPatch) → `Promise<PublicUpdateMyContactResponse>`
Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead` for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by when the contact was created with a range: `createdAt: { gte, lte }`. GET /admin/collection/:collectionId/contacts/search ```typescript let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 }) page.items // Contact[] if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor }) // Contacts created in November await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } }) ```

**publicGetSchema**(collectionId: string) → `Promise<ContactSchemaResponse>`
Public: Get the contact schema for a collection. GET /public/collection/:collectionId/contact/schema Returns a ContactSchemaResponse describing all publicly visible contact fields. Core fields and collection-defined custom fields are merged into a single flat schema. Fields not in `publicVisibleFields` are stripped entirely from the response. Fields visible but not in `publicEditableFields` have `ui:disabled: true` in `uiSchema`. Use `fieldOrder` to render fields in the correct sequence, and `evaluateConditions` from the types package to handle conditional field visibility. ```typescript import { contact, evaluateConditions } from '@proveanything/smartlinks' const schema = await contact.publicGetSchema(collectionId) for (const fieldId of schema.fieldOrder) { const property = schema.schema.properties[fieldId] const ui       = schema.uiSchema[fieldId] || {} const visible  = evaluateConditions(property.conditions, property.showWhen, formValues) const disabled = ui['ui:disabled'] === true if (visible) renderField({ fieldId, property, ui, disabled }) } ```

**erase**(collectionId: string, contactId: string, body?: any) → `Promise<ContactResponse>`
Public: Get the contact schema for a collection. GET /public/collection/:collectionId/contact/schema Returns a ContactSchemaResponse describing all publicly visible contact fields. Core fields and collection-defined custom fields are merged into a single flat schema. Fields not in `publicVisibleFields` are stripped entirely from the response. Fields visible but not in `publicEditableFields` have `ui:disabled: true` in `uiSchema`. Use `fieldOrder` to render fields in the correct sequence, and `evaluateConditions` from the types package to handle conditional field visibility. ```typescript import { contact, evaluateConditions } from '@proveanything/smartlinks' const schema = await contact.publicGetSchema(collectionId) for (const fieldId of schema.fieldOrder) { const property = schema.schema.properties[fieldId] const ui       = schema.uiSchema[fieldId] || {} const visible  = evaluateConditions(property.conditions, property.showWhen, formValues) const disabled = ui['ui:disabled'] === true if (visible) renderField({ fieldId, property, ui, disabled }) } ```

**findDuplicates**(collectionId: string,
    params?: ListOptions) → `Promise<ContactDuplicatesResponse>`
Admin: pairs of contacts that look like one person. GET /admin/collection/:collectionId/contacts/duplicates The pattern it finds: someone the collection knew by email first (an import, a list, a form) who later signed in. Their sign-in got a second contact, which could not take the email the first one already held — so one contact has the email and no sign-in, the other the sign-in (and everything they did) and no email. The match is made on the server, on verified addresses only. Checks a window of contacts per call and returns the pairs found in it (`items`); `scanned` is how many contacts it checked. While `nextCursor` is not null, call again with it as `cursor` to check the next window. ```typescript const { items: pairs } = await contact.findDuplicates(collectionId) for (const pair of pairs) { await contact.merge(collectionId, pair.keep.contactId, pair.merge.contactId) } ```

**merge**(collectionId: string,
    keepContactId: string,
    fromContactId: string) → `Promise<ContactMergeResponse>`
Admin: fold contact `fromContactId` INTO contact `keepContactId`. POST /admin/collection/:collectionId/contacts/:keepContactId/merge The kept contact gains the other's sign-in, emails and phones, and anything it had no value for; its own values win. Everything recorded against the other contact moves to the kept one. Consent is never loosened: an opt-out on either contact stays an opt-out. The other contact is soft-deleted and marked with `customFields.mergedInto`. Refused (HTTP 409, `error` = a `ContactMergeErrorCode`) when the two have different sign-ins (`LOGIN_CONFLICT`) or are both members of the same loyalty scheme (`LOYALTY_CONFLICT`).

**linkLogin**(collectionId: string,
    userId: string) → `Promise<ContactLinkLoginResponse>`
Admin: the contact that carries a sign-in, attaching the sign-in first to the contact that already holds its verified email or phone. POST /admin/collection/:collectionId/contacts/link-login For a service about to create a contact for a `userId`: call this first and only create when it throws 404 (`NOTHING_TO_LINK`), so a person the collection already knows by email stays one contact. The address is read from the sign-in itself and must be verified; nothing the caller says about an email is used. Never creates a contact. ```typescript let contactId: string try { contactId = (await contact.linkLogin(collectionId, userId)).contactId } catch (err) { if (err.statusCode !== 404) throw err contactId = (await contact.create(collectionId, { userId, source: 'my-service' })).contactId } ```

**getUser**(collectionId: string,
    userId: string,) → `Promise<UserSearchResponse>`
Admin: the contact that carries a sign-in, attaching the sign-in first to the contact that already holds its verified email or phone. POST /admin/collection/:collectionId/contacts/link-login For a service about to create a contact for a `userId`: call this first and only create when it throws 404 (`NOTHING_TO_LINK`), so a person the collection already knows by email stays one contact. The address is read from the sign-in itself and must be verified; nothing the caller says about an email is used. Never creates a contact. ```typescript let contactId: string try { contactId = (await contact.linkLogin(collectionId, userId)).contactId } catch (err) { if (err.statusCode !== 404) throw err contactId = (await contact.create(collectionId, { userId, source: 'my-service' })).contactId } ```

### containers

**create**(collectionId: string,
    data: CreateContainerInput) → `Promise<Container>`
Create a new container (admin). ```typescript const cask = await containers.create('coll_123', { containerType: 'cask', ref:           'CASK-0042', name:          'Cask 42 — Single Malt', metadata:      { distilleryYear: 2019, capacity: 200 }, }) ```

**list**(collectionId: string,
    params?: ListContainersParams) → `Promise<ListResult<Container>>`
List containers (admin), a page at a time. Supports filtering by type, status, ref, parent, and top-level flag. ```typescript // All active pallets let page = await containers.list('coll_123', { containerType: 'pallet', status:        'active', limit:         50, }) const pallets = page.items while (page.nextCursor) { page = await containers.list('coll_123', { containerType: 'pallet', status: 'active', limit: 50, cursor: page.nextCursor }) pallets.push(...page.items) } // Top-level containers only const { items: roots } = await containers.list('coll_123', { topLevel: true }) ```

**findForItem**(collectionId: string,
    params: FindContainersForItemParams) → `Promise<FindContainersForItemResponse>`
Reverse lookup — find all containers currently holding a specific item (admin). containers, a page at a time. Pass `nextCursor` back as `cursor` for the next page. ```typescript const { containers: holding, nextCursor } = await containers.findForItem('coll_123', { itemType: 'proof', itemId:   'unit-0007', productId: 'drill', limit:    50, }) ```

**get**(collectionId: string,
    containerId: string,
    params?: GetContainerParams) → `Promise<Container>`
Get a single container by ID (admin). Pass `?tree=true` to recursively embed children, and/or `?includeContents=true` to embed the current item list. ```typescript // Flat const cask = await containers.get('coll_123', 'cask-uuid') // Full tree with contents const tree = await containers.get('coll_123', 'warehouse-uuid', { tree:            true, treeDepth:       3, includeContents: true, }) ```

**update**(collectionId: string,
    containerId: string,
    data: UpdateContainerInput) → `Promise<Container>`
Partially update a container (admin). Only fields present in the request body are modified. Pass `parentContainerId: null` to promote a container to top-level. ```typescript const updated = await containers.update('coll_123', 'cask-uuid', { status:   'archived', metadata: { bottledAt: '2025-04-01' }, }) ```

**remove**(collectionId: string,
    containerId: string) → `Promise<`
Soft-delete a container (admin). Sets `deletedAt`; the record and its full item history remain queryable by admins.  Public API responses automatically exclude deleted containers.

**listItems**(collectionId: string,
    containerId: string,
    params?: ListContainerItemsParams) → `Promise<ListResult<ContainerItem>>`
List items currently (or historically) inside a container (admin). Pass `history: true` to include removed items and see the full membership log, a page at a time (`limit`, `cursor`). The current contents come back whole. ```typescript // Current contents const { items } = await containers.listItems('coll_123', 'cask-uuid') // Full history including removed items const { items: history, nextCursor } = await containers.listItems('coll_123', 'cask-uuid', { history: true, limit: 200 }) ```

**addItems**(collectionId: string,
    containerId: string,
    data: AddContainerItemsInput) → `Promise<AddContainerItemsResponse>`
Add one or more items to a container (admin). Each item requires `itemType` and `itemId`.  Pass `productId` / `proofId` for denormalisation convenience. ```typescript const { items } = await containers.addItems('coll_123', 'pallet-uuid', { items: [ { itemType: 'tag',   itemId: 'NFC-00AABBCC' }, { itemType: 'proof', itemId: 'proof-uuid', productId: 'product-id' }, ], }) ```

**removeItems**(collectionId: string,
    containerId: string,
    data: RemoveContainerItemsInput) → `Promise<RemoveContainerItemsResponse>`
Soft-remove items from a container (admin). Sets `removedAt` on the specified `ContainerItem` records.  The records are retained in the history log and can be queried with `history: true`. ```typescript const result = await containers.removeItems('coll_123', 'pallet-uuid', { ids: ['container-item-uuid-1', 'container-item-uuid-2'], }) console.log(`Removed ${result.removedCount} items`) ```

**publicList**(collectionId: string,
    params?: PublicListContainersParams) → `Promise<ListResult<Container>>`
List containers (public), a page at a time. Only active containers are listed; soft-deleted containers and containers with `metadata.publicListing === false` are excluded from results. ```typescript const { items, nextCursor } = await containers.publicList('coll_123', { containerType: 'cask', limit: 50 }) ```

**publicGet**(collectionId: string,
    containerId: string,
    params?: GetContainerParams) → `Promise<Container>`
Get a single container (public). Soft-deleted containers return a 404.  Same `?tree` and `?includeContents` options as the admin version.

**publicListItems**(collectionId: string,
    containerId: string,
    options: ListOptions = {}) → `Promise<ListResult<ContainerItem>>`
List current contents of a container (public), a page at a time. Returns only items where `removedAt` is null.  No `?history` option on the public side. ```typescript let page = await containers.publicListItems('coll_123', 'cask-uuid', { limit: 50 }) while (page.nextCursor) { page = await containers.publicListItems('coll_123', 'cask-uuid', { limit: 50, cursor: page.nextCursor }) } ```

### content

**provide**(handler: ContentHandler) → `() => void`
An app says what its screen shows, in words (an exhibit's text, a recipe, a form's purpose). Called whenever an assistant needs it. Works in an iframe (the host asks by message) and in the same page (a direct component). Returns a function that stops providing.

**request**(options: { frame?: Window | null; reason?: string; timeoutMs?: number } = {}) → `Promise<ScreenContent | null>`
A host asks what the app on screen shows: an app in an iframe (pass its window as `frame`), or apps in this page that called `provide`. Resolves null if nothing answers within the time.

### crate

**list**(collectionId: string,
    params?: ListCratesRequest) → `Promise<ListResult<Crate>>`
List crates for a collection, a page at a time. Soft-deleted crates are left out unless `includeDeleted` is set. ```typescript // Get first page const page1 = await crate.list('coll_123', { limit: 100 }) console.log(`Found ${page1.items.length} crates`) // Get next page if (page1.nextCursor) { const page2 = await crate.list('coll_123', { limit: 100, cursor: page1.nextCursor }) } // Include soft-deleted crates const withDeleted = await crate.list('coll_123', { includeDeleted: true }) ```

**get**(collectionId: string,
    crateId: string) → `Promise<GetCrateResponse>`
Get a single crate by ID for a collection (admin only). ```typescript const crate = await crate.get('coll_123', 'crate_abc123') console.log(`Crate has ${crate.items?.length ?? 0} items`) ```

**create**(collectionId: string,
    data: CreateCrateRequest) → `Promise<CreateCrateResponse>`
Create a new crate for a collection (admin only). ```typescript const newCrate = await crate.create('coll_123', { items: [ { id: 'tag_001', codeId: 'ABC123', productId: 'prod_1', productName: 'Product Name' } ] }) console.log(`Created crate ${newCrate.id}`) ```

**update**(collectionId: string,
    crateId: string,
    data: UpdateCrateRequest) → `Promise<UpdateCrateResponse>`
Update a crate for a collection (admin only). ```typescript const updated = await crate.update('coll_123', 'crate_abc123', { items: [ { id: 'tag_002', codeId: 'XYZ789', productId: 'prod_2' } ] }) ```

**remove**(collectionId: string,
    crateId: string) → `Promise<DeleteCrateResponse>`
Delete a crate for a collection (admin only). This performs a soft delete. ```typescript await crate.remove('coll_123', 'crate_abc123') ```

### dpp

**groups**(collectionId: string) → `Promise<ListResult<DppGroup>>`
What passports can be made: product groups, their kinds, and each view's fields and required fields. A fixed set: always all of them in one answer (`nextCursor` is always null), so it takes no `limit` or `cursor`. GET /dpp/groups ```typescript const { items } = await dpp.groups(collectionId) items.map(g => g.productGroup) // ["BATTERIES", …] ```

**read**(collectionId: string, passportId: string, opts: { version?: number } = {}) → `Promise<DppDocument>`
Read a passport as the public sees it, at its address (the EU JSON document), or an earlier version of it. No sign-in needed. GET /public/dpp/:collectionId/:passportId

**register**(collectionId: string, env: DppEnvironment, passportIds: string[], opts: { wait?: boolean } = {}) → `Promise<DppRegisterResult>`
Send passports to the EU registry. They're grouped by product group and sent up to 100 at a time; the registry reads each one at its address. Passports still missing required fields, withdrawn or already registered come back in `skipped`. With `wait: true` the call waits (up to ~45 s) and returns each passport's outcome; otherwise follow up with `dpp.tasks.refresh`. POST /dpp/registry/:env/register

### dpp.passports

**list**(collectionId: string, q: DppPassportListQuery = {}) → `Promise<ListResult<DppPassport>>`
The collection's passports, a page at a time: all of them, or those of one product, batch or item, or with one status. GET /dpp/passports ```typescript let page = await dpp.passports.list(collectionId, { productId, status: 'active', limit: 100 }) page.items // DppPassport[] while (page.nextCursor) { page = await dpp.passports.list(collectionId, { productId, status: 'active', limit: 100, cursor: page.nextCursor }) } ```

**get**(collectionId: string, passportId: string) → `Promise<DppPassport>`
One passport, with `check` (what it's still missing) and its `url`. GET /dpp/passports/:id

**create**(collectionId: string, input: DppPassportInput & { productGroup: string }) → `Promise<DppPassport>`
Make a passport. POST /dpp/passports

**update**(collectionId: string, passportId: string, input: DppPassportInput, opts: { replace?: boolean } = {}) → `Promise<DppPassportSaveResult>`
Change a passport. `public` / `restricted` are merged into what's there unless `replace` is true. A change to what it says makes a new version. PUT /dpp/passports/:id

**upsert**(collectionId: string, input: DppPassportUpsertInput, opts: { merge?: boolean } = {}) → `Promise<DppPassportUpsertResult>`
Publish the passport for a product, batch or item (`productId` / `batchId` / `proofId`) at a granularity: updates the one already there or makes it. The fields replace what's there (pass `merge: true` to merge). Saving the same content again changes nothing. PUT /dpp/passports/by-anchor ```typescript const { passport } = await dpp.passports.upsert(collectionId, { productId, productGroup: 'BATTERIES', productSubGroup: 'EV', granularity: 'model', public: { batteryChemistry: [...], manufacturerIdentification: {...} }, restricted: { dismantlingInformation: [...] }, }) if (!passport.check.ready) console.log('Still missing', passport.check.missing) ```

**upsertMany**(collectionId: string, items: DppPassportUpsertInput[], opts: { merge?: boolean } = {}) → `Promise<DppPassportBulkResult>`
`upsert` for up to 500 passports at once (e.g. one per battery); each answers on its own. POST /dpp/passports/bulk

**versions**(collectionId: string, passportId: string, options: ListOptions = {}) → `Promise<ListResult<DppPassportVersion>>`
Its versions, newest first, a page at a time (`limit` and `cursor`; 50 unless you say otherwise). Read one with `dpp.read(collectionId, id, { version })`. GET /dpp/passports/:id/versions ```typescript let page = await dpp.passports.versions(collectionId, passportId, { limit: 20 }) const latest = page.items[0].version while (page.nextCursor) { page = await dpp.passports.versions(collectionId, passportId, { limit: 20, cursor: page.nextCursor }) } ```

**withdraw**(collectionId: string, passportId: string) → `Promise<DppPassport>`
No longer valid: stays at its address, marked invalid (the registry keeps its record). POST /dpp/passports/:id/withdraw

**restore**(collectionId: string, passportId: string) → `Promise<DppPassport>`
Valid again. POST /dpp/passports/:id/restore

### dpp.registry

**list**(collectionId: string) → `Promise<ListResult<DppRegistry>>`
Both environments, each with `nextStep` (what's left to connect). A fixed set: always all of them in one answer (`nextCursor` is always null), so it takes no `limit` or `cursor`. GET /dpp/registry ```typescript const { items } = await dpp.registry.list(collectionId) const acc = items.find(r => r.environment === 'acc') ```

**get**(collectionId: string, env: DppEnvironment) → `Promise<DppRegistry>`
One environment. GET /dpp/registry/:env

**makeKey**(collectionId: string, env: DppEnvironment, opts: { alg?: "ES256" | "ES384" | "ES512" } = {}) → `Promise<DppRegistry>`
Make (or replace) the key the brand's Service Account trusts. The private key stays on SmartLinks' servers; show `publicPem` (or `publicJwk`) for the brand to add to its Service Account in the registry. Replacing the key clears `kid` — the registry gives the new key its own. POST /dpp/registry/:env/key

**set**(collectionId: string, env: DppEnvironment, input: SetDppRegistryInput) → `Promise<DppRegistry>`
Save the Service Account's Client ID and key ID, and the brand's Organisation ID, from the registry. PUT /dpp/registry/:env

**enrolPractice**(collectionId: string) → `Promise<DppRegistryCheckResult>`
Connect the brand to the SmartLinks PRACTICE registry in one step — key, enrolment, Service Account and check — to try publishing and registering before the brand is verified with the EU. Never the EU: label it as practice wherever it's shown. POST /dpp/registry/practice/enrol

**check**(collectionId: string, env: DppEnvironment) → `Promise<DppRegistryCheckResult>`
Sign in to the registry and read its product groups — proves the connection works. POST /dpp/registry/:env/check

### dpp.tasks

**list**(collectionId: string, env: DppEnvironment, options: ListOptions = {}) → `Promise<ListResult<DppTask>>`
Requests sent to one environment, newest first, a page at a time (`limit` and `cursor`; 50 unless you say otherwise). GET /dpp/registry/:env/tasks ```typescript let page = await dpp.tasks.list(collectionId, 'acc', { limit: 20 }) while (page.nextCursor) { page = await dpp.tasks.list(collectionId, 'acc', { limit: 20, cursor: page.nextCursor }) } ```

**refresh**(collectionId: string, env: DppEnvironment, taskId: string) → `Promise<DppTaskRefreshResult>`
Ask the registry how a request went and record it on its passports. POST /dpp/registry/:env/tasks/:taskId/refresh

### errors

**report**(event: ClientErrorReport) → `Promise<`

### facets

**list**(collectionId: string,
    params?: FacetListParams) → `Promise<FacetListResponse>`
The collection's facets (admin). A small fixed set: all of them come back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. ```typescript const { items } = await facets.list('coll_123', { kind: 'custom' }) items.map(f => f.key) // ["brand", "material", …] ```

**create**(collectionId: string,
    data: FacetDefinitionWriteInput) → `Promise<FacetDefinition>`
The collection's facets (admin). A small fixed set: all of them come back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. ```typescript const { items } = await facets.list('coll_123', { kind: 'custom' }) items.map(f => f.key) // ["brand", "material", …] ```

**get**(collectionId: string,
    facetKey: string,
    params?: FacetGetParams) → `Promise<FacetDefinition>`
The collection's facets (admin). A small fixed set: all of them come back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. ```typescript const { items } = await facets.list('coll_123', { kind: 'custom' }) items.map(f => f.key) // ["brand", "material", …] ```

**update**(collectionId: string,
    facetKey: string,
    data: FacetDefinitionWriteInput) → `Promise<FacetDefinition>`
The collection's facets (admin). A small fixed set: all of them come back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. ```typescript const { items } = await facets.list('coll_123', { kind: 'custom' }) items.map(f => f.key) // ["brand", "material", …] ```

**remove**(collectionId: string,
    facetKey: string) → `Promise<void>`
The collection's facets (admin). A small fixed set: all of them come back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. ```typescript const { items } = await facets.list('coll_123', { kind: 'custom' }) items.map(f => f.key) // ["brand", "material", …] ```

**listValues**(collectionId: string,
    facetKey: string,
    params?: FacetValueListParams) → `Promise<FacetValueListResponse>`
One facet and its values (admin), a page at a time. The values are in `items`; pass `nextCursor` back as `cursor` for the next page (null means that was the last one). ```typescript let page = await facets.listValues('coll_123', 'brand', { limit: 50 }) const names = page.items.map(v => v.name) while (page.nextCursor) { page = await facets.listValues('coll_123', 'brand', { limit: 50, cursor: page.nextCursor }) names.push(...page.items.map(v => v.name)) } ```

**createValue**(collectionId: string,
    facetKey: string,
    data: FacetValueWriteInput) → `Promise<FacetValueResponse>`
One facet and its values (admin), a page at a time. The values are in `items`; pass `nextCursor` back as `cursor` for the next page (null means that was the last one). ```typescript let page = await facets.listValues('coll_123', 'brand', { limit: 50 }) const names = page.items.map(v => v.name) while (page.nextCursor) { page = await facets.listValues('coll_123', 'brand', { limit: 50, cursor: page.nextCursor }) names.push(...page.items.map(v => v.name)) } ```

**getValue**(collectionId: string,
    facetKey: string,
    valueKey: string,
    params?: FacetValueGetParams) → `Promise<FacetValueResponse>`
One facet and its values (admin), a page at a time. The values are in `items`; pass `nextCursor` back as `cursor` for the next page (null means that was the last one). ```typescript let page = await facets.listValues('coll_123', 'brand', { limit: 50 }) const names = page.items.map(v => v.name) while (page.nextCursor) { page = await facets.listValues('coll_123', 'brand', { limit: 50, cursor: page.nextCursor }) names.push(...page.items.map(v => v.name)) } ```

**updateValue**(collectionId: string,
    facetKey: string,
    valueKey: string,
    data: FacetValueWriteInput) → `Promise<FacetValueResponse>`
One facet and its values (admin), a page at a time. The values are in `items`; pass `nextCursor` back as `cursor` for the next page (null means that was the last one). ```typescript let page = await facets.listValues('coll_123', 'brand', { limit: 50 }) const names = page.items.map(v => v.name) while (page.nextCursor) { page = await facets.listValues('coll_123', 'brand', { limit: 50, cursor: page.nextCursor }) names.push(...page.items.map(v => v.name)) } ```

**removeValue**(collectionId: string,
    facetKey: string,
    valueKey: string) → `Promise<void>`
One facet and its values (admin), a page at a time. The values are in `items`; pass `nextCursor` back as `cursor` for the next page (null means that was the last one). ```typescript let page = await facets.listValues('coll_123', 'brand', { limit: 50 }) const names = page.items.map(v => v.name) while (page.nextCursor) { page = await facets.listValues('coll_123', 'brand', { limit: 50, cursor: page.nextCursor }) names.push(...page.items.map(v => v.name)) } ```

**query**(collectionId: string,
    body: FacetQueryRequest) → `Promise<FacetQueryResponse>`
Facet counts for a set of products (admin): each facet with its values in `items`, and the count for each value in `buckets`. Everything comes back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. Which products are counted: `q` (search text), `createdAt` / `updatedAt` (date ranges) and the filters in `query`, the same as `products.query`. ```typescript const { items, buckets, meta } = await facets.query('coll_123', { facetKeys: ['brand', 'material'], q: 'oak', createdAt: { gte: '2026-11-01T00:00:00Z' }, query: { facetEquals: { brand: 'acme' } }, }) ```

**namespaces**(collectionId: string) → `Promise<FacetNamespaceListResponse>`
The facet namespaces in use (admin). A small fixed set: all the names are in `items`, there is no `limit` or `cursor`, and `nextCursor` is always null. ```typescript const { items } = await facets.namespaces('coll_123') // items: string[] ```

**publicList**(collectionId: string,
    params?: PublicFacetListParams) → `Promise<FacetListResponse>`
The collection's facets (public). A small fixed set: all of them come back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. ```typescript const { items } = await facets.publicList('coll_123', { namespace: 'catalog' }) ```

**publicGet**(collectionId: string,
    facetKey: string,
    params?: PublicFacetListParams) → `Promise<FacetDefinition>`
The collection's facets (public). A small fixed set: all of them come back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. ```typescript const { items } = await facets.publicList('coll_123', { namespace: 'catalog' }) ```

**publicListValues**(collectionId: string,
    facetKey: string,
    options: ListOptions = {}) → `Promise<FacetValueListResponse>`
One facet and its values (public), a page at a time. The values are in `items`; pass `nextCursor` back as `cursor` for the next page (null means that was the last one). ```typescript const { facet, items, nextCursor } = await facets.publicListValues('coll_123', 'brand', { limit: 50 }) ```

**publicGetValue**(collectionId: string,
    facetKey: string,
    valueKey: string) → `Promise<FacetValueResponse>`
One facet and its values (public), a page at a time. The values are in `items`; pass `nextCursor` back as `cursor` for the next page (null means that was the last one). ```typescript const { facet, items, nextCursor } = await facets.publicListValues('coll_123', 'brand', { limit: 50 }) ```

**publicQuery**(collectionId: string,
    body: FacetQueryRequest) → `Promise<FacetQueryResponse>`
Facet counts for a set of products (public): each facet with its values in `items`, and the count for each value in `buckets`. Everything comes back in one answer, so there is no `limit` or `cursor` and `nextCursor` is always null. Which products are counted: `q` (search text), `createdAt` / `updatedAt` (date ranges) and the filters in `query`, the same as `products.query`. ```typescript const { items, buckets } = await facets.publicQuery('coll_123', { facetKeys: ['brand'], q: 'oak' }) ```

**publicNamespaces**(collectionId: string) → `Promise<FacetNamespaceListResponse>`
The facet namespaces in use (public). A small fixed set: all the names are in `items`, there is no `limit` or `cursor`, and `nextCursor` is always null. ```typescript const { items } = await facets.publicNamespaces('coll_123') // items: string[] ```

### files

**list**(collectionId: string, query: ListFilesQuery = {}) → `Promise<ListResult<FileRecord>>`
Files on this site that aren't ordinary uploads: temporary, fetched, derived or generated (admin). A page at a time: `limit` says how many, `cursor` is the previous page's `nextCursor`. ```typescript let page = await files.list('coll_123', { appId: 'my-app', origin: 'fetched', limit: 50 }) while (page.nextCursor) { page = await files.list('coll_123', { appId: 'my-app', origin: 'fetched', limit: 50, cursor: page.nextCursor }) } ```

**put**(collectionId: string, body: PutFileRequest) → `Promise<`
A new file from text, base64 or JSON. Temporary (default 1 day) and private.

**fetch**(collectionId: string, body: FetchFileRequest) → `Promise<`
A web address's contents as a file, cached by address.

**get**(collectionId: string, fileId: string) → `Promise<`
One file. @throws `NOT_FOUND`, `EXPIRED`

**read**(collectionId: string, fileId: string, as: "text" | "base64" = "text") → `Promise<ReadFileResponse>`
A file's contents, as text (default) or base64 (up to 25 MB).

**link**(collectionId: string, fileId: string, minutes?: number) → `Promise<FileLinkResponse>`
A signed link to a private file (default 15 minutes), or a kept file's permanent address.

**extract**(collectionId: string, fileId: string, body: ExtractFileRequest) → `Promise<ExtractFileResponse>`
What's in a file: `text`, `markdown`, `ocr` (images) or `json` (typed fields: give a `schema` and/or a `prompt`). Each file is read each way once; asking again returns the same result (`cached: true`).

**keep**(collectionId: string, fileId: string) → `Promise<`
Keep a file: permanent and public, with an `assetUrl`. It then shows in asset lists like any upload.

**remove**(collectionId: string, fileId: string) → `Promise<`
Remove a file (a kept file is deleted like any asset, and can be restored).

### form

**get**(collectionId: string, formId: string, admin?: boolean) → `Promise<any>`
Get a single form by ID for a collection.

**list**(collectionId: string, admin?: boolean, options: ListOptions = {}) → `Promise<ListResult<any>>`
List the forms for a collection, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await form.list(collectionId, true, { limit: 100 }) while (page.nextCursor) page = await form.list(collectionId, true, { limit: 100, cursor: page.nextCursor }) ```

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new form for a collection (admin only).

**update**(collectionId: string, formId: string, data: any) → `Promise<any>`
Update a form for a collection (admin only).

**remove**(collectionId: string, formId: string) → `Promise<void>`
Delete a form for a collection (admin only).

### functions

**resolveFunctionChannel**(opts: FunctionCallOptions = {}, appId?: string) → `string | undefined`
The release channel a call targets, or undefined for "the collection's installed release". A host context `appChannel` can be scoped to ONE app with `appChannelApp` — needed where several apps share a page (Forge's portal preview of a dev component), so only the app under development calls its dev build.

**functionPath**(surface: 'public' | 'admin', collectionId: string, name: string, opts: FunctionCallOptions = {}) → `string`
The API path a function call goes to (exported for hosts/tests that need the exact URL).

**siteUrl**(collection: { siteHost?: string | null } | string,
    name: string,
    opts: FunctionSiteUrlOptions & { appId?: string } = {}) → `string`
The PUBLIC address of an app function on the collection's own site — what you give a third party as a webhook URL, or call from the collection's public pages: `https://<siteHost>/_fn/<appId>[/<channel>]/<name>[/<path>]`. Every HTTP method the function declares works there, with the raw body for signature checks. Pass the collection (or its siteHost). This address is for public/integration calls; signed-in calls from your app keep using {@link call} / {@link callAdmin}, so the user's SmartLinks session never goes to a tenant hostname. const col = await SL.collection.get(collectionId) const hookUrl = SL.functions.siteUrl(col, 'stripeWebhook', { appId: 'my-shop' }) // → https://acme.smartlinks.host/_fn/my-shop/stripeWebhook

**call**(collectionId: string,
    name: string,
    body: Record<string, any> = {},
    opts: FunctionCallOptions = {}) → `Promise<T>`
Call a PUBLIC app server function inline (surface `'public'`). App-scoped: `POST /fn/public/collection/:c/app/:appId/functions/:name`. // App calling its own function (appId from initializeApi({ appId })): const { value } = await SL.functions.call<{ value: number }>(collectionId, 'pressCounter') // Or address another app explicitly: await SL.functions.call(collectionId, 'pressCounter', {}, { appId: 'my-counter-app' })

**callAdmin**(collectionId: string,
    name: string,
    body: Record<string, any> = {},
    opts: FunctionCallOptions = {}) → `Promise<T>`
Call an ADMIN app server function (surface `'admin'`; requires an admin session). App-scoped: `POST /fn/admin/collection/:c/app/:appId/functions/:name`.

**list**(collectionId: string, opts: FunctionCallOptions = {}) → `Promise<FunctionListResponse>`
List the public functions available for a collection (discovery). Scoped to one app when an appId is given (or set as the SDK app context): `GET /public/collection/:c[/app/:appId]/functions`.

### guide

**get**(collectionId: string, surface?: GuideSurface) → `Promise<GuideInfo>`
Is the guide on for this surface, and how does it present itself?

**start**(collectionId: string, options: GuideStartOptions) → `Promise<LiveHandle>`
Start a live conversation with the guide. Resolves once connected; the handle pauses, stops, sends text.

### http

**get**(path: string) → `Promise<T>`
Perform a GET request to any API endpoint. const fields = await http.get<FieldDefinition[]>('/public/config/fields')

**post**(path: string, body: any) → `Promise<T>`
Perform a POST request to any API endpoint. const result = await http.post('/public/app/eticket/uploadTickets', { collectionId, productId, appId, data, })

**put**(path: string, body: any) → `Promise<T>`
Perform a PUT request to any API endpoint.

**patch**(path: string, body: any) → `Promise<T>`
Perform a PATCH request to any API endpoint.

**del**(path: string) → `Promise<T>`
Perform a DELETE request to any API endpoint.

### integrations

**listFlows**(collectionId: string, query: ListFlowsQuery = {}) → `Promise<ListResult<IntegrationFlow>>`
List flows in a collection, a page at a time (`limit` and `cursor`; 50 unless you say otherwise). GET /integrations/flows ```typescript let page = await integrations.listFlows('coll_123', { direction: 'outbound', status: 'active' }) while (page.nextCursor) { page = await integrations.listFlows('coll_123', { direction: 'outbound', status: 'active', cursor: page.nextCursor }) } ```

**listRecordTypes**(collectionId: string) → `Promise<ListResult<RecordTypeInfo>>`
Discover the app-record types present in a collection + which app owns each (introspected), for picking a sub-record source/trigger. A fixed set: always all of them in one answer, so it takes no `limit` or `cursor`. GET /integrations/record-types ```typescript const { items } = await integrations.listRecordTypes('coll_123') // items: [{ appId: 'warranty', recordType: 'claim', count: 42 }, …] ```

**createFlow**(collectionId: string, input: CreateFlowInput) → `Promise<IntegrationFlow>`
Create a flow. POST /integrations/flows

**getFlow**(collectionId: string, id: string) → `Promise<IntegrationFlow>`
Get one flow. GET /integrations/flows/:id

**updateFlow**(collectionId: string, id: string, input: UpdateFlowInput) → `Promise<IntegrationFlow>`
Update whitelisted fields. PUT /integrations/flows/:id

**deleteFlow**(collectionId: string, id: string) → `Promise<`
Soft-delete a flow. DELETE /integrations/flows/:id

**runFlow**(collectionId: string,
    id: string,
    options: RunFlowInput & { async?: boolean } = {}) → `Promise<RunFlowResult>`
Run a flow now. POST /integrations/flows/:id/run - inline (default): resolves and returns the run summary. - options.async: enqueue on the worker, returns { enqueued: true }. Pass options.entityId to run for a single source entity.

**isRunSummary**(r: RunFlowResult) → `r is RunFlowSummary`
Type guard: the run executed inline and returned a summary.

**isRunEnqueued**(r: RunFlowResult) → `r is RunFlowEnqueued`
Type guard: the run was enqueued (async).

**listRuns**(collectionId: string, flowId: string, query: ListRunsQuery = {}) → `Promise<ListResult<FlowRun>>`
List a flow's runs, newest first. GET /integrations/flows/:id/runs ```typescript let page = await integrations.listRuns('coll_123', flowId, { status: 'failed', limit: 50 }) while (page.nextCursor) { page = await integrations.listRuns('coll_123', flowId, { status: 'failed', limit: 50, cursor: page.nextCursor }) } ```

**getRun**(collectionId: string, flowId: string, runId: string) → `Promise<FlowRun>`
Get one run's summary. GET /integrations/flows/:id/runs/:runId

**listRunItems**(collectionId: string, flowId: string, runId: string, query: ListRunItemsQuery = {}) → `Promise<ListResult<FlowRunItem>>`
List a run's per-record items. GET /integrations/flows/:id/runs/:runId/items `request`/`response` are populated only for items captured while enhanced logging was active (and before the 24h body purge). ```typescript const { items, nextCursor } = await integrations.listRunItems('coll_123', flowId, runId, { status: 'failed', limit: 100 }) ```

**listEntityRuns**(collectionId: string, entityId: string, query: ListOptions = {}) → `Promise<ListResult<FlowRun>>`
Every run touching an entity (e.g. a product), across flows, newest first. A page at a time: `limit` says how many, `cursor` is the previous page's `nextCursor`. GET /integrations/runs/entity/:entityId ```typescript let page = await integrations.listEntityRuns('coll_123', productId, { limit: 20 }) while (page.nextCursor) { page = await integrations.listEntityRuns('coll_123', productId, { limit: 20, cursor: page.nextCursor }) } ```

**getLogging**(collectionId: string, connectionId: string) → `Promise<`
Is enhanced logging active for a connection? GET /integrations/logging/:connectionId

**setLogging**(collectionId: string, connectionId: string, input: SetLoggingInput = {}) → `Promise<`
Enable enhanced logging. POST /integrations/logging/:connectionId (omit ttlMinutes = until cancelled)

**listFailed**(collectionId: string,
    flowId: string,
    query: ListOptions & { status?: 'failed' | 'dead' } = {}) → `Promise<ListResult<FailedRecord> &`
A flow's failed / dead records, a page at a time (`limit` and `cursor`), with the flow's `direction` beside the list. GET /integrations/flows/:id/failed ```typescript let page = await integrations.listFailed('coll_123', flowId, { status: 'dead', limit: 100 }) page.direction // 'inbound' | 'outbound' while (page.nextCursor) { page = await integrations.listFailed('coll_123', flowId, { status: 'dead', limit: 100, cursor: page.nextCursor }) } ```

**retryFailed**(collectionId: string, flowId: string, ids?: string[]) → `Promise<`
Retry failed / dead records now (all of them when `ids` is omitted). POST /integrations/flows/:id/failed/retry

**getHealth**(collectionId: string) → `Promise<IntegrationHealth>`
Every flow at a glance: paused?, running?, last 24h, backlog. GET /integrations/health

**getFlowHealth**(collectionId: string, flowId: string) → `Promise<FlowHealth>`
One flow's health. GET /integrations/flows/:id/health

**getProductLineage**(collectionId: string, productId: string, opts: { payload?: boolean } = {}) → `Promise<ProductLineage>`
Where a product's data came from (the provider record, when it was fetched and imported, by which run, with the current mapping or an older one) and where it went (each outbound flow's last delivery). `payload: true` includes the provider records as received. GET /integrations/lineage/product/:productId

**resumeFlow**(collectionId: string, flowId: string) → `Promise<`
Resume a flow that paused itself (circuit open): held records go out now. POST /integrations/flows/:id/resume

**cancelLogging**(collectionId: string, connectionId: string) → `Promise<`
Cancel enhanced logging now. DELETE /integrations/logging/:connectionId

**listConnectors**(collectionId: string) → `Promise<ListResult<InstalledConnector>>`
The collection's installed connector apps. A fixed set: always all of them in one answer, so it takes no `limit` or `cursor`. GET /integrations/connectors ```typescript const { items } = await integrations.listConnectors('coll_123') ```

**saveConnectorInstallation**(collectionId: string,
    appId: string,
    input: SaveConnectorInstallationInput) → `Promise<`
Save a connector's non-secret Connect-form values and/or settings. PUT /integrations/connectors/:appId/installation

**runConnectorStep**(collectionId: string,
    appId: string,
    step: ConnectorConsoleStep,
    input: Record<string, unknown> & { flowId?: string } = {}) → `Promise<T>`
Run a connector step from the console: `testConnection` → ConnectorTestResult, `describeTarget` → ConnectorTargetSchema, `sample` → ConnectorRecords, and dry runs of `shape` ({ records }) → ConnectorShapeResult and `serialize` ({ documents }) → ConnectorSerializeResult. The server adds the installation; pass `flowId` to layer that flow's settings. POST /integrations/connectors/:appId/steps/:step

**runConnectorAction**(collectionId: string,
    appId: string,
    action: string,
    input: Record<string, unknown> = {}) → `Promise<T>`
Invoke a connector ACTION from the console (any visibility): redeem, enrol, adjust points, issue a coupon… The connector's function runs with its own credentials and is told who asked. POST /integrations/connectors/:appId/actions/:action { input }

**listConnectorActions**(collectionId: string,
    appId: string) → `Promise<ListResult<`
PUBLIC (the Hub, a site): the connector actions the caller may invoke — those declared `public`, plus `member` ones when signed in. A fixed set: always all of them in one answer, so it takes no `limit` or `cursor`. GET /public/collection/:collectionId/connectors/:appId/actions ```typescript const { items } = await integrations.listConnectorActions('coll_123', 'sessionm') const canRedeem = items.some((a) => a.name === 'redeem') ```

**callConnectorAction**(collectionId: string,
    appId: string,
    action: string,
    input: Record<string, unknown> = {}) → `Promise<T>`
PUBLIC (the Hub, a site): invoke a connector action — e.g. redeem a reward for the signed-in member. 401 SIGN_IN_REQUIRED for a `member` action without a session; 403 for an admin-only one; 400 with `missing[]` when a required input is absent. POST /public/collection/:collectionId/connectors/:appId/actions/:action { input }

### interactions

**query**(collectionId: string,
    body: AdminInteractionsQueryRequest) → `Promise<ListResult<InteractionEventRow>>`
POST /admin/collection/:collectionId/interactions/query Flexible query for interaction events, a page at a time (`limit` and `cursor` in the body). The time window is `from` / `to`. Sort with `orderBy: [{ timestamp: 'asc' }]`; bring each event's interaction type along with `expand: ['interaction']`. ```typescript const query = { appId: 'my-app', interactionId: voteTypeId, from: '2026-11-01T00:00:00Z', limit: 500 } let page = await interactions.query('coll_123', { ...query, orderBy: [{ timestamp: 'desc' }], expand: ['interaction'] }) while (page.nextCursor) page = await interactions.query('coll_123', { ...query, cursor: page.nextCursor }) ```

**countsByOutcome**(collectionId: string,
    query: AdminInteractionsCountsByOutcomeRequest = {}) → `Promise<OutcomeCount[]>`
POST /admin/collection/:collectionId/interactions/counts-by-outcome Returns array of { outcome, count }.

**aggregate**(collectionId: string,
    body: AdminInteractionsAggregateRequest) → `Promise<AdminInteractionsAggregateResponse>`
POST /admin/collection/:collectionId/interactions/aggregate Returns grouped numeric aggregates (sum, avg, min, max, count).

**aggregateByOutcome**(collectionId: string,
    body: AdminInteractionsAggregateRequest) → `Promise<AdminInteractionsAggregateResponse>`
Legacy-friendly alias for aggregate().

**appendEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event. `interactionId` must reference an existing interaction type definition. This endpoint does not create interaction definitions.

**updateEvent**(collectionId: string,
    body: UpdateInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event. `interactionId` must reference an existing interaction type definition. This endpoint does not create interaction definitions.

**submitPublicEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<SubmitInteractionResponse | SubmitInteractionError>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. `interactionId` must reference an existing interaction type definition. This endpoint does not create interaction definitions. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**create**(collectionId: string,
    body: CreateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. `interactionId` must reference an existing interaction type definition. This endpoint does not create interaction definitions. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**list**(collectionId: string,
    query: ListInteractionTypesQuery = {}) → `Promise<ListResult<InteractionTypeRecord>>`
List the collection's interaction types (admin), optionally only one app's. GET /admin/collection/:collectionId/interactions ```typescript let page = await interactions.list('coll_123', { appId: 'my-app', limit: 100 }) while (page.nextCursor) page = await interactions.list('coll_123', { appId: 'my-app', limit: 100, cursor: page.nextCursor }) ```

**ensureType**(collectionId: string,
    input: EnsureInteractionTypeInput) → `Promise<InteractionTypeRecord>`
Find this app's interaction type by its readable `key` (data.interactionType), or create it. Returns the type record — its `id` is the server-minted UUID every event must use. ADMIN only (run it in your admin/setup screen), then store the id in your app config so public code can read it: `interactionIds: { vote: type.id }`. Safe to run on every setup. const vote = await SL.interactions.ensureType(collectionId, { appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true, uniquePerUser: true }, display: { title: 'Cast a vote', description: 'Someone voted in the poll' }, }) // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId // Always give display.title: it's the name staff see in the CRM, on activity and when choosing // "everyone who voted" for a segment. (Without one the platform names it from the key.)

**get**(collectionId: string,
    id: string) → `Promise<InteractionTypeRecord>`
Find this app's interaction type by its readable `key` (data.interactionType), or create it. Returns the type record — its `id` is the server-minted UUID every event must use. ADMIN only (run it in your admin/setup screen), then store the id in your app config so public code can read it: `interactionIds: { vote: type.id }`. Safe to run on every setup. const vote = await SL.interactions.ensureType(collectionId, { appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true, uniquePerUser: true }, display: { title: 'Cast a vote', description: 'Someone voted in the poll' }, }) // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId // Always give display.title: it's the name staff see in the CRM, on activity and when choosing // "everyone who voted" for a segment. (Without one the platform names it from the key.)

**update**(collectionId: string,
    id: string,
    patchBody: UpdateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
Find this app's interaction type by its readable `key` (data.interactionType), or create it. Returns the type record — its `id` is the server-minted UUID every event must use. ADMIN only (run it in your admin/setup screen), then store the id in your app config so public code can read it: `interactionIds: { vote: type.id }`. Safe to run on every setup. const vote = await SL.interactions.ensureType(collectionId, { appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true, uniquePerUser: true }, display: { title: 'Cast a vote', description: 'Someone voted in the poll' }, }) // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId // Always give display.title: it's the name staff see in the CRM, on activity and when choosing // "everyone who voted" for a segment. (Without one the platform names it from the key.)

**remove**(collectionId: string,
    id: string) → `Promise<void>`
Find this app's interaction type by its readable `key` (data.interactionType), or create it. Returns the type record — its `id` is the server-minted UUID every event must use. ADMIN only (run it in your admin/setup screen), then store the id in your app config so public code can read it: `interactionIds: { vote: type.id }`. Safe to run on every setup. const vote = await SL.interactions.ensureType(collectionId, { appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true, uniquePerUser: true }, display: { title: 'Cast a vote', description: 'Someone voted in the poll' }, }) // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId // Always give display.title: it's the name staff see in the CRM, on activity and when choosing // "everyone who voted" for a segment. (Without one the platform names it from the key.)

**publicCountsByOutcome**(collectionId: string,
    body: PublicInteractionsCountsByOutcomeRequest,
    authToken?: string) → `Promise<OutcomeCount[]>`
Find this app's interaction type by its readable `key` (data.interactionType), or create it. Returns the type record — its `id` is the server-minted UUID every event must use. ADMIN only (run it in your admin/setup screen), then store the id in your app config so public code can read it: `interactionIds: { vote: type.id }`. Safe to run on every setup. const vote = await SL.interactions.ensureType(collectionId, { appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true, uniquePerUser: true }, display: { title: 'Cast a vote', description: 'Someone voted in the poll' }, }) // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId // Always give display.title: it's the name staff see in the CRM, on activity and when choosing // "everyone who voted" for a segment. (Without one the platform names it from the key.)

**publicMyInteractions**(collectionId: string,
    body: PublicInteractionsByUserRequest,
    authToken?: string) → `Promise<ListResult<InteractionEventRow>>`
The signed-in person's own interaction events (where the type allows it), a page at a time (`limit` and `cursor` in the body). The time window is `from` / `to`. POST /public/collection/:collectionId/interactions/by-user ```typescript const query = { appId: 'my-app', interactionId: voteTypeId, limit: 50 } let page = await interactions.publicMyInteractions('coll_123', query) while (page.nextCursor) page = await interactions.publicMyInteractions('coll_123', { ...query, cursor: page.nextCursor }) ```

**publicList**(collectionId: string,
    query: ListInteractionTypesQuery = {}) → `Promise<ListResult<InteractionTypeRecord>>`
Public: list the collection's interaction types, optionally only one app's. GET /public/collection/:collectionId/interactions ```typescript const { items, nextCursor } = await interactions.publicList('coll_123', { appId: 'my-app', limit: 50 }) ```

**publicGet**(collectionId: string,
    id: string) → `Promise<InteractionTypeRecord>`
Public: list the collection's interaction types, optionally only one app's. GET /public/collection/:collectionId/interactions ```typescript const { items, nextCursor } = await interactions.publicList('coll_123', { appId: 'my-app', limit: 50 }) ```

### jobs

**list**(collectionId: string,
    query: ListJobsQuery = {}) → `Promise<ListResult<Job>>`
List visible jobs for a collection, newest first. GET /admin/collection/:collectionId/jobs ```typescript let page = await jobs.list('coll_123', { state: 'errored', limit: 50 }) while (page.nextCursor) page = await jobs.list('coll_123', { state: 'errored', limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string,
    jobId: number) → `Promise<Job>`
Get a single job GET /admin/collection/:collectionId/jobs/:jobId

**enqueue**(collectionId: string,
    params: EnqueueAsyncJobRequest) → `Promise<EnqueueAsyncJobResponse>`
Start a background job for a collection. POST /admin/collection/:collectionId/async/jobs (202)

**status**(collectionId: string,
    jobId: number) → `Promise<Job>`
How a job you started is getting on (may answer 404 once it has finished and been cleared away). GET /admin/collection/:collectionId/async/jobs/:jobId

### journeys

**create**(collectionId: string,
    body: CreateJourneyBody) → `Promise<JourneyRecord>`

**list**(collectionId: string,
    query: ListJourneysQuery = {}) → `Promise<ListResult<JourneyRecord>>`
List the collection's journeys (admin). GET /admin/collection/:collectionId/journeys ```typescript let page = await journeys.list('coll_123', { active: true, limit: 50 }) while (page.nextCursor) page = await journeys.list('coll_123', { active: true, limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string,
    id: string) → `Promise<JourneyRecord>`
List the collection's journeys (admin). GET /admin/collection/:collectionId/journeys ```typescript let page = await journeys.list('coll_123', { active: true, limit: 50 }) while (page.nextCursor) page = await journeys.list('coll_123', { active: true, limit: 50, cursor: page.nextCursor }) ```

**update**(collectionId: string,
    id: string,
    body: UpdateJourneyBody) → `Promise<JourneyRecord>`
List the collection's journeys (admin). GET /admin/collection/:collectionId/journeys ```typescript let page = await journeys.list('coll_123', { active: true, limit: 50 }) while (page.nextCursor) page = await journeys.list('coll_123', { active: true, limit: 50, cursor: page.nextCursor }) ```

**remove**(collectionId: string,
    id: string) → `Promise<void>`
List the collection's journeys (admin). GET /admin/collection/:collectionId/journeys ```typescript let page = await journeys.list('coll_123', { active: true, limit: 50 }) while (page.nextCursor) page = await journeys.list('coll_123', { active: true, limit: 50, cursor: page.nextCursor }) ```

### journeysAnalytics

**stats**(collectionId: string,
    journeyId: string,
    body: JourneyStatsRequest = {}) → `Promise<JourneyStatsResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/stats Computes journey stats over a time window; outcome defaults to 'success'. If `finalStepId` is provided, includes `currentlyActive` and `completed` fields.

**recipients**(collectionId: string,
    journeyId: string,
    stepId: string,
    body: JourneyStepRecipientsRequest = {}) → `Promise<ListResult<string>>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/steps/:stepId/recipients Returns recipient IDs for a given journey step, a page at a time (`limit` and `cursor` in the body). The time window is `from` / `to`. For completed/pending, `interactionId` is required; outcome defaults to 'success'. ```typescript const query = { status: 'completed' as const, interactionId, idField: 'contactId' as const, limit: 1000 } let page = await journeysAnalytics.recipients('coll_123', journeyId, stepId, query) page.items // contact ids while (page.nextCursor) { page = await journeysAnalytics.recipients('coll_123', journeyId, stepId, { ...query, cursor: page.nextCursor }) } ```

**funnelReport**(collectionId: string,
    journeyId: string,
    body: JourneyFunnelReportRequest) → `Promise<JourneyFunnelReportResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/funnel-report Computes conversion, counts, and avg time across mapped steps in a period.

### knowledge

**listSets**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<KnowledgeSet>>`
The collection's sets, with their source and passage counts (admin). A page at a time (`limit` and `cursor`; 50 unless you say otherwise). ```typescript let page = await knowledge.listSets('coll_123') while (page.nextCursor) page = await knowledge.listSets('coll_123', { cursor: page.nextCursor }) ```

**saveSet**(collectionId: string, body: SaveKnowledgeSetRequest) → `Promise<KnowledgeSet>`
Create a set, or update the one with this key (admin).

**getSet**(collectionId: string, set: string) → `Promise<KnowledgeSet>`
One set, by id or key (admin).

**updateSet**(collectionId: string, set: string, body: UpdateKnowledgeSetRequest) → `Promise<KnowledgeSet>`
One set, by id or key (admin).

**deleteSet**(collectionId: string, set: string) → `Promise<`
Delete a set with its sources and passages (admin).

**listSources**(collectionId: string, set: string, options: ListOptions = {}) → `Promise<ListResult<KnowledgeSource>>`
A set's sources, with their status (admin). A page at a time (`limit` and `cursor`; 50 unless you say otherwise). ```typescript let page = await knowledge.listSources('coll_123', 'manuals') while (page.nextCursor) page = await knowledge.listSources('coll_123', 'manuals', { cursor: page.nextCursor }) ```

**addSource**(collectionId: string, set: string, body: AddKnowledgeSourceRequest) → `Promise<KnowledgeSource>`
Add a source; feeds and pages are read in the background (admin).

**updateSource**(collectionId: string, sourceId: string, body: UpdateKnowledgeSourceRequest) → `Promise<KnowledgeSource>`
Add a source; feeds and pages are read in the background (admin).

**deleteSource**(collectionId: string, sourceId: string) → `Promise<`
Add a source; feeds and pages are read in the background (admin).

**reindex**(collectionId: string, sourceId: string, opts: { force?: boolean } = {}) → `Promise<`
Read a source again now (`force` re-splits even if it hasn't changed) (admin).

**upsertDocuments**(collectionId: string, sourceId: string, documents: KnowledgeDocument[]) → `Promise<`
Push documents into a `documents` source; the same `ref` replaces its earlier version. Up to 500 at a time (admin).

**removeDocuments**(collectionId: string, sourceId: string, refs: string[]) → `Promise<`
Remove pushed documents by `ref` (admin).

**search**(collectionId: string,
    body: KnowledgeSearchRequest) → `Promise<ListResult<KnowledgeSearchResult> & Pick<KnowledgeSearchResponse, 'query' | 'mode'>>`
Search every set, staff ones included (admin). `q` is what to look for. The matches come back as `items`, best first, with the `query` and the search `mode` beside them. `limit` says how many matches to return (default 8, at most 25); `cursor` is the previous page's `nextCursor`. ```typescript const { items, mode } = await knowledge.search('coll_123', { q: 'how do I descale', limit: 5 }) ```

**publicSearch**(collectionId: string,
    body: KnowledgeSearchRequest) → `Promise<ListResult<KnowledgeSearchResult> & Pick<KnowledgeSearchResponse, 'query' | 'mode'>>`
Search from a website, Portal or Hub: public sets, plus customer sets for a signed-in person. The options and the answer are the same as the admin `search`: `q` is what to look for, and the matches come back as `items`, best first, with the `query` and the search `mode` beside them. `limit` says how many matches to return (default 8, at most 25); `cursor` is the previous page's `nextCursor`. ```typescript const { items } = await knowledge.publicSearch('coll_123', { q: 'how do I descale', limit: 5 }) for (const r of items) console.log(r.title, r.heading, r.url, r.snippet) ```

### location

**createGlobal**(params: LocationPayload) → `Promise<Location>`
Platform: Create a global location (super admin; requires features.adminApps) POST /platform/location

**create**(collectionId: string, params: LocationPayload) → `Promise<Location>`
Admin: Create a collection-scoped location POST /admin/collection/:collectionId/location

**search**(collectionId: string,
    query: LocationSearchQuery = {}) → `Promise<ListResult<Location>>`
Admin: Search locations to pick during setup (combines collection + global). `q` is the search text. `limit` says how many (default 20, at most 100) and `cursor` is the previous page's `nextCursor`. `orderBy` sorts by one field: `name` (the default), `countryCode` or `countryName`. GET /admin/collection/:collectionId/location/search ```typescript const { items, nextCursor } = await location.search('coll_123', { q: 'distillery', countryCode: 'GB', limit: 10, orderBy: [{ countryName: 'asc' }], }) ```

**getPublic**(locationId: string) → `Promise<Location>`
Public: Fetch a global location by ID GET /public/location/:locationId

**getPublicForCollection**(collectionId: string,
    locationId: string) → `Promise<Location>`
Public: Fetch a location for a collection; returns either a collection-owned or global fallback GET /public/collection/:collectionId/location/:locationId

### lots

**create**(collectionId: string, lot: LotCreateInput) → `Promise<Lot>`
Create a lot (resolves its selector into members).

**list**(collectionId: string, params: ListLotsParams = {}) → `Promise<ListResult<Lot>>`
List lots (summary rows; `payload`/`productIds` omitted), a page at a time. Filter by `status`, search text (`q`), or containing `productId`; page with `limit` (default 50) and `cursor`. ```typescript let page = await lots.list('coll_123', { status: 'open', q: 'spring', limit: 50 }) while (page.nextCursor) { page = await lots.list('coll_123', { status: 'open', q: 'spring', limit: 50, cursor: page.nextCursor }) } ```

**get**(collectionId: string, lotId: string, opts: { includeDeleted?: boolean } = {}) → `Promise<Lot>`
Get the full lot record. Pass `{ includeDeleted: true }` to fetch a soft-deleted one.

**getByNumber**(collectionId: string, lotNumber: string, opts: { includeDeleted?: boolean } = {}) → `Promise<Lot>`
Look up a lot by its number (case-insensitive) — used by scan/resolver flows.

**update**(collectionId: string, lotId: string, lot: LotUpdateInput) → `Promise<Lot>`
Update a lot. Re-resolves members if the selector changed (response then carries `diff`).

**remove**(collectionId: string, lotId: string) → `Promise<`
Soft-delete a lot — recoverable, and frees its `lotNumber` for reuse. Distinct from {@link archive}. Hidden from reads unless `{ includeDeleted: true }`; undo with {@link restore}.

**archive**(collectionId: string, lotId: string) → `Promise<`
Archive a lot — a live lifecycle state (stays visible, keeps its number). Not a delete.

**restore**(collectionId: string, lotId: string) → `Promise<Lot>`
Restore a soft-deleted lot. Rejects (409) if a live lot now uses the same number.

**resolve**(collectionId: string, lotId: string) → `Promise<ResolveLotResponse>`
Re-resolve members from the current selector; returns the lot + a member diff.

**listProducts**(collectionId: string, lotId: string, opts: ListOptions = {}) → `Promise<ListResult<LotProductSummary>>`
A lot's member products (summaries), a page at a time. `count` is how many members there are in all. ```typescript let page = await lots.listProducts('coll_123', lotId, { limit: 50 }) while (page.nextCursor) page = await lots.listProducts('coll_123', lotId, { limit: 50, cursor: page.nextCursor }) ```

**publicList**(collectionId: string, params: Omit<ListLotsParams, 'includeDeleted'> = {}) → `Promise<ListResult<Lot>>`
List lots from a public context (summary rows), a page at a time. Filter by `status`, search text (`q`), or containing `productId`; page with `limit` (default 50) and `cursor`. ```typescript const { items, nextCursor } = await lots.publicList('coll_123', { productId: 'prod_789', limit: 50 }) ```

**publicGet**(collectionId: string, lotId: string) → `Promise<Lot>`
List lots from a public context (summary rows), a page at a time. Filter by `status`, search text (`q`), or containing `productId`; page with `limit` (default 50) and `cursor`. ```typescript const { items, nextCursor } = await lots.publicList('coll_123', { productId: 'prod_789', limit: 50 }) ```

**publicGetByNumber**(collectionId: string, lotNumber: string) → `Promise<Lot>`
List lots from a public context (summary rows), a page at a time. Filter by `status`, search text (`q`), or containing `productId`; page with `limit` (default 50) and `cursor`. ```typescript const { items, nextCursor } = await lots.publicList('coll_123', { productId: 'prod_789', limit: 50 }) ```

**publicListProducts**(collectionId: string, lotId: string, opts: ListOptions = {}) → `Promise<ListResult<LotProductSummary>>`
A lot's member products (summaries) from a public context, a page at a time. ```typescript const { items, nextCursor, count } = await lots.publicListProducts('coll_123', lotId, { limit: 50 }) ```

### loyalty

Loyalty programmes built on top of collections. Configure schemes and earning rules; contacts earn points automatically via interaction events. See the [Loyalty guide](loyalty.md) for the full walkthrough.

**list**(collectionId: string,
    params: ListOptions & { includeDeleted?: boolean } = {}) → `Promise<ListResult<LoyaltyScheme>>`
The collection's loyalty schemes (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. Pass `includeDeleted: true` to include deleted schemes. ```typescript let page = await loyalty.list('coll_123', { limit: 50 }) while (page.nextCursor) page = await loyalty.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyScheme>`
The collection's loyalty schemes (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. Pass `includeDeleted: true` to include deleted schemes. ```typescript let page = await loyalty.list('coll_123', { limit: 50 }) while (page.nextCursor) page = await loyalty.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**create**(collectionId: string,
    body: CreateLoyaltySchemeBody) → `Promise<LoyaltyScheme>`
The collection's loyalty schemes (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. Pass `includeDeleted: true` to include deleted schemes. ```typescript let page = await loyalty.list('coll_123', { limit: 50 }) while (page.nextCursor) page = await loyalty.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**update**(collectionId: string,
    schemeId: string,
    body: UpdateLoyaltySchemeBody) → `Promise<LoyaltyScheme>`
The collection's loyalty schemes (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. Pass `includeDeleted: true` to include deleted schemes. ```typescript let page = await loyalty.list('coll_123', { limit: 50 }) while (page.nextCursor) page = await loyalty.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**remove**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyScheme>`
The collection's loyalty schemes (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. Pass `includeDeleted: true` to include deleted schemes. ```typescript let page = await loyalty.list('coll_123', { limit: 50 }) while (page.nextCursor) page = await loyalty.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**listEarningRules**(collectionId: string,
    schemeId: string,
    options: ListOptions = {}) → `Promise<ListResult<LoyaltyEarningRule>>`
A scheme's earning rules (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50 }) while (page.nextCursor) page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor }) ```

**getEarningRule**(collectionId: string,
    schemeId: string,
    ruleId: string) → `Promise<LoyaltyEarningRule>`
A scheme's earning rules (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50 }) while (page.nextCursor) page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor }) ```

**createEarningRule**(collectionId: string,
    schemeId: string,
    body: CreateLoyaltyEarningRuleBody) → `Promise<LoyaltyEarningRule>`
A scheme's earning rules (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50 }) while (page.nextCursor) page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor }) ```

**updateEarningRule**(collectionId: string,
    schemeId: string,
    ruleId: string,
    body: UpdateLoyaltyEarningRuleBody) → `Promise<LoyaltyEarningRule>`
A scheme's earning rules (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50 }) while (page.nextCursor) page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor }) ```

**removeEarningRule**(collectionId: string,
    schemeId: string,
    ruleId: string) → `Promise<LoyaltyEarningRule>`
A scheme's earning rules (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50 }) while (page.nextCursor) page = await loyalty.listEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor }) ```

**listMembers**(collectionId: string,
    schemeId: string,
    params: ListOptions = {}) → `Promise<ListResult<LoyaltyMember>>`
A scheme's members (admin), a page at a time (default 50, at most 200). ```typescript let page = await loyalty.listMembers('coll_123', schemeId, { limit: 100 }) while (page.nextCursor) page = await loyalty.listMembers('coll_123', schemeId, { limit: 100, cursor: page.nextCursor }) ```

**getMember**(collectionId: string,
    schemeId: string,
    contactId: string) → `Promise<LoyaltyMember>`
A scheme's members (admin), a page at a time (default 50, at most 200). ```typescript let page = await loyalty.listMembers('coll_123', schemeId, { limit: 100 }) while (page.nextCursor) page = await loyalty.listMembers('coll_123', schemeId, { limit: 100, cursor: page.nextCursor }) ```

**recordTransaction**(collectionId: string,
    schemeId: string,
    contactId: string,
    body: RecordLoyaltyTransactionBody) → `Promise<LoyaltyTransactionResult>`
Manually award or deduct points for a contact. - `points` must be a non-zero integer - Positive = award, negative = deduct - Deducting below zero returns HTTP 422 `INSUFFICIENT_BALANCE` - Supply `idempotencyKey` to safely retry without double-crediting Points earned via interaction events are awarded automatically by the server — this endpoint is for manual adjustments and admin overrides.

**getMemberHistory**(collectionId: string,
    schemeId: string,
    contactId: string,
    params: ListOptions = {}) → `Promise<ListResult<LoyaltyTransaction>>`
One member's points transactions (admin), newest first, a page at a time. ```typescript const { items, nextCursor } = await loyalty.getMemberHistory('coll_123', schemeId, contactId, { limit: 50 }) ```

**publicList**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<LoyaltyScheme>>`
List active schemes for a collection, a page at a time. No authentication required. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.publicList('coll_123', { limit: 50 }) while (page.nextCursor) page = await loyalty.publicList('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**publicGet**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyScheme>`
Get a single active scheme. No authentication required.

**publicListEarningRules**(collectionId: string,
    schemeId: string,
    options: ListOptions = {}) → `Promise<ListResult<LoyaltyEarningRule>>`
List active earning rules for a scheme — useful for showing "how to earn" in a loyalty UI. No authentication required. A page at a time: page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.publicListEarningRules('coll_123', schemeId, { limit: 50 }) while (page.nextCursor) page = await loyalty.publicListEarningRules('coll_123', schemeId, { limit: 50, cursor: page.nextCursor }) ```

**publicGetMe**(collectionId: string,
    options: ListOptions = {}) → `Promise<ListResult<LoyaltySchemeWithMembership>>`
Get all active schemes with the caller's membership embedded in each. This is the primary entry point for a loyalty widget — one call gives you everything needed to render a user's loyalty status across all programs in a collection. - Authenticated: `member` is populated with balance + lifetimePoints (or null if not yet enrolled in that scheme) - Unauthenticated: `member` is null on all schemes A page at a time: page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await loyalty.publicGetMe('coll_123') for (const scheme of page.items) console.log(scheme.name, scheme.member?.balance ?? 0) while (page.nextCursor) page = await loyalty.publicGetMe('coll_123', { cursor: page.nextCursor }) ```

**publicGetMine**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyMember>`
Get the authenticated caller's membership (balance + lifetimePoints) on a specific scheme. Requires authentication.

**publicGetMineHistory**(collectionId: string,
    schemeId: string,
    params: ListOptions = {}) → `Promise<ListResult<LoyaltyTransaction>>`
Get the authenticated caller's transaction history on a specific scheme. Ordered newest first, a page at a time. Requires authentication. ```typescript let page = await loyalty.publicGetMineHistory('coll_123', schemeId, { limit: 20 }) while (page.nextCursor) page = await loyalty.publicGetMineHistory('coll_123', schemeId, { limit: 20, cursor: page.nextCursor }) ```

### models

**list**(collectionId: string, params?: AIModelListParams) → `Promise<AIModelListResponse>`
List available AI models

**get**(collectionId: string, modelId: string) → `Promise<AIModel>`
Get specific model information

### navigation

**resolveLink**(link: LinkTarget, ctx: ResolveLinkContext = {}) → `ResolvedLink`
Resolve a stored `LinkTarget` into an executable navigation action. The resolver handles the embedded/standalone distinction automatically: | Kind              | Embedded (container/widget/iframe)                            | Standalone        | |-------------------|---------------------------------------------------------------|-------------------| | `external _blank` | `window.open(url, '_blank', 'noopener,noreferrer')`           | same              | | `external _self`  | `window.location.assign(url)`                                 | same              | | `app` / `deep`    | `postMessage` to parent shell; shell appends context params   | hash-route assign | Context params (`collectionId`, `productId`, `proofId`, etc.) are **not** included in the message payload — the parent SmartLinks shell owns them and appends them before broadcasting the navigation event. const r = SL.navigation.resolveLink(config.ctaLink); r.navigate();                // perform navigation button.ariaLabel = r.describe();  // human-readable label

### nfc

**claimTag**(data: NfcClaimTagRequest) → `Promise<NfcTagInfo>`
Claim an NFC tag (public). POST /public/nfc/claimTag

**validate**(data: NfcValidateRequest) → `Promise<NfcValidateResponse>`
Validate an NFC tag payload (public). POST /public/nfc/validate

**lookupTag**(tagId: string) → `Promise<ListResult<NfcTagInfo>>`
Lookup a tag by its ID (public): every code that tag is known as, a page at a time. GET /public/nfc/findByTag/:tagId ```typescript const { items } = await nfc.lookupTag('04A1B2C3D4E5F6') ```

### operations

**admin**(collectionId: string, opts: { appId?: string } = {}) → `OperationsAdmin`
The operations objects for one collection (admin). but a work order is always created for an app, so `workOrders.create` needs this. ```typescript const ops = operations.admin('coll_123', { appId: 'production' }) const caps = await ops.stock.position({ productId: 'brass-cap', horizonDays: 90 }) caps.onHand.available      // 400 caps.shortfall             // { quantity: 140, firstShortOn: '2026-12-14' } | null await ops.stock.move({ from: binId, to: cageId, productId: 'brass-cap', quantity: 100 }) await ops.workOrders.setStatus('19264', 'on-hold', { reason: 'Waiting for caps' }) ```

**describe**(collectionId: string) → `Promise<`
What the server offers, by group: `{ workOrders: [...], stock: [...], boms: [...], madeFrom: [...] }`.

### order

**create**(collectionId: string,
    data: CreateOrderRequest) → `Promise<CreateOrderResponse>`
Create a new order with items. ```typescript const order = await order.create('coll_123', { orderRef: 'ORD-12345', customerId: 'CUST-789', items: [ { itemType: 'tag', itemId: 'TAG001' }, { itemType: 'tag', itemId: 'TAG002' }, { itemType: 'serial', itemId: 'SN12345' } ], status: 'pending', metadata: { shipmentId: 'SHIP-789', destination: 'Warehouse B' } }) ```

**get**(collectionId: string,
    orderId: string,
    params?: GetOrderParams) → `Promise<GetOrderResponse>`
Get a single order by ID. ```typescript // Get order without items (faster) const order = await order.get('coll_123', 'order_abc123') console.log(`Order has ${order.itemCount} items`) // Get order with items const orderWithItems = await order.get('coll_123', 'order_abc123', { includeItems: true }) console.log(orderWithItems.items) // Items array available ```

**update**(collectionId: string,
    orderId: string,
    data: UpdateOrderRequest) → `Promise<UpdateOrderResponse>`
Update order status or metadata. Items are managed separately via addItems/removeItems. ```typescript const updated = await order.update('coll_123', 'order_abc123', { status: 'shipped', metadata: { trackingNumber: '1Z999AA10123456784', shippedAt: '2026-02-02T14:30:00Z' } }) ```

**remove**(collectionId: string,
    orderId: string) → `Promise<DeleteOrderResponse>`
Delete an order and all its items (cascade delete). ```typescript await order.remove('coll_123', 'order_abc123') ```

**list**(collectionId: string,
    params?: ListOrdersRequest) → `Promise<ListResult<Order>>`
List orders for a collection with optional filters, a page at a time (default 100). Orders are returned in descending order by createdAt (newest first). ```typescript // The first page of orders (without items for better performance) const { items } = await order.list('coll_123') // List with filters, page by page let page = await order.list('coll_123', { status: 'pending', limit: 50 }) while (page.nextCursor) { page = await order.list('coll_123', { status: 'pending', limit: 50, cursor: page.nextCursor }) } // Filter by customer with items const customerOrders = await order.list('coll_123', { customerId: 'CUST-789', expand: ['items'] }) // Purchase orders from one supplier const purchases = await order.list('coll_123', { direction: 'purchase', partyId: supplierId }) ```

**getItems**(collectionId: string,
    orderId: string,
    params?: GetOrderItemsParams) → `Promise<ListResult<OrderItem>>`
Get items from an order with pagination support. Use this for orders with many items instead of `expand: ['items']`. ```typescript // Get first page of items const page1 = await order.getItems('coll_123', 'order_abc123', { limit: 100 }) // Get next page if (page1.nextCursor) { const page2 = await order.getItems('coll_123', 'order_abc123', { limit: 100, cursor: page1.nextCursor }) } ```

**addItems**(collectionId: string,
    orderId: string,
    data: AddItemsRequest) → `Promise<AddItemsResponse>`
Add additional items to an existing order. ```typescript const updated = await order.addItems('coll_123', 'order_abc123', { items: [ { itemType: 'tag', itemId: 'TAG003' }, { itemType: 'proof', itemId: 'proof_xyz' } ] }) console.log(`Order now has ${updated.itemCount} items`) ```

**lineDone**(collectionId: string, orderId: string, itemId: string, by: number) → `Promise<OrderItem>`
Add to (or take from) how much of a line has been shipped or received. Atomic, so two receipts at once both count; it can't go below zero. ```typescript // 20 more caps arrived against a purchase order line await order.lineDone('coll_123', orderId, lineId, 20) ```

**removeItems**(collectionId: string,
    orderId: string,
    data: RemoveItemsRequest) → `Promise<RemoveItemsResponse>`
Add to (or take from) how much of a line has been shipped or received. Atomic, so two receipts at once both count; it can't go below zero. ```typescript // 20 more caps arrived against a purchase order line await order.lineDone('coll_123', orderId, lineId, 20) ```

**query**(collectionId: string,
    data: QueryOrdersRequest) → `Promise<ListResult<Order>>`
Advanced query for orders with order-level and item-level filtering. More powerful than the basic list() function. `expand: ['items']`, and `limit` and `cursor` for paging. These all sit beside `query`, not inside it. ```typescript // Find pending orders created in January 2026, newest first const result = await order.query('coll_123', { query: { status: 'pending' }, createdAt: { gte: '2026-01-01T00:00:00Z', lte: '2026-02-01T00:00:00Z' }, orderBy: [{ createdAt: 'desc' }], limit: 50 }) console.log(result.items.length) // The next page: the same query with the cursor if (result.nextCursor) { const next = await order.query('coll_123', { query: { status: 'pending' }, createdAt: { gte: '2026-01-01T00:00:00Z', lte: '2026-02-01T00:00:00Z' }, orderBy: [{ createdAt: 'desc' }], limit: 50, cursor: result.nextCursor }) } // Find orders with specific metadata and item count, with their items const highPriority = await order.query('coll_123', { query: { metadata: { priority: 'high' }, minItemCount: 10, maxItemCount: 100 }, expand: ['items'] }) // Find orders containing a specific product batch const batchOrders = await order.query('coll_123', { query: { productId: 'prod_789', batchId: 'BATCH-2024-001' }, expand: ['items'] }) // Find an order containing one of several specific items const matched = await order.query('coll_123', { query: { items: [ { itemType: 'tag', itemId: 'TAG001' }, { itemType: 'serial', itemId: 'SN12345' } ] }, expand: ['items'] }) ```

**reports**(collectionId: string,
    params?: ReportsParams) → `Promise<ReportsResponse>`
Get reports and aggregations for orders. Provides analytics grouped by status, customer, product, date, etc. ```typescript // Get order counts by status const statusReport = await order.reports('coll_123', { groupByStatus: true }) console.log(statusReport.ordersByStatus) // { pending: 45, shipped: 123, completed: 789 } // Get comprehensive analytics const fullReport = await order.reports('coll_123', { groupByStatus: true, groupByProduct: true, includeItemStats: true, createdAfter: '2026-01-01T00:00:00Z' }) console.log(fullReport.itemStats?.avgItemsPerOrder) // Get top 10 customers by order count const topCustomers = await order.reports('coll_123', { groupByCustomer: true, topN: 10 }) ```

**getAnalytics**(collectionId: string,
    orderId: string) → `Promise<OrderAnalyticsResponse>`
Get comprehensive scan analytics for all tags in an order. Returns scan counts, timestamps, locations, devices, and per-tag summaries. ```typescript const analytics = await order.getAnalytics('coll_123', 'order_abc123') if (analytics.analytics) { console.log(`Total scans: ${analytics.analytics.totalScans}`) console.log(`Admin scans: ${analytics.analytics.adminScans}`) console.log(`Created at: ${analytics.analytics.estimatedCreatedAt}`) console.log(`Unique locations: ${analytics.analytics.uniqueLocations}`) analytics.analytics.tagSummaries.forEach(tag => { console.log(`Tag ${tag.tagId}: ${tag.totalScans} scans`) }) } ```

**getTimeline**(collectionId: string,
    orderId: string,
    params?: TimelineRequest) → `Promise<ListResult<TagScanEvent> &`
Get chronological timeline of all scan events for an order's tags. Supports filtering by date range and admin/customer scans. time (`limit` says how many, default 1000), with the order they belong to ```typescript // The first page of scan events let timeline = await order.getTimeline('coll_123', 'order_abc123') timeline.items.forEach(event => { console.log(`${event.timestamp}: ${event.eventType} by ${event.isAdmin ? 'admin' : 'customer'}`) }) // The next page if (timeline.nextCursor) timeline = await order.getTimeline('coll_123', 'order_abc123', { cursor: timeline.nextCursor }) // Get admin scans only from last week const adminScans = await order.getTimeline('coll_123', 'order_abc123', { isAdmin: true, from: '2026-02-01T00:00:00Z', limit: 500 }) ```

**getLocationHistory**(collectionId: string,
    orderId: string,
    params?: LocationRequest) → `Promise<ListResult<LocationScan> &`
Get location-based scan history for an order's tags. Shows where the order's tags have been scanned. a page at a time (`limit` says how many, default 1000), with the order they belong to ```typescript let locations = await order.getLocationHistory('coll_123', 'order_abc123', { limit: 100 }) locations.items.forEach(scan => { console.log(`${scan.location} at ${scan.timestamp}`) }) // The next page if (locations.nextCursor) { locations = await order.getLocationHistory('coll_123', 'order_abc123', { limit: 100, cursor: locations.nextCursor }) } ```

**getBulkAnalytics**(collectionId: string,
    data: BulkAnalyticsRequest) → `Promise<BulkAnalyticsResponse>`
Get analytics summary for multiple orders at once. Efficient way to retrieve scan data for many orders. ```typescript const bulk = await order.getBulkAnalytics('coll_123', { orderIds: ['order_1', 'order_2', 'order_3'], from: '2026-01-01T00:00:00Z' }) bulk.results.forEach(result => { if (result.analytics) { console.log(`${result.orderRef}: ${result.analytics.totalScans} scans`) } }) ```

**getCollectionSummary**(collectionId: string,
    params?: SummaryRequest) → `Promise<CollectionSummaryResponse>`
Get collection-wide analytics summary across all orders. Returns daily scan counts and admin activity overview. ```typescript // Get all-time collection summary const summary = await order.getCollectionSummary('coll_123') console.log(`Admin activity count: ${summary.adminActivity.count}`) console.log('Scans by day:') summary.scansByDay.forEach(day => { console.log(`  ${day.date}: ${day.scanCount} scans`) }) // Get summary for last 30 days const recentSummary = await order.getCollectionSummary('coll_123', { from: '2026-01-08T00:00:00Z', to: '2026-02-08T00:00:00Z' }) ```

### partner

**list**(options: ListOptions = {}) → `Promise<ListResult<Partner>>`
The partners you belong to, with your role in each. Returns `{ items, nextCursor }`: the partners are in `items` (empty for everyone else). A page at a time (`limit` and `cursor`; 50 unless you say otherwise). ```typescript let page = await partner.list() while (page.nextCursor) page = await partner.list({ cursor: page.nextCursor }) ```

**get**(partnerId: string) → `Promise<Partner>`
One partner (owners also see its members).

**claimSets**(partnerId: string, options: ListOptions = {}) → `Promise<ListResult<PartnerClaimSet>>`
The partner's claim sets. Returns `{ items, nextCursor }`: the sets are in `items`. A page at a time (`limit` and `cursor`; 50 unless you say otherwise). ```typescript let page = await partner.claimSets(partnerId) while (page.nextCursor) page = await partner.claimSets(partnerId, { cursor: page.nextCursor }) ```

**getClaimSet**(partnerId: string, claimSetId: string) → `Promise<PartnerClaimSet>`
One of the partner's claim sets.

**createClaimSet**(partnerId: string, params: CreatePartnerClaimSetRequest) → `Promise<PartnerClaimSet>`
A new claim set for the partner, on one of its tap domains (owners and admins).

**lookupTags**(partnerId: string, query: { uid?: string; code?: string }) → `Promise<ListResult<PartnerTagHit>>`
Find a tag across the partner's sets by its chip UID (8 or 14 hex) or its code (printed or bare). Returns `{ items, nextCursor }`: `items` has one hit for each of the partner's sets the tag is in (usually one; none if the tag isn't the partner's). Never returns keys. A look-up is never paged: every hit comes back in the one answer. ```typescript const { items: hits } = await partner.lookupTags(partnerId, { uid: '04A1B2C3D4E5F6' }) ```

**tagAttempts**(partnerId: string, uid: string, options: ListOptions = {}) → `Promise<ListResult<ClientErrorEvent>>`
What phones reported about one chip (errors.report with entityType 'tag'), newest first: a tag that failed to program or register, with the host's NFC log in context. For a chip in the partner's sets, or attempts that named one of them. Returns `{ items, nextCursor }`: the latest reports are in `items` (ten unless `limit` says otherwise); `cursor` is the previous page's `nextCursor`. ```typescript const { items: attempts } = await partner.tagAttempts(partnerId, '04A1B2C3D4E5F6', { limit: 20 }) ```

### places

**move**(collectionId: string, params: { to: string | null; items: PlaceMoveItem[]; note?: string }) → `Promise<PlaceMoveResult>`
Move items (by membership), chips without an item (by membership) or containers (re-parented) into `to`, or out of every place with `to: null`. Each move leaves a history line on what moved. Up to 500 at a time.

### podcast

**generate**(collectionId: string,
      request: GeneratePodcastRequest) → `Promise<GeneratePodcastResponse>`
Generate a NotebookLM-style conversational podcast from product documents

**getStatus**(collectionId: string, podcastId: string) → `Promise<PodcastStatus>`
Get podcast generation status

### products

**get**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<ProductResponse>`

**list**(collectionId: string,
    admin?: boolean,
    options: ListOptions & { expand?: Array<'facets'> } = {}) → `Promise<ListResult<ProductResponse>>`
The products in a collection, a page at a time. For searching, filtering and sorting use `products.query`. as full values instead of their keys ```typescript let page = await products.list(collectionId, false, { limit: 50 }) while (page.nextCursor) { page = await products.list(collectionId, false, { limit: 50, cursor: page.nextCursor }) } // Admin, with full facet values const { items } = await products.list(collectionId, true, { expand: ['facets'] }) ```

**create**(collectionId: string,
    data: ProductCreateRequest) → `Promise<ProductResponse>`
The products in a collection, a page at a time. For searching, filtering and sorting use `products.query`. as full values instead of their keys ```typescript let page = await products.list(collectionId, false, { limit: 50 }) while (page.nextCursor) { page = await products.list(collectionId, false, { limit: 50, cursor: page.nextCursor }) } // Admin, with full facet values const { items } = await products.list(collectionId, true, { expand: ['facets'] }) ```

**update**(collectionId: string,
    productId: string,
    data: ProductUpdateRequest) → `Promise<ProductResponse>`
The products in a collection, a page at a time. For searching, filtering and sorting use `products.query`. as full values instead of their keys ```typescript let page = await products.list(collectionId, false, { limit: 50 }) while (page.nextCursor) { page = await products.list(collectionId, false, { limit: 50, cursor: page.nextCursor }) } // Admin, with full facet values const { items } = await products.list(collectionId, true, { expand: ['facets'] }) ```

**remove**(collectionId: string,
    productId: string) → `Promise<void>`
The products in a collection, a page at a time. For searching, filtering and sorting use `products.query`. as full values instead of their keys ```typescript let page = await products.list(collectionId, false, { limit: 50 }) while (page.nextCursor) { page = await products.list(collectionId, false, { limit: 50, cursor: page.nextCursor }) } // Admin, with full facet values const { items } = await products.list(collectionId, true, { expand: ['facets'] }) ```

**query**(collectionId: string,
    body: ProductQueryRequest,
    admin?: boolean) → `Promise<ListResult<ProductResponse> &`
Query products in a collection with search, filtering, sorting, and paging. and the other filters in `query`, plus `limit` (default 50) and `cursor` for paging authenticated admin context). Defaults to `false`, which targets the `/public` endpoint — consistent with `get`, `list`, and `listAssets`. for the next page (null on the last), how many match in all where the server counted, and `meta` (how the query was run) ```typescript // Public query (default) const { items, nextCursor, count } = await products.query(collectionId, { q: 'cabernet', limit: 20 }) // The next page: the same query with the cursor if (nextCursor) { await products.query(collectionId, { q: 'cabernet', limit: 20, cursor: nextCursor }) } // Newest first, created this month, active only, with full facet values await products.query(collectionId, { orderBy: [{ createdAt: 'desc' }], createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' }, query: { status: ['active'] }, expand: ['facets'], }) // Admin query (authenticated) await products.query(collectionId, { q: 'cabernet' }, true) ```

**standardQuery**(collectionId: string,
    body: StandardQuery = {}) → `Promise<QueryResult>`
The standard query on products (admin only): the one query shape every resource is moving to, with counts, totals and filtering by facet. It sits beside `products.query`, whose own body is unchanged. POST /admin/collection/:collectionId/products/standard/query Fields: id, name, description, sku, gtin, schemaType, status, sortOrder, createdAt, updatedAt, facets. Facets are filtered by key: the facet by its key or name, the value by its key or name. ```typescript await products.standardQuery(collectionId, { where: { facets: { brand: 'Breville', category: { in: ['Toasters', 'Kettles'] } }, status: 'active' }, select: ['id', 'name', 'sku'], count: true, }) ```

**standardQueryFields**(collectionId: string) → `Promise<QueryDescription>`
What a products standard query can use: its fields and what each can filter, sort, group or total. GET /admin/collection/:collectionId/products/standard/query

**clone**(collectionId: string,
    productId: string,
    body: Record<string, JsonValue> = {}) → `Promise<ProductResponse>`
What a products standard query can use: its fields and what each can filter, sort, group or total. GET /admin/collection/:collectionId/products/standard/query

**listAssets**(collectionId: string,
    productId: string,
    admin?: boolean,
    options: ListOptions = {}) → `Promise<ListResult<AssetResponse>>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

**createClaimWindow**(collectionId: string,
    productId: string,
    body: Record<string, JsonValue>) → `Promise<unknown>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

**updateClaimWindow**(collectionId: string,
    productId: string,
    claimId: string,
    body: Record<string, JsonValue>) → `Promise<unknown>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

**refresh**(collectionId: string,
    productId: string) → `Promise<ProductResponse>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

**getSN**(collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<unknown>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

**lookupSN**(collectionId: string,
    productId: string,
    codeId: string) → `Promise<unknown>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

**publicLookupClaim**(collectionId: string,
    productId: string,
    claimId: string) → `Promise<unknown>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

**publicCreateClaim**(collectionId: string,
    productId: string,
    body: ProductClaimCreateRequestBody) → `Promise<unknown>`
A product's assets (images, documents), a page at a time. ```typescript let page = await products.listAssets(collectionId, productId, false, { limit: 50 }) while (page.nextCursor) { page = await products.listAssets(collectionId, productId, false, { limit: 50, cursor: page.nextCursor }) } ```

### proof

**query**(collectionId: string,
    body: StandardQuery = {}) → `Promise<QueryResult>`
The standard query on proofs (admin only): filter, sort, page, count and total a collection's proofs in one call, and follow a proof to its `product` and its `owner` (the owner's contact). POST /admin/collection/:collectionId/proof/query Fields: id, productId, userId (the owner's login id), batchId, variantId, lotId, status, claimable, createdAt, updatedAt. A proof's own values are not returned by this call. ```typescript // How many people own each product await proof.query(collectionId, { where: { userId: { isNull: false } }, groupBy: ['productId'], aggregates: { owners: { countDistinct: 'userId' } }, }) // The most recent owner of a product, with their name await proof.query(collectionId, { where: { productId: 'toaster', userId: { isNull: false } }, orderBy: [{ createdAt: 'desc' }], limit: 1, expand: { owner: ['firstName', 'lastName', 'email'] }, }) ```

**queryFields**(collectionId: string) → `Promise<QueryDescription>`
What a proofs query can use: its fields, what each can filter, sort, group or total, and its links. GET /admin/collection/:collectionId/proof/query

**get**(collectionId: string,
    productId: string,
    proofId: string,
    admin?: boolean,
    include?: string[]) → `Promise<ProofResponse>`
Retrieves a single Proof by Collection ID, Product ID, and Proof ID. Both public and admin endpoints now include productId in the path.

**list**(collectionId: string,
    options: ListOptions & { expand?: Array<'product'> } = {}) → `Promise<ListResult<ProofResponse>>`
List all Proofs for a Collection, a page at a time. GET /public/collection/:collectionId/proof ```typescript let page = await proof.list(collectionId, { limit: 50, expand: ['product'] }) while (page.nextCursor) { page = await proof.list(collectionId, { limit: 50, expand: ['product'], cursor: page.nextCursor }) } ```

**create**(collectionId: string,
    productId: string,
    request: ProofCreateRequest) → `Promise<ProofResponse>`
Create a proof for a product (admin only). POST /admin/collection/:collectionId/product/:productId/proof Pass the proof's content in a `proof` block, keyed by zone (see {@link ProofWrite}): ```ts proof.create(collectionId, productId, { proof: { values: { colour: 'red' },   // public + owner readable, owner + admin writable data:   { serialNo: 1001 },  // public + owner readable, ADMIN-only writable admin:  { costPrice: 4.20 }, // admin-only }, claimable: true, }) ``` Note: a top-level `data`/`admin` on the request body is legacy — top-level `data` gets folded into the values bag, so use `proof.data` for `proof.data`.

**update**(collectionId: string,
    productId: string,
    proofId: string,
    values: ProofUpdateRequest) → `Promise<ProofResponse>`
Update a proof for a product (admin only). PUT /admin/collection/:collectionId/product/:productId/proof/:proofId Pass the fields to change **at the root**, keyed by zone (see {@link ProofWrite}): ```ts proof.update(collectionId, productId, proofId, { data:   { serialNo: 1002 },   // → proof.data (admin-only writable) values: { colour: 'blue' },   // → proof.values }) ``` Object zones deep-merge, so you can change one field without wiping the rest.

**updateValues**(collectionId: string,
    productId: string,
    proofId: string,
    values: ProofValuesUpdateRequest) → `Promise<ProofResponse>`
Owner self-service update of a proof's owner-writable data. PUT /public/collection/:collectionId/product/:productId/proof/:proofId/values The public counterpart to admin `update` — the current OWNER (or a collection admin) editing their own proof, no admin credentials required. Only owner-writable zones are honoured (see {@link ProofValuesUpdateRequest}): ```ts proof.updateValues(collectionId, productId, proofId, { colour:   'blue',            // → proof.values.colour   (public) owner:    { warranty: '2y' }, // → proof.values.owner    (owner-scoped) personal: { nickname: 'Bo' }, // → proof.values.personal[callerUid] (private, own slot only) }) ``` `personal` always targets the caller's OWN slot — you cannot write another user's personal data, even as an admin. Object zones deep-merge (owner/personal merge field-by-field), so you can change one field without wiping the rest. Business-only zones (`data`/`admin`/`private`) are not writable here — use the admin `update` for those.

**claim**(collectionId: string,
    productId: string,
    proofId: string,
    values: ProofClaimRequest) → `Promise<ProofResponse>`
Claim a proof for a product using a proof ID (serial number, NFC tag, etc.). PUT /public/collection/:collectionId/product/:productId/proof/:proofId/claim

**claimProduct**(collectionId: string,
    productId: string,
    values?: ProofClaimRequest) → `Promise<ProofResponse>`
Claim a product without providing a proof ID. System auto-generates a unique serial number on-demand. Requires allowAutoGenerateClaims to be enabled on the collection or product. PUT /public/collection/:collectionId/product/:productId/proof/claim ```typescript const proof = await proof.claimProduct( 'beauty-brand', 'moisturizer-pro', { purchaseDate: '2026-02-17', store: 'Target' } ); console.log('Auto-generated ID:', proof.id); ```

**remove**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<void>`
Delete a proof for a product (admin only). DELETE /admin/collection/:collectionId/product/:productId/proof/:proofId

**getByUser**(collectionId: string,
    userId: string,
    options: ListOptions = {}) → `Promise<ListResult<ProofResponse>>`
Get proofs for a user in a collection (admin only), a page at a time. GET /admin/collection/:collectionId/proof/findByUser/:userId ```typescript let page = await proof.getByUser(collectionId, userId, { limit: 50 }) while (page.nextCursor) page = await proof.getByUser(collectionId, userId, { limit: 50, cursor: page.nextCursor }) ```

**getByProduct**(collectionId: string,
    productId: string,
    options: ListOptions = {}) → `Promise<ListResult<ProofResponse>>`
Get proofs for a product (admin only), a page at a time. GET /admin/collection/:collectionId/product/:productId/proof ```typescript let page = await proof.getByProduct(collectionId, productId, { limit: 50 }) while (page.nextCursor) page = await proof.getByProduct(collectionId, productId, { limit: 50, cursor: page.nextCursor }) ```

**findByProduct**(collectionId: string,
    productId: string,
    query: ProofFindQuery = {}) → `Promise<ListResult<ProofResponse>>`
Find proofs for a product (admin only): the newest ones, `limit` at a time (default 100), or the proofs matching `filterBy`. `expand: ['assets']` attaches each proof's assets. Pass `nextCursor` back as `cursor` for the next page. For counting and sorting a collection's proofs use `proof.query`. POST /admin/collection/:collectionId/product/:productId/proof/find ```typescript const { items, nextCursor } = await proof.findByProduct(collectionId, productId, { limit: 50, expand: ['assets'] }) const red = await proof.findByProduct(collectionId, productId, { filterBy: [{ field: 'values.colour', value: 'red' }] }) ```

**getByBatch**(collectionId: string,
    productId: string,
    batchId: string,
    options: ListOptions = {}) → `Promise<ListResult<ProofResponse>>`
Get proofs for a batch (admin only), a page at a time. GET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof ```typescript let page = await proof.getByBatch(collectionId, productId, batchId, { limit: 50 }) while (page.nextCursor) { page = await proof.getByBatch(collectionId, productId, batchId, { limit: 50, cursor: page.nextCursor }) } ```

**migrate**(collectionId: string,
    productId: string,
    proofId: string,
    /** The destination product ID */
    data: { targetProductId: string }) → `Promise<ProofResponse>`
Migrate a proof to a different product within the same collection (admin only). Because the Firestore ledger document ID is `{productId}-{proofId}`, a proof cannot simply be re-assigned to another product by updating a field — the document must be re-keyed. This endpoint handles that atomically: 1. Reads the source ledger document (`{sourceProductId}-{proofId}`). 2. Writes a new document (`{targetProductId}-{proofId}`) with `productId` and `proofGroup` updated. The short `proofId` (nanoid) is unchanged. 3. Writes a migration history entry to the new document's `history` subcollection (snapshot of the original proof + migration metadata). 4. Copies all subcollections — `assets`, `attestations`, `history` — from the old document to the new one. 5. Deletes the old subcollections and then the old document. Repeated migrations are safe — each one appends a history record; no migration metadata is stored on the proof document itself. ```typescript const migrated = await proof.migrate('coll_123', 'prod_old', 'proof_abc', { targetProductId: 'prod_new', }) console.log(migrated.productId) // 'prod_new' ```

**createGrant**(collectionId: string,
    productId: string,
    proofId: string,
    options: CreateGrantOptions) → `Promise<ProofGrant>`
Create a share grant on a proof (owner / collection admin only). The returned grant includes `token` — the opaque bearer secret, available ONLY on this response. Embed it in a share link and hand recipients {@link redeemGrant} / {@link setGrantToken}.

**listGrants**(collectionId: string,
    productId: string,
    proofId: string,
    options: ListOptions = {}) → `Promise<ListResult<ProofGrant>>`
List the active + past grants on a proof (owner / collection admin only), a page at a time. Tokens are never returned here. ```typescript const { items, nextCursor } = await proof.listGrants(collectionId, productId, proofId, { limit: 50 }) ```

**revokeGrant**(collectionId: string,
    productId: string,
    proofId: string,
    grantId: string) → `Promise<void>`
Revoke a grant by id (owner / collection admin only). Takes effect immediately.

**redeemGrant**(collectionId: string,
    productId: string,
    proofId: string,
    token: string,
    options?: RedeemGrantOptions) → `Promise<RedeemGrantResult>`
Redeem a grant token (anonymous or signed-in). Records the redemption and returns the granted scope, or — for a `verify_owner` grant — an ownership assertion (never the account). After redeeming, call {@link setGrantToken} so subsequent data requests carry the token.

**transfer**(collectionId: string,
    productId: string,
    proofId: string,
    options: TransferProofOptions) → `Promise<TransferProofResult>`
Start a push transfer of a proof (current owner / collection admin only). Directed — hand it to a named recipient who then calls {@link acceptTransfer}: ```ts await proof.transfer(collectionId, productId, proofId, { toEmail: 'buyer@example.com' }) ``` Open release — make the proof claimable by anyone: ```ts await proof.transfer(collectionId, productId, proofId, { release: true }) ``` Send comms by naming templates per role (server decides who receives each): ```ts await proof.transfer(collectionId, productId, proofId, { toEmail: 'buyer@example.com', comms: { recipient: { templateId: 'transfer-incoming', props: { note: 'Enjoy!' } }, sender:    { templateId: 'transfer-sent' }, }, }) ``` Direct to an SMS recipient by phone (E.164) and notify them by text: ```ts await proof.transfer(collectionId, productId, proofId, { toPhone: '+14155551234', comms: { recipient: { templateId: 'transfer-incoming', channel: 'sms' } }, }) ```

**acceptTransfer**(collectionId: string,
    productId: string,
    proofId: string,
    options: AcceptTransferOptions = {}) → `Promise<`
Accept a directed transfer (the named recipient only). Completes the ownership move — the proof's `userId` becomes the caller and the previous owner's private data and share grants are cleared/voided.

**cancelTransfer**(collectionId: string,
    productId: string,
    proofId: string,
    options: CancelTransferOptions = {}) → `Promise<`
Cancel a pending push transfer (current owner / collection admin only).

**getTransfer**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<`
Get the active transfer/status for a proof (owner, collection admin, or the named recipient). Returns `{ transfer: null }` when nothing is in flight.

### publicClient

**agentRun**(collectionId: string,
      body: PublicAgentRunRequest) → `Promise<AgentRunResult>`
Public agent loop — run the orchestration-neutral tool loop on the consumer surface. Exposes an app's PUBLIC server functions (`agent.tool:true`, `visibility:'public'`) to a consumer assistant; built-in tools are opt-in by explicit `server_tools[]` allowlist only. The caller runs as the signed-in consumer ('owner', send the authKit bearer) or anonymous ('public'). POST /public/collection/:collectionId/ai/agent/run

**getSession**(collectionId: string, sessionId: string) → `Promise<Session>`
Get session history

**clearSession**(collectionId: string, sessionId: string) → `Promise<`
Clear session history

**getRateLimit**(collectionId: string, userId: string) → `Promise<RateLimitStatus>`
Check rate limit status

### publicClient.sessions

**create**(collectionId: string,
        body: AiSessionCreate & { scope?: 'owner' | 'public' } = {}) → `Promise<AiSession>`

**list**(collectionId: string,
        params?: { appId?: string; limit?: number }) → `Promise<`
List the signed-in consumer's own ('owner') sessions — requires an authKit bearer.

**get**(collectionId: string, id: string) → `Promise<AiSession>`
List the signed-in consumer's own ('owner') sessions — requires an authKit bearer.

**append**(collectionId: string,
        id: string,
        items: ResponseInputItem[],
        opts?: { usage?: Record<string, any> }) → `Promise<AiSession>`
List the signed-in consumer's own ('owner') sessions — requires an authKit bearer.

**clear**(collectionId: string, id: string) → `Promise<`
List the signed-in consumer's own ('owner') sessions — requires an authKit bearer.

### qr

**lookupShortCode**(shortId: string, code: string) → `Promise<QrShortCodeLookupResponse>`
Resolve a short code to related resource identifiers.

### rateLimit

**reset**(collectionId: string, userId: string) → `Promise<`
Reset rate limit for a user

### realtime

**channel**(scope: RealtimeScope & { appId: string }, name: string) → `void`
One of your app's declared channels (manifest `realtime.channels`). ```ts const draw = realtime.channel({ collectionId, appId }, "draw") const off = draw.subscribe("status", (m) => setStatus(m.data)) await draw.publish("status", { phase: "spinning" }) // if the channel lets this viewer publish ```

**onChange**(scope: RealtimeScope, filter: RealtimeChangeFilter, onChangeFn: (change: RealtimeChangeEvent) → `void`
Something changed: refetch it. IDs only — never data. Admins of the collection see every change; everyone else sees changes to public things (public app records, products). Filter by `type` ('product' | 'proof' | 'asset' | 'record' | 'collection' | 'collection.apps' | 'settings'), `id`, `appId`, `recordType`, `productId`, `proofId`. ```ts const off = realtime.onChange({ collectionId }, { type: "record", appId, recordType: "entry" }, () => refetch()) ```

**onStaffChange**(scope: RealtimeScope & { appId: string }, filter: RealtimeChangeFilter, onChangeFn: (change: RealtimeChangeEvent) → `void`
Something this APP works on changed: one of its work orders, a container or stock it moved, or one of its own records. For the people who use the app, admins or not: someone hears these when they are in one of the app's user groups (the ones its server functions are limited to, or `realtime.staff` in its manifest), and so does a collection admin. IDs only — refetch through your own API. Types: 'workOrder' (`id`, `appId`), 'container' (`id`, `kind` = its container type), 'stock' (`id` = the container, `productId`), 'record' (`id`, `recordType`). Filter as with `onChange`; an empty filter hears them all. ```ts // A production app's screens refetch when anything on the floor changes. useEffect(() => realtime.onStaffChange({ collectionId, appId }, {}, () => queryClient.invalidateQueries()), [collectionId, appId]) ```

**onMine**(scope: RealtimeScope, onMessage: (msg: RealtimeMessage) → `void`
Messages for the signed-in person only (e.g. "scan" — a tag they just scanned on another device).

### research

**fetch**(collectionId: string, body: ResearchFetchRequest) → `Promise<ResearchFetchResult>`
Fetch + extract a web page: clean markdown, page metadata, and any schema.org JSON-LD (filtered by `type` when given). Firecrawl-primary, cached per collection. POST /admin/collection/:collectionId/research/fetch

### secrets

**put**(collectionId: string, name: string, value: string, opts: AppSecretOptions = {}) → `Promise<SetSecretResult>`
Save this app's secret `name` on the collection (create or replace) — what the app's server functions read with `ctx.secrets.get(name)` (declare `secrets:<name>` in the manifest). Call it from your admin screen as a collection admin. Write-only: returns `{ ref: name, hint }`, never the value. PUT /app/:appId/secrets/:name

**listOwn**(collectionId: string, opts: AppSecretOptions = {}) → `Promise<ListResult<SecretMeta>>`
This app's secrets on the collection: names + masked hints (never values). Returns `{ items, nextCursor }`: the secrets are in `items`, each `ref` being the name you saved it under. The list is not paged, so `nextCursor` is always `null`. GET /app/:appId/secrets ```typescript const { items } = await secrets.listOwn('coll_123') // items: [{ ref: 'shop-api-key', hint: '••••1234', ... }] ```

**removeOwn**(collectionId: string, name: string, opts: AppSecretOptions = {}) → `Promise<`
Delete this app's secret `name`. DELETE /app/:appId/secrets/:name

**list**(collectionId: string, query: ListSecretsQuery = {}) → `Promise<ListResult<SecretMeta>>`
List secrets as refs + masked hints + metadata (never values). Returns `{ items, nextCursor }`: the secrets are in `items`, newest first. The list is not paged, so `nextCursor` is always `null`. `purpose` narrows it to one purpose. GET /secrets ```typescript const { items } = await secrets.list('coll_123', { purpose: 'integration' }) ```

**set**(collectionId: string, input: SetSecretInput) → `Promise<SetSecretResult>`
Create a collection secret with a GENERATED ref. POST /secrets → { ref, hint }. Store the ref on a flow. For a secret your app's server functions read by name, use `put` instead.

**get**(collectionId: string, ref: string) → `Promise<SecretMeta>`
Metadata for one secret (never the value). GET /secrets/:ref

**rotate**(collectionId: string, ref: string, input: SetSecretInput) → `Promise<SetSecretResult>`
Rotate/update a secret's value (and optionally name/purpose). PUT /secrets/:ref → { ref, hint }

**remove**(collectionId: string, ref: string) → `Promise<`
Soft-delete a secret. DELETE /secrets/:ref

### segments

**create**(collectionId: string,
    body: Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>) → `Promise<SegmentRecord>`

**list**(collectionId: string,
    query: ListSegmentsQuery = {}) → `Promise<ListResult<SegmentRecord>>`
The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by `filterType`. ```typescript let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 }) page.items // SegmentRecord[] while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string,
    id: string) → `Promise<SegmentRecord>`
The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by `filterType`. ```typescript let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 }) page.items // SegmentRecord[] while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor }) ```

**update**(collectionId: string,
    id: string,
    body: Partial<Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>>) → `Promise<SegmentRecord>`
The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by `filterType`. ```typescript let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 }) page.items // SegmentRecord[] while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor }) ```

**remove**(collectionId: string,
    id: string) → `Promise<void>`
The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by `filterType`. ```typescript let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 }) page.items // SegmentRecord[] while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor }) ```

**calculate**(collectionId: string,
    id: string) → `Promise<SegmentCalculateResult>`
The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by `filterType`. ```typescript let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 }) page.items // SegmentRecord[] while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor }) ```

**recipients**(collectionId: string,
    id: string,
    query: ListOptions = {}) → `Promise<SegmentRecipientsResponse>`
The contacts in a segment, a page at a time. `count` is how many there are in all. ```typescript const page = await segments.recipients('coll_123', 'seg_1', { limit: 100 }) page.items      // Recipient[] page.count      // total in the segment page.nextCursor // pass back as `cursor` for the next page; null on the last ```

### serviceAccounts

**list**(collectionId: string, options: ListOptions = {}) → `Promise<ServiceAccountList>`
The service accounts that work on this collection — its own (`home: true`, with `alsoOn`) and other collections' (`home: false`, with `homeCollection`) — never their keys, and the access levels that can be given (`access`). A page at a time (`limit` and `cursor`; 50 unless you say otherwise). GET /service-accounts ```typescript let page = await serviceAccounts.list('coll_123') page.items  // ServiceAccount[] page.access // ["User", "Reporter", "Assigner", "Admin"] while (page.nextCursor) page = await serviceAccounts.list('coll_123', { cursor: page.nextCursor }) ```

**create**(collectionId: string, input: CreateServiceAccountInput) → `Promise<CreateServiceAccountResult>`
Make a service account → `{ serviceAccount, key }`. Show the key once — it can't be read again. You can't give it more access than you have. POST /service-accounts

**update**(collectionId: string, id: string, input: UpdateServiceAccountInput) → `Promise<ServiceAccount>`
Rename it (home collection only) and/or change its access on this collection. PUT /service-accounts/:id

**newKey**(collectionId: string, id: string) → `Promise<ServiceAccountKeyResult>`
Give it a new key → `{ key }` (shown once; home collection only); the old key stops working within a minute. POST /service-accounts/:id/key

**addTo**(collectionId: string, id: string, input: AddServiceAccountToCollectionInput) → `Promise<ServiceAccount>`
Let it work on another collection too, or change its access there. Call on its home collection; you must be an admin of `input.collectionId` as well, and can't give more access than you have there. POST /service-accounts/:id/collections

**removeFrom**(collectionId: string, id: string, otherCollectionId: string) → `Promise<`
Stop it working on `otherCollectionId` (call on its home collection). DELETE /service-accounts/:id/collections/:otherId

**remove**(collectionId: string, id: string) → `Promise<`
On its home collection: delete it — its key stops working and its access is removed everywhere. On another collection it works on: remove it from that collection only. DELETE /service-accounts/:id

### sessions

**stats**(collectionId: string) → `Promise<SessionStatistics>`
Get session statistics

**create**(collectionId: string, body: AiSessionCreate = {}) → `Promise<AiSession>`
Persisted AI assistant sessions (admin scope) — durable conversation history for admin/host assistants. Create one, then either append your turns explicitly, OR pass its `id` as `session_id` to `ai.chat.responses.create` and the server threads prior turns into the input and persists the new turn automatically (works with `server_tools`).

**list**(collectionId: string, params?: { appId?: string; limit?: number }) → `Promise<`
List sessions, most-recently-active first (optionally filtered by app).

**get**(collectionId: string, id: string) → `Promise<AiSession>`
Get one session, including its full transcript.

**append**(collectionId: string,
      id: string,
      items: ResponseInputItem[],
      opts?: { usage?: Record<string, any> }) → `Promise<AiSession>`
Append Responses items (input/output/tool) to a session — the manual-persistence path.

**clear**(collectionId: string, id: string) → `Promise<`
Archive (soft-delete) a session.

### shop

**config**(collectionId: string) → `Promise<ShopPublicConfig>`
What a shop front shows: currency, the seller's details (UK law: shown before paying), shipping rates, policies, and `ready` (false until the shop can take payments).

**products**(collectionId: string, params?: ListOptions & { productIds?: string[] }) → `Promise<ListResult<ShopProduct> &`
What is for sale, in the shop's currency, with stock (`inStock`, `available`) and whether the buyer must sign in first (`needsSignIn`: a proof or access goes to an account). A page at a time: page with `limit` (50 unless you say) and `cursor`. The shop's `currency` comes beside the list. Pass `productIds` for just those products. ```typescript let page = await shop.products(collectionId, { limit: 50 }) page.items.map((p) => `${p.name}: ${formatMoney(p.amount, p.currency)}${p.inStock ? '' : ' (sold out)'}`) while (page.nextCursor) page = await shop.products(collectionId, { limit: 50, cursor: page.nextCursor }) ```

**checkout**(collectionId: string, input: ShopCheckoutInput) → `Promise<ShopCheckoutResult>`
Start paying: the server prices the basket, holds the stock and returns Stripe's checkout page. Send the buyer to `checkoutUrl`. Signed-in buyers' orders are theirs (`shop.myOrders`). ```typescript const { checkoutUrl } = await shop.checkout(collectionId, { lines: [{ productId: 'soap', quantity: 2 }], shippingRateId: 'std', successUrl: `${location.origin}/thanks`,   // ?session_id= is added cancelUrl: `${location.origin}/basket`, }) location.href = checkoutUrl ``` `DIGITAL_CONSENT_REQUIRED`, `INVALID_INPUT` (e.g. a return page on another site), `PAYMENT_UNAVAILABLE` (nothing was charged)

**orderBySession**(collectionId: string, sessionId: string) → `Promise<ShopBuyerOrder>`
The thank-you page: the order a Stripe checkout paid for, from the `session_id` on the success URL. Its `status` is `pending-payment` for a moment while the payment is confirmed: check again shortly. `downloads` has links for bought files once it's paid.

**myOrders**(collectionId: string, params?: ListOptions) → `Promise<ListResult<ShopBuyerOrder>>`
The signed-in buyer's orders, newest first, with their download links, a page at a time. `count` is how many they have in all. ```typescript let page = await shop.myOrders(collectionId, { limit: 20 }) page.items // ShopBuyerOrder[] if (page.nextCursor) page = await shop.myOrders(collectionId, { limit: 20, cursor: page.nextCursor }) ```

**formatMoney**(amount: number, currency: string, locale?: string) → `string`
Format minor units as money, in the page's language unless `locale` says otherwise: `formatMoney(1299, 'EUR')` → "€12.99" in English, "12,99 €" in German. Zero-decimal currencies (JPY, KRW) are whole units: `formatMoney(1299, 'JPY')` → "¥1,299".

### shop.admin

**settings**(collectionId: string) → `Promise<ShopSettingsView>`
The settings, what's still needed to take payments (`readiness`), and what SmartLinks takes (`fee`, read-only).

**updateSettings**(collectionId: string, patch: ShopSettingsPatch) → `Promise<ShopSettingsView>`
Change settings: merged into what's stored; `shipping.rates` is replaced as a whole.

**connect**(collectionId: string, input: { returnUrl: string; refreshUrl: string }) → `Promise<`
Connect the seller's Stripe account (a new one, set up on Stripe's own pages). Send the seller to `url`; Stripe brings them back to `returnUrl` (done or not: check `connectStatus`) or `refreshUrl` (the link ran out).

**connectStatus**(collectionId: string) → `Promise<ShopConnectStatus>`
Whether Stripe is connected, and whether it can take payments and pay out yet.

**listPrices**(collectionId: string, params?: ShopPriceListParams) → `Promise<ListResult<ShopPrice>>`
The shop's prices, a page at a time. Filter by product, currency, app, or whether it is on sale (`active`). `count` is how many match in all. ```typescript const { items, nextCursor, count } = await shop.admin.listPrices(collectionId, { productId: 'soap', active: true }) ```

**setPrice**(collectionId: string, input: ShopPriceInput) → `Promise<ShopPrice>`
Put a product (or variant) on sale, or change its price in that currency (one price per product per currency). @throws `INVALID_INPUT`, `APP_NOT_INSTALLED`

**updatePrice**(collectionId: string, priceId: string, changes: ShopPriceUpdate) → `Promise<ShopPrice>`
Put a product (or variant) on sale, or change its price in that currency (one price per product per currency). @throws `INVALID_INPUT`, `APP_NOT_INSTALLED`

**removePrice**(collectionId: string, priceId: string) → `Promise<`
Take it off sale for good (or set `active: false` to pause).

**listOrders**(collectionId: string, params?: ShopOrderListParams) → `Promise<ListResult<ShopAdminOrder>>`
Shop orders, newest first, a page at a time. Unpaid and expired checkouts are left out unless asked for. `count` is how many match in all. ```typescript let page = await shop.admin.listOrders(collectionId, { status: 'paid', limit: 50 }) page.items // ShopAdminOrder[] while (page.nextCursor) page = await shop.admin.listOrders(collectionId, { status: 'paid', limit: 50, cursor: page.nextCursor }) ```

**getOrder**(collectionId: string, orderId: string) → `Promise<ShopAdminOrder>`
Shop orders, newest first, a page at a time. Unpaid and expired checkouts are left out unless asked for. `count` is how many match in all. ```typescript let page = await shop.admin.listOrders(collectionId, { status: 'paid', limit: 50 }) page.items // ShopAdminOrder[] while (page.nextCursor) page = await shop.admin.listOrders(collectionId, { status: 'paid', limit: 50, cursor: page.nextCursor }) ```

**ship**(collectionId: string, orderId: string, input: ShopShipInput = {}) → `Promise<ShopAdminOrder>`
Send some or all of what's left, with tracking. The held stock leaves; the buyer's "shipped" email goes out if the shop has one. @throws `NOT_SHIPPABLE`, `NOTHING_TO_SHIP`

**refund**(collectionId: string, orderId: string, input: ShopRefundInput = {}) → `Promise<ShopAdminOrder>`
Refund through Stripe: lines, shipping, a goodwill amount, or everything left. Unsent stock goes back; digital delivery is withdrawn. @throws `NOT_REFUNDABLE`, `NOTHING_TO_REFUND`

**markDelivered**(collectionId: string, orderId: string, itemId: string, input: { note?: string; reference?: string } = {}) → `Promise<ShopAdminOrder>`
An app that delivers a line itself (`deliveryConfig.kind: 'app'`) says it's done.

**cancelCheckout**(collectionId: string, orderId: string) → `Promise<ShopAdminOrder>`
Cancel a checkout that hasn't been paid (its stock is released). @throws `NOT_PENDING`

### skills

**list**(collectionId: string) → `Promise<ListResult<SkillDescriptor>>`
List the skills apps can invoke (name, description, input/output schema). Returns `{ items, nextCursor }`: the skills are in `items`. The list is not paged, so `nextCursor` is always `null`. ```typescript const { items: skills } = await ai.skills.list('coll_123') ```

**run**(collectionId: string, name: string, input: Record<string, any> = {}) → `Promise<T>`
Invoke a skill by name with structured input — the app-facing verb; no prompt-shaping. POST /admin/collection/:collectionId/ai/skills/:name/run

### subscriptions

**plans**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<PublicPlan>>`
Plans open to new members, each with its prices (monthly, yearly, one-off), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await subscriptions.plans(collectionId, { limit: 50 }) page.items.map((p) => p.prices.map((price) => subscriptions.describePrice(price))) while (page.nextCursor) page = await subscriptions.plans(collectionId, { limit: 50, cursor: page.nextCursor }) ```

**start**(collectionId: string, input: SubscriptionStartInput) → `Promise<SubscriptionStartResult>`
Join a plan: Stripe's checkout page for the chosen price. Send them to `checkoutUrl`. Signed in only (a membership belongs to an account). The membership exists once Stripe confirms the payment. ```typescript const { items: plans } = await subscriptions.plans(collectionId) const yearly = plans[0].prices.find((p) => p.interval === 'year') const { checkoutUrl } = await subscriptions.start(collectionId, { priceId: yearly.id, successUrl: `${location.origin}/welcome`, cancelUrl: `${location.origin}/join`, }) location.href = checkoutUrl ```

**mine**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<MySubscription>>`
The signed-in member's memberships, newest first (ended ones too: check `live`), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await subscriptions.mine(collectionId) const current = page.items.find((s) => s.live) while (page.nextCursor) page = await subscriptions.mine(collectionId, { cursor: page.nextCursor }) ```

**cancel**(collectionId: string, subscriptionId: string) → `Promise<MySubscription>`
Cancel: it ends at the end of the paid period, and access stays until then. A one-off plan or a staff grant ends now. Undo with `resume` before the period ends.

**resume**(collectionId: string, subscriptionId: string) → `Promise<MySubscription>`
Undo a cancel before the period ends. @throws `NOT_CANCELLING`

**change**(collectionId: string, subscriptionId: string, priceId: string) → `Promise<MySubscription>`
Move to another plan's price. Up (a higher-ranked or dearer plan): at once, charging the difference. Down: from the next renewal (`pendingPriceId` until then). @throws `CANNOT_CHANGE`, `NOT_FOUND`

**billingLink**(collectionId: string, subscriptionId: string, returnUrl: string) → `Promise<`
Stripe's page for the member's card, invoices and cancelling. Send them to `url`. @throws `NO_BILLING`

**describePrice**(p: { amount: number; currency: string; interval: 'month' | 'year' | null; intervalCount?: number }, locale?: string) → `string`
Format a plan price for people, in the page's language unless `locale` says otherwise: "£15 a month", "15 € pro Monat", "40 € tous les 3 mois", "99 € una tantum".

### subscriptions.admin

**listPlans**(collectionId: string, params?: ListOptions & { active?: boolean }) → `Promise<ListResult<PlanWithPrices>>`
The collection's plans with their prices, a page at a time. `active: true` for only the ones open to new members. ```typescript const { items, nextCursor } = await subscriptions.admin.listPlans(collectionId, { active: true }) ```

**getPlan**(collectionId: string, planId: string) → `Promise<PlanWithPrices>`
A plan with its prices and how many live members it has.

**createPlan**(collectionId: string, input: PlanInput) → `Promise<Plan>`

**updatePlan**(collectionId: string, planId: string, changes: PlanUpdate) → `Promise<Plan>`
Change a plan. Its term can't change once it has prices. Changed grants reach members when their membership next changes, or at once with `reapply`. @throws `PLAN_HAS_PRICES`

**removePlan**(collectionId: string, planId: string) → `Promise<`
Only a plan nobody has held; otherwise close it to new members (`active: false`). @throws `PLAN_HAS_MEMBERS`

**setPrice**(collectionId: string, planId: string, input: PlanPriceInput) → `Promise<PlanPrice>`
Set a plan's price for a currency and billing period (one each): replaces it if there is one.

**updatePrice**(collectionId: string, priceId: string, changes: Partial<PlanPriceInput>) → `Promise<PlanPrice>`
Set a plan's price for a currency and billing period (one each): replaces it if there is one.

**removePrice**(collectionId: string, priceId: string) → `Promise<`
A price nobody pays. One that members pay is kept: close it with `active: false`. @throws `PRICE_IN_USE`

**list**(collectionId: string, params?: SubscriptionListOptions) → `Promise<ListResult<Membership>>`
Memberships, newest first, with each one's plan, a page at a time. `count` is how many match in all. ```typescript let page = await subscriptions.admin.list(collectionId, { live: true, limit: 50 }) page.items // Membership[] while (page.nextCursor) page = await subscriptions.admin.list(collectionId, { live: true, limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string, subscriptionId: string) → `Promise<Membership>`
Memberships, newest first, with each one's plan, a page at a time. `count` is how many match in all. ```typescript let page = await subscriptions.admin.list(collectionId, { live: true, limit: 50 }) page.items // Membership[] while (page.nextCursor) page = await subscriptions.admin.list(collectionId, { live: true, limit: 50, cursor: page.nextCursor }) ```

**grant**(collectionId: string, input: SubscriptionGrantInput) → `Promise<Membership>`
Give someone a plan without payment (free, honorary, paid in cash). Its grants apply at once.

**cancel**(collectionId: string, subscriptionId: string, opts: { atPeriodEnd?: boolean } = {}) → `Promise<Membership>`
Cancel at the end of the paid period (default), or now with `atPeriodEnd: false`.

**resume**(collectionId: string, subscriptionId: string) → `Promise<Membership>`
Cancel at the end of the paid period (default), or now with `atPeriodEnd: false`.

**change**(collectionId: string, subscriptionId: string, priceId: string) → `Promise<Membership>`
Cancel at the end of the paid period (default), or now with `atPeriodEnd: false`.

**end**(collectionId: string, subscriptionId: string) → `Promise<Membership>`
End now. A paid one is stopped in Stripe at once (no refund is made here).

**reapply**(collectionId: string, subscriptionId: string) → `Promise<`
Re-apply what the plan grants now (after the plan's grants were changed).

### tagCodes

**lookup**(collectionId: string, tag: TagCodeRef) → `Promise<TagCodeState>`
What a tag is, as far as this collection may know: free, attached here (to what), or elsewhere.

**attach**(collectionId: string, params: TagCodeAttachRequest) → `Promise<TagCodeState>`
Put a tag on an asset: its asset type (productId) and the asset itself (proofId). Refused when the tag belongs to another organisation, or is already on another asset (detach it first).

**detach**(collectionId: string, tag: TagCodeRef) → `Promise<TagCodeState>`
Take a tag off its asset. It stays this collection's, free to go on another.

### tags

**create**(collectionId: string,
    data: CreateTagRequest) → `Promise<CreateTagResponse>`
Create a single tag mapping (admin). If `productId` is set without `proofId`, a serial number is auto-generated unless `useSerialNumber: true` is explicitly passed. `refType` and `refId` can be set independently of or alongside product/proof. ```typescript // Auto-generate serial number const tag = await tags.create('coll_123', { tagId:     'NFC-001', productId: 'prod_456', batchId:   'batch_2026_01', }) // Explicit proof + polymorphic ref const tag2 = await tags.create('coll_123', { tagId:   'NFC-002', refType: 'container', refId:   'container-uuid', }) ```

**createBatch**(collectionId: string,
    data: BatchCreateTagRequest) → `Promise<BatchCreateResult>`
Batch-create tags (admin). Tags with `productId` but no `proofId` automatically get serial numbers. Serial number generation is grouped by `(productId, variantId, batchId)` for efficiency.  Partial success is possible — check `results` for individual outcomes. ```typescript const result = await tags.createBatch('coll_123', { tags: [ { tagId: 'NFC-001', productId: 'prod_456', batchId: 'batch_2026_01' }, { tagId: 'NFC-002', productId: 'prod_456', batchId: 'batch_2026_01' }, ], }) console.log(`Created: ${result.summary.created}, Conflicts: ${result.summary.conflicts}`) ```

**get**(collectionId: string,
    tagId: string) → `Promise<GetTagResponse>`
Get a single tag by `tagId` (admin).

**update**(collectionId: string,
    tagId: string,
    data: UpdateTagRequest) → `Promise<UpdateTagResponse>`
Update a tag (admin). Partial update — only provided fields are changed.  `metadata` is deep-merged with the existing value.  Pass `refType: null, refId: null` to clear the polymorphic ref. ```typescript const updated = await tags.update('coll_123', 'NFC-001', { variantId: 'var_premium', metadata:  { notes: 'Updated to premium variant' }, }) // Clear polymorphic ref await tags.update('coll_123', 'NFC-001', { refType: null, refId: null }) ```

**remove**(collectionId: string,
    tagId: string) → `Promise<DeleteTagResponse>`
Delete a tag (admin). Permanently removes the tag from the per-org shard and the shared index.

**list**(collectionId: string,
    params?: ListTagsRequest) → `Promise<ListResult<Tag>>`
List tags with optional filters, a page at a time (admin). ```typescript // Tags for a product, page by page let page = await tags.list('coll_123', { productId: 'prod_456', limit: 100 }) while (page.nextCursor) { page = await tags.list('coll_123', { productId: 'prod_456', limit: 100, cursor: page.nextCursor }) } // Tags linked to a container const { items: linked } = await tags.list('coll_123', { refType: 'container', refId:   'container-uuid', }) ```

**byRef**(collectionId: string,
    params: ReverseTagLookupParams) → `Promise<ListResult<Tag>>`
Reverse lookup — find all tags linked to a given object (admin). Uses a compound index on `(orgId, refType, refId)` on the per-org shard. No embed support on the admin side. ```typescript let page = await tags.byRef('coll_123', { refType: 'container', refId: 'container-uuid', limit: 50 }) while (page.nextCursor) { page = await tags.byRef('coll_123', { refType: 'container', refId: 'container-uuid', limit: 50, cursor: page.nextCursor }) } ```

**resolveTag**(tagId: string) → `Promise<TagIndexEntry>`
Global tag resolve — returns `{ tagId, collectionId }` only. Use this **only** when you have a raw `tagId` and do not yet know which collection it belongs to.  Queries the shared `tag_index` shard. Once `collectionId` is resolved, call `publicGetByCollection` for full data. > The global `/public/tags/by-ref` endpoint has been removed. > Use the collection-scoped `publicByRef` instead. ```typescript // Step 1: resolve collection const { collectionId } = await tags.resolveTag('NFC-001') // Step 2: full lookup with embedded data const { tag, embedded } = await tags.publicGetByCollection( collectionId, 'NFC-001', 'product,proof' ) ```

**publicGetByCollection**(collectionId: string,
    tagId: string,
    embed?: string) → `Promise<PublicGetTagResponse>`
Single tag lookup with optional embedded data (public). `GET /public/collection/:collectionId/tags/:tagId?embed=product,proof,container,ref` Supported `embed` values: `'product'`, `'proof'`, `'container'`, `'ref'` (`'collection'` is not supported — the collection is already known from the URL). ```typescript const { tag, embedded } = await tags.publicGetByCollection( 'coll_123', 'NFC-001', 'product,proof' ) const product = embedded.products?.[tag.productId!] const proof   = embedded.proofs?.[tag.proofId!] ```

**lookupTags**(collectionId: string,
    data: LookupTagsRequest) → `Promise<TagLookupResponse>`
Batch tag lookup via POST (public). `POST /public/collection/:collectionId/tags/lookup` Tags not belonging to this collection are filtered out silently. Returns deduplicated embedded objects alongside the tag array. the tags found, a page at a time ```typescript const tagIds = ['NFC-001', 'NFC-002', 'NFC-003'] // Every tag found comes back in the one answer: a look-up is never paged. const { items, embedded } = await tags.lookupTags('coll_123', { tagIds, embed: 'product,proof' }) ```

**lookupTagsQuery**(collectionId: string,
    params: LookupTagsQueryRequest) → `Promise<TagLookupResponse>`
Batch tag lookup via GET (public). `GET /public/collection/:collectionId/tags/lookup?tagIds=NFC-001,NFC-002&embed=product` the tags found, a page at a time ```typescript const { items, embedded } = await tags.lookupTagsQuery('coll_123', { tagIds: 'NFC-001,NFC-002', embed:  'product', }) ```

**publicByRef**(collectionId: string,
    params: ReverseTagLookupParams) → `Promise<ByRefResponse>`
Reverse lookup by ref via GET (public). `GET /public/collection/:collectionId/tags/by-ref?refType=container&refId=<uuid>&embed=ref` ```typescript const { items: linked, embedded, nextCursor } = await tags.publicByRef('coll_123', { refType: 'container', refId:   'container-uuid', embed:   'container', limit:   50, }) const container = embedded.containers?.[containerId] ```

**publicByRefPost**(collectionId: string,
    data: ByRefRequest) → `Promise<ByRefResponse>`
Reverse lookup by ref via POST (public). `POST /public/collection/:collectionId/tags/by-ref` ```typescript const { items: linked, embedded, nextCursor } = await tags.publicByRefPost('coll_123', { refType: 'container', refId:   'container-uuid', embed:   'container', limit:   50, }) ```

### template

**getAll**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<Template>>`
The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await template.getAll('coll_123', { limit: 100 }) page.items // Template[] while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor }) ```

**get**(collectionId: string, templateId: string) → `Promise<Template>`
The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await template.getAll('coll_123', { limit: 100 }) page.items // Template[] while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor }) ```

**create**(collectionId: string, data: TemplateInput) → `Promise<Template>`
The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await template.getAll('coll_123', { limit: 100 }) page.items // Template[] while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor }) ```

**update**(collectionId: string,
    templateId: string,
    data: TemplateUpdate) → `Promise<Template>`
The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await template.getAll('coll_123', { limit: 100 }) page.items // Template[] while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor }) ```

**del**(collectionId: string, templateId: string) → `Promise<Template>`
The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await template.getAll('coll_123', { limit: 100 }) page.items // Template[] while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor }) ```

**uploadAsset**(collectionId: string,
    templateId: string,
    file: File | Blob) → `Promise<`
The templates in the collection (admin), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await template.getAll('coll_123', { limit: 100 }) page.items // Template[] while (page.nextCursor) page = await template.getAll('coll_123', { limit: 100, cursor: page.nextCursor }) ```

**getAllowed**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<TemplatePublic>>`
The collection's templates that may be used publicly, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await template.getAllowed('coll_123', { limit: 100 }) items // TemplatePublic[] ```

**getPublic**(collectionId: string, templateId: string) → `Promise<TemplatePublic>`
The collection's templates that may be used publicly, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await template.getAllowed('coll_123', { limit: 100 }) items // TemplatePublic[] ```

**getGlobal**(templateId: string) → `Promise<TemplatePublic>`
The collection's templates that may be used publicly, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await template.getAllowed('coll_123', { limit: 100 }) items // TemplatePublic[] ```

**getAllowedGlobal**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<TemplatePublic>>`
The global templates this collection may use, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await template.getAllowedGlobal('coll_123', { limit: 100 }) items // TemplatePublic[] ```

**render**(collectionId: string,
    templateId: string,
    body: TemplateRenderRequest) → `Promise<TemplateRenderResponse>`
The global templates this collection may use, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await template.getAllowedGlobal('coll_123', { limit: 100 }) items // TemplatePublic[] ```

**renderSource**(collectionId: string,
    body: TemplateRenderSourceRequest) → `Promise<TemplateRenderSourceResponse>`
The global templates this collection may use, 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript const { items, nextCursor } = await template.getAllowedGlobal('coll_123', { limit: 100 }) items // TemplatePublic[] ```

### tools

**run**(collectionId: string,
      name: K,
      args: AiToolArgsMap[K],) → `Promise<ToolRunResult>
    export async function run<T = any>(
      collectionId: string,
      name: string,
      args?: Record<string, any>,
    ): Promise<ToolRunResult<T>>
    export async function run(
      collectionId: string,
      name: string,
      args: Record<string, any> =`
Invoke ONE built-in server tool directly — no model in the loop. This is the "direct code" caller of the orchestration-neutral tool registry: the SAME tools the agent loop and the Responses `server_tools` path run, but called as a plain, typed, deterministic API. A front end can use it two ways: (1) call a tool straight as an API (e.g. `pdf.render` / `pdf.extract` behind a PDF UX), or (2) drive its OWN agent loop and execute each model tool-call here. Capability-gated server-side to the caller's grants (same blast-radius rules as the agent loop). POST /admin/collection/:collectionId/ai/tools/:name/run

### translations

**_resetRevisionChecks**() → `void`

**hashText**(text: string, options?: TranslationHashOptions) → `Promise<string>`

**hashTexts**(texts: string[], options?: TranslationHashOptions) → `Promise<string[]>`

**normalizeText**(text: string, options?: TranslationHashOptions) → `string`

**lookup**(collectionId: string,
    body: TranslationLookupRequest) → `Promise<TranslationLookupResponse>`

**onActivity**(cb: (activity: TranslationActivity) → `void`
Hear when content is being translated for the first time, in this window or in any app frame it embeds. Hosts use it to show a "translating this page" notice; apps never have to. Returns an unsubscribe function.

**translatingMessage**(language: string | null | undefined) → ``
The "translating this page" line, in the language being translated into (for a host's banner).

**activity**() → `TranslationActivity`
Whether a first-time translation is under way right now (see onActivity).

**resolve**(collectionId: string,
    body: TranslationLookupRequest,
    options: TranslationResolveOptions = {}) → `Promise<ResolvedTranslationResponse>`
Whether a first-time translation is under way right now (see onActivity).

**list**(collectionId: string,
    params?: TranslationListParams) → `Promise<ListResult<TranslationRecord>>`
Admin: the collection's stored translations, a page at a time. Filter by language, content type, where the text appears (`contextKey`), a search (`q`), whether a person edited it (`isOverride`), or whether it misses the site's required wording (`termIssues`). `count` is how many match in all. ```typescript let page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50 }) page.items // TranslationRecord[] while (page.nextCursor) { page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50, cursor: page.nextCursor }) } ```

**get**(collectionId: string,
    translationId: string) → `Promise<TranslationRecord>`
Admin: the collection's stored translations, a page at a time. Filter by language, content type, where the text appears (`contextKey`), a search (`q`), whether a person edited it (`isOverride`), or whether it misses the site's required wording (`termIssues`). `count` is how many match in all. ```typescript let page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50 }) page.items // TranslationRecord[] while (page.nextCursor) { page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50, cursor: page.nextCursor }) } ```

**update**(collectionId: string,
    translationId: string,
    body: TranslationUpdateRequest) → `Promise<TranslationRecord>`
Admin: the collection's stored translations, a page at a time. Filter by language, content type, where the text appears (`contextKey`), a search (`q`), whether a person edited it (`isOverride`), or whether it misses the site's required wording (`termIssues`). `count` is how many match in all. ```typescript let page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50 }) page.items // TranslationRecord[] while (page.nextCursor) { page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50, cursor: page.nextCursor }) } ```

**summary**(collectionId: string) → `Promise<`
Admin: how many translations exist per language, and how many a person has edited.

**places**(collectionId: string, targetLanguage: string) → `Promise<`
Admin: where translated text appears for one language (context keys), with counts.

**reset**(collectionId: string, translationId: string) → `Promise<TranslationRecord>`
Admin: undo a person's edit with a fresh machine translation.

**rules**(collectionId: string) → `Promise<TranslationRules>`
Admin: the site's translation rules (brief, notes per language, required terms).

**saveRules**(collectionId: string, body: Pick<TranslationRules, 'guidance' | 'languages' | 'terms'>) → `Promise<TranslationRules>`
Admin: replace the site's translation rules. They apply to new translations from now on.

**clearLocalCache**(collectionId?: string) → `Promise<void>`
Admin: replace the site's translation rules. They apply to new translations from now on.

### tts

**generate**(collectionId: string,
      request: TTSRequest) → `Promise<Blob>`
Generate text-to-speech audio

### userAppData

User-owned app data stored per user and app, shared across collections.

**getConfig**(appId: string) → `Promise<any>`
Get user's config blob for an app. This is a single JSON object stored per user+app. ```typescript const config = await userAppData.getConfig('allergy-tracker'); // Returns: { allergies: ['peanuts'], notifications: true } ```

**setConfig**(appId: string, config: any) → `Promise<any>`
Set user's config blob for an app. ```typescript await userAppData.setConfig('allergy-tracker', { allergies: ['peanuts', 'shellfish'], notifications: true }); ```

**deleteConfig**(appId: string) → `Promise<void>`
Delete user's config blob for an app. ```typescript await userAppData.deleteConfig('allergy-tracker'); ```

**list**(appId: string, options: ListOptions = {}) → `Promise<ListResult<any>>`
List the user's data items for an app, a page at a time. `nextCursor` back as `cursor` for the next page (null on the last). ```typescript let page = await userAppData.list('garden-planner', { limit: 50 }); // page.items: [{ id: 'bed-1', name: 'Vegetables', ... }, { id: 'bed-2', ... }] while (page.nextCursor) page = await userAppData.list('garden-planner', { limit: 50, cursor: page.nextCursor }); ```

**get**(appId: string, itemId: string) → `Promise<any>`
Get a specific user data item by ID. ```typescript const bed = await userAppData.get('garden-planner', 'bed-1'); // Returns: { id: 'bed-1', name: 'Vegetable Bed', plants: [...] } ```

**set**(appId: string, item: any) → `Promise<any>`
Create or update a user data item. The item object must include an `id` field. ```typescript await userAppData.set('garden-planner', { id: 'bed-1', name: 'Vegetable Bed', plants: ['tomatoes', 'peppers'], location: { x: 10, y: 20 } }); ```

**remove**(appId: string, itemId: string) → `Promise<void>`
Delete a user data item by ID. ```typescript await userAppData.remove('garden-planner', 'bed-1'); ```

### userGroups

**mine**(collectionId: string) → `Promise<MyUserGroups>`
The signed-in person's own user groups in this collection. Not signed in → both lists empty. Nobody can ask about anyone else with this. ```typescript const { userGroups: mine } = await userGroups.mine('coll_123') const canRelease = mine.includes('qc-controller') ```

**list**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<UserGroup>>`
The collection's user groups (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await userGroups.list('coll_123', { limit: 50 }) page.items.map((g) => g.name) while (page.nextCursor) page = await userGroups.list('coll_123', { limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string, userGroupId: string) → `Promise<UserGroup>`
One user group (admin).

**create**(collectionId: string, data: CreateUserGroupRequest) → `Promise<UserGroup>`
Create a user group (admin). Its key is made from the name unless you give one. ```typescript const qc = await userGroups.create('coll_123', { name: 'QC Controllers' }) qc.key // 'qc-controllers' ```

**update**(collectionId: string, userGroupId: string, data: UpdateUserGroupRequest) → `Promise<UserGroup>`
Change a user group (admin): its name, description, or anything else you keep on it. The key stays. To change who is in it, prefer `addMember` / `removeMember`: saving a whole `members` list here can overwrite a change someone else made at the same moment.

**remove**(collectionId: string, userGroupId: string) → `Promise<UserGroup>`
Delete a user group (admin). Its members lose whatever it allowed.

**members**(collectionId: string, userGroupId: string, options: ListOptions = {}) → `Promise<ListResult<UserGroupMember>>`
The people in a user group, with name and email (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await userGroups.members('coll_123', qc.id, { limit: 50 }) page.items // [{ uid, name, email }] while (page.nextCursor) page = await userGroups.members('coll_123', qc.id, { limit: 50, cursor: page.nextCursor }) ```

**addMember**(collectionId: string, userGroupId: string, who: AddUserGroupMemberRequest) → `Promise<UserGroup>`
Add one person (admin), by user id or by email. By email, the person is found in the collection's logins or added to them (no welcome email is sent). Adding someone who is already in changes nothing. ```typescript await userGroups.addMember('coll_123', qc.id, { email: 'sam@example.com', name: 'Sam' }) ```

**removeMember**(collectionId: string, userGroupId: string, userId: string) → `Promise<UserGroup>`
Remove one person (admin).

**history**(collectionId: string, params: UserGroupHistoryParams = {}) → `Promise<ListResult<UserGroupChange>>`
What changed, newest first (admin): user groups created, renamed and deleted, and every person added or removed, each with the admin who did it (`actorId`) and when (`at`). Give `userGroupId` for one user group, `userId` for everything about one person, or neither for the whole collection. Covers the last 30 days unless you give `from` / `to` (at most 400 days). Takes about a second. A page at a time: `limit` says how many (default 100, at most 1000); pass `nextCursor` back as `cursor` for the next page. ```typescript let page = await userGroups.history('coll_123', { userId: 'uid_1', from: '2026-11-01T00:00:00Z' }) // page.items: [{ at, type: 'usergroup.member-added', actorId: 'uid_admin', data: { key: 'qc-controllers', userId: 'uid_1', … } }] while (page.nextCursor) { page = await userGroups.history('coll_123', { userId: 'uid_1', from: '2026-11-01T00:00:00Z', cursor: page.nextCursor }) } ```

**ofUser**(collectionId: string, userId: string, options: ListOptions = {}) → `Promise<ListResult<UserGroupRef>>`
The user groups one person is in (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await userGroups.ofUser('coll_123', 'uid_1') page.items // [{ id, key, name }] while (page.nextCursor) page = await userGroups.ofUser('coll_123', 'uid_1', { cursor: page.nextCursor }) ```

### variant

**get**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string,
    options: ListOptions = {}) → `Promise<ListResult<VariantResponse>>`
List the variants for a collection and product (admin only), 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that was the last one. ```typescript let page = await variant.list('coll_123', 'prod_456', { limit: 100 }) page.items.map((v) => v.name) while (page.nextCursor) page = await variant.list('coll_123', 'prod_456', { limit: 100, cursor: page.nextCursor }) ```

**create**(collectionId: string,
    productId: string,
    data: VariantCreateRequest) → `Promise<VariantResponse>`
Create a new variant for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    variantId: string,
    data: VariantUpdateRequest) → `Promise<VariantResponse>`
Update a variant for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<void>`
Delete a variant for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    variantId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a variant (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    variantId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a variant (admin only).

### voice

**isSupported**() → `boolean`
Check if voice is supported in browser

**listen**(language = 'en-US') → `Promise<string>`
Listen for voice input

**speak**(text: string, options?: { voice?: string; rate?: number }) → `Promise<void>`
Speak text

### wallet

**addLinks**(collectionId: string, ref: WalletPassRef) → `Promise<`
"Add to Wallet" links for the signed-in person's pass about `ref` (made on first ask for a booking or a membership card). ```typescript const { pass } = await wallet.addLinks('coll_123', { type: 'booking', id: booking.id }) if (pass.links.apple) appleButton.href = pass.links.apple if (pass.links.google) googleButton.href = pass.links.google ```

**mine**(collectionId: string, options: ListOptions = {}) → `Promise<ListResult<WalletPassSummary>>`
The signed-in person's active passes on this site, with their links, a page at a time. Page with `limit` (50 unless you say) and `cursor`. ```typescript let page = await wallet.mine('coll_123') page.items.map((pass) => pass.links.google) while (page.nextCursor) page = await wallet.mine('coll_123', { cursor: page.nextCursor }) ```

**status**(collectionId: string) → `Promise<`
Which wallets are switched on (admin).

**list**(collectionId: string, query: ListOptions & { refType?: string; refId?: string; contactId?: string; includeVoided?: boolean }) → `Promise<ListResult<WalletPass>>`
Passes for one thing (`refType` + `refId`) or one person (`contactId`) (admin), a page at a time. Page with `limit` (50 unless you say) and `cursor`. Voided passes are left out unless `includeVoided` is true. ```typescript let page = await wallet.list('coll_123', { refType: 'event', refId: eventId, limit: 50 }) page.items // WalletPass[] while (page.nextCursor) page = await wallet.list('coll_123', { refType: 'event', refId: eventId, limit: 50, cursor: page.nextCursor }) ```

**get**(collectionId: string, passId: string) → `Promise<`
One pass, with its links (admin).

**byCode**(collectionId: string, code: string) → `Promise<`
The pass whose QR this is, for checking a ticket at the door (admin). `valid` is false for a voided pass. ```typescript const { pass, valid } = await wallet.byCode('coll_123', scannedValue) ```

**issue**(collectionId: string, input: IssueWalletPassRequest) → `Promise<`
Issue a pass (admin). Issuing again for the same thing, person and kind changes the existing pass.

**update**(collectionId: string, passId: string, fields: Partial<Omit<WalletPassContent, "kind">>) → `Promise<`
Change what a pass shows; both wallets follow (admin).

**voidPass**(collectionId: string, passId: string, reason?: string) → `Promise<`
The pass no longer counts: shown as void on the phone (admin).

**messageAll**(collectionId: string, ref: WalletPassRef, msg: { header?: string; body: string }) → `Promise<`
The same lock-screen message on every active pass for one thing, e.g. everyone holding a ticket for an event (admin). ```typescript await wallet.messageAll('coll_123', { type: 'event', id: eventId }, { header: 'Doors open', body: 'Doors open at 7pm' }) ```

**message**(collectionId: string, passId: string, msg: { header?: string; body: string }) → `Promise<`
A lock-screen message on the pass (admin).

