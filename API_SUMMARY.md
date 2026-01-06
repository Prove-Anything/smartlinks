# Smartlinks API Summary

Version: 1.1.15  |  Generated: 2026-01-03T20:22:14.481Z

This is a concise summary of all available API functions and types.

## API Namespaces

The Smartlinks SDK is organized into the following namespaces:

— Core Data & Configuration —
- **collection** - Manage collections, settings, and identifiers for your workspace.
- **product** - Create and manage products within a collection; metadata, tags, media.
- **variant** - Manage product variants per product; includes serial number helpers.
- **asset** - Upload and manage media assets for collections, products, and proofs.
- **batch** - Group products into batches; manage serial number ranges and lookups.
- **crate** - Organize products in containers/crates for logistics and grouping.
- **form** - Build and manage dynamic forms used by apps and workflows.
- **appRecord** - Store and retrieve application-level records tied to a collection.
- **appConfiguration** - Read/write app configuration and scoped data (collection/product/proof).

— Identity & Access —
- **auth** - Admin authentication and account ops: login/logout, tokens, account info.
- **authKit** - End‑user auth flows (email/password, OAuth, phone); profiles and verification.
- **contact** - Manage customer contacts; CRUD, lookup, upsert, erase.

— Messaging & Audience —
- **comms** - Send notifications (push, email, wallet); templating, severity, delivery status.
- **broadcasts** - Define broadcast campaigns; append recipients/events; analytics and CRUD.
- **segments** - Define dynamic/static audience segments; estimate and list recipients; schedule calculations.

— Analytics & Events —
- **interactions** - Log and analyze interactions/outcomes; aggregates and actor lists; interaction definition CRUD.

— Automation —
- **journeys** - Configure automated flows triggered by events or schedules; steps, rules; full CRUD.

— NFC, Proofs & Claims —
- **nfc** - Claim and validate NFC tags; perform tag lookups.
- **proof** - Create, update, claim, and list product proofs (digital certificates).
- **claimSet** - Manage claim sets and tag assignments; queries, reports, and updates.
- **qr** - Lookup short codes to resolve collection/product/proof context.

— AI & Utilities —
- **ai** - Generate content and images, search photos, chat, upload files, and cache.
- **serialNumber** - Assign, lookup, and manage serial numbers across scopes.

— Other —
- **attestation** - Functions for attestation operations
- **journeysAnalytics** - Functions for journeysAnalytics operations
- **location** - Functions for location operations
- **template** - Functions for template operations

## HTTP Utilities

Core HTTP functions for API configuration and communication:

**initializeApi**(options: {
  baseURL: string
  apiKey?: string
  bearerToken?: string
  proxyMode?: boolean
  ngrokSkipBrowserWarning?: boolean
  extraHeaders?: Record<string, string>
  iframeAutoResize?: boolean // default true when in iframe
  logger?: Logger // optional console-like or function to enable verbose logging
}) → `void`
Call this once (e.g. at app startup) to configure baseURL/auth.

**setNgrokSkipBrowserWarning**(flag: boolean) → `void`
Enable/disable automatic "ngrok-skip-browser-warning" header.

**setExtraHeaders**(headers: Record<string, string>) → `void`
Replace or augment globally applied custom headers.

**setBearerToken**(token: string | undefined) → `void`
Allows setting the bearerToken at runtime (e.g. after login/logout).

