// =============================================================================
// headless — validate an app's headless-provider declaration (manifest `data` + `headless`).
//
//   SL.headless.validate(manifest, { samples })  → { ok, errors, warnings, recipes }
//
// Pure (no network): the `smartlinks-headless` CLI and Forge both call it. `samples` are real items
// (each type's `data` zone JSON) — the check then reports fields the real data has but the
// declaration doesn't, and values that don't match their declared type.
// Spec: docs/headless-providers.md.
// =============================================================================

import type {
  AppDataDeclaration,
  AppDataField,
  AppDataType,
  AppHeadlessDeclaration,
  HeadlessCategory,
} from './types/headless'
import { HEADLESS_CATEGORIES } from './types/headless'

export interface HeadlessIssue {
  /** Where: e.g. `headless.purpose`, `data.types.faq.item.fields.answer`. */
  path: string
  message: string
}

export interface HeadlessValidation {
  ok: boolean
  errors: HeadlessIssue[]
  warnings: HeadlessIssue[]
  /**
   * The read recipe for each type: the declared one, else the standard one for its storage — plus what
   * the call returns and where an item's fields are. Those two always come from the storage kind (the
   * platform's response shape), never from the app, so a custom recipe can't leave them out.
   */
  recipes: Record<string, { list: string; get?: string; returns: string; item: string }>
}

const FIELD_TYPES = new Set([
  'string', 'text', 'richtext', 'markdown', 'number', 'boolean', 'date', 'datetime', 'enum', 'url',
  'image', 'file', 'ref', 'string[]', 'ref[]', 'json',
])
const TEXT_TYPES = new Set(['string', 'text', 'richtext', 'markdown'])
const PLATFORM_REFS = new Set(['product', 'contact', 'proof'])
const SEO_HELPERS = new Set(['faqPage', 'product', 'article', 'breadcrumbs', 'organization', 'localBusiness'])
const STORAGE_KINDS = new Set(['record', 'case', 'thread', 'config'])
const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/

/**
 * What a type's read calls return, and where one item's declared fields live — fixed by the storage
 * kind (see app-objects.md "Paginated List Responses"). Sites must read items from `response.data`.
 */
export function responseShape(type: AppDataType): { returns: string; item: string } {
  const s = type.storage
  const first = Object.keys(type.fields || {})[0] || 'field'
  const paged = (name: string) =>
    `list → { data: ${name}[], pagination: { total, limit, offset, hasMore } }. The items are in response.data (not response.items / response.records); page with offset/limit while pagination.hasMore. get → one ${name}.`
  switch (s && s.kind) {
    case 'record':
      return { returns: paged('AppRecord'), item: `Each record's declared fields are in record.data (e.g. record.data.${first}); record.id, record.productId, record.status, record.createdAt are top-level.` }
    case 'case':
      return { returns: paged('AppCase'), item: `Each case's declared fields are in case.data (e.g. case.data.${first}); id, status, category and dates are top-level.` }
    case 'thread':
      return { returns: paged('AppThread'), item: `Each thread's declared fields are in thread.data (e.g. thread.data.${first}); replies are in thread.replies.` }
    case 'config': {
      const key = (s as any).key
      return { returns: "The app's configuration object for the collection.", item: key ? `The items are in config.${key}; each item's fields are its declared fields.` : 'The declared fields are top-level properties of the config object.' }
    }
    default:
      return { returns: '(unknown storage)', item: '' }
  }
}

