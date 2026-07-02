import { AssetRef } from "./asset";
/**
 * Represents a Collection object.
 */
export interface Collection {
    /** Unique identifier for the collection */
    id: string;
    /** Human-readable title of the collection */
    title: string;
    /** Description of collection */
    description: string;
    /** Slim reference to the collection's header/hero image */
    headerImage?: AssetRef | null;
    /** Slim reference to the collection's logo image */
    logoImage?: AssetRef | null;
    /** Collection's loader image */
    loaderImage?: {
        /** Override name for the file */
        overwriteName: string;
        /** Name of the asset */
        name: string;
        /** File type/extension */
        type: string;
        /** URL to the asset */
        url: string;
    };
    /** Array of supported languages */
    languages?: {
        /** Language code (e.g., "fr", "it", "es") */
        code: string;
        /** Human-readable language name (e.g., "French", "Italian") */
        lang: string;
        /** Whether this language is supported */
        supported: boolean;
    }[];
    /** User roles mapping with user IDs as keys and role names as values */
    roles: {
        [userId: string]: string;
    };
    /** Array of group tag names */
    groupTags?: string[];
    /** Whether the collection has a custom domain */
    redirectUrl?: string;
    /** The claimed Hub subdomain prefix (e.g. "acme" → acme.mysmartlinks.app) */
    hubName?: string;
    /** The collection's bring-your-own custom Hub domain (e.g. "hub.acme.com") */
    hubCustomDomain?: string;
    /** The shortId of this collection */
    shortId: string;
    /** if dark mode is enabled for this collection */
    dark?: boolean;
    /** Primary theme color */
    primaryColor?: string;
    /** Secondary theme color */
    secondaryColor?: string;
    portalUrl?: string;
    /** Allow users to claim products without providing a proof ID (auto-generates serial on-demand) */
    allowAutoGenerateClaims?: boolean;
    variants: boolean;
    batches: boolean;
    defaultAuthKitId: string;
}
export type CollectionResponse = Collection;
export type CollectionCreateRequest = Omit<Collection, 'id' | 'shortId'>;
export type CollectionUpdateRequest = Partial<Omit<Collection, 'id' | 'shortId'>>;
/**
 * Which load balancer / certificate map a custom domain registration targets.
 * - `"smartlinks"` (default): the id.smartlinks.app load balancer (legacy behaviour)
 * - `"hub"`: the SmartLinks Hub load balancer
 */
export type DomainTarget = "smartlinks" | "hub";
/**
 * Response from checking whether a Hub subdomain name is available.
 */
export interface HubAvailabilityResponse {
    /** Whether the name can be claimed by this collection */
    available: boolean;
    /** The full domain that was checked (e.g. "acme.mysmartlinks.app") */
    domain: string;
}
/**
 * Configuration for an app module within a collection.
 */
export interface AppConfig {
    /** Unique identifier for the app */
    id: string;
    /** Underling app module id */
    srcAppId: string;
    /** Display name of the app */
    name: string;
    /** Optional description of the app */
    description?: string;
    /** Optional icon for the app */
    faIcon?: string;
    /** app category */
    category: "Authenticity" | "Documentation" | "Commerce" | "Engagement" | "AI" | "Digital Product Passports" | "Integration" | "Web3" | "Other";
    /** Whether the app is enabled for this collection */
    active?: boolean;
    /** Whether the app is only accessible to owners */
    ownersOnly?: boolean;
    /** Whether the app is hidden in the UI */
    hidden?: boolean;
    /** Universal iframe URL for external embedding */
    publicIframeUrl?: string;
    /** Where to get the app manifest for AI and widget definitions */
    manifestUrl?: string;
    /** supports multiple pages / deep links into the app */
    supportsDeepLinks?: boolean;
    /** App component configuration */
    usage: {
        collection: boolean;
        product: boolean;
        proof: boolean;
        widget: boolean;
    };
    directComponent: boolean;
    [key: string]: any;
}
/**
 * Response containing app configurations for a collection.
 */
export interface AppsConfigResponse {
    /** Array of app configurations */
    apps: AppConfig[];
}
