import { test } from 'node:test'
import assert from 'node:assert/strict'

// Admin views (docs/admin-views.md): an app's admin screens by name, the menu built from them, and the
// host's navigate request resolved against them.

const av = require('../src/adminViews')

const VIEWS = [
  { id: 'campaigns', title: 'Campaigns', path: '/campaigns', icon: 'megaphone', params: { status: 'draft | scheduled | sent' } },
  { id: 'campaign.new', title: 'New campaign', path: '/campaigns/new', group: 'record', within: 'campaigns' },
  { id: 'campaign', title: 'Campaign', path: '/campaigns/{campaignId}', group: 'record', within: 'campaigns', params: { campaignId: "a campaign's id" } },
  { id: 'campaign.results', title: 'Results', path: '/campaigns/{campaignId}/results', group: 'record', within: 'campaign' },
  { id: 'log', title: 'Message log', path: '/log' },
  { id: 'settings', title: 'Settings', path: '/settings', group: 'settings' },
]

test('pathFor fills placeholders and sends the other params as a query', () => {
  assert.equal(av.pathFor(VIEWS[2], { campaignId: 'c 1', tab: 'results' }), '/campaigns/c%201?tab=results')
  assert.equal(av.pathFor(VIEWS[0]), '/campaigns')
  assert.equal(av.pathFor(VIEWS[2], {}), null, 'a missing required param gives no path')
  assert.equal(av.pathFor(VIEWS[2], { campaignId: '' }), null)
})

test('match finds the view and its params; fixed segments beat placeholders', () => {
  const m = av.match(VIEWS, '/campaigns/c%201?status=sent')
  assert.equal(m.view.id, 'campaign')
  assert.deepEqual(m.params, { campaignId: 'c 1', status: 'sent' })
  assert.equal(av.match(VIEWS, '/campaigns/new').view.id, 'campaign.new')
  assert.equal(av.match(VIEWS, '/campaigns/').view.id, 'campaigns', 'a trailing slash is the same screen')
  assert.equal(av.match(VIEWS, '/nowhere'), null)
})

test('menu: areas in order, Settings apart, record views left out', () => {
  const m = av.menu(VIEWS)
  assert.deepEqual(m.main.map((v: any) => v.id), ['campaigns', 'log'])
  assert.deepEqual(m.settings.map((v: any) => v.id), ['settings'])
})

test('trail and recordMenu: a record swaps the menu, headed back to its area', () => {
  assert.deepEqual(av.trail(VIEWS, 'campaign.results').map((v: any) => v.id), ['campaigns', 'campaign', 'campaign.results'])
  const r = av.recordMenu(VIEWS, 'campaign.results')
  assert.equal(r.back.id, 'campaigns')
  assert.equal(r.record.id, 'campaign')
  assert.deepEqual(r.items.map((v: any) => v.id), ['campaign', 'campaign.results'])
  assert.equal(av.recordMenu(VIEWS, 'log'), null)
})

test('resolve: a named view becomes its path; unknown views and bad paths are refused', () => {
  assert.deepEqual(av.resolve(VIEWS, { view: 'campaign', params: { campaignId: 'c1' }, highlight: 'row-3' }).path, '/campaigns/c1')
  assert.equal(av.resolve(VIEWS, { view: 'nope' }), null)
  assert.equal(av.resolve(VIEWS, { view: 'campaign' }), null, 'missing param')
  assert.equal(av.resolve(VIEWS, { path: 'https://evil.example/' }), null)
  assert.equal(av.resolve(VIEWS, { path: '//evil.example' }), null)
  const t = av.resolve(VIEWS, { path: '/campaigns', params: { status: 'sent' } })
  assert.equal(t.path, '/campaigns?status=sent')
  assert.equal(t.view.id, 'campaigns')
  assert.equal(av.resolve([], { path: '/anything' }).path, '/anything', 'an app without views can still be sent a path')
})

test('onNavigate takes messages only from the parent, says it is navigable, and reports results', () => {
  const posted: any[] = []
  const listeners: Array<(e: any) => void> = []
  const parent = { postMessage: (m: any) => posted.push(m) }
  const prevWindow = (globalThis as any).window
  ;(globalThis as any).window = {
    parent,
    addEventListener: (_: string, fn: any) => listeners.push(fn),
    removeEventListener: () => {},
  }
  try {
    const seen: any[] = []
    const stop = av.onNavigate(VIEWS, (to: any) => seen.push(to))
    assert.equal(posted[0].type, 'smartlinks:navigable')
    assert.deepEqual(posted[0].payload.views, VIEWS.map((v) => v.id))

    listeners[0]({ source: {}, data: { type: 'smartlinks:navigate', view: 'log' } })
    assert.equal(seen.length, 0, 'not from the parent: ignored')

    listeners[0]({ source: parent, data: { type: 'smartlinks:navigate', view: 'campaign', params: { campaignId: 'c1' } } })
    assert.equal(seen[0].path, '/campaigns/c1')
    assert.equal(posted[1].type, 'smartlinks:navigate-result')
    assert.equal(posted[1].payload.ok, true)

    listeners[0]({ source: parent, data: { type: 'smartlinks:navigate', view: 'missing' } })
    assert.equal(posted[2].payload.ok, false)
    assert.equal(seen.length, 1)
    stop()
  } finally {
    ;(globalThis as any).window = prevWindow
  }
})
