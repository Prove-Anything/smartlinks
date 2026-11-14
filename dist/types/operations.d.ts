/**
 * Operations: work orders, stock, bills of materials and made-from. See docs/operations.md.
 *
 * The same calls are reached two ways, with the same shapes:
 *   - in a server function:  ctx.sl.workOrders / ctx.sl.stock / ctx.sl.boms / ctx.sl.madeFrom / ctx.sl.operations
 *   - from an admin screen:  operations.admin(collectionId)  →  { workOrders, stock, boms, madeFrom, transaction }
 */
export type WorkOrderStatus = 'open' | 'on-hold' | 'blocked' | 'done' | 'cancelled';
export type WorkOrderStageStatus = 'pending' | 'active' | 'done' | 'skipped';
export interface WorkOrderStage {
    /** The app's name for the stage: `'filling'`. Lowercase letters, digits and `. _ -`. */
    key: string;
    position: number;
    status: WorkOrderStageStatus;
    plannedStart: string | null;
    plannedEnd: string | null;
    startedAt: string | null;
    doneAt: string | null;
    quantityDone: number;
    quantityScrapped: number;
    data: Record<string, any>;
}
/** The shared skeleton of a "job": what is being made, how many, by when, and where it has got to. */
export interface WorkOrder {
    id: string;
    collectionId: string;
    /** The app that owns its rules. Any app may read it; only this one (or an admin) may change it. */
    appId: string;
    /** The number people use. Unique among the collection's live work orders, whatever the case. */
    ref: string;
    kind: string | null;
    productId: string | null;
    variantId: string | null;
    quantity: number;
    unit: string;
    dueAt: string | null;
    priority: number;
    status: WorkOrderStatus;
    statusReason: string | null;
    /** The order, and the line, it fulfils. */
    orderId: string | null;
    orderItemId: string | null;
    /** The work order it was split from. */
    parentId: string | null;
    /** The batch it makes. */
    outputBatchId: string | null;
    stages: WorkOrderStage[];
    /** The stage in hand: the active one, else the next pending one, else null. */
    currentStage: string | null;
    /** Past its due date and not finished or cancelled. */
    late: boolean;
    /** Whatever else the app keeps on it. */
    data: Record<string, any>;
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}
export type WorkOrderStageInput = string | {
    key: string;
    plannedStart?: string | null;
    plannedEnd?: string | null;
    data?: Record<string, any>;
};
export interface CreateWorkOrderInput {
    ref: string;
    kind?: string;
    productId?: string;
    variantId?: string;
    quantity?: number;
    unit?: string;
    dueAt?: string | null;
    priority?: number;
    orderId?: string;
    orderItemId?: string;
    parentId?: string;
    outputBatchId?: string;
    data?: Record<string, any>;
    /** In order. Nothing starts by itself: the app starts a stage when its own rule says so. */
    stages?: WorkOrderStageInput[];
}
/** `data` is merged into what is there. A change of `quantity` needs `{ reason }`. */
export type UpdateWorkOrderInput = Partial<Omit<CreateWorkOrderInput, 'ref' | 'stages' | 'parentId'>>;
export interface WorkOrderListParams {
    status?: WorkOrderStatus | WorkOrderStatus[];
    appId?: string;
    productId?: string;
    orderId?: string;
    parentId?: string;
    kind?: string;
    /** Past due and still open, on hold or blocked. */
    late?: boolean;
    dueFrom?: string;
    dueTo?: string;
    /** Text in the ref. */
    q?: string;
    sort?: 'due' | 'priority' | 'created' | 'ref';
    limit?: number;
    offset?: number;
}
export interface WorkOrdersApi {
    /** By id or by ref. → null when there is none. */
    get(idOrRef: string): Promise<WorkOrder | null>;
    list(params?: WorkOrderListParams): Promise<{
        items: WorkOrder[];
        total: number;
        limit: number;
        offset: number;
    }>;
    /** @throws `REF_TAKEN` (409) */
    create(input: CreateWorkOrderInput): Promise<WorkOrder>;
    /** @throws `REASON_REQUIRED` when the quantity changes without a reason */
    update(idOrRef: string, patch: UpdateWorkOrderInput, opts?: {
        reason?: string;
    }): Promise<WorkOrder>;
    /**
     * Hold it, block it, finish it, cancel it, or open it again. `on-hold`, `blocked` and `cancelled` need
     * a reason. While it isn't `open` it is FROZEN: no stage can start, progress or finish, and no stock
     * can be moved for it (`WORK_ORDER_FROZEN`, 409).
     */
    setStatus(idOrRef: string, status: WorkOrderStatus, opts?: {
        reason?: string;
    }): Promise<WorkOrder>;
    remove(idOrRef: string): Promise<{
        id: string;
        deleted: true;
    }>;
    startStage(idOrRef: string, stage: string): Promise<WorkOrder>;
    /**
     * Add to (or, with a reason, take from) what a stage has done and scrapped. Atomic: two people logging
     * at once both count, and neither figure goes below zero (`BELOW_ZERO`). It doesn't finish the stage.
     */
    progress(idOrRef: string, stage: string, by: {
        done?: number;
        scrapped?: number;
    }, opts?: {
        reason?: string;
        note?: string;
    }): Promise<WorkOrder>;
    completeStage(idOrRef: string, stage: string, opts?: {
        closeWorkOrder?: boolean;
    }): Promise<WorkOrder>;
    skipStage(idOrRef: string, stage: string, opts: {
        reason: string;
    }): Promise<WorkOrder>;
    /** Allowed while on hold (you can reschedule something that's waiting). */
    planStage(idOrRef: string, stage: string, plan: {
        plannedStart?: string | null;
        plannedEnd?: string | null;
        data?: Record<string, any>;
    }): Promise<WorkOrder>;
    /** Replace the list. A stage that has started, finished or been skipped can't be dropped (`STAGE_IN_USE`). */
    setStages(idOrRef: string, stages: WorkOrderStageInput[]): Promise<WorkOrder>;
}
export type StockState = 'available' | 'allocated' | 'held' | 'quarantine';
/** What stock is set aside for: `{ type: 'workOrder', id }`, `{ type: 'orderItem', id }`, or an app's own. */
export interface StockTarget {
    type: string;
    id: string;
}
/** A quantity of one product, in one container, in one state. */
export interface StockLine {
    id: string;
    containerId: string;
    productId: string;
    variantId: string | null;
    batchId: string | null;
    state: StockState;
    allocatedTo: StockTarget | null;
    quantity: number;
    unit: string;
    updatedAt: string;
}
export interface StockTotals {
    available: number;
    allocated: number;
    held: number;
    quarantine: number;
    total: number;
    unit: string | null;
}
/** What is being moved. A product is held in ONE unit across the collection (`UNIT_MISMATCH`). */
export interface StockItem {
    productId: string;
    variantId?: string;
    batchId?: string;
    quantity: number;
    unit?: string;
}
/** Common to every movement. `workOrderId`: refused while that work order isn't open. */
export interface StockMovementExtras {
    workOrderId?: string;
    reason?: string;
    note?: string;
}
/** `idempotencyKey`: the same movement sent twice (a scanner retrying) happens once. */
export interface StockMovementOptions {
    idempotencyKey?: string;
}
export interface StockMovement {
    movementId: string;
    kind: 'receive' | 'produce' | 'consume' | 'move' | 'allocate' | 'release' | 'hold' | 'unhold' | 'adjust';
    productId: string;
    quantity: number;
    unit: string;
    /** The line it came off, as it is now (`emptied: true` when it reached zero and was removed). */
    from?: (StockLine & {
        emptied?: boolean;
    }) | null;
    /** The line it went onto, as it is now. */
    to?: StockLine | null;
    /** True when this key was already used: nothing moved this time. */
    replayed: boolean;
}
export interface StockWhereLine extends StockLine {
    container: {
        id: string;
        name: string | null;
        ref: string | null;
        type: string;
        fixed: boolean;
    } | null;
    /** Names from the outermost container in: `['Warehouse A', 'Rack 3', 'Bin 12']`. */
    path: string[];
    /** The first fixed container on that path: the place it sits in. */
    place: {
        id: string;
        name: string | null;
        ref: string | null;
        type: string;
        fixed: boolean;
    } | null;
}
/** One defined answer about a product: what there is, what is coming, what is needed, and when it runs short. */
export interface StockPosition {
    product: {
        id: string;
        variantId: string | null;
        name: string | null;
        unit: string | null;
    };
    onHand: StockTotals;
    where: Array<{
        containerId: string;
        container: StockWhereLine['container'];
        path: string;
        place: StockWhereLine['place'];
        quantity: number;
        batchId: string | null;
        state: StockState;
        allocatedTo: StockTarget | null;
    }>;
    /** Open purchase order lines. */
    onOrder: {
        total: number;
        lines: Array<{
            orderId: string;
            orderRef: string | null;
            supplier: string | null;
            quantity: number;
            dueAt: string | null;
        }>;
    };
    /** Open work orders that make this product, and how many each still has to finish. */
    beingMade: {
        total: number;
        lines: Array<{
            workOrderId: string;
            ref: string;
            quantity: number;
            stage: string | null;
            status: WorkOrderStatus;
            dueAt: string | null;
        }>;
    };
    /** Wanted itself by customers, and as a component by work orders and by orders not yet in production. */
    needed: {
        total: number;
        lines: Array<{
            orderId?: string;
            orderRef?: string | null;
            workOrderId?: string;
            ref?: string;
            forProductId: string;
            quantity: number;
            neededBy: string | null;
            why: 'ordered' | 'work order' | 'order, not yet in production';
        }>;
    };
    /** Available now, then the balance after each day on which something arrives or is needed. */
    projected: Array<{
        date: string;
        balance: number;
    }>;
    /** The worst it gets within the horizon, and the first day it goes below zero. null = it doesn't. */
    shortfall: {
        quantity: number;
        firstShortOn: string;
    } | null;
    horizonDays: number;
    /** Lines with no date: counted in the totals, but they can't be placed in the projection. */
    undatedLines?: number;
    asOf: string;
    sources: {
        stock: string;
        orders: string;
        workOrders: string;
    };
}
export interface StockApi {
    lines(params?: {
        containerId?: string;
        productId?: string;
        variantId?: string;
        batchId?: string;
        state?: StockState;
        allocatedTo?: StockTarget;
        limit?: number;
        offset?: number;
    }): Promise<{
        items: StockLine[];
        total: number;
        limit: number;
        offset: number;
    }>;
    /** A sum, worked out now. Nothing stores a product's total. */
    totals(params: {
        productId: string;
        variantId?: string;
        batchId?: string;
    }): Promise<StockTotals>;
    where(params: {
        productId: string;
        variantId?: string;
        batchId?: string;
        state?: StockState;
    }): Promise<StockWhereLine[]>;
    position(params: {
        productId: string;
        variantId?: string;
        horizonDays?: number;
        includeWhere?: boolean;
    }): Promise<StockPosition>;
    /** Everything that will run short within the horizon, soonest first. */
    short(params?: {
        horizonDays?: number;
        limit?: number;
    }): Promise<{
        horizonDays: number;
        items: Array<{
            product: StockPosition['product'];
            shortfall: NonNullable<StockPosition['shortfall']>;
            onHand: StockTotals;
            onOrder: number;
            beingMade: number;
            needed: number;
        }>;
        checked: number;
        asOf: string;
    }>;
    /** Stock arrives. */
    receive(input: StockItem & StockMovementExtras & {
        containerId: string;
        state?: 'available' | 'held' | 'quarantine';
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Stock is made (usually with the `workOrderId` that made it). */
    produce(input: StockItem & StockMovementExtras & {
        containerId: string;
        state?: 'available' | 'held' | 'quarantine';
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Stock is used up: out of what was allocated to `allocatedTo`, else out of what is available. @throws `INSUFFICIENT_STOCK` (409) */
    consume(input: StockItem & StockMovementExtras & {
        containerId: string;
        allocatedTo?: StockTarget;
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Between containers. It keeps its state: allocated stock stays allocated to the same thing. */
    move(input: StockItem & StockMovementExtras & {
        from: string;
        to: string;
        state?: StockState;
        allocatedTo?: StockTarget;
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Set available stock aside for something. */
    allocate(input: StockItem & StockMovementExtras & {
        containerId: string;
        to: StockTarget;
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Give allocated stock back. */
    release(input: StockItem & StockMovementExtras & {
        containerId: string;
        from: StockTarget;
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Take available stock out of use. Needs a reason. */
    hold(input: StockItem & StockMovementExtras & {
        containerId: string;
        state?: 'held' | 'quarantine';
        reason: string;
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Put held stock back in use. Needs a reason. */
    unhold(input: StockItem & StockMovementExtras & {
        containerId: string;
        state?: 'held' | 'quarantine';
        reason: string;
    }, opts?: StockMovementOptions): Promise<StockMovement>;
    /** Correct a line after a count: `by` is + or −. Needs a reason. */
    adjust(input: Omit<StockItem, 'quantity'> & StockMovementExtras & {
        containerId: string;
        by: number;
        state?: 'available' | 'held' | 'quarantine';
        reason: string;
    }, opts?: StockMovementOptions): Promise<StockMovement>;
}
export interface BomLine {
    componentProductId: string;
    componentVariantId?: string | null;
    quantity: number;
    unit?: string;
    optional?: boolean;
    note?: string | null;
}
/** What a product is made of: one version of the recipe. Never edited; a new version takes over. */
export interface Bom {
    id: string;
    productId: string;
    variantId: string | null;
    version: number;
    validFrom: string;
    /** null = still in force. */
    validTo: string | null;
    /** How many the recipe makes (1 by default; 100 for a batch recipe). */
    yields: number;
    note: string | null;
    lines: Array<{
        componentProductId: string;
        componentVariantId: string | null;
        quantity: number;
        unit: string;
        optional: boolean;
        note: string | null;
    }>;
    data: Record<string, any>;
    createdBy: string | null;
    createdAt: string;
}
export interface BomTreeNode {
    productId: string;
    variantId: string | null;
    quantity: number;
    unit: string;
    optional: boolean;
    components: BomTreeNode[];
}
export interface BomExplosion {
    productId: string;
    variantId: string | null;
    quantity: number;
    /** false = it has no recipe: it is its own material. */
    hasBom: boolean;
    tree: BomTreeNode[];
    /** The leaves, summed: things with no recipe of their own. */
    materials: Array<{
        productId: string;
        variantId: string | null;
        quantity: number;
        unit: string;
    }>;
}
export interface BomsApi {
    /** The recipe in force now, or at a date. A variant's own wins; otherwise the product's. */
    current(params: {
        productId: string;
        variantId?: string;
        at?: string;
    }): Promise<Bom | null>;
    versions(params: {
        productId: string;
        variantId?: string;
    }): Promise<Bom[]>;
    whereUsed(params: {
        componentProductId: string;
    }): Promise<Array<{
        productId: string;
        variantId: string | null;
        quantity: number;
        unit: string;
        yields: number;
        optional: boolean;
    }>>;
    /** Everything needed to make a quantity, all the way down. */
    explode(params: {
        productId: string;
        variantId?: string;
        quantity?: number;
        at?: string;
        includeOptional?: boolean;
    }): Promise<BomExplosion>;
    /** A new version, in force from `validFrom` (now by default). @throws `BOM_LOOP` (409) */
    set(input: {
        productId: string;
        variantId?: string;
        lines: BomLine[];
        yields?: number;
        note?: string;
        validFrom?: string;
        data?: Record<string, any>;
    }): Promise<Bom>;
    /** The product stops having a recipe from now. */
    end(params: {
        productId: string;
        variantId?: string;
    }): Promise<Bom | null>;
}
export interface MadeFromSubject {
    type: 'batch' | 'proof';
    id: string;
}
export interface MadeFromSource {
    type: 'batch' | 'proof' | 'product';
    id: string;
}
export interface MadeFromEntry {
    id: string;
    subject: MadeFromSubject;
    source: MadeFromSource;
    productId: string | null;
    quantity: number | null;
    unit: string | null;
    workOrderId: string | null;
    at: string;
    by: string | null;
    /** Set when the part was taken out. Entries are never edited or deleted. */
    endedAt: string | null;
    data: Record<string, any>;
}
export interface MadeFromTraceNode {
    source: MadeFromSource;
    productId: string | null;
    quantity: number | null;
    unit: string | null;
    at: string;
    workOrderId: string | null;
    madeFrom: MadeFromTraceNode[];
}
export interface MadeFromApi {
    /** What this was made from: in force now, at a date, or all of them. */
    of(subject: MadeFromSubject, opts?: {
        at?: string;
        includeEnded?: boolean;
    }): Promise<MadeFromEntry[]>;
    /** Everything that used this batch or item. */
    usedIn(source: MadeFromSource, opts?: {
        includeEnded?: boolean;
    }): Promise<MadeFromEntry[]>;
    /** The whole trace back, level by level. */
    trace(subject: MadeFromSubject, opts?: {
        depth?: number;
    }): Promise<{
        subject: MadeFromSubject;
        madeFrom: MadeFromTraceNode[];
    }>;
    record(input: {
        subject: MadeFromSubject;
        sources: Array<MadeFromSource & {
            productId?: string;
            quantity?: number;
            unit?: string;
            data?: Record<string, any>;
        }>;
        workOrderId?: string;
        at?: string;
    }): Promise<MadeFromEntry[]>;
    /** The part was taken out. Needs a reason. */
    end(id: string, opts: {
        reason: string;
    }): Promise<MadeFromEntry>;
}
/** One write: `{ op: 'stock.move', args: [{ … }] }` or `{ op: 'workOrders.progress', args: [id, 'picking', { done: 12 }] }`. */
export interface OperationStep {
    op: string;
    args: any[];
}
export interface OperationsApi {
    /**
     * Several writes, all or nothing (at most 50; reads don't belong). A failing step undoes them all,
     * and the error's `details.step` says which.
     */
    transaction(steps: OperationStep[]): Promise<{
        results: any[];
    }>;
}
/** What `operations.admin(collectionId)` gives an admin screen. */
export interface OperationsAdmin {
    workOrders: WorkOrdersApi;
    stock: StockApi;
    boms: BomsApi;
    madeFrom: MadeFromApi;
    transaction: OperationsApi['transaction'];
}
