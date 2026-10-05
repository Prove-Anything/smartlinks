import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, post, configureSdkCache } from '../src/http'

// proxyMode: a request goes to the parent host by postMessage. If the host never answers, the call
// must fail with PROXY_TIMEOUT — not hang forever with no network request and no error.

describe('proxy request timeout', () => {
  let listener: ((e: { data: any }) => void) | null
  let sent: any[]

  beforeEach(() => {
    listener = null
    sent = []
    ;(globalThis as any).window = {
      location: new URL('https://app.example/'),
      parent: { postMessage: (msg: any) => { sent.push(msg) } },
      addEventListener: (type: string, fn: any) => { if (type === 'message') listener = fn },
      removeEventListener: () => {},
    }
    configureSdkCache({ enabled: false })
  })
  afterEach(() => {
    delete (globalThis as any).window
    initializeApi({ baseURL: 'https://api.test/api/v1', proxyMode: false, proxyTimeoutMs: 90_000, force: true })
  })

  test('a host that never answers → 504 PROXY_TIMEOUT', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', proxyMode: true, proxyTimeoutMs: 40, iframeAutoResize: false, force: true })
    await assert.rejects(post('/public/collection/c1/thing', { a: 1 }), (e: any) =>
      e.statusCode === 504 && e.errorResponse?.errorCode === 'PROXY_TIMEOUT' && /did not answer POST/.test(e.message))
    assert.equal(sent.length, 1)
  })

  test('a host that answers in time resolves normally (and the timer is cleared)', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', proxyMode: true, proxyTimeoutMs: 200, iframeAutoResize: false, force: true })
    const call = post<{ ok: number }>('/public/collection/c1/thing', {})
    await new Promise((r) => setTimeout(r, 10))
    const { id } = sent[0]
    ;(globalThis as any).window._smartlinksProxyListener = true
    listener!({ data: { _smartlinksProxyResponse: true, id, data: { ok: 1 } } })
    assert.deepEqual(await call, { ok: 1 })
    await new Promise((r) => setTimeout(r, 250)) // past the timeout: nothing fires, no unhandled rejection
  })
})
