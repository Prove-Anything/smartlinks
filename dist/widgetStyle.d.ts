import type { WidgetStyleSupport } from './types/appManifest.js';
/** The styling a person chose for one placed widget (host side). Colours are hex. */
export interface WidgetStyling {
    accent?: string;
    text?: string;
    /** Corner radius in px. */
    radius?: number;
}
/** The CSS variables a host sets on a widget's box (only the ones chosen). */
export declare const WIDGET_STYLE_VARS: {
    readonly accent: "--sl-widget-accent";
    readonly accentContrast: "--sl-widget-accent-contrast";
    readonly text: "--sl-widget-text";
    readonly radius: "--sl-widget-radius";
};
/** Readable text colour on a background: near-black or white, whichever contrasts more. */
export declare function readableOn(hex: string): '#111111' | '#ffffff';
/**
 * Host helper: the `--sl-widget-*` variables for a widget's box, from the styling chosen — and,
 * when `support` is given, only the ones that widget declared (a host shouldn't set what the widget
 * ignores). The accent's readable text colour is computed here so every host agrees.
 */
export declare function widgetStyleVars(styling: WidgetStyling, support?: WidgetStyleSupport | null): Record<string, string>;
/**
 * Host helper: which styling controls to offer for a widget. Layout controls (width, alignment,
 * padding, scale, radius, border) are always offered — the host owns the box. Colour controls only
 * when the widget declared them; Background unless the widget paints its own card.
 * `styleSupport` missing (older widgets) → layout only, and `colours: false` so the host can say
 * "This widget doesn't offer colour customisation."
 */
export declare function widgetStyleControls(support?: WidgetStyleSupport | null): {
    accent: boolean;
    text: boolean;
    textAlign: boolean;
    background: boolean;
    colours: boolean;
};
