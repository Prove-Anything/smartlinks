export type TranslationLookupMode = 'cache-fill' | 'cache-only';
export type TranslationContentType = 'text/plain' | 'text/html' | 'text/x-liquid' | (string & {});
export type TranslationQuality = 'machine' | 'human' | 'passthrough' | (string & {});
export type TranslationItemStatus = 'cached' | 'generated' | 'miss' | 'passthrough' | 'local-cache' | (string & {});
export type TranslationContextValue = string | number | boolean | null;
export interface TranslationContext {
    surface?: string;
    field?: string;
    [key: string]: TranslationContextValue | undefined;
}
export interface TranslationLookupRequestBase {
    targetLanguage: string;
    sourceLanguage?: string;
    mode?: TranslationLookupMode;
    contentType?: TranslationContentType;
    context?: TranslationContext;
    returnMeta?: boolean;
}
export interface TranslationLookupSingleRequest extends TranslationLookupRequestBase {
    text: string;
    texts?: never;
}
export interface TranslationLookupBatchRequest extends TranslationLookupRequestBase {
    text?: never;
    texts: string[];
}
export type TranslationLookupRequest = TranslationLookupSingleRequest | TranslationLookupBatchRequest;
export interface TranslationLookupItem {
    index: number;
    hash: string;
    sourceText: string;
    translatedText?: string;
    status?: TranslationItemStatus;
    provider?: string;
    model?: string;
    isOverride?: boolean;
    quality?: TranslationQuality;
    createdAt?: string;
    updatedAt?: string;
}
export interface TranslationLookupResponse {
    targetLanguage: string;
    sourceLanguage?: string;
    mode?: TranslationLookupMode;
    items: TranslationLookupItem[];
}
export interface ResolvedTranslationItem extends TranslationLookupItem {
    cacheSource?: 'local' | 'remote';
    expiresAt?: number;
}
export interface ResolvedTranslationResponse {
    targetLanguage: string;
    sourceLanguage?: string;
    mode?: TranslationLookupMode;
    items: ResolvedTranslationItem[];
}
export interface TranslationHashOptions {
    trim?: boolean;
    collapseWhitespace?: boolean;
    unicodeNormalization?: 'NFC' | 'NFKC' | false;
}
export interface TranslationResolveOptions {
    useLocalCache?: boolean;
    refreshLocalCache?: boolean;
    localCacheTtlMs?: number;
    hashOptions?: TranslationHashOptions;
}
export interface TranslationRecord {
    id: string;
    collectionId: string;
    sourceHash: string;
    sourceText: string;
    sourceLanguage?: string;
    targetLanguage: string;
    contentType: string;
    contextKey?: string | null;
    translatedText: string;
    provider?: string | null;
    model?: string | null;
    quality: TranslationQuality;
    isOverride: boolean;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export interface TranslationListParams {
    targetLanguage?: string;
    sourceLanguage?: string;
    contentType?: string;
    contextKey?: string;
    q?: string;
    isOverride?: boolean;
    limit?: number;
    offset?: number;
}
export interface TranslationListResponse {
    items: TranslationRecord[];
    total?: number;
    limit?: number;
    offset?: number;
}
export interface TranslationUpdateRequest {
    translatedText?: string;
    isOverride?: boolean;
    quality?: TranslationQuality;
    metadata?: Record<string, any>;
}
