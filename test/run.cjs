// Zero-dependency test runner: transpile TS on the fly (ts-node, already a devDep)
// and let Node's built-in `node:test` collect + report. Run with `npm test`.
// Type-checking is handled separately by `tsc`; tests run transpile-only for speed.
const fs = require('fs')
const path = require('path')

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
})

const dir = __dirname
fs.readdirSync(dir)
  .filter((f) => f.endsWith('.test.ts'))
  .forEach((f) => require(path.join(dir, f)))
