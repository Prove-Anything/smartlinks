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
export class HostCapabilityUnavailableError extends Error {
  /** The capability that was requested but is unavailable. */
  capability: ActionableCapability;
  /** The host on which the capability is unavailable. */
  host: AdminMobileHostId;

  constructor(capability: ActionableCapability, host: AdminMobileHostId) {
    super(`Capability '${capability}' is unavailable on host '${host}'`);
    this.name = 'HostCapabilityUnavailableError';
    this.capability = capability;
    this.host = host;
    Object.setPrototypeOf(this, new.target.prototype);
  }
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
export class HostPermissionDeniedError extends Error {
  /** The capability for which permission was denied. */
  capability: ActionableCapability;

  constructor(capability: ActionableCapability) {
    super(`Permission denied for capability '${capability}'`);
    this.name = 'HostPermissionDeniedError';
    this.capability = capability;
    Object.setPrototypeOf(this, new.target.prototype);
  }
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
export class HostTimeoutError extends Error {
  /** The capability that timed out. */
  capability: Extract<ActionableCapability, 'nfc' | 'qr' | 'rfid' | 'geolocation'>;
  /** The timeout threshold in milliseconds. */
  timeoutMs: number;

  constructor(capability: HostTimeoutError['capability'], timeoutMs: number) {
    super(`Capability '${capability}' timed out after ${timeoutMs}ms`);
    this.name = 'HostTimeoutError';
    this.capability = capability;
    this.timeoutMs = timeoutMs;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a host action ends without a result because someone stopped it: the user closed the
 * scanner / pressed Cancel on the "tap a tag" hint (`by: 'user'`), or the container aborted it with its
 * `signal` or replaced it with a newer request (`by: 'app'`). Usually not an error to show — the user
 * chose to stop.
 *
 * @example
 *   try {
 *     const code = await host.actions.requestQrScan();
 *   } catch (err) {
 *     if (err instanceof HostCancelledError) return; // they closed the scanner
 *     throw err;
 *   }
 */
export class HostCancelledError extends Error {
  /** The capability whose action was cancelled. */
  capability: ActionableCapability;
  /** Who stopped it. */
  by: 'user' | 'app';

  constructor(capability: ActionableCapability, by: 'user' | 'app' = 'user') {
    super(`Capability '${capability}' was cancelled by the ${by}`);
    this.name = 'HostCancelledError';
    this.capability = capability;
    this.by = by;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
