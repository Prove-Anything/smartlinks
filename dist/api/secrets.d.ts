import type { SecretMeta, SecretList, SetSecretInput, SetSecretResult, ListSecretsQuery } from "../types/integrations";
export declare namespace secrets {
    /** List secrets as refs + masked hints + metadata (never values). GET /secrets */
    function list(collectionId: string, query?: ListSecretsQuery): Promise<SecretList>;
    /** Create a secret. POST /secrets → { ref, hint }. Store the ref on a flow. */
    function set(collectionId: string, input: SetSecretInput): Promise<SetSecretResult>;
    /** Metadata for one secret (never the value). GET /secrets/:ref */
    function get(collectionId: string, ref: string): Promise<SecretMeta>;
    /** Rotate/update a secret's value (and optionally name/purpose). PUT /secrets/:ref → { ref, hint } */
    function rotate(collectionId: string, ref: string, input: SetSecretInput): Promise<SetSecretResult>;
    /** Soft-delete a secret. DELETE /secrets/:ref */
    function remove(collectionId: string, ref: string): Promise<{
        deleted: boolean;
    }>;
}
