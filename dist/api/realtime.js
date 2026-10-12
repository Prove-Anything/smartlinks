// src/api/realtime.ts
import { request, post } from "../http.js";
/** One live stream per (collection, app): every listener on this page shares it. */
class Stream {
    constructor(collectionId, appId, onEmpty) {
        this.collectionId = collectionId;
        this.appId = appId;
        this.onEmpty = onEmpty;
        this.listeners = new Map(); // logical name ("draw", "feed:admin") → listeners
        this.physical = new Map(); // physical channel → logical name
        this.granted = new Set();
        this.source = null;
        this.lastEvent = null;
        this.refreshTimer = null;
        this.retryTimer = null;
        this.pending = null;
        this.retries = 0;
        this.closed = false;
    }
    add(name, listener) {
        let set = this.listeners.get(name);
        const isNew = !set;
        if (!set)
            this.listeners.set(name, (set = new Set()));
        set.add(listener);
        if (isNew || !this.source)
            this.schedule();
        return () => {
            const s = this.listeners.get(name);
            if (!s)
                return;
            s.delete(listener);
            if (!s.size)
                this.listeners.delete(name);
            if (!this.listeners.size)
                this.close();
        };
    }
    /** What was granted (empty until connected). */
    has(name) {
        return this.granted.has(name);
    }
    schedule(delay = 30) {
        if (this.pending)
            clearTimeout(this.pending);
        this.pending = setTimeout(() => {
            this.pending = null;
            void this.open();
        }, delay);
    }
    async open() {
        var _a;
        if (this.closed || typeof EventSource === "undefined")
            return;
        const names = [...this.listeners.keys()];
        const feeds = names.filter((n) => n.startsWith("feed:")).map((n) => n.slice(5));
        const channels = names.filter((n) => !n.startsWith("feed:"));
        let reply;
        try {
            reply = await post("/public/realtime/connect", Object.assign(Object.assign({ collectionId: this.collectionId }, (this.appId ? { appId: this.appId } : {})), { feeds,
                channels }));
        }
        catch (err) {
            return this.retryLater(err);
        }
        if (this.closed)
            return;
        (_a = this.source) === null || _a === void 0 ? void 0 : _a.close();
        this.source = null;
        this.physical.clear();
        this.granted = new Set(reply.channels.map((c) => c.name));
        for (const c of reply.channels)
            this.physical.set(c.channel, c.name);
        if (reply.transport !== "sse" || !reply.url)
            return; // nothing this viewer may see
        const url = this.lastEvent ? `${reply.url}&lastEvent=${encodeURIComponent(this.lastEvent)}` : reply.url;
        const source = new EventSource(url);
        this.source = source;
        source.addEventListener("message", (e) => this.deliver(e));
        source.addEventListener("error", (e) => {
            const data = e.data;
            // A stream error with a body (e.g. the token expired): get a fresh token and resume.
            if (data || source.readyState === EventSource.CLOSED)
                this.retryLater(data);
        });
        source.addEventListener("open", () => {
            this.retries = 0;
        });
        // Renew a minute before the token expires (the stream can't renew its own token).
        if (this.refreshTimer)
            clearTimeout(this.refreshTimer);
        if (reply.expiresAt) {
            const ms = Math.max(10000, reply.expiresAt - Date.now() - 60000);
            this.refreshTimer = setTimeout(() => this.schedule(0), ms);
        }
    }
    retryLater(_why) {
        var _a;
        if (this.closed)
            return;
        (_a = this.source) === null || _a === void 0 ? void 0 : _a.close();
        this.source = null;
        if (this.retryTimer)
            clearTimeout(this.retryTimer);
        const ms = Math.min(30000, 1000 * 2 ** this.retries++);
        this.retryTimer = setTimeout(() => this.schedule(0), ms);
    }
    deliver(e) {
        var _a, _b;
        if (e.lastEventId)
            this.lastEvent = e.lastEventId;
        let env;
        try {
            env = JSON.parse(String(e.data));
        }
        catch (_c) {
            return;
        }
        const name = env.channel ? this.physical.get(env.channel) : undefined;
        if (!name)
            return;
        let data = env.data;
        if (typeof data === "string" && env.encoding && /json/.test(env.encoding)) {
            try {
                data = JSON.parse(data);
            }
            catch (_d) {
                /* leave as the string */
            }
        }
        const msg = { channel: name, event: (_a = env.name) !== null && _a !== void 0 ? _a : "", data, at: env.timestamp };
        for (const l of [...((_b = this.listeners.get(name)) !== null && _b !== void 0 ? _b : [])]) {
            try {
                l(msg);
            }
            catch (err) {
                console.error("[SmartLinks realtime] a listener threw", err);
            }
        }
    }
    close() {
        var _a;
        this.closed = true;
        for (const t of [this.pending, this.refreshTimer, this.retryTimer])
            if (t)
                clearTimeout(t);
        (_a = this.source) === null || _a === void 0 ? void 0 : _a.close();
        this.source = null;
        this.onEmpty();
    }
}
const streams = new Map();
function streamFor(scope) {
    var _a, _b;
    if (!(scope === null || scope === void 0 ? void 0 : scope.collectionId))
        throw new Error("realtime: collectionId is required");
    const key = `${scope.collectionId}|${(_a = scope.appId) !== null && _a !== void 0 ? _a : ""}`;
    let s = streams.get(key);
    if (!s) {
        s = new Stream(scope.collectionId, (_b = scope.appId) !== null && _b !== void 0 ? _b : null, () => streams.delete(key));
        streams.set(key, s);
    }
    return s;
}
/**
 * One of your app's declared channels (manifest `realtime.channels`).
 *
 * ```ts
 * const draw = realtime.channel({ collectionId, appId }, "draw")
 * const off = draw.subscribe("status", (m) => setStatus(m.data))
 * await draw.publish("status", { phase: "spinning" }) // if the channel lets this viewer publish
 * ```
 */
