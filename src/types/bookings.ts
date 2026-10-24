// src/types/bookings.ts
// Generic booking objects (Slots, Bookings, Allocations) — see docs/bookings.md.

import type { PaginatedResponse } from './appObjects'

export type BookingStatus =
  | 'held'        // claimed, waiting for payment / the booker's confirm; expires at holdExpiresAt
  | 'pending'     // claimed, waiting for the business to approve
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'waitlisted'  // holds nothing until confirmed

export type BookingVisibility = 'public' | 'owner' | 'admin'

/** A claim on a resource's time: seats on a slot (`capacity`) or exclusive time (`exclusive`). */
export interface BookingAllocation {
  id: string
  bookingId: string | null
  slotId: string | null
  resourceType: string
  resourceId: string
  /** The time actually blocked — buffers included. */
  startsAt: string
  endsAt: string
  quantity: number
  mode: 'exclusive' | 'capacity'
  active: boolean
  sourceSystem?: string | null
  data: Record<string, any>
}

export interface Booking {
  id: string
  collectionId: string
  appId: string
  visibility: BookingVisibility
  /** Admin / owner callers only. */
  contactId?: string
  status: BookingStatus
  /** The customer-visible time (buffers excluded). */
  startsAt: string
  endsAt: string
  timezone?: string | null
  quantity: number
  holdExpiresAt?: string | null
  /** Platform flags, e.g. 'hold_expired'. */
  flags: string[]
  /** 'admin' | 'owner' | 'hold_expired' | an app-defined reason. */
  cancelReason?: string | null
  idempotencyKey?: string | null
  seriesId?: string | null
  ref?: string | null
  customId?: string | null
  sourceSystem?: string | null
  productId?: string | null
  proofId?: string
  parentType?: string | null
  parentId?: string | null
  createdAt: string
  updatedAt: string
  cancelledAt?: string | null
  data: Record<string, any>
  /** Owner + admin only. */
  owner?: Record<string, any>
  /** Admin only. */
  admin?: Record<string, any>
  allocations: BookingAllocation[]
  /**
   * Anonymous public creates only, when the app enables `publicCreate.bookings.anonymous.edit.editToken`.
   * Returned ONCE — store it to let the guest view / cancel / move / confirm their booking.
   */
  editToken?: string
}

export interface BookingSlot {
  id: string
  collectionId: string
  appId: string
  visibility: BookingVisibility
  resourceType?: string | null
  resourceId?: string | null
  startsAt: string
  endsAt: string
  timezone?: string | null
  capacity: number
  booked: number
  /** capacity - booked */
  remaining: number
  perContactLimit?: number | null
  status: 'open' | 'closed' | 'cancelled'
  seriesId?: string | null
  ref?: string | null
  customId?: string | null
  sourceSystem?: string | null
  productId?: string | null
  createdAt: string
  updatedAt: string
  data: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
}

/** One claim in a booking request: seats on a slot, or exclusive time on a resource. */
export type BookingClaimInput =
  | { slotId: string; quantity?: number }
  | {
      resourceType: string
      resourceId: string
      /** Defaults to the booking's startsAt / endsAt. */
      startsAt?: string | Date
      endsAt?: string | Date
      /** Admin only (public bookings take buffers from the app's rules). Minutes. */
      bufferBefore?: number
      bufferAfter?: number
    }

export interface CreateBookingInput {
  /** Seats on one slot … */
  slotId?: string
  quantity?: number
  /** … or exclusive time on one resource … */
  resourceType?: string
  resourceId?: string
  resource?: { type: string; id: string }
  startsAt?: string | Date
  endsAt?: string | Date
  /** … or several claims at once (all-or-nothing): a stylist and a chair, two tables. */
  allocations?: BookingClaimInput[]
  /** Admin only — public bookings get the status the app's rules enforce. Default 'confirmed'. */
  status?: 'held' | 'pending' | 'confirmed' | 'waitlisted'
  /** For status 'held' (admin: default 15, max 1440). */
  holdMinutes?: number
  /** Admin only: blocked time around an exclusive claim, in minutes. */
  bufferBefore?: number
  bufferAfter?: number
  /** A retried create with the same key returns the first booking instead of booking twice. */
  idempotencyKey?: string
  /** Admin only — public bookings use the signed-in caller's contact. */
  contactId?: string
  timezone?: string
  visibility?: BookingVisibility
  ref?: string
  customId?: string
  sourceSystem?: string
  productId?: string
  proofId?: string
  parentType?: string
  parentId?: string
  seriesId?: string
  data?: Record<string, any>
  owner?: Record<string, any>
  /** Admin only. */
  admin?: Record<string, any>
}

export interface UpdateBookingInput {
  data?: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
  visibility?: BookingVisibility
  ref?: string
  timezone?: string
  productId?: string
  proofId?: string
  contactId?: string
  sourceSystem?: string
  customId?: string
  flags?: string[]
}

