// src/persistentCache.ts
// IndexedDB-backed L2 cache for the SDK's HTTP layer.
//
// Every exported function is Node-safe: all IDB access is guarded by
// isIdbAvailable() and wrapped in try/catch so that failures in private-
// browsing, quota-exceeded situations, or server-side environments are always
// silent — they never propagate errors to the caller.
//
// The connection itself is managed by idbConnection.ts, which re-opens it when
// the browser closes it behind our back (iOS Safari does this when the tab is
// backgrounded) instead of leaving the cache dead for the rest of the page.

import { createIdbConnection } from './idbConnection'

const DB_NAME = 'smartlinks-sdk-cache'
const STORE_NAME = 'responses'
const DB_VERSION = 1

export interface PersistentCacheEntry {
  /** The cached response data. */
  data: any
  /** Unix ms timestamp of when the data was originally fetched from the network. */
  timestamp: number
  /** Unix ms timestamp of when this entry was written to IndexedDB. */
  persistedAt: number
}

const connection = createIdbConnection(DB_NAME, STORE_NAME, DB_VERSION)

/**
 * Returns true only in environments where IndexedDB is genuinely available.
 * False in Node.js, and in some private-browsing contexts that stub indexedDB
 * but throw on open.
 */
export function isIdbAvailable(): boolean {
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
    tx.onerror = () => resolve()   // quota exceeded etc — fail silently
    tx.onabort = () => resolve()
  })
}

/**
 * Read an entry from IndexedDB.
 * Returns `null` when IDB is unavailable, the key doesn't exist, or on any error.
 * Safe to call in Node.js — returns null immediately.
 */
export async function idbGet(key: string): Promise<PersistentCacheEntry | null> {
  if (!isIdbAvailable()) return null
  try {
    return await connection.run('readonly', (store) =>
      new Promise<PersistentCacheEntry | null>((resolve) => {
        const req = store.get(key)
        req.onsuccess = () => resolve((req.result as PersistentCacheEntry) ?? null)
        req.onerror = () => resolve(null)
      })
    )
  } catch {
    return null
  }
}

/**
 * Write an entry to IndexedDB.
 * Fails silently on quota exceeded, private browsing, or any other error.
 * Safe to call in Node.js — no-ops immediately.
 */
export async function idbSet(key: string, entry: PersistentCacheEntry): Promise<void> {
  if (!isIdbAvailable()) return
  try {
    await connection.run('readwrite', (store, tx) => {
      store.put(entry, key)
      return settled(tx)
    })
  } catch {
    // Fail silently — IDB persistence is best-effort
  }
}

/**
 * Delete a single entry from IndexedDB.
 * Safe to call in Node.js — no-ops immediately.
 */
export async function idbDelete(key: string): Promise<void> {
  if (!isIdbAvailable()) return
  try {
    await connection.run('readwrite', (store, tx) => {
      store.delete(key)
      return settled(tx)
    })
  } catch {}
}

/**
 * Clear all IDB entries, or only those whose key contains `pattern`.
 * Safe to call in Node.js — no-ops immediately.
 */
export async function idbClear(pattern?: string): Promise<void> {
  if (!isIdbAvailable()) return
  try {
    if (!pattern) {
      await connection.run('readwrite', (store, tx) => {
        store.clear()
        return settled(tx)
      })
      return
    }
    // Pattern-based: enumerate all keys and delete matching ones.
    await connection.run('readwrite', (store) =>
      new Promise<void>((resolve) => {
        const req = store.getAllKeys()
        req.onsuccess = () => {
          for (const key of req.result as string[]) {
            if (key.includes(pattern)) store.delete(key)
          }
          resolve()
        }
        req.onerror = () => resolve()
      })
    )
  } catch {}
}
