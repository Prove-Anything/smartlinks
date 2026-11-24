import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { shop } from '../src/api/shop'

// shop.*: each call goes to the route prove serves (server/api/public/collection/shop.js and
// server/api/admin/collectionAdmin/shop.js), with the method and body the server expects.

describe('shop', () => {
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

  // What the server answers next. A list answers { items, nextCursor, count? } (API version 2027-01).
  const answer = (body: any) => { reply = body; return body }

  const last = () => calls[calls.length - 1]
  const path = () => last().url.replace('https://api.test/api/v1', '')

  test('the shop front: config, products, checkout, the thank-you page, my orders', async () => {
    await shop.config('c1')
    assert.deepEqual([last().method, path()], ['GET', '/public/collection/c1/shop/config'])

    const forSale = answer({ items: [{ productId: 'soap', amount: 1200 }], nextCursor: null, currency: 'GBP' })
    assert.deepEqual(await shop.products('c1', { productIds: ['soap', 'ebook'] }), forSale)
    assert.deepEqual([last().method, path()], ['GET', '/public/collection/c1/shop/products?productIds=soap%2Cebook'])
    await shop.products('c1')
    assert.equal(path(), '/public/collection/c1/shop/products')
    answer({ ok: true })

    const input = { lines: [{ productId: 'soap', quantity: 2 }], shippingRateId: 'std', acceptances: { digitalImmediate: true } }
    await shop.checkout('c1', input)
    assert.deepEqual([last().method, path(), last().body], ['POST', '/public/collection/c1/shop/checkout', input])

    await shop.orderBySession('c1', 'cs_test_1')
    assert.equal(path(), '/public/collection/c1/shop/orders/by-session/cs_test_1')

    const mine = answer({ items: [{ id: 'o1' }], nextCursor: 'next-1', count: 12 })
    const page = await shop.myOrders('c1', { limit: 10 })
    assert.equal(path(), '/public/collection/c1/shop/orders/mine?limit=10')
    assert.deepEqual(page, mine)
    await shop.myOrders('c1', { limit: 10, cursor: page.nextCursor! })
    assert.equal(path(), '/public/collection/c1/shop/orders/mine?limit=10&cursor=next-1')
  })

  test('the seller: settings, Stripe, prices', async () => {
    await shop.admin.settings('c1')
    assert.deepEqual([last().method, path()], ['GET', '/admin/collection/c1/shop/settings'])
    await shop.admin.updateSettings('c1', { shipping: { rates: [{ id: 'std', label: 'Standard', amount: 395 }] } })
    assert.deepEqual([last().method, path()], ['PUT', '/admin/collection/c1/shop/settings'])

    await shop.admin.connect('c1', { returnUrl: 'https://x/done', refreshUrl: 'https://x/again' })
    assert.deepEqual([last().method, path(), last().body], ['POST', '/admin/collection/c1/shop/connect', { returnUrl: 'https://x/done', refreshUrl: 'https://x/again' }])
    await shop.admin.connectStatus('c1')
    assert.equal(path(), '/admin/collection/c1/shop/connect/status')

    const prices = answer({ items: [{ id: 'p1', productId: 'soap', amount: 1200 }], nextCursor: null, count: 1 })
    assert.deepEqual(await shop.admin.listPrices('c1', { productId: 'soap', active: true }), prices)
    assert.equal(path(), '/admin/collection/c1/shop/prices?productId=soap&active=true')
    await shop.admin.listPrices('c1', { limit: 5, cursor: 'next-2' })
    assert.equal(path(), '/admin/collection/c1/shop/prices?limit=5&cursor=next-2')
    answer({ ok: true })
    await shop.admin.setPrice('c1', { productId: 'soap', amount: 1200, trackStock: true })
    assert.deepEqual([last().method, path(), last().body], ['POST', '/admin/collection/c1/shop/prices', { productId: 'soap', amount: 1200, trackStock: true }])
    await shop.admin.updatePrice('c1', 'p1', { amount: 1300 })
    assert.deepEqual([last().method, path(), last().body], ['PATCH', '/admin/collection/c1/shop/prices/p1', { amount: 1300 }])
    await shop.admin.removePrice('c1', 'p1')
    assert.deepEqual([last().method, path()], ['DELETE', '/admin/collection/c1/shop/prices/p1'])
  })

  test('the seller: orders, ship, refund, delivered, cancel', async () => {
    const orders = answer({ items: [{ id: 'o1', status: 'paid' }], nextCursor: 'next-3', count: 41 })
    const page = await shop.admin.listOrders('c1', { status: 'paid,fulfilled', limit: 20 })
    assert.equal(path(), '/admin/collection/c1/shop/orders?status=paid%2Cfulfilled&limit=20')
    assert.deepEqual(page, orders)
    await shop.admin.listOrders('c1', { status: 'paid,fulfilled', limit: 20, cursor: page.nextCursor! })
    assert.equal(path(), '/admin/collection/c1/shop/orders?status=paid%2Cfulfilled&limit=20&cursor=next-3')
    answer({ ok: true })
    await shop.admin.getOrder('c1', 'o1')
    assert.equal(path(), '/admin/collection/c1/shop/orders/o1')
    await shop.admin.ship('c1', 'o1', { carrier: 'Royal Mail', trackingNumber: 'AB123' })
    assert.deepEqual([last().method, path(), last().body], ['POST', '/admin/collection/c1/shop/orders/o1/ship', { carrier: 'Royal Mail', trackingNumber: 'AB123' }])
    await shop.admin.refund('c1', 'o1', { lines: [{ itemId: 'l1', quantity: 1 }], reason: 'damaged' })
    assert.deepEqual([last().method, path()], ['POST', '/admin/collection/c1/shop/orders/o1/refund'])
    await shop.admin.markDelivered('c1', 'o1', 'l2', { reference: 'TKT-9' })
    assert.equal(path(), '/admin/collection/c1/shop/orders/o1/lines/l2/delivered')
    await shop.admin.cancelCheckout('c1', 'o1')
    assert.deepEqual([last().method, path()], ['POST', '/admin/collection/c1/shop/orders/o1/expire'])
  })

  test('formatMoney: minor units as the person reads them', () => {
    assert.equal(shop.formatMoney(1299, 'GBP', 'en-GB'), '£12.99')
    assert.equal(shop.formatMoney(500, 'EUR', 'en-GB'), '€5.00')
    assert.equal(shop.formatMoney(100, 'NOPE'), '1.00 NOPE')
  })
})
