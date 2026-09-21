// src/api/secrets.ts
//
// Sealed-secret store — the credentials that back integration flows and other
// server-side handlers. WRITE-ONLY from the client: you can set, rotate, list
// (refs + masked hints + metadata) and delete, but a value NEVER comes back over the
// API. It is sealed at rest and resolved server-side only, at execution time.
//
// Typical use: `set` a credential, take the returned `ref`, and put it on a flow's
// config.connection.auth.credentialRef.
//
// Endpoints: /admin/collection/:collectionId/secrets
import { request, post, put, del } from "../http.js";
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
    /** List secrets as refs + masked hints + metadata (never values). GET /secrets */
    async function list(collectionId, query = {}) {
        return request(`${base(collectionId)}${encodeQuery(query)}`);
    }
    secrets.list = list;
    /** Create a secret. POST /secrets → { ref, hint }. Store the ref on a flow. */
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
        return put(`${base(collectionId)}/${enc(ref)}`, input);
    }
    secrets.rotate = rotate;
    /** Soft-delete a secret. DELETE /secrets/:ref */
    async function remove(collectionId, ref) {
        return del(`${base(collectionId)}/${enc(ref)}`);
    }
    secrets.remove = remove;
})(secrets || (secrets = {}));