/** The standard SDK read calls for a type, from how it's stored. `appId` / `collectionId` are the caller's variables. */
export function standardRecipe(type: AppDataType): { list: string; get?: string } {
  const s = type.storage
  switch (s && s.kind) {
    case 'record':
      return {
        list: `SL.app.records.list(collectionId, appId, { recordType: '${(s as any).recordType}', limit: 50 })`,
        get: 'SL.app.records.get(collectionId, appId, recordId)',
      }
    case 'case':
      return { list: 'SL.app.cases.list(collectionId, appId, { limit: 50 })', get: 'SL.app.cases.get(collectionId, appId, caseId)' }
    case 'thread':
      return { list: 'SL.app.threads.list(collectionId, appId, { limit: 50 })', get: 'SL.app.threads.get(collectionId, appId, threadId)' }
    case 'config':
      return { list: `SL.appConfiguration.getConfig({ collectionId, appId })${(s as any).key ? `  // → config.${(s as any).key}` : ''}` }
    default:
      return { list: '(unknown storage)' }
  }
}

function isPlaceholder(v: unknown): boolean {
  return typeof v === 'string' && /lorem ipsum|^(todo|tbd|example|test|foo|bar)$/i.test(v.trim())
}

/** Does a value fit a declared field? Returns a reason when it doesn't. */
function mismatch(field: AppDataField, value: unknown): string | null {
  if (value === null || value === undefined) return null
  const t = field.type
  const isLocalizedObject = field.localized && typeof value === 'object' && !Array.isArray(value) &&
    Object.values(value as object).every((x) => typeof x === 'string')
  switch (t) {
    case 'string': case 'text': case 'richtext': case 'markdown':
      return typeof value === 'string' || isLocalizedObject ? null : `expected ${t} (a string${field.localized ? ' or { lang: string }' : ''})`
    case 'url':
      return typeof value === 'string' ? null : 'expected a URL string'
    case 'number':
      return typeof value === 'number' && Number.isFinite(value) ? null : 'expected a number'
    case 'boolean':
      return typeof value === 'boolean' ? null : 'expected true/false'
    case 'date':
      return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? null : 'expected an ISO date (YYYY-MM-DD)'
    case 'datetime':
      return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? null : 'expected an ISO date-time'
    case 'enum':
      return (field.options || []).includes(value as string) ? null : `expected one of ${(field.options || []).join(', ')}`
    case 'image': case 'file':
      return typeof value === 'string' || (typeof value === 'object' && !Array.isArray(value) && typeof (value as any).url === 'string')
        ? null : `expected a URL string or { url }`
    case 'ref':
      return typeof value === 'string' ? null : 'expected an id string'
    case 'string[]': case 'ref[]':
      return Array.isArray(value) && value.every((x) => typeof x === 'string') ? null : 'expected an array of strings'
    default:
      return null
  }
}

function checkItems(
  label: 'example' | 'real item',
  typeId: string,
  type: AppDataType,
  items: Array<Record<string, unknown>>,
  out: { errors: HeadlessIssue[]; warnings: HeadlessIssue[] },
) {
  const fields = type.fields || {}
  const undeclared = new Map<string, number>()
  items.forEach((item, i) => {
    const at = `data.types.${typeId}.${label === 'example' ? 'examples' : 'realData'}[${i}]`
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      out.errors.push({ path: at, message: `${label} must be an object (the item's data JSON)` })
      return
    }
    for (const [key, field] of Object.entries(fields)) {
      if ((field.zone || 'data') !== 'data') continue // examples / samples are the data zone
      const value = item[key]
      if (field.required && (value === undefined || value === null || value === '')) {
        ;(label === 'example' ? out.errors : out.warnings).push({ path: `${at}.${key}`, message: `required field "${key}" is missing` })
        continue
      }
      const why = mismatch(field, value)
      if (why) (label === 'example' ? out.errors : out.warnings).push({ path: `${at}.${key}`, message: `"${key}": ${why}` })
      if (label === 'example' && isPlaceholder(value)) out.warnings.push({ path: `${at}.${key}`, message: 'looks like placeholder text — use realistic content' })
    }
    for (const key of Object.keys(item)) if (!(key in fields)) undeclared.set(key, (undeclared.get(key) || 0) + 1)
  })
  for (const [key, n] of undeclared) {
    out.warnings.push({
      path: `data.types.${typeId}.fields`,
      message: label === 'example'
        ? `example uses "${key}", which isn't a declared field`
        : `real data has "${key}" (in ${n} of ${items.length} items) but it isn't declared — declare it, or confirm it's internal`,
    })
  }
}

export interface ValidateOptions {
  /** Real items per type id (each item's `data` zone JSON), e.g. sampled from a test collection. */
  samples?: Record<string, Array<Record<string, unknown>>>
}

