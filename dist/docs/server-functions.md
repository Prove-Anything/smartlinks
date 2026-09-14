# Server functions ("edge functions")

> **Preview — SmartLinks SDK 2.0.0-alpha.** Part of the installable-app platform being built
> toward 2.0.0 stable (author → register → install → run → test). These APIs may change before
> then. Published under the npm `next` tag; `latest` remains 1.x.

A **server function** is arbitrary server-side JavaScript your app deploys directly into
SmartLinks. It runs on the SmartLinks servers — with access to the full SDK, to your app's
secrets, and to outbound network — so you can do things a browser app can't: validate and
write on the server, call third-party systems with credentials the client never sees, react
to events, and run scheduled work.

Every server function has the **same shape**, no matter how it's triggered or where it runs:

```ts
export async function myFunction(ctx, event) {
  // ctx  — a SmartLinks SDK pre-scoped to your declared authority, plus secrets, caller, fetch, log
  // event — the trigger payload (the HTTP body, the event, or the cron tick)
  return { ok: true }   // returned to the caller (http) or recorded as the run result (event/cron)
}
```

You never receive a raw API key or a superuser client. The platform builds `ctx` fresh for
each invocation and **pre-scopes every handle to exactly what your function declared** — this
is how a function stays safe even when it runs with elevated authority.

---

## Declaring a function

Functions are declared in your `app.manifest.json` under `functions`, and the handlers ship
in a bundle alongside your widgets/containers:

```jsonc
{
  "functions": {
    "files": { "js": { "umd": "dist/functions.umd.js" } },
    "definitions": [
      {
        "name": "submitCompetitionEntry",
        "description": "Validate a competition entry and record it server-side.",
        "trigger":    { "type": "http", "methods": ["POST"] },
        "visibility": "public",              // WHO may call it
        "authority":  "collection",          // WHOSE authority it runs as
        "elevated":   true,                  // required ack for public + collection
        "capabilities": ["sl:records:write", "network:api.recaptcha.net"],
        "apiVersion": "2026-09"
      },
      {
        "name": "onProofCreated",
        "trigger":    { "type": "event", "eventTypes": ["proof.created"] },
        "capabilities": ["sl:records:write", "secrets:crm-key", "network"]
      },
      {
        "name": "nightlyReconcile",
        "trigger":    { "type": "cron", "schedule": "0 2 * * *" },
        "capabilities": ["sl:products:read", "sl:records:write"]
      }
    ]
  }
}
```

Each definition maps to an exported handler of the same `name` (override with `handler`).

---

## The two security questions every function answers

