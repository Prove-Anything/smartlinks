// src/index.ts
// Top-level entrypoint of the npm package. Re-export initializeApi + all namespaces.
export { initializeApi, isInitialized, hasAuthCredentials, configureSdkCache, invalidateCache, getHttpCacheDiagnostics, resetHttpCacheDiagnostics, request, post, put, patch, del, sendCustomProxyMessage, getApiHeaders, getBaseURL, isProxyEnabled, setBearerToken, getBearerToken, setGrantToken, getGrantToken } from "./http.js";
export * from "./api/index.js";
export * from "./types/index.js";
// Iframe namespace
export { iframe } from "./iframe.js";
import * as cache_1 from './cache.js';
export { cache_1 as cache };
// IframeResponder (also exported via iframe namespace)
export { IframeResponder, isAdminFromRoles, buildIframeSrc, } from './iframeResponder.js';
import * as utils_1 from './utils/index.js';
export { utils_1 as utils };
// Shared dependency contract (host↔app) — one source of truth for externalized deps
export { SHARED_DEPENDENCY_CONTRACT_VERSION, SHARED_DEPENDENCIES, SHARED_DEPENDENCY_SPECIFIERS, importMapPathFor, getHostSharedDependencies, } from './shared-dependencies.js';
// Built-in AI tool catalog (design-time discovery of the core agentic toolset)
export { AI_TOOL_NAMES, BUILTIN_AI_TOOLS, getBuiltinAiTool } from './ai-tools.js';
export { HostCapabilityUnavailableError, HostPermissionDeniedError, HostTimeoutError, } from './mobile-admin/errors.js';
