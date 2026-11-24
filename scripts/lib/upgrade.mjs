// =============================================================================
// Moving an app to a new major of the SDK: what a script can safely do, and a list of everything else.
//
// Reads upgrade/<major>.json (the same table docs/upgrading-to-<major>.md is filled from) and the app's
// source, and:
//   1. plans the MECHANICAL edits: a call that only changed name, an argument that went, the manifest's
//      shared-dependency contract. Nothing that changes what the code means.
//   2. lists every other place the table says needs a person or an agent: each call to a list whose
//      shape changed, each removed call, each option that went, each thing to check at run time.
//
// It finds SDK calls by what a name is BOUND to, not by its spelling: `product.get(…)` is only an SDK
// call where `product` is the SDK's export (an import, `SL.product`, or taken from one of those). A
// local variable that happens to be called `product` is never touched.
//
// Used by scripts/upgrade.mjs (the `smartlinks-upgrade` command) and by the SDK's tests.
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const SDK = /^@proveanything\/smartlinks(\/.*)?$/
const SOURCE = /\.(ts|tsx|js|jsx|mjs|cjs|mts|cts)$/
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.next', '.output', '.vite', '.turbo', 'coverage', '.forge', '.lovable'])

/** The upgrade table for a major, from this package. */
export function loadTable(major = '3') {
  return JSON.parse(fs.readFileSync(path.join(here, '..', '..', 'upgrade', `${major}.json`), 'utf8'))
}

/** TypeScript's parser: the app's own copy if it has one, else whatever this package can reach. */
export function loadTypeScript(appDir) {
  for (const from of [path.join(appDir, 'package.json'), path.join(here, 'package.json')]) {
    try { return createRequire(from)('typescript') } catch { /* try the next place */ }
  }
  return null
}

function sourceFiles(appDir) {
  const out = []
  const walk = (dir, depth) => {
    let entries = []
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.') && depth < 12) walk(p, depth + 1) }
      else if (SOURCE.test(e.name) && !e.name.endsWith('.d.ts')) out.push(p)
    }
  }
  walk(appDir, 0)
  return out
}

// ── the table, indexed ───────────────────────────────────────────────────────────────────────────

function indexTable(table) {
  const renames = new Map() // old full name → new full name, mechanical only
  const removed = new Map() // name → entry (also renames a script must not do)
  const lists = new Map()
  const options = new Map() // name → [entries]
  const fields = [] // entries about a field of a type: only a person or a type-check finds these
  for (const c of table.changes) {
    if (c.kind === 'renamed' && c.mechanical) renames.set(c.name, c.to)
    else if (c.kind === 'renamed' || c.kind === 'removed') {
      if (c.what === 'field') fields.push(c)
      else removed.set(c.name, c)
    } else if (c.kind === 'list') lists.set(c.name, c)
    else if (c.kind === 'option') options.set(c.name, [...(options.get(c.name) || []), c])
  }
  const hold = new Map()
  for (const h of table.hold || []) for (const n of h.names || []) hold.set(n, h)
  return { renames, removed, lists, options, fields, hold, behaviour: table.changes.filter((c) => c.kind === 'behaviour') }
}

// ── one file ─────────────────────────────────────────────────────────────────────────────────────

