import { post, getBaseURL, getApiHeaders } from "../http"
import type {
  AnalyticsTrackOptions,
  AnalyticsTrackResult,
  AnalyticsBrowserConfig,
  AnalyticsGeolocationCaptureOptions,
  AnalyticsLinkClickInput,
  AnalyticsLinkBindingOptions,
  AnalyticsPageViewBindingOptions,
  AnalyticsClassicReportRequest,
  AnalyticsVisitorIdOptions,
  AnalyticsSessionId,
  CollectionAnalyticsEvent,
  TagAnalyticsEvent,
  AnalyticsSummaryRequest,
  AnalyticsSummaryResponse,
  AnalyticsTimeseriesRequest,
  AnalyticsTimeseriesResponse,
  AnalyticsBreakdownRequest,
  AnalyticsBreakdownResponse,
  AnalyticsEventsRequest,
  AnalyticsEventsResponse,
  LegacyAnalyticsRequest,
  AnalyticsDashboardResponse,
  AnalyticsProductsResponse,
  AnalyticsQrCodesResponse,
  AnalyticsTagsResponse,
  AnalyticsWeeklyRequest,
  AnalyticsCountryRequest,
} from "../types/analytics"

export type {
  AnalyticsTrackOptions,
  AnalyticsTrackResult,
  AnalyticsBrowserConfig,
  AnalyticsGeolocationCaptureOptions,
  AnalyticsLinkClickInput,
  AnalyticsLinkBindingOptions,
  AnalyticsPageViewBindingOptions,
  AnalyticsClassicReportRequest,
  AnalyticsVisitorIdOptions,
  AnalyticsSessionId,
  CollectionAnalyticsEvent,
  TagAnalyticsEvent,
  AnalyticsSummaryRequest,
  AnalyticsSummaryResponse,
  AnalyticsTimeseriesRequest,
  AnalyticsTimeseriesResponse,
  AnalyticsBreakdownRequest,
  AnalyticsBreakdownResponse,
  AnalyticsEventsRequest,
  AnalyticsEventsResponse,
  LegacyAnalyticsRequest,
  AnalyticsDashboardResponse,
  AnalyticsProductsResponse,
  AnalyticsQrCodesResponse,
  AnalyticsTagsResponse,
  AnalyticsWeeklyRequest,
  AnalyticsCountryRequest,
}

const analyticsBrowserState: {
  config: AnalyticsBrowserConfig
  location?: TagAnalyticsEvent['location'] | null
  sessionId?: AnalyticsSessionId
  visitorId?: string
} = {
  config: {
    sessionStorageKey: 'smartlinks.analytics.sessionId',
    visitorStorage: 'local',
    visitorStorageKey: 'smartlinks.analytics.visitorId',
    autoCaptureCampaignParams: true,
  },
}

const defaultCampaignParamMap: NonNullable<AnalyticsBrowserConfig['campaignParamMap']> = {
  utmSource: ['utm_source', 'utmSource'],
  utmMedium: ['utm_medium', 'utmMedium'],
  utmCampaign: ['utm_campaign', 'utmCampaign'],
  utmContent: ['utm_content', 'utmContent'],
  utmTerm: ['utm_term', 'utmTerm'],
  entryType: ['entryType', 'entry'],
  group: 'group',
  tag: 'tag',
  campaign: 'campaign',
  placement: 'placement',
  linkGroup: ['linkGroup', 'link_group'],
  linkPlacement: ['linkPlacement', 'link_placement'],
  linkPosition: ['linkPosition', 'link_position'],
  linkTitle: ['linkTitle', 'link_title'],
  destinationDomain: ['destinationDomain', 'destination_domain'],
  pagePath: ['pagePath', 'page_path'],
  pageId: 'pageId',
  qrCodeId: 'qrCodeId',
  scanMethod: ['scanMethod', 'scan_method'],
}

const promotedAnalyticsKeys = new Set([
  'visitorId',
  'referrerHost',
  'pageId',
  'entryType',
  'scanMethod',
])

function createSessionId(): AnalyticsSessionId {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000)
}

function createVisitorId(): string {
  return `visitor_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`
}

