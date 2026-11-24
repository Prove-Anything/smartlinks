# Files

Files are for the things an app or an AI tool needs to hold onto that nobody browses: a supplier's spec sheet fetched
to read product details from, a web page with a recipe, a deck to summarise, an image to read text from, a JSON result
to pass between steps.

A file is an asset, with three differences:

- **It can be temporary.** It's removed at `expiresAt` (`ttl` from `1h` to `30d`, default `1d`).
- **It's private** until kept. You read it through `files.read` or a signed link from `files.link`.
- **It stays out of asset lists.** Pickers, the media library, the Hub and the portal never show temporary or
  extracted files. `files.keep` makes a file permanent and public (with an `assetUrl`), and it then shows like any
  upload.

## Fetch once, extract once

```typescript
import { files } from '@proveanything/smartlinks'

// The same address returns the same file while it's fresh; once stale, an unchanged page isn't downloaded again.
const { file } = await files.fetch(collectionId, { url: 'https://supplier.example/spec.pdf', ttl: '7d' })

// Each file is read each way once: asking again returns the same result (cached: true).
const { text } = await files.extract(collectionId, file.id, { variant: 'markdown' })

const { data } = await files.extract(collectionId, file.id, {
  variant: 'json',
  schema: { type: 'object', properties: { gtin: { type: 'string' }, weightKg: { type: 'number' } } },
})
```

| Variant | Gives | Works on |
|---|---|---|
| `text` | plain text | PDFs, HTML, text, JSON, and web pages / documents |
| `markdown` | Markdown | web pages, PDFs, decks, documents |
| `ocr` | text read from an image | images |
| `json` | typed fields (`schema` and/or `prompt`) | anything readable |

What's extracted is kept beside its source as a derived file (`origin: 'derived'`, `derivedFromId`, `variant`) and
lives as long as the source does.

## Your own files

```typescript
const { file } = await files.put(collectionId, { name: 'notes.json', json: { step: 2 }, ttl: '1d' })
const { text } = await files.read(collectionId, file.id)          // or 'base64'
const { url } = await files.link(collectionId, file.id, 15)        // a signed link for 15 minutes
await files.keep(collectionId, file.id)                            // permanent, public, shows in pickers
await files.remove(collectionId, file.id)
const { items: mine } = await files.list(collectionId, { appId: 'my-app', origin: 'fetched' })
```

## In a server function

The same calls are on `ctx.sl.files` (manifest scopes `sl:files:read` and `sl:files:write`), without the collection
id. AI tools get `file.fetch`, `file.extract` and `file.read`, which hand back file references rather than pasting
whole documents into the conversation.

```js
const page = await ctx.sl.files.fetch('https://cook.example/pancakes', { ttl: '7d' })
const { data } = await ctx.sl.files.extract(page.id, 'json', { schema })
```

## Limits

- Fetching: public web addresses only (checked on every redirect), up to 50 MB.
- Reading contents: up to 25 MB.
- Temporary files per site: 5,000 files or 2 GB at once; past that the oldest temporary files go first. Kept files
  aren't capped here.
