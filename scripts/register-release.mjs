#!/usr/bin/env node
/**
 * register-release — the post-build "register on publish" step for a SmartLinks app.
 *
 * Runs at the END of a build (after the bundles are built + hashed): reads the built
 * app.manifest.json and POSTs it to the SmartLinks install endpoint so the release is
 * validated + recorded in the registry (push model). Exits non-zero on failure so a bad
 * manifest / function fails the publish.
 *
 * ONE script for both paths:
 *   - dev from Lovable  → SMARTLINKS_CHANNEL=dev, dev deploy key, bundleBaseUrl = your Lovable URL
 *   - prod/beta via CI  → SMARTLINKS_CHANNEL=stable|beta, prod key, bundleBaseUrl = the CDN base
 *
 * IDENTITY (important): the SmartLinks app id is assigned by the PLATFORM, not self-declared in
 * the manifest. Pass it as SMARTLINKS_APP_ID. The manifest's meta.appId is ignored by the
 * backend (the installed id is authoritative); if they differ the backend just warns. If
 * SMARTLINKS_APP_ID is unset we fall back to manifest.meta.appId with a warning — set it.
 *
 * Env:
 *   SMARTLINKS_APP_ID            the app's platform id (REQUIRED for correctness; per-project)
 *   SMARTLINKS_DEPLOY_KEY        channel-scoped deploy key (dev key is safe to keep as a Lovable
 *                                workspace Build Secret — its scope is the dev channel only)
 *   SMARTLINKS_CHANNEL           dev | alpha | beta | stable (also accepts legacy 'prod' → stable);
 *                                UNSET ⇒ skip quietly (preview/live-edit builds never register)
 *   SMARTLINKS_API               API host (default https://smartlinks.app); a VPC env uses its own
 *   SMARTLINKS_BUNDLE_BASE_URL   where the built files are served (dev: your Lovable URL;
 *                                prod: https://smartlinks.app/apps/<appId>/<version>)
 *   SMARTLINKS_MANIFEST          manifest path (default dist/app.manifest.json)
 */

import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const API      = process.env.SMARTLINKS_API || 'https://smartlinks.app'
const KEY      = process.env.SMARTLINKS_DEPLOY_KEY
const CHANNEL  = process.env.SMARTLINKS_CHANNEL
const MANIFEST = process.env.SMARTLINKS_MANIFEST || 'dist/app.manifest.json'

// --- Gate: only register when this build is meant to ship a release ---
if (!CHANNEL) {
  console.log('ℹ︎ SmartLinks: SMARTLINKS_CHANNEL unset — skipping release registration (preview build).')
  process.exit(0)
}
if (!KEY) {
  // A prod/beta build with no key is a real misconfiguration; dev skips quietly.
  if (CHANNEL !== 'dev') { console.error(`❌ SmartLinks: "${CHANNEL}" build but SMARTLINKS_DEPLOY_KEY is missing`); process.exit(1) }
  console.log(`ℹ︎ SmartLinks: no deploy key for "${CHANNEL}" — skipping registration.`)
  process.exit(0)
}

let manifest
try {
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
} catch (e) {
  console.error(`❌ SmartLinks: could not read manifest at ${MANIFEST} — ${e.message}`)
  process.exit(1)
}

// The platform id is authoritative. Fall back to the manifest's declared id only if it wasn't
// injected — and say so, because that self-declared id is exactly what drifts.
let appId = process.env.SMARTLINKS_APP_ID
if (!appId) {
  appId = manifest?.meta?.appId
  console.warn(`⚠︎ SmartLinks: SMARTLINKS_APP_ID not set — falling back to manifest.meta.appId "${appId}". Set SMARTLINKS_APP_ID to the platform id to be safe.`)
}
if (!appId) { console.error('❌ SmartLinks: no app id (set SMARTLINKS_APP_ID)'); process.exit(1) }

const version = String(manifest?.meta?.version || '')
if (!version) { console.error('❌ SmartLinks: manifest.meta.version is required'); process.exit(1) }

const gitHash = (() => { try { return execSync('git rev-parse --short HEAD').toString().trim() } catch { return null } })()
const bundleBaseUrl = process.env.SMARTLINKS_BUNDLE_BASE_URL || `${API}/apps/${appId}/${version}`

const res = await fetch(`${API}/api/v1/apps/${appId}/releases`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-smartlinks-deploy-key': KEY },
  body: JSON.stringify({
    channel: CHANNEL, version, manifest, bundleBaseUrl,
    build: { at: new Date().toISOString(), gitHash, builder: CHANNEL === 'dev' ? 'lovable' : 'ci' },
  }),
}).catch((e) => { console.error(`❌ SmartLinks: request failed — ${e.message}`); process.exit(1) })

const body = await res.json().catch(() => ({}))
if (!res.ok || !body.ok) {
  console.error(`❌ SmartLinks registration failed (${res.status}):`)
  for (const e of body.errors || []) console.error(`   • ${e.path}: ${e.message}`)
  process.exit(1) // fail the build
}
// Non-blocking warnings (e.g. the manifest declared a different id, which the platform ignores).
for (const w of body.warnings || []) console.warn(`   ⚠︎ ${w.path}: ${w.message}`)
console.log(`✅ Registered ${appId}@${version} on "${body.channel || CHANNEL}" — functions: ${(body.functions || []).join(', ') || 'none'}`)
