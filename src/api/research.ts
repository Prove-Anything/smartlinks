// src/api/research.ts
//
// Web research — the direct (deterministic, non-agent) fetch+extract capability.
// Apps that just want a page's content/structured data call this rather than the AI
// agent loop (e.g. the Recipes app fetching a recipe's schema.org JSON-LD from a URL).
//
// Endpoints: /admin/collection/:collectionId/research

import { post } from "../http"
import type { ResearchFetchRequest, ResearchFetchResult } from "../types/research"

export namespace research {
  /**
   * Fetch + extract a web page: clean markdown, page metadata, and any schema.org
   * JSON-LD (filtered by `type` when given). Firecrawl-primary, cached per collection.
   * POST /admin/collection/:collectionId/research/fetch
   */
  export async function fetch(collectionId: string, body: ResearchFetchRequest): Promise<ResearchFetchResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/research/fetch`
    return post<ResearchFetchResult>(path, body)
  }
}
