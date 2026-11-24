import { isProxyEnabled, patch, post, put, request } from '../http'
import {
  clearCachedTranslations,
  deriveTranslationContextKey,
  getCachedTranslations,
  getDefaultTranslationCacheTtlMs,
  hashTranslationText,
  normalizeTranslationText,
  setCachedTranslations,
} from '../translationCache'
import { trackTranslation, onActivity as onTranslationActivity, activity as translationActivity, translatingMessage as translatingLine } from '../translationActivity'
import type { TranslationActivity } from '../translationActivity'
import type {
  ResolvedTranslationItem,
  ResolvedTranslationResponse,
  TranslationHashOptions,
  TranslationListParams,
  TranslationLookupRequest,
  TranslationLookupResponse,
  TranslationRecord,
  TranslationResolveOptions,
  TranslationRules,
  TranslationUpdateRequest,
} from '../types/translations'
import type { ListResult } from '../types/list'
import { listQuery } from '../list'

interface NormalizedLookupRequest {
  targetLanguage: string
  sourceLanguage: string
  mode: 'cache-fill' | 'cache-only'
  contentType: string
  contextKey: string | null
  requestBody: {
    targetLanguage: string
    sourceLanguage?: string
    mode?: 'cache-fill' | 'cache-only'
    contentType?: string
    context?: TranslationLookupRequest['context']
    returnMeta?: boolean
    texts: string[]
  }
  texts: string[]
}

function normalizeLookupRequest(body: TranslationLookupRequest): NormalizedLookupRequest {
  const texts = Array.isArray((body as { texts?: string[] }).texts)
    ? [...((body as { texts: string[] }).texts)]
    : typeof (body as { text?: string }).text === 'string'
      ? [(body as { text: string }).text]
      : []

  if (!body.targetLanguage) {
    throw new Error('[smartlinks] translations.lookup requires targetLanguage')
  }

  if (texts.length === 0) {
    throw new Error('[smartlinks] translations.lookup requires text or texts')
  }

  return {
    targetLanguage: body.targetLanguage,
    sourceLanguage: body.sourceLanguage ?? 'en',
    mode: body.mode ?? 'cache-fill',
    contentType: body.contentType ?? 'text/plain',
    contextKey: deriveTranslationContextKey(body.context),
    requestBody: {
      targetLanguage: body.targetLanguage,
      sourceLanguage: body.sourceLanguage,
      mode: body.mode,
      contentType: body.contentType,
      context: body.context,
      returnMeta: body.returnMeta,
      texts,
    },
    texts,
  }
}

function sameLanguage(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

function toResolvedItem(item: ResolvedTranslationItem, index: number, cacheSource: 'local' | 'remote'): ResolvedTranslationItem {
  return {
    ...item,
    index,
    cacheSource,
  }
}

// A person can correct a translation in Studio. Visitors' browsers keep translations for weeks, so
// once per page per collection we ask the server when its translations were last edited, and drop
// the local copies if that changed since we last looked. The answer is cheap (no AI) and never
// blocks for long: on a slow or failed answer the local copies are used as before.
const REVISION_KEY = 'smartlinks:translations:revision:'
const REVISION_WAIT_MS = 1500
const revisionChecks = new Map<string, Promise<void>>()

function readStoredRevision(collectionId: string): string | null {
  try { return typeof localStorage !== 'undefined' ? localStorage.getItem(REVISION_KEY + collectionId) : null } catch { return null }
}
function storeRevision(collectionId: string, revision: string) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(REVISION_KEY + collectionId, revision) } catch { /* ignore */ }
}

async function checkRevision(collectionId: string): Promise<void> {
  const res = await request<{ revision?: string }>(`/public/collection/${encodeURIComponent(collectionId)}/translations/revision`)
  const revision = typeof res?.revision === 'string' ? res.revision : null
  if (!revision) return
  const stored = readStoredRevision(collectionId)
  // First look ever: copies saved before this check existed may predate an edit, unless nothing was ever edited.
  const changed = stored === null ? revision !== '0' : stored !== revision
  if (changed) await clearCachedTranslations(collectionId)
  storeRevision(collectionId, revision)
}

function refreshIfEdited(collectionId: string): Promise<void> {
  let check = revisionChecks.get(collectionId)
  if (!check) {
    check = checkRevision(collectionId).catch(() => undefined)
    revisionChecks.set(collectionId, check)
  }
  return Promise.race([check, new Promise<void>((resolve) => setTimeout(resolve, REVISION_WAIT_MS))])
}

/** @internal tests only */
export function _resetRevisionChecks() {
  revisionChecks.clear()
}

export namespace translations {
  export async function hashText(text: string, options?: TranslationHashOptions): Promise<string> {
    return hashTranslationText(text, options)
  }

  export async function hashTexts(texts: string[], options?: TranslationHashOptions): Promise<string[]> {
    return Promise.all(texts.map((text) => hashTranslationText(text, options)))
  }

