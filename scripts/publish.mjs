#!/usr/bin/env node
/**
 * publish — the FAST dev publish for a SmartLinks app. Builds nothing itself: it takes an already-
 * built `dist/`, uploads it to the SmartLinks publish endpoint, which writes it straight to the CDN
 * (dev = no-store, instantly fresh) and registers the release. One call = host + register, no Cloud
 * Build, no Lovable. Works from anywhere: local, Claude, CI, or a build step.
 *
 *   smartlinks-publish                 # build dist/ yourself first, then this
 *   smartlinks-publish --watch         # re-publish on file change (save → live)
 *
 * Env:
 *   SMARTLINKS_APP_ID       the platform app id (required)
 *   SMARTLINKS_DEPLOY_KEY   channel-scoped deploy key (dev key is dev-only, safe to keep locally)
 *   SMARTLINKS_API          API host (default https://smartlinks.app)
 *   SMARTLINKS_CHANNEL      channel (default dev; only dev is supported by this fast path today)
 * Flags: --dir <dist>  --watch  --channel <dev>
 */

import { readFileSync, readdirSync, statSync, watch } from 'node:fs'
import { join, relative, sep } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, def) => { const i = args.indexOf(name); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : def }

const API = process.env.SMARTLINKS_API || 'https://smartlinks.app'
const KEY = process.env.SMARTLINKS_DEPLOY_KEY
const APP_ID = process.env.SMARTLINKS_APP_ID
const CHANNEL = flag('--channel', process.env.SMARTLINKS_CHANNEL || 'dev')
const DIR = flag('--dir', 'dist')
const WATCH = args.includes('--watch')

// Mirror of the server's write allowlist — a bundle is static web assets only.
const ALLOWED = new Set(['.js', '.mjs', '.css', '.json', '.map', '.wasm', '.html', '.txt',
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.woff', '.woff2', '.ttf', '.otf'])
const extOf = (p) => { const i = p.lastIndexOf('.'); return i < 0 ? '' : p.slice(i).toLowerCase() }

function fail(msg) { console.error(`❌ ${msg}`); process.exit(1) }
if (!APP_ID) fail('SMARTLINKS_APP_ID is required')
if (!KEY) fail('SMARTLINKS_DEPLOY_KEY is required')

function collectFiles(dir) {
  const out = {}
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name)
      if (e.isDirectory()) { walk(full); continue }
      if (!ALLOWED.has(extOf(e.name))) continue
      const rel = relative(dir, full).split(sep).join('/') // forward slashes for the bucket
      out[rel] = readFileSync(full).toString('base64')
    }
  }
  walk(dir)
  return out
}

async function publishOnce() {
  let stat
  try { stat = statSync(DIR) } catch { fail(`build dir not found: ${DIR} (build first)`) }
  if (!stat.isDirectory()) fail(`${DIR} is not a directory`)

  const files = collectFiles(DIR)
  if (!files['app.manifest.json']) fail(`${DIR}/app.manifest.json not found — is this a built app bundle?`)

  const t0 = Date.now()
  const res = await fetch(`${API}/api/v1/apps/${APP_ID}/publish?channel=${encodeURIComponent(CHANNEL)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-smartlinks-deploy-key': KEY },
    body: JSON.stringify({ files }),
  }).catch((e) => fail(`request failed — ${e.message}`))

  const b = await res.json().catch(() => ({}))
  if (!res.ok || !b.ok) {
    console.error(`❌ publish failed (${res.status}):`)
    for (const e of b.errors || []) console.error(`   • ${e.path || ''}: ${e.message}`)
    if (WATCH) return false // keep watching; don't exit
    process.exit(1)
  }
  for (const w of b.warnings || []) console.warn(`   ⚠︎ ${w.path}: ${w.message}`)
  console.log(`✅ ${APP_ID}@${b.version} → ${CHANNEL} (${Object.keys(files).length} files, ${Date.now() - t0}ms) — functions: ${(b.functions || []).join(', ') || 'none'}`)
  console.log(`   ${b.bundleBaseUrl}`)
  return true
}

if (!WATCH) {
  await publishOnce()
} else {
  console.log(`👀 watching ${DIR} — publishing ${APP_ID} to ${CHANNEL} on change (Ctrl+C to stop)`)
  await publishOnce()
  let timer = null
  let publishing = false
  watch(DIR, { recursive: true }, () => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      if (publishing) return
      publishing = true
      try { await publishOnce() } finally { publishing = false }
    }, 300) // debounce a burst of file writes from one build
  })
}
