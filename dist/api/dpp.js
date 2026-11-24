// src/api/dpp.ts
//
// EU Digital Product Passports (ESPR) hosted by SmartLinks, and registering them in the EU registry for the brand
// (docs/dpp.md).
//
// The EU registry only lets an organisation register its own passports, so each brand enrols itself (with its own
// qualified e-seal, on the EU's site) and adds a Service Account holding SmartLinks' public key. From then on
// SmartLinks registers for it:
//
// To try it all before the brand is verified with the EU: dpp.registry.enrolPractice(collectionId), then use 'practice'
// wherever 'acc' appears below (the SmartLinks practice registry — never the EU).
//
//   1. dpp.registry.makeKey(collectionId, 'acc')            → show registry.publicPem to upload to the Service Account
//   2. dpp.registry.set(collectionId, 'acc', { clientId, kid, orgIdentifier })
//   3. dpp.registry.check(collectionId, 'acc')              → signs in and reads the registry's product groups
//   4. dpp.passports.upsert(...) / upsertMany(...)          → passports at their addresses (passport.url)
//   5. dpp.register(collectionId, 'acc', passportIds)       → the registry reads each one and registers it
//
// 'acc' is the EU test registry, 'prod' the live one. Each passport is served at its address: the public view to
// anyone, and the restricted views only to the EU registry for that brand.
//
// Endpoints: /admin/collection/:collectionId/dpp/…  and  /public/dpp/:collectionId/:passportId
import { request, post, put } from "../http.js";
import { listQuery } from "../list.js";
function enc(v) { return encodeURIComponent(v); }
const base = (collectionId) => `/admin/collection/${enc(collectionId)}/dpp`;
function query(q) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(q))
        if (v !== undefined && v !== null && v !== "")
            p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : "";
}
export var dpp;
(function (dpp) {
    /**
     * What passports can be made: product groups, their kinds, and each view's fields and required fields.
     * A fixed set: always all of them in one answer (`nextCursor` is always null), so it takes no `limit`
     * or `cursor`. GET /dpp/groups
     *
     * @example
     * ```typescript
     * const { items } = await dpp.groups(collectionId)
     * items.map(g => g.productGroup) // ["BATTERIES", …]
     * ```
     */
    async function groups(collectionId) {
        return request(`${base(collectionId)}/groups`);
    }
    dpp.groups = groups;
    /**
     * Read a passport as the public sees it, at its address (the EU JSON document), or an earlier version of it.
     * No sign-in needed. GET /public/dpp/:collectionId/:passportId
     */
    async function read(collectionId, passportId, opts = {}) {
        return request(`/public/dpp/${enc(collectionId)}/${enc(passportId)}${query({ version: opts.version })}`);
    }
    dpp.read = read;
    /**
     * Send passports to the EU registry. They're grouped by product group and sent up to 100 at a time; the registry
     * reads each one at its address. Passports still missing required fields, withdrawn or already registered come
     * back in `skipped`. With `wait: true` the call waits (up to ~45 s) and returns each passport's outcome; otherwise
     * follow up with `dpp.tasks.refresh`. POST /dpp/registry/:env/register
     */
    async function register(collectionId, env, passportIds, opts = {}) {
        return post(`${base(collectionId)}/registry/${enc(env)}/register`, { passportIds, wait: !!opts.wait });
    }
    dpp.register = register;
    /** The brand's EU registry connection (one per environment). Managed by the collection's admins. */
    let registry;
    (function (registry) {
        /**
         * Both environments, each with `nextStep` (what's left to connect). A fixed set: always all of them
         * in one answer (`nextCursor` is always null), so it takes no `limit` or `cursor`. GET /dpp/registry
         *
         * @example
         * ```typescript
         * const { items } = await dpp.registry.list(collectionId)
         * const acc = items.find(r => r.environment === 'acc')
         * ```
         */
        async function list(collectionId) {
            return request(`${base(collectionId)}/registry`);
        }
        registry.list = list;
        /** One environment. GET /dpp/registry/:env */
        async function get(collectionId, env) {
            const out = await request(`${base(collectionId)}/registry/${enc(env)}`);
            return out.registry;
        }
        registry.get = get;
        /**
         * Make (or replace) the key the brand's Service Account trusts. The private key stays on SmartLinks' servers;
         * show `publicPem` (or `publicJwk`) for the brand to add to its Service Account in the registry. Replacing the
         * key clears `kid` — the registry gives the new key its own. POST /dpp/registry/:env/key
         */
        async function makeKey(collectionId, env, opts = {}) {
            const out = await post(`${base(collectionId)}/registry/${enc(env)}/key`, opts);
            return out.registry;
        }
        registry.makeKey = makeKey;
        /** Save the Service Account's Client ID and key ID, and the brand's Organisation ID, from the registry. PUT /dpp/registry/:env */
        async function set(collectionId, env, input) {
            const out = await put(`${base(collectionId)}/registry/${enc(env)}`, input);
            return out.registry;
        }
        registry.set = set;
        /**
         * Connect the brand to the SmartLinks PRACTICE registry in one step — key, enrolment, Service Account and check —
         * to try publishing and registering before the brand is verified with the EU. Never the EU: label it as practice
         * wherever it's shown. POST /dpp/registry/practice/enrol
         */
        async function enrolPractice(collectionId) {
            return post(`${base(collectionId)}/registry/practice/enrol`, {});
        }
        registry.enrolPractice = enrolPractice;
        /** Sign in to the registry and read its product groups — proves the connection works. POST /dpp/registry/:env/check */
        async function check(collectionId, env) {
            return post(`${base(collectionId)}/registry/${enc(env)}/check`, {});
        }
        registry.check = check;
    })(registry = dpp.registry || (dpp.registry = {}));
    /** The collection's passports. */
    let passports;
    (function (passports) {
        /**
         * The collection's passports, a page at a time: all of them, or those of one product, batch or item,
         * or with one status. GET /dpp/passports
         *
         * @example
         * ```typescript
         * let page = await dpp.passports.list(collectionId, { productId, status: 'active', limit: 100 })
         * page.items // DppPassport[]
         * while (page.nextCursor) {
         *   page = await dpp.passports.list(collectionId, { productId, status: 'active', limit: 100, cursor: page.nextCursor })
         * }
         * ```
         */
        async function list(collectionId, q = {}) {
            return request(`${base(collectionId)}/passports${listQuery(q)}`);
        }
        passports.list = list;
        /** One passport, with `check` (what it's still missing) and its `url`. GET /dpp/passports/:id */
        async function get(collectionId, passportId) {
            const out = await request(`${base(collectionId)}/passports/${enc(passportId)}`);
            return out.passport;
        }
        passports.get = get;
        /** Make a passport. POST /dpp/passports */
        async function create(collectionId, input) {
            const out = await post(`${base(collectionId)}/passports`, input);
            return out.passport;
        }
        passports.create = create;
        /**
         * Change a passport. `public` / `restricted` are merged into what's there unless `replace` is true. A change to
         * what it says makes a new version. PUT /dpp/passports/:id
         */
        async function update(collectionId, passportId, input, opts = {}) {
            return put(`${base(collectionId)}/passports/${enc(passportId)}${query({ replace: opts.replace ? "true" : undefined })}`, input);
        }
        passports.update = update;
        /**
         * Publish the passport for a product, batch or item (`productId` / `batchId` / `proofId`) at a granularity:
         * updates the one already there or makes it. The fields replace what's there (pass `merge: true` to merge).
         * Saving the same content again changes nothing. PUT /dpp/passports/by-anchor
         *
         * @example
         * ```typescript
         * const { passport } = await dpp.passports.upsert(collectionId, {
         *   productId, productGroup: 'BATTERIES', productSubGroup: 'EV', granularity: 'model',
         *   public: { batteryChemistry: [...], manufacturerIdentification: {...} },
         *   restricted: { dismantlingInformation: [...] },
         * })
         * if (!passport.check.ready) console.log('Still missing', passport.check.missing)
         * ```
         */
        async function upsert(collectionId, input, opts = {}) {
            return put(`${base(collectionId)}/passports/by-anchor${query({ replace: opts.merge ? "false" : undefined })}`, input);
        }
        passports.upsert = upsert;
        /** `upsert` for up to 500 passports at once (e.g. one per battery); each answers on its own. POST /dpp/passports/bulk */
        async function upsertMany(collectionId, items, opts = {}) {
            return post(`${base(collectionId)}/passports/bulk${query({ replace: opts.merge ? "false" : undefined })}`, { passports: items });
        }
        passports.upsertMany = upsertMany;
        /**
         * Its versions, newest first, a page at a time (`limit` and `cursor`; 50 unless you say otherwise).
         * Read one with `dpp.read(collectionId, id, { version })`. GET /dpp/passports/:id/versions
         *
         * @example
         * ```typescript
         * let page = await dpp.passports.versions(collectionId, passportId, { limit: 20 })
         * const latest = page.items[0].version
         * while (page.nextCursor) {
         *   page = await dpp.passports.versions(collectionId, passportId, { limit: 20, cursor: page.nextCursor })
         * }
         * ```
         */
        async function versions(collectionId, passportId, options = {}) {
            return request(`${base(collectionId)}/passports/${enc(passportId)}/versions${listQuery(options)}`);
        }
        passports.versions = versions;
        /** No longer valid: stays at its address, marked invalid (the registry keeps its record). POST /dpp/passports/:id/withdraw */
        async function withdraw(collectionId, passportId) {
            const out = await post(`${base(collectionId)}/passports/${enc(passportId)}/withdraw`, {});
            return out.passport;
        }
        passports.withdraw = withdraw;
        /** Valid again. POST /dpp/passports/:id/restore */
        async function restore(collectionId, passportId) {
            const out = await post(`${base(collectionId)}/passports/${enc(passportId)}/restore`, {});
            return out.passport;
        }
        passports.restore = restore;
    })(passports = dpp.passports || (dpp.passports = {}));
    /** Registry requests and their outcomes. */
    let tasks;
    (function (tasks) {
        /**
         * Requests sent to one environment, newest first, a page at a time (`limit` and `cursor`; 50 unless
         * you say otherwise). GET /dpp/registry/:env/tasks
         *
         * @example
         * ```typescript
         * let page = await dpp.tasks.list(collectionId, 'acc', { limit: 20 })
         * while (page.nextCursor) {
         *   page = await dpp.tasks.list(collectionId, 'acc', { limit: 20, cursor: page.nextCursor })
         * }
         * ```
         */
        async function list(collectionId, env, options = {}) {
            return request(`${base(collectionId)}/registry/${enc(env)}/tasks${listQuery(options)}`);
        }
        tasks.list = list;
        /** Ask the registry how a request went and record it on its passports. POST /dpp/registry/:env/tasks/:taskId/refresh */
        async function refresh(collectionId, env, taskId) {
            const out = await post(`${base(collectionId)}/registry/${enc(env)}/tasks/${enc(taskId)}/refresh`, {});
            return out.task;
        }
        tasks.refresh = refresh;
    })(tasks = dpp.tasks || (dpp.tasks = {}));
})(dpp || (dpp = {}));
