export interface TemplateBase {
    id: string;
    collectionId: string;
    name: string;
    description?: string;
    type: string;
    resizeMode?: string;
    pdf?: {
        base: {
            url: string;
        };
        orientation: 'portrait' | 'landscape';
    };
    subject?: string;
    body?: string;
    css?: string;
    public?: boolean;
    engine?: string;
    component?: string;
    defaultProps?: Record<string, any>;
    collections?: string[];
    [k: string]: any;
}
export interface Template extends TemplateBase {
    deleted?: boolean;
    deletedAt?: string;
}
export type TemplateInput = Omit<TemplateBase, 'id' | 'collectionId'>;
export type TemplateUpdate = Partial<Omit<TemplateBase, 'id' | 'collectionId'>>;
export type TemplatePublic = TemplateBase;
