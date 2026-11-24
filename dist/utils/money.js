// Money and the person's language: amounts are kept in minor units (Stripe's rule: cents for GBP/EUR/USD,
// whole units for zero-decimal currencies such as JPY and KRW) and shown in the language the page is in,
// so a German visitor sees "12,99 €", an English one "€12.99".
/** The language the page is showing: `<html lang>` (Portal, Hub and Studio keep it set), else the browser's, else English. */
export function pageLocale() {
    try {
        const lang = typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') : null;
        if (lang)
            return lang;
    }
    catch (_a) {
        /* no DOM */
    }
    if (typeof navigator !== 'undefined' && navigator.language)
        return navigator.language;
    return 'en';
}
/** Decimal places a currency uses: 2 for GBP, EUR and USD; 0 for JPY and KRW. Minor units follow it. */
export function currencyDecimals(currency) {
    var _a;
    try {
        return (_a = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits) !== null && _a !== void 0 ? _a : 2;
    }
    catch (_b) {
        return 2;
    }
}
/** Minor units → money for people, in `locale` (default: the page's language). */
export function formatMinor(amount, currency, locale, options) {
    const decimals = currencyDecimals(currency);
    const value = amount / 10 ** decimals;
    const lang = locale || pageLocale();
    const trim = (options === null || options === void 0 ? void 0 : options.trimZeroCents) && amount % 10 ** decimals === 0;
    try {
        return new Intl.NumberFormat(lang, Object.assign({ style: 'currency', currency }, (trim ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : {}))).format(value);
    }
    catch (_a) {
        try {
            return new Intl.NumberFormat('en', { style: 'currency', currency }).format(value);
        }
        catch (_b) {
            return `${value.toFixed(decimals)} ${currency}`;
        }
    }
}
// "{m}" is the money, "{n}" the count. One entry per language the platform's screens speak.
const TERMS = {
    en: { once: '{m} once', month: '{m} a month', year: '{m} a year', months: '{m} every {n} months', years: '{m} every {n} years' },
    de: { once: '{m} einmalig', month: '{m} pro Monat', year: '{m} pro Jahr', months: '{m} alle {n} Monate', years: '{m} alle {n} Jahre' },
    fr: { once: '{m} une fois', month: '{m} par mois', year: '{m} par an', months: '{m} tous les {n} mois', years: '{m} tous les {n} ans' },
    nl: { once: '{m} eenmalig', month: '{m} per maand', year: '{m} per jaar', months: '{m} elke {n} maanden', years: '{m} elke {n} jaar' },
    es: { once: '{m} pago único', month: '{m} al mes', year: '{m} al año', months: '{m} cada {n} meses', years: '{m} cada {n} años' },
    pt: { once: '{m} pagamento único', month: '{m} por mês', year: '{m} por ano', months: '{m} a cada {n} meses', years: '{m} a cada {n} anos' },
    it: { once: '{m} una tantum', month: '{m} al mese', year: "{m} all'anno", months: '{m} ogni {n} mesi', years: '{m} ogni {n} anni' },
    'zh-Hans': { once: '{m}（一次性）', month: '{m}/月', year: '{m}/年', months: '每 {n} 个月 {m}', years: '每 {n} 年 {m}' },
    ar: { once: '{m} مرة واحدة', month: '{m} شهريًا', year: '{m} سنويًا', months: '{m} كل {n} أشهر', years: '{m} كل {n} سنوات' },
};
function termsFor(locale) {
    const l = locale.toLowerCase();
    if (/^zh(-(cn|sg|hans)|$)/.test(l))
        return TERMS['zh-Hans'];
    return TERMS[l.split('-')[0]] || TERMS.en;
}
/** "£15 a month", "15 € pro Monat", "15,00 € alle 3 Monate", "99 € einmalig": a price and how often, in the page's language. */
export function describeRecurring(p, locale) {
    const lang = locale || pageLocale();
    const money = formatMinor(p.amount, p.currency, lang, { trimZeroCents: true });
    const t = termsFor(lang);
    const n = p.intervalCount || 1;
    const pattern = !p.interval ? t.once : n === 1 ? t[p.interval] : t[p.interval === 'month' ? 'months' : 'years'];
    return pattern.replace('{m}', money).replace('{n}', String(n));
}
