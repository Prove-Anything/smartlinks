import { SDK_VERSION } from "./version.js";
/** The API version this SDK release is built for. Override per app with `initializeApi({ apiVersion })`. */
export declare const API_VERSION = "2026-11";
export { SDK_VERSION };
export declare const API_VERSION_HEADER = "SmartLinks-Version";
export declare const SDK_HEADER = "SmartLinks-SDK";
export declare const APP_HEADER = "SmartLinks-App";
/** The three identity headers, lower-cased: what a host must forward for an app in its frame. */
export declare const CLIENT_HEADER_NAMES: readonly ["smartlinks-version", "smartlinks-sdk", "smartlinks-app"];
