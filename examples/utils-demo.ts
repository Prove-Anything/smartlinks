// examples/utils-demo.ts
/**
 * Demonstrates the usage of the buildPortalPath utility function.
 */

import { utils } from '../src'
import type { Product, Collection, BatchResponse } from '../src'

// Example data
const collection: Collection = {
  id: 'coll123',
  shortId: 'abc123',
  title: 'My Collection',
  description: 'Example collection',
  portalUrl: 'https://portal.smartlinks.io',
  roles: {},
  headerImage: {
    url: 'https://example.com/header.jpg',
    thumbnails: { x100: '', x200: '', x512: '' }
  },
  logoImage: {
    url: 'https://example.com/logo.jpg',
    thumbnails: { x100: '', x200: '', x512: '' }
  }
}

const product: Product = {
  id: 'prod123',
  name: 'Premium Widget',
  collectionId: 'coll123',
  description: 'A premium quality widget',
  gtin: '1234567890123',
  heroImage: {
    url: 'https://example.com/product.jpg',
    thumbnails: { x100: '', x200: '', x512: '' }
  },
  tags: {},
  data: {}
}

const productWithOwnGtin = { ...product, ownGtin: true }
const productSharedGtin = { ...product, ownGtin: false }

const batch: BatchResponse = {
  id: 'batch456',
  name: 'Batch Alpha',
  productId: 'prod123',
  collectionId: 'coll123',
  expiryDate: '260630'
}

// ============================================
// Example 1: Basic product path with objects
// ============================================
console.log('Example 1: Basic product path with objects')
const basicPath = utils.buildPortalPath({
  collection,
  product
})
console.log(basicPath)
// Output: https://portal.smartlinks.io/c/abc123/prod123

// ============================================
// Example 2: Just with IDs (no full objects)
// ============================================
console.log('\\nExample 2: Just with IDs (no full objects)')
const withIds = utils.buildPortalPath({
  collection: { shortId: 'abc123' },
  productId: 'prod123'
})
console.log(withIds)
// Output: /c/abc123/prod123

// ============================================
// Example 3: Product with proof object
// ============================================
console.log('\\nExample 3: Product with proof object')
const withProof = utils.buildPortalPath({
  collection,
  product,
  proof: {
    id: 'proof789',
    collectionId: 'coll123',
    productId: 'prod123',
    tokenId: 'token123',
    userId: 'user123',
    createdAt: '2026-02-14T10:00:00Z',
    values: {}
  }
})
console.log(withProof)
// Output: https://portal.smartlinks.io/c/abc123/prod123/proof789

// ============================================
// Example 4: GTIN path (product owns GTIN)
// ============================================
console.log('\\nExample 4: GTIN path (product owns GTIN)')
const gtinOwn = utils.buildPortalPath({
  collection,
  product: productWithOwnGtin
})
console.log(gtinOwn)
// Output: https://portal.smartlinks.io/01/1234567890123

// ============================================
// Example 5: GTIN path (product doesn't own GTIN)
// ============================================
console.log('\nExample 5: GTIN path (product doesn\'t own GTIN)')
const gtinShared = utils.buildPortalPath({
  collection,
  product: productSharedGtin
})
console.log(gtinShared)
// Output: https://portal.smartlinks.io/gc/abc123/01/1234567890123

// ============================================
// Example 6: GTIN with batch object (includes expiry)
// ============================================
console.log('\\nExample 6: GTIN with batch object (includes expiry)')
const gtinWithBatch = utils.buildPortalPath({
  collection,
  product: productWithOwnGtin,
  batch  // extracts id and expiryDate
})
console.log(gtinWithBatch)
// Output: https://portal.smartlinks.io/01/1234567890123/10/batch456?17=260630

// ============================================
// Example 7: GTIN with just batch ID (no expiry)
// ============================================
// Example 7: GTIN with just batch ID (no expiry)
// ============================================
console.log('\nExample 7: GTIN with just batch ID (no expiry)')
const gtinWithBatchId = utils.buildPortalPath({
  collection,
  product: productWithOwnGtin,
  batchId: 'batch456'  // just the string ID
})
console.log(gtinWithBatchId)
// Output: https://portal.smartlinks.io/01/1234567890123/10/batch456

// ============================================
// Example 8: GTIN with batch and variant
// ============================================
console.log('\\nExample 8: GTIN with batch and variant')
const gtinComplete = utils.buildPortalPath({
  collection,
  product: productWithOwnGtin,
  batch,
  variant: { id: 'var1' }
})
console.log(gtinComplete)
// Output: https://portal.smartlinks.io/01/1234567890123/10/batch456/22/var1?17=260630

// ============================================
// Example 9: With query parameters
// ============================================
console.log('\\nExample 9: With query parameters')
const withQuery = utils.buildPortalPath({
  collection,
  product,
  queryParams: {
    utm_source: 'email',
    utm_campaign: 'launch',
    lang: 'fr'
  }
})
console.log(withQuery)
// Output: https://portal.smartlinks.io/c/abc123/prod123?utm_source=email&utm_campaign=launch&lang=fr

// ============================================
// Example 10: GTIN with version query param
// ============================================
console.log('\nExample 10: GTIN with version query param')
const gtinWithVersion = utils.buildPortalPath({
  collection,
  product: productWithOwnGtin,
  batchId: 'batch456',
  variant: 'var1',
  queryParams: { v: '2' }
})
console.log(gtinWithVersion)
// Output: https://portal.smartlinks.io/01/1234567890123/10/batch456/22/var1?v=2

// ============================================
// Example 11: Collection without portalUrl (uses default domain)
// ============================================
console.log('\\nExample 11: Collection without portalUrl (uses default domain)')
const noBaseUrl = utils.buildPortalPath({
  collection: { shortId: 'abc123' },
  product: productWithOwnGtin
})
console.log(noBaseUrl)
// Output: https://zt.smartlinks.io/01/1234567890123

// ============================================
// Example 12: Path only (no domain)
// ============================================
console.log('\\nExample 12: Path only (no domain)')
const pathOnly = utils.buildPortalPath({
  collection,
  product: productWithOwnGtin,
  pathOnly: true
})
console.log(pathOnly)
// Output: /01/1234567890123

// ============================================
// Example 13: Real-world QR code URL
// ============================================
console.log('\nExample 13: Real-world QR code URL')
const qrProductWithOwnGtin = {
  ...product,
  gtin: '8714789123456',
  ownGtin: true
} as Product & { ownGtin: boolean }

const qrUrl = utils.buildPortalPath({
  collection,
  product: qrProductWithOwnGtin,
  batch: { id: 'LOT2024', expiryDate: '261231' } as BatchResponse,
  queryParams: {
    source: 'qr',
    location: 'retail'
  }
})
console.log(qrUrl)
// Output: https://portal.smartlinks.io/01/8714789123456/10/LOT2024?17=261231&source=qr&location=retail
