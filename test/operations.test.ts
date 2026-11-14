import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createFunctionTestContext, CapabilityError } from '../src/testing'

// Work orders, stock, bills of materials and made-from in the function test context: the same two gates
// as production (the capability, and collection authority), your stand-ins are called, anything else
// returns a stub echo.

const def = (capabilities: string[], authority: 'collection' | 'caller' = 'collection') =>
  ({ trigger: { type: 'http' as const }, authority, capabilities })

test('with the capability and collection authority, a stand-in is called with the arguments', async () => {
  const seen: any[] = []
  const ctx = createFunctionTestContext({
    def: def(['sl:stock:write']),
    sl: { stock: { move: async (input: any) => { seen.push(input); return { movementId: 'm1', kind: 'move', productId: input.productId, quantity: input.quantity, unit: 'each', replayed: false } as any } } },
  })
  const out = await ctx.sl.stock.move({ from: 'a', to: 'b', productId: 'cap', quantity: 5 })
  assert.equal(out.movementId, 'm1')
  assert.deepEqual(seen, [{ from: 'a', to: 'b', productId: 'cap', quantity: 5 }])
})

test('a call with no stand-in returns a stub echo', async () => {
  const ctx = createFunctionTestContext({ def: def(['sl:workorders:read']) })
  const res: any = await ctx.sl.workOrders.get('19264')
  assert.deepEqual(res, { __stub: true, method: 'workOrders.get', args: ['19264'] })
})

test('read capability reads but does not write; no capability, nothing', async () => {
  const ctx = createFunctionTestContext({ def: def(['sl:stock:read']) })
  await assert.doesNotReject(() => ctx.sl.stock.totals({ productId: 'cap' }))
  await assert.rejects(() => ctx.sl.stock.receive({ containerId: 'c', productId: 'cap', quantity: 1 }), (e: any) => e instanceof CapabilityError && e.capability === 'sl:stock:write')
  await assert.rejects(() => ctx.sl.boms.current({ productId: 'p' }), (e: any) => e instanceof CapabilityError && e.capability === 'sl:boms:read')
})

test('a function running as the caller cannot reach any of it', async () => {
  const ctx = createFunctionTestContext({ def: def(['sl:stock:write', 'sl:workorders:write'], 'caller') })
  await assert.rejects(() => ctx.sl.stock.totals({ productId: 'cap' }), (e: any) => e.code === 'NEEDS_COLLECTION_AUTHORITY')
  await assert.rejects(() => ctx.sl.workOrders.create({ ref: 'x' }), (e: any) => e.code === 'NEEDS_COLLECTION_AUTHORITY')
})

test('an event or cron function always has collection authority', async () => {
  const ctx = createFunctionTestContext({ def: { trigger: { type: 'cron', schedule: '0 * * * *' } as any, capabilities: ['sl:stock:read'] } })
  await assert.doesNotReject(() => ctx.sl.stock.short({ horizonDays: 30 }))
})

test('operations.transaction: writes only, each needing its capability; steps reach the stand-ins', async () => {
  const calls: string[] = []
  const ctx = createFunctionTestContext({
    def: def(['sl:stock:write', 'sl:workorders:write']),
    sl: {
      stock: { move: async () => { calls.push('move'); return {} as any } },
      workOrders: { completeStage: async () => { calls.push('complete'); return {} as any } },
    },
  })
  const out = await ctx.sl.operations.transaction([{ op: 'stock.move', args: [{}] }, { op: 'workOrders.completeStage', args: ['id', 'picking'] }])
  assert.equal(out.results.length, 2)
  assert.deepEqual(calls, ['move', 'complete'])
  await assert.rejects(() => ctx.sl.operations.transaction([{ op: 'stock.totals', args: [{}] }]), (e: any) => e.code === 'INVALID_INPUT')
  await assert.rejects(() => ctx.sl.operations.transaction([{ op: 'stock.vanish', args: [] }]), (e: any) => e.code === 'UNKNOWN_OP')
  await assert.rejects(() => ctx.sl.operations.transaction([{ op: 'boms.set', args: [{}] }]), (e: any) => e instanceof CapabilityError && e.capability === 'sl:boms:write')
})
