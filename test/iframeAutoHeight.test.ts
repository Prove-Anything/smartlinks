import { test } from 'node:test'
import assert from 'node:assert/strict'

// An app placed in a page (a booking form in a website): the iframe is exactly as tall as the app's
// content, so the page scrolls and the iframe never does — and the app reports its real height, so the
// frame shrinks when the page gets shorter.

const { IframeResponder } = require('../src/iframeResponder')
const { iframe: appSide } = require('../src/iframe')

function stubFrame(style: Record<string, string> = {}) {
  const attrs: Record<string, string> = {}
  return {
    style: {} as Record<string, string>,
    setAttribute: (k: string, v: string) => { attrs[k] = v },
    attrs,
    computed: { boxSizing: 'content-box', borderTopWidth: '0px', borderBottomWidth: '0px', paddingTop: '0px', paddingBottom: '0px', ...style },
  }
}

function withWindow(frame: any, listeners: string[] = []) {
  ;(globalThis as any).window = {
    location: { href: 'https://site.example/book' },
    addEventListener: (type: string) => listeners.push(type),
    removeEventListener() {},
    getComputedStyle: () => frame.computed,
  }
}

async function attached(options: Record<string, unknown>, frame: any, listeners: string[] = []) {
  const r = new IframeResponder({ collectionId: 'c1', appId: 'appointment-booking', appUrl: 'https://smartlinks.app/apps/appointment-booking/stable/', ...options })
  await r.ready
  withWindow(frame, listeners)
  await r.attach(frame)
  return r
}

const resize = (r: any, height: number) => r.handleStandardMessage({ type: 'smartlinks:resize', payload: { height } }, {} as any)

test('autoHeight: the iframe is as tall as the content plus its own border', async () => {
  const listeners: string[] = []
  const frame = stubFrame({ boxSizing: 'border-box', borderTopWidth: '1px', borderBottomWidth: '1px' })
  const r = await attached({ autoHeight: true }, frame, listeners)
  assert.equal(frame.attrs.scrolling, undefined, 'scrolling stays on: a fallback for an app that under-reports')
  assert.ok(!listeners.includes('resize'), 'no window-filling height for an app in a page')
  await resize(r, 1040)
  assert.equal(frame.style.height, '1042px', 'a 1px border would otherwise leave the page 2px short')
  await resize(r, 610.4)
  assert.equal(frame.style.height, '613px', 'and it shrinks when the page gets shorter')
  r.destroy()
})

test('autoHeight with a minimum; content-box frames get the content height as it is', async () => {
  const frame = stubFrame()
  const heights: number[] = []
  const r = await attached({ autoHeight: { minHeight: 600 }, onResize: (h: number) => heights.push(h) }, frame)
  await resize(r, 300)
  assert.equal(frame.style.height, '600px')
  await resize(r, 900)
  assert.equal(frame.style.height, '900px')
  assert.deepEqual(heights, [300, 900], 'onResize still hears the content height')
  r.destroy()
})

test('without autoHeight the host sizes the iframe itself (a full-screen host), as before', async () => {
  const listeners: string[] = []
  const frame = stubFrame()
  const heights: number[] = []
  const r = await attached({ onResize: (h: number) => heights.push(h) }, frame, listeners)
  assert.ok(listeners.includes('resize'))
  await resize(r, 700)
  assert.equal(frame.style.height, undefined)
  assert.deepEqual(heights, [700])
  r.destroy()
})

test("the app reports its content's height, not the frame's, so the frame can shrink", () => {
  const sent: any[] = []
  const doc = { scrollHeight: 900, clientHeight: 900, offsetHeight: 520 }
  const body = { offsetHeight: 500 }
  const parent = { postMessage: (m: any) => sent.push(m) }
  ;(globalThis as any).window = { parent, getComputedStyle: () => ({ marginTop: '8px', marginBottom: '8px' }) }
  ;(globalThis as any).document = { documentElement: doc, body }
  appSide.sendHeight()
  assert.equal(sent[0].payload.height, 520, 'the document fits: its own height, not the 900px frame')
  doc.scrollHeight = 1300 // the page now overflows the frame
  appSide.sendHeight()
  assert.equal(sent[1].payload.height, 1300)
  delete (globalThis as any).document
})
