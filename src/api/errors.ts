import { post } from "../http";
import { ClientErrorReport } from "../types";

/**
 * Report an error an app saw, into the platform's one error log (the same BigQuery error-events table the
 * server writes to). Best effort: never throws into the flow that failed.
 */
export namespace errors {
  export async function report(event: ClientErrorReport): Promise<{ kept: boolean }> {
    try {
      return await post<{ kept: boolean }>(`/admin/log/error`, event)
    } catch {
      return { kept: false }
    }
  }
}
