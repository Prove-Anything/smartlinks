import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { subscriptions } from '../src/api/subscriptions'

// subscriptions.*: each call goes to the route prove serves (server/api/public/collection/memberships.js and
// server/api/admin/collectionAdmin/memberships.js), with the method and body the server expects.

describe('subscriptions', () => {
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
  const call = () => [last().method, last().url.replace('https://api.test/api/v1', ''), last().body]

  test('a member: plans, joining, mine, cancel, resume, change, billing', async () => {
    const open = answer({ items: [{ id: 'p1', name: 'Gold', prices: [{ id: 'pr1', amount: 1500, currency: 'GBP', interval: 'month' }] }], nextCursor: null })
    assert.deepEqual(await subscriptions.plans('c1'), open)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/memberships/plans', undefined])
    answer({ ok: true })
    const input = { priceId: 'pr1', successUrl: 'https://club.test/welcome', cancelUrl: 'https://club.test/join' }
    await subscriptions.start('c1', input)
    assert.deepEqual(call(), ['POST', '/public/collection/c1/memberships/start', input])
    const mine = answer({ items: [{ id: 's1', live: true }], nextCursor: null })
    assert.deepEqual(await subscriptions.mine('c1'), mine)
    assert.deepEqual(call(), ['GET', '/public/collection/c1/memberships/mine', undefined])
    answer({ ok: true })
    await subscriptions.cancel('c1', 's/1')
    assert.deepEqual(call(), ['POST', '/public/collection/c1/memberships/s%2F1/cancel', {}])
    await subscriptions.resume('c1', 's1')
    assert.deepEqual(call(), ['POST', '/public/collection/c1/memberships/s1/resume', {}])
    await subscriptions.change('c1', 's1', 'pr2')
    assert.deepEqual(call(), ['POST', '/public/collection/c1/memberships/s1/change', { priceId: 'pr2' }])
    await subscriptions.billingLink('c1', 's1', 'https://club.test/me')
    assert.deepEqual(call(), ['POST', '/public/collection/c1/memberships/s1/billing', { returnUrl: 'https://club.test/me' }])
  })

  test('the business: plans, prices, members, grants', async () => {
    const plans = answer({ items: [{ id: 'p1', name: 'Gold', prices: [] }], nextCursor: 'next-1', count: 3 })
    const planPage = await subscriptions.admin.listPlans('c1', { active: true })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/memberships/plans?active=true', undefined])
    assert.deepEqual(planPage, plans)
    await subscriptions.admin.listPlans('c1', { active: true, limit: 1, cursor: planPage.nextCursor! })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/memberships/plans?active=true&limit=1&cursor=next-1', undefined])
    answer({ ok: true })
    await subscriptions.admin.createPlan('c1', { name: 'Gold', grants: { level: 'gold', rank: 2 } })
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/memberships/plans', { name: 'Gold', grants: { level: 'gold', rank: 2 } }])
    await subscriptions.admin.updatePlan('c1', 'p1', { active: false })
    assert.deepEqual(call(), ['PATCH', '/admin/collection/c1/memberships/plans/p1', { active: false }])
    await subscriptions.admin.setPrice('c1', 'p1', { amount: 1500, interval: 'month', trialDays: 14 })
    assert.deepEqual(call(), ['PUT', '/admin/collection/c1/memberships/plans/p1/prices', { amount: 1500, interval: 'month', trialDays: 14 }])
    await subscriptions.admin.removePrice('c1', 'pr1')
    assert.deepEqual(call().slice(0, 2), ['DELETE', '/admin/collection/c1/memberships/prices/pr1'])
    const members = answer({ items: [{ id: 's1', planId: 'p1' }], nextCursor: 'next-2', count: 70 })
    const memberPage = await subscriptions.admin.list('c1', { live: true, planId: 'p1' })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/memberships/subscriptions?live=true&planId=p1', undefined])
    assert.deepEqual(memberPage, members)
    await subscriptions.admin.list('c1', { live: true, planId: 'p1', cursor: memberPage.nextCursor! })
    assert.deepEqual(call(), ['GET', '/admin/collection/c1/memberships/subscriptions?live=true&planId=p1&cursor=next-2', undefined])
    answer({ ok: true })
    await subscriptions.admin.grant('c1', { planId: 'p1', contactId: 'ct1', note: 'Founder' })
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/memberships/subscriptions', { planId: 'p1', contactId: 'ct1', note: 'Founder' }])
    await subscriptions.admin.cancel('c1', 's1', { atPeriodEnd: false })
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/memberships/subscriptions/s1/cancel', { atPeriodEnd: false }])
    await subscriptions.admin.end('c1', 's1')
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/memberships/subscriptions/s1/end', {}])
    await subscriptions.admin.reapply('c1', 's1')
    assert.deepEqual(call(), ['POST', '/admin/collection/c1/memberships/subscriptions/s1/reapply', {}])
  })

  test('describePrice says it the way people do', () => {
    assert.equal(subscriptions.describePrice({ amount: 1500, currency: 'GBP', interval: 'month' }, 'en-GB'), '£15 a month')
    assert.equal(subscriptions.describePrice({ amount: 15000, currency: 'GBP', interval: 'year' }, 'en-GB'), '£150 a year')
    assert.equal(subscriptions.describePrice({ amount: 3999, currency: 'GBP', interval: 'month', intervalCount: 3 }, 'en-GB'), '£39.99 every 3 months')
    assert.equal(subscriptions.describePrice({ amount: 9900, currency: 'GBP', interval: null }, 'en-GB'), '£99 once')
  })
})
