const fs = require('fs');
const path = require('path');

function extractDescription(comment) {
  if (!comment) return '';
  
  // Remove /** and */ and extract the main description
  const cleaned = comment.replace(/\/\*\*|\*\/|\s*\*\s?/g, ' ').trim();
  const lines = cleaned.split('\n').filter(line => !line.includes('@'));
  return lines.join(' ').trim();
}

function extractFunctionsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const functions = [];
  
  // Extract exported functions (not in namespaces) - updated regex to handle generics
  const functionRegex = /export\s+(?:async\s+)?function\s+(\w+)(?:<[^>]*>)?\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?/g;
  let match;
  
  while ((match = functionRegex.exec(content)) !== null) {
    const name = match[1];
    const params = match[2].trim();
    const returnType = match[3] ? match[3].trim() : 'void';
    
    // Extract JSDoc comment
    const beforeFunction = content.substring(0, match.index);
    const lastComment = beforeFunction.match(/\/\*\*([^*]|\*(?!\/))*\*\//g);
    const comment = lastComment ? lastComment[lastComment.length - 1] : '';
    const description = extractDescription(comment);
    
    functions.push({ name, params, returnType, match: match[0], comment, description });
  }
  
  return functions;
}

const httpFunctions = extractFunctionsFromFile('./src/http.ts');
console.log('HTTP Functions found:');
httpFunctions.forEach(f => {
  console.log(`- ${f.name}(${f.params}) -> ${f.returnType}`);
  console.log(`  Description: "${f.description}"`);
  if (f.name === 'sendCustomProxyMessage') {
    console.log(`  Raw comment: ${f.comment}`);
  }
});
