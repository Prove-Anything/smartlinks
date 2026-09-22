// Extract the *real* bare import specifiers from a (usually minified) ESM bundle.
//
// We LEX the module with es-module-lexer rather than text-scanning, so specifiers only
// come from genuine `import`/`export … from`/`import()` statements. Data that merely
// contains the word `from` — e.g. tailwind-merge's class map `{"gradient-from":[{from:…}]}`
// — can no longer masquerade as an import (the historical false-positive class).
//
// Relative, absolute-path, and http(s) specifiers are dropped (never contract entries);
// `node:` specifiers are kept so the caller can flag them (they must never appear in a
// browser bundle).

import { init, parse } from 'es-module-lexer';

await init;

// Legacy conservative regex — only used if the lexer throws (unexpected for valid ESM).
// Kept so the doctor degrades to "runs, approximately" rather than crashing.
function regexFallback(code) {
  const specs = new Set();
  const patterns = [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(code))) specs.add(m[1]);
  }
  return [...specs].filter(keep);
}

function keep(spec) {
  if (!spec) return false;
  if (spec.startsWith('.') || spec.startsWith('/')) return false; // internal/relative
  if (/^https?:/.test(spec)) return false; // absolute URL import
  return true;
}

/**
 * @param {string} code  ESM bundle source
 * @returns {string[]}   deduped bare import specifiers (may include `node:` ones)
 */
export function bareImportsOf(code) {
  let imports;
  try {
    [imports] = parse(code);
  } catch {
    return regexFallback(code);
  }
  const specs = new Set();
  for (const imp of imports) {
    // `imp.n` is the resolved specifier for static imports, re-exports, and
    // string-literal dynamic imports; undefined for `import(expr)` we can't resolve.
    if (imp.n && keep(imp.n)) specs.add(imp.n);
  }
  return [...specs];
}
