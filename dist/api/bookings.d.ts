import type { Booking, BookingSlot, BookingAllocation, CreateBookingInput, UpdateBookingInput, MoveBookingInput, BookingListQueryParams, CreateSlotInput, UpdateSlotInput, SlotListQueryParams, CreateBlockInput, BlockListQueryParams, FreeBusyQuery, FreeBusyResponse, BookingAccessOptions } from '../types/bookings.js';
import type { PaginatedResponse } from '../types/appObjects.js';
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
    /** List bookings (admin). GET /bookings */
    function list(collectionId: string, appId: string, params?: BookingListQueryParams, admin?: boolean): Promise<PaginatedResponse<Booking>>;
    /** The signed-in caller's own bookings (public). GET /bookings/mine */
    function mine(collectionId: string, appId: string, params?: BookingListQueryParams): Promise<PaginatedResponse<Booking>>;
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
    namespace slots {
        /** Create a slot (admin). POST /bookings/slots */
        function create(collectionId: string, appId: string, input: CreateSlotInput): Promise<BookingSlot>;
        /** Create many slots at once — a series — all-or-nothing (admin, max 500). POST /bookings/slots/batch */
        function createMany(collectionId: string, appId: string, slots: CreateSlotInput[], opts?: {
            seriesId?: string;
        }): Promise<{
            data: BookingSlot[];
        }>;
        /** List slots. Public: open, public slots only, each with `remaining`. GET /bookings/slots */
        function list(collectionId: string, appId: string, params?: SlotListQueryParams, admin?: boolean): Promise<PaginatedResponse<BookingSlot>>;
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
        function list(collectionId: string, appId: string, params?: BlockListQueryParams): Promise<PaginatedResponse<BookingAllocation>>;
        function remove(collectionId: string, appId: string, blockId: string): Promise<{
            success: boolean;
        }>;
    }
}
