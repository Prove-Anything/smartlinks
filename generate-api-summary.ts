// generate-api-summary.ts
import * as fs from 'fs';
import * as path from 'path';

interface APIFunction {
  name: string;
  params: string[];
  returnType: string;
  description?: string;
}

interface APIModule {
  name: string;
  functions: APIFunction[];
}

function extractFunctionsFromFile(filePath: string, moduleName: string): APIModule {
  const content = fs.readFileSync(filePath, 'utf8');
  const functions: APIFunction[] = [];
  
  // Extract export async function declarations
  const functionRegex = /export\s+async\s+function\s+(\w+)\s*\((.*?)\)\s*:\s*Promise<([^>]+)>/gs;
  let match;
  
  while ((match = functionRegex.exec(content)) !== null) {
    const [, name, paramsStr, returnType] = match;
    const params = paramsStr.split(',').map(p => p.trim()).filter(p => p);
    
    // Extract JSDoc comment if present
    const beforeFunction = content.substring(0, match.index);
    const commentMatch = beforeFunction.match(/\/\*\*\s*(.*?)\s*\*\//s);
    const description = commentMatch ? commentMatch[1].replace(/\s*\*\s*/g, ' ').trim() : undefined;
    
    functions.push({
      name,
      params,
      returnType,
      description
    });
  }
  
  return { name: moduleName, functions };
}

function generateAPISummary(): void {
  const apiDir = path.join(__dirname, 'src', 'api');
  const modules: APIModule[] = [];
  
  // Get all TypeScript files in the API directory
  const files = fs.readdirSync(apiDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  for (const file of files) {
    const filePath = path.join(apiDir, file);
    const moduleName = path.basename(file, '.ts');
    const module = extractFunctionsFromFile(filePath, moduleName);
    
    if (module.functions.length > 0) {
      modules.push(module);
    }
  }
  
  // Generate clean summary
  let summary = '# Smartlinks API Summary\n\n';
  summary += 'This is a concise summary of all available API functions.\n\n';
  
  for (const module of modules) {
    summary += `## ${module.name}\n\n`;
    
    for (const func of module.functions) {
      summary += `### ${func.name}(${func.params.join(', ')})\n`;
      if (func.description) {
        summary += `${func.description}\n`;
      }
      summary += `Returns: \`${func.returnType}\`\n\n`;
    }
  }
  
  // Write to file
  fs.writeFileSync(path.join(__dirname, 'API_SUMMARY.md'), summary);
  console.log('API summary generated: API_SUMMARY.md');
}

generateAPISummary();