  export function normalizeText(text: string, options?: TranslationHashOptions): string {
    return normalizeTranslationText(text, options)
  }

  export async function lookup(
    collectionId: string,
    body: TranslationLookupRequest
  ): Promise<TranslationLookupResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/translations/lookup`
    const normalized = normalizeLookupRequest(body)
    // A request that may create translations can take a while the first time: say so, so a host
    // (Portal, Hub) can show "translating…" without the app doing anything (translationActivity.ts).
    // Through the parent (proxyMode), the host's IframeResponder counts it instead, so apps built on
    // older SDKs are covered too and nothing is counted twice.
    const settle = normalized.mode === 'cache-fill' && !isProxyEnabled() && !sameLanguage(normalized.sourceLanguage, normalized.targetLanguage)
      ? trackTranslation(normalized.targetLanguage, normalized.texts.length)
      : null
    try {
      return await post<TranslationLookupResponse>(path, normalized.requestBody)
    } finally {
      settle?.()
    }
  }

  /**
   * Hear when content is being translated for the first time, in this window or in any app frame
   * it embeds. Hosts use it to show a "translating this page" notice; apps never have to.
   * Returns an unsubscribe function.
   */
  export function onActivity(cb: (activity: TranslationActivity) => void): () => void {
    return onTranslationActivity(cb)
  }

  /** The "translating this page" line, in the language being translated into (for a host's banner). */
  export function translatingMessage(language: string | null | undefined): { text: string; lang: string; dir: 'ltr' | 'rtl' } {
    return translatingLine(language)
  }

  /** Whether a first-time translation is under way right now (see onActivity). */
  export function activity(): TranslationActivity {
    return translationActivity()
  }

  export async function resolve(
    collectionId: string,
    body: TranslationLookupRequest,
    options: TranslationResolveOptions = {}
  ): Promise<ResolvedTranslationResponse> {
    const normalized = normalizeLookupRequest(body)
    const {
      useLocalCache = true,
      refreshLocalCache = false,
      localCacheTtlMs = getDefaultTranslationCacheTtlMs(),
      hashOptions,
    } = options

    const hashes = await Promise.all(normalized.texts.map((text) => hashTranslationText(text, hashOptions)))
    const results: ResolvedTranslationItem[] = new Array(normalized.texts.length)

    if (sameLanguage(normalized.sourceLanguage, normalized.targetLanguage)) {
      const passthroughItems = normalized.texts.map((text, index) => ({
        index,
        hash: hashes[index],
        sourceText: text,
        translatedText: text,
        status: 'passthrough' as const,
        quality: 'passthrough' as const,
        cacheSource: 'local' as const,
        expiresAt: Date.now() + localCacheTtlMs,
      }))

      if (useLocalCache) {
        await setCachedTranslations({
          collectionId,
          sourceLanguage: normalized.sourceLanguage,
          targetLanguage: normalized.targetLanguage,
          contentType: normalized.contentType,
          contextKey: normalized.contextKey,
          ttlMs: localCacheTtlMs,
          items: passthroughItems.map((item) => ({ hash: item.hash, item })),
        })
      }

      return {
        targetLanguage: normalized.targetLanguage,
        sourceLanguage: normalized.sourceLanguage,
        mode: normalized.mode,
        items: passthroughItems,
      }
    }

    if (useLocalCache && !refreshLocalCache) await refreshIfEdited(collectionId)

    const cachedByHash = useLocalCache && !refreshLocalCache
      ? await getCachedTranslations({
          collectionId,
          sourceLanguage: normalized.sourceLanguage,
          targetLanguage: normalized.targetLanguage,
          contentType: normalized.contentType,
          contextKey: normalized.contextKey,
          hashes,
        })
      : new Map()

    const missingIndexes: number[] = []
    for (let index = 0; index < normalized.texts.length; index += 1) {
      const cached = cachedByHash.get(hashes[index])
      if (cached?.item?.translatedText) {
        results[index] = toResolvedItem(cached.item, index, 'local')
      } else {
        missingIndexes.push(index)
      }
    }

    if (missingIndexes.length === 0) {
      return {
        targetLanguage: normalized.targetLanguage,
        sourceLanguage: normalized.sourceLanguage,
        mode: normalized.mode,
        items: results,
      }
    }

    const uniqueMisses: Array<{ index: number; hash: string; text: string }> = []
    const uniqueMissLookup = new Map<string, { firstIndex: number; indexes: number[] }>()

    for (const index of missingIndexes) {
      const hash = hashes[index]
      const existing = uniqueMissLookup.get(hash)
      if (existing) {
        existing.indexes.push(index)
        continue
      }

      uniqueMissLookup.set(hash, { firstIndex: index, indexes: [index] })
      uniqueMisses.push({ index, hash, text: normalized.texts[index] })
    }

    const remoteResponse = await lookup(collectionId, {
      targetLanguage: normalized.targetLanguage,
      sourceLanguage: body.sourceLanguage,
      mode: body.mode,
      contentType: body.contentType,
      context: body.context,
      returnMeta: body.returnMeta,
      texts: uniqueMisses.map((item) => item.text),
    })

    const cacheableRemoteItems: Array<{ hash: string; item: ResolvedTranslationItem }> = []

    remoteResponse.items.forEach((remoteItem, remoteIndex) => {
      const miss = uniqueMisses[remoteIndex]
      if (!miss) return

      const indexes = uniqueMissLookup.get(miss.hash)?.indexes ?? [miss.index]
      for (const index of indexes) {
        const resolvedItem: ResolvedTranslationItem = {
          ...remoteItem,
          index,
          hash: miss.hash,
          sourceText: normalized.texts[index],
          cacheSource: 'remote',
        }
        results[index] = resolvedItem
      }

      if (remoteItem.translatedText) {
        cacheableRemoteItems.push({
          hash: miss.hash,
          item: {
            ...remoteItem,
            index: miss.index,
            hash: miss.hash,
            sourceText: miss.text,
            cacheSource: 'remote',
          },
        })
      }
    })

    if (useLocalCache && cacheableRemoteItems.length > 0) {
      await setCachedTranslations({
        collectionId,
        sourceLanguage: normalized.sourceLanguage,
        targetLanguage: normalized.targetLanguage,
        contentType: normalized.contentType,
        contextKey: normalized.contextKey,
        ttlMs: localCacheTtlMs,
        items: cacheableRemoteItems,
      })
    }

    return {
      targetLanguage: remoteResponse.targetLanguage,
      sourceLanguage: remoteResponse.sourceLanguage ?? normalized.sourceLanguage,
      mode: remoteResponse.mode ?? normalized.mode,
      items: results.map((item, index) => item ?? {
        index,
        hash: hashes[index],
        sourceText: normalized.texts[index],
        cacheSource: 'remote',
      }),
    }
  }

  /**
   * Admin: the collection's stored translations, a page at a time. Filter by language, content type, where
   * the text appears (`contextKey`), a search (`q`), whether a person edited it (`isOverride`), or whether
   * it misses the site's required wording (`termIssues`). `count` is how many match in all.
   *
   * @example
   * ```typescript
   * let page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50 })
   * page.items // TranslationRecord[]
   * while (page.nextCursor) {
   *   page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50, cursor: page.nextCursor })
   * }
   * ```
   */
  export async function list(
    collectionId: string,
    params?: TranslationListParams
  ): Promise<ListResult<TranslationRecord>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations${listQuery(params)}`
    return request<ListResult<TranslationRecord>>(path)
  }

  export async function get(
    collectionId: string,
    translationId: string
  ): Promise<TranslationRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations/${encodeURIComponent(translationId)}`
    return request<TranslationRecord>(path)
  }

  export async function update(
    collectionId: string,
    translationId: string,
    body: TranslationUpdateRequest
  ): Promise<TranslationRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations/${encodeURIComponent(translationId)}`
    return patch<TranslationRecord>(path, body)
  }

  /** Admin: how many translations exist per language, and how many a person has edited. */
  export async function summary(collectionId: string): Promise<{ languages: Array<{ language: string; total: number; edited: number; issues?: number }> }> {
    return request(`/admin/collection/${encodeURIComponent(collectionId)}/translations/summary`)
  }

  /** Admin: where translated text appears for one language (context keys), with counts. */
  export async function places(collectionId: string, targetLanguage: string): Promise<{ places: Array<{ contextKey: string; total: number; edited: number }> }> {
    return request(`/admin/collection/${encodeURIComponent(collectionId)}/translations/places?targetLanguage=${encodeURIComponent(targetLanguage)}`)
  }

  /** Admin: undo a person's edit with a fresh machine translation. */
  export async function reset(collectionId: string, translationId: string): Promise<TranslationRecord> {
    return post<TranslationRecord>(`/admin/collection/${encodeURIComponent(collectionId)}/translations/${encodeURIComponent(translationId)}/reset`, {})
  }

  /** Admin: the site's translation rules (brief, notes per language, required terms). */
  export async function rules(collectionId: string): Promise<TranslationRules> {
    return request<TranslationRules>(`/admin/collection/${encodeURIComponent(collectionId)}/translations/rules`)
  }

  /** Admin: replace the site's translation rules. They apply to new translations from now on. */
  export async function saveRules(collectionId: string, body: Pick<TranslationRules, 'guidance' | 'languages' | 'terms'>): Promise<TranslationRules> {
    return put<TranslationRules>(`/admin/collection/${encodeURIComponent(collectionId)}/translations/rules`, body)
  }

  export async function clearLocalCache(collectionId?: string): Promise<void> {
    await clearCachedTranslations(collectionId)
  }
}