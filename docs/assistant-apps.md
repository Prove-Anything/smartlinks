# The Studio assistant and your app

SmartLinks admins have **one assistant**: an agent that works for the signed-in admin on one
collection, with the admin's own authority, from a chat in Studio. It reads and changes data through
the SmartLinks API, every write is a **change set** the admin can see and undo, and the things that
can't be undone (deleting, sending, calling out, publishing, spending) wait for the admin's "Allow".

This page is for app authors: how the assistant learns what your app is, how it is set up, and what it
can do for the admin — without you building a chat of your own. Your app declares three things:

| What | Where | Status |
|---|---|---|
| **Skills and knowledge** — plain-words procedures for the admin side, and the facts they need | `assistant` block in `app.manifest.json`, files under `public/assistant/` | this page |
| **Tools** — logic the assistant should call rather than reimplement | server functions with an `agent` block (`audience: ["assistant"]` for assistant-only) | [agent-tools.md](agent-tools.md) |
| **Setup** — questions, config schema, how to save | `app.admin.json` + `ai-guide.md` | [app-manifest.md](app-manifest.md#appadminjson) |

An app with none of these still works with the assistant: it can read the app's records and config
and change them through change sets. The declarations make it *good* at your app.

## The `assistant` block

```jsonc
// app.manifest.json
"assistant": {
  "skills": [
    { "name": "setup",  "description": "First-time setup of the FAQ app: categories, tone, who answers", "file": "assistant/skills/setup.md" },
    { "name": "content", "description": "Adding, editing, ordering and retiring questions and answers",  "file": "assistant/skills/content.md" }
  ],
  "knowledge": [
    { "name": "config-schema", "description": "JSON Schema of the app's config document", "file": "assistant/knowledge/config.schema.json" },
    { "name": "examples",      "description": "Three worked examples of good FAQ content",   "file": "assistant/knowledge/examples.md" }
  ],
  "preview": "/admin/preview?changeSet={id}"
}
```

The files sit in `public/assistant/` in your project and ship with every release like any other static
file (they are read from the release's CDN folder, on the channel the collection runs your app on).

### How they are loaded

When an admin opens a chat, the assistant's box gets the **index** of every installed app's skills: one
line each, the description. Nothing else. A skill's body, and the knowledge files it names, are read
only when the assistant decides the job needs them. Twenty apps with three skills each cost the
conversation about sixty lines. So: write several focused skills rather than one long one, and spend
care on the description — it is how the assistant decides to open the file.

### Writing a skill

A skill is a markdown file: what this area of your app is for, what each setting means, how to read and
change it, what a good result looks like, what to check afterwards. Write it for a capable colleague who
has never seen your app. The assistant works through the SmartLinks API with a small CLI (`sl`), so say
things in those terms:

```markdown
---
name: faq-content
description: Adding, editing, ordering and retiring questions and answers in the FAQ app
---
# FAQ content

Questions live as app records of type `question` (`sl get app/faq/records recordType=question`).
Fields: `data.question`, `data.answer` (markdown), `data.category` (one of the categories in the app's
config, `sl get app/faq` → `categories[]`), `data.order` (ascending), `status` (`published` | `draft`).

## Adding questions
Plan one change set per batch: items `{ "op": "create", "entity": "record", "appId": "faq",
"data": { "recordType": "question", "data": { … }, "status": "draft" } }`. Match on `data.question`
(case-insensitive) before creating, so a re-run updates instead of duplicating.

## A good answer
Two to five sentences, plain words, no marketing. Link to a product page when one exists
(`/p/<collectionId>/<productId>`). Never invent policy: if the answer depends on something the admin
hasn't said (returns window, delivery areas), ask.

## Check afterwards
`sl get app/faq/records recordType=question status=draft` — read three back and make sure the
category is one that exists.
```

The frontmatter is optional; when it is missing, the manifest entry's `name` and `description` are used.
Keep a skill under a few hundred lines; put long reference material in knowledge files and name them.

### Knowledge

Knowledge files are what the skills refer to: the schema of your config document, record shapes, worked
examples, a glossary of your app's words. The assistant reads them when a skill points at them (each
skill is told where the app's knowledge files are).

**Generate the schema, don't write it.** If your config is typed (a TypeScript interface, a zod schema),
produce the JSON Schema at build time (`ts-json-schema-generator`, `zod-to-json-schema`) into
`public/assistant/knowledge/`. A hand-written schema drifts the first week.

## Tools: when a skill is not enough

Nearly every admin action is a read or a patch of config or records, and the assistant does those
itself. Give it a **tool** only when a step can't be an API call it makes on its own:

- logic that lives in your code (validate a layout, render a page from a design direction, compute
  something from your data model),
- a write that must be atomic across several objects,
- anything that needs your app's secrets.

A tool is an http server function with an `agent` block
([agent-tools.md](agent-tools.md)); the assistant calls it as
`sl post app/<appId>/functions/<name> '{ … }'`, under the function's own visibility, authority and
capabilities. Set `"audience": ["assistant"]` to keep an assistant-only tool out of your in-app and
public agent runs:

```jsonc
{
  "name": "applyDesignDirection",
  "trigger": { "type": "http" },
  "visibility": "admin",
  "authority": "caller",
  "capabilities": ["sl:settings:write"],
  "agent": {
    "tool": true,
    "title": "Apply a design direction",
    "description": "Rewrites the theme, fonts and layout of the hub to match a named direction.",
    "input": { "type": "object", "properties": { "direction": { "type": "string" } }, "required": ["direction"] },
    "audience": ["assistant"]
  }
}
```

A tool that changes config should **return the patch, not apply it**, so the assistant can put it in a
change set and the admin keeps undo. Tools that act directly are fine for reads and computations.

## How the assistant changes your config

Your config document (`SL.appConfiguration`, `sl get app/<appId>`) and the collection's settings
groups (`sl get settings/<group>`) are changed through change-set items:

```jsonc
{ "op": "update", "entity": "appConfig", "id": "<appId>", "data": { "theme": { "accent": "#0a7" } } }
{ "op": "update", "entity": "appConfig", "id": "<appId>", "scope": { "productId": "p1" }, "data": { … } }
{ "op": "update", "entity": "settings",  "id": "hub", "data": { "pages": { "about": { … } } } }
```

Saves deep-merge, as your own admin UI's saves do (nested objects merge, arrays replace). The whole
document before the change is kept, so **undo puts it back exactly**. Say in your skills which keys
are arrays, so the assistant sends the whole array when it changes one element.

### Preview before apply

A planned change set can be rendered before it is applied. The API gives, for every document a set
touches, the live document and the document as it would become:

```
GET /admin/collection/:collectionId/assistant/changesets/:id/preview
→ { id, status, targets: [ { entity, id, scope?, before, after, ops } ] }
```

Declare `assistant.preview` — a page of your admin surface that takes `{id}`, calls that endpoint
with the admin's session, and renders `targets[].after` as your app would render the live config. The
Studio panel then shows "Preview" on the change set, and the admin sees the result before saying yes.

## Checklist

- `assistant.skills[]`: several focused skills with descriptions that say when they apply.
- `assistant.knowledge[]`: the config schema generated from your types; record shapes; examples.
- Every skill says which fields are arrays, what to match on before creating, what to check after.
- Logic the assistant can't reproduce: a server function with `agent.tool` and `audience: ["assistant"]`,
  returning a patch for config changes.
- `assistant.preview` when your app has a visual surface worth seeing before a change lands.
- `ai-guide.md` still describes first-time setup for the setup wizard; the assistant reads it too when
  an app declares no skills.
