# Collection Analytics

Build collection analytics dashboards and fire-and-forget tracking with the SmartLinks SDK.

This guide covers the `analytics` namespace, which is separate from `interactions`:

- Use `analytics` for generic web analytics, link clicks, QR landing pages, and tag scan telemetry
- Use `interactions` for structured user actions like votes, entries, submissions, and journey-triggering events

---

## Start Here

### Use `analytics` when you want to...

- Track page views without waiting for a response
- Log outbound or internal link clicks
- Capture NFC / QR scan telemetry
- Build web analytics dashboards for a collection
- Query raw analytics events, time series, or grouped breakdowns

### Use `interactions` when you want to...

- Define named interaction types per collection
- Count outcomes like votes or registrations
- Track user actions with explicit business meaning
- Feed journeys, competitions, or participation logic

---

## Overview

The `analytics` namespace has two layers:

| Layer | Purpose |
|---|---|
| Public ingestion | Fire-and-forget event logging from the browser or client runtime |
| Admin queries | Dashboard and reporting APIs for collection analytics |

There are two analytics domains:

| Domain | Route | Typical use |
|---|---|---|
| Collection events | `/public/analytics/collection` | Page views, clicks, app navigation, landing pages |
| Tag events | `/public/analytics/tag` | NFC / QR scans, claim/code activity, suspicious scan monitoring |

The backend stores custom analytics dimensions in `metadata`, but promoted analytics fields now belong at top level and are queried from real columns.

See [docs/analytics-metadata-conventions.md](analytics-metadata-conventions.md) for the recommended key set.

---

## Quick Start

### Track a page view

```typescript
import { initializeApi, analytics } from '@proveanything/smartlinks'

initializeApi({ baseURL: 'https://smartlinks.app/api/v1' })

analytics.collection.track({
  sessionId: 1234567890,
  eventType: 'page_view',
  collectionId: 'demo-collection',
  productId: 'product_1',
  appId: 'homepage',
  path: '/c/demo-collection',
  deviceType: 'mobile',
})
```

### Track an outbound click

```typescript
analytics.collection.track({
  sessionId: 1234567890,
  eventType: 'click_link',
  collectionId: 'demo-collection',
  productId: 'product_1',
  linkId: 'hero-cta',
  destinationAppId: 'shop',
  href: 'https://example.com/buy',
  isExternal: true,
  placement: 'hero',
  campaign: 'summer-launch',
})
```

### Track a tag scan

```typescript
analytics.tag.track({
  sessionId: 1234567890,
  eventType: 'scan_tag',
  collectionId: 'demo-collection',
  productId: 'product_1',
  codeId: 'code_123',
  claimId: 'claim_456',
  path: '/claim/code_123',
  isAdmin: false,
  location: { country: 'US' },
  entryType: 'nfc',
  scanMethod: 'nfc',
})
```

---

## Fire-and-Forget Tracking

`analytics.collection.track(...)` and `analytics.tag.track(...)` are designed for browser-friendly event logging.

They use this strategy:

1. `navigator.sendBeacon()` when available
2. fallback to `fetch(..., { keepalive: true })`
3. do not wait for a response before continuing

This makes them a good fit for:

- page unload events
- click logging before navigation
- low-friction telemetry
- QR / NFC landing-page analytics

### Return value

Both tracking helpers return a small synchronous result:

```typescript
const result = analytics.collection.track({
  eventType: 'page_view',
  collectionId: 'demo-collection',
})

console.log(result)
// { queued: true, transport: 'beacon' }
```

If you need a fully awaited request/response flow for business logic, use a regular admin or public API instead of fire-and-forget analytics tracking.

---

## Browser Helpers

If you are replacing older portal-style tracking code, the SDK now includes a small browser helper layer under `analytics.browser`.

These helpers are useful when you want the SDK to fill in common defaults such as:

- `sessionId`
- `visitorId`
- `deviceType`
- current `path`
- `pagePath`
- `referrer` and `referrerHost`
- campaign and query fields like `utmSource`, `utmCampaign`, `pageId`, and `qrCodeId`
- cached geolocation when you opt into it

Example:

```typescript
analytics.browser.configure({
  visitorId: 'shared-visitor-id',
  defaultCollectionEvent: {
    collectionId: 'demo-collection',
    productId: 'product_1',
  },
  getCollectionDefaults: () => ({
    appId: 'homepage',
  }),
})

analytics.browser.trackPageView({
  placement: 'hero',
})

analytics.browser.trackLinkClick({
  href: 'https://example.com/buy',
  linkId: 'hero-cta',
  destinationAppId: 'shop',
})

console.log(analytics.browser.getVisitorId())

analytics.browser.setVisitorId('shared-visitor-id')
```

