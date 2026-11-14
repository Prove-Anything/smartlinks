import { ClientErrorReport } from "../types/index.js";
/**
 * Report an error an app saw, into the platform's one error log (the same BigQuery error-events table the
 * server writes to). Best effort: never throws into the flow that failed.
 */
export declare namespace errors {
    function report(event: ClientErrorReport): Promise<{
        kept: boolean;
    }>;
}
