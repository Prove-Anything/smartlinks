// src/api/bookings.ts
// Generic booking objects — see docs/bookings.md.
//
// Every function takes `admin` last (default false), like app.cases / app.records:
//   admin = true  → /admin/... — unconditional (Studio users, your app's own server functions)
//   admin = false → /public/... — governed by the app's config: publicCreate.bookings (who may book,
//                   as what status, limits, time rules), ownerActions.bookings (cancel / move /
//                   confirm afterwards) and publicRead.bookings.freebusy.
import { request, post, patch, del, requestWithOptions } from '../http'
import type {
  Booking,
  BookingSlot,
  BookingAllocation,
  CreateBookingInput,
  UpdateBookingInput,
  MoveBookingInput,
  BookingListQueryParams,
  CreateSlotInput,
  UpdateSlotInput,
  SlotListQueryParams,
  CreateBlockInput,
  BlockListQueryParams,
  FreeBusyQuery,
  FreeBusyResponse,
  BookingAccessOptions,
  BookingResourceRef,
  MessageBookersInput,
  MessageBookersResult,
} from '../types/bookings'
import type { PaginatedResponse } from '../types/appObjects'

function basePath(collectionId: string, appId: string, admin: boolean): string {
  const zone = admin ? 'admin' : 'public'
  return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/bookings`
}

function query(params?: Record<string, any>): string {
  if (!params) return ''
  const parts: string[] = []
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    const v = value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.join(',') : String(value)
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

function tokenHeaders(opts?: BookingAccessOptions): Record<string, string> | undefined {
  return opts?.editToken ? { 'X-Edit-Token': opts.editToken } : undefined
}

function refString(r: BookingResourceRef): string {
  return typeof r === 'string' ? r : `${r.type}:${r.id}`
}

export namespace bookings {
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
  export async function create(collectionId: string, appId: string, input: CreateBookingInput, admin: boolean = false): Promise<Booking> {
    return post<Booking>(basePath(collectionId, appId, admin), input)
  }

  /** List bookings (admin). GET /bookings */
  export async function list(collectionId: string, appId: string, params?: BookingListQueryParams, admin: boolean = true): Promise<PaginatedResponse<Booking>> {
    return request<PaginatedResponse<Booking>>(`${basePath(collectionId, appId, admin)}${query(params)}`)
  }

  /** The signed-in caller's own bookings (public). GET /bookings/mine */
  export async function mine(collectionId: string, appId: string, params?: BookingListQueryParams): Promise<PaginatedResponse<Booking>> {
    return request<PaginatedResponse<Booking>>(`${basePath(collectionId, appId, false)}/mine${query(params)}`)
  }

  /**
   * Get one booking. Public: the signed-in booker, or a guest passing `{ editToken }`.
   * GET /bookings/:bookingId
   */
  export async function get(collectionId: string, appId: string, bookingId: string, admin: boolean = false, opts?: BookingAccessOptions): Promise<Booking> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}`
    const headers = tokenHeaders(opts)
    return headers ? requestWithOptions<Booking>(path, { method: 'GET', headers }) : request<Booking>(path)
  }

  /** Update zones and descriptive fields (admin). PATCH /bookings/:bookingId */
  export async function update(collectionId: string, appId: string, bookingId: string, input: UpdateBookingInput, admin: boolean = true): Promise<Booking> {
    return patch<Booking>(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}`, input)
  }

  /**
   * held / pending / waitlisted → confirmed (idempotent). A held booking whose hold has run out fails
   * with HOLD_EXPIRED. Public: only the booker's own hold, when `ownerActions.bookings.confirm` allows.
   * POST /bookings/:bookingId/confirm
   */
  export async function confirm(collectionId: string, appId: string, bookingId: string, admin: boolean = false, opts?: BookingAccessOptions): Promise<Booking> {
    return post<Booking>(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}/confirm`, {}, tokenHeaders(opts))
  }

  /**
   * Cancel and give the places back (idempotent). Public: per `ownerActions.bookings.cancel` and its
   * cutoff. `reason` is admin-only (public cancels record 'owner').
   * POST /bookings/:bookingId/cancel
   */
  export async function cancel(collectionId: string, appId: string, bookingId: string, admin: boolean = false, opts?: BookingAccessOptions & { reason?: string }): Promise<Booking> {
    return post<Booking>(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}/cancel`, opts?.reason ? { reason: opts.reason } : {}, tokenHeaders(opts))
  }

  /**
   * Move to a new slot / time, all-or-nothing (a failed move leaves the booking as it was).
   * Public: per `ownerActions.bookings.move`; the create rules are re-checked for the new time.
   * POST /bookings/:bookingId/move
   */
  export async function move(collectionId: string, appId: string, bookingId: string, input: MoveBookingInput, admin: boolean = false, opts?: BookingAccessOptions): Promise<Booking> {
    return post<Booking>(`${basePath(collectionId, appId, admin)}/${encodeURIComponent(bookingId)}/move`, input, tokenHeaders(opts))
  }

  /** Extend a hold by `holdMinutes` from now (admin; capped at 24h after the booking was made). */
  export async function extendHold(collectionId: string, appId: string, bookingId: string, holdMinutes: number): Promise<Booking> {
    return post<Booking>(`${basePath(collectionId, appId, true)}/${encodeURIComponent(bookingId)}/extend-hold`, { holdMinutes })
  }

  /** confirmed → completed (admin). */
  export async function complete(collectionId: string, appId: string, bookingId: string): Promise<Booking> {
    return post<Booking>(`${basePath(collectionId, appId, true)}/${encodeURIComponent(bookingId)}/complete`, {})
  }

  /** confirmed → no_show (admin). */
  export async function noShow(collectionId: string, appId: string, bookingId: string): Promise<Booking> {
    return post<Booking>(`${basePath(collectionId, appId, true)}/${encodeURIComponent(bookingId)}/no-show`, {})
  }

  /**
   * Busy intervals per resource (bookings, blocks, slots' own blocks) — never booking details.
   * Public only when the app sets `publicRead.bookings.freebusy: true`.
   * GET /bookings/freebusy
   */
  export async function freebusy(collectionId: string, appId: string, q: FreeBusyQuery, admin: boolean = false): Promise<FreeBusyResponse> {
    const params = { resources: q.resources.map(refString).join(','), from: q.from, to: q.to }
    return request<FreeBusyResponse>(`${basePath(collectionId, appId, admin)}/freebusy${query(params)}`)
  }

  /**
   * Message the people booked (admin): a template to everyone on a slot, or everyone booked in a date
   * range (optionally with one person / room), each send hydrated with their booking ({{ booking }}).
   * No segment to make. POST /bookings/message
   */
  export async function message(collectionId: string, appId: string, input: MessageBookersInput): Promise<MessageBookersResult> {
    return post<MessageBookersResult>(`${basePath(collectionId, appId, true)}/message`, input)
  }

  // ==================== SLOTS ====================

  export namespace slots {
    /** Create a slot (admin). POST /bookings/slots */
    export async function create(collectionId: string, appId: string, input: CreateSlotInput): Promise<BookingSlot> {
      return post<BookingSlot>(`${basePath(collectionId, appId, true)}/slots`, input)
    }

    /** Create many slots at once — a series — all-or-nothing (admin, max 500). POST /bookings/slots/batch */
    export async function createMany(collectionId: string, appId: string, slots: CreateSlotInput[], opts?: { seriesId?: string }): Promise<{ data: BookingSlot[] }> {
      return post<{ data: BookingSlot[] }>(`${basePath(collectionId, appId, true)}/slots/batch`, { slots, seriesId: opts?.seriesId })
    }

    /** List slots. Public: open, public slots only, each with `remaining`. GET /bookings/slots */
    export async function list(collectionId: string, appId: string, params?: SlotListQueryParams, admin: boolean = false): Promise<PaginatedResponse<BookingSlot>> {
      return request<PaginatedResponse<BookingSlot>>(`${basePath(collectionId, appId, admin)}/slots${query(params)}`)
    }

    /** GET /bookings/slots/:slotId */
    export async function get(collectionId: string, appId: string, slotId: string, admin: boolean = false): Promise<BookingSlot> {
      return request<BookingSlot>(`${basePath(collectionId, appId, admin)}/slots/${encodeURIComponent(slotId)}`)
    }

    /**
     * Update a slot (admin). Capacity can't drop below what's booked (SLOT_OVERBOOKED); times can't
     * change once anything is booked (SLOT_HAS_BOOKINGS).
     */
    export async function update(collectionId: string, appId: string, slotId: string, input: UpdateSlotInput): Promise<BookingSlot> {
      return patch<BookingSlot>(`${basePath(collectionId, appId, true)}/slots/${encodeURIComponent(slotId)}`, input)
    }

    /** Delete a slot (admin; refused while places are booked). */
    export async function remove(collectionId: string, appId: string, slotId: string): Promise<{ success: boolean }> {
      return del<{ success: boolean }>(`${basePath(collectionId, appId, true)}/slots/${encodeURIComponent(slotId)}`)
    }
  }

  // ==================== BLOCKS ====================

  /** Blocked time on a resource with no booking — time off, a closure, maintenance (admin). */
  export namespace blocks {
    export async function create(collectionId: string, appId: string, input: CreateBlockInput): Promise<BookingAllocation> {
      return post<BookingAllocation>(`${basePath(collectionId, appId, true)}/blocks`, input)
    }

    export async function list(collectionId: string, appId: string, params?: BlockListQueryParams): Promise<PaginatedResponse<BookingAllocation>> {
      return request<PaginatedResponse<BookingAllocation>>(`${basePath(collectionId, appId, true)}/blocks${query(params)}`)
    }

    export async function remove(collectionId: string, appId: string, blockId: string): Promise<{ success: boolean }> {
      return del<{ success: boolean }>(`${basePath(collectionId, appId, true)}/blocks/${encodeURIComponent(blockId)}`)
    }
  }
}
