// src/index.ts
// Top-level entrypoint of the npm package. Re-export initializeApi + all namespaces.

export { initializeApi, isInitialized, hasAuthCredentials, configureSdkCache, invalidateCache, request, post, put, patch, del, sendCustomProxyMessage, getApiHeaders, isProxyEnabled, setBearerToken } from "./http"
export * from "./api"
export * from "./types"
// Iframe namespace
export { iframe } from "./iframe"
// Cache utilities
export * as cache from './cache'
// IframeResponder (also exported via iframe namespace)
export { 
  IframeResponder,
  isAdminFromRoles,
  buildIframeSrc,
} from './iframeResponder'
// Utility functions
export * as utils from './utils'

// Explicitly re-export types for documentation
export type {
  PortalPathParams,
  ConditionParams,
  ConditionDebugOptions,
  ConditionDebugLogger,
  ConditionSet,
  Condition,
  UserInfo,
  ProductInfo,
  ProofInfo,
  CollectionInfo,
} from './utils'

export type {
  LoginResponse,
  VerifyTokenResponse,
  AccountInfoResponse,
  AuthLocation,
} from "./api/auth"

export type {
  UserAccountRegistrationRequest,
} from "./types/auth"
export type {
  CommunicationEvent,
  CommsQueryByUser,
  CommsRecipientIdsQuery,
  CommsRecipientsWithoutActionQuery,
  CommsRecipientsWithActionQuery,
  RecipientId,
  RecipientWithOutcome,
  LogCommunicationEventBody,
  LogBulkCommunicationEventsBody,
  AppendResult,
  AppendBulkResult,
  CommsSettings,
  TopicConfig,
  CommsSettingsGetResponse,
  CommsSettingsPatchBody,
  CommsPublicTopicsResponse,
  UnsubscribeQuery,
  UnsubscribeResponse,
  CommsConsentUpsertRequest,
  CommsPreferencesUpsertRequest,
  CommsSubscribeRequest,
  CommsSubscribeResponse,
  CommsSubscriptionCheckQuery,
  CommsSubscriptionCheckResponse,
  CommsListMethodsQuery,
  CommsListMethodsResponse,
  RegisterEmailMethodRequest,
  RegisterSmsMethodRequest,
  RegisterMethodResponse,
  SubscriptionsResolveRequest,
  SubscriptionsResolveResponse,
} from "./types/comms"
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
export type { BroadcastSendRequest } from "./types/broadcasts"
export type { AppConfigOptions } from "./api/appConfiguration"
export type {
  AdditionalGtin,
  ISODateString,
  JsonPrimitive,
  JsonValue,
  ProductCreateRequest,
  ProductClaimCreateInput,
  ProductClaimCreateRequestBody,
  ProductClaimLookupInput,
  ProductFacetMap,
  ProductFacetValue,
  ProductImageUrlInput,
  ProductKey,
  ProductQueryRequest,
  ProductQueryResponse,
  ProductUpdateRequest,
  Product,
  ProductWriteInput,
  PublicProduct,
} from "./types/product"

export type {
  TranslationLookupMode,
  TranslationContentType,
  TranslationQuality,
  TranslationItemStatus,
  TranslationContextValue,
  TranslationContext,
  TranslationLookupRequestBase,
  TranslationLookupSingleRequest,
  TranslationLookupBatchRequest,
  TranslationLookupRequest,
  TranslationLookupItem,
  TranslationLookupResponse,
  ResolvedTranslationItem,
  ResolvedTranslationResponse,
  TranslationHashOptions,
  TranslationResolveOptions,
  TranslationRecord,
  TranslationListParams,
  TranslationListResponse,
  TranslationUpdateRequest,
} from "./types/translations"

export type {
  FacetBucket,
  FacetDefinition,
  FacetDefinitionWriteInput,
  FacetGetParams,
  FacetListParams,
  FacetListResponse,
  FacetQueryRequest,
  FacetQueryResponse,
  FacetValue,
  FacetValueDefinition,
  FacetValueGetParams,
  FacetValueListParams,
  FacetValueListResponse,
  FacetValueResponse,
  FacetValueWriteInput,
  PublicFacetListParams,
} from "./types/facets"


// Collections & Proofs
export type {
  Collection,
  CollectionResponse,
  CollectionCreateRequest,
  CollectionUpdateRequest,
  DomainTarget,
  HubAvailabilityResponse,
} from "./types/collection"
export type {
  Proof,
  ProofResponse,
  ProofCreateRequest,
  ProofUpdateRequest,
  ProofClaimRequest,
} from "./types/proof"

// QR & Short Codes
export type {
  QrShortCodeLookupResponse,
} from "./types/qr"

// Tags — polymorphic ref additions
export type {
  ReverseTagLookupParams,
  ReverseTagLookupResponse,
} from "./types/tags"

// Mobile Admin Container types & errors
export type {
  AdminMobileCapability,
  ActionableCapability,
  AdminMobileHostId,
  AdminMobileEvent,
  AdminMobileEventCallback,
  AdminMobileEventSubscriber,
  ScannerEventSubscriber, // @deprecated — use AdminMobileEventCallback
  AdminMobileHostContext,
  AdminMobileComponentManifest,
  AdminMobileBundleManifest,
  MobileAdminComponentManifest, // @deprecated — use AdminMobileComponentManifest
  MobileAdminBundleManifest, // @deprecated — use AdminMobileBundleManifest
} from './mobile-admin/types';
export {
  HostCapabilityUnavailableError,
  HostPermissionDeniedError,
  HostTimeoutError,
} from './mobile-admin/errors';

// Native capability facade — contract types only (implementations are host-side)
export type {
  NativeCapability,
  NativeFacade,
  ShareFacade,
  ClipboardFacade,
  HapticImpactStyle,
  HapticNotificationStyle,
  HapticsFacade,
  NetworkStatus,
  NetworkFacade,
  DeviceInfo,
  DeviceFacade,
  StorageFacade,
  QrScanOptions,
  QrFacade,
  AuthFacade,
  NfcReadResult,
  NfcFacade,
  RfidScanOptions,
  RfidFacade,
  EventsFacade,
  WebSourceMode,
  WebSourceConfig,
  WebSourceFacade,
} from './native/types';

// AuthKit — explicit root-level exports so consumers can import these types
// directly from '@proveanything/smartlinks' without relying on export* chain resolution.
export type {
  AuthKitUser,
  UserProfile,
  ProfileUpdateData,
  UpdateProfileResponse,
  SuccessResponse,
  AuthLoginResponse,
  AppleLoginOptions,
  AuthKitErrorCode,
  RefreshResponse,
  LogoutResponse,
  RefreshErrorCode,
  MagicLinkSendResponse,
  MagicLinkVerifyResponse,
  PhoneSendCodeResponse,
  PhoneVerifyResponse,
  PasswordResetRequestResponse,
  VerifyResetTokenResponse,
  PasswordResetCompleteResponse,
  EmailVerificationActionResponse,
  EmailVerifyTokenResponse,
  VerifyStatus,
  WhatsAppReplyCta,
  WhatsAppReplyOptions,
  WhatsAppContactData,
  SendWhatsAppRequest,
  SendWhatsAppResponse,
  ExchangeWhatsAppSessionResponse,
  VerifyWhatsAppResponse,
  WhatsAppStatusResponse,
  SendSmsVerifyRequest,
  SendSmsVerifyResponse,
  VerifySmsResponse,
  UpsertContactRequest,
  UpsertContactResponse,
  AuthKitBrandingConfig,
  AuthKitConfig,
} from './types/authKit';