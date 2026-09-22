// Zero-dependency test runner: transpile TS on the fly (ts-node) and let Node's
// built-in `node:test` collect + report. Run with `npm test`.
// Type-checking is handled separately by `tsc`; tests run transpile-only for speed.
//
// The package is `"type": "module"` (for the published ESM build), which would make
// Node treat these .ts files as ESM and reject `require()`. `moduleTypes` tells ts-node
// to compile the tests + src as CommonJS regardless, so the require()-based collection
// keeps working. Tests that need a real ESM module load it via dynamic import().
const fs = require('fs')
const path = require('path')

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
  moduleTypes: { '**/*': 'cjs' },
})

const dir = __dirname
fs.readdirSync(dir)
  .filter((f) => f.endsWith('.test.ts'))
  .forEach((f) => require(path.join(dir, f)))
