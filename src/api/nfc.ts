// src/api/nfc.ts
import { post, request } from "../http"
import type { NfcValidateRequest, NfcValidateResponse, NfcTagInfo, NfcClaimTagRequest } from "../types/nfc"

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
   * Lookup a tag by its ID (public).
   * GET /public/nfc/findByTag/:tagId
   */
  export async function lookupTag(tagId: string): Promise<NfcTagInfo[]> {
    return request<NfcTagInfo[]>(`/public/nfc/findByTag/${encodeURIComponent(tagId)}`)
  }
}
