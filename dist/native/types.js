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
export {};
