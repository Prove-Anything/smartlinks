export interface TranslationActivity {
    /** true while at least one fresh translation is under way (here or in an embedded app frame). */
    active: boolean;
    /** The language being translated into (the most recent one when several are under way). */
    targetLanguage: string | null;
    /** How many texts are waiting to be translated, across everything under way. */
    texts: number;
}
export declare const TRANSLATING_MESSAGE = "smartlinks:translating";
/**
 * Mark a request that may create translations. Returns a function to call when it settles.
 * Nothing is announced unless the request is still running after the delay.
 * @internal used by translations.lookup
 */
export declare function trackTranslation(targetLanguage: string, texts: number): () => void;
/**
 * Hear when content is being translated for the first time: requests made in this window and in
 * every app frame embedded in it. The callback gets the combined state now and on every change.
 * Returns an unsubscribe function.
 *
 * ```ts
 * translations.onActivity(({ active, targetLanguage }) => setBanner(active ? targetLanguage : null))
 * ```
 */
export declare function onActivity(cb: (activity: TranslationActivity) => void): () => void;
/** The combined state right now. */
export declare function activity(): TranslationActivity;
/** @internal tests only */
export declare function _resetActivity(options?: {
    showAfterMs?: number;
}): void;
/**
 * The "translating this page" line in the language being translated into, with its text direction.
 * zh-CN / zh-SG → Simplified, zh-TW / zh-HK → Traditional; unknown languages get English.
 */
export declare function translatingMessage(language: string | null | undefined): {
    text: string;
    lang: string;
    dir: 'ltr' | 'rtl';
};
