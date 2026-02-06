// =============================================================================
// IframeResponder - Parent-side iframe communication handler
// =============================================================================

import * as cache from './cache';
import { collection } from './api/collection';
import type {
  IframeResponderOptions,
  CachedData,
  CollectionApp,
  RouteChangeMessage,
  SmartlinksIframeMessage,
  ProxyRequest,
  CustomProxyRequest,
  UploadStartMessage,
  UploadChunkMessage,
  UploadEndMessage,
} from './types/iframeResponder';

interface UploadState {
  chunks: Uint8Array[];
  fields: [string, string][];
  fileInfo: { type?: string; name?: string; key?: string };
  path: string;
}

/**
 * Parent-side iframe responder for SmartLinks microapp embedding.
 * 
 * Handles all bidirectional communication with embedded iframes:
 * - API proxy requests (with caching)
 * - Authentication state synchronization
 * - Deep linking / route changes
 * - Resize management
 * - Chunked file upload proxying
 * 
 * @example
 * ```typescript
 * const responder = new IframeResponder({
 *   collectionId: 'my-collection',
 *   appId: 'warranty',
 *   onAuthLogin: async (token, user) => {
 *     smartlinks.setBearerToken(token);
 *   },
 * });
 * 
 * const src = await responder.attach(iframeElement);
 * iframeElement.src = src;
 * 
 * // Cleanup
 * responder.destroy();
 * ```
 */
export class IframeResponder {
  private iframe: HTMLIFrameElement | null = null;
  private options: IframeResponderOptions;
  private cache: CachedData;
  private uploads: Map<string, UploadState> = new Map();
  private isInitialLoad: boolean = true;
  private messageHandler: ((e: MessageEvent) => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private appUrl: string | null = null;
  private ready: Promise<void>;
  private resolveReady: (() => void) | null = null;

  constructor(options: IframeResponderOptions) {
    console.log('[IframeResponder] Constructor called', {
      collectionId: options.collectionId,
      appId: options.appId,
      productId: options.productId,
      hasCache: !!options.cache,
      hasCachedApps: !!options.cache?.apps,
    });
    
    console.log('[IframeResponder] SDK version check:', {
      hasCache: typeof cache !== 'undefined',
      hasCacheGetOrFetch: typeof cache?.getOrFetch === 'function',
    });
    
    this.options = options;
    this.cache = options.cache || {};
    
    // Create ready promise
    this.ready = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
    
    // Start resolving app URL
    this.resolveAppUrl()
      .then(() => {
        console.log('[IframeResponder] App URL resolved successfully:', this.appUrl);
        this.resolveReady?.();
      })
      .catch((err) => {
        console.error('[IframeResponder] App URL resolution failed:', err);
        this.options.onError?.(err);
        // Still resolve to prevent hanging, but with null URL
        this.resolveReady?.();
      });
  }

  /**
   * Attach to an iframe element.
   * Returns the src URL to set on the iframe.
   */
  async attach(iframe: HTMLIFrameElement): Promise<string> {
    console.log('[IframeResponder] attach() called, waiting for ready...');
    
    await this.ready;
    
    console.log('[IframeResponder] Ready resolved, appUrl:', this.appUrl);
    
    this.iframe = iframe;
    
    // Set up message listener
    this.messageHandler = this.handleMessage.bind(this);
    window.addEventListener('message', this.messageHandler);
    
    // Set up resize listener for viewport-based calculations
    this.resizeHandler = this.calculateViewportHeight.bind(this);
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('orientationchange', this.resizeHandler);
    
    const src = this.buildIframeSrc();
    console.log('[IframeResponder] Built iframe src:', src);
    return src;
  }

  /**
   * Update cached data (e.g., after user logs in).
   */
  updateCache(data: Partial<CachedData>): void {
    this.cache = { ...this.cache, ...data };
  }

  /**
   * Cleanup - remove event listeners and clear state.
   */
  destroy(): void {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }
    
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('orientationchange', this.resizeHandler);
      this.resizeHandler = null;
    }
    
