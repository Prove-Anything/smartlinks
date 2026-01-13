export interface TemplateBase {
    id: string;
    collectionId: string;
    name: string;
    description?: string;
    type: 'pdf' | 'email' | 'multichannel' | 'label';
    resizeMode?: string;
    pdf?: {
        base: {
            url: string;
        };
        orientation: 'portrait' | 'landscape';
    };
    channels?: {
        email?: {
            subject: string;
            body: string;
        };
        sms?: {
            body: string;
        };
        push: {
            title: string;
            body: string;
            url?: string;
            iconUrl?: string;
        };
        wallet?: {
            header: string;
            body: string;
            imageUri?: string;
        };
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
export interface TemplateRenderRequest {
    props: Record<string, any>;
}
export interface TemplateRenderResponse {
    ok: boolean;
    html: string;
}
export interface TemplateRenderSourceRequest {
    engine: 'liquid';
    source: string;
    props?: Record<string, any>;
    component?: string;
}
export interface TemplateRenderSourceResponse {
    ok: boolean;
    html: string;
}
