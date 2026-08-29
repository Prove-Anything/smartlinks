import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildGs1DigitalLink } from '../src/utils/paths'

// buildGs1DigitalLink: the generic GS1 Digital Link generator. Pure function, so we
// pin the canonical AI ordering, the named + generic-map inputs, date formatting,
// serial extraction, and custom-domain scoping directly.

const platform = { shortId: 'abc123', portalUrl: 'https://smartlinks.app' }
const custom = { shortId: 'abc123', portalUrl: 'https://acme.com' }
const GTIN = '05012345678900'

test('GTIN only, non-master on platform domain → /gc/{shortId}/01/{gtin}', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: platform, gtin: GTIN }),
    'https://smartlinks.app/gc/abc123/01/05012345678900'
  )
})

test('GTIN only on a custom domain → bare /01/{gtin}', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN }),
    'https://acme.com/01/05012345678900'
  )
})

test('canonical qualifier order: cpv(22) → lot(10) → serial(21)', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, cpv: 'red', lot: 'LOT42', serial: 'SER7' }),
    'https://acme.com/01/05012345678900/22/red/10/LOT42/21/SER7'
  )
})

test('qualifiers passed out of order still emit in canonical order', () => {
  // serial + lot given, cpv omitted → /10 then /21 (22 skipped)
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, serial: 'SER7', lot: 'LOT42' }),
    'https://acme.com/01/05012345678900/10/LOT42/21/SER7'
  )
})

test('variant is an alias of cpv (AI 22)', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, variant: 'blue' }),
    'https://acme.com/01/05012345678900/22/blue'
  )
})

test('serial from an object prefers serialNumber, else id (e.g. a proof)', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, serial: { serialNumber: 'SN9', id: 'X' } as any }),
    'https://acme.com/01/05012345678900/21/SN9'
  )
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, serial: { id: 'proof1' } as any }),
    'https://acme.com/01/05012345678900/21/proof1'
  )
})

test('expiry (AI 17) becomes a YYMMDD query param', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, expiry: '2026-06-30' }),
    'https://acme.com/01/05012345678900?17=260630'
  )
})

test('batch object contributes the lot (10) and its expiry (17)', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, batch: { id: 'LOT42', expiryDate: '2026-06-30' } as any }),
    'https://acme.com/01/05012345678900/10/LOT42?17=260630'
  )
})

test('generic ais map: date AI formatted, non-date AI verbatim, path-qualifier AI routed to path', () => {
  assert.equal(
    buildGs1DigitalLink({
      collection: custom,
      gtin: GTIN,
      ais: { '10': 'LOT9', '11': new Date(2025, 0, 1), '3103': '000500' },
    }),
    'https://acme.com/01/05012345678900/10/LOT9?11=250101&3103=000500'
  )
})

test('linkType is appended as a query param', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, linkType: 'gs1:pip' }),
    'https://acme.com/01/05012345678900?linkType=gs1%3Apip'
  )
})

test('ownGtin true → bare /01/ even on the platform domain', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: platform, gtin: GTIN, ownGtin: true }),
    'https://smartlinks.app/01/05012345678900'
  )
})

test('product object supplies gtin + ownGtin', () => {
  const product = { id: 'p1', gtin: GTIN, ownGtin: 'yes' } as any
  assert.equal(
    buildGs1DigitalLink({ collection: platform, product }),
    'https://smartlinks.app/01/05012345678900'
  )
})

test('pathOnly returns the path without a domain', () => {
  assert.equal(
    buildGs1DigitalLink({ collection: custom, gtin: GTIN, serial: 'SER7', pathOnly: true }),
    '/01/05012345678900/21/SER7'
  )
})

test('explicit domain override + queryParams', () => {
  assert.equal(
    buildGs1DigitalLink({ gtin: GTIN, domain: 'https://acme.com', customDomain: true, queryParams: { utm: 'x' } }),
    'https://acme.com/01/05012345678900?utm=x'
  )
})

test('throws when no gtin is provided', () => {
  assert.throws(() => buildGs1DigitalLink({ collection: custom } as any), /requires a `gtin`/)
})
