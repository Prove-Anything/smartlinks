#!/usr/bin/env node
// =============================================================================
// smartlinks doctor — verify an app's ESM bundles against the shared-dependency
// contract, so a modern (esm/dual) app can't ship a bare import the host won't
// resolve.
//
// A correctly-built externalized ESM bundle inlines everything EXCEPT the host's
// shared singletons. So every *bare* import left in the output must be a contract
// entry — anything else will either fail to resolve through the import map at
// runtime, or silently pull in a second copy (the duplicate-React class of bug).
//
// Usage:
//   smartlinks-doctor [appDir]      # defaults to cwd
//   npx @proveanything/smartlinks doctor   (once a unified `smartlinks` bin exists)
//
// Exit code: 0 = clean, 1 = violations (CI-friendly).
// =============================================================================

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bareImportsOf } from './lib/bare-imports.mjs';

const here = dirname(fileURLToPath(import.meta.url));

// Read the contract from THIS SDK build — one source of truth with the runtime.
const contractUrl = pathToFileURL(resolve(here, '../dist/shared-dependencies.js')).href;
const { SHARED_DEPENDENCY_SPECIFIERS, SHARED_DEPENDENCY_CONTRACT_VERSION } = await import(contractUrl);
const CONTRACT = new Set(SHARED_DEPENDENCY_SPECIFIERS);

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function die(msg) {
  console.error(`${RED}smartlinks doctor: ${msg}${RESET}`);
  process.exit(1);
}

const appDir = resolve(process.argv[2] || process.cwd());
if (!existsSync(appDir)) die(`app directory not found: ${appDir}`);

// Locate the manifest. The BUILT one (dist/) first: it's what ships, and the build's hash step renames
// bundles (mobile-admin.esm.js → mobile-admin-<hash>.esm.js) and rewrites only dist/app.manifest.json —
// checking the source manifest after a build looked for files that no longer exist under that name.
// The source manifest is the fallback for a doctor run before any build.
const manifestPath = ['dist/app.manifest.json', 'public/app.manifest.json', 'app.manifest.json']
  .map((p) => join(appDir, p))
  .find(existsSync);
if (!manifestPath) die(`no app.manifest.json found under ${appDir} (looked in dist/, public/, .)`);

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (e) {
  die(`could not parse ${manifestPath}: ${e.message}`);
}
const manifestDir = dirname(manifestPath);
const meta = manifest.meta || {};

console.log(`${BOLD}SmartLinks doctor${RESET} ${DIM}— ${appDir}${RESET}`);
console.log(`${DIM}manifest:${RESET} ${manifestPath.replace(appDir + '\\', '').replace(appDir + '/', '')}`);
console.log(`${DIM}contract:${RESET} ${SHARED_DEPENDENCY_CONTRACT_VERSION} (${CONTRACT.size} shared deps)`);
console.log(`${DIM}moduleFormat:${RESET} ${meta.moduleFormat || '(absent → umd)'} · ${DIM}sharedDependencies:${RESET} ${meta.sharedDependencies || '(none)'}\n`);

const problems = [];
const warnings = [];

// Manifest-level sanity.
const format = meta.moduleFormat || 'umd';
const checkEsm = format === 'esm' || format === 'dual';
if (checkEsm && !meta.sharedDependencies) {
  warnings.push(`meta.moduleFormat is "${format}" but meta.sharedDependencies is not declared — set it to "${SHARED_DEPENDENCY_CONTRACT_VERSION}".`);
}
if (meta.sharedDependencies && meta.sharedDependencies !== SHARED_DEPENDENCY_CONTRACT_VERSION) {
  warnings.push(`built against contract ${meta.sharedDependencies}, but this SDK ships ${SHARED_DEPENDENCY_CONTRACT_VERSION} — host may not serve a matching import map.`);
}

// bareImportsOf (scripts/lib/bare-imports.mjs) LEXES the bundle for real import
// statements — so bundled data containing the word `from` (e.g. tailwind-merge's class
// map) is not mistaken for an import.

// Resolve a manifest-relative bundle path against the likely roots (dist paths
// are sometimes relative to the app root, sometimes to the manifest dir).
function resolveBundle(rel) {
  const bases = [manifestDir, appDir, join(appDir, 'public'), join(appDir, 'dist')];
  for (const b of bases) {
    const p = resolve(b, rel);
    if (existsSync(p)) return p;
  }
  return null;
}

