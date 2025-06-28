const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'docs', 'README.md');
const destDir = path.join(process.cwd(), 'src', 'docs', 'smartlinks');
const dest = path.join(destDir, 'api-reference.md');

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);

console.log(`Copied ${src} to ${dest}`);