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
 * Used in ContactSchemaProperty.conditions[].operator.
 */
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'is_empty'
  | 'is_not_empty'
  | 'is_true'
  | 'is_false'
  | 'greater_than'
  | 'less_than'

/**
 * A single visibility condition on a field.
 * The field renders only when its conditions are satisfied (see `showWhen`).
 */
export interface FieldCondition {
  targetFieldId: string   // The field whose value is tested
  operator: ConditionOperator
  value?: unknown         // Required for equals / not_equals / contains / not_contains / greater_than / less_than
}

/**
 * A single field property as returned by the contact schema endpoint.
 * Follows JSON Schema conventions with rendering hints via `format`.
 *
 * Format values:
 *   (none)        → plain text input
 *   email         → email input
 *   uri           → URL input
 *   tel           → phone input
 *   date          → date picker
 *   textarea      → multi-line text
 *   select        → single-select dropdown (requires `enum`)
 *   multiselect   → multi-select (type will be 'array', requires `enum`)
 *   radio         → radio button group (requires `enum`)
 */
export interface ContactSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array'
  title?: string
  description?: string
  format?: string
  /** Stored values for select / radio / multiselect fields */
  enum?: string[]
  /**
   * Display labels for `enum` values — parallel array.
   * `enum[i]` is the stored value; `enumNames[i]` is the display label.
   * When absent, `enum` values are used as labels.
   */
  enumNames?: string[]
  /** Default value pre-populated into the field */
  default?: unknown
  // JSON Schema validation constraints
  /** Minimum string length (type: 'string') */
  minLength?: number
  /** Maximum string length (type: 'string') */
  maxLength?: number
  /** Regex pattern the value must match (type: 'string') */
  pattern?: string
  /** Minimum value (type: 'number') */
  minimum?: number
  /** Maximum value (type: 'number') */
  maximum?: number
  conditions?: FieldCondition[]
  showWhen?: 'all' | 'any'
}

/**
 * UI rendering hints for a single field, keyed by field ID in `uiSchema`.
 */
export interface ContactUiSchemaEntry {
  /** Field is visible but not editable */
  'ui:disabled'?: true
  /** Placeholder text shown inside the input */
  'ui:placeholder'?: string
  /** Help text shown below the field (longer than description) */
  'ui:help'?: string
  /** Override the auto-detected widget (e.g. 'textarea', 'radio', 'checkboxes') */
  'ui:widget'?: string
  /** Widget-specific options */
  'ui:options'?: {
    rows?: number        // textarea: number of visible rows
    accept?: string      // file: accepted MIME types
    label?: boolean      // checkbox: show inline label
    [key: string]: unknown
  }
  [key: string]: unknown
}

/**
 * Response from GET /public/collection/:collectionId/contact/schema
 *
 * Core fields and collection-defined custom fields are merged into a single
 * flat schema. Fields not in `publicVisibleFields` are stripped entirely.
 * Fields visible but not in `publicEditableFields` have `ui:disabled: true`
 * in `uiSchema`.
 */
export interface ContactSchemaResponse {
  schema: {
    type: 'object'
    required?: string[]
    properties: Record<string, ContactSchemaProperty>
  }
  uiSchema: Record<string, ContactUiSchemaEntry>
  /** Ordered list of field IDs — core fields first, then custom fields */
  fieldOrder: string[]
  /** Pass-through of the collection's SchemaFormConfig settings block */
  settings: Record<string, unknown>
  /** Pass-through of the collection's SchemaFormConfig styling block */
  styling: Record<string, unknown>
}

// Keep ContactSchema as a deprecated alias so existing consumers don't hard-break
/** @deprecated Use ContactSchemaResponse instead */
export type ContactSchema = ContactSchemaResponse

/**
 * Evaluate whether a field's conditions are satisfied given the current form values.
 * Returns `true` if the field should be visible.
 *
 * @param conditions  The `conditions` array from a ContactSchemaProperty (may be undefined)
 * @param showWhen    'all' requires every condition to pass; 'any' requires at least one
 * @param fieldValues Current form values keyed by field ID
 *
 * @example
 * ```typescript
 * const property = schema.schema.properties[fieldId]
 * const visible = evaluateConditions(property.conditions, property.showWhen, formValues)
 * ```
 */
export function evaluateConditions(
  conditions: FieldCondition[] | undefined,
  showWhen: 'all' | 'any' | undefined,
  fieldValues: Record<string, unknown>
): boolean {
  if (!conditions || conditions.length === 0) return true

  const results = conditions.map(condition => {
    const value = fieldValues[condition.targetFieldId]

    switch (condition.operator) {
      case 'is_empty':
        return value == null || value === '' || (Array.isArray(value) && value.length === 0)
      case 'is_not_empty':
        return value != null && value !== '' && !(Array.isArray(value) && value.length === 0)
      case 'is_true':
        return value === true
      case 'is_false':
        return value === false
      case 'equals':
        return value === condition.value
      case 'not_equals':
        return value !== condition.value
      case 'contains':
        return Array.isArray(value)
          ? value.includes(condition.value)
          : typeof value === 'string' && value.includes(String(condition.value))
      case 'not_contains':
        return Array.isArray(value)
          ? !value.includes(condition.value)
          : typeof value === 'string' && !value.includes(String(condition.value))
      case 'greater_than':
        return typeof value === 'number' && typeof condition.value === 'number'
          ? value > condition.value
          : String(value) > String(condition.value)
      case 'less_than':
        return typeof value === 'number' && typeof condition.value === 'number'
          ? value < condition.value
          : String(value) < String(condition.value)
      default:
        return true
    }
  })

  return (showWhen ?? 'all') === 'any'
    ? results.some(Boolean)
    : results.every(Boolean)
}

/**
 * @deprecated Use evaluateConditions (plural) instead.
 * Shim for code using the old single-condition API.
 */
export function evaluateCondition(
  condition: { dependsOn?: string; targetFieldId?: string; operator: string; value?: unknown } | undefined,
  fieldValues: Record<string, unknown>
): boolean {
  if (!condition) return true
  const targetFieldId = (condition as any).dependsOn ?? (condition as any).targetFieldId
  if (!targetFieldId) return true
  return evaluateConditions(
    [{ targetFieldId, operator: condition.operator as ConditionOperator, value: condition.value }],
    'all',
    fieldValues
  )
}