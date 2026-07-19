import type { TagContext } from './nfc';
/**
 * Authenticity status for a specific item — a proof, resolved via an NFC
 * tap or a serial proof URL. Collection- and product-only URLs have no
 * item to describe, so there is no "nothing checkable" status here: absence
 * of an `ItemContext` altogether is how that case is represented (see the
 * `itemContext` prop on `SmartLinksWidgetProps`).
 */
export type ItemContextStatus = 'valid' | 'rescan' | 'invalid' | 'not-found' | 'error';
/**
 * Describes a specific item the current URL points at and whether it's
 * authentic — delivered to containers as the `itemContext` prop.
 * Supersedes the NFC-only `TagContext`: still available, nested at
 * `itemContext.tag`, and for one release also as a deprecated top-level
 * `tag` prop. See docs/item-context.md.
 */
export interface ItemContext {
    /** True only for `valid` and `rescan`. Read this for the simple case. */
    isAuthentic: boolean;
    status: ItemContextStatus;
    source: 'nfc' | 'serial';
    /** Set for `invalid` / `not-found` / `error`. Safe to display. */
    errorMessage?: string;
    /** True when the SDK reports this exact NFC tap was seen before. */
    isRescan?: boolean;
    /** Full NFC payload (SUN counter, tagId, claimSetId, codeId, mirror…). Present only when `source === 'nfc'`. */
    tag?: TagContext;
    /** Epoch ms when the check was derived. */
    checkedAt: number;
}
