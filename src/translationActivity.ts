// Translation activity: "this page is being translated for the first time".
//
// Every app's content translation goes through translations.lookup / resolve, so the SDK is the one
// place that knows a visitor is waiting on a fresh AI translation. When a request that may create
// translations ('cache-fill') is still unanswered after a short delay, the SDK announces it, and
// announces again when it settles. Answers already in the cache come back well inside the delay, so
// nothing shows for a page that is already translated.
//
//   inside a frame   → posts { _smartlinksIframeMessage, type: 'smartlinks:translating', payload } to the parent
//   in any window    → listeners from translations.onActivity() hear it directly
//
// A host (Portal, Hub) calls translations.onActivity(cb) once: it hears its own requests AND those
// of every app frame it embeds, combined into one state. Apps need do nothing.

export interface TranslationActivity {
  /** true while at least one fresh translation is under way (here or in an embedded app frame). */
  active: boolean
  /** The language being translated into (the most recent one when several are under way). */
  targetLanguage: string | null
  /** How many texts are waiting to be translated, across everything under way. */
  texts: number
}

export const TRANSLATING_MESSAGE = 'smartlinks:translating'

interface Source { count: number; texts: number; lang: string | null }
interface Shared {
  showAfterMs: number
  sources: Map<unknown, Source> // key: 'self' or the MessageEventSource of an app frame
  listeners: Set<(a: TranslationActivity) => void>
  messageListening: boolean
  onMessage: ((e: MessageEvent) => void) | null
  last: TranslationActivity
  lastLang: string | null
  self: Source
}

// One state per window, shared by every copy of the SDK loaded into it: an app drawn straight into
// the page usually bundles its own SDK, and the host's listener must still hear its requests.
const KEY = '__smartlinksTranslationActivity'
function fresh(): Shared {
  return {
    showAfterMs: 600,
    sources: new Map(),
    listeners: new Set(),
    messageListening: false,
    onMessage: null,
    last: { active: false, targetLanguage: null, texts: 0 },
    lastLang: null,
    self: { count: 0, texts: 0, lang: null },
  }
}
function shared(): Shared {
  const g = globalThis as any
  if (!g[KEY]) g[KEY] = fresh()
  return g[KEY] as Shared
}

function current(): TranslationActivity {
  let texts = 0
  let active = false
  for (const s of shared().sources.values()) {
    if (s.count > 0) { active = true; texts += s.texts }
  }
  return { active, targetLanguage: active ? shared().lastLang : null, texts }
}

function notify() {
  const st = shared()
  const next = current()
  const last = st.last
  if (next.active === last.active && next.texts === last.texts && next.targetLanguage === last.targetLanguage) return
  st.last = next
  for (const cb of st.listeners) {
    try { cb(next) } catch { /* a listener's fault is its own */ }
  }
}

function inIframe(): boolean {
  try { return typeof window !== 'undefined' && !!window.parent && window.parent !== window } catch { return false }
}

function postParent(payload: { active: boolean; targetLanguage: string | null; texts: number }) {
  if (!inIframe()) return
  try { window.parent.postMessage({ _smartlinksIframeMessage: true, type: TRANSLATING_MESSAGE, payload }, '*') } catch { /* ignore */ }
}

function setSource(key: unknown, s: Source) {
  const st = shared()
  if (s.count > 0) {
    st.sources.set(key, s)
    if (s.lang) st.lastLang = s.lang
  } else st.sources.delete(key)
  notify()
}

function publishSelf() {
  setSource('self', { ...shared().self })
  // An app frame that is itself a host passes its whole state up, so nesting still reaches the top.
  const all = current()
  postParent({ active: all.active, targetLanguage: all.targetLanguage, texts: all.texts })
}

/**
 * Mark a request that may create translations. Returns a function to call when it settles.
 * Nothing is announced unless the request is still running after the delay.
 * @internal used by translations.lookup
 */
export function trackTranslation(targetLanguage: string, texts: number): () => void {
  let shown = false
  let done = false
  const st = shared()
  const self = st.self
  const timer = setTimeout(() => {
    if (done) return
    shown = true
    self.count += 1
    self.texts += texts
    self.lang = targetLanguage
    publishSelf()
  }, st.showAfterMs)
  return () => {
    if (done) return
    done = true
    clearTimeout(timer)
    if (!shown) return
    self.count = Math.max(0, self.count - 1)
    self.texts = Math.max(0, self.texts - texts)
    publishSelf()
  }
}

