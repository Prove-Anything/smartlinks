import type { IdField } from './common.js';
import type { BroadcastChannel } from './broadcasts.js';
import type { ListResult, ListOptions } from './list.js';
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
/** `comms.queryByUser` options: who, the time window (`from` / `to`), plus `limit` and `cursor`. */
export interface CommsQueryByUser extends ListOptions {
    userId?: string;
    contactId?: string;
    from?: string;
    to?: string;
}
export type RecipientId = string;
export interface RecipientWithOutcome {
    id: string;
    outcome: string;
}
/** `comms.queryRecipientIds` options: the source, the time window (`from` / `to`), plus `limit` and `cursor`. */
export interface CommsRecipientIdsQuery extends ListOptions {
    broadcastId?: string;
    journeyId?: string;
    idField?: IdField;
    from?: string;
    to?: string;
}
/** Who a broadcast or journey reached that did NOT then do an interaction. */
export interface CommsRecipientsWithoutInteractionQuery {
    broadcastId?: string;
    journeyId?: string;
    /** The interaction to look for (its id). */
    interactionId?: string;
    appId?: string;
    idField?: IdField;
    from?: string;
    to?: string;
    limit?: number;
    /** A `nextCursor` from the previous page. */
    cursor?: string;
}
/** Who a broadcast or journey reached that then did an interaction. */
export interface CommsRecipientsWithInteractionQuery {
    broadcastId?: string;
    journeyId?: string;
    /** The interaction to look for (its id). */
    interactionId?: string;
    appId?: string;
    outcome?: string;
    idField?: IdField;
    includeOutcome?: boolean;
    from?: string;
    to?: string;
    limit?: number;
    /** A `nextCursor` from the previous page. */
    cursor?: string;
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
export type Recipient = import('./contact.js').Contact;
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
    /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
    contactId?: string;
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
    /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
    contactId?: string;
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
export interface CommsSignupRequest {
    email: string;
    /**
     * Required: YOUR app's confirmation email — a template in this collection (SL.template) whose body
     * uses `{{ action_url }}` for the confirm link (`{{ topics }}` lists what they signed up for). The
     * platform sends no default sign-up email.
     */
    templateId: string;
    /** Topic ids from the collection's comm settings (e.g. ["newsletter"]). */
    topics?: string[];
    firstName?: string;
    /**
     * The form's other answers — firstName/lastName/displayName/company/locale/timezone and
     * `customFields`. Applied to the contact when the address is confirmed, and only where the contact
     * has no value yet (never overwritten). Small: ~2 KB.
     */
    fields?: {
        firstName?: string;
        lastName?: string;
        displayName?: string;
        company?: string;
        locale?: string;
        timezone?: string;
        customFields?: Record<string, string | number | boolean>;
    };
    /** Your app id, recorded with the sent email. */
    appId?: string;
}
export interface CommsSignupResponse {
    ok: true;
    pending: true;
}
export type ConsentChannels = Partial<Record<BroadcastChannel, boolean>>;
type SubjectType = import('./contact.js').SubjectType;
export interface CommsConsentUpsertRequest {
    /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
    contactId?: string;
    channels?: ConsentChannels;
    topics?: Record<string, boolean>;
    topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>;
}
export interface CommsPreferencesUpsertRequest {
    /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
    contactId?: string;
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
    /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
    contactId?: string;
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
    /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
    contactId?: string;
    subjectType: SubjectType;
    subjectId: string;
    productId?: string;
}
export interface CommsSubscriptionCheckResponse {
    ok: true;
    subscribed: boolean;
}
export interface CommsListMethodsQuery {
    /** Optional: defaults to the signed-in user's own contact. Only collection admins may name another contact. */
    contactId?: string;
    type?: BroadcastChannel;
}
/** What `comms.listMethods` returns: the contact's registered methods in `items` (all of them; `nextCursor` is always null). */
export type CommsListMethodsResponse = ListResult<import('./contact.js').CommMethod>;
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
    }>;
    anySubscribed: boolean;
    anyMethods: boolean;
}
/**
 * Send a single message to one contact using a template.
 * No broadcast record is created; the send is logged directly to the
 * contact's communication history with sourceType: 'transactional'.
 *
 * POST /admin/collection/:collectionId/comm/send
 */
