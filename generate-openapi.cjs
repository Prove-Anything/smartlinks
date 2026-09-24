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

  // DOM/binary types → binary string (these are never in `known`)
  if (['File', 'Blob', 'ArrayBuffer', 'Uint8Array', 'Buffer'].includes(t))
    return { type: 'string', format: 'binary' };
  // Non-serializable client-only/ambient types → unconstrained
  if (['Window', 'Document', 'HTMLElement', 'AbortSignal', 'Node', 'Response', 'Request', 'FormData'].includes(t))
    return {};

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

  // Utility-type wrappers (Partial/Omit/Pick/Required/... possibly nested) and
  // intersections (A & B). Model as a $ref to the first referenced known type
  // (acceptable per generator convention), else a generic object.
  if (/^(?:Partial|Required|Readonly|NonNullable|Omit|Pick|Exclude|Extract)</.test(t) || t.includes(' & ')) {
    return firstKnownRef(t, known) || { type: 'object', additionalProperties: true };
  }

  // Union of object shapes / discriminated union (contains `{`): model generically.
  // (Must run before the string-literal-union check, which would otherwise scrape
  // quoted discriminant values into a bogus enum.)
  if (t.includes('|') && t.includes('{')) {
    return { type: 'object', additionalProperties: true };
  }

  // String literal union: 'a' | 'b' | 'c'  (dedupe values → no-duplicated-enum-values)
  if (/'[^']+'/.test(t) && t.includes('|')) {
    const vals = [...new Set([...t.matchAll(/'([^']+)'/g)].map(m => m[1]))];
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
    if (allKnown) {
      // Dedupe members, then use `anyOf` (not `oneOf`): a TS union has
      // "matches at least one" semantics and its members frequently overlap
      // structurally, which `oneOf` (mutually-exclusive) would flag under
      // no-illogical-composition-keywords. A single member collapses to a $ref.
      const uniq = [...new Set(parts)];
      const members = uniq.map(p => ({ $ref: `#/components/schemas/${p}` }));
      return members.length === 1 ? members[0] : { anyOf: members };
    }
    return { type: 'object', additionalProperties: true };
  }

  // Known type → $ref
  if (known.has(t)) return { $ref: `#/components/schemas/${t}` };

  // Generic type e.g. PaginatedResponse<Foo>
  const gen = t.match(/^(\w+)<.+>$/);
  if (gen && known.has(gen[1])) return { $ref: `#/components/schemas/${gen[1]}` };
  if (gen) return { type: 'object', additionalProperties: true };

  // Unknown bare identifier (PascalCase type, generic param like T/TWidget, or an
  // un-exported/ambient type). NEVER emit a $ref to an unknown name — that produces
  // an unresolvable reference. Only known names reach the `known.has` check above.
  return { type: 'object', additionalProperties: true };
}

