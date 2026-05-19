# Requesting Built-in Portal Actions

`requestAction` is the general-purpose sibling of
[`requestLogin`](./portal-request-login.md). It lets a sub-app
(container, widget, or iframe) trigger any of the portal's built-in
capabilities — open the QR scanner, log out, copy the current link,
navigate to another app — and await a result.

Use it whenever the answer to *"what do I want?"* is one of the
portal's standardized capabilities. The portal owns the implementation;
your sub-app declares intent.

---

## Why this exists

Linkpage-style apps, action grids and CTAs across the platform all need
the same primitives: scan a QR, take a photo, copy a link, jump to
another app, log the user out. Without a shared contract every app
re-implemented these against direct browser APIs, fragmenting UX and
breaking cross-iframe boundaries. `requestAction` is the contract.

---

## Container / Widget Apps (Same React Tree)

```tsx
import { usePortalActions } from '@proveanything/portal-framework';

function ShareButton() {
  const portal = usePortalActions();
  async function onClick() {
    const result = await portal?.requestAction('__share', {
      title: 'Check this out',
      url: window.location.href,
    });
    // result.status === 'success' | 'cancelled' | 'unavailable' | 'error' | 'triggered'
  }
  return <button onClick={onClick}>Share</button>;
}
```

`usePortalActions()` returns `null` when no `ActionRequestProvider` is
mounted upstream — treat that the same as `status: 'unavailable'`.

### Discovering available actions

```ts
const ids = portal?.getAvailableActions() ?? [];
// → ['__refresh','__share','__copyLink','__navigate','__login','__logout',
//    '__account','__qrScanner','__barcodeScanner','__nfcScanner', ...]
```

Combine with `BUILTIN_ACTION_META` (also exported) for labels/icons in
your action pickers.

---

## Iframe Apps (Cross-Origin)

```ts
const requestId = crypto.randomUUID();

window.addEventListener('message', function handler(ev) {
  const d = ev.data;
  if (!d || d._smartlinksIframeMessage !== true) return;
  if (d.type !== 'smartlinks:action:result') return;
  if (d.payload?.requestId !== requestId) return;
  window.removeEventListener('message', handler);

  const { status, value, error } = d.payload;
  // …handle result
});

window.parent.postMessage({
  _smartlinksIframeMessage: true,
  type: 'smartlinks:action:request',
  payload: {
    requestId,
    actionId: '__copyLink',
    params: { url: window.location.href },
  },
}, '*');
```

### Capabilities probe

```ts
window.parent.postMessage({
  _smartlinksIframeMessage: true,
  type: 'smartlinks:action:capabilities',
  payload: { requestId },
}, '*');
// reply: type 'smartlinks:action:capabilities:result'
//   payload: { requestId, actions: string[], meta: Record<id, {label, icon, description, available}> }
```

Use this to hide actions the host doesn't support (e.g. `__nfcScanner`
on iOS web).

---

## Built-in actions

| Action ID | Kind | Params | Success value |
|---|---|---|---|
| `__refresh` | sync | — | — |
| `__share` | sync | `{ title?, text?, url? }` | `{ method: 'native' \| 'clipboard' }` |
| `__copyLink` | sync | `{ text?, url? }` | `{ url }` |
| `__navigate` | sync | `{ appId, deepLink?, deepLinkParams? }` | — |
| `__login` | sync | `{ reason?, mode?, resolveIfAuthenticated? }` | `{ user, token }` |
| `__logout` | sync | — | — |
| `__account` | sync | login params | login → `{ user, token }`; logout → — |
| `__qrScanner` | overlay | `{ suppressNavigation?: boolean }` | `{ text, format, resolved?: { collectionId, productId?, proofId? } }` |
| `__barcodeScanner` | overlay | `{ suppressNavigation?: boolean }` | `{ text, format }` |
| `__nfcScanner` | overlay | `{ suppressNavigation?: boolean }` | `{ serial, payload? }` (Android only) |
| `__language` | overlay | — | — |
| `__profile` | page | — | — |
| `__settings` | page | — | — |

> **`__login` vs `requestLogin`:** For the common case of "I just need a
> logged-in user before continuing", prefer
> [`requestLogin`](./portal-request-login.md) — it is a typed convenience
> wrapper around `requestAction('__login', ...)` with a richer result
> contract. Use `__login` / `__account` via `requestAction` only when you
> are composing with other built-in actions in the same flow.

