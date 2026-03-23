import type { ResolvedTranslationResponse, TranslationHashOptions, TranslationListParams, TranslationListResponse, TranslationLookupRequest, TranslationLookupResponse, TranslationRecord, TranslationResolveOptions, TranslationUpdateRequest } from '../types/translations';
export declare namespace translations {
    function hashText(text: string, options?: TranslationHashOptions): Promise<string>;
    function hashTexts(texts: string[], options?: TranslationHashOptions): Promise<string[]>;
    function normalizeText(text: string, options?: TranslationHashOptions): string;
    function lookup(collectionId: string, body: TranslationLookupRequest): Promise<TranslationLookupResponse>;
    function resolve(collectionId: string, body: TranslationLookupRequest, options?: TranslationResolveOptions): Promise<ResolvedTranslationResponse>;
    function list(collectionId: string, params?: TranslationListParams): Promise<TranslationListResponse>;
    function get(collectionId: string, translationId: string): Promise<TranslationRecord>;
    function update(collectionId: string, translationId: string, body: TranslationUpdateRequest): Promise<TranslationRecord>;
    function clearLocalCache(collectionId?: string): Promise<void>;
}
