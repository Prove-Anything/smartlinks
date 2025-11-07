// src/api/ai.ts
// AI endpoints: public and admin helpers
import { post } from "../http"

// Request shape for AI generateContent calls
export interface AIGenerateContentRequest {
  /** The prompt or message contents sent to the AI */
  contents: string | any
  /** Desired MIME type of the response payload (e.g. 'application/json', 'text/plain') */
  responseMimeType?: string
  /** Optional system instruction or system prompt to steer the model */
  systemInstruction?: string
  /** AI provider identifier (e.g. 'openai', 'google', 'anthropic') */
  provider?: string
  /** The model name to use (e.g. 'gpt-4o', 'gemini-1.5-pro') */
  model?: string
  /** Allow passing additional provider/model-specific options */
  [key: string]: any
}

// Request shape for AI generateImage calls (admin)
export interface AIGenerateImageRequest {
  /** Text prompt describing the desired image */
  prompt: string
  /** AI provider identifier (e.g. 'openai', 'google', 'stability') */
  provider?: string
  /** Optional model name to use for image generation */
  model?: string
  /** Requested image size, e.g. '1024x1024' */
  size?: string
  /** Additional provider/model-specific options */
  [key: string]: any
}

// Request shape for AI searchPhotos calls (admin -> Unsplash proxy)
export interface AISearchPhotosRequest {
  /** Search query keyword(s) */
  query: string
  /** Number of results to return per page (e.g. 1) */
  per_page?: number
  /** Desired orientation of photos */
  orientation?: 'landscape' | 'portrait' | 'squarish'
  /** Additional provider-specific options */
  [key: string]: any
}

// Single photo item returned by searchPhotos
export interface AISearchPhotosPhoto {
  /** Direct image URL */
  url: string
  /** Alt text/description for accessibility */
  alt?: string
  /** Photographer display name */
  photographer?: string
  /** Link to the photographer profile */
  photographerUrl?: string
  /** Allow extra fields */
  [key: string]: any
}

export namespace ai {
  /**
   * Generate text/content via AI (admin)
   */
  export async function generateContent(
    collectionId: string,
    params: AIGenerateContentRequest,
    admin: boolean = true
  ): Promise<any> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/generateContent`
    return post<any>(path, params)
  }

  /**
   * Generate an image via AI (admin)
   */
  export async function generateImage(collectionId: string, params: AIGenerateImageRequest): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/generateImage`
    return post<any>(path, params)
  }

  /**
   * Search stock photos or similar via AI (admin)
   */
  export async function searchPhotos(
    collectionId: string,
    params: AISearchPhotosRequest
  ): Promise<AISearchPhotosPhoto[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/searchPhotos`
    return post<AISearchPhotosPhoto[]>(path, params)
  }

  /**
   * Upload a file for AI usage (admin). Pass FormData for binary uploads.
   */
  export async function uploadFile(collectionId: string, params: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/uploadFile`
    return post<any>(path, params)
  }

  /**
   * Create or warm a cache for AI (admin)
   */
  export async function createCache(collectionId: string, params: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/createCache`
    return post<any>(path, params)
  }

  /**
   * Post a chat message to the AI (admin or public)
   */
  export async function postChat(collectionId: string, params: any, admin: boolean = true): Promise<any> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/postChat`
    return post<any>(path, params)
  }
}
