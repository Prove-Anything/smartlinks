import type { ResearchFetchRequest, ResearchFetchResult } from "../types/research.js";
export declare namespace research {
    /**
     * Fetch + extract a web page: clean markdown, page metadata, and any schema.org
     * JSON-LD (filtered by `type` when given). Firecrawl-primary, cached per collection.
     * POST /admin/collection/:collectionId/research/fetch
     */
    function fetch(collectionId: string, body: ResearchFetchRequest): Promise<ResearchFetchResult>;
}