**request**(path: string) → `Promise<T>`
Internal helper that performs a GET request to \`\${baseURL}\${path}\`, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**post**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a POST request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**put**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a PUT request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**patch**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a PATCH request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**requestWithOptions**(path: string,
  options: RequestInit) → `Promise<T>`
Internal helper that performs a request to `${baseURL}${path}` with custom options, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**del**(path: string,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a DELETE request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**getApiHeaders**() → `Record<string, string>`
Returns the common headers used for API requests, including apiKey and bearerToken if set.

**sendCustomProxyMessage**(request: string, params: any) → `Promise<T>`
Sends a custom proxy message to the parent Smartlinks application when running in an iframe. This function is used to communicate with the parent window when the SDK is embedded in an iframe and proxyMode is enabled. It sends a message to the parent and waits for a response.

## Types

### appConfiguration

**AppConfigurationResponse** (interface)
```typescript
interface AppConfigurationResponse {
  id: string
  name: string
  settings?: Record<string, any>
}
```

### asset

**AssetResponse** (interface)
```typescript
interface AssetResponse {
  id: string
  name: string
  url: string
}
```

### attestation

**AttestationResponse** (interface)
```typescript
interface AttestationResponse {
  id: string
  createdAt: string
  updatedAt: string
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationCreateRequest** (interface)
```typescript
interface AttestationCreateRequest {
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationUpdateRequest** (interface)
```typescript
interface AttestationUpdateRequest {
  type?: string
  data?: Record<string, any>
}
```

### auth

**UserAccountRegistrationRequest** (interface)
```typescript
interface UserAccountRegistrationRequest {
  name: string
  email?: string
  phone?: string
  password?: string
  sendAccountConfirmation?: boolean
  collectionId?: string,
  tokenType?: 'bearer' | 'firebase'
}
```

### authKit

**AuthKitUser** (interface)
```typescript
interface AuthKitUser {
  uid: string
  email?: string
  displayName?: string | null
  photoURL?: string | null
  phoneNumber?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}
```

**UserProfile** (interface)
```typescript
interface UserProfile {
  uid: string
  email?: string
  displayName?: string | null
  phoneNumber?: string | null
  photoURL?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}
```

**ProfileUpdateData** (interface)
```typescript
interface ProfileUpdateData {
  displayName?: string
  photoURL?: string
  accountData?: Record<string, any>
}
```

**SuccessResponse** (interface)
```typescript
interface SuccessResponse {
  success: boolean
  message?: string
  token?: string // some flows may return a refreshed token
}
```

**AuthLoginResponse** (interface)
```typescript
interface AuthLoginResponse {
  token?: string
  user: AuthKitUser
  accountData?: Record<string, any>
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
  requiresEmailVerification?: boolean  // True if email verification is required but not yet completed
  emailVerificationDeadline?: number   // Unix timestamp - for 'immediate' mode grace period deadline
  accountLocked?: boolean              // True if account is locked due to expired verification deadline
}
```

**MagicLinkSendResponse** (interface)
```typescript
interface MagicLinkSendResponse {
  success: boolean
  message: string
}
```

**PhoneSendCodeResponse** (interface)
```typescript
interface PhoneSendCodeResponse {
  verificationId: string
  message: string
}
```

**PhoneVerifyResponse** (interface)
```typescript
interface PhoneVerifyResponse {
  token: string
  user: AuthKitUser
}
```

**PasswordResetRequestResponse** (interface)
```typescript
interface PasswordResetRequestResponse {
  success: boolean
  message: string
}
```

**VerifyResetTokenResponse** (interface)
```typescript
interface VerifyResetTokenResponse {
  valid: boolean
  email?: string
  expiresAt?: number
  message?: string
}
```

**PasswordResetCompleteResponse** (interface)
```typescript
interface PasswordResetCompleteResponse {
  success: boolean
  message: string
}
```

**EmailVerificationActionResponse** (interface)
```typescript
interface EmailVerificationActionResponse {
  success: boolean
  message: string
}
```

**EmailVerifyTokenResponse** (interface)
```typescript
interface EmailVerifyTokenResponse {
  success: boolean
  message: string
  token?: string
  user?: AuthKitUser
  accountData?: Record<string, any>
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
}
```

**AuthKitBrandingConfig** (interface)
```typescript
interface AuthKitBrandingConfig {
  logoUrl?: string
  title?: string
  subtitle?: string
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  buttonStyle?: string
  fontFamily?: string
}
```

**AuthKitConfig** (interface)
```typescript
interface AuthKitConfig {
  id: string
  branding?: AuthKitBrandingConfig
  enabledProviders?: string[]
  customCss?: string
  termsUrl?: string
  privacyUrl?: string
  supportEmail?: string
  redirectUrl?: string
  updatedAt?: string
}
```

### batch

**BatchResponse** = `any`

**BatchCreateRequest** = `any`

**BatchUpdateRequest** = `any`

### broadcasts

**ListBroadcastsQuery** (interface)
```typescript
interface ListBroadcastsQuery {
  limit?: number
  offset?: number
  appId?: string
}
```

**BroadcastRecord** (interface)
```typescript
interface BroadcastRecord {
  id: string
  collectionId: string
  appId: string
  templateId?: string | null
  segmentId?: string | null
  status?: string | null
  scheduledAt?: string | null
  sentAt?: string | null
  data?: {
  display?: {
  title?: string
  description?: string
  icon?: string
  color?: string
  }
  broadcastType?: string
  [key: string]: unknown
  }
  createdAt: string
}
```

**BroadcastList** (interface)
```typescript
interface BroadcastList {
  items: BroadcastRecord[]
  limit: number
  offset: number
}
```

### claimSet

**ClaimCodeRef** (interface)
```typescript
interface ClaimCodeRef {
  codeId: string
  claimId: string
}
```

**UpdateClaimDataRequest** (interface)
```typescript
interface UpdateClaimDataRequest {
  data: Record<string, any>
  codes: ClaimCodeRef[]
}
```

**AssignClaimsRequest** (interface)
```typescript
interface AssignClaimsRequest {
  id: string
  collectionId: string
  productId: string
  batchId?: string
  start?: number
  end?: number
  codeId?: string
  data?: Record<string, any>
}
```

### collection

**Collection** (interface)
```typescript
interface Collection {
  id: string
  title: string
  description: string
  headerImage?: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  logoImage?: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  loaderImage?: {
  overwriteName: string
  name: string
  type: string
  url: string
  }
  languages?: {
  code: string
  lang: string
  supported: boolean
  }[],
  roles: {
  [userId: string]: string
  } // User roles mapping with user IDs as keys and role names as values
  groupTags?: string[] // Array of group tag names
  redirectUrl?: string // Whether the collection has a custom domain
  shortId: string, // The shortId of this collection
  dark?: boolean // if dark mode is enabled for this collection
}
```

**CollectionResponse** = `Collection`

**CollectionCreateRequest** = `Omit<Collection, 'id' | 'shortId'>`

**CollectionUpdateRequest** = `Partial<Omit<Collection, 'id' | 'shortId'>>`

### common

**IdField** = `'userId' | 'contactId'`

### comms

**NotificationSubjectTarget** (interface)
```typescript
interface NotificationSubjectTarget {
  type: 'product' | 'collection' | 'user' | 'batch' | 'proof'
  id: string
}
```

**PushNotificationTemplate** (interface)
```typescript
interface PushNotificationTemplate {
  title: string
  body: string
  icon?: string
}
```

**EmailNotificationTemplate** (interface)
```typescript
interface EmailNotificationTemplate {
  subject: string
  body: string
}
```

**WalletUpdateTemplate** (interface)
```typescript
interface WalletUpdateTemplate {
  textModulesData?: Array<{
  id: string
  header: string
  body: string
  }>
}
```

**NotificationTemplate** (interface)
```typescript
interface NotificationTemplate {
  push?: PushNotificationTemplate
  email?: EmailNotificationTemplate
  walletUpdate?: WalletUpdateTemplate
}
```

**SendNotificationRequest** (interface)
```typescript
interface SendNotificationRequest {
  subjectTargets: NotificationSubjectTarget[]
  severity: 'low' | 'normal' | 'important' | 'critical'
  mode: 'preferred' | 'all'
  channels : ("push" | "email" | "wallet")[]
  template: NotificationTemplate
}
```

**SendNotificationResponse** (interface)
```typescript
interface SendNotificationResponse {
  ok: boolean
  notificationId: string
  counts: {
  contacts: number
  attempts: number
  }
  status: {
  notification: {
  notificationId: string
  state: 'queued' | 'sent' | 'failed' | 'confirmed' | string
  subjectTargets: NotificationSubjectTarget[]
  severity: 'low' | 'normal' | 'important' | 'critical' | string
  channelsOverride: Record<string, any>
  template: NotificationTemplate
  }
  totals: {
  queued: number
  sent: number
  failed: number
  confirmed: number
  }
  }
}
```

**CommunicationEvent** (interface)
```typescript
interface CommunicationEvent {
  orgId: string
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  timestamp: string
  eventType: string
  outcome?: string | null
  templateId?: string | null
  [k: string]: any
}
```

**CommsQueryByUser** (interface)
```typescript
interface CommsQueryByUser {
  userId?: string
  contactId?: string
  from?: string
  to?: string
  limit?: number
}
```

**RecipientWithOutcome** (interface)
```typescript
interface RecipientWithOutcome {
  id: string; outcome: string
}
```

**CommsRecipientIdsQuery** (interface)
```typescript
interface CommsRecipientIdsQuery {
  broadcastId?: string
  journeyId?: string
  journeyStepId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}
```

**CommsRecipientsWithoutActionQuery** (interface)
```typescript
interface CommsRecipientsWithoutActionQuery {
  broadcastId?: string
  journeyId?: string
  actionId?: string
  appId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}
```

**CommsRecipientsWithActionQuery** (interface)
```typescript
interface CommsRecipientsWithActionQuery {
  broadcastId?: string
  journeyId?: string
  actionId?: string
  appId?: string
  outcome?: string
  idField?: IdField
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
}
```

**LogCommunicationEventBody** (interface)
```typescript
interface LogCommunicationEventBody {
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  eventType: string
  outcome?: string
  templateId?: string
  timestamp?: string
  [k: string]: any
}
```

**LogBulkCommunicationEventsBody** (interface)
```typescript
interface LogBulkCommunicationEventsBody {
  params: { broadcastId?: string; journeyId?: string; [k: string]: any }
  ids: string[]
  idField?: IdField
}
```

**AppendResult** (interface)
```typescript
interface AppendResult {
  success: true
}
```

**AppendBulkResult** (interface)
```typescript
interface AppendBulkResult {
  success: true; count: number
}
```

**RecipientId** = `string`

### contact

**ContactResponse** (interface)
```typescript
interface ContactResponse {
  contactId: string
  orgId: string
  firstName: string | null
  lastName: string | null
  displayName: string | null
  company: string | null
  email: string | null
  phone: string | null
  emails?: string[]
  phones?: string[]
  customFields: ContactCustomFields
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  erasedAt: string | null
}
```

**ContactCreateRequest** (interface)
```typescript
interface ContactCreateRequest {
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  company?: string | null
  email?: string | null
  phone?: string | null
  customFields?: ContactCustomFields
}
```

**ContactUpdateRequest** (interface)
```typescript
interface ContactUpdateRequest {
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  company?: string | null
  email?: string | null
  phone?: string | null
  customFields?: ContactCustomFields
}
```

**ContactListResponse** (interface)
```typescript
interface ContactListResponse {
  items: ContactResponse[]
  limit: number
  offset: number
}
```

**PublicContactUpsertRequest** (interface)
```typescript
interface PublicContactUpsertRequest {
  email?: string
  phone?: string
  userId?: string
  firstName?: string
  lastName?: string
  displayName?: string
  company?: string
  tags?: string[]
  source?: string
  notes?: string
  avatarUrl?: string
  locale?: string
  timezone?: string
  externalIds?: Record<string, any>
  customFields?: ContactCustomFields
}
```

**PublicContactUpsertResponse** (interface)
```typescript
interface PublicContactUpsertResponse {
  ok: boolean
  contactId: string
}
```

**UserSearchResponse** (interface)
```typescript
interface UserSearchResponse {
  user: {
  uid: string,
  displayName: string | null,
  email: string | null,
  phoneNumber: string | null,
  photoURL: string | null
  },
  contact: ContactResponse | null
  existsAsContact: boolean
}
```

**ContactCustomFields** = `Record<string, any>`

### error

**ErrorResponse** (interface)
```typescript
interface ErrorResponse {
  code: number
  message: string
}
```

### interaction

**AdminInteractionsByUserRequest** (interface)
```typescript
interface AdminInteractionsByUserRequest {
  userId?: string
  contactId?: string
  appId?: string
  interactionId?: string
  broadcastId?: string
  outcome?: string | null
  from?: string
  to?: string
  limit?: number
}
```

**AdminInteractionsCountsByOutcomeRequest** (interface)
```typescript
interface AdminInteractionsCountsByOutcomeRequest {
  appId?: string
  interactionId?: string
  from?: string
  to?: string
  limit?: number
  dedupeLatest?: boolean
  idField?: IdField
}
```

**AdminActorIdsByInteractionRequest** (interface)
```typescript
interface AdminActorIdsByInteractionRequest {
  interactionId: string
  idField?: IdField
  outcome?: string | null
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
}
```

**PublicInteractionsCountsByOutcomeRequest** (interface)
```typescript
interface PublicInteractionsCountsByOutcomeRequest {
  appId: string
  interactionId: string
  from?: string
  to?: string
  limit?: number
}
```

**PublicInteractionsByUserRequest** (interface)
```typescript
interface PublicInteractionsByUserRequest {
  appId?: string
  interactionId?: string
  from?: string
  to?: string
  limit?: number
}
```

**InteractionEventRow** (interface)
```typescript
interface InteractionEventRow {
  orgId: string
  collectionId: string
  timestamp: string
  appId?: string
  interactionId?: string
  broadcastId?: string
  userId?: string
  contactId?: string
  outcome?: string | null
  metadata?: Record<string, unknown>
  [k: string]: unknown
}
```

**OutcomeCount** (interface)
```typescript
interface OutcomeCount {
  outcome: string | null; count: number
}
```

**ActorWithOutcome** (interface)
```typescript
interface ActorWithOutcome {
  id: string; outcome: string | null
}
```

**InteractionEventBase** (interface)
```typescript
interface InteractionEventBase {
  collectionId: string,
  orgId?: string,
  userId?: string
  contactId?: string
  interactionId: string
  appId?: string
  broadcastId?: string
  journeyId?: string
  productId?: string
  proofId?: string
  variantId?: string
  batchId?: string
  source?: string,
  eventType?: string
  outcome?: string
  timestamp?: string
  metadata?: Record<string, unknown>
  [k: string]: any
}
```

**InteractionPermissions** (interface)
```typescript
interface InteractionPermissions {
  enabled?: boolean
  requireAuth?: boolean
  allowPublicSubmit?: boolean
  allowAnonymousSubmit?: boolean
  allowedOrigins?: string[]
  startAt?: string
  endAt?: string
  * Enforce uniqueness per user: prevent duplicate submissions for this interaction.
  * If true, optionally use `uniquePerUserWindowSeconds` to scope the window.
  uniquePerUser?: boolean
  uniquePerUserWindowSeconds?: number
  uniqueOutcome?: string
  * Public summary visibility (counts, aggregates) without auth.
  * If false, summaries require `allowAuthenticatedSummary` + user auth.
  allowPublicSummary?: boolean
  * Authenticated summary visibility (counts, aggregates) when user is signed in.
  allowAuthenticatedSummary?: boolean
  allowOwnRead?: boolean
}
```

**InteractionTypeRecord** (interface)
```typescript
interface InteractionTypeRecord {
  id?: string
  collectionId: string
  appId: string
  permissions?: InteractionPermissions
  data?: {
  display?: {
  title?: string
  description?: string
  icon?: string
  color?: string
  }
  interactionType?: string
  [key: string]: unknown
  }
  createdAt: string
}
```

**InteractionTypeList** (interface)
```typescript
interface InteractionTypeList {
  items: InteractionTypeRecord[]
  limit: number
  offset: number
}
```

**CreateInteractionTypeBody** (interface)
```typescript
interface CreateInteractionTypeBody {
  id: string
  appId: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}
```

**UpdateInteractionTypeBody** (interface)
```typescript
interface UpdateInteractionTypeBody {
  appId?: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}
```

**ListInteractionTypesQuery** (interface)
```typescript
interface ListInteractionTypesQuery {
  appId?: string
  limit?: number
  offset?: number
}
```

**ActorId** = `string`

### journeys

**JourneyRecord** (interface)
```typescript
interface JourneyRecord {
  id: string
  collectionId: string
  appId?: string
  name: string
  active: boolean
  journeyType: 'event_triggered' | 'scheduled'
  data?: {
  display?: {
  title?: string
  description?: string
  icon?: string
  color?: string
  }
  steps?: Array<{ id: string; type: string; config?: Record<string, unknown> }>
  triggers?: Array<{ type: string; config?: Record<string, unknown> }>
  entryRules?: any[]
  exitRules?: any[]
  metadata?: Record<string, unknown>
  [key: string]: unknown
  }
  createdAt: string
  updatedAt: string
}
```

**JourneyList** (interface)
```typescript
interface JourneyList {
  items: JourneyRecord[]
  limit: number
  offset: number
}
```

**ListJourneysQuery** (interface)
```typescript
interface ListJourneysQuery {
  appId?: string
  active?: boolean
  journeyType?: 'event_triggered' | 'scheduled'
  limit?: number
  offset?: number
}
```

**CreateJourneyBody** (interface)
```typescript
interface CreateJourneyBody {
  appId?: string
  name: string
  active?: boolean
  journeyType: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}
```

**UpdateJourneyBody** (interface)
```typescript
interface UpdateJourneyBody {
  appId?: string
  name?: string
  active?: boolean
  journeyType?: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}
```

### journeysAnalytics

**JourneyStatsRequest** (interface)
```typescript
interface JourneyStatsRequest {
  idField?: IdField // 'userId' | 'contactId'
  from?: string
  to?: string
  finalStepId?: string
  stepMappings?: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}
```

**JourneyStatsResponse** (interface)
```typescript
interface JourneyStatsResponse {
  journeyId: string
  totalEntered: number
  currentlyActive?: number
  completed?: number
  exitedViaGoal?: number
  lastUpdated: string
  stepStats: Array<{ stepId: string; entered: number; completed: number; pending: number }>
}
```

**JourneyStepRecipientsRequest** (interface)
```typescript
interface JourneyStepRecipientsRequest {
  status?: 'entered' | 'completed' | 'pending'
  idField?: IdField
  interactionId?: string
  outcome?: string
  from?: string
  to?: string
  limit?: number
}
```

**JourneyFunnelReportRequest** (interface)
```typescript
interface JourneyFunnelReportRequest {
  idField?: IdField
  periodStart?: string
  periodEnd?: string
  stepMappings: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}
```

**JourneyFunnelReportResponse** (interface)
```typescript
interface JourneyFunnelReportResponse {
  journeyId: string
  periodStart: string | null
  periodEnd: string | null
  steps: Array<{
  stepId: string
  enteredCount: number
  completedCount: number
  conversionRate: number
  avgTimeToComplete: number | null
  }>
}
```

**JourneyStepRecipientsResponse** = `string[]`

### location

**Location** (interface)
```typescript
interface Location {
  locationId: string
  collectionId: string | null
  scope: 'global' | 'collection'
  name: string
  category?: string
  description?: string
  countryName?: string
  countryCode?: string
  websiteUrl?: string
  logoUrl?: string
  phone?: string
  email?: string
  geofence?: Geofence | {}
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}
```

**LocationSearchQuery** (interface)
```typescript
interface LocationSearchQuery {
  q?: string
  category?: string
  countryCode?: string
  countryName?: string
  limit?: number // default 20; max 100
  sort?: 'name' | 'countryCode' | 'countryName' // default 'name'
}
```

**LocationSearchResponse** (interface)
```typescript
interface LocationSearchResponse {
  items: Location[]
  count: number
}
```

**Geofence** = ``

**LocationPayload** = `Omit<`

### nfc

**NfcTagInfo** (interface)
```typescript
interface NfcTagInfo {
  id: string
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
```

**NfcValidateRequest** (interface)
```typescript
interface NfcValidateRequest {
  claimSetId: string
  codeId: string
  mirror?: string
  userId?: string
}
```

**NfcValidateResponse** (interface)
```typescript
interface NfcValidateResponse {
  claimSetId: string
  codeId: string
  tagId: string
  index?: number
  isAdmin: boolean
  path?: string
  collectionId?:  string
  collection?:  Record<string, any>
  count: number,
  previousCount: number
  data?: Record<string, any>
  productId?:  string
  product?:  Record<string, any>
  batchId?:  string
  variantId?:  string
  proofId?:  string
}
```

**NfcClaimTagRequest** (interface)
```typescript
interface NfcClaimTagRequest {
  claimSetId: string
  codeId: string
  data: Record<string, any>
}
```

### product

**Product** (interface)
```typescript
interface Product {
  id: string
  name: string
  collectionId: string
  description: string
  gtin?: string
  type?: string
  heroImage: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  tags: {
  [tagName: string]: boolean
  } // Flexible map of tags with true/false values
  data: {
  [key: string]: any
  } // Flexible key/value data map
}
```

**ProductResponse** = `Product`

**ProductCreateRequest** = `Omit<Product, 'id' | 'collectionId'>`

**ProductUpdateRequest** = `Partial<Omit<Product, 'id' | 'collectionId'>>`

### proof

**Proof** (interface)
```typescript
interface Proof {
  collectionId: string
  createdAt: string
  id: string
  productId: string
  tokenId: string
  userId: string
  claimable?: boolean
  transient?: boolean
  values: Record<string, any>
}
```

**ProofCreateRequest** (interface)
```typescript
interface ProofCreateRequest {
  values: Record<string, any>
  claimable?: boolean
  transient?: boolean
}
```

**ProofResponse** = `Proof`

**ProofUpdateRequest** = `Partial<ProofCreateRequest>`

**ProofClaimRequest** = `Record<string, any>`

### qr

**QrShortCodeLookupResponse** (interface)
```typescript
interface QrShortCodeLookupResponse {
  collectionId?: string
  productId?: string
  proofId?: string
  code: string
}
```

### segments

**SegmentRecord** (interface)
```typescript
interface SegmentRecord {
  id: string
  collectionId: string
  appId?: string
  name: string
  filterType: 'dynamic' | 'static'
  estimatedCount?: number
  lastCalculatedAt?: string
  createdAt: string
  data?: {
  filterRules: any[]
  description?: string
  staticContactIds?: string[]
  [key: string]: unknown
  }
}
```

**ListSegmentsQuery** (interface)
```typescript
interface ListSegmentsQuery {
  appId?: string
  filterType?: 'dynamic' | 'static'
  limit?: number
  offset?: number
}
```

**SegmentList** (interface)
```typescript
interface SegmentList {
  items: SegmentRecord[]
  limit: number
  offset: number
}
```

**SegmentCalculateResult** (interface)
```typescript
interface SegmentCalculateResult {
  scheduled: true
  lastCalculatedAt?: string
  estimatedCount?: number | null
  note?: string
}
```

**SegmentRecipientsResponse** (interface)
```typescript
interface SegmentRecipientsResponse {
  items: string[]
  limit: number
  offset: number
  total: number
  note?: string
}
```

### template

**TemplateBase** (interface)
```typescript
interface TemplateBase {
  id: string
  collectionId: string
  name: string
  description?: string
  type: string
  resizeMode?: string
  pdf?: {
  base: { url: string }
  orientation: 'portrait' | 'landscape'
  }
  subject?: string
  body?: string
  css?: string
  public?: boolean
  engine?: string
  component?: string
  defaultProps?: Record<string, any>
  collections?: string[]
  [k: string]: any
}
```

**TemplateInput** = `Omit<TemplateBase, 'id' | 'collectionId'>`

**TemplateUpdate** = `Partial<Omit<TemplateBase, 'id' | 'collectionId'>>`

**TemplatePublic** = `TemplateBase`

### variant

**VariantResponse** = `any`

**VariantCreateRequest** = `any`

**VariantUpdateRequest** = `any`

### ai (api)

**AIGenerateContentRequest** (interface)
```typescript
interface AIGenerateContentRequest {
  contents: string | any
  responseMimeType?: string
  systemInstruction?: string
  provider?: string
  model?: string
  [key: string]: any
}
```

**AIGenerateImageRequest** (interface)
```typescript
interface AIGenerateImageRequest {
  prompt: string
  provider?: string
  model?: string
  size?: string
  [key: string]: any
}
```

**AISearchPhotosRequest** (interface)
```typescript
interface AISearchPhotosRequest {
  query: string
  per_page?: number
  orientation?: 'landscape' | 'portrait' | 'squarish'
  [key: string]: any
}
```

**AISearchPhotosPhoto** (interface)
```typescript
interface AISearchPhotosPhoto {
  url: string
  alt?: string
  photographer?: string
  photographerUrl?: string
  [key: string]: any
}
```

### appConfiguration (api)

**AppConfigOptions** (type)
```typescript
type AppConfigOptions = {
  appId: string
  collectionId?: string
  productId?: string
  variantId?: string
  batchId?: string
  itemId?: string
  user?: boolean
  userData?: boolean
  admin?: boolean
  config?: any
  data?: any
}
```

### auth (api)

**LoginResponse** (type)
```typescript
type LoginResponse = {
  id: string
  name: string
  email: string
  bearerToken: string
  account: Record<string, any>
}
```

**VerifyTokenResponse** (type)
```typescript
type VerifyTokenResponse = {
  valid: boolean
  id?: string
  name?: string
  email?: string
  account?: Record<string, any>
}
```

**AccountInfoResponse** (type)
```typescript
type AccountInfoResponse = {
  accessType: string;
  analyticsCode: string;
  analyticsId: string;
  auth_time: number;
  baseCollectionId: string;
  clientType: string;
  email: string;
  email_verified: boolean;
  features: {
    actionLogger: boolean;
    adminCollections: boolean;
    adminApps: boolean;
    apiKeys: boolean;
    adminUsers: boolean;
    [key: string]: boolean;
  };
  iat: number;
  id: string;
  iss: string;
  location: string | null;
  name: string;
  picture: string;
  sites: {
    [siteName: string]: boolean;
  };
  sub: string;
  uid: string;
  user_id: string;
  whitelabel: {
    [key: string]: any;
  }
}
```

## API Functions

### ai

**generateContent**(collectionId: string,
    params: AIGenerateContentRequest,
    admin: boolean = true) → `Promise<any>`
Generate text/content via AI (admin)

**generateImage**(collectionId: string, params: AIGenerateImageRequest) → `Promise<any>`
Generate an image via AI (admin)

**searchPhotos**(collectionId: string,
    params: AISearchPhotosRequest) → `Promise<AISearchPhotosPhoto[]>`
Search stock photos or similar via AI (admin)

**uploadFile**(collectionId: string, params: any) → `Promise<any>`
Upload a file for AI usage (admin). Pass FormData for binary uploads.

**createCache**(collectionId: string, params: any) → `Promise<any>`
Create or warm a cache for AI (admin)

**postChat**(collectionId: string, params: any, admin: boolean = true) → `Promise<any>`
Post a chat message to the AI (admin or public)

### appConfiguration

**getConfig**(opts: AppConfigOptions) → `Promise<any>`

**setConfig**(opts: AppConfigOptions) → `Promise<any>`

**deleteConfig**(opts: AppConfigOptions) → `Promise<void>`

**getData**(opts: AppConfigOptions) → `Promise<any[]>`

**getDataItem**(opts: AppConfigOptions) → `Promise<any>`

**setDataItem**(opts: AppConfigOptions) → `Promise<any>`

**deleteDataItem**(opts: AppConfigOptions) → `Promise<void>`

### appRecord

**get**(collectionId: string, appId: string) → `Promise<any>`

**create**(collectionId: string, appId: string, data: any) → `Promise<any>`

**update**(collectionId: string, appId: string, data: any) → `Promise<any>`

**remove**(collectionId: string, appId: string) → `Promise<void>`

### asset

**getForCollection**(collectionId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForCollection**(collectionId: string) → `Promise<AssetResponse[]>`

**getForProduct**(collectionId: string,
    productId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForProduct**(collectionId: string,
    productId: string) → `Promise<AssetResponse[]>`

**getForProof**(collectionId: string,
    productId: string,
    proofId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForProof**(collectionId: string,
    productId: string,
    proofId: string,
    appId?: string) → `Promise<AssetResponse[]>`

**uploadAsset**(collectionId: string,
    productId: string,
    proofId: string,
    file: File,
    extraData?: Record<string, any>,
    onProgress?: (percent: number) → `void`
Uploads an asset file to a proof, with optional extraData as JSON. Supports progress reporting via onProgress callback (browser only).

### attestation

**list**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<AttestationResponse[]>`
List all attestations for a proof.

**get**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<AttestationResponse>`
Get a single attestation by ID.

**create**(collectionId: string,
    productId: string,
    proofId: string,
    data: AttestationCreateRequest) → `Promise<AttestationResponse>`
Create a new attestation for a proof.

**update**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string,
    data: AttestationUpdateRequest) → `Promise<AttestationResponse>`
Update an attestation.

**remove**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<void>`
Delete an attestation.

### auth

**login**(email: string, password: string) → `Promise<LoginResponse>`
Login with email and password. Sets the bearerToken for subsequent API calls.

**logout**() → `void`
Logout (clears bearerToken for future API calls).

**verifyToken**(token?: string) → `Promise<VerifyTokenResponse>`
Verifies the current bearerToken (or a provided token). Returns user/account info if valid.

**requestAdminJWT**(collectionId: string) → `Promise<string>`
Requests an admin JWT for the current user and a specific collection Returns JWT if valid.

**requestPublicJWT**(collectionId: string, productId: string, proofId: string) → `Promise<string>`
Requests a JWT for the current user and a specific collection/product/proof Validates if the user has access to the resource, and returns a JWT

**registerUser**(user: UserAccountRegistrationRequest) → `Promise<LoginResponse>`
Tries to register a new user account. Can return a bearer token, or a Firebase token

**getUserToken**(opts?: {
    email?: string
    collectionId?: string
    userId?: string
    expiry?: string
  }) → `Promise<`
Admin: Get a user bearer token (impersonation/automation). POST /admin/auth/userToken All fields are optional; at least one identifier should be provided.

**getAccount**() → `Promise<AccountInfoResponse>`
Gets current account information for the logged in user. Returns user, owner, account, and location objects.

### authKit

**login**(clientId: string, email: string, password: string) → `Promise<AuthLoginResponse>`
Login with email + password (public).

**register**(clientId: string, data: { email: string; password: string; displayName?: string; accountData?: Record<string, any> }) → `Promise<AuthLoginResponse>`
Register a new user (public).

**googleLogin**(clientId: string, idToken: string) → `Promise<AuthLoginResponse>`
Google OAuth login (public).

**sendMagicLink**(clientId: string, data: { email: string; redirectUrl: string; accountData?: Record<string, any> }) → `Promise<MagicLinkSendResponse>`
Send a magic link email to the user (public).

**verifyMagicLink**(clientId: string, token: string) → `Promise<MagicLinkVerifyResponse>`
Verify a magic link token and authenticate/create the user (public).

**sendPhoneCode**(clientId: string, phoneNumber: string) → `Promise<PhoneSendCodeResponse>`
Send phone verification code (public).

**verifyPhoneCode**(clientId: string, phoneNumber: string, code: string) → `Promise<PhoneVerifyResponse>`
Verify phone verification code (public).

**requestPasswordReset**(clientId: string, data: { email: string; redirectUrl?: string; clientName?: string }) → `Promise<PasswordResetRequestResponse>`
Verify phone verification code (public).

**verifyResetToken**(clientId: string, token: string) → `Promise<VerifyResetTokenResponse>`
Verify phone verification code (public).

**completePasswordReset**(clientId: string, token: string, newPassword: string) → `Promise<PasswordResetCompleteResponse>`
Verify phone verification code (public).

**sendEmailVerification**(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }) → `Promise<EmailVerificationActionResponse>`
Verify phone verification code (public).

**verifyEmail**(clientId: string, token: string) → `Promise<EmailVerifyTokenResponse>`
Verify phone verification code (public).

**resendEmailVerification**(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }) → `Promise<EmailVerificationActionResponse>`
Verify phone verification code (public).

