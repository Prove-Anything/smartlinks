export interface ListBroadcastsQuery {
    limit?: number;
    offset?: number;
    appId?: string;
}
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
        [key: string]: unknown;
    };
    createdAt: string;
}
export interface BroadcastList {
    items: BroadcastRecord[];
    limit: number;
    offset: number;
}
