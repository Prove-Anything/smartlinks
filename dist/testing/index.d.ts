import type { AppFunctionDef, ServerFunctionContext } from '../types/appManifest.js';
export declare class CapabilityError extends Error {
    capability: string;
    code: string;
    constructor(capability: string, message?: string);
}
/** The surface `ctx.sl` exposes — mirrors the server facade. Provide the methods your test needs. */
export interface TestSlImpl {
    appRecords?: {
        create?(fields: any): any;
        update?(id: string, fields: any): any;
        upsert?(fields: any): any;
        delete?(id: string): any;
        get?(id: string): any;
        query?(params: any): any;
        listTypes?(): any;
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
}
export interface TestCaller {
    userId?: string | null;
    anonymous?: boolean;
    origin?: string | null;
    ip?: string | null;
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
}
export interface FunctionTestContext extends ServerFunctionContext {
    /** Captured log lines (also written via ctx.log). */
    logs: Array<{
        at: string;
        message: string;
        data?: Record<string, any>;
    }>;
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