**getProfile**(clientId: string) → `Promise<UserProfile>`
Verify phone verification code (public).

**updateProfile**(clientId: string, data: ProfileUpdateData) → `Promise<UserProfile>`
Verify phone verification code (public).

**changePassword**(clientId: string, currentPassword: string, newPassword: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**changeEmail**(clientId: string, newEmail: string, password: string, redirectUrl: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**verifyEmailChange**(clientId: string, token: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**updatePhone**(clientId: string, phoneNumber: string, verificationCode: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**deleteAccount**(clientId: string, password: string, confirmText: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**load**(authKitId: string) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**get**(collectionId: string, authKitId: string) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**list**(collectionId: string, admin?: boolean) → `Promise<AuthKitConfig[]>`
Verify phone verification code (public).

**create**(collectionId: string, data: any) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**update**(collectionId: string, authKitId: string, data: any) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**remove**(collectionId: string, authKitId: string) → `Promise<void>`
Verify phone verification code (public).

### batch

**get**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<BatchResponse[]>`
List all batches for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: BatchCreateRequest) → `Promise<BatchResponse>`
Create a new batch for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    batchId: string,
    data: BatchUpdateRequest) → `Promise<BatchResponse>`
Update a batch for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<void>`
Delete a batch for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    batchId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a batch (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    batchId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a batch (admin only).

### broadcasts

**create**(collectionId: string,
    body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>) → `Promise<BroadcastRecord>`

**list**(collectionId: string,
    query: ListBroadcastsQuery = {}) → `Promise<BroadcastList>`

**get**(collectionId: string,
    id: string) → `Promise<BroadcastRecord>`

**update**(collectionId: string,
    id: string,
    body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>) → `Promise<BroadcastRecord>`

**remove**(collectionId: string,
    id: string) → `Promise<void>`

### claimSet

**getAllForCollection**(collectionId: string) → `Promise<any[]>`
Get all claim sets for a collection.

**getForCollection**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a specific claim set for a collection.

**getAllTags**(collectionId: string, claimSetId: string) → `Promise<any[]>`
Get all tags for a claim set.

**getReport**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a report for a claim set.

**getAssignedTags**(collectionId: string, claimSetId: string) → `Promise<any>`
Get assigned tags for a claim set.

**getTagSummary**(collectionId: string) → `Promise<any>`
Get tag summary for a collection.

**tagQuery**(collectionId: string, data: any) → `Promise<any>`
Perform a tag query for a collection.

**createForCollection**(collectionId: string, params: any) → `Promise<any>`
Create a new claim set for a collection.

**updateForCollection**(collectionId: string, params: any) → `Promise<any>`
Update a claim set for a collection.

**makeClaim**(collectionId: string, params: any) → `Promise<any>`
Make a claim for a claim set.

**assignClaims**(collectionId: string, data: AssignClaimsRequest) → `Promise<any>`
Assign claims to a claim set. { id: string,          // claim set id (required) collectionId: string,// required productId: string,   // required batchId?: string,    // optional start?: number,      // optional bulk range start end?: number,        // optional bulk range end codeId?: string,     // optional single code data?: { [k: string]: any } // optional claim key/values }

**updateClaimData**(collectionId: string, data: UpdateClaimDataRequest) → `Promise<any>`
Update claim data for a collection.

### collection

**get**(collectionId: string, admin?: boolean) → `Promise<CollectionResponse>`
Retrieves a single Collection by its ID.

**list**(admin?: boolean) → `Promise<CollectionResponse[]>`
Retrieves all Collections.

**getShortId**(shortId: string) → `Promise<CollectionResponse>`
Retrieve a collection by its shortId (public endpoint).

**getSettings**(collectionId: string, settingGroup: string, admin?: boolean) → `Promise<any>`
Retrieve a specific settings group for a collection (public endpoint).

**updateSettings**(collectionId: string, settingGroup: string, settings: any) → `Promise<any>`
Update a specific settings group for a collection (admin endpoint).

**create**(data: CollectionCreateRequest) → `Promise<CollectionResponse>`
Create a new collection (admin only).

**update**(collectionId: string, data: CollectionUpdateRequest) → `Promise<CollectionResponse>`
Update a collection (admin only).

**remove**(collectionId: string) → `Promise<void>`
Delete a collection (admin only).

**getSN**(collectionId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a collection (admin only).

**lookupSN**(collectionId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a collection (admin only).

**assignSN**(collectionId: string,
    codeId: string,
    value: any) → `Promise<any>`
Assign a value to a serial number for a collection (admin only).

### comms

**sendNotification**(collectionId: string,
    request: SendNotificationRequest) → `Promise<SendNotificationResponse>`
Send a notification to specified targets within a collection. Supports multiple delivery methods including push notifications, email, and wallet pass updates. The notification will be delivered based on user preferences and the specified delivery mode. ```typescript const result = await comms.sendNotification('my-collection', { subjectTargets: [{ type: 'product', id: 'prod_123' }], severity: 'important', mode: 'preferred', template: { push: { title: 'Update available', body: 'We\'ve shipped an important update.', icon: 'https://cdn.example.com/brand/logo-128.png' }, email: { subject: 'Important update for your product', body: 'There\'s an important update. Open your pass or profile to learn more.' }, walletUpdate: { textModulesData: [ { id: 'notice', header: 'Update', body: 'Open your wallet pass for details.' } ] } } }) if (result.ok) { console.log('Notification queued:', result.notificationId) console.log('Totals:', result.status.totals) } ```

**queryByUser**(collectionId: string,
    body: CommsQueryByUser = {}) → `Promise<CommunicationEvent[]>`
Analytics: Query communication events by user or contact. POST /admin/collection/:collectionId/comm/query/by-user

**queryRecipientIds**(collectionId: string,
    body: CommsRecipientIdsQuery) → `Promise<RecipientId[]>`
Analytics: Recipient IDs for a communication source. POST /admin/collection/:collectionId/comm/query/recipient-ids

**queryRecipientsWithoutAction**(collectionId: string,
    body: CommsRecipientsWithoutActionQuery) → `Promise<RecipientId[]>`
Analytics: Recipients who did not perform an action. POST /admin/collection/:collectionId/comm/query/recipients/without-action

**queryRecipientsWithAction**(collectionId: string,
    body: CommsRecipientsWithActionQuery) → `Promise<RecipientId[] | RecipientWithOutcome[]>`
Analytics: Recipients who performed an action, optionally with outcome. POST /admin/collection/:collectionId/comm/query/recipients/with-action

**logCommunicationEvent**(collectionId: string,
    body: LogCommunicationEventBody) → `Promise<AppendResult>`
Logging: Append a single communication event. POST /admin/collection/:collectionId/comm/log

**logBulkCommunicationEvents**(collectionId: string,
    body: LogBulkCommunicationEventsBody | ({ sourceId: string; ids: string[]; idField?: 'userId'|'contactId'; [k: string]: any }) → `void`
Logging: Append many communication events for a list of IDs. POST /admin/collection/:collectionId/comm/log/bulk

### contact

**create**(collectionId: string, data: ContactCreateRequest) → `Promise<ContactResponse>`

**list**(collectionId: string,
    params?: { limit?: number; offset?: number; includeDeleted?: boolean }) → `Promise<ContactListResponse>`

**get**(collectionId: string,
    contactId: string,
    params?: { includeDeleted?: boolean }) → `Promise<ContactResponse>`

**update**(collectionId: string,
    contactId: string,
    data: ContactUpdateRequest) → `Promise<ContactResponse>`

**remove**(collectionId: string, contactId: string) → `Promise<void>`

**lookup**(collectionId: string,
    params: { email?: string; phone?: string }) → `Promise<ContactResponse>`

**upsert**(collectionId: string,
    data: ContactCreateRequest) → `Promise<ContactResponse>`

**publicUpsert**(collectionId: string,
    data: PublicContactUpsertRequest) → `Promise<PublicContactUpsertResponse>`

**erase**(collectionId: string, contactId: string, body?: any) → `Promise<ContactResponse>`

**getUser**(collectionId: string,
    userId: string,) → `Promise<UserSearchResponse>`

### crate

**get**(collectionId: string, crateId: string) → `Promise<any>`
Get a single crate by ID for a collection (admin only).

**list**(collectionId: string) → `Promise<any[]>`
List all crates for a collection (admin only).

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new crate for a collection (admin only).

**update**(collectionId: string, crateId: string, data: any) → `Promise<any>`
Update a crate for a collection (admin only).

**remove**(collectionId: string, crateId: string) → `Promise<void>`
Delete a crate for a collection (admin only).

### form

**get**(collectionId: string, formId: string, admin?: boolean) → `Promise<any>`
Get a single form by ID for a collection.

**list**(collectionId: string, admin?: boolean) → `Promise<any[]>`
List all forms for a collection.

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new form for a collection (admin only).

**update**(collectionId: string, formId: string, data: any) → `Promise<any>`
Update a form for a collection (admin only).

**remove**(collectionId: string, formId: string) → `Promise<void>`
Delete a form for a collection (admin only).

### interactions

**byUser**(collectionId: string,
    query: AdminInteractionsByUserRequest = {}) → `Promise<InteractionEventRow[]>`
POST /admin/collection/:collectionId/interactions/by-user Returns BigQuery interaction rows, newest first.

**countsByOutcome**(collectionId: string,
    query: AdminInteractionsCountsByOutcomeRequest = {}) → `Promise<OutcomeCount[]>`
POST /admin/collection/:collectionId/interactions/counts-by-outcome Returns array of { outcome, count }.

**actorIdsByInteraction**(collectionId: string,
    query: AdminActorIdsByInteractionRequest) → `Promise<ActorId[] | ActorWithOutcome[]>`
POST /admin/collection/:collectionId/interactions/actor-ids/by-interaction Returns list of IDs, optionally with outcome when includeOutcome=true.

**appendEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event.

**updateEvent**(collectionId: string,
    body: UpdateInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event.

**submitPublicEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<`
Appends one interaction event from a public source.

**create**(collectionId: string,
    body: CreateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
Appends one interaction event from a public source.

**list**(collectionId: string,
    query: ListInteractionTypesQuery = {}) → `Promise<InteractionTypeList>`
Appends one interaction event from a public source.

**get**(collectionId: string,
    id: string) → `Promise<InteractionTypeRecord>`
Appends one interaction event from a public source.

**update**(collectionId: string,
    id: string,
    patchBody: UpdateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
Appends one interaction event from a public source.

**remove**(collectionId: string,
    id: string) → `Promise<void>`
Appends one interaction event from a public source.

**publicCountsByOutcome**(collectionId: string,
    body: PublicInteractionsCountsByOutcomeRequest,
    authToken?: string) → `Promise<OutcomeCount[]>`
Appends one interaction event from a public source.

**publicMyInteractions**(collectionId: string,
    body: PublicInteractionsByUserRequest,
    authToken?: string) → `Promise<InteractionEventRow[]>`
Appends one interaction event from a public source.

### journeys

**create**(collectionId: string,
    body: CreateJourneyBody) → `Promise<JourneyRecord>`

**list**(collectionId: string,
    query: ListJourneysQuery = {}) → `Promise<JourneyList>`

**get**(collectionId: string,
    id: string) → `Promise<JourneyRecord>`

**update**(collectionId: string,
    id: string,
    body: UpdateJourneyBody) → `Promise<JourneyRecord>`

**remove**(collectionId: string,
    id: string) → `Promise<void>`

### journeysAnalytics

**stats**(collectionId: string,
    journeyId: string,
    body: JourneyStatsRequest = {}) → `Promise<JourneyStatsResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/stats Computes journey stats over a time window; outcome defaults to 'success'. If `finalStepId` is provided, includes `currentlyActive` and `completed` fields.

**recipients**(collectionId: string,
    journeyId: string,
    stepId: string,
    body: JourneyStepRecipientsRequest = {}) → `Promise<JourneyStepRecipientsResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/steps/:stepId/recipients Returns recipient IDs for a given journey step. For completed/pending, `interactionId` is required; outcome defaults to 'success'.

**funnelReport**(collectionId: string,
    journeyId: string,
    body: JourneyFunnelReportRequest) → `Promise<JourneyFunnelReportResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/funnel-report Computes conversion, counts, and avg time across mapped steps in a period.

### location

**createGlobal**(params: LocationPayload) → `Promise<Location>`
Platform: Create a global location (super admin; requires features.adminApps) POST /platform/location

**create**(collectionId: string, params: LocationPayload) → `Promise<Location>`
Admin: Create a collection-scoped location POST /admin/collection/:collectionId/location

**search**(collectionId: string,
    query: LocationSearchQuery = {}) → `Promise<LocationSearchResponse>`
Admin: Search locations to pick during setup (combines collection + global) GET /admin/collection/:collectionId/location/search

**getPublic**(locationId: string) → `Promise<Location>`
Public: Fetch a global location by ID GET /public/location/:locationId

**getPublicForCollection**(collectionId: string,
    locationId: string) → `Promise<Location>`
Public: Fetch a location for a collection; returns either a collection-owned or global fallback GET /public/collection/:collectionId/location/:locationId

### nfc

**claimTag**(data: NfcClaimTagRequest) → `Promise<NfcTagInfo>`
Claim an NFC tag (public). POST /public/nfc/claimTag

**validate**(data: NfcValidateRequest) → `Promise<NfcValidateResponse>`
Validate an NFC tag payload (public). POST /public/nfc/validate

**lookupTag**(tagId: string) → `Promise<NfcTagInfo[]>`
Lookup a tag by its ID (public). GET /public/nfc/findByTag/:tagId

### product

**get**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<ProductResponse>`
Retrieves a single Product Item by Collection ID and Product ID.

**list**(collectionId: string,
    admin?: boolean) → `Promise<ProductResponse[]>`
List all Product Items for a Collection.

**create**(collectionId: string,
    data: ProductCreateRequest) → `Promise<ProductResponse>`
Create a new product for a collection (admin only). The `data` payload follows the same shape as ProductResponse minus `id` and `collectionId`.

**update**(collectionId: string,
    productId: string,
    data: ProductUpdateRequest) → `Promise<ProductResponse>`
Update a product for a collection (admin only). The `data` payload is a partial of ProductResponse minus `id` and `collectionId`.

**remove**(collectionId: string,
    productId: string) → `Promise<void>`
Delete a product for a collection (admin only).

**getSN**(collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a product (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a product (admin only).

### proof

**get**(collectionId: string,
    productId: string,
    proofId: string,
    admin?: boolean,
    include?: string[]) → `Promise<ProofResponse>`
Retrieves a single Proof by Collection ID, Product ID, and Proof ID. Both public and admin endpoints now include productId in the path.

**list**(collectionId: string,
    include?: string[]) → `Promise<ProofResponse[]>`
List all Proofs for a Collection.

**create**(collectionId: string,
    productId: string,
    values: ProofCreateRequest) → `Promise<ProofResponse>`
Create a proof for a product (admin only). POST /admin/collection/:collectionId/product/:productId/proof

**update**(collectionId: string,
    productId: string,
    proofId: string,
    values: ProofUpdateRequest) → `Promise<ProofResponse>`
Update a proof for a product (admin only). PUT /admin/collection/:collectionId/product/:productId/proof/:proofId

**claim**(collectionId: string,
    productId: string,
    proofId: string,
    values: ProofClaimRequest) → `Promise<ProofResponse>`
Claim a proof for a product. PUT /public/collection/:collectionId/product/:productId/proof/:proofId

**remove**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<void>`
Delete a proof for a product (admin only). DELETE /admin/collection/:collectionId/product/:productId/proof/:proofId

**getByUser**(collectionId: string,
    userId: string) → `Promise<ProofResponse[]>`
Get proofs for a user in a collection (admin only). GET /admin/collection/:collectionId/proof/findByUser/:userId

**getByProduct**(collectionId: string,
    productId: string) → `Promise<ProofResponse[]>`
Get proofs for a product (admin only). GET /admin/collection/:collectionId/product/:productId/proof

**findByProduct**(collectionId: string,
    productId: string,
    query: any) → `Promise<ProofResponse[]>`
Find proofs for a product (admin only). POST /admin/collection/:collectionId/product/:productId/proof/find

**getByBatch**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<ProofResponse[]>`
Get proofs for a batch (admin only). GET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof

### qr

**lookupShortCode**(shortId: string, code: string) → `Promise<QrShortCodeLookupResponse>`
Resolve a short code to related resource identifiers.

### segments

**create**(collectionId: string,
    body: Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>) → `Promise<SegmentRecord>`

**list**(collectionId: string,
    query: ListSegmentsQuery = {}) → `Promise<SegmentList>`

**get**(collectionId: string,
    id: string) → `Promise<SegmentRecord>`

**update**(collectionId: string,
    id: string,
    body: Partial<Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>>) → `Promise<SegmentRecord>`

**remove**(collectionId: string,
    id: string) → `Promise<void>`

**calculate**(collectionId: string,
    id: string) → `Promise<SegmentCalculateResult>`

**recipients**(collectionId: string,
    id: string,
    query: { limit?: number; offset?: number } = {}) → `Promise<SegmentRecipientsResponse>`

### template

**getAll**(collectionId: string) → `Promise<Template[]>`

**get**(collectionId: string, templateId: string) → `Promise<Template>`

**create**(collectionId: string, data: TemplateInput) → `Promise<Template>`

**update**(collectionId: string,
    templateId: string,
    data: TemplateUpdate) → `Promise<Template>`

**del**(collectionId: string, templateId: string) → `Promise<Template>`

**uploadAsset**(collectionId: string,
    templateId: string,
    file: File | Blob) → `Promise<`

**getAllowed**(collectionId: string) → `Promise<TemplatePublic[]>`

**getPublic**(collectionId: string, templateId: string) → `Promise<TemplatePublic>`

**getGlobal**(templateId: string) → `Promise<TemplatePublic>`

**getAllowedGlobal**(collectionId: string) → `Promise<TemplatePublic[]>`

### variant

**get**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<VariantResponse[]>`
List all variants for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: VariantCreateRequest) → `Promise<VariantResponse>`
Create a new variant for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    variantId: string,
    data: VariantUpdateRequest) → `Promise<VariantResponse>`
Update a variant for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<void>`
Delete a variant for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    variantId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a variant (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    variantId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a variant (admin only).

