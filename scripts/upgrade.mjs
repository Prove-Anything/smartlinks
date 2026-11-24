#!/usr/bin/env node
// =============================================================================
// smartlinks-upgrade — move an app's code to this major of the SDK.
//
// It does what is mechanical (a call that only changed name, an argument that went, the manifest's
// shared-dependency contract) and lists every other place that needs changing, with what to change it
// to. It works from upgrade/<major>.json in this package: the same table the guide
// docs/upgrading-to-<major>.md is filled from.
//
// Usage (in the app, with this SDK major installed):
//   npx smartlinks-upgrade                 # show what it would change, and the work left
//   npx smartlinks-upgrade --write         # make the mechanical changes
//   npx smartlinks-upgrade --report FILE   # also save the list as Markdown
//   npx smartlinks-upgrade [appDir] --json # the plan as JSON
//
// It never installs, builds, commits or releases anything.
// Exit code: 0 = ran; 1 = could not run (no TypeScript, unreadable app).
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { upgradeApp, formatReport, summary } from './lib/upgrade.mjs'

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const value = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null }
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--report' && args[i - 1] !== '--to')

if (flag('--help') || flag('-h')) {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'))
  process.exit(0)
}

const here = path.dirname(fileURLToPath(import.meta.url))
const own = JSON.parse(fs.readFileSync(path.join(here, '..', 'package.json'), 'utf8'))
const major = value('--to') || String(own.version).split('.')[0]
const dir = path.resolve(positional[0] || process.cwd())
const write = flag('--write')

try {
  const result = upgradeApp({ dir, major, write })
  if (flag('--json')) {
    const { table: _t, ...plain } = result
    console.log(JSON.stringify(plain, null, 2))
  } else {
    const report = formatReport(result, { write })
    console.log(report)
    console.log(summary(result))
    const to = value('--report')
    if (to) { fs.mkdirSync(path.dirname(path.resolve(dir, to)), { recursive: true }); fs.writeFileSync(path.resolve(dir, to), report); console.log(`Saved to ${to}`) }
  }
} catch (e) {
  console.error(`smartlinks-upgrade: ${e && e.message ? e.message : e}`)
  process.exit(1)
}
