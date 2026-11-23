import type { ServiceAccount, ServiceAccountList, CreateServiceAccountInput, CreateServiceAccountResult, UpdateServiceAccountInput, ServiceAccountKeyResult, AddServiceAccountToCollectionInput } from "../types/serviceAccounts.js";
export declare namespace serviceAccounts {
    /**
     * The service accounts that work on this collection — its own (`home: true`, with `alsoOn`) and other
     * collections' (`home: false`, with `homeCollection`) — never their keys, and the access levels that can be
     * given. GET /service-accounts
     */
    function list(collectionId: string): Promise<ServiceAccountList>;
    /**
     * Make a service account → `{ serviceAccount, key }`. Show the key once — it can't be read again. You can't
     * give it more access than you have. POST /service-accounts
     */
    function create(collectionId: string, input: CreateServiceAccountInput): Promise<CreateServiceAccountResult>;
    /** Rename it (home collection only) and/or change its access on this collection. PUT /service-accounts/:id */
    function update(collectionId: string, id: string, input: UpdateServiceAccountInput): Promise<ServiceAccount>;
    /** Give it a new key → `{ key }` (shown once; home collection only); the old key stops working within a minute. POST /service-accounts/:id/key */
    function newKey(collectionId: string, id: string): Promise<ServiceAccountKeyResult>;
    /**
     * Let it work on another collection too, or change its access there. Call on its home collection; you must
     * be an admin of `input.collectionId` as well, and can't give more access than you have there.
     * POST /service-accounts/:id/collections
     */
    function addTo(collectionId: string, id: string, input: AddServiceAccountToCollectionInput): Promise<ServiceAccount>;
    /** Stop it working on `otherCollectionId` (call on its home collection). DELETE /service-accounts/:id/collections/:otherId */
    function removeFrom(collectionId: string, id: string, otherCollectionId: string): Promise<{
        ok: true;
    }>;
    /**
     * On its home collection: delete it — its key stops working and its access is removed everywhere. On another
     * collection it works on: remove it from that collection only. DELETE /service-accounts/:id
     */
    function remove(collectionId: string, id: string): Promise<{
        ok: true;
    }>;
}
