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