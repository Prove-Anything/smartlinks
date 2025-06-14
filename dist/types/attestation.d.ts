export interface AttestationResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    public: Record<string, any>;
    private: Record<string, any>;
    proof: Record<string, any>;
}
export interface AttestationCreateRequest {
    public: Record<string, any>;
    private: Record<string, any>;
    proof: Record<string, any>;
}
export interface AttestationUpdateRequest {
    type?: string;
    data?: Record<string, any>;
}
