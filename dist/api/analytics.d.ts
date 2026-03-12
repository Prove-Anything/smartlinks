import type { AnalyticsTrackOptions, AnalyticsTrackResult, AnalyticsBrowserConfig, AnalyticsGeolocationCaptureOptions, AnalyticsLinkClickInput, AnalyticsLinkBindingOptions, AnalyticsPageViewBindingOptions, AnalyticsClassicReportRequest, AnalyticsVisitorIdOptions, CollectionAnalyticsEvent, TagAnalyticsEvent, AnalyticsSummaryRequest, AnalyticsSummaryResponse, AnalyticsTimeseriesRequest, AnalyticsTimeseriesResponse, AnalyticsBreakdownRequest, AnalyticsBreakdownResponse, AnalyticsEventsRequest, AnalyticsEventsResponse, LegacyAnalyticsRequest, AnalyticsDashboardResponse, AnalyticsProductsResponse, AnalyticsQrCodesResponse, AnalyticsTagsResponse, AnalyticsWeeklyRequest, AnalyticsCountryRequest } from "../types/analytics";
export type { AnalyticsTrackOptions, AnalyticsTrackResult, AnalyticsBrowserConfig, AnalyticsGeolocationCaptureOptions, AnalyticsLinkClickInput, AnalyticsLinkBindingOptions, AnalyticsPageViewBindingOptions, AnalyticsClassicReportRequest, AnalyticsVisitorIdOptions, CollectionAnalyticsEvent, TagAnalyticsEvent, AnalyticsSummaryRequest, AnalyticsSummaryResponse, AnalyticsTimeseriesRequest, AnalyticsTimeseriesResponse, AnalyticsBreakdownRequest, AnalyticsBreakdownResponse, AnalyticsEventsRequest, AnalyticsEventsResponse, LegacyAnalyticsRequest, AnalyticsDashboardResponse, AnalyticsProductsResponse, AnalyticsQrCodesResponse, AnalyticsTagsResponse, AnalyticsWeeklyRequest, AnalyticsCountryRequest, };
export declare namespace analytics {
    namespace collection {
        /**
         * Fire-and-forget collection analytics event.
         * Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.
         */
        function track(event: CollectionAnalyticsEvent, options?: AnalyticsTrackOptions): AnalyticsTrackResult;
    }
    namespace tag {
        /**
         * Fire-and-forget tag analytics event.
         * Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.
         */
        function track(event: TagAnalyticsEvent, options?: AnalyticsTrackOptions): AnalyticsTrackResult;
    }
    namespace browser {
        function configure(config: AnalyticsBrowserConfig): void;
        function getSessionId(): string | undefined;
        function getVisitorId(): string | undefined;
        function setVisitorId(visitorId: string, options?: AnalyticsVisitorIdOptions): string;
        function clearVisitorId(options?: Pick<AnalyticsVisitorIdOptions, 'storage' | 'storageKey'>): void;
        function captureCampaignParams(search?: string): Partial<CollectionAnalyticsEvent>;
        function setLocation(location: TagAnalyticsEvent['location'] | null): void;
        function clearLocation(): void;
        function getLocation(): TagAnalyticsEvent['location'] | undefined;
        function detectDevice(): CollectionAnalyticsEvent['deviceType'];
        function captureLocation(options?: AnalyticsGeolocationCaptureOptions): Promise<TagAnalyticsEvent['location'] | null>;
        function trackCollection(event: Partial<CollectionAnalyticsEvent>, options?: AnalyticsTrackOptions): AnalyticsTrackResult;
        function trackTag(event: Partial<TagAnalyticsEvent>, options?: AnalyticsTrackOptions): AnalyticsTrackResult;
        function trackPageView(event: Partial<CollectionAnalyticsEvent>, options?: AnalyticsTrackOptions): AnalyticsTrackResult;
        function trackLinkClick(event: AnalyticsLinkClickInput, options?: AnalyticsTrackOptions): AnalyticsTrackResult;
        function trackTagScan(event: Partial<TagAnalyticsEvent>, options?: AnalyticsTrackOptions): AnalyticsTrackResult;
        function bindPageViews(binding?: AnalyticsPageViewBindingOptions): () => void;
        function bindLinkTracking(binding?: AnalyticsLinkBindingOptions): () => void;
    }
    namespace admin {
        function summary(collectionId: string, body: AnalyticsSummaryRequest): Promise<AnalyticsSummaryResponse>;
        function timeseries(collectionId: string, body: AnalyticsTimeseriesRequest): Promise<AnalyticsTimeseriesResponse>;
        function breakdown(collectionId: string, body: AnalyticsBreakdownRequest): Promise<AnalyticsBreakdownResponse>;
        function events(collectionId: string, body: AnalyticsEventsRequest): Promise<AnalyticsEventsResponse>;
        function web(collectionId: string, body?: LegacyAnalyticsRequest): Promise<AnalyticsDashboardResponse>;
        function clicks(collectionId: string, body?: LegacyAnalyticsRequest): Promise<AnalyticsDashboardResponse>;
        function tagScans(collectionId: string, body?: LegacyAnalyticsRequest): Promise<AnalyticsDashboardResponse>;
        function products(collectionId: string, body?: LegacyAnalyticsRequest): Promise<AnalyticsProductsResponse>;
        function qrCodes(collectionId: string, body?: LegacyAnalyticsRequest): Promise<AnalyticsQrCodesResponse>;
        function tags(collectionId: string, body?: LegacyAnalyticsRequest): Promise<AnalyticsTagsResponse>;
        function weekly(collectionId: string, body?: AnalyticsWeeklyRequest): Promise<AnalyticsTimeseriesResponse>;
        function country(collectionId: string, body?: AnalyticsCountryRequest): Promise<AnalyticsBreakdownResponse>;
        function topPages(collectionId: string, body?: AnalyticsClassicReportRequest): Promise<AnalyticsBreakdownResponse>;
        function topReferrers(collectionId: string, body?: AnalyticsClassicReportRequest): Promise<AnalyticsBreakdownResponse>;
        function topCampaigns(collectionId: string, body?: AnalyticsClassicReportRequest): Promise<AnalyticsBreakdownResponse>;
        function topSources(collectionId: string, body?: AnalyticsClassicReportRequest): Promise<AnalyticsBreakdownResponse>;
        function topDestinations(collectionId: string, body?: AnalyticsClassicReportRequest): Promise<AnalyticsBreakdownResponse>;
    }
}
