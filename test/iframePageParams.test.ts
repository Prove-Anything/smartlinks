import { test } from 'node:test'
import assert from 'node:assert/strict'

// A host (a website, portal) opening one of an app's pages with that page's own params
// (a `linkable` entry's `accepts`, e.g. a booking page started on one service).

const { IframeResponder, buildIframeSrc } = require('../src/iframeResponder')

// Other test files run interleaved with these and set or clear the global `window`, so the address is
// built synchronously (once the responder has resolved its app URL) with a stub in place.
const stubWindow = () => {
  ;(globalThis as any).window = { location: { href: 'https://site.example/book' }, addEventListener() {}, removeEventListener() {} }
}
const srcOf = async (r: any): Promise<string> => {
  await r.ready
  stubWindow()
  return r.buildIframeSrc()
}

const hashQuery = (src: string) => new URLSearchParams(src.split('#')[1].split('?')[1])

test('IframeResponder adds the page params to a hash-routed app address', async () => {
  const src = await srcOf(new IframeResponder({
    collectionId: 'c1',
    appId: 'appointments',
    appUrl: 'https://smartlinks.app/apps/appointments/stable/#/',
    initialPath: '/my-bookings',
    params: { service: 'svc_1', staff: '' },
  }))
  assert.match(src, /\/stable\/#\/my-bookings\?/, 'one slash after #: "#//my-bookings" matches no route')
  const q = hashQuery(src)
  assert.equal(q.get('service'), 'svc_1')
  assert.equal(q.has('staff'), false, 'empty values are left out')
  assert.equal(q.get('collectionId'), 'c1')
})

test("the platform's context params win over a page param of the same name", async () => {
  const q = hashQuery(await srcOf(new IframeResponder({
    collectionId: 'c1',
    appId: 'appointments',
    appUrl: 'https://smartlinks.app/apps/appointments/stable/#/',
    params: { collectionId: 'someone-else', appId: 'other' },
  })))
  assert.equal(q.get('collectionId'), 'c1')
  assert.equal(q.get('appId'), 'appointments')
})

test('buildIframeSrc takes page params too', () => {
  stubWindow()
  const src = buildIframeSrc({
    appUrl: 'https://smartlinks.app/apps/appointments/stable/#/',
    collectionId: 'c1',
    appId: 'appointments',
    initialPath: '/',
    params: { date: '2026-11-02', collectionId: 'x' },
  })
  const q = hashQuery(src)
  assert.equal(q.get('date'), '2026-11-02')
  assert.equal(q.get('collectionId'), 'c1')
})