export interface MoveBookingInput {
  slotId?: string
  resourceType?: string
  resourceId?: string
  resource?: { type: string; id: string }
  startsAt?: string | Date
  endsAt?: string | Date
  allocations?: BookingClaimInput[]
  bufferBefore?: number
  bufferAfter?: number
}

export interface BookingListQueryParams {
  status?: string
  contactId?: string
  slotId?: string
  resourceType?: string
  resourceId?: string
  /** Bookings overlapping [from, to). */
  from?: string | Date
  to?: string | Date
  ref?: string
  customId?: string
  sourceSystem?: string
  productId?: string
  seriesId?: string
  /** Default 'starts_at:asc'. */
  sort?: string
  limit?: number
  offset?: number
}

export interface CreateSlotInput {
  startsAt: string | Date
  endsAt: string | Date
  capacity: number
  perContactLimit?: number
  /** What the slot runs on (an instructor, a room) … */
  resourceType?: string
  resourceId?: string
  /** … and whether the slot blocks that resource's time (no double-booking across slots). */
  blockResource?: boolean
  status?: 'open' | 'closed' | 'cancelled'
  timezone?: string
  visibility?: BookingVisibility
  seriesId?: string
  ref?: string
  customId?: string
  sourceSystem?: string
  productId?: string
  data?: Record<string, any>
  owner?: Record<string, any>
  admin?: Record<string, any>
}

export type UpdateSlotInput = Partial<Omit<CreateSlotInput, 'blockResource' | 'seriesId' | 'resourceType' | 'resourceId'>>

export interface SlotListQueryParams {
  status?: string
  /** Only slots with places left. */
  available?: boolean
  from?: string | Date
  to?: string | Date
  resourceType?: string
  resourceId?: string
  productId?: string
  seriesId?: string
  ref?: string
  customId?: string
  sort?: string
  limit?: number
  offset?: number
}

export interface CreateBlockInput {
  resourceType: string
  resourceId: string
  startsAt: string | Date
  endsAt: string | Date
  sourceSystem?: string
  data?: Record<string, any>
}

export interface BlockListQueryParams {
  resourceType?: string
  resourceId?: string
  from?: string | Date
  to?: string | Date
  limit?: number
  offset?: number
}

/** A resource reference: `{ type, id }` or the string form `'record:staff-1'`. */
export type BookingResourceRef = { type: string; id: string } | string

export interface FreeBusyQuery {
  resources: BookingResourceRef[]
  from: string | Date
  to: string | Date
}

export interface FreeBusyInterval {
  start: string
  end: string
}

export interface FreeBusyResponse {
  from: string
  to: string
  resources: Array<{ resourceType: string; resourceId: string; busy: FreeBusyInterval[] }>
}

/** Public calls on a booking made by an anonymous guest: pass the edit token returned at create. */
export interface BookingAccessOptions {
  editToken?: string
}

export type BookingList = PaginatedResponse<Booking>
export type SlotList = PaginatedResponse<BookingSlot>
export type BlockList = PaginatedResponse<BookingAllocation>

/** Error codes a booking call can fail with (HTTP 409 unless noted). */
export type BookingErrorCode =
  | 'SLOT_FULL' | 'SLOT_CLOSED' | 'RESOURCE_TAKEN' | 'PER_CONTACT_LIMIT' | 'QUANTITY_LIMIT'
  | 'HOLD_EXPIRED' | 'INVALID_STATE' | 'SLOT_OVERBOOKED' | 'SLOT_HAS_BOOKINGS'
  | 'TOO_SOON' | 'TOO_FAR_AHEAD' | 'IN_THE_PAST' | 'DURATION_NOT_ALLOWED'
  | 'OUTSIDE_SCHEDULE' | 'NO_SCHEDULE' | 'SCHEDULE_INVALID' | 'CUTOFF_PASSED'
  | 'FORBIDDEN' /* 403 */ | 'NOT_FOUND' /* 404 */ | 'BAD_REQUEST' /* 400 */

// ---------------------------------------------------------------------------
// Standard schedule shape (used by utils.freeTimes, and by the platform for public free-form
// booking with `rules.schedule: true`). Times are LOCAL wall-clock times in `timezone`.
// ---------------------------------------------------------------------------

export interface ScheduleHours {
  /** 'HH:MM' (24h) */
  start: string
  /** 'HH:MM' (24h); '24:00' allowed. Hours never cross midnight — split them. */
  end: string
}

export type ScheduleDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface ScheduleOverride {
  /** One date (YYYY-MM-DD) … */
  date?: string
  /** … or an inclusive range. */
  from?: string
  to?: string
  /** [] = closed */
  hours: ScheduleHours[]
}

export interface StandardSchedule {
  /** IANA timezone, e.g. 'Europe/London'. */
  timezone: string
  /** A missing day is closed. */
  weekly?: Partial<Record<ScheduleDay, ScheduleHours[]>>
  /** Dated exceptions; the last matching one wins over `weekly`. */
  overrides?: ScheduleOverride[]
}