---

## App-registered actions

Sub-apps may register their own action IDs via `siteInjections.actions`
on `OrchestratedPortal`. Those IDs become callable through the same
`requestAction` / postMessage contract as built-ins. Unlike built-ins they
are not guaranteed to be present on every portal — always probe
`getAvailableActions()` before using them.

---

## Result shape

```ts
type ActionRequestResult = {
  status:
    | 'success'      // action completed (sync actions may carry a value; capture overlays always do)
    | 'cancelled'    // user dismissed the overlay without completing
    | 'unavailable'  // unknown action or capability not present on this host
    | 'error';       // action threw
  value?: unknown;
  error?: string;
  requestId?: string; // echoed on postMessage replies
};
```

All actions now resolve to one of these four terminal statuses. There is no
`triggered` intermediate status — capture-mode overlays (QR, barcode, NFC)
keep the caller's promise pending until the user completes the scan or
dismisses the overlay.

---

## Scanner actions in detail

QR, barcode, and NFC scanner actions open the portal's scanner overlay and
**await user input** — the promise (or postMessage reply) is held open until
the user either completes a scan or dismisses the overlay.

By default the portal also performs its standard navigation after a
successful scan (e.g. resolving a SmartLinks proof URL). Pass
`suppressNavigation: true` when you want the raw value and no portal routing.

```ts
// Container / widget — get the scanned value, skip portal navigation
const result = await portal.requestAction('__qrScanner', {
  suppressNavigation: true,
})
if (result.status === 'success') {
  const { text, format, resolved } = result.value as QrScanResult
  // text    — raw scanned string
  // format  — e.g. 'QR_CODE', 'EAN_13'
  // resolved — if the text decoded to a SmartLinks URL:
  //   { collectionId, productId?, proofId? }
}
if (result.status === 'cancelled') {
  // user closed the scanner without scanning
}
```

```ts
// Container / widget — let the portal navigate AND get the value
const result = await portal.requestAction('__qrScanner')
// portal navigates to the scanned link; sub-app also gets the value
```

```ts
// Iframe — same contract via postMessage
const requestId = crypto.randomUUID()

window.addEventListener('message', function handler(ev) {
  const d = ev.data
  if (!d?._smartlinksIframeMessage) return
  if (d.type !== 'smartlinks:action:result') return
  if (d.payload?.requestId !== requestId) return
  window.removeEventListener('message', handler)

  if (d.payload.status === 'success') {
    const { text, format, resolved } = d.payload.value
    // use the scan result
  }
})

window.parent.postMessage({
  _smartlinksIframeMessage: true,
  type: 'smartlinks:action:request',
  payload: {
    requestId,
    actionId: '__qrScanner',
    params: { suppressNavigation: true },
  },
}, '*')
```

### Scan value types

```ts
type QrScanResult = {
  text: string
  format: string                           // 'QR_CODE', 'EAN_13', etc.
  resolved?: {
    collectionId: string
    productId?: string
    proofId?: string
  }
}

type BarcodeScanResult = {
  text: string
  format: string
}

type NfcScanResult = {
  serial: string
  payload?: string
}
```

---

## Relationship to `LinkTarget`

Linkpage-style UIs persist a `LinkTarget` of kind `'action'`:

```ts
type ActionLinkTarget = {
  kind: 'action';
  actionId: string;
  params?: Record<string, unknown>;
};
```

At runtime, resolve it through the portal:

```ts
await portal?.requestAction(target.actionId, target.params);
```

Never persist a resolved URL when an action is intended — the action
contract may change platform-side, the persisted ID won't.

---

## Anti-patterns

❌ Calling `navigator.share` / `clipboard.writeText` directly from a
   sub-app when `__share` / `__copyLink` exist — you lose host-level
   error handling and capability negotiation.

❌ Re-implementing logout by clearing your own state. Always go through
   `__logout` (or `useAuth().logout()` in-tree) so the whole portal
   session ends cleanly.

❌ Hard-coding action IDs the host might not support. Probe
   `getAvailableActions()` or the capabilities postMessage first.

❌ Reusing a single `requestId` across postMessage calls.

❌ Not awaiting the result of capture-mode scanner actions. The promise
   stays pending until the user scans or cancels — fire and forget will
   leak the listener.
