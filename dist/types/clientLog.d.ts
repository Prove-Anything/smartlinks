/**
 * An app reporting an error it saw (errors.report): kept in the platform's one error log (CloudEvents + ECS
 * rows in BigQuery), the same place server-side errors go. Say what it was about with entityType/entityId
 * (a tag's chip UID, a product id, an order id), put routing facts in labels and the detail in context.
 * Never include keys, passwords or tokens: the server drops any field whose name looks like one.
 */
export interface ClientErrorReport {
    /** Which app: 'sidekick', 'studio', a site's app id. Default 'client'. */
    app?: string;
    appVersion?: string;
    /** The collection it concerns, when there is one (owners see their collection's errors) */
    collectionId?: string;
    /** What was being done: 'tag.program', 'order.submit', … */
    operation?: string;
    severity?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
    /** A short stable code: 'TAG_LOST', 'TIMEOUT', … (this or message is required) */
    errorCode?: string;
    errorType?: string;
    message?: string;
    stack?: string;
    /** What it was about: 'tag', 'product', 'order', … */
    entityType?: string;
    /** …and which one: a chip UID (normalised for 'tag'), a product id, … */
    entityId?: string;
    labels?: Record<string, unknown>;
    context?: Record<string, unknown>;
    /** An operation id to group by (a batch, a job) */
    refId?: string;
    correlationId?: string;
}
/** One kept error event, as the lookups return it (newest first). */
export interface ClientErrorEvent {
    id: string;
    time: string;
    event_category: string;
    event_action: string | null;
    log_level: string;
    error_code: string | null;
    error_message: string | null;
    service_name: string | null;
    service_version: string | null;
    collection_id: string | null;
    user_id: string | null;
    labels: Record<string, unknown> | null;
    context: Record<string, unknown> | null;
}
