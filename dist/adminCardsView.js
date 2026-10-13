/** The To do strip's items: every card's `todo`, plus attention/error statuses without one. */
export function collectAdminCardTodo(cards) {
    var _a;
    const out = [];
    for (const card of cards) {
        const p = card.payload;
        if (!p)
            continue;
        for (const t of p.todo || [])
            out.push(Object.assign({ card, text: t.text, tone: ((_a = p.status) === null || _a === void 0 ? void 0 : _a.tone) === 'error' ? 'error' : 'attention' }, (t.action ? { action: t.action } : {})));
        if (!(p.todo || []).length && p.status && (p.status.tone === 'attention' || p.status.tone === 'error')) {
            const action = (p.actions || [])[0];
            out.push(Object.assign({ card, text: `${card.title}: ${p.status.text}`, tone: p.status.tone }, (action ? { action } : {})));
        }
    }
    return out.sort((a, b) => (a.tone === b.tone ? 0 : a.tone === 'error' ? -1 : 1));
}
/** "just now" / "5 min ago" / "3 h ago" / "2 d ago". */
export function adminCardAge(at, now = Date.now()) {
    if (!at)
        return '';
    const s = Math.max(0, Math.round((now - at) / 1000));
    if (s < 60)
        return 'just now';
    if (s < 3600)
        return `${Math.round(s / 60)} min ago`;
    if (s < 86400)
        return `${Math.round(s / 3600)} h ago`;
    return `${Math.round(s / 86400)} d ago`;
}
const CSS = `
.slc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--slc-gap,16px)}
.slc-grid>*{grid-column:span 12}
@media (min-width:768px){.slc-grid>.slc-size-small{grid-column:span 6}.slc-grid>.slc-size-medium,.slc-grid>.slc-size-wide{grid-column:span 12}}
@media (min-width:1100px){.slc-grid>.slc-size-small{grid-column:span 3}.slc-grid>.slc-size-medium{grid-column:span 6}.slc-grid>.slc-size-wide{grid-column:span 8}}
.slc-card{--_bg:var(--slc-bg,var(--sl-color-surface,#fff));--_fg:var(--slc-fg,var(--sl-color-fg,#0f172a));--_muted:var(--slc-muted,var(--sl-color-muted,#64748b));--_border:var(--slc-border,var(--sl-color-border,#e2e8f0));--_accent:var(--slc-accent,var(--sl-color-accent,#2563eb));--_ok:var(--slc-ok,var(--sl-color-success,#059669));--_warn:var(--slc-attention,#b45309);--_err:var(--slc-error,var(--sl-color-danger,#dc2626));
 box-sizing:border-box;display:flex;flex-direction:column;gap:12px;min-height:148px;padding:16px 18px;border:1px solid var(--_border);border-radius:var(--slc-radius,var(--sl-radius-lg,14px));background:var(--_bg);color:var(--_fg);font:inherit;position:relative}
.slc-head{display:flex;align-items:center;gap:8px;min-width:0}
.slc-title{margin:0;font-size:.95rem;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.slc-age{font-size:.75rem;color:var(--_muted);white-space:nowrap}
.slc-refresh{all:unset;cursor:pointer;width:24px;height:24px;display:grid;place-items:center;border-radius:6px;color:var(--_muted)}
.slc-refresh:hover{background:color-mix(in srgb,var(--_muted) 12%,transparent);color:var(--_fg)}
.slc-refresh:focus-visible{outline:2px solid var(--_accent)}
.slc-spin{animation:slc-spin 1s linear infinite}
@keyframes slc-spin{to{transform:rotate(360deg)}}
.slc-valuerow{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 10px}
.slc-value{font-size:2rem;line-height:1.1;font-weight:700;letter-spacing:-.02em}
.slc-unit{font-size:1rem;font-weight:600;margin-left:2px;color:var(--_muted)}
.slc-label{font-size:.875rem;color:var(--_muted)}
.slc-trend{font-size:.75rem;font-weight:600;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--_muted) 12%,transparent);color:var(--_muted)}
.slc-trend.slc-good{background:color-mix(in srgb,var(--_ok) 14%,transparent);color:var(--_ok)}
.slc-trend.slc-bad{background:color-mix(in srgb,var(--_err) 12%,transparent);color:var(--_err)}
.slc-status{display:flex;align-items:flex-start;gap:8px;font-size:.875rem}
.slc-dot{flex:none;width:8px;height:8px;border-radius:50%;margin-top:6px;background:var(--_muted)}
.slc-tone-ok .slc-dot{background:var(--_ok)}.slc-tone-attention .slc-dot{background:var(--_warn)}.slc-tone-error .slc-dot{background:var(--_err)}
.slc-progress{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--_muted)}
.slc-bar{height:6px;border-radius:999px;background:color-mix(in srgb,var(--_muted) 18%,transparent);overflow:hidden}
.slc-bar>span{display:block;height:100%;background:var(--_accent);border-radius:inherit}
.slc-items{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.slc-item{display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid var(--_border);font-size:.875rem;min-width:0}
.slc-item:first-child{border-top:0}
.slc-item-main{flex:1;min-width:0}
.slc-item-title,.slc-item-sub{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.slc-item-sub,.slc-item-meta{color:var(--_muted);font-size:.75rem}
.slc-link{all:unset;cursor:pointer}
.slc-link:hover .slc-item-title{text-decoration:underline}
.slc-link:focus-visible{outline:2px solid var(--_accent);border-radius:4px}
.slc-empty{font-size:.875rem;color:var(--_muted)}
.slc-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
.slc-btn{all:unset;cursor:pointer;font-size:.8125rem;font-weight:600;padding:6px 12px;border-radius:8px;border:1px solid var(--_border);color:var(--_fg)}
.slc-btn:hover{background:color-mix(in srgb,var(--_muted) 10%,transparent)}
.slc-btn.slc-primary{background:var(--_accent);border-color:var(--_accent);color:var(--slc-on-accent,var(--sl-color-on-accent,#fff))}
.slc-btn:focus-visible{outline:2px solid var(--_accent);outline-offset:2px}
.slc-note{font-size:.75rem;color:var(--_muted)}
.slc-note.slc-err{color:var(--_err)}
.slc-skel{height:12px;border-radius:6px;background:color-mix(in srgb,var(--_muted) 16%,transparent);animation:slc-pulse 1.4s ease-in-out infinite}
@keyframes slc-pulse{50%{opacity:.5}}
.slc-todo{display:flex;flex-direction:column;gap:6px;padding:12px 16px;border-radius:var(--slc-radius,var(--sl-radius-lg,14px));border:1px solid color-mix(in srgb,var(--slc-attention,#b45309) 35%,transparent);background:color-mix(in srgb,var(--slc-attention,#b45309) 7%,var(--slc-bg,var(--sl-color-surface,#fff)));color:var(--slc-fg,var(--sl-color-fg,#0f172a))}
.slc-todo-title{margin:0 0 2px;font-size:.875rem;font-weight:600}
.slc-todo-row{display:flex;align-items:center;gap:10px;font-size:.875rem}
.slc-todo-row .slc-dot{margin-top:0;background:var(--slc-attention,#b45309)}
.slc-todo-row.slc-tone-error .slc-dot{background:var(--slc-error,var(--sl-color-danger,#dc2626))}
.slc-todo-text{flex:1;min-width:0}
`;
let injected = false;
/** Add the card styles to the page once (the views call it; hosts rendering on the server can too). */
export function injectAdminCardStyles(doc = typeof document !== 'undefined' ? document : undefined) {
    if (injected || !doc)
        return;
    injected = true;
    const style = doc.createElement('style');
    style.setAttribute('data-smartlinks', 'admin-cards');
    style.textContent = CSS;
    doc.head.appendChild(style);
}
/** The card stylesheet, for hosts that prefer to ship it themselves. */
export const ADMIN_CARD_CSS = CSS;
const ITEMS_FOR_SIZE = { small: 0, medium: 3, wide: 5, full: 5 };
/** The card views, bound to the host's React. Call once per app (module scope). */
export function createAdminCardViews(React) {
    const h = React.createElement;
    function useStyles() {
        React.useEffect(() => injectAdminCardStyles(), []);
    }
    function formatValue(v, lang) {
        if (typeof v === 'number') {
            try {
                return new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(v);
            }
            catch (_a) {
                return String(v);
            }
        }
        return v == null ? '' : String(v);
    }
    function ActionButton({ action, primary, onClick }) {
        return h('button', { type: 'button', className: `slc-btn${primary ? ' slc-primary' : ''}`, onClick }, action.label);
    }
    function RefreshIcon({ spinning }) {
        return h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: spinning ? 'slc-spin' : undefined, 'aria-hidden': true }, h('path', { d: 'M21 12a9 9 0 1 1-2.64-6.36' }), h('path', { d: 'M21 3v6h-6' }));
    }
    /** One card: header (title, age, refresh) and a body drawn from its payload. */
    function AdminCardView(props) {
        var _a;
        useStyles();
        const { card, onAction, onRefresh, refreshing = false, renderComponent, lang, now } = props;
        const p = card.payload;
        const size = card.size || 'medium';
        const act = (a) => onAction && onAction(a, card);
        const title = (p && p.title) || card.title;
        const age = card.state === 'pending' ? 'loading…' : card.state === 'stale' ? 'updating…' : adminCardAge(card.computedAt, now);
        const header = h('header', { className: 'slc-head' }, h('h3', { className: 'slc-title', title }, title), age ? h('span', { className: 'slc-age' }, age) : null, onRefresh ? h('button', { type: 'button', className: 'slc-refresh', 'aria-label': `Refresh ${title}`, title: 'Refresh', disabled: refreshing, onClick: () => onRefresh(card) }, h(RefreshIcon, { spinning: refreshing || card.state === 'stale' })) : null);
        let body;
        if (card.kind === 'component' && renderComponent) {
            body = renderComponent(card);
        }
        else if (!p) {
            body = card.state === 'error'
                ? h('p', { className: 'slc-note slc-err' }, card.error || "This card couldn't load.")
                : h('div', { 'aria-busy': true, style: { display: 'flex', flexDirection: 'column', gap: 8 } }, h('div', { className: 'slc-skel', style: { width: '40%', height: 28 } }), h('div', { className: 'slc-skel', style: { width: '70%' } }));
        }
        else {
            const showEmpty = !!p.empty && (p.value == null || p.value === 0) && !(p.items || []).length;
            const maxItems = (_a = ITEMS_FOR_SIZE[size]) !== null && _a !== void 0 ? _a : 3;
            const items = (p.items || []).slice(0, maxItems);
            const actions = (size === 'small' ? (p.actions || []).slice(0, 1) : p.actions || []);
            const trendClass = p.trend && p.trend.good != null ? (p.trend.good ? ' slc-good' : ' slc-bad') : '';
            const arrow = p.trend ? (p.trend.direction === 'up' ? '▲ ' : p.trend.direction === 'down' ? '▼ ' : '') : '';
            body = h(React.Fragment, null, p.value != null && !showEmpty
                ? h('div', { className: 'slc-valuerow' }, h('span', { className: 'slc-value' }, formatValue(p.value, lang), p.unit ? h('span', { className: 'slc-unit' }, p.unit) : null), p.label ? h('span', { className: 'slc-label' }, p.label) : null, p.trend ? h('span', { className: `slc-trend${trendClass}` }, arrow + (p.trend.label || '')) : null)
                : null, showEmpty
                ? h('div', { className: 'slc-empty' }, p.empty.text, p.empty.action ? h('div', { className: 'slc-actions', style: { marginTop: 10 } }, h(ActionButton, { action: p.empty.action, primary: true, onClick: () => act(p.empty.action) })) : null)
                : null, p.status ? h('div', { className: `slc-status slc-tone-${p.status.tone}` }, h('span', { className: 'slc-dot', 'aria-hidden': true }), h('span', null, p.status.text)) : null, p.progress
                ? h('div', { className: 'slc-progress' }, h('div', { className: 'slc-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': p.progress.total, 'aria-valuenow': p.progress.done }, h('span', { style: { width: `${Math.min(100, Math.round((p.progress.done / p.progress.total) * 100))}%` } })), h('span', null, p.progress.label || `${p.progress.done} of ${p.progress.total}`))
                : null, items.length && !showEmpty
                ? h('ul', { className: 'slc-items' }, ...items.map((it, i) => {
                    const inner = h(React.Fragment, null, h('span', { className: 'slc-item-main' }, h('span', { className: 'slc-item-title' }, it.title), it.subtitle ? h('span', { className: 'slc-item-sub' }, it.subtitle) : null), it.meta ? h('span', { className: 'slc-item-meta' }, it.meta) : null);
                    return h('li', { key: i, className: 'slc-item' }, it.path && onAction
                        ? h('button', { type: 'button', className: 'slc-link', style: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }, onClick: () => act({ label: it.title, path: it.path }) }, inner)
                        : inner);
                }))
                : null, actions.length && !showEmpty
                ? h('div', { className: 'slc-actions' }, ...actions.map((a, i) => h(ActionButton, { key: i, action: a, primary: i === 0, onClick: () => act(a) })))
                : null, card.state === 'error' && card.error ? h('p', { className: 'slc-note slc-err' }, `Couldn't refresh: ${card.error}`) : null);
        }
        return h('article', {
            className: `slc-card slc-size-${size} slc-state-${card.state}${props.className ? ` ${props.className}` : ''}`,
            'aria-busy': card.state === 'pending' || card.state === 'stale' || refreshing ? true : undefined,
            'data-card': card.key,
        }, header, body);
    }
    /** The 12-column dashboard grid (one column on phones); each card spans by its size. */
    function AdminCardGrid({ children, className }) {
        useStyles();
        return h('div', { className: `slc-grid${className ? ` ${className}` : ''}` }, children);
    }
    /** The To do strip: what the cards say needs doing. Renders nothing when there's nothing to do. */
    function AdminCardTodo({ cards, onAction, title = 'To do' }) {
        useStyles();
        const todo = collectAdminCardTodo(cards);
        if (!todo.length)
            return null;
        return h('section', { className: 'slc-todo', 'aria-label': title }, h('h2', { className: 'slc-todo-title' }, title), ...todo.slice(0, 6).map((t, i) => h('div', { key: i, className: `slc-todo-row slc-tone-${t.tone}` }, h('span', { className: 'slc-dot', 'aria-hidden': true }), h('span', { className: 'slc-todo-text' }, t.text), t.action && onAction ? h('button', { type: 'button', className: 'slc-btn', onClick: () => onAction(t.action, t.card) }, t.action.label) : null)));
    }
    return { AdminCardView, AdminCardGrid, AdminCardTodo };
}