Server-side code needs two questions answered up front. SmartLinks makes both **explicit and
declarative** — you state them in the manifest, and the platform enforces them. This is the
same split every extensible platform lands on (Salesforce `with/without sharing`, Shopify
online/offline tokens, Lambda's invoke-policy vs execution-role).

### 1. `visibility` — who is allowed to call it? *(http only)*

| Value | Meaning |
|---|---|
| `admin`  *(default)* | Callable only from an authenticated admin surface. |
| `public` | Publicly callable — no authenticated user required. |

### 2. `authority` — whose authority does it run as?

This decides what `ctx.sl` can do.

| Value | `ctx.sl` is scoped to | Use when |
|---|---|---|
| `caller` *(default)* | The **invoking user** (their session/JWT). Can only do what that user could. | Admin actions that should respect the user's own permissions and be attributed to them. |
| `collection` | A **collection-admin principal for _this_ collection only** — never a global superuser. | A privileged server-side action a public/anonymous caller can't be trusted to do directly. |

`authority` **defaults to `caller`** — secure by default. `event`- and `cron`-triggered
functions have no external caller, so they always run as `collection`.

### The combinations

- **`http` + `admin` + `caller`** — a delegated admin function; runs as the signed-in admin.
- **`http` + `public` + `caller`** — runs as the anonymous/public user (limited). The safe public default.
- **`http` + `public` + `collection`** — publicly callable, runs with collection authority.
  The powerful one (e.g. "submit competition entry" needs to validate then write a record no
  anonymous user may write directly). **Your responsibility:** validate the input and prevent
  abuse — see below.
- **`event` / `cron`** — background work; runs as `collection`.

> ### ⚠️ Public + collection authority is the sharp edge
> A `public` + `collection` function is reachable by anyone and runs with elevated authority.
> The platform shrinks the blast radius for you — the authority is capped to **this one
> collection**, and further capped by your declared **capabilities** (a competition-entry
> function that declares only `sl:records:write` cannot delete products or read other
> secrets, even though it's "elevated"). But **validating the request is still your job**:
> check the payload, rate-limit using `ctx.caller`, guard against replay. Treat the function
> body as a trust boundary.
>
> Because it's the sharp edge, a `public` + `collection` function must **explicitly opt in**
> with `elevated: true` in its declaration — a conscious acknowledgment that you're exposing
> collection authority to public callers. Without it, install/validation fails.

---

## Capabilities — least privilege, declared and capped

`capabilities` is the allow-list of what your function may reach. It is surfaced at install
time for consent and **enforced at runtime** — including for `collection`-authority functions.
Declare the minimum you need.

| Capability | Grants |
|---|---|
| `sl:<resource>:read` / `sl:<resource>:write` | SDK access to that resource, e.g. `sl:products:read`, `sl:records:write`, `sl:attestations:write`, `sl:contacts:write`. |
| `network` | `ctx.fetch` to any host. |
| `network:<host>` | `ctx.fetch` to that host only (repeat for several). Prefer this over blanket `network`. |
| `secrets:<ref>` | `ctx.secrets.get('<ref>')` for that one secret ref. |

If you don't declare `network`, `ctx.fetch` is absent. If you don't declare a `secrets:<ref>`,
`ctx.secrets.get('<ref>')` returns `null`.

---

## The `ctx` object

```ts
interface ServerFunctionContext {
  collectionId: string
  appId: string

  /** SmartLinks SDK, pre-scoped to your declared `authority`. Capabilities cap what it may do. */
  sl: SmartLinks

  /** Capability-gated secrets. Resolves only refs you declared via `secrets:<ref>`. */
  secrets: { get(ref: string): Promise<string | null> }

  /** Who invoked this function. */
  caller: {
    userId: string | null   // null for anonymous/public/system calls
    anonymous: boolean
    origin?: string | null  // http
    ip?: string | null      // http
    via: 'http' | 'event' | 'cron'
  }

  /** Outbound HTTP — present only if you declared `network` (host-scoped if `network:<host>`). */
  fetch: typeof fetch

  /** Structured logging, captured into your function's run telemetry. */
  log: (message: string, data?: Record<string, any>) => void
}
```

**Use `ctx.sl` for anything SmartLinks** — it is the same SDK surface you use client-side,
already authenticated as your declared authority and scoped to the collection. Do **not** try
to construct your own SDK client or carry your own key; that's what `ctx.sl` is for, and it's
the only way authority stays correct.

---

## Worked example — a public competition entry

```ts
// dist/functions — handler for the manifest definition above
export async function submitCompetitionEntry(ctx, event) {
  const { name, email, answer, captchaToken } = event.body || {}

  // 1. Validate — this is YOUR job on a public function.
  if (!email || !answer) return { ok: false, error: 'missing_fields' }

  // 2. Use a declared secret + declared host to verify a captcha.
  const secret = await ctx.secrets.get('recaptcha-secret')
  const verify = await ctx.fetch('https://api.recaptcha.net/verify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: captchaToken }),
  }).then(r => r.json())
  if (!verify.success) return { ok: false, error: 'captcha_failed' }

  // 3. Write with collection authority — something an anonymous caller can't do directly.
  const entry = await ctx.sl.appRecords.create({
    recordType: 'competition-entry',
    data: { name, email, answer, ip: ctx.caller.ip, submittedAt: new Date().toISOString() },
  })

  ctx.log('entry recorded', { entryId: entry.id })
  return { ok: true, entryId: entry.id }
}
```

Declared as `public` + `collection` + `['sl:records:write', 'secrets:recaptcha-secret',
'network:api.recaptcha.net']`, this function is publicly callable, verifies the request
itself, and writes a record no anonymous user could write — but it cannot touch products,
other secrets, or any other collection.

---

## Invoking an http function

An `http` function is called by POSTing to the collection's functions endpoint on the
surface that matches its `visibility`:

```
POST /admin/collection/:collectionId/functions/:name    # visibility: admin  (collection-admin auth)
POST /public/collection/:collectionId/functions/:name    # visibility: public (auth optional)
```

The request body is delivered to the handler as `event.body` (query string as
`event.query`). A function only runs on its own surface — calling an `admin` function on
the public endpoint is a `403`. The response is `{ ok: true, result }` on success, or
`{ error, message }` (HTTP 400) if the handler returned an error. `GET` on either endpoint
lists the functions callable on that surface.

The admin surface is collection-admin gated, so an admin function's `caller` authority runs
at admin level, attributed to the signed-in admin. The public surface resolves auth if a
token is present (→ `owner`) and treats its absence as anonymous (→ `public`); a
`collection`-authority function runs elevated regardless.

## Testing & preview

You don't have to deploy to find out whether a function works. There are three levels of
fidelity — use them in order.

### 1. Local harness (fast, offline)

`@proveanything/smartlinks/testing` builds a `ctx` that **enforces the declared capability
envelope**, so a function fails locally the same way it would in production — the common
"I forgot to declare `sl:records:write`" bug is caught before you deploy, not after.

```ts
import { createFunctionTestContext } from '@proveanything/smartlinks/testing'
import manifest from '../public/app.manifest.json'
import { submitCompetitionEntry } from '../src/functions'

const def = manifest.functions.definitions.find(d => d.name === 'submitCompetitionEntry')

const ctx = createFunctionTestContext({
  def,                                       // capabilities enforced come from the manifest itself
  caller: { userId: 'tester' },
  secrets: { 'recaptcha-secret': 'test-value' },   // fixtures — real secrets are server-only
})

const res = await submitCompetitionEntry(ctx, { method: 'POST', body: { email: 'a@b.com', answer: '42' } })
// ctx.sl.appRecords.create(...) throws CapabilityError unless `def` declares sl:records:write
```

Pass the **`def`** (not a hand-typed capability list) so "tested" can't drift from
"declared". By default `ctx.sl` methods return a stub result (pure unit test — no network);
inject `sl` to delegate to your live SDK for real reads/writes:

```ts
const ctx = createFunctionTestContext({
  def,
  sl: { appRecords: { create: (fields) => mySdk.app.records.create(fields) } },
})
```

### 2. Deployed test mode (high fidelity, safe)

Register to the `dev` channel and invoke on the real server — real secrets, real data —
without a live run *(coming next)*: a test invocation is forced to `caller` authority,
side-effecting writes are dry-run, and the traffic is logged separately from live metrics.

### 3. Live

Point a real collection at the channel and invoke for real.

### What differs across the three

| | Capabilities | `ctx.sl` | Secrets | Authority | Writes |
|---|---|---|---|---|---|
| **Local harness** | Enforced (from `def`) | Stub, or your injected SDK | Fixtures you pass | Informational | Whatever your impl does |
| **Deployed test** | Enforced | Real (test-scoped) | Real | Forced to `caller` | Dry-run |
| **Live** | Enforced | Real | Real | As declared | Real |

### Recommended CI pattern

1. **Unit** — run each handler through `createFunctionTestContext` (no network); assert
   behaviour *and* that capabilities are sufficient (an under-declared capability throws).
2. **Post-deploy smoke** — after registering to `dev`, hit each function once in test mode.

## Where functions run (and why it doesn't change how you write them)

SmartLinks runs first-party (trusted) functions **in-process** and untrusted third-party
functions in an **isolated runner**. The difference is enforcement, not authoring:

- **In-process** trusts the author; `ctx` is built directly.
- **Isolated runner** enforces the `authority` boundary and `capabilities` at the container
  edge — `ctx.sl` is a proxy over the declared authority, `ctx.fetch` is filtered to the
  declared hosts, and there is no ambient filesystem, network, or environment.

Because the **contract is identical**, a function you write today runs unchanged if it later
moves lanes. Write to the `ctx` contract and declare your capabilities honestly, and the
platform takes care of the rest.
