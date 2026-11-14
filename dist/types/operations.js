/**
 * Operations: work orders, stock, bills of materials and made-from. See docs/operations.md.
 *
 * The same calls are reached two ways, with the same shapes:
 *   - in a server function:  ctx.sl.workOrders / ctx.sl.stock / ctx.sl.boms / ctx.sl.madeFrom / ctx.sl.operations
 *   - from an admin screen:  operations.admin(collectionId)  →  { workOrders, stock, boms, madeFrom, transaction }
 */
export {};
