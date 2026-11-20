import type { TranslationActivity } from '../translationActivity.js';
import type { ResolvedTranslationResponse, TranslationHashOptions, TranslationListParams, TranslationListResponse, TranslationLookupRequest, TranslationLookupResponse, TranslationRecord, TranslationResolveOptions, TranslationUpdateRequest } from '../types/translations.js';
/** @internal tests only */
export declare function _resetRevisionChecks(): void;
export declare namespace translations {
    function hashText(text: string, options?: TranslationHashOptions): Promise<string>;
    function hashTexts(texts: string[], options?: TranslationHashOptions): Promise<string[]>;
    function normalizeText(text: string, options?: TranslationHashOptions): string;
    function lookup(collectionId: string, body: TranslationLookupRequest): Promise<TranslationLookupResponse>;
    /**
     * Hear when content is being translated for the first time, in this window or in any app frame
     * it embeds. Hosts use it to show a "translating this page" notice; apps never have to.
     * Returns an unsubscribe function.
     */
    function onActivity(cb: (activity: TranslationActivity) => void): () => void;
    /** The "translating this page" line, in the language being translated into (for a host's banner). */
    function translatingMessage(language: string | null | undefined): {
        text: string;
        lang: string;
        dir: 'ltr' | 'rtl';
    };
    /** Whether a first-time translation is under way right now (see onActivity). */
    function activity(): TranslationActivity;
    function resolve(collectionId: string, body: TranslationLookupRequest, options?: TranslationResolveOptions): Promise<ResolvedTranslationResponse>;
    function list(collectionId: string, params?: TranslationListParams): Promise<TranslationListResponse>;
    function get(collectionId: string, translationId: string): Promise<TranslationRecord>;
    function update(collectionId: string, translationId: string, body: TranslationUpdateRequest): Promise<TranslationRecord>;
    /** Admin: how many translations exist per language, and how many a person has edited. */
    function summary(collectionId: string): Promise<{
        languages: Array<{
            language: string;
            total: number;
            edited: number;
        }>;
    }>;
    /** Admin: where translated text appears for one language (context keys), with counts. */
    function places(collectionId: string, targetLanguage: string): Promise<{
        places: Array<{
            contextKey: string;
            total: number;
            edited: number;
        }>;
    }>;
    /** Admin: undo a person's edit with a fresh machine translation. */
    function reset(collectionId: string, translationId: string): Promise<TranslationRecord>;
    function clearLocalCache(collectionId?: string): Promise<void>;
}