    this.uploads.clear();
    this.iframe = null;
  }

  // ===========================================================================
  // URL Resolution
  // ===========================================================================

  private async resolveAppUrl(): Promise<void> {
    console.log('[IframeResponder] resolveAppUrl started');
    
    // Use explicit override if provided
    if (this.options.appUrl) {
      this.appUrl = this.options.appUrl;
      console.log('[IframeResponder] Using override URL:', this.appUrl);
      return;
    }

    // Check pre-populated cache
    const cachedApps = this.cache.apps;
    if (cachedApps) {
      console.log('[IframeResponder] Found cached apps:', cachedApps.length);
      const app = cachedApps.find(a => a.id === this.options.appId);
      if (app) {
        this.appUrl = this.getVersionUrl(app);
        console.log('[IframeResponder] Using cached app URL:', this.appUrl);
        return;
      }
      console.log('[IframeResponder] App not found in cache, fetching from API');
    } else {
      console.log('[IframeResponder] No cached apps, fetching from API');
    }

    // Fetch from API with caching
    try {
      console.log('[IframeResponder] Calling cache.getOrFetch for apps');
      const appsConfig = await cache.getOrFetch(
        `apps:${this.options.collectionId}`,
        () => collection.getAppsConfig(this.options.collectionId),
        { ttl: 5 * 60 * 1000, storage: 'session' }
      );
      
      console.log('[IframeResponder] Got appsConfig from API:', appsConfig);
      const apps = appsConfig.apps as CollectionApp[];
      console.log('[IframeResponder] Extracted apps array:', apps?.length, apps);
      
      const app = apps.find(a => a.id === this.options.appId);
      if (!app) {
        console.error('[IframeResponder] App not found:', this.options.appId, 'Available:', apps.map(a => a.id));
        throw new Error(`App "${this.options.appId}" not found in collection "${this.options.collectionId}"`);
      }
      
      this.appUrl = this.getVersionUrl(app);
      console.log('[IframeResponder] Resolved app URL:', this.appUrl);
    } catch (err: any) {
      console.error('[IframeResponder] resolveAppUrl error:', err);
      this.options.onError?.(err);
      throw err;
    }
  }

  private getVersionUrl(app: CollectionApp): string {
    // Use publicIframeUrl from AppConfig
    if (!app.publicIframeUrl) {
      throw new Error(`App "${app.id}" does not have a publicIframeUrl configured`);
    }
    return app.publicIframeUrl;
  }

  // ===========================================================================
  // URL Building
  // ===========================================================================

  private buildIframeSrc(): string {
    console.log('[IframeResponder] buildIframeSrc called, appUrl:', this.appUrl);
    
    if (!this.appUrl) {
      console.error('[IframeResponder] Cannot build src - appUrl is null!');
      throw new Error('App URL not resolved');
    }

    const params = new URLSearchParams();
    
    // Required context
    params.set('collectionId', this.options.collectionId);
    params.set('appId', this.options.appId);
    
    // Optional context
    if (this.options.productId) params.set('productId', this.options.productId);
    if (this.options.proofId) params.set('proofId', this.options.proofId);
    if (this.options.isAdmin) params.set('isAdmin', 'true');
    
    // Dark mode from collection
    const isDark = this.cache.collection?.dark ?? false;
    params.set('dark', isDark ? '1' : '0');
    
    // Parent URL for redirects
    try {
      params.set('parentUrl', window.location.href);
    } catch {
      // Ignore if can't access location
    }
    
    // Encode theme from collection
    if (this.cache.collection) {
      try {
        const themeData = {
          p: this.cache.collection.primaryColor,
          s: this.cache.collection.secondaryColor,
          m: this.cache.collection.dark ? 'd' : 'l',
        };
        if (themeData.p || themeData.s) {
          params.set('theme', btoa(JSON.stringify(themeData)));
        }
      } catch {
        // Ignore encoding errors
      }
    }

    // Build URL - respect the URL format from server (hash routing or not)
    let finalUrl = this.appUrl;
    
    // Check if this URL uses hash routing (has a # in it)
    const hasHash = finalUrl.includes('#');
    console.log('[IframeResponder] URL has hash routing:', hasHash);
    
    if (hasHash) {
      // Hash-routed app - build params into the hash portion
      const [baseWithHash, existingQuery = ''] = finalUrl.split('?');
      const existingParams = new URLSearchParams(existingQuery);
      params.forEach((value, key) => existingParams.set(key, value));
      
      // Add initialPath if provided
      if (this.options.initialPath) {
        const path = this.options.initialPath.startsWith('/') ? this.options.initialPath : '/' + this.options.initialPath;
        // Insert path before the ?
        const [beforeHash, afterHash] = baseWithHash.split('#');
        finalUrl = `${beforeHash}#${afterHash || ''}${path}?${existingParams.toString()}`;
      } else {
        finalUrl = `${baseWithHash}?${existingParams.toString()}`;
      }
    } else {
      // Path-routed app - use URL API to add params normally
      const url = new URL(finalUrl);
      
      // Add initialPath if provided
      if (this.options.initialPath) {
        const path = this.options.initialPath.startsWith('/') ? this.options.initialPath : '/' + this.options.initialPath;
        url.pathname = url.pathname.replace(/\/$/, '') + path;
      }
      
      // Add query params
      params.forEach((value, key) => url.searchParams.set(key, value));
      finalUrl = url.toString();
    }

    console.log('[IframeResponder] Final iframe URL:', finalUrl);
    return finalUrl;
  }

  // ===========================================================================
  // Viewport Resize Calculation
  // ===========================================================================

  private calculateViewportHeight(): void {
    if (!this.iframe) return;
    
    const container = this.iframe.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const calculatedHeight = Math.max(0, viewportHeight - rect.top);
    
    this.options.onResize?.(calculatedHeight);
  }

  // ===========================================================================
  // Message Handling
  // ===========================================================================

  private async handleMessage(event: MessageEvent): Promise<void> {
    // Validate source is our iframe
    if (!this.iframe || event.source !== this.iframe.contentWindow) {
      return;
    }

    const data = event.data;
    if (!data || typeof data !== 'object') return;

    // Route changes (deep linking)
    if (data.type === 'smartlinks-route-change') {
      this.handleRouteChange(data as RouteChangeMessage);
      return;
    }

    // Standardized iframe messages
    if (data._smartlinksIframeMessage) {
      await this.handleStandardMessage(data as SmartlinksIframeMessage, event);
      return;
    }

    // File upload proxy
    if (data._smartlinksProxyUpload) {
      await this.handleUpload(data, event);
      return;
    }

    // API proxy requests
    if (data._smartlinksProxyRequest) {
      await this.handleProxyRequest(data, event);
      return;
    }
  }

  // ===========================================================================
  // Route Changes (Deep Linking)
  // ===========================================================================

  private handleRouteChange(data: RouteChangeMessage): void {
    // Skip initial load to prevent duplicating path
    if (this.isInitialLoad) {
      this.isInitialLoad = false;
      return;
    }

    const { context = {}, state = {}, path = '' } = data;
    
    // Filter out known iframe params, keep only app-specific state
    const KNOWN_PARAMS = new Set([
      'collectionId', 'appId', 'productId', 'proofId',
      'isAdmin', 'dark', 'parentUrl', 'theme', 'lang',
    ]);
    
    const filteredState: Record<string, string> = {};
    
    Object.entries(context).forEach(([key, value]) => {
      if (value != null && !KNOWN_PARAMS.has(key)) {
        filteredState[key] = value;
      }
    });
    
    Object.entries(state).forEach(([key, value]) => {
      if (value != null && !KNOWN_PARAMS.has(key)) {
        filteredState[key] = value;
      }
    });

    this.options.onRouteChange?.(path, filteredState);
  }

  // ===========================================================================
  // Standard Iframe Messages
  // ===========================================================================

  private async handleStandardMessage(
    data: SmartlinksIframeMessage,
    event: MessageEvent
  ): Promise<void> {
    switch (data.type) {
      case 'smartlinks:resize': {
        const contentHeight = data.payload?.height;
        if (typeof contentHeight === 'number' && contentHeight > 0) {
          this.options.onResize?.(contentHeight);
        }
        break;
      }
      
      case 'smartlinks:redirect': {
        const url = data.payload?.url;
        if (url && typeof url === 'string') {
          window.location.href = url;
        }
        break;
      }
      
      case 'smartlinks:authkit:login': {
        const { token, user, accountData, messageId } = data.payload || {};
        
        if (!this.options.onAuthLogin) {
          this.sendResponse(event, {
            type: 'smartlinks:authkit:login-acknowledged',
            messageId,
            success: false,
            error: 'No auth handler available',
          });
          break;
        }
        
        try {
          // TODO: Validate token using SDK auth utilities when available
          // await auth.verifyToken(token);
          
          await this.options.onAuthLogin(token, user, accountData);
          
          // Update cache with new user
          this.cache.user = user;
          
          this.sendResponse(event, {
            type: 'smartlinks:authkit:login-acknowledged',
            messageId,
            success: true,
          });
        } catch (err: any) {
          this.sendResponse(event, {
            type: 'smartlinks:authkit:login-acknowledged',
            messageId,
            success: false,
            error: err?.message || 'Auth failed',
          });
          this.options.onError?.(err);
        }
        break;
      }
      
      case 'smartlinks:authkit:logout': {
        if (this.options.onAuthLogout) {
          await this.options.onAuthLogout();
          this.cache.user = null;
        }
        break;
      }
      
      case 'smartlinks:authkit:redirect': {
        const url = data.payload?.url;
        if (url && typeof url === 'string') {
          window.location.href = url;
        }
        break;
      }
    }
  }

  // ===========================================================================
  // API Proxy
  // ===========================================================================

  private async handleProxyRequest(
    data: ProxyRequest | CustomProxyRequest,
    event: MessageEvent
  ): Promise<void> {
    const response: any = {
      _smartlinksProxyResponse: true,
      id: data.id,
    };

    // Handle custom proxy requests (redirects, etc.)
    if ('_smartlinksCustomProxyRequest' in data && data._smartlinksCustomProxyRequest) {
      if (data.request === 'REDIRECT') {
        const url = data.params?.url;
        if (url) {
          window.location.href = url;
        }
        response.data = { success: true };
        this.sendResponse(event, response);
        return;
      }
    }

    const proxyData = data as ProxyRequest;

    try {
      const path = proxyData.path.startsWith('/') ? proxyData.path.slice(1) : proxyData.path;

      // Check for cached data matches on GET requests
      if (proxyData.method === 'GET') {
        const cachedResponse = this.getCachedResponse(path);
        if (cachedResponse !== null) {
          response.data = cachedResponse;
          this.sendResponse(event, response);
          return;
        }
      }

      // Forward to actual API using SDK's http utilities
      // Build full URL and use fetch for now (can be replaced with SDK request when needed)
      const baseUrl = '/api/v1';
      const fetchOptions: RequestInit = {
        method: proxyData.method,
        headers: proxyData.headers,
      };
      
      if (proxyData.body && proxyData.method !== 'GET') {
        fetchOptions.body = JSON.stringify(proxyData.body);
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        };
      }
      
      const fetchResponse = await fetch(`${baseUrl}/${path}`, fetchOptions);
      response.data = await fetchResponse.json();
    } catch (err: any) {
      response.error = err?.message || 'Unknown error';
      this.options.onError?.(err);
    }

    this.sendResponse(event, response);
  }

  private getCachedResponse(path: string): any | null {
    // Collection request
    if (path.includes('/collection/') && this.cache.collection) {
      const match = path.match(/collection\/([^/]+)/);
      if (match && match[1] === this.options.collectionId) {
        return JSON.parse(JSON.stringify(this.cache.collection));
      }
    }
    
    // Product request
    if (path.includes('/product/') && this.cache.product && this.options.productId) {
      const match = path.match(/product\/([^/]+)/);
      if (match && match[1] === this.options.productId) {
        return JSON.parse(JSON.stringify(this.cache.product));
      }
    }
    
    // Proof request
    if (path.includes('/proof/') && this.cache.proof && this.options.proofId) {
      const match = path.match(/proof\/([^/]+)/);
      if (match && match[1] === this.options.proofId) {
        return JSON.parse(JSON.stringify(this.cache.proof));
      }
    }
    
    // Account request
    if (path.includes('/account') && this.cache.user) {
      return JSON.parse(JSON.stringify({
        ...this.cache.user.accountData,
        uid: this.cache.user.uid,
        email: this.cache.user.email,
        displayName: this.cache.user.displayName,
      }));
    }
    
    return null;
  }

  // ===========================================================================
  // Chunked File Uploads
  // ===========================================================================

  private async handleUpload(
    data: UploadStartMessage | UploadChunkMessage | UploadEndMessage,
    event: MessageEvent
  ): Promise<void> {
    switch (data.phase) {
      case 'start': {
        const startData = data as UploadStartMessage;
        this.uploads.set(startData.id, {
          chunks: [],
          fields: startData.fields,
          fileInfo: startData.fileInfo,
          path: startData.path,
        });
        break;
      }
      
      case 'chunk': {
        const chunkData = data as UploadChunkMessage;
        const upload = this.uploads.get(chunkData.id);
        if (upload) {
          const uint8Array = new Uint8Array(chunkData.chunk);
          upload.chunks.push(uint8Array);
          this.sendResponse(event, {
            _smartlinksProxyUpload: true,
            phase: 'ack',
            id: chunkData.id,
            seq: chunkData.seq,
          });
        }
        break;
      }
      
      case 'end': {
        const endData = data as UploadEndMessage;
        const upload = this.uploads.get(endData.id);
        if (!upload) break;

        try {
          const blobParts: BlobPart[] = upload.chunks.map(
            chunk => chunk.buffer.slice(0) as ArrayBuffer
          );
          const blob = new Blob(blobParts, { 
            type: upload.fileInfo.type || 'application/octet-stream' 
          });
          
          const formData = new FormData();
          upload.fields.forEach(([key, value]) => formData.append(key, value));
          formData.append(
            upload.fileInfo.key || 'file', 
            blob, 
            upload.fileInfo.name || 'upload.bin'
          );

          const path = upload.path.startsWith('/') ? upload.path.slice(1) : upload.path;
          const baseUrl = '/api/v1';
          
          const response = await fetch(`${baseUrl}/${path}`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
          }
          
          const result = await response.json();
          
          this.sendResponse(event, {
            _smartlinksProxyUpload: true,
            phase: 'done',
            id: endData.id,
            ok: true,
            data: result,
          });
        } catch (err: any) {
          this.sendResponse(event, {
            _smartlinksProxyUpload: true,
            phase: 'done',
            id: endData.id,
            ok: false,
            error: err?.message || 'Upload failed',
          });
          this.options.onError?.(err);
        }
        
        this.uploads.delete(endData.id);
        break;
      }
    }
  }

  // ===========================================================================
  // Utilities
  // ===========================================================================

  private sendResponse(event: MessageEvent, message: any): void {
    if (event.source && 'postMessage' in event.source) {
      (event.source as WindowProxy).postMessage(message, event.origin);
    }
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Determine admin status from collection/proof roles.
 */
export function isAdminFromRoles(
  user: { uid: string } | null | undefined,
  collection?: { roles?: Record<string, any> },
  proof?: { roles?: Record<string, any> }
): boolean {
  if (!user?.uid) return false;
  return !!(collection?.roles?.[user.uid] || proof?.roles?.[user.uid]);
}

/**
 * Build iframe src URL with all context params.
 * Standalone helper for cases where you don't need the full IframeResponder.
 */
export function buildIframeSrc(options: {
  appUrl: string;
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  isAdmin?: boolean;
  dark?: boolean;
  theme?: { primary?: string; secondary?: string };
  initialPath?: string;
}): string {
  const params = new URLSearchParams();
  
  params.set('collectionId', options.collectionId);
  params.set('appId', options.appId);
  if (options.productId) params.set('productId', options.productId);
  if (options.proofId) params.set('proofId', options.proofId);
  if (options.isAdmin) params.set('isAdmin', 'true');
  params.set('dark', options.dark ? '1' : '0');
  
  if (options.theme?.primary || options.theme?.secondary) {
    const themeData = { p: options.theme.primary, s: options.theme.secondary };
    params.set('theme', btoa(JSON.stringify(themeData)));
  }
  
  try {
    params.set('parentUrl', window.location.href);
  } catch {
    // Ignore
  }
  
  let base = options.appUrl.replace(/#\/?$/, '').replace(/\/$/, '');
  let path = options.initialPath || '';
  if (path && !path.startsWith('/')) path = '/' + path;
  
  return `${base}/#${path}?${params.toString()}`.replace('/#/?', '/#?').replace('/#/', '/#/');
}
