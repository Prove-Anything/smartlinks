import type { FacetDefinition, FacetDefinitionWriteInput, FacetGetParams, FacetListParams, FacetListResponse, FacetQueryRequest, FacetQueryResponse, FacetValueGetParams, FacetValueListParams, FacetValueListResponse, FacetValueResponse, FacetValueWriteInput, PublicFacetListParams } from "../types/facets";
/**
 * Facet management and aggregation endpoints.
 *
 * Facets are collection-scoped resources mounted directly under `/facets`.
 * Use this namespace to manage facet definitions and values, and to fetch
 * aggregation buckets for browse and filter UIs.
 */
export declare namespace facets {
    function list(collectionId: string, params?: FacetListParams): Promise<FacetListResponse>;
    function create(collectionId: string, data: FacetDefinitionWriteInput): Promise<FacetDefinition>;
    function get(collectionId: string, facetKey: string, params?: FacetGetParams): Promise<FacetDefinition>;
    function update(collectionId: string, facetKey: string, data: FacetDefinitionWriteInput): Promise<FacetDefinition>;
    function remove(collectionId: string, facetKey: string): Promise<void>;
    function listValues(collectionId: string, facetKey: string, params?: FacetValueListParams): Promise<FacetValueListResponse>;
    function createValue(collectionId: string, facetKey: string, data: FacetValueWriteInput): Promise<FacetValueResponse>;
    function getValue(collectionId: string, facetKey: string, valueKey: string, params?: FacetValueGetParams): Promise<FacetValueResponse>;
    function updateValue(collectionId: string, facetKey: string, valueKey: string, data: FacetValueWriteInput): Promise<FacetValueResponse>;
    function removeValue(collectionId: string, facetKey: string, valueKey: string): Promise<void>;
    function query(collectionId: string, body: FacetQueryRequest): Promise<FacetQueryResponse>;
    function publicList(collectionId: string, params?: PublicFacetListParams): Promise<FacetListResponse>;
    function publicGet(collectionId: string, facetKey: string, params?: PublicFacetListParams): Promise<FacetDefinition>;
    function publicListValues(collectionId: string, facetKey: string): Promise<FacetValueListResponse>;
    function publicGetValue(collectionId: string, facetKey: string, valueKey: string): Promise<FacetValueResponse>;
    function publicQuery(collectionId: string, body: FacetQueryRequest): Promise<FacetQueryResponse>;
}
