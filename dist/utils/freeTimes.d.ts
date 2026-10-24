import type { StandardSchedule, FreeBusyInterval } from '../types/bookings.js';
export interface TimeInterval {
    /** epoch ms (UTC) */
    start: number;
    /** epoch ms (UTC) */
    end: number;
}
/** Throws a readable Error when `schedule` isn't the standard shape. */
export declare function validateSchedule(schedule: StandardSchedule): true;
/** The UTC instant (ms) of local date `ymd` + `minutes` past midnight in `tz`. */
export declare function zonedToUtc(ymd: string, minutes: number, tz: string): number;
/** The schedule's open hours overlapping [from, to), as merged UTC intervals. */
export declare function openIntervals(schedule: StandardSchedule, from: string | number | Date, to: string | number | Date): TimeInterval[];
/** True when [start, end) lies entirely inside the schedule's open hours. */
export declare function withinSchedule(schedule: StandardSchedule, start: string | number | Date, end: string | number | Date): boolean;
/** `open` minus `busy` (both lists of intervals). */
export declare function subtractIntervals(open: TimeInterval[], busy: TimeInterval[]): TimeInterval[];
export interface FreeTimesOptions {
    /** Open hours: a standard schedule, or open intervals you've worked out yourself. */
    hours: StandardSchedule | TimeInterval[];
    /** Busy intervals, e.g. `resources[i].busy` from bookings.freebusy (ISO strings or ms). */
    busy?: Array<FreeBusyInterval | TimeInterval>;
    from: string | number | Date;
    to: string | number | Date;
    /** Appointment length, minutes. */
    duration: number;
    /** Minutes between candidate start times. Default: `duration`. */
    step?: number;
    /** Blocked time around each appointment, minutes (must also fit in a free gap). */
    bufferBefore?: number;
    bufferAfter?: number;
    /** No start sooner than this many minutes from `now`. */
    minNotice?: number;
    /** "Now", for notice (default Date.now()). */
    now?: number;
    /**
     * Whether buffers must also fall inside opening hours. Default false: a buffer may run past
     * closing (cleaning up after the last appointment) but never into busy time.
     */
    buffersWithinHours?: boolean;
}
export interface FreeTimeSlot {
    /** ISO start of the appointment (buffers excluded). */
    start: string;
    end: string;
}
/**
 * Bookable start times: open hours minus busy time, stepped at `step`, each long enough for
 * `duration` (+ buffers against busy time), not sooner than `minNotice`.
 *
 *   const fb = await bookings.freebusy(collectionId, appId, { resources: ['record:sam'], from, to }, true)
 *   const times = utils.freeTimes({ hours: samsSchedule, busy: fb.resources[0].busy, from, to, duration: 30 })
 *
 * Start times are aligned to `step` from local midnight in the schedule's timezone (so 30-minute
 * steps land on :00 and :30), or from each open interval's start when you pass intervals.
 */
export declare function freeTimes(opts: FreeTimesOptions): FreeTimeSlot[];
