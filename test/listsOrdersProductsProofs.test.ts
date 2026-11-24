import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import * as api from '../src/api'
import { integrations } from '../src/api/integrations'
import { interactions } from '../src/api/interactions'
import { jobs } from '../src/api/jobs'
import { journeys } from '../src/api/journeys'
import { journeysAnalytics } from '../src/api/journeysAnalytics'
import { knowledge } from '../src/api/knowledge'
import { location } from '../src/api/location'
import { lots } from '../src/api/lots'
import { loyalty } from '../src/api/loyalty'
import { nfc } from '../src/api/nfc'
import { order } from '../src/api/order'
import { products } from '../src/api/products'
import { proof } from '../src/api/proof'

// SDK 3 lists (API version 2027-01): each one asks the route prove serves with `limit` and `cursor` (never
// `offset` or `page`), sends only parameters the route reads, and returns the server's
// { items, nextCursor, count? } as it is, with anything else the route says beside the list.

describe('lists: integrations, interactions, jobs, journeys, knowledge, locations, lots, loyalty, nfc, orders, products, proofs', () => {
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

  test('integrations: flows, record types, runs, run items, failed records and connectors', async () => {
    const flows = answer({ items: [{ id: 'f1', name: 'Shopify out' }], nextCursor: null })
    assert.deepEqual(await integrations.listFlows('c1', { direction: 'outbound', status: 'active' }), flows)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/flows?direction=outbound&status=active'])

    const types = answer({ items: [{ appId: 'warranty', recordType: 'claim', count: 3 }], nextCursor: null })
    assert.deepEqual(await integrations.listRecordTypes('c1'), types)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/record-types'])

    const runs = answer({ items: [{ id: 'r1', status: 'failed' }], nextCursor: 'next-1' })
    assert.deepEqual(await integrations.listRuns('c1', 'f1', { status: 'failed', limit: 50 }), runs)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/flows/f1/runs?status=failed&limit=50'])
    await integrations.listRuns('c1', 'f1', { cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/flows/f1/runs?cursor=next-1'])

    await integrations.listRunItems('c1', 'f1', 'r1', { status: 'failed', limit: 10, cursor: 'next-2' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/flows/f1/runs/r1/items?status=failed&limit=10&cursor=next-2'])

    await integrations.listEntityRuns('c1', 'p1', { limit: 20 })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/runs/entity/p1?limit=20'])

    const failed = answer({ items: [{ id: 'x1', status: 'dead', attempts: 5 }], nextCursor: null, direction: 'outbound' })
    const got = await integrations.listFailed('c1', 'f1', { status: 'dead' })
    assert.deepEqual(got, failed)
    assert.equal(got.direction, 'outbound')
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/flows/f1/failed?status=dead'])

    const connectors = answer({ items: [{ appId: 'shopify', name: 'Shopify' }], nextCursor: null })
    assert.deepEqual(await integrations.listConnectors('c1'), connectors)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/integrations/connectors'])

    const actions = answer({ items: [{ name: 'redeem', title: 'Redeem a reward', visibility: 'member' }], nextCursor: null })
    assert.deepEqual(await integrations.listConnectorActions('c1', 'sessionm'), actions)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/connectors/sessionm/actions'])
  })

  test('interactions: types page by limit and cursor; event queries return items', async () => {
    const page = answer({ items: [{ id: 't1', appId: 'my-app' }], nextCursor: 'next-1' })
    assert.deepEqual(await interactions.list('c1', { appId: 'my-app', limit: 100 }), page)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/interactions/?appId=my-app&limit=100'])
    await interactions.publicList('c1', { cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/public/collection/c1/interactions/?cursor=next-1'])

    const events = answer({ items: [{ interactionId: 't1', outcome: 'entered' }], nextCursor: null })
    assert.deepEqual(await interactions.query('c1', { appId: 'my-app', limit: 500 }), events)
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/interactions/query'])
    assert.deepEqual(last().body, { appId: 'my-app', limit: 500 })
    assert.deepEqual(await interactions.publicMyInteractions('c1', { appId: 'my-app' }), events)
    assert.deepEqual(call(), ['POST', '/public/collection/c1/interactions/by-user'])
  })

  test('interactions.ensureType follows the cursor until it finds the key', async () => {
    const pages: Record<string, any> = {
      first: { items: [{ id: 'a', appId: 'my-app', data: { interactionType: 'signup' } }], nextCursor: 'page-2' },
      'page-2': { items: [{ id: 'b', appId: 'my-app', data: { interactionType: 'vote' } }], nextCursor: null },
    }
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      calls.push({ method: (init.method || 'GET').toUpperCase(), url: String(url), body: undefined })
      const cursor = new URL(String(url)).searchParams.get('cursor')
      return new Response(JSON.stringify(pages[cursor || 'first']), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    const type = await interactions.ensureType('c1', { appId: 'my-app', key: 'vote' })
    assert.equal(type.id, 'b')
    assert.equal(calls.length, 2)
    assert.match(calls[0].url, /\?appId=my-app&limit=200$/)
    assert.match(calls[1].url, /\?appId=my-app&limit=200&cursor=page-2$/)
    assert.ok(calls.every((c) => !c.url.includes('offset')))
  })

  test('jobs and journeys page by limit and cursor', async () => {
    const page = answer({ items: [{ id: 7, task: 'send', status: 'errored' }], nextCursor: 'next-1' })
    assert.deepEqual(await jobs.list('c1', { state: 'errored', limit: 50 }), page)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/jobs?state=errored&limit=50'])
    await jobs.list('c1', { cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/jobs?cursor=next-1'])

    const list = answer({ items: [{ id: 'j1', name: 'Welcome' }], nextCursor: null })
    assert.deepEqual(await journeys.list('c1', { active: true, limit: 20, cursor: 'next-2' }), list)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/journeys/?active=true&limit=20&cursor=next-2'])

    const ids = answer({ items: ['ct1', 'ct2'], nextCursor: null })
    assert.deepEqual(await journeysAnalytics.recipients('c1', 'j1', 's1', { status: 'entered', limit: 1000 }), ids)
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/journeys.analytics/j1/steps/s1/recipients'])
    assert.deepEqual(last().body, { status: 'entered', limit: 1000 })
  })

  test('knowledge: sets and sources as items; admin search returns its matches as items', async () => {
    const sets = answer({ items: [{ id: 's1', key: 'manuals' }], nextCursor: null })
    assert.deepEqual(await knowledge.listSets('c1'), sets)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/knowledge/sets'])
    await knowledge.listSources('c1', 'manuals')
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/knowledge/sets/manuals/sources'])

    const found = answer({ items: [{ id: 'p1', title: 'Kettle manual', score: 0.9 }], nextCursor: null, query: 'descale', mode: 'hybrid' })
    const got = await knowledge.search('c1', { q: 'descale', limit: 5 })
    assert.deepEqual(got, found)
    assert.equal(got.mode, 'hybrid')
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/knowledge/search'])
    assert.deepEqual(last().body, { q: 'descale', limit: 5 })
  })

  test('location search and nfc tag lookup return items', async () => {
    const places = answer({ items: [{ locationId: 'l1', name: 'Islay' }], nextCursor: null })
    assert.deepEqual(await location.search('c1', { q: 'islay', countryCode: 'GB', limit: 10, orderBy: [{ countryName: 'desc' }] }), places)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/location/search?q=islay&countryCode=GB&limit=10&orderBy=countryName%3Adesc'])

    const codes = answer({ items: [{ id: 'code1', tagId: '04A1', claimSetId: 'cs1' }], nextCursor: null })
    assert.deepEqual(await nfc.lookupTag('04A1'), codes)
    assert.deepEqual(call(), ['GET', '/public/nfc/findByTag/04A1'])
  })

  test('lots: the list as items; member products page by limit and cursor', async () => {
    const all = answer({ items: [{ id: 'lot1', lotNumber: 'L-1' }], nextCursor: null })
    assert.deepEqual(await lots.list('c1', { status: 'open', includeDeleted: true }), all)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/lots?status=open&includeDeleted=true'])
    assert.deepEqual(await lots.publicList('c1', { productId: 'p1' }), all)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/lots?productId=p1'])

    const members = answer({ items: [{ id: 'p1', name: 'Gin' }], nextCursor: 'next-1', count: 120 })
    assert.deepEqual(await lots.listProducts('c1', 'lot1', { limit: 50 }), members)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/lots/lot1/products?limit=50'])
    await lots.publicListProducts('c1', 'lot1', { limit: 50, cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/public/collection/c1/lots/lot1/products?limit=50&cursor=next-1'])
  })

  test('loyalty: schemes and rules as items; members and history page by limit and cursor', async () => {
    const schemes = answer({ items: [{ id: 'sch1', name: 'Points' }], nextCursor: null })
    assert.deepEqual(await loyalty.list('c1', { includeDeleted: true }), schemes)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/loyaltyScheme?includeDeleted=true'])
    assert.deepEqual(await loyalty.publicList('c1'), schemes)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/loyaltyScheme'])
    assert.deepEqual(await loyalty.publicGetMe('c1'), schemes)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/loyaltyScheme/me'])

    await loyalty.listEarningRules('c1', 'sch1')
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/loyaltyScheme/sch1/earningRule'])
    await loyalty.publicListEarningRules('c1', 'sch1')
    assert.deepEqual(call(), ['GET', '/public/collection/c1/loyaltyScheme/sch1/earningRule'])

    const members = answer({ items: [{ id: 'm1', balance: 40 }], nextCursor: 'next-1' })
    assert.deepEqual(await loyalty.listMembers('c1', 'sch1', { limit: 100 }), members)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/loyaltyScheme/sch1/member?limit=100'])
    await loyalty.getMemberHistory('c1', 'sch1', 'ct1', { limit: 20, cursor: 'next-1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/loyaltyScheme/sch1/member/ct1/history?limit=20&cursor=next-1'])
    await loyalty.publicGetMineHistory('c1', 'sch1', { cursor: 'next-2' })
    assert.deepEqual(call(), ['GET', '/public/collection/c1/loyaltyScheme/sch1/member/me/history?cursor=next-2'])
  })

  test('orders: list, items and query page by limit and cursor; scan history keeps the order beside the list', async () => {
    const page = answer({ items: [{ id: 'o1', orderRef: 'ORD-1' }], nextCursor: 'next-1' })
    assert.deepEqual(await order.list('c1', { status: 'pending', direction: 'purchase', partyId: 'sup1', limit: 50 }), page)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/orders?status=pending&direction=purchase&partyId=sup1&limit=50'])
    await order.list('c1', { cursor: 'next-1', expand: ['items'] })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/orders?cursor=next-1&expand=items'])

    await order.getItems('c1', 'o1', { limit: 100, cursor: 'next-2' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/orders/o1/items?limit=100&cursor=next-2'])

    assert.deepEqual(await order.query('c1', { query: { status: 'pending' }, limit: 50, cursor: 'next-1' }), page)
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/orders/query'])
    assert.deepEqual(last().body, { query: { status: 'pending' }, limit: 50, cursor: 'next-1' })

    const scans = answer({ items: [{ codeId: 'TAG1', timestamp: '2026-11-01T10:00:00Z' }], nextCursor: null, orderRef: 'ORD-1', orderId: 'o1' })
    const timeline = await order.getTimeline('c1', 'o1', { isAdmin: true, limit: 500 })
    assert.deepEqual(timeline, scans)
    assert.equal(timeline.orderRef, 'ORD-1')
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/orders/analytics/o1/timeline'])
    assert.deepEqual(last().body, { isAdmin: true, limit: 500 })
    assert.deepEqual(await order.getLocationHistory('c1', 'o1', { limit: 100 }), scans)
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/orders/analytics/o1/locations'])
  })

  test('products: list, query and assets return items; query pages by limit and cursor in the body', async () => {
    const all = answer({ items: [{ id: 'p1', name: 'Gin' }], nextCursor: null })
    assert.deepEqual(await products.list('c1'), all)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/products'])
    await products.list('c1', true)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/products'])

    const found = answer({ items: [{ id: 'p1', name: 'Gin' }], nextCursor: 'next-1', count: 31, meta: { source: 'postgres' } })
    const got = await products.query('c1', { q: 'gin', limit: 20, cursor: 'next-0' })
    assert.deepEqual(got, found)
    assert.equal(got.meta?.source, 'postgres')
    assert.deepEqual(call(), ['POST', '/public/collection/c1/products/query'])
    assert.deepEqual(last().body, { q: 'gin', limit: 20, cursor: 'next-0' })

    const assets = answer({ items: [{ id: 'a1', url: 'https://cdn.test/a1.jpg' }], nextCursor: null })
    assert.deepEqual(await products.listAssets('c1', 'p1', true), assets)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/products/p1/asset'])
  })

  test('the old product namespace is gone: products is the one way', () => {
    assert.equal((api as any).product, undefined)
    assert.equal(typeof api.products.list, 'function')
  })

  test('proofs: every proof list returns items', async () => {
    const all = answer({ items: [{ id: 'pr1', productId: 'p1' }], nextCursor: null })
    assert.deepEqual(await proof.list('c1', { expand: ['product'] }), all)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/proof?expand=product'])
    assert.deepEqual(await proof.getByUser('c1', 'u1'), all)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/proof/findByUser/u1'])
    assert.deepEqual(await proof.getByProduct('c1', 'p1'), all)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/product/p1/proof'])
    assert.deepEqual(await proof.getByBatch('c1', 'p1', 'b1'), all)
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/product/p1/batch/b1/proof'])

    assert.deepEqual(await proof.findByProduct('c1', 'p1', { limit: 50, expand: ['assets'] }), all)
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/product/p1/proof/find'])
    assert.deepEqual(last().body, { limit: 50, expand: ['assets'] })

    const grants = answer({ items: [{ id: 'g1', scope: ['read'] }], nextCursor: null })
    assert.deepEqual(await proof.listGrants('c1', 'p1', 'pr1'), grants)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/product/p1/proof/pr1/grant'])
  })
})
