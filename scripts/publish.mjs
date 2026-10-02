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
      out[rel] = readFileSync(full)
    }
  }
  walk(dir)
  return out
}

// One request carries at most this much file content (decoded). The server caps a request at 8 MB of
// content and ~10 MB of JSON; base64 adds a third, so 6 MB keeps every request comfortably under both.
const BATCH_BYTES = 6 * 1024 * 1024
const BATCH_FILES = 150

async function post(path, body) {
  const res = await fetch(`${API}/api/v1/apps/${APP_ID}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-smartlinks-deploy-key': KEY },
    body: JSON.stringify(body),
  }).catch((e) => ({ ok: false, status: 0, json: async () => ({ errors: [{ message: `request failed — ${e.message}` }] }) }))
  const b = await res.json().catch(() => ({}))
  return { res, b }
}

function reportFailure(res, b) {
  console.error(`❌ publish failed (${res.status}):`)
  for (const e of b.errors || []) console.error(`   • ${e.path || ''}: ${e.message}`)
  if (!b.errors && (b.message || b.error)) console.error(`   • ${b.message || b.error}`)
}

const toB64 = (entries) => Object.fromEntries(entries.map(([p, buf]) => [p, buf.toString('base64')]))

async function publishOnce() {
  let stat
  try { stat = statSync(DIR) } catch { fail(`build dir not found: ${DIR} (build first)`) }
  if (!stat.isDirectory()) fail(`${DIR} is not a directory`)

  const files = collectFiles(DIR)
  if (!files['app.manifest.json']) fail(`${DIR}/app.manifest.json not found — is this a built app bundle?`)

  const t0 = Date.now()
  const entries = Object.entries(files)
  const totalBytes = entries.reduce((n, [, buf]) => n + buf.length, 0)
  const qs = `?channel=${encodeURIComponent(CHANNEL)}`
  let finalBody

  if (totalBytes <= BATCH_BYTES && entries.length <= BATCH_FILES) {
    finalBody = { files: toB64(entries) } // small bundle: one request, as before
  } else {
    // Large bundle: upload everything except the manifest in batches, then send the manifest last —
    // the server only registers the release once every referenced file is confirmed uploaded.
    const rest = entries.filter(([p]) => p !== 'app.manifest.json').sort((a, b) => b[1].length - a[1].length)
    const batches = []
    let cur = [], curBytes = 0
    for (const e of rest) {
      if (cur.length && (curBytes + e[1].length > BATCH_BYTES || cur.length >= BATCH_FILES)) { batches.push(cur); cur = []; curBytes = 0 }
      if (e[1].length > BATCH_BYTES) console.warn(`   ⚠︎ ${e[0]} is ${(e[1].length / 1048576).toFixed(1)} MB — larger than one request allows; the server will likely reject it`)
      cur.push(e); curBytes += e[1].length
    }
    if (cur.length) batches.push(cur)
    console.log(`📦 ${APP_ID}: ${(totalBytes / 1048576).toFixed(1)} MB in ${entries.length} files — uploading in ${batches.length} batch(es)`)
    for (let i = 0; i < batches.length; i++) {
      const { res, b } = await post(`/publish/files${qs}`, { files: toB64(batches[i]) })
      if (!res.ok || !b.ok) {
        reportFailure(res, b)
        if (WATCH) return false
        process.exit(1)
      }
      console.log(`   ↑ batch ${i + 1}/${batches.length} (${batches[i].length} files)`)
    }
    finalBody = { files: toB64([['app.manifest.json', files['app.manifest.json']]]), uploaded: rest.map(([p]) => p) }
  }

  const { res, b } = await post(`/publish${qs}`, finalBody)
  if (!res.ok || !b.ok) {
    reportFailure(res, b)
    if (WATCH) return false // keep watching; don't exit
    process.exit(1)
  }
  for (const w of b.warnings || []) console.warn(`   ⚠︎ ${w.path}: ${w.message}`)
  console.log(`✅ ${APP_ID}@${b.version} → ${CHANNEL} (${entries.length} files, ${Date.now() - t0}ms) — functions: ${(b.functions || []).join(', ') || 'none'}`)
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