// Check each ESM surface declared in the manifest.
const surfaces = [
  ['widgets', manifest.widgets],
  ['containers', manifest.containers],
  ['mobileAdmin', manifest.mobileAdmin],
];

let checkedAny = false;
for (const [name, block] of surfaces) {
  const esm = block?.files?.js?.esm;
  if (!esm) continue;

  // UMD-format app that still declares an ESM bundle: the host won't load it, so
  // it's dead weight and a common scaffold-confusion source — warn, don't fail.
  if (!checkEsm) {
    warnings.push(`${name}: ESM bundle "${esm}" is declared but meta.moduleFormat is "${format}", so the host never loads it. Set moduleFormat to "dual" to use it, or drop the esm entry.`);
    continue;
  }

  checkedAny = true;
  const bundlePath = resolveBundle(esm);
  if (!bundlePath) {
    console.log(`${RED}✗${RESET} ${name} ${DIM}(${esm})${RESET} — declared ESM bundle not found on disk`);
    problems.push({ surface: name, spec: null, msg: `declared ESM bundle not found: ${esm}` });
    continue;
  }
  const code = readFileSync(bundlePath, 'utf8');
  const imports = bareImportsOf(code);
  const offenders = imports.filter((s) => !CONTRACT.has(s));
  const ok = imports.length - offenders.length;

  if (offenders.length === 0) {
    console.log(`${GREEN}✓${RESET} ${name} ${DIM}(${esm})${RESET} — ${ok} bare import${ok === 1 ? '' : 's'}, all in contract`);
  } else {
    console.log(`${RED}✗${RESET} ${name} ${DIM}(${esm})${RESET} — ${offenders.length} outside the contract:`);
    for (const spec of offenders) {
      const hint = spec.startsWith('node:')
        ? 'node built-in — must not appear in a browser bundle'
        : 'not host-provided — bundle it (don\'t externalize) or it will fail to resolve / double-load';
      console.log(`    ${RED}${spec}${RESET} ${DIM}— ${hint}${RESET}`);
      problems.push({ surface: name, spec, msg: hint });
    }
  }
}

if (checkEsm && !checkedAny) {
  warnings.push(`moduleFormat is "${format}" but no surface declares files.js.esm — nothing to check.`);
}
if (!checkEsm && problems.length === 0) {
  console.log(`${DIM}moduleFormat "${format}" — ESM path not in use; UMD bundles resolve shared deps from window globals.${RESET}`);
}

// ---- CSS baseline (sl-baseline) --------------------------------------------
// If the app declares meta.cssBaseline, warn on any `sl-*` class it uses that isn't in
// the declared baseline version — those render nothing once the host's baseline is the
// only source. Heuristic (scans built bundle text for the distinctive `sl-` namespace)
// and WARN-only: it never fails the build.
if (meta.cssBaseline) {
  let baseline = null;
  try {
    baseline = JSON.parse(readFileSync(resolve(here, '../dist/baseline.classes.json'), 'utf8'));
  } catch {
    warnings.push(`meta.cssBaseline is "${meta.cssBaseline}" but this SDK build has no baseline class list to check against.`);
  }
  if (baseline) {
    if (baseline.version !== meta.cssBaseline) {
      warnings.push(`meta.cssBaseline is "${meta.cssBaseline}" but this SDK ships baseline "${baseline.version}" — the host may serve a different set.`);
    }
    const baseSet = new Set(baseline.classes || []);
    // SDK-defined names that aren't baseline helpers but are legitimately in bundles: the Sidekick
    // screen's scope class (mobile-admin-container.md → Styling).
    for (const c of ['sl-mobile-admin']) baseSet.add(c);
    // Class usage lives in compiled markup strings — present in every bundle regardless
    // of module format, so scan both umd + esm across all surfaces.
    // `sl-…` NOT preceded by a word char or hyphen: a class name, never a CSS custom property
    // (`var(--sl-color-accent)`, `--sl-widget-accent`) — those are theme tokens, not classes.
    // Classes the app defines itself (`.sl-foo {…}` in its own CSS) aren't missing either.
    const used = new Set();
    const defined = new Set();
    for (const [, block] of surfaces) {
      for (const p of [block?.files?.js?.umd, block?.files?.js?.esm, block?.files?.css]) {
        if (!p || typeof p !== 'string') continue;
        const bp = resolveBundle(p);
        if (!bp) continue;
        const text = readFileSync(bp, 'utf8');
        for (const m of text.matchAll(/(?<![\w-])sl-[a-z0-9-]+/g)) used.add(m[0]);
        for (const m of text.matchAll(/\.(sl-[a-z0-9-]+)/g)) defined.add(m[1]);
      }
    }
    const ownSl = [...defined].filter((c) => !baseSet.has(c)).sort();
    if (ownSl.length) {
      warnings.push(`the app's own classes use the platform's sl- prefix: ${ownSl.join(', ')} — rename them (e.g. drop the "sl-") so they can't collide with a future baseline class.`);
    }
    const unknown = [...used].filter((c) => !baseSet.has(c) && !defined.has(c)).sort();
    if (used.size === 0) {
      console.log(`${DIM}cssBaseline (${baseline.version}) — declared; no sl-* classes found in the bundles.${RESET}`);
    } else if (unknown.length === 0) {
      console.log(`${GREEN}✓${RESET} cssBaseline ${DIM}(${baseline.version})${RESET} — all ${used.size} sl-* classes used are in the baseline`);
    } else {
      console.log(`${YELLOW}⚠${RESET} cssBaseline ${DIM}(${baseline.version})${RESET} — ${unknown.length} sl-* class${unknown.length === 1 ? '' : 'es'} used but not in the baseline (they will not render):`);
      for (const c of unknown) console.log(`    ${YELLOW}${c}${RESET}`);
      warnings.push(`sl-* classes used but not in cssBaseline "${baseline.version}": ${unknown.join(', ')} — define them in your own CSS, fix the typo, or drop them.`);
    }
  }
}

