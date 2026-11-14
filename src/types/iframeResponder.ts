// =============================================================================
// IframeResponder Types - Type definitions for iframe communication
// =============================================================================

// Re-export existing types that should remain in SDK
export type { AuthKitUser } from './authKit';
export type { AppConfig as CollectionApp } from './collection';

// Import for internal use
import type { AppConfig } from './collection';

// =============================================================================
// Cached Data Types
// =============================================================================

export interface CachedData {
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
  user?: {
    uid: string;
    email?: string;
    displayName?: string;
    accountData?: Record<string, any>;
  } | null;
  apps?: AppConfig[];
}

// =============================================================================
// IframeResponder Options
// =============================================================================

export interface IframeResponderOptions {
  // Required context
  collectionId: string;
  appId: string;
  
  // Optional context
  productId?: string;
  proofId?: string;
  
  /** Version to load: 'stable' | 'development' | specific version */
  version?: string;
  
  /** Override auto-resolved URL (for local development) */
  appUrl?: string;
  
  /** Initial hash path (e.g., '/settings') */
  initialPath?: string;

  /**
   * The page's own params (a `linkable` entry's pinned `params` plus what it `accepts`), e.g.
   * `{ service: 'svc_123' }`. Added to the app's URL alongside the platform's context params, which
   * always win (collectionId, appId, productId, proofId, isAdmin, dark, theme, parentUrl).
   */
  params?: Record<string, string>;
  
  /** Is user an admin of this collection */
  isAdmin?: boolean;
  
  // Cached data for fast proxy responses
  cache?: CachedData;
  
  // Auth callbacks (optional - anonymous mode if omitted)
  onAuthLogin?: (
    token: string, 
    user: any, 
    accountData?: Record<string, any>
  ) => Promise<void>;
  onAuthLogout?: () => Promise<void>;
  
  // Deep linking
  onRouteChange?: (path: string, state: Record<string, string>) => void;

  /**
   * The app said it follows `smartlinks:navigate` (docs/admin-views.md): from now on `navigate()` moves
   * it without a reload. `views` are the ids it declared.
   */
  onNavigable?: (info: { views: string[]; chrome: 'none' | 'full' }) => void;
  /** The app's answer to a `navigate()`: where it went, or why it couldn't. */
  onNavigateResult?: (result: { ok: boolean; view: string | null; path: string | null; reason?: string }) => void;
  
  /**
   * Size the iframe to the app's content, for an app placed in a page (a booking form in a website, a
   * widget in a section): the page scrolls, never the iframe. The responder sets the iframe's height from
   * the height the app reports, adding the iframe's own border and padding, and never uses the
   * window-filling height. `minHeight`: the least height (px) it's given.
   * Leave off for a full-screen host, which sizes the iframe itself from `onResize`.
   */
  autoHeight?: boolean | { minHeight?: number };

  // Events
  /**
   * A height for the iframe: the app's content height whenever the app reports one, and — unless
   * `autoHeight` is on — the window's height below the iframe's container on every window resize (for a
   * full-screen host). A page that embeds an app should use `autoHeight` instead.
   */
  onResize?: (height: number) => void;
  onError?: (error: Error) => void;
  onReady?: () => void;
}

// =============================================================================
// Message Types
// =============================================================================

export interface RouteChangeMessage {
  type: 'smartlinks-route-change';
  path: string;
  context: Record<string, string>;
  state: Record<string, string> & {
    parentPath?: string;
  };
  appId?: string;
}

export interface SmartlinksIframeMessage {
  _smartlinksIframeMessage: true;
  type: 
    | 'smartlinks:resize' 
    | 'smartlinks:redirect' 
    | 'smartlinks:authkit:login'
    | 'smartlinks:authkit:logout'
    | 'smartlinks:authkit:redirect'
    | 'smartlinks:navigable'
    | 'smartlinks:navigate-result';
  payload: Record<string, any>;
  messageId?: string;
}

export interface ProxyRequest {
  _smartlinksProxyRequest: true;
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface CustomProxyRequest {
  _smartlinksProxyRequest: true;
  _smartlinksCustomProxyRequest: true;
  id: string;
  request: 'REDIRECT' | string;
  params: Record<string, any>;
}

export interface ProxyResponse {
  _smartlinksProxyResponse: true;
  id: string;
  data?: any;
  error?: string;
  statusCode?: number;
  errorBody?: any;
}

export interface ProxyStreamRequest {
  _smartlinksProxyStreamRequest: true;
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface ProxyStreamAbortMessage {
  _smartlinksProxyStreamAbort: true;
  id: string;
}

export interface ProxyStreamMessage {
  _smartlinksProxyStream: true;
  id: string;
  phase: 'open' | 'event' | 'end' | 'error';
  data?: any;
  error?: string;
  status?: number;
}

// File Upload Messages
export interface UploadStartMessage {
  _smartlinksProxyUpload: true;
  phase: 'start';
  id: string;
  fields: [string, string][];
  fileInfo: { type?: string; name?: string; key?: string };
  path: string;
  headers?: Record<string, string>;
}

export interface UploadChunkMessage {
  _smartlinksProxyUpload: true;
  phase: 'chunk';
  id: string;
  seq: number;
  chunk: ArrayBuffer;
}

export interface UploadEndMessage {
  _smartlinksProxyUpload: true;
  phase: 'end';
  id: string;
}

export interface UploadAckMessage {
  _smartlinksProxyUpload: true;
  phase: 'ack';
  id: string;
  seq: number;
}

export interface UploadDoneMessage {
  _smartlinksProxyUpload: true;
  phase: 'done';
  id: string;
  ok: boolean;
  data?: any;
  error?: string;
}

export type UploadMessage = 
  | UploadStartMessage 
  | UploadChunkMessage 
  | UploadEndMessage
  | UploadAckMessage
  | UploadDoneMessage;

// =============================================================================
// Constants
// =============================================================================

/** Reserved iframe context parameters (not app state) */
export const KNOWN_IFRAME_PARAMS = new Set([
  'collectionId',
  'appId',
  'productId',
  'proofId',
  'isAdmin',
  'dark',
  'parentUrl',
  'theme',
  'lang',
]);
