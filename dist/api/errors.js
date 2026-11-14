import { post } from "../http.js";
/**
 * Report an error an app saw, into the platform's one error log (the same BigQuery error-events table the
 * server writes to). Best effort: never throws into the flow that failed.
 */
export var errors;
(function (errors) {
    async function report(event) {
        try {
            return await post(`/admin/log/error`, event);
        }
        catch (_a) {
            return { kept: false };
        }
    }
    errors.report = report;
})(errors || (errors = {}));