// Scan a type expression for the first identifier that is a known schema, and
// return a $ref to it (used for utility wrappers / intersections). Skips the
// utility keywords themselves so `Omit<Collection,...>` resolves to Collection.
const UTILITY_KEYWORDS = new Set(['Partial', 'Required', 'Readonly', 'NonNullable', 'Omit', 'Pick', 'Exclude', 'Extract', 'Record', 'Array', 'Promise', 'Map', 'Set']);
function firstKnownRef(t, known) {
  const ids = t.match(/[A-Za-z_$][\w$]*/g) || [];
  for (const id of ids) {
    if (UTILITY_KEYWORDS.has(id)) continue;
    if (known.has(id)) return { $ref: `#/components/schemas/${id}` };
  }
  return null;
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

// Strip TS comments from a captured type RHS (block + line comments).
function stripTypeComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

// Capture the full right-hand side of a `type X = <RHS>` alias starting at
// startIdx (the first RHS char). Handles multi-line unions, nested generics,
// brace-containing object shapes and intersections that the previous
// single-line, `;`-terminated regex silently dropped. The statement ends at a
// top-level `;`, or at a newline where neither the text so far nor the next
// token continues the type expression.
function captureAliasRhs(content, startIdx) {
  const OPEN = '{[(<', CLOSE = '}])>';
  let depth = 0, out = '';
  const max = Math.min(content.length, startIdx + 8000);  // safety bound
  for (let i = startIdx; i < max; i++) {
    const c = content[i];
    if (c === ';' && depth === 0) break;
    if (OPEN.includes(c)) {
      if (!(c === '<' && content[i - 1] === '=')) depth++;            // ignore => arrows
    } else if (CLOSE.includes(c)) {
      if (!(c === '>' && content[i - 1] === '=')) depth = Math.max(0, depth - 1);
    }
    if (c === '\n' && depth === 0) {
      const before = out.replace(/\/\/[^\n]*$/, '').trimEnd();
      const lastCh = before.slice(-1);
      let k = i + 1;
      while (k < content.length && /\s/.test(content[k])) k++;        // next non-ws (across blanks)
      const nextCh = content[k] || '';
      const nextChunk = content.slice(k, k + 10);
      const contBefore = '|&=<([{,.'.includes(lastCh) || /extends$/.test(before);
      const contAfter  = '|&>)]}.'.includes(nextCh) || /^extends\b/.test(nextChunk);
      if (!contBefore && !contAfter) break;
    }
    out += c;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSDoc description extractor
// ─────────────────────────────────────────────────────────────────────────────

function jsDocBefore(content, idx) {
  const prev = content.slice(Math.max(0, idx - 1000), idx);

  // Find the last */ in the window and verify only whitespace follows it
  // (i.e. the comment ends immediately before the function declaration).
  const lastDocEnd = prev.lastIndexOf('*/');
  if (lastDocEnd === -1) return '';
  if (prev.slice(lastDocEnd + 2).trim()) return ''; // non-whitespace between */ and function

  // Walk backward to the matching /**
  const docStart = prev.lastIndexOf('/**', lastDocEnd);
  if (docStart === -1) return '';

  const body = prev.slice(docStart + 3, lastDocEnd);
  const full = body
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
  // Pre-strip any ${expr} that contains nested braces (multi-line object args like encodeQueryParams({...}))
  // These are query-building helpers and should be removed entirely.
  let cleaned = tpl;
  let prev;
  do {
    prev = cleaned;
    // Remove ${helper({...})} — any interpolation whose content has a nested {
    cleaned = cleaned.replace(/\$\{[^}]*\{[^}]*\}[^}]*\}/g, '');
  } while (cleaned !== prev);

  return cleaned
    // Strip ternary expressions like ${qs ? `?${qs}` : ''} or ${query ? `?...` : ""}
    .replace(/\$\{[^}?]*\?[^`}]*`?[^`}]*`?[^}]*\}/g, '')
    // Strip query helper interpolations like ${qs}, ${query}, ${qp}, ${opts}, ${params}, ${buildQueryString(params)}
    .replace(/\/?\$\{[^}]*\b(?:qs|qp|query|search|opts|params|options|queryString|queryParams|searchParams|build\w*Query\w*|encodeQuery)\b[^}]*\}/gi, '')
    // Strip naked conditional tails like ${qs ? or ${query ?  (partial captures from nested template literal)
    .replace(/\$\{[^}]*\?.*$/g, '')
    // Convert ${encodeURIComponent(x)} → {x}
    .replace(/\$\{encodeURIComponent\((\w+)\)\}/g, '{$1}')
    // Convert ${enc(x)} or other single-arg wrapper helpers → {x}
    .replace(/\$\{[A-Za-z_$][\w$]*\((\w+)\)\}/g, '{$1}')
    // Convert ${x} → {x}
    .replace(/\$\{(\w+)\}/g, '{$1}')
    // Strip any remaining ${...} or partial ${ expressions
    .replace(/\$\{[^}]*\}?/g, '')
    // Remove leftover interpolation params that are NOT real path params: a real
    // path param is always preceded by '/', so any `{word}` glued to a preceding
    // non-slash char (e.g. products{opts}, proof{qp}, lots{params}) is a stripped
    // querystring remnant — drop it.
    .replace(/([^/]){\w+}/g, '$1')
    // Strip query string
    .replace(/[?#].*$/, '')
    // Collapse duplicate slashes introduced by stripped interpolations
    .replace(/\/+/g, '/')
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

function isPrimitiveTsType(type) {
  return ['string', 'number', 'boolean', 'any', 'unknown', 'void', 'never', 'undefined'].includes(type);
}

function guessQueryParamType(sigParams, rawPathStr, body, method) {
  if (method !== 'get') return null;

  const hasQueryInterpolation = /\$\{[^}]*\b(?:qs|query|search|queryString|queryParams|build\w*Query\w*|encodeQuery)\b[^}]*\}/i.test(rawPathStr || '');
  const hasQueryBuilder = /URLSearchParams|build\w*Query\w*|encodeQuery/.test(body || '');
  if (!hasQueryInterpolation && !hasQueryBuilder) return null;

  const candidate = sigParams.find((param) =>
    ['query', 'params', 'options', 'search'].includes(param.name) && !isPrimitiveTsType(param.type)
  );

  return candidate ? candidate.type : null;
}

