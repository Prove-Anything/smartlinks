/**
 * Contract types for the `SL.native` / `host.native` facade.
 *
 * These are **interface-only** — no runtime implementation lives here.
 * The facade is implemented per-host (Sidekick, Capacitor builds, PWA) and
 * exposed to containers via `AdminMobileHostContext.native` or (for UMD
 * microapps) via `window.SL.native`. The SDK owns the shape; the host owns
 * the wiring.
 *
 * All facade methods reject with one of the structured errors from
 * `@proveanything/smartlinks` (`HostCapabilityUnavailableError`,
 * `HostPermissionDeniedError`, `HostTimeoutError`) so a single catch handler
 * covers every host and capability.
 */
/**
 * Keys of the `NativeFacade` interface — one token per sub-facade.
 * Use `hasCapability(key)` on the host to check availability before calling.
 */
export type NativeCapability = 'share' | 'clipboard' | 'haptics' | 'network' | 'device' | 'storage' | 'qr' | 'auth' | 'nfc' | 'rfid' | 'events' | 'webSource';
/** Share sheet / URL sharing. */
export interface ShareFacade {
    /**
     * Trigger the native share sheet.
     * Falls back to `navigator.share`, then silently copies `url` to clipboard.
     */
    share(payload: {
        title: string;
        url: string;
        text?: string;
    }): Promise<void>;
    /** Returns `true` when a share sheet is available on this host. */
    canShare(): Promise<boolean>;
}
/** Clipboard read / write. */
export interface ClipboardFacade {
    /** Write plain text to the clipboard. */
    write(text: string): Promise<void>;
    /** Read plain text from the clipboard. Returns `''` if empty or denied. */
    read(): Promise<string>;
}
/** Haptic feedback. */
export type HapticImpactStyle = 'light' | 'medium' | 'heavy';
export type HapticNotificationStyle = 'success' | 'warning' | 'error';
export interface HapticsFacade {
    /** Physical impact pulse. Falls back to `navigator.vibrate`. */
    impact(style?: HapticImpactStyle): Promise<void>;
    /** Notification-style feedback. Falls back to `navigator.vibrate`. */
    notification(style: HapticNotificationStyle): Promise<void>;
    /** Selection-changed feedback. No-op when unsupported. */
    selection(): Promise<void>;
}
/** Network status. */
export interface NetworkStatus {
    connected: boolean;
    connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
}
export interface NetworkFacade {
    /** Returns current connection status. */
    getStatus(): Promise<NetworkStatus>;
    /**
     * Subscribe to connectivity changes. Returns an unsubscribe function.
     * Falls back to `window` `'online'`/`'offline'` events on web.
     */
    addListener(event: 'change', cb: (status: NetworkStatus) => void): () => void;
}
/** Device metadata. */
export interface DeviceInfo {
    model: string;
    platform: 'ios' | 'android' | 'web';
    osVersion: string;
    manufacturer: string;
    isVirtual: boolean;
}
export interface DeviceFacade {
    /** Hardware and OS metadata. */
    getInfo(): Promise<DeviceInfo>;
    /**
     * Stable device identifier — UUID persisted in `@capacitor/preferences`
     * (native) or `localStorage` (web).
     */
    getId(): Promise<{
        identifier: string;
    }>;
    /** Current locale language code, e.g. `'en'`, `'fr'`. */
    getLanguageCode(): Promise<{
        value: string;
    }>;
}
/**
 * Persistent key-value storage.
 * Backed by `@capacitor/preferences` on native; `localStorage` on web;
 * in-memory `Map` in private-browsing / third-party-cookie contexts.
 */
