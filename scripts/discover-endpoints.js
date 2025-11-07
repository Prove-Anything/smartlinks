// Lightweight endpoint discovery from the SDK source.
// Scans src/api/**/*.ts for request/post/put/delete calls and extracts path templates.
// Outputs a JSON summary to openapi.paths.generated.json to assist with OpenAPI updates.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_API = path.join(ROOT, 'src', 'api');
const OUT = path.join(ROOT, 'openapi.paths.generated.json');

/** Recursively list files */
function listFiles(dir, extFilter = ['.ts', '.js']) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p, extFilter));
    else if (extFilter.includes(path.extname(entry.name))) out.push(p);
  }
  return out;
}

/** Heuristics to extract method and path */
function discoverInFile(filePath) {
  const tag = path.basename(filePath, path.extname(filePath));
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const results = [];
  let lastPathVar = null; // { name, value, line }

  const pathAssignRe = /const\s+(\w+)\s*=\s*`([^`]+)`/;
  const callWithVarRe = /(request|get|post|put|del|delete)\s*<[^>]*>??\s*\(\s*(\w+)/;
  const callWithTplRe = /(request|get|post|put|del|delete)\s*<[^>]*>??\s*\(\s*`([^`]+)`/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const assign = line.match(pathAssignRe);
    if (assign) {
      lastPathVar = { name: assign[1], value: assign[2], line: i };
      continue;
    }
    const callTpl = line.match(callWithTplRe);
    if (callTpl) {
      const method = normalizeMethod(callTpl[1]);
      results.push({ method, path: callTpl[2], tag, file: filePath, line: i + 1 });
      continue;
    }
    const callVar = line.match(callWithVarRe);
    if (callVar && lastPathVar && callVar[2] === lastPathVar.name && i - lastPathVar.line < 6) {
      const method = normalizeMethod(callVar[1]);
      results.push({ method, path: lastPathVar.value, tag, file: filePath, line: i + 1 });
    }
  }
  return results;
}

function normalizeMethod(m) {
  const v = m.toLowerCase();
  if (v === 'request' || v === 'get') return 'get';
  if (v === 'post') return 'post';
  if (v === 'put') return 'put';
  if (v === 'del' || v === 'delete') return 'delete';
  return 'get';
}

function main() {
  const files = listFiles(SRC_API, ['.ts', '.js']);
  const all = files.flatMap(discoverInFile);
  // Deduplicate by method+path
  const dedup = {};
  for (const r of all) {
    const key = `${r.method} ${r.path}`;
    if (!dedup[key]) dedup[key] = { ...r, tags: new Set([r.tag]) };
    else dedup[key].tags.add(r.tag);
  }
  const out = Object.values(dedup).map(r => ({
    method: r.method,
    path: r.path,
    tags: Array.from(r.tags).sort(),
    example: `${r.method.toUpperCase()} ${r.path}`,
  })).sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), count: out.length, endpoints: out }, null, 2));
  console.log(`Discovered ${out.length} endpoints. Wrote ${path.relative(process.cwd(), OUT)}`);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error(e); process.exit(1); }
}
