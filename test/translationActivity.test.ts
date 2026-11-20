import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import * as act from '../src/translationActivity'

// "Translating this page for the first time": shown only for slow fresh translations, combined
// across this window and embedded app frames, passed up to a parent frame.

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
let messageHandler: ((e: any) => void) | null = null
let posted: any[] = []

function setWindow({ framed }: { framed: boolean }) {
  const w: any = {
    addEventListener: (type: string, fn: any) => { if (type === 'message') messageHandler = fn },
    removeEventListener: () => { messageHandler = null },
  }
  w.parent = framed ? { postMessage: (m: any) => posted.push(m) } : w
  ;(globalThis as any).window = w
}

beforeEach(() => {
  act._resetActivity({ showAfterMs: 20 })
  messageHandler = null
  posted = []
  setWindow({ framed: false })
})
afterEach(() => { ;(globalThis as any).window = undefined })

test('a quick answer (already translated) shows nothing', async () => {
  const seen: act.TranslationActivity[] = []
  act.onActivity((a) => seen.push(a))
  const done = act.trackTranslation('de', 5)
  await wait(5)
  done()
  await wait(30)
  assert.deepEqual(seen.map((a) => a.active), [false])
})

test('a slow request shows, with its language and size, then clears', async () => {
  const seen: act.TranslationActivity[] = []
  act.onActivity((a) => seen.push(a))
  const done = act.trackTranslation('de', 40)
  await wait(30)
  assert.deepEqual(act.activity(), { active: true, targetLanguage: 'de', texts: 40 })
  done()
  assert.equal(act.activity().active, false)
  assert.deepEqual(seen.map((a) => a.active), [false, true, false])
})

test('several requests at once are one notice until the last settles', async () => {
  act.onActivity(() => {})
  const a = act.trackTranslation('de', 10)
  const b = act.trackTranslation('de', 5)
  await wait(30)
  assert.equal(act.activity().texts, 15)
  a()
  assert.equal(act.activity().active, true)
  b()
  assert.equal(act.activity().active, false)
})

test('an app frame passes its state to the parent', async () => {
  setWindow({ framed: true })
  const done = act.trackTranslation('fr', 3)
  await wait(30)
  done()
  assert.deepEqual(posted.map((m) => [m.type, m.payload.active]), [['smartlinks:translating', true], ['smartlinks:translating', false]])
  assert.equal(posted[0]._smartlinksIframeMessage, true)
})

test('a host hears its app frames and combines them with its own requests', async () => {
  const seen: act.TranslationActivity[] = []
  act.onActivity((a) => seen.push(a))
  const frame = {}
  messageHandler!({ source: frame, data: { type: 'smartlinks:translating', payload: { active: true, targetLanguage: 'de', texts: 12 } } })
  assert.deepEqual(act.activity(), { active: true, targetLanguage: 'de', texts: 12 })
  messageHandler!({ source: { other: true }, data: { type: 'unrelated' } })
  messageHandler!({ source: frame, data: { type: 'smartlinks:translating', payload: { active: false, texts: 0 } } })
  assert.equal(act.activity().active, false)
  assert.deepEqual(seen.map((a) => a.active), [false, true, false])
})

test('the notice is in the language being translated into, with Chinese by script', () => {
  assert.match(act.translatingMessage('de').text, /übersetzt/)
  assert.equal(act.translatingMessage('zh-CN').lang, 'zh-Hans')
  assert.equal(act.translatingMessage('zh-TW').lang, 'zh-Hant')
  assert.equal(act.translatingMessage('fr-CA').lang, 'fr')
  assert.equal(act.translatingMessage('ar').dir, 'rtl')
  assert.equal(act.translatingMessage('xx').lang, 'en')
})
