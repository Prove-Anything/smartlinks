# Agent tools — exposing your app's actions to the SmartLinks agent

> **SmartLinks SDK 2.x.** Redraft of the earlier "Agent Skills & Tools" RFC, now built on
> [server functions](server-functions.md). **Staged rollout:** the *declaration + discovery* ship in
> V2 (do them now); the *live agent loop* (a parent chat agent calling your tools) lights up when the
> platform agent can consume them. Everything you declare is useful before then — a tool is a server
> function, already invocable via http/event.

## The model: app-authored capabilities

An app declares **capabilities** — app-authored logic the platform runs, each with a declared
security envelope (`visibility` / `authority` / `capabilities`). There is **one engine** (the
server-functions runtime) and several **triggers** into it: `http`, `event`, `cron`, and **`agent`**.

**An agent tool is not a new runtime — it's an MCP-shaped facade over a capability.** By default a
tool *is a server function*: the agent's `tools/call` routes into the same `(ctx, event) => result`
with the same capability envelope. You author the logic once; the agent is just another caller.

Use a **client tool** (a `postMessage` handler in your live admin iframe) only for genuinely
UI-coupled actions that must run in the open app. It is **not** the default — headless server
functions are, because they work whether or not your UI is mounted.

## Declaring a tool

You already declare server functions in `app.manifest.json` (see
[server-functions.md](server-functions.md)). Mark one **agent-invocable** and give the agent what it
needs to call it — a description and an input schema:

```jsonc
{
  "functions": {
    "files": { "js": { "umd": "dist/functions.umd.js" } },
    "definitions": [
      {
        "name": "createFaq",
        "trigger": { "type": "http", "methods": ["POST"] },
        "visibility": "admin",
        "authority": "collection",
        "capabilities": ["sl:records:write"],

        // ── makes it an agent tool ──
        "agent": {
          "tool": true,
          "title": "Create an FAQ entry",
          "description": "Add a question/answer to this collection's FAQ. Use when the user asks to add or draft an FAQ.",
          "input": { /* JSON Schema for the arguments the agent supplies as event.body */ },
          "approval": "auto"        // auto | require  (require = human confirmation before the call)
        }
      }
    ]
  }
}
```

The handler is an ordinary server function — the agent-supplied arguments arrive as `event.body`:

```js
export async function createFaq(ctx, event) {
  const { question, answer } = event.body || {}
  // validate, then act with your declared authority/capabilities:
  const rec = await ctx.sl.appRecords.create({ recordType: 'faq', data: { question, answer } })
  return { id: rec.id }
}
```

## What the agent sees (MCP shape)

The platform derives an **MCP tool list** from your manifest and drives the standard flow — `tools/list`
→ `tools/call` → structured result — with streaming, cancellation, and approval layered on. You don't
implement the wire protocol; you declare tools and write handlers. (The live loop is the staged part.)

## Security

Identical to server functions — nothing new to reason about:
- **`visibility`** — who may call (admin/public).
- **`authority`** — whose identity `ctx.sl` carries (`caller` vs `collection`).
- **`capabilities`** — least-privilege, capped even when elevated.
- **`agent.approval: "require"`** — the agent must get human confirmation before invoking (use for
  destructive or public-facing actions).

Untrusted third-party tools run in the platform's isolated runner — the same boundary as untrusted
server functions.

## Working with `app.admin.json` (complement, not replacement)

`app.admin.json` stays the **canonical declarative config contract** — setup questions, config schema,
import fields, tunable settings, content hints. It's inspectable, validatable, deterministic, and
reused by many consumers at once (the admin form renderer, AI setup, a signup journey asking the same
questions, bulk import). Agent tools **do not replace it — they serve and adapt it**:

- Keep the declarative schema as the default and source of truth.
- When you want *dynamic, contextual* behaviour — "which questions for **this** collection?", "the
  config schema as it stands right now", "apply these answers" — expose a small function/tool that
  reads the declaration and returns a tailored result. **Static-first; dynamic only where it earns its
  keep.**

There's no rip-and-replace and nothing to migrate off: an app happy with its `app.admin.json` keeps
it untouched.

## What ships now vs staged

| Now (V2) | Staged (on the platform agent) |
|---|---|
| The `agent` declaration in the manifest | The live agent conversation calling your tools |
| SDK types for it; tool descriptors surfaced for discovery | `tools/call` streaming, cancellation, cross-app toolbelt arbitration |
| Your handlers run today via http/event | Human-approval UX for `approval: "require"` |

## Adopting this — opt-in, per app, no fleet migration

Agent tools are **purely additive**. There is **no migration pass**, and nothing breaks if you never
adopt them — an existing app on the V2 SDK simply *gains the ability* to add them whenever you want.
You do **not** touch every app; you turn it on for one app at a time.

To turn them on for a single app (say, an FAQ app), once it's on the V2 SDK:

1. **Server functions** — add the `functions` block + build target + test harness if the app doesn't
   already have them. See [server-functions.md](server-functions.md).
2. **Expose tools** — add the `agent` block to the functions you want the agent to call; give each a
   title / description / input schema and an approval mode.

That's it — declare and build. The live agent loop is staged (see the table above); until it ships,
your handlers still run via http/event, so declaring tools now is **forward-compatible, not
speculative breakage**. `app.admin.json` stays as-is throughout — nothing to retire.
