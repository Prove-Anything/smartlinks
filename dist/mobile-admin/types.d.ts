import type { NativeFacade } from '../native/types';
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
export type AdminMobileEvent = {
    type: 'nfc-tap';
    uid: string;
    ndef?: string;
} | {
    type: 'rfid-burst';
    epcs: string[];
} | {
    type: 'qr-scan';
    code: string;
} | {
    type: 'key-press';
    keyCode: number;
} | {
    type: 'lifecycle';
    phase: 'pause' | 'resume' | 'offline' | 'online';
};
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
    SL: typeof import('../index');
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
         * Open the QR scanner UI and resolve with the decoded string.
         * Throws `HostCapabilityUnavailableError` if `'qr'` is not in `capabilities`.
         * Throws `HostTimeoutError` if the user dismisses without scanning.
         */
        requestQrScan: () => Promise<string>;
        /**
         * Await the next NFC tap and resolve with uid + optional NDEF payload.
         * @param timeoutMs - Milliseconds before `HostTimeoutError` is thrown (host default if omitted).
         */
        requestNfcTap: (timeoutMs?: number) => Promise<{
            uid: string;
            ndef?: string;
        }>;
        /**
         * Open the camera shutter once and resolve with the captured `Blob`.
         * Throws `HostCapabilityUnavailableError` if `'camera'` is not in `capabilities`.
         */
        requestCameraPhoto: () => Promise<Blob>;
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
