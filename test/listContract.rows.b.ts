// Rows for test/listContract.test.ts (see listContract.table.ts for what a row is).
import * as SL from '../src/api'
import type { Row } from './listContract.table'

const C = 'c1'
const DAY = '2026-11-01T00:00:00Z'
const END = '2026-11-30T00:00:00Z'

export const ROWS_B: Row[] = [
  // ── analytics.ts ───────────────────────────────────────────────────────────────────────────────
  { name: 'analytics.admin.events', call: (o) => SL.analytics.admin.events(C, { source: 'events', ...o }), opts: { orderBy: [{ timestamp: 'asc' }], from: DAY, to: END } },

  // ── appConfiguration.ts (userAppData) ──────────────────────────────────────────────────────────
  { name: 'userAppData.list', call: (o) => SL.userAppData.list('app1', o) },

  // ── authKit.ts ─────────────────────────────────────────────────────────────────────────────────
  { name: 'authKit.list', call: (o) => SL.authKit.list(C, o) },
  { name: 'authKit.listTrustedDevices', call: (o) => SL.authKit.listTrustedDevices('client1', o) },

  // ── broadcasts.ts ──────────────────────────────────────────────────────────────────────────────
  { name: 'broadcasts.list', call: (o) => SL.broadcasts.list(C, { appId: 'app1', ...o }) },
  { name: 'broadcasts.recipients', call: (o) => SL.broadcasts.recipients(C, 'b1', o) },

  // ── collection.ts ──────────────────────────────────────────────────────────────────────────────
  { name: 'collection.getUsers', call: (o) => SL.collection.getUsers(C, o) },
  { name: 'collection.list', call: (o) => SL.collection.list(o) },

  // ── comms.ts ───────────────────────────────────────────────────────────────────────────────────
  { name: 'comms.listMethods', whole: true, call: () => SL.comms.listMethods(C, { type: 'email' }) },
  { name: 'comms.queryByUser', call: (o) => SL.comms.queryByUser(C, { contactId: 'ct1', ...o }), opts: { from: DAY, to: END } },
  { name: 'comms.queryRecipientIds', call: (o) => SL.comms.queryRecipientIds(C, { broadcastId: 'b1', ...o }), opts: { from: DAY, to: END } },

  // ── conditions.ts ──────────────────────────────────────────────────────────────────────────────
  { name: 'conditions.list', call: (o) => SL.conditions.list(C, false, o) },
  { name: 'conditions.list (admin)', call: (o) => SL.conditions.list(C, true, o) },

  // ── contact.ts ─────────────────────────────────────────────────────────────────────────────────
  { name: 'contact.findDuplicates', call: (o) => SL.contact.findDuplicates(C, o) },
  { name: 'contact.list', call: (o) => SL.contact.list(C, { includeDeleted: true, ...o }) },
  { name: 'contact.search', call: (o) => SL.contact.search({ collectionId: C, tags: 'vip, trade', ...o }), opts: { q: 'jo', createdAt: { gte: DAY, lte: END } } },

  // ── interactions.ts ────────────────────────────────────────────────────────────────────────────
  { name: 'interactions.list', call: (o) => SL.interactions.list(C, { appId: 'app1', ...o }) },
  { name: 'interactions.publicList', call: (o) => SL.interactions.publicList(C, { appId: 'app1', ...o }) },
  { name: 'interactions.publicMyInteractions', call: (o) => SL.interactions.publicMyInteractions(C, { appId: 'app1', ...o }), opts: { from: DAY, to: END } },
  { name: 'interactions.query', call: (o) => SL.interactions.query(C, { appId: 'app1', ...o }), opts: { orderBy: [{ timestamp: 'desc' }], from: DAY, to: END, expand: ['interaction'] } },

  // ── journeys.ts ────────────────────────────────────────────────────────────────────────────────
  { name: 'journeys.list', call: (o) => SL.journeys.list(C, { active: true, ...o }) },

  // ── journeysAnalytics.ts ───────────────────────────────────────────────────────────────────────
  { name: 'journeysAnalytics.recipients', call: (o) => SL.journeysAnalytics.recipients(C, 'j1', 's1', { status: 'entered', ...o }), opts: { from: DAY, to: END } },

  // ── loyalty.ts ─────────────────────────────────────────────────────────────────────────────────
  { name: 'loyalty.getMemberHistory', call: (o) => SL.loyalty.getMemberHistory(C, 'sch1', 'ct1', o) },
  { name: 'loyalty.list', call: (o) => SL.loyalty.list(C, { includeDeleted: true, ...o }) },
  { name: 'loyalty.listEarningRules', call: (o) => SL.loyalty.listEarningRules(C, 'sch1', o) },
  { name: 'loyalty.listMembers', call: (o) => SL.loyalty.listMembers(C, 'sch1', o) },
  { name: 'loyalty.publicGetMe', call: (o) => SL.loyalty.publicGetMe(C, o) },
  { name: 'loyalty.publicGetMineHistory', call: (o) => SL.loyalty.publicGetMineHistory(C, 'sch1', o) },
  { name: 'loyalty.publicList', call: (o) => SL.loyalty.publicList(C, o) },
  { name: 'loyalty.publicListEarningRules', call: (o) => SL.loyalty.publicListEarningRules(C, 'sch1', o) },

  // ── order.ts ───────────────────────────────────────────────────────────────────────────────────
  { name: 'order.getItems', call: (o) => SL.order.getItems(C, 'o1', o) },
  { name: 'order.getLocationHistory', call: (o) => SL.order.getLocationHistory(C, 'o1', o) },
  { name: 'order.getTimeline', call: (o) => SL.order.getTimeline(C, 'o1', { isAdmin: true, ...o }), opts: { from: DAY, to: END } },
  { name: 'order.list', call: (o) => SL.order.list(C, { status: 'pending', direction: 'purchase', ...o }), opts: { expand: ['items'] } },
  {
    name: 'order.query',
    call: (o) => SL.order.query(C, { query: { status: 'pending' }, ...o }),
    opts: { orderBy: [{ status: 'asc' }, { createdAt: 'desc' }], createdAt: { gte: DAY, lte: END }, updatedAt: { gte: DAY, lte: END }, expand: ['items'] },
  },

  // ── segments.ts ────────────────────────────────────────────────────────────────────────────────
  { name: 'segments.list', call: (o) => SL.segments.list(C, { filterType: 'dynamic', ...o }) },
  { name: 'segments.recipients', call: (o) => SL.segments.recipients(C, 'seg1', o) },

  // ── shop.ts ────────────────────────────────────────────────────────────────────────────────────
  { name: 'shop.admin.listOrders', call: (o) => SL.shop.admin.listOrders(C, { status: 'paid', ...o }) },
  { name: 'shop.admin.listPrices', call: (o) => SL.shop.admin.listPrices(C, { productId: 'p1', active: true, ...o }) },
  { name: 'shop.myOrders', call: (o) => SL.shop.myOrders(C, o) },
  { name: 'shop.products', call: (o) => SL.shop.products(C, { productIds: ['p1', 'p2'], ...o }) },

  // ── subscriptions.ts ───────────────────────────────────────────────────────────────────────────
  { name: 'subscriptions.admin.list', call: (o) => SL.subscriptions.admin.list(C, { live: true, ...o }) },
  { name: 'subscriptions.admin.listPlans', call: (o) => SL.subscriptions.admin.listPlans(C, { active: true, ...o }) },
  { name: 'subscriptions.mine', call: (o) => SL.subscriptions.mine(C, o) },
  { name: 'subscriptions.plans', call: (o) => SL.subscriptions.plans(C, o) },

  // ── translations.ts ────────────────────────────────────────────────────────────────────────────
  { name: 'translations.list', call: (o) => SL.translations.list(C, { targetLanguage: 'de', ...o }), opts: { q: 'welcome' } },

  // ── userGroups.ts ──────────────────────────────────────────────────────────────────────────────
  { name: 'userGroups.history', call: (o) => SL.userGroups.history(C, { userId: 'u1', ...o }), opts: { from: DAY, to: END } },
  { name: 'userGroups.history (one group)', call: (o) => SL.userGroups.history(C, { userGroupId: 'g1', ...o }), opts: { from: DAY, to: END } },
  { name: 'userGroups.list', call: (o) => SL.userGroups.list(C, o) },
  { name: 'userGroups.members', call: (o) => SL.userGroups.members(C, 'g1', o) },
  { name: 'userGroups.ofUser', call: (o) => SL.userGroups.ofUser(C, 'u1', o) },

  // ── wallet.ts ──────────────────────────────────────────────────────────────────────────────────
  { name: 'wallet.list', call: (o) => SL.wallet.list(C, { refType: 'event', refId: 'e1', includeVoided: true, ...o }) },
  { name: 'wallet.mine', call: (o) => SL.wallet.mine(C, o) },
]
