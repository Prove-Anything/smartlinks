/**
 * Structured errors thrown by `AdminMobileHostContext.actions`.
 * Catch these by name or with `instanceof` to give users actionable feedback.
 *
 * All three classes call `Object.setPrototypeOf(this, new.target.prototype)` so
 * `instanceof` works correctly when transpiled to ES5.
 */
import type { ActionableCapability, AdminMobileHostId } from './types';
/**
 * Thrown when a container requests a hardware action that the current host
 * does not support (e.g. calling `requestNfcTap` on a `'pwa'` host).
 *
 * @example
 *   try {
 *     const uid = await host.actions.requestNfcTap();
 *   } catch (err) {
 *     if (err instanceof HostCapabilityUnavailableError) {
 *       host.ui.toast?.({ title: `NFC not available on this device`, variant: 'destructive' });
 *     }
 *   }
 */
export declare class HostCapabilityUnavailableError extends Error {
    /** The capability that was requested but is unavailable. */
    capability: ActionableCapability;
    /** The host on which the capability is unavailable. */
    host: AdminMobileHostId;
    constructor(capability: ActionableCapability, host: AdminMobileHostId);
}
/**
 * Thrown when the user denies a runtime permission request (e.g. camera or
 * NFC access) during a host action.
 *
 * @example
 *   try {
 *     const photo = await host.actions.requestCameraPhoto();
 *   } catch (err) {
 *     if (err instanceof HostPermissionDeniedError) {
 *       host.ui.toast?.({ title: 'Camera permission denied', variant: 'destructive' });
 *     }
 *   }
 */
export declare class HostPermissionDeniedError extends Error {
    /** The capability for which permission was denied. */
    capability: ActionableCapability;
    constructor(capability: ActionableCapability);
}
/**
 * Thrown when a time-bounded host action (NFC tap, QR scan) exceeds its
 * allowed duration.
 *
 * @example
 *   try {
 *     const { uid } = await host.actions.requestNfcTap(5000);
 *   } catch (err) {
 *     if (err instanceof HostTimeoutError) {
 *       console.warn(`Timed out after ${err.timeoutMs}ms`);
 *     }
 *   }
 */
export declare class HostTimeoutError extends Error {
    /** The capability that timed out. */
    capability: Extract<ActionableCapability, 'nfc' | 'qr' | 'geolocation'>;
    /** The timeout threshold in milliseconds. */
    timeoutMs: number;
    constructor(capability: HostTimeoutError['capability'], timeoutMs: number);
}
