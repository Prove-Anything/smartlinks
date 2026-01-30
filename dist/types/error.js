/**
 * SDK error class that preserves all error context from HTTP responses.
 * Provides programmatic access to status codes, error codes, and response details.
 *
 * Important: Server-defined string error codes (e.g., "NOT_AUTHORIZED", "broadcasts.topic.invalid")
 * are preserved in the `details` property, not in the numeric `code` property.
 */
export class SmartlinksApiError extends Error {
    /**
     * @param message - Human-readable error message (English text from server)
     * @param statusCode - HTTP status code (e.g., 400, 401, 500)
     * @param errorResponse - Parsed error response from the server (if available)
     * @param url - The URL that was requested
     */
    constructor(message, statusCode, errorResponse, url) {
        super(message);
        this.statusCode = statusCode;
        this.errorResponse = errorResponse;
        this.url = url;
        this.name = 'SmartlinksApiError';
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SmartlinksApiError);
        }
    }
    /**
     * Returns the numeric error code from the server response, if available.
     * This is typically the HTTP status code (400, 401, 500, etc.).
     *
     * For server-defined string error codes like "NOT_AUTHORIZED" or "broadcasts.topic.invalid",
     * use: `error.details?.errorCode || error.details?.error`
     */
    get code() {
        var _a;
        return (_a = this.errorResponse) === null || _a === void 0 ? void 0 : _a.code;
    }
    /**
     * Returns the server-specific error code string.
     * This is distinct from the HTTP status code (e.g., "NOT_AUTHORIZED", "broadcasts.topic.invalid").
     * This is the primary identifier to check for programmatic error handling.
     */
    get errorCode() {
        var _a;
        return (_a = this.errorResponse) === null || _a === void 0 ? void 0 : _a.errorCode;
    }
    /**
     * Returns additional error details from the server, if available.
     * This object contains various server-specific fields that may vary by endpoint.
     */
    get details() {
        var _a;
        return (_a = this.errorResponse) === null || _a === void 0 ? void 0 : _a.details;
    }
    /**
     * Check if this is a client error (4xx status code).
     */
    isClientError() {
        return this.statusCode >= 400 && this.statusCode < 500;
    }
    /**
     * Check if this is a server error (5xx status code).
     */
    isServerError() {
        return this.statusCode >= 500 && this.statusCode < 600;
    }
    /**
     * Check if this is an authentication error (401 or 403).
     */
    isAuthError() {
        return this.statusCode === 401 || this.statusCode === 403;
    }
    /**
     * Check if this is a not found error (404).
     */
    isNotFound() {
        return this.statusCode === 404;
    }
    /**
     * Check if this is a rate limit error (429).
     */
    isRateLimited() {
        return this.statusCode === 429;
    }
    /**
     * Returns a JSON representation of the error for logging/debugging.
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            code: this.code,
            errorCode: this.errorCode,
            details: this.details,
            url: this.url,
        };
    }
}
