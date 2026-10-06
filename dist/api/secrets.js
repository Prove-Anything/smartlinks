// src/api/secrets.ts
//
// Sealed-secret store — the credentials that back integration flows and other
// server-side handlers. WRITE-ONLY from the client: you can set, rotate, list
// (refs + masked hints + metadata) and delete, but a value NEVER comes back over the
// API. It is sealed at rest and resolved server-side only, at execution time.
//
// Two kinds:
//   - an APP's own secret (`put` / `listOwn` / `removeOwn`): saved by name from the app's admin
//     screen, read by that app's server functions with ctx.secrets.get('<name>'). Another app's
//     secret of the same name is a different secret.
//   - a collection secret (`set` / `rotate` / ...): `set` returns a generated `ref` to put on an
//     integration flow's config.connection.auth.credentialRef.
//
// Endpoints: /admin/collection/:collectionId/app/:appId/secrets, /admin/collection/:collectionId/secrets
import { request, post, put as put_, del, getAppContext } from "../http.js";
function enc(v) { return encodeURIComponent(v); }
function encodeQuery(params = {}) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "")
            continue;
        search.set(key, String(value));
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}
export var secrets;
(function (secrets) {
    const base = (collectionId) => `/admin/collection/${enc(collectionId)}/secrets`;
    const appBase = (collectionId, opts) => {
        var _a;
        const app = (_a = opts.appId) !== null && _a !== void 0 ? _a : getAppContext();
        if (!app)
            throw new Error("secrets: no app — pass { appId } or initializeApi({ appId })");
        return `/admin/collection/${enc(collectionId)}/app/${enc(app)}/secrets`;
    };
    /**
     * Save this app's secret `name` on the collection (create or replace) — what the app's server
     * functions read with `ctx.secrets.get(name)` (declare `secrets:<name>` in the manifest). Call it
     * from your admin screen as a collection admin. Write-only: returns `{ ref: name, hint }`, never
     * the value. PUT /app/:appId/secrets/:name
     */
    async function put(collectionId, name, value, opts = {}) {
        return put_(`${appBase(collectionId, opts)}/${enc(name)}`, { value });
    }
    secrets.put = put;
    /** This app's secrets on the collection: names + masked hints (never values). GET /app/:appId/secrets */
    async function listOwn(collectionId, opts = {}) {
        return request(appBase(collectionId, opts));
    }
    secrets.listOwn = listOwn;
    /** Delete this app's secret `name`. DELETE /app/:appId/secrets/:name */
    async function removeOwn(collectionId, name, opts = {}) {
        return del(`${appBase(collectionId, opts)}/${enc(name)}`);
    }
    secrets.removeOwn = removeOwn;
    /** List secrets as refs + masked hints + metadata (never values). GET /secrets */
    async function list(collectionId, query = {}) {
        return request(`${base(collectionId)}${encodeQuery(query)}`);
    }
    secrets.list = list;
    /**
     * Create a collection secret with a GENERATED ref. POST /secrets → { ref, hint }. Store the ref on a
     * flow. For a secret your app's server functions read by name, use `put` instead.
     */
    async function set(collectionId, input) {
        return post(base(collectionId), input);
    }
    secrets.set = set;
    /** Metadata for one secret (never the value). GET /secrets/:ref */
    async function get(collectionId, ref) {
        return request(`${base(collectionId)}/${enc(ref)}`);
    }
    secrets.get = get;
    /** Rotate/update a secret's value (and optionally name/purpose). PUT /secrets/:ref → { ref, hint } */
    async function rotate(collectionId, ref, input) {
        return put_(`${base(collectionId)}/${enc(ref)}`, input);
    }
    secrets.rotate = rotate;
    /** Soft-delete a secret. DELETE /secrets/:ref */
    async function remove(collectionId, ref) {
        return del(`${base(collectionId)}/${enc(ref)}`);
    }
    secrets.remove = remove;
})(secrets || (secrets = {}));
