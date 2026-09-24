// Ship the CSS baseline: copy src/baseline.css → dist/baseline.css and extract its
// `sl-*` class list → dist/baseline.classes.json (generated from the SAME file so the
// stylesheet and its class-list can't drift — that's the contract's safety property).
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, '../src/baseline.css')
const outCss = resolve(here, '../dist/baseline.css')
const outJson = resolve(here, '../dist/baseline.classes.json')

const css = readFileSync(src, 'utf8')
copyFileSync(src, outCss)

// Ship the host-theming preset + the iframe theme/prefs bootstrap alongside the baseline
// (static copies — see docs/theme-tokens.md).
copyFileSync(resolve(here, '../src/theme.css'), resolve(here, '../dist/theme.css'))
copyFileSync(resolve(here, '../src/theme-boot.js'), resolve(here, '../dist/theme-boot.js'))

// Every class selector in the file (deduped, sorted). Matches `.sl-...` tokens.
const classes = [...new Set([...css.matchAll(/\.(sl-[a-z0-9-]+)/g)].map((m) => m[1]))].sort()

const VERSION = 'v1' // the frozen contract version; bump only for a v2 (additive) release
writeFileSync(outJson, JSON.stringify({ version: VERSION, classes }, null, 2) + '\n')

console.log(`✓ baseline.css copied; baseline.classes.json = ${classes.length} classes (${VERSION})`)
