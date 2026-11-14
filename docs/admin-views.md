# Admin views

An app's **admin views** are its admin screens by name: "the campaigns list", "one campaign", "bookings
for a day". The app declares them once, in `app.manifest.json#adminViews`, and three things read the same
list:

| Reader | What it does with the views |
|---|---|
| **The app's own side menu** | areas (`main`) in order, Settings (`settings`) at the bottom; opening a record swaps in that record's views |
| **Studio's workspace menu** (coming) | lifts an app's areas into the business's own menu, then opens the app with `chrome=none` |
| **The Studio assistant** | opens a view while it talks: "here are Saturday's bookings" |

Admin views are not portal pages (`linkable`, see [deep-link-discovery.md](deep-link-discovery.md)) and
not standalone screens (`publicViews`). They are the admin side only.

Core apps with three or more areas follow prove `server/docs/design/core-app-layout.md`. Their side menu
is built from these views.

---

## Declaring views

```json
"adminViews": [
  { "id": "campaigns", "title": "Campaigns", "path": "/campaigns", "icon": "megaphone",
    "description": "Campaigns: drafts, scheduled and sent, with their results.",
    "params": { "status": "draft | scheduled | sent" } },
  { "id": "campaign", "title": "Campaign", "path": "/campaigns/{campaignId}", "group": "record",
    "within": "campaigns", "params": { "campaignId": "a campaign's id" },
    "description": "One campaign: its message, who it goes to, and how it landed." },
  { "id": "log", "title": "Message log", "path": "/log", "icon": "scroll-text" },
  { "id": "settings", "title": "Settings", "path": "/settings", "icon": "settings", "group": "settings" }
]
```

| Field | Meaning |
|---|---|
| `id` | Stable, unique in the app. Hosts and the assistant keep it, so never reuse one for another screen. |
| `title` | The menu label, in the business's words. |
| `path` | Hash route in the admin page. `{name}` marks a required param. |
| `group` | `main` (default), an area in the menu. `settings`, pinned at the bottom. `record`, a screen inside one record, never in the main menu. |
| `within` | The view this one sits in. A record's first view names its area. The record's other views name the record's first view. |
| `icon` | A [Lucide](https://lucide.dev/icons) name, kebab-case. |
| `description` | One line on what the screen shows. The assistant reads it to choose a view. |
| `params` | Each param, with a few words on what it is. `{name}` params are required; the rest are optional query params. Never list platform context (`collectionId`, `appId`, …). |

**A record with several screens** (a product with details, proofs and variants):

```json
{ "id": "product",          "title": "Details",  "path": "/products/{productId}",          "group": "record", "within": "products" },
{ "id": "product.proofs",   "title": "Proofs",   "path": "/products/{productId}/proofs",   "group": "record", "within": "product" },
{ "id": "product.variants", "title": "Variants", "path": "/products/{productId}/variants", "group": "record", "within": "product" }
```

While a product is open, the menu reads "← Products", then Details, Proofs, Variants.

Declare only screens worth opening by name. A dialog, a step inside a form or a filter state is not a
view; it is a param of one (`status`, `tab`).

---

## Building the menu from them

Import the manifest so there is one list, and use the helpers:

```ts
import * as SL from '@proveanything/smartlinks'
import manifest from '../public/app.manifest.json'

const views = manifest.adminViews as SL.AdminView[]

SL.adminViews.menu(views)                       // { main: [...areas], settings: [...] }
SL.adminViews.match(views, location.pathname)   // { view, params } | null — what screen this is
SL.adminViews.trail(views, 'campaign')          // [campaigns, campaign] — campaigns is the current menu item
SL.adminViews.recordMenu(views, 'campaign')     // { back: campaigns, record, items } — the swapped menu
SL.adminViews.pathFor(views[1], { campaignId }) // '/campaigns/c_1'
```

Route the app by these paths, not by a `?tab=` param. The host keeps the path in its own address
(`?path=`), so a screen survives a reload and can be shared.

---

## Following the host: `smartlinks:navigate`

The host (Studio, the assistant) asks the app to open a screen without reloading it:

```
host → app   { type: 'smartlinks:navigate', view?: 'campaign', params?: { campaignId: 'c_1' }, path?: '/log', highlight?: 'row-id' }
```

Register once, near the router:

```ts
const navigate = useNavigate()
useEffect(() => SL.adminViews.onNavigate(views, (to) => navigate(to.path)), [navigate])
```

- Registering posts `smartlinks:navigable` to the host. A host that never hears it (an older build)
  reloads the frame at the new path instead.
- Only messages from the parent window are taken. A `view` is resolved to its path, and a raw `path`
  must be a hash route of this app.
- After each request the app posts `smartlinks:navigate-result` `{ ok, view, path, reason? }`, so the
  assistant can say when a screen couldn't be opened.
- `highlight` is optional. It is an id the app understands, such as a row to point at; ignore it if you
  have nothing to point at.

Hosts on the SDK use `IframeResponder.navigate(req)`, which returns `false` when the app isn't
navigable. Hosts with their own frame code use `SL.adminViews.postNavigate(frame.contentWindow, req)`.

---

## `chrome=none`: the host carries the menu

When a host's own menu already lists an app's views, it opens the app with `chrome=none`. The app then
hides its side menu and the bar holding its toggle, and shows only the content. The page header
(`AdminPageHeader`) stays: it is content.

```ts
const bare = SL.adminViews.hostChrome() === 'none'
```

`hostChrome()` reads the address the page was first opened at, so the app's own navigation can't lose it.
With `chrome=none` the app moves between areas only when the host says so (`smartlinks:navigate`).
Links inside the content, such as opening a campaign from the list, still work as normal.
