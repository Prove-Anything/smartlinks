# Deploying & registering an app

> **Preview — SmartLinks SDK 2.0.0-alpha.** Part of the installable-app platform being built
> toward 2.0.0 stable. These APIs may change before then. Published under the npm `next` tag;
> `latest` remains 1.x.

A SmartLinks app is a bundle (widgets, containers, and — new — [server functions](server-functions.md))
described by an `app.manifest.json`. Deploying an app has two halves:

1. **Publish the bundles** to the SmartLinks app CDN.
2. **Register the release** — tell the SmartLinks backend a new version exists, hand it the
   manifest, and let it validate everything. Registration is what makes the app (and its
   server functions) known, installable, and testable.

This guide covers registration and how to wire it into your build.

---

## Two "wheres": the API host vs the bundle CDN

Deploying touches two different locations — keep them distinct:

1. **The install endpoint (API host)** — *where you register*. On the **main SaaS this is
   `https://smartlinks.app`** (the API lives under `/api/v1` — the same base your app already
   passes to `initializeApi`). A client's isolated (VPC) environment has its **own** host; you
   install into it by calling that host. This is the value that varies per deployment.
2. **The bundle CDN** — *where your built files are actually served from*, which you pass at
   registration as **`bundleBaseUrl`**. **This depends on the channel:**
   - **`dev` (Lovable):** your files are served by **Lovable at your published app URL** — that
     URL is your dev `bundleBaseUrl`. Lovable *is* the CDN for dev; nothing is uploaded to
     SmartLinks.
   - **`prod`:** files are published to the SmartLinks app CDN at
     `https://smartlinks.app/apps/{appId}/{version}/…` by your prod deploy step; that base is
     your prod `bundleBaseUrl`.

   ```
   https://smartlinks.app/apps/{appId}/{version}/app.manifest.json   # prod layout
   https://smartlinks.app/apps/{appId}/{version}/functions.umd.js
   ```

   Always pass `bundleBaseUrl` explicitly so it keeps working if a location changes.

> **Who publishes the bundles?** The platform does **not** fetch or mirror them for you —
> `bundleBaseUrl` must already serve the files at registration time. For `dev` that's Lovable
> (on Publish); for `prod` that's your own CDN deploy step. Registration records *where* the
> bundles are + the validated manifest; it does not host anything.

## Environments & the app registry

Historically an app was **stateless everywhere**: every environment fetched the same CDN
manifest on the fly, so apps were agnostic to shards, clients, and VPCs. Registration changes
that — an app is now **installed into an environment's registry**, which is **global to that
environment (not per-collection / not per-shard)**.

An **environment** is one SmartLinks deployment: the main SaaS, or a client's isolated (VPC)
instance. Each owns its own app registry, so:

- The **install endpoint's host is the environment** — `POST https://<that-env's-api>/api/v1/apps/…`.
  Installing into a client's VPC means calling *their* API with *their* deploy key.
- **Rolling out to several environments = the same call, once per target** (different API host
  + key each). The registration script below takes the API base as a parameter for exactly this.

> Enabling an app on a specific **collection** (and consenting to its capabilities) is a
> separate, per-collection step layered on top of the environment's registry.

---

## Channels

A release is registered on one **channel**, matching how you deploy:

| Channel | Deployed from | Typical use |
|---|---|---|
| `dev`  | **Lovable "Publish"** | Live development / testing |
| `beta` | your pipeline | Staging / preview |
| `prod` | your **Cloud Build** toolset (from git) | Production |

A collection chooses which channel it follows, so you can point a test collection at `dev`
and exercise a build before it reaches `prod`.

---

## Deploy keys

Registration is authenticated by a **deploy key** — not a user login — scoped to the channels
it may write. Security comes from the *scope*: a leaked key can only do what its scope allows.

| Key | Where to keep it | May write | If it leaks |
|---|---|---|---|
| **Dev key** | a **Lovable workspace Build Secret** (below) | `dev` channel, **any app in the environment** | someone can register/overwrite `dev` releases — which are served only to test collections — but **never** `beta`/`prod` |
| **Prod master key** | your CI/Cloud Build secret store **only** | all channels | full control — so keep it out of app source entirely |
| **Per-app key** *(future)* | provisioned per app | one specific app | scoped to that one app |

**Keep the dev key in Lovable Build Secrets — do not commit it.** Lovable exposes
**workspace-level Build Secrets** shared across every project in the workspace: set the dev key
there **once** and every microapp inherits it, nothing is committed, and there's a single value
to rotate. (An earlier draft of this guide said to put the key in app source — don't; use Build
Secrets.)

**Minting (current state, 2.0.0-alpha):** the `dev` and `prod` keys are **shared secrets
configured on the SmartLinks backend** — one `dev` key and one `prod` key covering all
first-party apps. There is **no self-service minting UI yet**: ask the platform owner for the
`dev` key and put it in your workspace Build Secret. Per-app keys, self-service minting, and
rotation are planned; rotating the shared `dev` key just means updating the one Build Secret
(registered releases are unaffected — the key authorizes *writes*, it isn't stored on releases).

Present the key in the `x-smartlinks-deploy-key` header.

---

## The registration endpoint

```
POST https://smartlinks.app/api/v1/apps/{appId}/releases   # main SaaS; a VPC env uses its own host
x-smartlinks-deploy-key: <your deploy key>
Content-Type: application/json
```

```jsonc
{
  "channel": "dev",                 // dev | beta | prod
  "version": "1.2.3",               // from your manifest meta.version
  "build":   { "at": "2026-09-14T10:00:00Z", "gitHash": "abc1234", "builder": "lovable" },
  "manifest": { /* your full app.manifest.json, including the functions block */ },
  "bundleBaseUrl": "https://smartlinks.app/apps/currys/1.2.3"
}
```

### Responses

| Status | Meaning |
|---|---|
| `200` | Registered. Body: `{ ok: true, appId, channel, version, functions: [names], registeredAt }` |
| `422` | Validation failed — **the build should fail**. Body: `{ ok: false, errors: [...] }` |
| `401` | Missing/invalid deploy key |
| `403` | Key not permitted for that channel (e.g. a dev key targeting `prod`) — `CHANNEL_FORBIDDEN` |

Each validation error is `{ code, message, path }`, e.g.:

```json
{ "ok": false, "errors": [
  { "code": "AUTHORITY_INVALID", "message": "invalid authority \"root\"", "path": "functions.definitions[0].authority" },
  { "code": "CAPABILITY_INVALID", "message": "invalid capability \"bogus\"", "path": "functions.definitions[0].capabilities[0]" }
]}
```

### Re-registering & version collisions

Registration is an **upsert keyed by (app, channel)** — the newest registration becomes that
channel's live release. Registering again **overwrites** it (last write wins); there is **no**
version-collision error even if `meta.version` is unchanged. So re-publishing to `dev` without
bumping the version is a normal, intentional overwrite — which is what you want on `dev`. (A
stricter `prod` policy that rejects a duplicate `version` may come later; it isn't enforced
today.)

### What gets validated

- `manifest.meta.appId` must match the `{appId}` in the URL.
- The **`functions` block** is validated with the *same* rules the runtime enforces
  (names, triggers, `visibility`/`authority`, the capability grammar, duplicate names) — so
  a malformed server function is caught **at deploy time**, not at runtime. See
  [server-functions.md](server-functions.md).

---

## Wiring it into your build

Registration is the **last step of your build** — after bundles are built and hashed. Run a
small script that reads your built manifest and POSTs it, and **exits non-zero on failure**
so a bad install fails the publish.

```js
// scripts/register-release.mjs — run as the build's postbuild step
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const API     = process.env.SMARTLINKS_API || 'https://smartlinks.app'   // a VPC env: set to its host
const KEY     = process.env.SMARTLINKS_DEPLOY_KEY                         // Lovable Build Secret (dev) / CI secret (prod)
const CHANNEL = process.env.SMARTLINKS_CHANNEL                           // 'dev' | 'beta' | 'prod'; UNSET ⇒ don't register

