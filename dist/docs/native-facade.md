# Native Capability Facade (`host.native` / `SL.native`)

> **Version:** 1.12 · **Platform:** SmartLinks R4 · **Last updated:** 2026-04-30

The `NativeFacade` is a thin contract layer between microapps and the device capabilities available on the current host shell (Kotlin, Capacitor iOS/Android, PWA, or browser). It lets a microapp call `host.native.share.share({...})` without knowing whether it's running over `window.SmartlinksScanner`, a Capacitor plugin, or `navigator.share`.

**The SDK owns the contract** (`src/native/types.ts`, re-exported from `@proveanything/smartlinks`). Each host implementation is responsible for wiring up the sub-facades and populating:
- `AdminMobileHostContext.native` (container prop, typed in the SDK), and
- `window.SL.native` (for UMD microapps that don't receive a host prop — host concern, not SDK).

---

## Table of Contents

1. [Access patterns](#access-patterns)
2. [What's in the facade](#whats-in-the-facade)
3. [What's NOT in the facade](#whats-not-in-the-facade)
4. [Error contract](#error-contract)
5. [Type reference](#type-reference)

---

## Access patterns

### Inside a Mobile Admin Container (recommended)

```typescript
import type { AdminMobileHostContext } from '@proveanything/smartlinks'

function MyContainer({ host }: { host: AdminMobileHostContext }) {
  const handleShare = async () => {
    await host.native?.share.share({ title: 'SmartLinks', url: window.location.href })
  }

  const handleScan = async () => {
    // Only present when the host provides a QR reader
    const code = await host.native?.qr.scan()
    if (code) processCode(code)
  }
}
```

Always call via `host.native?.<facade>.<method>()` — `native` is optional because not every host exposes the full surface (e.g. a minimal browser stub may omit `rfid`).

For hardware-gated capabilities (NFC, RFID, QR, camera) also check `host.capabilities` or `host.hardware.*` before calling, as those flags reflect physical availability on the current device:

```typescript
if (host.hardware.nfc && host.native?.nfc) {
  const { uid } = await host.native.nfc.read({ timeoutMs: 10_000 })
}
```

### Inside a UMD microapp (no host prop)

```typescript
// window.SL.native is populated by the host at boot — host concern, not SDK
const native = (window as any).SL?.native as import('@proveanything/smartlinks').NativeFacade | undefined
const code = await native?.qr.scan()
```

---

## What's in the facade

These capabilities have meaningful fallbacks across Kotlin / Capacitor / web. Always go through the facade.

| Sub-facade | Key methods | Fallback chain |
|---|---|---|
| `native.share` | `share({ title, url, text? })`, `canShare()` | Capacitor Share → `navigator.share` → copy to clipboard + toast |
| `native.clipboard` | `write(text)`, `read()` | Capacitor Clipboard → `navigator.clipboard` → `execCommand('copy')` |
| `native.haptics` | `impact(style?)`, `notification(style)`, `selection()` | Capacitor Haptics → `navigator.vibrate` → no-op |
| `native.network` | `getStatus()`, `addListener('change', cb)` | Capacitor Network → `navigator.onLine` + `'online'`/`'offline'` events |
| `native.device` | `getInfo()`, `getId()`, `getLanguageCode()` | Capacitor Device → UA parsing + cached UUID in `localStorage` |
| `native.storage` | `get(key)`, `set(key, value)`, `remove(key)`, `keys()` | Capacitor Preferences → `localStorage` → in-memory `Map` (private mode) |
| `native.qr` | `scan(opts?)` | Capacitor MLKit Barcode → html5-qrcode / `BarcodeDetector` |
| `native.auth` | `signInWithGoogle()`, `signOut()` | Kotlin bridge → Capacitor Browser + OAuth → web redirect |
| `native.nfc` | `read(opts?)`, `writeNdef(opts)`, `programTag(opts)`, `lockTag(opts)`, `isLocked(opts)` | Kotlin bridge → Web NFC (`NDEFReader`) → `HostCapabilityUnavailableError` |
| `native.rfid` | `startScan(opts?)`, `stopScan()`, `subscribe(cb)` | Kotlin bridge only — throws `HostCapabilityUnavailableError` on all other hosts |
| `native.events` | `subscribe(type, cb)`, `emit(type, payload?)` | Internal pub/sub bridging Kotlin `onSmartlinksData` + Capacitor listeners |
| `native.webSource` | `get()`, `set({ mode, channel?, liveUrl? })` | Kotlin bridge + Capacitor Preferences mirror |

> **`native.rfid` is the only optional sub-facade** on `NativeFacade` — it is only populated on `custom-android` hosts. All other sub-facades are present on every host, though individual methods may throw `HostCapabilityUnavailableError` when the underlying capability is absent.

> **`native.device` vs `host.device`** — `host.device.info()` is a simplified convenience that returns `{ model, platform }`. `host.native?.device.getInfo()` returns the full `DeviceInfo` (adds `osVersion`, `manufacturer`, `isVirtual`) and also provides `getId()` and `getLanguageCode()`. Use `host.device` when the convenience is enough.

> **`native.network` vs `host.network`** — `host.network.isOnline()` is a boolean convenience. `host.native?.network.getStatus()` returns `{ connected, connectionType }` including `'wifi'` / `'cellular'` distinction.

---

## What's NOT in the facade

These capabilities intentionally have no `SL.native` wrapper. Call the Capacitor plugin directly, or use the web API. The host provides them as Tier 1 or Tier 2 plugins (see [Capacitor Plugin Baseline](mobile-admin-container.md#capacitor-plugin-baseline)).

| Capability | Why not wrapped |
|---|---|
| `@capacitor/push-notifications` | Push only exists in Capacitor builds; no cross-shell registration flow. Import and call directly; detect Capacitor first. |
| `@capacitor/local-notifications` | Same — no Kotlin or web equivalent worth abstracting. |
| `@capacitor/camera` | Plugin already abstracts iOS/Android. PWA's `<input capture>` is too different in shape to unify. |
| `@capacitor/filesystem` | No web equivalent (storage quotas, sandbox rules differ). Use `URL.createObjectURL` + download anchor on web. |
| `@capacitor/geolocation` | `navigator.geolocation` already works in WebViews; the Capacitor plugin wraps the same OS APIs. No facade adds value. |
| `@capacitor/keyboard`, `@capacitor/screen-*`, `@capacitor/splash-screen`, `@capacitor/status-bar`, `@capacitor/dialog`, `@capacitor/app` | Per-host boot-time config or platform-chrome concerns; not part of the microapp contract. |
| `@capacitor/browser` | In-app browser for OAuth is intentionally Capacitor-only. For opening external URLs use `native.share.share({ url })`. |
| `@capawesome/capacitor-file-picker` | Picker UX too divergent across web (`<input type="file">`) and native to wrap usefully. |

If a capability later needs consistent behaviour across shells (e.g. notifications reach enough hosts to warrant throttling / routing via the facade), promote it into `NativeFacade` by adding an interface to `src/native/types.ts` and a row to the table above.

---

## Error contract

All facade methods reject with one of the three structured errors from `@proveanything/smartlinks`. A single catch block handles every capability and host combination:

```typescript
import {
  HostCapabilityUnavailableError,
  HostPermissionDeniedError,
  HostTimeoutError,
} from '@proveanything/smartlinks'

try {
  const { uid } = await host.native?.nfc.read({ timeoutMs: 10_000 }) ?? {}
} catch (err) {
  if (err instanceof HostCapabilityUnavailableError) {
    // host.capabilities won't list 'nfc' — we should have checked first
    host.ui.toast?.({ title: 'NFC not available on this device', variant: 'destructive' })
  } else if (err instanceof HostPermissionDeniedError) {
    host.ui.toast?.({ title: 'NFC permission denied', variant: 'destructive' })
  } else if (err instanceof HostTimeoutError) {
    host.ui.toast?.({ title: `No tag detected after ${err.timeoutMs / 1000}s` })
  } else {
    throw err
  }
}
```

---

## Type reference

All types below are exported from `@proveanything/smartlinks`:

```typescript
import type {
  NativeFacade,          // root — use on AdminMobileHostContext.native
  NativeCapability,      // union of sub-facade keys: 'share' | 'clipboard' | ...
  ShareFacade,
  ClipboardFacade,
  HapticsFacade,
  HapticImpactStyle,     // 'light' | 'medium' | 'heavy'
  HapticNotificationStyle,
  NetworkFacade,
  NetworkStatus,
  DeviceFacade,
  DeviceInfo,
  StorageFacade,
  QrFacade,
  QrScanOptions,
  AuthFacade,
  NfcFacade,
  NfcReadResult,
  RfidFacade,
  RfidScanOptions,
  EventsFacade,
  WebSourceFacade,
  WebSourceMode,
  WebSourceConfig,
} from '@proveanything/smartlinks'
```

The facade interfaces are contract-only — no runtime implementation is shipped in the SDK. You only need them for TypeScript type-checking (authoring containers or host stubs).