function analyseFile(ts, checker, sf, idx, rel) {
  const text = sf.text
  const edits = [] // { start, end, text }
  const work = [] // { kind, name, line, note, ... }
  const lineOf = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
  const push = (kind, node, name, extra = {}) => work.push({ kind, file: rel, line: lineOf(node), name, ...extra })

  // 1. What the SDK's names are bound to in this file.
  const imports = new Map() // symbol → { imported, local, spec, decl }
  const namespaces = new Set() // symbols of `import * as X` / default imports of the SDK
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier) && SDK.test(st.moduleSpecifier.text) && st.importClause) {
      const clause = st.importClause
      if (clause.name) { const s = checker.getSymbolAtLocation(clause.name); if (s) namespaces.add(s) }
      const nb = clause.namedBindings
      if (nb && ts.isNamespaceImport(nb)) { const s = checker.getSymbolAtLocation(nb.name); if (s) namespaces.add(s) }
      if (nb && ts.isNamedImports(nb)) {
        for (const spec of nb.elements) {
          const s = checker.getSymbolAtLocation(spec.name)
          if (s) imports.set(s, { imported: (spec.propertyName || spec.name).text, local: spec.name.text, spec, decl: st })
        }
      }
    }
    // export { product } from '@proveanything/smartlinks'
    if (ts.isExportDeclaration(st) && st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) && SDK.test(st.moduleSpecifier.text) && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const spec of st.exportClause.elements) {
        const name = (spec.propertyName || spec.name).text
        const hit = [...idx.renames.keys(), ...idx.removed.keys()].find((n) => n === name || n.startsWith(name + '.'))
        if (hit) push('by-hand', spec, name, { note: `Re-exported from the SDK here. \`${name}\` is ${idx.renames.has(hit) ? 'renamed' : 'gone'} in SDK 3: change the re-export, then whatever imports it from this file.` })
      }
    }
  }

  const symbolOf = (id) => {
    if (id.parent && ts.isShorthandPropertyAssignment(id.parent) && id.parent.name === id) return checker.getShorthandAssignmentValueSymbol(id.parent)
    return checker.getSymbolAtLocation(id)
  }

  /** The SDK name an expression stands for (['products', 'list']), [] for the SDK itself, null for anything else. */
  const sdkPath = (node, depth = 0) => {
    if (!node || depth > 8) return null
    if (ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node) || ts.isAsExpression(node)) return sdkPath(node.expression, depth + 1)
    if (ts.isIdentifier(node)) {
      const sym = symbolOf(node)
      if (sym && imports.has(sym)) return [imports.get(sym).imported]
      if (sym && namespaces.has(sym)) return []
      // const { product } = SL   ·   const records = SL.app.records
      const decl = sym && sym.declarations && sym.declarations[0]
      if (decl && ts.isBindingElement(decl) && ts.isObjectBindingPattern(decl.parent) && ts.isVariableDeclaration(decl.parent.parent) && decl.parent.parent.initializer) {
        const base = sdkPath(decl.parent.parent.initializer, depth + 1)
        const key = decl.propertyName || decl.name
        if (base && ts.isIdentifier(key)) return [...base, key.text]
      }
      if (decl && ts.isVariableDeclaration(decl) && ts.isIdentifier(decl.name) && decl.initializer && decl.initializer !== node
        && ts.isVariableDeclarationList(decl.parent) && (decl.parent.flags & ts.NodeFlags.Const)) {
        const base = sdkPath(decl.initializer, depth + 1)
        if (base) return base
      }
      // The SDK handed over by a host is called SL by convention (window.SL, host.SL, a prop named SL).
      if (node.text === 'SL' || node.text === 'SL3') return []
      return null
    }
    if (ts.isPropertyAccessExpression(node)) {
      if (node.name.text === 'SL' || node.name.text === 'SL3') return []
      const base = sdkPath(node.expression, depth + 1)
      return base ? [...base, node.name.text] : null
    }
    return null
  }

  // 2. Every use of an SDK name.
  const refs = new Map() // import symbol → [identifier]
  const renameRefs = new Map() // import symbol → [{ id, to }]: uses a script may rename
  const seen = new Set() // "name@pos": one entry per place

  const objectKeys = (call) => {
    const keys = new Set()
    for (const a of call.arguments || []) if (ts.isObjectLiteralExpression(a)) for (const p of a.properties) if (p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) keys.add(p.name.text)
    return keys
  }

  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      const sym = symbolOf(node)
      const imp = sym && imports.get(sym)
      if (imp && node !== imp.spec.name && node !== imp.spec.propertyName) refs.set(sym, [...(refs.get(sym) || []), node])
    }

    const isChainTop = (ts.isPropertyAccessExpression(node) || ts.isIdentifier(node))
      && !(node.parent && ts.isPropertyAccessExpression(node.parent) && node.parent.name === node)
      && !(node.parent && (ts.isImportSpecifier(node.parent) || ts.isExportSpecifier(node.parent) || ts.isImportClause(node.parent) || ts.isNamespaceImport(node.parent)))
    if (isChainTop) {
      const p = sdkPath(node)
      if (p && p.length) {
        let name = p.join('.')
        const call = node.parent && ts.isCallExpression(node.parent) && node.parent.expression === node ? node.parent : null

        // A call that only changed name.
        if (idx.renames.has(name)) {
          const to = idx.renames.get(name)
          const [fromHead, toHead] = [name.split('.')[0], to.split('.')[0]]
          // The part that changes is the first one: `product` in product.get, or the whole of a type's name.
          let head = node
          for (let i = p.length; i > 1 && ts.isPropertyAccessExpression(head); i--) head = head.expression
          while (ts.isParenthesizedExpression(head) || ts.isNonNullExpression(head) || ts.isAsExpression(head)) head = head.expression
          if (ts.isPropertyAccessExpression(head) && head.name.text === fromHead) {
            edits.push({ start: head.name.getStart(sf), end: head.name.getEnd(), text: toHead }) // SL.product → SL.products
          } else if (ts.isIdentifier(head) && imports.has(symbolOf(head)) && imports.get(symbolOf(head)).imported === fromHead) {
            const sym = symbolOf(head)
            renameRefs.set(sym, [...(renameRefs.get(sym) || []), { id: head, to: toHead }])
          } else {
            push('by-hand', node, name, { to, note: `Renamed to \`${to}\`, but reached here through another name: rename it by hand.` })
          }
          name = to
        }

        const key = name + '@' + node.getStart(sf)
        if (!seen.has(key)) {
          seen.add(key)
          if (idx.hold.has(name)) push('hold', node, name, { note: idx.hold.get(name).why })
          const gone = idx.removed.get(name)
          if (gone) push('removed', node, name, { to: gone.to || null, note: gone.note || '' })
          const list = idx.lists.get(name)
          if (list) {
            const keys = call ? objectKeys(call) : new Set()
            const passes = (list.optionsRemoved || []).filter((o) => keys.has(o.split('.')[0]))
            push('list', node, name, { before: list.before, after: list.after, paged: !!list.paged, passes, called: !!call, note: list.note || '' })
          }
          for (const opt of idx.options.get(name) || []) {
            if (typeof opt.argument === 'number') {
              // An argument that went: drop it when it is the last one passed.
              if (call && call.arguments.length === opt.argument + 1) {
                const arg = call.arguments[opt.argument]
                const from = opt.argument === 0 ? arg.getFullStart() : call.arguments[opt.argument - 1].getEnd()
                edits.push({ start: from, end: arg.getEnd(), text: '' })
              } else if (call && call.arguments.length > opt.argument + 1) {
                push('option', node, name, { option: opt.option, note: opt.note })
              }
            } else if (call && objectKeys(call).has(opt.option)) {
              push('option', node, name, { option: opt.option, note: opt.note })
            } else if (call && call.arguments.some((a) => !ts.isObjectLiteralExpression(a) && !ts.isStringLiteral(a) && !ts.isNumericLiteral(a) && a.kind !== ts.SyntaxKind.TrueKeyword && a.kind !== ts.SyntaxKind.FalseKeyword
              // An id or the admin flag is not an options object: `facets.list(collectionId)` passes no options.
              && !(ts.isIdentifier(a) && /(Id|Ids|^id|^admin|^isAdmin)$/.test(a.text)))) {
              // Options built somewhere else: can't see inside from here.
              push('option-check', node, name, { option: opt.option, note: opt.note })
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)

  // A namespace that changed name (product → products): any use of the old one that the script couldn't
  // rename and the table doesn't name (passed as a value, say) still has to be found by someone.
  const goneHeads = new Map()
  for (const [from, to] of idx.renames) if (from.includes('.') && from.split('.')[0] !== to.split('.')[0]) goneHeads.set(from.split('.')[0], to.split('.')[0])
  for (const [sym, all] of refs) {
    const imp = imports.get(sym)
    if (!goneHeads.has(imp.imported)) continue
    const renamed = new Set((renameRefs.get(sym) || []).map((u) => u.id))
    for (const id of all) {
      if (renamed.has(id)) continue
      const line = lineOf(id)
      if (work.some((w) => w.line === line && (w.kind === 'removed' || w.kind === 'by-hand'))) continue
      push('by-hand', id, imp.imported, { to: goneHeads.get(imp.imported), note: `The \`${imp.imported}\` namespace is \`${goneHeads.get(imp.imported)}\` in SDK 3. This use isn't a plain call, so change it by hand.` })
    }
  }

  // 3. Imports whose uses were renamed: rename the import to match.
  const declared = (name) => {
    // Is `name` already something else in this file (a variable, a parameter, another import)?
    let clash = false
    const look = (n) => {
      if (clash) return
      if (ts.isIdentifier(n) && n.text === name) {
        const isMemberName = n.parent && ((ts.isPropertyAccessExpression(n.parent) && n.parent.name === n)
          || ((ts.isPropertyAssignment(n.parent) || ts.isPropertySignature(n.parent) || ts.isPropertyDeclaration(n.parent) || ts.isMethodDeclaration(n.parent) || ts.isMethodSignature(n.parent)) && n.parent.name === n)
          || (ts.isBindingElement(n.parent) && n.parent.propertyName === n)
          || (ts.isJsxAttribute(n.parent) && n.parent.name === n)
          || ((ts.isImportSpecifier(n.parent) || ts.isExportSpecifier(n.parent)) && n.parent.propertyName === n))
        if (!isMemberName) {
          const sym = symbolOf(n)
          const imp = sym && imports.get(sym)
          if (!(imp && imp.imported === name && imp.local === name)) clash = true
        }
      }
      ts.forEachChild(n, look)
    }
    look(sf)
    return clash
  }

  const specEdits = new Map() // import declaration → { remove: Set<spec>, rename: Map<spec, text>, add: Set<text> }
  const planFor = (decl) => { if (!specEdits.has(decl)) specEdits.set(decl, { remove: new Set(), rename: new Map(), add: new Set() }); return specEdits.get(decl) }

  for (const [sym, uses] of renameRefs) {
    const imp = imports.get(sym)
    const to = uses[0].to
    const all = refs.get(sym) || []
    const everyUse = all.length === uses.length
    const already = [...imports.values()].find((i) => i.imported === to) // the new name is imported too
    const aliased = imp.local !== imp.imported

    if (aliased) {
      // import { product as p }: the uses keep their name; only what it points at changes.
      if (!everyUse) { for (const u of uses) push('by-hand', u.id, imp.imported, { to, note: `\`${imp.imported}\` is \`${to}\` in SDK 3, but \`${imp.local}\` is also used here for something \`${to}\` doesn't do the same way. Change the import by hand.` }); continue }
      planFor(imp.decl).rename.set(imp.spec, `${to} as ${imp.local}`)
      continue
    }

    let local = to
    if (already) local = already.local
    else if (declared(to)) {
      // `const products = await product.list()` is everywhere: the SDK's name can't also be `products` here.
      local = to + 'Api'
      if (declared(local)) { for (const u of uses) push('by-hand', u.id, imp.imported, { to, note: `\`${imp.imported}\` is \`${to}\` in SDK 3, but both \`${to}\` and \`${local}\` already mean something else in this file. Rename by hand.` }); continue }
    }
    for (const u of uses) edits.push({ start: u.id.getStart(sf), end: u.id.getEnd(), text: local })
    const plan = planFor(imp.decl)
    if (already) { if (everyUse) plan.remove.add(imp.spec) }
    else if (everyUse) plan.rename.set(imp.spec, local === to ? to : `${to} as ${local}`)
    else plan.add.add(local === to ? to : `${to} as ${local}`)
  }

  // Each import is changed in place, name by name, so its layout stays as the author had it.
  for (const [decl, plan] of specEdits) {
    const nb = decl.importClause.namedBindings
    const els = [...nb.elements]
    const kept = els.filter((s) => !plan.remove.has(s))
    if (!kept.length && !plan.add.size) {
      // Nothing left to import from this line.
      if (decl.importClause.name) edits.push({ start: decl.importClause.name.getEnd(), end: nb.getEnd(), text: '' })
      else { let end = decl.getEnd(); if (text.slice(end, end + 2) === '\r\n') end += 2; else if (text[end] === '\n') end += 1; edits.push({ start: decl.getStart(sf), end, text: '' }) }
      continue
    }
    els.forEach((spec, i) => {
      if (plan.remove.has(spec)) {
        // With the comma that belongs to it: the one after, or for the last name the one before.
        if (i < els.length - 1) edits.push({ start: spec.getStart(sf), end: els[i + 1].getStart(sf), text: '' })
        else edits.push({ start: i > 0 ? els[i - 1].getEnd() : spec.getStart(sf), end: spec.getEnd(), text: '' })
      } else if (plan.rename.has(spec)) {
        edits.push({ start: spec.getStart(sf), end: spec.getEnd(), text: (spec.isTypeOnly ? 'type ' : '') + plan.rename.get(spec) })
      }
    })
    const names = new Set(kept.map((s) => (plan.rename.has(s) ? plan.rename.get(s) : s.getText(sf))))
    const extra = [...plan.add].filter((a) => !names.has(a))
    if (extra.length) { const last = kept[kept.length - 1]; edits.push({ start: last.getEnd(), end: last.getEnd(), text: ', ' + extra.join(', ') }) }
  }

  // 4. Things only a search can hint at.
  const hint = (re, name, note) => {
    let m
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
    while ((m = g.exec(text))) work.push({ kind: 'check', file: rel, line: text.slice(0, m.index).split('\n').length, name, note })
  }
  // A code compared with something that isn't UPPER_SNAKE: 'segments.list.failed', 'notFound'.
  hint(/\b(?:errorCode|details\??\.error(?:Code)?)\s*(?:===|!==|==|!=)\s*['"`](?![A-Z0-9_]+['"`])[^'"`]+['"`]/, 'error codes',
    'Compares an error code with a dotted or camel-case string. Codes are UPPER_SNAKE in SDK 3 (`segments.list.failed` is `SEGMENTS_LIST_FAILED`); read it from `error.errorCode`.')
  hint(/\bdetails\??\.error(?:Code)?\b(?!\s*(?:===|!==|==|!=))/, 'error codes', 'Reads the code from `details`. Use `error.errorCode`.')
  hint(/['"]@proveanything\/smartlinks['"]\s*:\s*['"]SL['"]/, 'shared dependencies',
    'The SDK\'s window global is written out here as `SL`. In a build for SDK 3 it is `SL3`: take the globals from `SHARED_DEPENDENCIES` so this can\'t drift.')
  hint(/\bwindow\.SL\b(?!3)/, 'shared dependencies', 'Reads `window.SL`, which stays SDK 2. A component built on SDK 3 gets the SDK from its import (or `window.SL3`).')

  return { edits, work }
}

function applyEdits(text, edits) {
  const sorted = [...edits].sort((a, b) => b.start - a.start || b.end - a.end)
  let out = text
  let last = Infinity
  for (const e of sorted) {
    if (e.end > last) continue // overlapping: keep the later one in the file, skip this
    out = out.slice(0, e.start) + e.text + out.slice(e.end)
    last = e.start
  }
  return out
}

// ── the whole app ────────────────────────────────────────────────────────────────────────────────

/**
 * Plan (and with `write: true`, make) the move.
 * Returns { table, files: [{ file, edits }], work: [...], manifest, packages, changed: [...paths] }.
 */
export function upgradeApp({ dir, major = '3', write = false, ts = null } = {}) {
  const appDir = path.resolve(dir || process.cwd())
  const table = loadTable(major)
  const idx = indexTable(table)
  ts = ts || loadTypeScript(appDir)
  if (!ts) throw new Error('TypeScript was not found. Install it in the app (npm install -D typescript) and run again.')

  const files = sourceFiles(appDir)
  const program = ts.createProgram(files, {
    allowJs: true, checkJs: false, noResolve: true, noLib: true, skipLibCheck: true,
    jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext, types: [],
  })
  const checker = program.getTypeChecker()

  const result = { table, dir: appDir, files: [], work: [], changed: [], manifest: null, packages: [] }
  for (const file of files) {
    const sf = program.getSourceFile(file)
    if (!sf || !/smartlinks|\bSL3?\b|errorCode/.test(sf.text)) continue
    const rel = path.relative(appDir, file).replace(/\\/g, '/')
    const { edits, work } = analyseFile(ts, checker, sf, idx, rel)
    result.work.push(...work)
    if (edits.length) {
      result.files.push({ file: rel, edits: edits.length })
      if (write) { fs.writeFileSync(file, applyEdits(sf.text, edits)); result.changed.push(rel) }
    }
  }

  // The manifest says which shared-dependency contract the build is for.
  const contract = table.sharedDependencies
  for (const rel of ['public/app.manifest.json', 'app.manifest.json']) {
    const p = path.join(appDir, rel)
    if (!contract || !fs.existsSync(p)) continue
    const raw = fs.readFileSync(p, 'utf8')
    const m = /("sharedDependencies"\s*:\s*")([^"]+)(")/.exec(raw)
    if (!m) break
    result.manifest = { file: rel, from: m[2], to: contract.to }
    if (m[2] !== contract.to && write) { fs.writeFileSync(p, raw.replace(m[0], m[1] + contract.to + m[3])); result.changed.push(rel) }
    break
  }

  // Other SmartLinks packages that use the SDK must be versions built for this major.
  for (const name of ['@proveanything/smartlinks-utils-ui', '@proveanything/smartlinks-auth-ui']) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(appDir, 'node_modules', name, 'package.json'), 'utf8'))
      const range = { ...(pkg.dependencies || {}), ...(pkg.peerDependencies || {}) }['@proveanything/smartlinks']
      const ok = !range || range === '*' || new RegExp(`(^|[^\\d.])${major}(\\.|\\b)`).test(range) || /^>=/.test(range.trim())
      result.packages.push({ name, version: pkg.version, range: range || null, ok })
    } catch { /* not installed */ }
  }

  result.fields = idx.fields
  result.behaviour = idx.behaviour
  return result
}

