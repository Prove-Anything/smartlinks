export type LiveState = 'idle' | 'connecting' | 'listening' | 'hearing' | 'thinking' | 'speaking' | 'paused' | 'error';
export type LiveToolHandler = (args: Record<string, unknown>) => Promise<unknown> | unknown;
/** What SmartLinks returns when it mints a live session. */
export interface LiveMintReply {
    clientSecret: string;
    expiresAt?: number | null;
    model: string;
    voice?: string | null;
    tools: Array<{
        name: string;
        runs: 'screen' | 'server';
    }>;
    sessionId: string;
    mode?: 'voice' | 'text';
    [key: string]: unknown;
}
/** A server tool's answer: `result` goes back to the assistant; anything else is for the page. */
export interface LiveToolReply {
    result?: unknown;
    [key: string]: unknown;
}
export interface LiveEvent {
    kind: 'tool' | 'error' | 'start' | 'stop' | 'reply' | 'pause' | 'resume' | 'handoff';
    sessionId?: string | null;
    tool?: string;
    where?: 'screen' | 'server';
    ms?: number;
    ok?: boolean;
    error?: string;
    detail?: string;
    build?: string;
}
export interface LiveEndpoints {
    /** Mint the session (instructions and tools are fixed on the key by SmartLinks). */
    mint: () => Promise<LiveMintReply>;
    /** Run one server tool. */
    tool: (name: string, args: Record<string, unknown>, sessionId: string | null) => Promise<LiveToolReply>;
    /** Log what happened here, into SmartLinks' logs. Fire and forget. */
    event?: (event: LiveEvent) => void;
}
export interface LiveOptions {
    endpoints: LiveEndpoints;
    /** 'voice' (default) or 'text'. Text: no microphone, `send` to say something, answers come as captions. */
    mode?: 'voice' | 'text';
    /** The tools that run in the page (open a screen, read it). Everything else runs in SmartLinks. */
    screenTools?: Record<string, LiveToolHandler>;
    onState?: (s: LiveState) => void;
    /** What the assistant is saying or writing, as it goes (replaces the previous caption each turn). */
    onCaption?: (text: string) => void;
    /** A whole reply, once finished. */
    onReply?: (text: string) => void;
    /** A server tool's reply, for the page to act on (cards, screens to open…). */
    onToolReply?: (name: string, reply: LiveToolReply) => void | Promise<void>;
    onError?: (message: string) => void;
    /** The microphone was muted or unmuted (mute / unmute). */
    onMuted?: (muted: boolean) => void;
    /** Names this client in the logs. */
    build?: string;
}
export interface LiveHandle {
    stop: () => void;
    /** Stop listening and speaking without ending the session; anything it would say waits for `resume`. */
    pause: () => void;
    resume: () => void;
    /** Stop listening, and only that: the assistant finishes what it is saying, keeps working, and still speaks. */
    mute: () => void;
    unmute: () => void;
    muted: () => boolean;
    /** Stop the sentence it is saying now; it keeps listening. */
    hush: () => void;
    /** Text mode (or voice): give the assistant the person's words and have it answer. */
    send: (text: string) => void;
    /** Tell the assistant something that happened in the page, and have it answer. */
    tell: (what: string) => void;
    /** Give the assistant a message as it is, and have it answer. */
    report: (text: string) => void;
    /** Let the assistant know something without asking it to answer (where the person is now). */
    note: (what: string) => void;
    /** Run one of this session's server tools directly. */
    ask: (name: string, args: Record<string, unknown>) => Promise<unknown>;
    /** The SmartLinks session id (where its history is kept). */
    session: () => string | null;
    state: () => LiveState;
    /** 0..1, how loud the person (listening) or the assistant (speaking) is right now. */
    level: () => number;
}
/** Start a live conversation. Resolves once connected (or failed: then it is stopped and onError was told). */
export declare function startLive(opts: LiveOptions): Promise<LiveHandle>;
