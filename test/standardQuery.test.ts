import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { proof } from '../src/api/proof'
import { contact } from '../src/api/contact'
import { products } from '../src/api/products'
import { app } from '../src/api/appObjects'

// The standard query: one body, sent as it is to each resource's query call (docs/standard-query.md).

describe('the standard query', () => {
  const realFetch = globalThis.fetch
  let calls: { method: string; url: string; body: any }[]

  beforeEach(() => {
    calls = []
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const method = (init.method || 'GET').toUpperCase()
      calls.push({ method, url: String(url), body: init.body ? JSON.parse(init.body) : undefined })
      const json = method === 'GET' ? { name: 'proofs', fields: {}, links: {} } : { items: [{ id: 'p1' }], nextCursor: null, count: 1 }
      return new Response(JSON.stringify(json), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  test('each resource posts the body unchanged to its own address', async () => {
    const body = { where: { userId: { isNull: false }, 'data.status': 'released' }, orderBy: [{ createdAt: 'desc' as const }], limit: 5, count: true }
    await proof.query('c 1', body)
    await contact.query('c 1', body)
    await products.standardQuery('c 1', body)
    await app.records.query('c 1', 'my app', body)
    assert.deepEqual(calls.map((c) => `${c.method} ${new URL(c.url).pathname}`), [
      'POST /api/v1/admin/collection/c%201/proof/query',
      'POST /api/v1/admin/collection/c%201/contacts/query',
      'POST /api/v1/admin/collection/c%201/products/standard/query',
      'POST /api/v1/admin/collection/c%201/app/my%20app/records/query',
    ])
    for (const c of calls) assert.deepEqual(c.body, body)
  })

  test('with no body it asks for the first page, and the answer comes back as sent', async () => {
    const out = await proof.query('c1')
    assert.deepEqual(calls[0].body, {})
    assert.deepEqual(out, { items: [{ id: 'p1' }], nextCursor: null, count: 1 })
  })

  test("products' own query keeps its address and its body", async () => {
    await products.query('c1', { q: 'gin' }, true)
    assert.equal(new URL(calls[0].url).pathname, '/api/v1/admin/collection/c1/products/query')
    assert.deepEqual(calls[0].body, { q: 'gin' })
  })

  test('what a query can use is a GET on the same address', async () => {
    await proof.queryFields('c1')
    await contact.queryFields('c1')
    await products.standardQueryFields('c1')
    await app.records.queryFields('c1', 'a1')
    assert.deepEqual(calls.map((c) => `${c.method} ${new URL(c.url).pathname}`), [
      'GET /api/v1/admin/collection/c1/proof/query',
      'GET /api/v1/admin/collection/c1/contacts/query',
      'GET /api/v1/admin/collection/c1/products/standard/query',
      'GET /api/v1/admin/collection/c1/app/a1/records/query',
    ])
  })
})
