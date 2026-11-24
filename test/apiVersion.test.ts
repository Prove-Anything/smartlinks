import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache, request, post, put, patch, del, getApiHeaders, getClientHeaders, getApiVersion } from '../src/http'
import { API_VERSION, SDK_VERSION } from '../src/apiVersion'

// Every request the SDK makes itself says which API version it was built for and which SDK release and
// app it is (prove docs/design/api-standard-and-versioning.md). The headers a HOST uses to call the API
// for an app in its frame (getApiHeaders) carry none of that: the host forwards the app's own.

describe('API version headers', () => {
  const realFetch = globalThis.fetch
  let seen: Record<string, string>[]

  beforeEach(() => {
    seen = []
    configureSdkCache({ enabled: false })
    ;(globalThis as any).fetch = async (_url: string, init: any = {}) => {
      const h: Record<string, string> = {}
      for (const [k, v] of Object.entries(init.headers || {})) h[k.toLowerCase()] = String(v)
      seen.push(h)
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  test('this release is built for the baseline and says which SDK it is', () => {
    assert.equal(API_VERSION, '2026-11')
    assert.match(SDK_VERSION, /^\d+\.\d+\.\d+/)
  })

  test('GET, POST, PUT, PATCH and DELETE all carry the version and the SDK', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k', force: true })
    await request('/a')
    await post('/a', { x: 1 })
    await put('/a', { x: 1 })
    await patch('/a', { x: 1 })
    await del('/a')
    assert.equal(seen.length, 5)
    for (const h of seen) {
      assert.equal(h['smartlinks-version'], '2026-11')
      assert.equal(h['smartlinks-sdk'], `js/${SDK_VERSION}`)
    }
  })

  test('an app says which app and release it is', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', appId: 'faq', appVersion: '1.0.23', force: true })
    await request('/a')
    assert.equal(seen[0]['smartlinks-app'], 'faq@1.0.23')
    initializeApi({ baseURL: 'https://api.test/api/v1', appId: 'faq', force: true })
    await request('/b')
    assert.equal(seen[1]['smartlinks-app'], 'faq')
  })

  test('an app can pin another version; anything that is not year-month is ignored', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', apiVersion: '2027-01', force: true })
    assert.equal(getApiVersion(), '2027-01')
    await request('/a')
    assert.equal(seen[0]['smartlinks-version'], '2027-01')
    initializeApi({ baseURL: 'https://api.test/api/v1', apiVersion: 'v2', force: true })
    assert.equal(getApiVersion(), '2026-11')
  })

  test("the headers a host uses for a framed app's calls carry no version of the host's own", () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k', appId: 'studio', force: true })
    const host = Object.keys(getApiHeaders()).map((k) => k.toLowerCase())
    assert.ok(!host.includes('smartlinks-version'))
    assert.ok(!host.includes('smartlinks-sdk'))
    assert.ok(!host.includes('smartlinks-app'))
    assert.deepEqual(Object.keys(getClientHeaders()).sort(), ['SmartLinks-App', 'SmartLinks-SDK', 'SmartLinks-Version'])
  })

  test('errors in the one shape (2027-01) are read: code, message, details and the request id', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k', force: true })
    ;(globalThis as any).fetch = async () => new Response(JSON.stringify({ error: { code: 'INVALID_QUERY', message: 'Unknown field "emial" on contacts.', details: { field: 'emial' }, requestId: 'r1' } }), { status: 400, headers: { 'content-type': 'application/json' } })
    await assert.rejects(() => request('/x'), (e: any) => {
      assert.equal(e.statusCode, 400)
      assert.equal(e.errorCode, 'INVALID_QUERY')
      assert.match(e.message, /Unknown field "emial" on contacts./)
      assert.deepEqual(e.details, { field: 'emial', requestId: 'r1' })
      return true
    })
  })

  test('older shapes still read, and two that used to come out garbled now make sense', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k', force: true })
    const reply = (body: any, status = 400) => { (globalThis as any).fetch = async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }) }
    reply({ errorCode: 'NOT_FOUND', errorText: 'No such contact' }, 404)
    await assert.rejects(() => request('/a'), (e: any) => e.errorCode === 'NOT_FOUND' && /No such contact/.test(e.message))
    reply({ error: { message: 'Rate limit exceeded', type: 'rate_limit_error' } }, 429)
    await assert.rejects(() => request('/b'), (e: any) => e.errorCode === 'rate_limit_error' && /Rate limit exceeded/.test(e.message) && !/object Object/.test(e.message))
    reply({ ok: false, errors: [{ code: 'MANIFEST_INVALID', message: 'meta.name is required' }] }, 422)
    await assert.rejects(() => request('/c'), (e: any) => e.errorCode === 'MANIFEST_INVALID' && /meta.name is required/.test(e.message))
  })
})
