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
//  - Without an injected impl, appRecords / counters / contacts / interactions / bookings run against
//    an in-memory store with the platform's rules (claim: singletonPer + customId; contacts by
//    email/phone, fill-empty only; bookings: capacity, per-person limits, no overlapping time,
//    idempotent creates), so idempotency, "never two of the same number" and "never oversold" are
//    testable. Inspect it via `ctx.memory`.
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { bookingsMemoryImpl, createBookingsMemory } from './bookingsMemory.js';
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
/** A fresh in-memory store — pass the same one to several test contexts to simulate concurrent callers. */
export function createFunctionTestMemory() {
    return { records: [], counters: {}, contacts: [], interactions: [], bookings: createBookingsMemory() };
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
    var _a, _b, _c, _d, _e, _f, _g;
    const def = opts.def || {};
    const parsed = parseCapabilities(def.capabilities || []);
    const impl = opts.sl || {};
    const logs = [];
    const gated = (resource, op, fn, name) => async (...args) => {
        if (!allowsSl(parsed, resource, op))
            throw new CapabilityError(`sl:${resource}:${op}`);
        return fn ? fn(...args) : stub(`${resource}.${name}`, args);
    };
    const mem = opts.memory || createFunctionTestMemory();
    const ar = impl.appRecords || {};
    const pr = impl.products || {};
    const at = impl.attestations || {};
    // In-memory records with the platform's unique keys (used when no appRecords impl is injected).
    const singletonKey = (f) => {
        const t = f.recordType || 'default';
        switch (f.singletonPer) {
            case 'collection': return `${t}:collection`;
            case 'product': return f.productId ? `${t}:product:${f.productId}` : null;
            case 'variant': return f.productId && f.variantId ? `${t}:variant:${f.productId}:${f.variantId}` : null;
            case 'batch': return f.productId && f.batchId ? `${t}:batch:${f.productId}:${f.batchId}` : null;
            case 'proof': return f.proofId ? `${t}:proof:${f.proofId}` : null;
            default: return null;
        }
    };
    const customKey = (f) => {
        const c = f.customId == null ? '' : String(f.customId).trim().toLowerCase();
        return c ? [f.recordType || 'default', f.scopeType || '', f.scopeId || '', f.sourceSystem || '', c].join('|') : null;
    };
    let nextRecordId = 1;
    const memRecords = {
        create: async (fields) => {
            const rec = Object.assign({ id: `rec-${nextRecordId++}`, recordType: 'default', data: {}, admin: {}, status: 'active', createdAt: new Date().toISOString() }, fields);
            mem.records.push(rec);
            return Object.assign({}, rec);
        },
        claim: async (fields) => {
            const sk = singletonKey(fields);
            const ck = customKey(fields);
            if (fields.singletonPer && !sk)
                throw Object.assign(new Error(`claim: singletonPer "${fields.singletonPer}" needs its anchor id`), { code: 'INVALID_CLAIM' });
            if (!sk && !ck)
                throw Object.assign(new Error('claim: give the record a unique key — singletonPer (+ anchor) or customId'), { code: 'INVALID_CLAIM' });
            const bySingleton = sk ? mem.records.find((r) => !r.deletedAt && singletonKey(r) === sk) : null;
            if (bySingleton)
                return { record: Object.assign({}, bySingleton), created: false, conflict: 'singleton' };
            const byCustom = ck ? mem.records.find((r) => customKey(r) === ck) : null; // deleted records keep their customId
            if (byCustom)
                return { record: Object.assign({}, byCustom), created: false, conflict: 'customId' };
            return { record: await memRecords.create(fields), created: true };
        },
        get: async (id) => { const r = mem.records.find((x) => x.id === id); return r ? Object.assign({}, r) : null; },
        update: async (id, fields) => { const r = mem.records.find((x) => x.id === id); if (!r)
            return null; Object.assign(r, fields); return Object.assign({}, r); },
        delete: async (id) => { const r = mem.records.find((x) => x.id === id); if (r)
            r.deletedAt = new Date().toISOString(); return {}; },
        // Simple equality filter on top-level fields (recordType, proofId, customId, status, …).
        query: async (params = {}) => {
            const _a = params || {}, { limit, offset, sort } = _a, where = __rest(_a, ["limit", "offset", "sort"]);
            const all = mem.records.filter((r) => !r.deletedAt && Object.entries(where).every(([k, v]) => r[k] === v));
            const from = offset || 0;
            const size = limit || 200;
            const data = all.slice(from, from + size).map((r) => (Object.assign({}, r)));
            // Same envelope as the platform: { data, pagination }.
            return { data, pagination: { total: all.length, limit: size, offset: from, hasMore: from + data.length < all.length } };
        },
    };
    const recordsFn = (name) => ar[name] ? ar[name].bind(ar) : (impl.appRecords ? undefined : memRecords[name]);
    const sl = {
        appRecords: {
            create: gated('records', 'write', recordsFn('create'), 'create'),
            claim: gated('records', 'write', recordsFn('claim'), 'claim'),
            update: gated('records', 'write', recordsFn('update'), 'update'),
            upsert: gated('records', 'write', recordsFn('upsert'), 'upsert'),
            delete: gated('records', 'write', recordsFn('delete'), 'delete'),
            get: gated('records', 'read', recordsFn('get'), 'get'),
            query: gated('records', 'read', recordsFn('query'), 'query'),
            listTypes: gated('records', 'read', recordsFn('listTypes'), 'listTypes'),
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
    // appData — own-data (capability-gated only, no role gate). Delegates to a provided impl, else a
    // built-in in-memory store so read-modify-write (e.g. a counter) works across calls in one test.
    const ad = impl.appData || {};
    const memConfig = {};
    const memData = {};
    const deepMerge = (t, s) => { for (const k of Object.keys(s || {}))
        t[k] = (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) ? deepMerge(t[k] || {}, s[k]) : s[k]; return t; };
    const makeAppData = () => ({
        get: gated('data', 'read', ad.get ? ad.get.bind(ad) : (async () => (Object.assign({}, memConfig))), 'get'),
        set: gated('data', 'write', ad.set ? ad.set.bind(ad) : (async (data) => deepMerge(memConfig, data)), 'set'),
        getData: gated('data', 'read', ad.getData ? ad.getData.bind(ad) : (async (opts = {}) => (opts.dataId ? memData[opts.dataId] : Object.values(memData))), 'getData'),
        setData: gated('data', 'write', ad.setData ? ad.setData.bind(ad) : (async (data, opts = {}) => { if (opts.dataId)
            memData[opts.dataId] = data; return data; }), 'setData'),
        delete: gated('data', 'write', ad.delete ? ad.delete.bind(ad) : (async (opts = {}) => { if (opts.dataId)
            delete memData[opts.dataId];
        else
            for (const k of Object.keys(memConfig))
                delete memConfig[k]; }), 'delete'),
    });
    sl.appData = Object.assign(makeAppData(), { global: makeAppData(), collection: makeAppData() });
    const cn = impl.counters || {};
    sl.counters = {
        next: gated('data', 'write', cn.next ? cn.next.bind(cn) : (async (name, o = {}) => {
            var _a, _b;
            const start = (_a = o.start) !== null && _a !== void 0 ? _a : 1;
            const by = (_b = o.by) !== null && _b !== void 0 ? _b : 1;
            mem.counters[name] = mem.counters[name] == null ? start : mem.counters[name] + by;
            return mem.counters[name];
        }), 'counters.next'),
        get: gated('data', 'read', cn.get ? cn.get.bind(cn) : (async (name) => { var _a; return (_a = mem.counters[name]) !== null && _a !== void 0 ? _a : null; }), 'counters.get'),
    };
    const tg = impl.tags || {};
    sl.tags = {
        resolve: gated('tags', 'read', tg.resolve ? tg.resolve.bind(tg) : (async (id) => {
            const s = String(id || '');
            const i = s.indexOf('-');
            if (i <= 0 || i >= s.length - 1)
                return null;
            if (opts.knownTags && !opts.knownTags.includes(s))
                return null;
            return { id: s, claimSetId: s.slice(0, i), code: s.slice(i + 1) };
        }), 'tags.resolve'),
    };
    const ct = impl.contacts || {};
    const fillable = ['firstName', 'lastName', 'displayName', 'company', 'locale', 'timezone'];
    sl.contacts = {
        upsert: gated('contacts', 'write', ct.upsert ? ct.upsert.bind(ct) : (async (d = {}) => {
            const email = d.email ? String(d.email).trim().toLowerCase() : undefined;
            const phone = d.phone ? String(d.phone).replace(/[^\d+]/g, '') : undefined;
            if (!email && !phone)
                throw Object.assign(new Error('contacts.upsert: an email or phone is required'), { code: 'CONTACT_IDENTITY_REQUIRED' });
            const found = mem.contacts.find((c) => (email && c.email === email) || (phone && c.phone === phone));
            if (found) {
                for (const k of fillable)
                    if (d[k] && !found[k])
                        found[k] = d[k];
                found.customFields = Object.assign(Object.assign({}, (d.customFields || {})), (found.customFields || {}));
                return { contactId: found.contactId, created: false };
            }
            const contactId = `contact-${mem.contacts.length + 1}`;
            mem.contacts.push(Object.assign(Object.assign({}, d), { email, phone, contactId }));
            return { contactId, created: true };
        }), 'contacts.upsert'),
        forCaller: gated('contacts', 'write', ct.forCaller ? ct.forCaller.bind(ct) : (async () => (opts.caller && opts.caller.userId ? { contactId: `contact-of-${opts.caller.userId}`, email: null, phone: null, firstName: null, lastName: null, displayName: null, tags: [], customFields: {} } : null)), 'contacts.forCaller'),
    };
    const it = impl.interactions || {};
    sl.interactions = {
        record: gated('interactions', 'write', it.record ? it.record.bind(it) : (async (event = {}) => {
            if (!event.interactionId || (opts.knownInteractionTypes && !opts.knownInteractionTypes.includes(event.interactionId))) {
                throw Object.assign(new Error(`"${event.interactionId}" is not an interaction type of this app`), { code: 'INTERACTION_TYPE_NOT_FOUND' });
            }
            const eventId = `event-${mem.interactions.length + 1}`;
            mem.interactions.push(Object.assign(Object.assign({}, event), { eventId, userId: (opts.caller && opts.caller.userId) || null }));
            return { eventId };
        }), 'interactions.record'),
    };
    sl.app = (appId) => {
        const other = (impl.app && impl.app(appId)) || {};
        const od = other.data || {};
        return {
            data: {
                get: gated('data', 'read', od.get ? od.get.bind(od) : (async () => null), 'app.get'),
                getData: gated('data', 'read', od.getData ? od.getData.bind(od) : (async () => []), 'app.getData'),
            },
        };
    };
    // Bookings — an injected impl, else the in-memory engine (same rules as the platform).
    if (!mem.bookings)
        mem.bookings = createBookingsMemory(); // a memory made before bookings existed
    const callerContactId = (_b = (_a = opts.caller) === null || _a === void 0 ? void 0 : _a.contactId) !== null && _b !== void 0 ? _b : (((_c = opts.caller) === null || _c === void 0 ? void 0 : _c.userId) ? `contact-of-${opts.caller.userId}` : null);
    const bk = impl.bookings || bookingsMemoryImpl(mem.bookings, { contactId: callerContactId });
    const bkFn = (obj, name) => (obj && typeof obj[name] === 'function' ? obj[name].bind(obj) : undefined);
    const BOOKING_READS = new Set(['get', 'query', 'mine', 'freebusy']);
    sl.bookings = {};
    for (const m of ['create', 'get', 'query', 'mine', 'update', 'confirm', 'cancel', 'move', 'extendHold', 'complete', 'noShow', 'freebusy', 'message']) {
        sl.bookings[m] = gated('bookings', BOOKING_READS.has(m) ? 'read' : 'write', bkFn(bk, m), `bookings.${m}`);
    }
    sl.bookings.slots = {};
    for (const m of ['create', 'createMany', 'get', 'query', 'update', 'delete']) {
        sl.bookings.slots[m] = gated('bookings', m === 'get' || m === 'query' ? 'read' : 'write', bkFn(bk.slots, m), `bookings.slots.${m}`);
    }
    sl.bookings.blocks = {};
    for (const m of ['create', 'query', 'delete']) {
        sl.bookings.blocks[m] = gated('bookings', m === 'query' ? 'read' : 'write', bkFn(bk.blocks, m), `bookings.blocks.${m}`);
    }
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
            // App-scoped read — in tests it resolves from the same provided secrets map.
            async app(ref) {
                if (!parsed.secrets.has(ref))
                    throw new CapabilityError(`secrets:${ref}`);
                return Object.prototype.hasOwnProperty.call(secretsMap, ref) ? secretsMap[ref] : null;
            },
        },
        caller: {
            userId: (_d = caller.userId) !== null && _d !== void 0 ? _d : null,
            anonymous: (_e = caller.anonymous) !== null && _e !== void 0 ? _e : !caller.userId,
            origin: (_f = caller.origin) !== null && _f !== void 0 ? _f : null,
            ip: (_g = caller.ip) !== null && _g !== void 0 ? _g : null,
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
        inputs: Object.freeze(Object.assign({}, (opts.inputs || {}))),
        logs,
        memory: mem,
    };
}
