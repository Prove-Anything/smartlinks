export type ContactCustomFields = Record<string, any>

// Unified Contact domain model
export interface Contact {
  contactId: string
  orgId: string

  // linkage to a user when available
  userId: string | null

  firstName: string | null
  lastName: string | null
  displayName: string | null
  company: string | null

  // simple primary fields (what most users want)
  email: string | null
  phone: string | null

  // optional advanced fields (only returned if requested)
  emails?: string[]
  phones?: string[]

  // optional enriched fields
  tags?: string[]
  source?: string | null
  notes?: string | null
  avatarUrl?: string | null
  locale?: string | null
  timezone?: string | null
  externalIds?: Record<string, any>

  /** First-party communications state (preferred). If absent, may exist under customFields.comms */
  comms?: CommsState

  customFields: ContactCustomFields

  createdAt: string
  updatedAt: string
  deletedAt: string | null
  erasedAt: string | null
}

// Backwards compatibility alias
export type ContactResponse = Contact

// Input types derived from the unified model
export type ContactCreateRequest = Omit<
  Contact,
  "contactId" | "orgId" | "createdAt" | "updatedAt" | "deletedAt" | "erasedAt"
>
export type ContactUpdateRequest = Partial<ContactCreateRequest>

export interface ContactListResponse {
  items: Contact[]
  limit: number
  offset: number
}

// Public contact upsert (privacy-safe) derived from Contact
export type PublicContactUpsertRequest = Partial<
  Pick<
    Contact,
    | "email"
    | "phone"
    | "userId"
    | "firstName"
    | "lastName"
    | "displayName"
    | "company"
    | "tags"
    | "source"
    | "notes"
    | "avatarUrl"
    | "locale"
    | "timezone"
    | "externalIds"
  >
> & { customFields?: ContactCustomFields }

export interface PublicContactUpsertResponse {
  ok: boolean
  contactId: string
}


export interface UserSearchResponse {
  user: {
    uid: string,
    displayName: string | null,
    email: string | null,
    phoneNumber: string | null,
    photoURL: string | null
  },
  contact: ContactResponse | null
  existsAsContact: boolean
}

// Public visibility shape for "my contact" endpoints
export interface ContactPublic {
  contactId: string
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  company?: string | null
  avatarUrl?: string | null
  locale?: string | null
  timezone?: string | null
  email?: string | null
  phone?: string | null
  externalIds?: Record<string, any>
  customFields?: ContactCustomFields
}

// Patch payload for updating "my contact" (public)
export type ContactPatch = Partial<
  Pick<
    Contact,
    | "firstName"
    | "lastName"
    | "displayName"
    | "company"
    | "avatarUrl"
    | "locale"
    | "timezone"
    | "email"
    | "phone"
    | "externalIds"
  >
> & { customFields?: ContactCustomFields }

// Responses for public "my contact" endpoints
export interface PublicGetMyContactResponse { ok: boolean; contact: ContactPublic | null }
export interface PublicUpdateMyContactResponse { ok: boolean; contact: ContactPublic }

// Communications state embedded in contact

export type ChannelName = import('./broadcasts').BroadcastChannel
export type SubjectType = 'product' | 'proof' | 'batch'

/** Registered delivery method for a contact */
export interface CommMethodMeta {
  // Push
  pushEndpoint?: string
  p256dh?: string
  auth?: string
  // SMS
  phone?: string
  // Email
  email?: string
  // Wallet (can be tied to a subject)
  walletObjectId?: string
  subjectType?: SubjectType
  subjectId?: string
  productId?: string
}

export interface CommMethod {
  id?: string
  type: ChannelName
  meta?: CommMethodMeta
  verified?: boolean
  suppressed?: boolean
  createdAt?: string
}

/** Subject-level opt-in linking contact to a subject (audience targeting) */
export interface Subscription {
  id: string // canonical key derived from subject (opaque to clients)
  subjectType: SubjectType
  subjectId: string
  productId?: string | null
  contactId: string
  source?: string // e.g., 'api'
  createdAt?: string
  deletedAt?: string | null
}

