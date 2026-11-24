import type { ListResult, ListOptions } from './list.js';
/** `broadcasts.list` options: the app that owns them, plus `limit` and `cursor`. */
export interface ListBroadcastsQuery extends ListOptions {
    appId?: string;
}
/** Broadcast channels. Wallet is not one: wallet passes are messaged one-to-one (`comms.send` with `channel: 'wallet'`). */
export type BroadcastChannel = 'email' | 'push' | 'sms';
export interface BroadcastRecord {
    id: string;
    collectionId: string;
    appId: string;
    templateId?: string | null;
    segmentId?: string | null;
    status?: string | null;
    scheduledAt?: string | null;
    sentAt?: string | null;
    data?: {
        display?: {
            title?: string;
            description?: string;
            icon?: string;
            color?: string;
        };
        broadcastType?: string;
        /** Required topic key for consent enforcement (e.g. newsletter, marketing, critical) */
        topic: string;
        /** Required topic key for consent enforcement (e.g. newsletter, marketing, critical) */
        templateParams?: Record<string, unknown>;
        /** Per-channel enablement/priority and optional template overrides */
        channelSettings?: {
            mode?: 'preferred' | 'channels' | 'all';
            channels?: Array<{
                channel: BroadcastChannel;
                enabled?: boolean;
                priority?: number;
            }>;
        };
        /** Files on every email of the broadcast (at most 5, 10 MB in all): uploaded assets only. */
        attach?: Array<{
            asset: string;
        }>;
        [key: string]: unknown;
    };
    createdAt: string;
}
/** What `broadcasts.recipients` returns: a page of contacts (`count` = how many in all), and sometimes a note. */
export interface BroadcastRecipientsResponse extends ListResult<import('./comms.js').Recipient> {
    note?: string;
}
export interface BroadcastPreviewRequest {
    contactId?: string;
    email?: string;
    phone?: string;
    props?: Record<string, any>;
    channelOverride?: BroadcastChannel;
    hydrate?: boolean;
    include?: {
        product?: boolean;
        proof?: boolean;
        user?: boolean;
        [k: string]: boolean | undefined;
    };
}
export type BroadcastPreviewResponse = {
    channel: 'email';
    html: string;
    subject?: string;
    templateId?: string;
} | {
    channel: 'push';
    payload: any;
    subject?: string;
} | {
    channel: 'sms';
    body: string;
};
export interface BroadcastSendTestRequest {
    contactId?: string;
    email?: string;
    phone?: string;
    props?: Record<string, any>;
    channelOverride?: BroadcastChannel;
    hydrate?: boolean;
    include?: {
        product?: boolean;
        proof?: boolean;
        user?: boolean;
        [k: string]: boolean | undefined;
    };
}
export interface BroadcastSendTestResponse {
    ok: boolean;
    id?: string;
    channel?: BroadcastChannel;
}
export interface BroadcastSendManualRequest {
    limit?: number;
    offset?: number;
    dryRun?: boolean;
    sharedContext?: Record<string, any>;
}
export interface BroadcastSendManualResponse {
    ok: boolean;
    counts: {
        sent: number;
        failed: number;
        skipped: number;
    };
    page: {
        limit: number;
        offset: number;
        total: number;
    };
    results: Array<{
        contactId: string;
        status: 'sent' | 'failed' | 'skipped' | 'dry_run';
        id?: string;
        error?: string;
        message?: string;
    }>;
}
export interface BroadcastSendRequest {
    pageSize?: number;
    maxPages?: number;
    sharedContext?: Record<string, any>;
    channel?: BroadcastChannel;
    hydrate?: boolean;
    include?: {
        product?: boolean;
        proof?: boolean;
        user?: boolean;
        [k: string]: boolean | undefined;
    };
}
export interface BroadcastAppendEventBody {
    broadcastId: string;
    contactId?: string;
    channel?: BroadcastChannel;
    templateId?: string;
    eventType: string;
    outcome?: 'success' | 'failed';
    failureReason?: string;
    metadata?: Record<string, any>;
}
export interface BroadcastAppendBulkBody {
    ids: string[];
    idField?: string;
    params: Record<string, any>;
}
