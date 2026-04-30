# Mobile Admin Container SDK

> **Version:** 1.0 · **Platform:** SmartLinks R4 · **Last updated:** 2026-04-30

This document describes how to build a **Mobile Admin Container** — a SmartLinks microapp that provides an in-the-field operator/admin surface optimised for mobile devices. These containers ship as a **separate `mobileAdmin` bundle** (not inside the `containers` bundle) so that Capacitor plugins, offline helpers, and operator-only code never reach the public consumer bundle.

> **See also:** [containers.md](containers.md) covers the public consumer container. The [Multiple Consumer Components](containers.md#multiple-consumer-components) section explains the consumer vs. admin bundle split.

---

## Table of Contents

1. [When to Build a Mobile Admin Container](#when-to-build-a-mobile-admin-container)
2. [Host Environment](#host-environment)
3. [The `host` Prop](#the-host-prop)
4. [Hardware Capabilities & the Capability Matrix](#hardware-capabilities--the-capability-matrix)
5. [Capacitor Plugin Baseline](#capacitor-plugin-baseline)
6. [Manifest Declaration](#manifest-declaration)
7. [Launcher Discovery](#launcher-discovery)
8. [Event Stream](#event-stream)
9. [Error Handling](#error-handling)
10. [Lifecycle](#lifecycle)
11. [Build & Bundle Requirements](#build--bundle-requirements)
12. [Example: Minimal Mobile Admin Container](#example-minimal-mobile-admin-container)
13. [Best Practices](#best-practices)

---

## When to Build a Mobile Admin Container

Build a Mobile Admin Container when the surface is intended for **field operators or admins** rather than consumers — especially when:

- You need native hardware: NFC, RFID, camera/barcode, haptics, geolocation
- The surface must work offline or in flaky network conditions
- You want the bundle to version independently from the public consumer app

All admin-mobile containers ship in the `mobileAdmin` bundle and are never loaded by the public portal. The mobile launcher loads them via the `mobileAdmin` manifest key.

---

## Host Environment

The SmartLinks Mobile launcher runs on five host environments:

| Host ID | Description | Hardware bridge |
|---------|-------------|-----------------|
| `custom-android` | Original Kotlin WebView app — full RFID + NTAG-advanced | `window.SmartlinksScanner` |
| `capacitor-ios` | iOS app built via Capacitor | Capacitor plugins |
| `capacitor-android` | Generic Android Capacitor build (no RFID) | Capacitor plugins |
| `pwa` | Installed Progressive Web App | Web APIs only |
| `browser` | Regular browser tab | Web APIs only |

Your container **never** detects the host directly. It receives a `host` prop from the launcher and reads `host.hardware.*` capability flags. The launcher handles the rest.

---

## The `host` Prop

Every container mounted by the SmartLinks Mobile launcher receives a single `host` prop — `AdminMobileHostContext`. Do not reach for `window.SmartlinksScanner` or `window.Capacitor` directly; both are wrapped here.

> **SDK export** — `AdminMobileHostContext`, `AdminMobileCapability`, `ActionableCapability`, `AdminMobileHostId`, `AdminMobileEvent`, `AdminMobileEventCallback`, `AdminMobileEventSubscriber`, `AdminMobileComponentManifest`, and `AdminMobileBundleManifest` are all exported from `@proveanything/smartlinks`. Import via `import type { AdminMobileHostContext } from '@proveanything/smartlinks'` — no local mirror needed. `ScannerEventSubscriber`, `MobileAdminComponentManifest`, and `MobileAdminBundleManifest` still export as deprecated aliases.

```typescript
interface AdminMobileHostContext {
  // Identity
  collectionId: string
  appId: string
  user: { uid?: string; email?: string; displayName?: string; isAdmin: boolean } | null

  // SDK — already initialised. Do NOT call initializeApi again.
  SL: typeof import('@proveanything/smartlinks')

  // Capabilities declared by this container in its manifest
  capabilities: AdminMobileCapability[]

  // Live capability flags for the current device
  hardware: {
    nfc: boolean
    rfid: boolean
    qr: boolean
    camera: boolean
    keyboard: boolean
  }

  // Unified hardware event stream — callback type: AdminMobileEventCallback
  events: { subscribe: (cb: AdminMobileEventCallback) => () => void }

  // Promise-based hardware actions — reject with a structured error when unavailable
  actions: {
    requestQrScan: () => Promise<string>
    requestNfcTap: (timeoutMs?: number) => Promise<{ uid: string; ndef?: string }>
    requestCameraPhoto: () => Promise<Blob>
    share: (payload: { title: string; url: string; text?: string }) => Promise<void>
    clipboard: {
      read: () => Promise<string>
      write: (text: string) => Promise<void>
    }
  }

  // Host-provided UI helpers — all optional, see §3 note
  ui: {
    toast?: (opts: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void
    haptic?: (style?: 'light' | 'success' | 'error') => void
    setHeaderTitle?: (title: string | null) => void
    navigateBack?: () => void
  }

  // Network & device info
  network: { isOnline: () => boolean }
  device: { info: () => Promise<{ model: string; platform: string }> }

  // Informational host version — use for logging/diagnostics, not feature detection.
  // For feature detection prefer existence checks: 'requestNfcTap' in host.actions
  _version: number
}
```

### Contract rules

1. **Check `host.hardware.X` before calling `host.actions.X`.** Calls to unavailable capabilities reject with `HostCapabilityUnavailableError`.
2. **Do not call `initializeApi`, and do not use top-level SDK imports for API calls.** `host.SL` is already configured with the right `baseURL`, auth, and logger. Code that does `import * as SL from "@proveanything/smartlinks"` and calls `SL.attestation.create(...)` will silently hit the wrong base URL — the top-level import is uninitialised in the launcher's runtime and produces no loud error. Always go through `host.SL`:
   ```typescript
   // ❌ Silent footgun — uninitialised SDK, wrong baseURL
   import * as SL from '@proveanything/smartlinks'
   await SL.attestation.create(...)

   // ✅ Correct
   await host.SL.attestation.create(...)
   ```
3. **Do not access `window.SmartlinksScanner` or `window.Capacitor` directly.** The host wraps both; direct access produces containers that only work on one shell.
4. **Externalise all shared deps** (React, ReactDOM, SL, Radix, etc.) — the launcher provides them as globals. See [Build & Bundle Requirements](#build--bundle-requirements).

```typescript
// Example — always check hardware flags first
const { host } = props

if (host.hardware.nfc) {
  host.ui.setHeaderTitle('Scan NFC tag')
  const { uid } = await host.actions.requestNfcTap(5000)
  // ...
}
```

### `host.ui` — native helpers vs. your own components

All four `host.ui` methods are **optional by design**. A container may run in the Sidekick mobile shell, a standalone PWA or browser tab, Storybook, or a screenshot harness — none of those environments is guaranteed to have a native toast system, a managed header, or a back stack. Forcing every host implementer to provide them would exclude the web and desktop use-cases the rest of the contract explicitly supports. Always guard with `?.`:

- `host.ui.toast?.({...})` / `host.ui.haptic?.('success')` — optional native feedback. Fall back to your own `<Toaster />` when absent.
- `host.ui.setHeaderTitle?.('Scanning…')` / `host.ui.navigateBack?.()` — host-shell integrations with no in-container equivalent. Silently no-op when the host doesn't implement them.

**Stub pattern for testing and Storybook:**

```typescript
const stubHost: Partial<AdminMobileHostContext> = {
  hardware: { nfc: false, rfid: false, qr: true, camera: true, keyboard: false },
  actions: {
    requestQrScan: async () => 'STUB_QR_CODE',
    requestNfcTap: async () => ({ uid: 'STUB_UID' }),
    requestCameraPhoto: async () => new Blob(),
    share: async () => {},
    clipboard: { read: async () => '', write: async () => {} },
  },
  ui: {
    toast: (opts) => console.log('[stub toast]', opts.title),
    haptic: () => {},
    setHeaderTitle: (t) => { if (t) document.title = t },
    navigateBack: () => history.back(),
  },
  network: { isOnline: () => true },
  user: { isAdmin: true, displayName: 'Test User', email: 'test@example.com' },
  SL: undefined as any, // replace with your test SL instance
}
```

---

## Hardware Capabilities & the Capability Matrix

Containers declare which capabilities they need (or can use) in the manifest `capabilities` array. The launcher uses this list to:

1. **Filter availability** — hide containers whose required hardware is not on this device
2. **Pre-warm** — start the right reader as soon as the container mounts
3. **Permission prompts** — request only the permissions the container actually needs

| Capability | Description |
|------------|-------------|
| `"nfc"` | NFC tap — UID + NDEF read |
| `"nfc-advanced"` | NTAG 21x mirror config, NTAG 424 SUN, key rotation (`custom-android` only) |
| `"rfid"` | UHF RFID mass scan (`custom-android` only) |
| `"qr"` | QR / barcode scanning (camera-based) |
| `"camera"` | Photo capture, gallery picker |
| `"keyboard"` | Physical hardware trigger/action buttons |
| `"geolocation"` | GPS coordinates |
| `"push"` | Remote push notifications (FCM/APNs) |

The full hardware capability matrix by host:

| Capability | custom-android | capacitor-ios | capacitor-android | pwa | browser |
|------------|:-:|:-:|:-:|:-:|:-:|
| NFC tap (UID + NDEF read) | ✅ | ✅ | ✅ | ⚠️ Chrome Android | ⚠️ |
| NFC NDEF write | ✅ | ❌ | ✅ | ⚠️ | ⚠️ |
| NFC advanced (NTAG 21x / 424) | ✅ | ❌ | ❌ | ❌ | ❌ |
| RFID mass scan | ✅ | ❌ | ❌ | ❌ | ❌ |
| QR / barcode scan | ✅ | ✅ | ✅ | ✅ | ✅ |
| Camera photo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hardware key events | ✅ | ❌ | ❌ | ❌ | ❌ |
| Haptics | ✅ | ✅ | ✅ | ⚠️ visual only | ⚠️ |

> Containers that declare `"rfid"` or `"nfc-advanced"` are only offered on `custom-android`. All others are assumed to run on all five hosts — design for the lowest common denominator and use `host.hardware.*` flags to unlock richer UI on capable devices.

---

## Capacitor Plugin Baseline

The custom Kotlin shell and both Capacitor shells ship the same baseline plugin set. Container authors can rely on all Tier 1 plugins on every native host.

### Tier 1 — always available on every native host

| Plugin | Surfaced via |
|--------|-------------|
| `@capacitor/haptics` | `host.ui.haptic()` |
| `@capacitor/network` | `host.network.isOnline()` |
| `@capacitor/device` | `host.device.info()` |
| `@capacitor/share` | `host.actions.share()` |
| `@capacitor/clipboard` | `host.actions.clipboard.*` |
| `@capacitor/preferences` | `host.storage.*` *(planned — see note below)* |
| `@capacitor/app` | host-managed (back button, deep links) |
| `@capacitor/status-bar` | host-managed |
| `@capacitor/keyboard` | host-managed |
| `@capacitor/toast` | wired into `host.ui.toast()` |

> **`host.storage` — planned shape.** Once released, the surface will wrap `@capacitor/preferences` directly:
> ```ts
> host.storage: {
>   get(key: string): Promise<string | null>
>   set(key: string, value: string): Promise<void>
>   remove(key: string): Promise<void>
>   keys(): Promise<string[]>
> }
> ```
> Until then: `localStorage` works on web hosts; use `@capacitor/preferences` directly (bundle it in) on native.

### Tier 2 — capability-gated (declare in manifest)

| Plugin | Capability flag |
|--------|----------------|
| `@capacitor/camera` | `"camera"` |
| `@capacitor-mlkit/barcode-scanning` | `"qr"` |
| `@capgo/capacitor-nfc` | `"nfc"` |
| `@capacitor/geolocation` | `"geolocation"` |
| `@capacitor/push-notifications` | `"push"` |
| `@capacitor/filesystem` | *(used when `offline: true`; bundle it in)* |

### Tier 3 — custom-android only (not Capacitor)

Proprietary hardware SDKs (UHF RFID, NTAG 21x/424 advanced programming, USB uFR reader feedback). These are wrapped behind `host.actions.*` — never access `window.SmartlinksScanner` directly.

---

## Manifest Declaration

Declare the bundle under the top-level `mobileAdmin` key in `app.manifest.json`. This is separate from `containers` — the mobile launcher reads `mobileAdmin`; the public portal never loads it.

```json
{
  "meta": { "appId": "my-app", "name": "My App", "version": "1.0.0" },

  "containers": {
    "files": { "js": { "umd": "dist/containers.umd.js", "esm": "dist/containers.es.js" }, "css": "dist/containers.css" },
    "components": [
      { "name": "PublicContainer", "description": "Default consumer experience" }
    ]
  },

  "mobileAdmin": {
    "files": {
      "js": {
        "umd": "dist/mobile-admin.umd.js",
        "esm": "dist/mobile-admin.es.js"
      },
      "css": null
    },
    "components": [
      {
        "name": "WarehousePickContainer",
        "description": "Pick orders by scanning NFC tags",
        "capabilities": ["nfc", "qr"],
        "offline": true
      }
    ]
  }
}
```

A `mobileAdmin` bundle can export multiple components targeting different operator workflows — each with its own `capabilities` declaration.

**Component fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Exported component name (must match the UMD bundle export) |
| `description` | string | Shown in the mobile launcher's app picker |
| `capabilities` | string[] | Hardware capabilities this component needs or can use. See table above. |
| `offline` | boolean | Set to `true` if this component queues writes locally and needs offline sync support. |

---

## Launcher Discovery

The SmartLinks Mobile launcher loads your `mobileAdmin` bundle through the platform's app registry — you do not reference the manifest URL directly.

**How it works:**

1. A collection admin enables the app for a collection in the SmartLinks admin console.
2. On startup (and periodically), the launcher fetches `app.manifest.json` for every enabled app in that collection via the SmartLinks platform API. These requests are authenticated with the launcher's operator session.
3. The launcher reads `mobileAdmin.components[]`, evaluates each component's `capabilities` against the current device's hardware flags, and shows matching components in the app picker.
4. When the operator opens a component, the launcher resolves `mobileAdmin.files.js.umd` against the app's CDN base, fetches the bundle, and mounts the component with its `host` prop.

**File URL resolution:** `files.js.umd` / `files.js.esm` are paths relative to your app's CDN root (set when the app version is published). Provide relative paths — the launcher resolves them; do not hardcode absolute URLs.

**Auth:** Manifest and bundle fetches use the launcher's session token. Your container is already authenticated via `host.user` and `host.SL` — do not add additional auth headers.

**On load failure:** If the bundle returns a non-2xx response, the launcher shows a user-visible error and logs it — it does not crash the full launcher. If `app.manifest.json` itself cannot be fetched, the app is silently excluded from the picker for that session.

> To debug a missing or stale manifest, confirm in the SmartLinks admin console that the app version is published and that the `mobileAdmin` key is present in the uploaded manifest.

---

## Event Stream

For raw scan events (rather than the action-driven `host.actions.requestNfcTap`), subscribe to the unified event stream. Events flow identically on every host — the launcher normalises bridge messages, Capacitor callbacks, and Web API events into the same shape.

```typescript
useEffect(() => {
  const unsubscribe = host.events.subscribe((event) => {
    switch (event.type) {
      case 'nfc-tap':    handleNfc(event.uid, event.ndef);  break
      case 'rfid-burst': handleEpcs(event.epcs);            break
      case 'qr-scan':    handleQr(event.code);              break
      case 'key-press':  if (event.keyCode === 293) startScan(); break
      case 'lifecycle':  handleLifecycle(event.phase);      break
    }
  })
  return unsubscribe
}, [host.events])
```

Lifecycle events (`event.type === 'lifecycle'`) carry a `phase` field: `'pause' | 'resume' | 'offline' | 'online'`. Use these instead of `window` event listeners so your container works identically on all hosts.

---

## Error Handling

Action methods reject with structured errors — wrap every `host.actions.*` call even on hosts where the capability "should" be available (the user can deny permission at runtime):

```typescript
class HostCapabilityUnavailableError extends Error {
  capability: 'nfc' | 'rfid' | 'qr' | 'camera'
  host: string  // host ID
}

class HostPermissionDeniedError extends Error {
  capability: 'nfc' | 'rfid' | 'qr' | 'camera'
}

class HostTimeoutError extends Error {
  capability: 'nfc' | 'qr'
  timeoutMs: number
}
```

```typescript
try {
  const code = await host.actions.requestQrScan()
  host.ui.haptic('success')
} catch (err) {
  if (err instanceof HostPermissionDeniedError) {
    host.ui.toast({ title: 'Camera access required', variant: 'destructive' })
  } else if (err instanceof HostTimeoutError) {
    host.ui.toast({ title: 'No QR code detected' })
  } else {
    throw err
  }
}
```

---

## Lifecycle

| Event | When | What to do |
|-------|------|------------|
| mount | User opens your container | Subscribe to events, start readers |
| unmount | User backs out / app backgrounded > 30s | Unsubscribe; persist in-flight state |
| `lifecycle: 'offline'` | Network lost | Switch to offline mode; queue writes locally |
| `lifecycle: 'online'` | Network restored | Flush queued writes |
| `lifecycle: 'pause'` | App backgrounded | Pause readers to save battery |
| `lifecycle: 'resume'` | App foregrounded | Resubscribe; refresh stale data |

Use `host.events.subscribe` for all lifecycle events — all five host types (`custom-android`, `capacitor-ios`, `capacitor-android`, `pwa`, `browser`) are guaranteed to emit every `'pause'`/`'resume'`/`'offline'`/`'online'` phase. No `window.addEventListener('online')` fallback is needed.

> **Planned** — `phase: 'mount' | 'unmount'` events are on the roadmap. These will fire when the container becomes visible / is removed from the host view stack, enabling deferred reader start-up without a `useEffect` dependency.

---

## Build & Bundle Requirements

The mobile admin bundle has its own Vite config: `vite.config.mobile-admin.ts`.

### Build output

```
dist/mobile-admin.umd.js
dist/mobile-admin.es.js
dist/mobile-admin.css    (if needed)
```

### Example `vite.config.mobile-admin.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const EXTERNALS: Record<string, string> = {
  'react':               'React',
  'react-dom':           'ReactDOM',
  'react/jsx-runtime':   'jsxRuntime',
  '@proveanything/smartlinks': 'SL',
  // Add all Radix, ReactQuery, ReactRouterDOM etc — same contract as containers
}

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__:  JSON.stringify(new Date().toISOString()),
  },
  build: {
    lib: {
      entry:    resolve(__dirname, 'src/mobile-admin/index.ts'),
      name:     'SmartLinksMobileAdmin',
      formats:  ['umd', 'es'],
      fileName: (fmt) => `mobile-admin.${fmt === 'es' ? 'es' : 'umd'}.js`,
    },
    rollupOptions: {
      external: Object.keys(EXTERNALS),
      output:   { globals: EXTERNALS },
    },
  },
})
```

**Key points:**
- Externalise the same shared deps as `containers` (React, SL, Radix, ReactQuery, etc.) — the launcher provides them.
- Capacitor plugins (Tier 2) should be **bundled in**, not externalised — the browser/PWA fallback must work even when the native plugin is absent.
- Enable/disable the build with `VITE_ENABLE_MOBILE_ADMIN=true` in `.env`.

### Build command

```bash
# Full pipeline
vite build && \
  vite build --config vite.config.widget.ts && \
  vite build --config vite.config.container.ts && \
  vite build --config vite.config.mobile-admin.ts

# Mobile admin only
vite build --config vite.config.mobile-admin.ts
```

---

## Example: Minimal Mobile Admin Container

```typescript
// src/mobile-admin/WarehousePickContainer.tsx
import { useEffect, useState } from 'react'
import type { AdminMobileHostContext } from '@proveanything/smartlinks'

interface Props {
  host: AdminMobileHostContext
}

export function WarehousePickContainer({ host }: Props) {
  const [lastScan, setLastScan] = useState<string | null>(null)

  // Auth guard — host may already enforce this, but be explicit
  if (!host.user?.isAdmin) {
    return <p>Admin access required.</p>
  }

  async function handleScan() {
    try {
      const code = await host.actions.requestQrScan()
      setLastScan(code)
      host.ui.haptic('success')
    } catch (err) {
      host.ui.toast({ title: 'Scan failed', variant: 'destructive' })
    }
  }

  useEffect(() => {
    host.ui.setHeaderTitle('Warehouse Pick')
    return () => host.ui.setHeaderTitle(null)
  }, [])

  return (
    <div style={{ padding: 16 }}>
      {host.hardware.qr ? (
        <button onClick={handleScan}>Scan Barcode</button>
      ) : (
        <p>Camera not available on this device</p>
      )}
      {lastScan && <p>Last scan: {lastScan}</p>}
    </div>
  )
}
```

```typescript
// src/mobile-admin/index.ts
export { WarehousePickContainer } from './WarehousePickContainer'

export const MOBILE_ADMIN_MANIFEST = {
  name: 'WarehousePickContainer',
  version: __APP_VERSION__,
  buildDate: __BUILD_DATE__,
}
```

---

## Best Practices

- **Always check `host.hardware.X` before calling `host.actions.X`** — never assume a capability is available.
- **Always wrap action calls in try/catch** — handle `HostPermissionDeniedError`, `HostTimeoutError`, and `HostCapabilityUnavailableError`.
- **All four `host.ui` methods are optional** (`toast`, `haptic`, `setHeaderTitle`, `navigateBack`) — guard every call with `?.`. See the `host.ui` section above.
- **`host.ui.setHeaderTitle` and `host.ui.navigateBack`** integrate with the host shell and have no in-container equivalent; call with `?.`.
- **Use `host.events.subscribe` for lifecycle events** — `'offline'`/`'online'`/`'pause'`/`'resume'` fire consistently on every host.
- **Never call `initializeApi`, never use top-level SDK imports for API calls** — `host.SL` is already configured. `SL.method()` instead of `host.SL.method()` silently uses the wrong baseURL.
- **Bundle Capacitor plugins in** (do not externalise) — so the component degrades gracefully on PWA/browser without crashing.
- **Declare `offline: true`** on a component if it queues writes locally — this signals the launcher to provision offline sync support.
- **Use `'methodName' in host.actions`** to feature-detect new host capabilities rather than comparing `host._version`. The version is informational only.
