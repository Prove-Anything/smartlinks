# Deploying & registering an app

> **SmartLinks SDK 2.x** (current `latest`). Part of the installable-app platform. Install
> `@proveanything/smartlinks@^2`.

A SmartLinks app is a bundle (widgets, containers, and — new — [server functions](server-functions.md))
described by an `app.manifest.json`. Deploying an app has two halves:

1. **Publish the bundles** to the SmartLinks app CDN.
2. **Register the release** — tell the SmartLinks backend a new version exists, hand it the
   manifest, and let it validate everything. Registration is what makes the app (and its
   server functions) known, installable, and testable.

This guide covers registration and how to wire it into your build.

---

## Fast dev publish

Getting a **dev** build live should be instant and secret-free. There are two paths depending on
**where you build** — pick the one that matches your setup. Both end the same way: the dev release
is registered and served **`no-store`** (every reload is instantly fresh — no cache-busting, no CDN
invalidation).

### A. From Lovable — hit Publish, no key anywhere *(recommended for Lovable apps)*

Lovable builds and hosts your app on **Publish**. You don't push to us and you **don't put any
secret in Lovable or your repo** — instead your build *pings* us and we pull your just-published
bundle. Two small additions to your build, both non-secret:

1. **Stamp the build hash into `app.manifest.json`.** In the same build step that content-hashes
   your JS, write the hash into the manifest so we can tell when your new version is live:
   ```jsonc
   // app.manifest.json
   "build": { "hash": "a1b2c3d4", "at": "2026-09-20T10:00:00Z" }
   ```
