// src/api/ai.ts
// AI endpoints: public and admin helpers
import { post } from "../http";
export var ai;
(function (ai) {
    /**
     * Generate text/content via AI (admin)
     */
    async function generateContent(collectionId, params, admin = true) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/generateContent`;
        return post(path, params);
    }
    ai.generateContent = generateContent;
    /**
     * Generate an image via AI (admin)
     */
    async function generateImage(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/generateImage`;
        return post(path, params);
    }
    ai.generateImage = generateImage;
    /**
     * Search stock photos or similar via AI (admin)
     */
    async function searchPhotos(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/searchPhotos`;
        return post(path, params);
    }
    ai.searchPhotos = searchPhotos;
    /**
     * Upload a file for AI usage (admin). Pass FormData for binary uploads.
     */
    async function uploadFile(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/uploadFile`;
        return post(path, params);
    }
    ai.uploadFile = uploadFile;
    /**
     * Create or warm a cache for AI (admin)
     */
    async function createCache(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/createCache`;
        return post(path, params);
    }
    ai.createCache = createCache;
    /**
     * Post a chat message to the AI (admin or public)
     */
    async function postChat(collectionId, params, admin = true) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/postChat`;
        return post(path, params);
    }
    ai.postChat = postChat;
})(ai || (ai = {}));
