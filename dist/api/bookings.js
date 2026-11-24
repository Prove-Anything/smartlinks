// src/api/bookings.ts
// Generic booking objects — see docs/bookings.md.
//
// Every function takes `admin` last (default false), like app.cases / app.records:
//   admin = true  → /admin/... — unconditional (Studio users, your app's own server functions)
//   admin = false → /public/... — governed by the app's config: publicCreate.bookings (who may book,
//                   as what status, limits, time rules), ownerActions.bookings (cancel / move /
//                   confirm afterwards) and publicRead.bookings.freebusy.
import { request, post, patch, del, requestWithOptions } from '../http.js';
import { listQuery } from '../list.js';
function basePath(collectionId, appId, admin) {
    const zone = admin ? 'admin' : 'public';
    return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/bookings`;
}
function query(params) {
    if (!params)
        return '';
    const parts = [];
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null)
            continue;
        const v = value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.join(',') : String(value);
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
    }
    return parts.length ? `?${parts.join('&')}` : '';
}
function tokenHeaders(opts) {
    return (opts === null || opts === void 0 ? void 0 : opts.editToken) ? { 'X-Edit-Token': opts.editToken } : undefined;
}
function refString(r) {
    return typeof r === 'string' ? r : `${r.type}:${r.id}`;
}
export var bookings;
(function (bookings) {
    /**
     * Book. All claims succeed together or nothing is written; a clash fails with 409
     * (`SLOT_FULL`, `RESOURCE_TAKEN`, `PER_CONTACT_LIMIT`, …). Pass `idempotencyKey` so a retry never
     * books twice.
     *
     * Public (admin = false): the app's `publicCreate.bookings` rules decide the status and limits; an
     * anonymous guest may get `editToken` back (once) to manage the booking later.
     *
     * POST /bookings
     */
    async function create(collectionId, appId, input, admin = false) {
        return post(basePath(collectionId, appId, admin), input);
    }
    bookings.create = create;
    /**
     * List bookings (admin), a page at a time. `count` is how many match in all. `from` / `to` pick
     * the bookings overlapping that time; `orderBy` sorts (earliest start first unless you say). There
     * is no public list: a signed-in booker uses {@link mine}. GET /bookings
     *
     * @example
     * ```typescript
     * const from = new Date()
     * let page = await bookings.list(collectionId, appId, { status: 'confirmed', from, orderBy: [{ startsAt: 'desc' }], limit: 50 })
     * page.items      // Booking[]
     * page.count      // how many match in all
     * while (page.nextCursor) {
     *   page = await bookings.list(collectionId, appId, { status: 'confirmed', from, orderBy: [{ startsAt: 'desc' }], limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    async function list(collectionId, appId, params, admin = true) {
        return request(`${basePath(collectionId, appId, admin)}${listQuery(params)}`);
    }
    bookings.list = list;
    /**
     * The signed-in caller's own bookings (public), a page at a time. Takes the same options as
     * {@link list}, except `contactId`. GET /bookings/mine
     *
     * @example
     * ```typescript
     * const { items, nextCursor, count } = await bookings.mine(collectionId, appId, { from: new Date(), orderBy: [{ startsAt: 'asc' }], limit: 20 })
     * ```
     */
    async function mine(collectionId, appId, params) {
        return request(`${basePath(collectionId, appId, false)}/mine${listQuery(params)}`);
    }
    bookings.mine = mine;
    /**
     * Get one booking. Public: the signed-in booker, or a guest passing `{ editToken }`.
     * GET /bookings/:bookingId
     */
    async function get(collectionId, appId, bookingId, admin = false, opts) {
        const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}`;
        const headers = tokenHeaders(opts);
        return headers ? requestWithOptions(path, { method: 'GET', headers }) : request(path);
    }
    bookings.get = get;
    /** Update zones and descriptive fields (admin). PATCH /bookings/:bookingId */
    async function update(collectionId, appId, bookingId, input, admin = true) {
        return patch(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}`, input);
    }
    bookings.update = update;
    /**
     * held / pending / waitlisted → confirmed (idempotent). A held booking whose hold has run out fails
     * with HOLD_EXPIRED. Public: only the booker's own hold, when `ownerActions.bookings.confirm` allows.
     * POST /bookings/:bookingId/confirm
     */
    async function confirm(collectionId, appId, bookingId, admin = false, opts) {
        return post(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}/confirm`, {}, tokenHeaders(opts));
    }
    bookings.confirm = confirm;
    /**
     * Cancel and give the places back (idempotent). Public: per `ownerActions.bookings.cancel` and its
     * cutoff. `reason` is admin-only (public cancels record 'owner').
     * POST /bookings/:bookingId/cancel
     */
    async function cancel(collectionId, appId, bookingId, admin = false, opts) {
        return post(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}/cancel`, (opts === null || opts === void 0 ? void 0 : opts.reason) ? { reason: opts.reason } : {}, tokenHeaders(opts));
    }
    bookings.cancel = cancel;
    /**
     * Move to a new slot / time, all-or-nothing (a failed move leaves the booking as it was).
     * Public: per `ownerActions.bookings.move`; the create rules are re-checked for the new time.
     * POST /bookings/:bookingId/move
     */
    async function move(collectionId, appId, bookingId, input, admin = false, opts) {
        return post(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}/move`, input, tokenHeaders(opts));
    }
    bookings.move = move;
    /** Extend a hold by `holdMinutes` from now (admin; capped at 24h after the booking was made). */
    async function extendHold(collectionId, appId, bookingId, holdMinutes) {
        return post(`${basePath(collectionId, appId, true)}/${encodeURIComponent(bookingId)}/extend-hold`, { holdMinutes });
    }
    bookings.extendHold = extendHold;
    /** confirmed → completed (admin). */
    async function complete(collectionId, appId, bookingId) {
        return post(`${basePath(collectionId, appId, true)}/${encodeURIComponent(bookingId)}/complete`, {});
    }
    bookings.complete = complete;
    /** confirmed → no_show (admin). */
    async function noShow(collectionId, appId, bookingId) {
        return post(`${basePath(collectionId, appId, true)}/${encodeURIComponent(bookingId)}/no-show`, {});
    }
    bookings.noShow = noShow;
    /**
     * Busy intervals per resource (bookings, blocks, slots' own blocks) — never booking details.
     * Public only when the app sets `publicRead.bookings.freebusy: true`.
     * GET /bookings/freebusy
     */
    async function freebusy(collectionId, appId, q, admin = false) {
        const params = { resources: q.resources.map(refString).join(','), from: q.from, to: q.to };
        return request(`${basePath(collectionId, appId, admin)}/freebusy${query(params)}`);
    }
    bookings.freebusy = freebusy;
    /**
     * Message the people booked (admin): a template to everyone on a slot, or everyone booked in a date
     * range (optionally with one person / room), each send hydrated with their booking ({{ booking }}).
     * No segment to make. POST /bookings/message
     */
    async function message(collectionId, appId, input) {
        return post(`${basePath(collectionId, appId, true)}/message`, input);
    }
    bookings.message = message;
    // ==================== SLOTS ====================
    let slots;
    (function (slots_1) {
        /** Create a slot (admin). POST /bookings/slots */
        async function create(collectionId, appId, input) {
            return post(`${basePath(collectionId, appId, true)}/slots`, input);
        }
        slots_1.create = create;
        /** Create many slots at once — a series — all-or-nothing (admin, max 500). POST /bookings/slots/batch */
        async function createMany(collectionId, appId, slots, opts) {
            return post(`${basePath(collectionId, appId, true)}/slots/batch`, { slots, seriesId: opts === null || opts === void 0 ? void 0 : opts.seriesId });
        }
        slots_1.createMany = createMany;
        /**
         * List slots, a page at a time. Public: open, public slots only, each with `remaining`.
         * `from` / `to` pick the slots in that time; `orderBy` sorts them.
         * GET /bookings/slots
         *
         * @example
         * ```typescript
         * const { items, nextCursor, count } = await bookings.slots.list(collectionId, appId, {
         *   from, to, available: true, orderBy: [{ startsAt: 'asc' }], limit: 50,
         * })
         * ```
         */
        async function list(collectionId, appId, params, admin = false) {
            return request(`${basePath(collectionId, appId, admin)}/slots${listQuery(params)}`);
        }
        slots_1.list = list;
        /** GET /bookings/slots/:slotId */
        async function get(collectionId, appId, slotId, admin = false) {
            return request(`${basePath(collectionId, appId, admin)}/slots/${encodeURIComponent(slotId)}`);
        }
        slots_1.get = get;
        /**
         * Update a slot (admin). Capacity can't drop below what's booked (SLOT_OVERBOOKED); times can't
         * change once anything is booked (SLOT_HAS_BOOKINGS).
         */
        async function update(collectionId, appId, slotId, input) {
            return patch(`${basePath(collectionId, appId, true)}/slots/${encodeURIComponent(slotId)}`, input);
        }
        slots_1.update = update;
        /** Delete a slot (admin; refused while places are booked). */
        async function remove(collectionId, appId, slotId) {
            return del(`${basePath(collectionId, appId, true)}/slots/${encodeURIComponent(slotId)}`);
        }
        slots_1.remove = remove;
    })(slots = bookings.slots || (bookings.slots = {}));
    // ==================== BLOCKS ====================
    /** Blocked time on a resource with no booking — time off, a closure, maintenance (admin). */
    let blocks;
    (function (blocks) {
        async function create(collectionId, appId, input) {
            return post(`${basePath(collectionId, appId, true)}/blocks`, input);
        }
        blocks.create = create;
        /**
         * The blocks on a resource and/or in a date range (`from` / `to`), a page at a time (`limit`,
         * `cursor`). GET /bookings/blocks
         *
         * @example
         * ```typescript
         * const { items, nextCursor } = await bookings.blocks.list(collectionId, appId, {
         *   resourceType: 'record', resourceId: 'staff-1', from: '2026-12-01T00:00:00Z', to: '2027-01-01T00:00:00Z', limit: 50,
         * })
         * ```
         */
        async function list(collectionId, appId, params) {
            return request(`${basePath(collectionId, appId, true)}/blocks${listQuery(params)}`);
        }
        blocks.list = list;
        async function remove(collectionId, appId, blockId) {
            return del(`${basePath(collectionId, appId, true)}/blocks/${encodeURIComponent(blockId)}`);
        }
        blocks.remove = remove;
    })(blocks = bookings.blocks || (bookings.blocks = {}));
})(bookings || (bookings = {}));