If your apps and widgets run on the same domain, `visitorId` can be shared through browser storage. That means an outer shell can explicitly seed the ID once with either `analytics.browser.configure({ visitorId })` or `analytics.browser.setVisitorId(...)`, and inner apps can reuse it through `analytics.browser.getVisitorId()`.

### Campaign and query capture

Browser helpers automatically capture common analytics query parameters such as:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- `pageId`, `qrCodeId`
- `group`, `tag`, `campaign`, `placement`

You can also read them directly when building your own event shape:

```typescript
const campaignFields = analytics.browser.captureCampaignParams()

analytics.browser.trackPageView({
  collectionId: 'demo-collection',
  productId: 'product_1',
  ...campaignFields,
})
```

### SPA page-view tracking

For single-page apps, use `bindPageViews()` once during app startup to automatically track route changes.

```typescript
const stopPageTracking = analytics.browser.bindPageViews({
  trackInitialPageView: true,
  event: {
    collectionId: 'demo-collection',
    productId: 'product_1',
    appId: 'homepage',
  },
})

// Later, if needed:
stopPageTracking()
```

### Delegated link tracking

For classic click analytics, use `bindLinkTracking()` instead of wiring individual anchors one by one.

```typescript
const stopLinkTracking = analytics.browser.bindLinkTracking({
  event: {
    collectionId: 'demo-collection',
    productId: 'product_1',
    appId: 'homepage',
  },
  trackInternal: true,
})
```

### Opt-in geolocation

Automatic geolocation should stay opt-in because it depends on browser permission, product UX, and privacy requirements.

If you only need coarse regional data such as country, prefer the auth location endpoints instead of prompting for browser geolocation:

- use `auth.getAccount()` and read `account.location` when the user is authenticated
- use `auth.getLocation()` when the user is anonymous and you want best-effort IP-derived country/location data

`auth.getLocation()` is a good candidate for session caching. The SDK now caches it in session storage by default for 30 minutes, and you can tune or disable that behavior if needed.

```typescript
const account = hasAuthCredentials()
  ? await auth.getAccount()
  : null

const location = account?.location ?? await auth.getLocation({
  ttlMs: 30 * 60 * 1000,
})

analytics.browser.setLocation(location)

analytics.browser.trackTagScan({
  collectionId: 'demo-collection',
  productId: 'product_1',
  codeId: 'code_123',
})
```

If you later need to refresh that coarse location explicitly, call `auth.getLocation({ forceRefresh: true })` or clear it first with `auth.clearCachedLocation()`.

Use browser geolocation only when you actually need precise coordinates:

```typescript
await analytics.browser.captureLocation({
  enableHighAccuracy: false,
  timeout: 3000,
  includeCoordinates: true,
})
```

If your app already has a trusted location source, you can set it directly with `analytics.browser.setLocation(...)` instead of asking the browser again.

---

## Public Ingestion

### `analytics.collection.track(event)`

Tracks generic collection analytics events such as:

- `page_view`
- `click_link`
- QR landing-page visits
- internal navigation
- outbound link activity

Supported top-level fields include the core event fields plus promoted analytics columns such as `visitorId`, `referrerHost`, `pageId`, and `entryType`, along with custom metadata dimensions like `group`, `placement`, `pagePath`, and `qrCodeId`.

Example:

```typescript
analytics.collection.track({
  sessionId: 1234567890,
  eventType: 'page_view',
  collectionId: 'demo-collection',
  productId: 'product_1',
  appId: 'homepage',
  destinationAppId: 'shop',
  linkId: 'hero-cta',
  deviceType: 'mobile',
  href: 'https://example.com/buy',
  path: '/c/demo-collection',
  isExternal: true,
  location: { country: 'GB' },
  referrerHost: 'instagram.com',
  utmCampaign: 'summer-launch',
  group: 'summer-launch',
  placement: 'hero',
  pageId: 'QR123',
  metadata: { pagePath: '/c/demo-collection?pageId=QR123' },
})
```

### `analytics.tag.track(event)`

Tracks physical scan analytics such as:

- `scan_tag`
- NFC or QR entry telemetry
- claim/code activity
- admin vs customer scan behavior

Supported top-level fields include the core scan fields plus promoted analytics columns such as `visitorId`, `entryType`, and `scanMethod`, along with custom metadata dimensions like `group`, `tag`, and campaign extras.

Example:

```typescript
analytics.tag.track({
  sessionId: 1234567890,
  eventType: 'scan_tag',
  collectionId: 'demo-collection',
  productId: 'product_1',
  codeId: 'code_123',
  claimId: 'claim_456',
  deviceType: 'mobile',
  path: '/claim/code_123',
  location: {
    country: 'US',
    latitude: 40.7,
    longitude: -74.0,
    area: 35,
  },
  isAdmin: false,
  group: 'retail-batch-a',
  tag: 'promo',
  entryType: 'nfc',
  scanMethod: 'nfc',
})
```

Notes:

- `scan_blank_tag` is intentionally excluded by the backend analytics pipeline
- Admin scans may still trigger other workflows even when analytics logging is skipped

### Queryable metadata

Top-level scalar metadata values are the most query-friendly today. You can filter them with `metadata` and break them down with `dimension: 'metadata'` plus `metadataKey`.

Promoted fields such as `visitorId`, `referrerHost`, `pageId`, `entryType`, and `scanMethod` should be sent and queried as top-level fields, not inside `metadata`.

```typescript
const grouped = await analytics.admin.breakdown('demo-collection', {
  source: 'tag',
  dimension: 'metadata',
  metadataKey: 'group',
  metric: 'count',
})
```

---

## Admin Queries

All admin analytics routes are collection-scoped:

```text
POST /api/v1/admin/collection/:collectionId/analytics/...
```

### Dashboard-style replacement endpoints

These are the easiest starting point if you are building dashboards similar to the older analytics app.

#### `analytics.admin.web(collectionId, body)`

Returns page-view oriented dashboard data.

```typescript
const dashboard = await analytics.admin.web('demo-collection', {
  startDate: '2026-03-01T00:00:00Z',
  endDate: '2026-03-31T23:59:59Z',
  productId: 'product_1',
})

console.log(dashboard.metrics.totalVisits)
console.log(dashboard.charts.topPages)
```

#### `analytics.admin.clicks(collectionId, body)`

Returns click-focused dashboard data.

```typescript
const clicks = await analytics.admin.clicks('demo-collection', {
  startDate: '2026-03-01T00:00:00Z',
  endDate: '2026-03-31T23:59:59Z',
})

console.log(clicks.metrics.totalClicks)
console.log(clicks.charts.topExternalLinks)
```

#### `analytics.admin.tagScans(collectionId, body)`

Returns tag scan dashboards, risk scoring, and suspicious activity charts.

```typescript
const scans = await analytics.admin.tagScans('demo-collection', {
  productId: 'product_1',
  startDate: '2026-03-01T00:00:00Z',
  endDate: '2026-03-31T23:59:59Z',
})

console.log(scans.metrics.totalScans)
console.log(scans.charts.suspiciousTags)
```

### Classic web analytics shortcuts

If you are building a more traditional analytics UI, the SDK also includes opinionated wrappers for common reports:

- `analytics.admin.topPages(...)`
- `analytics.admin.topReferrers(...)`
- `analytics.admin.topCampaigns(...)`
- `analytics.admin.topSources(...)`
- `analytics.admin.topDestinations(...)`

Example:

```typescript
const [pages, referrers, campaigns, destinations] = await Promise.all([
  analytics.admin.topPages('demo-collection', { limit: 10 }),
  analytics.admin.topReferrers('demo-collection', { limit: 10 }),
  analytics.admin.topCampaigns('demo-collection', { limit: 10 }),
  analytics.admin.topDestinations('demo-collection', { limit: 10 }),
])

console.log(pages.rows)
console.log(referrers.rows)
console.log(campaigns.rows)
console.log(destinations.rows)
```

#### `analytics.admin.products(collectionId, body)`

Returns distinct product IDs across both analytics domains.

```typescript
const products = await analytics.admin.products('demo-collection')
console.log(products.products)
```

#### `analytics.admin.qrCodes(collectionId, body)`

Returns QR/page identifiers extracted from event URLs.

```typescript
const qrCodes = await analytics.admin.qrCodes('demo-collection')
console.log(qrCodes)
```

#### `analytics.admin.tags(collectionId, body)`

Returns distinct tags with scan counts and active day counts.

```typescript
const tags = await analytics.admin.tags('demo-collection')
console.log(tags.tags)
```

---

## Generic Query Endpoints

Use these when you want charts, audits, or your own dashboard logic rather than the replacement dashboard responses.

### Summary