function getStorage(mode: 'session' | 'local' | false | undefined): Storage | undefined {
  try {
    if (mode === 'local' && typeof localStorage !== 'undefined') return localStorage
    if (mode === 'session' && typeof sessionStorage !== 'undefined') return sessionStorage
  } catch {
  }

  return undefined
}

function parseStoredSessionId(value: string): AnalyticsSessionId | undefined {
  if (/^\d+$/.test(value)) {
    const parsed = Number(value)
    if (Number.isSafeInteger(parsed)) return parsed
  }

  return undefined
}

function assertValidSessionId(sessionId: unknown): AnalyticsSessionId | undefined {
  if (sessionId === undefined || sessionId === null) return undefined

  if (typeof sessionId !== 'number' || !Number.isSafeInteger(sessionId)) {
    throw new Error('analytics sessionId must be a safe integer number.')
  }

  return sessionId
}

function prunePromotedMetadataKeys(metadata?: Record<string, any>): Record<string, any> | undefined {
  if (!metadata) return undefined

  const entries = Object.entries(metadata).filter(([key]) => !promotedAnalyticsKeys.has(key))
  if (entries.length === 0) return undefined

  return Object.fromEntries(entries)
}

function normalizeAnalyticsEvent<T extends { sessionId?: AnalyticsSessionId; metadata?: Record<string, any> }>(
  event: T
): T {
  return {
    ...event,
    sessionId: assertValidSessionId(event.sessionId),
    metadata: prunePromotedMetadataKeys(event.metadata),
  }
}

function getOrCreateSessionId(): AnalyticsSessionId | undefined {
  if (analyticsBrowserState.sessionId) return analyticsBrowserState.sessionId

  const key = analyticsBrowserState.config.sessionStorageKey ?? 'smartlinks.analytics.sessionId'
  const storage = getStorage('session')
  const existing = key ? storage?.getItem(key) : undefined
  if (existing) {
    const parsed = parseStoredSessionId(existing)
    if (parsed !== undefined) {
      analyticsBrowserState.sessionId = parsed
      return parsed
    }
  }

  const generated = assertValidSessionId(analyticsBrowserState.config.sessionIdFactory?.() ?? createSessionId())
  analyticsBrowserState.sessionId = generated

  if (key) {
    try {
      storage?.setItem(key, String(generated))
    } catch {
    }
  }

  return generated
}

function getOrCreateVisitorId(): string | undefined {
  if (analyticsBrowserState.config.visitorStorage === false) return undefined
  if (analyticsBrowserState.visitorId) return analyticsBrowserState.visitorId

  const storageMode = analyticsBrowserState.config.visitorStorage ?? 'local'
  const key = analyticsBrowserState.config.visitorStorageKey ?? 'smartlinks.analytics.visitorId'
  const storage = getStorage(storageMode)
  const existing = key ? storage?.getItem(key) : undefined
  if (existing) {
    analyticsBrowserState.visitorId = existing
    return existing
  }

  const generated = analyticsBrowserState.config.visitorIdFactory?.() ?? createVisitorId()
  analyticsBrowserState.visitorId = generated

  if (key) {
    try {
      storage?.setItem(key, generated)
    } catch {
    }
  }

  return generated
}

function persistVisitorId(
  visitorId: string | undefined,
  options: AnalyticsVisitorIdOptions = {}
): string | undefined {
  analyticsBrowserState.visitorId = visitorId

  const storageMode = options.storage ?? analyticsBrowserState.config.visitorStorage ?? 'local'
  const storageKey = options.storageKey ?? analyticsBrowserState.config.visitorStorageKey ?? 'smartlinks.analytics.visitorId'
  const shouldPersist = options.persist !== false && storageMode !== false
  const storage = shouldPersist ? getStorage(storageMode) : undefined

  if (!storageKey || !storage) return visitorId

  try {
    if (visitorId) {
      storage.setItem(storageKey, visitorId)
    } else {
      storage.removeItem(storageKey)
    }
  } catch {
  }

  return visitorId
}

function detectDeviceType(): CollectionAnalyticsEvent['deviceType'] {
  if (typeof navigator === 'undefined' || typeof screen === 'undefined') return 'unknown'

  const ua = navigator.userAgent ?? ''
  if (/Mobi|Android/i.test(ua)) {
    if (Math.min(screen.width, screen.height) >= 768) return 'tablet'
    return 'mobile'
  }

  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}

