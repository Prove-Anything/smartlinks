import { patch, post, request } from '../http'
import {
  clearCachedTranslations,
  deriveTranslationContextKey,
  getCachedTranslations,
  getDefaultTranslationCacheTtlMs,
  hashTranslationText,
  normalizeTranslationText,
  setCachedTranslations,
} from '../translationCache'
import type {
  ResolvedTranslationItem,
  ResolvedTranslationResponse,
  TranslationHashOptions,
  TranslationListParams,
  TranslationListResponse,
  TranslationLookupRequest,
  TranslationLookupResponse,
  TranslationRecord,
  TranslationResolveOptions,
  TranslationUpdateRequest,
} from '../types/translations'

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

function buildTranslationListQuery(params: TranslationListParams = {}): string {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    query.append(key, String(value))
  }

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
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
    return post<TranslationLookupResponse>(path, normalized.requestBody)
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

  export async function list(
    collectionId: string,
    params?: TranslationListParams
  ): Promise<TranslationListResponse> {
    const query = buildTranslationListQuery(params)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations${query}`
    return request<TranslationListResponse>(path)
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

  export async function clearLocalCache(collectionId?: string): Promise<void> {
    await clearCachedTranslations(collectionId)
  }
}