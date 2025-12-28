import type { Location, LocationPayload, LocationSearchQuery, LocationSearchResponse } from "../types/location";
export declare namespace location {
    /**
     * Platform: Create a global location (super admin; requires features.adminApps)
     * POST /platform/location
     */
    function createGlobal(params: LocationPayload): Promise<Location>;
    /**
     * Admin: Create a collection-scoped location
     * POST /admin/collection/:collectionId/location
     */
    function create(collectionId: string, params: LocationPayload): Promise<Location>;
    /**
     * Admin: Search locations to pick during setup (combines collection + global)
     * GET /admin/collection/:collectionId/location/search
     */
    function search(collectionId: string, query?: LocationSearchQuery): Promise<LocationSearchResponse>;
    /**
     * Public: Fetch a global location by ID
     * GET /public/location/:locationId
     */
    function getPublic(locationId: string): Promise<Location>;
    /**
     * Public: Fetch a location for a collection; returns either a collection-owned or global fallback
     * GET /public/collection/:collectionId/location/:locationId
     */
    function getPublicForCollection(collectionId: string, locationId: string): Promise<Location>;
}
