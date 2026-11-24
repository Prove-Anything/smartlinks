// src/api/nfc.ts
import { post, request } from "../http"
import type { NfcValidateRequest, NfcValidateResponse, NfcTagInfo, NfcClaimTagRequest } from "../types/nfc"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

export namespace nfc {
  /**
   * Claim an NFC tag (public).
   * POST /public/nfc/claimTag
   */
  export async function claimTag(data: NfcClaimTagRequest): Promise<NfcTagInfo> {
    return post<NfcTagInfo>("/public/nfc/claimTag", data)
  }

  /**
   * Validate an NFC tag payload (public).
   * POST /public/nfc/validate
   */
  export async function validate(data: NfcValidateRequest): Promise<NfcValidateResponse> {
    return post<NfcValidateResponse>("/public/nfc/validate", data)
  }

  /**
   * Lookup a tag by its ID (public): every code that tag is known as, a page at a time.
   * GET /public/nfc/findByTag/:tagId
   *
   * @param tagId - The tag's ID
   *
   * @example
   * ```typescript
   * const { items } = await nfc.lookupTag('04A1B2C3D4E5F6')
   * ```
   */
  export async function lookupTag(tagId: string): Promise<ListResult<NfcTagInfo>> {
    return request<ListResult<NfcTagInfo>>(`/public/nfc/findByTag/${encodeURIComponent(tagId)}`)
  }
}
