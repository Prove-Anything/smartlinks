import type { JsonValue, ProductQueryRequest } from "./product.js";
import type { ListResult } from "./list.js";
export interface FacetDefinition {
    id?: string;
    orgId?: string;
    collectionId?: string | null;
    key: string;
    name: string;
    description?: string | null;
    namespace?: string | null;
    cardinality?: "single" | "multi";
    kind?: "system" | "custom";
    hierarchical?: boolean;
    reserved?: boolean;
    enabled?: boolean;
    sortOrder?: number | null;
    config?: Record<string, JsonValue>;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    values?: FacetValue[];
}
export interface FacetValue {
    id?: string;
    orgId?: string;
    collectionId?: string | null;
    facetDefinitionId?: string;
    facetKey: string;
    key: string;
    slug?: string | null;
    name: string;
    shortName?: string | null;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    image?: Record<string, JsonValue> | null;
    metadata?: Record<string, JsonValue>;
    sortOrder?: number | null;
    parentValueId?: string | null;
    parentValueKey?: string | null;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    count?: number;
}
export interface FacetDefinitionWriteInput {
    key?: string;
    name: string;
    description?: string | null;
    namespace?: string | null;
    cardinality?: "single" | "multi";
    kind?: "system" | "custom";
    hierarchical?: boolean;
    reserved?: boolean;
    enabled?: boolean;
    sortOrder?: number | null;
    config?: Record<string, JsonValue>;
}
export interface FacetValueWriteInput {
    key?: string;
    slug?: string | null;
    name: string;
    shortName?: string | null;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    image?: Record<string, JsonValue> | null;
    metadata?: Record<string, JsonValue>;
    sortOrder?: number | null;
    parentValueKey?: string | null;
    enabled?: boolean;
}
/** What `facets.list` / `facets.publicList` return: every facet in `items` (`nextCursor` is always null). */
export type FacetListResponse = ListResult<FacetDefinition>;
/** What `facets.listValues` / `facets.publicListValues` return: the facet, and all its values in `items`. */
export interface FacetValueListResponse extends ListResult<FacetValue> {
    facet: FacetDefinition;
}
export interface FacetValueResponse {
    facet: FacetDefinition;
    item: FacetValue;
}
export interface FacetQueryRequest {
    facetKeys?: string[];
    includeEmpty?: boolean;
    includeDeleted?: boolean;
    namespace?: string | null;
    query?: ProductQueryRequest["query"] & {
        facetEquals?: Record<string, JsonValue | JsonValue[]>;
    };
}
export interface FacetBucket {
    facetKey: string;
    valueKey: string;
    name?: string;
    count: number;
}
/**
 * What `facets.query` / `facets.publicQuery` return: each facet with its values in `items`
 * (`nextCursor` is always null), and the counts in `buckets`.
 */
export interface FacetQueryResponse extends ListResult<{
    facet: FacetDefinition;
    values: FacetValue[];
}> {
    buckets: FacetBucket[];
    meta?: {
        source?: "postgres";
        matchedProducts?: number;
    };
}
export interface FacetListParams {
    includeDeleted?: boolean;
    kind?: "system" | "custom";
    reserved?: boolean;
    namespace?: string;
}
export interface PublicFacetListParams {
    namespace?: string;
}
/** What `facets.namespaces` / `facets.publicNamespaces` return: the namespace names in `items` (`nextCursor` is always null). */
export type FacetNamespaceListResponse = ListResult<string>;
export interface FacetGetParams {
    includeValues?: boolean;
    includeDeleted?: boolean;
}
export interface FacetValueListParams {
    includeDeleted?: boolean;
}
export interface FacetValueGetParams {
    includeDeleted?: boolean;
}
export type FacetValueDefinition = FacetValue;
