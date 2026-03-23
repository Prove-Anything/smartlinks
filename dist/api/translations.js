import { patch, post, request } from '../http';
import { clearCachedTranslations, deriveTranslationContextKey, getCachedTranslations, getDefaultTranslationCacheTtlMs, hashTranslationText, normalizeTranslationText, setCachedTranslations, } from '../translationCache';
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
function buildTranslationListQuery(params = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null)
            continue;
        query.append(key, String(value));
    }
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}
function sameLanguage(left, right) {
    return left.trim().toLowerCase() === right.trim().toLowerCase();
}
function toResolvedItem(item, index, cacheSource) {
    return Object.assign(Object.assign({}, item), { index,
        cacheSource });
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
        return post(path, normalized.requestBody);
    }
    translations.lookup = lookup;
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
    async function list(collectionId, params) {
        const query = buildTranslationListQuery(params);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/translations${query}`;
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
    async function clearLocalCache(collectionId) {
        await clearCachedTranslations(collectionId);
    }
    translations.clearLocalCache = clearLocalCache;
})(translations || (translations = {}));
