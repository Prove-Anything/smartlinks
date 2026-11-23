// src/api/serviceAccounts.ts
//
// A collection's service accounts: identities for the systems that work with it (an ERP, a warehouse
// system, an agency's integration), each with its own key and access level. A service account is a member of
// ONE collection, like a person on the team, and belongs to the collection — not to whoever made it — so it
// keeps working when people leave. Use its key as the bearer (`initializeApi({ bearerToken: key })` or an
// `Authorization: Bearer <key>` header); it can do what a person with the same access can on that collection
// only. It can't invite people, change anyone's access, make keys or other service accounts, make
// collections or hand the collection over.
//
// Managed by the collection's admins (Studio → Team → Service accounts). The key is shown ONCE, when the
// account is made or given a new key; only its hash is kept.
//
// Endpoints: /admin/collection/:collectionId/service-accounts
import { request, post, put, del } from "../http.js";
function enc(v) { return encodeURIComponent(v); }
export var serviceAccounts;
(function (serviceAccounts) {
    const base = (collectionId) => `/admin/collection/${enc(collectionId)}/service-accounts`;
    /** The collection's service accounts (never their keys) and the access levels that can be given. GET /service-accounts */
    async function list(collectionId) {
        return request(base(collectionId));
    }
    serviceAccounts.list = list;
    /**
     * Make a service account → `{ serviceAccount, key }`. Show the key once — it can't be read again. You can't
     * give it more access than you have. POST /service-accounts
     */
    async function create(collectionId, input) {
        return post(base(collectionId), input);
    }
    serviceAccounts.create = create;
    /** Rename it and/or change its access. PUT /service-accounts/:id */
    async function update(collectionId, id, input) {
        const out = await put(`${base(collectionId)}/${enc(id)}`, input);
        return out.serviceAccount;
    }
    serviceAccounts.update = update;
    /** Give it a new key → `{ key }` (shown once); the old key stops working within a minute. POST /service-accounts/:id/key */
    async function newKey(collectionId, id) {
        return post(`${base(collectionId)}/${enc(id)}/key`, {});
    }
    serviceAccounts.newKey = newKey;
    /** Delete it: its key stops working and its access is removed. DELETE /service-accounts/:id */
    async function remove(collectionId, id) {
        return del(`${base(collectionId)}/${enc(id)}`);
    }
    serviceAccounts.remove = remove;
})(serviceAccounts || (serviceAccounts = {}));
