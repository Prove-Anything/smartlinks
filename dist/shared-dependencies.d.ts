/** Current contract revision. Bumped when the entry list or host versions change. */
export declare const SHARED_DEPENDENCY_CONTRACT_VERSION: "v5";
export interface SharedDependency {
    /** Bare import specifier the app writes, e.g. `react-dom/client`. */
    specifier: string;
    /** Window global the host exposes for the UMD (legacy) resolution path. */
    globalName: string;
    /** Minimum version whose API the host guarantees — build against `>=` this, `<=` host. */
    minVersion: string;
    /** Portal-served ESM shim path this specifier maps to in the import map. */
    importMapPath: string;
}
/**
 * Canonical import-map path for a specifier: drop the leading `@` scope marker and
 * turn every `/` into `-`.
 *   'react-dom/client'      -> '/sl-shared/v5/react-dom-client.js'
 *   '@radix-ui/react-slot'  -> '/sl-shared/v5/radix-ui-react-slot.js'
 * Hosts MUST serve shims at these paths so the map the SDK advertises resolves.
 */
export declare function importMapPathFor(specifier: string, version?: string): string;
/** The full shared-dependency contract for {@link SHARED_DEPENDENCY_CONTRACT_VERSION}. */
export declare const SHARED_DEPENDENCIES: readonly SharedDependency[];
/** Just the bare specifiers — handy for a bundler `external` list. */
export declare const SHARED_DEPENDENCY_SPECIFIERS: readonly string[];
/** What a host advertises at runtime so apps can detect the live contract. */
export interface HostSharedDependencies {
    version: string;
    specifiers: string[];
}
/**
 * Read the shared-dependency contract the current host advertises at runtime
 * (via `window.__SMARTLINKS_SHARED__`). Returns `null` when there is no host
 * marker — e.g. an older portal, or the bundle running outside a portal — so an
 * app can degrade gracefully or fail with an actionable message instead of a
 * bare-specifier resolution crash.
 */
export declare function getHostSharedDependencies(): HostSharedDependencies | null;