function getCurrentPath(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return `${window.location.pathname}${window.location.search}`
}

function getCurrentReferrerFields(): Partial<CollectionAnalyticsEvent> {
  if (typeof document === 'undefined' || !document.referrer) return {}

  try {
    const referrerUrl = new URL(document.referrer)
    return {
      referrer: document.referrer,
      referrerHost: referrerUrl.hostname,
    }
  } catch {
    return {
      referrer: document.referrer,
    }
  }
}

function getCampaignFields(search?: string): Partial<CollectionAnalyticsEvent> {
  const query = search ?? (typeof window !== 'undefined' ? window.location.search : '')
  if (!query) return {}

  const params = new URLSearchParams(query)
  const fields: Partial<CollectionAnalyticsEvent> = {}
  const paramMap = {
    ...defaultCampaignParamMap,
    ...(analyticsBrowserState.config.campaignParamMap ?? {}),
  }

  for (const [field, aliases] of Object.entries(paramMap) as Array<[keyof typeof paramMap, string | string[]]>) {
    const names = Array.isArray(aliases) ? aliases : [aliases]
    for (const name of names) {
      const value = params.get(name)
      if (value) {
        ;(fields as any)[field] = value
        break
      }
    }
  }

  return fields
}

function getDestinationDomain(href?: string): string | undefined {
  if (!href) return undefined

  try {
    const base = typeof window !== 'undefined' ? window.location.href : undefined
    return new URL(href, base).hostname
  } catch {
    return undefined
  }
}

function getResolvedLocation(): TagAnalyticsEvent['location'] | undefined {
  if (analyticsBrowserState.location !== undefined) return analyticsBrowserState.location ?? undefined

  const configured = analyticsBrowserState.config.getLocation?.()
  if (configured !== undefined) return configured ?? undefined

  return undefined
}

function mergeCollectionEventDefaults(event: Partial<CollectionAnalyticsEvent>): CollectionAnalyticsEvent {
  const configuredDefaults = analyticsBrowserState.config.defaultCollectionEvent ?? {}
  const dynamicDefaults = analyticsBrowserState.config.getCollectionDefaults?.() ?? {}
  const campaignFields = analyticsBrowserState.config.autoCaptureCampaignParams === false ? {} : getCampaignFields()
  const path = event.path ?? getCurrentPath()
  const visitorId = event.visitorId ?? getOrCreateVisitorId()
  const href = event.href ?? dynamicDefaults.href ?? configuredDefaults.href

  return {
    ...configuredDefaults,
    ...dynamicDefaults,
    ...campaignFields,
    ...getCurrentReferrerFields(),
    visitorId,
    sessionId: assertValidSessionId(event.sessionId ?? getOrCreateSessionId()),
    deviceType: detectDeviceType(),
    path,
    pagePath: event.pagePath ?? (campaignFields.pagePath as string | undefined) ?? path,
    destinationDomain: event.destinationDomain ?? getDestinationDomain(href),
    location: getResolvedLocation(),
    eventType: 'page_view',
    ...event,
    metadata: prunePromotedMetadataKeys({
      ...(configuredDefaults.metadata ?? {}),
      ...(dynamicDefaults.metadata ?? {}),
      ...(event.metadata ?? {}),
    }),
  } as CollectionAnalyticsEvent
}

function mergeTagEventDefaults(event: Partial<TagAnalyticsEvent>): TagAnalyticsEvent {
  const configuredDefaults = analyticsBrowserState.config.defaultTagEvent ?? {}
  const dynamicDefaults = analyticsBrowserState.config.getTagDefaults?.() ?? {}
  const visitorId = event.visitorId ?? getOrCreateVisitorId()

  return {
    ...configuredDefaults,
    ...dynamicDefaults,
    visitorId,
    sessionId: assertValidSessionId(event.sessionId ?? getOrCreateSessionId()),
    deviceType: detectDeviceType(),
    location: getResolvedLocation(),
    eventType: 'scan_tag',
    ...event,
    metadata: prunePromotedMetadataKeys({
      ...(configuredDefaults.metadata ?? {}),
      ...(dynamicDefaults.metadata ?? {}),
      ...(event.metadata ?? {}),
    }),
  } as TagAnalyticsEvent
}

