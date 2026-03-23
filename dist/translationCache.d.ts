import type { ResolvedTranslationItem, TranslationContext, TranslationHashOptions } from './types/translations';
interface LocalTranslationCacheEntry {
    collectionId: string;
    sourceLanguage: string;
    targetLanguage: string;
    contentType: string;
    contextKey: string | null;
    hash: string;
    item: ResolvedTranslationItem;
    cachedAt: number;
    expiresAt: number;
}
export declare function getDefaultTranslationCacheTtlMs(): number;
export declare function deriveTranslationContextKey(context?: TranslationContext): string | null;
export declare function normalizeTranslationText(text: string, options?: TranslationHashOptions): string;
export declare function hashTranslationText(text: string, options?: TranslationHashOptions): Promise<string>;
export declare function getCachedTranslations(params: {
    collectionId: string;
    sourceLanguage: string;
    targetLanguage: string;
    contentType: string;
    contextKey: string | null;
    hashes: string[];
}): Promise<Map<string, LocalTranslationCacheEntry>>;
export declare function setCachedTranslations(params: {
    collectionId: string;
    sourceLanguage: string;
    targetLanguage: string;
    contentType: string;
    contextKey: string | null;
    items: Array<{
        hash: string;
        item: ResolvedTranslationItem;
    }>;
    ttlMs?: number;
}): Promise<void>;
export declare function clearCachedTranslations(collectionId?: string): Promise<void>;
export {};
