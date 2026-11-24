import type { Booking, BookingSlot, BookingAllocation, CreateBookingInput, UpdateBookingInput, MoveBookingInput, BookingListOptions, CreateSlotInput, UpdateSlotInput, SlotListOptions, CreateBlockInput, BlockListOptions, FreeBusyQuery, FreeBusyResponse, BookingAccessOptions, MessageBookersInput, MessageBookersResult } from '../types/bookings.js';
import type { ListResult } from '../types/list.js';
export declare namespace bookings {
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
    function create(collectionId: string, appId: string, input: CreateBookingInput, admin?: boolean): Promise<Booking>;
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
    function list(collectionId: string, appId: string, params?: BookingListOptions, admin?: boolean): Promise<ListResult<Booking>>;
    /**
     * The signed-in caller's own bookings (public), a page at a time. Takes the same options as
     * {@link list}, except `contactId`. GET /bookings/mine
     *
     * @example
     * ```typescript
     * const { items, nextCursor, count } = await bookings.mine(collectionId, appId, { from: new Date(), orderBy: [{ startsAt: 'asc' }], limit: 20 })
     * ```
     */
    function mine(collectionId: string, appId: string, params?: Omit<BookingListOptions, 'contactId'>): Promise<ListResult<Booking>>;
    /**
     * Get one booking. Public: the signed-in booker, or a guest passing `{ editToken }`.
     * GET /bookings/:bookingId
     */
    function get(collectionId: string, appId: string, bookingId: string, admin?: boolean, opts?: BookingAccessOptions): Promise<Booking>;
    /** Update zones and descriptive fields (admin). PATCH /bookings/:bookingId */
    function update(collectionId: string, appId: string, bookingId: string, input: UpdateBookingInput, admin?: boolean): Promise<Booking>;
    /**
     * held / pending / waitlisted → confirmed (idempotent). A held booking whose hold has run out fails
     * with HOLD_EXPIRED. Public: only the booker's own hold, when `ownerActions.bookings.confirm` allows.
     * POST /bookings/:bookingId/confirm
     */
    function confirm(collectionId: string, appId: string, bookingId: string, admin?: boolean, opts?: BookingAccessOptions): Promise<Booking>;
    /**
     * Cancel and give the places back (idempotent). Public: per `ownerActions.bookings.cancel` and its
     * cutoff. `reason` is admin-only (public cancels record 'owner').
     * POST /bookings/:bookingId/cancel
     */
    function cancel(collectionId: string, appId: string, bookingId: string, admin?: boolean, opts?: BookingAccessOptions & {
        reason?: string;
    }): Promise<Booking>;
    /**
     * Move to a new slot / time, all-or-nothing (a failed move leaves the booking as it was).
     * Public: per `ownerActions.bookings.move`; the create rules are re-checked for the new time.
     * POST /bookings/:bookingId/move
     */
    function move(collectionId: string, appId: string, bookingId: string, input: MoveBookingInput, admin?: boolean, opts?: BookingAccessOptions): Promise<Booking>;
    /** Extend a hold by `holdMinutes` from now (admin; capped at 24h after the booking was made). */
    function extendHold(collectionId: string, appId: string, bookingId: string, holdMinutes: number): Promise<Booking>;
    /** confirmed → completed (admin). */
    function complete(collectionId: string, appId: string, bookingId: string): Promise<Booking>;
    /** confirmed → no_show (admin). */
    function noShow(collectionId: string, appId: string, bookingId: string): Promise<Booking>;
    /**
     * Busy intervals per resource (bookings, blocks, slots' own blocks) — never booking details.
     * Public only when the app sets `publicRead.bookings.freebusy: true`.
     * GET /bookings/freebusy
     */
    function freebusy(collectionId: string, appId: string, q: FreeBusyQuery, admin?: boolean): Promise<FreeBusyResponse>;
    /**
     * Message the people booked (admin): a template to everyone on a slot, or everyone booked in a date
     * range (optionally with one person / room), each send hydrated with their booking ({{ booking }}).
     * No segment to make. POST /bookings/message
     */
    function message(collectionId: string, appId: string, input: MessageBookersInput): Promise<MessageBookersResult>;
    namespace slots {
        /** Create a slot (admin). POST /bookings/slots */
        function create(collectionId: string, appId: string, input: CreateSlotInput): Promise<BookingSlot>;
        /** Create many slots at once — a series — all-or-nothing (admin, max 500). POST /bookings/slots/batch */
        function createMany(collectionId: string, appId: string, slots: CreateSlotInput[], opts?: {
            seriesId?: string;
        }): Promise<{
            data: BookingSlot[];
        }>;
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
        function list(collectionId: string, appId: string, params?: SlotListOptions, admin?: boolean): Promise<ListResult<BookingSlot>>;
        /** GET /bookings/slots/:slotId */
        function get(collectionId: string, appId: string, slotId: string, admin?: boolean): Promise<BookingSlot>;
        /**
         * Update a slot (admin). Capacity can't drop below what's booked (SLOT_OVERBOOKED); times can't
         * change once anything is booked (SLOT_HAS_BOOKINGS).
         */
        function update(collectionId: string, appId: string, slotId: string, input: UpdateSlotInput): Promise<BookingSlot>;
        /** Delete a slot (admin; refused while places are booked). */
        function remove(collectionId: string, appId: string, slotId: string): Promise<{
            success: boolean;
        }>;
    }
    /** Blocked time on a resource with no booking — time off, a closure, maintenance (admin). */
    namespace blocks {
        function create(collectionId: string, appId: string, input: CreateBlockInput): Promise<BookingAllocation>;
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
        function list(collectionId: string, appId: string, params?: BlockListOptions): Promise<ListResult<BookingAllocation>>;
        function remove(collectionId: string, appId: string, blockId: string): Promise<{
            success: boolean;
        }>;
    }
}
