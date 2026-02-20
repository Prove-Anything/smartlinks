// src/persistentCache.ts
// IndexedDB-backed L2 cache for the SDK's HTTP layer.
//
// Every exported function is Node-safe: all IDB access is guarded by
// isIdbAvailable() and wrapped in try/catch so that failures in private-
// browsing, quota-exceeded situations, or server-side environments are always
// silent — they never propagate errors to the caller.

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

let dbPromise: Promise<IDBDatabase> | null = null

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

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
      req.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result)
      }
      req.onerror = () => {
        dbPromise = null
        reject(req.error)
      }
      req.onblocked = () => {
        dbPromise = null
        reject(new Error('[smartlinks] IndexedDB open blocked'))
      }
    } catch (err) {
      dbPromise = null
      reject(err)
    }
  })
  return dbPromise
}

/**
 * Read an entry from IndexedDB.
 * Returns `null` when IDB is unavailable, the key doesn't exist, or on any error.
 * Safe to call in Node.js — returns null immediately.
 */
export async function idbGet(key: string): Promise<PersistentCacheEntry | null> {
  if (!isIdbAvailable()) return null
  try {
    const db = await openDb()
    return new Promise<PersistentCacheEntry | null>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const req = tx.objectStore(STORE_NAME).get(key)
        req.onsuccess = () => resolve((req.result as PersistentCacheEntry) ?? null)
        req.onerror = () => resolve(null)
      } catch {
        resolve(null)
      }
    })
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
    const db = await openDb()
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).put(entry, key)
        tx.oncomplete = () => resolve()
        tx.onerror = () => resolve()   // quota exceeded etc — fail silently
        tx.onabort = () => resolve()
      } catch {
        resolve()
      }
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
    const db = await openDb()
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).delete(key)
        tx.oncomplete = () => resolve()
        tx.onerror = () => resolve()
        tx.onabort = () => resolve()
      } catch {
        resolve()
      }
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
    const db = await openDb()
    if (!pattern) {
      await new Promise<void>((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite')
          tx.objectStore(STORE_NAME).clear()
          tx.oncomplete = () => resolve()
          tx.onerror = () => resolve()
          tx.onabort = () => resolve()
        } catch {
          resolve()
        }
      })
      return
    }
    // Pattern-based: enumerate all keys and delete matching ones.
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.getAllKeys()
        req.onsuccess = () => {
          for (const key of req.result as string[]) {
            if (key.includes(pattern)) store.delete(key)
          }
          resolve()
        }
        req.onerror = () => resolve()
      } catch {
        resolve()
      }
    })
  } catch {}
}
