import { test } from 'node:test'
import assert from 'node:assert/strict'
import { freeTimes, withinSchedule, subtractIntervals, validateSchedule, openIntervals } from '../src/utils/freeTimes'
import type { StandardSchedule } from '../src/types/bookings'

// freeTimes is pure: opening hours (local wall-clock) minus busy time, stepped into start times.

const sam: StandardSchedule = {
  timezone: 'Europe/London',
  weekly: { mon: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '15:00' }] },
  overrides: [{ date: '2026-11-02', hours: [] }],
}
const iso = (s: string) => new Date(s).toISOString()
const starts = (list: { start: string }[]) => list.map((x) => x.start)

test('30-minute appointments on a Monday, around lunch', () => {
  const out = freeTimes({ hours: sam, from: '2026-10-26T00:00:00Z', to: '2026-10-27T00:00:00Z', duration: 30, now: 0 })
  assert.deepEqual(starts(out), [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  ].map((t) => iso(`2026-10-26T${t}:00Z`)))
})

test('busy time and buffers remove start times', () => {
  const out = freeTimes({
    hours: sam, from: '2026-10-26T00:00:00Z', to: '2026-10-27T00:00:00Z', duration: 30, now: 0,
    busy: [{ start: '2026-10-26T10:00:00Z', end: '2026-10-26T10:30:00Z' }],
    bufferAfter: 15,
  })
  // 09:30 would run its buffer into the 10:00 booking; 10:00 is busy.
  assert.ok(!starts(out).includes(iso('2026-10-26T09:30:00Z')))
  assert.ok(!starts(out).includes(iso('2026-10-26T10:00:00Z')))
  assert.ok(starts(out).includes(iso('2026-10-26T10:30:00Z')))
  // The last appointment's buffer may run past closing.
  assert.ok(starts(out).includes(iso('2026-10-26T14:30:00Z')))
  const strict = freeTimes({ hours: sam, from: '2026-10-26T00:00:00Z', to: '2026-10-27T00:00:00Z', duration: 30, now: 0, bufferAfter: 15, buffersWithinHours: true })
  assert.ok(!starts(strict).includes(iso('2026-10-26T14:30:00Z')))
})

test('the same local hours either side of a daylight-saving change', () => {
  // Monday 19 Oct is BST (09:00 local = 08:00Z); Monday 26 Oct is GMT.
  const bst = freeTimes({ hours: sam, from: '2026-10-19T00:00:00Z', to: '2026-10-20T00:00:00Z', duration: 60, now: 0 })
  assert.equal(bst[0].start, iso('2026-10-19T08:00:00Z'))
  const gmt = freeTimes({ hours: sam, from: '2026-10-26T00:00:00Z', to: '2026-10-27T00:00:00Z', duration: 60, now: 0 })
  assert.equal(gmt[0].start, iso('2026-10-26T09:00:00Z'))
})

test('minimum notice and overrides', () => {
  const out = freeTimes({ hours: sam, from: '2026-10-26T00:00:00Z', to: '2026-10-27T00:00:00Z', duration: 60, now: new Date('2026-10-26T09:10:00Z').getTime(), minNotice: 60 })
  // Now 09:10 + 60 min notice → earliest 10:10; hourly starts are aligned to :00, so 11:00 is first.
  assert.equal(out[0].start, iso('2026-10-26T11:00:00Z'))
  const closed = freeTimes({ hours: sam, from: '2026-11-02T00:00:00Z', to: '2026-11-03T00:00:00Z', duration: 30, now: 0 })
  assert.equal(closed.length, 0)
})

test('explicit open intervals instead of a schedule', () => {
  const t0 = Date.parse('2026-10-26T10:00:00Z')
  const out = freeTimes({ hours: [{ start: t0, end: t0 + 90 * 60000 }], from: t0, to: t0 + 86400000, duration: 45, now: 0 })
  assert.deepEqual(starts(out), [iso('2026-10-26T10:00:00Z'), iso('2026-10-26T10:45:00Z')])
})

test('withinSchedule, subtractIntervals, validateSchedule, openIntervals', () => {
  assert.equal(withinSchedule(sam, '2026-10-26T11:30:00Z', '2026-10-26T12:00:00Z'), true)
  assert.equal(withinSchedule(sam, '2026-10-26T11:30:00Z', '2026-10-26T12:30:00Z'), false)
  assert.deepEqual(subtractIntervals([{ start: 0, end: 100 }], [{ start: 20, end: 30 }, { start: 25, end: 40 }]), [{ start: 0, end: 20 }, { start: 40, end: 100 }])
  assert.equal(validateSchedule(sam), true)
  assert.throws(() => validateSchedule({ timezone: 'Nope/Zone' } as any), /timezone/)
  assert.equal(openIntervals(sam, '2026-10-26T00:00:00Z', '2026-10-27T00:00:00Z').length, 2)
})
