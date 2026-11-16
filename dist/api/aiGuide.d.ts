import { startLive, type LiveHandle, type LiveOptions, type LiveState, type LiveToolHandler, type LiveMintReply, type LiveEvent } from '../live.js';
export type GuideSurface = 'portal' | 'hub';
/** What a page may know about a business's guide before starting one. */
export interface GuideInfo {
    enabled: boolean;
    name?: string;
    modes?: {
        voice: boolean;
        text: boolean;
        start: 'voice' | 'text';
    };
    suggestions?: string[];
    handoff?: {
        kind: 'email' | 'phone' | 'url';
        value: string;
    } | null;
}
/** What is on the visitor's screen, in words. */
export interface ScreenContent {
    appId?: string | null;
    title?: string | null;
    content?: string | null;
}
/** Where the visitor is: the app on screen and the page in it (as the host's deep link). */
export interface GuideWhere {
    appId?: string | null;
    path?: string | null;
    params?: Record<string, string>;
}
/** A page the guide opened (the host moves the app there). */
export interface GuideNavigate {
    appId: string;
    path: string;
    params?: Record<string, string>;
}
/** Products the guide found, for the screen: each row can take the visitor there. */
export interface GuideCard {
    title: string;
    rows: Array<{
        title: string;
        detail?: string | null;
        goTo?: string;
    }>;
    more?: number;
}
export interface GuideStartOptions {
    surface: GuideSurface;
    mode?: 'voice' | 'text';
    productId?: string | null;
    proofId?: string | null;
    /** The apps on the visitor's page: the guide reads their pages and may open them. A core app says so. */
    apps?: Array<{
        id: string;
        title: string;
        kind?: 'core' | 'app';
        channel?: string;
    }>;
    /** Where the visitor is when the conversation starts. Later, tell it with handle.note(). */
    where?: GuideWhere;
    /** The visitor's language (e.g. 'fr'); default: theirs as the browser says. */
    language?: string;
    /** What's on screen when the conversation starts. Later, the guide asks with read_screen. */
    screen?: ScreenContent;
    /** Read the screen now (the guide's read_screen tool). Default: ask the app on screen (ai.content.request). */
    readScreen?: () => Promise<ScreenContent | null> | ScreenContent | null;
    /** Open one of the business's apps at its start (the guide's show_app tool). */
    showApp?: (appId: string) => Promise<void> | void;
    /** Open a page of an app (the guide's open_page tool: SmartLinks resolves the page's address). */
    openPage?: (to: GuideNavigate) => Promise<void> | void;
    /** Go to another product's page (the guide's go_to tool). */
    goTo?: (productId: string) => Promise<void> | void;
    /** Products the guide found, to show (each row can call goTo). */
    onShow?: (card: GuideCard) => void;
    /** Show how to reach a person (the guide's offer_person tool). */
    offerPerson?: (handoff: GuideInfo['handoff']) => Promise<void> | void;
    onState?: (s: LiveState) => void;
    onCaption?: (text: string) => void;
    onReply?: (text: string) => void;
    onError?: (message: string) => void;
    /** The visitor turned the microphone off or on (handle.mute / unmute). */
    onMuted?: (muted: boolean) => void;
}
export declare namespace guide {
    /** Is the guide on for this surface, and how does it present itself? */
    function get(collectionId: string, surface?: GuideSurface): Promise<GuideInfo>;
    /** Start a live conversation with the guide. Resolves once connected; the handle pauses, stops, sends text. */
    function start(collectionId: string, options: GuideStartOptions): Promise<LiveHandle>;
}
type ContentHandler = (ctx: {
    reason?: string;
}) => Promise<ScreenContent | null> | ScreenContent | null;
export declare namespace content {
    /**
     * An app says what its screen shows, in words (an exhibit's text, a recipe, a form's purpose). Called
     * whenever an assistant needs it. Works in an iframe (the host asks by message) and in the same page
     * (a direct component). Returns a function that stops providing.
     */
    function provide(handler: ContentHandler): () => void;
    /**
     * A host asks what the app on screen shows: an app in an iframe (pass its window as `frame`), or apps in
     * this page that called `provide`. Resolves null if nothing answers within the time.
     */
    function request(options?: {
        frame?: Window | null;
        reason?: string;
        timeoutMs?: number;
    }): Promise<ScreenContent | null>;
}
export { startLive };
export type { LiveHandle, LiveState, LiveOptions, LiveToolHandler, LiveMintReply, LiveEvent };
