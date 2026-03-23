import { del, post, put, request } from "../http";
export var products;
(function (products) {
    async function get(collectionId, productId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}`;
        return request(path);
    }
    products.get = get;
    async function list(collectionId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/products`;
        return request(path);
    }
    products.list = list;
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products`;
        return post(path, data);
    }
    products.create = create;
    async function update(collectionId, productId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}`;
        return put(path, data);
    }
    products.update = update;
    async function remove(collectionId, productId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}`;
        return del(path);
    }
    products.remove = remove;
    async function query(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/query`;
        return post(path, body);
    }
    products.query = query;
    async function clone(collectionId, productId, body = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/clone`;
        return post(path, body);
    }
    products.clone = clone;
    async function listAssets(collectionId, productId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/asset`;
        return request(path);
    }
    products.listAssets = listAssets;
    async function createClaimWindow(collectionId, productId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/claimWindow`;
        return post(path, body);
    }
    products.createClaimWindow = createClaimWindow;
    async function updateClaimWindow(collectionId, productId, claimId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/claimWindow/${encodeURIComponent(claimId)}`;
        return put(path, body);
    }
    products.updateClaimWindow = updateClaimWindow;
    async function refresh(collectionId, productId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/refresh`;
        return request(path);
    }
    products.refresh = refresh;
    async function getSN(collectionId, productId, startIndex = 0, count = 10) {
        const queryParams = new URLSearchParams({
            startIndex: startIndex.toString(),
            count: count.toString(),
        });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/getSN?${queryParams}`;
        return request(path);
    }
    products.getSN = getSN;
    async function lookupSN(collectionId, productId, codeId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/lookupSN/${encodeURIComponent(codeId)}`;
        return request(path);
    }
    products.lookupSN = lookupSN;
    async function publicLookupClaim(collectionId, productId, claimId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/lookupClaim/${encodeURIComponent(claimId)}`;
        return request(path);
    }
    products.publicLookupClaim = publicLookupClaim;
    async function publicCreateClaim(collectionId, productId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/createClaim`;
        return post(path, body);
    }
    products.publicCreateClaim = publicCreateClaim;
})(products || (products = {}));
