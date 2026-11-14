import type { OperationsAdmin } from "../types/operations.js";
/**
 * Operations: work orders, stock, bills of materials and made-from, for admin screens.
 *
 * `operations.admin(collectionId)` gives the same calls a server function has as `ctx.sl.workOrders`,
 * `ctx.sl.stock`, `ctx.sl.boms` and `ctx.sl.madeFrom`, with the same arguments and results.
 *
 * See docs/operations.md.
 */
export declare namespace operations {
    /**
     * The operations objects for one collection (admin).
     *
     * @param opts.appId - the app a NEW work order belongs to. An admin may change any app's work order,
     *   but a work order is always created for an app, so `workOrders.create` needs this.
     *
     * @example
     * ```typescript
     * const ops = operations.admin('coll_123', { appId: 'production' })
     *
     * const caps = await ops.stock.position({ productId: 'brass-cap', horizonDays: 90 })
     * caps.onHand.available      // 400
     * caps.shortfall             // { quantity: 140, firstShortOn: '2026-12-14' } | null
     *
     * await ops.stock.move({ from: binId, to: cageId, productId: 'brass-cap', quantity: 100 })
     * await ops.workOrders.setStatus('19264', 'on-hold', { reason: 'Waiting for caps' })
     * ```
     */
    function admin(collectionId: string, opts?: {
        appId?: string;
    }): OperationsAdmin;
    /** What the server offers, by group: `{ workOrders: [...], stock: [...], boms: [...], madeFrom: [...] }`. */
    function describe(collectionId: string): Promise<{
        groups: Record<string, string[]>;
    }>;
}
