/**
 * Represents a Collection object.
 */
export interface CollectionResponse {
    /** Unique identifier for the collection */
    id: string;
    /** Human-readable title of the collection */
    title: string;
    /** Description of collection */
    description: string;
    /** URL to the collection's larger header/hero image */
    headerImage?: {
        /** URL to the asset */
        url: string;
        /** Thumbnail URLs in different sizes */
        thumbnails: {
            x100: string;
            x200: string;
            x512: string;
        };
    };
    /** URL to the collection's logo image */
    logoImage?: {
        /** URL to the asset */
        url: string;
        /** Thumbnail URLs in different sizes */
        thumbnails: {
            x100: string;
            x200: string;
            x512: string;
        };
    };
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
    /** The shortId of this collection */
    shortId: string;
    /** if dark mode is enabled for this collection */
    dark?: boolean;
}
