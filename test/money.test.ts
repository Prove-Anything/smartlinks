import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatMinor, currencyDecimals, describeRecurring } from '../src/utils/money'

// Intl output uses non-breaking spaces in some languages; compare with plain spaces.
const plain = (s: string) => s.replace(/[  ]/g, ' ')

test('money: each language writes its own separators and symbol position', () => {
  assert.equal(formatMinor(129950, 'EUR', 'en-GB'), '€1,299.50')
  assert.equal(plain(formatMinor(129950, 'EUR', 'de')), '1.299,50 €')
  assert.equal(plain(formatMinor(129950, 'EUR', 'fr')), '1 299,50 €')
})

test('money: zero-decimal currencies are whole units (1299 JPY is ¥1,299, not ¥13)', () => {
  assert.equal(currencyDecimals('JPY'), 0)
  assert.equal(currencyDecimals('EUR'), 2)
  assert.match(formatMinor(1299, 'JPY', 'en'), /1,299/)
})

test('recurring prices: the "how often" words follow the language', () => {
  assert.equal(describeRecurring({ amount: 1500, currency: 'GBP', interval: 'month' }, 'en-GB'), '£15 a month')
  assert.equal(plain(describeRecurring({ amount: 1500, currency: 'EUR', interval: 'month' }, 'de')), '15 € pro Monat')
  assert.equal(plain(describeRecurring({ amount: 4000, currency: 'EUR', interval: 'month', intervalCount: 3 }, 'fr')), '40 € tous les 3 mois')
  assert.equal(plain(describeRecurring({ amount: 9950, currency: 'EUR', interval: null }, 'it')), '99,50 € una tantum')
  // A language without its own words falls back to English wording, local number format.
  assert.equal(plain(describeRecurring({ amount: 1500, currency: 'PLN', interval: 'year' }, 'pl')), '15 zł a year')
})
