import { request, post } from "../http.js";
/**
 * Operations: work orders, stock, bills of materials and made-from, for admin screens.
 *
 * `operations.admin(collectionId)` gives the same calls a server function has as `ctx.sl.workOrders`,
 * `ctx.sl.stock`, `ctx.sl.boms` and `ctx.sl.madeFrom`, with the same arguments and results.
 *
 * See docs/operations.md.
 */
export var operations;
(function (operations) {
    // What each group offers. The server refuses any name it doesn't know, so this list only decides
    // what the handle exposes.
    const GROUPS = {
        workOrders: ['get', 'list', 'create', 'update', 'setStatus', 'remove', 'startStage', 'progress', 'completeStage', 'skipStage', 'planStage', 'setStages'],
        stock: ['lines', 'totals', 'where', 'position', 'short', 'receive', 'produce', 'consume', 'move', 'allocate', 'release', 'hold', 'unhold', 'adjust'],
        boms: ['current', 'versions', 'whereUsed', 'explode', 'set', 'end'],
        madeFrom: ['of', 'usedIn', 'trace', 'record', 'end'],
    };
    const base = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/operations`;
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
    function admin(collectionId, opts = {}) {
        const qs = opts.appId ? `?appId=${encodeURIComponent(opts.appId)}` : '';
        const group = (name) => Object.fromEntries(GROUPS[name].map((method) => [method, (...args) => post(`${base(collectionId)}/${name}/${method}${qs}`, { args })]));
        return {
            workOrders: group('workOrders'),
            stock: group('stock'),
            boms: group('boms'),
            madeFrom: group('madeFrom'),
            transaction: (steps) => post(`${base(collectionId)}/transaction${qs}`, { steps }),
        };
    }
    operations.admin = admin;
    /** What the server offers, by group: `{ workOrders: [...], stock: [...], boms: [...], madeFrom: [...] }`. */
    async function describe(collectionId) {
        return request(base(collectionId));
    }
    operations.describe = describe;
})(operations || (operations = {}));
