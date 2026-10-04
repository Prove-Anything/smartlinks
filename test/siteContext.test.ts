import { test, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import { readContext } from '../src/context'
import { functionPath } from '../src/api/functions'
import { setAppContext, setAppChannel } from '../src/http'

// An app served as a public website ("app site") gets its context from the host page's
// window.__SMARTLINKS_SITE__ — the LOWEST-precedence source, so URL params and props still win.

const setUrl = (href: string | null) => {
  ;(globalThis as any).window = href ? { location: new URL(href) } : undefined
}

beforeEach(() => {
  setUrl(null)
  delete (globalThis as any).__SMARTLINKS_SITE__
  setAppContext('acme--booking')
  setAppChannel(undefined)
})

test('a site page knows its collection and app with no URL params', () => {
  setUrl('https://bloom.smartlinks.host/book')
  ;(globalThis as any).__SMARTLINKS_SITE__ = { collectionId: 'colBloom', appId: 'acme--booking', channel: 'stable', host: 'bloom.smartlinks.host' }
  const ctx = readContext()
  assert.equal(ctx.collectionId, 'colBloom')
  assert.equal(ctx.appId, 'acme--booking')
  assert.equal(ctx.appChannel, undefined) // stable needs no channel
})

test('URL params and props still win over the site', () => {
  setUrl('https://bloom.smartlinks.host/?collectionId=fromUrl')
  ;(globalThis as any).__SMARTLINKS_SITE__ = { collectionId: 'colBloom', appId: 'acme--booking' }
  assert.equal(readContext().collectionId, 'fromUrl')
  assert.equal(readContext({ collectionId: 'fromProps' }).collectionId, 'fromProps')
})

test("a dev-installed site calls its own channel's functions", () => {
  setUrl('https://bloom-dev.smartlinks.host/')
  ;(globalThis as any).__SMARTLINKS_SITE__ = { collectionId: 'colBloom', appId: 'acme--booking', channel: 'dev' }
  assert.equal(functionPath('public', 'colBloom', 'book'), '/public/collection/colBloom/app/acme--booking/dev/functions/book')
})

after(() => {
  delete (globalThis as any).__SMARTLINKS_SITE__
  setUrl(null)
})
