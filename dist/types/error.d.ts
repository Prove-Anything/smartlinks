/**
 * Represents a standardized error response.
 */
export interface ErrorResponse {
    /** Numeric error code */
    code: number;
    /** Human-readable error message */
    message: string;
}
