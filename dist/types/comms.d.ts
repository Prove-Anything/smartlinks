import type { IdField } from './common';
import type { BroadcastChannel } from './broadcasts';
/**
 * Target subject for notifications (product, collection, etc.)
 */
export interface NotificationSubjectTarget {
    /** Type of target entity */
    type: 'product' | 'collection' | 'user' | 'batch' | 'proof';
    /** ID of the target entity */
    id: string;
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
export type Recipient = import('./contact').Contact;
export interface RecipientsPage {
    items: Recipient[];
    total: number;
    limit: number;
    offset: number;
    note?: string;
}
export interface PushSubscriptionJSON {
    endpoint: string;
    keys?: {
        p256dh?: string;
        auth?: string;
    };
}
export interface PushVapidResponse {
    publicKey: string;
}
export interface PushSubscribeResponse {
    ok: true;
    id: string;
}
export interface RegisterPushMethodRequest {
    contactId: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    meta?: Record<string, any>;
}
export interface CommsSettings {
    unsub?: {
        requireToken?: boolean;
        /** Secret for token generation; omitted unless includeSecret=true */
        secret?: string;
        /** Convenience flag indicating a secret is set (masked responses) */
        hasSecret?: boolean;
    };
    /** Map of topic keys to topic config */
    topics?: Record<string, TopicConfig>;
    [k: string]: any;
}
export interface TopicConfig {
    label?: string;
    description?: string;
    /** Optional UI-only grouping labels */
    labels?: string[];
    /** Classification for UI and default policy guidance */
    classification?: 'transactional' | 'marketing';
    defaults?: {
        channels?: Partial<Record<BroadcastChannel, boolean>>;
        topics?: Record<string, boolean | undefined>;
        /** Default consent policy when explicit preferences are absent */
        policy?: 'opt-in' | 'opt-out';
        /** Per-channel default policy (overrides policy when present) */
        byChannel?: Partial<Record<BroadcastChannel, 'opt-in' | 'opt-out'>>;
    };
    rules?: {
        allowChannels?: BroadcastChannel[];
        allowUnsubscribe?: boolean;
        required?: boolean;
    };
    [k: string]: any;
}
export interface CommsSettingsGetResponse {
    ok: true;
    settings: CommsSettings;
}
export type CommsSettingsPatchBody = Partial<CommsSettings>;
export interface CommsPublicTopicsResponse {
    ok: true;
    topics: Record<string, TopicConfig>;
}
export interface UnsubscribeQuery {
    contactId: string;
    topic?: string;
    channel?: BroadcastChannel;
    token?: string;
}
export interface UnsubscribeResponse {
    ok: true;
    applied?: {
        channels?: Record<string, boolean>;
        topics?: Record<string, boolean>;
    };
}
export type ConsentChannels = Partial<Record<BroadcastChannel, boolean>>;
type SubjectType = import('./contact').SubjectType;
export interface CommsConsentUpsertRequest {
    contactId: string;
    channels?: ConsentChannels;
    topics?: Record<string, boolean>;
    topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>;
}
export interface CommsPreferencesUpsertRequest {
    contactId: string;
    subject?: {
        type: SubjectType;
        id: string;
        productId?: string;
    };
    channels?: ConsentChannels;
    topics?: Record<string, boolean>;
    topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>;
}
export interface CommsSubscribeRequest {
    contactId: string;
    subject: {
        type: SubjectType;
        id: string;
        productId?: string;
    };
    subscribe: boolean;
    source?: string;
}
export interface CommsSubscribeResponse {
    ok: true;
    subscriptionId: string;
}
export interface CommsSubscriptionCheckQuery {
    contactId: string;
    subjectType: SubjectType;
    subjectId: string;
    productId?: string;
}
export interface CommsSubscriptionCheckResponse {
    ok: true;
    subscribed: boolean;
}
export interface CommsListMethodsQuery {
    contactId: string;
    type?: BroadcastChannel;
}
export interface CommsListMethodsResponse {
    ok: true;
    methods: import('./contact').CommMethod[];
}
export interface RegisterEmailMethodRequest {
    contactId?: string;
    email?: string;
    userId?: string;
}
export interface RegisterSmsMethodRequest {
    contactId?: string;
    phone?: string;
    userId?: string;
}
export interface RegisterMethodResponse {
    ok: true;
    contactId: string;
}
export interface SubscriptionsResolveRequest {
    subject: {
        type: SubjectType;
        id: string;
        productId?: string;
    };
    hints: {
        userId?: string;
        pushEndpoint?: string;
        email?: string;
        walletObjectId?: string;
    };
}
export interface SubscriptionsResolveResponse {
    ok: true;
    subject: {
        type: SubjectType;
        id: string;
        productId?: string;
    };
    contacts: Array<{
        contactId: string;
        subscribed: boolean;
        channels?: Partial<Record<BroadcastChannel, boolean>>;
        walletForSubject?: boolean;
    }>;
    anySubscribed: boolean;
    anyMethods: boolean;
    anyWalletForSubject: boolean;
}
export {};
