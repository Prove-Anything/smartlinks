# The customer guide

A business's assistant for its visitors, in Portal and the Hub, by voice or by text. It knows the business
(a brief written for visitors), where the visitor is (the product, the item scanned, the app on screen) and
what that screen says, and it can open another app for them. The business switches it on and shapes it in
Studio (Configure → Guide). Design: prove `server/docs/design/customer-assistant.md`.

Everything that shapes the guide — its instructions, voice, tools and limits — is fixed by SmartLinks when a
conversation starts. A page only says where the visitor is and what is on their screen.

---

## For a host (Portal, the Hub, a custom site)

```ts
import * as SL from '@proveanything/smartlinks'

const info = await SL.ai.guide.get(collectionId, 'portal')   // { enabled, name, modes, suggestions, handoff }
if (!info.enabled) return

const chat = await SL.ai.guide.start(collectionId, {
  surface: 'portal',                    // or 'hub'
  mode: info.modes.start,               // 'voice' or 'text'
  productId, proofId,
  apps: [{ id: 'recipes', title: 'Recipes' }],   // the apps on the visitor's page: their pages come from the deep-link registry
  where: { appId: 'recipes', path: '/method' },  // where the visitor is now
  screen: await SL.ai.content.request({ frame: appIframe.contentWindow }),
  showApp: (appId) => openApp(appId),
  openPage: ({ appId, path, params }) => openApp(appId, path, params),   // a page the guide chose (look_in → open_page)
  goTo: (productId) => openProduct(productId),                         // another product it found (find → go_to)
  onShow: (card) => showFound(card),                                    // what find found, rows with goTo
  offerPerson: (handoff) => showContact(handoff),
  onState: setState,                    // idle | connecting | listening | hearing | thinking | speaking | paused | error
  onCaption: setCaption,                // what it is saying or writing, as it goes
  onError: setError,
})

chat.pause(); chat.resume(); chat.stop()
chat.send('What is it made of?')       // text mode (works in voice mode too)
chat.note('The visitor is now on Dishwasher DW-60 (product id p9), in Manual at /troubleshooting.')   // where they are; it doesn't answer
```

The guide knows the pages around the visitor from SmartLinks' deep-link registry (`linkable` in each app's
manifest, and each app's config `linkable` per collection and per product; see deep-link-discovery.md).
Register your pages there and the guide can open them by name.

- Voice needs the microphone; ask for it on a tap (browsers require it).
- A signed-in visitor (Auth Kit bearer on the SDK) owns their conversation; otherwise it is anonymous.
- The guide's `read_screen` tool asks the app on screen what it shows (below). Pass `readScreen` to answer
  it yourself.
- Limits per visitor and per business are set in Studio; a refusal comes back as `GUIDE_LIMIT` (429).

## For an app: say what your screen shows

```ts
useEffect(() => SL.ai.content.provide(() => ({
  appId: 'pages',
  title: page.title,
  content: page.text,          // plain words: the exhibit, the recipe, what this form is for
})), [page])
```

`provide` works the same in an iframe (the host asks by message) and as a direct component. Return what a
person reading the screen would take in, not markup. Without it, a host may fall back to the page's text.

## Your own live conversation

`SL.ai.live.start({ endpoints: { mint, tool, event }, mode, screenTools, … })` is the client the guide and the
Studio assistant use: WebRTC straight to the realtime service with a key your server minted, tools split
between the page (`screenTools`) and your server (`endpoints.tool`). See `src/live.ts`.