// ---- Host theming (theme tokens) -------------------------------------------
// If the app declares meta.respectsHostTheme, warn on hardcoded Tailwind PALETTE utilities in
// component SOURCE (e.g. bg-blue-600, text-zinc-900) — those pin a colour instead of following the
// host brand via the semantic tokens (bg-primary, text-foreground, border-border). Scans source,
// not compiled bundles (bundles are full of legitimate hex). Heuristic + WARN-only. See
// docs/theme-tokens.md.
if (meta.respectsHostTheme) {
  const THEME_TOKENS_VERSION = 'v1';
  if (!meta.themeTokens) {
    warnings.push(`meta.respectsHostTheme is true but meta.themeTokens is not declared — set it to "${THEME_TOKENS_VERSION}".`);
  } else if (meta.themeTokens !== THEME_TOKENS_VERSION) {
    warnings.push(`meta.themeTokens is "${meta.themeTokens}" but this SDK ships theme tokens "${THEME_TOKENS_VERSION}".`);
  }

  const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
  const UTIL = 'bg|text|border|ring|divide|from|via|to|fill|stroke|outline|decoration|shadow|accent|caret';
  const paletteRe = new RegExp(`\\b(?:${UTIL})-(?:${PALETTE})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`, 'g');

  const SRC_EXT = /\.(tsx|ts|jsx|js|vue|html|svelte)$/;
  const SKIP_DIR = new Set(['node_modules', 'dist', '.nuxt', '.output', '.git', 'public']);
  function walk(dir, out = []) {
    let entries = [];
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
    for (const e of entries) {
      if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(join(dir, e.name), out); }
      else if (SRC_EXT.test(e.name)) out.push(join(dir, e.name));
    }
    return out;
  }

  const srcRoot = existsSync(join(appDir, 'src')) ? join(appDir, 'src') : appDir;
  const offenders = [];
  let totalHits = 0;
  for (const f of walk(srcRoot)) {
    const hits = [...new Set((readFileSync(f, 'utf8').match(paletteRe) || []))];
    if (hits.length) { offenders.push({ file: f.replace(appDir + '/', '').replace(appDir + '\\', ''), hits }); totalHits += hits.length; }
  }

  if (offenders.length === 0) {
    console.log(`${GREEN}✓${RESET} theme ${DIM}(respectsHostTheme)${RESET} — no hardcoded palette utilities in source`);
  } else {
    console.log(`${YELLOW}⚠${RESET} theme ${DIM}(respectsHostTheme)${RESET} — hardcoded palette utilities in ${offenders.length} file${offenders.length === 1 ? '' : 's'} (use bg-primary / text-foreground / border-border instead):`);
    for (const o of offenders.slice(0, 15)) console.log(`    ${DIM}${o.file}${RESET}  ${YELLOW}${o.hits.slice(0, 6).join(' ')}${o.hits.length > 6 ? ' …' : ''}${RESET}`);
    if (offenders.length > 15) console.log(`    ${DIM}…and ${offenders.length - 15} more file(s)${RESET}`);
    warnings.push(`respectsHostTheme is true but ${totalHits} hardcoded palette utilit${totalHits === 1 ? 'y' : 'ies'} found in source — replace with semantic tokens, or drop respectsHostTheme if the app intentionally brings its own look.`);
  }
}

