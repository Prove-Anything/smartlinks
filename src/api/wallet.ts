import { request, post, patch } from "../http"
import type { WalletPass, WalletPassRef, WalletPassSummary, WalletPassContent, IssueWalletPassRequest } from "../types/wallet"
import type { ListResult } from "../types/list"

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
export namespace wallet {
  const pub = (collectionId: string) => `/public/collection/${encodeURIComponent(collectionId)}/wallet`
  const adm = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/wallet`

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
  export async function addLinks(collectionId: string, ref: WalletPassRef): Promise<{ ok: true; pass: WalletPassSummary }> {
    return post(`${pub(collectionId)}/links`, { ref })
  }

  /**
   * The signed-in person's active passes on this site, with their links. All of them in one answer:
   * `nextCursor` is always null.
   *
   * @example
   * ```typescript
   * const { items } = await wallet.mine('coll_123')
   * items.map((pass) => pass.links.google)
   * ```
   */
  export async function mine(collectionId: string): Promise<ListResult<WalletPassSummary>> {
    return request(`${pub(collectionId)}/mine`)
  }

  /** Which wallets are switched on (admin). */
  export async function status(collectionId: string): Promise<{ ok: true; google: boolean; apple: boolean }> {
    return request(`${adm(collectionId)}/status`)
  }

  /**
   * Passes for one thing (`refType` + `refId`) or one person (`contactId`) (admin). All of them in one
   * answer: `nextCursor` is always null. Voided passes are left out unless `includeVoided` is true.
   *
   * @example
   * ```typescript
   * const { items } = await wallet.list('coll_123', { refType: 'event', refId: eventId })
   * items // WalletPass[]
   * ```
   */
  export async function list(collectionId: string, query: { refType?: string; refId?: string; contactId?: string; includeVoided?: boolean }): Promise<ListResult<WalletPass>> {
    const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString()
    return request(`${adm(collectionId)}/passes${qs ? `?${qs}` : ""}`)
  }

  /** One pass, with its links (admin). */
  export async function get(collectionId: string, passId: string): Promise<{ ok: true; pass: WalletPass }> {
    return request(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}`)
  }

  /**
   * The pass whose QR this is, for checking a ticket at the door (admin). `valid` is false for a voided pass.
   *
   * @example
   * ```typescript
   * const { pass, valid } = await wallet.byCode('coll_123', scannedValue)
   * ```
   */
  export async function byCode(collectionId: string, code: string): Promise<{ ok: true; pass: WalletPass; valid: boolean }> {
    return request(`${adm(collectionId)}/code/${encodeURIComponent(code)}`)
  }

  /** Issue a pass (admin). Issuing again for the same thing, person and kind changes the existing pass. */
  export async function issue(collectionId: string, input: IssueWalletPassRequest): Promise<{ ok: true; pass: WalletPass }> {
    return post(`${adm(collectionId)}/passes`, input)
  }

  /** Change what a pass shows; both wallets follow (admin). */
  export async function update(collectionId: string, passId: string, fields: Partial<Omit<WalletPassContent, "kind">>): Promise<{ ok: true; pass: WalletPass }> {
    return patch(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}`, fields)
  }

  /** The pass no longer counts: shown as void on the phone (admin). */
  export async function voidPass(collectionId: string, passId: string, reason?: string): Promise<{ ok: true; pass: WalletPass }> {
    return post(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}/void`, { reason })
  }

  /**
   * The same lock-screen message on every active pass for one thing, e.g. everyone holding a ticket for an event
   * (admin).
   *
   * @example
   * ```typescript
   * await wallet.messageAll('coll_123', { type: 'event', id: eventId }, { header: 'Doors open', body: 'Doors open at 7pm' })
   * ```
   */
  export async function messageAll(collectionId: string, ref: WalletPassRef, msg: { header?: string; body: string }): Promise<{ ok: true; passes: number; sent: number }> {
    return post(`${adm(collectionId)}/message`, { ref, ...msg })
  }

  /** A lock-screen message on the pass (admin). */
  export async function message(collectionId: string, passId: string, msg: { header?: string; body: string }): Promise<{ ok: true; sent: boolean; pass: WalletPass }> {
    return post(`${adm(collectionId)}/passes/${encodeURIComponent(passId)}/message`, msg)
  }
}
