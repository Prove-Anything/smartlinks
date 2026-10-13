import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { normaliseAdminCardPayload } from '../src/adminCardPayload'
import { createAdminCardViews, collectAdminCardTodo, adminCardAge } from '../src/adminCardsView'

// Admin cards: the payload trimmer matches the server's rules, the To do strip collects what cards
// report, and the renderer draws a payload into one consistent structure (with a minimal fake React).

describe('normaliseAdminCardPayload', () => {
  test('keeps what a card shows, drops the rest, caps lists, only safe links', () => {
    const p = normaliseAdminCardPayload({
      value: 3, label: 'waiting', extra: 'x',
      items: Array.from({ length: 9 }, (_, i) => ({ title: `q${i}`, path: '/q' })),
      actions: [{ label: 'a', path: '/a' }, { label: 'bad', url: 'javascript:alert(1)' }, { label: 'b', url: 'https://x.test' }, { label: 'c', path: '/c' }],
      status: { tone: 'shouting', text: 'nope' },
    })
    assert.equal((p as any).extra, undefined)
    assert.equal(p.items!.length, 5)
    assert.deepEqual(p.actions, [{ label: 'a', path: '/a' }, { label: 'b', url: 'https://x.test' }])
    assert.equal(p.status, undefined)
  })
  test('rejects anything but an object', () => {
    assert.throws(() => normaliseAdminCardPayload([1]))
    assert.throws(() => normaliseAdminCardPayload('3 questions'))
    assert.throws(() => normaliseAdminCardPayload(null))
  })
})

describe('collectAdminCardTodo', () => {
  test('todo items first-class; attention/error statuses without todo also count; errors first', () => {
    const cards = [
      { title: 'FAQ', size: 'small', state: 'fresh', computedAt: 1, payload: { todo: [{ text: 'Answer 2 questions', action: { label: 'Answer', path: '/q' } }] } },
      { title: 'Site', size: 'medium', state: 'fresh', computedAt: 1, payload: { status: { tone: 'error', text: 'Domain not working' }, actions: [{ label: 'Fix', path: '/domain' }] } },
      { title: 'Products', size: 'small', state: 'fresh', computedAt: 1, payload: { status: { tone: 'ok', text: 'All good' } } },
    ] as any
    const todo = collectAdminCardTodo(cards)
    assert.deepEqual(todo.map((t) => t.text), ['Site: Domain not working', 'Answer 2 questions'])
    assert.deepEqual(todo[0].action, { label: 'Fix', path: '/domain' })
  })
  test('age labels', () => {
    assert.equal(adminCardAge(1000, 1000 + 30_000), 'just now')
    assert.equal(adminCardAge(0, 1000), '')
    assert.equal(adminCardAge(1, 1 + 5 * 60_000), '5 min ago')
  })
})

describe('createAdminCardViews', () => {
  // A minimal React: createElement builds a tree; function components are called eagerly.
  const React = {
    Fragment: 'fragment',
    useEffect: () => {},
    createElement(type: any, props: any, ...children: any[]): any {
      if (typeof type === 'function') return type({ ...(props || {}), children })
      return { type, props: props || {}, children: children.flat().filter((c) => c != null && c !== false) }
    },
  }
  const text = (n: any): string => (n == null ? '' : typeof n === 'string' || typeof n === 'number' ? String(n) : (n.children || []).map(text).join(' '))
  const find = (n: any, cls: string): any[] => {
    if (!n || typeof n !== 'object') return []
    const own = String(n.props?.className || '').split(' ').includes(cls) ? [n] : []
    return own.concat(...(n.children || []).map((c: any) => find(c, cls)))
  }
  const { AdminCardView, AdminCardTodo } = createAdminCardViews(React)

  test('draws value, label, trend, status, items and actions; actions call back', () => {
    const clicked: any[] = []
    const card = {
      key: 'faq:open', title: 'FAQ', size: 'medium', state: 'fresh', computedAt: Date.now(),
      payload: {
        value: 1234, label: 'questions', trend: { direction: 'up', label: '+3', good: true },
        status: { tone: 'attention', text: 'Answer them' },
        items: [{ title: 'How big?', path: '/q/1' }, { title: 'Colour?' }, { title: 'Size?' }, { title: 'Hidden at medium' }],
        actions: [{ label: 'Open FAQ', path: '/' }],
      },
    } as any
    const tree = AdminCardView({ card, onAction: (a) => clicked.push(a), lang: 'en-GB' }) as any
    assert.equal(tree.type, 'article')
    assert.match(tree.props.className, /slc-size-medium/)
    assert.match(text(tree), /1,234/)
    assert.match(text(tree), /Answer them/)
    assert.equal(find(tree, 'slc-item').length, 3) // medium shows 3 rows
    find(tree, 'slc-btn')[0].props.onClick()
    find(tree, 'slc-link')[0].props.onClick()
    assert.deepEqual(clicked, [{ label: 'Open FAQ', path: '/' }, { label: 'How big?', path: '/q/1' }])
  })

  test('small cards drop the list; pending shows a skeleton; empty shows its message', () => {
    const small = AdminCardView({ card: { title: 'FAQ', size: 'small', state: 'fresh', computedAt: 1, payload: { value: 2, items: [{ title: 'x' }] } } as any }) as any
    assert.equal(find(small, 'slc-item').length, 0)
    const pending = AdminCardView({ card: { title: 'FAQ', size: 'small', state: 'pending', computedAt: null, payload: null } as any }) as any
    assert.ok(find(pending, 'slc-skel').length)
    const empty = AdminCardView({ card: { title: 'Products', size: 'small', state: 'fresh', computedAt: 1, payload: { value: 0, empty: { text: 'No products yet' } } } as any }) as any
    assert.match(text(empty), /No products yet/)
    assert.equal(find(empty, 'slc-value').length, 0)
  })

  test('the To do strip renders nothing when there is nothing to do', () => {
    assert.equal(AdminCardTodo({ cards: [] }), null)
  })
})
