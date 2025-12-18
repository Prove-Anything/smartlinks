import type { JourneyRecord, JourneyList, ListJourneysQuery, CreateJourneyBody, UpdateJourneyBody } from "../types/journeys";
export declare namespace journeys {
    function create(collectionId: string, body: CreateJourneyBody): Promise<JourneyRecord>;
    function list(collectionId: string, query?: ListJourneysQuery): Promise<JourneyList>;
    function get(collectionId: string, id: string): Promise<JourneyRecord>;
    function update(collectionId: string, id: string, body: UpdateJourneyBody): Promise<JourneyRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
}
