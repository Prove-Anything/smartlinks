import type {
  ResolvedTranslationItem,
  TranslationContext,
  TranslationHashOptions,
} from './types/translations'
import { createIdbConnection } from './idbConnection'

const DB_NAME = 'smartlinks-sdk-translations'
const STORE_NAME = 'translations'
const DB_VERSION = 1
const DEFAULT_LOCAL_TRANSLATION_TTL_MS = 90 * 24 * 60 * 60_000

interface LocalTranslationCacheEntry {
  collectionId: string
  sourceLanguage: string
  targetLanguage: string
  contentType: string
  contextKey: string | null
  hash: string
  item: ResolvedTranslationItem
  cachedAt: number
  expiresAt: number
}

const connection = createIdbConnection(DB_NAME, STORE_NAME, DB_VERSION)
const memoryTranslationCache = new Map<string, LocalTranslationCacheEntry>()

export function getDefaultTranslationCacheTtlMs(): number {
  return DEFAULT_LOCAL_TRANSLATION_TTL_MS
}

function isIndexedDbAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null
  } catch {
    return false
  }
}

/** Resolve when the transaction settles, whatever the outcome. */
function settled(tx: IDBTransaction): Promise<void> {
  return new Promise<void>((resolve) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => resolve()
    tx.onabort = () => resolve()
  })
}

function stableContextKey(context?: TranslationContext): string | null {
  if (!context) return null
  const entries = Object.entries(context)
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))

  if (entries.length === 0) return null

  if (typeof context.surface === 'string' && typeof context.field === 'string') {
    return `${context.surface}:${context.field}`
  }

  return entries
    .map(([key, value]) => `${key}=${String(value)}`)
    .join('|')
}

export function deriveTranslationContextKey(context?: TranslationContext): string | null {
  return stableContextKey(context)
}

export function normalizeTranslationText(
  text: string,
  options: TranslationHashOptions = {}
): string {
  const {
    trim = true,
    collapseWhitespace = false,
    unicodeNormalization = 'NFC',
  } = options

  let normalized = text.replace(/\r\n?/g, '\n')

  if (trim) {
    normalized = normalized.trim()
  }

  if (collapseWhitespace) {
    normalized = normalized.replace(/[\t\f\v ]+/g, ' ')
  }

  if (unicodeNormalization) {
    normalized = normalized.normalize(unicodeNormalization)
  }

  return normalized
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let output = ''
  for (const byte of bytes) {
    output += byte.toString(16).padStart(2, '0')
  }
  return output
}

export async function hashTranslationText(
  text: string,
  options: TranslationHashOptions = {}
): Promise<string> {
  const normalized = normalizeTranslationText(text, options)
  const subtle = globalThis.crypto?.subtle

  if (!subtle) {
    throw new Error('[smartlinks] Web Crypto is required for translation hashing')
  }

  const encoded = new TextEncoder().encode(normalized)
  const digest = await subtle.digest('SHA-256', encoded)
  return `sha256:${toHex(digest)}`
}

function buildLocalCacheKey(params: {
  collectionId: string
  sourceLanguage: string
  targetLanguage: string
  contentType: string
  contextKey: string | null
  hash: string
}): string {
  return [
    params.collectionId,
    params.sourceLanguage,
    params.targetLanguage,
    params.contentType,
    params.contextKey ?? '',
    params.hash,
  ].join('::')
}

function isExpired(entry: LocalTranslationCacheEntry): boolean {
  return entry.expiresAt <= Date.now()
}

async function getEntry(key: string): Promise<LocalTranslationCacheEntry | null> {
  const memoryEntry = memoryTranslationCache.get(key)
  if (memoryEntry) {
    if (isExpired(memoryEntry)) {
      memoryTranslationCache.delete(key)
      return null
    }
    return memoryEntry
  }

  if (!isIndexedDbAvailable()) return null

  try {
    return await connection.run('readonly', (store) =>
      new Promise<LocalTranslationCacheEntry | null>((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => {
          const result = (request.result as LocalTranslationCacheEntry | undefined) ?? null
          if (!result) {
            resolve(null)
            return
          }

          if (isExpired(result)) {
            memoryTranslationCache.delete(key)
            void deleteEntries([key])
            resolve(null)
            return
          }

          memoryTranslationCache.set(key, result)
          resolve(result)
        }
        request.onerror = () => resolve(null)
      })
    )
  } catch {
    return null
  }
}

