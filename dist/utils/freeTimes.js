// src/utils/freeTimes.ts
// Free-time maths for booking apps — pure, no I/O (docs/bookings.md, "Schedules belong to the app").
//
// Your app owns its schedule and its booking policy; this helper just does the fiddly part:
// turning local wall-clock opening hours into UTC intervals (daylight-saving safe), subtracting busy
// time (from bookings.freebusy), and stepping out bookable start times with durations, buffers and
// notice. Use it or ignore it — the platform never reads your schedule, except a schedule in this
// standard shape when your app allows public free-form booking with `rules.schedule: true`.
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const HHMM = /^([01]\d|2[0-4]):([0-5]\d)$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;
function minutesOf(hhmm) {
    const m = HHMM.exec(hhmm || '');
    if (!m)
        throw new Error(`Invalid time "${hhmm}" (use HH:MM)`);
    const mins = Number(m[1]) * 60 + Number(m[2]);
    if (mins > 24 * 60)
        throw new Error(`Invalid time "${hhmm}"`);
    return mins;
}
/** Throws a readable Error when `schedule` isn't the standard shape. */
export function validateSchedule(schedule) {
    if (!schedule || typeof schedule !== 'object')
        throw new Error('Schedule must be an object');
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: schedule.timezone });
    }
    catch (_a) {
        throw new Error('Schedule needs a valid IANA timezone');
    }
    if (!schedule.timezone)
        throw new Error('Schedule needs a valid IANA timezone');
    const check = (hours, where) => {
        if (!Array.isArray(hours))
            throw new Error(`${where}: hours must be an array`);
        for (const h of hours)
            if (minutesOf(h.end) <= minutesOf(h.start))
                throw new Error(`${where}: end must be after start (split hours that cross midnight)`);
    };
    for (const [day, hours] of Object.entries(schedule.weekly || {})) {
        if (!DAY_KEYS.includes(day))
            throw new Error(`Unknown day "${day}" (use ${DAY_KEYS.join(', ')})`);
        check(hours, day);
    }
    for (const o of schedule.overrides || []) {
        const ok = (o.date && YMD.test(o.date)) || (o.from && o.to && YMD.test(o.from) && YMD.test(o.to));
        if (!ok)
            throw new Error('Each override needs `date` or `from` + `to` (YYYY-MM-DD)');
        check(o.hours || [], `override ${o.date || o.from}`);
    }
    return true;
}
function tzOffsetMs(ts, tz) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(new Date(ts));
    const v = {};
    for (const p of parts)
        if (p.type !== 'literal')
            v[p.type] = Number(p.value);
    const asUtc = Date.UTC(v.year, v.month - 1, v.day, v.hour === 24 ? 0 : v.hour, v.minute, v.second);
    return asUtc - (ts - (ts % 1000));
}
/** The UTC instant (ms) of local date `ymd` + `minutes` past midnight in `tz`. */
export function zonedToUtc(ymd, minutes, tz) {
    const [y, mo, d] = ymd.split('-').map(Number);
    const guess = Date.UTC(y, mo - 1, d) + minutes * 60000;
    let ts = guess - tzOffsetMs(guess, tz);
    const off2 = tzOffsetMs(ts, tz);
    if (guess - off2 !== ts)
        ts = guess - off2;
    return ts;
}
function localYmd(ts, tz) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ts));
}
function addDaysYmd(ymd, n) {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
function dayKey(ymd) {
    const [y, m, d] = ymd.split('-').map(Number);
    return DAY_KEYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
function hoursFor(schedule, ymd) {
    let hours = (schedule.weekly || {})[dayKey(ymd)] || [];
    for (const o of schedule.overrides || []) {
        if ((o.date && o.date === ymd) || (o.from && o.to && o.from <= ymd && ymd <= o.to))
            hours = o.hours || [];
    }
    return hours;
}
function toMs(v) {
    return v instanceof Date ? v.getTime() : typeof v === 'number' ? v : new Date(v).getTime();
}
function merge(list) {
    const sorted = [...list].sort((a, b) => a.start - b.start);
    const out = [];
    for (const i of sorted) {
        const last = out[out.length - 1];
        if (last && i.start <= last.end)
            last.end = Math.max(last.end, i.end);
        else
            out.push(Object.assign({}, i));
    }
    return out;
}
/** The schedule's open hours overlapping [from, to), as merged UTC intervals. */
export function openIntervals(schedule, from, to) {
    const fromMs = toMs(from);
    const toMsV = toMs(to);
    const tz = schedule.timezone;
    const out = [];
    let ymd = addDaysYmd(localYmd(fromMs, tz), -1);
    const last = addDaysYmd(localYmd(toMsV, tz), 1);
    while (ymd <= last) {
        for (const h of hoursFor(schedule, ymd)) {
            const start = zonedToUtc(ymd, minutesOf(h.start), tz);
            const end = zonedToUtc(ymd, minutesOf(h.end), tz);
            if (end > fromMs && start < toMsV)
                out.push({ start, end });
        }
        ymd = addDaysYmd(ymd, 1);
    }
    return merge(out);
}
/** True when [start, end) lies entirely inside the schedule's open hours. */
export function withinSchedule(schedule, start, end) {
    const s = toMs(start);
    const e = toMs(end);
    return openIntervals(schedule, s, e).some((i) => i.start <= s && e <= i.end);
}
/** `open` minus `busy` (both lists of intervals). */
export function subtractIntervals(open, busy) {
    const b = merge(busy);
    const out = [];
    for (const o of merge(open)) {
        let cursor = o.start;
        for (const x of b) {
            if (x.end <= cursor || x.start >= o.end)
                continue;
            if (x.start > cursor)
                out.push({ start: cursor, end: x.start });
            cursor = Math.max(cursor, x.end);
            if (cursor >= o.end)
                break;
        }
        if (cursor < o.end)
            out.push({ start: cursor, end: o.end });
    }
    return out;
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
export function freeTimes(opts) {
    var _a;
    const from = toMs(opts.from);
    const to = toMs(opts.to);
    const duration = opts.duration * 60000;
    const step = (opts.step || opts.duration) * 60000;
    const before = (opts.bufferBefore || 0) * 60000;
    const after = (opts.bufferAfter || 0) * 60000;
    const earliest = ((_a = opts.now) !== null && _a !== void 0 ? _a : Date.now()) + (opts.minNotice || 0) * 60000;
    if (!(duration > 0) || !(step > 0) || !(to > from))
        return [];
    const isSchedule = !Array.isArray(opts.hours);
    const schedule = isSchedule ? opts.hours : null;
    const open = isSchedule ? openIntervals(schedule, from - before, to + after) : merge(opts.hours);
    const busy = merge((opts.busy || []).map((b) => ({ start: toMs(b.start), end: toMs(b.end) })));
    const freeForBuffers = subtractIntervals([{ start: from - before - 86400000, end: to + after + 86400000 }], busy);
    const out = [];
    for (const o of open) {
        // Alignment origin: local midnight of the interval's day (schedules), or the interval start.
        let t;
        if (schedule) {
            const ymd = localYmd(o.start, schedule.timezone);
            const midnight = zonedToUtc(ymd, 0, schedule.timezone);
            t = midnight + Math.ceil((o.start - midnight) / step) * step;
        }
        else {
            t = o.start;
        }
        for (; t + duration <= o.end; t += step) {
            if (t < from || t + duration > to || t < earliest)
                continue;
            const blockStart = t - before;
            const blockEnd = t + duration + after;
            if (opts.buffersWithinHours && (blockStart < o.start || blockEnd > o.end))
                continue;
            // The whole blocked span (appointment + buffers) must be clear of busy time.
            if (!freeForBuffers.some((f) => f.start <= blockStart && blockEnd <= f.end))
                continue;
            out.push({ start: new Date(t).toISOString(), end: new Date(t + duration).toISOString() });
        }
    }
    return out;
}
