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
  
  // Extract type aliases robustly (handles multi-line object types)
  const aliasRegex = /export type (\w+)\s*=\s*({|[^;\n]+)/g;
  while ((match = aliasRegex.exec(content)) !== null) {
    const name = match[1];
    let afterEquals = match[2];
    let definition = '';
    if (afterEquals === '{') {
      // We are at the start of an object type; capture until matching brace
      const startPos = content.indexOf('{', match.index);
      let braceCount = 1;
      let i = startPos + 1;
      while (braceCount > 0 && i < content.length) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') braceCount--;
        i++;
      }
      definition = content.substring(startPos, i).trim();
    } else {
      // Simple one-line alias
      const lineEnd = content.indexOf('\n', match.index);
      const semiPos = content.indexOf(';', match.index);
      const endPos = (semiPos !== -1 && semiPos < lineEnd) ? semiPos : lineEnd;
      definition = content.substring(content.indexOf('=', match.index) + 1, endPos).trim();
    }
    types.push({ name, type: 'alias', definition });
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
  
  // Extract exported top-level functions (not inside namespaces)
  // Anchor at line start so indented `export function` inside namespaces won't match
  const functionRegex = /^export\s+(?:async\s+)?function\s+(\w+)(?:<[^>]*>)?\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?/gm;
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
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const version = pkg.version || '0.0.0';
  const date = new Date().toISOString();
  
  let summary = '# Smartlinks API Summary\n\n';
  summary += `Version: ${version}  |  Generated: ${date}\n\n`;
  summary += 'This is a concise summary of all available API functions and types.\n\n';
  
  // Generate namespace overview (grouped + descriptive)
  const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  const namespaces = apiFiles.map(file => path.basename(file, '.ts')).sort();
  const present = new Set(namespaces);

  const groups = [
    {
      title: '— Core Data & Configuration —',
      items: [
        { name: 'collection', desc: 'Manage collections, settings, and identifiers for your workspace.' },
        { name: 'product', desc: 'Create and manage products within a collection; metadata, tags, media.' },
        { name: 'variant', desc: 'Manage product variants per product; includes serial number helpers.' },
        { name: 'asset', desc: 'Upload and manage media assets for collections, products, and proofs.' },
        { name: 'batch', desc: 'Group products into batches; manage serial number ranges and lookups.' },
        { name: 'crate', desc: 'Organize products in containers/crates for logistics and grouping.' },
        { name: 'form', desc: 'Build and manage dynamic forms used by apps and workflows.' },
        { name: 'appRecord', desc: 'Store and retrieve application-level records tied to a collection.' },
        { name: 'appConfiguration', desc: 'Read/write app configuration and scoped data (collection/product/proof).' },
      ]
    },
    {
      title: '— Identity & Access —',
      items: [
        { name: 'auth', desc: 'Admin authentication and account ops: login/logout, tokens, account info.' },
        { name: 'authKit', desc: 'End‑user auth flows (email/password, OAuth, phone); profiles and verification.' },
        { name: 'contact', desc: 'Manage customer contacts; CRUD, lookup, upsert, erase.' },
      ]
    },
    {
      title: '— Messaging & Audience —',
      items: [
        { name: 'comms', desc: 'Send notifications (push, email, wallet); templating, severity, delivery status.' },
        { name: 'broadcasts', desc: 'Define broadcast campaigns; append recipients/events; analytics and CRUD.' },
        { name: 'segments', desc: 'Define dynamic/static audience segments; estimate and list recipients; schedule calculations.' },
      ]
    },
    {
      title: '— Analytics & Events —',
      items: [
        { name: 'interactions', desc: 'Log and analyze interactions/outcomes; aggregates and actor lists; interaction definition CRUD.' },
      ]
    },
    {
      title: '— Automation —',
      items: [
        { name: 'journeys', desc: 'Configure automated flows triggered by events or schedules; steps, rules; full CRUD.' },
      ]
    },
    {
      title: '— NFC, Proofs & Claims —',
      items: [
        { name: 'nfc', desc: 'Claim and validate NFC tags; perform tag lookups.' },
        { name: 'proof', desc: 'Create, update, claim, and list product proofs (digital certificates).' },
        { name: 'claimSet', desc: 'Manage claim sets and tag assignments; queries, reports, and updates.' },
        { name: 'qr', desc: 'Lookup short codes to resolve collection/product/proof context.' },
      ]
    },
    {
      title: '— AI & Utilities —',
      items: [
        { name: 'ai', desc: 'Generate content and images, search photos, chat, upload files, and cache.' },
        { name: 'serialNumber', desc: 'Assign, lookup, and manage serial numbers across scopes.' },
      ]
    },
  ];

  // Compute any namespaces not listed above
  const known = new Set(groups.flatMap(g => g.items.map(i => i.name)));
  const others = namespaces.filter(n => !known.has(n));

  summary += '## API Namespaces\n\n';
  summary += 'The Smartlinks SDK is organized into the following namespaces:\n\n';

  groups.forEach(group => {
    const available = group.items.filter(i => present.has(i.name));
    if (!available.length) return;
    summary += `${group.title}\n`;
    available.forEach(i => {
      summary += `- **${i.name}** - ${i.desc}\n`;
    });
    summary += '\n';
  });

  if (others.length) {
    summary += '— Other —\n';
    others.forEach(n => {
      summary += `- **${n}** - Functions for ${n} operations\n`;
    });
    summary += '\n';
  }
  
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
  
  // Error Handling section
  summary += '## Error Handling\n\n';
  summary += 'All API functions throw `SmartlinksApiError` when requests fail. This error class provides structured access to HTTP status codes, server error codes, and additional context.\n\n';
  
  summary += '### SmartlinksApiError\n\n';
  summary += '**Properties:**\n';
  summary += '- **message** `string` - Human-readable error message in English (e.g., "Error 400: Not Authorized")\n';
  summary += '- **statusCode** `number` - HTTP status code (400, 401, 404, 500, etc.)\n';
  summary += '- **code** `number` - Numeric error code (same as statusCode)\n';
  summary += '- **details** `Record<string, any> | undefined` - Additional server response data, including string error codes\n';
  summary += '- **url** `string | undefined` - The URL that was requested\n\n';
  
  summary += '**Helper Methods:**\n';
  summary += '- **isAuthError()** `boolean` - Returns true for 401 or 403 status codes\n';
  summary += '- **isNotFound()** `boolean` - Returns true for 404 status code\n';
  summary += '- **isRateLimited()** `boolean` - Returns true for 429 status code\n';
  summary += '- **isClientError()** `boolean` - Returns true for 4xx status codes\n';
  summary += '- **isServerError()** `boolean` - Returns true for 5xx status codes\n';
  summary += '- **toJSON()** `object` - Returns a serializable object for logging\n\n';
  
  summary += '### Error Format Normalization\n\n';
  summary += 'The SDK automatically normalizes various server error response formats into a consistent structure. The server may return errors in different formats, but they are all accessible through the same properties.\n\n';
  
  summary += '**Server String Error Codes:**\n';
  summary += 'Server-specific error identifiers are preserved in `error.details`:\n';
  summary += '- Access via: `error.details?.errorCode` or `error.details?.error`\n';
  summary += '- Format examples: `"NOT_AUTHORIZED"`, `"broadcasts.topic.invalid"`, `"sendgrid.provision.failed"`\n';
  summary += '- Use these for programmatic error handling (switch statements, conditional logic)\n\n';
  
  summary += '### Usage Examples\n\n';
  summary += '**Basic Error Handling:**\n';
  summary += '```typescript\n';
  summary += 'import { SmartlinksApiError, product } from \'@proveanything/smartlinks\'\n\n';
  summary += 'try {\n';
  summary += '  const item = await product.get(\'collectionId\', \'productId\')\n';
  summary += '} catch (error) {\n';
  summary += '  if (error instanceof SmartlinksApiError) {\n';
  summary += '    console.error(\'Status:\', error.statusCode)      // 404\n';
  summary += '    console.error(\'Message:\', error.message)        // "Error 404: Not found"\n';
  summary += '    console.error(\'URL:\', error.url)                // "/public/collection/..."\n';
  summary += '  }\n';
  summary += '}\n';
  summary += '```\n\n';
  
  summary += '**Using Helper Methods:**\n';
  summary += '```typescript\n';
  summary += 'try {\n';
  summary += '  await product.create(\'collectionId\', data)\n';
  summary += '} catch (error) {\n';
  summary += '  if (error instanceof SmartlinksApiError) {\n';
  summary += '    if (error.isAuthError()) {\n';
  summary += '      // Handle 401/403 - redirect to login\n';
  summary += '      redirectToLogin()\n';
  summary += '    } else if (error.isNotFound()) {\n';
  summary += '      // Handle 404\n';
  summary += '      showNotFound()\n';
  summary += '    } else if (error.isRateLimited()) {\n';
  summary += '      // Handle 429 - implement retry with backoff\n';
  summary += '      await retryAfterDelay()\n';
  summary += '    } else if (error.isServerError()) {\n';
  summary += '      // Handle 5xx\n';
  summary += '      showMaintenanceMessage()\n';
  summary += '    }\n';
  summary += '  }\n';
  summary += '}\n';
  summary += '```\n\n';
  
  summary += '**Accessing Server Error Codes:**\n';
  summary += '```typescript\n';
  summary += 'try {\n';
  summary += '  await broadcasts.send(\'collectionId\', \'broadcastId\', options)\n';
  summary += '} catch (error) {\n';
  summary += '  if (error instanceof SmartlinksApiError) {\n';
  summary += '    // Extract server-defined string error code\n';
  summary += '    const serverCode = error.details?.errorCode || error.details?.error\n';
  summary += '    \n';
  summary += '    switch (serverCode) {\n';
  summary += '      case \'NOT_AUTHORIZED\':\n';
  summary += '        redirectToLogin()\n';
  summary += '        break\n';
  summary += '      case \'broadcasts.topic.invalid\':\n';
  summary += '        showTopicSelector()\n';
  summary += '        break\n';
  summary += '      case \'sendgrid.provision.failed\':\n';
  summary += '        alertAdmin(\'Email service error\')\n';
  summary += '        break\n';
  summary += '      default:\n';
  summary += '        showError(error.message)\n';
  summary += '    }\n';
  summary += '  }\n';
  summary += '}\n';
  summary += '```\n\n';
  
  summary += '**Error Logging for Monitoring:**\n';
  summary += '```typescript\n';
  summary += 'try {\n';
  summary += '  await api.someMethod()\n';
  summary += '} catch (error) {\n';
  summary += '  if (error instanceof SmartlinksApiError) {\n';
  summary += '    // Log structured error data\n';
  summary += '    logger.error(\'API Error\', error.toJSON())\n';
  summary += '    \n';
  summary += '    // Send to monitoring service\n';
  summary += '    Sentry.captureException(error, {\n';
  summary += '      extra: error.toJSON(),\n';
  summary += '      tags: {\n';
  summary += '        statusCode: error.statusCode,\n';
  summary += '        serverErrorCode: error.details?.errorCode || error.details?.error,\n';
  summary += '      }\n';
  summary += '    })\n';
  summary += '  }\n';
  summary += '}\n';
  summary += '```\n\n';
  
  summary += '**Handling Validation Errors:**\n';
  summary += '```typescript\n';
  summary += 'try {\n';
  summary += '  await product.create(\'collectionId\', formData)\n';
  summary += '} catch (error) {\n';
  summary += '  if (error instanceof SmartlinksApiError && error.statusCode === 400) {\n';
  summary += '    // Access field-specific validation errors if available\n';
  summary += '    if (error.details?.fields) {\n';
  summary += '      Object.entries(error.details.fields).forEach(([field, message]) => {\n';
  summary += '        showFieldError(field, String(message))\n';
  summary += '      })\n';
  summary += '    } else {\n';
  summary += '      showError(error.message)\n';
  summary += '    }\n';
  summary += '  }\n';
  summary += '}\n';
  summary += '```\n\n';
  
  summary += '**Retry Logic for Transient Errors:**\n';
  summary += '```typescript\n';
  summary += 'async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {\n';
  summary += '  for (let attempt = 0; attempt < maxRetries; attempt++) {\n';
  summary += '    try {\n';
  summary += '      return await fn()\n';
  summary += '    } catch (error) {\n';
  summary += '      if (error instanceof SmartlinksApiError) {\n';
  summary += '        // Only retry server errors and rate limiting\n';
  summary += '        const shouldRetry = error.isServerError() || error.isRateLimited()\n';
  summary += '        \n';
  summary += '        if (!shouldRetry || attempt === maxRetries - 1) {\n';
  summary += '          throw error\n';
  summary += '        }\n';
  summary += '        \n';
  summary += '        // Exponential backoff\n';
  summary += '        const delay = 1000 * Math.pow(2, attempt)\n';
  summary += '        await new Promise(resolve => setTimeout(resolve, delay))\n';
  summary += '      } else {\n';
  summary += '        throw error\n';
  summary += '      }\n';
  summary += '    }\n';
  summary += '  }\n';
  summary += '  throw new Error(\'Max retries exceeded\')\n';
  summary += '}\n\n';
  summary += '// Usage\n';
  summary += 'const collections = await withRetry(() => collection.list())\n';
  summary += '```\n\n';
  
  summary += '### Error Code Reference\n\n';
  summary += '**HTTP Status Codes (numeric):**\n';
  summary += '- `400` - Bad Request (invalid input)\n';
  summary += '- `401` - Unauthorized (authentication required)\n';
  summary += '- `403` - Forbidden (insufficient permissions)\n';
  summary += '- `404` - Not Found (resource doesn\'t exist)\n';
  summary += '- `429` - Too Many Requests (rate limited)\n';
  summary += '- `500` - Internal Server Error\n';
  summary += '- `502` - Bad Gateway\n';
  summary += '- `503` - Service Unavailable\n\n';
  
  summary += '**Server Error Codes (strings in `details.errorCode` or `details.error`):**\n';
  summary += 'Examples include:\n';
  summary += '- `"NOT_AUTHORIZED"` - Not authorized for this action\n';
  summary += '- `"broadcasts.topic.invalid"` - Invalid communication topic\n';
  summary += '- `"broadcasts.manual.segment.missing"` - Missing required segment\n';
  summary += '- `"sendgrid.provision.failed"` - Email service provisioning failed\n';
  summary += '- `"validation.failed"` - Request validation failed\n\n';
  summary += '*Note: Server error codes use either `UPPERCASE_UNDERSCORE` or `dotted.notation` format. Both are supported.*\n\n';
  
  // Generate types section
  summary += '## Types\n\n';
  
  // Get all type files + api files to include request/response aliases
  const typeFiles = fs.readdirSync(typesDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  const apiTypeFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  const collectedSections = [];

  typeFiles.forEach(file => {
    const moduleName = path.basename(file, '.ts');
    const defs = extractTypesFromFile(path.join(typesDir, file));
    if (defs.length) collectedSections.push({ title: moduleName, defs });
  });
  apiTypeFiles.forEach(file => {
    const moduleName = path.basename(file, '.ts');
    const defs = extractTypesFromFile(path.join(apiDir, file));
    if (defs.length) collectedSections.push({ title: moduleName + ' (api)', defs });
  });

  collectedSections.forEach(section => {
    summary += `### ${section.title}\n\n`;
    section.defs.forEach(type => {
      if (type.type === 'interface') {
        summary += `**${type.name}** (interface)\n`;
        summary += '```typescript\n';
        summary += type.definition;
        summary += '\n```\n\n';
      } else {
        if (type.definition.startsWith('{')) {
          summary += `**${type.name}** (type)\n`;
          summary += '```typescript\n';
          summary += `type ${type.name} = ${type.definition}`;
          summary += '\n```\n\n';
        } else {
          summary += `**${type.name}** = \`${type.definition}\`\n\n`;
        }
      }
    });
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
  
  // Write to docs folder
  const docsDir = path.join(__dirname, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(docsDir, 'API_SUMMARY.md'), summary);
  console.log('✓ Generated docs/API_SUMMARY.md');
}

generateAPISummary();
