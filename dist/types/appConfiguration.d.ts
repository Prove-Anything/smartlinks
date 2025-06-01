/**
 * Represents an App Configuration object.
 */
export interface AppConfigurationResponse {
    /** Unique identifier for the app configuration */
    id: string;
    /** Name of the app configuration */
    name: string;
    /** Key-value pairs representing configuration settings */
    settings?: Record<string, any>;
}