function isExternalHref(href: string): boolean | undefined {
  if (typeof window === 'undefined') return undefined

  try {
    const url = new URL(href, window.location.href)
    return url.hostname !== window.location.hostname
  } catch {
    return undefined
  }
}

function queueAnalytics(path: string, body: unknown, options?: AnalyticsTrackOptions): AnalyticsTrackResult {
  const baseURL = getBaseURL()
  if (!baseURL) {
    throw new Error('HTTP client is not initialized. Call initializeApi(...) first.')
  }

  const url = `${baseURL}${path}`
  const payload = JSON.stringify(body)
  const headers = getApiHeaders()
  const preferBeacon = options?.preferBeacon !== false

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function' && preferBeacon) {
    try {
      const blob = new Blob([payload], { type: 'application/json' })
      const queued = navigator.sendBeacon(url, blob)
      if (queued) return { queued: true, transport: 'beacon' }
    } catch {
    }
  }

  if (typeof fetch === 'function') {
    void fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: payload,
      keepalive: true,
    }).catch(() => {})

    return { queued: true, transport: 'fetch' }
  }

  return { queued: false, transport: 'unavailable' }
}

export namespace analytics {
  export namespace collection {
    /**
     * Fire-and-forget collection analytics event.
     * Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.
     */
    export function track(
      event: CollectionAnalyticsEvent,
      options?: AnalyticsTrackOptions
    ): AnalyticsTrackResult {
      return queueAnalytics('/public/analytics/collection', normalizeAnalyticsEvent(event), options)
    }
  }

  export namespace tag {
    /**
     * Fire-and-forget tag analytics event.
     * Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.
     */
    export function track(
      event: TagAnalyticsEvent,
      options?: AnalyticsTrackOptions
    ): AnalyticsTrackResult {
      return queueAnalytics('/public/analytics/tag', normalizeAnalyticsEvent(event), options)
    }
  }

  export namespace browser {
    export function configure(config: AnalyticsBrowserConfig): void {
      const { visitorId, ...nextConfig } = config

      analyticsBrowserState.config = {
        ...analyticsBrowserState.config,
        ...nextConfig,
      }

      if (visitorId) {
        setVisitorId(visitorId)
      }
    }

    export function getSessionId(): AnalyticsSessionId | undefined {
      return getOrCreateSessionId()
    }

    export function getVisitorId(): string | undefined {
      return getOrCreateVisitorId()
    }

    export function setVisitorId(
      visitorId: string,
      options?: AnalyticsVisitorIdOptions
    ): string {
      return persistVisitorId(visitorId, options) ?? visitorId
    }

    export function clearVisitorId(options?: Pick<AnalyticsVisitorIdOptions, 'storage' | 'storageKey'>): void {
      persistVisitorId(undefined, {
        ...options,
        persist: true,
      })
    }

    export function captureCampaignParams(search?: string): Partial<CollectionAnalyticsEvent> {
      return getCampaignFields(search)
    }

    export function setLocation(location: TagAnalyticsEvent['location'] | null): void {
      analyticsBrowserState.location = location
    }

    export function clearLocation(): void {
      analyticsBrowserState.location = null
    }

    export function getLocation(): TagAnalyticsEvent['location'] | undefined {
      return getResolvedLocation()
    }

    export function detectDevice(): CollectionAnalyticsEvent['deviceType'] {
      return detectDeviceType()
    }

