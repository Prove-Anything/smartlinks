/** Wallet passes: what a pass is and shows (docs/wallet-passes.md). */
export type WalletPassKind = 'event' | 'booking' | 'membership' | 'loyalty'

/** What the pass is for: a booking, the person ('contact'), or your own record type. */
export interface WalletPassRef {
  type: 'booking' | 'contact' | string
  id: string
}

/** What a pass shows. Branding (name, logo, colours) always comes from the site. */
export interface WalletPassContent {
  kind: WalletPassKind
  /** The main line: the event, "Table for 4", "Gold member". */
  title: string
  subtitle?: string
  /** ISO times (events and bookings); the pass surfaces near `start`. */
  start?: string
  end?: string
  /** IANA timezone, e.g. 'Europe/London'. */
  timezone?: string
  /** `lat` / `lng` make the pass appear when the person is nearby. */
  venue?: { name?: string; address?: string; lat?: number; lng?: number }
  holder?: string
  /** A booking reference or member number. */
  number?: string
  level?: string
  /** Loyalty balance. */
  points?: number
  validUntil?: string
  /** Up to 4 extra lines on the front. */
  fields?: Array<{ label: string; value: string }>
  /** Lines on the back. */
  back?: Array<{ label: string; value: string }>
  /** https only. */
  image?: string
  url?: string
  /** The QR value; the pass's own code unless you give one. */
  barcode?: string
}

export interface WalletInWallet {
  saved: boolean
  savedAt?: string | null
  removedAt?: string
}

/** "Add to Wallet" links that work for this pass now (a wallet that isn't set up is left out). */
export interface WalletPassLinks {
  google?: string
  apple?: string
}

/** A pass as the person sees it (public calls). */
export interface WalletPassSummary {
  id: string
  kind: WalletPassKind
  ref: WalletPassRef
  title?: string
  start?: string
  links: WalletPassLinks
}

/** A pass as an admin or app sees it. */
export interface WalletPass {
  id: string
  collectionId: string
  kind: WalletPassKind
  ref: WalletPassRef
  contactId?: string | null
  status: 'active' | 'voided'
  /** The app that issued it. */
  issuedBy?: string | null
  model: WalletPassContent
  /** The value in its QR code (check it with `wallet.byCode`). */
  code: string
  version: number
  notice?: { header: string; body: string; at: string }
  /** Whether the person has it in each wallet (Apple: a phone registered it; Google: Google's save / delete callback). */
  inWallet?: { apple?: WalletInWallet; google?: WalletInWallet }
  voidReason?: string | null
  links?: WalletPassLinks
  createdAt?: string
  updatedAt?: string
}

export interface IssueWalletPassRequest {
  ref: WalletPassRef
  contactId?: string
  appId?: string
  pass: WalletPassContent
}
