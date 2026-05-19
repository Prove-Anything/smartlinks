# Requesting Login from the Portal

This is the **recommended** way for a micro-app to get a logged-in user. The
sub-app does not render any auth UI of its own — it asks the portal to run
its standard AuthKit flow and awaits a result. The portal owns the modal,
WhatsApp / OAuth / magic-link redirects, session persistence, and the
header avatar swap.

Use `requestLogin` whenever the answer to "what do I want?" is simply
*"a logged-in user before I continue"*. Only fall back to
[publishing your own session](./portal-auth-broadcast.md) when the app runs
a genuinely custom auth flow (e.g. its own bidder API).

---

## Why this exists

Historically every sub-app imported `@proveanything/smartlinks-auth-ui` and
rendered its own login modal. That meant:

- Two React copies of `AuthContext` could exist at once → silent session
  desync between the header and the sub-app.
- Each app re-implemented the same WhatsApp / OAuth / magic-link flow.
- Redirect bounces would land back on the portal with no memory of which
  sub-app had triggered the login.

The portal now owns the entire flow. Sub-apps just declare intent.

---

## Container / Widget Apps (Same React Tree)

These share the portal's React context. Use `useSafeAuth()` from the
portal framework:

```tsx
import { useSafeAuth } from '@proveanything/portal-framework';

function PlaceBidButton() {
  const auth = useSafeAuth();

  async function onClick() {
    const result = await auth?.requestLogin?.({ reason: 'bid' });
    if (result?.status === 'success' || result?.status === 'already-authenticated') {
      // auth.user / auth.token are now populated.
      await api.placeBid(...);
    }
    // 'cancelled' → user dismissed the modal.
    // 'unavailable' → portal has no AuthKit configured.
  }

  return <button onClick={onClick}>Place bid</button>;
}
```

`requestLogin` is also exposed as `useAuthRequest().requestLogin` if you
prefer a dedicated hook, but the folded `useSafeAuth()` shape is preferred
so callers have one entry point for both session reads and login intent.

### Options

```ts
auth.requestLogin({
  reason?: string,                       // analytics / copy hint
  mode?: 'login' | 'signup' | 'either',  // default 'either'
  signupProminence?: SignupProminence,   // overrides modal default
  resolveIfAuthenticated?: boolean,      // default true
});
```

| Option | Default | Effect |
|---|---|---|
| `reason` | — | Free-form tag. Surfaced to analytics; some templates use it for copy. |
| `mode` | `'either'` | `'signup'` biases the modal to the registration tab. |
| `signupProminence` | portal default | One of `'minimal' | 'balanced' | 'emphasized'`. |
| `resolveIfAuthenticated` | `true` | When already logged in, resolve immediately without showing the modal. Set `false` to force a fresh prompt (e.g. re-auth before a sensitive action). |

### Result

```ts
type LoginRequestResult = {
  status: 'success' | 'already-authenticated' | 'cancelled' | 'unavailable';
  user?:  PortalAuthBridgeUser | null;
  token?: string | null;
};
```

- `success` — fresh login completed inside the modal.
- `already-authenticated` — there was already a session; nothing was shown.
- `cancelled` — user dismissed the modal without logging in.
- `unavailable` — no AuthKit is configured on this portal. Treat as
  not-logged-in and surface an appropriate message; the user cannot log
  in from this portal at all.

---

## Iframe Apps (Cross-Origin)

Iframe apps don't share React context with the portal. They post a request
message and listen for a single correlated reply:

```ts
const requestId = crypto.randomUUID();

window.addEventListener('message', function handler(ev) {
  const d = ev.data;
  if (!d || d._smartlinksIframeMessage !== true) return;
  if (d.type !== 'smartlinks:authkit:login-result') return;
  if (d.payload?.requestId !== requestId) return;
  window.removeEventListener('message', handler);

  const { status, user, token } = d.payload;
  if (status === 'success' || status === 'already-authenticated') {
    // user + token populated — resume the action that needed auth
    placeBid();
  }
});

window.parent.postMessage({
  _smartlinksIframeMessage: true,
  type: 'smartlinks:authkit:request-login',
  payload: {
    requestId,
    reason: 'bid',
    mode: 'either',
    resolveIfAuthenticated: true,
  },
}, '*');
```

