import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { interactions } from '../src/api/interactions'

// ensureType finds an app's interaction type by its readable key (data.interactionType) or creates
// it — and never sends an `id`: the server mints it, and that minted id is what events must use.

describe('interactions.ensureType', () => {
  const realFetch = globalThis.fetch
  let calls: { method: string; url: string; body: any }[]
  let existing: any[]

  beforeEach(() => {
    calls = []
    existing = []
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const method = (init.method || 'GET').toUpperCase()
      const body = init.body ? JSON.parse(init.body) : undefined
      calls.push({ method, url: String(url), body })
      const json = method === 'GET'
        ? { items: existing, limit: 200, offset: 0 }
        : { id: '52bab6fa-d868-4616-9342-6731b0f332b2', collectionId: 'c1', ...body, createdAt: 'now' }
      return new Response(JSON.stringify(json), { status: method === 'POST' ? 201 : 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  test('returns the existing type when the key is already defined (no create)', async () => {
    existing = [
      { id: 'aaaa', appId: 'my-app', data: { interactionType: 'signup' } },
      { id: 'bbbb', appId: 'my-app', data: { interactionType: 'vote' } },
    ]
    const t = await interactions.ensureType('c1', { appId: 'my-app', key: 'vote' })
    assert.equal(t.id, 'bbbb')
    assert.equal(calls.filter((c) => c.method === 'POST').length, 0)
    assert.match(calls[0].url, /\/admin\/collection\/c1\/interactions\/\?.*appId=my-app/)
  })

  test('creates it otherwise — key goes in data.interactionType, and no id is sent', async () => {
    const t = await interactions.ensureType('c1', {
      appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true }, display: { title: 'Vote' },
    })
    assert.equal(t.id, '52bab6fa-d868-4616-9342-6731b0f332b2')
    const post = calls.find((c) => c.method === 'POST')!
    assert.equal(post.body.id, undefined)
    assert.deepEqual(post.body.data, { interactionType: 'vote', display: { title: 'Vote' } })
    assert.deepEqual(post.body.permissions, { allowPublicSubmit: true })
  })

  test('appId and key are required', async () => {
    await assert.rejects(interactions.ensureType('c1', { appId: '', key: 'vote' }), /appId and key are required/)
  })
})
