// src/adminCardPayload.ts
/**
 * Trim a card function's return value to what a card shows — the same rules SmartLinks applies
 * before caching it (prove services/adminCards normalisePayload), so a preview shows exactly what the
 * dashboard will. Unknown fields are dropped, text is shortened, lists are capped, and only `/paths`
 * and `https:` links survive. Throws when the input isn't an object or the result is over 8KB.
 */
import type { AdminCardAction, AdminCardPayload } from './types/adminCards'

export const ADMIN_CARD_MAX_BYTES = 8 * 1024

const TONES = ['ok', 'attention', 'neutral', 'error']
const DIRECTIONS = ['up', 'down', 'flat']
const str = (v: unknown, max: number) => String(v).slice(0, max)

function action(a: any): AdminCardAction | undefined {
  if (!a || typeof a !== 'object' || !a.label) return undefined
  const out: AdminCardAction = { label: str(a.label, 40) }
  if (typeof a.path === 'string' && a.path.startsWith('/')) out.path = a.path.slice(0, 300)
  else if (typeof a.url === 'string' && /^https:\/\//i.test(a.url)) out.url = a.url.slice(0, 500)
  else return undefined
  return out
}

function byteLength(text: string): number {
  return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length
}

export function normaliseAdminCardPayload(raw: unknown): AdminCardPayload {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('The card function must return an object (an AdminCardPayload).')
  const r = raw as any
  const p: AdminCardPayload = {}
  if (r.title != null) p.title = str(r.title, 80)
  if (typeof r.value === 'number' && Number.isFinite(r.value)) p.value = r.value
  else if (r.value != null) p.value = str(r.value, 40)
  if (r.label != null) p.label = str(r.label, 80)
  if (r.unit != null) p.unit = str(r.unit, 12)
  if (r.trend && DIRECTIONS.includes(r.trend.direction)) {
    p.trend = { direction: r.trend.direction, ...(r.trend.label != null ? { label: str(r.trend.label, 60) } : {}), ...(typeof r.trend.good === 'boolean' ? { good: r.trend.good } : {}) }
  }
  if (r.status && TONES.includes(r.status.tone) && r.status.text) p.status = { tone: r.status.tone, text: str(r.status.text, 140) }
  if (r.progress && Number.isFinite(r.progress.done) && Number.isFinite(r.progress.total) && r.progress.total > 0) {
    p.progress = { done: r.progress.done, total: r.progress.total, ...(r.progress.label != null ? { label: str(r.progress.label, 60) } : {}) }
  }
  if (Array.isArray(r.items)) {
    p.items = r.items.filter((i: any) => i && i.title != null).slice(0, 5).map((i: any) => ({
      title: str(i.title, 120),
      ...(i.subtitle != null ? { subtitle: str(i.subtitle, 120) } : {}),
      ...(i.meta != null ? { meta: str(i.meta, 60) } : {}),
      ...(typeof i.path === 'string' && i.path.startsWith('/') ? { path: i.path.slice(0, 300) } : {}),
    }))
  }
  if (Array.isArray(r.todo)) {
    p.todo = r.todo.filter((t: any) => t && t.text).slice(0, 5).map((t: any) => {
      const a = action(t.action)
      return { text: str(t.text, 140), ...(a ? { action: a } : {}) }
    })
  }
  if (Array.isArray(r.actions)) p.actions = r.actions.map(action).filter(Boolean).slice(0, 2) as AdminCardAction[]
  if (r.empty && r.empty.text) {
    const a = action(r.empty.action)
    p.empty = { text: str(r.empty.text, 140), ...(a ? { action: a } : {}) }
  }
  if (byteLength(JSON.stringify(p)) > ADMIN_CARD_MAX_BYTES) throw new Error(`The card's payload is over ${ADMIN_CARD_MAX_BYTES / 1024}KB — return fewer or shorter items.`)
  return p
}