```typescript
const summary = await analytics.admin.summary('demo-collection', {
  source: 'events',
  eventType: 'page_view',
  from: '2026-03-01T00:00:00Z',
  to: '2026-03-31T23:59:59Z',
})

console.log(summary.summary.totalEvents)
console.log(summary.summary.uniqueSessions)
console.log(summary.summary.uniqueVisitors)
```

### Time series

```typescript
const traffic = await analytics.admin.timeseries('demo-collection', {
  source: 'events',
  eventType: 'page_view',
  granularity: 'week',
  metric: 'uniqueVisitors',
  from: '2026-02-01T00:00:00Z',
  to: '2026-03-01T00:00:00Z',
})
```

`uniqueVisitors` now works in generic analytics queries. The backend uses the top-level `visitorId` column when present and falls back to numeric `sessionId` for older events that do not include it yet.

### Breakdown

```typescript
const countries = await analytics.admin.breakdown('demo-collection', {
  source: 'events',
  eventType: 'page_view',
  dimension: 'country',
  metric: 'count',
  limit: 25,
})
```

### Raw events

```typescript
const rows = await analytics.admin.events('demo-collection', {
  source: 'tag',
  eventType: 'scan_tag',
  from: '2026-03-01T00:00:00Z',
  to: '2026-03-31T23:59:59Z',
  limit: 100,
  offset: 0,
  sort: 'desc',
})
```

---

## Legacy-Compatible Convenience Endpoints

The SDK exposes wrappers for the preserved compatibility routes too:

- `analytics.admin.weekly(...)`
- `analytics.admin.country(...)`

These are useful when migrating existing dashboards that still expect the older analytics app parameter shape.

---

## Common Filters

Most admin analytics queries support combinations of:

- `from`, `to`
- `eventType` or `eventTypes[]`
- `productId` or `productIds[]`
- `proofId` or `proofIds[]`
- `batchId` or `batchIds[]`
- `variantId` or `variantIds[]`
- `sessionId` or `sessionIds[]` as numbers
- `country` or `countries[]`
- `metadata` for top-level JSON equality matching

For metrics, generic queries support:

- `count`
- `uniqueSessions`
- `uniqueVisitors`

Extra collection-event filters include:

- `appId`, `appIds[]`
- `destinationAppId`, `destinationAppIds[]`
- `linkId`, `linkIds[]`
- `href`, `path`
- `hrefContains`, `pathContains`
- `isExternal`

Extra tag-event filters include:

- `codeId`, `codeIds[]`
- `claimId`, `claimIds[]`
- `isAdmin`
- `hasLocation`

---

## Best Practices

### 1. Use analytics and interactions for different jobs

- `analytics` for telemetry, traffic, clicks, and scan monitoring
- `interactions` for explicit business events and outcomes

### 2. Track before navigation

For outbound links, log the analytics event immediately before triggering navigation so `sendBeacon()` has the best chance of queuing it.

### 3. Keep metadata shallow

Analytics metadata filtering currently works best with top-level scalar keys such as:

- `placement`
- `campaign`
- `group`
- `tag`
- `utmSource`
- `utmCampaign`
- `pagePath`

See [docs/analytics-metadata-conventions.md](analytics-metadata-conventions.md) for the recommended shared vocabulary.

### 4. Prefer generic endpoints for custom dashboards

Use `/summary`, `/timeseries`, `/breakdown`, and `/events` when you are building your own reporting UI. Use `web`, `clicks`, and `tagScans` when you want opinionated dashboard responses.

---

## Example: Outbound Link Tracking

```typescript
function trackAndNavigate(href: string) {
  analytics.collection.track({
    sessionId: 1234567890,
    eventType: 'click_link',
    collectionId: 'demo-collection',
    linkId: 'buy-now',
    href,
    isExternal: true,
    placement: 'hero',
    pagePath: '/c/demo-collection',
  })

  window.location.href = href
}
```

## Example: Scan Dashboard

```typescript
async function loadScanDashboard(collectionId: string) {
  const [summary, countries, suspicious] = await Promise.all([
    analytics.admin.summary(collectionId, {
      source: 'tag',
      eventType: 'scan_tag',
    }),
    analytics.admin.breakdown(collectionId, {
      source: 'tag',
      eventType: 'scan_tag',
      dimension: 'country',
      metric: 'count',
      limit: 10,
    }),
    analytics.admin.tagScans(collectionId, {
      startDate: '2026-03-01T00:00:00Z',
      endDate: '2026-03-31T23:59:59Z',
    }),
  ])

  return {
    totalScans: summary.summary.totalEvents,
    topCountries: countries.rows,
    suspiciousTags: suspicious.charts.suspiciousTags,
  }
}
```