// ---- containers: a router of their own must be isolated from the host's ------------------------
// Since R5, react-router-dom is SHARED with the host, so a container that wraps itself in a
// MemoryRouter/HashRouter/BrowserRouter inside the host's router throws "You cannot render a <Router>
// inside another <Router>" — unless it resets the parent's router context first (docs/containers.md →
// "Pages that read their context from the URL"). Heuristic on the built bundle names; WARN-only.
{
  const block = manifest.containers;
  for (const p of [block?.files?.js?.esm, block?.files?.js?.umd]) {
    if (!p) continue;
    const bp = resolveBundle(p);
    if (!bp) continue;
    const text = readFileSync(bp, 'utf8');
    const routers = ['MemoryRouter', 'HashRouter', 'BrowserRouter'].filter((r) => new RegExp(`\\b${r}\\b`).test(text));
    if (!routers.length) { console.log(`${GREEN}✓${RESET} containers ${DIM}— no router of their own (the host's is used)${RESET}`); break; }
    if (/\bUNSAFE_LocationContext\b/.test(text)) { console.log(`${GREEN}✓${RESET} containers ${DIM}— own ${routers.join('/')} isolated from the host's router${RESET}`); break; }
    console.log(`${YELLOW}⚠${RESET} containers — ${routers.join('/')} without isolating it from the host's router`);
    warnings.push(`containers bundle renders its own ${routers.join('/')} but never resets the host's router context — inside an R5 host that throws "You cannot render a <Router> inside another <Router>". Wrap it in UNSAFE_LocationContext.Provider + UNSAFE_NavigationContext.Provider value={null} (docs/containers.md), or drop the router and use the host's.`);
    break;
  }
}

