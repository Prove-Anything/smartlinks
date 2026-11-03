// src/idbConnection.ts
// Shared IndexedDB connection handling for the SDK's caches.
//
// The browser may close an IndexedDB connection behind our back: iOS Safari
// does it when the tab goes to the background, and any browser does it on
// storage eviction or a version change. A transaction on a closed connection
// throws "The database connection is closing", so a cache that keeps one
// connection for the life of the page silently stops working after that.
//
// createIdbConnection() forgets a connection the browser closes and re-opens
// on the next call; run() retries a transaction once when the connection
// turns out to be closed.

export interface IdbConnection {
  /** The open connection, opening one if needed. */
  open(): Promise<IDBDatabase>
  /** Forget the current connection so the next call re-opens. */
  drop(closed?: IDBDatabase): void
  /**
   * Run one transaction against the object store. If the connection is
   * closed, re-open it and try once more. Errors from `body` are not retried.
   */
  run<T>(
    mode: IDBTransactionMode,
    body: (store: IDBObjectStore, tx: IDBTransaction) => T | Promise<T>
  ): Promise<T>
}

/** True for the error a transaction throws on a connection the browser closed. */
export function isClosedConnectionError(error: unknown): boolean {
  const e = error as { name?: string; message?: string } | null
  if (!e) return false
  if (e.name === 'InvalidStateError') return true
  const msg = String(e.message || '')
  return /connection is closing|database connection|closed/i.test(msg)
}

export function createIdbConnection(
  dbName: string,
  storeName: string,
  version = 1
): IdbConnection {
  let db: IDBDatabase | null = null
  let opening: Promise<IDBDatabase> | null = null

  const drop = (closed?: IDBDatabase): void => {
    // A newer connection may already have replaced the one that closed.
    if (closed && db && db !== closed) return
    db = null
    opening = null
  }

  const open = (): Promise<IDBDatabase> => {
    if (db) return Promise.resolve(db)
    if (opening) return opening
    opening = new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const req = indexedDB.open(dbName, version)
        req.onupgradeneeded = (event) => {
          const upgrading = (event.target as IDBOpenDBRequest).result
          if (!upgrading.objectStoreNames.contains(storeName)) {
            upgrading.createObjectStore(storeName)
          }
        }
        req.onsuccess = () => {
          const opened = req.result
          opened.onclose = () => drop(opened)
          opened.onversionchange = () => {
            opened.close()
            drop(opened)
          }
          db = opened
          resolve(opened)
        }
        req.onerror = () => {
          opening = null
          reject(req.error)
        }
        req.onblocked = () => {
          opening = null
          reject(new Error(`[smartlinks] IndexedDB open blocked (${dbName})`))
        }
      } catch (err) {
        opening = null
        reject(err)
      }
    })
    return opening
  }

  const run = async <T>(
    mode: IDBTransactionMode,
    body: (store: IDBObjectStore, tx: IDBTransaction) => T | Promise<T>
  ): Promise<T> => {
    for (let attempt = 0; ; attempt++) {
      const current = await open()
      let tx: IDBTransaction
      try {
        tx = current.transaction(storeName, mode)
      } catch (err) {
        if (attempt === 0 && isClosedConnectionError(err)) {
          drop(current)
          continue
        }
        throw err
      }
      return await body(tx.objectStore(storeName), tx)
    }
  }

  return { open, drop, run }
}