The portal opens its modal, runs the standard AuthKit flow (including any
WhatsApp / OAuth / magic-link redirect bounces), then posts exactly one
`login-result` back with the same `requestId`.

### Message contract

**Request — child → parent**

```ts
{
  _smartlinksIframeMessage: true,
  type: 'smartlinks:authkit:request-login',
  payload: {
    requestId: string,             // generate per request; echoed in the reply
    reason?: string,
    mode?: 'login' | 'signup' | 'either',
    signupProminence?: 'minimal' | 'balanced' | 'emphasized',
    resolveIfAuthenticated?: boolean,
  }
}
```

**Reply — parent → child**

```ts
{
  _smartlinksIframeMessage: true,
  type: 'smartlinks:authkit:login-result',
  payload: {
    requestId: string,             // matches the request
    status: 'success' | 'already-authenticated' | 'cancelled' | 'unavailable',
    user?:  { uid, email?, displayName?, photoURL?, phoneNumber?, accountData? } | null,
    token?: string | null,
  }
}
```

Only one reply is sent per `requestId`. Stacking multiple request-logins
cancels prior pending requests — they receive `status: 'cancelled'`.

---

## Redirect-Bounce Flows (WhatsApp, OAuth, Magic Link)

These are handled **inside the portal's AuthModal by AuthKit itself** —
your iframe stays mounted at the same URL throughout. There is no
sub-app state restoration to wire up; the modal closes when the redirect
resolves and the portal posts back your `login-result`.

If you have a sub-app that lives on a route the user navigates away from
during the redirect, snapshot whatever you need into your own
`sessionStorage` before calling `requestLogin`, the same as for any other
async UX. The portal does not (yet) snapshot sub-app state on your behalf.

---

## Reading the Current Session

You don't need to call `requestLogin` just to read the current session —
that comes for free:

```tsx
// Container / widget
import { useSafeAuth } from '@proveanything/portal-framework';
const { user, token, isAuthenticated } = useSafeAuth() ?? {};
```

```ts
// Iframe — the IframeResponder caches the parent's user under `cache.user`.
// Read via the SDK's standard hooks/helpers.
```

---

## Anti-Patterns

❌ Sub-apps importing `@proveanything/smartlinks-auth-ui` and rendering
   their own `<SmartlinksAuthUI />` modal. This is what `requestLogin`
   replaces — duplicate React contexts cause silent header desync.

❌ Posting `request-login` and then also opening a local fallback modal.
   Pick one; the portal modal is canonical.

❌ Reusing a single `requestId` across multiple calls. Generate a new ID
   per request so replies can be correlated unambiguously.

❌ Treating `unavailable` as an error to retry. It means the portal has no
   AuthKit configured — surface a "login isn't available here" message.

❌ Setting `resolveIfAuthenticated: false` for normal "gate this action"
   use cases — you'll re-prompt logged-in users for no reason. Only use
   it for genuine step-up auth.

---

## Relationship to `portal-auth-broadcast.md`

| Concern | Use |
|---|---|
| "Log the user in so I can call my API" | **`requestLogin`** (this doc) |
| "I ran my own custom auth flow, here's the resulting session" | [`portal-auth-broadcast.md`](./portal-auth-broadcast.md) |
| "Log the user out of the whole portal" | `useAuth().logout()` (container/widget) or `smartlinks:authkit:logout` postMessage (iframe) |

Both flows ultimately drive the same `PortalAuthProvider.login` /
`logout` calls and produce the same observable side effects (header
avatar, `useAuth()` re-render, `setBearerToken` on the SDK).
