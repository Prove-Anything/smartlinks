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

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

// Pull the bare imports out of a bundle (handles minified `from"x"` too).
function bareImportsOf(code) {
  const specs = new Set();
  const patterns = [
    /\bfrom\s*["']([^"']+)["']/g, // static import/export ... from "x"
    /\bimport\s*["']([^"']+)["']/g, // side-effect import "x"
    /\bimport\(\s*["']([^"']+)["']\s*\)/g, // dynamic import("x")
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(code))) {
      const spec = m[1];
      if (spec.startsWith('.') || spec.startsWith('/')) continue; // internal/relative
      if (/^https?:/.test(spec)) continue; // absolute URL import
      specs.add(spec);
    }
  }
  return [...specs];
}

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

console.log('');
for (const w of warnings) console.log(`${YELLOW}⚠ ${w}${RESET}`);

if (problems.length) {
  console.log(`\n${RED}${BOLD}FAIL${RESET} — ${problems.length} problem${problems.length === 1 ? '' : 's'} outside the shared-dependency contract.`);
  console.log(`${DIM}Externalize only the ${CONTRACT.size} contract specifiers (import { SHARED_DEPENDENCY_SPECIFIERS } from '@proveanything/smartlinks'); bundle everything else.${RESET}`);
  process.exit(1);
}

console.log(`${GREEN}${BOLD}OK${RESET} — bundles conform to shared-dependency contract ${SHARED_DEPENDENCY_CONTRACT_VERSION}.`);
process.exit(0);
