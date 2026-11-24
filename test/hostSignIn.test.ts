import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache, request, post, getApiHeaders, getBearerToken, setBearerToken } from '../src/http'
import { SHARED_DEPENDENCIES, SHARED_DEPENDENCY_CONTRACT_VERSION } from '../src/shared-dependencies'

// A host that serves SDK 3 beside SDK 2 has two copies of the SDK on one page. The second copy holds no
// sign-in of its own: it asks the host's copy for the current one on every request
// (initializeApi({ signInFrom })), so the two can never disagree about who is signed in.

describe('a second copy of the SDK follows the host sign-in', () => {
  const realFetch = globalThis.fetch
  let seen: { url: string; headers: Record<string, string> }[]
  let host: Record<string, string>

  beforeEach(() => {
    seen = []
    host = {}
    setBearerToken(undefined)
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const h: Record<string, string> = {}
      for (const [k, v] of Object.entries(init.headers || {})) h[k.toLowerCase()] = String(v)
      seen.push({ url: String(url), headers: h })
      return new Response(JSON.stringify({ n: seen.length }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => {
    globalThis.fetch = realFetch
    initializeApi({ baseURL: 'https://api.test/api/v1', force: true })
    configureSdkCache({ enabled: false })
  })

  test('each request carries the sign-in the host has at that moment', async () => {
    configureSdkCache({ enabled: false })
    initializeApi({ baseURL: 'https://api.test/api/v1', signInFrom: () => host, force: true })

    await request('/a')
    assert.equal(seen[0].headers['authorization'], undefined)

    host = { AUTHORIZATION: 'Bearer one', 'X-Grant-Token': 'g1' } // someone signs in on the host
    await post('/b', { x: 1 })
    assert.equal(seen[1].headers['authorization'], 'Bearer one')
    assert.equal(seen[1].headers['x-grant-token'], 'g1')

    host = { 'X-API-Key': 'k' } // they sign out; the host is now using a key
    await request('/c')
    assert.equal(seen[2].headers['authorization'], undefined)
    assert.equal(seen[2].headers['x-api-key'], 'k')
  })

  test('it still says which API version and SDK it is itself', async () => {
    configureSdkCache({ enabled: false })
    initializeApi({ baseURL: 'https://api.test/api/v1', signInFrom: () => ({ AUTHORIZATION: 'Bearer one', 'SmartLinks-Version': '2026-11' }), force: true })
    await request('/a')
    // The host's own SDK never reports a version through getApiHeaders(). If something slips one in, it
    // must not win: this copy has to be answered in the shapes it was built for.
    assert.equal(seen[0].headers['authorization'], 'Bearer one')
    assert.equal(seen[0].headers['smartlinks-version'], '2027-01')
    assert.match(seen[0].headers['smartlinks-sdk'], /^js\/\d+\./)
  })

  test('what the host sends is what this copy reports, token included', () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', signInFrom: () => host, force: true })
    assert.equal(getBearerToken(), undefined)
    host = { AUTHORIZATION: 'Bearer abc.def' }
    assert.equal(getBearerToken(), 'abc.def')
    assert.equal(getApiHeaders()['AUTHORIZATION'], 'Bearer abc.def')
  })

  test('answers cached for one person are not served to the next', async () => {
    initializeApi({ baseURL: 'https://api.test/api/v1', signInFrom: () => host, force: true })
    configureSdkCache({ enabled: true })
    host = { AUTHORIZATION: 'Bearer one' }
    const first = await request<{ n: number }>('/public/collection/c1/thing')
    const again = await request<{ n: number }>('/public/collection/c1/thing')
    assert.deepEqual(again, first) // same person: from the cache
    const calls = seen.length

    host = { AUTHORIZATION: 'Bearer two' }
    await request('/public/collection/c1/thing')
    assert.equal(seen.length, calls + 1) // a different person: asked again
    assert.equal(seen[seen.length - 1].headers['authorization'], 'Bearer two')
  })

  test('a copy that follows nobody is unchanged', async () => {
    configureSdkCache({ enabled: false })
    initializeApi({ baseURL: 'https://api.test/api/v1', bearerToken: 'mine', force: true })
    await request('/a')
    assert.equal(seen[0].headers['authorization'], 'Bearer mine')
    assert.equal(getBearerToken(), 'mine')
  })
})

describe('shared-dependency contract v8', () => {
  test('SDK 3 is window.SL3; the sign-in UI is still the page\'s one copy', () => {
    assert.equal(SHARED_DEPENDENCY_CONTRACT_VERSION, 'v8')
    const sdk = SHARED_DEPENDENCIES.find((d) => d.specifier === '@proveanything/smartlinks')!
    const authUi = SHARED_DEPENDENCIES.find((d) => d.specifier === '@proveanything/smartlinks-auth-ui')!
    assert.equal(sdk.globalName, 'SL3')
    assert.equal(authUi.globalName, 'SmartlinksAuthUI')
    // Every other entry keeps the global it has always had: one copy for every app.
    assert.equal(SHARED_DEPENDENCIES.find((d) => d.specifier === 'react')!.globalName, 'React')
  })
})
