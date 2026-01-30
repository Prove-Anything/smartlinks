/**
 * Represents a standardized error response from the server.
 */
export interface ErrorResponse {
    /** Numeric error code (typically the HTTP status code: 400, 401, 500, etc.) */
    code: number;
    /** Server-specific error code string (e.g., "NOT_AUTHORIZED", "broadcasts.topic.invalid") */
    errorCode?: string;
    /** Human-readable error message in English (should be translated/customized by the application) */
    message: string;
    /** Additional error details from the server (optional) */
    details?: Record<string, any>;
}
/**
 * SDK error class that preserves all error context from HTTP responses.
 * Provides programmatic access to status codes, error codes, and response details.
 *
 * Important: Server-defined string error codes (e.g., "NOT_AUTHORIZED", "broadcasts.topic.invalid")
 * are preserved in the `details` property, not in the numeric `code` property.
 */
export declare class SmartlinksApiError extends Error {
    readonly statusCode: number;
    readonly errorResponse?: ErrorResponse | undefined;
    readonly url?: string | undefined;
    /**
     * @param message - Human-readable error message (English text from server)
     * @param statusCode - HTTP status code (e.g., 400, 401, 500)
     * @param errorResponse - Parsed error response from the server (if available)
     * @param url - The URL that was requested
     */
    constructor(message: string, statusCode: number, errorResponse?: ErrorResponse | undefined, url?: string | undefined);
    /**
     * Returns the numeric error code from the server response, if available.
     * This is typically the HTTP status code (400, 401, 500, etc.).
     *
     * For server-defined string error codes like "NOT_AUTHORIZED" or "broadcasts.topic.invalid",
     * use: `error.details?.errorCode || error.details?.error`
     */
    get code(): number | undefined;
    /**
     * Returns the server-specific error code string.
     * This is distinct from the HTTP status code (e.g., "NOT_AUTHORIZED", "broadcasts.topic.invalid").
     * This is the primary identifier to check for programmatic error handling.
     */
    get errorCode(): string | undefined;
    /**
     * Returns additional error details from the server, if available.
     * This object contains various server-specific fields that may vary by endpoint.
     */
    get details(): Record<string, any> | undefined;
    /**
     * Check if this is a client error (4xx status code).
     */
    isClientError(): boolean;
    /**
     * Check if this is a server error (5xx status code).
     */
    isServerError(): boolean;
    /**
     * Check if this is an authentication error (401 or 403).
     */
    isAuthError(): boolean;
    /**
     * Check if this is a not found error (404).
     */
    isNotFound(): boolean;
    /**
     * Check if this is a rate limit error (429).
     */
    isRateLimited(): boolean;
    /**
     * Returns a JSON representation of the error for logging/debugging.
     */
    toJSON(): Record<string, any>;
}
