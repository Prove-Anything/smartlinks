var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
/**
 * Every item of a list, page by page, as an async iterator. Give it a function that fetches one page.
 *
 * @example
 * ```typescript
 * for await (const c of each((cursor) => contact.list('coll_123', { limit: 100, cursor }))) {
 *   console.log(c.email)
 * }
 * ```
 */
export function each(page) {
    return __asyncGenerator(this, arguments, function* each_1() {
        let cursor;
        for (;;) {
            const res = yield __await(page(cursor));
            for (const item of res.items)
                yield yield __await(item);
            if (!res.nextCursor)
                return yield __await(void 0);
            cursor = res.nextCursor;
        }
    });
}
/**
 * Every item of a list in one array. Stops at `max` items (default 10,000) so a mistake can't fetch
 * a whole database: raise it on purpose when you mean to.
 *
 * @example
 * ```typescript
 * const tags = await all((cursor) => tags.list('coll_123', { cursor }))
 * ```
 */
export async function all(page, opts = {}) {
    var _a, e_1, _b, _c;
    var _d;
    const max = (_d = opts.max) !== null && _d !== void 0 ? _d : 10000;
    const out = [];
    try {
        for (var _e = true, _f = __asyncValues(each(page)), _g; _g = await _f.next(), _a = _g.done, !_a;) {
            _c = _g.value;
            _e = false;
            try {
                const item = _c;
                out.push(item);
                if (out.length >= max)
                    break;
            }
            finally {
                _e = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_e && !_a && (_b = _f.return)) await _b.call(_f);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return out;
}
/**
 * The query string for a list: `?limit=…&cursor=…` plus the list's own filters, with the standard words
 * written the one way the API reads them (API version 2027-01):
 *
 * - `orderBy: [{ createdAt: 'desc' }, { name: 'asc' }]` → `orderBy=createdAt:desc,name:asc`
 * - a date range `createdAt: { gte, lte }` → `createdAt[gte]=…&createdAt[lte]=…` (a Date becomes ISO)
 * - `expand: ['items', 'facets']` → `expand=items,facets`
 * - any other array → the parameter repeated (`tags=a&tags=b`); a Date → ISO; undefined, null and '' are left out
 *
 * Returns '' when there is nothing to send. SDK-internal: every list function with options uses it.
 */
export function listQuery(params) {
    if (!params)
        return '';
    const out = new URLSearchParams();
    const text = (v) => (v instanceof Date ? v.toISOString() : String(v));
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '')
            continue;
        if (key === 'orderBy') {
            const keys = [];
            for (const part of Array.isArray(value) ? value : [value]) {
                if (typeof part === 'string') {
                    if (part)
                        keys.push(part);
                }
                else if (part && typeof part === 'object')
                    for (const [f, d] of Object.entries(part))
                        if (d)
                            keys.push(`${f}:${d}`);
            }
            if (keys.length)
                out.set('orderBy', keys.join(','));
        }
        else if (key === 'expand') {
            const names = (Array.isArray(value) ? value : [value]).filter(Boolean);
            if (names.length)
                out.set('expand', names.join(','));
        }
        else if (Array.isArray(value)) {
            for (const v of value)
                if (v !== undefined && v !== null && v !== '')
                    out.append(key, text(v));
        }
        else if (value instanceof Date) {
            out.set(key, value.toISOString());
        }
        else if (typeof value === 'object') {
            for (const [op, v] of Object.entries(value))
                if (v !== undefined && v !== null && v !== '')
                    out.set(`${key}[${op}]`, text(v));
        }
        else {
            out.set(key, String(value));
        }
    }
    const qs = out.toString();
    return qs ? `?${qs}` : '';
}