export interface TransactionalSendRequest {
    /** CRM contact UUID */
    contactId: string;
    /** A saved template's id. Give this or `message`. */
    templateId?: string;
    /**
     * A typed message instead of a template: plain text, Liquid allowed (`{{ contact.firstName }}`).
     * `sms` is the shorter text for SMS and WhatsApp (defaults to `body`).
     */
    message?: TypedMessage;
    /**
     * Channel to send on. Defaults to 'preferred', which auto-selects the
     * contact's best available channel respecting consent, suppression, and
      * template availability.
     */
    channel?: 'email' | 'sms' | 'whatsapp' | 'push' | 'wallet' | 'preferred';
    /** Extra Liquid variables merged into the top-level render context */
    props?: Record<string, unknown>;
    /** Context objects to hydrate into the Liquid template */
    include?: {
        /** Hydrate {{ collection }}. Default: true */
        collection?: boolean;
        /** Hydrate {{ product }} from this product ID */
        productId?: string;
        /** Hydrate {{ proof }} (requires productId) */
        proofId?: string;
        /** Hydrate {{ user }} from contact.userId */
        user?: boolean;
        /** Hydrate {{ appCase }} from this case UUID */
        appCase?: string;
        /** Hydrate {{ appThread }} from this thread UUID */
        appThread?: string;
        /** Hydrate {{ appRecord }} from this record UUID */
        appRecord?: string;
    };
    /** Arbitrary label stored on the comms-events row (e.g. 'warranty-step-2') */
    ref?: string;
    /** App context stored on the comms-events row */
    appId?: string;
    /**
     * What the message is about: the record it was sent for and the admin screen that shows it, so it is a
     * link in Messages, on the contact's Activity, and on the conversation a reply opens. `appId` defaults
     * to the sending app.
     */
    about?: MessageAbout;
    /**
     * `'service'` (a confirmation, a reminder, an update): an asked-for channel the person turned off, or a
     * suppressed email, is refused (`transactional.opted_out`). Marketing goes out as a campaign.
     */
    category?: 'service';
    /**
     * Files to attach (email only; at most 5, 10 MB in all). What can't be made is left out and listed in
     * `attachmentsLeftOut` — the email still goes.
     */
    attach?: EmailAttachmentSpec[];
}
/**
 * One file for an email:
 * - `'calendar'` — the booking's `.ics` calendar invite (needs `include.booking` and `appId`)
 * - `{ asset }` — a file uploaded to this collection's assets
 * - `{ function }` — the app's (`appId`) own server function makes it (see server-functions.md, "Making an email attachment")
 * - `{ filename, contentType, content }` — a file you made, base64 (PDF, Office documents, images, text, CSV, calendar)
 * - `{ filename, file }` — a private file you made (e.g. `pdf.create` with `return: 'signedUrl'`)
 */
export type EmailAttachmentSpec = 'calendar' | {
    asset: string;
} | {
    function: string;
} | {
    filename: string;
    contentType: string;
    content: string;
} | {
    filename: string;
    contentType?: string;
    file: string;
};
export interface TransactionalSendResponse {
    ok: true;
    /** The channel the message was actually sent on */
    channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'wallet';
    /** Provider message ID (email/SMS/WhatsApp); absent for push/wallet */
    messageId?: string;
    /** Attachments that couldn't be made, and why (the email went without them) */
    attachmentsLeftOut?: string[];
}
/** A message written there and then rather than a saved template. */
export interface TypedMessage {
    subject?: string;
    body: string;
    /** The shorter text for SMS and WhatsApp (defaults to `body`). */
    sms?: string;
}
/**
 * What a message is about (docs/comms.md, "What a message is about"). Ids only, never content.
 * `view` and `params` name one of the app's admin views (manifest `adminViews`, docs/admin-views.md).
 */
export interface MessageAbout {
    appId?: string;
    /** What kind of record: `'booking'`, `'entry'`, `'case'`. */
    type: string;
    id: string;
    view?: string;
    params?: Record<string, string>;
    /** A short label to show without looking the record up: `'Sat 3pm, table for 4'`. */
    label?: string;
}
export interface TransactionalSendError {
    ok: false;
    /**
     * Error code. Known values:
     * - `transactional.contact_not_found`
     * - `transactional.template_not_found`
     * - `transactional.no_channel_available`
     * - `transactional.email_missing`
     * - `transactional.phone_missing`
     * - `transactional.whatsapp_missing`
     * - `transactional.no_push_methods`
     * - `transactional.no_wallet_passes` (`channel: 'wallet'`: the person has no wallet passes from this app)
     * - `transactional.opted_out` (category `'service'`: the person turned that channel off, or the email is suppressed)
     * - `transactional.template_or_message` / `transactional.message_invalid` / `transactional.about_invalid`
     */
    error: string;
}
export type TransactionalSendResult = TransactionalSendResponse | TransactionalSendError;
export {};
