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
    assert.match(report, /What the script will change/)
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
