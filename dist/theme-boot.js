/* @proveanything/smartlinks/theme-boot.js — iframe theme + viewer-prefs bootstrap (theme tokens v1)
 *
 * ONLY for iframe / standalone app entries (admin.html, index.html). Container & widget apps do NOT
 * need this — they inherit the host's :root tokens through the DOM. See docs/theme-tokens.md.
 *
 * What it does, and nothing more:
 *   1. BOOT (synchronous, before first paint): reads the initial theme + viewer prefs from the URL
 *      (`#slt=<base64url JSON>` plus convenience params ?theme=&contrast=&lang=&fontScale=) and applies
 *      them to :root. Put this in <head>, inline, so it runs before the app's stylesheet — no flash.
 *   2. LIVE: applies generic root-state updates the host posts (`smartlinks:root-state`) — viewer /
 *      accessibility prefs (dark, contrast, font-scale, lang) and, if the host chooses, editor
 *      brand-preview. The app AUTHORS CSS against these root hooks; it never writes a message handler.
 *
 * Root hooks the app styles against:
 *   - theme:      the `.dark` class (Tailwind/shadcn convention) AND `[data-theme="dark|light"]`
 *   - contrast:   `[data-contrast="high"]`  (also honour @media (prefers-contrast: more) natively)
 *   - font size:  `--sl-font-scale` (e.g. 1.25) — scale your rem/base type off it
 *   - language:   `lang` attribute (content/i18n is the app's own job; this just flags it)
 *   - brand:      the --sl-* theme tokens (see theme.css)
 *
 * Brand THEME changes are expected via iframe reload (rare, operator-driven). Viewer / a11y prefs are
 * applied LIVE here (a reload on an accessibility toggle is itself an accessibility failure).
 */
(function () {
  if (typeof document === 'undefined') return;
  var root = document.documentElement;

  function setVar(k, val) {
    root.style.setProperty(k.charAt(0) === '-' ? k : '--sl-' + k, String(val));
  }
  function applyTheme(mode) { // 'dark' | 'light'
    if (!mode) return;
    root.classList.toggle('dark', mode === 'dark');
    root.setAttribute('data-theme', mode);
  }
  function applyState(s) {
    if (!s || typeof s !== 'object') return;
    var v = s.values || s.vars;
    if (v) for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k)) setVar(k, v[k]);
    if (s.theme) applyTheme(s.theme);
    if (s.contrast != null) {
      if (s.contrast === 'normal' || s.contrast === false) root.removeAttribute('data-contrast');
      else root.setAttribute('data-contrast', String(s.contrast));
    }
    if (s.fontScale != null) setVar('font-scale', s.fontScale);
    if (s.lang) root.setAttribute('lang', String(s.lang));
    var a = s.attrs;
    if (a) for (var name in a) if (Object.prototype.hasOwnProperty.call(a, name)) {
      if (a[name] == null || a[name] === false) root.removeAttribute(name);
      else root.setAttribute(name, a[name] === true ? '' : String(a[name]));
    }
  }

  // 1) BOOT from the URL — synchronous, before paint.
  try {
    var hash = location.hash || '';
    var m = hash.match(/[#&]slt=([^&]+)/);
    if (m) {
      var b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
      applyState(JSON.parse(decodeURIComponent(escape(atob(b64)))));
    }
    var q = new URLSearchParams(location.search);
    var boot = {};
    if (q.get('theme')) boot.theme = q.get('theme');
    if (q.get('contrast')) boot.contrast = q.get('contrast');
    if (q.get('lang')) boot.lang = q.get('lang');
    if (q.get('fontScale')) boot.fontScale = q.get('fontScale');
    applyState(boot);
  } catch (e) { /* never block the app on a malformed theme payload */ }

  // 2) LIVE updates — generic; the app never writes this.
  try {
    window.addEventListener('message', function (e) {
      var d = e && e.data;
      if (d && d.type === 'smartlinks:root-state') applyState(d);
    });
  } catch (e) {}
})();
