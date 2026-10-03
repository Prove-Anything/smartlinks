import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { functionPath, resolveFunctionChannel } from '../src/api/functions'
import { setAppContext, setAppChannel } from '../src/http'

// The release channel is a PATH segment (/app/:appId/<channel>/functions/:name), never a query
// param. No channel = the collection's installed release (production). Precedence: explicit
// opts.channel → app channel (setAppChannel / initializeApi) → host context `appChannel`.

const setUrl = (href: string | null) => {
  ;(globalThis as any).window = href ? { location: new URL(href) } : undefined
}

beforeEach(() => {
  setAppContext('photo-memory')
  setAppChannel(undefined)
  setUrl(null)
})

test('production: no channel anywhere → bare app-scoped path', () => {
  assert.equal(functionPath('public', 'c1', 'venues'), '/public/collection/c1/app/photo-memory/functions/venues')
})

test('host context appChannel=dev (Forge preview) → /dev/ path', () => {
  setUrl('https://box.example/index.html?collectionId=c1&appChannel=dev')
  assert.equal(functionPath('public', 'c1', 'venues'), '/public/collection/c1/app/photo-memory/dev/functions/venues')
})

test('appChannelApp scopes the host channel to one app (shared portal page)', () => {
  setUrl('https://portal.example/p/c1?appChannel=dev&appChannelApp=photo-memory')
  assert.equal(functionPath('public', 'c1', 'venues'), '/public/collection/c1/app/photo-memory/dev/functions/venues')
  assert.equal(functionPath('public', 'c1', 'vote', { appId: 'other-app' }), '/public/collection/c1/app/other-app/functions/vote')
})

test('a page param called "channel" is NOT a release channel', () => {
  setUrl('https://portal.example/?channel=email')
  assert.equal(functionPath('public', 'c1', 'venues'), '/public/collection/c1/app/photo-memory/functions/venues')
})

test('explicit app channel beats host context; explicit call option beats both; null forces installed', () => {
  setUrl('https://box.example/?appChannel=dev')
  setAppChannel('beta')
  assert.equal(resolveFunctionChannel(), 'beta')
  assert.equal(resolveFunctionChannel({ channel: 'stable' }), 'stable')
  assert.equal(resolveFunctionChannel({ channel: null }), undefined)
  assert.equal(functionPath('admin', 'c1', 'x', { channel: null }), '/admin/collection/c1/app/photo-memory/functions/x')
})

test('unknown channel throws instead of silently calling production', () => {
  assert.throws(() => functionPath('public', 'c1', 'x', { channel: 'devv' }), /Unknown release channel/)
})

test('function names are encoded; no appId → deprecated flat path (no channel)', () => {
  setAppContext(undefined)
  setAppChannel('dev')
  assert.equal(functionPath('public', 'c 1', 'a/b'), '/public/collection/c%201/functions/a%2Fb')
})

test('siteUrl: public address on the collection site host; channel only when asked for', () => {
  const { functions } = require('../src/api/functions')
  setUrl('https://box.example/?appChannel=dev') // preview context must NOT leak into a URL handed out
  assert.equal(functions.siteUrl({ siteHost: 'acme.mysmartlinks.app' }, 'stripeWebhook'), 'https://acme.mysmartlinks.app/_fn/photo-memory/stripeWebhook')
  assert.equal(functions.siteUrl('c-k7m2x9p4qa.mysmartlinks.app', 'orders', { appId: 'shop', channel: 'dev', path: '/orders/12', query: { a: 'b c' } }),
    'https://c-k7m2x9p4qa.mysmartlinks.app/_fn/shop/dev/orders/orders/12?a=b+c')
  assert.equal(functions.siteUrl({ siteHost: 'x.mysmartlinks.app' }, 'hook', { host: 'https://shop.acme.com/' }), 'https://shop.acme.com/_fn/photo-memory/hook')
  assert.throws(() => functions.siteUrl({ siteHost: null }, 'hook'), /no siteHost/)
})
