import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import { translations, _resetRevisionChecks } from '../src/api/translations'
import { _resetActivity } from '../src/translationActivity'

// A correction made in Studio reaches a returning visitor: their browser's saved translations are
// dropped when the collection's translation revision changes, and kept while it doesn't.

describe('translations.resolve and the revision', () => {
  const realFetch = globalThis.fetch
  let revision = '0'
  let lookups = 0
  let revisionCalls = 0
  let word = 'Hallo'

  beforeEach(async () => {
    revision = '0'; lookups = 0; revisionCalls = 0; word = 'Hallo'
    const store = new Map<string, string>()
    ;(globalThis as any).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) }
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    _resetActivity()
    _resetRevisionChecks()
    await translations.clearLocalCache()
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const u = String(url)
      if (u.endsWith('/translations/revision')) {
        revisionCalls++
        return new Response(JSON.stringify({ revision }), { status: 200, headers: { 'content-type': 'application/json' } })
      }
      lookups++
      const body = JSON.parse(init.body)
      return new Response(JSON.stringify({ targetLanguage: 'de', items: body.texts.map((t: string, index: number) => ({ index, sourceText: t, translatedText: word, status: 'cached' })) }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch; delete (globalThis as any).localStorage })

  const ask = async () => (await translations.resolve('c1', { targetLanguage: 'de', texts: ['Hello'] })).items[0].translatedText

  test('unchanged revision: the saved translation is used, and the revision is asked once per page', async () => {
    assert.equal(await ask(), 'Hallo')
    assert.equal(await ask(), 'Hallo')
    assert.equal(lookups, 1)
    assert.equal(revisionCalls, 1)
    _resetRevisionChecks() // a new page
    assert.equal(await ask(), 'Hallo')
    assert.equal(lookups, 1)
  })

  test('an edit in Studio (revision moved): the next page drops saved copies and shows the correction', async () => {
    assert.equal(await ask(), 'Hallo')
    revision = 'kz1'; word = 'Guten Tag'
    _resetRevisionChecks() // the visitor comes back
    assert.equal(await ask(), 'Guten Tag')
    assert.equal(lookups, 2)
  })

  test('no answer about the revision: saved copies are used as before', async () => {
    assert.equal(await ask(), 'Hallo')
    const f = globalThis.fetch
    ;(globalThis as any).fetch = async (url: string, init: any) => (String(url).endsWith('/revision') ? new Response('{}', { status: 404 }) : f(url, init))
    _resetRevisionChecks()
    assert.equal(await ask(), 'Hallo')
    assert.equal(lookups, 1)
  })
})
