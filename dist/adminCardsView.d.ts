/**
 * The admin card RENDERER — one look for a card everywhere it's drawn (Studio's dashboard, Forge's
 * preview), so what a developer previews is what the business sees. docs/admin-cards.md.
 *
 * Framework-light on purpose: the host passes its own React, so the SDK has no React dependency and
 * a page never gets a second copy of React.
 *
 * ```tsx
 * import React from 'react'
 * import { createAdminCardViews } from '@proveanything/smartlinks'
 * const { AdminCardView, AdminCardGrid, AdminCardTodo } = createAdminCardViews(React)
 *
 * <AdminCardTodo cards={cards} onAction={go} />
 * <AdminCardGrid>
 *   {cards.map((c) => <AdminCardView key={c.key} card={c} onAction={go} onRefresh={refresh} />)}
 * </AdminCardGrid>
 * ```
 *
 * Styling: plain classes (`slc-*`) injected once, coloured by CSS variables that default to the SDK
 * theme tokens (`--sl-color-*`) — set `--slc-*` on a parent to fit any host.
 */
import type { AdminCard, AdminCardAction } from './types/adminCards.js';
type Node = unknown;
interface ReactLike {
    createElement: (type: any, props?: any, ...children: any[]) => Node;
    Fragment: any;
    useEffect: (fn: () => void | (() => void), deps?: unknown[]) => void;
}
export interface AdminCardViewProps {
    card: Pick<AdminCard, 'title' | 'size' | 'state' | 'payload' | 'computedAt'> & Partial<AdminCard>;
    /** A card button or list row was clicked: `path` = open the app's admin there; `url` = open it. */
    onAction?: (action: AdminCardAction, card: AdminCardViewProps['card']) => void;
    /** Show a refresh button that calls this. */
    onRefresh?: (card: AdminCardViewProps['card']) => void;
    /** The refresh is running (spins the button). */
    refreshing?: boolean;
    /** Component cards: mount the app's component (the host loads its bundle). */
    renderComponent?: (card: AdminCardViewProps['card']) => Node;
    /** For number formatting. Defaults to the browser's. */
    lang?: string;
    /** "Now", for the "updated 5 min ago" line (tests, server render). */
    now?: number;
    className?: string;
}
export interface AdminCardTodoItem {
    card: AdminCardViewProps['card'];
    text: string;
    tone: 'attention' | 'error';
    action?: AdminCardAction;
}
/** The To do strip's items: every card's `todo`, plus attention/error statuses without one. */
export declare function collectAdminCardTodo(cards: Array<AdminCardViewProps['card']>): AdminCardTodoItem[];
/** "just now" / "5 min ago" / "3 h ago" / "2 d ago". */
export declare function adminCardAge(at: number | null | undefined, now?: number): string;
/** Add the card styles to the page once (the views call it; hosts rendering on the server can too). */
export declare function injectAdminCardStyles(doc?: Document | undefined): void;
/** The card stylesheet, for hosts that prefer to ship it themselves. */
export declare const ADMIN_CARD_CSS = "\n.slc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--slc-gap,16px)}\n.slc-grid>*{grid-column:span 12}\n@media (min-width:768px){.slc-grid>.slc-size-small{grid-column:span 6}.slc-grid>.slc-size-medium,.slc-grid>.slc-size-wide{grid-column:span 12}}\n@media (min-width:1100px){.slc-grid>.slc-size-small{grid-column:span 3}.slc-grid>.slc-size-medium{grid-column:span 6}.slc-grid>.slc-size-wide{grid-column:span 8}}\n.slc-card{--_bg:var(--slc-bg,var(--sl-color-surface,#fff));--_fg:var(--slc-fg,var(--sl-color-fg,#0f172a));--_muted:var(--slc-muted,var(--sl-color-muted,#64748b));--_border:var(--slc-border,var(--sl-color-border,#e2e8f0));--_accent:var(--slc-accent,var(--sl-color-accent,#2563eb));--_ok:var(--slc-ok,var(--sl-color-success,#059669));--_warn:var(--slc-attention,#b45309);--_err:var(--slc-error,var(--sl-color-danger,#dc2626));\n box-sizing:border-box;display:flex;flex-direction:column;gap:12px;min-height:148px;padding:16px 18px;border:1px solid var(--_border);border-radius:var(--slc-radius,var(--sl-radius-lg,14px));background:var(--_bg);color:var(--_fg);font:inherit;position:relative}\n.slc-head{display:flex;align-items:center;gap:8px;min-width:0}\n.slc-title{margin:0;font-size:.95rem;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.slc-age{font-size:.75rem;color:var(--_muted);white-space:nowrap}\n.slc-refresh{all:unset;cursor:pointer;width:24px;height:24px;display:grid;place-items:center;border-radius:6px;color:var(--_muted)}\n.slc-refresh:hover{background:color-mix(in srgb,var(--_muted) 12%,transparent);color:var(--_fg)}\n.slc-refresh:focus-visible{outline:2px solid var(--_accent)}\n.slc-spin{animation:slc-spin 1s linear infinite}\n@keyframes slc-spin{to{transform:rotate(360deg)}}\n.slc-valuerow{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 10px}\n.slc-value{font-size:2rem;line-height:1.1;font-weight:700;letter-spacing:-.02em}\n.slc-unit{font-size:1rem;font-weight:600;margin-left:2px;color:var(--_muted)}\n.slc-label{font-size:.875rem;color:var(--_muted)}\n.slc-trend{font-size:.75rem;font-weight:600;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--_muted) 12%,transparent);color:var(--_muted)}\n.slc-trend.slc-good{background:color-mix(in srgb,var(--_ok) 14%,transparent);color:var(--_ok)}\n.slc-trend.slc-bad{background:color-mix(in srgb,var(--_err) 12%,transparent);color:var(--_err)}\n.slc-status{display:flex;align-items:flex-start;gap:8px;font-size:.875rem}\n.slc-dot{flex:none;width:8px;height:8px;border-radius:50%;margin-top:6px;background:var(--_muted)}\n.slc-tone-ok .slc-dot{background:var(--_ok)}.slc-tone-attention .slc-dot{background:var(--_warn)}.slc-tone-error .slc-dot{background:var(--_err)}\n.slc-progress{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--_muted)}\n.slc-bar{height:6px;border-radius:999px;background:color-mix(in srgb,var(--_muted) 18%,transparent);overflow:hidden}\n.slc-bar>span{display:block;height:100%;background:var(--_accent);border-radius:inherit}\n.slc-items{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}\n.slc-item{display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid var(--_border);font-size:.875rem;min-width:0}\n.slc-item:first-child{border-top:0}\n.slc-item-main{flex:1;min-width:0}\n.slc-item-title,.slc-item-sub{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.slc-item-sub,.slc-item-meta{color:var(--_muted);font-size:.75rem}\n.slc-link{all:unset;cursor:pointer}\n.slc-link:hover .slc-item-title{text-decoration:underline}\n.slc-link:focus-visible{outline:2px solid var(--_accent);border-radius:4px}\n.slc-empty{font-size:.875rem;color:var(--_muted)}\n.slc-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}\n.slc-btn{all:unset;cursor:pointer;font-size:.8125rem;font-weight:600;padding:6px 12px;border-radius:8px;border:1px solid var(--_border);color:var(--_fg)}\n.slc-btn:hover{background:color-mix(in srgb,var(--_muted) 10%,transparent)}\n.slc-btn.slc-primary{background:var(--_accent);border-color:var(--_accent);color:var(--slc-on-accent,var(--sl-color-on-accent,#fff))}\n.slc-btn:focus-visible{outline:2px solid var(--_accent);outline-offset:2px}\n.slc-note{font-size:.75rem;color:var(--_muted)}\n.slc-note.slc-err{color:var(--_err)}\n.slc-skel{height:12px;border-radius:6px;background:color-mix(in srgb,var(--_muted) 16%,transparent);animation:slc-pulse 1.4s ease-in-out infinite}\n@keyframes slc-pulse{50%{opacity:.5}}\n.slc-todo{display:flex;flex-direction:column;gap:6px;padding:12px 16px;border-radius:var(--slc-radius,var(--sl-radius-lg,14px));border:1px solid color-mix(in srgb,var(--slc-attention,#b45309) 35%,transparent);background:color-mix(in srgb,var(--slc-attention,#b45309) 7%,var(--slc-bg,var(--sl-color-surface,#fff)));color:var(--slc-fg,var(--sl-color-fg,#0f172a))}\n.slc-todo-title{margin:0 0 2px;font-size:.875rem;font-weight:600}\n.slc-todo-row{display:flex;align-items:center;gap:10px;font-size:.875rem}\n.slc-todo-row .slc-dot{margin-top:0;background:var(--slc-attention,#b45309)}\n.slc-todo-row.slc-tone-error .slc-dot{background:var(--slc-error,var(--sl-color-danger,#dc2626))}\n.slc-todo-text{flex:1;min-width:0}\n";
/** The card views, bound to the host's React. Call once per app (module scope). */
export declare function createAdminCardViews(React: ReactLike): {
    AdminCardView: (props: AdminCardViewProps) => unknown;
    AdminCardGrid: ({ children, className }: {
        children?: any;
        className?: string | undefined;
    }) => unknown;
    AdminCardTodo: ({ cards, onAction, title }: {
        cards: Array<AdminCardViewProps['card']>;
        onAction?: AdminCardViewProps['onAction'];
        title?: string | undefined;
    }) => unknown;
};
export {};
