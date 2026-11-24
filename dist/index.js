// src/index.ts
// Top-level entrypoint of the npm package. Re-export initializeApi + all namespaces.
export { initializeApi, isInitialized, hasAuthCredentials, configureSdkCache, invalidateCache, getHttpCacheDiagnostics, resetHttpCacheDiagnostics, request, post, put, patch, del, sendCustomProxyMessage, getApiHeaders, getClientHeaders, getApiVersion, getBaseURL, isProxyEnabled, setBearerToken, getBearerToken, setGrantToken, getGrantToken, getAppContext, setAppContext, getAppChannel, setAppChannel } from "./http.js";
export * from "./api/index.js";
export * from "./types/index.js";
// Iframe namespace
export { iframe } from "./iframe.js";
// App context reader (props → hash → search), for pages and containers alike
export { readContext } from "./context.js";
import * as i18n_1 from "./i18n.js";
export { i18n_1 as i18n };
import * as adminViews_1 from "./adminViews.js";
export { adminViews_1 as adminViews };
export { widgetStyleVars, widgetStyleControls, readableOn, WIDGET_STYLE_VARS } from "./widgetStyle.js";
import * as cache_1 from './cache.js';
export { cache_1 as cache };
// IframeResponder (also exported via iframe namespace)
export { IframeResponder, isAdminFromRoles, buildIframeSrc, } from './iframeResponder.js';
import * as utils_1 from './utils/index.js';
export { utils_1 as utils };
import * as seo_1 from './seo.js';
export { seo_1 as seo };
import * as site_1 from './site.js';
export { site_1 as site };
import * as headless_1 from './headless.js';
export { headless_1 as headless };
// Admin cards: the shared renderer (bind it to your React) and the payload trimmer — docs/admin-cards.md
export { createAdminCardViews, collectAdminCardTodo, adminCardAge, injectAdminCardStyles, ADMIN_CARD_CSS } from './adminCardsView.js';
export { normaliseAdminCardPayload, ADMIN_CARD_MAX_BYTES } from './adminCardPayload.js';
// Shared dependency contract (host↔app) — one source of truth for externalized deps
export { SHARED_DEPENDENCY_CONTRACT_VERSION, SHARED_DEPENDENCIES, SHARED_DEPENDENCY_SPECIFIERS, importMapPathFor, getHostSharedDependencies, } from './shared-dependencies.js';
// API versions: the contract this SDK release is built for, and the headers that carry it (docs/api-versions.md)
export { API_VERSION, SDK_VERSION, API_VERSION_HEADER, SDK_HEADER, APP_HEADER, CLIENT_HEADER_NAMES } from './apiVersion.js';
export { AI_TOOL_NAMES, BUILTIN_AI_TOOLS, getBuiltinAiTool } from './ai-tools.js';
export { HostCapabilityUnavailableError, HostPermissionDeniedError, HostTimeoutError, HostCancelledError, } from './mobile-admin/errors.js';
