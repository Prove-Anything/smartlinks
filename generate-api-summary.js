// generate-api-summary.js
const fs = require('fs');
const path = require('path');

function extractDescription(comment) {
  if (!comment) return '';
  
  // Remove /** and */ and clean up the comment
  let cleaned = comment.replace(/\/\*\*|\*\//g, '').trim();
  
  // Remove leading * from each line and clean up
  const lines = cleaned.split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').trim())
    .filter(line => line && !line.startsWith('@')); // Skip @param, @returns, etc.
  
  return lines.join(' ').trim();
}

function extractTypesFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const types = [];
  
  // Extract interfaces with proper bracket matching
  const interfaceRegex = /export interface (\w+)\s*{/g;
  let match;
  
  while ((match = interfaceRegex.exec(content)) !== null) {
    const name = match[1];
    const startPos = match.index + match[0].length - 1; // Position of opening {
    
    // Find matching closing brace
    let braceCount = 1;
    let endPos = startPos + 1;
    
    while (braceCount > 0 && endPos < content.length) {
      if (content[endPos] === '{') braceCount++;
      if (content[endPos] === '}') braceCount--;
      endPos++;
    }
    
    if (braceCount === 0) {
      const body = content.substring(startPos + 1, endPos - 1);
      const formattedBody = formatInterfaceBody(body);
      
      types.push({
        name,
        type: 'interface',
        definition: `interface ${name} {\n${formattedBody}\n}`
      });
    }
  }
  
  // Extract type aliases (including multi-line object types)
  const typeRegex = /export type (\w+)\s*=\s*([^}]+}|[^;\n]+)/g;
  while ((match = typeRegex.exec(content)) !== null) {
    let definition = match[2].trim();
    
    // If it starts with {, it's likely a multi-line object type
    if (definition.startsWith('{')) {
      // Find the matching closing brace
      const startPos = content.indexOf(match[0]);
      const typeStart = content.indexOf('=', startPos) + 1;
      let braceCount = 0;
      let endPos = typeStart;
      
      for (let i = typeStart; i < content.length; i++) {
        const char = content[i];
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endPos = i + 1;
            break;
          }
        }
      }
      
      definition = content.substring(typeStart, endPos).trim();
    }
    
    types.push({
      name: match[1],
      type: 'alias',
      definition: definition
    });
  }
  
  return types;
}

function formatInterfaceBody(body) {
  const lines = body.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.includes('/**') && !line.includes('*/') && !line.startsWith('//'));
  
  return lines.map(line => `  ${line}`).join('\n');
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
    
    functions.push({
      name,
      params,
      returnType,
      description
    });
  }
  
  // Extract namespace functions
  const namespaceRegex = /export namespace (\w+)\s*{([\s\S]*?)^}/gm;
  while ((match = namespaceRegex.exec(content)) !== null) {
    const namespaceName = match[1];
    const namespaceBody = match[2];
    
    const namespaceFunctions = extractNamespaceFunctions(namespaceBody, namespaceName);
    functions.push(...namespaceFunctions);
  }
  
  return functions;
}