function getSchemaForType(type, schemas, known) {
  if (!type) return null;
  const schema = tsToSchema(type, known);
  if (!schema || !Object.keys(schema).length) return null;

  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return refName ? schemas[refName] || null : null;
  }

  return schema;
}

function getQueryParamSchemas(type, schemas, known) {
  const schema = getSchemaForType(type, schemas, known);
  if (!schema || !schema.properties) return {};
  return schema.properties;
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

    // Inline object type aliases: export type Foo = { ... }  (parse the shape)
    const objTypeRe = /export type (\w+)(?:<[^>]*>)?\s*=\s*\{/g;
    while ((m = objTypeRe.exec(content)) !== null) {
      const name = m[1];
      if (schemas[name]) continue;
      // Locate the opening brace so extractInterfaceSchema can read the block.
      const braceIdx = content.indexOf('{', m.index + m[0].length - 1);
      const schema = extractInterfaceSchema(content, braceIdx, '{', known);
      if (schema) schemas[name] = schema;
    }

    // All other type aliases — unions (incl. multi-line), primitives, wrappers,
    // intersections. Captures the full RHS (previously only single-line,
    // `;`-terminated, brace-free aliases were emitted, so ~90 names that were
    // $ref'd elsewhere never got defined). Route each through tsToSchema.
    const aliasRe = /export type (\w+)(?:<[^>]*>)?\s*=\s*/g;
    while ((m = aliasRe.exec(content)) !== null) {
      const name = m[1];
      if (schemas[name]) continue;                         // object aliases already handled
      const rhs = stripTypeComments(captureAliasRhs(content, aliasRe.lastIndex)).trim();
      if (!rhs || rhs.startsWith('{') || rhs.startsWith('(')) continue;  // object/fn handled/skip
      const s = tsToSchema(rhs, known);
      if (Object.keys(s).length) schemas[name] = s;
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
      // Strip off the rest of rawPath after the helper call.
      // helperCall.index is where the function name starts (e.g. after `${`),
      // so we must skip both the offset AND the closing `}` of any `${...}`.
      const afterHelper = rawPath.slice(helperCall.index + helperCall[0].length).trim();
      const continuation = afterHelper
        .replace(/^\}/, '')          // strip closing } of ${helperCall(...)}
        .replace(/^\s*\+\s*/, '')    // strip optional + concatenation
        .replace(/^`/, '')           // strip leading backtick if present
        .replace(/`$/, '');          // strip trailing backtick if present
      return resolved + continuation;
    }
  }

  return rawPath;
}

// Extract helper function bodies (e.g. basePath) from a content block.
// Returns an object mapping function name → body string.
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