function onMessage(event: MessageEvent) {
  const d = event?.data
  if (!d || typeof d !== 'object' || d.type !== TRANSLATING_MESSAGE) return
  const p = d.payload || {}
  const key = event.source || 'unknown-frame'
  setSource(key, { count: p.active ? 1 : 0, texts: Number(p.texts) || 0, lang: typeof p.targetLanguage === 'string' ? p.targetLanguage : null })
  // Pass it on when this window is itself inside a frame.
  const all = current()
  postParent({ active: all.active, targetLanguage: all.targetLanguage, texts: all.texts })
}

/**
 * Hear when content is being translated for the first time: requests made in this window and in
 * every app frame embedded in it. The callback gets the combined state now and on every change.
 * Returns an unsubscribe function.
 *
 * ```ts
 * translations.onActivity(({ active, targetLanguage }) => setBanner(active ? targetLanguage : null))
 * ```
 */
export function onActivity(cb: (activity: TranslationActivity) => void): () => void {
  const st = shared()
  st.listeners.add(cb)
  if (!st.messageListening && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    st.onMessage = onMessage
    window.addEventListener('message', onMessage)
    st.messageListening = true
  }
  try { cb(current()) } catch { /* ignore */ }
  return () => { st.listeners.delete(cb) }
}

/** The combined state right now. */
export function activity(): TranslationActivity {
  return current()
}

/** @internal tests only */
export function _resetActivity(options: { showAfterMs?: number } = {}) {
  const g = globalThis as any
  const old = g[KEY] as Shared | undefined
  if (old?.onMessage && typeof window !== 'undefined' && typeof window.removeEventListener === 'function') window.removeEventListener('message', old.onMessage)
  g[KEY] = fresh()
  if (options.showAfterMs !== undefined) (g[KEY] as Shared).showAfterMs = options.showAfterMs
}

// The notice itself, in the language being translated into (the visitor asked for it, so they may not
// read English). Hosts show it as is; a language not listed gets the English line.
const TRANSLATING_TEXT: Record<string, string> = {
  en: 'Translating this page. This only happens the first time.',
  de: 'Diese Seite wird übersetzt. Das passiert nur beim ersten Mal.',
  fr: 'Traduction de la page en cours. Cela n’arrive que la première fois.',
  es: 'Traduciendo esta página. Solo ocurre la primera vez.',
  it: 'Traduzione della pagina in corso. Succede solo la prima volta.',
  pt: 'Traduzindo esta página. Isso só acontece na primeira vez.',
  nl: 'Deze pagina wordt vertaald. Dit gebeurt alleen de eerste keer.',
  pl: 'Trwa tłumaczenie strony. Dzieje się to tylko za pierwszym razem.',
  sv: 'Sidan översätts. Det händer bara första gången.',
  da: 'Siden oversættes. Det sker kun første gang.',
  nb: 'Siden oversettes. Dette skjer bare første gang.',
  no: 'Siden oversettes. Dette skjer bare første gang.',
  fi: 'Sivua käännetään. Tämä tapahtuu vain ensimmäisellä kerralla.',
  tr: 'Sayfa çevriliyor. Bu yalnızca ilk seferde olur.',
  ru: 'Страница переводится. Это происходит только в первый раз.',
  uk: 'Сторінка перекладається. Це відбувається лише першого разу.',
  ar: 'جارٍ ترجمة هذه الصفحة. يحدث هذا في المرة الأولى فقط.',
  he: 'הדף מתורגם. זה קורה רק בפעם הראשונה.',
  ja: 'このページを翻訳しています。初回のみ少々お待ちください。',
  ko: '이 페이지를 번역하는 중입니다. 처음 한 번만 잠시 기다려 주세요.',
  'zh-Hans': '正在翻译此页面，仅首次需要稍候。',
  'zh-Hant': '正在翻譯此頁面，僅首次需要稍候。',
}

/**
 * The "translating this page" line in the language being translated into, with its text direction.
 * zh-CN / zh-SG → Simplified, zh-TW / zh-HK → Traditional; unknown languages get English.
 */
export function translatingMessage(language: string | null | undefined): { text: string; lang: string; dir: 'ltr' | 'rtl' } {
  const raw = String(language || 'en').trim()
  const lower = raw.toLowerCase()
  let key = TRANSLATING_TEXT[raw] ? raw : ''
  if (!key && lower.startsWith('zh')) key = /hant|tw|hk|mo/.test(lower) ? 'zh-Hant' : 'zh-Hans'
  if (!key) key = TRANSLATING_TEXT[lower.split('-')[0]] ? lower.split('-')[0] : 'en'
  return { text: TRANSLATING_TEXT[key], lang: key, dir: key === 'ar' || key === 'he' ? 'rtl' : 'ltr' }
}
