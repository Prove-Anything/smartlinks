export interface AttestationResponse {
  id: string
  proofId: string
  createdAt: string
  updatedAt: string
  type: string
  data: Record<string, any>
}

export interface AttestationCreateRequest {
  type: string
  data: Record<string, any>
}

export interface AttestationUpdateRequest {
  type?: string
  data?: Record<string, any>
}