// Build a map of namespace name → helpers defined inside that namespace block.
// For files with repeated helper names (like appObjects.ts with 3 × basePath),
// each namespace gets its own scoped copy so the right one is resolved.
function extractHelpersPerNamespace(content) {
  const nsHelpers = {};  // nsName → helpers object
  const nsRe = /export namespace (\w+)\s*\{/g;
  let m;
  while ((m = nsRe.exec(content)) !== null) {
    const nsName = m[1];
    const block = extractBlock(content, m.index + m[0].length - 1);
    if (block) {
      nsHelpers[nsName] = extractHelpers(block);
    }
  }
  // Also extract file-level helpers (outside any namespace)
  nsHelpers['__file__'] = extractHelpers(content);
  return nsHelpers;
}

function parseApiFile(filePath, known) {
  const content = fs.readFileSync(filePath, 'utf8');
  const endpoints = [];

  // Namespace(s): a file may have nested namespaces (e.g. app.cases in appObjects.ts)
  // We collect the outermost namespace + any nested ones
  const nsM = content.match(/export namespace (\w+)\s*\{/);
  const outerNs = nsM ? nsM[1] : path.basename(filePath, '.ts');

  // Helper function definitions per namespace (handles files with repeated helper names)
  const nsHelpersMap = extractHelpersPerNamespace(content);
  // File-level helper fallback
  const fileHelpers = nsHelpersMap['__file__'] || Object.create(null);

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
      // Use a backtick-balanced match to handle multi-line template literals
      const pathDef = body.match(/const\s+(?:path|url|endpoint)\s*=\s*(`[\s\S]*?`|"[^"]+"|'[^']+'|[^\n;]+)/);
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
    // Use helpers from the function's own namespace, falling back to file-level helpers
    const localHelpers = nsHelpersMap[tag] || fileHelpers;
    const resolvedPath = resolveRawPath(rawPathStr, localHelpers);
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
    const queryParamType = guessQueryParamType(sigParams, resolvedPath, body, httpMethod);

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
      queryParamType,
      security,
    });
  }

  return endpoints;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build the OpenAPI spec object
// ─────────────────────────────────────────────────────────────────────────────

// One-liner descriptions per namespace tag (satisfies tag-description). Any tag
// not listed falls back to a generic "<name> API".
const TAG_DESCRIPTIONS = {
  responses: 'Agentic responses API (server-tool runs).',
  completions: 'Chat completion generation.',
  agent: 'Agent orchestration and tool-calling.',
  skills: 'Reusable agent skills.',
  models: 'Available AI models and their metadata.',
  rag: 'Retrieval-augmented generation and document indexing.',
  sessions: 'Conversation session management.',
  podcast: 'Podcast generation.',
  tts: 'Text-to-speech synthesis.',
  publicClient: 'Public client-side helpers.',
  voice: 'Voice interaction endpoints.',
  userAppData: 'Per-user application data storage.',
  cases: 'Support/workflow cases.',
  threads: 'Message threads within cases.',
  records: 'Application record objects.',
  asset: 'Asset upload and media management.',
  async: 'Asynchronous/long-running job helpers.',
  attestation: 'Single attestation operations.',
  attestations: 'Attestation collections and trees.',
  auth: 'Authentication and token management.',
  authKit: 'AuthKit hosted authentication flows.',
  batch: 'Batch (production run) management.',
  broadcasts: 'Broadcast messaging campaigns.',
  collection: 'Collection (tenant) configuration and resources.',
  comms: 'Communications preferences, consent and delivery.',
  config: 'Proof-type and platform configuration.',
  contact: 'Contact (CRM) records.',
  containers: 'Container and item tracking.',
  crate: 'Crate packaging and logistics.',
  facets: 'Product facet querying and aggregation.',
  form: 'Form definitions and submissions.',
  integrations: 'Third-party integration flows and imports.',
  interactions: 'Interaction events and types.',
  jobs: 'Background job scheduling and status.',
  journeys: 'Customer journey definitions.',
  journeysAnalytics: 'Journey analytics and reporting.',
  location: 'Physical location management.',
  lots: 'Lot management and lookup.',
  loyalty: 'Loyalty programs and points.',
  nfc: 'NFC tag encoding and lookup.',
  order: 'Order records and line items.',
  product: 'Single product operations.',
  products: 'Product collections and bulk operations.',
  proof: 'Proof (ownership ledger) operations.',
  qr: 'QR code generation and resolution.',
  realtime: 'Realtime channels and subscriptions.',
  research: 'Product research service.',
  segments: 'Contact segmentation rules.',
  tags: 'Tagging and tag analytics.',
  template: 'Message and document templates.',
  translations: 'Localization and translation lookup.',
  variant: 'Product variant management.',
};

function tagDescription(name) {
  return TAG_DESCRIPTIONS[name] || `${name} API`;
}

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
      const queryParamSchemas = getQueryParamSchemas(ep.queryParamType, schemas, known);
      const queryParamNames = Array.from(new Set([
        ...ep.qParams,
        ...Object.keys(queryParamSchemas),
      ]));

      for (const pp of ep.pParams) {
        parameters.push({ name: pp, in: 'path', required: true, schema: { type: 'string' } });
      }
      for (const qp of queryParamNames) {
        parameters.push({
          name: qp,
          in: 'query',
          required: false,
          schema: queryParamSchemas[qp] || { type: 'string' },
        });
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
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
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
    tags: tagOrder.map(name => ({ name, description: tagDescription(name) })),
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
