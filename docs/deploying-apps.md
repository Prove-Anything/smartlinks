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

1. **The install endpoint (API host)** — *where you register*. This is a SmartLinks
   **API v1** endpoint, and its **host is the environment** you're installing into (see
   below). This is the one that varies per deployment.
2. **The bundle CDN** — *where your files are served from*. **Today always `smartlinks.app`**:

   ```
   https://smartlinks.app/apps/{appId}/{version}/app.manifest.json
   https://smartlinks.app/apps/{appId}/{version}/widgets-<hash>.umd.js
   https://smartlinks.app/apps/{appId}/{version}/functions.umd.js
   ```

   That base — `https://smartlinks.app/apps/{appId}/{version}` — is your **`bundleBaseUrl`**,
   which you pass at registration. Always pass it explicitly so nothing breaks if the CDN
   location changes later.

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

Registration is authenticated by a **deploy key** — not a user login — scoped to the
channels it may write. Security comes from the *scope*, so a key that leaks can only affect
what it was allowed to touch.

| Key | Lives in | May write |
|---|---|---|
| **Dev key** | your app's (private) source / build env | `dev` channel only |
| **Prod master key** | your Cloud Build toolset only — never in app source | all channels |
| **Per-app key** *(future)* | a client's build | one specific app |

Because a Lovable build has no secret store, the **dev key lives in your app source** — which
is safe precisely because it can only ever write the `dev` channel. The **prod key stays in
Cloud Build**. Present the key in the `x-smartlinks-deploy-key` header.

---

## The registration endpoint

```
POST https://<smartlinks-api>/api/v1/apps/{appId}/releases
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

const API      = process.env.SMARTLINKS_API      || 'https://api.smartlinks.app'
const KEY      = process.env.SMARTLINKS_DEPLOY_KEY               // dev key (in source/env) or prod key (Cloud Build)
const CHANNEL  = process.env.SMARTLINKS_CHANNEL  || 'dev'        // 'prod' in Cloud Build

const manifest = JSON.parse(readFileSync('dist/app.manifest.json', 'utf8'))
const appId    = manifest.meta.appId
const version  = manifest.meta.version
const gitHash  = (() => { try { return execSync('git rev-parse --short HEAD').toString().trim() } catch { return null } })()

const res = await fetch(`${API}/api/v1/apps/${appId}/releases`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-smartlinks-deploy-key': KEY },
  body: JSON.stringify({
    channel: CHANNEL,
    version,
    build: { at: new Date().toISOString(), gitHash, builder: CHANNEL === 'dev' ? 'lovable' : 'cloudbuild' },
    manifest,
    bundleBaseUrl: `https://smartlinks.app/apps/${appId}/${version}`,
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

Wire it after your bundle build/hash step, e.g.:

```jsonc
// package.json
"scripts": {
  "build":     "vite build && … && node scripts/hash-bundles.mjs",
  "postbuild": "node scripts/register-release.mjs"
}
```

- **Dev (Lovable "Publish")** runs `build` → `postbuild` with the **dev key** and
  `SMARTLINKS_CHANNEL=dev`.
- **Prod (Cloud Build)** runs the same with the **prod key** and `SMARTLINKS_CHANNEL=prod`.

That's it: hitting Publish now validates and registers your app — and a broken manifest or
function stops the deploy with an actionable error instead of shipping.
