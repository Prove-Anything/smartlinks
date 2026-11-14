import type { AppFunctionDef, ServerFunctionContext, ServerFunctionInputs } from '../types/appManifest.js';
import type { WorkOrdersApi, StockApi, BomsApi, MadeFromApi, OperationsApi } from '../types/operations.js';
import { type BookingsMemory } from './bookingsMemory.js';
export declare class CapabilityError extends Error {
    capability: string;
    code: string;
    constructor(capability: string, message?: string);
}
/** The surface `ctx.sl` exposes — mirrors the server facade. Provide the methods your test needs. */
export interface TestSlImpl {
    appRecords?: {
        create?(fields: any): any;
        claim?(fields: any): any;
        update?(id: string, fields: any): any;
        upsert?(fields: any): any;
        delete?(id: string): any;
        get?(id: string): any;
        query?(params: any): any;
        listTypes?(): any;
        adjust?(id: string, by: Record<string, number>, opts?: any): any;
        aggregate?(params?: any): any;
    };
    /** ctx.sl.transaction(ops, { idempotencyKey }) — defaults to the in-memory one (all or none, replay by key). */
    transaction?(ops: any[], opts?: any): any;
    counters?: {
        next?(name: string, opts?: any): any;
        get?(name: string): any;
    };
    /** Tag lookup. Default: any `<claimSetId>-<code>` resolves (pass `knownTags` to restrict). */
    tags?: {
        resolve?(id: string): any;
    };
    contacts?: {
        upsert?(details: any): any;
        forCaller?(): any;
    };
    interactions?: {
        record?(event: any): any;
    };
    products?: {
        get?(id: string, opts?: any): any;
        query?(body?: any, opts?: any): any;
        create?(data: any, opts?: any): any;
        update?(id: string, data: any, opts?: any): any;
    };
    attestations?: {
        create?(fields: any): any;
    };
    /**
     * THIS app's own data. Provide impls to assert calls, or omit to use a built-in in-memory store
     * (so a counter test actually persists across calls within the test). `.global`/`.collection` and
     * per-call `{ scope }` share the same store in the harness.
     */
    appData?: {
        get?(opts?: any): any;
        set?(data: any, opts?: any): any;
        getData?(opts?: any): any;
        setData?(data: any, opts?: any): any;
        delete?(opts?: any): any;
    };
    /** Cross-app reads: return another app's data as the caller would see it. Keyed by appId. */
    app?: (appId: string) => {
        data?: {
            get?(opts?: any): any;
            getData?(opts?: any): any;
        };
    };
    /**
     * Bookings. Omit to use the built-in in-memory engine (capacity, per-person limits, no overlapping
     * time, idempotent creates, holds) — inspect it via `ctx.memory.bookings`.
     */
    bookings?: Record<string, any>;
    /**
     * Work orders, stock, bills of materials and made-from (docs/operations.md). There is no in-memory
     * engine for these: give the methods your function calls, and any other call returns a stub echo.
     * The harness still enforces both production gates: the capability, and collection authority.
     */
    workOrders?: Partial<WorkOrdersApi>;
    stock?: Partial<StockApi>;
    boms?: Partial<BomsApi>;
    madeFrom?: Partial<MadeFromApi>;
    operations?: Partial<OperationsApi>;
}
export interface TestCaller {
    userId?: string | null;
    /** The caller's contact id, for `ctx.sl.bookings.mine()`. Default: `contact-of-<userId>` when signed in. */
    contactId?: string | null;
    anonymous?: boolean;
    origin?: string | null;
    ip?: string | null;
    /** Keys of the user groups the caller is in, for `ctx.caller.userGroups`. Default: none. */
    userGroups?: string[];
}
export interface CreateFunctionTestContextOptions {
    /** The manifest declaration under test — its `capabilities` are the enforced envelope. */
    def: Pick<AppFunctionDef, 'capabilities' | 'trigger' | 'visibility' | 'authority'>;
    collectionId?: string;
    appId?: string;
    caller?: TestCaller;
    /** Fixture secrets, keyed by ref. Real sealed secrets are server-only and never available locally. */
    secrets?: Record<string, string>;
    /** Backing impl for ctx.sl. Omit for pure unit tests (methods return a stub echo). */
    sl?: TestSlImpl;
    /** Backing fetch (defaults to global fetch). Still gated by the `network` capability. */
    fetch?: typeof fetch;
    /** What the platform would have prefetched as `ctx.inputs` (e.g. `{ entity: product }`). Default `{}`. */
    inputs?: ServerFunctionInputs;
    /** Tags that exist, as `<claimSetId>-<code>` ids — `ctx.sl.tags.resolve` returns null for any other. */
    knownTags?: string[];
    /** Interaction type ids that exist for this app — `interactions.record` refuses others. Default: any. */
    knownInteractionTypes?: string[];
    /** Share one in-memory store between several contexts (e.g. concurrent callers in one test). */
    memory?: FunctionTestMemory;
}
/** The harness's in-memory platform state (when no impl is injected). */
export interface FunctionTestMemory {
    records: any[];
    counters: Record<string, number>;
    contacts: Array<{
        contactId: string;
        email?: string;
        phone?: string;
        [k: string]: any;
    }>;
    interactions: any[];
    /** Slots, bookings and allocations of the in-memory bookings engine. */
    bookings: BookingsMemory;
    /** ctx.sl.transaction results by idempotency key (a repeat replays them). */
    transactions: Record<string, any[]>;
    /** ctx.sl.history events (log ops and history.log), oldest first. */
    history: Array<{
        id: string;
        at: string;
        type: string;
        entityId: string | null;
        data: Record<string, any>;
        actorType: null;
        actorId: null;
    }>;
}
/** A fresh in-memory store — pass the same one to several test contexts to simulate concurrent callers. */
export declare function createFunctionTestMemory(): FunctionTestMemory;
export interface FunctionTestContext extends ServerFunctionContext {
    /** Captured log lines (also written via ctx.log). */
    logs: Array<{
        at: string;
        message: string;
        data?: Record<string, any>;
    }>;
    /** The in-memory platform state this context reads and writes. */
    memory: FunctionTestMemory;
}
/**
 * Build a capability-enforcing test ctx for a server function. Run your handler with it:
 *
 *   const ctx = createFunctionTestContext({ def, caller: { userId: 'me' }, secrets: { k: 'v' } })
 *   const result = await myHandler(ctx, { method: 'POST', body: { … } })
 *
 * A ctx.sl / ctx.secrets / ctx.fetch call not covered by `def.capabilities` throws
 * CapabilityError — exactly as it would in production.
 */
export declare function createFunctionTestContext(opts: CreateFunctionTestContextOptions): FunctionTestContext;
