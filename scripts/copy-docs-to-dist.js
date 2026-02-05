// scripts/copy-docs-to-dist.js
const fs = require('fs');
const path = require('path');

/**
 * Copy documentation files to dist/docs for publishing.
 * This ensures docs are included in the published package.
 */

const docsSource = path.join(__dirname, '..', 'docs');
const docsDest = path.join(__dirname, '..', 'dist', 'docs');

// Create dist/docs directory if it doesn't exist
if (!fs.existsSync(docsDest)) {
  fs.mkdirSync(docsDest, { recursive: true });
}

if (fs.existsSync(docsSource)) {
  const files = fs.readdirSync(docsSource);
  let copiedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const sourcePath = path.join(docsSource, file);
      const destPath = path.join(docsDest, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`  ✓ Copied ${file} to dist/docs/`);
      copiedCount++;
    }
  });
  
  console.log(`✓ ${copiedCount} documentation files copied to dist/docs/`);
} else {
  console.log('⚠ No docs folder found');
}

console.log('✓ Documentation ready for publishing');
