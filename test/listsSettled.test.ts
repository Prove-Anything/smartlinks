import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { SmartlinksApiError } from '../src/types/error'
import { collection } from '../src/api/collection'
import { comms } from '../src/api/comms'
import { all, each } from '../src/list'

// SDK 3: the calls settled after the list conversion. Each one goes to an address the API really has,
// and the page helpers follow nextCursor to the end.

describe('lists: the calls settled for SDK 3', () => {
  const realFetch = globalThis.fetch
  let calls: { method: string; url: string; body: any }[]
  let replies: any[]

  beforeEach(() => {
    calls = []
    replies = [{ items: [], nextCursor: null }]
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const method = (init.method || 'GET').toUpperCase()
      calls.push({ method, url: String(url), body: init.body ? JSON.parse(init.body) : undefined })
      const reply = replies.length > 1 ? replies.shift() : replies[0]
      const status = reply && reply.error ? 400 : 200
      return new Response(JSON.stringify(reply), { status, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  const last = () => calls[calls.length - 1]
  const call = () => [last().method, last().url.replace('https://api.test/api/v1', '')]

  test('collection.list is the admin list: there is no public list of collections', async () => {
    replies = [{ items: [{ id: 'c1', title: 'One' }], nextCursor: null }]
    const res = await collection.list()
    assert.deepEqual(call(), ['GET', '/admin/collection'])
    assert.equal(res.items[0].id, 'c1')
  })

  test('recipients with and without an interaction go to the routes the API has, with interactionId', async () => {
    replies = [{ items: ['ct1', 'ct2'], nextCursor: null }]
    const without = await comms.queryRecipientsWithoutInteraction('c1', { broadcastId: 'b1', interactionId: 'survey-done' })
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/comm/query/recipients/without-interaction'])
    assert.deepEqual(last().body, { broadcastId: 'b1', interactionId: 'survey-done' })
    assert.deepEqual(without.items, ['ct1', 'ct2'])

    replies = [{ items: [{ id: 'ct1', outcome: 'yes' }], nextCursor: null }]
    const withIt = await comms.queryRecipientsWithInteraction('c1', { broadcastId: 'b1', interactionId: 'survey-done', includeOutcome: true })
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/comm/query/recipients/with-interaction'])
    assert.deepEqual(withIt.items, [{ id: 'ct1', outcome: 'yes' }])
  })

  test('each and all follow nextCursor to the last page', async () => {
    const pages = [
      { items: ['a', 'b'], nextCursor: 'p2' },
      { items: ['c', 'd'], nextCursor: 'p3' },
      { items: ['e'], nextCursor: null },
    ]
    const seen: (string | undefined)[] = []
    const page = async (cursor?: string) => { seen.push(cursor); return pages[seen.length - 1] }
    assert.deepEqual(await all(page), ['a', 'b', 'c', 'd', 'e'])
    assert.deepEqual(seen, [undefined, 'p2', 'p3'])

    seen.length = 0
    const got: string[] = []
    for await (const x of each(page)) got.push(x)
    assert.deepEqual(got, ['a', 'b', 'c', 'd', 'e'])
  })

  test('all stops at its limit, so a mistake cannot fetch everything', async () => {
    let n = 0
    const endless = async () => ({ items: [n++, n++, n++], nextCursor: 'more' })
    assert.equal((await all(endless, { max: 7 })).length, 7)
  })

  test('an option a list does not read comes back as an error that says so, with the request id', async () => {
    replies = [{ error: { code: 'UNKNOWN_PARAMETER', message: 'This list has no "serach" parameter. Did you mean "search"?', details: { unknown: ['serach'], allowed: ['cursor', 'limit', 'search'] }, requestId: 'req-9' } }]
    await assert.rejects(() => collection.list(), (e: any) => {
      assert.ok(e instanceof SmartlinksApiError)
      assert.equal(e.statusCode, 400)
      assert.equal(e.errorCode, 'UNKNOWN_PARAMETER')
      assert.equal(e.requestId, 'req-9')
      assert.deepEqual(e.details.unknown, ['serach'])
      return true
    })
  })
})
