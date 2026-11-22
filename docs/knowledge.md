---
title: Knowledge search
description: Make a collection's content searchable by meaning and keywords, for people and for AI agents.
category: AI
---

# Knowledge search

Knowledge search makes a business's own content searchable by meaning and by keywords: product manuals,
help articles, FAQs, docs, or anything your app holds. People search it from a website, Portal or Hub, and
AI agents search it with the `knowledge.search` tool. Because it matches meaning and exact words together,
"how do I clean it" finds a "Descaling" section, and a model number or error code still finds itself.

## How it fits together

- **Sets.** A collection has knowledge sets, such as "Product manuals" or "Help articles". Each set is
  `public` (anyone), `customer` (signed-in people) or `staff` (the business and its assistants).
- **Sources.** A set points at sources instead of holding copies:
  - `markdown_feed`: a Markdown bundle at an address (documents separated by `---`, each with a
    `Source: <url>` line).
  - `url`: one web page or document.
  - `documents`: documents your app pushes with `knowledge.upsertDocuments`.
- **Passages.** The platform splits each document into passages along its headings. Each passage keeps its
  heading path ("Settings › Email footer") and a link to its section. Feeds and pages are re-read on a
  schedule (every 24 hours by default), and only changed text is processed again.

## Set it up (admin)

```typescript
import { knowledge } from '@proveanything/smartlinks'

await knowledge.saveSet('coll_123', { key: 'manuals', name: 'Product manuals', visibility: 'public' })

// Documents your app pushes. The same ref replaces its earlier version.
const src = await knowledge.addSource('coll_123', 'manuals', { kind: 'documents' })
await knowledge.upsertDocuments('coll_123', src.id, [
  {
    ref: 'kettle-k200',
    title: 'K200 kettle manual',
    body: '## Descaling\n\nDescale every month with citric acid…',
    url: 'https://brand.example/manuals/k200',
    meta: { productId: 'prod_k200' },
  },
])

// Or a page / a Markdown feed, re-read every 24 hours
await knowledge.addSource('coll_123', 'manuals', {
  kind: 'url',
  config: { url: 'https://brand.example/support/k200' },
})
```

A source's `status` shows whether it's `ready`, still `indexing`, or `failed` (with `error` saying why). A
failed re-read keeps the previous passages searchable. `knowledge.reindex` reads a source again now.

## Search

```typescript
// From a website, Portal or Hub: public sets, plus customer sets for a signed-in person
const { results } = await knowledge.publicSearch('coll_123', {
  query: 'how do I descale',
  filters: { productId: 'prod_k200' }, // exact matches on a document's meta
  k: 5,
})
for (const r of results) console.log(r.title, r.heading, r.url, r.snippet)

// Staff: every set
await knowledge.search('coll_123', { query: 'refund policy for damaged items' })
```

Each result has `title` (the document), `heading` (its section), `url` (a link to the section), `snippet`
(for a results list) and `text` (the whole passage, for an AI to read). `mode` says how the search ran:
`hybrid` (meaning and keywords) or `keywords`.

## For AI agents

Give an agent the `knowledge.search` tool, and it searches before it answers and can cite the links:

```typescript
const run = await ai.agent.run('coll_123', {
  input: 'A customer asks how to descale the K200. Draft a reply with the steps.',
  toolbelt: { builtins: ['knowledge.search'] },
})
```

On the public surface (`ai.public.agentRun`), built-in tools are off, so public assistants don't get this
tool yet. A cited-answer call for public use is planned.

## Who sees what

| Caller | Sets searched |
|---|---|
| Anyone (`publicSearch`, no sign-in) | `public` |
| A signed-in person (`publicSearch`) | `public`, `customer` |
| Staff (`search`, agents in Studio) | `public`, `customer`, `staff` |

Naming a set the caller may not read in `sets` returns nothing from it.

## Costs

Making passages searchable by meaning, and searching by meaning, use AI. That use is counted against the
collection's AI credits like any other AI call. Unchanged text is never processed twice.
