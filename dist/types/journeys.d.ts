import type { ListOptions } from './list.js';
export interface JourneyRecord {
    id: string;
    collectionId: string;
    appId?: string;
    name: string;
    active: boolean;
    journeyType: 'event_triggered' | 'scheduled';
    data?: {
        display?: {
            title?: string;
            description?: string;
            icon?: string;
            color?: string;
        };
        steps?: Array<{
            id: string;
            type: string;
            config?: Record<string, unknown>;
        }>;
        triggers?: Array<{
            type: string;
            config?: Record<string, unknown>;
        }>;
        entryRules?: any[];
        exitRules?: any[];
        metadata?: Record<string, unknown>;
        [key: string]: unknown;
    };
    createdAt: string;
    updatedAt: string;
}
/** Options for journeys.list(): `limit` and `cursor` page the list. */
export interface ListJourneysQuery extends ListOptions {
    appId?: string;
    active?: boolean;
    journeyType?: 'event_triggered' | 'scheduled';
}
export interface CreateJourneyBody {
    appId?: string;
    name: string;
    active?: boolean;
    journeyType: 'event_triggered' | 'scheduled';
    data?: Record<string, unknown>;
}
export interface UpdateJourneyBody {
    appId?: string;
    name?: string;
    active?: boolean;
    journeyType?: 'event_triggered' | 'scheduled';
    data?: Record<string, unknown>;
}
