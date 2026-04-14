/** Accepted input widget types for a FieldDefinition. */
export type FieldType = 'text' | 'email' | 'url' | 'textarea' | 'number' | 'select' | 'switch' | 'checkbox' | 'date' | 'json' | 'image-upload' | 'file-upload';
/** A label/value pair used when FieldDefinition.type === 'select'. */
export interface FieldOption {
    label: string;
    value: string;
}
/**
 * A single entry in the platform field catalog.
 * Fields are referenced by their `id` inside ProofTypeDefinition.groupFields / proofFields arrays.
 */
export interface FieldDefinition {
    /** Unique identifier, kebab-case. Auto-generated from `label` if omitted on create. */
    id: string;
    /** Human-readable display label shown in forms. */
    label: string;
    /** Key used when storing the value on the product/proof document. Defaults to `id`. */
    storageKey?: string;
    /** Input widget type. */
    type: FieldType;
    /** Available choices — only relevant when type === 'select'. */
    options?: FieldOption[];
    /** Whether the field must be filled in. */
    required?: boolean;
    /** Column span (1–12) in a 12-column grid. */
    col?: number;
    /** Placeholder text shown inside the input. */
    placeholder?: string;
    /** Descriptive hint shown below the input. */
    help?: string;
    /** Numeric minimum — only relevant when type === 'number'. */
    min?: number;
    /** Numeric maximum — only relevant when type === 'number'. */
    max?: number;
    /** Step increment — only relevant when type === 'number'. */
    step?: number;
    /** Number of visible rows — only relevant when type === 'textarea' or 'json'. */
    rows?: number;
    /** Auto-grow textarea height — only relevant when type === 'textarea'. */
    autoGrow?: boolean;
    /** Accept filter passed to the file input — only relevant when type === 'image-upload' or 'file-upload'. Examples: 'image/*', '.glb,.gltf,.fbx' */
    accept?: string;
    /** Whether the input has a clear (×) button (text/number fields). Default true. */
    clearable?: boolean;
    /** Disable this field regardless of model state. */
    disabled?: boolean;
    /**
     * Conditional visibility. If absent the field is always shown.
     * Object form: `{ field: 'someKey', equals: 'someValue' }` — show when `model[field] === equals`.
     */
    showIf?: {
        field: string;
        equals: unknown;
    };
}
/**
 * The base proof mechanism that items in a proof type use.
 * Matches the `proofType` / `proofTypes` values stored on product documents.
 */
export type ProofMechanism = 'certificate' | 'ownable' | 'consumable' | 'timeline' | 'docent' | 'connected' | 'text' | 'image' | 'video';
/**
 * A proof type defines a template for creating products.
 * It specifies which fields to show, which apps are pre-installed,
 * and how the portal should behave.
 */
export interface ProofTypeDefinition {
    /** Unique identifier, kebab-case. Auto-generated from `name` if omitted on create. */
    id: string;
    /** Human-readable name shown in product-creation wizards. */
    name: string;
    /** Long description shown in the proof type picker UI. */
    description?: string;
    /**
     * Grouping used to organise proof types in the picker.
     * Examples: 'basic', 'retail', 'ownable', 'consumable', 'attendance',
     * 'qualification', 'creative', 'memories', 'safety', 'connected',
     * 'smartdocent', 'tradable'
     */
    category?: string;
    /**
     * Whether this proof type is shown to users.
     * Only types with `active === true` are returned to the public API
     * when the platform admin has filtered by "Only Active".
     */
    active?: boolean;
    /** Whether this proof type produces a group of items (true) or a single item (false). */
    group: boolean;
    /**
     * The underlying proof mechanisms that products of this type can use.
     * Stored as `proofTypes` (plural) on the product document.
     */
    proofTypes?: ProofMechanism[];
    /** Legacy single-value equivalent of proofTypes. */
    proofType?: ProofMechanism;
    /**
     * Field IDs (from the field catalog) shown when creating/editing the product group.
     * Ordered — rendered in this sequence.
     */
    groupFields?: string[];
    /**
     * Field IDs shown when creating/editing an individual proof item within the group.
     * If absent, falls back to groupFields.
     */
    proofFields?: string[];
    /**
     * Column definitions shown in the proof list view.
     * Keys are field IDs; value true means show the column.
     */
    listFields?: Record<string, boolean>;
    /**
     * App uniqueNames automatically installed (for free) when this proof type is selected.
     */
    freeApps?: string[];
    /**
     * App uniqueNames shown as recommended paid add-ons for this proof type.
     */
    apps?: string[];
    /** Collection-level slug that this proof type is scoped to (legacy, rarely used). */
    collection?: string;
    /** Action name used by the legacy proof action pipeline. */
    action?: string;
    /** Whether items are soul-bound (non-transferable by default). */
    bound?: 'soul';
    /**
     * UI translation overrides for this proof type.
     * Keys are source English words; values are replacement strings.
     * Example: `{ "Products": "Works" }`
     */
    translations?: Record<string, string>;
    /** Whether product tools (edit, duplicate, etc.) are hidden in the console UI. */
    hideProductTools?: boolean;
}
