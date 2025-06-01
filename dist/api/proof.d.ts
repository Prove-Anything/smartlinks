import { ProofResponse } from "../types/proof";
export declare namespace proof {
    /**
     * Retrieves a single Proof by Collection ID and Proof ID.
     * @param collectionId – Identifier of the parent collection
     * @param proofId      – Identifier of the proof
     * @returns Promise resolving to a ProofResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, proofId: string): Promise<ProofResponse>;
}