// --- Gate: only register when this build is meant to ---
// A preview / live-edit build (no channel) skips quietly so it never fails. A build that
// declares a channel but has no key is a hard error IF it's prod; dev skips quietly.
if (!CHANNEL) {
  console.log('ℹ︎ SmartLinks: SMARTLINKS_CHANNEL unset — skipping release registration (preview build).')
  process.exit(0)
}
if (!KEY) {
  if (CHANNEL === 'prod') { console.error('❌ prod build but SMARTLINKS_DEPLOY_KEY is missing'); process.exit(1) }
  console.log(`ℹ︎ SmartLinks: no deploy key for "${CHANNEL}" — skipping registration.`)
  process.exit(0)
}

const manifest = JSON.parse(readFileSync('dist/app.manifest.json', 'utf8'))
const appId    = manifest.meta.appId
const version  = manifest.meta.version
const gitHash  = (() => { try { return execSync('git rev-parse --short HEAD').toString().trim() } catch { return null } })()
// dev: your published Lovable URL; prod: the SmartLinks CDN base. Set SMARTLINKS_BUNDLE_BASE_URL.
const bundleBaseUrl = process.env.SMARTLINKS_BUNDLE_BASE_URL || `https://smartlinks.app/apps/${appId}/${version}`

const res = await fetch(`${API}/api/v1/apps/${appId}/releases`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-smartlinks-deploy-key': KEY },
  body: JSON.stringify({
    channel: CHANNEL, version, manifest, bundleBaseUrl,
    build: { at: new Date().toISOString(), gitHash, builder: CHANNEL === 'dev' ? 'lovable' : 'ci' },
  }),
})

const body = await res.json().catch(() => ({}))
if (!res.ok || !body.ok) {
  console.error(`❌ SmartLinks registration failed (${res.status}):`)
  for (const e of body.errors || []) console.error(`   • ${e.path}: ${e.message}`)
  process.exit(1)  // fail the build
}
console.log(`✅ Registered ${appId}@${version} on "${CHANNEL}" — functions: ${(body.functions || []).join(', ') || 'none'}`)
```

Wire it after your bundle build/hash step:

```jsonc
// package.json
"scripts": {
  "build":     "vite build && … && node scripts/hash-bundles.mjs",
  "postbuild": "node scripts/register-release.mjs"
}
```

Registration is gated by **`SMARTLINKS_CHANNEL`**, so the three Lovable build types behave correctly:

| Build | `SMARTLINKS_CHANNEL` | Result |
|---|---|---|
| **Preview / live-edit** | unset | **skips quietly** — never registers, never fails |
| **Dev (Publish)** | `dev` | registers to `dev` with the workspace Build-Secret key + your Lovable `SMARTLINKS_BUNDLE_BASE_URL` |
| **Prod (CI)** | `prod` | registers to `prod` with the prod key; a missing key **hard-fails** |

The gate is `SMARTLINKS_CHANNEL`, so **set it only where you want a release** — i.e. on the
Publish/CI build, not on preview. If your host exposes a publish-only signal (an env var it sets
only on Publish), key `SMARTLINKS_CHANNEL` off that; otherwise set it in the Publish build's env
and leave it unset for preview. That one variable is the difference between "this build ships a
release" and "this build is just a preview."

That's it: a real Publish validates + registers your app (a broken manifest or function stops
the deploy with an actionable error), while preview builds stay quiet.
