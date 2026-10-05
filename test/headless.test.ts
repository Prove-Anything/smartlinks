import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validate, standardRecipe } from '../src/headless'

// A complete, minimal headless provider (an illustrative shape — not any real app's declaration).
const good = () => ({
  data: {
    schemaVersion: '1.0.0',
    types: {
      'tip.item': {
        description: 'One care tip shown on the public site.',
        storage: { kind: 'record' as const, recordType: 'tip' },
        visibility: 'public' as const,
        fields: {
          title: { type: 'string' as const, required: true, public: true, localized: true },
          body: { type: 'markdown' as const, public: true },
          topic: { type: 'ref' as const, to: 'tip.topic', public: true },
          order: { type: 'number' as const, public: true },
          internalNote: { type: 'text' as const, zone: 'admin' as const },
        },
        listing: { sort: ['order'], filters: ['topic'] },
        examples: [{ title: 'Water roses in the morning', body: 'Roots take up water before the day heats up.', topic: 't1', order: 1 }],
      },
      'tip.topic': {
        description: 'A topic grouping tips.',
        storage: { kind: 'record' as const, recordType: 'tip-topic' },
        fields: { name: { type: 'string' as const, required: true, public: true } },
        examples: [{ name: 'Watering' }],
      },
    },
  },
  headless: {
    purpose: 'Short care tips the business publishes. A site lists them by topic instead of building its own tips content.',
    categories: ['articles' as const],
    primaryTypes: ['tip.item'],
    editedIn: { label: 'Tips → Manage tips', adminPath: '#/tips' },
    render: { guidance: 'A list grouped by topic; each tip expands.', seo: ['article' as const] },
  },
})

test('a complete declaration is valid, with the standard read recipe filled in', () => {
  const r = validate(good())
  assert.equal(r.ok, true, JSON.stringify(r.errors))
  assert.match(r.recipes['tip.item'].list, /SL\.app\.records\.list\(collectionId, appId, \{ recordType: 'tip'/)
  assert.ok(r.warnings.some((w) => w.path === 'data.types.tip.item.read'))
})

test('headless needs a data block, a purpose, categories, where it is edited, and real primary types', () => {
  const m: any = good()
  delete m.data
  assert.ok(validate(m).errors.some((e) => e.path === 'data'))
  const h: any = good()
  h.headless.purpose = 'FAQs'
  h.headless.categories = ['blogs']
  h.headless.editedIn = {}
  h.headless.primaryTypes = ['nope']
  const paths = validate(h).errors.map((e) => e.path)
  for (const p of ['headless.purpose', 'headless.categories', 'headless.editedIn.label', 'headless.primaryTypes']) assert.ok(paths.includes(p), p)
})

test('field rules: known types, enum options, refs to declared types, only data-zone fields public', () => {
  const m: any = good()
  m.data.types['tip.item'].fields.mood = { type: 'enum' }
  m.data.types['tip.item'].fields.author = { type: 'ref', to: 'tip.author' }
  m.data.types['tip.item'].fields.secret = { type: 'string', zone: 'admin', public: true }
  m.data.types['tip.item'].fields.weird = { type: 'html' }
  const msgs = validate(m).errors.map((e) => `${e.path}: ${e.message}`).join('\n')
  assert.match(msgs, /fields\.mood: an enum needs options/)
  assert.match(msgs, /fields\.author: "to" must name a declared type/)
  assert.match(msgs, /fields\.secret: a admin-zone field can't be public/)
  assert.match(msgs, /fields\.weird: unknown type "html"/)
})

test('examples must fit their fields; a primary type needs public fields and an example', () => {
  const m: any = good()
  m.data.types['tip.item'].examples = [{ body: 42, extra: 'x' }]
  let r = validate(m)
  assert.ok(r.errors.some((e) => /required field "title" is missing/.test(e.message)))
  assert.ok(r.errors.some((e) => /"body": expected markdown/.test(e.message)))
  assert.ok(r.warnings.some((w) => /example uses "extra"/.test(w.message)))
  const n: any = good()
  for (const f of Object.values(n.data.types['tip.item'].fields) as any[]) delete f.public
  n.data.types['tip.item'].examples = []
  r = validate(n)
  assert.ok(r.errors.some((e) => /"public": true/.test(e.message)))
  assert.ok(r.errors.some((e) => e.path === 'data.types.tip.item.examples'))
})

test('real data: undeclared fields and type mismatches are reported (as warnings)', () => {
  const r = validate(good(), { samples: { 'tip.item': [{ title: 'A', order: 'first', imageUrl: 'x' }, { title: 'B', imageUrl: 'y' }] } })
  assert.equal(r.ok, true)
  assert.ok(r.warnings.some((w) => /real data has "imageUrl" \(in 2 of 2 items\)/.test(w.message)))
  assert.ok(r.warnings.some((w) => /"order": expected a number/.test(w.message)))
})

test('localized text accepts a { lang: string } object', () => {
  const m: any = good()
  m.data.types['tip.item'].examples = [{ title: { en: 'Water early', fr: 'Arrosez tôt' }, order: 1 }]
  assert.equal(validate(m).ok, true)
})

test('standard recipes per storage kind', () => {
  assert.match(standardRecipe({ description: 'x', storage: { kind: 'config', key: 'tips' }, fields: {} }).list, /getConfig.*config\.tips/)
  assert.match(standardRecipe({ description: 'x', storage: { kind: 'thread' }, fields: {} }).list, /SL\.app\.threads\.list/)
})

test('every recipe says what the call returns and where the fields are — even a custom one', () => {
  const m: any = good()
  m.data.types['tip.item'].read = { list: "SL.app.records.list(collectionId, appId, { recordType: 'tip', limit: 200 })" }
  const r = validate(m).recipes['tip.item']
  assert.match(r.list, /limit: 200/) // the app's own recipe is kept…
  assert.match(r.returns, /items are in response\.data \(not response\.items/) // …and the platform's shape is added
  assert.match(r.item, /record\.data \(e\.g\. record\.data\.title\)/)
  assert.match(validate(good()).recipes['tip.topic'].item, /record\.data\.name/)
})
