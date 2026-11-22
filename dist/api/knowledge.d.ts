import type { KnowledgeSet, SaveKnowledgeSetRequest, UpdateKnowledgeSetRequest, KnowledgeSource, AddKnowledgeSourceRequest, UpdateKnowledgeSourceRequest, KnowledgeDocument, KnowledgeSearchRequest, KnowledgeSearchResponse } from "../types/knowledge.js";
/**
 * Knowledge search: make a collection's content searchable by meaning and keywords, for people and for AI.
 *
 * A collection has **sets** ("Product manuals", "Help articles"), each `public`, `customer` (signed-in
 * people) or `staff`. A set points at **sources**: a Markdown feed, a web page, or documents your app pushes.
 * The platform splits them into passages along their headings, keeps them in step as the sources change, and
 * searches with meaning and keywords together, so exact terms (model numbers, error codes) are found too.
 *
 * - Admin calls (`listSets`, `saveSet`, `addSource`, `upsertDocuments`, `search`) need a collection admin.
 * - `publicSearch` works from a website, Portal or Hub: anyone sees public sets, a signed-in person customer
 *   sets too. Staff sets are never searchable there.
 * - AI agents get the `knowledge.search` tool.
 *
 * @example
 * ```typescript
 * await knowledge.saveSet('coll_123', { key: 'manuals', name: 'Product manuals', visibility: 'public' })
 * const src = await knowledge.addSource('coll_123', 'manuals', { kind: 'documents' })
 * await knowledge.upsertDocuments('coll_123', src.id, [
 *   { ref: 'kettle', title: 'Kettle manual', body: '## Descaling\n\nDescale monthly…', meta: { productId: 'p1' } },
 * ])
 * const { results } = await knowledge.publicSearch('coll_123', { query: 'how do I descale', filters: { productId: 'p1' } })
 * ```
 */
export declare namespace knowledge {
    /** Every set, with its source and passage counts (admin). */
    function listSets(collectionId: string): Promise<KnowledgeSet[]>;
    /** Create a set, or update the one with this key (admin). */
    function saveSet(collectionId: string, body: SaveKnowledgeSetRequest): Promise<KnowledgeSet>;
    /** One set, by id or key (admin). */
    function getSet(collectionId: string, set: string): Promise<KnowledgeSet>;
    function updateSet(collectionId: string, set: string, body: UpdateKnowledgeSetRequest): Promise<KnowledgeSet>;
    /** Delete a set with its sources and passages (admin). */
    function deleteSet(collectionId: string, set: string): Promise<{
        deleted: boolean;
    }>;
    /** A set's sources, with their status (admin). */
    function listSources(collectionId: string, set: string): Promise<KnowledgeSource[]>;
    /** Add a source; feeds and pages are read in the background (admin). */
    function addSource(collectionId: string, set: string, body: AddKnowledgeSourceRequest): Promise<KnowledgeSource>;
    function updateSource(collectionId: string, sourceId: string, body: UpdateKnowledgeSourceRequest): Promise<KnowledgeSource>;
    function deleteSource(collectionId: string, sourceId: string): Promise<{
        deleted: boolean;
    }>;
    /** Read a source again now (`force` re-splits even if it hasn't changed) (admin). */
    function reindex(collectionId: string, sourceId: string, opts?: {
        force?: boolean;
    }): Promise<{
        queued: boolean;
    }>;
    /** Push documents into a `documents` source; the same `ref` replaces its earlier version. Up to 500 at a time (admin). */
    function upsertDocuments(collectionId: string, sourceId: string, documents: KnowledgeDocument[]): Promise<{
        documents: number;
        passages: number;
    }>;
    /** Remove pushed documents by `ref` (admin). */
    function removeDocuments(collectionId: string, sourceId: string, refs: string[]): Promise<{
        removed: number;
    }>;
    /** Search every set, staff ones included (admin). */
    function search(collectionId: string, body: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse>;
    /** Search from a website, Portal or Hub: public sets, plus customer sets for a signed-in person. */
    function publicSearch(collectionId: string, body: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse>;
}
