"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
// Run TypeDoc to generate markdown docs in temp-docs
(0, child_process_1.execSync)("npx typedoc --out temp-docs --plugin typedoc-plugin-markdown --entryPoints src/index.ts --excludePrivate --excludeInternal --hideBreadcrumbs --hidePageTitle", { stdio: "inherit" });
var tempDocsDir = (0, path_1.join)(__dirname, "..", "temp-docs");
var docsDir = (0, path_1.join)(__dirname, "..", "docs");
var outPath = (0, path_1.join)(docsDir, "README.md");
if (!(0, fs_1.existsSync)(docsDir))
    (0, fs_1.mkdirSync)(docsDir);
var files = (0, fs_1.readdirSync)(tempDocsDir)
    .filter(function (f) { return (0, path_1.extname)(f) === ".md"; })
    .sort(function (a, b) { return a === "modules.md" ? -1 : a.localeCompare(b); }); // modules.md first
var content = "# Smartlinks SDK Documentation\n\n";
for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    var fileContent = (0, fs_1.readFileSync)((0, path_1.join)(tempDocsDir, file), "utf-8");
    // Remove redundant titles (except for the first file)
    content += file === "modules.md"
        ? fileContent + "\n\n"
        : fileContent.replace(/^# .*\n/, "") + "\n\n";
}
(0, fs_1.writeFileSync)(outPath, content);
console.log("Documentation built at docs/README.md");
var fs = require("fs");
var path = require("path");
// Use process.cwd() to ensure relative to project root
var docsJsonPath = path.join(process.cwd(), "docs", "documentation.json");
var readmePath = path.join(process.cwd(), "README.md");
function extractFullApiDocs(json) {
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
    var json = JSON.parse(fs.readFileSync(docsJsonPath, "utf-8"));
    var markdown = extractFullApiDocs(json);
    fs.writeFileSync(readmePath, markdown, "utf-8");
    console.log("README.md generated from API documentation.");
}
main();
