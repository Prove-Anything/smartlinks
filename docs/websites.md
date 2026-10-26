# Websites: server-rendered on the SmartLinks site runtime

A website built on SmartLinks is an app whose public side is a **server-rendered site** at its own
address: an automatic `*.smartlinks.host` name, a chosen name, or the business's own domain. Every
page arrives as finished HTML, so search engines, AI crawlers and link previews see the real
content, and visitors see it before any JavaScript runs.

## How a request is served

```
visitor / crawler / agent
  └─► SmartLinks site router (edge)
        ├─ /robots.txt, /sitemap.xml, /llms.txt     made by the platform (site-seo.md)
        ├─ a file in your build (has an extension)   served from the build, cached at the edge
        └─ anything else                             your site's server renders it
              • runs in an isolated worker, close to the SmartLinks API
              • may call the SmartLinks API and the hosts you declare, nothing else
              • request header x-sl-site says which site it is (SL.site.fromRequest)
```

The router also adds the canonical or noindex header, the security headers, and
`window.__SMARTLINKS_SITE__` to every HTML page (read in the browser with `SL.site.current()` or
`SL.readContext()`).

## The build

The website template (TanStack Start) produces this; you don't write it by hand.

```
dist/
├── index.html? / assets/…       the client build (hashed files: cached for a year)
├── sitemap-paths.txt            your pages, "<path> [Title]" per line (site-seo.md)
├── _server/                     the server bundle: one ES module entry + its chunks
│   └── index.mjs                exports default { fetch(request, env, ctx) }  (WinterTC)
└── app.manifest.json
```

Manifest:

```jsonc
"site": {
  "server": {
    "main": "_server/index.mjs",            // the server entry, inside the build
    "compatibilityFlags": ["nodejs_compat"] // allowed: nodejs_compat, nodejs_compat_v2, nodejs_als
  },
  "network": ["api.example-weather.com"]    // other hosts the server may call (optional)
}
```

On publish, the server folder becomes the site's server for that channel. Promote copies the same
bytes. `_server/` is never served to visitors.

## The server's rules

- **Which site:** `const site = SL.site.fromRequest(request)` gives `{ host, collectionId, appId,
  channel, canonicalHost }`. One build serves every site it's installed on, so always take the
  collection from here, never from a constant.
- **Data:** call the SmartLinks API with the SDK as you would in the browser. The server reads what
  an anonymous visitor could read on that site, and only that collection. It holds no keys and no
  signed-in user.
- **Writes** (contact forms, entries, sign-ups) go to your app's **server functions**
  (server-functions.md), called from the browser as today. Their capabilities, secrets and limits
  apply.
- **Other hosts:** only those in `site.network`. Anything else is refused (`403 Blocked`).
- **Limits per request:** a CPU-time budget and a cap on outgoing calls. A page that needs more is
  doing work that belongs in a server function or a scheduled job.
- **No secrets** in the server bundle and no Node built-ins beyond `nodejs_compat`.

## Using another app's pages

Some apps do a job a site shouldn't rebuild: a booking journey holds the time rules, the clash
handling and the confirmation; "my bookings" holds who may change what. Those apps declare their pages
in `linkable` (app-manifest.md), each with a stable `id`, a `path` and the params it `accepts`. A site
embeds one with **`IframeResponder`** (iframe-responder.md), from the browser:

```typescript
const site = SL.site.current()
const responder = new SL.IframeResponder({
  collectionId: site.collectionId,
  appId: 'appointments',            // the app's id on this collection
  initialPath: '/my-bookings',      // the page's `path`
  params: { service: 'svc_123' },   // what the page `accepts`
  onResize: (h) => { iframe.style.height = `${h}px` },
})
iframe.src = await responder.attach(iframe)
```

- **The visitor's session goes with it.** The page's API calls are proxied through the site, so it
  acts as whoever is signed in to the site (or as a guest). Never pass a token in the URL.
- **The app must be installed** on the site's collection; its address comes from there.
- **Show the app's content natively where you can** (its `headless` data: services, staff, events)
  for your own design and SEO, and embed the page only for the part that does the work.
- Pages render on the client, after load: they aren't part of the server-rendered HTML.

## Caching

The router keeps a rendered page at the edge when your response says it may:

| Your response | At the edge |
|---|---|
| `Cache-Control: public, s-maxage=300` (the template's default for pages) | kept up to 5 minutes |
| `private`, `no-store`, `no-cache`, or a `Set-Cookie` | never kept |
| no `Cache-Control` | never kept |

Cached pages are keyed by the release and the collection's **content generation**: when products,
public app records, app settings or the collection change, the generation moves and every page of
the collection's sites re-renders on its next visit (within about 30 seconds). Publishing a release
does the same. Tracking parameters (`utm_*`, `gclid`, `fbclid`…) don't create separate entries.

Keep pages the same for every visitor. Anything personal (a signed-in owner's products, a basket)
renders in the browser after load.

## Locally

`npm run dev` runs the site with your dev collection (`.env`: `VITE_SL_COLLECTION_ID`), because
there's no router to say which site it is: `SL.site.fromRequest()` is null, so fall back to it.
Forge's preview runs the same server code the site runtime does.