    export async function captureLocation(
      options: AnalyticsGeolocationCaptureOptions = {}
    ): Promise<TagAnalyticsEvent['location'] | null> {
      if (typeof navigator === 'undefined' || !navigator.geolocation) return null

      const location = await new Promise<TagAnalyticsEvent['location'] | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const nextLocation: TagAnalyticsEvent['location'] = {}
            if (options.includeCoordinates !== false) {
              nextLocation.latitude = coords.latitude
              nextLocation.longitude = coords.longitude
            }
            if (options.includeAccuracyArea) {
              nextLocation.area = coords.accuracy
            }
            resolve(nextLocation)
          },
          () => resolve(null),
          options
        )
      })

      analyticsBrowserState.location = location
      return location
    }

    export function trackCollection(
      event: Partial<CollectionAnalyticsEvent>,
      options?: AnalyticsTrackOptions
    ): AnalyticsTrackResult {
      return collection.track(mergeCollectionEventDefaults(event), options)
    }

    export function trackTag(
      event: Partial<TagAnalyticsEvent>,
      options?: AnalyticsTrackOptions
    ): AnalyticsTrackResult {
      return tag.track(mergeTagEventDefaults(event), options)
    }

    export function trackPageView(
      event: Partial<CollectionAnalyticsEvent>,
      options?: AnalyticsTrackOptions
    ): AnalyticsTrackResult {
      return trackCollection({
        eventType: 'page_view',
        ...event,
      }, options)
    }

    export function trackLinkClick(
      event: AnalyticsLinkClickInput,
      options?: AnalyticsTrackOptions
    ): AnalyticsTrackResult {
      return trackCollection({
        eventType: 'click_link',
        path: event.path ?? getCurrentPath(),
        pagePath: event.pagePath ?? event.path ?? getCurrentPath(),
        isExternal: event.isExternal ?? isExternalHref(event.href),
        ...event,
      }, options)
    }

    export function trackTagScan(
      event: Partial<TagAnalyticsEvent>,
      options?: AnalyticsTrackOptions
    ): AnalyticsTrackResult {
      return trackTag({
        eventType: 'scan_tag',
        ...event,
      }, options)
    }

    export function bindPageViews(binding: AnalyticsPageViewBindingOptions = {}): () => void {
      if (typeof window === 'undefined' || typeof history === 'undefined') return () => {}

      const trackOptions = binding.trackOptions
      const includeHashChanges = binding.includeHashChanges === true
      let lastPath: string | undefined

      const track = () => {
        const path = getCurrentPath()
        if (!path || path === lastPath) return
        const extraEvent = binding.getEvent?.(path)
        if (extraEvent === null) return
        lastPath = path
        trackPageView({
          path,
          pagePath: path,
          ...(binding.event ?? {}),
          ...(extraEvent ?? {}),
        }, trackOptions)
      }

      const originalPushState = history.pushState
      const originalReplaceState = history.replaceState

      history.pushState = function (...args: any[]) {
        originalPushState.apply(history, args as any)
        track()
      } as History['pushState']

      history.replaceState = function (...args: any[]) {
        originalReplaceState.apply(history, args as any)
        track()
      } as History['replaceState']

      window.addEventListener('popstate', track)
      if (includeHashChanges) {
        window.addEventListener('hashchange', track)
      }

      if (binding.trackInitialPageView !== false) {
        track()
      } else {
        lastPath = getCurrentPath()
      }

      return () => {
        history.pushState = originalPushState
        history.replaceState = originalReplaceState
        window.removeEventListener('popstate', track)
        if (includeHashChanges) {
          window.removeEventListener('hashchange', track)
        }
      }
    }

    export function bindLinkTracking(binding: AnalyticsLinkBindingOptions = {}): () => void {
      if (typeof document === 'undefined') return () => {}

      const root = binding.root ?? document
      const selector = binding.selector ?? 'a[href]'
      const handler = (event: Event) => {
        const mouseEvent = event as MouseEvent
        const target = mouseEvent.target as Element | null
        const anchor = target?.closest?.(selector) as HTMLAnchorElement | null
        if (!anchor?.href) return

        const customEvent = binding.getEvent?.(anchor, mouseEvent)
        if (customEvent === null) return

        const external = isExternalHref(anchor.href)
        if (binding.trackInternal === false && external === false) return

        trackLinkClick({
          href: anchor.href,
          linkTitle: anchor.textContent?.trim() || undefined,
          ...(binding.event ?? {}),
          ...(customEvent ?? {}),
          isExternal: customEvent?.isExternal ?? binding.event?.isExternal ?? external,
        }, binding.trackOptions)
      }

      root.addEventListener('click', handler)
      return () => root.removeEventListener('click', handler)
    }
  }

  export namespace admin {
    async function classicBreakdown(
      collectionId: string,
      body: AnalyticsClassicReportRequest,
      config: {
        dimension: 'metadata' | 'href'
        metadataKey?: string
        defaultEventType?: string
      }
    ): Promise<AnalyticsBreakdownResponse> {
      const {
        metric = 'count',
        limit = 10,
        source = 'events',
        eventType,
        ...rest
      } = body

      return breakdown(collectionId, {
        source,
        dimension: config.dimension,
        metadataKey: config.metadataKey,
        metric,
        limit,
        eventType: eventType ?? config.defaultEventType,
        ...rest,
      })
    }

    export async function summary(
      collectionId: string,
      body: AnalyticsSummaryRequest
    ): Promise<AnalyticsSummaryResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/summary`, body)
    }

    export async function timeseries(
      collectionId: string,
      body: AnalyticsTimeseriesRequest
    ): Promise<AnalyticsTimeseriesResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/timeseries`, body)
    }

    export async function breakdown(
      collectionId: string,
      body: AnalyticsBreakdownRequest
    ): Promise<AnalyticsBreakdownResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/breakdown`, body)
    }

    export async function events(
      collectionId: string,
      body: AnalyticsEventsRequest
    ): Promise<AnalyticsEventsResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/events`, body)
    }

    export async function web(
      collectionId: string,
      body: LegacyAnalyticsRequest = {}
    ): Promise<AnalyticsDashboardResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/web`, body)
    }

    export async function clicks(
      collectionId: string,
      body: LegacyAnalyticsRequest = {}
    ): Promise<AnalyticsDashboardResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/clicks`, body)
    }

    export async function tagScans(
      collectionId: string,
      body: LegacyAnalyticsRequest = {}
    ): Promise<AnalyticsDashboardResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/tag-scans`, body)
    }

    export async function products(
      collectionId: string,
      body: LegacyAnalyticsRequest = {}
    ): Promise<AnalyticsProductsResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/products`, body)
    }

    export async function qrCodes(
      collectionId: string,
      body: LegacyAnalyticsRequest = {}
    ): Promise<AnalyticsQrCodesResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/qr-codes`, body)
    }

    export async function tags(
      collectionId: string,
      body: LegacyAnalyticsRequest = {}
    ): Promise<AnalyticsTagsResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/tags`, body)
    }

    export async function weekly(
      collectionId: string,
      body: AnalyticsWeeklyRequest = {}
    ): Promise<AnalyticsTimeseriesResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/weekly`, body)
    }

    export async function country(
      collectionId: string,
      body: AnalyticsCountryRequest = {}
    ): Promise<AnalyticsBreakdownResponse> {
      return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/country`, body)
    }

    export async function topPages(
      collectionId: string,
      body: AnalyticsClassicReportRequest = {}
    ): Promise<AnalyticsBreakdownResponse> {
      return classicBreakdown(collectionId, body, {
        dimension: 'metadata',
        metadataKey: 'pagePath',
        defaultEventType: 'page_view',
      })
    }

    export async function topReferrers(
      collectionId: string,
      body: AnalyticsClassicReportRequest = {}
    ): Promise<AnalyticsBreakdownResponse> {
      return classicBreakdown(collectionId, body, {
        dimension: 'metadata',
        metadataKey: 'referrerHost',
        defaultEventType: 'page_view',
      })
    }

    export async function topCampaigns(
      collectionId: string,
      body: AnalyticsClassicReportRequest = {}
    ): Promise<AnalyticsBreakdownResponse> {
      return classicBreakdown(collectionId, body, {
        dimension: 'metadata',
        metadataKey: 'utmCampaign',
        defaultEventType: 'page_view',
      })
    }

    export async function topSources(
      collectionId: string,
      body: AnalyticsClassicReportRequest = {}
    ): Promise<AnalyticsBreakdownResponse> {
      return classicBreakdown(collectionId, body, {
        dimension: 'metadata',
        metadataKey: 'utmSource',
        defaultEventType: 'page_view',
      })
    }

    export async function topDestinations(
      collectionId: string,
      body: AnalyticsClassicReportRequest = {}
    ): Promise<AnalyticsBreakdownResponse> {
      return classicBreakdown(collectionId, body, {
        dimension: 'metadata',
        metadataKey: 'destinationDomain',
        defaultEventType: 'click_link',
      })
    }
  }
}