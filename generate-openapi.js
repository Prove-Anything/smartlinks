// generate-openapi.js
// Generates openapi.yaml from src/api/*.ts and src/types/*.ts source files.
// Run: node generate-openapi.js
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT  = __dirname;
const SRC   = path.join(ROOT, 'src');
const APIS  = path.join(SRC, 'api');
const TYPES = path.join(SRC, 'types');
const OUT   = path.join(ROOT, 'openapi.yaml');

// ─────────────────────────────────────────────────────────────────────────────
// YAML serializer (no external deps)
// ─────────────────────────────────────────────────────────────────────────────

function quoteYaml(s) {
  if (typeof s !== 'string') return String(s);
  const needsQuote =
    !s ||
    /[:{}\[\]|>&*#"'!%@`]/.test(s) ||
    /\n/.test(s) ||
    /^\s|\s$/.test(s) ||
    s === 'true' || s === 'false' || s === 'null' || s === 'yes' || s === 'no' ||
    /^[?-] /.test(s) ||
    (/^\d/.test(s) && isNaN(Number(s)));
  return needsQuote ? JSON.stringify(s) : s;
}

// appendKV writes "pfx + key: value\n" (possibly multi-line) to lines.
// pfx is the full leading text before the key: e.g. '  ', '      - ', '        '
// childIndent is derived from pfx.length so nested content indents correctly.
function appendKV(lines, k, v, pfx) {
  // Child content is at column pfx.length + 2 = (pfx.length/2 + 1) indent levels.
  // For pfx='  ' (2 chars): childIndent = 2.  For pfx='    - ' (6 chars): childIndent = 4.
  const childIndent = pfx.length / 2 + 1;

  if (v === null || v === undefined) {
    lines.push(`${pfx}${k}: null`);
  } else if (Array.isArray(v)) {
    if (!v.length) {
      lines.push(`${pfx}${k}: []`);
    } else {
      lines.push(`${pfx}${k}:`);
      appendYaml(lines, v, childIndent);
    }
  } else if (typeof v === 'object') {
    const e = Object.entries(v).filter(([, x]) => x !== undefined);
    if (!e.length) {
      lines.push(`${pfx}${k}: {}`);
    } else {
      lines.push(`${pfx}${k}:`);
      appendYaml(lines, v, childIndent);
    }
  } else {
    const scalar = typeof v === 'boolean' || typeof v === 'number'
      ? String(v)
      : quoteYaml(String(v));
    lines.push(`${pfx}${k}: ${scalar}`);
  }
}

function appendYaml(lines, val, indent) {
  const sp  = '  '.repeat(indent);
  const li  = sp + '- ';
  const lsp = '  '.repeat(indent + 1);  // continuation of list item props (same column as key after '- ')

  if (val === null || val === undefined) { lines.push('null'); return; }
  if (typeof val === 'boolean') { lines.push(String(val)); return; }
  if (typeof val === 'number')  { lines.push(String(val)); return; }
  if (typeof val === 'string')  { lines.push(quoteYaml(val)); return; }

  if (Array.isArray(val)) {
    for (const item of val) {
      if (item === null || typeof item !== 'object') {
        lines.push(`${li}${item === null ? 'null' : quoteYaml(String(item))}`);
      } else if (Array.isArray(item)) {
        lines.push(`${li}`);
        appendYaml(lines, item, indent + 1);
      } else {
        const entries = Object.entries(item).filter(([, v]) => v !== undefined);
        if (!entries.length) { lines.push(`${li}{}`); continue; }
        let first = true;
        for (const [k, v] of entries) {
          appendKV(lines, k, v, first ? li : lsp);
          first = false;
        }
      }
    }
    return;
  }

  // object
  const entries = Object.entries(val).filter(([, v]) => v !== undefined);
  if (!entries.length) { lines.push(`${sp}{}`); return; }
  for (const [k, v] of entries) {
    appendKV(lines, k, v, sp);
  }
}

function dumpYaml(obj) {
  const lines = [];
  appendYaml(lines, obj, 0);
  return lines.join('\n') + '\n';
}

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript → JSON Schema conversion (best-effort)
// ─────────────────────────────────────────────────────────────────────────────

function tsToSchema(t, known) {
  if (!t) return {};
  t = t.trim().replace(/\s+/g, ' ');

  if (t === 'string')   return { type: 'string' };
  if (t === 'number')   return { type: 'number' };
  if (t === 'integer')  return { type: 'integer' };
  if (t === 'boolean')  return { type: 'boolean' };
  if (t === 'null')     return { nullable: true };
  if (t === 'void' || t === 'never' || t === 'undefined') return {};
  if (t === 'any' || t === 'unknown') return {};  // any type — no schema constraint
  if (t === 'object' || t === '{}')
    return { type: 'object', additionalProperties: true };

  // Array: T[] or Array<T>
  const arr = t.match(/^(.+)\[\]$/) || t.match(/^Array<(.+)>$/);
  if (arr) return { type: 'array', items: tsToSchema(arr[1].trim(), known) };

  // Record<K, V>
  const rec = t.match(/^Record<[^,]+,\s*(.+)>$/);
  if (rec) {
    const vSchema = tsToSchema(rec[1].trim(), known);
    return vSchema && Object.keys(vSchema).length
      ? { type: 'object', additionalProperties: vSchema }
      : { type: 'object', additionalProperties: true };
  }

  // Promise<T>
  const prom = t.match(/^Promise<(.+)>$/);
  if (prom) return tsToSchema(prom[1].trim(), known);

  // Partial<T>, Omit<T,...>, Pick<T,...>, Required<T>, etc.
  const wrapper = t.match(/^(?:Partial|Required|Readonly|NonNullable|Omit|Pick)<(\w+)[^>]*>$/);
  if (wrapper) return known.has(wrapper[1])
    ? { $ref: `#/components/schemas/${wrapper[1]}` }
    : { type: 'object', additionalProperties: true };

  // String literal union: 'a' | 'b' | 'c'
  if (/'[^']+'/.test(t) && t.includes('|')) {
    const vals = [...t.matchAll(/'([^']+)'/g)].map(m => m[1]);
    if (vals.length) return { type: 'string', enum: vals };
  }

  // Single string literal: 'a'
  const singleLiteral = t.match(/^'([^']+)'$/);
  if (singleLiteral) {
    return { type: 'string', enum: [singleLiteral[1]] };
  }

  // Non-literal union: T1 | T2
  if (t.includes(' | ')) {
    const parts = t.split(' | ').map(p => p.trim()).filter(p => p !== 'null' && p !== 'undefined' && p !== 'void');
    if (parts.length === 1) return tsToSchema(parts[0], known);
    const allKnown = parts.every(p => known.has(p));
    if (allKnown) return { oneOf: parts.map(p => ({ $ref: `#/components/schemas/${p}` })) };
    return { type: 'object', additionalProperties: true };
  }

  // Known type → $ref
  if (known.has(t)) return { $ref: `#/components/schemas/${t}` };

  // Generic type e.g. PaginatedResponse<Foo>
  const gen = t.match(/^(\w+)<.+>$/);
  if (gen && known.has(gen[1])) return { $ref: `#/components/schemas/${gen[1]}` };
  if (gen) return { type: 'object', additionalProperties: true };

  // PascalCase — assume a type reference
  if (/^[A-Z]/.test(t) && /^\w+$/.test(t)) return { $ref: `#/components/schemas/${t}` };

  return { type: 'object', additionalProperties: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Balanced brace extraction
// ─────────────────────────────────────────────────────────────────────────────

function extractBlock(content, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { depth--; if (depth === 0) return content.slice(startIdx, i + 1); }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSDoc description extractor
// ─────────────────────────────────────────────────────────────────────────────

function jsDocBefore(content, idx) {
  const prev = content.slice(Math.max(0, idx - 1000), idx);
  const m = prev.match(/\/\*\*([\s\S]*?)\*\/\s*(?:export\s+)?$/);
  if (!m) return '';
  const full = m[1]
    .split('\n')
    .map(l => l.replace(/^\s*\*\s?/, '').trim())
    .filter(l => l && !l.startsWith('@') && !l.startsWith('*') && !l.startsWith('```'))
    .join(' ')
    .trim();
  // Return only the first sentence (up to first period+space or 120 chars)
  const firstSentence = full.replace(/```[\s\S]*?```/g, '').trim();
  const dot = firstSentence.search(/\.(?:\s|$)/);
  return dot > 0 ? firstSentence.slice(0, dot + 1).trim() : firstSentence.slice(0, 120).trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Path helpers
// ─────────────────────────────────────────────────────────────────────────────

function toOaPath(tpl) {
  return tpl
    // Strip ternary expressions like ${qs ? `?${qs}` : ''} or ${query ? `?...` : ""}
    .replace(/\$\{[^}?]*\?[^`}]*`?[^`}]*`?[^}]*\}/g, '')
    // Strip naked conditional tails like ${qs ? or ${query ?  (partial captures from nested template literal)
    .replace(/\$\{[^}]*\?.*$/g, '')
    // Convert ${encodeURIComponent(x)} → {x}
    .replace(/\$\{encodeURIComponent\((\w+)\)\}/g, '{$1}')
    // Convert ${x} → {x}
    .replace(/\$\{(\w+)\}/g, '{$1}')
    // Strip any remaining ${...} or partial ${ expressions
    .replace(/\$\{[^}]*\}?/g, '')
    // Strip query string
    .replace(/[?#].*$/, '')
    // Strip trailing slash
    .replace(/\/$/, '');
}

function extractPathParams(oaPath) {
  return [...oaPath.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
}

function extractQueryParams(body) {
  const seen = new Set();
  const re = /\.set\s*\(\s*['"](\w[-\w]*)['"]/g;
  let m;
  const params = [];
  while ((m = re.exec(body)) !== null) {
    if (!seen.has(m[1])) { seen.add(m[1]); params.push(m[1]); }
  }
  return params;
}

// ─────────────────────────────────────────────────────────────────────────────
// Function signature parser → [{name, type, optional}]
// ─────────────────────────────────────────────────────────────────────────────

function parseSignatureParams(sig) {
  const params = [];
  let depth = 0, start = 0;
  for (let i = 0; i <= sig.length; i++) {
    const c = sig[i];
    if ('<({'.includes(c)) depth++;
    else if ('>)}'.includes(c)) depth--;
    else if ((c === ',' || i === sig.length) && depth === 0) {
      const raw = sig.slice(start, i).trim();
      if (raw) {
        const ci = raw.indexOf(':');
        if (ci > -1) {
          params.push({
            name: raw.slice(0, ci).trim().replace(/\?$/, ''),
            type: raw.slice(ci + 1).trim().replace(/\s*=\s*.+$/, ''),  // strip default value
            optional: raw.slice(0, ci).includes('?'),
          });
        }
      }
      start = i + 1;
    }
  }
  return params;
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema extraction from types files
// ─────────────────────────────────────────────────────────────────────────────

function parseInterfacePropLine(line, known) {
  // Match: [readonly] propName[?]: type   (stops before //comments)
  const m = line.match(/^(?:readonly\s+)?(['"]?\w[\w.]*['"]?)(\?)?:\s*(.+?)\s*(?:\/\/.*)?[;,]?\s*$/);
  if (!m) return null;
  const name = m[1].replace(/^['"]|['"]$/g, '');
  const optional = !!m[2];
  let typeStr = m[3].trim().replace(/;$/, '').replace(/,$/, '').trim();
  if (typeStr.includes('=>')) return null;  // method sig
  if (name.startsWith('['))   return null;  // index sig
  if (name.startsWith('//'))  return null;
  return { name, optional, schema: tsToSchema(typeStr, known) };
}

function extractInterfaceSchema(content, matchIdx, matchStr, known) {
  const braceStart = matchIdx + matchStr.length - 1;
  const block = extractBlock(content, braceStart);
  if (!block) return null;

  const properties = {};
  const required = [];
  const lines = block.slice(1, -1).split('\n');

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
    const prop = parseInterfacePropLine(trimmed, known);
    if (!prop) continue;
    properties[prop.name] = prop.schema;
    if (!prop.optional) required.push(prop.name);
  }

  const schema = { type: 'object', properties };
  if (required.length) schema.required = required;
  return schema;
}

function collectKnownTypes() {
  const types = new Set();
  [TYPES, APIS].forEach(dir => {
    fs.readdirSync(dir)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts')
      .forEach(f => {
        const content = fs.readFileSync(path.join(dir, f), 'utf8');
        const re = /export (?:interface|type|class|enum) (\w+)/g;
        let m;
        while ((m = re.exec(content)) !== null) types.add(m[1]);
      });
  });
  return types;
}

function extractAllSchemas(known) {
  const schemas = {};

  const processFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Interfaces
    const ifRe = /export interface (\w+)(?:<[^>]+>)?(?:\s+extends[^{]+)?\s*\{/g;
    let m;
    while ((m = ifRe.exec(content)) !== null) {
      const name = m[1];
      if (schemas[name]) continue;
      const schema = extractInterfaceSchema(content, m.index, m[0], known);
      if (schema) schemas[name] = schema;
    }

    // Simple type aliases (unions/primitives/strings — not object types)
    const typeRe = /export type (\w+)\s*=\s*([^;\n{][^;{]*);/g;
    while ((m = typeRe.exec(content)) !== null) {
      const name = m[1];
      if (schemas[name]) continue;
      const def = m[2].trim();
      if (!def.includes('{') && !def.startsWith('(')) {
        const s = tsToSchema(def, known);
        if (Object.keys(s).length) schemas[name] = s;
      }
    }

    // Inline object type aliases: export type Foo = { ... }
    const objTypeRe = /export type (\w+)\s*=\s*\{/g;
    while ((m = objTypeRe.exec(content)) !== null) {
      const name = m[1];
      if (schemas[name]) continue;
      const schema = extractInterfaceSchema(content, m.index, `export type ${name} = {`, known);
      if (schema) schemas[name] = schema;
    }
  };

  fs.readdirSync(TYPES)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .forEach(f => processFile(path.join(TYPES, f)));

  fs.readdirSync(APIS)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .forEach(f => processFile(path.join(APIS, f)));

  return schemas;
}

// ─────────────────────────────────────────────────────────────────────────────
// API endpoint extraction
// ─────────────────────────────────────────────────────────────────────────────

// Convert a raw path string (template literal contents) to an OpenAPI path.
// Also handles appObjects-style basePath() calls by resolving them.
function resolveRawPath(rawPath, helperDefs) {
  if (!rawPath) return null;

  // If path references a helper function like basePath(...), resolve it
  const helperCall = rawPath.match(/(\w+)\s*\(([^)]*)\)/);
  if (helperCall && typeof helperDefs[helperCall[1]] === 'string') {
    const helperBody = helperDefs[helperCall[1]];
    // Extract the template literal from the helper body
    const tplM = helperBody.match(/`([^`]+)`/);
    if (tplM) {
      // Simplify: replace 'admin' | 'public' zone with {zone} or just 'public'
      let resolved = tplM[1]
        .replace(/\$\{zone\}/g, '{zone}')
        .replace(/\$\{admin \? 'admin' : 'public'\}/g, '{zone}')
        .replace(/\$\{[^}]+\? 'admin' : 'public'\}/g, '{zone}');
      // Strip off the rest of rawPath that may append to the helper result
      const afterHelper = rawPath.slice(helperCall[0].length).trim();
      const continuation = afterHelper.replace(/^\s*\+\s*/, '').replace(/^`/, '').replace(/`$/, '');
      return resolved + continuation;
    }
  }

  return rawPath;
}

// Extract helper function bodies (e.g. basePath) from a file's content
function extractHelpers(content) {
  const helpers = Object.create(null);  // null prototype avoids toString/constructor etc. matching
  const re = /function (\w+)\s*\([^)]*\)[^{]*\{/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const block = extractBlock(content, m.index + m[0].length - 1);
    if (block) helpers[m[1]] = block;
  }
  return helpers;
}

function parseApiFile(filePath, known) {
  const content = fs.readFileSync(filePath, 'utf8');
  const endpoints = [];

  // Namespace(s): a file may have nested namespaces (e.g. app.cases in appObjects.ts)
  // We collect the outermost namespace + any nested ones
  const nsM = content.match(/export namespace (\w+)\s*\{/);
  const outerNs = nsM ? nsM[1] : path.basename(filePath, '.ts');

  // Helper function definitions (e.g. basePath)
  const helpers = extractHelpers(content);

  // Find all exported functions (including those inside nested namespaces)
  const funcRe = /export\s+(?:async\s+)?function\s+(\w+)\s*\(/g;
  let fm;

  while ((fm = funcRe.exec(content)) !== null) {
    const funcName = fm[1];
    const funcStart = fm.index;

    // Skip pure helper functions that aren't API calls
    if (['encodeQuery', 'buildQueryString', 'basePath', 'baseUrl', 'buildPath'].includes(funcName)) continue;

    // Determine the namespace tag for this function by looking at what namespace block contains it
    let tag = outerNs;
    // Look for closest enclosing "export namespace X" before this function
    const before = content.slice(0, funcStart);
    const nsMatches = [...before.matchAll(/export namespace (\w+)\s*\{/g)];
    if (nsMatches.length) {
      // Use the last (innermost) namespace name
      tag = nsMatches[nsMatches.length - 1][1];
    }

    // Find the opening paren and navigate to the function body
    let parenDepth = 1;
    let pi = fm.index + fm[0].length; // right after the '('
    while (parenDepth > 0 && pi < content.length) {
      if (content[pi] === '(') parenDepth++;
      else if (content[pi] === ')') parenDepth--;
      pi++;
    }
    // pi is now just past the closing ')'

    // Get signature (between the parens)
    const sigStart = content.indexOf('(', fm.index + fm[0].length - 1) + 1;
    const sig = content.slice(sigStart, pi - 1);
    const sigParams = parseSignatureParams(sig);

    // Find function body
    const braceIdx = content.indexOf('{', pi - 1);
    if (braceIdx === -1 || braceIdx > pi + 200) continue;
    const block = extractBlock(content, braceIdx);
    if (!block) continue;
    const body = block.slice(1, -1);

    // Extract JSDoc description
    const description = jsDocBefore(content, funcStart);

    // ── Find the HTTP call ──────────────────────────────────────────────────
    let httpMethod, responseType, rawPathStr;

    // Pattern A: return verb<T>(`/path`, ...)  or  return verb<T>(path, ...)
    const httpRe = /\b(post|patch|del|request|requestWithOptions|put)\s*<([^>]+)>\s*\(\s*(`[^`]+`|"[^"]+"|'[^']+'|\w+)/g;
    let hm;
    while ((hm = httpRe.exec(body)) !== null) {
      const verb = hm[1];
      const firstArg = hm[3].trim();
      httpMethod = verb === 'post' ? 'post'
                 : verb === 'put'  ? 'put'
                 : verb === 'patch' ? 'patch'
                 : verb === 'del'  ? 'delete'
                 : 'get';
      responseType = hm[2].trim();

      if (/^[`'"']/.test(firstArg)) {
        rawPathStr = firstArg.replace(/^[`'"]+|[`'"]+$/g, '');
      } else {
        // It's a variable name — find its definition
        const pathVarRe = new RegExp(`const\\s+${firstArg}\\s*=\\s*(?:(\`[^\`]+\`)|("[^"]+")|(\'[^\']+\')|([^\\n;]+))`, '');
        const pvm = body.match(pathVarRe);
        if (pvm) {
          const val = (pvm[1] || pvm[2] || pvm[3] || pvm[4] || '').trim();
          // May contain template literals or helper calls
          if (/^[`'"']/.test(val)) {
            rawPathStr = val.replace(/^[`'"]+|[`'"]+$/g, '');
          } else {
            // Could be a helper call like basePath(...) + '/suffix'
            rawPathStr = val;
          }
        }
      }
      if (rawPathStr) break;
    }

    // Pattern B: two-step — const path = `...`; return verb<T>(path, ...)
    if (!rawPathStr) {
      const pathDef = body.match(/const\s+(?:path|url|endpoint)\s*=\s*(`[^`]+`|"[^"]+"|'[^']+'|[^\n;]+)/);
      const verbM   = body.match(/\b(post|patch|del|request|requestWithOptions|put)\s*<([^>]+)>/);
      if (pathDef && verbM) {
        const val = pathDef[1].trim();
        rawPathStr = /^[`'"']/.test(val)
          ? val.replace(/^[`'"]+|[`'"]+$/g, '')
          : val;
        const verb = verbM[1];
        httpMethod = verb === 'post' ? 'post' : verb === 'put' ? 'put' : verb === 'patch' ? 'patch' : verb === 'del' ? 'delete' : 'get';
        responseType = verbM[2].trim();
      }
    }

    if (!httpMethod || !rawPathStr) continue;

    // Resolve helper-based paths (e.g. basePath(...))
    const resolvedPath = resolveRawPath(rawPathStr, helpers);
    if (!resolvedPath) continue;

    const oaPath = toOaPath(resolvedPath);
    if (!oaPath.startsWith('/')) continue;

    // Determine security
    const requiresAuth =
      oaPath.startsWith('/admin/') ||
      oaPath.startsWith('/public/auth/') ||
      oaPath.includes('/comm/log') ||
      oaPath.includes('/comm/query');
    const security = requiresAuth ? [{ bearerAuth: [] }] : [];

    // Path & query params
    const pParams = extractPathParams(oaPath);
    const qParams = extractQueryParams(body);

    // Request body type
    let reqBodyType = null;
    if (httpMethod === 'post' || httpMethod === 'patch' || httpMethod === 'put') {
      // First look for param named body/data/payload/input
      const bodyParam = sigParams.find(p =>
        ['body', 'data', 'payload', 'input', 'request', 'req', 'options'].includes(p.name)
      );
      if (bodyParam) {
        reqBodyType = bodyParam.type;
      } else {
        // Use last non-primitive param that isn't clearly a path/id param
        const idNames = new Set(['collectionId', 'id', 'productId', 'proofId', 'clientId', 'broadcastId', 'caseId', 'threadId', 'recordId', 'appId']);
        const candidates = sigParams.filter(p => !idNames.has(p.name) && !['string', 'number', 'boolean'].includes(p.type));
        if (candidates.length) reqBodyType = candidates[candidates.length - 1].type;
      }
    }

    endpoints.push({
      tag,
      funcName,
      description,
      method: httpMethod,
      path: oaPath,
      responseType: responseType || 'object',
      reqBodyType,
      pParams,
      qParams,
      security,
    });
  }

  return endpoints;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build the OpenAPI spec object
// ─────────────────────────────────────────────────────────────────────────────

function buildSpec() {
  const known = collectKnownTypes();
  const schemas = extractAllSchemas(known);

  const allEndpoints = [];
  fs.readdirSync(APIS)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .sort()
    .forEach(f => {
      try {
        allEndpoints.push(...parseApiFile(path.join(APIS, f), known));
      } catch (err) {
        console.warn(`  Warning: error parsing ${f}: ${err.message}`);
      }
    });

  // Dedupe: if two functions map to the same path+method, keep first
  const seen = new Set();
  const deduped = allEndpoints.filter(ep => {
    const key = `${ep.method}:${ep.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Group by path
  const pathMap = {};
  for (const ep of deduped) {
    if (!pathMap[ep.path]) pathMap[ep.path] = {};
    pathMap[ep.path][ep.method] = ep;
  }

  // Collect tags (unique namespace names in occurrence order)
  const tagOrder = [];
  const tagSeen = new Set();
  for (const ep of deduped) {
    if (!tagSeen.has(ep.tag)) { tagOrder.push(ep.tag); tagSeen.add(ep.tag); }
  }

  // Build paths section
  const paths = {};
  for (const oaPath of Object.keys(pathMap).sort()) {
    const methods = pathMap[oaPath];
    paths[oaPath] = {};

    for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
      const ep = methods[method];
      if (!ep) continue;

      const parameters = [];
      for (const pp of ep.pParams) {
        parameters.push({ name: pp, in: 'path', required: true, schema: { type: 'string' } });
      }
      for (const qp of ep.qParams) {
        parameters.push({ name: qp, in: 'query', required: false, schema: { type: 'string' } });
      }

      const responseSchema = ep.responseType && ep.responseType !== 'void'
        ? tsToSchema(ep.responseType, known)
        : { type: 'object', additionalProperties: true };

      const operation = {
        tags: [ep.tag],
        summary: ep.description || `${ep.tag}.${ep.funcName}`,
        operationId: `${ep.tag}_${ep.funcName}`,
        security: ep.security,
        ...(parameters.length && { parameters }),
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: responseSchema,
              },
            },
          },
          '400': { description: 'Bad request' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not found' },
        },
      };

      if (ep.reqBodyType) {
        const bodySchema = tsToSchema(ep.reqBodyType, known);
        if (Object.keys(bodySchema).length) {
          operation.requestBody = {
            required: true,
            content: { 'application/json': { schema: bodySchema } },
          };
        }
      }

      paths[oaPath][method] = operation;
    }
  }

  return {
    openapi: '3.0.3',
    info: {
      title: 'Smartlinks API',
      version: '1.0.0',
      description:
        'REST API for the Smartlinks platform.\n\n' +
        'Admin endpoints (`/admin/...`) require a Bearer token via the `Authorization` header.\n' +
        'Public endpoints (`/public/...`) are unauthenticated unless otherwise noted.\n' +
        'AuthKit endpoints (`/authkit/...`) are public.\n\n' +
        'Set the global `security` to `bearerAuth` and override individual operations ' +
        'with `security: []` for public routes.',
    },
    servers: [
      { url: 'https://smartlinks.app/api/v1', description: 'Production' },
    ],
    tags: tagOrder.map(name => ({ name })),
    security: [{ bearerAuth: [] }],
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Bearer token obtained from auth.login() or auth.verifyToken()',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for server-to-server calls',
        },
      },
      schemas,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

const spec = buildSpec();
const yaml = dumpYaml(spec);
fs.writeFileSync(OUT, yaml, 'utf8');

const endpointCount = Object.values(spec.paths)
  .reduce((n, methods) => n + Object.keys(methods).length, 0);
console.log(`✓ Written to ${OUT}`);
console.log(`  Paths:      ${Object.keys(spec.paths).length}`);
console.log(`  Operations: ${endpointCount}`);
console.log(`  Schemas:    ${Object.keys(spec.components.schemas).length}`);
console.log(`  Tags:       ${spec.tags.length}`);
