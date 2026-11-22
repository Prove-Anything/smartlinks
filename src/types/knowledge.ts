// Knowledge search: a collection's AI-searchable content (prove docs/design/knowledge-search.md).

/** Who may search a set: anyone, signed-in people, or the business's own staff and assistants. */
export type KnowledgeVisibility = 'public' | 'customer' | 'staff'

/** Where a set's passages come from. */
export type KnowledgeSourceKind =
  /** A Markdown bundle: documents separated by `---`, each with a `Source: <url>` line (the llms-full format). */
  | 'markdown_feed'
  /** One web page or document at an address. */
  | 'url'
  /** Documents an app pushes itself with `knowledge.upsertDocuments`. */
  | 'documents'

export interface KnowledgeSet {
  id: string
  /** Lower-case key, unique in the collection: "docs", "manuals". */
  key: string
  name: string
  description: string | null
  visibility: KnowledgeVisibility
  /** The app that declared the set, if any. */
  ownerAppId: string | null
  /** The embedding model its passages were embedded with (null until embedded). */
  embedModel: string | null
  createdAt: string
  updatedAt: string
  /** On list: how many sources and passages it has. */
  sourceCount?: number
  passageCount?: number
}

export interface SaveKnowledgeSetRequest {
  key: string
  name: string
  description?: string | null
  /** Default `staff`. */
  visibility?: KnowledgeVisibility
}

export interface UpdateKnowledgeSetRequest {
  name?: string
  description?: string | null
  visibility?: KnowledgeVisibility
}

export interface KnowledgeSource {
  id: string
  setId: string
  kind: KnowledgeSourceKind
  name: string | null
  /** `markdown_feed` and `url`: `{ url }` (https). */
  config: Record<string, any>
  /** Re-read every this many hours (default 24 for feeds and pages; null = only when asked). */
  refreshHours: number | null
  status: 'pending' | 'indexing' | 'ready' | 'failed'
  /** Why the last read failed (the previous passages stay searchable meanwhile). */
  error: string | null
  passageCount: number
  lastIndexedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AddKnowledgeSourceRequest {
  kind: KnowledgeSourceKind
  config?: { url?: string; [key: string]: any }
  name?: string
  refreshHours?: number | null
}

export interface UpdateKnowledgeSourceRequest {
  config?: { url?: string; [key: string]: any }
  name?: string
  refreshHours?: number | null
}

/** A document an app pushes into a `documents` source. Re-pushing the same `ref` replaces it. */
export interface KnowledgeDocument {
  ref: string
  title: string
  /** Markdown. Split into passages along its headings. */
  body: string
  /** The link to show with an answer. */
  url?: string
  /** Details to filter searches on, e.g. `{ productId: 'p1' }`. */
  meta?: Record<string, any>
}

export interface KnowledgeSearchRequest {
  query: string
  /** Only these sets (ids or keys). Default: every set the caller may read. */
  sets?: string[]
  /** Exact matches on a passage's details, e.g. `{ productId: 'p1' }`. */
  filters?: Record<string, any>
  /** How many results (default 8, at most 25). */
  k?: number
}

export interface KnowledgeSearchResult {
  id: string
  /** The document it came from. */
  title: string
  /** Its section: "Settings › Email footer". */
  heading: string | null
  /** A link to the section. */
  url: string | null
  /** A short piece around the match, for a results list. */
  snippet: string
  /** The whole passage, for an AI to read. */
  text: string
  score: number
  set: { id: string; key: string; name: string }
  sourceId: string
  meta: Record<string, any>
}

export interface KnowledgeSearchResponse {
  query: string
  results: KnowledgeSearchResult[]
  /** `hybrid` (meaning + keywords), `keywords` (where vectors aren't available) or `none` (no sets to search). */
  mode: 'hybrid' | 'keywords' | 'none'
}
