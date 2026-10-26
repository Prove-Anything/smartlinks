// src/testing/bookingsMemory.ts
//
// In-memory ctx.sl.bookings for the server-function test harness — the platform's booking rules,
// small enough to read: slot capacity, per-person limits, no overlapping exclusive time, idempotent
// creates, holds that expire, all-or-nothing writes. Each operation checks and writes without an
// `await` in between, so concurrent calls in one test behave like the database: of ten requests for
// the last seat, exactly one wins. Errors carry the platform's `code` / `status` / `details`.
export function createBookingsMemory() {
    return { slots: [], bookings: [], allocations: [] };
}
const ACTIVE = new Set(['held', 'pending', 'confirmed', 'completed', 'no_show']);
function fail(code, message, status = 409, details) {
    throw Object.assign(new Error(message), Object.assign({ code, status }, (details ? { details } : {})));
}
const ms = (v) => (v instanceof Date ? v.getTime() : new Date(v).getTime());
const iso = (t) => new Date(t).toISOString();
const overlaps = (a, b) => ms(a.startsAt) < ms(b.endsAt) && ms(b.startsAt) < ms(a.endsAt);
const copy = (v) => JSON.parse(JSON.stringify(v));
const page = (all, params = {}) => {
    const limit = Math.min(Number(params.limit) || 25, 100);
    const offset = Number(params.offset) || 0;
    const data = all.slice(offset, offset + limit).map(copy);
    return { data, pagination: { total: all.length, limit, offset, hasMore: offset + data.length < all.length } };
};
export function bookingsMemoryImpl(mem, caller = {}) {
    let seq = 1;
    const id = (p) => `${p}-${seq++}-${Math.random().toString(36).slice(2, 8)}`;
    const now = () => Date.now();
    const slotOf = (slotId) => mem.slots.find((s) => s.id === slotId && !s.deletedAt);
    const withAllocations = (b) => (Object.assign(Object.assign({}, b), { allocations: mem.allocations.filter((a) => a.bookingId === b.id) }));
    const remaining = (s) => Math.max(0, s.capacity - s.booked);
    const slotView = (s) => copy(Object.assign(Object.assign({}, s), { remaining: remaining(s) }));
    // Turn a request into claims (same forms as the platform).
    function claimsOf(input) {
        var _a, _b, _c, _d;
        const quantity = input.quantity == null ? 1 : Number(input.quantity);
        if (!Number.isInteger(quantity) || quantity < 1)
            fail('BAD_REQUEST', 'quantity must be a positive integer', 400);
        const raw = Array.isArray(input.allocations) && input.allocations.length ? input.allocations : [{
                slotId: input.slotId, quantity,
                resourceType: (_a = input.resourceType) !== null && _a !== void 0 ? _a : (_b = input.resource) === null || _b === void 0 ? void 0 : _b.type, resourceId: (_c = input.resourceId) !== null && _c !== void 0 ? _c : (_d = input.resource) === null || _d === void 0 ? void 0 : _d.id,
            }];
        return raw.map((c) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            if (c.slotId)
                return { kind: 'capacity', slotId: c.slotId, quantity: c.quantity == null ? quantity : Number(c.quantity) };
            const startsAt = (_a = c.startsAt) !== null && _a !== void 0 ? _a : input.startsAt;
            const endsAt = (_b = c.endsAt) !== null && _b !== void 0 ? _b : input.endsAt;
            if (!((_c = c.resourceType) !== null && _c !== void 0 ? _c : (_d = c.resource) === null || _d === void 0 ? void 0 : _d.type) || !((_e = c.resourceId) !== null && _e !== void 0 ? _e : (_f = c.resource) === null || _f === void 0 ? void 0 : _f.id))
                fail('BAD_REQUEST', 'A booking needs a slotId or a resource and a time', 400);
            if (!startsAt || !endsAt || ms(endsAt) <= ms(startsAt))
                fail('BAD_REQUEST', 'startsAt and endsAt are required, with endsAt after startsAt', 400);
            const before = ((_h = (_g = c.bufferBefore) !== null && _g !== void 0 ? _g : input.bufferBefore) !== null && _h !== void 0 ? _h : 0) * 60000;
            const after = ((_k = (_j = c.bufferAfter) !== null && _j !== void 0 ? _j : input.bufferAfter) !== null && _k !== void 0 ? _k : 0) * 60000;
            return {
                kind: 'exclusive', resourceType: String((_l = c.resourceType) !== null && _l !== void 0 ? _l : (_m = c.resource) === null || _m === void 0 ? void 0 : _m.type), resourceId: String((_o = c.resourceId) !== null && _o !== void 0 ? _o : (_p = c.resource) === null || _p === void 0 ? void 0 : _p.id),
                startsAt: iso(ms(startsAt)), endsAt: iso(ms(endsAt)), blockStartsAt: iso(ms(startsAt) - before), blockEndsAt: iso(ms(endsAt) + after),
            };
        });
    }
    // Check every claim, then write them all — all-or-nothing, with no await in between.
    function claimAll(bookingId, claims, contactId, active, ignoreBookingId) {
        const writes = [];
        const out = [];
        for (const c of claims) {
            if (c.kind === 'capacity') {
                const s = slotOf(c.slotId);
                if (!s)
                    fail('NOT_FOUND', 'Slot not found', 404);
                if (active) {
                    if (s.status !== 'open')
                        fail('SLOT_CLOSED', 'This slot is not taking bookings', 409, { slotId: s.id });
                    if (s.booked + c.quantity > s.capacity)
                        fail('SLOT_FULL', 'Not enough places left on this slot', 409, { slotId: s.id, remaining: remaining(s) });
                    if (s.perContactLimit) {
                        if (c.quantity > s.perContactLimit)
                            fail('PER_CONTACT_LIMIT', `At most ${s.perContactLimit} per person on this slot`, 409, { slotId: s.id, limit: s.perContactLimit });
                        if (contactId) {
                            const held = mem.allocations.filter((a) => a.slotId === s.id && a.active && a.mode === 'capacity' && a.bookingId !== ignoreBookingId &&
                                mem.bookings.find((b) => b.id === a.bookingId && b.contactId === contactId)).reduce((n, a) => n + a.quantity, 0);
                            if (held + c.quantity > s.perContactLimit)
                                fail('PER_CONTACT_LIMIT', `At most ${s.perContactLimit} per person on this slot`, 409, { slotId: s.id, limit: s.perContactLimit, held });
                        }
                    }
                    writes.push(() => { s.booked += c.quantity; });
                }
                out.push({ bookingId, slotId: s.id, resourceType: 'slot', resourceId: s.id, startsAt: s.startsAt, endsAt: s.endsAt, quantity: c.quantity, mode: 'capacity', active, visible: [s.startsAt, s.endsAt] });
            }
            else {
                const a = { bookingId, slotId: null, resourceType: c.resourceType, resourceId: c.resourceId, startsAt: c.blockStartsAt, endsAt: c.blockEndsAt, quantity: 1, mode: 'exclusive', active, visible: [c.startsAt, c.endsAt] };
                if (active) {
                    const clash = [...mem.allocations, ...out].find((x) => x.active && x.mode === 'exclusive' && x.bookingId !== ignoreBookingId &&
                        x.resourceType === a.resourceType && x.resourceId === a.resourceId && overlaps(x, a));
                    if (clash)
                        fail('RESOURCE_TAKEN', 'That time is no longer free', 409, { resourceType: a.resourceType, resourceId: a.resourceId, startsAt: a.startsAt, endsAt: a.endsAt });
                }
                out.push(a);
            }
        }
        for (const w of writes)
            w();
        let minStart = null;
        let maxEnd = null;
        for (const a of out) {
            const [s, e] = a.visible;
            delete a.visible;
            if (!minStart || ms(s) < ms(minStart))
                minStart = s;
            if (!maxEnd || ms(e) > ms(maxEnd))
                maxEnd = e;
            mem.allocations.push(Object.assign({ id: id('alloc'), data: {}, sourceSystem: null }, a));
        }
        return { startsAt: minStart, endsAt: maxEnd };
    }
    function release(b, remove = false) {
        for (const a of mem.allocations.filter((x) => x.bookingId === b.id)) {
            if (a.active && a.mode === 'capacity') {
                const s = mem.slots.find((x) => x.id === a.slotId);
                if (s)
                    s.booked = Math.max(0, s.booked - a.quantity);
            }
            a.active = false;
        }
        if (remove)
            mem.allocations = mem.allocations.filter((x) => x.bookingId !== b.id);
    }
    const find = (bookingId) => {
        const b = mem.bookings.find((x) => x.id === bookingId && !x.deletedAt);
        if (!b)
            fail('NOT_FOUND', 'Booking not found', 404);
        return b;
    };
    const holdLapsed = (b) => b.status === 'held' && b.holdExpiresAt && ms(b.holdExpiresAt) < now();
    return {
        async create(input = {}) {
            var _a;
            const status = input.status || 'confirmed';
            if (!['held', 'pending', 'confirmed', 'waitlisted'].includes(status))
                fail('BAD_REQUEST', 'status must be held, pending, confirmed or waitlisted', 400);
            if (input.idempotencyKey) {
                const prior = mem.bookings.find((b) => b.idempotencyKey === String(input.idempotencyKey));
                if (prior)
                    return Object.assign(Object.assign({}, copy(withAllocations(prior))), { replayed: true });
            }
            const claims = claimsOf(input);
            const bookingId = id('booking');
            const contactId = input.contactId || null;
            const visible = claimAll(bookingId, claims, contactId, status !== 'waitlisted');
            const b = {
                id: bookingId, status, contactId, visibility: input.visibility || 'owner',
                startsAt: input.startsAt ? iso(ms(input.startsAt)) : visible.startsAt, endsAt: input.endsAt ? iso(ms(input.endsAt)) : visible.endsAt,
                timezone: input.timezone || null, quantity: input.quantity == null ? 1 : Number(input.quantity),
                holdExpiresAt: status === 'held' ? iso(now() + ((_a = input.holdMinutes) !== null && _a !== void 0 ? _a : 15) * 60000) : null,
                flags: [], cancelReason: null, idempotencyKey: input.idempotencyKey ? String(input.idempotencyKey) : null,
                ref: input.ref || null, customId: input.customId || null, productId: input.productId || null,
                data: input.data || {}, owner: input.owner || {}, admin: input.admin || {},
                createdAt: iso(now()), updatedAt: iso(now()), cancelledAt: null,
            };
            mem.bookings.push(b);
            return Object.assign(Object.assign({}, copy(withAllocations(b))), { replayed: false });
        },
        async get(bookingId) {
            const b = mem.bookings.find((x) => x.id === bookingId && !x.deletedAt);
            return b ? copy(withAllocations(b)) : null;
        },
        async query(params = {}) {
            let all = mem.bookings.filter((b) => !b.deletedAt);
            if (params.status) {
                const s = String(params.status).split(',');
                all = all.filter((b) => s.includes(b.status));
            }
            if (params.contactId)
                all = all.filter((b) => b.contactId === params.contactId);
            if (params.slotId)
                all = all.filter((b) => mem.allocations.some((a) => a.bookingId === b.id && a.slotId === params.slotId));
            if (params.from)
                all = all.filter((b) => ms(b.endsAt) > ms(params.from));
            if (params.to)
                all = all.filter((b) => ms(b.startsAt) < ms(params.to));
            all.sort((a, b) => ms(a.startsAt) - ms(b.startsAt));
            return page(all.map(withAllocations), params);
        },
        async mine(params = {}) {
            if (!caller.contactId)
                return { data: [], pagination: { total: 0, limit: 0, offset: 0, hasMore: false } };
            return this.query(Object.assign(Object.assign({}, params), { contactId: caller.contactId }));
        },
        async update(bookingId, fields = {}) {
            const b = find(bookingId);
            for (const k of ['data', 'owner', 'admin', 'visibility', 'ref', 'timezone', 'productId', 'contactId', 'customId', 'flags'])
                if (fields[k] !== undefined)
                    b[k] = fields[k];
            b.updatedAt = iso(now());
            return copy(withAllocations(b));
        },
        async confirm(bookingId) {
            const b = find(bookingId);
            if (b.status === 'confirmed')
                return copy(withAllocations(b));
            if (!['held', 'pending', 'waitlisted'].includes(b.status))
                fail('INVALID_STATE', `A ${b.status} booking can't be confirmed`, 409, { status: b.status });
            if (holdLapsed(b))
                fail('HOLD_EXPIRED', 'The hold on this booking has run out');
            if (b.status === 'waitlisted') {
                const old = mem.allocations.filter((a) => a.bookingId === b.id);
                const claims = old.map((a) => a.mode === 'capacity'
                    ? { kind: 'capacity', slotId: a.slotId, quantity: a.quantity }
                    : { kind: 'exclusive', resourceType: a.resourceType, resourceId: a.resourceId, startsAt: a.startsAt, endsAt: a.endsAt, blockStartsAt: a.startsAt, blockEndsAt: a.endsAt });
                mem.allocations = mem.allocations.filter((a) => a.bookingId !== b.id);
                try {
                    claimAll(b.id, claims, b.contactId, true);
                }
                catch (e) {
                    mem.allocations.push(...old);
                    throw e;
                }
            }
            b.status = 'confirmed';
            b.holdExpiresAt = null;
            b.updatedAt = iso(now());
            return copy(withAllocations(b));
        },
        async cancel(bookingId, opts = {}) {
            const b = find(bookingId);
            if (b.status === 'cancelled')
                return copy(withAllocations(b));
            if (!['held', 'pending', 'confirmed', 'waitlisted'].includes(b.status))
                fail('INVALID_STATE', `A ${b.status} booking can't be cancelled`, 409, { status: b.status });
            release(b);
            b.status = 'cancelled';
            b.cancelReason = opts.reason || 'admin';
            b.cancelledAt = iso(now());
            b.holdExpiresAt = null;
            return copy(withAllocations(b));
        },
        async move(bookingId, input = {}) {
            const b = find(bookingId);
            if (!['held', 'pending', 'confirmed'].includes(b.status))
                fail('INVALID_STATE', `A ${b.status} booking can't be moved`, 409, { status: b.status });
            if (holdLapsed(b))
                fail('HOLD_EXPIRED', 'The hold on this booking has run out');
            const claims = claimsOf(Object.assign({ quantity: b.quantity }, input));
            // Check against everything except this booking's own claims; only then release + claim.
            const own = mem.allocations.filter((a) => a.bookingId === b.id);
            const freedSeats = new Map();
            for (const a of own)
                if (a.active && a.mode === 'capacity')
                    freedSeats.set(a.slotId, (freedSeats.get(a.slotId) || 0) + a.quantity);
            for (const [slotId, n] of freedSeats) {
                const s = mem.slots.find((x) => x.id === slotId);
                if (s)
                    s.booked -= n;
            }
            try {
                const visible = claimAll(b.id + ':move', claims, b.contactId, true, b.id);
                mem.allocations = mem.allocations.filter((a) => a.bookingId !== b.id);
                for (const a of mem.allocations)
                    if (a.bookingId === b.id + ':move')
                        a.bookingId = b.id;
                b.startsAt = input.startsAt ? iso(ms(input.startsAt)) : visible.startsAt;
                b.endsAt = input.endsAt ? iso(ms(input.endsAt)) : visible.endsAt;
                b.updatedAt = iso(now());
            }
            catch (e) {
                for (const [slotId, n] of freedSeats) {
                    const s = mem.slots.find((x) => x.id === slotId);
                    if (s)
                        s.booked += n;
                }
                throw e;
            }
            return copy(withAllocations(b));
        },
        async extendHold(bookingId, holdMinutes) {
            const b = find(bookingId);
            if (b.status !== 'held')
                fail('INVALID_STATE', 'Only a held booking has a hold to extend', 409, { status: b.status });
            if (holdLapsed(b))
                fail('HOLD_EXPIRED', 'The hold on this booking has run out');
            b.holdExpiresAt = iso(Math.min(now() + (holdMinutes !== null && holdMinutes !== void 0 ? holdMinutes : 15) * 60000, ms(b.createdAt) + 24 * 3600000));
            return copy(withAllocations(b));
        },
        /** Counts who would be messaged (no sends in memory); inject `sl.bookings.message` to assert sends. */
        async message(input = {}) {
            const list = input.slotId
                ? (await this.query({ slotId: input.slotId, status: (input.statuses || ['held', 'pending', 'confirmed']).join(',') })).data
                : (await this.query({ from: input.from, to: input.to, status: (input.statuses || ['held', 'pending', 'confirmed']).join(',') })).data;
            const seen = new Set();
            const out = { matched: list.length, sent: 0, skipped: { noContact: 0, duplicate: 0, failed: 0 }, failures: [] };
            for (const b of list) {
                if (!b.contactId) {
                    out.skipped.noContact++;
                    continue;
                }
                const key = input.slotId ? b.contactId : `${b.contactId}:${b.id}`;
                if (seen.has(key)) {
                    out.skipped.duplicate++;
                    continue;
                }
                seen.add(key);
                out.sent++;
            }
            return out;
        },
        async complete(bookingId) { return outcome(find(bookingId), 'completed'); },
        async noShow(bookingId) { return outcome(find(bookingId), 'no_show'); },
        async freebusy(q = {}) {
            const refs = (q.resources || []).map((r) => (typeof r === 'string' ? { type: r.slice(0, r.indexOf(':')), id: r.slice(r.indexOf(':') + 1) } : r));
            return {
                from: iso(ms(q.from)), to: iso(ms(q.to)),
                resources: refs.map((r) => {
                    const busy = mem.allocations
                        .filter((a) => a.active && a.mode === 'exclusive' && a.resourceType === r.type && a.resourceId === r.id && overlaps(a, { startsAt: q.from, endsAt: q.to }))
                        .map((a) => ({ start: Math.max(ms(a.startsAt), ms(q.from)), end: Math.min(ms(a.endsAt), ms(q.to)) }))
                        .sort((a, b) => a.start - b.start);
                    const merged = [];
                    for (const x of busy) {
                        const l = merged[merged.length - 1];
                        if (l && x.start <= l.end)
                            l.end = Math.max(l.end, x.end);
                        else
                            merged.push(Object.assign({}, x));
                    }
                    return { resourceType: r.type, resourceId: r.id, busy: merged.map((x) => ({ start: iso(x.start), end: iso(x.end) })) };
                }),
            };
        },
        slots: {
            async create(input = {}) {
                var _a, _b, _c, _d, _e, _f, _g;
                if (!input.startsAt || !input.endsAt || ms(input.endsAt) <= ms(input.startsAt))
                    fail('BAD_REQUEST', 'startsAt and endsAt are required, with endsAt after startsAt', 400);
                const s = {
                    id: id('slot'), startsAt: iso(ms(input.startsAt)), endsAt: iso(ms(input.endsAt)), capacity: Number(input.capacity), booked: 0,
                    perContactLimit: (_a = input.perContactLimit) !== null && _a !== void 0 ? _a : null, status: input.status || 'open', visibility: input.visibility || 'public',
                    resourceType: (_b = input.resourceType) !== null && _b !== void 0 ? _b : null, resourceId: (_c = input.resourceId) !== null && _c !== void 0 ? _c : null, seriesId: (_d = input.seriesId) !== null && _d !== void 0 ? _d : null,
                    timezone: (_e = input.timezone) !== null && _e !== void 0 ? _e : null, ref: (_f = input.ref) !== null && _f !== void 0 ? _f : null, productId: (_g = input.productId) !== null && _g !== void 0 ? _g : null,
                    data: input.data || {}, owner: input.owner || {}, admin: input.admin || {}, createdAt: iso(now()), deletedAt: null,
                };
                if (input.blockResource) {
                    if (!s.resourceType || !s.resourceId)
                        fail('BAD_REQUEST', 'blockResource needs resourceType + resourceId', 400);
                    claimAll(null, [{ kind: 'exclusive', resourceType: s.resourceType, resourceId: s.resourceId, startsAt: s.startsAt, endsAt: s.endsAt, blockStartsAt: s.startsAt, blockEndsAt: s.endsAt }], null, true);
                    mem.allocations[mem.allocations.length - 1].slotId = s.id;
                }
                mem.slots.push(s);
                return slotView(s);
            },
            async createMany(inputs, opts = {}) {
                const out = [];
                for (const i of inputs || [])
                    out.push(await this.create(Object.assign({ seriesId: opts.seriesId }, i)));
                return out;
            },
            async get(slotId) { const s = slotOf(slotId); return s ? slotView(s) : null; },
            async query(params = {}) {
                let all = mem.slots.filter((s) => !s.deletedAt);
                if (params.status)
                    all = all.filter((s) => s.status === params.status);
                if (params.available === true || params.available === 'true')
                    all = all.filter((s) => s.booked < s.capacity);
                if (params.from)
                    all = all.filter((s) => ms(s.endsAt) > ms(params.from));
                if (params.to)
                    all = all.filter((s) => ms(s.startsAt) < ms(params.to));
                all.sort((a, b) => ms(a.startsAt) - ms(b.startsAt));
                return page(all.map((s) => (Object.assign(Object.assign({}, s), { remaining: remaining(s) }))), params);
            },
            async update(slotId, fields = {}) {
                const s = slotOf(slotId);
                if (!s)
                    fail('NOT_FOUND', 'Slot not found', 404);
                if (fields.capacity !== undefined && Number(fields.capacity) < s.booked)
                    fail('SLOT_OVERBOOKED', `${s.booked} places are already booked`, 409, { booked: s.booked });
                if ((fields.startsAt || fields.endsAt) && s.booked > 0)
                    fail('SLOT_HAS_BOOKINGS', 'Move or cancel the bookings before changing the slot time', 409, { booked: s.booked });
                for (const k of ['capacity', 'perContactLimit', 'status', 'visibility', 'timezone', 'ref', 'productId', 'data', 'owner', 'admin'])
                    if (fields[k] !== undefined)
                        s[k] = fields[k];
                if (fields.startsAt)
                    s.startsAt = iso(ms(fields.startsAt));
                if (fields.endsAt)
                    s.endsAt = iso(ms(fields.endsAt));
                return slotView(s);
            },
            async delete(slotId) {
                const s = slotOf(slotId);
                if (!s)
                    fail('NOT_FOUND', 'Slot not found', 404);
                if (s.booked > 0)
                    fail('SLOT_HAS_BOOKINGS', 'Cancel the bookings before deleting the slot', 409, { booked: s.booked });
                s.deletedAt = iso(now());
                s.status = 'cancelled';
                mem.allocations = mem.allocations.filter((a) => !(a.slotId === s.id && a.bookingId === null));
                return { success: true };
            },
        },
        blocks: {
            async create(input = {}) {
                if (!input.resourceType || !input.resourceId)
                    fail('BAD_REQUEST', 'resourceType and resourceId are required', 400);
                if (!input.startsAt || !input.endsAt || ms(input.endsAt) <= ms(input.startsAt))
                    fail('BAD_REQUEST', 'startsAt and endsAt are required, with endsAt after startsAt', 400);
                const s = iso(ms(input.startsAt)), e = iso(ms(input.endsAt));
                claimAll(null, [{ kind: 'exclusive', resourceType: String(input.resourceType), resourceId: String(input.resourceId), startsAt: s, endsAt: e, blockStartsAt: s, blockEndsAt: e }], null, true);
                const a = mem.allocations[mem.allocations.length - 1];
                a.data = input.data || {};
                return copy(a);
            },
            async query(params = {}) {
                let all = mem.allocations.filter((a) => a.bookingId === null && a.slotId === null);
                if (params.resourceType)
                    all = all.filter((a) => a.resourceType === params.resourceType);
                if (params.resourceId)
                    all = all.filter((a) => a.resourceId === params.resourceId);
                return page(all, params);
            },
            async delete(blockId) {
                const before = mem.allocations.length;
                mem.allocations = mem.allocations.filter((a) => !(a.id === blockId && a.bookingId === null && a.slotId === null));
                if (mem.allocations.length === before)
                    fail('NOT_FOUND', 'Block not found', 404);
                return { success: true };
            },
        },
    };
    function outcome(b, to) {
        if (b.status === to)
            return copy(withAllocations(b));
        if (b.status !== 'confirmed')
            fail('INVALID_STATE', `Only a confirmed booking can be marked ${to}`, 409, { status: b.status });
        b.status = to;
        return copy(withAllocations(b));
    }
}
