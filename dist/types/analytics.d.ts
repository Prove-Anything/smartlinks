/**
 * Collection analytics types.
 *
 * Separate from the `interactions` namespace. These types cover generic web
 * analytics, click tracking, and tag scan analytics for collection dashboards.
 */
export type AnalyticsSource = 'events' | 'tag';
/**
 * Includes `scan_redirect` - logged automatically by the server (not the
 * client) at the moment a GS1 digital-link scan, claim short-link scan, or
 * NFC tap decides on a redirect destination, before the client ever loads
 * anything. Distinct from `scan_tag`, which the client still writes on
 * landing exactly as before.
 */
export type AnalyticsEventType = string;
export type AnalyticsGranularity = 'hour' | 'day' | 'week' | 'month';
export type AnalyticsMetric = 'count' | 'uniqueSessions' | 'uniqueVisitors';
export type AnalyticsSortOrder = 'asc' | 'desc';
export type AnalyticsDeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';
export type AnalyticsStorageMode = 'local' | 'session' | false;
export type AnalyticsSessionId = number;
export interface AnalyticsLocation {
    country?: string;
    latitude?: number;
    longitude?: number;
    area?: number;
    [key: string]: any;
}
export interface AnalyticsStandardEventFields {
    visitorId?: string;
    referrer?: string;
    referrerHost?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    entryType?: string;
    group?: string;
    tag?: string;
    campaign?: string;
    placement?: string;
    linkGroup?: string;
    linkPlacement?: string;
    linkPosition?: string | number;
    linkTitle?: string;
    destinationDomain?: string;
    pagePath?: string;
    pageId?: string;
    qrCodeId?: string;
    scanMethod?: string;
}
export interface CollectionAnalyticsEvent extends AnalyticsStandardEventFields {
    sessionId?: AnalyticsSessionId;
    eventType: AnalyticsEventType;
    collectionId: string;
    productId?: string;
    proofId?: string;
    batchId?: string;
    variantId?: string;
    appId?: string;
    destinationAppId?: string;
    linkId?: string;
    deviceType?: string;
    href?: string;
    path?: string;
    isExternal?: boolean;
    location?: AnalyticsLocation;
    /**
     * Free-form identifier for which client app logged the event, e.g.
     * `'portal'`, `'hub'`. No enum/whitelist - send whatever string identifies
     * your app. Web-events only; not recorded on tag events.
     */
    source?: string;
    metadata?: Record<string, any>;
}
export interface TagAnalyticsEvent extends AnalyticsStandardEventFields {
    sessionId?: AnalyticsSessionId;
    eventType: AnalyticsEventType;
    collectionId: string;
    productId?: string;
    proofId?: string;
    batchId?: string;
    variantId?: string;
    codeId?: string;
    claimId?: string;
    deviceType?: string;
    path?: string;
    location?: AnalyticsLocation;
    isAdmin?: boolean;
    /**
     * Only relevant if you're logging a redirect-style event yourself. In
     * practice this is mostly written by the server automatically at the
     * moment a GS1 digital-link scan, claim short-link scan, or NFC tap
     * decides on a redirect destination - see the `scan_redirect` eventType.
     */
    redirectMode?: string;
    metadata?: Record<string, any>;
}
export interface AnalyticsTrackOptions {
    preferBeacon?: boolean;
}
export interface AnalyticsBrowserConfig {
    sessionStorageKey?: string;
    sessionIdFactory?: () => AnalyticsSessionId;
    visitorId?: string;
    visitorStorage?: AnalyticsStorageMode;
    visitorStorageKey?: string;
    visitorIdFactory?: () => string;
    autoCaptureCampaignParams?: boolean;
    campaignParamMap?: Partial<Record<keyof AnalyticsStandardEventFields, string | string[]>>;
    defaultCollectionEvent?: Partial<CollectionAnalyticsEvent>;
    defaultTagEvent?: Partial<TagAnalyticsEvent>;
    getCollectionDefaults?: () => Partial<CollectionAnalyticsEvent> | undefined;
    getTagDefaults?: () => Partial<TagAnalyticsEvent> | undefined;
    getLocation?: () => AnalyticsLocation | null | undefined;
}
export interface AnalyticsGeolocationCaptureOptions extends PositionOptions {
    includeCoordinates?: boolean;
    includeAccuracyArea?: boolean;
}
export interface AnalyticsLinkClickInput extends Partial<CollectionAnalyticsEvent> {
    href: string;
    linkId?: string;
    destinationAppId?: string;
    path?: string;
    isExternal?: boolean;
    linkTitle?: string;
}
export interface AnalyticsVisitorIdOptions {
    persist?: boolean;
    storage?: AnalyticsStorageMode;
    storageKey?: string;
}
export interface AnalyticsPageViewBindingOptions {
    trackInitialPageView?: boolean;
    includeHashChanges?: boolean;
    event?: Partial<CollectionAnalyticsEvent>;
    trackOptions?: AnalyticsTrackOptions;
    getEvent?: (path: string) => Partial<CollectionAnalyticsEvent> | null | undefined;
}
export interface AnalyticsLinkBindingOptions {
    root?: Document | HTMLElement;
    selector?: string;
    trackInternal?: boolean;
    event?: Partial<CollectionAnalyticsEvent>;
    trackOptions?: AnalyticsTrackOptions;
    getEvent?: (anchor: HTMLAnchorElement, event: MouseEvent) => Partial<CollectionAnalyticsEvent> | null | undefined;
}
export interface AnalyticsClassicReportRequest extends AnalyticsFilterRequest {
    metric?: AnalyticsMetric;
    limit?: number;
}
export interface AnalyticsTrackResult {
    queued: boolean;
    transport: 'beacon' | 'fetch' | 'unavailable';
}
export interface AnalyticsFilterRequest {
    source?: AnalyticsSource;
    from?: string;
    to?: string;
    eventType?: string;
    eventTypes?: string[];
    productId?: string;
    productIds?: string[];
    proofId?: string;
    proofIds?: string[];
    batchId?: string;
    batchIds?: string[];
    variantId?: string;
    variantIds?: string[];
    sessionId?: AnalyticsSessionId;
    sessionIds?: AnalyticsSessionId[];
    country?: string;
    countries?: string[];
    metadata?: Record<string, any>;
    appId?: string;
    appIds?: string[];
    destinationAppId?: string;
    destinationAppIds?: string[];
    linkId?: string;
    linkIds?: string[];
    href?: string;
    path?: string;
    hrefContains?: string;
    pathContains?: string;
    isExternal?: boolean;
    codeId?: string;
    codeIds?: string[];
    claimId?: string;
    claimIds?: string[];
    isAdmin?: boolean;
    hasLocation?: boolean;
    /**
     * Filter web-events rows by the `source` column (list-match). Web-events
     * only - has no effect on `source: 'tag'` queries.
     *
     * There is deliberately no singular `source` filter: the request's own
     * top-level `source` field (`'events'` vs `'tag'`) already owns that name
     * as the table selector and predates this column - same word, two
     * different things. Use a single-element array (`sources: ['portal']`)
     * for an exact-match filter.
     */
    sources?: string[];
    /** Filter tag-events rows by `redirectMode`. Tag-events only. */
    redirectMode?: string;
    /** Filter tag-events rows by `redirectMode` (list-match). Tag-events only. */
    redirectModes?: string[];
}
export interface AnalyticsSummaryRequest extends AnalyticsFilterRequest {
    source: AnalyticsSource;
}
export interface AnalyticsSummaryData {
    totalEvents?: number;
    uniqueSessions?: number;
    uniqueVisitors?: number;
    uniqueCountries?: number;
    uniqueLinks?: number;
    externalEvents?: number;
    internalEvents?: number;
    firstEventAt?: string | null;
    lastEventAt?: string | null;
    uniqueCodes?: number;
    uniqueClaims?: number;
    adminEvents?: number;
    customerEvents?: number;
    locationEvents?: number;
    [key: string]: any;
}
export interface AnalyticsSummaryResponse {
    source: AnalyticsSource;
    summary: AnalyticsSummaryData;
}
export interface AnalyticsTimeseriesRequest extends AnalyticsFilterRequest {
    source: AnalyticsSource;
    granularity: AnalyticsGranularity;
    metric: AnalyticsMetric;
}
export interface AnalyticsTimeseriesRow {
    period: string;
    count: number;
    uniqueSessions?: number;
    uniqueVisitors?: number;
    value: number;
    [key: string]: any;
}
export interface AnalyticsTimeseriesResponse {
    source: AnalyticsSource;
    granularity: AnalyticsGranularity;
    metric: AnalyticsMetric;
    rows: AnalyticsTimeseriesRow[];
}
export type EventAnalyticsDimension = 'eventType' | 'country' | 'linkId' | 'href' | 'path' | 'appId' | 'destinationAppId' | 'deviceType' | 'isExternal' | 'productId' | 'proofId' | 'batchId' | 'variantId' | 'sessionId' | 'metadata' | 'source';
export type TagAnalyticsDimension = 'eventType' | 'country' | 'codeId' | 'claimId' | 'proofId' | 'productId' | 'batchId' | 'variantId' | 'deviceType' | 'sessionId' | 'isAdmin' | 'location' | 'metadata' | 'redirectMode';
export interface AnalyticsBreakdownRequest extends AnalyticsFilterRequest {
    source: AnalyticsSource;
    dimension: EventAnalyticsDimension | TagAnalyticsDimension;
    metric?: AnalyticsMetric;
    metadataKey?: string;
    limit?: number;
}
export interface AnalyticsBreakdownRow {
    dimensionValue: string | number | boolean | null;
    count: number;
    uniqueSessions?: number;
    uniqueVisitors?: number;
    value: number;
    [key: string]: any;
}
export interface AnalyticsBreakdownResponse {
    source: AnalyticsSource;
    dimension: string;
    metric: AnalyticsMetric;
    rows: AnalyticsBreakdownRow[];
}
export interface AnalyticsEventsRequest extends AnalyticsFilterRequest {
    source: AnalyticsSource;
    limit?: number;
    offset?: number;
    sort?: AnalyticsSortOrder;
}
export interface AnalyticsEventsResponse {
    source: AnalyticsSource;
    limit: number;
    offset: number;
    sort: 'ASC' | 'DESC';
    count: number;
    rows: Array<Record<string, any>>;
}
export interface LegacyAnalyticsRequest {
    collection?: string;
    collectionId?: string;
    productId?: string;
    appId?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    tagId?: string;
    qrCodeUrl?: string;
    [key: string]: any;
}
export interface AnalyticsDashboardMetrics {
    [key: string]: string | number | null;
}
export interface AnalyticsDashboardCharts {
    [key: string]: any[];
}
export interface AnalyticsDashboardResponse {
    metrics: AnalyticsDashboardMetrics;
    charts: AnalyticsDashboardCharts;
    locationData: any[];
}
export interface AnalyticsProductsRow {
    productId: string;
    totalEvents: number;
}
export interface AnalyticsProductsResponse {
    products: string[];
    rows: AnalyticsProductsRow[];
}
export interface AnalyticsQrCodeRow {
    href: string;
    visits: number;
    displayName: string;
    code: string;
}
export type AnalyticsQrCodesResponse = AnalyticsQrCodeRow[];
export interface AnalyticsTagRow {
    tagId: string;
    claimId: string;
    codeId: string;
    displayName: string;
    scans: number;
    activeDays: number;
}
export interface AnalyticsTagsResponse {
    tags: AnalyticsTagRow[];
}
export interface AnalyticsWeeklyRequest extends LegacyAnalyticsRequest {
    group?: 'count' | 'unique';
}
export interface AnalyticsCountryRequest extends LegacyAnalyticsRequest {
}
