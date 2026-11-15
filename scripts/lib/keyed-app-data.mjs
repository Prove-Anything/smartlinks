// Keyed app data (appConfiguration.getData / setDataItem, ctx.sl.appData.getData / setData) is being
// retired: lists belong in declared set-up types and value lists (docs/admin-lists-and-pickers.md).
// keyedAppDataCalls(source) → the keyed calls a source file makes, e.g. ['setDataItem', 'appData.setData'].
// The settings blob (getConfig / setConfig, ctx.sl.appData.get / set) is not keyed data and isn't listed.

const PATTERNS = [
  ['getDataItem', /\bgetDataItem\s*\(/],
  ['setDataItem', /\bsetDataItem\s*\(/],
  ['deleteDataItem', /\bdeleteDataItem\s*\(/],
  ['appConfiguration.getData', /\bappConfiguration\s*\.\s*getData\s*\(/],
  ['appData.getData', /\bappData(?:\s*\.\s*(?:collection|global))?\s*\.\s*getData\s*\(/],
  ['appData.setData', /\bappData(?:\s*\.\s*(?:collection|global))?\s*\.\s*setData\s*\(/],
  ['appData.delete', /\bappData(?:\s*\.\s*(?:collection|global))?\s*\.\s*delete\s*\(\s*\{\s*dataId\b/],
]

export function keyedAppDataCalls(source) {
  const text = String(source || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')   // comments don't count
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
  return PATTERNS.filter(([, re]) => re.test(text)).map(([name]) => name)
}
