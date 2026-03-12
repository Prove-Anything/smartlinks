/**
 * Collection analytics types.
 *
 * Separate from the `interactions` namespace. These types cover generic web
 * analytics, click tracking, and tag scan analytics for collection dashboards.
 */
export type AnalyticsSource = 'events' | 'tag';
export type AnalyticsEventType = string;
export type AnalyticsGranularity = 'hour' | 'day' | 'week' | 'month';
export type AnalyticsMetric = 'count' | 'uniqueSessions' | 'uniqueVisitors';
export type AnalyticsSortOrder = 'asc' | 'desc';
export type AnalyticsDeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';
export type AnalyticsStorageMode = 'local' | 'session' | false;
export interface AnalyticsLocation {
    country?: string;
    latitude?: number;
    longitude?: number;
    area?: number;
    [key: string]: any;
}
export interface AnalyticsStandardMetadataFields {
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
export interface CollectionAnalyticsEvent extends AnalyticsStandardMetadataFields {
    sessionId?: string;
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
    metadata?: Record<string, any>;
}
export interface TagAnalyticsEvent extends AnalyticsStandardMetadataFields {
    sessionId?: string;
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
    metadata?: Record<string, any>;
}
export interface AnalyticsTrackOptions {
    preferBeacon?: boolean;
}
export interface AnalyticsBrowserConfig {
    sessionStorageKey?: string;
    sessionIdFactory?: () => string;
    visitorId?: string;
    visitorStorage?: AnalyticsStorageMode;
    visitorStorageKey?: string;
    visitorIdFactory?: () => string;
    autoCaptureCampaignParams?: boolean;
    campaignParamMap?: Partial<Record<keyof AnalyticsStandardMetadataFields, string | string[]>>;
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
    sessionId?: string;
    sessionIds?: string[];
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
export type EventAnalyticsDimension = 'eventType' | 'country' | 'linkId' | 'href' | 'path' | 'appId' | 'destinationAppId' | 'deviceType' | 'isExternal' | 'productId' | 'proofId' | 'batchId' | 'variantId' | 'sessionId' | 'metadata';
export type TagAnalyticsDimension = 'eventType' | 'country' | 'codeId' | 'claimId' | 'proofId' | 'productId' | 'batchId' | 'variantId' | 'deviceType' | 'sessionId' | 'isAdmin' | 'location' | 'metadata';
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
