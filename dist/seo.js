// =============================================================================
// SEO + GEO helpers for apps served as websites (framework-agnostic).
// =============================================================================
// seo.head()       per-route <title>, description, Open Graph / Twitter tags, canonical, robots
// seo.jsonLd()     place a structured-data block (replaces the previous one with the same id)
// seo.schema.*     schema.org builders from platform data (Product, FAQPage, Organization, …)
//
// They write plain DOM, so whatever pre-renders the page (the platform's renderer, a crawler that runs
// JavaScript) captures them. In SSR / no-document environments they're no-ops; the builders are pure.
// =============================================================================
const MARK = 'data-sl-seo';
function doc() {
    return typeof document !== 'undefined' && document && document.head ? document : null;
}
function setMeta(d, attr, key, content) {
    let el = d.head.querySelector(`meta[${attr}="${key}"]`);
    if (content === undefined || content === null || content === '') {
        if (el && el.getAttribute(MARK) !== null)
            el.remove();
        return;
    }
    if (!el) {
        el = d.createElement('meta');
        el.setAttribute(attr, key);
        el.setAttribute(MARK, '');
        d.head.appendChild(el);
    }
    el.setAttribute('content', content);
}
/** Set this route's head tags. Call on every route change; unset fields are removed (if we added them). */
export function head(h) {
    const d = doc();
    if (!d)
        return;
    if (h.title)
        d.title = h.title;
    setMeta(d, 'name', 'description', h.description);
    setMeta(d, 'property', 'og:title', h.title);
    setMeta(d, 'property', 'og:description', h.description);
    setMeta(d, 'property', 'og:image', h.image);
    setMeta(d, 'property', 'og:type', h.type || 'website');
    setMeta(d, 'property', 'og:site_name', h.siteName);
    setMeta(d, 'name', 'twitter:card', h.image ? 'summary_large_image' : 'summary');
    setMeta(d, 'name', 'twitter:title', h.title);
    setMeta(d, 'name', 'twitter:description', h.description);
    setMeta(d, 'name', 'twitter:image', h.image);
    setMeta(d, 'name', 'robots', h.noindex ? 'noindex, nofollow' : undefined);
    let link = d.head.querySelector('link[rel="canonical"]');
    if (h.canonical) {
        if (!link) {
            link = d.createElement('link');
            link.setAttribute('rel', 'canonical');
            link.setAttribute(MARK, '');
            d.head.appendChild(link);
        }
        link.setAttribute('href', h.canonical);
    }
    else if (link && link.getAttribute(MARK) !== null) {
        link.remove();
    }
}
/**
 * Place a JSON-LD structured-data block in <head>. `id` names the block, so calling again replaces it
 * (e.g. per route); pass null to remove it. `<` is escaped so data can't close the script tag.
 */
export function jsonLd(id, data) {
    const d = doc();
    if (!d)
        return;
    const sel = `script[type="application/ld+json"][${MARK}="${id}"]`;
    let el = d.head.querySelector(sel);
    if (data === null) {
        if (el)
            el.remove();
        return;
    }
    if (!el) {
        el = d.createElement('script');
        el.setAttribute('type', 'application/ld+json');
        el.setAttribute(MARK, id);
        d.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
}
const CTX = 'https://schema.org';
/** Drop undefined / null / empty values so the output stays valid and small. */
function clean(o) {
    for (const k of Object.keys(o)) {
        const v = o[k];
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0))
            delete o[k];
    }
    return o;
}
const imageOf = (x) => { var _a, _b, _c; return ((_a = x === null || x === void 0 ? void 0 : x.heroImage) === null || _a === void 0 ? void 0 : _a.url) || ((_b = x === null || x === void 0 ? void 0 : x.logoImage) === null || _b === void 0 ? void 0 : _b.url) || ((_c = x === null || x === void 0 ? void 0 : x.image) === null || _c === void 0 ? void 0 : _c.url) || (typeof (x === null || x === void 0 ? void 0 : x.image) === 'string' ? x.image : undefined); };
export const schema = {
    /** schema.org Product from a SmartLinks product. */
    product(product, opts = {}) {
        const images = [imageOf(product), ...(product.additionalImages || []).map((i) => i === null || i === void 0 ? void 0 : i.url)].filter(Boolean);
        return clean({
            '@context': CTX,
            '@type': 'Product',
            name: product.name,
            description: product.description || undefined,
            image: images.length > 1 ? images : images[0],
            sku: product.sku || undefined,
            gtin: product.gtin || product.ownGtin || undefined,
            url: opts.url,
            brand: opts.brand ? { '@type': 'Brand', name: opts.brand } : undefined,
            offers: opts.offer ? clean({
                '@type': 'Offer',
                price: String(opts.offer.price),
                priceCurrency: opts.offer.currency,
                availability: opts.offer.availability ? `${CTX}/${opts.offer.availability}` : undefined,
                url: opts.offer.url || opts.url,
            }) : undefined,
            aggregateRating: opts.rating ? { '@type': 'AggregateRating', ratingValue: opts.rating.value, reviewCount: opts.rating.count } : undefined,
        });
    },
    /** schema.org FAQPage — answer-shaped content AI search can cite, and FAQ rich results. */
    faqPage(items) {
        return {
            '@context': CTX,
            '@type': 'FAQPage',
            mainEntity: items.filter((i) => i && i.question && i.answer).map((i) => ({
                '@type': 'Question',
                name: i.question,
                acceptedAnswer: { '@type': 'Answer', text: i.answer },
            })),
        };
    },
    /** schema.org Organization from a collection (the brand behind the site). */
    organization(collection, opts = {}) {
        return clean({
            '@context': CTX,
            '@type': 'Organization',
            name: collection.title || collection.name,
            description: collection.description || undefined,
            logo: imageOf(collection),
            url: opts.url || (collection.hubCustomDomain ? `https://${collection.hubCustomDomain}` : collection.siteHost ? `https://${collection.siteHost}` : undefined),
            sameAs: opts.sameAs,
        });
    },
    /** schema.org LocalBusiness — for a business with a place (shop, restaurant, studio). */
    localBusiness(collection, opts = {}) {
        const a = opts.address;
        return clean(Object.assign(Object.assign({}, schema.organization(collection, { url: opts.url })), { '@type': opts.type || 'LocalBusiness', telephone: opts.telephone, address: a ? clean({ '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.locality, addressRegion: a.region, postalCode: a.postalCode, addressCountry: a.country }) : undefined, openingHours: opts.openingHours }));
    },
    /** schema.org BreadcrumbList from a trail of { name, url } (home first). */
    breadcrumbs(trail) {
        return {
            '@context': CTX,
            '@type': 'BreadcrumbList',
            itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.url })),
        };
    },
    /** schema.org Article (a blog post, news item, guide). Dates as ISO strings. */
    article(a) {
        return clean({
            '@context': CTX,
            '@type': 'Article',
            headline: a.headline,
            description: a.description,
            image: a.image,
            url: a.url,
            datePublished: a.datePublished,
            dateModified: a.dateModified || a.datePublished,
            author: a.author ? { '@type': 'Person', name: a.author } : undefined,
            publisher: a.publisher ? { '@type': 'Organization', name: a.publisher } : undefined,
        });
    },
};
