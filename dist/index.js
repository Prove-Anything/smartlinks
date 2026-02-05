// src/index.ts
// Top-level entrypoint of the npm package. Re-export initializeApi + all namespaces.
export { initializeApi, request, sendCustomProxyMessage } from "./http";
export * from "./api";
export * from "./types";
// Iframe namespace
export { iframe } from "./iframe";
import * as cache_1 from './cache';
export { cache_1 as cache };
// IframeResponder (also exported via iframe namespace)
export { IframeResponder, isAdminFromRoles, buildIframeSrc, } from './iframeResponder';
