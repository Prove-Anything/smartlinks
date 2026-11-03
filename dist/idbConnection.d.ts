export interface IdbConnection {
    /** The open connection, opening one if needed. */
    open(): Promise<IDBDatabase>;
    /** Forget the current connection so the next call re-opens. */
    drop(closed?: IDBDatabase): void;
    /**
     * Run one transaction against the object store. If the connection is
     * closed, re-open it and try once more. Errors from `body` are not retried.
     */
    run<T>(mode: IDBTransactionMode, body: (store: IDBObjectStore, tx: IDBTransaction) => T | Promise<T>): Promise<T>;
}
/** True for the error a transaction throws on a connection the browser closed. */
export declare function isClosedConnectionError(error: unknown): boolean;
export declare function createIdbConnection(dbName: string, storeName: string, version?: number): IdbConnection;