export async function getCachedTranslations(params: {
  collectionId: string
  sourceLanguage: string
  targetLanguage: string
  contentType: string
  contextKey: string | null
  hashes: string[]
}): Promise<Map<string, LocalTranslationCacheEntry>> {
  const entries = await Promise.all(params.hashes.map(async (hash) => {
    const key = buildLocalCacheKey({ ...params, hash })
    const entry = await getEntry(key)
    return entry ? [hash, entry] as const : null
  }))

  return new Map(entries.filter((entry): entry is readonly [string, LocalTranslationCacheEntry] => entry !== null))
}

async function setEntries(entries: Array<[string, LocalTranslationCacheEntry]>): Promise<void> {
  for (const [key, entry] of entries) {
    memoryTranslationCache.set(key, entry)
  }

  if (!isIndexedDbAvailable()) return

  try {
    await connection.run('readwrite', (store, tx) => {
      for (const [key, entry] of entries) {
        store.put(entry, key)
      }
      return settled(tx)
    })
  } catch {
    // Best-effort persistence only.
  }
}

export async function setCachedTranslations(params: {
  collectionId: string
  sourceLanguage: string
  targetLanguage: string
  contentType: string
  contextKey: string | null
  items: Array<{ hash: string; item: ResolvedTranslationItem }>
  ttlMs?: number
}): Promise<void> {
  const ttlMs = params.ttlMs ?? DEFAULT_LOCAL_TRANSLATION_TTL_MS
  const now = Date.now()

  const entries = params.items.map(({ hash, item }) => {
    const key = buildLocalCacheKey({
      collectionId: params.collectionId,
      sourceLanguage: params.sourceLanguage,
      targetLanguage: params.targetLanguage,
      contentType: params.contentType,
      contextKey: params.contextKey,
      hash,
    })

    const entry: LocalTranslationCacheEntry = {
      collectionId: params.collectionId,
      sourceLanguage: params.sourceLanguage,
      targetLanguage: params.targetLanguage,
      contentType: params.contentType,
      contextKey: params.contextKey,
      hash,
      item: {
        ...item,
        expiresAt: now + ttlMs,
      },
      cachedAt: now,
      expiresAt: now + ttlMs,
    }

    return [key, entry] as [string, LocalTranslationCacheEntry]
  })

  await setEntries(entries)
}

async function deleteEntries(keys: string[]): Promise<void> {
  for (const key of keys) {
    memoryTranslationCache.delete(key)
  }

  if (!isIndexedDbAvailable() || keys.length === 0) return

  try {
    await connection.run('readwrite', (store, tx) => {
      for (const key of keys) {
        store.delete(key)
      }
      return settled(tx)
    })
  } catch {
    // Ignore deletion failures.
  }
}

export async function clearCachedTranslations(collectionId?: string): Promise<void> {
  const memoryKeys = Array.from(memoryTranslationCache.keys())
  const keysToDelete = collectionId
    ? memoryKeys.filter((key) => key.startsWith(`${collectionId}::`))
    : memoryKeys

  await deleteEntries(keysToDelete)

  if (!isIndexedDbAvailable()) return

  try {
    if (!collectionId) {
      await connection.run('readwrite', (store, tx) => {
        store.clear()
        return settled(tx)
      })
      return
    }

    await connection.run('readwrite', (store) =>
      new Promise<void>((resolve) => {
        const request = store.getAllKeys()
        request.onsuccess = () => {
          for (const key of request.result as string[]) {
            if (key.startsWith(`${collectionId}::`)) {
              store.delete(key)
            }
          }
          resolve()
        }
        request.onerror = () => resolve()
      })
    )
  } catch {
    // Ignore deletion failures.
  }
}