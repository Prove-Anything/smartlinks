import { request, post, del, patch } from "../http"
import { ContactResponse, ContactCreateRequest, ContactUpdateRequest, ContactListResponse, PublicContactUpsertRequest, PublicContactUpsertResponse, UserSearchResponse, ContactPublic, ContactPatch, PublicGetMyContactResponse, PublicUpdateMyContactResponse, ContactSchema } from "../types"

export namespace contact {
  export async function create(collectionId: string, data: ContactCreateRequest): Promise<ContactResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts`
    return post<ContactResponse>(path, data)
  }

  export async function list(
    collectionId: string,
    params?: { limit?: number; offset?: number; includeDeleted?: boolean }
  ): Promise<ContactListResponse> {
    const query = new URLSearchParams()
    if (params?.limit !== undefined) query.set("limit", String(params.limit))
    if (params?.offset !== undefined) query.set("offset", String(params.offset))
    if (params?.includeDeleted !== undefined) query.set("includeDeleted", String(params.includeDeleted))
    const qs = query.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts${qs ? `?${qs}` : ""}`
    return request<ContactListResponse>(path)
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
   * Public: Get contact update schema for a collection
   * 
   * Fetches the public contact schema including core fields, custom fields with 
   * conditional visibility rules, and visibility/editability settings.
   * 
   * Custom fields may include a `condition` property that specifies when the field 
   * should be displayed. Apps rendering these forms should:
   * 1. Evaluate each field's `condition` against current form values
   * 2. Hide fields whose conditions are not met
   * 3. Skip validation for hidden fields (they shouldn't be required when not visible)
   */
  export async function publicGetSchema(
    collectionId: string
  ): Promise<ContactSchema> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/contact/schema`
    return request<ContactSchema>(path)
  }

  export async function erase(collectionId: string, contactId: string, body?: any): Promise<ContactResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/contacts/${encodeURIComponent(contactId)}/erase`
    return post<ContactResponse>(path, body || {})
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
