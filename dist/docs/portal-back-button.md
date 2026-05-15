# Portal Back Button

> **For sub-app authors.** This guide explains how to make the portal's top back button behave like hierarchy-aware "up" navigation inside an embedded app.

When a SmartLinks app is embedded inside the portal shell, the shell can render a top-level back button. By default that button exits the app entirely. That is correct for flat screens, but wrong for apps with internal hierarchy such as lists, detail pages, wizards, or nested checkout flows.

This document describes the contract for telling the portal where "up" goes from the current screen so the shell can keep the app mounted and route to the correct parent screen instead of leaving the embed.

## Why "up", not browser back

Browser back replays history. If a user navigates `list -> item A -> list -> item B`, browser back can yo-yo between detail and list screens in a way that feels wrong for an app chrome back button.

"Up" navigates the content hierarchy instead: `item B -> list -> exit app`. It is single-direction and idempotent. Only your app's router knows that hierarchy, so the portal cannot infer it on its own.

## The contract

When your app posts `smartlinks-route-change` messages, include a `parentPath` field inside `state` for the current screen:

```ts
window.parent.postMessage({
  type: 'smartlinks-route-change',
  path: '/items/123',
  context: { collectionId: 'auction-2026', appId: 'auction' },
  state: {
    parentPath: '/items',
  },
  appId: 'auction',
}, '*');
```

| `state.parentPath` value | Portal back-button behaviour |
| --- | --- |
| `'/items'` (or any string) | The portal posts `smartlinks-navigate` to the iframe with that path and keeps the app mounted. |
| `''`, missing, or omitted | The portal falls back to the default behaviour and exits the app. |

The portal only uses `parentPath` when it is present on the current route. Query-string changes, tab switches, and modal state should keep the same parent path.

## Recommended pattern

Keep the hierarchy mapping close to your route definitions:

```ts
const PARENTS: Record<string, (params: any) => string | null> = {
  '/': () => null,
  '/items': () => null,
  '/items/:id': () => '/items',
  '/items/:id/bid': ({ id }) => `/items/${id}`,
  '/checkout': () => '/items',
};

export function getParentPath(pathname: string): string | null {
  // Use your router's path matching here and return the parent route.
  return null;
}
```

Then emit `parentPath` whenever the route changes:

```ts
useDeepLinkSync({
  getParentPath: ({ pathname }) => getParentPath(pathname),
});
```

If you do not use `useDeepLinkSync`, post the message yourself and include `parentPath` in `state`.

## Receiving the up-message

When the portal consumes `parentPath`, it posts `smartlinks-navigate` back to the iframe:

```ts
{
  type: 'smartlinks-navigate',
  appId: 'auction',
  path: '/items',
  params: {},
  target: '_self',
}
```

Your app should listen for that message and route accordingly. If your SDK release already includes the inbound `smartlinks-navigate` listener, this can be automatic; otherwise add a small `message` listener and call your router manually.

## Reference

`state` remains a general `Record<string, string>`. `parentPath` is a recognised optional convention, not a breaking protocol change.

## FAQ

**Do I need to push every query-param change as a navigation step?** No. `parentPath` is hierarchy, not history.

**What if my up target leaves the app?** Set `parentPath` to `''` or omit it.

**Can I disable the portal back button on certain screens?** Not via this protocol. Use the existing `homeScope: 'entry'` portal behaviour if you need the shell back button suppressed.

**What about an in-app back button?** Keep it if you want. The portal back is shell chrome; an in-content back is part of the app UI.