2. **Ping us on publish** (a `postbuild` step — `SMARTLINKS_APP_ID` is an *identifier, not a
   secret*, so it's fine in the repo):
   ```jsonc
   // package.json
   "scripts": {
     "build":     "vite build && … && node scripts/hash-bundles.mjs",   // your existing hashing step
     "postbuild": "curl -fsS -X POST \"$SMARTLINKS_API/api/v1/apps/$SMARTLINKS_APP_ID/refresh-dev\" -H 'content-type: application/json' -d \"{\\\"hash\\\":\\\"$BUILD_HASH\\\"}\""
   }
   ```

That's it — no deploy key. When the ping arrives, SmartLinks looks up your app's published URL
(from the catalog — **not** from the ping, so it's safe), **waits until your manifest reports that
exact `build.hash`** (so it never grabs a half-propagated build), validates the manifest + functions,
and registers the dev release (the hash becomes the version). `POST /apps/{appId}/refresh-dev`
authorises nothing on its own — worst case it re-fetches your app's own public bundle — so it needs
no secret; it's rate-limited and de-duped per app.

**One-time setup:** the app must exist in the catalog with its **id** and its **Lovable URL**
recorded (that's how we know what to fetch, and the `id` you ping with must match). Ask the platform
owner to register the app once; after that, every Publish auto-updates dev.

**If a publish doesn't appear:** because the ping is fire-and-forget, a failure (e.g. the build
hash never went live, or an invalid manifest) happens in the background — it won't show in your
build output. Every attempt (success *and* failure, with the reason) is recorded, and the platform
owner can see it in the console at **Admin → App Registry → Recent activity**. That's the place to
look for "I hit Publish but dev didn't change."

### B. From local / CI / Claude — `smartlinks-publish`

If you build somewhere you control (so you can hold a dev key locally — never committed), push the
built bundle straight to SmartLinks, which hosts + registers it:

```bash
# build dist/ first, then:
smartlinks-publish                 # uploads dist/ → SmartLinks hosts + registers the dev release
smartlinks-publish --watch         # re-publish on every change (save → live)
```

Env: `SMARTLINKS_APP_ID`, `SMARTLINKS_DEPLOY_KEY` (dev key — dev-only, safe to keep locally),
optional `SMARTLINKS_API` / `--dir`. It POSTs the files to `POST /apps/{appId}/publish?channel=dev`;
the server validates and writes them to `smartlinks.app/apps/{appId}/dev/…` (`no-store`).

**Which to use:** building in Lovable → **A** (ping, no key). Building anywhere you control →
**B** (push with a local key). For beta/stable, see the register-a-URL flow below.

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
| `dev`   | **Lovable "Publish"** | Live development / testing |
| `alpha` | your pipeline | Early internal testing |
| `beta`  | your pipeline | Staging / preview |
| `stable`| your **Cloud Build** toolset (from git) | Production |

The canonical channels are **`dev` · `alpha` · `beta` · `stable`**. Legacy `prod`/`production`/
`live` are accepted and normalise to **`stable`** (there is no separate "prod" channel).

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
| `200` | Registered. Body: `{ ok: true, appId, channel, version, functions: [names], registeredAt, warnings? }` — `warnings` is present for non-blocking issues (e.g. `APPID_IGNORED` when the manifest declared a different id). |
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

- The **app id is the `{appId}` in the URL** — the platform-assigned id, which is authoritative
  (it's what every collection's config + the CDN path already bind to). `manifest.meta.appId` is
  **ignored** for identity: if it differs, the release still registers under the URL id and you get
  a non-blocking `APPID_IGNORED` warning. So pass your **platform id** in the URL (the script below
  reads it from `SMARTLINKS_APP_ID`), and don't rely on the manifest to declare it.
- The **`functions` block** is validated with the *same* rules the runtime enforces
  (names, triggers, `visibility`/`authority`, the capability grammar, duplicate names) — so
  a malformed server function is caught **at deploy time**, not at runtime. See
  [server-functions.md](server-functions.md).

---

## Wiring it into your build

Registration is the **last step of your build** — after bundles are built and hashed. Run a
small script that reads your built manifest and POSTs it, and **exits non-zero on failure**
so a bad install fails the publish.

The SDK ships the script, so you don't copy-paste it — run it as your postbuild step. It reads
your built manifest, POSTs it, prints any warnings, and exits non-zero on failure.

```jsonc
// package.json
"scripts": {
  "build":     "vite build && … && node scripts/hash-bundles.mjs",
  "postbuild": "smartlinks-register-release"   // ships in @proveanything/smartlinks
}
```

It is driven entirely by env vars, so the same command works for dev (Lovable) and prod (CI):

| Env var | Required | What it is |
|---|---|---|
| `SMARTLINKS_APP_ID` | **yes** | your **platform** app id — authoritative, assigned by SmartLinks (per-project). Not the manifest's `meta.appId`. |
| `SMARTLINKS_DEPLOY_KEY` | yes* | channel-scoped deploy key. *dev builds skip quietly if unset; `beta`/`stable` hard-fail. |
| `SMARTLINKS_CHANNEL` | the gate | `dev` \| `alpha` \| `beta` \| `stable` (legacy `prod` → `stable`). **UNSET ⇒ skip** (preview builds never register). |
| `SMARTLINKS_BUNDLE_BASE_URL` | recommended | where the files are served — **dev:** your Lovable URL; **prod:** the CDN base. |
| `SMARTLINKS_API` | no | API host; default `https://smartlinks.app`. A VPC env uses its own. |
| `SMARTLINKS_MANIFEST` | no | manifest path; default `dist/app.manifest.json`. |

> The full source is at `scripts/register-release.mjs` in the SDK package if you'd rather vendor it.

Registration is gated by **`SMARTLINKS_CHANNEL`**, so the three Lovable build types behave correctly:

| Build | `SMARTLINKS_CHANNEL` | Result |
|---|---|---|
| **Preview / live-edit** | unset | **skips quietly** — never registers, never fails |
| **Dev (Publish)** | `dev` | registers to `dev` with the workspace Build-Secret key + your Lovable `SMARTLINKS_BUNDLE_BASE_URL` |
| **Prod (CI)** | `stable` | registers to `stable` with the prod/master key; a missing key **hard-fails** |

**Two secrets, two scopes:** the **deploy key** is channel-scoped and can be a *workspace-level*
Lovable Build Secret shared by every app (a dev key only writes `dev`, so sharing it is safe). The
**`SMARTLINKS_APP_ID` is per-app** — set it as a *project-level* variable on each app, so each
registers under its own authoritative platform id.

The gate is `SMARTLINKS_CHANNEL`, so **set it only where you want a release** — i.e. on the
Publish/CI build, not on preview. If your host exposes a publish-only signal (an env var it sets
only on Publish), key `SMARTLINKS_CHANNEL` off that; otherwise set it in the Publish build's env
and leave it unset for preview. That one variable is the difference between "this build ships a
release" and "this build is just a preview."

That's it: a real Publish validates + registers your app (a broken manifest or function stops
the deploy with an actionable error), while preview builds stay quiet.
