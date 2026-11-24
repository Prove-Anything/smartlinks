import { ContactResponse, ContactCreateRequest, ContactUpdateRequest, ContactSearchParams, PublicContactUpsertRequest, PublicContactUpsertResponse, UserSearchResponse, ContactPatch, PublicGetMyContactResponse, PublicUpdateMyContactResponse, ContactSchemaResponse, ContactDuplicatesResponse, ContactMergeResponse, ContactLinkLoginResponse } from "../types/index.js";
import type { StandardQuery, QueryResult, QueryDescription } from "../types/query.js";
import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace contact {
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
    function query(collectionId: string, body?: StandardQuery): Promise<QueryResult>;
    /**
     * What a contacts query can use: its fields and what each can filter, sort, group or total.
     * GET /admin/collection/:collectionId/contacts/query
     */
    function queryFields(collectionId: string): Promise<QueryDescription>;
    function create(collectionId: string, data: ContactCreateRequest): Promise<ContactResponse>;
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
    function list(collectionId: string, params?: ListOptions & {
        includeDeleted?: boolean;
    }): Promise<ListResult<ContactResponse>>;
    /**
     * Search the collection's contacts (admin only), a page at a time: free text (`q`, with `typeahead`
     * for search-as-you-type), or filters on email, phone, id, tags, source and custom fields. Filter by
     * when the contact was created with a range: `createdAt: { gte, lte }`.
     * GET /admin/collection/:collectionId/contacts/search
     *
     * @example
     * ```typescript
     * let page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20 })
     * page.items // Contact[]
     * if (page.nextCursor) page = await contact.search({ collectionId, q: 'joh', typeahead: true, limit: 20, cursor: page.nextCursor })
     *
     * // Contacts created in November
     * await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' } })
     * ```
     */
    function search({ collectionId, tags, tagsAll, ...rest }: ContactSearchParams): Promise<ListResult<ContactResponse>>;
    function get(collectionId: string, contactId: string, params?: {
        includeDeleted?: boolean;
    }): Promise<ContactResponse>;
    function update(collectionId: string, contactId: string, data: ContactUpdateRequest): Promise<ContactResponse>;
    function remove(collectionId: string, contactId: string): Promise<void>;
    function lookup(collectionId: string, params: {
        email?: string;
        phone?: string;
    }): Promise<ContactResponse>;
    function upsert(collectionId: string, data: ContactCreateRequest): Promise<ContactResponse>;
    function publicUpsert(collectionId: string, data: PublicContactUpsertRequest): Promise<PublicContactUpsertResponse>;
    function publicGetMine(collectionId: string): Promise<PublicGetMyContactResponse>;
    function publicUpdateMine(collectionId: string, data: ContactPatch): Promise<PublicUpdateMyContactResponse>;
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
    function publicGetSchema(collectionId: string): Promise<ContactSchemaResponse>;
    function erase(collectionId: string, contactId: string, body?: any): Promise<ContactResponse>;
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
    function findDuplicates(collectionId: string, params?: ListOptions): Promise<ContactDuplicatesResponse>;
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
    function merge(collectionId: string, keepContactId: string, fromContactId: string): Promise<ContactMergeResponse>;
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
    function linkLogin(collectionId: string, userId: string): Promise<ContactLinkLoginResponse>;
    function getUser(collectionId: string, userId: string): Promise<UserSearchResponse>;
}
