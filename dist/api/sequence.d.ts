export interface AllocateSequenceInput {
    /** The app that owns the sequence config. */
    appId: string;
    /** The configured sequence id — the key of data.sequenceConfigs on the app config. */
    sequenceId: string;
    /** The STABLE subject identity — the claim-set id from the tap (NOT a per-tap virtual id). */
    subjectId: string;
    /** Optional product scope, when the sequence config is scoped per product. */
    productId?: string;
}
export interface AllocatedSequence {
    /** The allocated (or already-held) number. */
    number: number;
    /** True when this call allocated a new number; false when the subject already had one. */
    isNew: boolean;
}
export declare namespace sequence {
    /**
     * Allocate (or return the existing) sequence number for a subject. Idempotent — safe to
     * call on load (auto-enter) and on a button tap; a subject that already has a number gets
     * it back with `isNew: false`.
     *
     * @example
     *   const { number, isNew } = await sequence.allocate(collectionId, {
     *     appId: 'raffle-app', sequenceId: 'raffle', subjectId: claimSetId,
     *   })
     */
    function allocate(collectionId: string, input: AllocateSequenceInput): Promise<AllocatedSequence>;
}
