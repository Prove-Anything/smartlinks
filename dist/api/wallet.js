import { request, post, patch } from "../http.js";
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
export var wallet;
(function (wallet) {
    const pub = (collectionId) => `/public/collection/${encodeURIComponent(collectionId)}/wallet`;
    const adm = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/wallet`;
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
    async function addLinks(collectionId, ref) {
        return post(`${pub(collectionId)}/links`, { ref });
    }
    wallet.addLinks = addLinks;
    /** The signed-in person's active passes on this site, with their links. */
    async function mine(collectionId) {
        return request(`${pub(collectionId)}/mine`);
    }
    wallet.mine = mine;
    /** Which wallets are switched on (admin). */
    async function status(collectionId) {
        return request(`${adm(collectionId)}/status`);
    }
    wallet.status = status;
    /** Passes for one thing (`refType` + `refId`) or one person (`contactId`) (admin). */
    async function list(collectionId, query) {
        const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString();
        return request(`${adm(collectionId)}/passes${qs ? `?${qs}` : ""}`);
    }
    wallet.list = list;
    /** One pass, with its links (admin). */
    async function get(collectionId, passId) {
        return request(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}`);
    }
    wallet.get = get;
    /**
     * The pass whose QR this is, for checking a ticket at the door (admin). `valid` is false for a voided pass.
     *
     * @example
     * ```typescript
     * const { pass, valid } = await wallet.byCode('coll_123', scannedValue)
     * ```
     */
    async function byCode(collectionId, code) {
        return request(`${adm(collectionId)}/code/${encodeURIComponent(code)}`);
    }
    wallet.byCode = byCode;
    /** Issue a pass (admin). Issuing again for the same thing, person and kind changes the existing pass. */
    async function issue(collectionId, input) {
        return post(`${adm(collectionId)}/passes`, input);
    }
    wallet.issue = issue;
    /** Change what a pass shows; both wallets follow (admin). */
    async function update(collectionId, passId, fields) {
        return patch(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}`, fields);
    }
    wallet.update = update;
    /** The pass no longer counts: shown as void on the phone (admin). */
    async function voidPass(collectionId, passId, reason) {
        return post(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}/void`, { reason });
    }
    wallet.voidPass = voidPass;
    /** A lock-screen message on the pass (admin). */
    async function message(collectionId, passId, msg) {
        return post(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}/message`, msg);
    }
    wallet.message = message;
})(wallet || (wallet = {}));
