export { initializeApi, isInitialized, hasAuthCredentials, configureSdkCache, invalidateCache, request, sendCustomProxyMessage } from "./http";
export * from "./api";
export * from "./types";
export { iframe } from "./iframe";
export * as cache from './cache';
export { IframeResponder, isAdminFromRoles, buildIframeSrc, } from './iframeResponder';
export * as utils from './utils';
export type { PortalPathParams, ConditionParams, ConditionDebugOptions, ConditionDebugLogger, ConditionSet, Condition, UserInfo, ProductInfo, ProofInfo, CollectionInfo, } from './utils';
export type { LoginResponse, VerifyTokenResponse, AccountInfoResponse, AuthLocation, } from "./api/auth";
export type { UserAccountRegistrationRequest, } from "./types/auth";
export type { CommunicationEvent, CommsQueryByUser, CommsRecipientIdsQuery, CommsRecipientsWithoutActionQuery, CommsRecipientsWithActionQuery, RecipientId, RecipientWithOutcome, LogCommunicationEventBody, LogBulkCommunicationEventsBody, AppendResult, AppendBulkResult, CommsSettings, TopicConfig, CommsSettingsGetResponse, CommsSettingsPatchBody, CommsPublicTopicsResponse, UnsubscribeQuery, UnsubscribeResponse, CommsConsentUpsertRequest, CommsPreferencesUpsertRequest, CommsSubscribeRequest, CommsSubscribeResponse, CommsSubscriptionCheckQuery, CommsSubscriptionCheckResponse, CommsListMethodsQuery, CommsListMethodsResponse, RegisterEmailMethodRequest, RegisterSmsMethodRequest, RegisterMethodResponse, SubscriptionsResolveRequest, SubscriptionsResolveResponse, } from "./types/comms";
export type { AttestationResponse, AttestationCreateRequest, AttestationUpdateRequest, } from "./types/attestation";
export type { Attestation, LatestAttestation, AttestationSummaryBucket, ChainVerifyResult, CreateAttestationInput, AttestationSubjectType, AttestationVisibility, AttestationAudience, AttestationGroupBy, ListAttestationsParams, AttestationSummaryParams, AttestationLatestParams, AttestationVerifyParams, AttestationTreeSummaryParams, AttestationTreeLatestParams, ListAttestationsResponse, PublicListAttestationsResponse, AttestationSummaryResponse, PublicAttestationSummaryResponse, AttestationLatestResponse, PublicAttestationLatestResponse, AttestationTreeSummaryResponse, PublicAttestationTreeSummaryResponse, AttestationTreeLatestResponse, PublicAttestationTreeLatestResponse, } from "./types/attestations";
export type { Container, ContainerItem, ContainerStatus, ContainerItemType, CreateContainerInput, UpdateContainerInput, AddContainerItemsInput, RemoveContainerItemsInput, ListContainersParams, GetContainerParams, ListContainerItemsParams, FindContainersForItemParams, ListContainersResponse, PublicListContainersResponse, FindContainersForItemResponse, ContainerItemsResponse, AddContainerItemsResponse, RemoveContainerItemsResponse, } from "./types/containers";
export type { BatchResponse, BatchCreateRequest, BatchUpdateRequest, } from "./types/batch";
export type { VariantResponse, VariantCreateRequest, VariantUpdateRequest, } from "./types/variant";
export type { BroadcastSendRequest } from "./types/broadcasts";
export type { AppConfigOptions } from "./api/appConfiguration";
export type { AdditionalGtin, ISODateString, JsonPrimitive, JsonValue, ProductCreateRequest, ProductClaimCreateInput, ProductClaimCreateRequestBody, ProductClaimLookupInput, ProductFacetMap, ProductFacetValue, ProductImage, ProductImageThumbnails, ProductImageUrlInput, ProductKey, ProductQueryRequest, ProductQueryResponse, ProductUpdateRequest, Product, ProductWriteInput, PublicProduct, } from "./types/product";
export type { TranslationLookupMode, TranslationContentType, TranslationQuality, TranslationItemStatus, TranslationContextValue, TranslationContext, TranslationLookupRequestBase, TranslationLookupSingleRequest, TranslationLookupBatchRequest, TranslationLookupRequest, TranslationLookupItem, TranslationLookupResponse, ResolvedTranslationItem, ResolvedTranslationResponse, TranslationHashOptions, TranslationResolveOptions, TranslationRecord, TranslationListParams, TranslationListResponse, TranslationUpdateRequest, } from "./types/translations";
export type { FacetBucket, FacetDefinition, FacetDefinitionWriteInput, FacetGetParams, FacetListParams, FacetListResponse, FacetQueryRequest, FacetQueryResponse, FacetValue, FacetValueDefinition, FacetValueGetParams, FacetValueListParams, FacetValueListResponse, FacetValueResponse, FacetValueWriteInput, PublicFacetListParams, } from "./types/facets";
export type { Collection, CollectionResponse, CollectionCreateRequest, CollectionUpdateRequest, } from "./types/collection";
export type { Proof, ProofResponse, ProofCreateRequest, ProofUpdateRequest, ProofClaimRequest, } from "./types/proof";
export type { QrShortCodeLookupResponse, } from "./types/qr";
export type { ReverseTagLookupParams, ReverseTagLookupResponse, } from "./types/tags";
export type { AdminMobileCapability, ActionableCapability, AdminMobileHostId, AdminMobileEvent, AdminMobileEventCallback, AdminMobileEventSubscriber, ScannerEventSubscriber, // @deprecated — use AdminMobileEventCallback
AdminMobileHostContext, AdminMobileComponentManifest, AdminMobileBundleManifest, MobileAdminComponentManifest, // @deprecated — use AdminMobileComponentManifest
MobileAdminBundleManifest, } from './mobile-admin/types';
export { HostCapabilityUnavailableError, HostPermissionDeniedError, HostTimeoutError, } from './mobile-admin/errors';
