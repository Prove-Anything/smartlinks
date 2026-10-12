import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { initializeApi, configureSdkCache } from '../src/http'
import * as realtime from '../src/api/realtime'

// SmartLinks Realtime client: one shared stream per collection+app, messages mapped back to logical
// channel names, change events filtered (and never heard twice by an admin), publish via our API.

class FakeEventSource {
  static CLOSED = 2
  static last: FakeEventSource | null = null
  readyState = 1
  listeners: Record<string, ((e: any) => void)[]> = {}
  closed = false
  constructor(public url: string) { FakeEventSource.last = this }
  addEventListener(type: string, fn: (e: any) => void) { (this.listeners[type] ||= []).push(fn) }
  emit(channel: string, name: string, data: unknown) {
    const env = { channel, name, data: JSON.stringify(data), encoding: 'json', timestamp: 1 }
    for (const fn of this.listeners.message || []) fn({ data: JSON.stringify(env), lastEventId: 'e1' })
  }
  close() { this.closed = true; this.readyState = 2 }
}

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms))

describe('realtime', () => {
  const realFetch = globalThis.fetch
  let connects: any[]
  let publishes: any[]
  let grant: (body: any) => { name: string; channel: string }[]

  beforeEach(() => {
    connects = []
    publishes = []
    grant = (body) => [
      ...(body.feeds || []).filter((f: string) => f !== 'admin').map((f: string) => ({ name: `feed:${f}`, channel: `sl:c1:${f}` })),
      ...(body.channels || []).map((n: string) => ({ name: n, channel: `sl:c1:app:raffle:${n}` })),
    ]
    initializeApi({ baseURL: 'https://api.test/api/v1', apiKey: 'k' })
    configureSdkCache({ enabled: false })
    ;(globalThis as any).EventSource = FakeEventSource
    ;(globalThis as any).fetch = async (url: string, init: any = {}) => {
      const body = init.body ? JSON.parse(init.body) : {}
      if (String(url).endsWith('/public/realtime/connect')) {
        connects.push(body)
        const channels = grant(body)
        return new Response(JSON.stringify({ transport: 'sse', url: 'https://stream.test/sse?x=1', expiresAt: Date.now() + 3600_000, channels }), { status: 200, headers: { 'content-type': 'application/json' } })
      }
      if (String(url).endsWith('/public/realtime/publish')) {
        publishes.push(body)
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
      }
      return new Response('{}', { status: 404 })
    }
  })
  afterEach(() => { globalThis.fetch = realFetch; delete (globalThis as any).EventSource })

  test('channel: one connection for several listeners; messages arrive by logical name and event', async () => {
    const scope = { collectionId: 'c1', appId: 'raffle' }
    const got: any[] = []
    const off1 = realtime.channel(scope, 'draw').subscribe('status', (m) => got.push(['a', m.data]))
    const off2 = realtime.channel(scope, 'draw').subscribe('*', (m) => got.push(['b', m.event]))
    await wait()
    assert.equal(connects.length, 1)
    assert.deepEqual(connects[0].channels, ['draw'])
    FakeEventSource.last!.emit('sl:c1:app:raffle:draw', 'status', { n: 7 })
    FakeEventSource.last!.emit('sl:c1:app:raffle:draw', 'other', {})
    assert.deepEqual(got, [['a', { n: 7 }], ['b', 'status'], ['b', 'other']])
    const es = FakeEventSource.last!
    off1(); off2()
    assert.equal(es.closed, true) // last listener gone → stream closed
  })

  test('publish goes through the SmartLinks API, never straight to the provider', async () => {
    await realtime.channel({ collectionId: 'c1', appId: 'raffle' }, 'draw').publish('status', { n: 1 })
    assert.deepEqual(publishes, [{ collectionId: 'c1', appId: 'raffle', channel: 'draw', event: 'status', data: { n: 1 } }])
  })

  test('onChange: filters, and a non-admin hears public changes', async () => {
    const got: any[] = []
    const off = realtime.onChange({ collectionId: 'c1' }, { type: 'record', recordType: 'entry' }, (c) => got.push(c.id))
    await wait()
    assert.deepEqual(connects[connects.length - 1].feeds.sort(), ['admin', 'public'])
    FakeEventSource.last!.emit('sl:c1:public', 'change', { type: 'record', recordType: 'entry', id: 'r1', at: 1 })
    FakeEventSource.last!.emit('sl:c1:public', 'change', { type: 'record', recordType: 'other', id: 'r2', at: 1 })
    FakeEventSource.last!.emit('sl:c1:public', 'change', { type: 'product', id: 'p1', at: 1 })
    assert.deepEqual(got, ['r1'])
    off()
  })

  test('onChange: an admin gets both feeds but hears each change once (from the admin feed)', async () => {
    grant = (body) => (body.feeds || []).map((f: string) => ({ name: `feed:${f}`, channel: `sl:c1:${f}` }))
    const got: any[] = []
    const off = realtime.onChange({ collectionId: 'c1' }, { type: 'product' }, (c) => got.push(c.id))
    await wait()
    FakeEventSource.last!.emit('sl:c1:admin', 'change', { type: 'product', id: 'p1', at: 1 })
    FakeEventSource.last!.emit('sl:c1:public', 'change', { type: 'product', id: 'p1', at: 1 })
    assert.deepEqual(got, ['p1'])
    off()
  })
})
