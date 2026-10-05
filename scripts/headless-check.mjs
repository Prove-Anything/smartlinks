#!/usr/bin/env node
// =============================================================================
// smartlinks-headless — check an app's headless-provider declaration (manifest `data` + `headless`).
//
//   smartlinks-headless [appDir]                                  # the declaration on its own
//   smartlinks-headless [appDir] --collection <id> --app <appId>  # also against real public data
//   smartlinks-headless ... --json                                # machine-readable result
//
// With --collection/--app it samples each record type's PUBLIC items from that collection and reports
// fields the real data has that the declaration doesn't (and values that don't fit their type).
// API base: --api <url>, else SMARTLINKS_API_BASE, else https://smartlinks.app/api/v1.
// Spec: docs/headless-providers.md. Exit code: 0 = valid, 1 = errors.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const { validate } = await import(pathToFileURL(resolve(here, '../dist/headless.js')).href)

const args = process.argv.slice(2)
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined }
const json = args.includes('--json')
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--json'))
const appDir = resolve(positional[0] || process.cwd())
const collectionId = flag('collection')
const appId = flag('app')
const apiBase = (flag('api') || process.env.SMARTLINKS_API_BASE || 'https://smartlinks.app/api/v1').replace(/\/+$/, '')

const C = process.stdout.isTTY && !json
  ? { red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', dim: '\x1b[2m', bold: '\x1b[1m', reset: '\x1b[0m' }
  : { red: '', green: '', yellow: '', dim: '', bold: '', reset: '' }

function fail(message) {
  if (json) console.log(JSON.stringify({ ok: false, errors: [{ path: '', message }], warnings: [], recipes: {} }))
  else console.error(`${C.red}smartlinks-headless: ${message}${C.reset}`)
  process.exit(1)
}

const manifestPath = ['public/app.manifest.json', 'app.manifest.json', 'dist/app.manifest.json'].map((p) => join(appDir, p)).find(existsSync)
if (!manifestPath) fail(`no app.manifest.json under ${appDir} (looked in public/, ., dist/)`)
let manifest
try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) } catch (e) { fail(`can't parse ${manifestPath}: ${e.message}`) }

// Real public items per record type, when a collection is given.
const samples = {}
const sampled = []
if (collectionId && appId && manifest.data && manifest.data.types) {
  for (const [typeId, type] of Object.entries(manifest.data.types)) {
    if (!type || !type.storage || type.storage.kind !== 'record' || !type.storage.recordType) continue
    const url = `${apiBase}/public/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/records?recordType=${encodeURIComponent(type.storage.recordType)}&limit=25`
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) { sampled.push(`${typeId}: HTTP ${res.status}`); continue }
      const body = await res.json()
      const items = (Array.isArray(body) ? body : body.data || body.items || []).map((r) => (r && r.data) || {})
      samples[typeId] = items
      sampled.push(`${typeId}: ${items.length} public item${items.length === 1 ? '' : 's'}`)
    } catch (e) {
      sampled.push(`${typeId}: ${e.message}`)
    }
  }
} else if (collectionId || appId) {
  fail('--collection and --app go together')
}

const result = validate(manifest, { samples })

if (json) {
  console.log(JSON.stringify({ ...result, manifest: manifestPath, sampled }, null, 2))
  process.exit(result.ok ? 0 : 1)
}

console.log(`${C.bold}smartlinks-headless${C.reset} ${C.dim}${manifestPath}${C.reset}`)
if (!manifest.headless) console.log(`${C.dim}No "headless" block: checking the data declaration only.${C.reset}`)
if (sampled.length) console.log(`${C.dim}Sampled from ${collectionId}: ${sampled.join('; ')}${C.reset}`)
for (const e of result.errors) console.log(`${C.red}✗ ${e.path}${C.reset}  ${e.message}`)
for (const w of result.warnings) console.log(`${C.yellow}! ${w.path}${C.reset}  ${w.message}`)
if (Object.keys(result.recipes).length) {
  console.log(`\n${C.bold}Read recipes${C.reset}`)
  for (const [t, r] of Object.entries(result.recipes)) console.log(`  ${t}\n    list: ${r.list}${r.get ? `\n    get:  ${r.get}` : ''}`)
}
console.log(result.ok
  ? `\n${C.green}✓ valid${result.warnings.length ? ` (${result.warnings.length} warning${result.warnings.length === 1 ? '' : 's'})` : ''}${C.reset}`
  : `\n${C.red}${result.errors.length} error${result.errors.length === 1 ? '' : 's'}${C.reset}`)
process.exit(result.ok ? 0 : 1)
