// Widget style support — the contract between a widget and the page it's dropped into (Link Page,
// Hub, any host that places widgets). The widget declares what it supports in its manifest entry
// (`widgets.components[].styleSupport`); the host shows only those styling controls and sets the
// `--sl-widget-*` variables below on the widget's box. See docs/widgets.md → "Style support".
/** The CSS variables a host sets on a widget's box (only the ones chosen). */
export const WIDGET_STYLE_VARS = {
    accent: '--sl-widget-accent',
    accentContrast: '--sl-widget-accent-contrast',
    text: '--sl-widget-text',
    radius: '--sl-widget-radius',
};
function luminance(hex) {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
    if (!m)
        return null;
    const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** Readable text colour on a background: near-black or white, whichever contrasts more. */
export function readableOn(hex) {
    const l = luminance(hex);
    if (l == null)
        return '#ffffff';
    const contrastWhite = 1.05 / (l + 0.05);
    const contrastDark = (l + 0.05) / (luminance('#111111') + 0.05);
    return contrastDark >= contrastWhite ? '#111111' : '#ffffff';
}
/**
 * Host helper: the `--sl-widget-*` variables for a widget's box, from the styling chosen — and,
 * when `support` is given, only the ones that widget declared (a host shouldn't set what the widget
 * ignores). The accent's readable text colour is computed here so every host agrees.
 */
export function widgetStyleVars(styling, support) {
    const out = {};
    const allows = (k) => !support || support[k] === true;
    if (styling.accent && allows('accent')) {
        out[WIDGET_STYLE_VARS.accent] = styling.accent;
        out[WIDGET_STYLE_VARS.accentContrast] = readableOn(styling.accent);
    }
    if (styling.text && allows('text'))
        out[WIDGET_STYLE_VARS.text] = styling.text;
    if (typeof styling.radius === 'number' && Number.isFinite(styling.radius))
        out[WIDGET_STYLE_VARS.radius] = `${styling.radius}px`;
    return out;
}
/**
 * Host helper: which styling controls to offer for a widget. Layout controls (width, alignment,
 * padding, scale, radius, border) are always offered — the host owns the box. Colour controls only
 * when the widget declared them; Background unless the widget paints its own card.
 * `styleSupport` missing (older widgets) → layout only, and `colours: false` so the host can say
 * "This widget doesn't offer colour customisation."
 */
export function widgetStyleControls(support) {
    if (!support)
        return { accent: false, text: false, textAlign: false, background: true, colours: false };
    return {
        accent: support.accent === true,
        text: support.text === true,
        textAlign: support.textAlign === true,
        background: support.background !== 'own',
        colours: support.accent === true || support.text === true,
    };
}
