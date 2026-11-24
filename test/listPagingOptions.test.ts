import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { batch } from '../src/api/batch'
import { bookings } from '../src/api/bookings'
import { broadcasts } from '../src/api/broadcasts'
import { collection } from '../src/api/collection'
import { comms } from '../src/api/comms'
import { conditions } from '../src/api/conditions'
import { config } from '../src/api/config'
import { contact } from '../src/api/contact'
import { containers } from '../src/api/containers'
import { crate } from '../src/api/crate'
import { facets } from '../src/api/facets'
import { files } from '../src/api/files'
import { form } from '../src/api/form'
import { all } from '../src/list'

// SDK 3 lists (API version 2027-01): a list function sends `limit` and `cursor` (never offset, page or
// startAfter) and hands back the API's answer as it is: { items, nextCursor, count? } plus anything else
// the route says beside the list.

describe('lists page with limit + cursor and return { items, nextCursor }', () => {
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
      const body = typeof reply === 'function' ? reply(String(url)) : reply
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch })

  const last = () => calls[calls.length - 1]
  const path = () => last().url.replace('https://api.test/api/v1', '')
  const C = '/admin/collection/c1'
  const P = '/public/collection/c1'

  test('contacts: list, search and duplicates', async () => {
    reply = { items: [{ contactId: 'a' }], nextCursor: 'n1' }
    const page = await contact.list('c1', { limit: 1, includeDeleted: true })
    assert.deepEqual(page, { items: [{ contactId: 'a' }], nextCursor: 'n1' })
    assert.equal(path(), `${C}/contacts?limit=1&includeDeleted=true`)
    await contact.list('c1', { limit: 1, cursor: 'n1' })
    assert.equal(path(), `${C}/contacts?limit=1&cursor=n1`)

    await contact.search({ collectionId: 'c1', q: 'joh', tags: ['vip', 'trade'], limit: 20, cursor: 'n2' })
    assert.equal(path(), `${C}/contacts/search?q=joh&tags=vip&tags=trade&limit=20&cursor=n2`)

    reply = { items: [{ keep: { contactId: 'k' }, merge: { contactId: 'm' }, matchedOn: 'email' }], nextCursor: null, scanned: 12 }
    const dupes = await contact.findDuplicates('c1', { limit: 50 })
    assert.equal(dupes.items[0].keep.contactId, 'k')
    assert.equal(dupes.scanned, 12)
    assert.equal(path(), `${C}/contacts/duplicates?limit=50`)
  })

  test('every page of a list, with all()', async () => {
    reply = (url: string) => url.includes('cursor=p2')
      ? { items: [{ id: 'c3' }], nextCursor: null }
      : { items: [{ id: 'c1' }, { id: 'c2' }], nextCursor: 'p2' }
    const crates = await all((cursor) => crate.list('c1', { limit: 2, cursor }))
    assert.deepEqual(crates.map((c) => c.id), ['c1', 'c2', 'c3'])
    assert.equal(path(), `${C}/crate?limit=2&cursor=p2`)
  })

  test('bookings, slots and blocks', async () => {
    reply = { items: [{ id: 'b1' }], nextCursor: null, count: 1 }
    const page = await bookings.list('c1', 'app', { status: 'confirmed', limit: 10, cursor: 'n' })
    assert.equal(page.count, 1)
    assert.equal(path(), `${C}/app/app/bookings?status=confirmed&limit=10&cursor=n`)
    await bookings.mine('c1', 'app', { limit: 5 })
    assert.equal(path(), `${P}/app/app/bookings/mine?limit=5`)
    await bookings.slots.list('c1', 'app', { available: true, cursor: 'n' })
    assert.equal(path(), `${P}/app/app/bookings/slots?available=true&cursor=n`)
    await bookings.blocks.list('c1', 'app', { resourceType: 'record', resourceId: 'staff-1' })
    assert.equal(path(), `${C}/app/app/bookings/blocks?resourceType=record&resourceId=staff-1`)
  })

  test('containers', async () => {
    await containers.list('c1', { containerType: 'pallet', limit: 50, cursor: 'n' })
    assert.equal(path(), `${C}/containers?containerType=pallet&limit=50&cursor=n`)
    await containers.listItems('c1', 'k1', { history: true, cursor: 'n' })
    assert.equal(path(), `${C}/containers/k1/items?history=true&cursor=n`)
    await containers.publicList('c1', { topLevel: true })
    assert.equal(path(), `${P}/containers?topLevel=true`)
    await containers.publicListItems('c1', 'k1')
    assert.equal(path(), `${P}/containers/k1/items`)
    reply = { items: [{ containerId: 'k1' }], nextCursor: null, containers: [{ id: 'k1' }] }
    const found = await containers.findForItem('c1', { itemType: 'proof', itemId: 'u1' })
    assert.equal(found.containers[0].id, found.items[0].containerId)
  })

  test('broadcasts', async () => {
    await broadcasts.list('c1', { appId: 'news', limit: 5, cursor: 'n' })
    assert.equal(path(), `${C}/broadcasts/?appId=news&limit=5&cursor=n`)
    reply = { items: [{ contactId: 'a' }], nextCursor: 'n2', count: 9 }
    const page = await broadcasts.recipients('c1', 'b1', { limit: 1 })
    assert.equal(page.count, 9)
    assert.equal(path(), `${C}/broadcasts/b1/recipients?limit=1`)
  })

  test('lists that come back whole are returned as the API sends them', async () => {
    reply = { items: [{ id: 'x' }], nextCursor: null }
    const whole = { items: [{ id: 'x' }], nextCursor: null }
    assert.deepEqual(await batch.list('c1', 'p1'), whole)
    assert.equal(path(), `${C}/product/p1/batch`)
    assert.deepEqual(await batch.searchInCollection('c1', { search: 'B-1', limit: 5 }), whole)
    assert.equal(path(), `${C}/batch?search=B-1&limit=5`)
    assert.deepEqual(await batch.getBatchTags('c1', 'b1', '000001'), whole)
    assert.equal(path(), `${C}/batch/b1/tags?claimSetId=000001`)
    assert.deepEqual(await collection.list(), whole)
    assert.equal(path(), '/admin/collection')
    assert.deepEqual(await collection.getUsers('c1'), whole)
    assert.deepEqual(await conditions.list('c1'), whole)
    assert.equal(path(), `${P}/condition`)
    assert.deepEqual(await conditions.list('c1', true), whole)
    assert.equal(path(), `${C}/condition`)
    assert.deepEqual(await config.getFields(), whole)
    assert.deepEqual(await config.getProofTypes(), whole)
    assert.deepEqual(await form.list('c1', true), whole)
    assert.equal(path(), `${C}/form`)
    assert.deepEqual(await files.list('c1', { origin: 'fetched' }), whole)
    assert.equal(path(), `${C}/files?origin=fetched`)
    assert.deepEqual(await comms.listMethods('c1', { type: 'email' }), whole)
    assert.equal(path(), `${P}/comm/methods?type=email`)
    assert.deepEqual(await comms.queryByUser('c1', { contactId: 'a', limit: 10 }), whole)
    assert.deepEqual(last().body, { contactId: 'a', limit: 10 })
    assert.deepEqual(await comms.queryRecipientIds('c1', { broadcastId: 'b1' }), whole)
  })

  test('facets keep what the route says beside the list', async () => {
    reply = { items: [{ key: 'brand' }], nextCursor: null }
    assert.equal((await facets.list('c1', { kind: 'custom' })).items[0].key, 'brand')
    assert.equal(path(), `${C}/facets?kind=custom`)
    reply = { items: [{ key: 'acme' }], nextCursor: null, facet: { key: 'brand' } }
    const values = await facets.publicListValues('c1', 'brand')
    assert.equal(values.facet.key, 'brand')
    assert.equal(values.items[0].key, 'acme')
    reply = { items: [], nextCursor: null, buckets: [{ facetKey: 'brand', valueKey: 'acme', count: 3 }], meta: { matchedProducts: 3 } }
    const counted = await facets.query('c1', { facetKeys: ['brand'] })
    assert.equal(counted.buckets[0].count, 3)
    assert.equal(counted.meta?.matchedProducts, 3)
    reply = { items: ['catalog'], nextCursor: null }
    assert.deepEqual((await facets.namespaces('c1')).items, ['catalog'])
  })
})
