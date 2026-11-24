import type { ListOptions } from './list'

export type TranslationLookupMode = 'cache-fill' | 'cache-only'

export type TranslationContentType = 'text/plain' | 'text/html' | 'text/x-liquid' | (string & {})

export type TranslationQuality = 'machine' | 'human' | 'passthrough' | (string & {})

export type TranslationItemStatus = 'cached' | 'generated' | 'miss' | 'passthrough' | 'local-cache' | (string & {})

export type TranslationContextValue = string | number | boolean | null

export interface TranslationContext {
  surface?: string
  field?: string
  [key: string]: TranslationContextValue | undefined
}

export interface TranslationLookupRequestBase {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  contentType?: TranslationContentType
  context?: TranslationContext
  returnMeta?: boolean
}

export interface TranslationLookupSingleRequest extends TranslationLookupRequestBase {
  text: string
  texts?: never
}

export interface TranslationLookupBatchRequest extends TranslationLookupRequestBase {
  text?: never
  texts: string[]
}

export type TranslationLookupRequest = TranslationLookupSingleRequest | TranslationLookupBatchRequest

export interface TranslationLookupItem {
  index: number
  hash: string
  sourceText: string
  translatedText?: string
  status?: TranslationItemStatus
  provider?: string
  model?: string
  isOverride?: boolean
  quality?: TranslationQuality
  createdAt?: string
  updatedAt?: string
}

export interface TranslationLookupResponse {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  items: TranslationLookupItem[]
}

export interface ResolvedTranslationItem extends TranslationLookupItem {
  cacheSource?: 'local' | 'remote'
  expiresAt?: number
}

export interface ResolvedTranslationResponse {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  items: ResolvedTranslationItem[]
}

export interface TranslationHashOptions {
  trim?: boolean
  collapseWhitespace?: boolean
  unicodeNormalization?: 'NFC' | 'NFKC' | false
}

export interface TranslationResolveOptions {
  useLocalCache?: boolean
  refreshLocalCache?: boolean
  localCacheTtlMs?: number
  hashOptions?: TranslationHashOptions
}

export interface TranslationRecord {
  id: string
  collectionId: string
  sourceHash: string
  sourceText: string
  sourceLanguage?: string
  targetLanguage: string
  contentType: string
  contextKey?: string | null
  translatedText: string
  provider?: string | null
  model?: string | null
  quality: TranslationQuality
  isOverride: boolean
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

/** `translations.list` options: the filters, plus `limit` and `cursor`. */
export interface TranslationListParams extends ListOptions {
  targetLanguage?: string
  sourceLanguage?: string
  contentType?: string
  contextKey?: string
  q?: string
  isOverride?: boolean
  /** Only translations that don't use the site's required wording (see TranslationRules). */
  termIssues?: boolean
}

export interface TranslationUpdateRequest {
  translatedText?: string
  isOverride?: boolean
  quality?: TranslationQuality
  metadata?: Record<string, any>
}

/** One required term: the English wording and what each language must use, or kept as written. */
export interface TranslationTerm {
  source: string
  /** Keep exactly as written in every language (brand names, drug names, units). */
  keep?: boolean
  /** Language code -> required wording. */
  translations?: Record<string, string>
  note?: string
}

/**
 * A site's own rules for its machine translations: a brief for the whole site, notes per language, and
 * required terms. Used for every new translation; translations missing a required term are flagged
 * (record metadata.termIssues / termIssueCount).
 */
export interface TranslationRules {
  guidance: string
  languages: Record<string, { guidance: string }>
  terms: TranslationTerm[]
  /** Fingerprint of these rules; each machine translation stores the one it was made under (metadata.rulesVersion). */
  version?: string | null
  updatedAt?: string | null
  limits?: { guidance: number; languageGuidance: number; terms: number; term: number; note: number }
}
