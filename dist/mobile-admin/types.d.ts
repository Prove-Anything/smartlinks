import type { NativeFacade } from '../native/types.js';
/**
 * Hardware/software capability tokens a mobile admin host may advertise.
 * Passed to `AdminMobileHostContext.capabilities` and to
 * `AdminMobileComponentManifest.capabilities`.
 */
export type AdminMobileCapability = 'nfc' | 'nfc-advanced' | 'rfid' | 'qr' | 'camera' | 'keyboard' | 'geolocation' | 'push';
/**
 * Subset of `AdminMobileCapability` that can be the subject of a structured
 * error. `'keyboard'` is excluded — it is a passive event source with no
 * request method that can fail.
 */
export type ActionableCapability = Exclude<AdminMobileCapability, 'keyboard'>;
/**
 * Canonical identifiers for mobile admin host environments.
 * Use for display / diagnostics only — feature-detect at runtime via
 * `AdminMobileHostContext.capabilities` and `'method' in host.actions`.
 */
export type AdminMobileHostId = 'custom-android' | 'capacitor-ios' | 'capacitor-android' | 'pwa' | 'browser';
/**
 * Discriminated-union of all events the host may emit via
 * `AdminMobileHostContext.events.subscribe`.
 */
export type AdminMobileEvent = 
/**
 * A tag was tapped while NO `requestNfcTap()` was waiting (a waiting request takes the tap instead).
 * `uid` is uppercase hex without separators (e.g. `04A1B2C3D4E5F6`); `ndef` is the tag's NDEF text
 * (usually its URL), `""` when the tag had none or it couldn't be read.
 */
{
    type: 'nfc-tap';
    uid: string;
    ndef?: string;
    timestamp?: number;
}
/**
 * RFID reads while the reader is running. Hosts deliver reads as they come — typically ONE EPC per
 * event, many per second while the trigger is held — so collect and de-duplicate them yourself.
 * `rssi` (dBm, negative; closer = higher) is the signal strength of the read when known.
 */
 | {
    type: 'rfid-burst';
    epcs: string[];
    rssi?: number;
    timestamp?: number;
} | {
    type: 'qr-scan';
    code: string;
    timestamp?: number;
}
/**
 * A hardware key. Hosts that report both edges send `action: 'down'` then `'up'` for one press —
 * act on `'down'` (or on events with no `action`, from hosts that report presses only).
 * 293 is the handheld scan trigger.
 */
 | {
    type: 'key-press';
    keyCode: number;
    action?: 'down' | 'up';
    timestamp?: number;
} | {
    type: 'lifecycle';
    phase: 'pause' | 'resume' | 'offline' | 'online';
    timestamp?: number;
};
/**
 * Options for `host.actions.requestNfcTap`.
 *
 * The request is NON-BLOCKING: it only waits for a tag. Keep the screen usable while it waits (e.g.
 * offer "enter the code instead") and abort the wait with `signal` if the user goes another way.
 */
