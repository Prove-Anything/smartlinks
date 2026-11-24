import { request, post, patch, del } from "../http.js";
import { listQuery } from "../list.js";
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
 * const { items } = await knowledge.publicSearch('coll_123', { q: 'how do I descale', filters: { productId: 'p1' } })
 * ```
 */
export var knowledge;
(function (knowledge) {
    const adm = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/knowledge`;
    const pub = (collectionId) => `/public/collection/${encodeURIComponent(collectionId)}/knowledge`;
    const enc = encodeURIComponent;
    /**
     * The collection's sets, with their source and passage counts (admin). A page at a time (`limit` and
     * `cursor`; 50 unless you say otherwise).
     *
     * @example
     * ```typescript
     * let page = await knowledge.listSets('coll_123')
     * while (page.nextCursor) page = await knowledge.listSets('coll_123', { cursor: page.nextCursor })
     * ```
     */
    async function listSets(collectionId, options = {}) {
        return request(`${adm(collectionId)}/sets${listQuery(options)}`);
    }
    knowledge.listSets = listSets;
    /** Create a set, or update the one with this key (admin). */
    async function saveSet(collectionId, body) {
        return post(`${adm(collectionId)}/sets`, body);
    }
    knowledge.saveSet = saveSet;
    /** One set, by id or key (admin). */
    async function getSet(collectionId, set) {
        return request(`${adm(collectionId)}/sets/${enc(set)}`);
    }
    knowledge.getSet = getSet;
    async function updateSet(collectionId, set, body) {
        return patch(`${adm(collectionId)}/sets/${enc(set)}`, body);
    }
    knowledge.updateSet = updateSet;
    /** Delete a set with its sources and passages (admin). */
    async function deleteSet(collectionId, set) {
        return del(`${adm(collectionId)}/sets/${enc(set)}`);
    }
    knowledge.deleteSet = deleteSet;
    /**
     * A set's sources, with their status (admin). A page at a time (`limit` and `cursor`; 50 unless you
     * say otherwise).
     *
     * @example
     * ```typescript
     * let page = await knowledge.listSources('coll_123', 'manuals')
     * while (page.nextCursor) page = await knowledge.listSources('coll_123', 'manuals', { cursor: page.nextCursor })
     * ```
     */
    async function listSources(collectionId, set, options = {}) {
        return request(`${adm(collectionId)}/sets/${enc(set)}/sources${listQuery(options)}`);
    }
    knowledge.listSources = listSources;
    /** Add a source; feeds and pages are read in the background (admin). */
    async function addSource(collectionId, set, body) {
        return post(`${adm(collectionId)}/sets/${enc(set)}/sources`, body);
    }
    knowledge.addSource = addSource;
    async function updateSource(collectionId, sourceId, body) {
        return patch(`${adm(collectionId)}/sources/${enc(sourceId)}`, body);
    }
    knowledge.updateSource = updateSource;
    async function deleteSource(collectionId, sourceId) {
        return del(`${adm(collectionId)}/sources/${enc(sourceId)}`);
    }
    knowledge.deleteSource = deleteSource;
    /** Read a source again now (`force` re-splits even if it hasn't changed) (admin). */
    async function reindex(collectionId, sourceId, opts = {}) {
        return post(`${adm(collectionId)}/sources/${enc(sourceId)}/reindex`, opts);
    }
    knowledge.reindex = reindex;
    /** Push documents into a `documents` source; the same `ref` replaces its earlier version. Up to 500 at a time (admin). */
    async function upsertDocuments(collectionId, sourceId, documents) {
        return post(`${adm(collectionId)}/sources/${enc(sourceId)}/documents`, { documents });
    }
    knowledge.upsertDocuments = upsertDocuments;
    /** Remove pushed documents by `ref` (admin). */
    async function removeDocuments(collectionId, sourceId, refs) {
        return post(`${adm(collectionId)}/sources/${enc(sourceId)}/documents/remove`, { refs });
    }
    knowledge.removeDocuments = removeDocuments;
    /**
     * Search every set, staff ones included (admin). `q` is what to look for. The matches come back as
     * `items`, best first, with the `query` and the search `mode` beside them. `limit` says how many matches
     * to return (default 8, at most 25); `cursor` is the previous page's `nextCursor`.
     *
     * @example
     * ```typescript
     * const { items, mode } = await knowledge.search('coll_123', { q: 'how do I descale', limit: 5 })
     * ```
     */
    async function search(collectionId, body) {
        return post(`${adm(collectionId)}/search`, body);
    }
    knowledge.search = search;
    /**
     * Search from a website, Portal or Hub: public sets, plus customer sets for a signed-in person. The
     * options and the answer are the same as the admin `search`: `q` is what to look for, and the matches come
     * back as `items`, best first, with the `query` and the search `mode` beside them. `limit` says how many
     * matches to return (default 8, at most 25); `cursor` is the previous page's `nextCursor`.
     *
     * @example
     * ```typescript
     * const { items } = await knowledge.publicSearch('coll_123', { q: 'how do I descale', limit: 5 })
     * for (const r of items) console.log(r.title, r.heading, r.url, r.snippet)
     * ```
     */
    async function publicSearch(collectionId, body) {
        return post(`${pub(collectionId)}/search`, body);
    }
    knowledge.publicSearch = publicSearch;
})(knowledge || (knowledge = {}));
