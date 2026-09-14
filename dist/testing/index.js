// src/testing/index.ts
//
// Local test harness for SmartLinks server functions — importable as
// `@proveanything/smartlinks/testing`. It builds a `ctx` that matches the runtime
// contract AND enforces the declared capability envelope, so a function fails locally
// the same way it would after deploy — no "deploy and pray".
//
// Fidelity (documented in docs/server-functions.md "Testing & preview"):
//  - Capabilities are enforced EXACTLY as declared in the manifest `def` — pass the def
//    itself so "tested" can't drift from "declared".
//  - `ctx.sl` delegates to an impl you inject: your live SDK for real reads/writes, or
//    omit it for pure unit tests (methods return a stub result instead of hitting the
//    network — control flow + capability enforcement still run).
//  - `ctx.secrets` are FIXTURES you provide; real sealed secrets are server-only and
//    never resolvable locally.
//  - `ctx.fetch` is gated by the `network` capability just like production.
export class CapabilityError extends Error {
    constructor(capability, message) {
        super(message || `capability not granted: ${capability}`);
        this.code = 'CAPABILITY_DENIED';
        this.name = 'CapabilityError';
        this.capability = capability;
    }
}
// The SAME grammar the server enforces (prove server/services/functions/validate.js).
function parseCapabilities(list = []) {
    const sl = new Set();
    const secrets = new Set();
    const networkHosts = new Set();
    let networkAll = false;
    for (const raw of list || []) {
        const cap = String(raw || '').trim();
        if (!cap)
            continue;
        if (cap === 'network') {
            networkAll = true;
            continue;
        }
        if (cap.startsWith('network:')) {
            networkHosts.add(cap.slice(8).toLowerCase());
            continue;
        }
        if (cap.startsWith('secrets:')) {
            secrets.add(cap.slice(8));
            continue;
        }
        if (cap.startsWith('sl:')) {
            sl.add(cap.slice(3));
            continue;
        }
    }
    return { sl, secrets, networkAll, networkHosts };
}
function allowsSl(p, resource, op) {
    if (p.sl.has(`${resource}:${op}`))
        return true;
    if (op === 'read' && p.sl.has(`${resource}:write`))
        return true; // write implies read
    return false;
}
const stub = (method, args) => ({ __stub: true, method, args });
/**
 * Build a capability-enforcing test ctx for a server function. Run your handler with it:
 *
 *   const ctx = createFunctionTestContext({ def, caller: { userId: 'me' }, secrets: { k: 'v' } })
 *   const result = await myHandler(ctx, { method: 'POST', body: { … } })
 *
 * A ctx.sl / ctx.secrets / ctx.fetch call not covered by `def.capabilities` throws
 * CapabilityError — exactly as it would in production.
 */
export function createFunctionTestContext(opts) {
    var _a, _b, _c, _d;
    const def = opts.def || {};
    const parsed = parseCapabilities(def.capabilities || []);
    const impl = opts.sl || {};
    const logs = [];
    const gated = (resource, op, fn, name) => async (...args) => {
        if (!allowsSl(parsed, resource, op))
            throw new CapabilityError(`sl:${resource}:${op}`);
        return fn ? fn(...args) : stub(`${resource}.${name}`, args);
    };
    const ar = impl.appRecords || {};
    const pr = impl.products || {};
    const at = impl.attestations || {};
    const sl = {
        appRecords: {
            create: gated('records', 'write', ar.create && ar.create.bind(ar), 'create'),
            update: gated('records', 'write', ar.update && ar.update.bind(ar), 'update'),
            upsert: gated('records', 'write', ar.upsert && ar.upsert.bind(ar), 'upsert'),
            delete: gated('records', 'write', ar.delete && ar.delete.bind(ar), 'delete'),
            get: gated('records', 'read', ar.get && ar.get.bind(ar), 'get'),
            query: gated('records', 'read', ar.query && ar.query.bind(ar), 'query'),
            listTypes: gated('records', 'read', ar.listTypes && ar.listTypes.bind(ar), 'listTypes'),
        },
        products: {
            get: gated('products', 'read', pr.get && pr.get.bind(pr), 'get'),
            query: gated('products', 'read', pr.query && pr.query.bind(pr), 'query'),
            create: gated('products', 'write', pr.create && pr.create.bind(pr), 'create'),
            update: gated('products', 'write', pr.update && pr.update.bind(pr), 'update'),
        },
        attestations: {
            create: gated('attestations', 'write', at.create && at.create.bind(at), 'create'),
        },
    };
    const secretsMap = opts.secrets || {};
    const baseFetch = opts.fetch || (typeof fetch !== 'undefined' ? fetch : undefined);
    const via = (def.trigger && def.trigger.type) || 'http';
    const caller = opts.caller || {};
    return {
        collectionId: opts.collectionId || 'test-collection',
        appId: opts.appId || 'test-app',
        sl,
        secrets: {
            async get(ref) {
                if (!parsed.secrets.has(ref))
                    throw new CapabilityError(`secrets:${ref}`);
                return Object.prototype.hasOwnProperty.call(secretsMap, ref) ? secretsMap[ref] : null;
            },
        },
        caller: {
            userId: (_a = caller.userId) !== null && _a !== void 0 ? _a : null,
            anonymous: (_b = caller.anonymous) !== null && _b !== void 0 ? _b : !caller.userId,
            origin: (_c = caller.origin) !== null && _c !== void 0 ? _c : null,
            ip: (_d = caller.ip) !== null && _d !== void 0 ? _d : null,
            via,
        },
        fetch: (async (input, init) => {
            let host = '';
            try {
                host = new URL(typeof input === 'string' ? input : input.url).host;
            }
            catch ( /* bad URL → denied */_a) { /* bad URL → denied */ }
            const allowed = parsed.networkAll || (!!host && parsed.networkHosts.has(host.toLowerCase()));
            if (!allowed)
                throw new CapabilityError(host ? `network:${host}` : 'network');
            if (!baseFetch)
                throw new Error('fetch is not available in this environment; pass opts.fetch');
            return baseFetch(input, init);
        }),
        log: (message, data) => {
            logs.push(Object.assign({ at: new Date().toISOString(), message: String(message) }, (data ? { data } : {})));
        },
        logs,
    };
}
