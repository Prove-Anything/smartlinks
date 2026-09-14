import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createFunctionTestContext, CapabilityError } from '../src/testing'

// The local harness must enforce the SAME capability envelope the server does, so a
// function fails locally the way it would after deploy. These pin that contract.

const httpDef = (capabilities: string[]) => ({ trigger: { type: 'http' as const }, capabilities })

test('a declared capability lets the sl call through (stub when no impl)', async () => {
  const ctx = createFunctionTestContext({ def: httpDef(['sl:records:write']) })
  const res: any = await ctx.sl.appRecords.create({ recordType: 't' })
  assert.equal(res.__stub, true)
  assert.equal(res.method, 'records.create')
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
