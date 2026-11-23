/** The EU registry's environments: `acc` = the EU test registry, `prod` = the live one, `local` = a development stand-in. */
export type DppEnvironment = "acc" | "prod" | "local" | (string & {});
/** How specific a passport is: one item (e.g. one battery), a batch, or a model. */
export type DppGranularity = "item" | "batch" | "model";
/** What the admin still has to do to connect a brand to the registry, in order (null = connected). */
export type DppRegistryNextStep = "make-key" | "enter-service-account" | "enter-organisation-id" | "check" | null;
/** A brand's EU registry Service Account, as SmartLinks uses it. Never includes the private key. */
export interface DppRegistry {
    environment: DppEnvironment;
    /** e.g. "EU test registry" */
    label: string;
    /** The registry's web address, where the brand enrols and manages its Service Account. */
    portal: string | null;
    /** The Service Account's Client ID, from the registry. */
    clientId: string | null;
    /** The key ID (kid) the registry gave our public key. */
    kid: string | null;
    /** ES256 | ES384 | ES512 */
    alg: string | null;
    /** The brand's verified Organisation ID (registry: Organisation > Verification), copied exactly. */
    orgIdentifier: string | null;
    hasKey: boolean;
    /** The public key to upload to the Service Account (PEM). */
    publicPem: string | null;
    /** The same public key as a JWK. */
    publicJwk: {
        kty: string;
        crv: string;
        x: string;
        y: string;
    } | null;
    /** RFC 7638 thumbprint of the public key. */
    thumbprint: string | null;
    keyCreatedAt: string | null;
    /** The last connection check: signed in and read the product groups, or why not. */
    lastCheck: {
        ok: boolean;
        at: string;
        message: string;
        status?: number | null;
    } | null;
    /** Key, Service Account and Organisation ID all set. */
    ready: boolean;
    nextStep: DppRegistryNextStep;
}
export interface SetDppRegistryInput {
    clientId?: string | null;
    kid?: string | null;
    orgIdentifier?: string | null;
}
/** A registry product group, from the registry itself. */
export interface DppRegistryProductGroup {
    code: string;
    label: string;
    productSubGroups: {
        code: string;
        label: string;
    }[];
}
export interface DppRegistryCheckResult {
    registry: DppRegistry;
    productGroups: DppRegistryProductGroup[];
}
/** Field names per view: `pub` (anyone) and the restricted views `res1`–`res3`. */
export interface DppViewFields {
    pub: string[];
    res1: string[];
    res2: string[];
    res3: string[];
}
/** What can be made: a product group, its kinds, and their fields (from the Commission's schemas). */
export interface DppGroup {
    /** e.g. "BATTERIES" */
    productGroup: string;
    /** e.g. "battery" */
    label: string;
    subGroups: {
        /** e.g. "EV" */
        productSubGroup: string;
        /** e.g. "electric vehicle" */
        label: string;
        /** Every field each view may carry. */
        fields: DppViewFields;
        /** The fields each view must carry. */
        required: DppViewFields;
    }[];
}
/** What a passport is still missing before the registry will take it. */
export interface DppPassportCheck {
    ready: boolean;
    missing: Partial<DppViewFields>;
    /** When the passport's classification itself is invalid. */
    problem?: string;
}
/** A passport's registration in one registry environment. */
export interface DppRegistration {
    /** processing → registered | rejected | not-sent (another item in the same request failed) | error */
    status: "processing" | "registered" | "rejected" | "not-sent" | "error";
    taskId?: string;
    submittedAt?: string;
    correlationId?: string | null;
    /** The registry's unique registration identifier, once registered. */
    registryId?: string | null;
    registeredAt?: string;
    problems?: {
        code: string;
        message: string;
    }[] | null;
    checkedAt?: string;
}
/** Fields of a passport, named as in the Commission's schemas (e.g. batteryChemistry, manufacturerIdentification). */
export type DppFields = Record<string, unknown>;
export interface DppPassport {
    id: string;
    /** Its address — the unique product identifier registered with the EU. */
    url: string;
    status: "active" | "withdrawn";
    productGroup: string;
    productSubGroup: string | null;
    granularity: DppGranularity;
    modelIdentifier: string | null;
    batchIdentifier: string | null;
    /** What it's for. */
    productId: string | null;
    batchId: string | null;
    proofId: string | null;
    /** The public view: anyone reading the passport sees these. */
    public: DppFields;
    /** The restricted views (res1–res3): served only to the EU registry for this brand. */
    restricted: DppFields;
    /** Goes up by one each time what it says changes. */
    version: number;
    contentUpdatedAt: string | null;
    /** By registry environment. */
    registration: Partial<Record<DppEnvironment, DppRegistration>>;
    check: DppPassportCheck;
    createdAt: string;
    updatedAt: string;
}
/** A passport's content. productGroup and (for batteries) productSubGroup are required when making one. */
export interface DppPassportInput {
    productGroup?: string;
    productSubGroup?: string | null;
    granularity?: DppGranularity;
    modelIdentifier?: string | null;
    batchIdentifier?: string | null;
    productId?: string | null;
    batchId?: string | null;
    proofId?: string | null;
    public?: DppFields | null;
    restricted?: DppFields | null;
}
/** A passport saved by what it's for: at least one of productId, batchId, proofId. */
export interface DppPassportUpsertInput extends DppPassportInput {
    productGroup: string;
    granularity: DppGranularity;
}
export interface DppPassportSaveResult {
    passport: DppPassport;
    /** false when the content was the same as before (no new version). */
    changed: boolean;
}
export interface DppPassportUpsertResult extends DppPassportSaveResult {
    created: boolean;
}
export interface DppPassportBulkResult {
    results: ({
        index: number;
        ok: true;
        id: string;
        url: string;
        created: boolean;
        changed: boolean;
        version: number;
        check: DppPassportCheck;
    } | {
        index: number;
        ok: false;
        errorCode: string;
        errorText: string;
    })[];
    created: number;
    changed: number;
    unchanged: number;
    failed: number;
}
export interface DppPassportVersion {
    version: number;
    savedAt: string;
    savedBy: string | null;
}
export interface DppPassportListQuery {
    productId?: string;
    batchId?: string;
    proofId?: string;
    status?: "active" | "withdrawn";
    limit?: number;
    offset?: number;
}
export interface DppRegisterResult {
    /** One registry request per product group (and kind), up to 100 passports each. */
    tasks: {
        taskId: string;
        environment: DppEnvironment;
        productGroup: string;
        productSubGroup: string | null;
        passportIds: string[];
        /** ISO 8601 duration the registry estimated, e.g. "PT10S". */
        estimated: string | null;
        /** With `wait`: the outcome. */
        status?: string;
        outcome?: DppTaskOutcome | null;
        passports?: ({
            id: string;
        } & Partial<DppRegistration>)[];
    }[];
    /** Not sent, and why (not found, withdrawn, already registered, missing required fields). */
    skipped: {
        id: string;
        reason: string;
        missing?: Partial<DppViewFields>;
        registryId?: string;
    }[];
}
export interface DppTaskOutcome {
    outcomeResult: "SUCCEEDED" | "FAILED";
    outcomeMessage?: {
        code: string;
        message: string;
    };
}
export interface DppTask {
    taskId: string;
    environment: DppEnvironment;
    /** PENDING | PROCESSING | COMPLETED | ERROR */
    status: string | null;
    outcome: DppTaskOutcome | null;
    passportIds: string[];
    createdAt: string;
    checkedAt: string | null;
}
export interface DppTaskRefreshResult {
    taskId: string;
    status: string | null;
    outcome: DppTaskOutcome | null;
    processingInfo: {
        submittedItems: number;
        compliantItems: number;
        nonCompliantItems: number;
    } | null;
    passports: ({
        id: string;
    } & Partial<DppRegistration>)[];
}
/** A passport document as served at its address, in the EU's JSON format. */
export interface DppDocument {
    digitalProductPassportId: string;
    uniqueProductIdentifier: string;
    granularity: string;
    dppStatus: string;
    lastUpdate: string;
    contentSpecificationIds: string[];
    [field: string]: unknown;
}
