import type { AppDataDeclaration, AppDataType, AppHeadlessDeclaration } from './types/headless.js';
export interface HeadlessIssue {
    /** Where: e.g. `headless.purpose`, `data.types.faq.item.fields.answer`. */
    path: string;
    message: string;
}
export interface HeadlessValidation {
    ok: boolean;
    errors: HeadlessIssue[];
    warnings: HeadlessIssue[];
    /**
     * The read recipe for each type: the declared one, else the standard one for its storage — plus what
     * the call returns and where an item's fields are. Those two always come from the storage kind (the
     * platform's response shape), never from the app, so a custom recipe can't leave them out.
     */
    recipes: Record<string, {
        list: string;
        get?: string;
        returns: string;
        item: string;
    }>;
}
/**
 * What a type's read calls return, and where one item's declared fields live — fixed by the storage
 * kind (see app-objects.md "Paginated List Responses"). Sites must read items from `response.data`.
 */
export declare function responseShape(type: AppDataType): {
    returns: string;
    item: string;
};
/** The standard SDK read calls for a type, from how it's stored. `appId` / `collectionId` are the caller's variables. */
export declare function standardRecipe(type: AppDataType): {
    list: string;
    get?: string;
};
export interface ValidateOptions {
    /** Real items per type id (each item's `data` zone JSON), e.g. sampled from a test collection. */
    samples?: Record<string, Array<Record<string, unknown>>>;
}
/** Validate a manifest's `data` + `headless` blocks. */
export declare function validate(manifest: {
    data?: AppDataDeclaration;
    headless?: AppHeadlessDeclaration;
    [k: string]: any;
}, opts?: ValidateOptions): HeadlessValidation;
