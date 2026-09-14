// src/api/sequence.ts
//
// Sequences — allocate a guaranteed-unique, monotonic number (raffle tickets, "Nth to
// claim", queue positions) and stamp it onto a record. The sequence (counter key, target,
// field, scope) is configured server-side in app config (data.sequenceConfigs[sequenceId]);
// this call supplies only the subject and is idempotent — a re-tap returns the same number.
// See docs/sequences.md.
import { post } from "../http";
export var sequence;
(function (sequence) {
    const base = (collectionId) => `/public/collection/${encodeURIComponent(collectionId)}/sequence`;
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
    async function allocate(collectionId, input) {
        return post(`${base(collectionId)}/allocate`, input);
    }
    sequence.allocate = allocate;
})(sequence || (sequence = {}));
