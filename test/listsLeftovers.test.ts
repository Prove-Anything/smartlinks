import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { ai } from '../src/api/ai'
import { userAppData } from '../src/api/appConfiguration'
import { asset } from '../src/api/asset'
import { authKit } from '../src/api/authKit'
import { claimSet } from '../src/api/claimSet'
import { knowledge } from '../src/api/knowledge'
import { partner } from '../src/api/partner'
import { secrets } from '../src/api/secrets'

// SDK 3 lists (API version 2027-01), the ones added to the server's table of list routes last: each asks
// the route prove serves with `limit` and `cursor` (never `offset` or `from`), sends only parameters the
// route reads, and returns the server's { items, nextCursor, count? } as it is, with anything else the
// route says beside the list.

describe('lists: claim sets, partners, assets, secrets, AuthKit, knowledge, AI skills and tools, user app data', () => {
  const realFetch = globalThis.fetch
  let calls: { method: string; url: string; body: any }[]
  let reply: any

  beforeEach(() => {
    calls = []
    reply = { items: [], nextCursor: null }
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
  const call = () => [last().method, last().url.replace('https://api.test/api/v1', '')]
  const answer = (body: any) => { reply = body; return body }

  test('claim sets: your own and a collection\'s come back as items', async () => {
    const mine = answer({ items: [{ id: '12', name: 'Coins' }], nextCursor: null })
    assert.deepEqual(await claimSet.getAll(), mine)
    assert.deepEqual(call(), ['GET', '/admin/claimSet'])
    assert.deepEqual(await claimSet.getAll('c1'), mine)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/claimSet'])
  })

  test('claim sets: assigned tags are items, with the claim set\'s own fields beside them', async () => {
    const set = answer({ items: [{ id: 'a1', collectionId: 'c1' }], nextCursor: null, id: '12', name: 'Coins' })
    const own = await claimSet.getAssignedTags('12')
    assert.deepEqual(call(), ['GET', '/admin/claimSet/12/assignedTags'])
    assert.deepEqual(own, set)
    assert.equal(own.name, 'Coins')
    assert.deepEqual((await claimSet.getAssignedTags('12', 'c1')).items, [{ id: 'a1', collectionId: 'c1' }])
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/claimSet/12/assignedTags'])
  })

  test('claim set ranges: one list for a collection and for a partner; tags page by limit and cursor', async () => {
    const ranges = answer({ items: [{ id: 'r1', name: 'February' }], nextCursor: null })
    assert.deepEqual(await claimSet.ranges.list({ collectionId: 'c1' }, '12'), ranges)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/claimSet/12/ranges'])
    assert.deepEqual(await claimSet.ranges.list({ partnerId: 'p1' }, '12'), ranges)
    assert.deepEqual(call(), ['GET', '/admin/partner/p1/claimSet/12/ranges'])

    const page = answer({ items: [{ code: 'abc', index: 1 }], nextCursor: '201' })
    assert.deepEqual(await claimSet.ranges.tags({ partnerId: 'p1' }, '12', 'r1', { limit: 200, keys: true }), page)
    assert.deepEqual(call(), ['GET', '/admin/partner/p1/claimSet/12/ranges/r1/tags?limit=200&keys=1'])
    await claimSet.ranges.tags({ collectionId: 'c1' }, '12', 'r1', { cursor: '201' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/claimSet/12/ranges/r1/tags?cursor=201'])
    await claimSet.ranges.tags({ collectionId: 'c1' }, '12', 'r1')
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/claimSet/12/ranges/r1/tags'])
    assert.ok(calls.every((c) => !/[?&]from=/.test(c.url)), 'the old `from` paging is never sent')
  })

  test('partners: the partners, their claim sets, tag lookups and tag attempts are all items', async () => {
    const partners = answer({ items: [{ id: 'p1', name: 'Partner', role: 'owner' }], nextCursor: null })
    assert.deepEqual(await partner.list(), partners)
    assert.deepEqual(call(), ['GET', '/admin/partner'])

    const sets = answer({ items: [{ claimSetId: '12', name: 'Coins' }], nextCursor: null })
    assert.deepEqual(await partner.claimSets('p1'), sets)
    assert.deepEqual(call(), ['GET', '/admin/partner/p1/claimSet'])

    const hits = answer({ items: [{ claimSetId: '12', tag: { code: 'abc' }, range: null, group: null }], nextCursor: null })
    assert.deepEqual(await partner.lookupTags('p1', { uid: '04A1B2C3D4E5F6' }), hits)
    assert.deepEqual(call(), ['GET', '/admin/partner/p1/tags/lookup?uid=04A1B2C3D4E5F6'])
    await partner.lookupTags('p1', { code: '012abc' })
    assert.deepEqual(call(), ['GET', '/admin/partner/p1/tags/lookup?code=012abc'])

    const attempts = answer({ items: [{ id: 'e1', error_code: 'WRITE_FAILED' }], nextCursor: null })
    assert.deepEqual(await partner.tagAttempts('p1', '04A1B2C3D4E5F6'), attempts)
    assert.deepEqual(call(), ['GET', '/admin/partner/p1/tags/attempts?uid=04A1B2C3D4E5F6'])
  })

  test('assets: the admin list pages by limit and cursor and counts; neither list sends a parameter no route reads', async () => {
    const page = answer({ items: [{ id: 'as1', name: 'hero.png' }], nextCursor: 'next-1', count: 41 })
    const got = await asset.listAdmin({
      collectionId: 'c1', productId: 'p1', proofId: 'pr1', appId: 'gallery', assetType: 'Image', labels: 'hero,banner',
      orderBy: [{ name: 'asc' }], limit: 20, include: ['temporary', 'derived'],
    })
    assert.deepEqual(got, page)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/asset?productId=p1&proofId=pr1&appId=gallery&assetType=Image&labels=hero%2Cbanner&orderBy=name%3Aasc&limit=20&include=temporary%2Cderived'])
    await asset.listAdmin({ collectionId: 'c1', limit: 20, cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/asset?limit=20&cursor=next-1'])
    await asset.listAdmin({ collectionId: 'c1', offset: 20 } as any)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/asset'], '`offset` is gone: the cursor carries the place')

    answer({ items: [{ id: 'as1' }], nextCursor: null })
    await asset.list({ scope: { type: 'collection', collectionId: 'c1' }, appId: 'gallery', mimeTypePrefix: 'image/' } as any)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/asset?appId=gallery'], '`mimeTypePrefix` was never read by any route')
  })

  test('secrets: a collection\'s and an app\'s own come back as items', async () => {
    const all = answer({ items: [{ ref: 'sec_1', name: 'API key', purpose: 'integration', hint: '…1a2b' }], nextCursor: null })
    assert.deepEqual(await secrets.list('c1', { purpose: 'integration' }), all)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/secrets?purpose=integration'])
    await secrets.list('c1')
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/secrets'])

    const own = answer({ items: [{ ref: 'shop-api-key', hint: '••••1234' }], nextCursor: null })
    assert.deepEqual(await secrets.listOwn('c1', { appId: 'shop' }), own)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/app/shop/secrets'])
  })

  test('AuthKit: the admin list of configs and a person\'s trusted devices are items', async () => {
    const kits = answer({ items: [{ id: 'kit1', name: 'Customer login' }], nextCursor: null })
    assert.deepEqual(await authKit.list('c1'), kits)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/authKit'])

    const devices = answer({ items: [{ id: 'd1', label: 'Chrome on Windows' }], nextCursor: null })
    assert.deepEqual(await authKit.listTrustedDevices('client1'), devices)
    assert.deepEqual(call(), ['GET', '/authkit/client1/mfa/trusted-devices'])
  })

  test('knowledge: the public search answers in the same shape as the admin search', async () => {
    const found = answer({ items: [{ title: 'Kettle manual', heading: 'Descaling', score: 0.9 }], nextCursor: null, query: 'descale', mode: 'hybrid' })
    const open = await knowledge.publicSearch('c1', { q: 'descale', filters: { productId: 'p1' }, limit: 5 })
    assert.deepEqual(call(), ['POST', '/public/collection/c1/knowledge/search'])
    assert.deepEqual(last().body, { q: 'descale', filters: { productId: 'p1' }, limit: 5 })
    assert.deepEqual(open, found)
    assert.equal(open.mode, 'hybrid')

    const staff = await knowledge.search('c1', { q: 'descale', limit: 5 })
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/knowledge/search'])
    assert.deepEqual(staff, open)
  })

  test('AI: skills and the agent\'s tools are items', async () => {
    const skills = answer({ items: [{ name: 'brand.research', description: 'Look a brand up' }], nextCursor: null })
    assert.deepEqual(await ai.skills.list('c1'), skills)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/ai/skills'])

    const tools = answer({ items: [{ name: 'knowledge.search', capabilities: ['read'] }], nextCursor: null })
    assert.deepEqual(await ai.agent.listTools('c1', { allowCapabilities: 'read', only: 'knowledge.search' }), tools)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/ai/agent/tools?allowCapabilities=read&only=knowledge.search'])
  })

  test('user app data: a person\'s items for an app', async () => {
    const beds = answer({ items: [{ id: 'bed-1', name: 'Vegetables' }], nextCursor: null })
    assert.deepEqual(await userAppData.list('garden-planner'), beds)
    assert.deepEqual(call(), ['GET', '/public/auth/app/garden-planner/data'])
  })
})
