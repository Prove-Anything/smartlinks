# Publishing Auth State to the Portal

> **For sub-app authors.** This guide explains how to broadcast authentication state changes to the portal so the header, account UI, and sibling apps stay in sync.

A SmartLinks micro-app may need to run its own custom authentication flow —
typical cases: an auction app that calls a bidder API, a competition app
that exchanges a magic code for a session, a partner SSO. When that flow
completes the app holds a `token` + `user` of its own, and the **portal**
needs to know about it so the header, the account UI, and every sibling
app pick up the new session.

This doc describes the contract the portal framework already implements.

---

## Container / Widget Apps (Same React Tree)

These run inside the portal's React context and share its `AuthProvider`.
Call `useAuth()` directly:

```tsx
import { useAuth } from '@proveanything/smartlinks-auth-ui';

function BidButton() {
  const { login, logout, isAuthenticated, user } = useAuth();

  async function placeBid() {
    if (!isAuthenticated) {
      // Run your own auth flow…
      const { token, user, expiresAt } = await api.signInBidder(...);
      // Publish to the portal — this is the *only* call you need:
      await login(token, user, { source: 'auction' }, /* isNewUser */ false, expiresAt);
    }
    await api.placeBid(...);
  }

  return <button onClick={placeBid}>Bid</button>;
}
```

`useAuth().login(token, user, accountData?, isNewUser?, expiresAt?)` will:

- Persist the session (cookie/storage as configured).
- Call `setBearerToken(token)` on the SDK so subsequent API calls are
  authenticated.
- Re-render every consumer of `useAuth()` / `useSafeAuth()` —
  including the portal header.

`useAuth().logout()` clears all of the above.

---

## Iframe Apps (Cross-Origin)

Iframe apps don't share React context. Use the SDK's `authKit` helper —
it posts the framework-recognised messages on `window.parent`:

```ts
import { authKit } from '@proveanything/smartlinks';

// After your custom flow succeeds:
await authKit.publishLogin({
  token,                // string — your API's bearer token
  user: {               // mirrors AuthUser
    uid: 'usr_123',
    email: 'bidder@example.com',
    displayName: 'Jane Bidder',
  },
  accountData: { tier: 'gold' }, // optional, free-form
});

// On sign-out:
await authKit.publishLogout();
```

### Raw postMessage (fallback)

If you can't use the helper (e.g. you're outside the SDK), post the raw
messages from the iframe to its parent. The portal's `IframeResponder`
listens for these:

```ts
// LOGIN
window.parent.postMessage({
  _smartlinksIframeMessage: true,
  type: 'smartlinks:authkit:login',
  payload: {
    token: '<bearer>',
    user: { uid: 'usr_123', email: 'bidder@example.com', displayName: 'Jane' },
    accountData: { /* optional */ },
  },
}, '*');

// LOGOUT
window.parent.postMessage({
  _smartlinksIframeMessage: true,
  type: 'smartlinks:authkit:logout',
  payload: {},
}, '*');
```

The portal-framework's `AppIframeRenderer` translates these into:

```ts
PortalAuthProvider.login(token, user, accountData);
// or
PortalAuthProvider.logout();
```

— the **same** call the built-in `AuthModal` makes when the user logs in
through the standard portal UI.

---

## What the Portal Does on Receipt

1. Updates the `IframeResponder` cache so future context syncs carry the
   user.
2. Calls `PortalAuthProvider`'s bridged `login` / `logout`.
3. `setBearerToken` runs against the parent SDK instance — your API
   calls are now authenticated.
4. The portal header avatar swaps in (or out).
5. Every other container/widget/iframe app observes the new session via
   its own `useAuth()` / context-refresh.

---

## Anti-Patterns

❌ Storing your own auth token in `localStorage` and ignoring the portal —
   the user will see a logged-out header above your "logged in" app.

❌ Posting `smartlinks-auth-login` (with a hyphen). The correct event
   name is `smartlinks:authkit:login` (colon-separated, namespaced).

❌ Calling `setBearerToken` directly without notifying the portal —
   your token will work until the portal next refreshes auth, then be
   wiped.

❌ Implementing logout by just clearing your own state. Always call
   `useAuth().logout()` (container/widget) or `authKit.publishLogout()`
   (iframe) so the whole portal session ends cleanly.

---

## Reading the Current Portal Session

You don't need to broadcast just to *read* the session — that comes for
free:

```tsx
// Container / widget apps
import { useAuth } from '@proveanything/smartlinks-auth-ui';
const { user, token, isAuthenticated } = useAuth();
```

```ts
// Iframe apps — the IframeResponder caches the parent's user under
// `cache.user`. Read it via the SDK's standard hooks/helpers.
```
