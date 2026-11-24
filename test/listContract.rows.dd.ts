// Rows for test/listContract.test.ts (see listContract.table.ts for what a row is).
import * as SL from '../src/api'
import type { Row } from './listContract.table'

const C = 'c1'
const DAY = '2026-11-01T00:00:00Z'
const END = '2026-11-30T00:00:00Z'

const RANGES = { createdAt: { gte: DAY, lte: END }, updatedAt: { gte: DAY, lte: END } }

export const ROWS_D: Row[] = [
  // ── claimSet.ts ────────────────────────────────────────────────────────────────────────────────
  { name: 'claimSet.getAll', call: (o) => SL.claimSet.getAll(C, o) },
  { name: 'claimSet.getAll (own)', call: (o) => SL.claimSet.getAll(undefined, o) },
  { name: 'claimSet.getAssignedTags', call: (o) => SL.claimSet.getAssignedTags('12', C, o) },
  { name: 'claimSet.getAssignedTags (own)', call: (o) => SL.claimSet.getAssignedTags('12', undefined, o) },
  { name: 'claimSet.ranges.list', call: (o) => SL.claimSet.ranges.list({ collectionId: C }, '12', o) },
  { name: 'claimSet.ranges.list (partner)', call: (o) => SL.claimSet.ranges.list({ partnerId: 'p1' }, '12', o) },
  { name: 'claimSet.ranges.tags', call: (o) => SL.claimSet.ranges.tags({ collectionId: C }, '12', 'r1', { keys: true, ...o }) },
  { name: 'claimSet.ranges.tags (partner)', call: (o) => SL.claimSet.ranges.tags({ partnerId: 'p1' }, '12', 'r1', { keys: true, ...o }) },

  // ── containers.ts ──────────────────────────────────────────────────────────────────────────────
  { name: 'containers.findForItem', call: (o) => SL.containers.findForItem(C, { itemType: 'proof', itemId: 'unit-1', productId: 'p1', ...o }) },
  { name: 'containers.list', call: (o) => SL.containers.list(C, { containerType: 'pallet', status: 'active', ref: 'P-1', parentContainerId: 'k1', topLevel: false, ...o }) },
  { name: 'containers.listItems', call: (o) => SL.containers.listItems(C, 'k1', { history: true, ...o }) },
  { name: 'containers.publicList', call: (o) => SL.containers.publicList(C, { containerType: 'cask', parentContainerId: 'k1', topLevel: true, ...o }) },
  { name: 'containers.publicListItems', call: (o) => SL.containers.publicListItems(C, 'k1', o) },

  // ── crate.ts ───────────────────────────────────────────────────────────────────────────────────
  { name: 'crate.list', call: (o) => SL.crate.list(C, { includeDeleted: true, ...o }) },

  // ── facets.ts ──────────────────────────────────────────────────────────────────────────────────
  { name: 'facets.list', whole: true, call: () => SL.facets.list(C, { includeDeleted: true, kind: 'custom', reserved: false, namespace: 'catalog' }) },
  { name: 'facets.listValues', call: (o) => SL.facets.listValues(C, 'brand', { includeDeleted: true, ...o }) },
  { name: 'facets.namespaces', whole: true, call: () => SL.facets.namespaces(C) },
  { name: 'facets.publicList', whole: true, call: () => SL.facets.publicList(C, { namespace: 'catalog' }) },
  { name: 'facets.publicListValues', call: (o) => SL.facets.publicListValues(C, 'brand', o) },
  { name: 'facets.publicNamespaces', whole: true, call: () => SL.facets.publicNamespaces(C) },
  { name: 'facets.publicQuery', whole: true, call: () => SL.facets.publicQuery(C, { facetKeys: ['brand'], q: 'jo', ...RANGES, query: { status: ['active'] } }) },
  { name: 'facets.query', whole: true, call: () => SL.facets.query(C, { facetKeys: ['brand'], q: 'jo', ...RANGES, query: { status: ['active'] } }) },

  // ── lots.ts ────────────────────────────────────────────────────────────────────────────────────
  { name: 'lots.list', call: (o) => SL.lots.list(C, { status: 'open', productId: 'p1', includeDeleted: true, ...o }), opts: { q: 'jo' } },
  { name: 'lots.listProducts', call: (o) => SL.lots.listProducts(C, 'l1', o) },
  { name: 'lots.publicList', call: (o) => SL.lots.publicList(C, { status: 'open', productId: 'p1', ...o }), opts: { q: 'jo' } },
  { name: 'lots.publicListProducts', call: (o) => SL.lots.publicListProducts(C, 'l1', o) },

  // ── nfc.ts ─────────────────────────────────────────────────────────────────────────────────────
  { name: 'nfc.lookupTag', whole: true, call: () => SL.nfc.lookupTag('04A1B2C3D4E5F6') },

  // ── products.ts ────────────────────────────────────────────────────────────────────────────────
  { name: 'products.list', call: (o) => SL.products.list(C, true, o), opts: { expand: ['facets'] } },
  { name: 'products.list (public)', call: (o) => SL.products.list(C, false, o), opts: { expand: ['facets'] } },
  { name: 'products.listAssets', call: (o) => SL.products.listAssets(C, 'p1', true, o) },
  { name: 'products.listAssets (public)', call: (o) => SL.products.listAssets(C, 'p1', false, o) },
  {
    name: 'products.query',
    call: (o) => SL.products.query(C, { query: { status: ['active'], sku: 'S1' }, ...o }, true),
    opts: { q: 'jo', orderBy: [{ updatedAt: 'desc' }, { name: 'asc' }], ...RANGES, expand: ['facets'] },
  },
  {
    name: 'products.query (public)',
    call: (o) => SL.products.query(C, { query: { status: ['active'], sku: 'S1' }, ...o }),
    opts: { q: 'jo', orderBy: [{ updatedAt: 'desc' }, { name: 'asc' }], ...RANGES, expand: ['facets'] },
  },

  // ── proof.ts ───────────────────────────────────────────────────────────────────────────────────
  {
    name: 'proof.findByProduct',
    call: (o) => SL.proof.findByProduct(C, 'p1', { filterBy: [{ field: 'values.colour', value: 'red' }], ...o }),
    opts: { expand: ['assets'] },
  },
  { name: 'proof.getByBatch', call: (o) => SL.proof.getByBatch(C, 'p1', 'b1', o) },
  { name: 'proof.getByProduct', call: (o) => SL.proof.getByProduct(C, 'p1', o) },
  { name: 'proof.getByUser', call: (o) => SL.proof.getByUser(C, 'u1', o) },
  { name: 'proof.list', call: (o) => SL.proof.list(C, o), opts: { expand: ['product'] } },
  { name: 'proof.listGrants', call: (o) => SL.proof.listGrants(C, 'p1', 'pr1', o) },

  // ── tags.ts ────────────────────────────────────────────────────────────────────────────────────
  { name: 'tags.byRef', call: (o) => SL.tags.byRef(C, { refType: 'container', refId: 'k1', ...o }) },
  { name: 'tags.list', call: (o) => SL.tags.list(C, { productId: 'p1', variantId: 'v1', batchId: 'b1', refType: 'container', refId: 'k1', ...o }) },
  { name: 'tags.lookupTags', whole: true, call: () => SL.tags.lookupTags(C, { tagIds: ['NFC-001', 'NFC-002'], embed: 'product' }) },
  { name: 'tags.lookupTagsQuery', whole: true, call: () => SL.tags.lookupTagsQuery(C, { tagIds: 'NFC-001,NFC-002', embed: 'product' }) },
  { name: 'tags.publicByRef', call: (o) => SL.tags.publicByRef(C, { refType: 'container', refId: 'k1', embed: 'container', ...o }) },
  { name: 'tags.publicByRefPost', call: (o) => SL.tags.publicByRefPost(C, { refType: 'container', refId: 'k1', embed: 'container', ...o }) },
]
