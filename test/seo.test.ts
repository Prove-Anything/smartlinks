import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import * as seo from '../src/seo'
import * as site from '../src/site'

// A tiny DOM: enough of document.head for seo.head / seo.jsonLd.
function fakeDocument() {
  const nodes: any[] = []
  const el = (tag: string) => {
    const attrs: Record<string, string> = {}
    const node: any = {
      tag, attrs, textContent: '',
      setAttribute: (k: string, v: string) => { attrs[k] = v },
      getAttribute: (k: string) => (k in attrs ? attrs[k] : null),
      remove: () => { const i = nodes.indexOf(node); if (i >= 0) nodes.splice(i, 1) },
    }
    return node
  }
  // Selectors used: tag[attr="v"] and tag[attr="v"][attr2="v2"]
  const match = (sel: string, n: any) => {
    const m = sel.match(/^(\w+)((?:\[[^\]]+\])+)$/)
    if (!m || m[1] !== n.tag) return false
    return [...m[2].matchAll(/\[([\w:-]+)="([^"]*)"\]/g)].every(([, k, v]) => n.attrs[k] === v)
  }
  return {
    title: '',
    nodes,
    createElement: el,
    head: { appendChild: (n: any) => nodes.push(n), querySelector: (sel: string) => nodes.find((n) => match(sel, n)) || null },
  }
}

let d: any
beforeEach(() => { d = fakeDocument(); (globalThis as any).document = d })

const meta = (k: string) => d.nodes.find((n: any) => n.tag === 'meta' && (n.attrs.name === k || n.attrs.property === k))?.attrs.content

test('seo.head sets title, description, social tags and canonical; a later route removes what it no longer sets', () => {
  seo.head({ title: 'Roses — Bloom', description: 'Fresh roses', image: 'https://cdn/x.jpg', canonical: 'https://bloom.example/roses', type: 'product' })
  assert.equal(d.title, 'Roses — Bloom')
  assert.equal(meta('description'), 'Fresh roses')
  assert.equal(meta('og:image'), 'https://cdn/x.jpg')
  assert.equal(meta('og:type'), 'product')
  assert.equal(meta('twitter:card'), 'summary_large_image')
  assert.equal(d.nodes.find((n: any) => n.tag === 'link').attrs.href, 'https://bloom.example/roses')
  seo.head({ title: 'About — Bloom' })
  assert.equal(meta('description'), undefined)
  assert.equal(meta('og:image'), undefined)
  assert.equal(meta('twitter:card'), 'summary')
  assert.equal(d.nodes.find((n: any) => n.tag === 'link'), undefined)
  seo.head({ noindex: true })
  assert.equal(meta('robots'), 'noindex, nofollow')
})

test('seo.jsonLd places one block per id, replaces it, escapes <, and removes on null', () => {
  seo.jsonLd('faq', { a: '</script><b>' })
  seo.jsonLd('faq', { a: 'second' })
  const blocks = d.nodes.filter((n: any) => n.tag === 'script')
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].textContent, '{"a":"second"}')
  seo.jsonLd('x', { a: '<' })
  assert.ok(!d.nodes.find((n: any) => n.attrs['data-sl-seo'] === 'x').textContent.includes('<'))
  seo.jsonLd('faq', null)
  assert.equal(d.nodes.filter((n: any) => n.attrs['data-sl-seo'] === 'faq').length, 0)
})

test('no document (SSR): head and jsonLd are no-ops', () => {
  delete (globalThis as any).document
  assert.doesNotThrow(() => { seo.head({ title: 'x' }); seo.jsonLd('a', {}) })
})

test('schema builders: Product, FAQPage, Organization, LocalBusiness, BreadcrumbList, Article', () => {
  const p = seo.schema.product(
    { name: 'Roses', description: null, sku: 'R1', gtin: '0123', heroImage: { url: 'https://cdn/r.jpg' }, additionalImages: [] },
    { url: 'https://bloom.example/roses', brand: 'Bloom', offer: { price: 25, currency: 'GBP', availability: 'InStock' } },
  )
  assert.deepEqual(p, {
    '@context': 'https://schema.org', '@type': 'Product', name: 'Roses', image: 'https://cdn/r.jpg', sku: 'R1', gtin: '0123',
    url: 'https://bloom.example/roses', brand: { '@type': 'Brand', name: 'Bloom' },
    offers: { '@type': 'Offer', price: '25', priceCurrency: 'GBP', availability: 'https://schema.org/InStock', url: 'https://bloom.example/roses' },
  })
  const faq = seo.schema.faqPage([{ question: 'Do you deliver?', answer: 'Yes, daily.' }, { question: '', answer: 'dropped' }])
  assert.equal(faq.mainEntity.length, 1)
  assert.deepEqual(faq.mainEntity[0], { '@type': 'Question', name: 'Do you deliver?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, daily.' } })
  const org = seo.schema.organization({ title: 'Bloom', description: 'Florist', siteHost: 'bloom.smartlinks.host', logoImage: { url: 'https://cdn/l.png' } })
  assert.equal(org.url, 'https://bloom.smartlinks.host')
  assert.equal(org.logo, 'https://cdn/l.png')
  assert.equal(seo.schema.organization({ title: 'Bloom', hubCustomDomain: 'bloom.example' }).url, 'https://bloom.example')
  const lb = seo.schema.localBusiness({ title: 'Bloom' }, { type: 'Florist', address: { locality: 'Leeds', country: 'GB' } })
  assert.equal(lb['@type'], 'Florist')
  assert.deepEqual(lb.address, { '@type': 'PostalAddress', addressLocality: 'Leeds', addressCountry: 'GB' })
  assert.equal(seo.schema.breadcrumbs([{ name: 'Home', url: 'https://b/' }, { name: 'Roses', url: 'https://b/roses' }]).itemListElement[1].position, 2)
  assert.equal(seo.schema.article({ headline: 'Spring', datePublished: '2026-03-01' }).dateModified, '2026-03-01')
})

test('site.ready marks the page rendered', () => {
  delete (globalThis as any).__SL_READY__
  site.ready()
  assert.equal((globalThis as any).__SL_READY__, true)
})
