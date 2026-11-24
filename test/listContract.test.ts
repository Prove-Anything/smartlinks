import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { initializeApi, configureSdkCache } from '../src/http'
import { ROWS } from './listContract.table'

// Every list function, checked against the API's own description of its list routes.
//
// test/fixtures/api-lists.json is a copy of the server's table (prove: services/apiVersion/lists.json):
// for each list route, how it pages, which parameters it reads, and how the standard words (q, orderBy,
// a date field, from / to, expand) map onto them. A caller on API version 2027-01, which is every SDK 3
// caller, must send the standard words and nothing the route has retired. This test makes each list
// function's real request and holds it to that table, so the SDK and the API cannot drift apart:
//
//   1. the request goes to a route the table knows;
//   2. `limit` and `cursor` are sent (a small fixed set, `whole`, sends neither and takes no options);
//   3. nothing retired is sent (`search` where the word is `q`, `sort` for `orderBy`, …);
//   4. where the route refuses unknown parameters, everything sent is something it reads;
//   5. every standard word the route takes is offered by the function (the row's `opts` exercise them).
//
// Add a row to listContract.table.ts for every list function. `upgrade/3.json` lists them; the last test
// fails when one has no row.

type Entry = {
  method: string; path: string; paging: string; paramsIn?: string; params?: string[]; whole?: boolean
  limitParam?: string; words?: any
}
const table: Entry[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'api-lists.json'), 'utf8'))
const compiled = table.map((e) => ({
  e,
  re: new RegExp('^' + e.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z_]\w*/g, '[^/]+') + '/?$'),
}))

const top = (p: string) => String(p).split(/[.[=]/)[0]
const get = (o: any, p: string) => String(p).split('.').reduce((a, k) => (a == null ? undefined : a[k]), o)

/** The standard names a list takes and the route's own names it has retired (as the server works them out). */
function wordsOf(e: Entry) {
  const w = e.words
  const standard = new Set<string>()
  const retired = new Map<string, string>()
  if (!w) return { standard, retired }
  const retire = (p: string, use: string) => { if (p && p !== use && top(p) !== top(use)) retired.set(p, use) }
  if (w.q) { standard.add('q'); retire(w.q, 'q') }
  if (w.orderBy) { standard.add('orderBy'); retire(w.orderBy.to, 'orderBy'); if (w.orderBy.dirTo) retire(w.orderBy.dirTo, 'orderBy') }
  for (const [field, ops] of Object.entries<any>(w.ranges || {})) {
    standard.add(field)
    for (const [op, p] of Object.entries<string>(ops)) retire(p, `${field}[${op}]`)
  }
  for (const name of w.window || []) standard.add(name)
  if (w.expand) {
    standard.add('expand')
    for (const [name, sets] of Object.entries<any>(w.expand)) {
      if (typeof sets === 'string') retire(sets.replace(/^\$(csv|array):/, ''), 'expand')
      else for (const p of Object.keys(sets)) retire(p, `expand=${name}`)
    }
  }
  for (const [word, p] of Object.entries<string>(w.retired || {})) { standard.add(word); retire(p, word) }
  for (const [p, use] of Object.entries<string>(w.gone || {})) retired.set(p, use)
  return { standard, retired }
}

describe('every list function keeps to the API\'s list table', () => {
  const realFetch = globalThis.fetch
  let calls: { method: string; url: string; body: any }[]

  beforeEach(() => {
    calls = []
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const method = (init.method || 'GET').toUpperCase()
      let body: any
      try { body = init.body ? JSON.parse(init.body) : undefined } catch { body = undefined }
      calls.push({ method, url: String(url), body })
      return new Response(JSON.stringify({ items: [], nextCursor: null }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  for (const row of ROWS) {
    test(row.name, async () => {
      const page = { limit: 7, cursor: 'CUR7' }
      await row.call(row.whole ? ({} as any) : { ...(row.opts || {}), ...page })
      assert.ok(calls.length >= 1, 'made no request')
      const c = calls[calls.length - 1]
      const url = new URL(c.url)
      const where = url.pathname.replace(/^\/api\/v1/, '')
      const hit = compiled.find((x) => x.e.method === c.method && x.re.test(where))
      assert.ok(hit, `${c.method} ${where} is not a list route the API describes`)
      const e = hit!.e
      const inBody = e.paramsIn === 'body'
      const query: Record<string, any> = {}
      for (const [k, v] of url.searchParams) {
        const m = /^([^[]+)\[([^\]]+)\]$/.exec(k)
        if (m) { query[m[1]] = { ...(query[m[1]] || {}), [m[2]]: v } } else query[k] = v
      }
      const bag = inBody ? (c.body || {}) : query
      const { standard, retired } = wordsOf(e)

      // 2. paging
      if (e.whole) {
        assert.equal(row.whole, true, `${e.path} is a fixed set returned whole: mark the row whole (and the function takes no paging options)`)
        assert.equal(bag.limit, undefined, 'a fixed set has no limit')
        assert.equal(bag.cursor, undefined, 'a fixed set has no cursor')
      } else {
        assert.notEqual(row.whole, true, `${e.path} pages: the row must not be marked whole`)
        assert.equal(String(bag.limit), '7', `limit was not sent in the ${inBody ? 'body' : 'address'} (sent: ${JSON.stringify(bag)})`)
        assert.equal(bag.cursor, 'CUR7', `cursor was not sent in the ${inBody ? 'body' : 'address'} (sent: ${JSON.stringify(bag)})`)
      }

      // 3. nothing retired
      for (const [p, use] of retired) {
        assert.equal(get(bag, p), undefined, `sends "${p}": the API's word is "${use}"`)
        if (!p.includes('.')) assert.equal(query[p], undefined, `sends "${p}" in the address: the API's word is "${use}"`)
      }

      // 4. only what the route reads (where the API refuses the rest)
      if (!inBody && e.params && !e.params.includes('*')) {
        const gone = new Set([...retired.keys()].filter((p) => !p.includes('.')))
        const allowed = new Set([...e.params.filter((p) => !p.includes('.') && !gone.has(p)), ...standard, ...(e.whole ? [] : ['limit', 'cursor'])])
        for (const k of Object.keys(query)) assert.ok(allowed.has(k), `sends "${k}", which ${e.path} does not read (it reads: ${[...allowed].sort().join(', ')})`)
      }

      // 5. every standard word the route takes is offered
      const skip = new Set(Object.keys(row.skip || {}))
      for (const word of standard) {
        if (skip.has(word)) continue
        assert.notEqual(bag[word], undefined, `${e.path} takes "${word}": exercise it in the row's opts (or say why not in skip)`)
      }
    })
  }

  test('every list function in the upgrade table has a row', () => {
    const upgrade = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'upgrade', '3.json'), 'utf8'))
    const names = upgrade.changes.filter((c: any) => c.kind === 'list').map((c: any) => c.name)
    const have = new Set(ROWS.map((r) => r.name))
    const missing = names.filter((n: string) => !have.has(n))
    assert.deepEqual(missing, [], `list functions with no row in test/listContract.table.ts: ${missing.join(', ')}`)
  })
})