// ---- showing another app's widget: use the host's EmbeddedWidget, for widgets it allows -----------
// Hosts (Portal, Hub) pass every app an `EmbeddedWidget` prop (docs/widgets.md → "Using another app's
// widget"). A hand-rolled loader (getWidgets → evaluate the bundle) drifts and breaks; and the host only
// renders first-party widgets and the same publisher's apps, so anything else silently shows nothing.
// Static scan of the source; WARN-only.
{
  const ownId = String(manifest.meta?.appId || '');
  const handleOf = (id) => { const i = id.indexOf('--'); return i > 0 ? id.slice(0, i) : null; };
  const EXT = /\.(tsx|ts|jsx|js)$/;
  const SKIP = new Set(['node_modules', 'dist', '.git', 'public']);
  const files = [];
  (function walkSrc(dir) {
    let entries = [];
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.isDirectory()) { if (!SKIP.has(e.name)) walkSrc(join(dir, e.name)); }
      else if (EXT.test(e.name)) files.push(join(dir, e.name));
    }
  })(existsSync(join(appDir, 'src')) ? join(appDir, 'src') : appDir);
  const rel = (f) => (f.startsWith(appDir) ? f.slice(appDir.length + 1) : f);
  const handRolled = [];
  const blocked = new Set();
  let embeds = 0;
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    if (/\bgetWidgets\s*\(/.test(text) && /(new\s+Blob\s*\(|new\s+Function\s*\(|createRequireShim|import\s*\(\s*\/\*\s*@vite-ignore)/.test(text)) handRolled.push(rel(f));
    for (const m of text.matchAll(/<EmbeddedWidget\b[^>]*?\bappId\s*=\s*\{?\s*["'`]([A-Za-z0-9._-]+)["'`]/g)) {
      embeds++;
      const id = m[1];
      const owner = handleOf(id);
      if (id === ownId || (owner !== null && owner !== handleOf(ownId))) blocked.add(id);
    }
  }
  if (handRolled.length) {
    console.log(`${YELLOW}⚠${RESET} embedded widgets — a hand-rolled widget loader in ${handRolled.slice(0, 3).join(', ')}`);
    warnings.push(`${handRolled.join(', ')} load${handRolled.length === 1 ? 's' : ''} another app's widget bundle by hand (getWidgets + evaluating it). Use the host's EmbeddedWidget prop instead: <EmbeddedWidget appId="…" /> (docs/widgets.md → "Using another app's widget").`);
  }
  if (blocked.size) {
    console.log(`${YELLOW}⚠${RESET} embedded widgets — the host won't show: ${[...blocked].join(', ')}`);
    warnings.push(`EmbeddedWidget for ${[...blocked].join(', ')} will render nothing: hosts only show first-party widgets and the same publisher's apps${ownId ? ` (this app is "${ownId}")` : ''}, and never the app itself.`);
  }
  if (embeds && !handRolled.length && !blocked.size) console.log(`${GREEN}✓${RESET} embedded widgets ${DIM}— ${embeds} via the host's EmbeddedWidget${RESET}`);
}

// ---- realtime: SL.realtime, never a provider library or key in the app ---------------------------
// SmartLinks Realtime (docs/realtime.md) hands out the stream and checks every publish; an app that talks
// to the provider directly bypasses the channel rules (and a provider key in a bundle is a key for all).
{
  const EXT = /\.(tsx|ts|jsx|js)$/;
  const SKIP = new Set(['node_modules', 'dist', '.git', 'public']);
  const hitsRt = [];
  (function walkRt(dir) {
    let entries = [];
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.isDirectory()) { if (!SKIP.has(e.name)) walkRt(join(dir, e.name)); }
      else if (EXT.test(e.name)) {
        const f = join(dir, e.name);
        const text = readFileSync(f, 'utf8');
        if (/from\s+['"]ably(\/[^'"]*)?['"]|require\(\s*['"]ably['"]\s*\)|ABLY_(API_)?KEY/.test(text)) hitsRt.push(f.startsWith(appDir) ? f.slice(appDir.length + 1) : f);
      }
    }
  })(existsSync(join(appDir, 'src')) ? join(appDir, 'src') : appDir);
  if (hitsRt.length) {
    console.log(`${YELLOW}⚠${RESET} realtime — talks to the realtime provider directly in ${hitsRt.slice(0, 3).join(', ')}`);
    warnings.push(`${hitsRt.join(', ')} use${hitsRt.length === 1 ? 's' : ''} the realtime provider (Ably) directly. Use SL.realtime instead — declare channels in the manifest (realtime.channels) and use realtime.channel() / onChange() (docs/realtime.md); never put a provider key in an app.`);
  }
}

// ---- admin cards: declared right, cached, and backed by an admin function ---------------------
// docs/admin-cards.md. A data card with no function (or a public one) can't load; a card with no
// refresh rule falls back to a 6h maxAge, which is rarely what's wanted.
if (manifest.adminCards) {
  const cards = Array.isArray(manifest.adminCards.cards) ? manifest.adminCards.cards : [];
  const fns = new Map(((manifest.functions && manifest.functions.definitions) || []).map((f) => [f && f.name, f]));
  const SIZES = new Set(['small', 'medium', 'wide', 'full']);
  const ON = /^(records(:[A-Za-z0-9._-]{1,60})?|products|proofs|assets|apps|collection|settings(:[A-Za-z0-9._-]{1,60})?)$/;
  const cardProblems = [];
  const before = warnings.length;
  const seen = new Set();
  if (!cards.length) warnings.push('adminCards is declared but has no cards.');
  for (const c of cards) {
    const id = c && typeof c.id === 'string' ? c.id : '';
    const label = `admin card "${id || '?'}"`;
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(id)) { cardProblems.push(`${label}: id must be 1–40 letters, digits, "-" or "_".`); continue; }
    if (seen.has(id)) cardProblems.push(`${label}: declared twice.`);
    seen.add(id);
    if (!c.title) warnings.push(`${label}: has no title.`);
    const kind = c.kind || 'data';
    if (kind !== 'data' && kind !== 'component') cardProblems.push(`${label}: kind must be "data" or "component".`);
    if (kind === 'data' && !c.function) cardProblems.push(`${label}: a data card needs a "function" (an admin server function returning its payload).`);
    if (c.function) {
      const fn = fns.get(c.function);
      if (!fn) cardProblems.push(`${label}: function "${c.function}" isn't in functions.definitions.`);
      else if ((fn.trigger && fn.trigger.type) !== 'http') cardProblems.push(`${label}: function "${c.function}" must be an http function.`);
      else if ((fn.visibility || 'admin') !== 'admin') cardProblems.push(`${label}: function "${c.function}" must have visibility "admin" — card data is for the collection's admins.`);
    }
    if (kind === 'component') {
      if (!c.component) cardProblems.push(`${label}: a component card needs "component" (the export name in the adminCards bundle).`);
      if (!manifest.adminCards.files || !manifest.adminCards.files.js) cardProblems.push(`${label}: component cards need adminCards.files (the adminCards bundle).`);
      if (!c.function) warnings.push(`${label}: give the component a "function" too — it then gets cached data as a prop instead of fetching on every dashboard load.`);
    }
    for (const s of c.sizes || []) if (!SIZES.has(s)) cardProblems.push(`${label}: unknown size "${s}" (small, medium, wide, full).`);
    const refresh = c.refresh || {};
    for (const on of refresh.on || []) if (!ON.test(String(on))) cardProblems.push(`${label}: refresh.on "${on}" isn't a change kind (records, records:<type>, products, proofs, assets, apps, collection, settings, settings:<group>).`);
    if (!(refresh.on || []).length && refresh.maxAge == null) {
      warnings.push(`${label}: no refresh rule — it's recomputed every 6h. Add refresh.on (what its data depends on, e.g. "records:question") so it updates when that changes and never otherwise.`);
    }
  }
  for (const msg of cardProblems) problems.push({ surface: 'adminCards', spec: null, msg });
  if (cardProblems.length) {
    console.log(`${RED}✗${RESET} admin cards`);
    for (const msg of cardProblems) console.log(`    ${RED}${msg}${RESET}`);
  } else if (warnings.length === before) console.log(`${GREEN}✓${RESET} admin cards ${DIM}— ${cards.length} card${cards.length === 1 ? '' : 's'}, each backed and cached${RESET}`);
  else console.log(`${YELLOW}⚠${RESET} admin cards — see below`);
}

// ---- package.json scripts point at files that exist ------------------------------------------
// An upgrade that copies a script LINE but not the script FILE breaks every build at that step
// (e.g. `postbuild: node scripts/smartlinks-deploy.mjs` with no scripts/smartlinks-deploy.mjs).
// WARN — the doctor runs inside the build, and a skipped hook (Forge builds skip pre/post) is harmless.
try {
  const pkg = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'));
  const missing = [];
  for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
    if (typeof cmd !== 'string') continue;
    for (const m of cmd.matchAll(/(?:^|[;&|]\s*|\s)(?:node|tsx|ts-node|bash|sh)\s+(?:-{1,2}[\w-]+(?:=\S+)?\s+)*((?:\.{1,2}\/)?[\w./-]+\.(?:mjs|cjs|js|ts|sh))\b/g)) {
      if (!existsSync(join(appDir, m[1]))) missing.push(`"${name}" runs ${m[1]}`);
    }
  }
  if (missing.length) {
    console.log(`${YELLOW}⚠${RESET} package.json scripts — ${missing.length} point${missing.length === 1 ? 's' : ''} at a file that doesn't exist:`);
    for (const x of missing) console.log(`    ${YELLOW}${x}${RESET}`);
    warnings.push(`package.json ${missing.join('; ')} — but the file is missing. Add the file, or remove the script (a pre/post hook like postbuild fails every \`npm run build\` without it).`);
  } else {
    console.log(`${GREEN}✓${RESET} package.json scripts ${DIM}— every script file they run exists${RESET}`);
  }
} catch {
  /* no package.json — not an npm app */
}

console.log('');
for (const w of warnings) console.log(`${YELLOW}⚠ ${w}${RESET}`);

if (problems.length) {
  const contractProblems = problems.filter((p) => p.surface !== 'adminCards').length;
  const cardCount = problems.length - contractProblems;
  if (contractProblems) {
    console.log(`\n${RED}${BOLD}FAIL${RESET} — ${contractProblems} problem${contractProblems === 1 ? '' : 's'} outside the shared-dependency contract.`);
    console.log(`${DIM}Externalize only the ${CONTRACT.size} contract specifiers (import { SHARED_DEPENDENCY_SPECIFIERS } from '@proveanything/smartlinks'); bundle everything else.${RESET}`);
  }
  if (cardCount) console.log(`\n${RED}${BOLD}FAIL${RESET} — ${cardCount} admin card problem${cardCount === 1 ? '' : 's'} (docs/admin-cards.md).`);
  process.exit(1);
}

console.log(`${GREEN}${BOLD}OK${RESET} — bundles conform to shared-dependency contract ${SHARED_DEPENDENCY_CONTRACT_VERSION}.`);
process.exit(0);
