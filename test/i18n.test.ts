import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import * as i18n from '../src/i18n'

// An app's own words: English source + the person's language, key fallback, plurals, live switch.

const en = {
  contacts: { add: 'Add contact', count_one: '{{count}} contact', count_other: '{{count}} contacts', greet: 'Hello {{name}}' },
  onlyEnglish: 'Only in English',
}
const zh = { contacts: { add: '添加联系人', count_other: '{{count}} 位联系人' } }

const setUrl = (href: string | null) => {
  ;(globalThis as any).window = href ? { location: new URL(href), addEventListener() {} } : undefined
}

beforeEach(() => {
  i18n._reset()
  setUrl(null)
})

test('the host language (?lang in the hash query) picks the catalog', async () => {
  setUrl('https://smartlinks.app/apps/crm/stable/index.html#/contacts?collectionId=c1&lang=zh-hans')
  await i18n.init({ catalogs: { en, 'zh-Hans': zh } })
  assert.equal(i18n.language(), 'zh-Hans')
  assert.equal(i18n.t('contacts.add'), '添加联系人')
})

test('a key missing in the language shows its English; a key missing everywhere shows the key', async () => {
  await i18n.init({ language: 'zh-Hans', catalogs: { en, 'zh-Hans': zh } })
  assert.equal(i18n.t('onlyEnglish'), 'Only in English')
  assert.equal(i18n.t('nowhere.at.all'), 'nowhere.at.all')
  assert.equal(i18n.t('nowhere', { defaultValue: 'Fallback' }), 'Fallback')
})

test('plurals by language: English one/other, Chinese other only', async () => {
  await i18n.init({ language: 'en', catalogs: { en, 'zh-Hans': zh } })
  assert.equal(i18n.t('contacts.count', { count: 1 }), '1 contact')
  assert.equal(i18n.t('contacts.count', { count: 3 }), '3 contacts')
  await i18n.setLanguage('zh-Hans')
  assert.equal(i18n.t('contacts.count', { count: 1 }), '1 位联系人')
})

test('values are filled in', async () => {
  await i18n.init({ language: 'en', catalogs: { en } })
  assert.equal(i18n.t('contacts.greet', { name: 'Ana' }), 'Hello Ana')
})

test('zh-CN reads the Simplified catalog; a region falls back to its language', async () => {
  await i18n.init({ language: 'zh-CN', catalogs: { en, 'zh-Hans': zh } })
  assert.equal(i18n.t('contacts.add'), '添加联系人')
  await i18n.setLanguage('zh-TW') // Traditional: no catalog here, so English
  assert.equal(i18n.t('contacts.add'), 'Add contact')
  assert.equal(i18n.normalizeLanguage('zh_cn'), 'zh-CN')
  assert.equal(i18n.normalizeLanguage('FR'), 'fr')
  assert.equal(i18n.normalizeLanguage('not a code'), null)
})

test('subscribers hear a language switch, and the snapshot changes', async () => {
  await i18n.init({ language: 'en', catalogs: { en, 'zh-Hans': zh } })
  let heard = 0
  const off = i18n.subscribe(() => { heard++ })
  const before = i18n.snapshot()
  await i18n.setLanguage('zh-Hans')
  assert.equal(heard, 1)
  assert.notEqual(i18n.snapshot(), before)
  await i18n.setLanguage('zh-Hans') // no change, no event
  assert.equal(heard, 1)
  off()
})

test('the browser language is used only when the site has turned it on', async () => {
  const nav = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Object.defineProperty(globalThis, 'navigator', { value: { language: 'fr-CA' }, configurable: true })
  try {
    // No host language, no page language: an English-only site stays English for a French browser.
    await i18n.init({ catalogs: { en, fr: { contacts: { add: 'Ajouter' } } } })
    assert.equal(i18n.language(), 'en')
    i18n._reset()
    // The site offers French: the French browser gets it (fr-CA → fr).
    await i18n.init({ catalogs: { en, fr: { contacts: { add: 'Ajouter' } } }, languages: ['en', 'fr'] })
    assert.equal(i18n.language(), 'fr')
    assert.equal(i18n.t('contacts.add'), 'Ajouter')
  } finally {
    if (nav) Object.defineProperty(globalThis, 'navigator', nav)
    else delete (globalThis as any).navigator
  }
})
