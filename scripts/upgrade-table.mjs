#!/usr/bin/env node
// Fills the tables in docs/upgrading-to-<major>.md from upgrade/<major>.json, so the guide people read and
// the data scripts and agents read are the same facts.
//
//   node scripts/upgrade-table.mjs          # rewrite the tables
//   node scripts/upgrade-table.mjs --check  # exit 1 if the guide is out of date (for CI / prepublish)
//
// upgrade/<major>.json is the source. Edit it, then run this.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const major = process.argv.find((a) => /^\d+$/.test(a)) || '3'
const check = process.argv.includes('--check')

const table = JSON.parse(fs.readFileSync(path.join(root, 'upgrade', `${major}.json`), 'utf8'))
const guidePath = path.join(root, 'docs', `upgrading-to-${major}.md`)
const before = fs.readFileSync(guidePath, 'utf8')
const eol = before.includes('\r\n') ? '\r\n' : '\n'

const cell = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim()
const code = (v) => (v ? '`' + String(v).replace(/`/g, '') + '`' : '')
const rows = (kind) => table.changes.filter((c) => c.kind === kind)

function names() {
  const renamed = rows('renamed')
  const removed = rows('removed')
  const out = []
  if (renamed.length) {
    out.push('**Renamed** (the same call under a new name):', '', '| SDK 2 | SDK 3 | Note |', '|---|---|---|')
    for (const c of renamed) out.push(`| ${code(c.name)} | ${code(c.to)} | ${cell(c.note)} |`)
    out.push('')
  }
  if (removed.length) {
    out.push('**Removed** (no like-for-like call):', '', '| SDK 2 | Do this instead |', '|---|---|')
    for (const c of removed) out.push(`| ${code(c.name)} | ${cell([c.to ? 'Use ' + code(c.to) + '.' : '', c.note].filter(Boolean).join(' '))} |`)
    out.push('')
  }
  return out
}

function options() {
  const out = ['| Function | Option | Why, and what to do |', '|---|---|---|']
  for (const c of rows('option')) out.push(`| ${code(c.name)} | ${code(c.option)} | ${cell(c.note)} |`)
  return out
}

function lists() {
  const all = rows('list')
  const out = [`${all.length} functions. \`ListResult<T>\` is \`{ items: T[], nextCursor, count? }\`.`, '',
    '| Function | SDK 2 returned | SDK 3 returns | Options |', '|---|---|---|---|']
  for (const c of all) {
    const opts = [
      (c.optionsRemoved || []).length ? 'no ' + c.optionsRemoved.map(code).join(', ') : '',
      (c.optionsAdded || []).length ? 'now ' + c.optionsAdded.map(code).join(', ') : '',
    ].filter(Boolean).join('; ')
    out.push(`| ${code(c.name)} | ${code(c.before)} | ${code(c.after)} | ${opts} |`)
  }
  return out
}

function fill(text, name, lines) {
  const start = `<!-- upgrade-table:${name}:start -->`
  const end = `<!-- upgrade-table:${name}:end -->`
  const a = text.indexOf(start)
  const b = text.indexOf(end)
  if (a < 0 || b < 0 || b < a) throw new Error(`${path.basename(guidePath)} has no "${name}" table markers`)
  return text.slice(0, a + start.length) + eol + lines.join(eol) + eol + text.slice(b)
}

let after = before
after = fill(after, 'names', names())
after = fill(after, 'options', options())
after = fill(after, 'lists', lists())

if (check) {
  if (after !== before) { console.error(`docs/upgrading-to-${major}.md is out of date: run "node scripts/upgrade-table.mjs"`); process.exit(1) }
  console.log(`docs/upgrading-to-${major}.md matches upgrade/${major}.json`)
} else {
  fs.writeFileSync(guidePath, after)
  console.log(`docs/upgrading-to-${major}.md: ${rows('renamed').length} renamed, ${rows('removed').length} removed, ${rows('option').length} options, ${rows('list').length} lists`)
}
