import type { IdField } from './common';
/**
 * Target subject for notifications (product, collection, etc.)
 */
export interface NotificationSubjectTarget {
    /** Type of target entity */
    type: 'product' | 'collection' | 'user' | 'batch' | 'proof';
    /** ID of the target entity */
    id: string;
}
/**
 * Push notification template content
 */
export interface PushNotificationTemplate {
    /** Notification title */
    title: string;
    /** Notification body text */
    body: string;
    /** Optional icon URL for the notification */
    icon?: string;
}
/**
 * Email notification template content
 */
export interface EmailNotificationTemplate {
    /** Email subject line */
    subject: string;
    /** Email body content (plain text or HTML) */
    body: string;
}
/**
 * Wallet pass update template content
 */
export interface WalletUpdateTemplate {
    textModulesData?: Array<{
        /** Module ID */
        id: string;
        /** Module header text */
        header: string;
        /** Module body text */
        body: string;
    }>;
}
/**
 * Notification template containing different delivery methods
 */
export interface NotificationTemplate {
    /** Push notification content */
    push?: PushNotificationTemplate;
    /** Email notification content */
    email?: EmailNotificationTemplate;
    /** Wallet pass update content */
    walletUpdate?: WalletUpdateTemplate;
}
/**
 * Request payload for sending notifications
 */
export interface SendNotificationRequest {
    /** Target subjects that should receive the notification */
    subjectTargets: NotificationSubjectTarget[];
    /** Severity level of the notification */
    severity: 'low' | 'normal' | 'important' | 'critical';
    /** Delivery channel mode preference */
    mode: 'preferred' | 'all';
    /** Specific channels to use for delivery */
    channels: ("push" | "email" | "wallet")[];
    /** Notification content templates for different delivery methods */
    template: NotificationTemplate;
}
/**
 * Response from sending notifications
 */
export interface SendNotificationResponse {
    /** Whether the request was accepted */
    ok: boolean;
    /** Unique ID for this notification */
    notificationId: string;
    /** Basic counts for contacts and attempts */
    counts: {
        contacts: number;
        attempts: number;
    };
    /** Detailed status for the notification */
    status: {
        notification: {
            /** The notification ID (repeated for convenience) */
            notificationId: string;
            /** Current processing state */
            state: 'queued' | 'sent' | 'failed' | 'confirmed' | string;
            /** Targets this notification refers to */
            subjectTargets: NotificationSubjectTarget[];
            /** Severity of this notification */
            severity: 'low' | 'normal' | 'important' | 'critical' | string;
            /** Optional channel overrides used when sending */
            channelsOverride: Record<string, any>;
            /** The effective template used */
            template: NotificationTemplate;
        };
        /** Totals across all contacts */
        totals: {
            queued: number;
            sent: number;
            failed: number;
            confirmed: number;
        };
    };
}
export interface CommunicationEvent {
    orgId: string;
    broadcastId?: string;
    journeyId?: string;
    userId?: string;
    contactId?: string;
    channel?: string;
    timestamp: string;
    eventType: string;
    outcome?: string | null;
    templateId?: string | null;
    [k: string]: any;
}
export interface CommsQueryByUser {
    userId?: string;
    contactId?: string;
    from?: string;
    to?: string;
    limit?: number;
}
export type RecipientId = string;
export interface RecipientWithOutcome {
    id: string;
    outcome: string;
}
export interface CommsRecipientIdsQuery {
    broadcastId?: string;
    journeyId?: string;
    journeyStepId?: string;
    idField?: IdField;
    from?: string;
    to?: string;
    limit?: number;
}
export interface CommsRecipientsWithoutActionQuery {
    broadcastId?: string;
    journeyId?: string;
    actionId?: string;
    appId?: string;
    idField?: IdField;
    from?: string;
    to?: string;
    limit?: number;
}
export interface CommsRecipientsWithActionQuery {
    broadcastId?: string;
    journeyId?: string;
    actionId?: string;
    appId?: string;
    outcome?: string;
    idField?: IdField;
    includeOutcome?: boolean;
    from?: string;
    to?: string;
    limit?: number;
}
export interface LogCommunicationEventBody {
    broadcastId?: string;
    journeyId?: string;
    userId?: string;
    contactId?: string;
    channel?: string;
    eventType: string;
    outcome?: string;
    templateId?: string;
    timestamp?: string;
    [k: string]: any;
}
export interface LogBulkCommunicationEventsBody {
    params: {
        broadcastId?: string;
        journeyId?: string;
        [k: string]: any;
    };
    ids: string[];
    idField?: IdField;
}
export interface AppendResult {
    success: true;
}
export interface AppendBulkResult {
    success: true;
    count: number;
}
