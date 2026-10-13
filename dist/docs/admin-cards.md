# Admin cards

Cards your app adds to a collection's **dashboard** in SmartLinks Studio — the first thing an admin
sees. "3 new enquiries", "2 questions waiting for an answer", "Your site is live", with a button
straight into your app's admin.

- **Data cards** (the default, any app): you declare the card and an **admin server function** that
  returns a small JSON payload. Studio draws it — a consistent look, no app code in Studio.
- **Component cards** (first-party and approved publishers): a React component from your app's
  `adminCards` bundle, for things a data card can't show (charts, inline edits). It gets the same
  cached payload as its `data` prop.

## Fast by construction

Dashboards that load 20 widgets × 50 calls on every visit are the thing to avoid. So:

1. **One request per dashboard.** Studio calls `adminCards.list(collectionId)` once and gets every
   card back — never one request per card.
2. **Served from a cache.** A card's last payload is kept and shown immediately. On a warm dashboard
   **no card function runs at all.**
3. **Recomputed only when its data changed.** You declare what the card depends on in
   `refresh.on`; when one of those changes (any write through SmartLinks), the card is marked stale and
   recomputed **in the background** the next time someone looks. The new payload arrives over
   SmartLinks Realtime as a `cards` change. Your FAQ count is recounted when an FAQ changes, not on
   every login.
4. **Budgets.** A card function gets about **2 seconds** and **8KB** of output. A slow or failing card
   shows its last payload marked as updating / couldn't refresh — it never holds up the page.

Keep card functions to one cheap query. If a number is expensive (a big aggregate), keep it up to date
yourself as data changes and have the card function read it.

## Declare a card

In `app.manifest.json`:

```json
"adminCards": {
  "cards": [
    {
      "id": "unanswered",
      "title": "FAQ",
      "description": "Questions waiting for an answer",
      "function": "cardUnanswered",
      "sizes": ["small", "medium"],
      "priority": 40,
      "refresh": { "on": ["records:question"], "maxAge": "1d" }
    }
  ]
},
"functions": {
  "files": { "js": { "umd": "functions.umd.js", "esm": "functions.es.js" } },
  "definitions": [
    { "name": "cardUnanswered", "trigger": { "type": "http" }, "visibility": "admin",
      "authority": "collection", "capabilities": ["sl:records:read"] }
  ]
}
```

| Field | |
|---|---|
| `id` | Unique in the app (letters, digits, `-`, `_`; up to 40). |
| `title` | The card's heading (the payload can override it). |
| `description` | One line for the "add a card" picker. |
| `kind` | `data` (default) or `component`. |
| `function` | The **admin** http server function returning the payload. Required for data cards. |
| `component` | Component cards: the export name in the `adminCards` bundle. |
| `sizes` | `small` (3/12), `medium` (6/12), `wide` (8/12), `full` (12/12). First = default. Default `["medium"]`. |
| `priority` | Lower first, until the collection arranges its dashboard. Default 100. |
| `refresh.on` | What the data depends on — see below. |
| `refresh.maxAge` | Recompute at least this often: seconds, or `"30m"`, `"6h"`, `"2d"`. Default 6h, minimum 1m. |

### `refresh.on`

| Value | Changes when |
|---|---|
| `records` | Any of **this app's** records is created, updated or deleted |
| `records:<type>` | This app's records of that `recordType` |
| `products` | A product in the collection |
| `proofs` | A proof |
| `assets` | An asset |
| `apps` | The collection's installed apps |
| `collection` | The collection itself |
| `settings` / `settings:<group>` | Any settings group / that one |

Data that changes without an event (visit counts, "due this week") — use `maxAge` only.

## Return the payload

The function returns an `AdminCardPayload` — every field optional; return what the card needs:

```ts
import type { AdminCardPayload } from '@proveanything/smartlinks'

export async function cardUnanswered(ctx): Promise<AdminCardPayload> {
  // One query: the newest 3 open questions, plus the total.
  const open = await ctx.sl.appRecords.query({ recordType: 'question', status: 'open', limit: 3, sort: '-createdAt' })
  const total = open.pagination.total ?? open.data.length
  if (!total) return { value: 0, label: 'questions waiting', status: { tone: 'ok', text: 'All answered' } }
  return {
    value: total,
    label: total === 1 ? 'question waiting' : 'questions waiting',
    status: { tone: 'attention', text: 'Answer them so they show on your site' },
    items: open.data.map((q) => ({ title: q.data.question, meta: q.createdAt, path: `/questions/${q.id}` })),
    todo: [{ text: `Answer ${total} FAQ question${total === 1 ? '' : 's'}`, action: { label: 'Answer', path: '/questions?status=open' } }],
    actions: [{ label: 'Open FAQ', path: '/' }],
  }
}
```

| Field | Shown as |
|---|---|
| `title` | Heading (overrides the declared title) |
| `value`, `label`, `unit` | The big number/value and its caption |
| `trend` | `{ direction: 'up'\|'down'\|'flat', label?, good? }` — `good` picks the colour |
| `status` | `{ tone: 'ok'\|'attention'\|'neutral'\|'error', text }` — `attention`/`error` also go to the To do strip |
| `progress` | `{ done, total, label? }` — a progress bar |
| `items` | Up to 5 rows `{ title, subtitle?, meta?, path? }` |
| `todo` | `[{ text, action? }]` — collected into the dashboard's To do strip |
| `actions` | Up to 2 buttons `{ label, path? \| url? }` — `path` opens your app's admin at that path |
| `empty` | `{ text, action? }` — shown instead of the body when there's nothing yet |

No HTML, no styling: Studio draws every card the same way, in the collection's theme.

Use **`authority: "collection"`** with read capabilities: a card's payload is cached and shown to every
admin of the collection, so it shouldn't depend on who happened to load it.

## The dashboard and its layout

The layout belongs to the **collection** — every admin sees the same dashboard, set up once (by the
sign-up wizard, or an admin arranging it). It's the `studioHome` settings group:

```json
{ "version": 1, "cards": [ { "key": "faq:unanswered", "size": "small" }, { "key": "platform:products", "hidden": true } ] }
```

Cards not in the layout follow by `priority`, so a newly installed app's cards appear on their own;
an uninstalled app's cards drop out. Save it with `adminCards.saveLayout`.

## Reading the dashboard (hosts)

```ts
import { adminCards, realtime } from '@proveanything/smartlinks'

const { cards, hidden, layout } = await adminCards.list(collectionId)   // display order
realtime.onChange({ collectionId }, { type: 'cards' }, () => reload())  // a card was recomputed
await adminCards.refresh(collectionId, 'faq', 'unanswered')             // the card's refresh button
```

Each card has `state`: `fresh`, `stale` (last payload, a newer one is coming), `pending` (first
computation still running) or `error` (last attempt failed; `payload` is the last good one).

## Component cards

For first-party and approved publishers. Ship an `adminCards` bundle (built like widgets) and declare
it:

```json
"adminCards": {
  "files": { "js": { "umd": "admin-cards.umd.js", "esm": "admin-cards.esm.js" }, "css": "admin-cards.css" },
  "cards": [ { "id": "visits", "title": "Visitors", "kind": "component", "component": "VisitsCard",
               "function": "cardVisits", "sizes": ["wide", "full"], "refresh": { "maxAge": "1h" } } ]
}
```

The component gets `{ collectionId, appId, size, data, SL, openApp(path?), lang }`. Draw from `data`
(the cached payload of its `function`) — don't fetch on mount; that's what keeps the dashboard fast.
`smartlinks-doctor` checks your cards.
