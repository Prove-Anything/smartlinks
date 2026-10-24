import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createFunctionTestContext, createFunctionTestMemory } from '../src/testing'

// ctx.sl.bookings in the server-function test harness: the platform's booking rules in memory, so a
// booking app's functions can be tested locally — including "ten people, one seat".

const def = { capabilities: ['sl:bookings:write'], trigger: { type: 'http' }, visibility: 'public', authority: 'collection' } as any
const t = (h: number) => new Date(Date.UTC(2026, 10, 2, h)).toISOString()

test('capabilities are enforced', async () => {
  const ctx = createFunctionTestContext({ def: { ...def, capabilities: ['sl:bookings:read'] } })
  await assert.rejects(ctx.sl.bookings.create({ slotId: 'x' }), { code: 'CAPABILITY_DENIED' })
  assert.deepEqual((await ctx.sl.bookings.query()).data, [])
})

test('ten concurrent requests for the last seat: exactly one wins', async () => {
  const memory = createFunctionTestMemory()
  const ctx = createFunctionTestContext({ def, memory })
  const slot = await ctx.sl.bookings.slots.create({ startsAt: t(19), endsAt: t(21), capacity: 1 })
  const results = await Promise.allSettled(Array.from({ length: 10 }, (_, i) => ctx.sl.bookings.create({ slotId: slot.id, contactId: `c${i}` })))
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
  for (const r of results.filter((x) => x.status === 'rejected') as PromiseRejectedResult[]) assert.equal(r.reason.code, 'SLOT_FULL')
  assert.equal((await ctx.sl.bookings.slots.get(slot.id))!.remaining, 0)
  assert.equal(memory.bookings.bookings.length, 1)
})

test('exclusive time: overlaps refused, buffers block, multi-resource all-or-nothing', async () => {
  const ctx = createFunctionTestContext({ def })
  await ctx.sl.bookings.create({ resourceType: 'record', resourceId: 'jo', startsAt: t(10), endsAt: t(11), bufferAfter: 15 })
  await assert.rejects(ctx.sl.bookings.create({ resourceType: 'record', resourceId: 'jo', startsAt: t(11), endsAt: t(12) }), { code: 'RESOURCE_TAKEN' })
  await ctx.sl.bookings.create({ resourceType: 'record', resourceId: 'chair-2', startsAt: t(13), endsAt: t(14) })
  await assert.rejects(ctx.sl.bookings.create({
    startsAt: t(13), endsAt: t(14), allocations: [{ resourceType: 'record', resourceId: 'sam' }, { resourceType: 'record', resourceId: 'chair-2' }],
  }), { code: 'RESOURCE_TAKEN' })
  const fb = await ctx.sl.bookings.freebusy({ resources: ['record:sam', 'record:jo'], from: t(9), to: t(16) })
  assert.deepEqual(fb.resources[0].busy, [])
  assert.deepEqual(fb.resources[1].busy, [{ start: t(10), end: new Date(Date.UTC(2026, 10, 2, 11, 15)).toISOString() }])
})

test('idempotent creates, per-person limits, holds, confirm, cancel, move', async () => {
  const ctx = createFunctionTestContext({ def, caller: { userId: 'u1' } })
  const a = await ctx.sl.bookings.slots.create({ startsAt: t(19), endsAt: t(21), capacity: 10, perContactLimit: 4 })
  const b = await ctx.sl.bookings.slots.create({ startsAt: t(22), endsAt: t(23), capacity: 1 })
  const first = await ctx.sl.bookings.create({ slotId: a.id, quantity: 3, contactId: 'contact-of-u1', status: 'held', idempotencyKey: 'pi_1' })
  assert.equal((await ctx.sl.bookings.create({ slotId: a.id, quantity: 3, idempotencyKey: 'pi_1' })).replayed, true)
  await assert.rejects(ctx.sl.bookings.create({ slotId: a.id, quantity: 2, contactId: 'contact-of-u1' }), { code: 'PER_CONTACT_LIMIT' })
  assert.equal((await ctx.sl.bookings.confirm(first.id)).status, 'confirmed')
  assert.equal((await ctx.sl.bookings.mine()).data.length, 1)

  // Move to a full slot fails and changes nothing; to a free one, it moves.
  await ctx.sl.bookings.create({ slotId: b.id })
  await assert.rejects(ctx.sl.bookings.move(first.id, { slotId: b.id }), { code: 'SLOT_FULL' })
  assert.equal((await ctx.sl.bookings.slots.get(a.id))!.booked, 3)
  const c = await ctx.sl.bookings.slots.create({ startsAt: t(8), endsAt: t(9), capacity: 5 })
  const moved = await ctx.sl.bookings.move(first.id, { slotId: c.id })
  assert.equal(moved.allocations[0].slotId, c.id)
  assert.equal((await ctx.sl.bookings.slots.get(a.id))!.booked, 0)
  assert.equal((await ctx.sl.bookings.slots.get(c.id))!.booked, 3)

  const cancelled = await ctx.sl.bookings.cancel(first.id, { reason: 'customer called' })
  assert.equal(cancelled.cancelReason, 'customer called')
  assert.equal((await ctx.sl.bookings.slots.get(c.id))!.remaining, 5)

  const held = await ctx.sl.bookings.create({ slotId: c.id, status: 'held', holdMinutes: 0 })
  await new Promise((r) => setTimeout(r, 5))
  await assert.rejects(ctx.sl.bookings.confirm(held.id), { code: 'HOLD_EXPIRED' })
})
