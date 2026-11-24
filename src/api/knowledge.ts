import { request, post, patch, del } from "../http"
import type {
  KnowledgeSet, SaveKnowledgeSetRequest, UpdateKnowledgeSetRequest,
  KnowledgeSource, AddKnowledgeSourceRequest, UpdateKnowledgeSourceRequest,
  KnowledgeDocument, KnowledgeSearchRequest, KnowledgeSearchResponse, KnowledgeSearchResult,
} from "../types/knowledge"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

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
export namespace knowledge {
  const adm = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/knowledge`
  const pub = (collectionId: string) => `/public/collection/${encodeURIComponent(collectionId)}/knowledge`
  const enc = encodeURIComponent

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
  export async function listSets(collectionId: string, options: ListOptions = {}): Promise<ListResult<KnowledgeSet>> {
    return request(`${adm(collectionId)}/sets${listQuery(options)}`)
  }

  /** Create a set, or update the one with this key (admin). */
  export async function saveSet(collectionId: string, body: SaveKnowledgeSetRequest): Promise<KnowledgeSet> {
    return post(`${adm(collectionId)}/sets`, body)
  }

  /** One set, by id or key (admin). */
  export async function getSet(collectionId: string, set: string): Promise<KnowledgeSet> {
    return request(`${adm(collectionId)}/sets/${enc(set)}`)
  }

  export async function updateSet(collectionId: string, set: string, body: UpdateKnowledgeSetRequest): Promise<KnowledgeSet> {
    return patch(`${adm(collectionId)}/sets/${enc(set)}`, body)
  }

  /** Delete a set with its sources and passages (admin). */
  export async function deleteSet(collectionId: string, set: string): Promise<{ deleted: boolean }> {
    return del(`${adm(collectionId)}/sets/${enc(set)}`)
  }

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
  export async function listSources(collectionId: string, set: string, options: ListOptions = {}): Promise<ListResult<KnowledgeSource>> {
    return request(`${adm(collectionId)}/sets/${enc(set)}/sources${listQuery(options)}`)
  }

  /** Add a source; feeds and pages are read in the background (admin). */
  export async function addSource(collectionId: string, set: string, body: AddKnowledgeSourceRequest): Promise<KnowledgeSource> {
    return post(`${adm(collectionId)}/sets/${enc(set)}/sources`, body)
  }

  export async function updateSource(collectionId: string, sourceId: string, body: UpdateKnowledgeSourceRequest): Promise<KnowledgeSource> {
    return patch(`${adm(collectionId)}/sources/${enc(sourceId)}`, body)
  }

  export async function deleteSource(collectionId: string, sourceId: string): Promise<{ deleted: boolean }> {
    return del(`${adm(collectionId)}/sources/${enc(sourceId)}`)
  }

  /** Read a source again now (`force` re-splits even if it hasn't changed) (admin). */
  export async function reindex(collectionId: string, sourceId: string, opts: { force?: boolean } = {}): Promise<{ queued: boolean }> {
    return post(`${adm(collectionId)}/sources/${enc(sourceId)}/reindex`, opts)
  }

  /** Push documents into a `documents` source; the same `ref` replaces its earlier version. Up to 500 at a time (admin). */
  export async function upsertDocuments(collectionId: string, sourceId: string, documents: KnowledgeDocument[]): Promise<{ documents: number; passages: number }> {
    return post(`${adm(collectionId)}/sources/${enc(sourceId)}/documents`, { documents })
  }

  /** Remove pushed documents by `ref` (admin). */
  export async function removeDocuments(collectionId: string, sourceId: string, refs: string[]): Promise<{ removed: number }> {
    return post(`${adm(collectionId)}/sources/${enc(sourceId)}/documents/remove`, { refs })
  }

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
  export async function search(
    collectionId: string,
    body: KnowledgeSearchRequest
  ): Promise<ListResult<KnowledgeSearchResult> & Pick<KnowledgeSearchResponse, 'query' | 'mode'>> {
    return post(`${adm(collectionId)}/search`, body)
  }

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
  export async function publicSearch(
    collectionId: string,
    body: KnowledgeSearchRequest
  ): Promise<ListResult<KnowledgeSearchResult> & Pick<KnowledgeSearchResponse, 'query' | 'mode'>> {
    return post(`${pub(collectionId)}/search`, body)
  }
}
