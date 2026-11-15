import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validate } from '../src/headless'
import { createFunctionTestContext } from '../src/testing'

// Value lists and picker fields in the `data` block (docs/admin-lists-and-pickers.md).
const manifest = (over: any = {}) => ({
  data: {
    schemaVersion: '1.0.0',
    types: {
      'shop.machine': {
        description: 'A machine on the shop floor.',
        storage: { kind: 'record' as const, recordType: 'machine' },
        visibility: 'admin' as const,
        label: 'name', sublabel: 'stage', activeField: 'isActive', orderField: 'sortOrder', small: true, setup: true,
        fields: {
          name: { type: 'string' as const, required: true },
          stage: { type: 'enum' as const, list: 'stages' },
          isActive: { type: 'boolean' as const },
          sortOrder: { type: 'number' as const },
        },
        examples: [{ name: 'Filler 1', stage: 'filling', isActive: true, sortOrder: 1 }],
        ...(over.type || {}),
      },
    },
    lists: { stages: { label: 'Stages', values: [{ code: 'filling', label: 'Filling' }] }, ...(over.lists || {}) },
  },
})
const errorsOf = (m: any) => validate(m).errors.map((e) => `${e.path}: ${e.message}`)

test('data block: a declared list, picker fields and set-up flags are valid', () => {
  assert.deepEqual(errorsOf(manifest()).filter((e) => e.startsWith('data.')), [])
})

test('data block: an enum names a declared list, or has options, not both; picker fields name real fields', () => {
  const missing = errorsOf(manifest({ type: { fields: { name: { type: 'string' }, stage: { type: 'enum', list: 'nope' } } } }))
  assert.ok(missing.some((e) => e.includes('"nope" isn\'t a list')))
  const both = errorsOf(manifest({ type: { fields: { name: { type: 'string' }, stage: { type: 'enum', list: 'stages', options: ['a'] } } } }))
  assert.ok(both.some((e) => e.includes('not both')))
  const badLabel = errorsOf(manifest({ type: { label: 'title', activeField: 'name' } }))
  assert.ok(badLabel.some((e) => e.startsWith('data.types.shop.machine.label')))
  assert.ok(badLabel.some((e) => e.includes('activeField: must name a boolean field')))
})

test('data block: list ids and value codes are checked', () => {
  const bad = errorsOf(manifest({ lists: { 'Bad List': { label: 'X', values: [] }, dupes: { label: 'D', values: [{ code: 'a' }, { code: 'a' }, { code: 'has space' }] } } }))
  assert.ok(bad.some((e) => e.startsWith('data.lists.Bad List')))
  assert.ok(bad.some((e) => e.includes('"a" is in the list twice')))
  assert.ok(bad.some((e) => e.includes('needs a code')))
})

test('function test context: appRecords.all and appOptions.get, in memory', async () => {
  const ctx = createFunctionTestContext({ def: { capabilities: ['sl:records:read', 'sl:records:write'] } as any, valueLists: { stages: [{ code: 'filling', label: 'Filling' }, { code: 'old', active: false }] } })
  await ctx.sl.appRecords.create({ recordType: 'machine', data: { name: 'B', sortOrder: 2 } })
  await ctx.sl.appRecords.create({ recordType: 'machine', data: { label: 'A', sortOrder: 1 } })
  assert.deepEqual((await ctx.sl.appRecords.all('machine')).map((r: any) => r.data.sortOrder), [2, 1])
  const machines: any = await ctx.sl.appOptions.get('type:machine')
  assert.deepEqual(machines.items.map((i: any) => i.label), ['A', 'B'])
  const stages: any = await ctx.sl.appOptions.get('list:stages')
  assert.deepEqual(stages.items.map((i: any) => [i.id, i.label, i.active]), [['filling', 'Filling', true], ['old', 'old', false]])
  const denied = createFunctionTestContext({ def: { capabilities: [] } as any })
  await assert.rejects(() => denied.sl.appOptions.get('type:machine'))
})
