import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { segments } from '../src/api/segments'
import { serviceAccounts } from '../src/api/serviceAccounts'
import { tags } from '../src/api/tags'
import { template } from '../src/api/template'
import { translations } from '../src/api/translations'
import { userGroups } from '../src/api/userGroups'
import { variant } from '../src/api/variant'
import { wallet } from '../src/api/wallet'

// SDK 3 lists (API version 2027-01): each one asks the route prove serves with `limit` and `cursor` (never
// `offset`), sends only parameters the route reads, and returns the server's { items, nextCursor, count? }
// as it is, with anything else the route says beside the list.

describe('lists: segments, service accounts, tags, templates, translations, user groups, variants, wallet', () => {
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

  test('segments: list and recipients page by limit and cursor', async () => {
    const page = answer({ items: [{ id: 'seg1', name: 'Owners' }], nextCursor: 'next-1' })
    assert.deepEqual(await segments.list('c1', { filterType: 'dynamic', limit: 10 }), page)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/segments/?filterType=dynamic&limit=10'])
    await segments.list('c1', { appId: 'crm', cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/segments/?appId=crm&cursor=next-1'])

    const people = answer({ items: [{ contactId: 'ct1' }], nextCursor: null, count: 1, note: 'Calculated a minute ago' })
    assert.deepEqual(await segments.recipients('c1', 'seg1', { limit: 100, cursor: 'next-2' }), people)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/segments/seg1/recipients?limit=100&cursor=next-2'])
  })

  test('service accounts: the accounts as items, the access levels beside them', async () => {
    const all = answer({ items: [{ id: 'sa-1', name: 'Warehouse system' }], nextCursor: null, access: ['User', 'Reporter', 'Assigner', 'Admin'] })
    const got = await serviceAccounts.list('c1')
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/service-accounts'])
    assert.deepEqual(got, all)
    assert.deepEqual(got.access, ['User', 'Reporter', 'Assigner', 'Admin'])
  })

  test('tags: list pages by cursor; lookups and by-ref return items with what was embedded', async () => {
    const page = answer({ items: [{ tagId: 'NFC-001' }], nextCursor: 'next-1' })
    assert.deepEqual(await tags.list('c1', { productId: 'p1', limit: 50 }), page)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/tags?limit=50&productId=p1'])
    await tags.list('c1', { refType: 'container', refId: 'box-1', cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/tags?cursor=next-1&refType=container&refId=box-1'])

    answer({ items: [{ tagId: 'NFC-001' }], nextCursor: null })
    assert.deepEqual((await tags.byRef('c1', { refType: 'container', refId: 'box-1' })).items, [{ tagId: 'NFC-001' }])
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/tags/by-ref?refType=container&refId=box-1'])

    const found = answer({ items: [{ tagId: 'NFC-001', productId: 'p1' }], nextCursor: null, count: 1, embedded: { products: { p1: { name: 'Soap' } } } })
    assert.deepEqual(await tags.lookupTags('c1', { tagIds: ['NFC-001', 'NFC-002'], embed: 'product' }), found)
    assert.deepEqual(call(), ['POST', '/public/collection/c1/tags/lookup'])
    assert.deepEqual(last().body, { tagIds: ['NFC-001', 'NFC-002'], embed: 'product' })
    assert.deepEqual(await tags.lookupTagsQuery('c1', { tagIds: 'NFC-001,NFC-002', embed: 'product' }), found)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/tags/lookup?tagIds=NFC-001%2CNFC-002&embed=product'])

    const linked = answer({ items: [{ tagId: 'NFC-001' }], nextCursor: null, embedded: { containers: { 'box-1': { ref: 'Box 1' } } } })
    assert.deepEqual(await tags.publicByRef('c1', { refType: 'container', refId: 'box-1', embed: 'container' }), linked)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/tags/by-ref?refType=container&refId=box-1&embed=container'])
    assert.deepEqual(await tags.publicByRefPost('c1', { refType: 'container', refId: 'box-1', embed: 'container' }), linked)
    assert.deepEqual(call(), ['POST', '/public/collection/c1/tags/by-ref'])
    assert.deepEqual(last().body, { refType: 'container', refId: 'box-1', embed: 'container' })
  })

  test('templates: all, allowed, and allowed global ones are lists', async () => {
    const all = answer({ items: [{ id: 't1', name: 'Welcome' }], nextCursor: null })
    assert.deepEqual(await template.getAll('c1'), all)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/template'])
    assert.deepEqual(await template.getAllowed('c1'), all)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/template/getAllowed'])
    assert.deepEqual(await template.getAllowedGlobal('c1'), all)
    assert.deepEqual(call(), ['GET', '/public/template/getAllowed/c1'])
  })

  test('translations: list pages by limit and cursor', async () => {
    const page = answer({ items: [{ id: 'tr1', targetLanguage: 'de', translatedText: 'Hallo' }], nextCursor: 'next-1', count: 120 })
    assert.deepEqual(await translations.list('c1', { targetLanguage: 'de', termIssues: true, limit: 50 }), page)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/translations?targetLanguage=de&termIssues=true&limit=50'])
    await translations.list('c1', { targetLanguage: 'de', limit: 50, cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/translations?targetLanguage=de&limit=50&cursor=next-1'])
  })

  test('user groups: every list answers with items', async () => {
    const groups = answer({ items: [{ id: 'g1', key: 'qc-controllers', name: 'QC Controllers' }], nextCursor: null })
    assert.deepEqual(await userGroups.list('c1'), groups)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/userGroup'])

    const people = answer({ items: [{ uid: 'uid_1', name: 'Sam', email: 'sam@example.com' }], nextCursor: null })
    assert.deepEqual(await userGroups.members('c1', 'g1'), people)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/userGroup/g1/users'])

    const refs = answer({ items: [{ id: 'g1', key: 'qc-controllers', name: 'QC Controllers' }], nextCursor: null })
    assert.deepEqual(await userGroups.ofUser('c1', 'uid_1'), refs)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/userGroup/of/uid_1'])

    const changes = answer({ items: [{ at: '2026-11-01T10:00:00Z', type: 'usergroup.member-added', actorId: 'uid_admin' }], nextCursor: null })
    assert.deepEqual(await userGroups.history('c1', { userId: 'uid_1', from: '2026-10-01', limit: 20 }), changes)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/userGroup/history?userId=uid_1&from=2026-10-01&limit=20'])
    await userGroups.history('c1', { userGroupId: 'g1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/userGroup/g1/history'])
  })

  test('variants: a product\'s variants are a list', async () => {
    const all = answer({ items: [{ id: 'v1', name: 'Large' }], nextCursor: null })
    assert.deepEqual(await variant.list('c1', 'p1'), all)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/product/p1/variant'])
  })

  test('wallet: my passes and the admin list answer with items', async () => {
    const mine = answer({ items: [{ id: 'wp1', links: { google: 'https://pay.google.test/save/1' } }], nextCursor: null })
    assert.deepEqual(await wallet.mine('c1'), mine)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/wallet/mine'])

    const passes = answer({ items: [{ id: 'wp1', status: 'active' }], nextCursor: null })
    assert.deepEqual(await wallet.list('c1', { refType: 'event', refId: 'e1', includeVoided: true }), passes)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/wallet/passes?refType=event&refId=e1&includeVoided=true'])
  })
})