// ── the report ───────────────────────────────────────────────────────────────────────────────────

const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`

/** The plan as Markdown: what the script did (or would do), then the work left, file by file. */
export function formatReport(result, { write = false } = {}) {
  const { table, work } = result
  const out = []
  const major = table.sdk.to
  out.push(`# Moving to SDK ${major}`, '')

  const edits = result.files.reduce((n, f) => n + f.edits, 0)
  const manifestChange = result.manifest && result.manifest.from !== result.manifest.to
  out.push(`## ${write ? 'Done by the script' : 'What the script will change (run again with --write)'}`, '')
  if (!edits && !manifestChange) out.push('Nothing mechanical to change.', '')
  for (const f of result.files) out.push(`- \`${f.file}\`: ${plural(f.edits, 'edit')} (renamed calls, dropped arguments, imports)`)
  if (manifestChange) out.push(`- \`${result.manifest.file}\`: \`sharedDependencies\` ${result.manifest.from} → ${result.manifest.to}`)
  if (edits || manifestChange) out.push('')

  const of = (kind) => work.filter((w) => w.kind === kind)
  const where = (w) => `\`${w.file}:${w.line}\``

  const hold = of('hold')
  if (hold.length) {
    out.push('## Leave these as they are', '', hold[0].note, '')
    for (const w of hold) out.push(`- ${where(w)} \`${w.name}\``)
    out.push('')
  }

  const bad = result.packages.filter((p) => !p.ok)
  if (bad.length) {
    out.push('## Packages to update first', '')
    for (const p of bad) out.push(`- \`${p.name}\` ${p.version} is built for SDK \`${p.range}\`. Install a version built for SDK ${major}, or it will read the old shapes.`)
    out.push('')
  }

  const removed = [...of('removed'), ...of('by-hand')]
  if (removed.length) {
    out.push(`## Calls to replace (${removed.length})`, '')
    for (const w of removed) out.push(`- ${where(w)} \`${w.name}\`${w.to ? ` → \`${w.to}\`` : ''}. ${w.note}`)
    out.push('')
  }

  const options = [...of('option'), ...of('option-check')]
  if (options.length) {
    out.push(`## Options that went (${options.length})`, '')
    for (const w of options) out.push(`- ${where(w)} \`${w.name}\` ${w.kind === 'option' ? 'passes' : 'may pass'} \`${w.option}\`. ${w.note}`)
    out.push('')
  }

  const lists = of('list')
  if (lists.length) {
    out.push(`## Lists whose result changed (${lists.length})`, '',
      'Each of these now returns `{ items, nextCursor, count? }`. At each place: read the list from `.items`,',
      'a total from `.count`, "is there more" from `.nextCursor !== null`, and page with `cursor`, not `offset` or `page`.', '')
    const byFile = new Map()
    for (const w of lists) byFile.set(w.file, [...(byFile.get(w.file) || []), w])
    for (const [file, items] of byFile) {
      out.push(`### \`${file}\``, '')
      for (const w of items) {
        const bits = [`was \`${w.before}\``]
        if (w.passes.length) bits.push(`**passes ${w.passes.map((p) => '`' + p + '`').join(', ')}**, which is gone`)
        if (!w.paged) bits.push('not paged')
        if (!w.called) bits.push('passed as a value, not called here: follow it to where the result is read')
        if (w.note) bits.push(w.note)
        out.push(`- line ${w.line} \`${w.name}\`: ${bits.join('; ')}`)
      }
      out.push('')
    }
  }

  const checks = of('check')
  if (checks.length) {
    out.push(`## Check by hand (${checks.length})`, '')
    const seen = new Set()
    for (const w of checks) { const k = w.file + ':' + w.line + w.note; if (seen.has(k)) continue; seen.add(k); out.push(`- ${where(w)} ${w.note}`) }
    out.push('')
  }

  out.push('## What no script can see', '')
  for (const b of result.behaviour) out.push(`- **${b.name}.** ${b.note}`)
  for (const f of result.fields) out.push(`- **\`${f.name}\`** (a field).${f.to ? ` Use \`${f.to}\`.` : ''} ${f.note}`)
  out.push('', `Everything above is explained in \`docs/${path.basename(table.guide)}\` in this package.`, '')
  return out.join('\n')
}

/** One line for a log. */
export function summary(result) {
  const n = (k) => result.work.filter((w) => w.kind === k).length
  return `${plural(result.files.reduce((a, f) => a + f.edits, 0), 'mechanical edit')} in ${plural(result.files.length, 'file')}; `
    + `left to do: ${plural(n('list'), 'list call')}, ${plural(n('removed') + n('by-hand'), 'call')} to replace, ${plural(n('option') + n('option-check'), 'option')}, ${plural(n('check'), 'check')}`
    + (n('hold') ? `; ${plural(n('hold'), 'call')} to leave alone` : '')
}
