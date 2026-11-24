import { request, post, del, patch } from "../http"
import { ContactResponse, ContactCreateRequest, ContactUpdateRequest, ContactSearchParams, PublicContactUpsertRequest, PublicContactUpsertResponse, UserSearchResponse, ContactPublic, ContactPatch, PublicGetMyContactResponse, PublicUpdateMyContactResponse, ContactSchemaResponse, ContactDuplicatesResponse, ContactMergeResponse, ContactLinkLoginResponse } from "../types"

import type { StandardQuery, QueryResult, QueryDescription } from "../types/query"
import type { ListResult, ListOptions } from "../types/list"

export namespace contact {
  /**
   * The standard query on contacts (admin only): filter, sort, page, count and total in one call.
   * POST /admin/collection/:collectionId/contacts/query
   *
   * Fields: contactId, userId, firstName, lastName, displayName, company, email, phone, tags, source,
   * locale, createdAt, updatedAt. Email and phone are the contact's main one. Deleted and erased
   * contacts are never returned.
   *
   * ```typescript
   * await contact.query(collectionId, {
   *   where: { tags: { hasAny: ['vip', 'trade'] }, createdAt: { gte: '2026-01-01' } },
   *   select: ['contactId', 'firstName', 'email'], count: true,
   * })
   * await contact.query(collectionId, { groupBy: ['company'], aggregates: { people: { count: true } } })
   * ```
   */
  export async function query(
    collectionId: string,
    body: StandardQuery = {}
  ): Promise<QueryResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/query`
    return post<QueryResult>(path, body)
  }

  /**
   * What a contacts query can use: its fields and what each can filter, sort, group or total.
   * GET /admin/collection/:collectionId/contacts/query
   */
  export async function queryFields(collectionId: string): Promise<QueryDescription> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/query`
    return request<QueryDescription>(path)
  }
  export async function create(collectionId: string, data: ContactCreateRequest): Promise<ContactResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts`
    return post<ContactResponse>(path, data)
  }

  /**
   * The collection's contacts, a page at a time (admin only). Pass `includeDeleted: true` to include
   * deleted contacts. For filters, sorting and totals use `contact.query` or `contact.search`.
   * GET /admin/collection/:collectionId/contacts
   *
   * @example
   * ```typescript
   * let page = await contact.list('coll_123', { limit: 50 })
   * page.items // Contact[]
   * while (page.nextCursor) page = await contact.list('coll_123', { limit: 50, cursor: page.nextCursor })
   * ```
   */
  export async function list(
    collectionId: string,
    params?: ListOptions & { includeDeleted?: boolean }
  ): Promise<ListResult<ContactResponse>> {
    const query = new URLSearchParams()
    if (params?.limit !== undefined) query.set("limit", String(params.limit))
    if (params?.cursor !== undefined) query.set("cursor", params.cursor)
    if (params?.includeDeleted !== undefined) query.set("includeDeleted", String(params.includeDeleted))
    const qs = query.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts${qs ? `?${qs}` : ""}`
    return request<ListResult<ContactResponse>>(path)
  }

  /**
   * Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead`
   * for search-as-you-type), or filters on email, phone, id, tags, source, dates and custom fields.
   * GET /admin/collection/:collectionId/contacts/search
   *
   * @example
   * ```typescript
   * let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 })
   * page.items // Contact[]
   * if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor })
   * ```
   */
  export async function search({
    collectionId,
    q,
    typeahead,
    email,
    phone,
    id,
    userId,
    tags,
    tagsAll,
    source,
    locale,
    createdFrom,
    createdTo,
    externalIdKey,
    externalIdValue,
    customFieldKey,
    customFieldValue,
    limit,
    cursor,
  }: ContactSearchParams): Promise<ListResult<ContactResponse>> {
    const query = new URLSearchParams()
    if (q !== undefined) query.set("q", q)
    if (typeahead !== undefined) query.set("typeahead", String(typeahead))
    if (email !== undefined) query.set("email", email)
    if (phone !== undefined) query.set("phone", phone)
    if (id !== undefined) query.set("id", id)
    if (userId !== undefined) query.set("userId", userId)
    if (tags !== undefined) {
      const arr = Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())
      arr.forEach(t => query.append("tags", t))
    }
    if (tagsAll !== undefined) {
      const arr = Array.isArray(tagsAll) ? tagsAll : tagsAll.split(",").map(t => t.trim())
      arr.forEach(t => query.append("tagsAll", t))
    }
    if (source !== undefined) query.set("source", source)
    if (locale !== undefined) query.set("locale", locale)
    if (createdFrom !== undefined) query.set("createdFrom", createdFrom)
    if (createdTo !== undefined) query.set("createdTo", createdTo)
    if (externalIdKey !== undefined) query.set("externalIdKey", externalIdKey)
    if (externalIdValue !== undefined) query.set("externalIdValue", externalIdValue)
    if (customFieldKey !== undefined) query.set("customFieldKey", customFieldKey)
    if (customFieldValue !== undefined) query.set("customFieldValue", customFieldValue)
    if (limit !== undefined) query.set("limit", String(limit))
    if (cursor !== undefined) query.set("cursor", cursor)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/search?${query.toString()}`
    return request<ListResult<ContactResponse>>(path)
  }

  export async function get(
    collectionId: string,
    contactId: string,
    params?: { includeDeleted?: boolean }
  ): Promise<ContactResponse> {
    const query = new URLSearchParams()
    if (params?.includeDeleted !== undefined) query.set("includeDeleted", String(params.includeDeleted))
    const qs = query.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}${qs ? `?${qs}` : ""}`
    return request<ContactResponse>(path)
  }

  export async function update(
    collectionId: string,
    contactId: string,
    data: ContactUpdateRequest
  ): Promise<ContactResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}`
    return patch<ContactResponse>(path, data)
  }

  export async function remove(collectionId: string, contactId: string): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}`
    return del<void>(path)
  }

  export async function lookup(
    collectionId: string,
    params: { email?: string; phone?: string }
  ): Promise<ContactResponse> {
    const query = new URLSearchParams()
    if (params.email) query.set("email", params.email)
    if (params.phone) query.set("phone", params.phone)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/lookup?${query.toString()}`
    return request<ContactResponse>(path)
  }

  export async function upsert(
    collectionId: string,
    data: ContactCreateRequest
  ): Promise<ContactResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/upsert`
    return post<ContactResponse>(path, data)
  }

  // Public contact upsert (privacy-safe): returns only ok + contactId
  export async function publicUpsert(
    collectionId: string,
    data: PublicContactUpsertRequest
  ): Promise<PublicContactUpsertResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/contact`
    return post<PublicContactUpsertResponse>(path, data)
  }

  // Public: Get "my" contact (requires auth bearer token)
  export async function publicGetMine(
    collectionId: string
  ): Promise<PublicGetMyContactResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/contact/me`
    return request<PublicGetMyContactResponse>(path)
  }

  // Public: Update "my" contact (requires auth bearer token)
  export async function publicUpdateMine(
    collectionId: string,
    data: ContactPatch
  ): Promise<PublicUpdateMyContactResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/contact/me`
    return patch<PublicUpdateMyContactResponse>(path, data)
  }

  /**
   * Public: Get the contact schema for a collection.
   * GET /public/collection/:collectionId/contact/schema
   *
   * Returns a ContactSchemaResponse describing all publicly visible contact fields.
   * Core fields and collection-defined custom fields are merged into a single flat schema.
   *
   * Fields not in `publicVisibleFields` are stripped entirely from the response.
   * Fields visible but not in `publicEditableFields` have `ui:disabled: true` in `uiSchema`.
   *
   * Use `fieldOrder` to render fields in the correct sequence, and `evaluateConditions`
   * from the types package to handle conditional field visibility.
   *
   * @example
   * ```typescript
   * import { contact, evaluateConditions } from '@proveanything/smartlinks'
   *
   * const schema = await contact.publicGetSchema(collectionId)
   *
   * for (const fieldId of schema.fieldOrder) {
   *   const property = schema.schema.properties[fieldId]
   *   const ui       = schema.uiSchema[fieldId] || {}
   *   const visible  = evaluateConditions(property.conditions, property.showWhen, formValues)
   *   const disabled = ui['ui:disabled'] === true
   *   if (visible) renderField({ fieldId, property, ui, disabled })
   * }
   * ```
   */
  export async function publicGetSchema(
    collectionId: string
  ): Promise<ContactSchemaResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/contact/schema`
    return request<ContactSchemaResponse>(path)
  }

  export async function erase(collectionId: string, contactId: string, body?: any): Promise<ContactResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}/erase`
    return post<ContactResponse>(path, body || {})
  }

  /**
   * Admin: pairs of contacts that look like one person.
   * GET /admin/collection/:collectionId/contacts/duplicates
   *
   * The pattern it finds: someone the collection knew by email first (an import, a list, a form) who
   * later signed in. Their sign-in got a second contact, which could not take the email the first one
   * already held — so one contact has the email and no sign-in, the other the sign-in (and everything
   * they did) and no email. The match is made on the server, on verified addresses only.
   *
   * Checks a window of contacts per call and returns the pairs found in it (`items`); `scanned` is how
   * many contacts it checked. While `nextCursor` is not null, call again with it as `cursor` to check
   * the next window.
   *
   * @example
   * ```typescript
   * const { items: pairs } = await contact.findDuplicates(collectionId)
   * for (const pair of pairs) {
   *   await contact.merge(collectionId, pair.keep.contactId, pair.merge.contactId)
   * }
   * ```
   */
  export async function findDuplicates(
    collectionId: string,
    params?: ListOptions
  ): Promise<ContactDuplicatesResponse> {
    const query = new URLSearchParams()
    if (params?.limit !== undefined) query.set("limit", String(params.limit))
    if (params?.cursor !== undefined) query.set("cursor", params.cursor)
    const qs = query.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/duplicates${qs ? `?${qs}` : ""}`
    return request<ContactDuplicatesResponse>(path)
  }

  /**
   * Admin: fold contact `fromContactId` INTO contact `keepContactId`.
   * POST /admin/collection/:collectionId/contacts/:keepContactId/merge
   *
   * The kept contact gains the other's sign-in, emails and phones, and anything it had no value for;
   * its own values win. Everything recorded against the other contact moves to the kept one. Consent is
   * never loosened: an opt-out on either contact stays an opt-out. The other contact is soft-deleted and
   * marked with `customFields.mergedInto`.
   *
   * Refused (HTTP 409, `error` = a `ContactMergeErrorCode`) when the two have different sign-ins
   * (`LOGIN_CONFLICT`) or are both members of the same loyalty scheme (`LOYALTY_CONFLICT`).
   */
  export async function merge(
    collectionId: string,
    keepContactId: string,
    fromContactId: string
  ): Promise<ContactMergeResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(keepContactId)}/merge`
    return post<ContactMergeResponse>(path, { fromContactId })
  }

  /**
   * Admin: the contact that carries a sign-in, attaching the sign-in first to the contact that already
   * holds its verified email or phone.
   * POST /admin/collection/:collectionId/contacts/link-login
   *
   * For a service about to create a contact for a `userId`: call this first and only create when it
   * throws 404 (`NOTHING_TO_LINK`), so a person the collection already knows by email stays one contact.
   * The address is read from the sign-in itself and must be verified; nothing the caller says about an
   * email is used. Never creates a contact.
   *
   * @example
   * ```typescript
   * let contactId: string
   * try {
   *   contactId = (await contact.linkLogin(collectionId, userId)).contactId
   * } catch (err) {
   *   if (err.statusCode !== 404) throw err
   *   contactId = (await contact.create(collectionId, { userId, source: 'my-service' })).contactId
   * }
   * ```
   */
  export async function linkLogin(
    collectionId: string,
    userId: string
  ): Promise<ContactLinkLoginResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/link-login`
    return post<ContactLinkLoginResponse>(path, { userId })
  }

  // get user
  export async function getUser(
    collectionId: string,
    userId: string,
  ): Promise<UserSearchResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/owner/${encodeURIComponent(userId)}`
    return request<UserSearchResponse>(path)
  }
}