/** Per-subject consent (or `_default` when no subject) */
export interface PreferenceEntry {
  subjectType?: SubjectType | null
  subjectId?: string | null
  /** Channel-level toggles for delivery */
  channels?: Partial<Record<ChannelName, boolean>>
  /** Topic-level toggles (apply across channels) */
  topics?: Record<string, boolean>
  /** Optional per-channel topic preferences */
  topicsByChannel?: Partial<Record<ChannelName, Record<string, boolean>>>
  updatedAt?: string
}

/** Communications state embedded in contact customFields or first-party column */
export interface CommsState {
  methods?: CommMethod[]
  subscriptions?: Subscription[]
  /** Keyed by `_default` or `${type}_${id}` */
  preferences?: Record<string, PreferenceEntry>
}

// Public contact schema for update forms

/**
 * Operators for conditional field visibility.
 * Use these to control when a custom field is shown based on another field's value.
 */
export type ConditionOperator = 
  | 'equals'       // value === target
  | 'notEquals'    // value !== target
  | 'contains'     // for multiselect: array includes value
  | 'notContains'  // for multiselect: array does not include value
  | 'isEmpty'      // value is null/undefined/empty
  | 'isNotEmpty'   // value has a value
  | 'isTrue'       // for boolean fields
  | 'isFalse'      // for boolean fields

/**
 * Condition that determines when a field should be visible.
 * When present, the field only renders if the condition evaluates to true.
 */
export interface FieldCondition {
  dependsOn: string          // key of the field to check (not path)
  operator: ConditionOperator
  value?: string | string[]  // required for equals/notEquals/contains/notContains
}

export type FieldWidget = 'text' | 'email' | 'tel' | 'select' | 'multiselect' | 'checkbox' | 'number' | 'date' | 'url'
export type FieldType =
  | 'string'     // core text-like fields
  | 'url'
  | 'email'
  | 'tel'
  | 'text'       // custom text
  | 'select'
  | 'checkbox'
  | 'boolean'    // alias for checkbox

export interface BaseField {
  key: string
  label: string
  type: FieldType
  widget: FieldWidget
  visible: boolean
  editable: boolean
  readOnly: boolean
}

export interface CoreField extends BaseField {
  // keys like: contactId, firstName, lastName, displayName, company, avatarUrl, locale, timezone, email, phone
}

/**
 * Custom field definition returned by the schema endpoint.
 */
export interface CustomField extends BaseField {
  path: string                // e.g. "customFields.City"
  required: boolean
  order?: number
  options?: string[]          // for select/multiselect widgets
  placeholder?: string
  description?: string
  condition?: FieldCondition  // if set, field only shows when condition is met
}

export interface ContactSchema {
  version: number          // 1
  fields: CoreField[]      // core fields
  customFields: CustomField[]
  settings: {
    publicVisibleFields: string[]
    publicEditableFields: string[]
    customFieldsVersion: number
  }
}

/**
 * Evaluate whether a field's condition is satisfied.
 * Returns true if the field should be visible.
 * 
 * @example
 * ```typescript
 * const field = schema.customFields.find(f => f.key === 'city')
 * const isVisible = evaluateCondition(field.condition, formValues)
 * ```
 */
export function evaluateCondition(
  condition: FieldCondition | undefined,
  fieldValues: Record<string, any>
): boolean {
  if (!condition) return true // No condition = always visible
  
  const value = fieldValues[condition.dependsOn]
  
  switch (condition.operator) {
    case 'isEmpty':
      return value == null || value === '' || (Array.isArray(value) && !value.length)
    case 'isNotEmpty':
      return value != null && value !== '' && !(Array.isArray(value) && !value.length)
    case 'isTrue':
      return value === true
    case 'isFalse':
      return value === false
    case 'equals':
      return value === condition.value
    case 'notEquals':
      return value !== condition.value
    case 'contains':
      return Array.isArray(value) && value.includes(condition.value)
    case 'notContains':
      return !Array.isArray(value) || !value.includes(condition.value)
    default:
      return true
  }
}