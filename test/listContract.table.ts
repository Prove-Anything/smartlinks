// One row for every list function: how to call it. test/listContract.test.ts makes each call and holds
// the request to the API's own list table (test/fixtures/api-lists.json).
//
//   name   the function, as upgrade/3.json names it ("batch.list", "app.records.list")
//   call   make the call. It is given the options to pass: `{ ...opts, limit: 7, cursor: 'CUR7' }`.
//          Put them wherever the function takes its options (a trailing options object, its params
//          object, its request body…).
//   opts   the list's standard words, one sample of each the route takes: q, orderBy, a date range
//          (`createdAt: { gte, lte }`), from / to, expand. The test fails if the route takes one that
//          is not here.
//   whole  true for a small fixed set (a page's widgets, facet definitions…): it is returned complete,
//          so `call` ignores its argument and the function takes no paging options.
//   skip   { word: 'why this function does not offer it' } — rarely.
//
// Rows are grouped by the file the function lives in (src/api/<file>.ts), in file-name order.
import * as SL from '../src/api'
import { ROWS_A } from './listContract.rows.a'
import { ROWS_B } from './listContract.rows.b'
import { ROWS_C } from './listContract.rows.c'
import { ROWS_D } from './listContract.rows.dd'

export interface Row {
  name: string
  call: (options: any) => Promise<any>
  opts?: Record<string, any>
  whole?: boolean
  skip?: Record<string, string>
}

const C = 'c1'
const DAY = '2026-11-01T00:00:00Z'
const END = '2026-11-30T00:00:00Z'
export const SAMPLE = { C, DAY, END }

export const ROWS: Row[] = [
  // ── jobs.ts ────────────────────────────────────────────────────────────────────────────────────
  { name: 'jobs.list', call: (o) => SL.jobs.list(C, o), opts: { from: DAY, to: END } },

  // ── comms.ts: two recipient lists that are not in the upgrade table's list entries (they were renamed) ──
  { name: 'comms.queryRecipientsWithInteraction', call: (o) => SL.comms.queryRecipientsWithInteraction(C, { broadcastId: 'b1', interactionId: 'i1', ...o }), opts: { from: DAY, to: END } },
  { name: 'comms.queryRecipientsWithoutInteraction', call: (o) => SL.comms.queryRecipientsWithoutInteraction(C, { broadcastId: 'b1', interactionId: 'i1', ...o }), opts: { from: DAY, to: END } },

  ...ROWS_A,
  ...ROWS_B,
  ...ROWS_C,
  ...ROWS_D,
]
