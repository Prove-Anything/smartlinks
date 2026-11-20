import type { AddressFront, AddressNameAvailability, AddressResponse, AppPageLink } from "../types/address.js";
/**
 * The business's address in one place (admin): its name, what its front page shows, and its apps' pages
 * under `/_apps/<name>/` (prove docs/design/business-address.md, app-page-addresses.md). Changes reach
 * visitors within about a minute.
 */
export declare namespace address {
    /**
     * Where an app's public page is, on the business's own address. Public: use it from the app's admin
     * ("Open the game") and from share buttons, instead of building the CDN address by hand. Add the app's
     * own route to it: `${link.url}#/play`. The page carries no collectionId or appId: the address says it.
     * Resolves null when the app has no page on that collection (not installed, or a connector).
     *
     * @example
     * const link = await SL.address.page(collectionId, appId)
     * window.open(`${link?.url ?? fallback}#/play`, '_blank')
     */
    function page(collectionId: string, appId: string): Promise<AppPageLink | null>;
    /** Everything about the business's address: name, own domain, front page, websites that can take it, app pages. */
    function get(collectionId: string): Promise<AddressResponse>;
    /** Is this name free? (lower-case letters, numbers and hyphens) */
    function checkName(collectionId: string, name: string): Promise<AddressNameAvailability>;
    /**
     * Choose (or change) the business's name: `<name>.smartlinks.host`. The previous name is released.
     * @throws ErrorResponse 400 BAD_NAME, 409 NAME_TAKEN
     */
    function setName(collectionId: string, name: string): Promise<{
        name: string;
        host: string;
    }>;
    /**
     * What the front page shows. Applies to the business's name, its automatic address and its own domain
     * together. A website must be installed and live; a redirect must be https and not one of its own addresses.
     * @throws ErrorResponse 400 BAD_FRONT | BAD_URL | REDIRECT_LOOP, 404 APP_NOT_INSTALLED, 409 PRODUCTION_ONLY | NOT_A_WEBSITE
     */
    function setFront(collectionId: string, front: AddressFront): Promise<{
        front: AddressFront;
    }>;
    /**
     * Rename an app's page (old names keep redirecting) and/or show it on the holding page.
     * @throws ErrorResponse 400 PAGE_NAME_INVALID, 404 APP_NOT_INSTALLED, 409 PAGE_NAME_TAKEN
     */
    function setPage(collectionId: string, appId: string, change: {
        name?: string;
        listed?: boolean;
    }): Promise<{
        name?: string;
        listed?: boolean;
    }>;
}
