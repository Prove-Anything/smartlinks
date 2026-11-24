// Which API contract this SDK release was built for, and who it says it is.
//
// SmartLinks API versions are named by year and month. A request says which one it was built for in the
// `SmartLinks-Version` header; the server keeps older versions working by translating (prove
// docs/design/api-standard-and-versioning.md). Each SDK release is built for exactly one version and sends
// it on every request, so an app moves to a newer contract by upgrading its SDK — never by surprise.

import { SDK_VERSION } from "./version"

/** The API version this SDK release is built for. Override per app with `initializeApi({ apiVersion })`. */
export const API_VERSION = "2026-11"

export { SDK_VERSION }

export const API_VERSION_HEADER = "SmartLinks-Version"
export const SDK_HEADER = "SmartLinks-SDK"
export const APP_HEADER = "SmartLinks-App"

/** The three identity headers, lower-cased: what a host must forward for an app in its frame. */
export const CLIENT_HEADER_NAMES = ["smartlinks-version", "smartlinks-sdk", "smartlinks-app"] as const
