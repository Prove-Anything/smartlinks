import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildPortalPath } from '../src/utils/paths'

// buildPortalPath is a pure function — no network/DB — so it's cheap to pin the
// GS1 Digital Link generation rules directly. The key rule under test: a bare
// `/01/{gtin}` is emitted when the product owns the GTIN globally (ownGtin) OR
// when the collection is on its own custom domain; otherwise a non-master GTIN
// is scoped with the `/gc/{shortId}` prefix on the shared platform domain.

const platform = { shortId: 'abc123', portalUrl: 'https://smartlinks.app' }
const custom = { shortId: 'abc123', portalUrl: 'https://acme.com' }
const customViaRedirect = { shortId: 'abc123', portalUrl: 'https://acme.com', redirectUrl: 'https://acme.com' }

const masterProduct = { id: 'prod1', gtin: '05012345678900', ownGtin: 'yes' } as any
const nonMasterProduct = { id: 'prod1', gtin: '05012345678900', ownGtin: null } as any

test('non-master product on the platform domain → /gc/{shortId}/01/{gtin}', () => {
  assert.equal(
    buildPortalPath({ collection: platform, product: nonMasterProduct }),
    'https://smartlinks.app/gc/abc123/01/05012345678900'
  )
})

test('master product (ownGtin) on the platform domain → bare /01/{gtin}', () => {
  assert.equal(
    buildPortalPath({ collection: platform, product: masterProduct }),
    'https://smartlinks.app/01/05012345678900'
  )
})

test('non-master product on a custom domain (via portalUrl host) → bare /01/{gtin}', () => {
  // This is the bug fix: no /gc/{shortId} prefix on a custom domain.
  assert.equal(
    buildPortalPath({ collection: custom, product: nonMasterProduct }),
    'https://acme.com/01/05012345678900'
  )
})

test('non-master product on a custom domain (via redirectUrl) → bare /01/{gtin}', () => {
  assert.equal(
    buildPortalPath({ collection: customViaRedirect, product: nonMasterProduct }),
    'https://acme.com/01/05012345678900'
  )
})

test('master product on a custom domain → bare /01/{gtin}', () => {
  assert.equal(
    buildPortalPath({ collection: custom, product: masterProduct }),
    'https://acme.com/01/05012345678900'
  )
})

test('hub platform host (mysmartlinks.app) is NOT a custom domain → /gc/ prefix', () => {
  assert.equal(
    buildPortalPath({ collection: { shortId: 'abc123', portalUrl: 'https://mysmartlinks.app' }, product: nonMasterProduct }),
    'https://mysmartlinks.app/gc/abc123/01/05012345678900'
  )
})

test('explicit customDomain:true forces the bare form (e.g. pathOnly callers)', () => {
  assert.equal(
    buildPortalPath({ collection: platform, product: nonMasterProduct, customDomain: true, pathOnly: true }),
    '/01/05012345678900'
  )
})

test('explicit customDomain:false forces the /gc/ prefix even on a custom host', () => {
  assert.equal(
    buildPortalPath({ collection: custom, product: nonMasterProduct, customDomain: false, pathOnly: true }),
    '/gc/abc123/01/05012345678900'
  )
})

test('batch adds /10/{batchId} and ?17={expiry} (AI 10 + 17)', () => {
  assert.equal(
    buildPortalPath({
      collection: platform,
      product: masterProduct,
      batch: { id: 'lot42', expiryDate: '2026-06-30' } as any,
    }),
    'https://smartlinks.app/01/05012345678900/10/lot42?17=260630'
  )
})

test('variant adds /22/{variantId} (AI 22)', () => {
  assert.equal(
    buildPortalPath({ collection: custom, product: nonMasterProduct, variant: 'red' }),
    'https://acme.com/01/05012345678900/22/red'
  )
})

test('non-GTIN product path → /c/{shortId}/{productId}/{proofId}', () => {
  assert.equal(
    buildPortalPath({ collection: platform, productId: 'prod1', proof: 'proofX' }),
    'https://smartlinks.app/c/abc123/prod1/proofX'
  )
})

test('pathOnly returns the path without a domain', () => {
  assert.equal(
    buildPortalPath({ collection: custom, product: nonMasterProduct, pathOnly: true }),
    '/01/05012345678900'
  )
})
