export interface SeoHead {
    title?: string;
    description?: string;
    /** Absolute image URL for link previews (og:image / twitter:image). */
    image?: string;
    /** Absolute canonical URL. Usually leave unset: the platform sends the site's canonical address. */
    canonical?: string;
    /** Keep this page out of search engines. */
    noindex?: boolean;
    /** og:type — 'website' (default), 'article' or 'product'. */
    type?: 'website' | 'article' | 'product';
    /** The site's name (og:site_name). */
    siteName?: string;
}
/** Set this route's head tags. Call on every route change; unset fields are removed (if we added them). */
export declare function head(h: SeoHead): void;
/**
 * Place a JSON-LD structured-data block in <head>. `id` names the block, so calling again replaces it
 * (e.g. per route); pass null to remove it. `<` is escaped so data can't close the script tag.
 */
export declare function jsonLd(id: string, data: object | object[] | null): void;
type Obj = Record<string, any>;
export interface ProductSchemaOptions {
    /** The page's absolute URL. */
    url?: string;
    /** Brand name (defaults to none). */
    brand?: string;
    /** An offer, when the product is sold: price as a number or string, ISO currency, availability. */
    offer?: {
        price: number | string;
        currency: string;
        availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
        url?: string;
    };
    /** Aggregate rating, when the site shows one. */
    rating?: {
        value: number;
        count: number;
    };
}
export declare const schema: {
    /** schema.org Product from a SmartLinks product. */
    product(product: Obj, opts?: ProductSchemaOptions): Obj;
    /** schema.org FAQPage — answer-shaped content AI search can cite, and FAQ rich results. */
    faqPage(items: Array<{
        question: string;
        answer: string;
    }>): Obj;
    /** schema.org Organization from a collection (the brand behind the site). */
    organization(collection: Obj, opts?: {
        url?: string;
        sameAs?: string[];
    }): Obj;
    /** schema.org LocalBusiness — for a business with a place (shop, restaurant, studio). */
    localBusiness(collection: Obj, opts?: {
        url?: string;
        telephone?: string;
        address?: {
            street?: string;
            locality?: string;
            region?: string;
            postalCode?: string;
            country?: string;
        };
        openingHours?: string[];
        type?: string;
    }): Obj;
    /** schema.org BreadcrumbList from a trail of { name, url } (home first). */
    breadcrumbs(trail: Array<{
        name: string;
        url: string;
    }>): Obj;
    /** schema.org Article (a blog post, news item, guide). Dates as ISO strings. */
    article(a: {
        headline: string;
        description?: string;
        image?: string;
        url?: string;
        datePublished?: string;
        dateModified?: string;
        author?: string;
        publisher?: string;
    }): Obj;
};
export {};
