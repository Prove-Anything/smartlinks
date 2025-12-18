// src/types/journeys.ts

export interface JourneyRecord {
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

export interface JourneyList {
  items: JourneyRecord[]
  limit: number
  offset: number
}

// Query and body helper types used inline by API signatures
export interface ListJourneysQuery {
  appId?: string
  active?: boolean
  journeyType?: 'event_triggered' | 'scheduled'
  limit?: number
  offset?: number
}

export interface CreateJourneyBody {
  appId?: string
  name: string
  active?: boolean
  journeyType: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}

export interface UpdateJourneyBody {
  appId?: string
  name?: string
  active?: boolean
  journeyType?: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}