/** Validate a manifest's `data` + `headless` blocks. */
export function validate(manifest: { data?: AppDataDeclaration; headless?: AppHeadlessDeclaration; [k: string]: any }, opts: ValidateOptions = {}): HeadlessValidation {
  const errors: HeadlessIssue[] = []
  const warnings: HeadlessIssue[] = []
  const recipes: HeadlessValidation['recipes'] = {}
  const err = (path: string, message: string) => errors.push({ path, message })
  const warn = (path: string, message: string) => warnings.push({ path, message })

  const data = manifest && manifest.data
  const headless = manifest && manifest.headless

  // ---- data
  if (!data) {
    err('data', headless ? 'a headless app needs a `data` block declaring its types' : 'no `data` block')
  } else {
    if (!data.schemaVersion || !SEMVER.test(data.schemaVersion)) err('data.schemaVersion', 'set a semver, e.g. "1.0.0"')
    const types = data.types || {}
    if (!Object.keys(types).length) err('data.types', 'declare at least one type')
    const typeIds = new Set(Object.keys(types))
    for (const [typeId, type] of Object.entries(types)) {
      const at = `data.types.${typeId}`
      if (!/^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)*$/.test(typeId)) err(at, 'type ids are lowercase, dot-separated (e.g. "faq.item")')
      if (!type.description || type.description.trim().length < 10) err(`${at}.description`, 'say what one item is, in a sentence')
      const kind = type.storage && (type.storage as any).kind
      if (!STORAGE_KINDS.has(kind)) err(`${at}.storage`, 'storage.kind must be record, case, thread or config')
      if (kind === 'record' && !(type.storage as any).recordType) err(`${at}.storage.recordType`, 'record storage needs the recordType the app writes')
      if (type.visibility && !['public', 'owner', 'admin'].includes(type.visibility)) err(`${at}.visibility`, 'public, owner or admin')
      const fields = type.fields || {}
      if (!Object.keys(fields).length) err(`${at}.fields`, 'declare the fields')
      for (const [key, f] of Object.entries(fields)) {
        const fat = `${at}.fields.${key}`
        if (!f || !FIELD_TYPES.has(f.type)) { err(fat, `unknown type "${f && f.type}" (one of ${[...FIELD_TYPES].join(', ')})`); continue }
        if (f.type === 'enum' && !(f.options && f.options.length)) err(fat, 'an enum needs options')
        if ((f.type === 'ref' || f.type === 'ref[]') && !(f.to && (typeIds.has(f.to) || PLATFORM_REFS.has(f.to)))) {
          err(fat, `"to" must name a declared type or product/contact/proof`)
        }
        if (f.localized && !TEXT_TYPES.has(f.type)) warn(fat, 'only text fields can be localized')
        if (f.public && f.zone && f.zone !== 'data') err(fat, `a ${f.zone}-zone field can't be public — only the data zone is readable publicly`)
      }
      for (const k of (type.listing && type.listing.sort) || []) if (!(k.replace(/^-/, '') in fields)) err(`${at}.listing.sort`, `"${k}" isn't a field`)
      for (const k of (type.listing && type.listing.filters) || []) if (!(k in fields)) err(`${at}.listing.filters`, `"${k}" isn't a field`)
      if (type.examples) checkItems('example', typeId, type, type.examples, { errors, warnings })
      const samples = opts.samples && opts.samples[typeId]
      if (samples && samples.length) checkItems('real item', typeId, type, samples, { errors, warnings })
      const std = standardRecipe(type)
      const get = (type.read && type.read.get) || std.get
      recipes[typeId] = { list: (type.read && type.read.list) || std.list, ...(get ? { get } : {}), ...responseShape(type) }
    }
  }

  // ---- headless
  if (headless) {
    if (!headless.purpose || headless.purpose.trim().length < 40) {
      err('headless.purpose', 'explain what content this holds and when a site should use it (a few sentences)')
    }
    const cats = headless.categories || []
    if (!cats.length) err('headless.categories', `pick at least one: ${HEADLESS_CATEGORIES.join(', ')}`)
    for (const c of cats) if (!HEADLESS_CATEGORIES.includes(c as HeadlessCategory)) err('headless.categories', `"${c}" isn't a category (${HEADLESS_CATEGORIES.join(', ')})`)
    if (!headless.editedIn || !headless.editedIn.label) err('headless.editedIn.label', 'say where the business edits this content (the app admin screen)')
    for (const s of (headless.render && headless.render.seo) || []) if (!SEO_HELPERS.has(s)) err('headless.render.seo', `"${s}" isn't an SEO helper (${[...SEO_HELPERS].join(', ')})`)
    const types = (data && data.types) || {}
    const primary = headless.primaryTypes || []
    if (!primary.length) err('headless.primaryTypes', 'name the type(s) a site renders')
    for (const id of primary) {
      const type = types[id]
      if (!type) { err('headless.primaryTypes', `"${id}" isn't a declared type`); continue }
      if (type.visibility === 'admin') err(`data.types.${id}.visibility`, 'a primary type must be readable by visitors (visibility public)')
      const publicFields = Object.entries(type.fields || {}).filter(([, f]) => f.public)
      if (!publicFields.length) err(`data.types.${id}.fields`, 'mark the fields a visitor may read with "public": true')
      if (!type.examples || !type.examples.length) err(`data.types.${id}.examples`, 'add at least one realistic example item')
      if (!type.read) warn(`data.types.${id}.read`, 'no read recipe — the standard one for its storage is used (see recipes)')
    }
    if (!(headless.render && headless.render.guidance)) warn('headless.render.guidance', 'add a line on how a site should present this content')
  }

  return { ok: errors.length === 0, errors, warnings, recipes }
}