export interface NfcTapRequestOptions {
    /** Give up after this long with `HostTimeoutError`. Default: wait until tapped or aborted. */
    timeoutMs?: number;
    /** Abort the wait (rejects with `HostCancelledError`, `by: 'app'`). */
    signal?: AbortSignal;
    /** Short hint the host shows while waiting, e.g. "Tap the bottle's tag". Host default if omitted. */
    prompt?: string;
}
/** Options for `host.actions.requestQrScan`. */
export interface QrScanRequestOptions {
    /** Close the scanner (rejects with `HostCancelledError`, `by: 'app'`). */
    signal?: AbortSignal;
    /** Fraction of the screen the camera view covers, from the bottom (0.3–1). Default 1 (full screen). */
    heightPercent?: number;
    /** Short hint shown over the camera view. */
    prompt?: string;
}
/** One RFID tag read (or, when batched, one tag's reads within the batch). */
export interface RfidRead {
    /** The tag's EPC, uppercase hex. */
    epc: string;
    /** Manufacturer-burned tag ID, when the reader reports it. */
    tid?: string;
    /** Signal strength in dBm (negative; closer = higher). Best (highest) in the batch. */
    rssi?: number;
    /** When it was (last) read, ms since epoch. */
    timestamp: number;
    /** How many times this tag was read in the batch. */
    count: number;
}
/** The reader as the host sees it. */
export interface RfidReaderStatus {
    /** A UHF reader is selected on this device. */
    available: boolean;
    /** It's connected and ready (a Bluetooth reader may be available but not connected). */
    connected: boolean;
    /** Which reader: the device's built-in one or an external one. */
    reader: 'built-in' | 'zebra' | 'tsl' | 'other' | null;
    /** The reader is reading right now. */
    reading: boolean;
    /** Transmit power, when the reader supports changing it. */
    power?: {
        level: number;
        min: number;
        max: number;
    };
}
/** Which tags a session reports. Reads of any other tag are dropped. */
export interface RfidFilter {
    /** Only these EPCs. */
    epcs?: string[];
    /** Only EPCs starting with this (hex, e.g. your company prefix). */
    prefix?: string;
}
/** Options for `host.rfid.read()`. */
export interface RfidReadOptions {
    filter?: RfidFilter;
    /**
     * `'session'` (default): each tag is reported once per session. `{ windowMs }`: again only after it
     * hasn't been read for that long. `'none'`: every read.
     */
    dedupe?: 'session' | 'none' | {
        windowMs: number;
    };
    /** Deliver reads in batches every this many ms (default 250). `0` = each read as it arrives. */
    batchMs?: number;
    /**
     * `'trigger'` (default): the reader runs while the operator holds the handheld's trigger.
     * `'continuous'`: it runs from now until `stop()`.
     */
    mode?: 'trigger' | 'continuous';
    /** Transmit power for this session (see `status().power`); restored afterwards. */
    power?: number;
}
/** A reading session from `host.rfid.read()`. One session at a time: a new one stops the previous. */
export interface RfidReadSession {
    /** Reads, batched per `batchMs`. Returns an unsubscribe function. */
    onRead(cb: (reads: RfidRead[]) => void): () => void;
    /** Distinct tags reported so far. */
    readonly count: number;
    /** Stop reading and end the session. */
    stop(): void;
}
/** Options for `host.rfid.readOne()`. */
export interface RfidReadOneOptions {
    filter?: RfidFilter;
    /** Give up after this long with `HostTimeoutError`. Default: until a tag is read or aborted. */
    timeoutMs?: number;
    /** Abort (rejects with `HostCancelledError`, `by: 'app'`). */
    signal?: AbortSignal;
    /** Short hint the host shows while waiting, e.g. "Pull the trigger over the item". */
    prompt?: string;
    /** `'trigger'` (default) waits for the operator's trigger; `'continuous'` reads straight away. */
    mode?: 'trigger' | 'continuous';
}
/** Options for `host.rfid.locate()`. */
export interface RfidLocateOptions {
    /** The host plays faster beeps and haptics as the tag gets closer (default true). */
    feedback?: boolean;
    /** Transmit power while locating (lower narrows the field when you're close). */
    power?: number;
}
/** How close the hunted tag is, updated several times a second. */
export interface RfidLocateUpdate {
    /** The target tag last read (when hunting several), or null if none read yet. */
    epc: string | null;
    /** 0 (not in range) to 100 (right here), from signal strength and read rate. */
    strength: number;
    /** Latest signal strength in dBm, or null. */
    rssi: number | null;
    /** Reads of the target per second, over the last second. */
    hitsPerSecond: number;
    /** When it was last read, ms since epoch, or null. */
    lastSeen: number | null;
}
/** A locate session from `host.rfid.locate()`. It reads continuously until `stop()`. */
export interface RfidLocateSession {
    onUpdate(cb: (update: RfidLocateUpdate) => void): () => void;
    stop(): void;
}
/**
 * The host's UHF RFID reader — the same reading, single-read and find abilities the host's own scanner
 * uses, for a container to build its own scanning screens. All three run on the one reader: starting
 * any of them ends the one before. Everything stops when the container unmounts.
 */
export interface AdminMobileRfid {
    /** The reader's current state. */
    status(): RfidReaderStatus;
    /** Called whenever the status changes. Returns an unsubscribe function. */
    onStatus(cb: (status: RfidReaderStatus) => void): () => void;
    /** Keep reading tags — a stock take, an intake — de-duplicated and batched. */
    read(opts?: RfidReadOptions): RfidReadSession;
    /**
     * "This step needs a tag": resolve with one tag (the strongest read in the first moment of reading),
     * then stop. The RFID counterpart of `requestNfcTap`.
     */
    readOne(opts?: RfidReadOneOptions): Promise<RfidRead>;
    /** Find one tag (or any of several, e.g. all tags on one item) by signal strength — a Geiger counter. */
    locate(epcs: string | string[], opts?: RfidLocateOptions): RfidLocateSession;
}
/** Options for `host.actions.requestCameraPhoto`. */
export interface CameraPhotoRequestOptions {
    /** Abandon the capture (rejects with `HostCancelledError`, `by: 'app'`). */
    signal?: AbortSignal;
}
/** Callback invoked for every hardware event emitted by the host. */
export type AdminMobileEventCallback = (event: AdminMobileEvent) => void;
/**
 * The full type of `AdminMobileHostContext.events.subscribe` —
 * takes a callback and returns a cleanup function.
 */
