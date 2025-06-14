import { execSync } from "child_process"
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join, extname } from "path"

// Run TypeDoc to generate markdown docs in temp-docs
execSync("npx typedoc --out temp-docs --plugin typedoc-plugin-markdown --entryPoints src/index.ts --excludePrivate --excludeInternal --hideBreadcrumbs --hidePageTitle", { stdio: "inherit" })

const tempDocsDir = join(__dirname, "..", "temp-docs")
const docsDir = join(__dirname, "..", "docs")
const outPath = join(docsDir, "README.md")

if (!existsSync(docsDir)) mkdirSync(docsDir)

const files = readdirSync(tempDocsDir)
  .filter(f => extname(f) === ".md")
  .sort((a, b) => a === "modules.md" ? -1 : a.localeCompare(b)) // modules.md first

let content = "# Smartlinks SDK Documentation\n\n"
for (const file of files) {
  const fileContent = readFileSync(join(tempDocsDir, file), "utf-8")
  // Remove redundant titles (except for the first file)
  content += file === "modules.md"
    ? fileContent + "\n\n"
    : fileContent.replace(/^# .*\n/, "") + "\n\n"
}

writeFileSync(outPath, content)
console.log("Documentation built at docs/README.md")

import * as fs from "fs";
import * as path from "path";

// Use process.cwd() to ensure relative to project root
const docsJsonPath = path.join(process.cwd(), "docs", "documentation.json");
const readmePath = path.join(process.cwd(), "README.md");

function extractFullApiDocs(json: any): string {
  // This is a minimal implementation. For a full-featured generator,
  // parse all namespaces, functions, and types from the TypeDoc JSON.
  // Here, we just dump the JSON for demonstration.
  // Replace this with a real markdown generator as needed.
  return [
    "# @proveanything/smartlinks",
    "",
    "This README is auto-generated from the TypeScript API documentation.",
    "",
    "## API Reference",
    "",
    "```json",
    JSON.stringify(json, null, 2),
    "```",
    "",
    "_Replace this with a full markdown generator for production use._"
  ].join("\n");
}

function main() {
  console.log("Looking for docs JSON at:", docsJsonPath);
  
  if (!fs.existsSync(docsJsonPath)) {
    throw new Error("documentation.json not found. Run `npm run docs` first.");
  }
  const json = JSON.parse(fs.readFileSync(docsJsonPath, "utf-8"));
  const markdown = extractFullApiDocs(json);
  fs.writeFileSync(readmePath, markdown, "utf-8");
  console.log("README.md generated from API documentation.");
}

main();
