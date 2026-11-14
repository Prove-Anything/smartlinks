import { request, post } from "../http"
import type { OperationsAdmin, OperationStep, WorkOrdersApi, StockApi, BomsApi, MadeFromApi } from "../types/operations"

/**
 * Operations: work orders, stock, bills of materials and made-from, for admin screens.
 *
 * `operations.admin(collectionId)` gives the same calls a server function has as `ctx.sl.workOrders`,
 * `ctx.sl.stock`, `ctx.sl.boms` and `ctx.sl.madeFrom`, with the same arguments and results.
 *
 * See docs/operations.md.
 */
export namespace operations {
  // What each group offers. The server refuses any name it doesn't know, so this list only decides
  // what the handle exposes.
  const GROUPS = {
    workOrders: ['get', 'list', 'create', 'update', 'setStatus', 'remove', 'startStage', 'progress', 'completeStage', 'skipStage', 'planStage', 'setStages'],
    stock: ['lines', 'totals', 'where', 'position', 'short', 'receive', 'produce', 'consume', 'move', 'allocate', 'release', 'hold', 'unhold', 'adjust'],
    boms: ['current', 'versions', 'whereUsed', 'explode', 'set', 'end'],
    madeFrom: ['of', 'usedIn', 'trace', 'record', 'end'],
  } as const

  const base = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/operations`

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
  export function admin(collectionId: string, opts: { appId?: string } = {}): OperationsAdmin {
    const qs = opts.appId ? `?appId=${encodeURIComponent(opts.appId)}` : ''
    const group = <T>(name: keyof typeof GROUPS): T =>
      Object.fromEntries(GROUPS[name].map((method) => [method, (...args: any[]) => post<any>(`${base(collectionId)}/${name}/${method}${qs}`, { args })])) as T
    return {
      workOrders: group<WorkOrdersApi>('workOrders'),
      stock: group<StockApi>('stock'),
      boms: group<BomsApi>('boms'),
      madeFrom: group<MadeFromApi>('madeFrom'),
      transaction: (steps: OperationStep[]) => post<{ results: any[] }>(`${base(collectionId)}/transaction${qs}`, { steps }),
    }
  }

  /** What the server offers, by group: `{ workOrders: [...], stock: [...], boms: [...], madeFrom: [...] }`. */
  export async function describe(collectionId: string): Promise<{ groups: Record<string, string[]> }> {
    return request<{ groups: Record<string, string[]> }>(base(collectionId))
  }
}
