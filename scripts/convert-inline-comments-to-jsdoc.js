// scripts/convert-inline-comments-to-jsdoc.js
// Converts trailing inline comments on interface/object properties into JSDoc lines above them.
// Operates on files under src/types by default.

const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const orig = fs.readFileSync(filePath, 'utf8');
  const lines = orig.split(/\r?\n/);
  const out = [];

  function lastNonEmptyIndex(buffer) {
    for (let i = buffer.length - 1; i >= 0; i--) {
      if (buffer[i].trim() !== '') return i;
    }
    return -1;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Only consider lines that have a trailing inline comment
    const commentIdx = line.indexOf('//');
    if (commentIdx > 0) {
      // Ensure it's not already inside a string literal in a trivial way (best-effort)
      const before = line.slice(0, commentIdx);
      const after = line.slice(commentIdx + 2);

      // Heuristic: treat as property if before includes a ':' or ends with '?:' and not a full-line comment
      const looksLikeProp = /:\s*[^/]/.test(before) || /\?:\s*[^/]/.test(before) || /\?\s*:/.test(before);
      const fullLineIsComment = trimmed.startsWith('//');

      if (!fullLineIsComment && looksLikeProp) {
        const commentText = after.trim();
        const contentWithoutComment = before.replace(/\s+$/, '');

        // Check previous non-empty line: if it's a JSDoc end or start, skip to avoid duplication
        const prevIdx = lastNonEmptyIndex(out);
        const prev = prevIdx >= 0 ? out[prevIdx].trim() : '';
        if (prev.startsWith('/**') || prev.startsWith('*') || prev.endsWith('*/')) {
          out.push(line); // leave as-is
          continue;
        }

        const indent = line.slice(0, commentIdx).match(/^\s*/)[0];
        // Insert JSDoc above with same indent
        out.push(`${indent}/** ${commentText} */`);
        // Push the property line without the trailing comment
        out.push(contentWithoutComment);
        continue;
      }
    }

    out.push(line);
  }

  const result = out.join('\n');
  if (result !== orig) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.log('Updated', filePath);
  }
}

function walkDir(dir, predicate) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(p, predicate);
    } else if (e.isFile() && predicate(p)) {
      processFile(p);
    }
  }
}

function main() {
  const root = path.join(__dirname, '..');
  const typesDir = path.join(root, 'src', 'types');
  const apiDir = path.join(root, 'src', 'api');

  const isTs = (p) => p.endsWith('.ts') && !p.endsWith('index.ts');

  if (fs.existsSync(typesDir)) walkDir(typesDir, isTs);
  // Optionally include some API files that only define types
  // if (fs.existsSync(apiDir)) walkDir(apiDir, isTs);
}

if (require.main === module) {
  main();
}
