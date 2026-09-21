// fix-esm-extensions.js
// -----------------------------------------------------------------------------
// tsc (module: ES6, moduleResolution: node) emits EXTENSIONLESS relative
// specifiers — `from "./http"` instead of `from "./http.js"`. Bundlers tolerate
// this; Node's ESM resolver, tsx, and codegen/CI tooling throw ERR_MODULE_NOT_FOUND.
//
// This post-build pass rewrites every relative import/export/dynamic-import in the
// emitted output to a fully-specified path, resolved against what actually landed
// in dist:
//   "./http"      -> "./http.js"          (a file)
//   "./cache"     -> "./cache/index.js"   (a directory barrel)
//
// Runs after `tsc`, before the doc/codegen steps (so those can import dist under
// plain Node too). Applies to .js (runtime) and .d.ts (NodeNext type resolution).

import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const HAS_EXT = /\.(js|mjs|cjs|json|css|node)$/;

/** Walk a dir tree, yielding every .js / .d.ts file path. */
function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (full.endsWith('.js') || full.endsWith('.d.ts')) yield full;
  }
}

/** Resolve a bare relative specifier to its emitted target, adding the extension. */
function fixSpecifier(spec, fromFile) {
  if (HAS_EXT.test(spec)) return spec; // already explicit
  const base = resolve(dirname(fromFile), spec);
  if (existsSync(`${base}.js`)) return `${spec}.js`;
  if (existsSync(join(base, 'index.js'))) return `${spec}/index.js`;
  // Fall back to .js — covers the case where only the .d.ts sibling is present.
  return `${spec}.js`;
}

// Matches the specifier in: `from "x"`, side-effect `import "x"`, and dynamic `import("x")`.
const PATTERNS = [
  /(\bfrom\s*)(['"])(\.\.?\/[^'"]*)\2/g,
  /(\bimport\s*)(['"])(\.\.?\/[^'"]*)\2/g,
  /(\bimport\(\s*)(['"])(\.\.?\/[^'"]*)\2/g,
];

let filesChanged = 0;
let importsFixed = 0;

for (const file of walk(DIST)) {
  const src = readFileSync(file, 'utf8');
  let out = src;
  for (const re of PATTERNS) {
    out = out.replace(re, (match, lead, quote, spec) => {
      const fixed = fixSpecifier(spec, file);
      if (fixed === spec) return match;
      importsFixed++;
      return `${lead}${quote}${fixed}${quote}`;
    });
  }
  if (out !== src) {
    writeFileSync(file, out);
    filesChanged++;
  }
}

console.log(`  ✓ fix-esm-extensions: ${importsFixed} specifiers rewritten across ${filesChanged} files`);