export interface StorageFacade {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
    keys(): Promise<string[]>;
}
/** QR / barcode scan. */
export interface QrScanOptions {
    /** BarcodeFormat strings to restrict scanning (e.g. `['QR_CODE', 'EAN_13']`). */
    formats?: string[];
}
export interface QrFacade {
    /**
     * Open the barcode scanner UI and resolve with the decoded string.
     * Uses Capacitor MLKit on native; html5-qrcode (or `BarcodeDetector`) on web.
     * Throws `HostTimeoutError` when the user dismisses without scanning.
     */
    scan(opts?: QrScanOptions): Promise<string>;
}
/** Authentication. */
export interface AuthFacade {
    /**
     * Initiate Google Sign-In. Returns the raw ID token for exchange with the
     * SmartLinks auth backend. Falls back to an OAuth redirect flow on web.
     */
    signInWithGoogle(): Promise<{
        idToken: string;
    }>;
    signOut(): Promise<void>;
}
/** NFC tag operations. */
export interface NfcReadResult {
    uid: string;
    /** Raw NDEF payload (hex or base64 depending on host), when present. */
    ndef?: string;
}
export interface NfcFacade {
    /**
     * Wait for the next NFC tap and return the tag's UID + optional NDEF.
     * Throws `HostTimeoutError` after `opts.timeoutMs` (default: 30 s).
     */
    read(opts?: {
        timeoutMs?: number;
    }): Promise<NfcReadResult>;
    /** Write an NDEF record to a tag by UID. */
    writeNdef(opts: {
        uid: string;
        payload: string;
    }): Promise<void>;
    /** Program an NTAG 21x / 424 profile. Host-specific; Kotlin only on advanced ops. */
    programTag(opts: {
        uid: string;
        profile: string;
        [key: string]: unknown;
    }): Promise<void>;
    /** Lock a tag against further writes. */
    lockTag(opts: {
        uid: string;
    }): Promise<void>;
    /** Returns whether the tag is currently locked. */
    isLocked(opts: {
        uid: string;
    }): Promise<boolean>;
}
/** RFID mass-scan (UHF). Only available on `custom-android`. */
export interface RfidScanOptions {
    /** Transmission power in dBm. */
    power?: number;
    /** Gen2 session flag (0–3). */
    sessionFlag?: number;
}
export interface RfidFacade {
    /** Start the RFID reader. Throws `HostCapabilityUnavailableError` on non-Kotlin hosts. */
    startScan(opts?: RfidScanOptions): Promise<void>;
    stopScan(): Promise<void>;
    /** Subscribe to EPC bursts. Returns an unsubscribe function. */
    subscribe(cb: (epcs: string[]) => void): () => void;
}
/** Cross-shell event bus. */
export interface EventsFacade {
    /**
     * Subscribe to named events from any of: the Kotlin bridge
     * (`onSmartlinksData`), Capacitor plugin listeners, or internal pub/sub.
     * Returns an unsubscribe function.
     */
    subscribe(type: string, cb: (payload: unknown) => void): () => void;
    /** Publish an event into the same bus. Useful for container ↔ container comms. */
    emit(type: string, payload?: unknown): void;
}
/** OTA / web-source switching. */
export type WebSourceMode = 'live' | 'bundled' | 'channel';
export interface WebSourceConfig {
    mode: WebSourceMode;
    /** Only set when `mode === 'channel'`. */
    channel?: string;
    /** Only set when `mode === 'live'`. */
    liveUrl?: string;
}
export interface WebSourceFacade {
    /** Returns the currently active web source config. */
    get(): Promise<WebSourceConfig>;
    /** Switch web source mode. Takes effect on next app boot. */
    set(config: WebSourceConfig): Promise<void>;
}
/**
 * The full native capability facade exposed by the host on
 * `AdminMobileHostContext.native` (containers) and `window.SL.native` (UMD
 * microapps).
 *
 * Each sub-facade is present only when the host implements it. Check
 * `'nfc' in host.native` (or `host.capabilities` for hardware-gated features)
 * before calling.
 *
 * @example
 *   const { native } = host;
 *   if (native?.qr) {
 *     const code = await native.qr.scan();
 *   }
 */
export interface NativeFacade {
    share: ShareFacade;
    clipboard: ClipboardFacade;
    haptics: HapticsFacade;
    network: NetworkFacade;
    device: DeviceFacade;
    /** Cross-host persistent storage (`@capacitor/preferences` / `localStorage` fallback). */
    storage: StorageFacade;
    qr: QrFacade;
    auth: AuthFacade;
    nfc: NfcFacade;
    /** RFID mass-scan. Only populated on `custom-android` hosts. */
    rfid?: RfidFacade;
    events: EventsFacade;
    webSource: WebSourceFacade;
}
