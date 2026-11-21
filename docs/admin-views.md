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

## Opening another app: `smartlinks:open-app`

Apps link to each other's screens. Some examples:
- Messages opens a person in the CRM.
- The CRM opens that person's messages.
- A message about a booking opens the booking.

```ts
SL.adminViews.openApp({ appId: 'crm', view: 'contact', params: { contactId } })
// app → host   { type: 'smartlinks:open-app', payload: { appId, view?, params?, path? } }
```

- **How the host resolves it.** Studio reads that app's published manifest `adminViews`, fills the
  view's path from `params`, and opens the app there. The other app doesn't need any particular SDK,
  only declared views.
- **Fallbacks.** An unknown view, or an app without views, opens at its start. A raw `path` (a hash
  route of that app) is used as given.
- **Only that collection's apps.** The host opens only apps installed in, or core to, the collection
  it is showing.
- **Name the views you link to** in your docs (`crm: contact`, `messages: log` with `contact`), and
  keep their ids stable: other apps use them.

## Opening the platform's screens: `open` by name

Your admin screens sit inside Studio, next to the platform's own screens. **Link to them; don't copy them.**
To message someone, open the Messages composer. To show a person, open their contact. Don't build your own
email pop-up, contact page or message log.

```ts
// Message this person, tied to the booking: it is logged against the booking and links back to it
SL.adminViews.open('message.compose', {
  contactId,
  about: { type: 'booking', id: bookingId, view: 'booking', params: { bookingId }, label: 'Sat 3pm' },
})
SL.adminViews.open('contact', { contactId })            // the person, in Customers
SL.adminViews.open('contact.messages', { contactId })   // everything sent to them
SL.adminViews.open('settings.domain')                   // a Studio settings page
```

You name **what** to open, never which app has it. Studio decides that, so your link keeps working if
the screen moves to another app. `open` resolves with `{ ok, reason? }`:

| `reason` | Meaning |
|---|---|
| `no-host` | Not inside Studio (the admin page opened on its own) |
| `not-here` | That screen's app isn't on in this business |
| `unknown` | Studio doesn't know the name |
| `missing-param` | A required param is missing |
| `preview` | Forge preview: it showed what would open instead |

### Ask first: `canOpen`

```ts
const canMessage = await SL.adminViews.canOpen('message.compose')
// SL.adminViews.available() → ['contact', 'message.compose', 'settings.domain', …]
```

- If it's `false`, hide the button, or tell the owner what to switch on ("Switch on Messages to send
  messages").
- Build your own version only when the platform has nothing for it.
- `canOpen` answers at once inside Studio. With no host, it answers `false` after a short wait.

### The names

| Name | Params (**required**) | Opens |
|---|---|---|
| `contacts` | | The contacts list (Customers) |
| `contact` | **contactId** | One contact |
| `contact.messages` | **contactId** | The Message log for that person |
| `conversation` | **conversationId** | One conversation (Messages) |
| `segment` | **segmentId** | One segment (Customers) |
| `contact.conversations` | **contactId** | Their conversations in the Inbox (Messages) |
| `loyalty.scheme` | **schemeId** | One loyalty scheme (Customers) |
| `message.compose` | contactId, about | The composer, to that person (or choose who) |
| `message.log` | contactId, about | The Message log, filtered |
| `campaign.new` | segmentId | A new campaign to that segment |
| `campaign` | **campaignId** | One campaign |
| `templates` | | The email and message templates |
| `template` | **templateId** | One template in the editor |
| `product` | **productId** | One product (Items) |
| `proof` | **productId**, **proofId** | One item of a product |
| `interaction.type` | **interactionId** | One interaction type (Customers) |
| `batch` | **productId**, **batchId** | One batch of a product |
| `variant` | **productId**, **variantId** | One variant of a product |
| `lot` | **lotId** | One lot |
| `tags` | | The tags and codes on items |
| `print` | **productId**, proofId | Print labels and QR codes for a product, or one item |
| `form` | **formId** | One form, open to edit |
| `assets` | | The asset register: what the business owns (Assets) |
| `asset` · `asset.history` | **productId** (its type), **proofId** | One asset, or its history |
| `places` | | Where assets are kept |
| `settings` | | Studio → Settings |
| `settings.address` | `appId`? | Your address: the business's name, front page, app pages (with `appId`, that app's page: where the owner renames it or makes it the front page) and links domain. Put a "Change this address" link beside any link to your app's page. |
| `settings.domain` · `.languages` · `.translations` · `.email` · `.team` · `.userGroups` | | That Studio page |
| `settings.setupLists` | appId | Set-up lists, for that app |
| `settings.billing` | | Billing: plan, invoices, AI credits. Link here when the AI allowance is used up |
| `settings.integrations` | | Connections to other systems |
| `settings.guide` · `settings.translationRules` | | The customer guide · translation rules |
| `settings.portal` · `.hub` · `.signIn` | | The Portal, the Hub, customer sign-in |
| `media` | | Images and files |
| `app` | **appId**, view, params | Another app at one of its screens, as `openApp` |

`SL.adminViews.DESTINATIONS` has the same list in code.

### `about`: what a message is for

`message.compose` and `message.log` take `about`, the same shape as `comms.sendTransactional`
([comms.md](comms.md), "What a message is about"). `appId` defaults to your app.
- **The composer** sends it with the message. The Message log then shows the message against your
  record ("Bookings · Sat 3pm"), with a link back to your screen (`view` + `params`).
- **The log** shows only the messages about that record.

### Messaging many people

One message to many people (everyone who booked, entered or joined) is a **campaign**: it has opt-in, an
unsubscribe, a report, and no cap. Never loop over people sending one message each.
1. Record an interaction or a tag on each person when they book.
2. Make a segment in Customers for that interaction or tag.
3. Open `campaign.new` with the segment.

A server function may still send one service message itself (a confirmation, a reminder:
`ctx.sl.messages.send`). A message a person writes goes through the composer.

### Hosts

The host answers `smartlinks:open` `{ id, to, params, about?, appParams? }` with `smartlinks:open-result`
`{ id, to, ok, reason? }`. It posts `smartlinks:destinations` `{ available }` on load, on request
(`smartlinks:destinations-request`) and whenever the list changes. Helpers: `SL.adminViews.postDestinations`
and `SL.adminViews.postOpenResult`.

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
