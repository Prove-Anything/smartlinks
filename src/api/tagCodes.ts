import { post } from "../http"
import { TagCodeRef, TagCodeAttachRequest, TagCodeState } from "../types"

/**
 * Tags on a collection's things (docs/tag-codes.md): what a scanned tag is, attaching it to an asset (a proof),
 * taking it off. One set of calls for every claim-set tag: printed QR (a computed set's code, bought or printed
 * yourself) and NFC. Pass what was scanned (`url`) or `claimSetId` + `code`. Admin only.
 */
export namespace tagCodes {
  const base = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/tagCodes`

  /** What a tag is, as far as this collection may know: free, attached here (to what), or elsewhere. */
  export async function lookup(collectionId: string, tag: TagCodeRef): Promise<TagCodeState> {
    return post<TagCodeState>(`${base(collectionId)}/lookup`, tag)
  }

  /**
   * Put a tag on an asset: its asset type (productId) and the asset itself (proofId). Refused when the tag
   * belongs to another organisation, or is already on another asset (detach it first).
   */
  export async function attach(collectionId: string, params: TagCodeAttachRequest): Promise<TagCodeState> {
    return post<TagCodeState>(`${base(collectionId)}/attach`, params)
  }

  /** Take a tag off its asset. It stays this collection's, free to go on another. */
  export async function detach(collectionId: string, tag: TagCodeRef): Promise<TagCodeState> {
    return post<TagCodeState>(`${base(collectionId)}/detach`, tag)
  }
}
