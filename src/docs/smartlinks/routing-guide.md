# Routing Guide — SmartLinks Container Mode

> **Scope:** How deep-link parameters flow from the parent platform into container
> components, and how `PublicPage` should resolve them in a way that works in
> every rendering mode.

---

## Table of Contents

- [Background: Two Rendering Modes](#background-two-rendering-modes)
- [What Are dlParams?](#what-are-dlparams)
- [How dlParams Flow in Container Mode](#how-dlparams-flow-in-container-mode)
- [Declaring App-Specific Props on SmartLinksContainerProps](#declaring-app-specific-props-on-smartlinkscontainerprops)
- [PublicPage Priority Order](#publicpage-priority-order)
- [Reference Implementation](#reference-implementation)
  - [SmartLinksContainerProps Example](#smartlinkscontainerprops-example)
  - [useDeepLinkParam Helper Hook](#usedeeplinkparam-helper-hook)
  - [PublicPage Pattern](#publicpage-pattern)
  - [PublicContainer Wiring](#publiccontainer-wiring)
- [Iframe Mode Fallback](#iframe-mode-fallback)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Related Documentation](#related-documentation)

---

## Background: Two Rendering Modes

Every SmartLinks app runs in one of two modes:

| Mode | Description | Who owns the URL bar? |
|------|-------------|----------------------|
| **Direct component** (container mode) | The app is mounted as a React component inside the parent platform's React tree, wrapped in a `MemoryRouter` by the framework. | The **parent platform** — the app's URL never changes. |
| **Iframe** | The app runs as a standalone page inside an `<iframe>`. The app owns its own `HashRouter`. | The **app** — params arrive via `window.location`. |

Because the browser URL bar belongs to the parent in container mode, the app
**cannot** read its own parameters from `window.location` or rely on the full
URL.  Instead, the parent passes all context as **React props**.

---

## What Are dlParams?

`dlParams` (deep-link parameters) are the app-specific payload attached to a
deep link — typically encoded in a QR code, NFC tag, or shared URL.

Example: a loyalty/cashback app might generate a deep link that pre-selects a
withdrawal amount for the user:

```
https://portal.example.com/scan?tag=abc123&dlParams=eyJwcmVzZWxlY3RlZEFtb3VudCI6IjUwIn0=
```

The base64 payload decodes to:

```json
{ "preselectedAmount": "50" }
```

The parent platform is responsible for:

1. Parsing the `dlParams` query string or NFC record.
2. Base64-decoding and JSON-parsing the payload.
3. Forwarding each key as a named React prop to the container.

---

## How dlParams Flow in Container Mode

```
QR / NFC / Shared URL
  └─ Parent platform reads ?dlParams=...
       └─ JSON.parse(atob(raw))
            └─ { preselectedAmount: "50", ... }
                 └─ <PublicContainer
                        collectionId="..."
                        preselectedAmount="50"   ← direct prop
                    />
                      └─ <AppContext.Provider value={props}>
                               └─ <PublicPage preselectedAmount="50" />
```

Key points:

- The parent **never** appends dlParams to the browser URL bar.
- Each decoded key arrives as an **explicit named prop** on the container.
- `PublicPage` reads the prop value directly — no URL parsing needed in this
  path.

---

## Declaring App-Specific Props on SmartLinksContainerProps

App-specific deep-link parameters must be declared explicitly on
`SmartLinksContainerProps` (located in `src/containers/types.ts`).  This
provides TypeScript safety, documents the contract with the parent platform,
and makes the dual-mode fallback pattern unambiguous.

```ts
// src/containers/types.ts
import type { SmartLinksWidgetProps } from '../types'

export interface SmartLinksContainerProps extends SmartLinksWidgetProps {
  className?: string
  initialPath?: string

  // ─── App-specific deep-link parameters ───────────────────────────────────
  // Each key corresponds to a field in the dlParams JSON payload decoded by
  // the parent platform.  Use `string` for cross-mode URL compatibility.

  /**
   * Pre-selects a withdrawal / spend amount on the redemption page.
   * Decoded from `dlParams.preselectedAmount` by the parent platform.
   *
   * In iframe mode the equivalent URL param is `?preselectedAmount=<n>`.
   */
  preselectedAmount?: string
}
```

**Rules:**

- Use `string` (not `number` / `boolean`) for all dlParam props — URL search
  params are always strings, so keeping the same type avoids coercion bugs in
  the fallback paths.
- Add a JSDoc comment that names the `dlParams` key so the contract is explicit.
- Document the equivalent URL search param name for iframe-mode callers.

---

## PublicPage Priority Order

`PublicPage` (and any page that consumes a deep-link parameter) must resolve
values with this fixed priority so the component behaves correctly in all
rendering modes:

```
Priority 1 — React prop
  The parent platform decoded dlParams and forwarded the value directly.
  This is the normal path in container/direct-component mode.

Priority 2 — React Router search param (useSearchParams)
  Available inside the framework-provided MemoryRouter.
  Used when the container navigates internally with ?param=value.

Priority 3 — Raw window.location search param
  Fallback for true iframe mode where the app owns the HashRouter.
```

Any page that skips Priority 1 will appear broken in container mode because
`window.location` and `useSearchParams` both return empty values when the
parent platform hasn't reflected the params into the URL.

---

## Reference Implementation

### SmartLinksContainerProps Example

```ts
// src/containers/types.ts
export interface SmartLinksContainerProps extends SmartLinksWidgetProps {
  className?: string
  initialPath?: string

  /** Decoded from dlParams.preselectedAmount */
  preselectedAmount?: string
  /** Decoded from dlParams.voucherId */
  voucherId?: string
}
```

---

### useDeepLinkParam Helper Hook

Create a reusable hook that encapsulates the three-tier fallback:

```ts
// src/hooks/useDeepLinkParam.ts
import { useSearchParams } from 'react-router-dom'

/**
 * Resolves a deep-link parameter with the correct priority order for both
 * container mode and iframe mode:
 *
 *   1. prop value (container mode — parent decoded dlParams)
 *   2. React Router search param inside MemoryRouter
 *   3. Raw window.location search param (iframe mode fallback)
 */
export function useDeepLinkParam(
  key: string,
  propValue: string | undefined,
): string | undefined {
  const [searchParams] = useSearchParams()
  return (
    propValue ??
    searchParams.get(key) ??
    new URLSearchParams(window.location.search).get(key) ??
    undefined
  )
}
```

---

### PublicPage Pattern

```tsx
// src/pages/PublicPage.tsx
import { useAppContext } from '@/hooks/useAppContext'
import { useDeepLinkParam } from '@/hooks/useDeepLinkParam'

export function PublicPage() {
  // Core context — works in both modes via useAppContext
  const { collectionId, productId, SL } = useAppContext()

  // App-specific deep-link param — props first, then URL fallbacks
  const preselectedAmount = useDeepLinkParam(
    'preselectedAmount',
    (useAppContext() as any).preselectedAmount,   // prop from container
  )

  return (
    <RedemptionView
      collectionId={collectionId}
      preselectedAmount={preselectedAmount}
    />
  )
}
```

If you expose the full `SmartLinksContainerProps` through `AppContext`, the
hook call becomes simpler:

```tsx
// Preferred: context carries typed container props
const { collectionId, preselectedAmount: preselectedAmountProp } = useAppContext()
const preselectedAmount = useDeepLinkParam('preselectedAmount', preselectedAmountProp)
```

---

### PublicContainer Wiring

The container's exported component passes all props (including dlParam props)
into `AppContext`:

```tsx
// src/containers/PublicContainer.tsx
import { Routes, Route } from 'react-router-dom'
import { AppContext } from '@/hooks/useAppContext'
import type { SmartLinksContainerProps } from './types'
import { PublicPage } from '@/pages/PublicPage'

/**
 * Full-app container.  The framework wraps this in a MemoryRouter — do NOT
 * add a Router wrapper here.
 *
 * All SmartLinksContainerProps (including decoded dlParam props such as
 * `preselectedAmount`) are forwarded into AppContext so that every page in
 * the tree can read them via `useAppContext()` without prop-drilling.
 */
export const PublicContainer = (props: SmartLinksContainerProps) => {
  return (
    <AppContext.Provider value={props}>
      <Routes>
        <Route path="/" element={<PublicPage />} />
      </Routes>
    </AppContext.Provider>
  )
}
```

---

## Iframe Mode Fallback

When the app runs inside an `<iframe>`, the parent cannot pass React props.
The parent platform therefore:

1. Appends each decoded dlParam to the iframe's `src` URL:
   `?collectionId=...&preselectedAmount=50`
2. Your app's `HashRouter` entry point receives the full URL.
3. `useDeepLinkParam` falls through to Priority 2 (`useSearchParams`) or
   Priority 3 (`window.location.search`) and finds the value there.

No changes to `PublicPage` are needed to support this path — the three-tier
fallback in `useDeepLinkParam` handles it automatically.

```
Iframe mode URL:
  https://app.example.com/index.html?collectionId=abc&preselectedAmount=50#/

  App.tsx  ──►  HashRouter
                  └─ PublicPage
                       └─ useDeepLinkParam('preselectedAmount', undefined)
                            ├─ propValue:     undefined  (no container props)
                            ├─ searchParams:  "50"       ✅ resolves here
                            └─ window.location: "50"     (also available)
```

---

## Anti-Patterns to Avoid

### ❌ Reading dlParams only from URL

```tsx
// WRONG — breaks in container mode
const [searchParams] = useSearchParams()
const amount = searchParams.get('preselectedAmount')  // always undefined in container mode
```

**Fix:** Use `useDeepLinkParam` with the prop value as Priority 1.

---

### ❌ Undeclared dlParam props (using `Record<string, any>`)

```tsx
// WRONG — no type safety, no discoverability
export const PublicContainer = (props: Record<string, any>) => { ... }
```

**Fix:** Use the typed `SmartLinksContainerProps` interface and declare each
dlParam prop explicitly.

---

### ❌ Reading from window.location only

```tsx
// WRONG — breaks in container mode (window.location is the parent's URL)
const amount = new URLSearchParams(window.location.search).get('preselectedAmount')
```

**Fix:** Use `useDeepLinkParam` which checks props and `useSearchParams` first.

---

### ❌ Adding a Router wrapper to PublicContainer

```tsx
// WRONG — framework already wraps in MemoryRouter
export const PublicContainer = (props) => (
  <MemoryRouter>          {/* ❌ causes "Router inside Router" error */}
    <Routes>...</Routes>
  </MemoryRouter>
)
```

**Fix:** Remove the `<MemoryRouter>` — your component should only contain
`<Routes>` and `<Route>` elements.

---

## Related Documentation

- [containers.md](../containers.md) — Container architecture, props reference, and build config
- [building-react-components.md](../building-react-components.md) — Dual-mode rendering contract, `useAppContext` pattern
- [deep-link-discovery.md](../deep-link-discovery.md) — Registering linkable app states; `dlParams` schema
- [mpa.md](../mpa.md) — Multi-page app structure; `PublicPage` entry point location
