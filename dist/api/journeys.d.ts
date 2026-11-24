import type { JourneyRecord, ListJourneysQuery, CreateJourneyBody, UpdateJourneyBody } from "../types/journeys.js";
import type { ListResult } from "../types/list.js";
export declare namespace journeys {
    function create(collectionId: string, body: CreateJourneyBody): Promise<JourneyRecord>;
    /**
     * List the collection's journeys (admin).
     * GET /admin/collection/:collectionId/journeys
     *
     * @example
     * ```typescript
     * let page = await journeys.list('coll_123', { active: true, limit: 50 })
     * while (page.nextCursor) page = await journeys.list('coll_123', { active: true, limit: 50, cursor: page.nextCursor })
     * ```
     */
    function list(collectionId: string, query?: ListJourneysQuery): Promise<ListResult<JourneyRecord>>;
    function get(collectionId: string, id: string): Promise<JourneyRecord>;
    function update(collectionId: string, id: string, body: UpdateJourneyBody): Promise<JourneyRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
}
