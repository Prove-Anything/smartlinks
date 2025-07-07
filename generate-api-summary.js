// generate-api-summary.js
const fs = require('fs');
const path = require('path');

function extractFunctionsFromFile(filePath, moduleName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const functions = [];
  
  // Extract export async function declarations
  const functionRegex = /export\s+async\s+function\s+(\w+)\s*\((.*?)\)\s*:\s*Promise<([^>]+)>/gs;
  let match;
  
  while ((match = functionRegex.exec(content)) !== null) {
    const [, name, paramsStr, returnType] = match;
    const params = paramsStr.split(',').map(p => p.trim()).filter(p => p);
    
    // Extract JSDoc comment if present
    const beforeFunction = content.substring(0, match.index);
    const commentMatch = beforeFunction.match(/\/\*\*\s*(.*?)\s*\*\//s);
    const description = commentMatch ? 
      commentMatch[1].replace(/\s*\*\s*/g, ' ').replace(/\n/g, ' ').trim() : 
      undefined;
    
    functions.push({
      name,
      params,
      returnType,
      description
    });
  }
  
  return { name: moduleName, functions };
}

function extractTypesFromFile(filePath, moduleName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const types = [];
  
  // Extract interface declarations with proper bracket matching
  const interfaceRegex = /export\s+interface\s+(\w+)\s*\{/g;
  let match;
  
  while ((match = interfaceRegex.exec(content)) !== null) {
    const [, name] = match;
    const startPos = match.index + match[0].length;
    
    // Find the matching closing bracket
    let braceCount = 1;
    let endPos = startPos;
    
    while (braceCount > 0 && endPos < content.length) {
      if (content[endPos] === '{') braceCount++;
      else if (content[endPos] === '}') braceCount--;
      endPos++;
    }
    
    if (braceCount === 0) {
      const body = content.substring(startPos, endPos - 1);
      
      // Parse the interface body more carefully
      const properties = parseInterfaceProperties(body);
      
      types.push({
        name,
        type: 'interface',
        properties
      });
    }
  }
  
  // Extract type aliases
  const typeAliasRegex = /export\s+type\s+(\w+)\s*=\s*([^;\n]+)/g;
  let typeMatch;
  
  while ((typeMatch = typeAliasRegex.exec(content)) !== null) {
    const [, name, definition] = typeMatch;
    types.push({
      name,
      type: 'type',
      definition: definition.trim()
    });
  }
  
  return { name: moduleName, types };
}

function parseInterfaceProperties(body, depth = 0) {
  const properties = [];
  const lines = body.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('/**') || line.startsWith('*') || line.startsWith('*/')) {
      i++;
      continue;
    }
    
    // Check for property declaration
    const propMatch = line.match(/^(\w+)(\??):\s*(.*)$/);
    if (propMatch) {
      const [, propName, optional, typeStart] = propMatch;
      
      // Check if this is a nested object starting with {
      if (typeStart.trim() === '{') {
        // Find the matching closing brace and parse nested properties
        let braceCount = 1;
        let j = i + 1;
        let nestedLines = [];
        
        while (j < lines.length && braceCount > 0) {
          const nestedLine = lines[j];
          
          // Count braces to find the matching closing brace
          for (const char of nestedLine) {
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
          }
          
          if (braceCount > 0) {
            nestedLines.push(nestedLine);
          }
          j++;
        }
        
        // Parse the nested content recursively
        const nestedBody = nestedLines.join('\n');
        const nestedProps = parseInterfaceProperties(nestedBody, depth + 1);
        
        properties.push({
          name: propName,
          type: 'object',
          nestedProperties: nestedProps,
          optional: !!optional
        });
        
        i = j;
      } else {
        // Simple property
        let propType = typeStart.replace(/[;,]$/, '').trim();
        properties.push({
          name: propName,
          type: propType,
          optional: !!optional
        });
        i++;
      }
    } else {
      i++;
    }
  }
  
  return properties;
}

function formatProperty(prop, indent = '  ') {
  let result = '';
  
  if (prop.type === 'object' && prop.nestedProperties) {
    // Format nested object property
    result += `${indent}${prop.name}${prop.optional ? '?' : ''}: {\n`;
    for (const nestedProp of prop.nestedProperties) {
      result += formatProperty(nestedProp, indent + '  ');
    }
    result += `${indent}};\n`;
  } else {
    // Format simple property
    result += `${indent}${prop.name}${prop.optional ? '?' : ''}: ${prop.type};\n`;
  }
  
  return result;
}

function parseNestedProperties(lines) {
  // This function is now replaced by the recursive parseInterfaceProperties
  const nestedProps = [];
  
  for (const line of lines) {
    const propMatch = line.match(/^(\w+)(\??):\s*(.+?)[;,]?$/);
    if (propMatch) {
      const [, propName, optional, propType] = propMatch;
      nestedProps.push({
        name: propName,
        type: propType.trim(),
        optional: !!optional
      });
    }
  }
  
  return nestedProps;
}

function generateAPISummary() {
  const apiDir = path.join(__dirname, 'src', 'api');
  const typesDir = path.join(__dirname, 'src', 'types');
  const modules = [];
  const typeModules = [];
  
  // Get all TypeScript files in the API directory
  const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  for (const file of apiFiles) {
    const filePath = path.join(apiDir, file);
    const moduleName = path.basename(file, '.ts');
    const module = extractFunctionsFromFile(filePath, moduleName);
    
    if (module.functions.length > 0) {
      modules.push(module);
    }
  }
  
  // Get all TypeScript files in the types directory
  const typeFiles = fs.readdirSync(typesDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  for (const file of typeFiles) {
    const filePath = path.join(typesDir, file);
    const moduleName = path.basename(file, '.ts');
    const module = extractTypesFromFile(filePath, moduleName);
    
    if (module.types.length > 0) {
      typeModules.push(module);
    }
  }
  
  // Generate clean summary
  let summary = '# Smartlinks API Summary\n\n';
  summary += 'This is a concise summary of all available API functions and types.\n\n';
  
  // Add types section
  if (typeModules.length > 0) {
    summary += '## Types\n\n';
    
    for (const typeModule of typeModules) {
      summary += `### ${typeModule.name}\n\n`;
      
      for (const type of typeModule.types) {
        if (type.type === 'interface') {
          summary += `**${type.name}** (interface)\n`;
          if (type.properties.length > 0) {
            summary += '```typescript\n';
            summary += `interface ${type.name} {\n`;
            for (const prop of type.properties) {
              summary += formatProperty(prop);
            }
            summary += '}\n';
            summary += '```\n\n';
          }
        } else if (type.type === 'type') {
          summary += `**${type.name}** = \`${type.definition}\`\n\n`;
        }
      }
    }
  }
  
  // Add API functions section
  summary += '## API Functions\n\n';
  
  for (const module of modules) {
    summary += `### ${module.name}\n\n`;
    
    for (const func of module.functions) {
      summary += `**${func.name}**(${func.params.join(', ')}) → \`${func.returnType}\`\n`;
      if (func.description) {
        summary += `${func.description}\n`;
      }
      summary += '\n';
    }
  }
  
  // Write to file
  fs.writeFileSync(path.join(__dirname, 'API_SUMMARY.md'), summary);
  console.log('✅ API summary generated: API_SUMMARY.md');
  console.log(`📊 Found ${modules.length} API modules with ${modules.reduce((total, m) => total + m.functions.length, 0)} functions`);
  console.log(`📝 Found ${typeModules.length} type modules with ${typeModules.reduce((total, m) => total + m.types.length, 0)} types`);
}

generateAPISummary();
