/**
 * Trim a card function's return value to what a card shows — the same rules SmartLinks applies
 * before caching it (prove services/adminCards normalisePayload), so a preview shows exactly what the
 * dashboard will. Unknown fields are dropped, text is shortened, lists are capped, and only `/paths`
 * and `https:` links survive. Throws when the input isn't an object or the result is over 8KB.
 */
import type { AdminCardPayload } from './types/adminCards.js';
export declare const ADMIN_CARD_MAX_BYTES: number;
export declare function normaliseAdminCardPayload(raw: unknown): AdminCardPayload;
