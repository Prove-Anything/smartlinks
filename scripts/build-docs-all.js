// scripts/build-docs-all.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDocsToDist() {
  const docsSrc = path.join(__dirname, '..', 'docs');
  const distDocs = path.join(__dirname, '..', 'dist', 'docs');
  ensureDir(distDocs);

  if (!fs.existsSync(docsSrc)) {
    console.warn('Docs source folder not found:', docsSrc);
    return;
  }

  const entries = fs.readdirSync(docsSrc, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(docsSrc, entry.name);
    const destPath = path.join(distDocs, entry.name);
    if (entry.isDirectory()) {
      // shallow copy directories
      ensureDir(destPath);
      const inner = fs.readdirSync(srcPath, { withFileTypes: true });
      for (const f of inner) {
        const innerSrc = path.join(srcPath, f.name);
        const innerDest = path.join(destPath, f.name);
        if (f.isFile()) copyFile(innerSrc, innerDest);
      }
    } else if (entry.isFile()) {
      copyFile(srcPath, destPath);
    }
  }

  // Ensure API_SUMMARY.md is present
  const apiSummarySrc = path.join(docsSrc, 'API_SUMMARY.md');
  if (fs.existsSync(apiSummarySrc)) {
    const apiSummaryDest = path.join(distDocs, 'API_SUMMARY.md');
    copyFile(apiSummarySrc, apiSummaryDest);
    console.log('✓ Copied API_SUMMARY.md to dist/docs');
  } else {
    console.warn('API_SUMMARY.md not found in docs');
  }
}

function main() {
  // 1) Build Typedoc docs (uses typedoc.json to produce docs/ + docs/documentation.json)
  run('npm run docs');

  // 2) Build API summary with current package version
  run('node generate-api-summary.js');

  // 3) Copy docs (including API_SUMMARY.md) into dist/docs
  copyDocsToDist();
}

main();
