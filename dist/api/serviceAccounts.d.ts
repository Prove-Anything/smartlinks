import type { ServiceAccount, ServiceAccountList, CreateServiceAccountInput, CreateServiceAccountResult, UpdateServiceAccountInput, ServiceAccountKeyResult } from "../types/serviceAccounts.js";
export declare namespace serviceAccounts {
    /** The collection's service accounts (never their keys) and the access levels that can be given. GET /service-accounts */
    function list(collectionId: string): Promise<ServiceAccountList>;
    /**
     * Make a service account → `{ serviceAccount, key }`. Show the key once — it can't be read again. You can't
     * give it more access than you have. POST /service-accounts
     */
    function create(collectionId: string, input: CreateServiceAccountInput): Promise<CreateServiceAccountResult>;
    /** Rename it and/or change its access. PUT /service-accounts/:id */
    function update(collectionId: string, id: string, input: UpdateServiceAccountInput): Promise<ServiceAccount>;
    /** Give it a new key → `{ key }` (shown once); the old key stops working within a minute. POST /service-accounts/:id/key */
    function newKey(collectionId: string, id: string): Promise<ServiceAccountKeyResult>;
    /** Delete it: its key stops working and its access is removed. DELETE /service-accounts/:id */
    function remove(collectionId: string, id: string): Promise<{
        ok: true;
    }>;
}
