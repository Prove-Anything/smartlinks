# Portal Back Button — "Up" Navigation Inside Sub-Apps

> **For sub-app authors.** Drop this file into the SmartLinks SDK docs (e.g.
> `docs/portal-back-button.md`) and link it from `routing.md` / `mpa.md` so
> microapp authors discover it.

When a sub-app is embedded by a portal shell, the shell renders a top-level
back button. By default that button **exits the app entirely** when tapped —
which is wrong for any app with internal hierarchy (lists → detail, wizards,
etc.).

This document describes the contract for telling the portal where "up" goes
from the current screen, so the top back button performs **hierarchy-aware
"up" navigation** inside your app instead.

---

## Why "up", not "back"

Browser back replays history. If a user navigates **list → item A → list →
item B**, browser back yo-yos:  `B → list → A → list → ...`. That is not what
users expect from an "up arrow" in app chrome.

"Up" navigates the **content hierarchy**:  `B → list → exit app`. It is
single-direction and idempotent. Only your app's router knows the hierarchy,
so the portal can't infer it — your app must declare it.

---

## The Contract

With every `smartlinks-route-change` your app already posts (via
`useDeepLinkSync` or directly), include a `parentPath` field inside `state`:

```ts
window.parent.postMessage({
  type: 'smartlinks-route-change',
  path: '/items/123',
  context: { collectionId: 'auction-2026', appId: 'auction' },
  state: {
    parentPath: '/items',   // ← where "up" goes from /items/123
    // ... your other app state
  },
  appId: 'auction',
}, '*');
```

| `state.parentPath` value | Portal back-button behaviour |
| --- | --- |
| `'/items'` (or any string) | Posts `smartlinks-navigate` to the iframe with that path. App stays mounted. |
| `''` / missing / omitted   | Default: clears the active app and returns to the portal homepage. |

When the portal sends the up-navigation message, your app must respond by
navigating to that path. If you use `useDeepLinkSync` with an SDK release
that includes the inbound `smartlinks-navigate` listener, this is automatic —
otherwise add a listener (see "Receiving the up-message" below).

---

## Recommended sub-app pattern (React Router)

Keep "what's above this route" co-located with your route definitions:

```ts
// routes.ts
const PARENTS: Record<string, (params: any) => string | null> = {
  '/':                () => null,           // home — back exits the app
  '/items':           () => null,           // list — back exits the app
  '/items/:id':       () => '/items',       // detail — back goes to list
  '/items/:id/bid':   ({ id }) => `/items/${id}`,
  '/checkout':        () => '/items',
};

export function getParentPath(pathname: string): string | null {
  // matchPath against PARENTS keys — return parent or null
  // (use react-router's matchPath in your real implementation)
}
```

```tsx
// App.tsx
import { useDeepLinkSync } from '@/hooks/useDeepLinkSync';
import { getParentPath } from './routes';

function App() {
  useDeepLinkSync({
    getParentPath: ({ pathname }) => getParentPath(pathname),
  });
  // ...
}
```

If your app does not use `useDeepLinkSync`, post the message yourself:

```ts
useEffect(() => {
  if (window.parent === window) return;
  window.parent.postMessage({
    type: 'smartlinks-route-change',
    path: location.pathname,
    context: { /* ... */ },
    state: { parentPath: getParentPath(location.pathname) ?? '' },
  }, '*');
}, [location.pathname]);
```

---

## Receiving the up-message (`smartlinks-navigate`)

When the portal back button consumes a `parentPath`, it posts:

```ts
{
  type: 'smartlinks-navigate',
  appId: 'auction',
  path: '/items',
  params: {},
  target: '_self',
}
```

Your app must listen for this and route accordingly. A minimal hook:

```ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useParentNavigation() {
  const navigate = useNavigate();
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== 'smartlinks-navigate') return;
      if (typeof e.data.path !== 'string') return;
      navigate(e.data.path);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate]);
}
```

---

## Reference: Updated `RouteChangeMessage`

`state` is an open `Record<string, string>` — `parentPath` is a recognised
optional convention; everything else flows through unchanged.

```ts
interface RouteChangeMessage {
  type: 'smartlinks-route-change';
  path: string;
  context: Record<string, string>;
  state: Record<string, string> & {
    /**
     * Optional. The "up" target from the current screen. When present, the
     * portal's top back button posts smartlinks-navigate with this path
     * instead of exiting the app. Empty / missing → exits the app.
     */
    parentPath?: string;
  };
  appId?: string;
}
```

No breaking change: existing apps that don't emit `parentPath` keep today's
behaviour (one tap of the portal back exits the app).

---

## FAQ

**Q: Do I need to push every query-param change as a navigation step?**
No. `parentPath` is hierarchy, not history. A filter toggle, a tab switch,
or a modal open on the same screen should keep the same `parentPath`.

**Q: What if my "up" leaves the app?**
Set `parentPath` to `''` (or omit it). The portal will exit the app on back.

**Q: Can I disable the portal back button on certain screens?**
Not directly via this protocol. Use the existing portal `homeScope: 'entry'`
mechanism if you need the entire portal back button suppressed.

**Q: What about the in-app back button I already render?**
Keep it if you want — they're not mutually exclusive. The portal back is
chrome; an in-content back is content. Many apps will only need one.
