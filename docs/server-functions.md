# Server functions ("edge functions")

> **SmartLinks SDK 2.x** (current `latest`). Part of the installable-app platform
> (author → register → install → run → test). Install `@proveanything/smartlinks@^2`.

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

## Building the functions bundle

The handlers ship as a **self-contained UMD** — one file, all dependencies compiled in, no
`require`/`import` of platform or Node modules (see [Runtime](#runtime--what-your-function-can-use)).
Your functions entry just **named-exports** each handler:

```js
// src/functions/index.js — the functions entry
export async function submitCompetitionEntry(ctx, event) { /* … */ }
export async function onProofCreated(ctx, event) { /* … */ }
```

Build it to `dist/functions.umd.js` with a Vite lib build — **UMD format, nothing externalised**
(so it's self-contained), and don't wipe the widgets you built into the same `dist/`:

```ts
// vite.functions.config.ts
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    lib: { entry: 'src/functions/index.js', formats: ['umd'], name: 'functions',
           fileName: () => 'functions.umd.js' },
    outDir: 'dist',
    emptyOutDir: false,            // co-exist with the widgets/containers build
    rollupOptions: { external: [] } // bundle everything — no Node/platform externals
  },
})
```

```jsonc
// package.json — build widgets/containers as usual, then the functions bundle
"scripts": {
  "build": "vite build && vite build --config vite.functions.config.ts"
}
```

That emits `dist/functions.umd.js` (matching `functions.files.js.umd`), whose named exports the
platform pairs with your manifest `definitions`. Then **deploy** it — for dev,
`smartlinks-publish` uploads `dist/` and registers in one step (see
[Deploying & registering](deploying-apps.md)).

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

  /** SmartLinks SDK, pre-scoped to your declared `authority`. Capabilities cap what it may do.
   *  Key resources: `sl.appRecords` (per-app records), `sl.appData` (general/app-wide config +
   *  data — URLs, flags, counters, arrays), `sl.products`, `sl.attestations`. */
  sl: SmartLinks

  /** Capability-gated secrets (need `secrets:<ref>`). `get(ref)` resolves the collection's OWN
   *  secret first, then the app-level one; `app(ref)` reads the app-level secret only. */
  secrets: { get(ref: string): Promise<string | null>; app(ref: string): Promise<string | null> }

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

  /** Structured logging — returned inline on the admin surface and recorded as an
   *  execution activity event (owner Errors & Activity console). See "Seeing your
   *  function's runs and logs" below. */
  log: (message: string, data?: Record<string, any>) => void
}
```

**Use `ctx.sl` for anything SmartLinks** — it is the same SDK surface you use client-side,
already authenticated as your declared authority and scoped to the collection. Do **not** try
to construct your own SDK client or carry your own key; that's what `ctx.sl` is for, and it's
the only way authority stays correct.

### Calling a function from your app (client side)

From a page/UI, invoke an `http`-trigger function with the SDK — no manual fetch, no URL building:

```ts
// public function (runs on the caller's authority — signed-in owner, else public):
const res = await SL.functions.call(collectionId, 'increment', { /* becomes event.body */ })
// admin surface (needs an admin session):
const res = await SL.functions.callAdmin(collectionId, 'recomputeTotals', { … })
```

`res` is whatever your handler returns. See the `edge-function-test` example for a full page +
function + manifest.

#### Functions are ALWAYS app-scoped

A function belongs to an app, so the canonical route carries the appId:
`POST /collection/:collectionId/app/:appId/functions/:name`. Two different installed apps can each
ship a function of the same name without clashing.

The SDK fills the appId in for you. Initialize with your app's id once, then call by bare name —
the SDK routes it app-scoped:

```ts
SL.initializeApi({ baseURL, appId: 'my-counter-app' })   // usually done by the host/bootstrap
await SL.functions.call(collectionId, 'pressCounter')     // → /collection/:c/app/my-counter-app/functions/pressCounter
```

To call a *different* app's function, pass the appId explicitly:

```ts
await SL.functions.call(collectionId, 'pressCounter', {}, { appId: 'some-other-app' })
```

**Where it runs.** A function runs on a collection when the app is **installed** there (enabled in
the collection's apps); or the app is **restricted** to a list of collections (what publishing from
Forge sets for every developer) and this collection is on it, e.g. your own sandbox; or the app is
**public**, meaning a registered app with no restriction list, which only platform admins can
publish. Anything else gets `404 APP_NOT_INSTALLED`: a function can run with the collection's own
authority and secrets, so a developer's app can't reach a collection that hasn't taken it on.

**Who may run server code at all.** Until functions move to an isolated runner, only TRUSTED apps
execute: public (unrestricted) apps, or apps a platform admin has marked `functionsTrusted: true`.
Developer apps — restricted to their own collections, which includes every app published from
self-serve Forge — get `403 FUNCTIONS_NOT_ENABLED` until they're trusted. A platform admin can also
switch any app's functions off with `functionsTrusted: false`.

**Which release.** With no channel, the server runs the release the collection has **installed** (stable for a
public app that isn't installed) — what production wants, so app code just calls `SL.functions.call(collectionId, name)`. To run
another release, the channel goes **in the path**: `/app/:appId/<dev|alpha|beta|stable>/functions/:name`.
The SDK adds it for you when the host tells the app which channel it's running as — Forge's preview
of a Test build passes `appChannel=dev` in the app's context, so the same code calls the dev build
there and the installed build in production. You can also set it yourself:

```ts
SL.initializeApi({ baseURL, appId: 'my-counter-app', appChannel: 'dev' }) // whole app
await SL.functions.call(collectionId, 'pressCounter', {}, { channel: 'beta' }) // one call
await SL.functions.call(collectionId, 'pressCounter', {}, { channel: null })   // force the installed release
```

**Public address on the collection's own site (webhooks, integrations).** Every collection has a
site host — `<name>.smartlinks.host` once a name is claimed, else `c-<collectionId>.smartlinks.host` —
returned as `collection.siteHost`. App functions are reachable there:

```
https://<siteHost>/_fn/<appId>[/<channel>]/<function>[/<sub-path…>]
```

```ts
const col = await SL.collection.get(collectionId)
const webhookUrl = SL.functions.siteUrl(col, 'stripeWebhook', { appId: 'my-shop' })
// → https://acme.smartlinks.host/_fn/my-shop/stripeWebhook   (give this to Stripe)
```

Built for integrations: **every HTTP method** the function declares in `trigger.methods` (default
POST only), **any content type** with the exact bytes in `event.rawBody` (verify signatures with
`crypto.subtle`), **sub-paths** after the name when the function declares `trigger.path` (`"/*"`, or a
pattern like `"/orders/:id"` → `event.params.id`), and the function's own `Response` — status, headers,
CORS — goes back unchanged (the platform adds no CORS headers there; declare `OPTIONS` and answer
preflights yourself if browsers call you cross-origin). Bodies up to 6 MB.

```js
// manifest: { name: 'orders', trigger: { type: 'http', methods: ['GET', 'PUT'], path: '/orders/:id' }, visibility: 'public' }
export async function orders(ctx, event) {
  if (event.method === 'GET') return ctx.sl.appRecords.get(event.params.id)
  // PUT: verify the sender first — e.g. an HMAC over event.rawBody with a secret
}
```

Security: the platform never hands a caller's SmartLinks credential to function code (if it signed
the caller in from `Authorization`, that header is removed and you get `ctx.caller`); your OWN
`Authorization` scheme for webhooks passes through. `siteUrl` only includes a channel you ask for —
point production webhooks at the bare address and test ones at `/dev/`.

The channel is never a query parameter: the function owns its query string (`?channel=sms` reaches
your handler untouched), and a configured URL — a webhook, a third-party callback — can only ever
hit the channel it names. Point production webhooks at the bare path and test ones at `/dev/`.

If no appId is available (not set on init, none passed), the call falls back to the **deprecated
flat path** `/collection/:c/functions/:name`, which searches only the collection's **enabled** apps,
resolves by bare name, and **rejects with `409 AMBIGUOUS_FUNCTION`** when more than one defines that
name (a first-party builtin still wins). Always prefer an appId.

> There is no such thing as an app-less function. First-party builtins (e.g. the `functions.ping`
> diagnostic) belong to the reserved `smartlinks` app. A "global" function is just an app enabled on
> the `global` collection and called at `/collection/global/app/:appId/functions/:name` — same two
> facets (collection + app), with `global` as the sentinel collection.

---

## Inputs — data handed to your function

Declare what your function needs and the platform fetches it **before** the run: read it from `ctx.inputs` instead of calling `ctx.sl` first. One less round trip — and for functions running in the isolated runner, one less network hop.

```jsonc
// app.manifest.json → functions.definitions[]
{
  "name": "onProductChanged",
  "trigger": { "type": "event", "eventTypes": ["product.updated"] },
  "capabilities": ["sl:products:read", "sl:data:read"],
  "inputs": { "appConfig": true }            // entity is on by default for event triggers
}
```

```js
export async function onProductChanged(ctx, event) {
  const product = ctx.inputs.entity                     // the product that changed
  const { interactionIds } = ctx.inputs.appConfig || {} // this app's config for the collection
}
```

| Input | What you get | Needs | Triggers |
|---|---|---|---|
| `entity` | The record the event is about: the product, your app's record, or the interaction event. **On by default**; `"entity": false` opts out. | read on that resource (`sl:products:read`, `sl:records:read`) | event |
| `collection` | The collection's public record | — | all |
| `appConfig` | Your app's config for this collection (where setup like `interactionIds` lives) | `sl:data:read` | all |
| `product` | A product named by the request: `{ "from": "body.productId" }`, `"query.<field>"` or `"path"` | `sl:products:read` | http |

- **Same rules as `ctx.sl`.** Inputs are fetched with your function's authority and capabilities, scoped to the collection it runs in — a product from another collection is never fetched.
- **Never an error.** Not found, not allowed or larger than 256 KB → that input is `null`. Check before you use it.
- **Current state.** Event inputs are fetched when your function runs, so you see the record as it is now; `event` still carries the ids.
- **Checked at publish.** An unknown input, a bad `from`, or a missing capability fails validation.
- **Testing:** pass `inputs` to the test context — `createFunctionTestContext({ def, inputs: { entity: { id: 'p1', name: 'Kettle' } } })`.

## Exposing a function to the AI agent

An `http` function can be offered to the AI agent as a **callable tool**, alongside the built-in
tools. The model calls it, the server runs it, and the result is fed back into the loop. Opt in from
the manifest with an `agent` block (full reference: [agent-tools.md](agent-tools.md)):

```jsonc
{
  "name": "getLoyaltyBalance",
  "trigger": { "type": "http" },
  "visibility": "admin",
  "authority": "caller",
  "capabilities": ["sl:records:read"],
  "agent": {
    "tool": true,
    "title": "Loyalty balance",
    "description": "Look up a member's current loyalty points balance.",
    "input": {
      "type": "object",
      "properties": { "memberId": { "type": "string" } },
      "required": ["memberId"]
    },
    "approval": "auto"                       // 'require' = human confirms before each call
  }
}
```

The agent becomes **just another caller surface** — your function's `visibility`, `authority`, and
`capabilities` are enforced exactly as on the http route. Nothing new is granted. The agent's tool
arguments arrive as the function's request `body`, and whatever you return becomes the tool result the
model sees. `approval: "require"` tools are held back from the autonomous server-side loop until the
human-approval UX ships.

Include your app's functions in an agent run:

```ts
// Agentic Responses:
await SL.ai.chat.responses.create(collectionId, {
  model: 'balanced', input: 'What is member 42's balance?',
  server_tools: true,                              // built-in tools
  app_functions: { appId: 'my-loyalty-app' },      // + this app's ai.tool functions
})

// Or the one-shot agent loop:
await SL.ai.agent.run(collectionId, {
  input: '…', appFunctions: { appId: 'my-loyalty-app' },
})
```

On the **consumer surface**, a `visibility: "public"` function reaches a public assistant via the
public agent loop — the caller runs as the signed-in consumer (`'owner'`, send the authKit bearer) or
anonymous (`'public'`):

```ts
await SL.ai.publicClient.agentRun(collectionId, {
  input: '…',
  appFunctions: { appId: 'my-app' },   // this app's public agent tools
  server_tools: ['web.search'],         // built-ins are an explicit allowlist on the public surface
})
```

`channel` (default `'stable'`, pass `'dev'` to test a dev build) and `only: string[]` narrow which
functions are exposed. Only `http` functions with `agent.tool: true` are eligible; `event`/`cron`
functions never are. A built-in tool of the same name wins the clash.

### One unified toolbelt

Rather than juggling `server_tools` + `app_functions`, declare everything in one `toolbelt` — built-in
tools, one **or several** apps' functions, and (reserved, staged) front-end client tools:

```ts
await SL.ai.chat.responses.create(collectionId, {
  input: '…',
  toolbelt: {
    builtins: ['web.search', 'document.read'],      // true = all, [names] = subset, omit = none
    appFunctions: [{ appId: 'loyalty' }, { appId: 'catalog' }],  // several apps at once
    // clientTools: [ … ]  // reserved — the client-tool bridge is staged
  },
})
```

The same `toolbelt` works on `ai.agent.run` and `ai.publicClient.agentRun` (on the public surface
`builtins` is an explicit allowlist — `true` is treated as none). Precedence on a name clash: a
built-in wins, then earlier `appFunctions` sources win over later ones.

> Directly (no model): every function is also callable deterministically — `SL.functions.call` /
> `callAdmin` (above), the same way the built-in tools are callable via `SL.ai.tools.run`.

---

## Runtime — what your function can use

Your function runs in a **web-standard sandbox** (think Cloudflare Workers / Deno), **not
Node**. Concretely it targets the **WinterTC Minimum Common Web Platform API** (WinterTC is the
Ecma International technical committee for this, formerly WinterCG) — the same surface those
runtimes guarantee — so what you can rely on is portable, and the future isolated runner will
host the same bundle unchanged.

**Available globals** (no import needed):
- **Data / encoding:** `JSON`, `URL`, `URLSearchParams`, `TextEncoder` / `TextDecoder`,
  `atob` / `btoa`, `Buffer`, `structuredClone`.
- **Crypto:** `crypto` (Web Crypto) — `crypto.subtle` for hashing / HMAC / encrypt / sign /
  verify, `crypto.getRandomValues`, `crypto.randomUUID`.
- **HTTP:** `fetch`, `Headers`, `Request`, `Response`, `FormData`, `Blob`, `File`,
  `AbortController` / `AbortSignal` (use one for **request timeouts**).
- **Streams & timing:** `ReadableStream` / `WritableStream` / `TransformStream`,
  `CompressionStream` / `DecompressionStream` (gzip/deflate for third-party payloads), the timer
  functions, `queueMicrotask`, `performance`, `console`.
- **Runtime identity:** `navigator.userAgent` reports the runtime key (currently
  `"SmartLinks-Functions"`) — use it if a portable dependency needs to feature-detect the host.
  It stays stable when functions move to the isolated runner.

**Not available:** `require` / `import` of platform or Node modules, `process`, `fs`, and the
Node built-ins (`node:crypto`, `node:http`, …). There is no ambient database, key, or network
handle — everything the platform gives you comes through **`ctx`**.

**Dependencies:** bundle them. Your build must produce a **self-contained** UMD (deps compiled
in), and those deps must be **edge-compatible** — pure JS / Web APIs. A library that reaches for
Node built-ins (e.g. `axios`'s Node adapter, anything using `node:crypto`) will fail to load.
Prefer the platform primitives above over a dependency; when you do need one, pick edge-safe:

| Need | Native? | Recommended (bundle, edge-safe) |
|---|---|---|
| JSON | **native** — `JSON.parse/stringify` | — |
| XML parse / build | no | `fast-xml-parser` |
| CSV | no | `papaparse` |
| Schema validation of inputs | no | `zod` |
| JWT (sign/verify for a third-party API) | Web Crypto can, verbosely | `jose` |
| Hash / HMAC / encrypt | **native** — `crypto.subtle` | — |
| PDF **text** extraction (cheap first-pass, no AI) | no | `unpdf` — a serverless/WASM pdf.js build with no Node deps; `import { extractText } from 'unpdf'`. Text only. |

> **PDFs in a server function:** for a cheap text-layer check use `unpdf` (edge-safe, WASM). For
> anything heavier — rendering pages, vision extraction, **barcode/QR decode**, or prepress/spot-colour
> inspection, **OCR of small print** — call the platform tools `pdf.render` / `pdf.extract` /
> `pdf.decodeBarcodes` / `pdf.inspectGraphics` / `image.ocr` via `ai.tools.run`; those run in the full
> platform runtime, not the sandbox.

**The common actions, and how to do each:**

| You want to… | Use | Requires |
|---|---|---|
| Call a third-party API (GET/POST) | `ctx.fetch(url, init)` — the standard Fetch API | capability `network` or `network:<host>` |
| Read a secret (API key, signing key) | `await ctx.secrets.get('<ref>')` | capability `secrets:<ref>` |
| Hash / HMAC-sign / verify / encrypt | `crypto.subtle` (Web Crypto) | — |
| Random id / bytes | `crypto.randomUUID()` / `crypto.getRandomValues()` | — |
| Read or write SmartLinks data | `ctx.sl.*` (records, products, attestations, …) | the matching `sl:<res>:<read\|write>` |
| Read/write your app's own data (config, URLs, counters, arrays) | `ctx.sl.appData.get()` / `ctx.sl.appData.set({…})` — collection-scoped by default; `ctx.sl.appData.global.*` (or `{ scope:'global' }`, or declare `dataScope:'global'`) for the app-wide bucket. It's your OWN namespace, so **any** authority may read/write it | `sl:data:read` / `sl:data:write` |
| Read ANOTHER app's data (as the caller may see it) | `ctx.sl.app('other-app').data.get()` — caller-authority, this collection, public-filtered, read-only | `sl:data:read` |
| Guarantee a UNIQUE claim (pool of numbers, one-per-user, idempotency key) | `ctx.sl.appRecords.create({ ref: 'ball:57' })` — the DB unique index rejects a duplicate `ref` (catch = "already taken") | `sl:records:write` |

Notes:
- **Talking to the SmartLinks core is `ctx.sl`, not HTTP.** The common pattern — *validate /
  process, then act on the core* — is: check the input, then call `ctx.sl.appRecords.create(…)`,
  `ctx.sl.products.update(…)`, etc. `ctx.sl` is already authenticated as your declared authority
  and capped by your capabilities, so you never construct a SmartLinks API URL or carry a key.
  Use `fetch`/`ctx.fetch` for *third-party* servers; use `ctx.sl` for SmartLinks itself.
- **There is one `fetch`, and it is capability-gated.** Whether you call the global `fetch` or
  `ctx.fetch`, the behaviour is identical: the call **throws** unless your declared `network`
  (or `network:<host>`) capability covers the target host — the same way Deno's `fetch` throws
  without `--allow-net`. There is no ungated escape hatch. Declare the hosts you need.
- **Secrets are read-only at runtime.** You fetch a secret you declared; you do **not** set or
  rotate secrets from a function — that's an admin/deploy-time operation on the platform.
- **Signing a webhook / verifying a signature** is `crypto.subtle` with an HMAC key imported
  from a secret — no Node `crypto` needed.

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

## Scheduled functions (cron)

A `cron` function runs on a schedule, on **every collection that has the app installed**, with
`collection` authority (there's no caller). It's the shape for polling another system ("pull new
orders every 15 minutes"), nightly reconciles, digests and clean-ups.

```jsonc
{
  "name": "pullOrders",
  "trigger": { "type": "cron", "schedule": "*/15 * * * *" },
  "capabilities": ["sl:records:write", "network:api.example-shop.com", "secrets:shop-api-key"]
},
{
  "name": "morningDigest",
  "trigger": { "type": "cron", "schedule": "0 9 * * MON-FRI", "timezone": "Europe/London" },
  "capabilities": ["sl:records:read", "network:hooks.slack.com", "secrets:slack-webhook"]
}
```

- **`schedule`** — standard 5-field cron: minute, hour, day-of-month, month, day-of-week. Lists,
  ranges and steps (`0,30`, `9-17`, `*/15`), month and day names (`JAN`, `MON-FRI`; Sunday is 0 or 7),
  and `@hourly` / `@daily` / `@weekly` / `@monthly` / `@yearly`. When both day-of-month and
  day-of-week are restricted, a day matching either fires (as in cron).
- **`timezone`** *(optional)* — an IANA zone like `"Europe/London"`; the schedule follows its
  summer time. Default UTC.
- **At most every 5 minutes.** A faster schedule, a bad expression or an unknown zone fails the
  release (`SCHEDULE_INVALID`), so it never silently doesn't run.

**What runs:** each installation runs the current release of the channel it's installed on, so a
test collection with the app on `dev` runs your dev build on its schedule. Disabled installs and
expired dev installs don't run.

**The event** your handler receives:

```ts
{ type: 'cron', schedule: '*/15 * * * *', timezone: null, scheduledAt: '2026-10-06T10:15:00.000Z' }
```

`scheduledAt` is the minute the run was due, which is not always the moment it starts: runs queue,
and a late one still carries its own minute. Use it, not `Date.now()`, as the end of the window
you're syncing.

**Write it to be safe to run twice.** Each (collection, function, minute) is enqueued once, but a
run that fails part-way can be retried, and a slow run can still be going when the next one starts.
Keep a cursor (last `scheduledAt` or the other system's own cursor) in the app's records or config,
and upsert by the other system's ID instead of inserting blindly.

Each run is logged like any other function run, and a failure shows in the collection's Errors view.

---

## Invoking an http function

An `http` function is called by POSTing to the app-scoped functions endpoint on the
surface that matches its `visibility`:

```
POST /admin/collection/:collectionId/app/:appId/functions/:name    # visibility: admin  (collection-admin auth)
POST /public/collection/:collectionId/app/:appId/functions/:name   # visibility: public (auth optional)
GET  /{admin|public}/collection/:collectionId/app/:appId/functions # list this app's functions on the surface
POST /{admin|public}/collection/:collectionId/app/:appId/dev/functions/:name  # a specific channel's release
```

Add a channel segment to run a specific release: `/app/:appId/dev/functions/:name` (also `alpha`,
`beta`, `stable`; anything else is a 404). Without one, the collection's installed release runs.
The app must be installed on the collection, on the app's restricted list, or a public app (see
"Where it runs"); otherwise `404 APP_NOT_INSTALLED`.

The bare-name form (`/collection/:c/functions/:name`, no `/app/:appId`) is a **deprecated alias**:
it searches only the collection's **enabled** apps, resolves by name, lets a first-party builtin
win, and returns `409 AMBIGUOUS_FUNCTION` when two enabled apps define the same name. Prefer the
app-scoped route (the SDK emits it automatically once an appId is set — see "Calling a function
from your app").

The handler receives the request as `event`: `event.body` (parsed JSON), `event.query`,
`event.headers`, `event.rawBody` (raw bytes, for XML/form/other inputs), and `event.contentType`.
A function only runs on its own surface — calling an `admin` function on the public endpoint is a
`403`. `GET` on either endpoint lists the functions callable on that surface.

**Response contract — your return IS the response (no envelope):**
- Return a **plain value** → it becomes the JSON body, HTTP `200`. (`SL.functions.call()` gives you
  that value directly — `res.value`, not `res.result.value`.)
- Return a web-standard **`Response`** → passed through verbatim: your status, headers, content-type
  and body (XML, CSV, text, binary, redirect, custom status). `Response` is a runtime global.
  ```js
  return new Response(toXml(data), { status: 200, headers: { "content-type": "application/xml" } })
  ```
- **Throw** → HTTP `500` `{ error: "FUNCTION_ERROR", message, code }`. For *expected* errors (400/404/
  409…), return a `Response` with your own status + body.

One rule: **plain object ⇒ 200; want any other status/headers/content-type ⇒ return a `Response`.**
Timing comes back in an `X-SL-Function-Duration-Ms` header (admin surface); your `ctx.log` lines land
in the collection's Errors & Activity feed — the body stays purely your output.

The admin surface is collection-admin gated, so an admin function's `caller` authority runs
at admin level, attributed to the signed-in admin. The public surface resolves auth if a
token is present (→ `owner`) and treats its absence as anonymous (→ `public`); a
`collection`-authority function runs elevated regardless.

### Before it will resolve

An http call returns `404 FUNCTION_NOT_FOUND` unless **both** of these are true (this is the
most common first-run surprise):

1. **The app's release is registered on the channel** the collection follows (see
   [deploying-apps.md](deploying-apps.md)) — that's what publishes the function bundle into
   the registry the runtime loads from.
2. **The app is enabled on the collection** (`appConfig.apps[]`, on that same channel — see
   [appConfig.md](appConfig.md)).

So the end-to-end path is: *write → register the release → enable on a collection → call.*

### Seeing your function's runs and logs

Every invocation is recorded as an **execution** activity event, carrying your `ctx.log`
lines. Where to look, easiest first:

- **Admin-surface response** — timing comes back in the `X-SL-Function-Duration-Ms` header (logs are in Errors & Activity, not the body).
- **Deployed test mode** — see below; real run, isolated logging.
- **Owner console** — the collection's **Advanced → Errors & Activity → events** tab,
  filtered to **source = execution**: each run shows as `function <name> ok` (or an error),
  and the detail carries your `ctx.log` output. (Telemetry is streamed, so allow a few
  seconds.)

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
