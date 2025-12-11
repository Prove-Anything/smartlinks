// src/index.ts
// Top-level entrypoint of the npm package. Re-export initializeApi + all namespaces.

export { initializeApi, request, sendCustomProxyMessage } from "./http"
export * from "./api"
export * from "./types"
// Iframe namespace
export { iframe } from "./iframe"

// Explicitly re-export types for documentation
export type {
  LoginResponse,
  VerifyTokenResponse,
  AccountInfoResponse,
} from "./api/auth"

export type {
  UserAccountRegistrationRequest,
} from "./types/auth"
export type {
  SendNotificationRequest,
  SendNotificationResponse,
  NotificationSubjectTarget,
  NotificationTemplate,
  PushNotificationTemplate,
  EmailNotificationTemplate,
  WalletUpdateTemplate,
} from "./types/comms"
export type {
  AttestationResponse,
  AttestationCreateRequest,
  AttestationUpdateRequest,
} from "./types/attestation"
export type {
  BatchResponse,
  BatchCreateRequest,
  BatchUpdateRequest,
} from "./types/batch"
export type {
  VariantResponse,
  VariantCreateRequest,
  VariantUpdateRequest,
} from "./types/variant"
export type { AppConfigOptions } from "./api/appConfiguration"
export type {
  ProductCreateRequest,
  ProductUpdateRequest,
} from "./types/product"