function extractNamespaceFunctions(namespaceBody, namespaceName) {
  const functions = [];
  const functionRegex = /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?/g;
  let match;
  
  while ((match = functionRegex.exec(namespaceBody)) !== null) {
    const name = match[1];
    const params = match[2].trim();
    const returnType = match[3] ? match[3].trim() : 'void';
    
    // Extract JSDoc comment
    const beforeFunction = namespaceBody.substring(0, match.index);
    const lastComment = beforeFunction.match(/\/\*\*([^*]|\*(?!\/))*\*\//g);
    const comment = lastComment ? lastComment[lastComment.length - 1] : '';
    const description = extractDescription(comment);
    
    functions.push({
      name,
      params,
      returnType,
      description,
      namespace: namespaceName
    });
  }
  
  return functions;
}

function generateAPISummary() {
  const srcDir = path.join(__dirname, 'src');
  const apiDir = path.join(srcDir, 'api');
  const typesDir = path.join(srcDir, 'types');
  
  let summary = '# Smartlinks API Summary\n\n';
  summary += 'This is a concise summary of all available API functions and types.\n\n';
  
  // Generate namespace overview
  const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  const namespaces = apiFiles.map(file => path.basename(file, '.ts')).sort();
  
  summary += '## API Namespaces\n\n';
  summary += 'The Smartlinks SDK is organized into the following namespaces:\n\n';
  namespaces.forEach(namespace => {
    const descriptions = {
      'appConfiguration': 'Application configuration and settings management',
      'asset': 'File upload and asset management for collections, products, and proofs',
      'attestation': 'Digital attestations and verification for products',
      'auth': 'Authentication, login, and user account management',
      'batch': 'Product batch management and tracking',
      'claimSet': 'Claim creation, management, and verification',
      'collection': 'Collection CRUD operations and management',
      'crate': 'Container/crate management for organizing products',
      'form': 'Dynamic form creation and submission',
      'product': 'Product CRUD operations and management within collections',
      'proof': 'Product proof retrieval and validation',
      'variant': 'Product variant management and tracking'
    };
    const description = descriptions[namespace] || `Functions for ${namespace} operations`;
    summary += `- **${namespace}** - ${description}\n`;
  });
  summary += '\n';
  
  // HTTP Utilities
  summary += '## HTTP Utilities\n\n';
  summary += 'Core HTTP functions for API configuration and communication:\n\n';
  const httpFunctions = extractFunctionsFromFile(path.join(srcDir, 'http.ts'));
  httpFunctions.forEach(func => {
    summary += `**${func.name}**(${func.params}) → \`${func.returnType}\`\n`;
    if (func.description) {
      summary += `${func.description}\n`;
    }
    summary += '\n';
  });
  
  // Generate types section
  summary += '## Types\n\n';
  
  // Get all type files
  const typeFiles = fs.readdirSync(typesDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  typeFiles.forEach(file => {
    const moduleName = path.basename(file, '.ts');
    const types = extractTypesFromFile(path.join(typesDir, file));
    
    if (types.length > 0) {
      summary += `### ${moduleName}\n\n`;
      
      types.forEach(type => {
        if (type.type === 'interface') {
          summary += `**${type.name}** (interface)\n`;
          summary += '```typescript\n';
          summary += type.definition;
          summary += '\n```\n\n';
        } else {
          summary += `**${type.name}** = \`${type.definition}\`\n\n`;
        }
      });
    }
  });
  
  // Also extract types from API files (like AppConfigOptions)
  apiFiles.forEach(file => {
    const moduleName = path.basename(file, '.ts');
    const types = extractTypesFromFile(path.join(apiDir, file));
    
    if (types.length > 0) {
      // Check if we already have a section for this module
      const existingSection = typeFiles.includes(`${moduleName}.ts`);
      
      if (!existingSection) {
        summary += `### ${moduleName}\n\n`;
      }
      
      types.forEach(type => {
        if (type.type === 'interface') {
          summary += `**${type.name}** (interface)\n`;
          summary += '```typescript\n';
          summary += type.definition;
          summary += '\n```\n\n';
        } else {
          summary += `**${type.name}** = \`${type.definition}\`\n\n`;
        }
      });
    }
  });
  
  // Generate API functions section
  summary += '## API Functions\n\n';
  
  // Group functions by namespace
  const functionsByNamespace = {};
  
  apiFiles.forEach(file => {
    const functions = extractFunctionsFromFile(path.join(apiDir, file));
    functions.forEach(func => {
      const namespace = func.namespace || path.basename(file, '.ts');
      if (!functionsByNamespace[namespace]) {
        functionsByNamespace[namespace] = [];
      }
      functionsByNamespace[namespace].push(func);
    });
  });
  
  // Output functions by namespace
  Object.keys(functionsByNamespace).sort().forEach(namespace => {
    summary += `### ${namespace}\n\n`;
    
    functionsByNamespace[namespace].forEach(func => {
      summary += `**${func.name}**(${func.params}) → \`${func.returnType}\`\n`;
      if (func.description) {
        summary += `${func.description}\n`;
      }
      summary += '\n';
    });
  });
  
  const functionCount = Object.values(functionsByNamespace)
    .reduce((total, funcs) => total + funcs.length, 0) + httpFunctions.length;
  
  console.log(`✅ Generated API summary with ${functionCount} functions`);
  console.log(`📊 Found ${Object.keys(functionsByNamespace).length} API namespaces`);
  console.log(`🔧 Found ${httpFunctions.length} HTTP utility functions`);
  
  // Write to file
  fs.writeFileSync(path.join(__dirname, 'API_SUMMARY.md'), summary);
}

generateAPISummary();
