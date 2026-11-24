---
title: API versions
description: How SmartLinks API versions work, which one this SDK asks for, and what a host must forward for apps in its frame.
category: Platform
---

# API versions

The SmartLinks API changes over time without breaking what's already built. Every request says which
version of the API it was built for, and the server keeps older versions working.

## How it works

- **Versions are named by year and month**, for example `2026-11`. The address keeps `/api/v1`.
- **A request names its version** in the `SmartLinks-Version` header. The answer carries the same header,
  saying which version was served.
- **No header means `2026-11`**: the API as it was when versions were introduced. Anything built before
  then keeps working unchanged.
- **Breaking changes only arrive in a new version.** New routes, new fields in an answer and new optional
  parameters can appear at any time, so ignore fields you don't recognise.
- **A route on its way out says so**: its answers carry `Deprecation`, and `Sunset` with the date it stops.
  After that date it answers `410` with `ENDPOINT_RETIRED`.

## With the SDK

You don't set anything. Each SDK release is built for one API version and sends it on every request,
with the SDK's own release and, in an app, the app:

| Header | Example | Meaning |
|---|---|---|
| `SmartLinks-Version` | `2026-11` | the API version this SDK release was built for |
| `SmartLinks-SDK` | `js/2.2.0` | the SDK release |
| `SmartLinks-App` | `faq@1.0.23` | the app (`appId`, and `appVersion` when given to `initializeApi`) |

So an app moves to a newer version of the API by upgrading its SDK, and never by surprise.

```typescript
import { initializeApi, API_VERSION, getApiVersion } from '@proveanything/smartlinks'

initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  appId: 'faq',
  appVersion: '1.0.23',        // your manifest's meta.version
})

API_VERSION      // '2026-11': what this SDK release is built for
getApiVersion()  // what this app is asking for
```

To hold an app on an older version while you upgrade the SDK for another reason, pin it:
`initializeApi({ …, apiVersion: '2026-11' })`.

## Without the SDK

Send the header yourself:

```
GET /api/v1/admin/collection/abc/products/p1
Authorization: Bearer …
SmartLinks-Version: 2026-11
```

Something that isn't a version (`v2`, `latest`) is refused with `400 UNKNOWN_API_VERSION` and the list of
versions that exist. A year-month between two versions gets the version that was current that month.

## If you host apps in a frame

An app in a frame asks its host to make its API calls. The app's SDK puts its three headers on every
such request, and **the host must forward them unchanged**, so the API answers in the shape the app's SDK
expects, not the host's.

- `getApiHeaders()` (what a host adds to make those calls) never includes the host's own version.
- `CLIENT_HEADER_NAMES` lists the three header names to let through.
- A host that uses the SDK's `IframeResponder` forwards them already.

An app whose headers aren't forwarded gets the baseline, `2026-11`.
