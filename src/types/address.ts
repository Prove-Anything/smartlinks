/**
 * A business's ADDRESS (prove docs/design/business-address.md): its name on smartlinks.host, its own
 * domain, what its front page shows, and its apps' public pages under `/_apps/<name>/`.
 */

/** What the business's own address shows at its front page. */
export type AddressFront =
  /** The collection's Hub (the default until the business chooses). `chosen: false` when never chosen. */
  | { kind: 'hub'; chosen?: boolean }
  /** A website built in Forge, installed on the collection and live (stable). */
  | { kind: 'website'; appId: string }
  /** One of the business's apps as its whole front page (its only game, say): installed and live. */
  | { kind: 'app'; appId: string }
  /** Send visitors to another address. Temporary (302) unless `permanent`; `keepPath` carries /about → target/about. */
  | { kind: 'redirect'; url: string; keepPath?: boolean; permanent?: boolean }
  /** A simple page with the business's name, logo and the app pages it chose to show. */
  | { kind: 'holding' }

/** An installed app's public page on the business's address. */
export interface AddressPage {
  appId: string
  /** The app's name as installed. */
  title: string
  /** The page name: `https://<address>/_apps/<name>/`. */
  name: string
  /** What the name is when never changed: the app id without its publisher handle. */
  defaultName: string
  /** Shown on the holding page. */
  listed: boolean
  /** Live (stable, released): its page works on the business's chosen name, and it can be the front page. */
  live: boolean
  /** The full address of the page, on the business's main address. */
  url: string
}

/** A website installed on the collection: what the front page can show. */
export interface AddressWebsite {
  appId: string
  title: string
  /** Live (on stable): only a live website can be the front page. */
  live: boolean
  channel: string | null
}

export interface AddressResponse {
  /** The business's chosen name, or null when it hasn't chosen one (it uses `defaultHost`). */
  name: string | null
  /** Its address on smartlinks.host: the chosen name, else the automatic one. */
  host: string
  /** The automatic address every collection has (`c-<id>.smartlinks.host`). */
  defaultHost: string | null
  /** Its own domain for its front page, and whether that works yet. */
  domain: { host: string; live: boolean } | null
  front: AddressFront
  websites: AddressWebsite[]
  pages: AddressPage[]
}

export interface AddressNameAvailability {
  available: boolean
  host: string
}

/** Where an app's public page is (`address.page`): always a working address. */
export interface AppPageLink {
  /** The one to link to: the business's address itself when the app IS its front page, else `pageUrl`. */
  url: string
  /** The app's page under the business's address: `https://<address>/_apps/<name>/`. */
  pageUrl: string
  /** The page name (the business can rename it in Studio → Your address). */
  name: string
  /** Live (stable, released): on the business's own domain or name. A test build is on the automatic address. */
  live: boolean
  /** This app is the business's whole front page. */
  isFront: boolean
  host: string
  /** The release channel the collection runs the app on. */
  channel: string | null
}
