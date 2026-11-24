import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { dpp } from '../src/api/dpp'

// dpp.*: each call goes to the route prove serves (server/api/admin/collectionAdmin/dpp.js and
// server/api/public/dpp.js), with the method and body the server expects. Single things are unwrapped
// from the reply; lists come back as the API sends them for version 2027-01: { items, nextCursor }.

describe('dpp', () => {
  const realFetch = globalThis.fetch
  let calls: { method: string; url: string; body: any }[]
  let reply: any

  beforeEach(() => {
    calls = []
    reply = { ok: true }
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const method = (init.method || 'GET').toUpperCase()
      calls.push({ method, url: String(url), body: init.body ? JSON.parse(init.body) : undefined })
      return new Response(JSON.stringify(reply), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  const last = () => calls[calls.length - 1]
  const call = () => [last().method, last().url.replace('https://api.test/api/v1', ''), last().body]
  const A = '/admin/collection/c1/dpp'

  test('connecting a brand to the registry', async () => {
    reply = { items: [{ environment: 'acc' }], nextCursor: null }
    assert.deepEqual(await dpp.registry.list('c1'), { items: [{ environment: 'acc' }], nextCursor: null })
    assert.deepEqual(call(), ['GET', `${A}/registry`, undefined])
    reply = { registry: { environment: 'acc', nextStep: 'enter-service-account' } }
    assert.equal((await dpp.registry.makeKey('c1', 'acc', { alg: 'ES384' })).nextStep, 'enter-service-account')
    assert.deepEqual(call(), ['POST', `${A}/registry/acc/key`, { alg: 'ES384' }])
    await dpp.registry.get('c1', 'acc')
    assert.deepEqual(call(), ['GET', `${A}/registry/acc`, undefined])
    const ids = { clientId: 'sa1', kid: 'k1', orgIdentifier: 'org_1' }
    await dpp.registry.set('c1', 'acc', ids)
    assert.deepEqual(call(), ['PUT', `${A}/registry/acc`, ids])
    await dpp.registry.check('c1', 'acc')
    assert.deepEqual(call(), ['POST', `${A}/registry/acc/check`, {}])
    await dpp.registry.enrolPractice('c1')
    assert.deepEqual(call(), ['POST', `${A}/registry/practice/enrol`, {}])
  })

  test('passports: publish by what they are for, versions, withdraw', async () => {
    const input = { productId: 'p1', productGroup: 'BATTERIES', productSubGroup: 'EV', granularity: 'item' as const, public: { a: 1 } }
    await dpp.passports.upsert('c1', input)
    assert.deepEqual(call(), ['PUT', `${A}/passports/by-anchor`, input])
    await dpp.passports.upsert('c1', input, { merge: true })
    assert.deepEqual(call(), ['PUT', `${A}/passports/by-anchor?replace=false`, input])
    await dpp.passports.upsertMany('c1', [input])
    assert.deepEqual(call(), ['POST', `${A}/passports/bulk`, { passports: [input] }])
    reply = { items: [{ id: 'x1' }], nextCursor: 'next-page' }
    const page = await dpp.passports.list('c1', { productId: 'p1', status: 'active', limit: 1 })
    assert.deepEqual(call(), ['GET', `${A}/passports?productId=p1&status=active&limit=1`, undefined])
    assert.deepEqual(page, { items: [{ id: 'x1' }], nextCursor: 'next-page' })
    reply = { items: [], nextCursor: null }
    assert.equal((await dpp.passports.list('c1', { productId: 'p1', limit: 1, cursor: page.nextCursor! })).nextCursor, null)
    assert.deepEqual(call(), ['GET', `${A}/passports?productId=p1&limit=1&cursor=next-page`, undefined])
    reply = { passport: { id: 'x/1' } }
    assert.equal((await dpp.passports.get('c1', 'x/1')).id, 'x/1')
    assert.deepEqual(call(), ['GET', `${A}/passports/x%2F1`, undefined])
    await dpp.passports.update('c1', 'x1', { public: { b: 2 } }, { replace: true })
    assert.deepEqual(call(), ['PUT', `${A}/passports/x1?replace=true`, { public: { b: 2 } }])
    reply = { items: [{ version: 2 }, { version: 1 }], nextCursor: null }
    assert.deepEqual((await dpp.passports.versions('c1', 'x1')).items.map((v) => v.version), [2, 1])
    assert.deepEqual(call(), ['GET', `${A}/passports/x1/versions`, undefined])
    await dpp.passports.withdraw('c1', 'x1')
    assert.deepEqual(call(), ['POST', `${A}/passports/x1/withdraw`, {}])
    await dpp.passports.restore('c1', 'x1')
    assert.deepEqual(call(), ['POST', `${A}/passports/x1/restore`, {}])
  })

  test('registering, tasks, groups and the public read', async () => {
    await dpp.register('c1', 'acc', ['x1', 'x2'], { wait: true })
    assert.deepEqual(call(), ['POST', `${A}/registry/acc/register`, { passportIds: ['x1', 'x2'], wait: true }])
    reply = { items: [], nextCursor: null }
    assert.deepEqual(await dpp.tasks.list('c1', 'acc'), { items: [], nextCursor: null })
    assert.deepEqual(call(), ['GET', `${A}/registry/acc/tasks`, undefined])
    reply = { task: { taskId: 't1', status: 'COMPLETED' } }
    assert.equal((await dpp.tasks.refresh('c1', 'acc', 't1')).status, 'COMPLETED')
    assert.deepEqual(call(), ['POST', `${A}/registry/acc/tasks/t1/refresh`, {}])
    reply = { items: [{ productGroup: 'BATTERIES' }], nextCursor: null }
    assert.equal((await dpp.groups('c1')).items[0].productGroup, 'BATTERIES')
    assert.deepEqual(call(), ['GET', `${A}/groups`, undefined])
    reply = { uniqueProductIdentifier: 'https://smartlinks.app/api/v1/public/dpp/c1/x1' }
    await dpp.read('c1', 'x1', { version: 2 })
    assert.deepEqual(call(), ['GET', '/public/dpp/c1/x1?version=2', undefined])
  })
})
