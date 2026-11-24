import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { app } from '../src/api/appObjects'
import { asset } from '../src/api/asset'
import { attestations } from '../src/api/attestations'
import { analytics } from '../src/api/analytics'
import { appConfiguration } from '../src/api/appConfiguration'
import { adminCards } from '../src/api/adminCards'
import { ai } from '../src/api/ai'

// SDK 3 lists (API version 2027-01): the server answers { items, nextCursor, count? } and pages with
// `limit` and `cursor`. These calls send those and hand back the server's answer as it is.

describe('lists: app objects, assets, attestations, analytics events, app data, cards', () => {
  const realFetch = globalThis.fetch
  let calls: { method: string; url: string; body: any }[]
  let answer: any

  beforeEach(() => {
    calls = []
    answer = { items: [{ id: 'a' }], nextCursor: 'next-1', count: 7 }
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const method = (init.method || 'GET').toUpperCase()
      calls.push({ method, url: String(url), body: init.body ? JSON.parse(init.body) : undefined })
      return new Response(JSON.stringify(answer), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  const last = () => calls[calls.length - 1]
  const path = () => last().url.replace('https://api.test/api/v1', '')

  test('records, cases and threads page with limit and cursor and return the list as it is', async () => {
    const records = await app.records.list('c1', 'faq', { recordType: 'tip', limit: 50, cursor: 'cur-1' })
    assert.equal(path(), '/public/collection/c1/app/faq/records?recordType=tip&limit=50&cursor=cur-1')
    assert.deepEqual(records, { items: [{ id: 'a' }], nextCursor: 'next-1', count: 7 })

    await app.records.list('c1', 'faq', { dataFilter: { zone: 'in:a,b' }, limit: 10 }, true)
    assert.equal(path(), '/admin/collection/c1/app/faq/records?dataFilter%5Bzone%5D=in%3Aa%2Cb&limit=10')

    const cases = await app.cases.list('c1', 'faq', { status: 'open', cursor: 'cur-2' }, true)
    assert.equal(path(), '/admin/collection/c1/app/faq/cases?status=open&cursor=cur-2')
    assert.equal(cases.items.length, 1)
    assert.equal(cases.nextCursor, 'next-1')
    assert.equal(cases.count, 7)

    const threads = await app.threads.list('c1', 'faq', { parentType: 'case', parentIds: ['x', 'y'], limit: 5 })
    assert.equal(path(), '/public/collection/c1/app/faq/threads?parentType=case&parentIds=x%2Cy&limit=5')
    assert.equal(threads.items[0].id, 'a')

    await app.cases.list('c1', 'faq')
    assert.equal(path(), '/public/collection/c1/app/faq/cases')
  })

  test('match, resolve-all and pickers keep their other fields beside items', async () => {
    answer = { items: [{ id: 'r1', matchedAt: 'product' }], nextCursor: null, count: 1, strategy: 'best' }
    const matched = await app.records.match('c1', 'faq', { target: { productId: 'p1' }, strategy: 'best' })
    assert.deepEqual([last().method, path()], ['POST', '/public/collection/c1/app/faq/records/match'])
    assert.equal(matched.items[0].matchedAt, 'product')
    assert.equal(matched.strategy, 'best')
    assert.equal(matched.nextCursor, null)

    answer = { items: [{ record: { id: 'r1' }, matchedAt: 'rule', specificity: 51 }], nextCursor: null, count: 1, context: { productId: 'p1' }, truncated: false }
    const resolved = await app.records.resolveAll('c1', 'faq', { context: { productId: 'p1' } }, true)
    assert.deepEqual([last().method, path()], ['POST', '/admin/collection/c1/app/faq/records/resolve-all'])
    assert.equal(resolved.items[0].record.id, 'r1')
    assert.equal(resolved.truncated, false)
    assert.deepEqual(resolved.context, { productId: 'p1' })

    answer = { items: [{ id: 'm1', label: 'Mixer', active: true, order: 1 }], nextCursor: null, count: 1, version: 'v2', mode: 'all' }
    const options = await app.options.get('c1', 'ops', 'type:machine', { admin: true, version: 'v1' })
    assert.equal(path(), '/admin/collection/c1/app/ops/options/type%3Amachine?version=v1')
    if (options.unchanged) assert.fail('expected the entries')
    assert.equal(options.items[0].label, 'Mixer')
    assert.equal(options.version, 'v2')

    answer = { unchanged: true, version: 'v2' }
    const same = await app.options.get('c1', 'ops', 'type:machine', { version: 'v2' })
    assert.equal(same.unchanged, true)
  })

  test('attestations page with limit and cursor; the public lists keep audience', async () => {
    answer = { items: [{ id: 'att1' }], nextCursor: 'next-2' }
    const page = await attestations.list('c1', { subjectType: 'container', subjectId: 'cask', limit: 50, cursor: 'cur-3' })
    assert.equal(path(), '/admin/collection/c1/attestations?subjectType=container&subjectId=cask&limit=50&cursor=cur-3')
    assert.deepEqual(page, { items: [{ id: 'att1' }], nextCursor: 'next-2' })

    answer = { items: [{ id: 'att1' }], nextCursor: null, audience: 'owner' }
    const pub = await attestations.publicList('c1', { subjectType: 'proof', subjectId: 'pr1', moderationStatus: 'pending' })
    assert.equal(path(), '/public/collection/c1/attestations?subjectType=proof&subjectId=pr1&moderationStatus=pending')
    assert.equal(pub.audience, 'owner')
    assert.equal(pub.items.length, 1)

    const cont = await attestations.publicContainerList('c1', 'cask', { attestationType: 'temperature', limit: 10 })
    assert.equal(path(), '/public/collection/c1/containers/cask/attestations?attestationType=temperature&limit=10')
    assert.equal(cont.nextCursor, null)
  })

  test('asset lists return { items, nextCursor }', async () => {
    answer = { items: [{ id: 'as1', url: 'https://cdn.test/a.png' }], nextCursor: null }
    assert.equal((await asset.listForCollection('c1')).items[0].id, 'as1')
    assert.equal(path(), '/public/collection/c1/asset')
    assert.equal((await asset.listForProduct('c1', 'p1')).items.length, 1)
    assert.equal(path(), '/public/collection/c1/product/p1/asset')
    assert.equal((await asset.listForProof('c1', 'p1', 'pr1', 'gallery')).nextCursor, null)
    assert.equal(path(), '/public/collection/c1/product/p1/proof/pr1/asset?appId=gallery')
    const listed = await asset.list({ scope: { type: 'product', collectionId: 'c1', productId: 'p1' }, appId: 'gallery' })
    assert.equal(path(), '/public/collection/c1/product/p1/asset?appId=gallery')
    assert.deepEqual(listed, answer)
  })

  test('analytics events page in the body with limit and cursor', async () => {
    answer = { items: [{ eventType: 'page_view' }], nextCursor: 'next-3', source: 'events', sort: 'DESC' }
    const page = await analytics.admin.events('c1', { source: 'events', eventType: 'page_view', limit: 100, cursor: 'cur-4' })
    assert.deepEqual([last().method, path()], ['POST', '/admin/collection/c1/analytics/events'])
    assert.deepEqual(last().body, { source: 'events', eventType: 'page_view', limit: 100, cursor: 'cur-4' })
    assert.equal(page.items[0].eventType, 'page_view')
    assert.equal(page.nextCursor, 'next-3')
    assert.equal(page.source, 'events')
  })

  test('app data items, widgets and dashboard cards are in items', async () => {
    answer = { items: [{ id: 'manual-1' }], nextCursor: null }
    const data = await appConfiguration.getData({ appId: 'docs', collectionId: 'c1', productId: 'p1' })
    assert.equal(path(), '/public/collection/c1/product/p1/app/docs/data')
    assert.equal(data.items[0].id, 'manual-1')

    answer = { items: [{ appId: 'raffle' }], nextCursor: null }
    const widgets = await appConfiguration.getWidgets('c1', { force: true })
    assert.equal(path(), '/public/collection/c1/app/widgets?force=true')
    assert.equal(widgets.items[0].appId, 'raffle')

    answer = { items: [{ key: 'faq:open' }], nextCursor: null, hidden: [{ key: 'faq:old' }], layout: null }
    const cards = await adminCards.list('c1')
    assert.equal(path(), '/admin/collection/c1/cards')
    assert.equal(cards.items[0].key, 'faq:open')
    assert.equal(cards.hidden[0].key, 'faq:old')
    assert.equal(cards.layout, null)
  })

  test('removed in SDK 3: ai.generateContent and asset.uploadAsset', () => {
    assert.equal((ai as any).generateContent, undefined)
    assert.equal((asset as any).uploadAsset, undefined)
  })
})
