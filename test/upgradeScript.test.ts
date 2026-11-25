import { describe, test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// smartlinks-upgrade (scripts/lib/upgrade.mjs): the mechanical part of moving an app to SDK 3, and the
// list of everything else. The rule under test: it changes a name only where that name IS the SDK's, and
// only where the call means the same thing afterwards.

// The runner transpiles tests to CJS, which would turn import() into require(): keep it a real import.
const importESM = new Function('u', 'return import(u)') as (u: string) => Promise<any>
const load = importESM(pathToFileURL(path.resolve(__dirname, '../scripts/lib/upgrade.mjs')).href)

let dir: string
const write = (rel: string, text: string) => { const p = path.join(dir, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text) }
const read = (rel: string) => fs.readFileSync(path.join(dir, rel), 'utf8')

async function run(files: Record<string, string>, opts: { write?: boolean } = { write: true }) {
  fs.rmSync(dir, { recursive: true, force: true })
  for (const [rel, text] of Object.entries(files)) write(rel, text)
  const { upgradeApp, formatReport } = await load
  const result = upgradeApp({ dir, major: '3', write: opts.write !== false })
  return { result, report: formatReport(result, { write: opts.write !== false }) as string, work: result.work as any[] }
}

describe('smartlinks-upgrade: moving an app to SDK 3', () => {
  before(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sl-upgrade-')) })
  after(() => { fs.rmSync(dir, { recursive: true, force: true }) })

  test('renames a call that only changed name, and its import with it', async () => {
    await run({ 'src/a.ts': [
      "import { product, auth } from '@proveanything/smartlinks'",
      'export const one = (c: string, id: string) => product.get(c, id)',
      "export const make = (c: string) => product.create(c, { name: 'x' })",
      '',
    ].join('\n') })
    assert.equal(read('src/a.ts'), [
      "import { products, auth } from '@proveanything/smartlinks'",
      'export const one = (c: string, id: string) => products.get(c, id)',
      "export const make = (c: string) => products.create(c, { name: 'x' })",
      '',
    ].join('\n'))
  })

  test('never touches a local name that only looks like the SDK', async () => {
    const src = [
      "import { tags } from '@proveanything/smartlinks'",
      'type Row = { product: { get(k: string): string; name: string } }',
      'export function label(product: { name: string; get(k: string): string }, row: Row) {',
      "  return product.get('title') + product.name + row.product.get('x')",
      '}',
      'export const t = tags',
      '',
    ].join('\n')
    const { result } = await run({ 'src/b.ts': src })
    assert.equal(read('src/b.ts'), src)
    assert.equal(result.files.length, 0)
  })

  test('where the new name is already a variable in the file, the SDK is imported under another name', async () => {
    await run({ 'src/c.ts': [
      "import { product } from '@proveanything/smartlinks'",
      'export async function load(c: string) {',
      '  const products = await product.list(c)',
      '  return products',
      '}',
      '',
    ].join('\n') })
    assert.equal(read('src/c.ts'), [
      "import { products as productsApi } from '@proveanything/smartlinks'",
      'export async function load(c: string) {',
      '  const products = await productsApi.list(c)',
      '  return products',
      '}',
      '',
    ].join('\n'))
  })

  test('an aliased import keeps its alias; SL.product is renamed in place', async () => {
    await run({
      'src/d.ts': "import { product as p } from '@proveanything/smartlinks'\nexport const x = (c: string) => p.remove(c, 'id')\n",
      'src/e.tsx': "import * as SL from '@proveanything/smartlinks'\nexport const y = (host: any, c: string) => [SL.product.get(c, '1'), host.SL.product.update(c, '1', {}), window.SL.product.refresh(c, '1')]\n",
    })
    assert.equal(read('src/d.ts'), "import { products as p } from '@proveanything/smartlinks'\nexport const x = (c: string) => p.remove(c, 'id')\n")
    assert.match(read('src/e.tsx'), /SL\.products\.get\(c, '1'\), host\.SL\.products\.update\(c, '1', \{\}\), window\.SL\.products\.refresh/)
  })

  test('a call the table says is gone is left as it is and listed, with what replaces it', async () => {
    const src = "import { product, products } from '@proveanything/smartlinks'\nexport const a = (c: string) => product.find(c, {})\nexport const b = (c: string) => product.get(c, '1')\nexport const all = products\n"
    const { work } = await run({ 'src/f.ts': src })
    // product.get moves to the `products` already imported; product.find stays for a person to change.
    assert.equal(read('src/f.ts'), "import { product, products } from '@proveanything/smartlinks'\nexport const a = (c: string) => product.find(c, {})\nexport const b = (c: string) => products.get(c, '1')\nexport const all = products\n")
    const gone = work.filter((w) => w.kind === 'removed')
    assert.equal(gone.length, 1)
    assert.deepEqual([gone[0].name, gone[0].to, gone[0].file, gone[0].line], ['product.find', 'products.query', 'src/f.ts', 2])
  })

  test('renamed types follow their imports, type-only ones included', async () => {
    await run({ 'src/g.ts': "import { type ContactSchema, contact } from '@proveanything/smartlinks'\nexport function f(s: ContactSchema): ContactSchema[] { return [s] }\nexport const c = contact\n" })
    assert.equal(read('src/g.ts'), "import { type ContactSchemaResponse, contact } from '@proveanything/smartlinks'\nexport function f(s: ContactSchemaResponse): ContactSchemaResponse[] { return [s] }\nexport const c = contact\n")
  })

  test('drops the argument that went, only when it is the last one', async () => {
    await run({ 'src/h.ts': "import { collection, authKit } from '@proveanything/smartlinks'\nexport const a = () => collection.list(true)\nexport const b = (c: string) => authKit.list(c, true)\nexport const d = () => collection.list()\n" })
    assert.equal(read('src/h.ts'), "import { collection, authKit } from '@proveanything/smartlinks'\nexport const a = () => collection.list()\nexport const b = (c: string) => authKit.list(c)\nexport const d = () => collection.list()\n")
  })

  test('lists every call to a list whose result changed, and says when it passes an option that is gone', async () => {
    const { work, report } = await run({ 'src/i.ts': [
      "import { tags, order, app } from '@proveanything/smartlinks'",
      'export const a = (c: string) => tags.list(c, { limit: 10, offset: 20 })',
      'export const b = (c: string) => order.list(c)',
      "export const q = { queryFn: tags.list }",
      "export const r = (c: string) => app.records.list(c, 'my-app')",
      '',
    ].join('\n') }, { write: false })
    const lists = work.filter((w) => w.kind === 'list')
    assert.deepEqual(lists.map((w) => [w.name, w.line, w.called, w.passes]), [
      ['tags.list', 2, true, ['offset']],
      ['order.list', 3, true, []],
      ['tags.list', 4, false, []],
      ['app.records.list', 5, true, []],
    ])
    assert.match(report, /line 2 `tags\.list`: was `\{ tags, limit, offset \}`; \*\*passes `offset`\*\*, which is gone/)
    assert.match(report, /## 1\. Automatic changes/)
    assert.match(report, /## The passes/)
  })

  test('the two job namespaces become one: async.* and the old jobs names move to jobs.*', async () => {
    await run({ 'src/j.ts': [
      "import { async as slAsync, jobs } from '@proveanything/smartlinks'",
      "import * as SL from '@proveanything/smartlinks'",
      "export const start = (c: string) => slAsync.enqueueAsyncJob(c, { task: 'x' })",
      'export const follow = (c: string, id: number) => SL.async.getAsyncJobStatus(c, id)',
      'export const one = (c: string, id: number) => jobs.getJob(c, id)',
      'export const recent = (c: string) => jobs.listJobs(c, { limit: 20 })',
      '',
    ].join('\n') })
    const out = read('src/j.ts')
    assert.match(out, /SL\.jobs\.status\(c, id\)/)
    assert.match(out, /jobs\.get\(c, id\)/)
    assert.match(out, /jobs\.list\(c, \{ limit: 20 \}\)/)
    assert.match(out, /\.enqueue\(c, \{ task: 'x' \}\)/)
    assert.doesNotMatch(out, /enqueueAsyncJob|getAsyncJobStatus|listJobs|getJob\b/)
  })

  test('a list that used to return everything is marked, with what to do; a fixed set is said to be whole', async () => {
    const { work, report } = await run({ 'src/k.ts': [
      "import { variant, facets, lots, knowledge } from '@proveanything/smartlinks'",
      'export const a = (c: string, p: string) => variant.list(c, p)',
      'export const b = (c: string) => facets.list(c)',
      "export const d = (c: string) => lots.list(c, { search: 'oak' })",
      "export const e = (c: string) => knowledge.search(c, { query: 'descale', k: 3 })",
      '',
    ].join('\n') }, { write: false })
    const lists = work.filter((w) => w.kind === 'list')
    assert.deepEqual(lists.map((w) => [w.name, w.firstPageOnly, w.paged, w.passes]), [
      ['variant.list', true, true, []],
      ['facets.list', false, false, []],
      ['lots.list', true, true, ['search']],
      ['knowledge.search', false, true, ['query', 'k']],
    ])
    assert.match(report, /line 2 `variant\.list`: was `VariantResponse\[\]`; \*\*used to return everything\*\*, now one page \(pass 4\)/)
    assert.match(report, /line 3 `facets\.list`: .*always returned whole/)
    assert.match(report, /line 4 `lots\.list`: .*\*\*passes `search`\*\*, which is gone; \*\*used to return everything\*\*/)
    assert.match(report, /`all\(\(cursor\) => theList/)
    assert.match(report, /## 4\. One page, or all of them \(2 to decide\)/)
  })

  test('a list that used to return everything is decided once the call says how many, follows the pages, or is marked', async () => {
    const { result } = await run({ 'src/m.ts': [
      "import { variant, batch, lots, all, each } from '@proveanything/smartlinks'",
      'export const a = (c: string, p: string) => variant.list(c, p)',
      'export const b = (c: string, p: string) => variant.list(c, p, { limit: 20 })',
      'export const d = (c: string, p: string, cursor?: string) => batch.list(c, p, { cursor })',
      'export const e = (c: string, p: string) => all((cursor) => batch.list(c, p, { limit: 200, cursor }))',
      'export const f = (c: string, page: any) => all(() => lots.list(c, page))',
      '// sl-upgrade: ok the picker only ever shows the first few',
      'export const g = (c: string) => lots.list(c)',
      'export const h = (c: string, opts: any) => lots.list(c, opts)',
      'export const i = { queryFn: lots.list }',
      '',
    ].join('\n') }, { write: false })
    const { passesOf, leftToDo } = await load
    const pages = passesOf(result).find((p: any) => p.id === 'pages')
    assert.deepEqual(pages.left.map((w: any) => w.line), [2, 9, 10])
    assert.deepEqual(pages.decided.map((w: any) => [w.line, w.decided]), [
      [3, 'says how many'], [4, 'follows the pages'], [5, 'follows the pages'], [6, 'inside all() / each()'], [8, 'marked ok'],
    ])
    assert.equal(leftToDo(result, { only: 'pages' }), 3)
  })

  test('the passes: what is left in each, and nothing left once every place is dealt with', async () => {
    const before = await run({ 'src/n.ts': [
      "import { product, ai, variant, lots } from '@proveanything/smartlinks'",
      'export const one = (c: string, id: string) => product.get(c, id)',
      "export const gen = (c: string) => ai.generateContent(c, { contents: 'hi' })",
      'export const vs = (c: string, p: string) => variant.list(c, p)',
      "export const ls = (c: string) => lots.list(c, { search: 'oak' })",
      "export const bad = (e: any) => e.errorCode === 'lots.list.failed'",
      '',
    ].join('\n') }, { write: false })
    const { passesOf, leftToDo, formatReport } = await load
    const left = (r: any, write = false) => Object.fromEntries(passesOf(r, { write }).map((p: any) => [p.id, p.left.length]))
    assert.deepEqual(left(before.result), { automatic: 1, replace: 1, lists: 1, pages: 2, errors: 1 })
    assert.match(before.report, /\| 4 \| \*\*One page, or all of them\*\* \(`pages`\) \| 2 to decide \|/)
    // One pass on its own: only its places.
    const only = formatReport(before.result, { only: 'pages' }) as string
    assert.match(only, /## 4\. One page, or all of them \(2 to decide\)/)
    assert.doesNotMatch(only, /## 2\.|## The passes|What no script can see/)

    // The app after the move: every place dealt with.
    const after = await run({ 'src/n.ts': [
      "import { products, ai, variant, lots, all } from '@proveanything/smartlinks'",
      'export const one = (c: string, id: string) => products.get(c, id)',
      "export const gen = (c: string) => ai.chat.completions.create(c, { messages: [{ role: 'user', content: 'hi' }] })",
      'export const vs = (c: string, p: string) => all((cursor) => variant.list(c, p, { limit: 200, cursor }))',
      "export const ls = (c: string) => lots.list(c, { q: 'oak', limit: 20 })",
      "export const bad = (e: any) => e.errorCode === 'LOTS_LIST_FAILED'",
      '',
    ].join('\n') }, { write: false })
    assert.deepEqual(left(after.result), { automatic: 0, replace: 0, lists: 0, pages: 0, errors: 0 })
    assert.equal(leftToDo(after.result), 0)
    assert.match(after.report, /\| 4 \| \*\*One page, or all of them\*\* \(`pages`\) \| 0 to decide, 2 decided \|/)
  })

  test('a list call hidden from the type-check by `any` is not finished until the `any` goes or a person notes it', async () => {
    const { result, report } = await run({ 'src/p.ts': [
      "import * as SL from '@proveanything/smartlinks'",
      'export const a = (c: string, p: string) => (SL as any).batch.list(c, p, { limit: 20 })',
      'const facets: any = SL.facets',
      'export const b = (c: string) => facets.publicList(c)',
      'export const d = async (c: string) => { const res: any = await SL.tags.list(c, { limit: 5 }); return res }',
      'export const e = (c: string) => SL.tags.list(c, { limit: 5 })',
      '// sl-upgrade: ok read as { items } two lines down',
      'export const f = async (c: string) => { const res: any = await SL.tags.list(c, { limit: 5 }); return res.items }',
      '',
    ].join('\n') }, { write: false })
    const { passesOf } = await load
    const lists = passesOf(result).find((p: any) => p.id === 'lists')
    assert.deepEqual(lists.all.map((w: any) => [w.line, w.name, w.untyped]), [
      [2, 'batch.list', true], [4, 'facets.publicList', true], [5, 'tags.list', true], [6, 'tags.list', false], [8, 'tags.list', false],
    ])
    assert.deepEqual(lists.left.map((w: any) => w.line), [2, 4, 5])
    assert.match(report, /3 the type-check can't see/)
    assert.match(report, /line 2 `batch\.list`: .*\*\*typed `any`\*\*: the type-check can't see this call/)
  })

  test('an app with a widget loader of its own is told what that means on SDK 3', async () => {
    const { result } = await run({
      'src/utils/widget-loader.ts': [
        "import * as SL from '@proveanything/smartlinks'",
        "const REQUIRE_MAP: Record<string, string> = { 'react': 'React', '@proveanything/smartlinks': 'SL' }",
        'export function ensureGlobals() { Object.assign(window, { SL }) }',
        'export const m = REQUIRE_MAP',
        '',
      ].join('\n'),
      'vite.config.widget.ts': "export default { build: { rollupOptions: { output: { globals: { '@proveanything/smartlinks': 'SL' } } } } }\n",
    }, { write: false })
    const { passesOf } = await load
    const left = passesOf(result).find((p: any) => p.id === 'errors').left
    const inLoader = left.filter((w: any) => w.file === 'src/utils/widget-loader.ts').map((w: any) => w.note)
    assert.equal(inLoader.length, 2)
    assert.ok(inLoader.some((n: string) => /a loader of its own/.test(n) && /EmbeddedWidget/.test(n) && /stay on SDK 2/.test(n)))
    assert.ok(inLoader.some((n: string) => /never put its own SDK there/.test(n)))
    // The same words in a build config are about this app's own build, not a loader.
    for (const w of left.filter((x: any) => x.file !== 'src/utils/widget-loader.ts')) assert.match(w.note, /In a build for SDK 3 it is `SL3`/)
  })

  test('finds SDK calls reached through a name taken from the SDK', async () => {
    const { work } = await run({ 'src/j.ts': "export function f(host: any, c: string) {\n  const { tags, product } = host.SL\n  const records = host.SL.app.records\n  return [tags.list(c), product.find(c, {}), records.list(c, 'a')]\n}\n" }, { write: false })
    assert.deepEqual(work.filter((w) => w.kind === 'list').map((w) => w.name).sort(), ['app.records.list', 'tags.list'])
    assert.deepEqual(work.filter((w) => w.kind === 'removed').map((w) => w.name), ['product.find'])
  })

  test('old attestation writes are named as calls to leave alone', async () => {
    const { work, report } = await run({ 'src/k.ts': "import { attestation } from '@proveanything/smartlinks'\nexport const w = (c: string, p: string, id: string) => attestation.create(c, p, id, { public: {} } as any)\n" }, { write: false })
    assert.deepEqual(work.filter((w) => w.kind === 'hold').map((w) => [w.name, w.line]), [['attestation.create', 2]])
    assert.match(report, /## Leave these as they are/)
  })

  test('the manifest moves to the new shared-dependency contract; error codes that will not match are pointed out', async () => {
    const { work, result } = await run({
      'public/app.manifest.json': '{\n  "meta": { "name": "x", "sharedDependencies": "v7" }\n}\n',
      'src/l.ts': "export function h(e: any) {\n  if (e.errorCode === 'segments.list.failed') return 1\n  if (e.errorCode === 'NOT_FOUND') return 2\n  return e.details?.errorCode\n}\n",
    })
    assert.match(read('public/app.manifest.json'), /"sharedDependencies": "v8"/)
    assert.deepEqual(result.manifest, { file: 'public/app.manifest.json', from: 'v7', to: 'v8' })
    assert.deepEqual(work.filter((w) => w.kind === 'check').map((w) => w.line), [2, 4])
  })

  test('running it twice changes nothing the second time', async () => {
    const files = { 'src/m.ts': "import { product } from '@proveanything/smartlinks'\nexport const a = (c: string) => product.list(c)\n" }
    await run(files)
    const once = read('src/m.ts')
    const { upgradeApp } = await load
    const again = upgradeApp({ dir, major: '3', write: true })
    assert.equal(read('src/m.ts'), once)
    assert.equal(again.files.length, 0)
  })
})
