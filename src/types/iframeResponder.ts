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
  
  // Events
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
  state: Record<string, string>;
  appId?: string;
}

export interface SmartlinksIframeMessage {
  _smartlinksIframeMessage: true;
  type: 
    | 'smartlinks:resize' 
    | 'smartlinks:redirect' 
    | 'smartlinks:authkit:login'
    | 'smartlinks:authkit:logout'
    | 'smartlinks:authkit:redirect';
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