export type AdminMobileEventSubscriber = (cb: AdminMobileEventCallback) => () => void;
/**
 * @deprecated Renamed to `AdminMobileEventCallback` in 1.12.
 * Will be removed in a future minor release.
 * @see AdminMobileEventCallback
 */
export type ScannerEventSubscriber = AdminMobileEventCallback;
/**
 * The `host` prop passed to every mobile admin container component.
 *
 * @example
 *   function StockTakeContainer({ host }: { host: AdminMobileHostContext }) {
 *     const SL = host.SL; // Always use this — never import the SDK directly
 *     return <div>...</div>;
 *   }
 */
export interface AdminMobileHostContext {
    /** SmartLinks collection this session is scoped to. */
    collectionId: string;
    /** App owning this container. */
    appId: string;
    /**
     * Currently authenticated admin user, or `null` when unauthenticated.
     */
    user: {
        uid?: string;
        email?: string;
        displayName?: string;
        isAdmin: boolean;
    } | null;
    /**
     * Already-initialised SDK namespace. Containers MUST use this for all API
     * calls — never `import * as SL from '@proveanything/smartlinks'` inside a
     * container, as that would create a second SDK instance.
     */
    SL: typeof import('../index.js');
    /** Capabilities advertised by this host instance. */
    capabilities: AdminMobileCapability[];
    /**
     * Static hardware availability flags.
     * These reflect physical capability, not runtime permission state.
     */
    hardware: {
        nfc: boolean;
        rfid: boolean;
        qr: boolean;
        camera: boolean;
        keyboard: boolean;
    };
    /** Hardware event stream. */
    events: {
        /**
         * Subscribe to hardware events. Returns an unsubscribe function.
         * @param cb - Called for every incoming `AdminMobileEvent`.
         * @returns Cleanup function — call inside `useEffect` return.
         */
        subscribe: (cb: AdminMobileEventCallback) => () => void;
    };
    /** Imperative hardware actions. */
    actions: {
        /**
         * Open the host's camera scanner and resolve with the decoded QR / barcode text. A deliberate
         * action: the scanner covers the screen (or `heightPercent` of it) until a code is read.
         * Rejects with `HostCancelledError` when the user closes the scanner (`by: 'user'`) or `signal`
         * aborts (`by: 'app'`); `HostCapabilityUnavailableError` / `HostPermissionDeniedError` when there's
         * no camera or no permission.
         */
        requestQrScan: (opts?: QrScanRequestOptions) => Promise<string>;
        /**
         * "This step needs a tag": wait for the NEXT NFC tap and resolve with its uid + NDEF.
         *
         * Two ways to use NFC — pick per screen:
         *  - Passive: `host.events` `nfc-tap` fires for every tap, whenever. For "tap anything, any time".
         *  - Active (this): the next tap goes to this request and is NOT also sent as an `nfc-tap` event, so
         *    nothing handles it twice. The host shows a small non-blocking hint (with Cancel) while waiting;
         *    the screen stays usable — abort with `signal` if the user takes another route.
         * Only a tap made AFTER the call counts. One request at a time: a new one cancels the previous
         * (`HostCancelledError`, `by: 'app'`).
         * Rejects with `HostTimeoutError` after `timeoutMs`, `HostCancelledError` on Cancel (`by: 'user'`)
         * or abort (`by: 'app'`), `HostCapabilityUnavailableError` without NFC.
         *
         * A bare number is accepted as `{ timeoutMs }` (the earlier signature).
         */
        requestNfcTap: (opts?: NfcTapRequestOptions | number) => Promise<{
            uid: string;
            ndef?: string;
        }>;
        /**
         * Open the camera once and resolve with the photo as a `Blob`.
         * Rejects with `HostCancelledError` when the user backs out or `signal` aborts;
         * `HostCapabilityUnavailableError` / `HostPermissionDeniedError` without a camera or permission.
         */
        requestCameraPhoto: (opts?: CameraPhotoRequestOptions) => Promise<Blob>;
        /**
         * Trigger the native share sheet.
         * Falls back to clipboard write on hosts that do not implement the Web Share API.
         */
        share: (payload: {
            title: string;
            url: string;
            text?: string;
        }) => Promise<void>;
        /** Clipboard access. */
        clipboard: {
            read: () => Promise<string>;
            write: (text: string) => Promise<void>;
        };
    };
    /**
     * Light-touch UI conveniences provided by the host shell.
     * All methods are optional niceties — containers MUST degrade gracefully
     * when absent (e.g. in Storybook or unit tests). Guard every call:
     *
     * @example
     *   host.ui.toast?.({ title: 'Saved' });
     */
    ui: {
        /** Show a transient status toast. Optional — see interface note. */
        toast?: (opts: {
            title: string;
            description?: string;
            variant?: 'default' | 'destructive';
        }) => void;
        /** Trigger a haptic pulse. Optional — see interface note. */
        haptic?: (style?: 'light' | 'success' | 'error') => void;
        /**
         * Optional — host shell may not provide a managed header
         * (browser tabs, Storybook, desktop views). Guard with `?.`.
         */
        setHeaderTitle?: (title: string | null) => void;
        /**
         * Optional — host shell may not have a native back stack
         * (browser tabs, Storybook, desktop views). Guard with `?.`.
         */
        navigateBack?: () => void;
    };
    /**
     * The UHF RFID reader. Present only on hosts with one (`hardware.rfid`); feature-detect:
     * @example
     *   const session = host.rfid?.read({ filter: { prefix: '3034' } });
     *   session?.onRead((reads) => addToCount(reads));
     */
    rfid?: AdminMobileRfid;
    /** Network connectivity helpers. */
    network: {
        /** Returns whether the device currently has network access. */
        isOnline: () => boolean;
    };
    /** Device information. */
    device: {
        /** Resolves with basic device model/platform metadata. */
        info: () => Promise<{
            model: string;
            platform: string;
        }>;
    };
    /**
     * Host ABI version — informational only.
     * DO NOT branch on this value. Feature-detect at runtime instead:
     * @example
     *   if ('requestNfcTap' in host.actions) { ... }
     */
    _version: number;
    /**
     * Full native capability facade populated by the host at mount time.
     * Not all sub-facades are present on every host — check before calling:
     * @example
     *   const code = await host.native?.qr.scan();
     *   const { identifier } = await host.native?.device.getId() ?? {};
     * For UMD microapps that do not receive a `host` prop, the same object
     * is available at `window.SL.native` (host concern, not SDK).
     */
    native?: NativeFacade;
}
/** Manifest metadata for a single mobile admin container component. */
export interface AdminMobileComponentManifest {
    /** Component export name (matches the export in the bundle). */
    name: string;
    /** Human-readable description shown in the host launcher UI. */
    description: string;
    /**
     * Hardware capabilities this component requires.
     * The host will hide or disable the component when a required capability
     * is absent from `AdminMobileHostContext.capabilities`.
     */
    capabilities?: AdminMobileCapability[];
    /**
     * When `true`, the component handles its own offline state and may be
     * launched without network connectivity.
     * @default false
     */
    offline?: boolean;
}
/**
 * Shape of the `mobileAdmin` key inside `app.manifest.json`.
 * Describes the bundle files and the components it exports.
 */
export interface AdminMobileBundleManifest {
    files: {
        js: {
            /** UMD bundle path (relative to dist root). Used by the custom-android host. */
            umd: string;
            /** ESM bundle path (relative to dist root). Used by Capacitor/PWA hosts. */
            esm: string;
        };
        /** CSS bundle path, or `null` if the component ships no styles. */
        css: string | null;
    };
    components: AdminMobileComponentManifest[];
}
/**
 * @deprecated Renamed to `AdminMobileComponentManifest` in 1.12.
 * @see AdminMobileComponentManifest
 */
export type MobileAdminComponentManifest = AdminMobileComponentManifest;
/**
 * @deprecated Renamed to `AdminMobileBundleManifest` in 1.12.
 * @see AdminMobileBundleManifest
 */
export type MobileAdminBundleManifest = AdminMobileBundleManifest;
