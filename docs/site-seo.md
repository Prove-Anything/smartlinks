# Websites: search engines and AI crawlers (SEO + GEO)

For apps served as websites (an app site at `<name>.smartlinks.host` or a custom domain). Hub sites
get all of this from Hub.

## What the platform does for you

- **`/robots.txt`, `/sitemap.xml`, `/llms.txt`** are generated on the site's own address. Don't ship
  `robots.txt` or `sitemap.xml`: one build serves many sites, and sitemap URLs must be absolute on
  the site's host, which the build can't know.
- **List every page** in `public/sitemap-paths.txt`, one `<path> [Title]` per line, in menu order
  (`/ Home`, `/menu Menu`, `/book Book a table`). They go into the sitemap and `llms.txt` (titled)
  on the right host, and Forge's preview uses the same list as its page menu. Keep it in step with
  the router. Pre-rendered pages (`about/index.html`) are found automatically.
- **Canonical address.** A site can answer on its automatic address, a chosen name and a custom
  domain. Every page gets `Link: <https://{canonical}{path}>; rel="canonical"`, so search engines
  consolidate on one: the custom domain, else the chosen name, else the automatic address. Don't set
  your own canonical unless a page has a different canonical page.
- **Previews stay out of search.** A sandbox collection's sites, and any test build (dev, alpha,
  beta), are served with `X-Robots-Tag: noindex` and a `robots.txt` that disallows everything,
  whatever the build ships.

## What you do: `SL.seo` and `SL.site`

```ts
import * as SL from '@proveanything/smartlinks'

// Per route, from its data — on every route change:
SL.seo.head({
  title: `${product.name} — ${brand}`,
  description: product.description,       // ~150 characters, says what the page is
  image: product.heroImage?.url,           // absolute; used for link previews
  type: 'product',                         // 'website' | 'article' | 'product'
})

// Structured data (schema.org JSON-LD). The id names the block, so calling again replaces it:
SL.seo.jsonLd('page', SL.seo.schema.product(product, { url: location.href, brand }))
SL.seo.jsonLd('faq', SL.seo.schema.faqPage(faqs.map((f) => ({ question: f.q, answer: f.a }))))
SL.seo.jsonLd('org', SL.seo.schema.organization(collection))

// When the page's data has rendered:
SL.site.ready()
```

| Builder | For |
|---|---|
| `schema.product(product, { url, brand, offer, rating })` | product pages (`offer` only when it's really sold) |
| `schema.faqPage([{ question, answer }])` | FAQs: rich results, and the answer-shaped content AI search cites |
| `schema.organization(collection)` | the brand behind the site (home page) |
| `schema.localBusiness(collection, { type, address, telephone, openingHours })` | a business with a place (`type: 'Florist'`, `'Restaurant'`…) |
| `schema.breadcrumbs([{ name, url }])` | nested pages |
| `schema.article({ headline, datePublished, … })` | posts, guides, news |

`seo.head` removes tags a previous route set and the next one doesn't. Both are no-ops without a
`document` (SSR, tests).

`site.ready()` tells the platform's page renderer the page is complete, so it can snapshot the
content for crawlers that don't run JavaScript. Without it, the renderer waits for the network to go
quiet.

## Content that gets found

- **Content in the page, not behind interaction.** FAQ answers in `<details>` are fine; answers
  fetched only when a question is clicked aren't seen.
- **One `<h1>` per page**, a logical heading order, `alt` text on content images.
- **Answer-shaped writing.** A short summary near the top, question-style headings where they fit.
  This is what AI assistants quote.
- **Real links** (`<a href>`) between pages, never hash routes.