export function channel(scope, name) {
    return {
        /** Listen for an event (or "*" for every event). Returns a function that stops listening. */
        subscribe(event, onMessage) {
            return streamFor(scope).add(name, (m) => {
                if (event === "*" || m.event === event)
                    onMessage(m);
            });
        },
        /** Send a message. Refused (403) unless the channel's `publish` rule allows this viewer. */
        publish(event, data) {
            return post("/public/realtime/publish", {
                collectionId: scope.collectionId,
                appId: scope.appId,
                channel: name,
                event,
                data: data === undefined ? null : data,
            });
        },
    };
}
function matches(change, filter) {
    for (const k of ["type", "id", "appId", "recordType", "productId", "proofId"]) {
        if (filter[k] !== undefined && change[k] !== filter[k])
            return false;
    }
    return true;
}
/**
 * Something changed: refetch it. IDs only — never data.
 *
 * Admins of the collection see every change; everyone else sees changes to public things (public app
 * records, products). Filter by `type` ('product' | 'proof' | 'asset' | 'record' | 'collection' |
 * 'collection.apps' | 'settings'), `id`, `appId`, `recordType`, `productId`, `proofId`.
 *
 * ```ts
 * const off = realtime.onChange({ collectionId }, { type: "record", appId, recordType: "entry" }, () => refetch())
 * ```
 */
export function onChange(scope, filter, onChangeFn) {
    const s = streamFor({ collectionId: scope.collectionId });
    // Ask for both feeds; an admin is granted both (public changes reach the admin feed too), so the
    // public feed is ignored once the admin feed is granted — no change arrives twice.
    const handle = (fromAdminFeed) => (m) => {
        if (m.event !== "change" || !m.data || typeof m.data !== "object")
            return;
        if (!fromAdminFeed && s.has("feed:admin"))
            return;
        const change = m.data;
        if (matches(change, filter))
            onChangeFn(change);
    };
    const offAdmin = s.add("feed:admin", handle(true));
    const offPublic = s.add("feed:public", handle(false));
    return () => {
        offAdmin();
        offPublic();
    };
}
/**
 * Messages for the signed-in person only (e.g. "scan" — a tag they just scanned on another device).
 */
export function onMine(scope, onMessage) {
    return streamFor({ collectionId: scope.collectionId }).add("feed:me", onMessage);
}
// ---------------------------------------------------------------------------------------------------
// Legacy (raw Ably tokens). New code uses channel / onChange above — no provider in your app.
// ---------------------------------------------------------------------------------------------------
/**
 * @deprecated Use `realtime.channel()` / `realtime.onChange()`. Returns a raw Ably TokenRequest for
 * `collection:{collectionId}:*` (subscribe; publish only for the collection's admins).
 */
export async function getPublicToken(params) {
    const queryParams = new URLSearchParams();
    queryParams.append("collectionId", params.collectionId);
    if (params.appId)
        queryParams.append("appId", params.appId);
    return request(`/public/push/token?${queryParams.toString()}`);
}
/**
 * @deprecated Use `realtime.onMine()`. Returns a raw Ably TokenRequest for `interaction:{userId}`
 * (subscribe only).
 */
export async function getAdminToken() {
    return request("/admin/auth/push");
}
