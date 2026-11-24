// Rows for test/listContract.test.ts (see listContract.table.ts for what a row is).
import * as SL from '../src/api'
import type { Row } from './listContract.table'

const C = 'c1'
const DAY = '2026-11-01T00:00:00Z'
const END = '2026-11-30T00:00:00Z'

export const ROWS_C: Row[] = [
  // ── adminCards.ts ──────────────────────────────────────────────────────────────────────────────
  { name: 'adminCards.list', whole: true, call: () => SL.adminCards.list(C) },

  // ── ai.ts ──────────────────────────────────────────────────────────────────────────────────────
  { name: 'ai.agent.listTools', whole: true, call: () => SL.ai.agent.listTools(C, { allowCapabilities: 'read', only: 'knowledge.search' }) },
  { name: 'ai.skills.list', whole: true, call: () => SL.ai.skills.list(C) },

  // ── dpp.ts ─────────────────────────────────────────────────────────────────────────────────────
  { name: 'dpp.groups', whole: true, call: () => SL.dpp.groups(C) },
  { name: 'dpp.passports.list', call: (o) => SL.dpp.passports.list(C, { productId: 'p1', status: 'active', ...o }) },
  { name: 'dpp.passports.versions', call: (o) => SL.dpp.passports.versions(C, 'x1', o) },
  { name: 'dpp.registry.list', whole: true, call: () => SL.dpp.registry.list(C) },
  { name: 'dpp.tasks.list', call: (o) => SL.dpp.tasks.list(C, 'acc', o) },

  // ── files.ts ───────────────────────────────────────────────────────────────────────────────────
  { name: 'files.list', call: (o) => SL.files.list(C, { origin: 'fetched', appId: 'a1', ...o }) },

  // ── integrations.ts ────────────────────────────────────────────────────────────────────────────
  { name: 'integrations.listConnectorActions', whole: true, call: () => SL.integrations.listConnectorActions(C, 'a1') },
  { name: 'integrations.listConnectors', whole: true, call: () => SL.integrations.listConnectors(C) },
  { name: 'integrations.listEntityRuns', call: (o) => SL.integrations.listEntityRuns(C, 'p1', o) },
  { name: 'integrations.listFailed', call: (o) => SL.integrations.listFailed(C, 'f1', { status: 'dead', ...o }) },
  { name: 'integrations.listFlows', call: (o) => SL.integrations.listFlows(C, { direction: 'outbound', status: 'active', ...o }) },
  { name: 'integrations.listRecordTypes', whole: true, call: () => SL.integrations.listRecordTypes(C) },
  { name: 'integrations.listRunItems', call: (o) => SL.integrations.listRunItems(C, 'f1', 'r1', { status: 'failed', ...o }) },
  { name: 'integrations.listRuns', call: (o) => SL.integrations.listRuns(C, 'f1', { status: 'failed', trigger: 'manual', entityId: 'p1', ...o }) },

  // ── knowledge.ts ───────────────────────────────────────────────────────────────────────────────
  { name: 'knowledge.listSets', call: (o) => SL.knowledge.listSets(C, o) },
  { name: 'knowledge.listSources', call: (o) => SL.knowledge.listSources(C, 'manuals', o) },
  { name: 'knowledge.publicSearch', call: (o) => SL.knowledge.publicSearch(C, { filters: { productId: 'p1' }, ...o }), opts: { q: 'descale' } },
  { name: 'knowledge.search', call: (o) => SL.knowledge.search(C, { sets: ['manuals'], ...o }), opts: { q: 'descale' } },

  // ── location.ts ────────────────────────────────────────────────────────────────────────────────
  { name: 'location.search', call: (o) => SL.location.search(C, { countryCode: 'GB', ...o }), opts: { q: 'islay', orderBy: [{ countryName: 'desc' }] } },

  // ── partner.ts ─────────────────────────────────────────────────────────────────────────────────
  { name: 'partner.claimSets', call: (o) => SL.partner.claimSets('p1', o) },
  { name: 'partner.list', call: (o) => SL.partner.list(o) },
  { name: 'partner.lookupTags', whole: true, call: () => SL.partner.lookupTags('p1', { uid: '04A1B2C3D4E5F6' }) },
  { name: 'partner.tagAttempts', call: (o) => SL.partner.tagAttempts('p1', '04A1B2C3D4E5F6', o) },

  // ── secrets.ts ─────────────────────────────────────────────────────────────────────────────────
  { name: 'secrets.list', whole: true, call: () => SL.secrets.list(C, { purpose: 'integration' }) },
  { name: 'secrets.listOwn', whole: true, call: () => SL.secrets.listOwn(C, { appId: 'a1' }) },

  // ── serviceAccounts.ts ─────────────────────────────────────────────────────────────────────────
  { name: 'serviceAccounts.list', call: (o) => SL.serviceAccounts.list(C, o) },
]
