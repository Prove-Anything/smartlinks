import type { DppEnvironment, DppRegistry, SetDppRegistryInput, DppRegistryCheckResult, DppGroup, DppPassport, DppPassportInput, DppPassportUpsertInput, DppPassportSaveResult, DppPassportUpsertResult, DppPassportBulkResult, DppPassportVersion, DppPassportListQuery, DppRegisterResult, DppTask, DppTaskRefreshResult, DppDocument } from "../types/dpp.js";
import type { ListResult } from "../types/list.js";
export declare namespace dpp {
    /**
     * What passports can be made: product groups, their kinds, and each view's fields and required fields.
     * All of them in one answer (`nextCursor` is always null). GET /dpp/groups
     *
     * @example
     * ```typescript
     * const { items } = await dpp.groups(collectionId)
     * items.map(g => g.productGroup) // ["BATTERIES", …]
     * ```
     */
    function groups(collectionId: string): Promise<ListResult<DppGroup>>;
    /**
     * Read a passport as the public sees it, at its address (the EU JSON document), or an earlier version of it.
     * No sign-in needed. GET /public/dpp/:collectionId/:passportId
     */
    function read(collectionId: string, passportId: string, opts?: {
        version?: number;
    }): Promise<DppDocument>;
    /**
     * Send passports to the EU registry. They're grouped by product group and sent up to 100 at a time; the registry
     * reads each one at its address. Passports still missing required fields, withdrawn or already registered come
     * back in `skipped`. With `wait: true` the call waits (up to ~45 s) and returns each passport's outcome; otherwise
     * follow up with `dpp.tasks.refresh`. POST /dpp/registry/:env/register
     */
    function register(collectionId: string, env: DppEnvironment, passportIds: string[], opts?: {
        wait?: boolean;
    }): Promise<DppRegisterResult>;
    /** The brand's EU registry connection (one per environment). Managed by the collection's admins. */
    namespace registry {
        /**
         * Both environments, each with `nextStep` (what's left to connect). All of them in one answer
         * (`nextCursor` is always null). GET /dpp/registry
         *
         * @example
         * ```typescript
         * const { items } = await dpp.registry.list(collectionId)
         * const acc = items.find(r => r.environment === 'acc')
         * ```
         */
        function list(collectionId: string): Promise<ListResult<DppRegistry>>;
        /** One environment. GET /dpp/registry/:env */
        function get(collectionId: string, env: DppEnvironment): Promise<DppRegistry>;
        /**
         * Make (or replace) the key the brand's Service Account trusts. The private key stays on SmartLinks' servers;
         * show `publicPem` (or `publicJwk`) for the brand to add to its Service Account in the registry. Replacing the
         * key clears `kid` — the registry gives the new key its own. POST /dpp/registry/:env/key
         */
        function makeKey(collectionId: string, env: DppEnvironment, opts?: {
            alg?: "ES256" | "ES384" | "ES512";
        }): Promise<DppRegistry>;
        /** Save the Service Account's Client ID and key ID, and the brand's Organisation ID, from the registry. PUT /dpp/registry/:env */
        function set(collectionId: string, env: DppEnvironment, input: SetDppRegistryInput): Promise<DppRegistry>;
        /**
         * Connect the brand to the SmartLinks PRACTICE registry in one step — key, enrolment, Service Account and check —
         * to try publishing and registering before the brand is verified with the EU. Never the EU: label it as practice
         * wherever it's shown. POST /dpp/registry/practice/enrol
         */
        function enrolPractice(collectionId: string): Promise<DppRegistryCheckResult>;
        /** Sign in to the registry and read its product groups — proves the connection works. POST /dpp/registry/:env/check */
        function check(collectionId: string, env: DppEnvironment): Promise<DppRegistryCheckResult>;
    }
    /** The collection's passports. */
    namespace passports {
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
        function list(collectionId: string, q?: DppPassportListQuery): Promise<ListResult<DppPassport>>;
        /** One passport, with `check` (what it's still missing) and its `url`. GET /dpp/passports/:id */
        function get(collectionId: string, passportId: string): Promise<DppPassport>;
        /** Make a passport. POST /dpp/passports */
        function create(collectionId: string, input: DppPassportInput & {
            productGroup: string;
        }): Promise<DppPassport>;
        /**
         * Change a passport. `public` / `restricted` are merged into what's there unless `replace` is true. A change to
         * what it says makes a new version. PUT /dpp/passports/:id
         */
        function update(collectionId: string, passportId: string, input: DppPassportInput, opts?: {
            replace?: boolean;
        }): Promise<DppPassportSaveResult>;
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
        function upsert(collectionId: string, input: DppPassportUpsertInput, opts?: {
            merge?: boolean;
        }): Promise<DppPassportUpsertResult>;
        /** `upsert` for up to 500 passports at once (e.g. one per battery); each answers on its own. POST /dpp/passports/bulk */
        function upsertMany(collectionId: string, items: DppPassportUpsertInput[], opts?: {
            merge?: boolean;
        }): Promise<DppPassportBulkResult>;
        /**
         * Its versions, newest first, all in one answer (`nextCursor` is always null); read one with
         * `dpp.read(collectionId, id, { version })`. GET /dpp/passports/:id/versions
         *
         * @example
         * ```typescript
         * const { items } = await dpp.passports.versions(collectionId, passportId)
         * const latest = items[0].version
         * ```
         */
        function versions(collectionId: string, passportId: string): Promise<ListResult<DppPassportVersion>>;
        /** No longer valid: stays at its address, marked invalid (the registry keeps its record). POST /dpp/passports/:id/withdraw */
        function withdraw(collectionId: string, passportId: string): Promise<DppPassport>;
        /** Valid again. POST /dpp/passports/:id/restore */
        function restore(collectionId: string, passportId: string): Promise<DppPassport>;
    }
    /** Registry requests and their outcomes. */
    namespace tasks {
        /**
         * Requests sent to one environment, newest first, all in one answer (`nextCursor` is always null).
         * GET /dpp/registry/:env/tasks
         *
         * @example
         * ```typescript
         * const { items } = await dpp.tasks.list(collectionId, 'acc')
         * ```
         */
        function list(collectionId: string, env: DppEnvironment): Promise<ListResult<DppTask>>;
        /** Ask the registry how a request went and record it on its passports. POST /dpp/registry/:env/tasks/:taskId/refresh */
        function refresh(collectionId: string, env: DppEnvironment, taskId: string): Promise<DppTaskRefreshResult>;
    }
}
