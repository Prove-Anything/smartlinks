#!/usr/bin/env node
// =============================================================================
// smartlinks-upgrade — move an app's code to this major of the SDK.
//
// It does what is mechanical (a call that only changed name, an argument that went, the manifest's
// shared-dependency contract) and lists every other place that needs changing, with what to change it
// to. It works from upgrade/<major>.json in this package: the same table the guide
// docs/upgrading-to-<major>.md is filled from.
//
// The move is a series of passes, done in order, one at a time. Each is finished when its check
// passes, not when it looks finished:
//
//   automatic   the renames the script makes itself
//   replace     calls that no longer exist, options that went
//   lists       every list's new result and the standard words (the type-check finishes this one)
//   pages       a list that used to return everything: one page, or all of them?
//   errors      error codes compared as text, the SDK read from window
//
// Usage (in the app, with this SDK major installed):
//   npx smartlinks-upgrade                 # the passes, and every place left in each
//   npx smartlinks-upgrade --write         # make the automatic changes
//   npx smartlinks-upgrade --check         # is anything left? exits 0 when nothing is, 2 when something is
//   npx smartlinks-upgrade --check pages   # the same for one pass, listing only its places
//   npx smartlinks-upgrade --report FILE   # also save what is printed as Markdown
//   npx smartlinks-upgrade [appDir] --json # the plan as JSON (with `passes`)
//
// A place only a person can judge (the first page is all that's wanted; a comparison is right as it
// is) is settled by a comment on the line above it:   // sl-upgrade: ok <why>
//
// It never installs, builds, commits or releases anything.
// Exit code: 0 = ran (with --check: nothing left); 1 = could not run (no TypeScript, unreadable app);
//            2 = --check found places left.
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { upgradeApp, formatReport, summary, passesOf, leftToDo } from './lib/upgrade.mjs'

const PASSES = ['automatic', 'replace', 'lists', 'pages', 'errors']
const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const value = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null }
// `--check` may be followed by a pass name.
const checkPass = flag('--check') && PASSES.includes(value('--check')) ? value('--check') : null
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--report' && args[i - 1] !== '--to' && !(args[i - 1] === '--check' && a === checkPass))

if (flag('--help') || flag('-h')) {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'))
  process.exit(0)
}

const here = path.dirname(fileURLToPath(import.meta.url))
const own = JSON.parse(fs.readFileSync(path.join(here, '..', 'package.json'), 'utf8'))
const major = value('--to') || String(own.version).split('.')[0]
const dir = path.resolve(positional[0] || process.cwd())
const write = flag('--write')
const check = flag('--check')

let left = 0
try {
  const result = upgradeApp({ dir, major, write })
  left = leftToDo(result, { write, only: checkPass })
  if (flag('--json')) {
    const { table: _t, ...plain } = result
    console.log(JSON.stringify({ ...plain, passes: passesOf(result, { write }), left }, null, 2))
  } else {
    const report = formatReport(result, { write, only: checkPass })
    console.log(report)
    console.log(summary(result, { write }))
    if (check) console.log(left ? `${left} left${checkPass ? ` in "${checkPass}"` : ''}: not finished.` : `Nothing left${checkPass ? ` in "${checkPass}"` : ''}.`)
    const to = value('--report')
    if (to) { fs.mkdirSync(path.dirname(path.resolve(dir, to)), { recursive: true }); fs.writeFileSync(path.resolve(dir, to), report); console.log(`Saved to ${to}`) }
  }
} catch (e) {
  console.error(`smartlinks-upgrade: ${e && e.message ? e.message : e}`)
  process.exit(1)
}
if (check && left) process.exit(2)
