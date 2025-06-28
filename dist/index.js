// src/index.ts
// Top-level entrypoint of the npm package. Re-export initializeApi + all namespaces.
export { initializeApi, request, sendCustomProxyMessage } from "./http";
export * from "./api";
export * from "./types";
