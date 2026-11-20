import { request, post } from "../http.js";
/**
 * The business's address in one place (admin): its name, what its front page shows, and its apps' pages
 * under `/_apps/<name>/` (prove docs/design/business-address.md, app-page-addresses.md). Changes reach
 * visitors within about a minute.
 */
export var address;
(function (address) {
    const base = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/address`;
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
    async function page(collectionId, appId) {
        try {
            return await request(`/public/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/page`);
        }
        catch (e) {
            if ((e === null || e === void 0 ? void 0 : e.statusCode) === 404)
                return null;
            throw e;
        }
    }
    address.page = page;
    /** Everything about the business's address: name, own domain, front page, websites that can take it, app pages. */
    async function get(collectionId) {
        return request(base(collectionId));
    }
    address.get = get;
    /** Is this name free? (lower-case letters, numbers and hyphens) */
    async function checkName(collectionId, name) {
        return request(`${base(collectionId)}/available?${new URLSearchParams({ name })}`);
    }
    address.checkName = checkName;
    /**
     * Choose (or change) the business's name: `<name>.smartlinks.host`. The previous name is released.
     * @throws ErrorResponse 400 BAD_NAME, 409 NAME_TAKEN
     */
    async function setName(collectionId, name) {
        return post(`${base(collectionId)}/name`, { name });
    }
    address.setName = setName;
    /**
     * What the front page shows. Applies to the business's name, its automatic address and its own domain
     * together. A website must be installed and live; a redirect must be https and not one of its own addresses.
     * @throws ErrorResponse 400 BAD_FRONT | BAD_URL | REDIRECT_LOOP, 404 APP_NOT_INSTALLED, 409 PRODUCTION_ONLY | NOT_A_WEBSITE
     */
    async function setFront(collectionId, front) {
        return post(`${base(collectionId)}/front`, front);
    }
    address.setFront = setFront;
    /**
     * Rename an app's page (old names keep redirecting) and/or show it on the holding page.
     * @throws ErrorResponse 400 PAGE_NAME_INVALID, 404 APP_NOT_INSTALLED, 409 PAGE_NAME_TAKEN
     */
    async function setPage(collectionId, appId, change) {
        return post(`${base(collectionId)}/pages/${encodeURIComponent(appId)}`, change);
    }
    address.setPage = setPage;
})(address || (address = {}));
