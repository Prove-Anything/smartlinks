import type { WalletPass, WalletPassRef, WalletPassSummary, WalletPassContent, IssueWalletPassRequest } from "../types/wallet.js";
import type { ListResult, ListOptions } from "../types/list.js";
/**
 * Wallet passes: an event ticket, booking, membership card or loyalty card in the person's Apple Wallet or
 * Google Wallet, branded from the site (docs/wallet-passes.md).
 *
 * - In a page: `wallet.addLinks(collectionId, ref)` gives the signed-in person "Add to Wallet" links for their own
 *   booking (`{ type: 'booking', id }`), their membership card (`{ type: 'contact', id: 'me' }`), or a pass your app
 *   already issued them.
 * - In a server function: `ctx.sl.wallet.issue / update / void / message` (needs `sl:wallet:write`). Passes follow
 *   their booking: a move changes the date on the pass, a cancellation voids it.
 * - Admin: list, look up by QR code at the door, issue, change, void, message.
 */
export declare namespace wallet {
    /**
     * "Add to Wallet" links for the signed-in person's pass about `ref` (made on first ask for a booking or a
     * membership card).
     *
     * @example
     * ```typescript
     * const { pass } = await wallet.addLinks('coll_123', { type: 'booking', id: booking.id })
     * if (pass.links.apple) appleButton.href = pass.links.apple
     * if (pass.links.google) googleButton.href = pass.links.google
     * ```
     * @throws `SIGN_IN_REQUIRED`, `NOT_FOUND` (not theirs, or nothing issued yet), `WALLET_OFF`
     */
    function addLinks(collectionId: string, ref: WalletPassRef): Promise<{
        ok: true;
        pass: WalletPassSummary;
    }>;
    /**
     * The signed-in person's active passes on this site, with their links, a page at a time. Page with
     * `limit` (50 unless you say) and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await wallet.mine('coll_123')
     * page.items.map((pass) => pass.links.google)
     * while (page.nextCursor) page = await wallet.mine('coll_123', { cursor: page.nextCursor })
     * ```
     */
    function mine(collectionId: string, options?: ListOptions): Promise<ListResult<WalletPassSummary>>;
    /** Which wallets are switched on (admin). */
    function status(collectionId: string): Promise<{
        ok: true;
        google: boolean;
        apple: boolean;
    }>;
    /**
     * Passes for one thing (`refType` + `refId`) or one person (`contactId`) (admin), a page at a time.
     * Page with `limit` (50 unless you say) and `cursor`. Voided passes are left out unless
     * `includeVoided` is true.
     *
     * @example
     * ```typescript
     * let page = await wallet.list('coll_123', { refType: 'event', refId: eventId, limit: 50 })
     * page.items // WalletPass[]
     * while (page.nextCursor) page = await wallet.list('coll_123', { refType: 'event', refId: eventId, limit: 50, cursor: page.nextCursor })
     * ```
     */
    function list(collectionId: string, query: ListOptions & {
        refType?: string;
        refId?: string;
        contactId?: string;
        includeVoided?: boolean;
    }): Promise<ListResult<WalletPass>>;
    /** One pass, with its links (admin). */
    function get(collectionId: string, passId: string): Promise<{
        ok: true;
        pass: WalletPass;
    }>;
    /**
     * The pass whose QR this is, for checking a ticket at the door (admin). `valid` is false for a voided pass.
     *
     * @example
     * ```typescript
     * const { pass, valid } = await wallet.byCode('coll_123', scannedValue)
     * ```
     */
    function byCode(collectionId: string, code: string): Promise<{
        ok: true;
        pass: WalletPass;
        valid: boolean;
    }>;
    /** Issue a pass (admin). Issuing again for the same thing, person and kind changes the existing pass. */
    function issue(collectionId: string, input: IssueWalletPassRequest): Promise<{
        ok: true;
        pass: WalletPass;
    }>;
    /** Change what a pass shows; both wallets follow (admin). */
    function update(collectionId: string, passId: string, fields: Partial<Omit<WalletPassContent, "kind">>): Promise<{
        ok: true;
        pass: WalletPass;
    }>;
    /** The pass no longer counts: shown as void on the phone (admin). */
    function voidPass(collectionId: string, passId: string, reason?: string): Promise<{
        ok: true;
        pass: WalletPass;
    }>;
    /**
     * The same lock-screen message on every active pass for one thing, e.g. everyone holding a ticket for an event
     * (admin).
     *
     * @example
     * ```typescript
     * await wallet.messageAll('coll_123', { type: 'event', id: eventId }, { header: 'Doors open', body: 'Doors open at 7pm' })
     * ```
     */
    function messageAll(collectionId: string, ref: WalletPassRef, msg: {
        header?: string;
        body: string;
    }): Promise<{
        ok: true;
        passes: number;
        sent: number;
    }>;
    /** A lock-screen message on the pass (admin). */
    function message(collectionId: string, passId: string, msg: {
        header?: string;
        body: string;
    }): Promise<{
        ok: true;
        sent: boolean;
        pass: WalletPass;
    }>;
}
