// Rows for test/listContract.test.ts (see listContract.table.ts for what a row is).
import * as SL from '../src/api'
import type { Row } from './listContract.table'

const C = 'c1'
const DAY = '2026-11-01T00:00:00Z'
const END = '2026-11-30T00:00:00Z'

const A = 'a1'
const RANGE = { gte: DAY, lte: END }
const TARGET = { productId: 'p1' }

// What each cases / threads / records list takes beside limit and cursor.
const CASES = { orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }], createdAt: RANGE, updatedAt: RANGE, closedAt: RANGE }
const THREADS = { orderBy: [{ lastReplyAt: 'desc' }], createdAt: RANGE, updatedAt: RANGE }
const RECORDS = { q: 'water', orderBy: [{ updatedAt: 'desc' }], createdAt: RANGE, updatedAt: RANGE, startsAt: RANGE, expiresAt: RANGE }
const BOOKINGS = { orderBy: [{ startsAt: 'desc' }], from: DAY, to: END }

export const ROWS_A: Row[] = [
  // ── appConfiguration.ts ────────────────────────────────────────────────────────────────────────
  // getData: one route per scope (collection, product, variant, batch, or no collection), public and admin.
  { name: 'appConfiguration.getData', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, ...o }) },
  { name: 'appConfiguration.getData (product)', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, productId: 'p1', ...o }) },
  { name: 'appConfiguration.getData (variant)', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, productId: 'p1', variantId: 'v1', ...o }) },
  { name: 'appConfiguration.getData (batch)', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, productId: 'p1', batchId: 'b1', ...o }) },
  { name: 'appConfiguration.getData (no collection)', call: (o) => SL.appConfiguration.getData({ appId: A, ...o }) },
  { name: 'appConfiguration.getData (admin)', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, admin: true, ...o }) },
  { name: 'appConfiguration.getData (admin, product)', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, productId: 'p1', admin: true, ...o }) },
  { name: 'appConfiguration.getData (admin, variant)', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, productId: 'p1', variantId: 'v1', admin: true, ...o }) },
  { name: 'appConfiguration.getData (admin, batch)', call: (o) => SL.appConfiguration.getData({ appId: A, collectionId: C, productId: 'p1', batchId: 'b1', admin: true, ...o }) },
  { name: 'appConfiguration.getWidgets', whole: true, call: () => SL.appConfiguration.getWidgets(C, { force: true }) },

  // ── appObjects.ts ──────────────────────────────────────────────────────────────────────────────
  { name: 'app.cases.list', call: (o) => SL.app.cases.list(C, A, o), opts: CASES },
  { name: 'app.cases.list (admin)', call: (o) => SL.app.cases.list(C, A, o, true), opts: CASES },
  { name: 'app.options.get', call: (o) => SL.app.options.get(C, A, 'type:machine', o), opts: { q: 'mix' } },
  { name: 'app.options.get (admin)', call: (o) => SL.app.options.get(C, A, 'type:machine', { ...o, admin: true }), opts: { q: 'mix' } },
  { name: 'app.records.list', call: (o) => SL.app.records.list(C, A, o), opts: RECORDS },
  { name: 'app.records.list (admin)', call: (o) => SL.app.records.list(C, A, o, true), opts: RECORDS },
  { name: 'app.records.match', call: (o) => SL.app.records.match(C, A, { target: TARGET, ...o }) },
  { name: 'app.records.match (admin)', call: (o) => SL.app.records.match(C, A, { target: TARGET, ...o }, true) },
  { name: 'app.records.resolveAll', call: (o) => SL.app.records.resolveAll(C, A, { context: TARGET, ...o }) },
  { name: 'app.records.resolveAll (admin)', call: (o) => SL.app.records.resolveAll(C, A, { context: TARGET, ...o }, true) },
  { name: 'app.threads.list', call: (o) => SL.app.threads.list(C, A, o), opts: THREADS },
  { name: 'app.threads.list (admin)', call: (o) => SL.app.threads.list(C, A, o, true), opts: THREADS },

  // ── asset.ts ───────────────────────────────────────────────────────────────────────────────────
  // asset.list: one route per scope.
  { name: 'asset.list', call: (o) => SL.asset.list({ scope: { type: 'collection', collectionId: C }, appId: A, ...o }) },
  { name: 'asset.list (product)', call: (o) => SL.asset.list({ scope: { type: 'product', collectionId: C, productId: 'p1' }, appId: A, ...o }) },
  { name: 'asset.list (proof)', call: (o) => SL.asset.list({ scope: { type: 'proof', collectionId: C, productId: 'p1', proofId: 'pr1' }, appId: A, ...o }) },
  { name: 'asset.listAdmin', call: (o) => SL.asset.listAdmin({ collectionId: C, assetType: 'Image', include: ['temporary', 'derived'], ...o }), opts: { orderBy: [{ name: 'asc' }] } },
  { name: 'asset.listForCollection', call: (o) => SL.asset.listForCollection(C, o) },
  { name: 'asset.listForProduct', call: (o) => SL.asset.listForProduct(C, 'p1', o) },
  { name: 'asset.listForProof', call: (o) => SL.asset.listForProof(C, 'p1', 'pr1', A, o) },

  // ── attestation.ts ─────────────────────────────────────────────────────────────────────────────
  { name: 'attestation.list', call: (o) => SL.attestation.list(C, 'p1', 'pr1', o) },

  // ── attestations.ts ────────────────────────────────────────────────────────────────────────────
  { name: 'attestations.list', call: (o) => SL.attestations.list(C, { subjectType: 'container', subjectId: 'k1', ...o }), opts: { recordedAt: RANGE } },
  { name: 'attestations.publicContainerList', call: (o) => SL.attestations.publicContainerList(C, 'k1', o), opts: { recordedAt: RANGE } },
  { name: 'attestations.publicList', call: (o) => SL.attestations.publicList(C, { subjectType: 'proof', subjectId: 'pr1', ...o }), opts: { recordedAt: RANGE } },

  // ── batch.ts ───────────────────────────────────────────────────────────────────────────────────
  { name: 'batch.getBatchTags', call: (o) => SL.batch.getBatchTags(C, 'b1', '000001', o) },
  { name: 'batch.list', call: (o) => SL.batch.list(C, 'p1', o) },
  { name: 'batch.searchInCollection', call: (o) => SL.batch.searchInCollection(C, { productId: 'p1', ...o }), opts: { q: 'B-2026' } },

  // ── bookings.ts ────────────────────────────────────────────────────────────────────────────────
  { name: 'bookings.blocks.list', call: (o) => SL.bookings.blocks.list(C, A, { resourceType: 'record', resourceId: 'staff-1', ...o }), opts: { from: DAY, to: END } },
  { name: 'bookings.list', call: (o) => SL.bookings.list(C, A, o), opts: BOOKINGS },
  { name: 'bookings.mine', call: (o) => SL.bookings.mine(C, A, o), opts: BOOKINGS },
  { name: 'bookings.slots.list', call: (o) => SL.bookings.slots.list(C, A, { available: true, ...o }), opts: BOOKINGS },
  { name: 'bookings.slots.list (admin)', call: (o) => SL.bookings.slots.list(C, A, { available: true, ...o }, true), opts: BOOKINGS },

  // ── config.ts ──────────────────────────────────────────────────────────────────────────────────
  { name: 'config.getFields', whole: true, call: () => SL.config.getFields() },
  { name: 'config.getProofTypes', whole: true, call: () => SL.config.getProofTypes() },

  // ── form.ts ────────────────────────────────────────────────────────────────────────────────────
  { name: 'form.list', call: (o) => SL.form.list(C, false, o) },
  { name: 'form.list (admin)', call: (o) => SL.form.list(C, true, o) },

  // ── template.ts ────────────────────────────────────────────────────────────────────────────────
  { name: 'template.getAll', call: (o) => SL.template.getAll(C, o) },
  { name: 'template.getAllowed', call: (o) => SL.template.getAllowed(C, o) },
  { name: 'template.getAllowedGlobal', call: (o) => SL.template.getAllowedGlobal(C, o) },

  // ── variant.ts ─────────────────────────────────────────────────────────────────────────────────
  { name: 'variant.list', call: (o) => SL.variant.list(C, 'p1', o) },
]
