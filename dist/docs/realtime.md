# SmartLinks Realtime

Live updates for apps: a big screen showing the raffle draw, an admin list that updates as records
arrive, a menu that refreshes when an app is installed. **No provider library, no keys, no channel
strings in your app.** SmartLinks hands out a stream for exactly what the viewer may see, and messages
you send go through SmartLinks, which checks the channel's rule.

There are two kinds of realtime.

| | What it is | Use it for |
|---|---|---|
| **Change events** | "this changed, here's its id": ids only, never data | refetching a list or a record when it changes |
| **App channels** | messages your app sends, on channels it declares | a draw result, a live status, a chat line |

## Change events: refetch when something changes

```ts
import { realtime } from '@proveanything/smartlinks'

// Refetch the raffle's entries whenever one is added, changed or removed.
const off = realtime.onChange(
  { collectionId },
  { type: 'record', appId: 'quickRaffle', recordType: `entry:${raffleId}` },
  () => refetchEntries(),
)
// …later
off()
```

- **Types:** `product`, `proof`, `asset`, `record`, `collection`, `collection.apps` (an app was
  installed, removed or switched), `settings`.
- **Filter fields:** `type`, `id`, `appId`, `recordType`, `productId`, `proofId`. Every field you give
  must match.
- **Who hears what:**
  - a collection's **admins** hear every change;
  - **everyone else** hears changes to public things (public app records, products).
- **A change carries ids, never data.** Refetch through the normal API, which applies the normal
  permissions, so realtime can never show someone data they couldn't read anyway.

With React Query, invalidate on change:

```ts
useEffect(() => realtime.onChange({ collectionId }, { type: 'record', appId }, () => {
  queryClient.invalidateQueries({ queryKey: ['records', appId] })
}), [collectionId, appId])
```

## App channels: declare them, then subscribe and publish

**1. Declare** each channel in `app.manifest.json`, with who may listen and who may send:

```json
"realtime": {
  "channels": [
    { "name": "draw",  "subscribe": "public",   "publish": "admin"  },
    { "name": "chat",  "subscribe": "signedIn", "publish": "signedIn" },
    { "name": "result","subscribe": "public",   "publish": "server" }
  ]
}
```

| Level | Who |
|---|---|
| `public` | anyone, signed in or not: a big screen, a kiosk |
| `signedIn` | anyone signed in |
| `admin` | the collection's admins |
| `server` (publish only) | only your app's server functions: the authoritative way to announce a result |

- **Names:** lowercase letters, numbers, `-` and `_`, up to 40 characters.
- **Defaults:** if a level is left out, `subscribe` defaults to `admin` and `publish` to `server`.
- **Undeclared channels don't exist,** and anything sent to them is refused.

**2. Subscribe and publish** from your app:

```ts
const draw = realtime.channel({ collectionId, appId }, 'draw')

const off = draw.subscribe('status', (msg) => setStatus(msg.data))   // or '*' for every event
await draw.publish('status', { phase: 'spinning' })                  // 403 unless the rule allows it
```

**3. From a server function**, publish to any of your declared channels. This needs the
`sl:realtime:write` capability:

```ts
await ctx.sl.realtime.publish('result', 'winner', { number: 42 })
```

Messages are limited to 32 KB. Keep them small: send ids and status, and let clients fetch the rest.

## Messages for one person

`realtime.onMine({ collectionId }, (msg) => …)` hears messages meant only for the signed-in person. For
example, `scan`: a tag they just scanned with Sidekick on another device.

## How it behaves

- **One connection per page** (per collection and app), shared by everything listening. It opens with the
  first listener and closes after the last.
- **It reconnects on its own** and renews its access before it expires.
- **Anonymous viewers** get public channels only. That's enough for a big screen, with no polling.
- **Outside a browser** (SSR, tests) there's no stream: listeners simply never fire.
- **Delivery is best effort.** A message sent while a viewer was offline isn't replayed, so on
  reconnect, refetch what you show.

## Don't

- **Don't add a realtime provider's library or put an API key in your app.** Apps never talk to the
  provider directly. A key in a bundle is a key for everyone.
- **Don't announce authoritative results from the browser.** Use a `server` channel and publish from a
  server function.
- **Don't put personal data in messages.** Publish an id; fetch the details with permissions.

## Legacy

`realtime.getPublicToken()` and `realtime.getAdminToken()` return raw provider tokens for the old
`collection:{id}:*` and `interaction:{uid}` channels. They still work, but publishing is now limited to
the collection's admins. Move to `channel` / `onChange` / `onMine`.
