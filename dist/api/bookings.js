// src/api/bookings.ts
// Generic booking objects — see docs/bookings.md.
//
// Every function takes `admin` last (default false), like app.cases / app.records:
//   admin = true  → /admin/... — unconditional (Studio users, your app's own server functions)
//   admin = false → /public/... — governed by the app's config: publicCreate.bookings (who may book,
//                   as what status, limits, time rules), ownerActions.bookings (cancel / move /
//                   confirm afterwards) and publicRead.bookings.freebusy.
import { request, post, patch, del, requestWithOptions } from '../http.js';
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
    /** List bookings (admin). GET /bookings */
    async function list(collectionId, appId, params, admin = true) {
        return request(`${basePath(collectionId, appId, admin)}${query(params)}`);
    }
    bookings.list = list;
    /** The signed-in caller's own bookings (public). GET /bookings/mine */
    async function mine(collectionId, appId, params) {
        return request(`${basePath(collectionId, appId, false)}/mine${query(params)}`);
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
        /** List slots. Public: open, public slots only, each with `remaining`. GET /bookings/slots */
        async function list(collectionId, appId, params, admin = false) {
            return request(`${basePath(collectionId, appId, admin)}/slots${query(params)}`);
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
        async function list(collectionId, appId, params) {
            return request(`${basePath(collectionId, appId, true)}/blocks${query(params)}`);
        }
        blocks.list = list;
        async function remove(collectionId, appId, blockId) {
            return del(`${basePath(collectionId, appId, true)}/blocks/${encodeURIComponent(blockId)}`);
        }
        blocks.remove = remove;
    })(blocks = bookings.blocks || (bookings.blocks = {}));
})(bookings || (bookings = {}));
