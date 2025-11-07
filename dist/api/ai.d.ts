export interface AIGenerateContentRequest {
    /** The prompt or message contents sent to the AI */
    contents: string | any;
    /** Desired MIME type of the response payload (e.g. 'application/json', 'text/plain') */
    responseMimeType?: string;
    /** Optional system instruction or system prompt to steer the model */
    systemInstruction?: string;
    /** AI provider identifier (e.g. 'openai', 'google', 'anthropic') */
    provider?: string;
    /** The model name to use (e.g. 'gpt-4o', 'gemini-1.5-pro') */
    model?: string;
    /** Allow passing additional provider/model-specific options */
    [key: string]: any;
}
export interface AIGenerateImageRequest {
    /** Text prompt describing the desired image */
    prompt: string;
    /** AI provider identifier (e.g. 'openai', 'google', 'stability') */
    provider?: string;
    /** Optional model name to use for image generation */
    model?: string;
    /** Requested image size, e.g. '1024x1024' */
    size?: string;
    /** Additional provider/model-specific options */
    [key: string]: any;
}
export interface AISearchPhotosRequest {
    /** Search query keyword(s) */
    query: string;
    /** Number of results to return per page (e.g. 1) */
    per_page?: number;
    /** Desired orientation of photos */
    orientation?: 'landscape' | 'portrait' | 'squarish';
    /** Additional provider-specific options */
    [key: string]: any;
}
export interface AISearchPhotosPhoto {
    /** Direct image URL */
    url: string;
    /** Alt text/description for accessibility */
    alt?: string;
    /** Photographer display name */
    photographer?: string;
    /** Link to the photographer profile */
    photographerUrl?: string;
    /** Allow extra fields */
    [key: string]: any;
}
export declare namespace ai {
    /**
     * Generate text/content via AI (admin)
     */
    function generateContent(collectionId: string, params: AIGenerateContentRequest, admin?: boolean): Promise<any>;
    /**
     * Generate an image via AI (admin)
     */
    function generateImage(collectionId: string, params: AIGenerateImageRequest): Promise<any>;
    /**
     * Search stock photos or similar via AI (admin)
     */
    function searchPhotos(collectionId: string, params: AISearchPhotosRequest): Promise<AISearchPhotosPhoto[]>;
    /**
     * Upload a file for AI usage (admin). Pass FormData for binary uploads.
     */
    function uploadFile(collectionId: string, params: any): Promise<any>;
    /**
     * Create or warm a cache for AI (admin)
     */
    function createCache(collectionId: string, params: any): Promise<any>;
    /**
     * Post a chat message to the AI (admin or public)
     */
    function postChat(collectionId: string, params: any, admin?: boolean): Promise<any>;
}
