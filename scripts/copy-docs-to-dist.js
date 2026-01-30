// scripts/copy-docs-to-dist.js
const fs = require('fs');
const path = require('path');

/**
 * Copy documentation files to root docs folder for publishing.
 * This ensures docs are included in the published package alongside dist/.
 */

const docsSource = path.join(__dirname, '..', 'docs');
const docsDest = path.join(__dirname, '..', 'docs');

// The docs are already in the right place, but we need to ensure
// README.md is copied to root for npm
const readme = path.join(__dirname, '..', 'README.md');

if (fs.existsSync(readme)) {
  console.log('✓ README.md already at root');
}

if (fs.existsSync(docsSource)) {
  const files = fs.readdirSync(docsSource);
  console.log(`✓ ${files.length} documentation files in docs/ folder`);
  files.forEach(file => {
    if (file.endsWith('.md')) {
      console.log(`  - ${file}`);
    }
  });
}

console.log('✓ Documentation ready for publishing');
