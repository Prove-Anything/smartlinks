import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createFunctionTestContext, createFunctionTestMemory, CapabilityError } from '../src/testing'

// The local harness must enforce the SAME capability envelope the server does, so a
// function fails locally the way it would after deploy. These pin that contract.

const httpDef = (capabilities: string[]) => ({ trigger: { type: 'http' as const }, capabilities })

test('a declared capability lets the sl call through (in-memory records when no impl)', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write']) })
  const res: any = await ctx.sl.appRecords.create({ recordType: 't' })
  assert.equal(res.recordType, 't')
  assert.equal(ctx.memory.records.length, 1)
})

test('a declared capability lets the sl call through (stub for products with no impl)', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:products:read']) })
  const res: any = await ctx.sl.products.get('p1')
  assert.equal(res.__stub, true)
  assert.equal(res.method, 'products.get')
})

test('an undeclared capability throws CapabilityError (deploy-parity)', async () => {
  const ctx = createFunctionTestContext({ def: httpDef([]) })
  await assert.rejects(() => ctx.sl.appRecords.create({}), (e: any) => e instanceof CapabilityError && e.capability === 'sl:records:write')
})

test('write implies read', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write']) })
  await assert.doesNotReject(() => ctx.sl.appRecords.query({}))
})

test('ctx.sl delegates to an injected impl when provided', async () => {
  let seen: any = null
  const ctx = createFunctionTestContext({
    def: httpDef(['sl:records:write']),
    sl: { appRecords: { create: (fields: any) => { seen = fields; return { id: 'r1' } } } },
  })
  const res: any = await ctx.sl.appRecords.create({ recordType: 'entry' })
  assert.deepEqual(res, { id: 'r1' })
  assert.deepEqual(seen, { recordType: 'entry' })
})

test('secrets.get is gated to declared refs and returns fixtures', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['secrets:api-key']), secrets: { 'api-key': 'shh' } })
  assert.equal(await ctx.secrets.get('api-key'), 'shh')
  await assert.rejects(() => ctx.secrets.get('other'), (e: any) => e instanceof CapabilityError)
})

test('fetch is gated by the network capability + host scope', async () => {
  const calls: string[] = []
  const fakeFetch = (async (url: any) => { calls.push(String(url)); return { ok: true } as any }) as any
  const ctx = createFunctionTestContext({ def: httpDef(['network:api.example.com']), fetch: fakeFetch })
  await ctx.fetch('https://api.example.com/x')
  assert.deepEqual(calls, ['https://api.example.com/x'])
  await assert.rejects(() => ctx.fetch('https://evil.test/x'), (e: any) => e instanceof CapabilityError)
})

test('caller + log are reflected on ctx', async () => {
  const ctx = createFunctionTestContext({ def: httpDef([]), caller: { userId: 'me' }, collectionId: 'c1' })
  assert.equal(ctx.caller.userId, 'me')
  assert.equal(ctx.caller.anonymous, false)
  assert.equal(ctx.collectionId, 'c1')
  ctx.log('hi', { n: 1 })
  assert.equal(ctx.logs[0].message, 'hi')
  assert.deepEqual(ctx.logs[0].data, { n: 1 })
})

// ── race-safe primitives (claim, counters, tags, contacts, interactions) ──────────────────────────

const enterDef = httpDef(['sl:records:write', 'sl:data:write', 'sl:tags:read', 'sl:contacts:write', 'sl:interactions:write'])

test('claim: one live record per singleton key; customIds are never reused', async () => {
  const ctx = createFunctionTestContext({ def: enterDef })
  const a = await ctx.sl.appRecords.claim({ recordType: 'entry', singletonPer: 'proof', proofId: '23-a', customId: '1' })
  const again = await ctx.sl.appRecords.claim({ recordType: 'entry', singletonPer: 'proof', proofId: '23-a', customId: '2' })
  const clash = await ctx.sl.appRecords.claim({ recordType: 'entry', singletonPer: 'proof', proofId: '23-b', customId: '1' })
  assert.equal(a.created, true)
  assert.deepEqual([again.created, again.conflict, again.record.customId], [false, 'singleton', '1'])
  assert.deepEqual([clash.created, clash.conflict], [false, 'customId'])
  await assert.rejects(() => ctx.sl.appRecords.claim({ recordType: 'entry' }), (e: any) => e.code === 'INVALID_CLAIM')
})

test('counters: start, then +1, shared across contexts on one memory', async () => {
  const memory = createFunctionTestMemory()
  const one = createFunctionTestContext({ def: enterDef, memory })
  const two = createFunctionTestContext({ def: enterDef, memory })
  assert.equal(await one.sl.counters.next('n', { start: 100 }), 100)
  assert.equal(await two.sl.counters.next('n', { start: 100 }), 101)
  assert.equal(await one.sl.counters.get('n'), 101)
})

test('tags, contacts (fill-empty) and interactions (known types only)', async () => {
  const ctx = createFunctionTestContext({ def: enterDef, knownTags: ['23-a'], knownInteractionTypes: ['t1'] })
  assert.deepEqual(await ctx.sl.tags.resolve('23-a'), { id: '23-a', claimSetId: '23', code: 'a' })
  assert.equal(await ctx.sl.tags.resolve('23-zz'), null)
  const c1 = await ctx.sl.contacts.upsert({ email: 'Sam@x.co', firstName: 'Sam' })
  const c2 = await ctx.sl.contacts.upsert({ email: 'sam@x.co', firstName: 'Mallory', lastName: 'Lee' })
  assert.equal(c2.contactId, c1.contactId)
  assert.equal(ctx.memory.contacts[0].firstName, 'Sam')
  assert.equal(ctx.memory.contacts[0].lastName, 'Lee')
  await assert.rejects(() => ctx.sl.contacts.upsert({ firstName: 'x' }), (e: any) => e.code === 'CONTACT_IDENTITY_REQUIRED')
  assert.deepEqual(await ctx.sl.interactions.record({ interactionId: 't1', outcome: 'entered' }), { eventId: 'event-1' })
  await assert.rejects(() => ctx.sl.interactions.record({ interactionId: 'nope' }), (e: any) => e.code === 'INTERACTION_TYPE_NOT_FOUND')
})

