import { isProxyEnabled, patch, post, put, request } from '../http.js';
import { clearCachedTranslations, deriveTranslationContextKey, getCachedTranslations, getDefaultTranslationCacheTtlMs, hashTranslationText, normalizeTranslationText, setCachedTranslations, } from '../translationCache.js';
import { trackTranslation, onActivity as onTranslationActivity, activity as translationActivity, translatingMessage as translatingLine } from '../translationActivity.js';
import { listQuery } from '../list.js';
function normalizeLookupRequest(body) {
    var _a, _b, _c;
    const texts = Array.isArray(body.texts)
        ? [...(body.texts)]
        : typeof body.text === 'string'
            ? [body.text]
            : [];
    if (!body.targetLanguage) {
        throw new Error('[smartlinks] translations.lookup requires targetLanguage');
    }
    if (texts.length === 0) {
        throw new Error('[smartlinks] translations.lookup requires text or texts');
    }
    return {
        targetLanguage: body.targetLanguage,
        sourceLanguage: (_a = body.sourceLanguage) !== null && _a !== void 0 ? _a : 'en',
        mode: (_b = body.mode) !== null && _b !== void 0 ? _b : 'cache-fill',
        contentType: (_c = body.contentType) !== null && _c !== void 0 ? _c : 'text/plain',
        contextKey: deriveTranslationContextKey(body.context),
        requestBody: {
            targetLanguage: body.targetLanguage,
            sourceLanguage: body.sourceLanguage,
            mode: body.mode,
            contentType: body.contentType,
            context: body.context,
            returnMeta: body.returnMeta,
            texts,
        },
        texts,
    };
}
function sameLanguage(left, right) {
    return left.trim().toLowerCase() === right.trim().toLowerCase();
}
function toResolvedItem(item, index, cacheSource) {
    return Object.assign(Object.assign({}, item), { index,
        cacheSource });
}
// A person can correct a translation in Studio. Visitors' browsers keep translations for weeks, so
// once per page per collection we ask the server when its translations were last edited, and drop
// the local copies if that changed since we last looked. The answer is cheap (no AI) and never
// blocks for long: on a slow or failed answer the local copies are used as before.
const REVISION_KEY = 'smartlinks:translations:revision:';
const REVISION_WAIT_MS = 1500;
const revisionChecks = new Map();
function readStoredRevision(collectionId) {
    try {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(REVISION_KEY + collectionId) : null;
    }
    catch (_a) {
        return null;
    }
}
function storeRevision(collectionId, revision) {
    try {
        if (typeof localStorage !== 'undefined')
            localStorage.setItem(REVISION_KEY + collectionId, revision);
    }
    catch ( /* ignore */_a) { /* ignore */ }
}
async function checkRevision(collectionId) {
    const res = await request(`/public/collection/${encodeURIComponent(collectionId)}/translations/revision`);
    const revision = typeof (res === null || res === void 0 ? void 0 : res.revision) === 'string' ? res.revision : null;
    if (!revision)
        return;
    const stored = readStoredRevision(collectionId);
    // First look ever: copies saved before this check existed may predate an edit, unless nothing was ever edited.
    const changed = stored === null ? revision !== '0' : stored !== revision;
    if (changed)
        await clearCachedTranslations(collectionId);
    storeRevision(collectionId, revision);
}
function refreshIfEdited(collectionId) {
    let check = revisionChecks.get(collectionId);
    if (!check) {
        check = checkRevision(collectionId).catch(() => undefined);
        revisionChecks.set(collectionId, check);
    }
    return Promise.race([check, new Promise((resolve) => setTimeout(resolve, REVISION_WAIT_MS))]);
}
/** @internal tests only */
export function _resetRevisionChecks() {
    revisionChecks.clear();
}
export var translations;
(function (translations) {
    async function hashText(text, options) {
        return hashTranslationText(text, options);
    }
    translations.hashText = hashText;
    async function hashTexts(texts, options) {
        return Promise.all(texts.map((text) => hashTranslationText(text, options)));
    }
    translations.hashTexts = hashTexts;
    function normalizeText(text, options) {
        return normalizeTranslationText(text, options);
    }
    translations.normalizeText = normalizeText;
    async function lookup(collectionId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/translations/lookup`;
        const normalized = normalizeLookupRequest(body);
        // A request that may create translations can take a while the first time: say so, so a host
        // (Portal, Hub) can show "translating…" without the app doing anything (translationActivity.ts).
        // Through the parent (proxyMode), the host's IframeResponder counts it instead, so apps built on
        // older SDKs are covered too and nothing is counted twice.
        const settle = normalized.mode === 'cache-fill' && !isProxyEnabled() && !sameLanguage(normalized.sourceLanguage, normalized.targetLanguage)
            ? trackTranslation(normalized.targetLanguage, normalized.texts.length)
            : null;
        try {
            return await post(path, normalized.requestBody);
        }
        finally {
            settle === null || settle === void 0 ? void 0 : settle();
        }
    }
    translations.lookup = lookup;
    /**
     * Hear when content is being translated for the first time, in this window or in any app frame
     * it embeds. Hosts use it to show a "translating this page" notice; apps never have to.
     * Returns an unsubscribe function.
     */
    function onActivity(cb) {
        return onTranslationActivity(cb);
    }
    translations.onActivity = onActivity;
    /** The "translating this page" line, in the language being translated into (for a host's banner). */
    function translatingMessage(language) {
        return translatingLine(language);
    }
    translations.translatingMessage = translatingMessage;
    /** Whether a first-time translation is under way right now (see onActivity). */
    function activity() {
        return translationActivity();
    }
    translations.activity = activity;
    async function resolve(collectionId, body, options = {}) {
        var _a, _b, _c;
        const normalized = normalizeLookupRequest(body);
        const { useLocalCache = true, refreshLocalCache = false, localCacheTtlMs = getDefaultTranslationCacheTtlMs(), hashOptions, } = options;
        const hashes = await Promise.all(normalized.texts.map((text) => hashTranslationText(text, hashOptions)));
        const results = new Array(normalized.texts.length);
        if (sameLanguage(normalized.sourceLanguage, normalized.targetLanguage)) {
            const passthroughItems = normalized.texts.map((text, index) => ({
                index,
                hash: hashes[index],
                sourceText: text,
                translatedText: text,
                status: 'passthrough',
                quality: 'passthrough',
                cacheSource: 'local',
                expiresAt: Date.now() + localCacheTtlMs,
            }));
            if (useLocalCache) {
                await setCachedTranslations({
                    collectionId,
                    sourceLanguage: normalized.sourceLanguage,
                    targetLanguage: normalized.targetLanguage,
                    contentType: normalized.contentType,
                    contextKey: normalized.contextKey,
                    ttlMs: localCacheTtlMs,
                    items: passthroughItems.map((item) => ({ hash: item.hash, item })),
                });
            }
            return {
                targetLanguage: normalized.targetLanguage,
                sourceLanguage: normalized.sourceLanguage,
                mode: normalized.mode,
                items: passthroughItems,
            };
        }
        if (useLocalCache && !refreshLocalCache)
            await refreshIfEdited(collectionId);
        const cachedByHash = useLocalCache && !refreshLocalCache
            ? await getCachedTranslations({
                collectionId,
                sourceLanguage: normalized.sourceLanguage,
                targetLanguage: normalized.targetLanguage,
                contentType: normalized.contentType,
                contextKey: normalized.contextKey,
                hashes,
            })
            : new Map();
        const missingIndexes = [];
        for (let index = 0; index < normalized.texts.length; index += 1) {
            const cached = cachedByHash.get(hashes[index]);
            if ((_a = cached === null || cached === void 0 ? void 0 : cached.item) === null || _a === void 0 ? void 0 : _a.translatedText) {
                results[index] = toResolvedItem(cached.item, index, 'local');
            }
            else {
                missingIndexes.push(index);
            }
        }
        if (missingIndexes.length === 0) {
            return {
                targetLanguage: normalized.targetLanguage,
                sourceLanguage: normalized.sourceLanguage,
                mode: normalized.mode,
                items: results,
            };
        }
        const uniqueMisses = [];
        const uniqueMissLookup = new Map();
        for (const index of missingIndexes) {
            const hash = hashes[index];
            const existing = uniqueMissLookup.get(hash);
            if (existing) {
                existing.indexes.push(index);
                continue;
            }
            uniqueMissLookup.set(hash, { firstIndex: index, indexes: [index] });
            uniqueMisses.push({ index, hash, text: normalized.texts[index] });
        }
        const remoteResponse = await lookup(collectionId, {
            targetLanguage: normalized.targetLanguage,
            sourceLanguage: body.sourceLanguage,
            mode: body.mode,
            contentType: body.contentType,
            context: body.context,
            returnMeta: body.returnMeta,
            texts: uniqueMisses.map((item) => item.text),
        });
        const cacheableRemoteItems = [];
        remoteResponse.items.forEach((remoteItem, remoteIndex) => {
            var _a, _b;
            const miss = uniqueMisses[remoteIndex];
            if (!miss)
                return;
            const indexes = (_b = (_a = uniqueMissLookup.get(miss.hash)) === null || _a === void 0 ? void 0 : _a.indexes) !== null && _b !== void 0 ? _b : [miss.index];
            for (const index of indexes) {
                const resolvedItem = Object.assign(Object.assign({}, remoteItem), { index, hash: miss.hash, sourceText: normalized.texts[index], cacheSource: 'remote' });
                results[index] = resolvedItem;
            }
            if (remoteItem.translatedText) {
                cacheableRemoteItems.push({
                    hash: miss.hash,
                    item: Object.assign(Object.assign({}, remoteItem), { index: miss.index, hash: miss.hash, sourceText: miss.text, cacheSource: 'remote' }),
                });
            }
        });
        if (useLocalCache && cacheableRemoteItems.length > 0) {
            await setCachedTranslations({
                collectionId,
                sourceLanguage: normalized.sourceLanguage,
                targetLanguage: normalized.targetLanguage,
                contentType: normalized.contentType,
                contextKey: normalized.contextKey,
                ttlMs: localCacheTtlMs,
                items: cacheableRemoteItems,
            });
        }
        return {
            targetLanguage: remoteResponse.targetLanguage,
            sourceLanguage: (_b = remoteResponse.sourceLanguage) !== null && _b !== void 0 ? _b : normalized.sourceLanguage,
            mode: (_c = remoteResponse.mode) !== null && _c !== void 0 ? _c : normalized.mode,
            items: results.map((item, index) => item !== null && item !== void 0 ? item : {
                index,
                hash: hashes[index],
                sourceText: normalized.texts[index],
                cacheSource: 'remote',
            }),
        };
    }
    translations.resolve = resolve;
    /**
     * Admin: the collection's stored translations, a page at a time. Filter by language, content type, where
     * the text appears (`contextKey`), a search (`q`), whether a person edited it (`isOverride`), or whether
     * it misses the site's required wording (`termIssues`). `count` is how many match in all.
     *
     * @example
     * ```typescript
     * let page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50 })
     * page.items // TranslationRecord[]
     * while (page.nextCursor) {
     *   page = await translations.list('coll_123', { targetLanguage: 'de', limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    async function list(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations${listQuery(params)}`;
        return request(path);
    }
    translations.list = list;
    async function get(collectionId, translationId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations/${encodeURIComponent(translationId)}`;
        return request(path);
    }
    translations.get = get;
    async function update(collectionId, translationId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations/${encodeURIComponent(translationId)}`;
        return patch(path, body);
    }
    translations.update = update;
    /** Admin: how many translations exist per language, and how many a person has edited. */
    async function summary(collectionId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/translations/summary`);
    }
    translations.summary = summary;
    /** Admin: where translated text appears for one language (context keys), with counts. */
    async function places(collectionId, targetLanguage) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/translations/places?targetLanguage=${encodeURIComponent(targetLanguage)}`);
    }
    translations.places = places;
    /** Admin: undo a person's edit with a fresh machine translation. */
    async function reset(collectionId, translationId) {
        return post(`/admin/collection/${encodeURIComponent(collectionId)}/translations/${encodeURIComponent(translationId)}/reset`, {});
    }
    translations.reset = reset;
    /** Admin: the site's translation rules (brief, notes per language, required terms). */
    async function rules(collectionId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/translations/rules`);
    }
    translations.rules = rules;
    /** Admin: replace the site's translation rules. They apply to new translations from now on. */
    async function saveRules(collectionId, body) {
        return put(`/admin/collection/${encodeURIComponent(collectionId)}/translations/rules`, body);
    }
    translations.saveRules = saveRules;
    async function clearLocalCache(collectionId) {
        await clearCachedTranslations(collectionId);
    }
    translations.clearLocalCache = clearLocalCache;
})(translations || (translations = {}));
