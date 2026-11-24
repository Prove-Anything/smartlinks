/** The language the page is showing: `<html lang>` (Portal, Hub and Studio keep it set), else the browser's, else English. */
export declare function pageLocale(): string;
/** Decimal places a currency uses: 2 for GBP, EUR and USD; 0 for JPY and KRW. Minor units follow it. */
export declare function currencyDecimals(currency: string): number;
/** Minor units → money for people, in `locale` (default: the page's language). */
export declare function formatMinor(amount: number, currency: string, locale?: string, options?: {
    trimZeroCents?: boolean;
}): string;
/** "£15 a month", "15 € pro Monat", "15,00 € alle 3 Monate", "99 € einmalig": a price and how often, in the page's language. */
export declare function describeRecurring(p: {
    amount: number;
    currency: string;
    interval: 'month' | 'year' | null;
    intervalCount?: number;
}, locale?: string): string;