test('the new primitives need their capabilities', async () => {
  const ctx = createFunctionTestContext({ def: httpDef([]) })
  await assert.rejects(() => ctx.sl.appRecords.claim({}), (e: any) => e.capability === 'sl:records:write')
  await assert.rejects(() => ctx.sl.counters.next('n'), (e: any) => e.capability === 'sl:data:write')
  await assert.rejects(() => ctx.sl.tags.resolve('23-a'), (e: any) => e.capability === 'sl:tags:read')
  await assert.rejects(() => ctx.sl.contacts.upsert({ email: 'a@b.co' }), (e: any) => e.capability === 'sl:contacts:write')
  await assert.rejects(() => ctx.sl.interactions.record({ interactionId: 't1' }), (e: any) => e.capability === 'sl:interactions:write')
})

// Stock moves in the local harness behave as on the platform: adjust in place with conditions,
// transactions all-or-nothing with replay by idempotency key, totals over data numbers.
test('adjust: in place, conditions after the change, refusals carry their code', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write', 'sl:records:read']) })
  const bin: any = await ctx.sl.appRecords.create({ recordType: 'bin', data: { qty: 3 } })
  const after: any = await ctx.sl.appRecords.adjust(bin.id, { qty: -2 }, { atLeast: { qty: 0 } })
  assert.equal(after.data.qty, 1)
  await assert.rejects(ctx.sl.appRecords.adjust(bin.id, { qty: -2 }, { atLeast: { qty: 0 } }), { code: 'CONDITION_FAILED' })
  await assert.rejects(ctx.sl.appRecords.adjust('nope', { qty: 1 }), { code: 'NOT_FOUND' })
})

test('transaction: all or none (with opIndex), and the same idempotency key replays', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write']) })
  const a: any = await ctx.sl.appRecords.create({ recordType: 'bin', data: { qty: 3 } })
  const b: any = await ctx.sl.appRecords.create({ recordType: 'bin', data: { qty: 0 } })
  const move = (n: number) => [
    { op: 'adjust' as const, recordId: b.id, by: { qty: n } },
    { op: 'adjust' as const, recordId: a.id, by: { qty: -n }, atLeast: { qty: 0 } },
  ]
  await assert.rejects(ctx.sl.transaction(move(5)), { code: 'CONDITION_FAILED', opIndex: 1 })
  assert.deepEqual(ctx.memory.records.map((r: any) => r.data.qty), [3, 0])
  const first: any = await ctx.sl.transaction(move(2), { idempotencyKey: 'scan-1' })
  const again: any = await ctx.sl.transaction(move(2), { idempotencyKey: 'scan-1' })
  assert.equal(first.replayed, false)
  assert.equal(again.replayed, true)
  assert.deepEqual(ctx.memory.records.map((r: any) => r.data.qty), [1, 2])
})

test('aggregate: sums grouped by a data key; transaction needs sl:records:write', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write', 'sl:records:read']) })
  await ctx.sl.appRecords.create({ recordType: 'bin', data: { location: 'A1', qty: 4 } })
  await ctx.sl.appRecords.create({ recordType: 'bin', data: { location: 'A1', qty: 6 } })
  await ctx.sl.appRecords.create({ recordType: 'bin', data: { location: 'B2', qty: 1 } })
  const out: any = await ctx.sl.appRecords.aggregate({ groupBy: ['data.location'], metrics: ['count', 'sum:qty'] })
  assert.deepEqual(out.groups.find((g: any) => g['data.location'] === 'A1'), { 'data.location': 'A1', count: 2, sum_qty: 10 })
  const readOnly = createFunctionTestContext({ def: httpDef(['sl:records:read']) })
  await assert.rejects(readOnly.sl.transaction([{ op: 'delete', recordId: 'x' }]), CapabilityError)
})

test('history: a log op commits with the transaction (and rolls back with it); history.query reads newest first', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write', 'sl:history:write', 'sl:history:read']) })
  const bin: any = await ctx.sl.appRecords.create({ recordType: 'bin', data: { qty: 1 } })
  await assert.rejects(ctx.sl.transaction([
    { op: 'log', type: 'stock.moved', data: { qty: 5 } },
    { op: 'adjust', recordId: bin.id, by: { qty: -5 }, atLeast: { qty: 0 } },
  ]), { code: 'CONDITION_FAILED' })
  assert.equal(ctx.memory.history.length, 0)
  await ctx.sl.transaction([{ op: 'adjust', recordId: bin.id, by: { qty: -1 } }, { op: 'log', type: 'stock.moved', entityId: bin.id, data: { qty: 1 } }])
  await ctx.sl.history.log('count.taken', { counted: 0 }, { entityId: bin.id })
  const events: any = await ctx.sl.history.query({ entityId: bin.id })
  assert.deepEqual(events.map((e: any) => e.type), ['count.taken', 'stock.moved'])
})

test('history: a log op without sl:history:write is refused, as on the platform', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write']) })
  await assert.rejects(ctx.sl.transaction([{ op: 'log', type: 'stock.moved', data: {} }]), CapabilityError)
  await assert.rejects(ctx.sl.history.log('stock.moved', {}), CapabilityError)
})
