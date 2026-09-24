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

// Locate the manifest.
const manifestPath = ['public/app.manifest.json', 'app.manifest.json', 'dist/app.manifest.json']
  .map((p) => join(appDir, p))
  .find(existsSync);
if (!manifestPath) die(`no app.manifest.json found under ${appDir} (looked in public/, ., dist/)`);

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
    // Class usage lives in compiled markup strings — present in every bundle regardless
    // of module format, so scan both umd + esm across all surfaces.
    const used = new Set();
    for (const [, block] of surfaces) {
      for (const p of [block?.files?.js?.umd, block?.files?.js?.esm]) {
        if (!p) continue;
        const bp = resolveBundle(p);
        if (!bp) continue;
        for (const m of readFileSync(bp, 'utf8').matchAll(/\bsl-[a-z0-9-]+/g)) used.add(m[0]);
      }
    }
    const unknown = [...used].filter((c) => !baseSet.has(c)).sort();
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

console.log('');
for (const w of warnings) console.log(`${YELLOW}⚠ ${w}${RESET}`);

if (problems.length) {
  console.log(`\n${RED}${BOLD}FAIL${RESET} — ${problems.length} problem${problems.length === 1 ? '' : 's'} outside the shared-dependency contract.`);
  console.log(`${DIM}Externalize only the ${CONTRACT.size} contract specifiers (import { SHARED_DEPENDENCY_SPECIFIERS } from '@proveanything/smartlinks'); bundle everything else.${RESET}`);
  process.exit(1);
}

console.log(`${GREEN}${BOLD}OK${RESET} — bundles conform to shared-dependency contract ${SHARED_DEPENDENCY_CONTRACT_VERSION}.`);
process.exit(0);
