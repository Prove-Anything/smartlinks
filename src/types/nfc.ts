// src/types/nfc.ts

import { variant } from "../api"


export interface NfcTagInfo {
  /* the codeId */
  id: string
  /* the underlying tag id */
  tagId: string
  claimSetId: string
  collectionId?: string
  productId?: string
  batchId?: string
  variantId?: string
  proofId?: string
  index?: number
  data?: Record<string, any>
}

export interface NfcValidateRequest {
  /* The claim set associated with the NFC tag */
  claimSetId: string
  /* The NFC tag code to validate */
  codeId: string
  /* Optional mirror params to validate and NFC*/
  mirror?: string
  /* Optional user ID for context */
  userId?: string
}

export interface NfcValidateResponse {

  /* The claim set associated with the NFC tag */
  claimSetId: string
  /* The NFC tag code to validate */
  codeId: string
  /* The NFC underlaying tag  */
  tagId: string
  /* The index of the tag on a roll */
  index?: number
  /* If we think this user is an admin */
  isAdmin: boolean
  /* a local redirect path to url for a public view of the tag */
  path?: string
  collectionId?:  string
  /* a full collection object */
  collection?:  Record<string, any>
  /* the number of times this tag has been scanned */
  count: number,
  /* the previous number of times this tag has been scanned and registered */
  previousCount: number
  /* free form data */
  data?: Record<string, any>
  productId?:  string
  /* a full product object */
  product?:  Record<string, any>
  batchId?:  string
  variantId?:  string
  proofId?:  string
}

export interface NfcClaimTagRequest {
  claimSetId: string
  codeId: string
  data: Record<string, any>
}
